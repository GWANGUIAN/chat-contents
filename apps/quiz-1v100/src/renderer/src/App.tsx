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
import { QuizAppShell } from './quiz/QuizAppShell'
import { SettingsPanel } from './SettingsPanel'

/** 스트리머별로 이 값만 바꾸면 전체 UI 색상이 따라옵니다. "1대100" 퀴즈쇼 느낌의 골드/앰버. */
const ACCENT_COLOR = '#F59E0B' // amber-500

/**
 * accent에서 자동 파생되는 대신 정확히 맞춰야 하는 골드/앰버 팔레트(Tailwind amber
 * 스케일 기준: accent=amber-500, accentHover=600, accentText=700, accentBorder=900).
 * 배경/그림자/보더는 amber-900을 잉크로 써서 전체를 골드 계열로 맞췄습니다.
 */
const THEME_TOKENS: ThemeTokenOverrides = {
  accentHover: '#D97706',
  accentSoft: '#FEF3C7',
  accentSofter: '#FFFBEB',
  accentText: '#B45309',
  accentBorder: '#78350F',
  textPrimary: '#1C1917',
  textSecondary: '#57534E',
  textMuted: '#A8A29E',
  surfacePanel: '#FFFFFF',
  surfacePanelAlt: '#FFFBEB',
  surfaceInput: '#FFFFFF',
  bgBase: '#FFFBEB',
  bgGradient1: '#FEF3C7',
  bgGradient2: '#FDE68A',
  bgGradient3: '#FCD34D',
  dotColorAccent: '#FDE68A',
  shadowColor: '245, 158, 11',
  borderFaint: '#78350F0f',
  borderDefault: '#78350F1c',
  borderStrong: '#78350F30',
  backdrop: '#78350F99',
}

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatProxyPort, setChatProxyPort] = useState<number | null>(null)
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)
  const { settings } = useAppSettings()

  // BGM 미탑재(v1) — src/renderer/src/assets/bgm.mp3를 추가하고
  // apps/chat-roulette/src/renderer/src/roulette/useBgm.ts를 그대로 복사해
  // 이 자리에서 useBgm(settings?.bgmVolume)을 호출하면 됩니다.

  useEffect(() => {
    void window.api.chatProxy.getPort().then(setChatProxyPort)
  }, [])

  return (
    <ThemeProvider accent={ACCENT_COLOR} tokens={THEME_TOKENS}>
      <ToastProvider>
        <DotGradientBackground />
        <div className="app-shell">
          <QuizAppShell
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
