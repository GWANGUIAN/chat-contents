import type { ChatSseHelloEvent, ChatSsePayload } from '@chat-contents/chat-proxy'

export interface SubscribeChatSseOptions {
  url: string
  onEvent: (event: ChatSsePayload) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  /** EventSource 구현 주입(테스트용). 기본 globalThis.EventSource */
  EventSourceImpl?: typeof EventSource
}

export interface ChatSseSubscription {
  close(): void
  readonly readyState: number
}

/**
 * 로컬 chat-proxy 서버의 채팅 SSE를 구독합니다.
 * URL은 `http://127.0.0.1:<port>/api/chat/soop/stream?channelId=...` 형태입니다.
 */
export function subscribeChatSse(options: SubscribeChatSseOptions): ChatSseSubscription {
  const Impl = options.EventSourceImpl ?? globalThis.EventSource
  if (!Impl) {
    throw new Error('EventSource를 사용할 수 없습니다. 렌더러(브라우저) 환경에서 호출하세요.')
  }

  const source = new Impl(options.url)

  source.onopen = () => options.onOpen?.()
  source.onerror = (error) => options.onError?.(error)
  source.onmessage = (message) => {
    try {
      const event = JSON.parse(message.data) as ChatSsePayload
      options.onEvent(event)
    } catch {
      // malformed frame
    }
  }

  return {
    close: () => source.close(),
    get readyState() {
      return source.readyState
    },
  }
}

export interface ChatSseUrlOptions {
  types?: string[]
  prefixes?: string[]
}

export function chatSseUrl(
  baseUrl: string,
  channelId: string,
  options?: ChatSseUrlOptions,
): string {
  const root = baseUrl.replace(/\/$/, '')
  const qs = new URLSearchParams()
  qs.set('channelId', channelId)
  if (options?.types && options.types.length > 0) {
    qs.set('types', options.types.join(','))
  }
  for (const prefix of options?.prefixes ?? []) {
    const trimmed = prefix.trim()
    if (trimmed) qs.append('prefix', trimmed)
  }
  return `${root}/api/chat/soop/stream?${qs.toString()}`
}

export function isChatHelloEvent(event: ChatSsePayload): event is ChatSseHelloEvent {
  return event.type === 'hello'
}
