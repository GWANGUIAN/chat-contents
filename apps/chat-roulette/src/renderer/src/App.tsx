import { useAppSettings } from '@chat-contents/app-settings'
import {
  DotGradientBackground,
  IconButton,
  Settings,
  SlideInPanel,
  ThemeProvider,
  type ThemeTokenOverrides,
  ToastProvider,
} from '@chat-contents/ui'
import { useEffect, useRef, useState } from 'react'
import { RouletteView } from './roulette/RouletteView'
import { useBgm } from './roulette/useBgm'
import { SettingsPanel } from './SettingsPanel'

/** 스트리머별로 이 값만 바꾸면 전체 UI 색상이 따라옵니다. */
const ACCENT_COLOR = '#0EA5E9' // sky-500

/**
 * accent에서 자동 파생되는 대신 정확히 맞춰야 하는 하늘색/파란색 팔레트(Tailwind sky
 * 스케일 기준: accent=sky-500, accentHover=600, accentText=700, accentBorder=800).
 * 원래 tokens.css의 배경/그림자/보더는 핑크 잉크에서 파생돼 있어, 같은 구조를 유지하되
 * sky-900(#0C4A6E)을 잉크로, sky-400(#38BDF8)을 그림자 톤으로 써서 파란 계열로 맞췄습니다.
 */
const THEME_TOKENS: ThemeTokenOverrides = {
  accentHover: '#0284C7',
  accentSoft: '#E0F2FE',
  accentSofter: '#F0F9FF',
  accentText: '#0369A1',
  accentBorder: '#075985',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  surfacePanel: '#FFFFFF',
  surfacePanelAlt: '#F8FAFC',
  surfaceInput: '#FFFFFF',
  bgBase: '#F8FBFF',
  bgGradient1: '#F0F9FF',
  bgGradient2: '#E0F2FE',
  bgGradient3: '#DBEAFE',
  dotColorAccent: '#BAE6FD',
  shadowColor: '56, 189, 248',
  borderFaint: '#0C4A6E0f',
  borderDefault: '#0C4A6E1c',
  borderStrong: '#0C4A6E30',
  backdrop: '#0C4A6E99',
}

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatProxyPort, setChatProxyPort] = useState<number | null>(null)
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)
  const { settings } = useAppSettings()

  useBgm(settings?.bgmVolume)

  useEffect(() => {
    void window.api.chatProxy.getPort().then(setChatProxyPort)
  }, [])

  return (
    <ThemeProvider accent={ACCENT_COLOR} tokens={THEME_TOKENS}>
      <ToastProvider>
        <DotGradientBackground />
        <div className="app-shell">
          <RouletteView
            baseUrl={chatProxyPort ? `http://127.0.0.1:${chatProxyPort}` : null}
            sfxVolume={settings?.sfxVolume ?? 70}
          />

          <IconButton
            ref={settingsTriggerRef}
            aria-label="설정 열기"
            className="app-shell__settings-trigger"
            onClick={() => setSettingsOpen((prev) => !prev)}
          >
            <Settings size={26} />
          </IconButton>

          <SlideInPanel
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            triggerRef={settingsTriggerRef}
            title="설정"
          >
            <SettingsPanel />
          </SlideInPanel>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
