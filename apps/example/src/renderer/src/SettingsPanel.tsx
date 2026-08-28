import { Button, Dropdown, Maximize, Slider, Volume2, VolumeX } from '@chat-contents/ui'
import { useEffect, useState } from 'react'

interface ResolutionOption {
  label: string
  width: number
  height: number
}

const RESOLUTIONS: ResolutionOption[] = [
  { label: '1280 x 720', width: 1280, height: 720 },
  { label: '1600 x 900', width: 1600, height: 900 },
  { label: '1920 x 1080', width: 1920, height: 1080 },
]

const RESOLUTION_OPTIONS = RESOLUTIONS.map((resolution, index) => ({
  value: String(index),
  label: resolution.label,
}))

export function SettingsPanel() {
  const [bgmVolume, setBgmVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(70)
  const [fullscreen, setFullscreen] = useState(false)
  const [resolutionIndex, setResolutionIndex] = useState(0)

  useEffect(() => {
    void window.api.settings.getAll().then((settings) => {
      setBgmVolume(settings.bgmVolume)
      setSfxVolume(settings.sfxVolume)
      setFullscreen(settings.windowMode === 'fullscreen')
      const matchedIndex = RESOLUTIONS.findIndex(
        (option) =>
          option.width === settings.resolution.width &&
          option.height === settings.resolution.height,
      )
      if (matchedIndex >= 0) setResolutionIndex(matchedIndex)
    })
  }, [])

  const handleBgmChange = (value: number) => {
    setBgmVolume(value)
    void window.api.settings.set('bgmVolume', value)
  }

  const handleSfxChange = (value: number) => {
    setSfxVolume(value)
    void window.api.settings.set('sfxVolume', value)
  }

  const applyWindowSettings = () => {
    void window.api.window.setFullscreen(fullscreen)
    if (!fullscreen) {
      const resolution = RESOLUTIONS[resolutionIndex]
      if (resolution) {
        void window.api.window.setResolution({ width: resolution.width, height: resolution.height })
      }
    }
  }

  return (
    <div className="settings-panel">
      <Slider
        label="배경음악 볼륨"
        value={bgmVolume}
        onChange={handleBgmChange}
        icon={bgmVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        formatValue={(value) => `${Math.round(value)}%`}
      />
      <Slider
        label="효과음 볼륨"
        value={sfxVolume}
        onChange={handleSfxChange}
        icon={sfxVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        formatValue={(value) => `${Math.round(value)}%`}
      />

      <div className="settings-panel__section">
        <span className="settings-panel__section-label">창 모드</span>
        <div className="settings-panel__row">
          <Button
            variant={fullscreen ? 'secondary' : 'primary'}
            onClick={() => setFullscreen(false)}
          >
            창모드
          </Button>
          <Button
            variant={fullscreen ? 'primary' : 'secondary'}
            onClick={() => setFullscreen(true)}
          >
            <Maximize size={22} />
            전체화면
          </Button>
        </div>
      </div>

      <div className="settings-panel__section">
        <span className="settings-panel__section-label">해상도</span>
        <Dropdown
          aria-label="해상도"
          options={RESOLUTION_OPTIONS}
          value={String(resolutionIndex)}
          disabled={fullscreen}
          onValueChange={(value) => setResolutionIndex(Number(value))}
        />
      </div>

      <Button onClick={applyWindowSettings}>적용</Button>
    </div>
  )
}
