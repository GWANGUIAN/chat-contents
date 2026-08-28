import { useMemo, useState } from 'react'

export interface StepDefinition {
  id?: string
  label?: string
}

export interface UseStepperOptions {
  /** 전체 단계 수, 또는 라벨 등을 포함한 단계 정의 배열. */
  steps: number | StepDefinition[]
  /** 시작 단계 인덱스. 기본 0. */
  initialStep?: number
  onStepChange?: (step: number, previousStep: number) => void
}

export interface UseStepperResult {
  step: number
  totalSteps: number
  steps: StepDefinition[]
  goTo: (step: number) => void
  next: () => void
  back: () => void
  isFirst: boolean
  isLast: boolean
}

export function useStepper({
  steps,
  initialStep = 0,
  onStepChange,
}: UseStepperOptions): UseStepperResult {
  const stepDefs = useMemo<StepDefinition[]>(
    () => (typeof steps === 'number' ? Array.from({ length: steps }, () => ({})) : steps),
    [steps],
  )
  const totalSteps = stepDefs.length

  const [step, setStep] = useState(() => clamp(initialStep, totalSteps))

  const goTo = (target: number) => {
    setStep((current) => {
      const next = clamp(target, totalSteps)
      if (next === current) return current
      onStepChange?.(next, current)
      return next
    })
  }

  return {
    step,
    totalSteps,
    steps: stepDefs,
    goTo,
    next: () => goTo(step + 1),
    back: () => goTo(step - 1),
    isFirst: step === 0,
    isLast: step === totalSteps - 1,
  }
}

function clamp(value: number, totalSteps: number): number {
  if (totalSteps === 0) return 0
  return Math.min(Math.max(value, 0), totalSteps - 1)
}
