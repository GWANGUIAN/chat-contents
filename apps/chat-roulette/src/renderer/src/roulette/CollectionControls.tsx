import { Button, Checkbox, NumberInput, Play, StopCircle } from '@chat-contents/ui'
import type { RoulettePhase } from './types'

export interface CollectionControlsProps {
  connected: boolean
  phase: RoulettePhase
  timerSeconds: number
  onTimerSecondsChange: (value: number) => void
  remainingSeconds: number
  onExtendTime: (seconds: number) => void
  allowDuplicates: boolean
  onAllowDuplicatesChange: (value: boolean) => void
  submittedCount: number
  canSpin: boolean
  onStartCollecting: () => void
  onStopCollecting: () => void
  onStartSpin: () => void
  onRecollect: () => void
}

export function CollectionControls({
  connected,
  phase,
  timerSeconds,
  onTimerSecondsChange,
  remainingSeconds,
  onExtendTime,
  allowDuplicates,
  onAllowDuplicatesChange,
  submittedCount,
  canSpin,
  onStartCollecting,
  onStopCollecting,
  onStartSpin,
  onRecollect,
}: CollectionControlsProps) {
  if (phase === 'ready') {
    return (
      <div className="collection-controls">
        <p className="collection-controls__count">제출 {submittedCount}명</p>
        <div className="collection-controls__row">
          <Button onClick={onStartSpin} disabled={!canSpin}>
            룰렛 돌리기
          </Button>
          <Button variant="secondary" onClick={onRecollect}>
            채팅 재수집
          </Button>
        </div>
      </div>
    )
  }

  const collecting = phase === 'collecting'

  return (
    <div className="collection-controls">
      <div className="collection-controls__timer">
        {collecting ? (
          <div className="collection-controls__countdown">
            <span
              className={[
                'collection-controls__countdown-value',
                remainingSeconds <= 10 ? 'collection-controls__countdown-value--urgent' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {remainingSeconds}초
            </span>
            <Button variant="secondary" onClick={() => onExtendTime(10)}>
              +10초
            </Button>
          </div>
        ) : (
          <NumberInput
            label="수집 시간"
            value={timerSeconds}
            min={10}
            max={600}
            step={10}
            unit="초"
            onChange={onTimerSecondsChange}
          />
        )}

        {collecting ? (
          <Button variant="secondary" onClick={onStopCollecting}>
            <StopCircle size={20} />
            수집 중지
          </Button>
        ) : (
          <Button onClick={onStartCollecting} disabled={!connected}>
            <Play size={20} />
            수집 시작
          </Button>
        )}
      </div>

      <Checkbox
        checked={allowDuplicates}
        disabled={collecting}
        onCheckedChange={onAllowDuplicatesChange}
        label="중복 제출 허용"
      />

      {collecting ? (
        <p className="collection-controls__hint">!로 시작하는 채팅을 보내면 제출됩니다!</p>
      ) : null}
    </div>
  )
}
