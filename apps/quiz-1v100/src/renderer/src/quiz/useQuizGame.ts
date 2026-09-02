import type { ChatStreamStatus } from '@chat-contents/chat-client'
import { useChatStream } from '@chat-contents/chat-client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { QuizQuestion } from '../../../shared/quiz-types'
import { isAnswerCorrect } from './answerMatching'
import { generateMockAnswerBatch, generateMockRecruitBatch } from './devMock'
import {
  playAnswerRevealSting,
  playCorrectChime,
  playRevealStart,
  playRoundStart,
  playWrongBuzz,
} from './quizSfx'
import { buildRevealPlan, shuffle } from './revealTiming'
import type { GamePhase, NextAction, Participant, RoundStatus } from './types'

const DEFAULT_TARGET_COUNT = 10
const FALLBACK_ANSWER_SECONDS = 10
const HOST_ID = 'host'

export interface UseQuizGameOptions {
  baseUrl: string | null
  questions: QuizQuestion[] | null
  defaultAnswerSeconds: number | null
  sfxVolume: number
}

export interface UseQuizGameResult {
  channelId: string | null
  chatStatus: ChatStreamStatus
  chatError: string | null
  connect: (channelId: string) => void

  phase: GamePhase
  participants: Participant[]
  round: number
  targetCount: number
  setTargetCount: (n: number) => void
  hostParticipates: boolean
  setHostParticipates: (v: boolean) => void
  hostNickname: string
  setHostNickname: (v: string) => void

  startRecruiting: () => void
  closeRecruiting: () => void
  startGame: () => void

  currentQuestion: QuizQuestion | null
  answerSeconds: number
  remainingSeconds: number
  roundStatus: Record<string, RoundStatus>
  confirmHostAnswer: (rawText: string) => void
  answerShown: boolean
  revealAnswer: () => void
  revealParticipants: () => void

  nextAction: NextAction | null
  eliminatedThisRound: Participant[]
  proceed: () => void

  winner: Participant | null
  resetGame: () => void

  devInjectMockRecruits: (count: number) => void
  devInjectMockAnswers: () => void
}

export function useQuizGame(options: UseQuizGameOptions): UseQuizGameResult {
  const { baseUrl, questions, defaultAnswerSeconds, sfxVolume } = options

  const [channelId, setChannelId] = useState<string | null>(null)
  const {
    status: chatStatus,
    error: chatError,
    messages,
  } = useChatStream({
    baseUrl,
    channelId,
    maxMessages: 500,
  })

  const [phase, setPhase] = useState<GamePhase>('setup')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [round, setRound] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [targetCount, setTargetCount] = useState(DEFAULT_TARGET_COUNT)
  const [hostParticipates, setHostParticipates] = useState(true)
  const [hostNickname, setHostNickname] = useState('')

  const [answerSeconds, setAnswerSeconds] = useState(
    defaultAnswerSeconds ?? FALLBACK_ANSWER_SECONDS,
  )
  const [remainingSeconds, setRemainingSeconds] = useState(answerSeconds)
  const [submissions, setSubmissions] = useState<Record<string, string>>({})
  const [roundStatus, setRoundStatus] = useState<Record<string, RoundStatus>>({})
  /** answerReveal 단계에서 "정답 공개" 버튼을 눌렀는지. 누르기 전엔 정답을 숨겨둡니다. */
  const [answerShown, setAnswerShown] = useState(false)

  const [nextAction, setNextAction] = useState<NextAction | null>(null)
  const [eliminatedThisRound, setEliminatedThisRound] = useState<Participant[]>([])
  const [winner, setWinner] = useState<Participant | null>(null)

  const processedCountRef = useRef(0)
  const roundSubmittedIdsRef = useRef<Set<string>>(new Set())
  const targetCountRef = useRef(targetCount)
  targetCountRef.current = targetCount
  const participantsRef = useRef<Participant[]>(participants)
  participantsRef.current = participants
  const aliveIdsRef = useRef<Set<string>>(new Set())
  aliveIdsRef.current = new Set(participants.filter((p) => p.alive).map((p) => p.id))
  const revealRoundRef = useRef<number | null>(null)

  const connect = useCallback((next: string) => {
    const trimmed = next.trim()
    setChannelId(trimmed ? trimmed : null)
  }, [])

  const addRecruit = useCallback((userId: string, nickname: string) => {
    setParticipants((prev) => {
      const viewerCount = prev.filter((p) => !p.isHost).length
      if (viewerCount >= targetCountRef.current) return prev
      if (prev.some((p) => p.id === userId)) return prev
      return [
        ...prev,
        { id: userId, nickname, isHost: false, alive: true, eliminatedAtRound: null },
      ]
    })
  }, [])

  const submitRoundAnswer = useCallback((userId: string, command: string) => {
    if (roundSubmittedIdsRef.current.has(userId)) return
    if (!aliveIdsRef.current.has(userId)) return
    roundSubmittedIdsRef.current.add(userId)
    setSubmissions((prev) => ({ ...prev, [userId]: command }))
  }, [])

  // 채팅 파싱: "!"로 시작하는 메시지를 phase에 따라 모집("!참여") 또는 라운드 답변으로 처리합니다.
  // useChatCollector.ts와 동일한 패턴 — 새로 도착한 메시지만, 1인 1회로 처리합니다.
  useEffect(() => {
    if (messages.length < processedCountRef.current) {
      processedCountRef.current = 0
    }
    if (phase !== 'recruiting' && phase !== 'question') {
      processedCountRef.current = messages.length
      return
    }
    const newMessages = messages.slice(processedCountRef.current)
    processedCountRef.current = messages.length

    for (const message of newMessages) {
      if (message.type !== 'message') continue
      const trimmedText = message.text.trim()
      if (!trimmedText.startsWith('!')) continue
      const command = trimmedText.slice(1).trim()
      if (!command) continue
      const nickname = message.user.nickname?.trim()
      if (!nickname) continue
      const userId = message.user.id

      if (phase === 'recruiting') {
        if (command !== '참여') continue
        addRecruit(userId, nickname)
      } else if (phase === 'question') {
        submitRoundAnswer(userId, command)
      }
    }
  }, [messages, phase, addRecruit, submitRoundAnswer])

  // 모집 인원이 목표치에 도달하면 자동으로 마감합니다.
  useEffect(() => {
    if (phase !== 'recruiting') return
    const viewerCount = participants.filter((p) => !p.isHost).length
    if (viewerCount >= targetCount) setPhase('ready')
  }, [phase, participants, targetCount])

  // 답변 수집 카운트다운(1초 간격), phase==='question'일 때만.
  useEffect(() => {
    if (phase !== 'question') return
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  // 카운트다운 종료 시 호스트 선택 단계(참여 시) 또는 정답 공개 대기 단계로 분기.
  useEffect(() => {
    if (phase !== 'question' || remainingSeconds !== 0) return
    setPhase(hostParticipates ? 'hostPick' : 'answerReveal')
  }, [phase, remainingSeconds, hostParticipates])

  const startRecruiting = useCallback(() => {
    processedCountRef.current = messages.length
    roundSubmittedIdsRef.current = new Set()
    setParticipants(
      hostParticipates
        ? [
            {
              id: HOST_ID,
              nickname: hostNickname.trim() || '스트리머',
              isHost: true,
              alive: true,
              eliminatedAtRound: null,
            },
          ]
        : [],
    )
    setSubmissions({})
    setRoundStatus({})
    setWinner(null)
    setNextAction(null)
    setEliminatedThisRound([])
    setRound(0)
    setCurrentQuestionIndex(0)
    setPhase('recruiting')
  }, [messages.length, hostParticipates, hostNickname])

  const closeRecruiting = useCallback(() => {
    setPhase((prev) => (prev === 'recruiting' ? 'ready' : prev))
  }, [])

  const beginRound = useCallback(
    (roundNumber: number, questionIndex: number) => {
      const seconds = defaultAnswerSeconds ?? FALLBACK_ANSWER_SECONDS
      roundSubmittedIdsRef.current = new Set()
      setSubmissions({})
      setRoundStatus(() => {
        const next: Record<string, RoundStatus> = {}
        for (const p of participantsRef.current) {
          if (p.alive) next[p.id] = 'pending'
        }
        return next
      })
      setAnswerSeconds(seconds)
      setRemainingSeconds(seconds)
      setAnswerShown(false)
      setRound(roundNumber)
      setCurrentQuestionIndex(questionIndex)
      setPhase('question')
      playRoundStart(sfxVolume)
    },
    [defaultAnswerSeconds, sfxVolume],
  )

  const startGame = useCallback(() => {
    if (!questions || questions.length === 0) return
    beginRound(1, 0)
  }, [questions, beginRound])

  const confirmHostAnswer = useCallback(
    (rawText: string) => {
      if (phase !== 'hostPick') return
      setSubmissions((prev) => ({ ...prev, [HOST_ID]: rawText }))
      setPhase('answerReveal')
    },
    [phase],
  )

  /** "정답 공개" 버튼 — 정답 텍스트만 먼저 보여줍니다(참가자 타일은 아직 그대로). */
  const revealAnswer = useCallback(() => {
    if (phase !== 'answerReveal') return
    setAnswerShown(true)
    playAnswerRevealSting(sfxVolume)
  }, [phase, sfxVolume])

  /** "정답자 공개" 버튼 — 이제 실제 reveal 연출(타일 색칠 + 탈락 적용)로 넘어갑니다. "정답 공개"를 먼저 눌러야 합니다. */
  const revealParticipants = useCallback(() => {
    if (phase !== 'answerReveal' || !answerShown) return
    setPhase('reveal')
  }, [phase, answerShown])

  // 정답 공개 연출: reveal 진입당 한 번만 실행(라운드 번호로 가드).
  useEffect(() => {
    if (phase !== 'reveal') return
    if (revealRoundRef.current === round) return
    revealRoundRef.current = round

    const currentQuestion = questions?.[currentQuestionIndex] ?? null
    if (!currentQuestion) return

    playRevealStart(sfxVolume)

    const aliveParticipants = participantsRef.current.filter((p) => p.alive)
    const aliveIds = shuffle(aliveParticipants.map((p) => p.id))
    const plan = buildRevealPlan(aliveIds)

    const timeouts = plan.map((chunk) =>
      setTimeout(() => {
        setRoundStatus((prev) => {
          const next = { ...prev }
          for (const id of chunk.participantIds) {
            const correct = isAnswerCorrect(currentQuestion, submissions[id] ?? '')
            next[id] = correct ? 'correct' : 'wrong'
          }
          return next
        })
      }, chunk.delayMs),
    )

    const lastDelay = plan.at(-1)?.delayMs ?? 0
    const finishTimer = setTimeout(() => {
      const survivorIds = new Set(
        aliveIds.filter((id) => isAnswerCorrect(currentQuestion, submissions[id] ?? '')),
      )

      setParticipants((prev) =>
        prev.map((p) => {
          if (!p.alive || survivorIds.has(p.id)) return p
          return { ...p, alive: false, eliminatedAtRound: round }
        }),
      )
      setEliminatedThisRound(aliveParticipants.filter((p) => !survivorIds.has(p.id)))

      let next: NextAction
      if (survivorIds.size === 0) {
        next = 'rematch'
      } else if (survivorIds.size === 1) {
        next = 'winner'
      } else {
        const hasNextQuestion = currentQuestionIndex + 1 < (questions?.length ?? 0)
        next = hasNextQuestion ? 'nextRound' : 'gameOver'
      }
      setNextAction(next)
      setPhase('roundResult')

      if (survivorIds.size > 0) playCorrectChime(sfxVolume)
      if (survivorIds.size < aliveIds.length) playWrongBuzz(sfxVolume)
    }, lastDelay + 400)

    return () => {
      for (const t of timeouts) clearTimeout(t)
      clearTimeout(finishTimer)
    }
    // submissions/questions/currentQuestionIndex는 진입 시점 값을 의도적으로 캡처합니다(가드된 1회 실행이라 안전).
  }, [phase, round])

  const proceed = useCallback(() => {
    if (!nextAction) return

    if (nextAction === 'winner') {
      const survivor = participantsRef.current.find((p) => p.alive) ?? null
      setWinner(survivor)
      setPhase('winner')
      return
    }

    if (nextAction === 'gameOver') {
      setPhase('gameOver')
      return
    }

    if (nextAction === 'rematch') {
      setParticipants((prev) =>
        prev.map((p) =>
          p.eliminatedAtRound === round ? { ...p, alive: true, eliminatedAtRound: null } : p,
        ),
      )
    }

    beginRound(round + 1, currentQuestionIndex + 1)
  }, [nextAction, round, currentQuestionIndex, beginRound])

  const resetGame = useCallback(() => {
    setPhase('setup')
    setParticipants([])
    setRound(0)
    setCurrentQuestionIndex(0)
    setSubmissions({})
    setRoundStatus({})
    setAnswerShown(false)
    setNextAction(null)
    setEliminatedThisRound([])
    setWinner(null)
    revealRoundRef.current = null
  }, [])

  const devInjectMockRecruits = useCallback(
    (count: number) => {
      const existingIds = new Set(participantsRef.current.map((p) => p.id))
      for (const { id, nickname } of generateMockRecruitBatch(count, existingIds)) {
        addRecruit(id, nickname)
      }
    },
    [addRecruit],
  )

  const devInjectMockAnswers = useCallback(() => {
    const currentQuestion = questions?.[currentQuestionIndex] ?? null
    if (!currentQuestion) return
    const alive = participantsRef.current.filter((p) => p.alive && !p.isHost)
    for (const { userId, command } of generateMockAnswerBatch(alive, currentQuestion)) {
      submitRoundAnswer(userId, command)
    }
  }, [questions, currentQuestionIndex, submitRoundAnswer])

  return {
    channelId,
    chatStatus,
    chatError,
    connect,

    phase,
    participants,
    round,
    targetCount,
    setTargetCount,
    hostParticipates,
    setHostParticipates,
    hostNickname,
    setHostNickname,

    startRecruiting,
    closeRecruiting,
    startGame,

    currentQuestion: questions?.[currentQuestionIndex] ?? null,
    answerSeconds,
    remainingSeconds,
    roundStatus,
    confirmHostAnswer,
    answerShown,
    revealAnswer,
    revealParticipants,

    nextAction,
    eliminatedThisRound,
    proceed,

    winner,
    resetGame,

    devInjectMockRecruits,
    devInjectMockAnswers,
  }
}
