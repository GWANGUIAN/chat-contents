import type { ChatEvent } from '@chat-contents/chat-proxy'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type ChatSseSubscription,
  chatSseUrl,
  isChatHelloEvent,
  subscribeChatSse,
} from './sse-client'

export type ChatStreamStatus = 'idle' | 'connecting' | 'connected' | 'error'

const DEFAULT_MAX_MESSAGES = 200

export interface UseChatStreamOptions {
  /** chat-proxy 서버 base URL, 예: http://127.0.0.1:54213 (window.api.chatProxy.getPort()로 얻음). */
  baseUrl: string | null
  /** 빈 문자열/null이면 연결하지 않습니다. */
  channelId: string | null
  /** 표시할 메시지 개수 상한(ring buffer). 기본 200. */
  maxMessages?: number
}

export interface UseChatStreamResult {
  status: ChatStreamStatus
  error: string | null
  messages: ChatEvent[]
}

export function useChatStream(options: UseChatStreamOptions): UseChatStreamResult {
  const { baseUrl, channelId, maxMessages = DEFAULT_MAX_MESSAGES } = options
  const [status, setStatus] = useState<ChatStreamStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatEvent[]>([])
  const subscriptionRef = useRef<ChatSseSubscription | null>(null)

  const appendMessage = useCallback(
    (event: ChatEvent) => {
      setMessages((prev) => {
        const next = [...prev, event]
        return next.length > maxMessages ? next.slice(next.length - maxMessages) : next
      })
    },
    [maxMessages],
  )

  useEffect(() => {
    subscriptionRef.current?.close()
    subscriptionRef.current = null

    if (!baseUrl || !channelId) {
      setStatus('idle')
      setError(null)
      setMessages([])
      return
    }

    setStatus('connecting')
    setError(null)
    setMessages([])

    const subscription = subscribeChatSse({
      url: chatSseUrl(baseUrl, channelId),
      onEvent: (event) => {
        if (isChatHelloEvent(event)) {
          setStatus('connected')
          return
        }
        if (event.type === 'status' && event.status === 'error') {
          setStatus('error')
          setError(event.text ?? '연결 오류')
          return
        }
        appendMessage(event)
      },
      onError: () => {
        setStatus('error')
        setError('채팅 서버에 연결할 수 없습니다.')
      },
    })
    subscriptionRef.current = subscription

    return () => {
      subscription.close()
      subscriptionRef.current = null
    }
  }, [baseUrl, channelId, appendMessage])

  return { status, error, messages }
}
