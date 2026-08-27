import { ProviderError } from '../errors'
import { HttpClient } from '../http'
import { SOOP_DEFAULT_DOMAIN, soopLiveBase, soopUnofficialHeaders } from './constants'
import { parseSoopChatSessionFields, type SoopChatSession } from './schema'

export interface FetchSoopChatConnectionOptions {
  domain?: string
  fetch?: typeof globalThis.fetch
}

/**
 * 방송 중인 채널의 채팅 웹소켓 연결 정보를 가져옵니다.
 * 읽기 전용 익명 채팅이므로 로그인/쿠키가 필요 없습니다.
 */
export async function fetchSoopChatConnection(
  channelId: string,
  options: FetchSoopChatConnectionOptions = {},
): Promise<SoopChatSession> {
  const domain = options.domain ?? SOOP_DEFAULT_DOMAIN
  const http = new HttpClient({
    baseUrl: soopLiveBase(domain),
    fetch: options.fetch,
    headers: soopUnofficialHeaders(domain),
  })

  const data = await http.json(`/afreeca/player_live_api.php`, {
    method: 'POST',
    query: { bjid: channelId },
    form: {
      bid: channelId,
      type: 'live',
      pwd: '',
      player_type: 'html5',
      stream_type: 'common',
      quality: 'HD',
      mode: 'landing',
      from_api: 0,
      is_revive: false,
    },
    headers: {
      origin: `https://play.${domain}`,
      referer: `https://www.${domain}/`,
    },
    label: `soop/player_live/${channelId}`,
  })

  try {
    return parseSoopChatSessionFields(channelId, data)
  } catch (cause) {
    throw new ProviderError(
      cause instanceof Error ? cause.message : 'SOOP 채팅 세션을 만들지 못했습니다.',
      { cause, body: data },
    )
  }
}
