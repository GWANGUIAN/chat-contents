import { useEffect, useState } from 'react'

/**
 * 시스템에 설치된 음성 목록. Chromium은 음성 목록을 비동기로 불러오므로
 * 'voiceschanged' 이벤트를 구독해 최초 로드 이후에도 갱신을 반영합니다.
 */
export function useTtsVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    window.speechSynthesis.getVoices(),
  )

  useEffect(() => {
    const handleVoicesChanged = () => setVoices(window.speechSynthesis.getVoices())
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
  }, [])

  return voices
}
