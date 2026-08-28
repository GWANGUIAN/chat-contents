import {
  Badge,
  Button,
  Modal,
  Panel,
  ProgressBar,
  Spinner,
  Step,
  Stepper,
  StepperNav,
  StepperProvider,
  Switch,
  TextInput,
  Title,
  Tooltip,
  useStepper,
  useToast,
} from '@chat-contents/ui'
import { useState } from 'react'

export interface OnboardingFlowProps {
  onComplete: (channelId: string | null) => void
}

const ONBOARDING_STEPS = [
  { label: '환영' },
  { label: '채널 연결' },
  { label: '컴포넌트 데모' },
  { label: '완료' },
]

/**
 * 최초 실행 시 한 번 보여주는 온보딩 마법사. 환영 → SOOP 채널 연결 → 컴포넌트 데모 → 완료
 * 4단계로, 완료 시 입력한 채널 ID를 상위(App)로 전달합니다.
 */
export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const stepper = useStepper({ steps: ONBOARDING_STEPS })
  const [channelId, setChannelId] = useState('')
  const [demoAlarmOn, setDemoAlarmOn] = useState(true)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const { showToast } = useToast()

  return (
    <Panel className="onboarding-flow">
      <StepperProvider value={stepper}>
        <StepperNav />

        <Stepper>
          <Step>
            <Title as="h2" size="lg">
              환영합니다 👋
            </Title>
            <p className="onboarding-flow__body">
              이 앱은 SOOP 방송 채팅을 실시간으로 화면에 보여줍니다. 몇 가지만 설정하면 바로 시작할
              수 있어요.
            </p>
          </Step>

          <Step>
            <Title as="h2" size="lg">
              SOOP 채널 연결
            </Title>
            <p className="onboarding-flow__body">
              연동할 SOOP 채널 ID를 입력해주세요. 나중에 언제든 바꿀 수 있습니다.
            </p>
            <TextInput
              placeholder="SOOP 채널 ID 입력"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
            />
          </Step>

          <Step>
            <Title as="h2" size="lg">
              컴포넌트 데모
            </Title>
            <p className="onboarding-flow__body">
              새로 추가된 디자인 시스템 컴포넌트들을 여기서 한 번에 확인해볼 수 있어요.
            </p>

            <div className="onboarding-flow__demo">
              <div className="onboarding-flow__demo-row">
                <Button
                  onClick={() =>
                    showToast({
                      title: '새 후원',
                      description: '홍길동님이 10,000원을 후원했습니다.',
                      variant: 'success',
                    })
                  }
                >
                  토스트 보내기
                </Button>
                <Button variant="secondary" onClick={() => setDemoModalOpen(true)}>
                  모달 열기
                </Button>
                <Tooltip content="이 버튼에 마우스를 올리면 툴팁이 뜹니다">
                  <Button variant="ghost">툴팁 확인</Button>
                </Tooltip>
                <Spinner size={28} aria-label="연동 중" />
              </div>

              <div className="onboarding-flow__demo-row">
                <Switch
                  checked={demoAlarmOn}
                  onCheckedChange={setDemoAlarmOn}
                  aria-label="채팅 알림음"
                />
                <span className="onboarding-flow__demo-label">
                  채팅 알림음 {demoAlarmOn ? '켜짐' : '꺼짐'}
                </span>
              </div>

              <ProgressBar value={65} label="후원 목표" />

              <div className="onboarding-flow__demo-row">
                <Badge tone="accent">후원자</Badge>
                <Badge tone="success" variant="solid">
                  연동됨
                </Badge>
                <Badge tone="danger" variant="outline">
                  오프라인
                </Badge>
                <Badge tone="neutral" variant="soft">
                  구독자
                </Badge>
              </div>
            </div>

            <Modal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} title="모달 데모">
              <p style={{ margin: 0 }}>
                Modal 컴포넌트 데모입니다. 실제 앱에서는 확인/취소가 필요한 동작에 씁니다.
              </p>
            </Modal>
          </Step>

          <Step>
            <Title as="h2" size="lg">
              준비 완료!
            </Title>
            <p className="onboarding-flow__body">
              {channelId.trim()
                ? `${channelId.trim()} 채널로 바로 연동을 시작합니다.`
                : '채널 ID 없이 시작합니다 — 앱에서 나중에 입력할 수 있어요.'}
            </p>
          </Step>
        </Stepper>

        <div className="onboarding-flow__actions">
          <Button variant="secondary" onClick={stepper.back} disabled={stepper.isFirst}>
            이전
          </Button>
          {stepper.isLast ? (
            <Button onClick={() => onComplete(channelId.trim() || null)}>시작하기</Button>
          ) : (
            <Button onClick={stepper.next}>다음</Button>
          )}
        </div>
      </StepperProvider>
    </Panel>
  )
}
