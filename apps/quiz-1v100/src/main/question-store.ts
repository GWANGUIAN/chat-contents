import Store from 'electron-store'
import { DEFAULT_QUESTIONS } from '../shared/default-questions'
import type { QuizQuestion } from '../shared/quiz-types'

interface QuizLocalData {
  questions: QuizQuestion[]
  defaultAnswerSeconds: number
}

const DEFAULTS: QuizLocalData = {
  questions: DEFAULT_QUESTIONS,
  defaultAnswerSeconds: 10,
}

export interface QuestionStore {
  getAll(): QuizQuestion[]
  setAll(questions: QuizQuestion[]): void
  getDefaultAnswerSeconds(): number
  setDefaultAnswerSeconds(value: number): void
}

/**
 * 공용 AppSettings(모든 앱 공통 설정)와 완전히 분리된, 이 앱 전용 로컬 저장소입니다.
 * 문제 은행/기본 답변 제한시간은 다른 앱과 공유할 이유가 없는 데이터라
 * packages/electron-shared를 건드리지 않고 별도 electron-store 파일로 관리합니다.
 */
export function createQuestionStore(): QuestionStore {
  const store = new Store<QuizLocalData>({ name: 'quiz-1v100-questions', defaults: DEFAULTS })

  return {
    getAll: () => store.get('questions'),
    setAll: (questions) => store.set('questions', questions),
    getDefaultAnswerSeconds: () => store.get('defaultAnswerSeconds'),
    setDefaultAnswerSeconds: (value) => store.set('defaultAnswerSeconds', value),
  }
}
