import type { CSSProperties } from 'react'
import './Slider.css'

export interface SliderProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  icon?: React.ReactNode
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  formatValue,
  icon,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100
  const style = { '--volume-fill': `${percent}%` } as CSSProperties

  return (
    <label className="cc-slider">
      <span className="cc-slider__head">
        <span className="cc-slider__label">
          {icon}
          {label}
        </span>
        <span className="cc-slider__value">
          {formatValue ? formatValue(value) : Math.round(value)}
        </span>
      </span>
      <input
        type="range"
        className="cc-slider__input"
        style={style}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
