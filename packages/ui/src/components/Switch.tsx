import * as SwitchPrimitive from '@radix-ui/react-switch'
import './Switch.css'

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  /** 스크린 리더용 라벨. 화면에 보이는 라벨이 따로 있으면 그쪽에 htmlFor 대신 이걸 씁니다. */
  'aria-label'?: string
  className?: string
}

/** on/off 설정용 스위치. Radix UI의 headless Switch 위에 디자인 시스템 톤을 입혔습니다. */
export function Switch({ checked, onCheckedChange, disabled, className, ...rest }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={['cc-switch', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <SwitchPrimitive.Thumb className="cc-switch__thumb" />
    </SwitchPrimitive.Root>
  )
}
