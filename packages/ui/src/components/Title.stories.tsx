import type { Meta, StoryObj } from '@storybook/react-vite'
import { Title } from './Title'

const meta: Meta<typeof Title> = {
  title: 'Components/Title',
  component: Title,
  args: { children: '설정' },
}

export default meta

type Story = StoryObj<typeof Title>

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Title size="sm">Small Title</Title>
      <Title size="md">Medium Title</Title>
      <Title size="lg">Large Title</Title>
      <Title size="xl">Extra Large Title</Title>
      <Title size="lg" tone="accent">
        Accent Title
      </Title>
    </div>
  ),
}
