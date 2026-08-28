import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Dropdown } from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
}

export default meta

type Story = StoryObj<typeof Dropdown>

const RESOLUTION_OPTIONS = [
  { value: '1280x720', label: '1280 × 720' },
  { value: '1600x900', label: '1600 × 900' },
  { value: '1920x1080', label: '1920 × 1080' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('1600x900')
    return (
      <div style={{ width: 260 }}>
        <Dropdown
          aria-label="해상도"
          options={RESOLUTION_OPTIONS}
          value={value}
          onValueChange={setValue}
        />
      </div>
    )
  },
}

export const Placeholder: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <Dropdown aria-label="해상도" options={RESOLUTION_OPTIONS} placeholder="해상도 선택" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <Dropdown
        aria-label="해상도"
        options={RESOLUTION_OPTIONS}
        defaultValue="1920x1080"
        disabled
      />
    </div>
  ),
}

const MANY_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `옵션 ${i + 1}`,
}))

export const LongList: Story = {
  render: () => {
    const [value, setValue] = useState('option-1')
    return (
      <div style={{ width: 260 }}>
        <Dropdown aria-label="옵션" options={MANY_OPTIONS} value={value} onValueChange={setValue} />
      </div>
    )
  },
}

export const WithDisabledOption: Story = {
  render: () => {
    const [value, setValue] = useState('1280x720')
    const options = RESOLUTION_OPTIONS.map((option) =>
      option.value === '1920x1080' ? { ...option, disabled: true } : option,
    )
    return (
      <div style={{ width: 260 }}>
        <Dropdown aria-label="해상도" options={options} value={value} onValueChange={setValue} />
      </div>
    )
  },
}
