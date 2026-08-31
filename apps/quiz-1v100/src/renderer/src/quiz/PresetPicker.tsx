import { Button, NumberInput } from '@chat-contents/ui'
import { DEFAULT_PRESETS } from './types'

export interface PresetPickerProps {
  value: number
  onChange: (count: number) => void
}

export function PresetPicker({ value, onChange }: PresetPickerProps) {
  const matchedPreset = DEFAULT_PRESETS.find((preset) => preset.count === value)

  return (
    <div className="preset-picker">
      <div className="preset-picker__row">
        {DEFAULT_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={matchedPreset?.id === preset.id ? 'primary' : 'secondary'}
            onClick={() => onChange(preset.count)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <NumberInput
        label="커스텀 인원수"
        value={value}
        min={2}
        max={300}
        unit="명"
        onChange={onChange}
      />
    </div>
  )
}
