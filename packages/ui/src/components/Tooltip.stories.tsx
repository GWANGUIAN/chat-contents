import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <div style={{ padding: 60 }}>
      <Tooltip content="채널 ID는 SOOP 방송국 주소의 마지막 부분입니다.">
        <Button>채널 ID란?</Button>
      </Tooltip>
    </div>
  ),
}

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, padding: 80 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`${side} 방향 툴팁`} side={side}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}
