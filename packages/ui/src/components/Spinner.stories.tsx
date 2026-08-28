import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
}

export default meta

type Story = StoryObj<typeof Spinner>

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={40} />
    </div>
  ),
}
