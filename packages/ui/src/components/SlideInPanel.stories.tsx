import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Button } from './Button'
import { Dropdown } from './Dropdown'
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

const RESOLUTION_OPTIONS = [
  { value: '1280x720', label: '1280 x 720' },
  { value: '1600x900', label: '1600 x 900' },
  { value: '1920x1080', label: '1920 x 1080' },
]

export const WithDropdown: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [resolution, setResolution] = useState('1600x900')
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div style={{ position: 'relative', height: 360 }}>
        <Button ref={triggerRef} onClick={() => setOpen((prev) => !prev)}>
          토글
        </Button>
        <SlideInPanel
          open={open}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
          title="설정"
        >
          {/* Dropdown은 Radix Portal로 옵션 목록을 body에 렌더링합니다. 옵션을
              고를 때 SlideInPanel이 "바깥 클릭"으로 오인해 먼저 닫혀버리지
              않아야 합니다(패널이 열린 채로 유지되어야 정상). */}
          <Dropdown
            aria-label="해상도"
            options={RESOLUTION_OPTIONS}
            value={resolution}
            onValueChange={setResolution}
          />
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
