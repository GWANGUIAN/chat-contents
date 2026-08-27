import type { ChatClient, ChatEvent, Platform } from './chat-types'

export function encodeSseData(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`
}

export const SSE_RESPONSE_HEADERS = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
} as const

export interface ChatSseHelloEvent {
  type: 'hello'
  platform: Platform
  channelId: string
}

export type ChatSsePayload = ChatEvent | ChatSseHelloEvent

export interface ParsedChatSseQuery {
  channelId: string
  types?: string[]
  messagePrefixes?: string[]
}

/** SSE URL 쿼리에서 channelId / types / prefix(es)를 읽습니다. */
export function parseChatSseSearchParams(params: URLSearchParams): ParsedChatSseQuery {
  const channelId = params.get('channelId')?.trim() ?? ''
  const typesRaw = params.get('types')?.trim()
  const types = typesRaw
    ? typesRaw
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    : undefined

  const fromRepeated = params
    .getAll('prefix')
    .map((part) => part.trim())
    .filter(Boolean)
  const fromCsv =
    params
      .get('prefixes')
      ?.split(',')
      .map((part) => part.trim())
      .filter(Boolean) ?? []
  const messagePrefixes = [...fromRepeated, ...fromCsv]
  const uniquePrefixes = [...new Set(messagePrefixes)]

  return {
    channelId,
    types: types?.length ? types : undefined,
    messagePrefixes: uniquePrefixes.length ? uniquePrefixes : undefined,
  }
}

/** 단위 테스트·프록시에서 재사용하는 이벤트 전달 여부 판정. */
export function shouldForwardChatEvent(
  event: ChatEvent,
  options: Pick<ParsedChatSseQuery, 'types' | 'messagePrefixes'>,
): boolean {
  if (options.types && options.types.length > 0 && !options.types.includes(event.type)) {
    return false
  }

  if (event.type !== 'message') return true

  const prefixes = options.messagePrefixes
  if (!prefixes || prefixes.length === 0) return true

  const text = event.text.trim().toLowerCase()
  return prefixes.some((prefix) => {
    const needle = prefix.trim().toLowerCase()
    return needle.length > 0 && text.startsWith(needle)
  })
}

export interface CreateChatSseOptions extends ParsedChatSseQuery {
  platform: Platform
  client: ChatClient
  signal?: AbortSignal
}

/**
 * 이미 연결된(hub가 소유한) ChatClient의 이벤트를 SSE Response로 반환합니다.
 * 연결/해제는 hub가 관리하므로 여기서는 구독만 합니다.
 */
export function createChatSseResponse(options: CreateChatSseOptions): Response {
  const channelId = options.channelId.trim()
  if (!channelId) {
    return new Response(JSON.stringify({ error: 'channelId가 필요합니다.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()
  let closed = false
  let detachHandler: (() => void) | undefined

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (payload: ChatSsePayload) => {
        if (closed) return
        controller.enqueue(encoder.encode(encodeSseData(payload)))
      }

      send({ type: 'hello', platform: options.platform, channelId })

      detachHandler = options.client.on((event) => {
        if (!shouldForwardChatEvent(event, options)) return
        send(event)
      })

      const close = () => {
        if (closed) return
        closed = true
        detachHandler?.()
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      options.signal?.addEventListener('abort', close)
    },
    cancel() {
      closed = true
      detachHandler?.()
    },
  })

  return new Response(stream, { headers: { ...SSE_RESPONSE_HEADERS } })
}
