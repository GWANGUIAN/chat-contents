/** main/preload/renderer 공용 타입. 워크스페이스 패키지가 아닌 이 앱 전용 로컬 소스입니다. */

export type QuestionKind = 'choice' | 'short'

export interface ChoiceQuestion {
  id: string
  kind: 'choice'
  prompt: string
  /** 채팅 명령 "!<n>"은 1-based index로 이 배열을 가리킵니다. */
  options: string[]
  /** 0-based. */
  correctOptionIndex: number
}

export interface ShortAnswerQuestion {
  id: string
  kind: 'short'
  prompt: string
  /** 동의어를 여러 개 등록할 수 있습니다(정규화 후 완전 일치 비교). */
  acceptedAnswers: string[]
}

export type QuizQuestion = ChoiceQuestion | ShortAnswerQuestion
