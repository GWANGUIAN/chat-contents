import type { ReactNode } from 'react'
import { pickNicknameColor } from './chatColors'
import './ChatMessage.css'

export interface ChatMessageProps {
  /** 없으면 닉네임 없이 텍스트 한 줄만 렌더링합니다(시스템/후원/구독 알림 등에 사용). */
  nickname?: string
  children: ReactNode
  /** 'rainbow'(기본) = 알록달록 랜덤, 'accent' = 테마 accent 색으로 고정. */
  colorMode?: 'rainbow' | 'accent'
  /** rainbow 모드일 때 쓸 색을 직접 지정합니다. 없으면 닉네임 기반으로 자동 계산됩니다.
   *  ChatPanel 안에서 쓰면 이전 메시지와 색이 겹치지 않도록 자동으로 채워줍니다. */
  color?: string
  /** 닉네임+채팅은 항상 한 줄로 보입니다. true(기본)면 넘치는 부분을 말줄임표(...)로
   *  표시하고, false면 말줄임표 없이 그냥 잘립니다. */
  truncate?: boolean
  className?: string
}

export function ChatMessage({
  nickname,
  children,
  colorMode = 'rainbow',
  color,
  truncate = true,
  className,
}: ChatMessageProps) {
  const nicknameColor =
    colorMode === 'rainbow'
      ? (color ?? (nickname ? pickNicknameColor(nickname) : undefined))
      : undefined

  const classes = ['cc-chat-message', truncate ? 'cc-chat-message--truncate' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {nickname ? (
        <span
          className={[
            'cc-chat-message__nickname',
            colorMode === 'accent' ? 'cc-chat-message__nickname--accent' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={nicknameColor ? { color: nicknameColor } : undefined}
        >
          {nickname}
        </span>
      ) : null}
      <span className="cc-chat-message__text">{children}</span>
    </div>
  )
}
