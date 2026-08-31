import { useEffect, useRef } from 'react'
import bgmUrl from '../assets/bgm.mp3'

/**
 * 앱 전역에서 한 번만 마운트하는 배경음악 루프. 볼륨은 설정의 bgmVolume(0~100)을
 * 그대로 받습니다. 첫 재생은 브라우저 자동재생 정책에 걸려 막힐 수 있어(사용자 제스처
 * 이전) Promise 거부를 조용히 삼킵니다 — 이후 사용자가 화면을 클릭하는 등 상호작용하면
 * 브라우저가 알아서 허용하는 것과 무관하게, 여기서 재시도 로직을 추가로 두진 않습니다.
 */
export function useBgm(volume: number | undefined): void {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(bgmUrl)
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
    audio.volume = (volume ?? 0) / 100
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || volume === undefined || startedRef.current) return
    startedRef.current = true
    audio.play().catch(() => {})
  }, [volume])
}
