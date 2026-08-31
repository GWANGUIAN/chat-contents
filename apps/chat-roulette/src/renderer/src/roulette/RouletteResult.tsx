import { useEffect, useState } from 'react'
import type { RouletteEntry } from './types'

export interface RouletteResultProps {
  winner: RouletteEntry
}

/** 당첨 확정 화면. 채팅 내용이 먼저 보이고, 살짝 텀을 두고 닉네임이 추가로 나타납니다. */
export function RouletteResult({ winner }: RouletteResultProps) {
  const [showNickname, setShowNickname] = useState(false)

  useEffect(() => {
    setShowNickname(false)
    const timeout = window.setTimeout(() => setShowNickname(true), 500)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <>
      <span className="roulette-stage__text roulette-stage__text--result">"{winner.text}"</span>
      {winner.nickname ? (
        <p className={`roulette-stage__by ${showNickname ? 'roulette-stage__by--visible' : ''}`}>
          by {winner.nickname}
        </p>
      ) : null}
    </>
  )
}
