import { Badge, Button, Panel } from '@chat-contents/ui'
import type { NextAction, Participant } from './types'

export interface RoundResultBannerProps {
  eliminatedThisRound: Participant[]
  survivorCount: number
  nextAction: NextAction | null
  onProceed: () => void
}

const ACTION_LABEL: Record<NextAction, string> = {
  nextRound: '다음 라운드',
  rematch: '재경기',
  winner: '우승자 확인',
  gameOver: '게임 종료',
}

export function RoundResultBanner({
  eliminatedThisRound,
  survivorCount,
  nextAction,
  onProceed,
}: RoundResultBannerProps) {
  return (
    <Panel className="round-result-banner">
      <div className="round-result-banner__badges">
        <Badge tone="danger" variant="solid">
          탈락 {eliminatedThisRound.length}명
        </Badge>
        <Badge tone="success" variant="solid">
          {survivorCount}명 생존
        </Badge>
      </div>
      <Button onClick={onProceed} disabled={!nextAction}>
        {nextAction ? ACTION_LABEL[nextAction] : '...'}
      </Button>
    </Panel>
  )
}
