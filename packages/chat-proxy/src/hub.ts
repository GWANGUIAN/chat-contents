import type { ChatClient } from './chat-types'
import { SoopChatClient } from './soop/client'

interface HubEntry {
  client: ChatClient
  refs: number
  ready: Promise<void>
}

const hubs = new Map<string, HubEntry>()
const pending = new Map<string, Promise<HubEntry>>()

export interface AcquiredChatClient {
  client: ChatClient
  release: () => void
}

/**
 * channelId당 upstream ChatClient 하나를 공유합니다.
 * 마지막 구독자가 떠나면 disconnect합니다.
 */
export async function acquireChatClient(rawChannelId: string): Promise<AcquiredChatClient> {
  const channelId = rawChannelId.trim()
  if (!channelId) {
    throw new Error('channelId가 필요합니다.')
  }

  let entry = hubs.get(channelId)

  if (!entry) {
    let creating = pending.get(channelId)
    if (!creating) {
      creating = (async () => {
        const client = new SoopChatClient({ channelId })
        const ready = client.connect()
        const next: HubEntry = { client, refs: 0, ready }
        hubs.set(channelId, next)
        return next
      })().finally(() => {
        pending.delete(channelId)
      })
      pending.set(channelId, creating)
    }
    entry = await creating
  }

  entry.refs += 1
  let released = false

  try {
    await entry.ready
  } catch (error) {
    entry.refs -= 1
    if (entry.refs <= 0) {
      hubs.delete(channelId)
      void entry.client.disconnect()
    }
    throw error
  }

  return {
    client: entry.client,
    release: () => {
      if (released) return
      released = true
      const current = hubs.get(channelId)
      if (!current) return
      current.refs -= 1
      if (current.refs <= 0) {
        hubs.delete(channelId)
        void current.client.disconnect()
      }
    },
  }
}
