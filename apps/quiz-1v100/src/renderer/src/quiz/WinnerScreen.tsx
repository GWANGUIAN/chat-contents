import { Button, Title, Trophy } from '@chat-contents/ui'
import { useEffect, useMemo } from 'react'
import { playVictoryFanfare } from './quizSfx'
import type { Participant } from './types'

export interface WinnerScreenProps {
  winner: Participant | null
  sfxVolume: number
  onRestart: () => void
}

const CONFETTI_COUNT = 24

export function WinnerScreen({ winner, sfxVolume, onRestart }: WinnerScreenProps) {
  const confettiIds = useMemo(
    () => Array.from({ length: CONFETTI_COUNT }, () => crypto.randomUUID()),
    [],
  )

  useEffect(() => {
    // 마운트 시 1회만 재생 — sfxVolume이 이후 바뀌어도 다시 재생하지 않습니다.
    playVictoryFanfare(sfxVolume)
  }, [])

  return (
    <div className="winner-screen">
      <div className="winner-screen__confetti" aria-hidden="true">
        {confettiIds.map((id, index) => (
          <span
            key={id}
            className="winner-screen__confetti-piece"
            style={{
              left: `${(index * 41) % 100}%`,
              animationDelay: `${(index % 8) * 0.12}s`,
              backgroundColor: index % 2 === 0 ? 'var(--accent)' : 'var(--accent-hover)',
            }}
          />
        ))}
      </div>
      <Trophy size={64} />
      <Title as="h1" size="xl" tone="accent">
        {winner?.nickname ?? '???'} 우승!
      </Title>
      <Button onClick={onRestart}>다시 시작</Button>
    </div>
  )
}
