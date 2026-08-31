export type GamePhase =
  | 'setup'
  | 'recruiting'
  | 'ready'
  | 'question'
  | 'hostPick'
  /** "정답 공개" 버튼을 눌러 정답을 먼저 보여주고, "정답자 공개" 버튼을 눌러야 다음(reveal)으로 넘어갑니다. */
  | 'answerReveal'
  | 'reveal'
  | 'roundResult'
  | 'winner'
  | 'gameOver'

export interface Participant {
  /** ChatUser.id, 스트리머는 리터럴 'host'. */
  id: string
  nickname: string
  isHost: boolean
  alive: boolean
  /** 1-based 라운드 번호. 탈락한 적 없으면 null. */
  eliminatedAtRound: number | null
}

export type RoundStatus = 'pending' | 'correct' | 'wrong'

export interface PresetOption {
  id: string
  label: string
  count: number
}

export const DEFAULT_PRESETS: PresetOption[] = [
  { id: 'p10', label: '1대10', count: 10 },
  { id: 'p20', label: '1대20', count: 20 },
  { id: 'p30', label: '1대30', count: 30 },
  { id: 'p50', label: '1대50', count: 50 },
  { id: 'p100', label: '1대100', count: 100 },
]

export type NextAction = 'nextRound' | 'rematch' | 'winner' | 'gameOver'

export function formatMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
