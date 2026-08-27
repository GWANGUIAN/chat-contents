import { numeric, parseWith, z } from '../schema'

export const soopPlayerChannelSchema = z.object({
  RESULT: numeric,
  CHDOMAIN: z.string().optional(),
  CHPT: z.union([z.string(), z.number()]).optional(),
  CHATNO: z.union([z.string(), z.number()]).optional(),
  FTK: z.string().optional().nullable(),
  BNO: z.union([z.string(), z.number()]).optional().nullable(),
})

export const soopPlayerLiveSchema = z.object({
  CHANNEL: soopPlayerChannelSchema,
})

export interface SoopChatSession {
  streamerId: string
  chatDomain: string
  chatPort: number
  chatNo: string
  ftk?: string
  broadcastNo?: string
  webSocketUrl: string
  raw: unknown
}

export function parseSoopChatSessionFields(streamerId: string, data: unknown): SoopChatSession {
  const parsed = parseWith(soopPlayerLiveSchema, data, {
    label: `soop/player_live/${streamerId}`,
  })
  const ch = parsed.CHANNEL

  if (ch.RESULT !== 1) {
    throw new Error(
      `SOOP 라이브 정보를 가져오지 못했습니다 (RESULT=${ch.RESULT}). 방송 중이 아니거나 접근이 제한되었을 수 있습니다.`,
    )
  }
  if (!ch.CHDOMAIN || ch.CHPT === undefined || ch.CHATNO === undefined) {
    throw new Error('SOOP 채팅 연결 정보(CHDOMAIN/CHPT/CHATNO)가 없습니다.')
  }

  const chatDomain = String(ch.CHDOMAIN).toLowerCase()
  const chatPort = Number(ch.CHPT) + 1
  return {
    streamerId,
    chatDomain,
    chatPort,
    chatNo: String(ch.CHATNO),
    ftk: ch.FTK ?? undefined,
    broadcastNo: ch.BNO != null ? String(ch.BNO) : undefined,
    webSocketUrl: `wss://${chatDomain}:${chatPort}/Websocket/${streamerId}`,
    raw: data,
  }
}
