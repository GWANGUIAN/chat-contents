import type { AppSettings, WindowResolution } from './settings-store'

/** main/preload/renderer가 공유하는 단일 채널명 소스. 이름이 어긋나면 컴파일 에러로 잡힙니다. */
export const IPC = {
  settingsGet: 'settings:get',
  settingsSet: 'settings:set',
  settingsGetAll: 'settings:getAll',
  settingsOnChange: 'settings:onChange',
  chatProxyGetPort: 'chatProxy:getPort',
  windowSetFullscreen: 'window:setFullscreen',
  windowSetResolution: 'window:setResolution',
  windowGetState: 'window:getState',
} as const

export interface SettingsGetRequest<K extends keyof AppSettings = keyof AppSettings> {
  key: K
}

export interface SettingsSetRequest<K extends keyof AppSettings = keyof AppSettings> {
  key: K
  value: AppSettings[K]
}

export interface WindowState {
  fullscreen: boolean
  resolution: WindowResolution
}

export type { AppSettings, WindowResolution }
