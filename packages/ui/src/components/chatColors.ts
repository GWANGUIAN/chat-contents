/** 닉네임용 알록달록 팔레트. 채도/명도를 맞춰서 검은 외곽선과 같이 써도 색이 또렷하게 보입니다. */
export const NICKNAME_RAINBOW_PALETTE = [
  '#ff5c5c',
  '#ff9f40',
  '#ffd93d',
  '#6bcf63',
  '#3ddbd9',
  '#4da6ff',
  '#7c6cff',
  '#c66bff',
  '#ff6fc6',
  '#ff477e',
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/**
 * seed(메시지별 고유 키)로 팔레트에서 색을 하나 고릅니다. avoid를 주면 그 색과
 * 겹치지 않는 다음 색으로 넘어갑니다 — 채팅이 연속으로 같은 색이 되는 걸 방지.
 */
export function pickNicknameColor(seed: string, avoid?: string): string {
  const start = hashString(seed) % NICKNAME_RAINBOW_PALETTE.length
  for (let i = 0; i < NICKNAME_RAINBOW_PALETTE.length; i++) {
    const candidate = NICKNAME_RAINBOW_PALETTE[(start + i) % NICKNAME_RAINBOW_PALETTE.length]
    if (candidate !== avoid) return candidate as string
  }
  return NICKNAME_RAINBOW_PALETTE[start] as string
}
