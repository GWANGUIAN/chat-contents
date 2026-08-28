import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from '../icons'
import './Dropdown.css'

export interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** 스크린 리더용 라벨. 화면에 보이는 라벨이 따로 있으면 그쪽에 htmlFor 대신 이걸 씁니다. */
  'aria-label'?: string
  className?: string
}

/**
 * 값 하나를 고르는 드롭다운. Radix UI의 headless Select 위에 디자인
 * 시스템 톤(두꺼운 accent 보더, 큰 폰트, 글래스모피즘 팝오버)을 입혔습니다.
 * 팝오버는 Portal로 렌더링되므로 Panel처럼 overflow:hidden인 조상 안에서도
 * 잘리지 않습니다.
 */
export function Dropdown({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = '선택하세요',
  disabled,
  className,
  ...rest
}: DropdownProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={['cc-dropdown__trigger', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="cc-dropdown__icon">
          <ChevronDown size={26} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="cc-dropdown__content" position="popper" sideOffset={8}>
          <SelectPrimitive.ScrollUpButton className="cc-dropdown__scroll-button">
            <ChevronUp size={20} />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="cc-dropdown__viewport">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="cc-dropdown__item"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="cc-dropdown__item-indicator">
                  <Check size={20} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="cc-dropdown__scroll-button">
            <ChevronDown size={20} />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
