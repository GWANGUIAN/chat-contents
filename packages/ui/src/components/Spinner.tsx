import type { HTMLAttributes } from 'react'
import './Spinner.css'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** 지름(px). 기본 24. */
  size?: number
  /** 스크린 리더용 라벨. 기본 "로딩 중". */
  'aria-label'?: string
}

/** accent 색 원형 로딩 인디케이터. 연결/로딩 중 상태를 나타낼 때 씁니다. */
export function Spinner({
  size = 24,
  className,
  'aria-label': ariaLabel = '로딩 중',
  ...rest
}: SpinnerProps) {
  const classes = ['cc-spinner', className].filter(Boolean).join(' ')
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={classes}
      style={{ width: size, height: size }}
      {...rest}
    />
  )
}
