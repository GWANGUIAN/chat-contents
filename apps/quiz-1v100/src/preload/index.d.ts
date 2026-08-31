import type { PreloadApi } from '@chat-contents/electron-shared'
import type { QuizApi } from './quiz-preload-api'

declare global {
  interface Window {
    api: PreloadApi
    quizApi: QuizApi
  }
}
