import type { IpcRenderer } from 'electron'
import { type AppSettings, IPC, type WindowResolution, type WindowState } from './ipc-contract'

/**
 * 각 앱의 preload/index.ts에서 이 팩토리 결과를
 * `contextBridge.exposeInMainWorld('api', buildPreloadApi(ipcRenderer))`로 노출하면
 * 모든 앱이 동일한 window.api 표면을 얻습니다.
 */
export function buildPreloadApi(ipcRenderer: IpcRenderer) {
  return {
    settings: {
      get: <K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> =>
        ipcRenderer.invoke(IPC.settingsGet, { key }),
      set: <K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> =>
        ipcRenderer.invoke(IPC.settingsSet, { key, value }),
      getAll: (): Promise<AppSettings> => ipcRenderer.invoke(IPC.settingsGetAll),
      onChange: (callback: (settings: AppSettings) => void): (() => void) => {
        const handler = (_event: unknown, settings: AppSettings) => callback(settings)
        ipcRenderer.on(IPC.settingsOnChange, handler)
        return () => ipcRenderer.removeListener(IPC.settingsOnChange, handler)
      },
    },
    chatProxy: {
      getPort: (): Promise<number> => ipcRenderer.invoke(IPC.chatProxyGetPort),
    },
    window: {
      setFullscreen: (fullscreen: boolean): Promise<void> =>
        ipcRenderer.invoke(IPC.windowSetFullscreen, fullscreen),
      setResolution: (resolution: WindowResolution): Promise<void> =>
        ipcRenderer.invoke(IPC.windowSetResolution, resolution),
      getState: (): Promise<WindowState> => ipcRenderer.invoke(IPC.windowGetState),
    },
  }
}

export type PreloadApi = ReturnType<typeof buildPreloadApi>
