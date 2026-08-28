import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Panel } from './Panel'
import { Step } from './Step'
import { Stepper } from './Stepper'
import { StepperNav } from './StepperNav'
import { StepperProvider } from './StepperProvider'
import { TextInput } from './TextInput'
import { Title } from './Title'
import { useStepper } from './useStepper'

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
}

export default meta

type Story = StoryObj<typeof Stepper>

function Wizard({ animate }: { animate: boolean }) {
  const stepper = useStepper({
    steps: [{ label: '환영' }, { label: '채널 연결' }, { label: '완료' }],
  })

  return (
    <StepperProvider value={stepper}>
      <Panel style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <StepperNav />
        <Stepper animate={animate}>
          <Step>
            <Title as="h3" size="md">
              환영합니다 👋
            </Title>
            <p style={{ margin: 0 }}>이 마법사는 SOOP 채널을 연결하는 과정을 안내합니다.</p>
          </Step>
          <Step>
            <Title as="h3" size="md">
              채널 연결
            </Title>
            <TextInput placeholder="SOOP 채널 ID 입력" />
          </Step>
          <Step>
            <Title as="h3" size="md">
              완료!
            </Title>
            <p style={{ margin: 0 }}>이제 채팅 연동을 시작할 준비가 됐습니다.</p>
          </Step>
        </Stepper>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="secondary" onClick={stepper.back} disabled={stepper.isFirst}>
            이전
          </Button>
          <Button onClick={stepper.next} disabled={stepper.isLast}>
            다음
          </Button>
        </div>
      </Panel>
    </StepperProvider>
  )
}

export const Default: Story = {
  render: () => <Wizard animate />,
}

export const NoAnimation: Story = {
  render: () => <Wizard animate={false} />,
}
