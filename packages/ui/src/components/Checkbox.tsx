import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { ReactNode } from 'react'
import { useId } from 'react'
import { Check } from '../icons'
import './Checkbox.css'

export interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label?: ReactNode
  /** 스크린 리더용 라벨. 화면에 보이는 label이 따로 있으면 그쪽에 htmlFor 대신 이걸 씁니다. */
  'aria-label'?: string
  className?: string
}

/** 다중 선택/동의 등에 쓰는 사각형 체크박스. Radix UI의 headless Checkbox 위에 디자인 시스템 톤을 입혔습니다. */
export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  label,
  className,
  ...rest
}: CheckboxProps) {
  const id = useId()

  return (
    <div className={['cc-checkbox', className].filter(Boolean).join(' ')}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        disabled={disabled}
        className="cc-checkbox__box"
        {...rest}
      >
        <CheckboxPrimitive.Indicator className="cc-checkbox__indicator">
          <Check size={16} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label ? (
        <label htmlFor={id} className="cc-checkbox__label">
          {label}
        </label>
      ) : null}
    </div>
  )
}
