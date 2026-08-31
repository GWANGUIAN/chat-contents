import { useCallback, useEffect, useState } from 'react'
import type { QuizQuestion } from '../../../shared/quiz-types'

export interface UseQuestionBankResult {
  questions: QuizQuestion[] | null
  defaultAnswerSeconds: number | null
  addQuestion: (question: QuizQuestion) => void
  updateQuestion: (question: QuizQuestion) => void
  removeQuestion: (id: string) => void
  setDefaultAnswerSeconds: (value: number) => void
}

/** window.quizApi(이 앱 전용 로컬 IPC)를 감싸는 훅. useAppSettings()와 동일한 모양입니다. */
export function useQuestionBank(): UseQuestionBankResult {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [defaultAnswerSeconds, setDefaultAnswerSecondsState] = useState<number | null>(null)

  useEffect(() => {
    void window.quizApi.questions.getAll().then(setQuestions)
    void window.quizApi.answerSeconds.get().then(setDefaultAnswerSecondsState)
  }, [])

  const addQuestion = useCallback((question: QuizQuestion) => {
    setQuestions((prev) => {
      const next = [...(prev ?? []), question]
      void window.quizApi.questions.setAll(next)
      return next
    })
  }, [])

  const updateQuestion = useCallback((question: QuizQuestion) => {
    setQuestions((prev) => {
      const next = (prev ?? []).map((q) => (q.id === question.id ? question : q))
      void window.quizApi.questions.setAll(next)
      return next
    })
  }, [])

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const next = (prev ?? []).filter((q) => q.id !== id)
      void window.quizApi.questions.setAll(next)
      return next
    })
  }, [])

  const setDefaultAnswerSeconds = useCallback((value: number) => {
    setDefaultAnswerSecondsState(value)
    void window.quizApi.answerSeconds.set(value)
  }, [])

  return {
    questions,
    defaultAnswerSeconds,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setDefaultAnswerSeconds,
  }
}
