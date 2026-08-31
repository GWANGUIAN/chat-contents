import { Button, ChatMessage, ChatPanel, Panel, ProgressBar, Title } from '@chat-contents/ui'
import type { Participant } from './types'

export interface RecruitmentViewProps {
  participants: Participant[]
  targetCount: number
  onCloseRecruiting: () => void
  onDevInjectMockRecruits?: () => void
}

export function RecruitmentView({
  participants,
  targetCount,
  onCloseRecruiting,
  onDevInjectMockRecruits,
}: RecruitmentViewProps) {
  const viewers = participants.filter((p) => !p.isHost)

  return (
    <div className="recruitment-view">
      <Title as="h1" size="xl" tone="accent">
        참여자 모집 중
      </Title>
      <p className="recruitment-view__hint">채팅창에 !참여 를 입력하면 참가할 수 있어요!</p>

      <ProgressBar
        value={viewers.length}
        max={targetCount}
        formatValue={(value, max) => `${value} / ${max}명`}
      />

      <Panel className="recruitment-view__log">
        <ChatPanel maxHeight={320}>
          {viewers.map((participant) => (
            <ChatMessage key={participant.id} nickname={participant.nickname}>
              님이 참여했습니다
            </ChatMessage>
          ))}
        </ChatPanel>
      </Panel>

      <div className="recruitment-view__actions">
        {import.meta.env.DEV && onDevInjectMockRecruits ? (
          <Button variant="ghost" onClick={onDevInjectMockRecruits}>
            테스트: 목업 시청자 참여
          </Button>
        ) : null}
        <Button onClick={onCloseRecruiting}>모집 마감</Button>
      </div>
    </div>
  )
}
