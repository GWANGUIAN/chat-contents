import type { ChatStreamStatus } from '@chat-contents/chat-client'
import { Button, TextInput } from '@chat-contents/ui'
import { useState } from 'react'

export interface ChannelGateProps {
  status: ChatStreamStatus
  error: string | null
  baseUrlReady: boolean
  onConnect: (channelId: string) => void
}

/** 룰렛 화면에 들어가기 전, 숲(SOOP) 채널 ID를 미리 받는 관문 화면. */
export function ChannelGate({ status, error, baseUrlReady, onConnect }: ChannelGateProps) {
  const [value, setValue] = useState('')
  const connecting = status === 'connecting'

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) onConnect(trimmed)
  }

  return (
    <div className="channel-gate">
      <p className="channel-gate__label">숲(SOOP) 채널 ID를 입력하세요</p>
      <div className="channel-gate__row">
        <TextInput
          placeholder="채널 ID"
          value={value}
          disabled={connecting}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSubmit()
          }}
        />
        <Button onClick={handleSubmit} disabled={!baseUrlReady || connecting}>
          {connecting ? '연결 중…' : '입장'}
        </Button>
      </div>
      {error ? <p className="channel-gate__error">{error}</p> : null}
    </div>
  )
}
