import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { ToastProvider, useToast } from './Toast'

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
}

export default meta

type Story = StoryObj<typeof ToastProvider>

function Demo() {
  const { showToast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        onClick={() =>
          showToast({ title: '새 후원', description: '홍길동님이 10,000원을 후원했습니다.' })
        }
      >
        기본 토스트
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          showToast({
            title: '연동 완료',
            description: '채팅 연동에 성공했습니다.',
            variant: 'success',
          })
        }
      >
        성공 토스트
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          showToast({
            title: '연동 실패',
            description: '채널을 찾을 수 없습니다.',
            variant: 'danger',
          })
        }
      >
        실패 토스트
      </Button>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
}
