/** 이 패키지는 SOOP 하나만 다룹니다. 값은 라우팅/URL 형태를 stream 원본과 맞추기 위해 유지합니다. */
export type Platform = 'soop'

export function isPlatform(value: unknown): value is Platform {
  return value === 'soop'
}

export type ChatUserRole = 'streamer' | 'manager' | 'viewer'

/** 채팅 참여자. */
export interface ChatUser {
  platform: Platform
  id: string
  nickname: string
  profileImageUrl?: string
  role: ChatUserRole
  badges: string[]
}

export type ChatEventType = 'message' | 'donation' | 'subscription' | 'system' | 'status'

export interface ChatMessageEvent {
  type: 'message'
  platform: Platform
  user: ChatUser
  text: string
  emojis: Record<string, string>
  at: number
  raw?: unknown
}

export interface ChatDonationEvent {
  type: 'donation'
  platform: Platform
  user: ChatUser
  amount: number
  currency: string
  text?: string
  at: number
  raw?: unknown
}

export interface ChatSubscriptionEvent {
  type: 'subscription'
  platform: Platform
  user: ChatUser
  months: number
  at: number
  raw?: unknown
}

export interface ChatSystemEvent {
  type: 'system'
  platform: Platform
  text: string
  at: number
  raw?: unknown
}

export interface ChatStatusEvent {
  type: 'status'
  platform: Platform
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error'
  text?: string
  at: number
}

export type ChatEvent =
  | ChatMessageEvent
  | ChatDonationEvent
  | ChatSubscriptionEvent
  | ChatSystemEvent
  | ChatStatusEvent

export type ChatEventHandler = (event: ChatEvent) => void

export interface ChatClientOptions {
  channelId: string
  fetch?: typeof globalThis.fetch
}

export interface ChatClient {
  readonly platform: Platform
  readonly channelId: string
  connect(): Promise<void>
  disconnect(): Promise<void>
  on(handler: ChatEventHandler): () => void
}

/** 공통 이벤트 버스 + 상태 emit. */
export abstract class BaseChatClient implements ChatClient {
  abstract readonly platform: Platform
  readonly channelId: string

  private readonly handlers = new Set<ChatEventHandler>()
  protected closed = false

  constructor(channelId: string) {
    this.channelId = channelId
  }

  on(handler: ChatEventHandler): () => void {
    this.handlers.add(handler)
    return () => {
      this.handlers.delete(handler)
    }
  }

  protected emit(event: ChatEvent): void {
    for (const handler of this.handlers) {
      try {
        handler(event)
      } catch {
        // 구독자 에러가 연결을 끊지 않게 합니다.
      }
    }
  }

  protected emitStatus(
    status: Extract<ChatEvent, { type: 'status' }>['status'],
    text?: string,
  ): void {
    this.emit({
      type: 'status',
      platform: this.platform,
      status,
      text,
      at: Date.now(),
    })
  }

  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
}
