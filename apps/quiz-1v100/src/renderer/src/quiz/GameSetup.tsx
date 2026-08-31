import type { ChatStreamStatus } from '@chat-contents/chat-client'
import {
  Button,
  NumberInput,
  Panel,
  Pencil,
  Switch,
  TextInput,
  Title,
  Wifi,
} from '@chat-contents/ui'
import { useState } from 'react'
import { PresetPicker } from './PresetPicker'

export interface GameSetupProps {
  chatStatus: ChatStreamStatus
  chatError: string | null
  onConnect: (channelId: string) => void
  targetCount: number
  onTargetCountChange: (n: number) => void
  hostParticipates: boolean
  onHostParticipatesChange: (v: boolean) => void
  hostNickname: string
  onHostNicknameChange: (v: string) => void
  answerSeconds: number
  onAnswerSecondsChange: (v: number) => void
  onStartRecruiting: () => void
  onOpenQuestionBank: () => void
}

export function GameSetup({
  chatStatus,
  chatError,
  onConnect,
  targetCount,
  onTargetCountChange,
  hostParticipates,
  onHostParticipatesChange,
  hostNickname,
  onHostNicknameChange,
  answerSeconds,
  onAnswerSecondsChange,
  onStartRecruiting,
  onOpenQuestionBank,
}: GameSetupProps) {
  const [channelInput, setChannelInput] = useState('')
  const connected = chatStatus === 'connected'
  const connecting = chatStatus === 'connecting'

  return (
    <div className="game-setup">
      <Title as="h1" size="xl" tone="accent">
        1대100
      </Title>

      <Button variant="ghost" onClick={onOpenQuestionBank}>
        <Pencil size={16} />
        문제 은행 관리
      </Button>

      {!connected ? (
        <Panel className="game-setup__connect">
          <p className="game-setup__connect-label">숲(SOOP) 채널 ID를 입력하세요</p>
          <div className="game-setup__connect-row">
            <TextInput
              placeholder="채널 ID"
              value={channelInput}
              disabled={connecting}
              onChange={(event) => setChannelInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onConnect(channelInput)
              }}
            />
            <Button
              onClick={() => onConnect(channelInput)}
              disabled={connecting || !channelInput.trim()}
            >
              {connecting ? '연결 중…' : '연결'}
            </Button>
          </div>
          {chatError ? <p className="game-setup__connect-error">{chatError}</p> : null}
        </Panel>
      ) : (
        <Panel className="game-setup__form">
          <div className="game-setup__connect-status">
            <Wifi size={18} />
            채팅 연결됨
          </div>

          <div className="game-setup__section">
            <span className="game-setup__section-label">참여 인원</span>
            <PresetPicker value={targetCount} onChange={onTargetCountChange} />
          </div>

          <div className="game-setup__section game-setup__section--row">
            <span className="game-setup__section-label">스트리머도 참여</span>
            <Switch
              checked={hostParticipates}
              onCheckedChange={onHostParticipatesChange}
              aria-label="스트리머도 참여"
            />
          </div>

          {hostParticipates ? (
            <div className="game-setup__section">
              <span className="game-setup__section-label">스트리머 닉네임</span>
              <TextInput
                placeholder="스트리머"
                value={hostNickname}
                onChange={(event) => onHostNicknameChange(event.target.value)}
              />
            </div>
          ) : null}

          <div className="game-setup__section">
            <NumberInput
              label="답변 제한시간"
              value={answerSeconds}
              min={5}
              max={60}
              unit="초"
              onChange={onAnswerSecondsChange}
            />
          </div>

          <Button onClick={onStartRecruiting}>참여자 모집 시작</Button>
        </Panel>
      )}
    </div>
  )
}
