import type { ChangeEvent } from 'react'
import { Minus, Plus } from '../icons'
import { IconButton } from './IconButton'
import './NumberInput.css'

export interface NumberInputProps {
  label?: string
  value: number
  min?: number
  max?: number
  step?: number
  /** 값 뒤에 붙는 단위 표시(예: "초"). */
  unit?: string
  disabled?: boolean
  onChange: (value: number) => void
}

/**
 * 숫자를 직접 타이핑하거나 +/- 버튼으로 조절하는 입력. Slider(상대적인 값 조절)와 달리
 * 정확한 숫자(초 단위 타이머 등)를 입력해야 할 때 씁니다.
 */
export function NumberInput({
  label,
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  disabled,
  onChange,
}: NumberInputProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = Number(event.target.value)
    if (Number.isNaN(raw)) return
    onChange(clamp(raw))
  }

  return (
    <div className="cc-number-input">
      {label ? <span className="cc-number-input__label">{label}</span> : null}
      <div className="cc-number-input__control">
        <IconButton
          aria-label="감소"
          disabled={disabled || value <= min}
          onClick={() => onChange(clamp(value - step))}
        >
          <Minus size={18} />
        </IconButton>
        <input
          className="cc-number-input__field"
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
        />
        {unit ? <span className="cc-number-input__unit">{unit}</span> : null}
        <IconButton
          aria-label="증가"
          disabled={disabled || value >= max}
          onClick={() => onChange(clamp(value + step))}
        >
          <Plus size={18} />
        </IconButton>
      </div>
    </div>
  )
}
