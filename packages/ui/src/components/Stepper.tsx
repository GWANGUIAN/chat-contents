import type { CSSProperties, ReactNode } from 'react'
import { Children, isValidElement, useEffect, useRef, useState } from 'react'
import { Step } from './Step'
import { useStepperContext } from './StepperProvider'
import './Stepper.css'

export interface StepperProps {
  /** Step 엘리먼트들. Step이 아닌 자식은 무시됩니다. */
  children: ReactNode
  /** 단계 전환 시 페이드+슬라이드 애니메이션 적용 여부. 기본 true. */
  animate?: boolean
  /** 전환 애니메이션 길이(ms). 주지 않으면 --stepper-transition-duration 토큰 기본값(0.3s)을 씁니다. */
  transitionDuration?: number
  className?: string
}

/**
 * useStepperContext()의 현재 단계에 해당하는 Step 자식만 보여주는 컨테이너.
 * 단계가 바뀌면 나가는 패널은 왼쪽으로 페이드아웃, 들어오는 패널은 오른쪽에서
 * 페이드인합니다(이동 방향과 무관하게 항상 이 방향). animate=false면 즉시 전환됩니다.
 */
export function Stepper({ children, animate = true, transitionDuration, className }: StepperProps) {
  const { step } = useStepperContext()
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement => isValidElement(child) && child.type === Step,
  )

  const [displayedStep, setDisplayedStep] = useState(step)
  const [previousStep, setPreviousStep] = useState<number | null>(null)
  const lastStepRef = useRef(step)

  useEffect(() => {
    if (lastStepRef.current === step) return
    const previous = lastStepRef.current
    lastStepRef.current = step
    if (animate) setPreviousStep(previous)
    setDisplayedStep(step)
  }, [step, animate])

  const classes = ['cc-stepper', className].filter(Boolean).join(' ')
  const style =
    transitionDuration !== undefined
      ? ({ '--stepper-transition-duration': `${transitionDuration}ms` } as CSSProperties)
      : undefined

  const previousItem = previousStep !== null ? items[previousStep] : null
  const currentItem = items[displayedStep]

  return (
    <div className={classes} style={style}>
      <div className="cc-stepper__viewport">
        {previousItem ? (
          <div
            key={`leaving-${previousStep}`}
            className="cc-stepper__panel cc-stepper__panel--leaving"
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget) return
              setPreviousStep(null)
            }}
          >
            {previousItem}
          </div>
        ) : null}
        <div
          key={`current-${displayedStep}`}
          className={`cc-stepper__panel ${previousItem ? 'cc-stepper__panel--entering' : ''}`}
        >
          {currentItem}
        </div>
      </div>
    </div>
  )
}
