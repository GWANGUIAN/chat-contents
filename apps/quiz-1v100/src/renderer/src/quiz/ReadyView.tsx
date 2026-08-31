import { Badge, Button, Crown, Title } from '@chat-contents/ui'
import type { Participant } from './types'

export interface ReadyViewProps {
  participants: Participant[]
  onStartGame: () => void
}

export function ReadyView({ participants, onStartGame }: ReadyViewProps) {
  return (
    <div className="ready-view">
      <Title as="h1" size="xl" tone="accent">
        모집 완료 — {participants.length}명
      </Title>
      <div className="ready-view__chips">
        {participants.map((participant) => (
          <Badge
            key={participant.id}
            tone={participant.isHost ? 'accent' : 'neutral'}
            variant={participant.isHost ? 'solid' : 'soft'}
          >
            {participant.isHost ? <Crown size={14} /> : null}
            {participant.nickname}
          </Badge>
        ))}
      </div>
      <Button onClick={onStartGame} disabled={participants.length === 0}>
        게임 시작
      </Button>
    </div>
  )
}
