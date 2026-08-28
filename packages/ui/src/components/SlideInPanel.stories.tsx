import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Button } from './Button'
import { SlideInPanel } from './SlideInPanel'

const meta: Meta<typeof SlideInPanel> = {
  title: 'Components/SlideInPanel',
  component: SlideInPanel,
}

export default meta

type Story = StoryObj<typeof SlideInPanel>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div style={{ position: 'relative', height: 320 }}>
        <Button ref={triggerRef} onClick={() => setOpen((prev) => !prev)}>
          토글
        </Button>
        <SlideInPanel
          open={open}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
          title="설정"
        >
          <p style={{ margin: 0 }}>패널 내용이 여기 들어갑니다.</p>
        </SlideInPanel>
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div style={{ position: 'relative', height: 320 }}>
        <Button ref={triggerRef} onClick={() => setOpen((prev) => !prev)}>
          토글
        </Button>
        <SlideInPanel
          open={open}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
          title="설정"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ margin: 0 }}>
              긴 내용으로 스크롤 확인용 항목 {i + 1}
            </p>
          ))}
        </SlideInPanel>
      </div>
    )
  },
}
