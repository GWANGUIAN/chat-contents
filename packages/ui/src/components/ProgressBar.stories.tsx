import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
}

export default meta

type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <ProgressBar value={65} label="후원 목표" />
    </div>
  ),
}

export const CustomFormat: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <ProgressBar
        value={430000}
        max={1000000}
        label="이번 달 후원 목표"
        formatValue={(value, max) => `${value.toLocaleString()}원 / ${max.toLocaleString()}원`}
      />
    </div>
  ),
}

export const NoLabel: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <ProgressBar value={90} />
    </div>
  ),
}
