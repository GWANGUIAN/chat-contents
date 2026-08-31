import type { QuizQuestion } from '../../../shared/quiz-types'
import type { Participant } from './types'

/** 개발 모드 전용. 라이브 채팅 없이 모집/답변 흐름을 빠르게 검증하기 위한 목업 생성기입니다. */
export function generateMockRecruitBatch(
  count: number,
  existingIds: Set<string>,
): { id: string; nickname: string }[] {
  const result: { id: string; nickname: string }[] = []
  let n = 1
  while (result.length < count) {
    const id = `mock-${crypto.randomUUID()}`
    if (!existingIds.has(id)) {
      result.push({ id, nickname: `테스트유저${n}` })
      n += 1
    }
  }
  return result
}

const WRONG_CHOICE_ANSWERS = ['1', '2', '3', '4', '5']
const WRONG_SHORT_ANSWERS = ['모르겠어요', '오답', 'ㅁㄹ', '패스']

/**
 * 생존 참가자마다: ~10%는 미제출, 나머지는 절반 확률로 정답/오답을 제출합니다.
 * 전원탈락(재경기) 시나리오까지 테스트할 수 있도록 일부러 오답 비중을 크게 뒀습니다.
 */
export function generateMockAnswerBatch(
  aliveParticipants: Participant[],
  question: QuizQuestion,
): { userId: string; command: string }[] {
  const result: { userId: string; command: string }[] = []
  for (const participant of aliveParticipants) {
    if (Math.random() < 0.1) continue

    if (Math.random() < 0.5) {
      // 정답 제출
      if (question.kind === 'choice') {
        result.push({ userId: participant.id, command: String(question.correctOptionIndex + 1) })
      } else {
        const answer = question.acceptedAnswers[0]
        if (answer) result.push({ userId: participant.id, command: answer })
      }
      continue
    }

    // 오답 제출
    if (question.kind === 'choice') {
      const wrongOptions = question.options
        .map((_, index) => String(index + 1))
        .filter((n) => n !== String(question.correctOptionIndex + 1))
      const pick = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
      result.push({ userId: participant.id, command: pick ?? WRONG_CHOICE_ANSWERS[0] ?? '1' })
    } else {
      const pick = WRONG_SHORT_ANSWERS[Math.floor(Math.random() * WRONG_SHORT_ANSWERS.length)]
      result.push({ userId: participant.id, command: pick ?? '오답' })
    }
  }
  return result
}
