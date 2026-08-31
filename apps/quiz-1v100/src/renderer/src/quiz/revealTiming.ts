export interface RevealChunk {
  participantIds: string[]
  delayMs: number
}

const REVEAL_TICK_MS = 200
/** 이 값 초과 생존자는 순차 연출 없이 한번에 동시 공개합니다(1명씩 공개하면 100명 기준 ~6.7초로 라이브에 너무 느림). */
const SIMULTANEOUS_THRESHOLD = 30
/** 임계값 이하일 때 200ms마다 최대 이 명수씩 순차 공개합니다(30명 기준 최악 2000ms). */
const CHUNK_SIZE = 3

/** aliveIds는 호출 전에 셔플해서 넘기세요(그리드 위치는 그대로 두고 공개 순서만 랜덤화). */
export function buildRevealPlan(aliveIds: string[]): RevealChunk[] {
  if (aliveIds.length === 0) return []
  if (aliveIds.length > SIMULTANEOUS_THRESHOLD) {
    return [{ participantIds: aliveIds, delayMs: 0 }]
  }
  const chunks: RevealChunk[] = []
  for (let i = 0; i < aliveIds.length; i += CHUNK_SIZE) {
    chunks.push({
      participantIds: aliveIds.slice(i, i + CHUNK_SIZE),
      delayMs: (i / CHUNK_SIZE) * REVEAL_TICK_MS,
    })
  }
  return chunks
}

/** Fisher–Yates. 공개 순서에 서스펜스를 주기 위해 reveal 진입 시 한 번만 계산해서 씁니다. */
export function shuffle<T>(input: T[]): T[] {
  const result = input.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = result[i]
    const b = result[j]
    if (a === undefined || b === undefined) continue
    result[i] = b
    result[j] = a
  }
  return result
}
