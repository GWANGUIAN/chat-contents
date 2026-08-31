import { useEffect, useRef, useState } from 'react'
import { playRevealChime, playSpinTick } from './rouletteSfx'
import type { RouletteEntry } from './types'

export interface RouletteReelProps {
  /** 아직 당첨되지 않은 제출 풀. 여기서 하나를 뽑아 당첨시킵니다. */
  entries: RouletteEntry[]
  sfxVolume: number
  onFinish: (winner: RouletteEntry) => void
}

const MIN_DELAY_MS = 70
const MAX_DELAY_MS = 420
const FLIP_COUNT = 22
const SETTLE_DELAY_MS = 500

function easeInQuad(t: number): number {
  return t * t
}

function flipDelay(step: number): number {
  const t = FLIP_COUNT <= 1 ? 1 : step / (FLIP_COUNT - 1)
  return MIN_DELAY_MS + (MAX_DELAY_MS - MIN_DELAY_MS) * easeInQuad(t)
}

function pickRandom(entries: RouletteEntry[]): RouletteEntry {
  return entries[Math.floor(Math.random() * entries.length)] as RouletteEntry
}

/**
 * 채팅 하나만 크게 보이는 룰렛. 화면 전환과 틱 소리를 같은 타이머 콜백에서 함께
 * 트리거해서 속도가 서로 어긋나지 않게 합니다(CSS 애니메이션과 별도 오디오 루프를
 * 따로 굴리면 둘의 속도가 miss-sync 나기 쉽습니다).
 */
export function RouletteReel({ entries, sfxVolume, onFinish }: RouletteReelProps) {
  const winnerRef = useRef<RouletteEntry>(pickRandom(entries))
  const sfxVolumeRef = useRef(sfxVolume)
  sfxVolumeRef.current = sfxVolume
  const [display, setDisplay] = useState<RouletteEntry>(() => pickRandom(entries))
  const [flipKey, setFlipKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    let step = 0

    const runStep = () => {
      if (cancelled) return
      const isLast = step === FLIP_COUNT - 1
      const next = isLast ? winnerRef.current : pickRandom(entries)
      setDisplay(next)
      setFlipKey((key) => key + 1)
      playSpinTick(sfxVolumeRef.current)

      if (isLast) {
        window.setTimeout(() => {
          if (cancelled) return
          playRevealChime(sfxVolumeRef.current)
          onFinish(winnerRef.current)
        }, SETTLE_DELAY_MS)
        return
      }
      step += 1
      window.setTimeout(runStep, flipDelay(step))
    }

    const initialTimeout = window.setTimeout(runStep, flipDelay(0))
    return () => {
      cancelled = true
      window.clearTimeout(initialTimeout)
    }
    // entries/onFinish는 마운트 시점 스냅샷으로만 진행합니다 — 편집 서랍은 언제든 열 수
    // 있게 했기 때문에 스핀 도중 풀이 바뀌어도 이미 시작된 회전을 재시작하지 않습니다
    // (재스핀은 이 컴포넌트가 통째로 새로 마운트되므로 그때 새 풀을 반영합니다).
  }, [])

  return (
    <span key={flipKey} className="roulette-stage__text">
      {display.text}
    </span>
  )
}
