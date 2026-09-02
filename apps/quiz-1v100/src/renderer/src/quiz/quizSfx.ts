/**
 * 퀴즈 효과음을 전부 실시간 합성으로 만듭니다(오디오 파일 없음).
 * apps/chat-roulette/src/renderer/src/roulette/rouletteSfx.ts와 동일한 접근입니다.
 */

let audioContext: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioContext) {
    const AudioContextCtor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) {
      throw new Error('이 환경에서는 AudioContext를 사용할 수 없습니다.')
    }
    audioContext = new AudioContextCtor()
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
  return audioContext
}

function normalizedGain(sfxVolume: number, base: number): number {
  return Math.max(0, Math.min(1, sfxVolume / 100)) * base
}

function tone(
  freq: number,
  startOffset: number,
  duration: number,
  gainValue: number,
  type: OscillatorType,
): void {
  const ctx = getCtx()
  const start = ctx.currentTime + startOffset
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = freq
  gain.gain.setValueAtTime(gainValue, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration)
}

/** 라운드/문제가 새로 시작될 때 나는 짧은 시작음. */
export function playRoundStart(sfxVolume: number): void {
  tone(523.25, 0, 0.12, normalizedGain(sfxVolume, 0.05), 'triangle')
  tone(659.25, 0.1, 0.14, normalizedGain(sfxVolume, 0.05), 'triangle')
}

/** 정답 공개 시 밝은 2음 차임벨. */
export function playCorrectChime(sfxVolume: number): void {
  tone(880, 0, 0.16, normalizedGain(sfxVolume, 0.06), 'sine')
  tone(1318.5, 0.06, 0.2, normalizedGain(sfxVolume, 0.06), 'sine')
}

/** 오답/탈락 시 낮은 버저음. */
export function playWrongBuzz(sfxVolume: number): void {
  tone(196, 0, 0.28, normalizedGain(sfxVolume, 0.07), 'sawtooth')
}

/** 우승 시 상승하는 4음 팡파르. */
export function playVictoryFanfare(sfxVolume: number): void {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, index) => {
    tone(freq, index * 0.14, 0.3, normalizedGain(sfxVolume, 0.07), 'triangle')
  })
}

/** "정답 공개" 클릭 시 스크램블 텍스트 연출과 함께 나는 상승형 스윕(휙 하는 소리). */
export function playAnswerRevealSting(sfxVolume: number): void {
  const ctx = getCtx()
  const start = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(220, start)
  oscillator.frequency.exponentialRampToValueAtTime(880, start + 0.35)
  gain.gain.setValueAtTime(normalizedGain(sfxVolume, 0.05), start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + 0.4)
}

/** "정답자 공개" 시작 순간, 화면 플래시와 함께 나는 묵직한 임팩트음. */
export function playRevealStart(sfxVolume: number): void {
  tone(150, 0, 0.2, normalizedGain(sfxVolume, 0.09), 'sine')
  tone(1046.5, 0.02, 0.12, normalizedGain(sfxVolume, 0.05), 'triangle')
}
