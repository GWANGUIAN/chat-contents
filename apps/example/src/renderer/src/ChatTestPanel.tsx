import type { ChatStreamStatus } from '@chat-contents/chat-client'
import { useChatStream } from '@chat-contents/chat-client'
import { Button, Panel, TextInput, Wifi, WifiOff } from '@chat-contents/ui'
import { useState } from 'react'

export interface ChatTestPanelProps {
  baseUrl: string | null
}

const STATUS_LABEL: Record<ChatStreamStatus, string> = {
  idle: '연동 대기 중',
  connecting: '연결 중…',
  connected: '연결됨',
  error: '연결 실패',
}

export function ChatTestPanel({ baseUrl }: ChatTestPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const [channelId, setChannelId] = useState<string | null>(null)
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
        {status === 'connected' ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span>
          {STATUS_LABEL[status]}
          {error ? ` — ${error}` : ''}
        </span>
      </div>

      <ul className="chat-test-panel__messages">
        {messages.map((message, index) => (
          <li
            key={`${message.at}-${index}`}
            className={`chat-test-panel__message chat-test-panel__message--${message.type}`}
          >
            {message.type === 'message' && (
              <>
                <strong>{message.user.nickname}</strong>
                <span>{message.text}</span>
              </>
            )}
            {message.type === 'donation' && (
              <span>
                🎁 {message.user.nickname}님이 {message.amount} 별풍선을 후원했습니다.
              </span>
            )}
            {message.type === 'subscription' && (
              <span>⭐ {message.user.nickname}님이 구독했습니다.</span>
            )}
            {message.type === 'system' && <span>{message.text}</span>}
          </li>
        ))}
      </ul>
    </Panel>
  )
}
