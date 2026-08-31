import type { ChatProxyServerHandle } from '@chat-contents/chat-proxy'
import {
  type AppSettings,
  applyResolution,
  applyWindowMode,
  getWindowState,
  IPC,
  type SettingsStore,
  type WindowResolution,
} from '@chat-contents/electron-shared'
import { type BrowserWindow, ipcMain } from 'electron'
import {
  QUIZ_IPC,
  type QuizAnswerSecondsSetRequest,
  type QuizQuestionsSetAllRequest,
} from '../shared/quiz-ipc'
import type { QuestionStore } from './question-store'

export interface RegisterIpcHandlersOptions {
  settingsStore: SettingsStore
  chatProxyHandle: ChatProxyServerHandle
  questionStore: QuestionStore
  win: BrowserWindow
}

export function registerIpcHandlers(options: RegisterIpcHandlersOptions): void {
  const { settingsStore, chatProxyHandle, questionStore, win } = options

  ipcMain.handle(IPC.settingsGet, (_event, request: { key: keyof AppSettings }) =>
    settingsStore.get(request.key),
  )

  ipcMain.handle(IPC.settingsGetAll, () => settingsStore.getAll())

  ipcMain.handle(
    IPC.settingsSet,
    (_event, request: { key: keyof AppSettings; value: AppSettings[keyof AppSettings] }) => {
      settingsStore.set(request.key, request.value as never)
      win.webContents.send(IPC.settingsOnChange, settingsStore.getAll())
    },
  )

  ipcMain.handle(IPC.chatProxyGetPort, () => chatProxyHandle.port)

  ipcMain.handle(IPC.windowSetFullscreen, (_event, fullscreen: boolean) => {
    const mode = fullscreen ? 'fullscreen' : 'windowed'
    applyWindowMode(win, mode)
    settingsStore.set('windowMode', mode)
  })

  ipcMain.handle(IPC.windowSetResolution, (_event, resolution: WindowResolution) => {
    applyResolution(win, resolution)
    settingsStore.set('resolution', resolution)
  })

  ipcMain.handle(IPC.windowGetState, () => getWindowState(win))

  ipcMain.handle(QUIZ_IPC.questionsGetAll, () => questionStore.getAll())

  ipcMain.handle(QUIZ_IPC.questionsSetAll, (_event, request: QuizQuestionsSetAllRequest) => {
    questionStore.setAll(request.questions)
  })

  ipcMain.handle(QUIZ_IPC.answerSecondsGet, () => questionStore.getDefaultAnswerSeconds())

  ipcMain.handle(QUIZ_IPC.answerSecondsSet, (_event, request: QuizAnswerSecondsSetRequest) => {
    questionStore.setDefaultAnswerSeconds(request.value)
  })
}
