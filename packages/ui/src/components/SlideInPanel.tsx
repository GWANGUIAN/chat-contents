import type { ReactNode, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { Panel } from './Panel'
import { Title } from './Title'
import './SlideInPanel.css'

export interface SlideInPanelProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** 슬라이드가 시작되는 화면 모서리. 기본 bottom-left(톱니바퀴 버튼 옆). */
  anchor?: 'bottom-left' | 'bottom-right'
  title?: string
  /**
   * 패널을 여닫는 토글 버튼의 ref. 주면 그 버튼 클릭은 "바깥 클릭"으로 치지
   * 않습니다 — 없으면 열려 있을 때 토글 버튼을 눌러도 바깥 클릭 감지가 먼저
   * 닫고 버튼의 토글 로직이 바로 다시 열어버려서 패널이 안 닫히는 것처럼
   * 보입니다(pointerdown이 React의 onClick보다 먼저 실행되기 때문).
   */
  triggerRef?: RefObject<HTMLElement | null>
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
  triggerRef,
}: SlideInPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (ref.current?.contains(target)) return
      if (triggerRef?.current?.contains(target)) return
      onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, onClose, triggerRef])

  return (
    <div
      ref={ref}
      className={`cc-slide-in cc-slide-in--${anchor} ${open ? 'cc-slide-in--open' : ''}`}
      aria-hidden={!open}
    >
      <Panel className="cc-slide-in__panel">
        <div className="cc-slide-in__scroll">
          {title ? (
            <Title as="h2" size="md" className="cc-slide-in__title">
              {title}
            </Title>
          ) : null}
          {children}
        </div>
      </Panel>
    </div>
  )
}
