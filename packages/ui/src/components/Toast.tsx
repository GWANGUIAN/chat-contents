import * as ToastPrimitive from '@radix-ui/react-toast'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from '../icons'
import './Toast.css'

export type ToastVariant = 'default' | 'success' | 'danger'

export interface ToastItem {
  id: string
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  /** 자동으로 닫히기까지 걸리는 시간(ms). 기본 4000. */
  duration?: number
}

export interface ToastContextValue {
  /** 토스트를 큐에 추가합니다. 후원/구독 알림처럼 짧게 떴다 사라지는 용도. id를 반환합니다. */
  showToast: (toast: Omit<ToastItem, 'id'>) => string
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_ICON: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  danger: AlertCircle,
}

export interface ToastProviderProps {
  children: ReactNode
  /** 토스트가 쌓이는 위치. 기본 bottom-right(설정 게어와 안 겹침). */
  placement?: 'top-right' | 'bottom-right'
}

/**
 * 후원/구독 알림 등 짧게 떴다 사라지는 토스트를 큐잉/렌더링하는 Provider.
 * Radix UI의 headless Toast는 인스턴스 하나만 다루므로, 여러 토스트를 동시에
 * 띄우고 자동으로 걷어내는 큐는 이 컴포넌트가 직접 관리합니다. useToast()로
 * 어디서든 showToast()를 호출하면 됩니다.
 */
export function ToastProvider({ children, placement = 'bottom-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, variant: 'default', duration: 4000, ...toast }])
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => {
          const Icon = VARIANT_ICON[toast.variant ?? 'default']
          return (
            <ToastPrimitive.Root
              key={toast.id}
              className={`cc-toast cc-toast--${toast.variant ?? 'default'}`}
              duration={toast.duration ?? 4000}
              onOpenChange={(open) => {
                if (!open) dismissToast(toast.id)
              }}
            >
              <Icon size={20} className="cc-toast__icon" />
              <div className="cc-toast__body">
                {toast.title ? (
                  <ToastPrimitive.Title className="cc-toast__title">
                    {toast.title}
                  </ToastPrimitive.Title>
                ) : null}
                {toast.description ? (
                  <ToastPrimitive.Description className="cc-toast__description">
                    {toast.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              <ToastPrimitive.Close className="cc-toast__close" aria-label="닫기">
                <X size={16} />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          )
        })}
        <ToastPrimitive.Viewport className={`cc-toast-viewport cc-toast-viewport--${placement}`} />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast는 ToastProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
