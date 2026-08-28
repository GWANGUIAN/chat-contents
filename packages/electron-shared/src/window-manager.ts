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
  /** 사용자가 창 테두리를 드래그해도 이 크기 밑으로는 줄어들지 않도록 하는 하한. 미지정 시 제한 없음. */
  minWidth?: number
  minHeight?: number
  /** 작업표시줄/타이틀바 아이콘으로 쓸 이미지의 절대 경로. resolveAppIcon()으로 구한 경로를 전달하세요. */
  iconPath?: string
}

export function createMainWindow(options: CreateMainWindowOptions): BrowserWindow {
  const { settings } = options
  const win = new BrowserWindow({
    width: settings.resolution.width,
    height: settings.resolution.height,
    minWidth: options.minWidth,
    minHeight: options.minHeight,
    icon: options.iconPath,
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
