import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
}

export default meta

type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(70)
    return (
      <div style={{ width: 280 }}>
        <Slider
          label="배경음악 볼륨"
          value={value}
          onChange={setValue}
          formatValue={(v) => `${Math.round(v)}%`}
        />
      </div>
    )
  },
}
