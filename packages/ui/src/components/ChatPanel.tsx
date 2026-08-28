import type { HTMLAttributes, ReactNode } from 'react'
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import { ChevronDown } from '../icons'
import { ChatMessage, type ChatMessageProps } from './ChatMessage'
import { pickNicknameColor } from './chatColors'
import './ChatPanel.css'

export interface ChatPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxHeight?: number | string
}

/** 스크롤이 이 정도(px) 안쪽이면 "맨 아래"로 취급합니다(서브픽셀 오차 대비). */
const BOTTOM_THRESHOLD = 8

/**
 * 채팅 메시지들을 담는 스크롤 가능한 오버레이 컨테이너. 게임 화면 등 임의의
 * 배경 위에 떠 있는 걸 전제로 반투명 어두운 배경(--backdrop) + 블러를 씁니다.
 * ChatMessage 자식들을 순회하면서 rainbow 모드의 닉네임 색이 바로 앞 메시지와
 * 겹치지 않도록 자동으로 채워줍니다(직접 color/colorMode="accent"를 지정한
 * 자식은 그대로 둡니다).
 *
 * 새 메시지가 추가되면 맨 아래로 자동 스크롤됩니다. 사용자가 위로 스크롤하면
 * 이 자동 스크롤이 멈추고, 맨 아래가 아닐 때만 최신 메시지 미리보기 + 아래
 * 화살표로 된 플로팅 버튼이 뜹니다 — 누르면 맨 아래로 이동하면서 자동 스크롤이
 * 다시 켜집니다.
 */
export function ChatPanel({
  children,
  maxHeight = 360,
  className,
  style,
  ...rest
}: ChatPanelProps) {
  let previousColor: string | undefined

  const decoratedList =
    Children.map(children, (child, index) => {
      if (!isValidElement<ChatMessageProps>(child) || child.type !== ChatMessage) return child

      const { colorMode = 'rainbow', color, nickname } = child.props
      if (colorMode !== 'rainbow' || color) return child

      const seed = `${nickname ?? 'system'}-${index}`
      const nextColor = pickNicknameColor(seed, previousColor)
      previousColor = nextColor
      return cloneElement(child, { color: nextColor })
    }) ?? []

  const scrollRef = useRef<HTMLDivElement>(null)
  const [stickToBottom, setStickToBottom] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD
      setStickToBottom(atBottom)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!stickToBottom) return
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [children, stickToBottom])

  const handleJumpToBottom = () => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    setStickToBottom(true)
  }

  const lastMessage = decoratedList.findLast(
    (child) => isValidElement(child) && child.type === ChatMessage,
  )

  const classes = ['cc-chat-panel', className].filter(Boolean).join(' ')

  return (
    <div className={classes} style={{ maxHeight, ...style }} {...rest}>
      <div className="cc-chat-panel__scroll" ref={scrollRef}>
        {decoratedList}
      </div>
      {!stickToBottom && lastMessage ? (
        <button type="button" className="cc-chat-panel__jump" onClick={handleJumpToBottom}>
          <span className="cc-chat-panel__jump-preview">{lastMessage}</span>
          <ChevronDown size={24} className="cc-chat-panel__jump-icon" />
        </button>
      ) : null}
    </div>
  )
}
