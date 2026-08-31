import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from '../icons'
import { usePortalContainer } from '../theme/ThemeProvider'
import { IconButton } from './IconButton'
import { Title } from './Title'
import './Drawer.css'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

/**
 * 화면 높이 전체를 차지하며 오른쪽 가장자리에서 슬라이드해 들어오는 서랍.
 * SlideInPanel(트리거 버튼 근처에 뜨는 작은 카드)과 달리 내용이 많고 화면을 넉넉히
 * 써야 하는 편집 UI에 씁니다. Modal과 같은 Radix Dialog 위에 다른 위치/애니메이션을
 * 입혔습니다.
 */
export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  const container = usePortalContainer()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className="cc-drawer__overlay" />
        <DialogPrimitive.Content
          className={['cc-drawer__content', className].filter(Boolean).join(' ')}
        >
          <div className="cc-drawer__header">
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
          <div className="cc-drawer__body">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
