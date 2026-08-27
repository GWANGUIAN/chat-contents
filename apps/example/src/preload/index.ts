import { buildPreloadApi } from '@chat-contents/electron-shared'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', buildPreloadApi(ipcRenderer))
