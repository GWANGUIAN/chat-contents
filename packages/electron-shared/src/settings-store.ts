import Store from 'electron-store'

export interface WindowResolution {
  width: number
  height: number
}

export interface AppSettings {
  bgmVolume: number
  sfxVolume: number
  windowMode: 'windowed' | 'fullscreen'
  resolution: WindowResolution
  ttsEnabled: boolean
  ttsVolume: number
  /** SpeechSynthesisVoice.voiceURI. 빈 문자열이면 자동 선택(한국어 음성 우선). */
  ttsVoice: string
  ttsReadNickname: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  bgmVolume: 70,
  sfxVolume: 70,
  windowMode: 'windowed',
  resolution: { width: 1280, height: 720 },
  ttsEnabled: false,
  ttsVolume: 70,
  ttsVoice: '',
  ttsReadNickname: true,
}

export interface SettingsStore {
  get<K extends keyof AppSettings>(key: K): AppSettings[K]
  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void
  getAll(): AppSettings
  onChange(listener: (settings: AppSettings) => void): () => void
}

/** appName으로 userData 하위에 독립된 설정 파일을 둡니다(예: 'example'). */
export function createSettingsStore(appName: string): SettingsStore {
  const store = new Store<AppSettings>({
    name: `${appName}-settings`,
    defaults: DEFAULT_SETTINGS,
  })

  return {
    get: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
    getAll: () => ({ ...DEFAULT_SETTINGS, ...store.store }),
    onChange: (listener) => {
      const unsubscribe = store.onDidAnyChange(() => {
        listener({ ...DEFAULT_SETTINGS, ...store.store })
      })
      return unsubscribe
    },
  }
}
