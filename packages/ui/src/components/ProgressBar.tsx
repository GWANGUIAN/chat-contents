import * as ProgressPrimitive from '@radix-ui/react-progress'
import './ProgressBar.css'

export interface ProgressBarProps {
  /** 현재 값. 0 ~ max로 클램프됩니다. */
  value: number
  /** 목표 값. 기본 100. */
  max?: number
  /** 위에 표시할 라벨(예: "후원 목표"). */
  label?: string
  /** 오른쪽에 표시할 값 텍스트. 기본 "value / max". */
  formatValue?: (value: number, max: number) => string
  className?: string
}

/**
 * 후원/팔로워 목표 게이지 등에 쓰는 진행률 바. Radix UI의 headless Progress 위에
 * 디자인 시스템 톤을 입혔습니다(role="progressbar" 등 접근성 속성은 Radix가 처리).
 */
export function ProgressBar({ value, max = 100, label, formatValue, className }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0

  return (
    <div className={['cc-progress-bar', className].filter(Boolean).join(' ')}>
      {label || formatValue ? (
        <div className="cc-progress-bar__header">
          {label ? <span>{label}</span> : <span />}
          <span>{formatValue ? formatValue(clamped, max) : `${clamped} / ${max}`}</span>
        </div>
      ) : null}
      <ProgressPrimitive.Root className="cc-progress-bar__track" value={clamped} max={max}>
        <ProgressPrimitive.Indicator
          className="cc-progress-bar__fill"
          style={{ width: `${percent}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}
