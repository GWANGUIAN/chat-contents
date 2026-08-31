import { useAppSettings, useWindowMode } from '@chat-contents/app-settings'
import { Button, Dropdown, Maximize, Panel, Slider, Volume2, VolumeX } from '@chat-contents/ui'

export function SettingsPanel() {
  const { settings, setSetting } = useAppSettings()
  const windowMode = useWindowMode(settings)

  const resolutionOptions = windowMode.resolutions.map((resolution, index) => ({
    value: String(index),
    label: resolution.label,
  }))

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
    </div>
  )
}
