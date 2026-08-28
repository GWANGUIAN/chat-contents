import type { ChatStreamStatus } from '@chat-contents/chat-client'
import { useChatStream } from '@chat-contents/chat-client'
import { Button, ChatMessage, ChatPanel, Panel, TextInput, Wifi, WifiOff } from '@chat-contents/ui'
import { useState } from 'react'

export interface ChatTestPanelProps {
  baseUrl: string | null
  /** 온보딩 등에서 미리 입력받은 채널 ID로 초기 연동. 없으면 null. */
  initialChannelId?: string | null
}

const STATUS_LABEL: Record<ChatStreamStatus, string> = {
  idle: '연동 대기 중',
  connecting: '연결 중…',
  connected: '연결됨',
  error: '연결 실패',
}

export function ChatTestPanel({ baseUrl, initialChannelId = null }: ChatTestPanelProps) {
  const [inputValue, setInputValue] = useState(initialChannelId ?? '')
  const [channelId, setChannelId] = useState<string | null>(initialChannelId)
  const { status, error, messages } = useChatStream({ baseUrl, channelId })

  const handleConnect = () => {
    const trimmed = inputValue.trim()
    if (trimmed) setChannelId(trimmed)
  }

  return (
    <Panel className="chat-test-panel">
      <div className="chat-test-panel__form">
        <TextInput
          placeholder="SOOP 채널 ID 입력"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleConnect()
          }}
        />
        <Button onClick={handleConnect} disabled={!baseUrl}>
          연동
        </Button>
      </div>

      <div className={`chat-test-panel__status chat-test-panel__status--${status}`}>
        {status === 'connected' ? <Wifi size={22} /> : <WifiOff size={22} />}
        <span>
          {STATUS_LABEL[status]}
          {error ? ` — ${error}` : ''}
        </span>
      </div>

      <ChatPanel maxHeight={320}>
        {messages.map((message, index) => {
          const key = `${message.at}-${index}`
          if (message.type === 'message') {
            return (
              <ChatMessage key={key} nickname={message.user.nickname}>
                {message.text}
              </ChatMessage>
            )
          }
          if (message.type === 'donation') {
            return (
              <ChatMessage key={key}>
                🎁 {message.user.nickname}님이 {message.amount} 별풍선을 후원했습니다.
              </ChatMessage>
            )
          }
          if (message.type === 'subscription') {
            return <ChatMessage key={key}>⭐ {message.user.nickname}님이 구독했습니다.</ChatMessage>
          }
          return <ChatMessage key={key}>{message.text}</ChatMessage>
        })}
      </ChatPanel>
    </Panel>
  )
}
