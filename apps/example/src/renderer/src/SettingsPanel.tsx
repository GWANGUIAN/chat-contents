import { useAppSettings, useWindowMode } from '@chat-contents/app-settings'
import { speakSample, useTtsVoices } from '@chat-contents/tts'
import {
  Button,
  Dropdown,
  Maximize,
  Panel,
  Slider,
  Switch,
  Volume2,
  VolumeX,
} from '@chat-contents/ui'

const AUTO_VOICE_OPTION = { value: '', label: '자동 (한국어 우선)' }

export function SettingsPanel() {
  const { settings, setSetting } = useAppSettings()
  const windowMode = useWindowMode(settings)
  const ttsVoices = useTtsVoices()

  const resolutionOptions = windowMode.resolutions.map((resolution, index) => ({
    value: String(index),
    label: resolution.label,
  }))

  const ttsVoiceOptions = [
    AUTO_VOICE_OPTION,
    ...ttsVoices.map((voice) => ({
      value: voice.voiceURI,
      label: `${voice.name} (${voice.lang})`,
    })),
  ]

  const handleTestTts = () => {
    speakSample({
      volume: settings?.ttsVolume ?? 70,
      voiceURI: settings?.ttsVoice ?? '',
      readNickname: settings?.ttsReadNickname ?? true,
    })
  }

  return (
    <div className="settings-panel">
      <Slider
        label="배경음악 볼륨"
        value={settings?.bgmVolume ?? 0}
        onChange={(value) => setSetting('bgmVolume', value)}
        icon={settings?.bgmVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        formatValue={(value) => `${Math.round(value)}%`}
      />
      <Slider
        label="효과음 볼륨"
        value={settings?.sfxVolume ?? 0}
        onChange={(value) => setSetting('sfxVolume', value)}
        icon={settings?.sfxVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        formatValue={(value) => `${Math.round(value)}%`}
      />

      <Panel variant="subtle" className="settings-panel__group">
        <span className="settings-panel__group-title">화면 설정</span>

        <div className="settings-panel__section">
          <span className="settings-panel__section-label settings-panel__section-label--lg">
            창 모드
          </span>
          <div className="settings-panel__row">
            <Button
              className="settings-panel__group-button"
              variant={windowMode.fullscreen ? 'secondary' : 'primary'}
              onClick={() => windowMode.setFullscreen(false)}
            >
              창모드
            </Button>
            <Button
              className="settings-panel__group-button"
              variant={windowMode.fullscreen ? 'primary' : 'secondary'}
              onClick={() => windowMode.setFullscreen(true)}
            >
              <Maximize size={18} />
              전체화면
            </Button>
          </div>
        </div>

        <div className="settings-panel__section">
          <span className="settings-panel__section-label settings-panel__section-label--lg">
            해상도
          </span>
          <Dropdown
            aria-label="해상도"
            className="settings-panel__resolution-dropdown"
            options={resolutionOptions}
            value={String(windowMode.resolutionIndex)}
            disabled={windowMode.fullscreen}
            onValueChange={(value) => windowMode.setResolutionIndex(Number(value))}
          />
        </div>

        <Button className="settings-panel__group-apply" onClick={windowMode.apply}>
          화면 설정 적용
        </Button>
      </Panel>

      <div className="settings-panel__section">
        <span className="settings-panel__section-label">채팅 음성 읽기(TTS)</span>
        <div className="settings-panel__row">
          <Switch
            aria-label="채팅 음성 읽기 사용"
            checked={settings?.ttsEnabled ?? false}
            onCheckedChange={(checked) => setSetting('ttsEnabled', checked)}
          />
          <span>사용</span>
        </div>
      </div>

      <Slider
        label="TTS 볼륨"
        value={settings?.ttsVolume ?? 0}
        onChange={(value) => setSetting('ttsVolume', value)}
        icon={settings?.ttsVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        formatValue={(value) => `${Math.round(value)}%`}
      />

      <div className="settings-panel__section">
        <span className="settings-panel__section-label">TTS 목소리</span>
        <Dropdown
          aria-label="TTS 목소리"
          options={ttsVoiceOptions}
          value={settings?.ttsVoice ?? ''}
          onValueChange={(value) => setSetting('ttsVoice', value)}
        />
      </div>

      <div className="settings-panel__section">
        <span className="settings-panel__section-label">닉네임 함께 읽기</span>
        <div className="settings-panel__row">
          <Switch
            aria-label="닉네임 함께 읽기"
            checked={settings?.ttsReadNickname ?? true}
            onCheckedChange={(checked) => setSetting('ttsReadNickname', checked)}
          />
          <span>사용</span>
        </div>
      </div>

      <Button variant="secondary" onClick={handleTestTts}>
        테스트 음성 재생
      </Button>
    </div>
  )
}
