import { Badge, Crown, XCircle } from '@chat-contents/ui'
import type { Participant, RoundStatus } from './types'

export interface ParticipantTileProps {
  participant: Participant
  status: RoundStatus
}

export function ParticipantTile({ participant, status }: ParticipantTileProps) {
  const classes = [
    'participant-tile',
    `participant-tile--${status}`,
    !participant.alive ? 'participant-tile--out' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {participant.isHost ? (
        <Badge tone="accent" variant="solid" className="participant-tile__host-badge">
          <Crown size={12} />
        </Badge>
      ) : null}
      <span className="participant-tile__nickname">{participant.nickname}</span>
      <div className="participant-tile__status-panel" />
      {!participant.alive ? (
        <div className="participant-tile__out-overlay">
          <XCircle size={20} />
          <span>OUT</span>
        </div>
      ) : null}
    </div>
  )
}
