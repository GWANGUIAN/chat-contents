export { bootstrapChatProxy } from './chat-proxy-bootstrap'
export type { SettingsGetRequest, SettingsSetRequest, WindowState } from './ipc-contract'
export { IPC } from './ipc-contract'
export type { PreloadApi } from './preload-api'
export { buildPreloadApi } from './preload-api'
export type { AppSettings, SettingsStore, WindowResolution } from './settings-store'
export { createSettingsStore, DEFAULT_SETTINGS } from './settings-store'
export type { CreateMainWindowOptions } from './window-manager'
export {
  applyResolution,
  applyWindowMode,
  createMainWindow,
  getWindowState,
} from './window-manager'
