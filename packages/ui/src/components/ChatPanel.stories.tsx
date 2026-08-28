import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Button } from './Button'
import { ChatMessage } from './ChatMessage'
import { ChatPanel } from './ChatPanel'

const meta: Meta<typeof ChatPanel> = {
  title: 'Components/ChatPanel',
  component: ChatPanel,
}

export default meta

type Story = StoryObj<typeof ChatPanel>

const SAMPLE_NICKNAMES = [
  '구독왕고양이',
  '방송보다감',
  '초코칩',
  '고구마맛탕',
  '전설의고자',
  '무지개곰',
  '킹받는냥이',
]

export const Default: Story = {
  render: () => (
    <div style={{ width: 340 }}>
      <ChatPanel>
        {SAMPLE_NICKNAMES.map((nickname, i) => (
          <ChatMessage key={nickname} nickname={nickname}>
            채팅 테스트 메시지 {i + 1}번째입니다.
          </ChatMessage>
        ))}
        <ChatMessage>🎁 후원왕님이 별풍선 100개를 후원했습니다.</ChatMessage>
        <ChatMessage nickname="스트리머" colorMode="accent">
          시청해 주셔서 감사합니다!
        </ChatMessage>
      </ChatPanel>
    </div>
  ),
}

export const LongFeed: Story = {
  render: () => (
    <div style={{ width: 340 }}>
      <ChatPanel maxHeight={280}>
        {Array.from({ length: 30 }, (_, i) => (
          <ChatMessage key={i} nickname={SAMPLE_NICKNAMES[i % SAMPLE_NICKNAMES.length]}>
            연속 채팅 {i + 1} — 인접한 메시지끼리 닉네임 색이 겹치지 않는지 확인용
          </ChatMessage>
        ))}
      </ChatPanel>
    </div>
  ),
}

interface LiveMessage {
  id: number
  nickname: string
  text: string
}

export const LiveFeed: Story = {
  render: () => {
    const [messages, setMessages] = useState<LiveMessage[]>(() =>
      SAMPLE_NICKNAMES.slice(0, 3).map((nickname, i) => ({
        id: i,
        nickname,
        text: `초기 메시지 ${i + 1}`,
      })),
    )
    const nextId = useRef(messages.length)

    const addMessage = () => {
      const id = nextId.current
      nextId.current += 1
      const nickname = SAMPLE_NICKNAMES[id % SAMPLE_NICKNAMES.length] ?? '익명'
      setMessages((prev) => [...prev, { id, nickname, text: `새 메시지 ${id + 1}입니다` }])
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 340 }}>
        <Button onClick={addMessage}>새 메시지 추가</Button>
        {/* 위로 스크롤한 채 "새 메시지 추가"를 눌러보면 자동 스크롤이 멈추고
            플로팅 버튼이 뜹니다. 버튼을 누르면 맨 아래로 이동하며 자동 스크롤이
            다시 켜집니다. */}
        <ChatPanel maxHeight={280}>
          {messages.map((message) => (
            <ChatMessage key={message.id} nickname={message.nickname}>
              {message.text}
            </ChatMessage>
          ))}
        </ChatPanel>
      </div>
    )
  },
}
