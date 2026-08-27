import { join } from 'node:path'
import type { ChatProxyServerHandle } from '@chat-contents/chat-proxy'
import {
  bootstrapChatProxy,
  createMainWindow,
  createSettingsStore,
} from '@chat-contents/electron-shared'
import { app } from 'electron'
import { registerIpcHandlers } from './ipc-handlers'

async function bootstrap(): Promise<void> {
  await app.whenReady()

  const settingsStore = createSettingsStore('example')
  const chatProxyHandle: ChatProxyServerHandle = await bootstrapChatProxy()
  const preloadPath = join(__dirname, '../preload/index.mjs')

  const win = createMainWindow({
    settings: settingsStore.getAll(),
    preloadPath,
    title: 'Example Stream App',
    loadRenderer: (window) => {
      const devServerUrl = process.env.ELECTRON_RENDERER_URL
      if (devServerUrl) {
        void window.loadURL(devServerUrl)
      } else {
        void window.loadFile(join(__dirname, '../renderer/index.html'))
      }
    },
  })

  registerIpcHandlers({ settingsStore, chatProxyHandle, win })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

void bootstrap()
