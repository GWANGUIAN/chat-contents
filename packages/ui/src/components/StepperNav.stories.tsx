import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { StepperNav } from './StepperNav'
import { StepperProvider } from './StepperProvider'
import { useStepper } from './useStepper'

const meta: Meta<typeof StepperNav> = {
  title: 'Components/StepperNav',
  component: StepperNav,
}

export default meta

type Story = StoryObj<typeof StepperNav>

function Demo(props: ComponentProps<typeof StepperNav>) {
  const stepper = useStepper({
    steps: [{ label: '환영' }, { label: '채널 연결' }, { label: '완료' }],
    initialStep: 1,
  })
  return (
    <StepperProvider value={stepper}>
      <div style={{ width: 420 }}>
        <StepperNav {...props} />
      </div>
    </StepperProvider>
  )
}

/** 기본: 지나왔거나 현재 단계까지만 클릭 가능(2단계 upcoming은 비활성). */
export const Default: Story = {
  render: () => <Demo />,
}

/** 라벨 없이 dot만 표시. */
export const NoLabels: Story = {
  render: () => <Demo showLabels={false} />,
}

/** 어떤 단계든 자유롭게 이동 가능하도록 오버라이드한 예시. */
export const FreeNavigation: Story = {
  render: () => <Demo isNavigable={() => true} />,
}
