import type { ChatEvent, ChatMessageEvent } from '@chat-contents/chat-proxy'
import { useEffect, useRef } from 'react'
import { speakEvent, type TtsSpeakOptions } from './speechEngine'

export interface UseChatTtsOptions extends TtsSpeakOptions {
  enabled: boolean
}

/**
 * 채팅 이벤트 배열(useChatStream의 ring buffer)을 구독해 새로 들어온 메시지/후원/구독만
 * 순서대로 발화합니다. 마운트 시점에 이미 쌓여 있던 과거 메시지는 읽지 않습니다.
 */
export function useChatTts(events: ChatEvent[], options: UseChatTtsOptions): void {
  const optionsRef = useRef(options)
  optionsRef.current = options

  // null이면 아직 시작 시점을 잡지 않은 상태. 첫 실행에서 현재 마지막 이벤트를 커서로 삼아
  // 그 이전 backlog는 건너뜁니다.
  const lastSpokenAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (lastSpokenAtRef.current === null) {
      lastSpokenAtRef.current = events.at(-1)?.at ?? Date.now()
      return
    }

    const newEvents = events.filter((event) => event.at > lastSpokenAtRef.current!)
    if (newEvents.length === 0) return

    lastSpokenAtRef.current = newEvents.at(-1)!.at
    if (!optionsRef.current.enabled) return
    for (const event of newEvents) speakEvent(event, optionsRef.current)
  }, [events])

  useEffect(() => {
    if (!options.enabled) window.speechSynthesis.cancel()
  }, [options.enabled])
}

const SAMPLE_EVENT: Omit<ChatMessageEvent, 'at'> = {
  type: 'message',
  platform: 'soop',
  user: { platform: 'soop', id: 'sample', nickname: '테스트', role: 'viewer', badges: [] },
  text: '안녕하세요, TTS 테스트입니다.',
  emojis: {},
}

/** 채팅 연결 없이 현재 설정으로 샘플 문구를 즉시 1회 발화합니다(설정 화면의 테스트 버튼용). */
export function speakSample(options: TtsSpeakOptions): void {
  speakEvent({ ...SAMPLE_EVENT, at: Date.now() }, options)
}
