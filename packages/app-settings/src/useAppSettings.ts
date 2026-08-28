import type { AppSettings } from '@chat-contents/electron-shared'
import { useCallback, useEffect, useState } from 'react'

export interface UseAppSettingsResult {
  settings: AppSettings | null
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
}

export function useAppSettings(): UseAppSettingsResult {
  const [settings, setSettings] = useState<AppSettings | null>(null)

  useEffect(() => {
    void window.api.settings.getAll().then(setSettings)
    return window.api.settings.onChange(setSettings)
  }, [])

  const setSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
    void window.api.settings.set(key, value)
  }, [])

  return { settings, setSetting }
}
