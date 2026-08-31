import { Button, Drawer, IconButton, Pencil, TextInput, Wifi, WifiOff } from '@chat-contents/ui'
import { useState } from 'react'
import { CollectionControls } from './CollectionControls'
import { CollectionLog } from './CollectionLog'
import { EntryEditPanel } from './EntryEditPanel'
import { RouletteReel } from './RouletteReel'
import { RouletteResult } from './RouletteResult'
import { useChatCollector } from './useChatCollector'
import { useCountdownSound } from './useCountdownSound'

export interface RouletteViewProps {
  baseUrl: string | null
  sfxVolume: number
}

export function RouletteView({ baseUrl, sfxVolume }: RouletteViewProps) {
  const collector = useChatCollector({ baseUrl })
  const [channelInput, setChannelInput] = useState('')
  const [editOpen, setEditOpen] = useState(false)

  useCountdownSound(collector.phase, collector.remainingSeconds, sfxVolume)

  const connected = collector.status === 'connected'
  const lastWinner = collector.winners[collector.winners.length - 1] ?? null
  const showStage = collector.phase === 'spinning' || collector.phase === 'result'

  const handleConnect = () => {
    const trimmed = channelInput.trim()
    if (trimmed) collector.connect(trimmed)
  }

  return (
    <div className="roulette-view">
      <div className="roulette-view__connect">
        {collector.channelId ? (
          <>
            <span
              className={`roulette-view__connect-status roulette-view__connect-status--${collector.status}`}
            >
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>
                {connected
                  ? `연결됨 · ${collector.channelId}`
                  : `연결 중… · ${collector.channelId}`}
                {collector.error ? ` — ${collector.error}` : ''}
              </span>
            </span>
            <button
              type="button"
              className="roulette-view__connect-link"
              onClick={() => collector.connect('')}
            >
              연결 끊기
            </button>
          </>
        ) : (
          <>
            <TextInput
              className="roulette-view__connect-input"
              placeholder="SOOP 채널 ID 입력"
              value={channelInput}
              onChange={(event) => setChannelInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleConnect()
              }}
            />
            <button
              type="button"
              className="roulette-view__connect-link"
              onClick={handleConnect}
              disabled={!baseUrl}
            >
              연결
            </button>
          </>
        )}
      </div>

      <IconButton
        aria-label="제출 편집 패널 열기"
        className="roulette-view__edit-trigger"
        onClick={() => setEditOpen(true)}
      >
        <Pencil size={22} />
      </IconButton>

      <div className="roulette-view__stage-wrap">
        <h1 className="roulette-view__title">채팅 랜덤 룰렛</h1>

        {showStage ? (
          <>
            <div className="roulette-stage">
              {collector.phase === 'spinning' ? (
                <RouletteReel
                  entries={collector.candidatePool}
                  sfxVolume={sfxVolume}
                  onFinish={collector.recordWinner}
                />
              ) : lastWinner ? (
                <RouletteResult winner={lastWinner} />
              ) : null}
            </div>

            {collector.phase === 'result' ? (
              <>
                <div className="roulette-view__result-actions">
                  <Button
                    onClick={collector.startSpin}
                    disabled={collector.candidatePool.length === 0}
                  >
                    다시 돌리기
                  </Button>
                  <Button variant="secondary" onClick={collector.recollect}>
                    채팅 재수집
                  </Button>
                </div>

                {collector.winners.length > 0 ? (
                  <p className="roulette-view__winners">
                    당첨:{' '}
                    {collector.winners.map((winner) => winner.nickname ?? '(수동 제출)').join(', ')}
                  </p>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <>
            <CollectionControls
              connected={connected}
              phase={collector.phase}
              timerSeconds={collector.timerSeconds}
              onTimerSecondsChange={collector.setTimerSeconds}
              remainingSeconds={collector.remainingSeconds}
              onExtendTime={collector.extendTime}
              allowDuplicates={collector.allowDuplicates}
              onAllowDuplicatesChange={collector.setAllowDuplicates}
              submittedCount={collector.entries.length}
              canSpin={collector.candidatePool.length > 0}
              onStartCollecting={collector.startCollecting}
              onStopCollecting={collector.stopCollecting}
              onStartSpin={collector.startSpin}
              onRecollect={collector.recollect}
            />

            {collector.phase !== 'setup' ? <CollectionLog entries={collector.entries} /> : null}
          </>
        )}
      </div>

      <Drawer open={editOpen} onClose={() => setEditOpen(false)} title="제출 편집">
        <EntryEditPanel
          entries={collector.entries}
          onAdd={collector.addManualEntry}
          onRemove={collector.removeEntry}
        />
      </Drawer>
    </div>
  )
}
