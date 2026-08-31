/**
 * 룰렛/카운트다운 효과음을 전부 실시간 합성으로 만듭니다(오디오 파일 없음).
 * 룰렛이 한 칸 넘어갈 때마다 나는 틱, 당첨 시 차임벨, 수집 카운트다운 막바지 경고음이
 * 여기 있습니다. (수집 중 계속 도는 배경 틱 소리는 오디오 파일이라 별도 —
 * useCountdownSound.ts 참고.)
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

/**
 * 룰렛이 한 칸 넘어갈 때마다 한 번씩 나는 짧은 틱. 화면이 바뀌는 시점과 같은 호출
 * 안에서 불러야 소리와 애니메이션이 어긋나지 않습니다(회전 속도와 무관하게 매 프레임
 * 전환마다 정확히 한 번씩).
 */
export function playSpinTick(sfxVolume: number): void {
  const freq = 620 + Math.random() * 180
  tone(freq, 0, 0.045, normalizedGain(sfxVolume, 0.044), 'square')
}

/** 당첨 확정 시 나는 짧고 밝은 2음 차임벨. */
export function playRevealChime(sfxVolume: number): void {
  tone(880, 0, 0.18, normalizedGain(sfxVolume, 0.06), 'sine')
  tone(1318.5, 0.07, 0.22, normalizedGain(sfxVolume, 0.06), 'sine')
}

/** 수집 남은 시간이 6~10초일 때 매초 한 번 울리는 경고음. */
export function playCountdownWarn(sfxVolume: number): void {
  tone(700, 0, 0.05, normalizedGain(sfxVolume, 0.035), 'square')
}

/** 수집 남은 시간이 5초 이하일 때 매초 울리는 더 급박한 2연타 경고음. */
export function playCountdownUrgent(sfxVolume: number): void {
  tone(1400, 0, 0.09, normalizedGain(sfxVolume, 0.08), 'square')
  tone(1400, 0.12, 0.09, normalizedGain(sfxVolume, 0.08), 'square')
}
