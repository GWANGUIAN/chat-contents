import type { HTMLAttributes } from 'react'
import './Badge.css'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 색의 진하기. Button의 variant 네이밍을 따름. 기본 soft. */
  variant?: 'solid' | 'soft' | 'outline'
  /** 색의 의미. Title의 tone 네이밍을 따름. 기본 accent. */
  tone?: 'accent' | 'neutral' | 'success' | 'danger'
}

/** 후원 등급, 구독자 배지, 상태 표시 등에 쓰는 작은 pill. */
export function Badge({ variant = 'soft', tone = 'accent', className, ...rest }: BadgeProps) {
  const classes = ['cc-badge', `cc-badge--${tone}`, `cc-badge--${variant}`, className]
    .filter(Boolean)
    .join(' ')
  return <span className={classes} {...rest} />
}
