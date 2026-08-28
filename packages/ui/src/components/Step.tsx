import type { ReactNode } from 'react'
import './Step.css'

export interface StepProps {
  children: ReactNode
  className?: string
}

/**
 * Stepper의 자식으로 쓰는 마커 컴포넌트. Stepper가 child.type === Step으로 식별해서
 * 현재 단계에 해당하는 것만 렌더링합니다(ChatPanel이 ChatMessage를 식별하는 것과 동일 패턴).
 */
export function Step({ children, className }: StepProps) {
  const classes = ['cc-step', className].filter(Boolean).join(' ')
  return <div className={classes}>{children}</div>
}
