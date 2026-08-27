/**
 * 이 서버는 항상 127.0.0.1에서만 리슨하며, 소비자는 같은 앱의 Electron 렌더러입니다.
 * 그래도 개발 모드(electron-vite dev, http://localhost:<port>)와 패키징된 앱
 * (file:// 로드, Origin 헤더가 없거나 'null')을 모두 허용해야 합니다.
 */
const LOCAL_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

/** Origin 헤더가 로컬이면 그대로, 없으면 null. */
export function resolveCorsOrigin(requestOrigin: string | undefined): string | null {
  if (!requestOrigin) return null
  if (requestOrigin === 'null') return 'null'
  return LOCAL_ORIGIN_PATTERN.test(requestOrigin) ? requestOrigin : null
}

export function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin) return {}
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'cache-control',
    vary: 'Origin',
  }
}
