import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings } from '../icons'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { 'aria-label': '설정 열기', children: <Settings size={26} /> },
}

export default meta

type Story = StoryObj<typeof IconButton>

export const Secondary: Story = { args: { variant: 'secondary' } }
export const Primary: Story = { args: { variant: 'primary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <IconButton aria-label="secondary" variant="secondary">
        <Settings size={26} />
      </IconButton>
      <IconButton aria-label="primary" variant="primary">
        <Settings size={26} />
      </IconButton>
      <IconButton aria-label="ghost" variant="ghost">
        <Settings size={26} />
      </IconButton>
    </div>
  ),
}
