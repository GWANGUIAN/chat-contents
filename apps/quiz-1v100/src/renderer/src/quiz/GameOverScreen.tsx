import { Badge, Button, Title } from '@chat-contents/ui'
import type { Participant } from './types'

export interface GameOverScreenProps {
  survivors: Participant[]
  onRestart: () => void
}

/** 생존자가 2명 이상 남았는데 준비된 문제가 소진된 엣지 케이스 — 남은 생존자를 공동 우승으로 처리합니다. */
export function GameOverScreen({ survivors, onRestart }: GameOverScreenProps) {
  return (
    <div className="game-over-screen">
      <Title as="h1" size="xl" tone="accent">
        문제 소진 — 공동 생존
      </Title>
      <div className="game-over-screen__survivors">
        {survivors.map((participant) => (
          <Badge key={participant.id} tone="success" variant="solid">
            {participant.nickname}
          </Badge>
        ))}
      </div>
      <Button onClick={onRestart}>다시 시작</Button>
    </div>
  )
}
