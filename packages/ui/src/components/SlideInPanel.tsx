import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { Panel } from './Panel'
import './SlideInPanel.css'

export interface SlideInPanelProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** 슬라이드가 시작되는 화면 모서리. 기본 bottom-left(톱니바퀴 버튼 옆). */
  anchor?: 'bottom-left' | 'bottom-right'
  title?: string
}

/**
 * 톱니바퀴 근처에서 떠오르는 설정 패널 셸. 바깥 클릭 시 닫힙니다.
 */
export function SlideInPanel({
  open,
  onClose,
  children,
  anchor = 'bottom-left',
  title,
}: SlideInPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, onClose])

  return (
    <div
      ref={ref}
      className={`cc-slide-in cc-slide-in--${anchor} ${open ? 'cc-slide-in--open' : ''}`}
      aria-hidden={!open}
    >
      <Panel className="cc-slide-in__panel">
        {title ? <h2 className="cc-slide-in__title">{title}</h2> : null}
        {children}
      </Panel>
    </div>
  )
}
