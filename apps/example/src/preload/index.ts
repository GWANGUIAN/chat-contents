import { buildPreloadApi } from '@chat-contents/electron-shared/preload-api'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', buildPreloadApi(ipcRenderer))
