/**
 * voiceURI로 지정된 음성을 찾습니다. 지정이 없으면 한국어(ko) 음성을 우선 선택하고,
 * 그마저 없으면 undefined를 반환해 브라우저 기본 음성을 쓰게 합니다.
 */
export function pickVoice(
  voices: SpeechSynthesisVoice[],
  voiceURI: string,
): SpeechSynthesisVoice | undefined {
  if (voiceURI) {
    const exact = voices.find((voice) => voice.voiceURI === voiceURI)
    if (exact) return exact
  }
  return voices.find((voice) => voice.lang.toLowerCase().startsWith('ko'))
}
