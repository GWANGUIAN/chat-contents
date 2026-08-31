import type { ChatStreamStatus } from '@chat-contents/chat-client'
import { useChatStream } from '@chat-contents/chat-client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RouletteEntry, RoulettePhase } from './types'

export interface UseChatCollectorOptions {
  baseUrl: string | null
}

export interface UseChatCollectorResult {
  channelId: string | null
  status: ChatStreamStatus
  error: string | null
  connect: (channelId: string) => void

  phase: RoulettePhase
  entries: RouletteEntry[]
  winners: RouletteEntry[]
  /** 아직 당첨되지 않은 응모 목록. 룰렛을 돌릴 때 이 풀에서만 뽑습니다. */
  candidatePool: RouletteEntry[]
  allowDuplicates: boolean
  setAllowDuplicates: (value: boolean) => void
  timerSeconds: number
  setTimerSeconds: (value: number) => void
  remainingSeconds: number
  /** 수집 중일 때만 남은 시간에 초를 더합니다(그 외에는 무시). */
  extendTime: (seconds: number) => void

  startCollecting: () => void
  stopCollecting: () => void
  addManualEntry: (text: string) => void
  removeEntry: (id: string) => void
  recollect: () => void
  startSpin: () => void
  recordWinner: (entry: RouletteEntry) => void
}

const DEFAULT_TIMER_SECONDS = 60

export function useChatCollector(options: UseChatCollectorOptions): UseChatCollectorResult {
  const { baseUrl } = options

  const [channelId, setChannelId] = useState<string | null>(null)
  const { status, error, messages } = useChatStream({ baseUrl, channelId, maxMessages: 500 })

  const [phase, setPhase] = useState<RoulettePhase>('setup')
  const [entries, setEntries] = useState<RouletteEntry[]>([])
  const [winners, setWinners] = useState<RouletteEntry[]>([])
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS)
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_TIMER_SECONDS)

  const processedCountRef = useRef(0)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const connect = useCallback((next: string) => {
    const trimmed = next.trim()
    setChannelId(trimmed ? trimmed : null)
  }, [])

  // "!"로 시작하는 채팅을 응모로 편입시킵니다. collecting 상태일 때 새로 도착한
  // 메시지만 처리하고, 그 외 구간에 쌓인 메시지는 재개돼도 소급 반영하지 않습니다.
  useEffect(() => {
    if (messages.length < processedCountRef.current) {
      processedCountRef.current = 0
    }
    if (phase !== 'collecting') {
      processedCountRef.current = messages.length
      return
    }
    const newMessages = messages.slice(processedCountRef.current)
    processedCountRef.current = messages.length

    for (const message of newMessages) {
      if (message.type !== 'message') continue
      const trimmedText = message.text.trim()
      if (!trimmedText.startsWith('!')) continue
      const text = trimmedText.slice(1).trim()
      if (!text) continue
      const nickname = message.user.nickname?.trim()
      if (!nickname) continue
      const userId = message.user.id

      setEntries((prev) => {
        if (!allowDuplicates && prev.some((entry) => entry.userId === userId)) return prev
        const entry: RouletteEntry = {
          id: crypto.randomUUID(),
          nickname,
          text,
          userId,
          source: 'chat',
          at: message.at,
        }
        return [...prev, entry]
      })
    }
  }, [messages, phase, allowDuplicates])

  // 수집 중일 때만 1초 간격 카운트다운을 돌립니다.
  useEffect(() => {
    if (phase !== 'collecting') return
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  // 카운트다운이 0에 도달하면 자동으로 수집을 종료합니다.
  useEffect(() => {
    if (phase === 'collecting' && remainingSeconds === 0) {
      setPhase('ready')
    }
  }, [phase, remainingSeconds])

  const startCollecting = useCallback(() => {
    processedCountRef.current = messages.length
    setEntries([])
    setWinners([])
    setRemainingSeconds(timerSeconds)
    setPhase('collecting')
  }, [messages.length, timerSeconds])

  const stopCollecting = useCallback(() => {
    if (phaseRef.current === 'collecting') setPhase('ready')
  }, [])

  const extendTime = useCallback((seconds: number) => {
    if (phaseRef.current !== 'collecting') return
    setRemainingSeconds((prev) => Math.min(600, prev + seconds))
  }, [])

  const addManualEntry = useCallback((text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) return
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: trimmedText,
        userId: `manual:${crypto.randomUUID()}`,
        source: 'manual',
        at: Date.now(),
      },
    ])
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    setWinners((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  const recollect = useCallback(() => {
    setEntries([])
    setWinners([])
    setRemainingSeconds(timerSeconds)
    setPhase('setup')
  }, [timerSeconds])

  const candidatePool = useMemo(
    () => entries.filter((entry) => !winners.some((winner) => winner.id === entry.id)),
    [entries, winners],
  )

  const startSpin = useCallback(() => {
    if (candidatePool.length === 0) return
    setPhase('spinning')
  }, [candidatePool.length])

  const recordWinner = useCallback((entry: RouletteEntry) => {
    setWinners((prev) => [...prev, entry])
    setPhase('result')
  }, [])

  return {
    channelId,
    status,
    error,
    connect,
    phase,
    entries,
    winners,
    candidatePool,
    allowDuplicates,
    setAllowDuplicates,
    timerSeconds,
    setTimerSeconds,
    remainingSeconds,
    extendTime,
    startCollecting,
    stopCollecting,
    addManualEntry,
    removeEntry,
    recollect,
    startSpin,
    recordWinner,
  }
}
