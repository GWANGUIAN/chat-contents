import { useEffect, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ가나다라마바사아자차카타파하0123456789'
const FRAME_MS = 40

export interface ScrambleTextProps {
  text: string
  durationMs?: number
}

/** 왼쪽부터 한 글자씩 확정되며, 아직 확정되지 않은 나머지 글자는 무작위 문자로 계속 바뀌는 "디코딩" 연출. */
export function ScrambleText({ text, durationMs = 700 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(() => scramble(text, 1))

  useEffect(() => {
    let frame = 0
    const totalFrames = Math.max(6, Math.round(durationMs / FRAME_MS))
    setDisplay(scramble(text, 0))
    const interval = setInterval(() => {
      frame += 1
      setDisplay(scramble(text, frame / totalFrames))
      if (frame >= totalFrames) clearInterval(interval)
    }, FRAME_MS)
    return () => clearInterval(interval)
  }, [text, durationMs])

  return <span className="scramble-text">{display}</span>
}

function scramble(text: string, progress: number): string {
  const revealCount = Math.floor(text.length * Math.min(1, Math.max(0, progress)))
  return text
    .split('')
    .map((char, index) => {
      if (char === ' ') return ' '
      if (index < revealCount) return char
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? '?'
    })
    .join('')
}
