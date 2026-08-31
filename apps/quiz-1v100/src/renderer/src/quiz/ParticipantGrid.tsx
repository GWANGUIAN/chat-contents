import { ParticipantTile } from './ParticipantTile'
import type { Participant, RoundStatus } from './types'

export interface ParticipantGridProps {
  participants: Participant[]
  roundStatus: Record<string, RoundStatus>
}

export function ParticipantGrid({ participants, roundStatus }: ParticipantGridProps) {
  return (
    <div className="quiz-grid">
      {participants.map((participant) => (
        <ParticipantTile
          key={participant.id}
          participant={participant}
          status={roundStatus[participant.id] ?? 'pending'}
        />
      ))}
    </div>
  )
}
