import type { HTMLAttributes, ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { ChatMessage, type ChatMessageProps } from './ChatMessage'
import { pickNicknameColor } from './chatColors'
import './ChatPanel.css'

export interface ChatPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxHeight?: number | string
}

/**
 * 채팅 메시지들을 담는 스크롤 가능한 오버레이 컨테이너. 게임 화면 등 임의의
 * 배경 위에 떠 있는 걸 전제로 반투명 어두운 배경(--backdrop) + 블러를 씁니다.
 * ChatMessage 자식들을 순회하면서 rainbow 모드의 닉네임 색이 바로 앞 메시지와
 * 겹치지 않도록 자동으로 채워줍니다(직접 color/colorMode="accent"를 지정한
 * 자식은 그대로 둡니다).
 */
export function ChatPanel({
  children,
  maxHeight = 360,
  className,
  style,
  ...rest
}: ChatPanelProps) {
  let previousColor: string | undefined

  const decorated = Children.map(children, (child, index) => {
    if (!isValidElement<ChatMessageProps>(child) || child.type !== ChatMessage) return child

    const { colorMode = 'rainbow', color, nickname } = child.props
    if (colorMode !== 'rainbow' || color) return child

    const seed = `${nickname ?? 'system'}-${index}`
    const nextColor = pickNicknameColor(seed, previousColor)
    previousColor = nextColor
    return cloneElement(child, { color: nextColor })
  })

  const classes = ['cc-chat-panel', className].filter(Boolean).join(' ')

  return (
    <div className={classes} style={{ maxHeight, ...style }} {...rest}>
      <div className="cc-chat-panel__scroll">{decorated}</div>
    </div>
  )
}
