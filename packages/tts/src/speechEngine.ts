import type { ChatEvent } from '@chat-contents/chat-proxy'
import { buildSpeechText } from './textFormat'
import { pickVoice } from './voice'

export interface TtsSpeakOptions {
  /** 0-100. AppSettings의 다른 볼륨 필드와 동일한 스케일입니다. */
  volume: number
  /** SpeechSynthesisVoice.voiceURI. 빈 문자열이면 자동 선택. */
  voiceURI: string
  readNickname: boolean
}

/** 이벤트 하나를 즉시 발화합니다. 읽지 않을 이벤트/빈 메시지는 조용히 무시됩니다. */
export function speakEvent(event: ChatEvent, options: TtsSpeakOptions): void {
  const text = buildSpeechText(event, { readNickname: options.readNickname })
  if (!text) return

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.volume = Math.min(100, Math.max(0, options.volume)) / 100

  const voice = pickVoice(window.speechSynthesis.getVoices(), options.voiceURI)
  if (voice) utterance.voice = voice

  window.speechSynthesis.speak(utterance)
}
