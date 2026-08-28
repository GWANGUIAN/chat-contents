import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { UseStepperResult } from './useStepper'

const StepperContext = createContext<UseStepperResult | null>(null)

export interface StepperProviderProps {
  /** useStepper()가 반환한 값. 상태는 항상 호출부가 들고 있고, 여기선 그대로 주입만 합니다. */
  value: UseStepperResult
  children: ReactNode
}

/**
 * Stepper/StepperNav가 같은 단계 상태를 공유하도록 컨텍스트로 주입하는 얇은 Provider.
 * 상태 자체는 만들지 않으므로, 여러 곳에서 상태를 공유하거나 영속화하고 싶으면
 * useStepper()의 결과를 원하는 곳에서 만들어 value로 넘기면 됩니다.
 */
export function StepperProvider({ value, children }: StepperProviderProps) {
  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
}

export function useStepperContext(): UseStepperResult {
  const ctx = useContext(StepperContext)
  if (!ctx) throw new Error('useStepperContext는 StepperProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
