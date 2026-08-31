export interface RouletteEntry {
  id: string
  /** 수동 추가 항목은 닉네임이 없습니다(제출 내용만 입력). */
  nickname?: string
  /** "!" 접두사를 뗀 실제 제출 내용. */
  text: string
  /** 채팅 유저의 ChatUser.id, 수동 추가는 `manual:${uuid}`. 중복 제출 판정에 사용. */
  userId: string
  source: 'chat' | 'manual'
  at: number
}

export type RoulettePhase = 'setup' | 'collecting' | 'ready' | 'spinning' | 'result'

export function formatMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
