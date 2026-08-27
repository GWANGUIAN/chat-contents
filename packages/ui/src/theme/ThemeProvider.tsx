import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'
import { deriveAccentShades } from './theme'

export interface ThemeProviderProps {
  /** 스트리머/앱별 메인 색상 하나. 이 값만 바꿔서 재사용합니다. */
  accent: string
  children: ReactNode
  className?: string
}

/**
 * accent 색상을 CSS 변수로 주입합니다. 구조 토큰(간격/라운드/서피스)은 tokens.css가
 * 고정으로 갖고 있고, 여기서는 accent 계열만 오버라이드합니다.
 */
export function ThemeProvider({ accent, children, className }: ThemeProviderProps) {
  const style = useMemo<CSSProperties>(() => {
    const shades = deriveAccentShades(accent)
    return {
      '--accent': shades.accent,
      '--accent-hover': shades.accentHover,
      '--accent-soft': shades.accentSoft,
      '--accent-softer': shades.accentSofter,
      '--accent-text': shades.accentText,
      display: 'contents',
    } as CSSProperties
  }, [accent])

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
