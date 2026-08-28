import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Switch checked={checked} onCheckedChange={setChecked} aria-label="채팅 알림음" />
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Switch checked={false} onCheckedChange={() => {}} disabled aria-label="비활성 꺼짐" />
      <Switch checked onCheckedChange={() => {}} disabled aria-label="비활성 켜짐" />
    </div>
  ),
}
