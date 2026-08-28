import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'
import { deriveAccentShades } from './theme'

export interface ThemeProviderProps {
  /** 스트리머/앱별 메인 색상 하나. 이 값만 바꿔서 재사용합니다. */
  accent: string
  /** 앱별 기본 폰트. 지정하지 않으면 tokens.css의 기본값(Cafe24Surround)을 씁니다. */
  fontFamily?: string
  children: ReactNode
  className?: string
}

/**
 * accent 색상(+선택적으로 폰트)을 CSS 변수로 주입합니다. 구조 토큰(간격/라운드/서피스)은
 * tokens.css가 고정으로 갖고 있고, 여기서는 accent 계열과 폰트만 오버라이드합니다.
 */
export function ThemeProvider({ accent, fontFamily, children, className }: ThemeProviderProps) {
  const style = useMemo<CSSProperties>(() => {
    const shades = deriveAccentShades(accent)
    return {
      '--accent': shades.accent,
      '--accent-hover': shades.accentHover,
      '--accent-soft': shades.accentSoft,
      '--accent-softer': shades.accentSofter,
      '--accent-text': shades.accentText,
      '--accent-border': shades.accentBorder,
      ...(fontFamily ? { '--font-family': fontFamily } : {}),
      display: 'contents',
    } as CSSProperties
  }, [accent, fontFamily])

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
