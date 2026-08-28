import {
  DotGradientBackground,
  IconButton,
  Settings,
  SlideInPanel,
  ThemeProvider,
} from '@chat-contents/ui'
import { useEffect, useRef, useState } from 'react'
import { ChatTestPanel } from './ChatTestPanel'
import { SettingsPanel } from './SettingsPanel'

/** 스트리머별로 이 값만 바꾸면 전체 UI 색상이 따라옵니다. */
const ACCENT_COLOR = '#ff6fae'

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatProxyPort, setChatProxyPort] = useState<number | null>(null)
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    void window.api.chatProxy.getPort().then(setChatProxyPort)
  }, [])

  return (
    <ThemeProvider accent={ACCENT_COLOR}>
      <DotGradientBackground />
      <div className="app-shell">
        <ChatTestPanel baseUrl={chatProxyPort ? `http://127.0.0.1:${chatProxyPort}` : null} />

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
    </ThemeProvider>
  )
}
