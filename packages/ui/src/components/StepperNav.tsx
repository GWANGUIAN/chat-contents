import { Fragment } from 'react'
import { Check } from '../icons'
import { useStepperContext } from './StepperProvider'
import type { UseStepperResult } from './useStepper'
import './StepperNav.css'

export interface StepperNavProps {
  className?: string
  /** 특정 단계로 이동 가능한지. 기본은 이미 지나왔거나 현재 단계까지만(index <= step) — 마법사가 순서대로 진행되도록 강제합니다. */
  isNavigable?: (index: number, current: UseStepperResult) => boolean
  /** 단계 라벨 표시 여부. 기본 true. */
  showLabels?: boolean
}

const defaultIsNavigable = (index: number, current: UseStepperResult) => index <= current.step

/**
 * 현재 단계를 원형 dot으로 표시하고 클릭으로 이동할 수 있는 네비게이션 UI.
 * useStepperContext()로 Stepper와 같은 단계 상태를 공유합니다.
 */
export function StepperNav({
  className,
  isNavigable = defaultIsNavigable,
  showLabels = true,
}: StepperNavProps) {
  const stepper = useStepperContext()
  const { step, steps, goTo } = stepper

  const classes = ['cc-stepper-nav', className].filter(Boolean).join(' ')

  return (
    <div className={classes} role="tablist">
      {steps.map((definition, index) => {
        const state = index === step ? 'active' : index < step ? 'complete' : 'upcoming'
        const navigable = isNavigable(index, stepper)

        return (
          <Fragment key={definition.id ?? index}>
            {index > 0 ? (
              <div
                className={`cc-stepper-nav__connector ${
                  index <= step ? 'cc-stepper-nav__connector--complete' : ''
                }`}
              />
            ) : null}
            <button
              type="button"
              role="tab"
              aria-selected={index === step}
              aria-current={index === step ? 'step' : undefined}
              className={`cc-stepper-nav__item cc-stepper-nav__item--${state}`}
              disabled={!navigable}
              onClick={() => navigable && goTo(index)}
            >
              <span className="cc-stepper-nav__dot">
                {state === 'complete' ? <Check size={20} /> : index + 1}
              </span>
              {showLabels && definition.label ? (
                <span className="cc-stepper-nav__label">{definition.label}</span>
              ) : null}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}
