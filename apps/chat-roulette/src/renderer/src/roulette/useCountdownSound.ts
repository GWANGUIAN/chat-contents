import { useEffect, useRef } from 'react'
import tickingUrl from '../assets/ticking.mp3'
import { playCountdownUrgent, playCountdownWarn } from './rouletteSfx'
import type { RoulettePhase } from './types'

/**
 * 수집 카운트다운 전용 사운드. 수집 중(phase === 'collecting')에는 ticking.mp3를 계속
 * 반복 재생하고, 남은 시간이 10초 이하로 들어오면 매초 경고음을 겹쳐 울립니다
 * (6~10초: 경고음 1회, 5초 이하: 더 급박한 2연타). 둘 다 sfxVolume을 따릅니다.
 */
export function useCountdownSound(
  phase: RoulettePhase,
  remainingSeconds: number,
  sfxVolume: number,
): void {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(tickingUrl)
    audio.loop = true
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = Math.max(0, Math.min(1, sfxVolume / 100))
  }, [sfxVolume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (phase === 'collecting') {
      audio.currentTime = 0
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'collecting' || remainingSeconds <= 0 || remainingSeconds > 10) return
    if (remainingSeconds <= 5) {
      playCountdownUrgent(sfxVolume)
    } else {
      playCountdownWarn(sfxVolume)
    }
  }, [phase, remainingSeconds, sfxVolume])
}
