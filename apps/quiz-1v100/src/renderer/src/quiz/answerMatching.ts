import type { QuizQuestion } from '../../../shared/quiz-types'

/** trim → 내부 연속 공백을 한 칸으로 축약 → 소문자화. */
export function normalizeAnswer(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').toLowerCase()
}

/**
 * 객관식은 "!<n>"의 n(1-based)이 correctOptionIndex+1과 같은지 비교합니다.
 * 주관식은 정규화한 제출값이 acceptedAnswers 중 하나(동일하게 정규화)와 완전히
 * 일치하는지 비교합니다 — "워싱턴DC"/"워싱턴 D.C."처럼 구두점이 다른 동의어는
 * 정규화만으로 통합되지 않으므로 문제 편집 화면에서 각각 등록해야 합니다.
 */
export function isAnswerCorrect(question: QuizQuestion, rawSubmission: string): boolean {
  if (question.kind === 'choice') {
    const n = Number(rawSubmission.trim())
    return Number.isInteger(n) && n - 1 === question.correctOptionIndex
  }
  const normalized = normalizeAnswer(rawSubmission)
  return question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalized)
}
