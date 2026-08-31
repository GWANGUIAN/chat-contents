import type { ChatStreamStatus } from '@chat-contents/chat-client'
import { Badge, Wifi, WifiOff } from '@chat-contents/ui'

export interface QuizHudProps {
  round: number
  aliveCount: number
  totalCount: number
  chatStatus: ChatStreamStatus
}

/** 화면 상단에 항상 고정되는 바. 생존자수/라운드는 다른 화면 콘텐츠와 별개로 항상 보입니다. */
export function QuizHud({ round, aliveCount, totalCount, chatStatus }: QuizHudProps) {
  return (
    <div className="quiz-hud">
      <div className="quiz-hud__group">
        <Badge tone="accent" variant="solid">
          생존 {aliveCount} / {totalCount}
        </Badge>
        <Badge tone="neutral" variant="outline">
          {round > 0 ? `${round}라운드` : '대기 중'}
        </Badge>
      </div>
      <div className="quiz-hud__group">
        {chatStatus === 'connected' ? (
          <Wifi size={20} className="quiz-hud__status-icon quiz-hud__status-icon--connected" />
        ) : (
          <WifiOff size={20} className="quiz-hud__status-icon" />
        )}
      </div>
    </div>
  )
}
