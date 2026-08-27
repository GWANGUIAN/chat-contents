import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { isPlatform } from './chat-types'
import { corsHeaders, resolveCorsOrigin } from './cors'
import { acquireChatClient } from './hub'
import { createChatSseResponse, parseChatSseSearchParams } from './sse'

const STREAM_PATH = /^\/api\/chat\/([^/]+)\/stream\/?$/

function writeJson(
  res: ServerResponse,
  status: number,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): void {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    ...extraHeaders,
  })
  res.end(payload)
}

async function pipeWebResponse(
  web: Response,
  res: ServerResponse,
  extraHeaders: Record<string, string>,
): Promise<void> {
  const headers: Record<string, string> = { ...extraHeaders }
  web.headers.forEach((value, key) => {
    headers[key] = value
  })
  res.writeHead(web.status, headers)

  if (!web.body) {
    res.end()
    return
  }

  const reader = web.body.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        if (!res.write(Buffer.from(value))) {
          await new Promise<void>((resolve) => res.once('drain', resolve))
        }
      }
    }
    res.end()
  } catch (error) {
    reader.cancel().catch(() => {})
    if (!res.writableEnded) {
      res.destroy(error instanceof Error ? error : undefined)
    }
  }
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const origin = resolveCorsOrigin(req.headers.origin)
  const cors = corsHeaders(origin)
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { ...cors, 'access-control-max-age': '86400' })
    res.end()
    return
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', ...cors })
    res.end('ok')
    return
  }

  const match = STREAM_PATH.exec(url.pathname)
  if (req.method === 'GET' && match) {
    const platformRaw = match[1] ?? ''
    if (!isPlatform(platformRaw)) {
      writeJson(res, 400, { error: `지원하지 않는 플랫폼: ${platformRaw}` }, cors)
      return
    }

    const { channelId, types, messagePrefixes } = parseChatSseSearchParams(url.searchParams)
    if (!channelId) {
      writeJson(res, 400, { error: 'channelId가 필요합니다.' }, cors)
      return
    }

    const ac = new AbortController()
    const onClose = () => ac.abort()
    req.once('close', onClose)

    let release: (() => void) | undefined
    try {
      const acquired = await acquireChatClient(channelId)
      release = acquired.release

      const web = createChatSseResponse({
        platform: platformRaw,
        channelId,
        client: acquired.client,
        types,
        messagePrefixes,
        signal: ac.signal,
      })
      await pipeWebResponse(web, res, cors)
    } finally {
      req.off('close', onClose)
      release?.()
    }
    return
  }

  writeJson(res, 404, { error: 'not found' }, cors)
}

export interface ChatProxyServerOptions {
  /** 항상 로컬호스트 바인딩을 권장합니다. 기본값 '127.0.0.1'. */
  host?: string
  /** 기본 0(OS가 빈 포트를 골라줍니다) — 여러 앱이 동시에 떠도 충돌하지 않습니다. */
  port?: number
}

export interface ChatProxyServerHandle {
  readonly port: number
  readonly url: string
  stop(): Promise<void>
}

/** 임베디드 SOOP 채팅 프록시 서버를 시작합니다. Electron main 프로세스에서 직접 호출하세요. */
export function startChatProxyServer(
  options: ChatProxyServerOptions = {},
): Promise<ChatProxyServerHandle> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      void handleRequest(req, res).catch((error) => {
        console.error('[chat-proxy]', error)
        if (!res.headersSent) {
          writeJson(res, 500, { error: 'internal error' })
        } else if (!res.writableEnded) {
          res.destroy()
        }
      })
    })

    server.once('error', reject)
    server.listen(options.port ?? 0, options.host ?? '127.0.0.1', () => {
      server.off('error', reject)
      const address = server.address() as AddressInfo
      resolve({
        port: address.port,
        url: `http://127.0.0.1:${address.port}`,
        stop: () =>
          new Promise<void>((resolveStop) => {
            server.close(() => resolveStop())
          }),
      })
    })
  })
}
