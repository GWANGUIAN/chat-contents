import type { ChatEvent } from '@chat-contents/chat-proxy'

const MAX_SPEECH_LENGTH = 100

const URL_PATTERN = /https?:\/\/\S+|www\.\S+/gi
// 자모만으로 된 인터넷 은어는 TTS가 그대로 읽으면 발음이 안 되므로 실제 발음으로 치환합니다.
// 여러 글자짜리 표현이 한 글자짜리 표현에 부분적으로 먹히지 않도록 긴 키부터 매칭합니다.
const JAMO_PRONUNCIATION: Record<string, string> = {
  ㅗㅜㅑ: '오우야',
  ㅋ: '크',
}
const JAMO_PATTERN = new RegExp(
  Object.keys(JAMO_PRONUNCIATION)
    .sort((a, b) => b.length - a.length)
    .join('|'),
  'g',
)
// 이모지/기호 등 발음할 수 없는 유니코드 구간을 제거합니다(이모지 도배 대응).
const NON_SPEAKABLE_PATTERN =
  /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu
// 같은 문자가 4번 이상 반복되면 3번으로 줄입니다("크크크크크크크" 도배 대응).
const REPEATED_CHAR_PATTERN = /(.)\1{3,}/gu

/** 채팅 텍스트를 발화 가능한 형태로 정제합니다. 정제 후 내용이 없으면 빈 문자열을 반환합니다. */
export function sanitizeText(raw: string): string {
  const withoutUrls = raw.replace(URL_PATTERN, '링크')
  const withPronunciationFixed = withoutUrls.replace(
    JAMO_PATTERN,
    (match) => JAMO_PRONUNCIATION[match] ?? match,
  )
  const withoutEmoji = withPronunciationFixed.replace(NON_SPEAKABLE_PATTERN, '')
  const collapsedRepeats = withoutEmoji.replace(REPEATED_CHAR_PATTERN, '$1$1$1')
  const collapsedWhitespace = collapsedRepeats.replace(/\s+/g, ' ').trim()

  return collapsedWhitespace.length > MAX_SPEECH_LENGTH
    ? collapsedWhitespace.slice(0, MAX_SPEECH_LENGTH)
    : collapsedWhitespace
}

export interface BuildSpeechTextOptions {
  readNickname: boolean
}

/** 채팅 이벤트를 발화용 문구로 변환합니다. 읽지 않을 이벤트/빈 메시지는 null을 반환합니다. */
export function buildSpeechText(event: ChatEvent, options: BuildSpeechTextOptions): string | null {
  switch (event.type) {
    case 'message': {
      const text = sanitizeText(event.text)
      if (!text) return null
      return options.readNickname ? `${event.user.nickname}, ${text}` : text
    }
    case 'donation': {
      const suffix = event.text ? sanitizeText(event.text) : ''
      const base = `${event.user.nickname}님이 별풍선 ${event.amount}개를 후원했습니다.`
      return suffix ? `${base} ${suffix}` : base
    }
    case 'subscription':
      return `${event.user.nickname}님이 ${event.months}개월 구독했습니다.`
    default:
      return null
  }
}
