import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from '../icons'
import { usePortalContainer } from '../theme/ThemeProvider'
import { IconButton } from './IconButton'
import { Title } from './Title'
import './Modal.css'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

/**
 * 화면 중앙에 뜨는 블로킹 모달. SlideInPanel(앵커형, 바깥 클릭 시 닫힘)과 달리
 * 확인/취소처럼 사용자의 명시적 응답이 필요한 상황에 씁니다. Radix UI의 headless
 * Dialog 위에 Panel과 같은 글래스모피즘 톤을 입혔습니다.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const container = usePortalContainer()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className="cc-modal__overlay" />
        <DialogPrimitive.Content
          className={['cc-modal__content', className].filter(Boolean).join(' ')}
        >
          <div className="cc-modal__header">
            {title ? (
              <DialogPrimitive.Title asChild>
                <Title as="h2" size="md">
                  {title}
                </Title>
              </DialogPrimitive.Title>
            ) : (
              <span />
            )}
            <DialogPrimitive.Close asChild>
              <IconButton aria-label="닫기" variant="ghost">
                <X size={22} />
              </IconButton>
            </DialogPrimitive.Close>
          </div>
          <div className="cc-modal__body">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
