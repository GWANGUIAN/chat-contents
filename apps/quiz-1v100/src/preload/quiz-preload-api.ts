import type { IpcRenderer } from 'electron'
import { QUIZ_IPC } from '../shared/quiz-ipc'
import type { QuizQuestion } from '../shared/quiz-types'

export function buildQuizPreloadApi(ipcRenderer: IpcRenderer) {
  return {
    questions: {
      getAll: (): Promise<QuizQuestion[]> => ipcRenderer.invoke(QUIZ_IPC.questionsGetAll),
      setAll: (questions: QuizQuestion[]): Promise<void> =>
        ipcRenderer.invoke(QUIZ_IPC.questionsSetAll, { questions }),
    },
    answerSeconds: {
      get: (): Promise<number> => ipcRenderer.invoke(QUIZ_IPC.answerSecondsGet),
      set: (value: number): Promise<void> =>
        ipcRenderer.invoke(QUIZ_IPC.answerSecondsSet, { value }),
    },
  }
}

export type QuizApi = ReturnType<typeof buildQuizPreloadApi>
