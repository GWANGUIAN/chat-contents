import { BrowserWindow } from 'electron'
import type { WindowState } from './ipc-contract'
import type { AppSettings } from './settings-store'

export interface CreateMainWindowOptions {
  settings: AppSettings
  preloadPath: string
  /** electron-vite dev 서버 URL 또는 렌더러 index.html 경로. */
  loadRenderer: (win: BrowserWindow) => void
  title?: string
  /** 좌하단 톱니바퀴 등 프레임 없는 커스텀 UI를 쓸 경우 false로. 기본 true(표준 타이틀바). */
  frame?: boolean
}

export function createMainWindow(options: CreateMainWindowOptions): BrowserWindow {
  const { settings } = options
  const win = new BrowserWindow({
    width: settings.resolution.width,
    height: settings.resolution.height,
    fullscreen: settings.windowMode === 'fullscreen',
    title: options.title,
    frame: options.frame ?? true,
    backgroundColor: '#fff6fb',
    webPreferences: {
      preload: options.preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  options.loadRenderer(win)
  return win
}

export function applyWindowMode(win: BrowserWindow, mode: 'windowed' | 'fullscreen'): void {
  win.setFullScreen(mode === 'fullscreen')
}

export function applyResolution(
  win: BrowserWindow,
  resolution: { width: number; height: number },
): void {
  win.setFullScreen(false)
  win.setSize(resolution.width, resolution.height)
  win.center()
}

export function getWindowState(win: BrowserWindow): WindowState {
  const [width = 0, height = 0] = win.getSize()
  return {
    fullscreen: win.isFullScreen(),
    resolution: { width, height },
  }
}
