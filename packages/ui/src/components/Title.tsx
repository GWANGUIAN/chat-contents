import type { HTMLAttributes } from 'react'
import './Title.css'

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** 렌더링될 시맨틱 태그. 기본 h2. */
  as?: 'h1' | 'h2' | 'h3'
  /** 크기. 방송 가독성을 위해 기본값은 크게(lg). */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 텍스트 색. accent를 주면 강조 색으로 표시됩니다. */
  tone?: 'default' | 'accent'
}

export function Title({
  as: Tag = 'h2',
  size = 'lg',
  tone = 'default',
  className,
  ...rest
}: TitleProps) {
  const classes = ['cc-title', `cc-title--${size}`, `cc-title--${tone}`, className]
    .filter(Boolean)
    .join(' ')
  return <Tag className={classes} {...rest} />
}
