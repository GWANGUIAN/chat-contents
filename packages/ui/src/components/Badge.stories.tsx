import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
}

export default meta

type Story = StoryObj<typeof Badge>

const TONES = ['accent', 'neutral', 'success', 'danger'] as const
const VARIANTS = ['solid', 'soft', 'outline'] as const

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {TONES.map((tone) => (
            <Badge key={tone} variant={variant} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}
