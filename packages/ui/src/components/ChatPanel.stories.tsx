import type { Meta, StoryObj } from '@storybook/react-vite'
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
