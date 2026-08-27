import type { HTMLAttributes, ReactNode } from 'react'
import './Panel.css'

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** 배경을 좀 더 은은하게(중첩된 패널 안에 패널을 놓을 때). */
  variant?: 'default' | 'subtle'
}

export function Panel({ children, variant = 'default', className, ...rest }: PanelProps) {
  const classes = ['cc-panel', variant === 'subtle' ? 'cc-panel--subtle' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
