import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatMessage } from './ChatMessage'

const meta: Meta<typeof ChatMessage> = {
  title: 'Components/ChatMessage',
  component: ChatMessage,
}

export default meta

type Story = StoryObj<typeof ChatMessage>

export const Rainbow: Story = {
  render: () => <ChatMessage nickname="구독왕고양이">오늘도 재밌게 봤어요!</ChatMessage>,
}

export const AccentFixed: Story = {
  render: () => (
    <ChatMessage nickname="스트리머" colorMode="accent">
      공지: 잠시 후 방송 시작합니다.
    </ChatMessage>
  ),
}

export const Truncated: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <ChatMessage nickname="말이엄청많은사람" truncate>
        이건 한 줄을 넘어가는 아주 긴 채팅 메시지라서 말줄임표로 잘려야 합니다 진짜로요
      </ChatMessage>
    </div>
  ),
}

export const SystemLine: Story = {
  render: () => <ChatMessage>🎁 후원왕님이 별풍선 100개를 후원했습니다.</ChatMessage>,
}
