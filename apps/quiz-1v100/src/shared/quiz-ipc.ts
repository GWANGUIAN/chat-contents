import type { QuizQuestion } from './quiz-types'

/**
 * 이 앱 전용 로컬 IPC 채널. 공용 @chat-contents/electron-shared의 ipc-contract.ts와는
 * 완전히 분리된, 문제 은행(질문 CRUD + 기본 답변 제한시간)만을 위한 두 번째 브릿지입니다.
 * window.quizApi로 노출되며(preload/quiz-preload-api.ts), 여러 앱이 공유하는 설정이
 * 아니라 이 앱에만 필요한 데이터라 공용 패키지를 건드리지 않습니다.
 */
export const QUIZ_IPC = {
  questionsGetAll: 'quiz:questions:getAll',
  questionsSetAll: 'quiz:questions:setAll',
  answerSecondsGet: 'quiz:answerSeconds:get',
  answerSecondsSet: 'quiz:answerSeconds:set',
} as const

export interface QuizQuestionsSetAllRequest {
  questions: QuizQuestion[]
}

export interface QuizAnswerSecondsSetRequest {
  value: number
}
