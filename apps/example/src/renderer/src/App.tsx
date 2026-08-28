import {
  ArrowLeft,
  DotGradientBackground,
  IconButton,
  Settings,
  SlideInPanel,
  ThemeProvider,
  ToastProvider,
} from '@chat-contents/ui'
import { useEffect, useRef, useState } from 'react'
import { ChatTestPanel } from './ChatTestPanel'
import { OnboardingFlow } from './OnboardingFlow'
import { SettingsPanel } from './SettingsPanel'

/** 온보딩을 다시 보여줄지 여부를 이 브라우저 로컬 저장소에만 기록합니다(앱 전용 값이라
 * electron-shared의 공통 AppSettings에는 넣지 않습니다 — CLAUDE.md 참고). */
const ONBOARDING_STORAGE_KEY = 'chat-contents-example:onboarding-complete'

/** 스트리머별로 이 값만 바꾸면 전체 UI 색상이 따라옵니다. */
const ACCENT_COLOR = '#10B981'

const ACCENT_SOFT = '#E6F7ED'
const ACCENT_SOFTER = '#F0FDF4'

/**
 * accent에서 자동 파생되는 대신 정확히 맞춰야 하는 브랜드 그린 팔레트(Tailwind emerald
 * 스케일 기준: accent=emerald-500, accentHover=600, accentText=700, accentBorder=800).
 * 원래 tokens.css의 배경/그림자/보더는 핑크 잉크(#3d0f2c 계열)에서 파생돼 있어, 같은
 * 구조를 유지하되 emerald-900(#064E3B)을 잉크로, emerald-400(#34D399)을 그림자 톤으로 써서
 * 그린 계열로 맞췄습니다.
 */
const THEME_TOKENS = {
  accentHover: '#059669',
  accentSoft: ACCENT_SOFT,
  accentSofter: ACCENT_SOFTER,
  accentText: '#047857',
  accentBorder: '#065F46',
  textPrimary: '#191C1A',
  textSecondary: '#4A5D53',
  textMuted: '#82978A',
  surfacePanel: '#FFFFFF',
  surfacePanelAlt: '#F6F9F7',
  surfaceInput: '#FFFFFF',
  bgBase: '#FAFFFC',
  bgGradient1: '#F7FEFB',
  bgGradient2: ACCENT_SOFT,
  bgGradient3: ACCENT_SOFTER,
  shadowColor: '52, 211, 153',
  borderFaint: '#064E3B0f',
  borderDefault: '#064E3B1c',
  borderStrong: '#064E3B30',
  backdrop: '#064E3B99',
}

const FONT_FAMILY =
  "'Paperozi', 'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif"

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatProxyPort, setChatProxyPort] = useState<number | null>(null)
  const [onboardingComplete, setOnboardingComplete] = useState(
    () => localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true',
  )
  const [initialChannelId, setInitialChannelId] = useState<string | null>(null)
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    void window.api.chatProxy.getPort().then(setChatProxyPort)
  }, [])

  const handleOnboardingComplete = (channelId: string | null) => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    setInitialChannelId(channelId)
    setOnboardingComplete(true)
  }

  return (
    <ThemeProvider accent={ACCENT_COLOR} fontFamily={FONT_FAMILY} tokens={THEME_TOKENS}>
      <ToastProvider>
        <DotGradientBackground />
        <div className="app-shell">
          {onboardingComplete ? (
            <>
              <ChatTestPanel
                baseUrl={chatProxyPort ? `http://127.0.0.1:${chatProxyPort}` : null}
                initialChannelId={initialChannelId}
              />

              <IconButton
                aria-label="온보딩으로 돌아가기"
                className="app-shell__back-trigger"
                onClick={() => setOnboardingComplete(false)}
              >
                <ArrowLeft size={24} />
              </IconButton>

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
            </>
          ) : (
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          )}
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
