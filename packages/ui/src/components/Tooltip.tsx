import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'
import './Tooltip.css'

export interface TooltipProps {
  /** 툴팁 안에 보여줄 내용. */
  content: ReactNode
  /** 트리거가 되는 엘리먼트 하나(Button, IconButton 등). Radix가 ref를 전달할 수 있어야 합니다. */
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

/**
 * 마우스를 올리면 뜨는 짧은 설명. Radix UI의 headless Tooltip 위에 디자인 시스템
 * 톤을 입혔습니다. 인스턴스마다 자체 Provider를 갖고 있어 어디서든 단독으로 쓸 수
 * 있습니다(화면에 툴팁이 아주 많다면 상위에서 Provider 하나를 공유하는 편이 더
 * 효율적이지만, 이 앱들의 규모에서는 차이가 미미합니다).
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={['cc-tooltip__content', className].filter(Boolean).join(' ')}
            side={side}
            sideOffset={8}
          >
            {content}
            <TooltipPrimitive.Arrow className="cc-tooltip__arrow" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
