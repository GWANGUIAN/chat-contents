import { buildPreloadApi } from '@chat-contents/electron-shared/preload-api'
import { contextBridge, ipcRenderer } from 'electron'
import { buildQuizPreloadApi } from './quiz-preload-api'

contextBridge.exposeInMainWorld('api', buildPreloadApi(ipcRenderer))
contextBridge.exposeInMainWorld('quizApi', buildQuizPreloadApi(ipcRenderer))
