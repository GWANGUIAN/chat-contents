import type { CSSProperties, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { deriveAccentShades } from './theme'

const PortalContainerContext = createContext<HTMLElement | null>(null)

/**
 * Radix Portal 기반 컴포넌트(Dropdown, Modal, Tooltip 등)는 이 값을 자신의
 * Portal `container` prop으로 넘겨야 ThemeProvider가 주입한 CSS 커스텀 프로퍼티를
 * 상속받습니다. Portal의 기본 컨테이너는 document.body인데, ThemeProvider는
 * `--accent-*`/`--text-*`/`--shadow-*` 같은 값들을 :root가 아니라 자신의 래퍼
 * div에 인라인 스타일로 주입합니다. document.body에 그대로 portal되면 그
 * 래퍼 div의 DOM 서브트리 밖(형제 노드)에 렌더링되어 CSS 변수 상속이 끊기고,
 * tokens.css의 :root 기본값(핑크 팔레트)으로 조용히 되돌아갑니다 — 이게 바로
 * 예제 앱에서 열린 Modal의 배경/보더/그림자 색이 그린 테마 대신 기본 핑크로
 * 보였던 원인입니다.
 */
export function usePortalContainer(): HTMLElement | undefined {
  return useContext(PortalContainerContext) ?? undefined
}

export interface ThemeTokenOverrides {
  /** accent에서 자동 파생되는 값 대신 정확한 브랜드 컬러를 쓰고 싶을 때 오버라이드합니다. */
  accentHover?: string
  accentSoft?: string
  accentSofter?: string
  accentText?: string
  accentBorder?: string
  /** 기본적으로 앱 전반에 고정인 구조 토큰. 특정 앱의 브랜드 팔레트에 맞춰야 할 때만 오버라이드합니다. */
  textPrimary?: string
  textSecondary?: string
  textMuted?: string
  surfacePanel?: string
  surfacePanelAlt?: string
  surfaceInput?: string
  /** DotGradientBackground의 그라디언트/베이스 색. 기본은 tokens.css의 핑크 톤입니다. */
  bgBase?: string
  bgGradient1?: string
  bgGradient2?: string
  bgGradient3?: string
  dotColor?: string
  /** `rgba(var(--shadow-color), alpha)`로 쓰이는 "R, G, B" 트리플렛 문자열 (예: "52, 211, 153"). */
  shadowColor?: string
  /** 하나의 진한 "잉크" 색에서 파생되는 헤어라인 보더 3단계 + ChatPanel 등의 backdrop 틴트. */
  borderFaint?: string
  borderDefault?: string
  borderStrong?: string
  backdrop?: string
}

export interface ThemeProviderProps {
  /** 스트리머/앱별 메인 색상 하나. 이 값만 바꿔서 재사용합니다. */
  accent: string
  /** 앱별 기본 폰트. 지정하지 않으면 tokens.css의 기본값(Cafe24Surround)을 씁니다. */
  fontFamily?: string
  /** accent에서 자동 파생/tokens.css 기본값 대신 정확한 값을 지정해야 하는 토큰들. */
  tokens?: ThemeTokenOverrides
  children: ReactNode
  className?: string
}

const TOKEN_OVERRIDE_VARS: Record<keyof ThemeTokenOverrides, string> = {
  accentHover: '--accent-hover',
  accentSoft: '--accent-soft',
  accentSofter: '--accent-softer',
  accentText: '--accent-text',
  accentBorder: '--accent-border',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  textMuted: '--text-muted',
  surfacePanel: '--surface-panel',
  surfacePanelAlt: '--surface-panel-alt',
  surfaceInput: '--surface-input',
  bgBase: '--bg-base',
  bgGradient1: '--bg-gradient-1',
  bgGradient2: '--bg-gradient-2',
  bgGradient3: '--bg-gradient-3',
  dotColor: '--dot-color',
  shadowColor: '--shadow-color',
  borderFaint: '--border-faint',
  borderDefault: '--border-default',
  borderStrong: '--border-strong',
  backdrop: '--backdrop',
}

/**
 * accent 색상(+선택적으로 폰트, 토큰 오버라이드)을 CSS 변수로 주입합니다. 구조 토큰(간격/라운드/
 * 배경 그라디언트)은 tokens.css가 고정으로 갖고, 여기서는 accent 계열/폰트/(필요 시) 텍스트·서피스
 * 색상만 오버라이드합니다.
 */
export function ThemeProvider({
  accent,
  fontFamily,
  tokens,
  children,
  className,
}: ThemeProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Portal container는 마운트된 뒤에야 실제 DOM 노드를 알 수 있으므로, ref 자체가
  // 아니라 state로 들고 있다가 첫 렌더 이후 채워 넣습니다(그래야 값이 바뀔 때
  // Context를 구독하는 Portal 쪽이 다시 렌더링됩니다).
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalContainer(containerRef.current)
  }, [])

  const style = useMemo<CSSProperties>(() => {
    const shades = deriveAccentShades(accent)
    const result: Record<string, string> = {
      '--accent': shades.accent,
      '--accent-hover': shades.accentHover,
      '--accent-soft': shades.accentSoft,
      '--accent-softer': shades.accentSofter,
      '--accent-text': shades.accentText,
      '--accent-border': shades.accentBorder,
    }
    if (fontFamily) {
      result['--font-family'] = fontFamily
      // tokens.css only sets the real `font-family` property once, on `body` (an
      // ancestor of this div) — so like --shadow-panel, overriding the --font-family
      // custom property alone doesn't reach anything relying on inherited font-family
      // from body. Set the real property here too so it inherits to every descendant.
      result.fontFamily = fontFamily
    }
    for (const key of Object.keys(TOKEN_OVERRIDE_VARS) as (keyof ThemeTokenOverrides)[]) {
      const value = tokens?.[key]
      if (value) result[TOKEN_OVERRIDE_VARS[key]] = value
    }
    if (tokens?.shadowColor) {
      // --shadow-panel/--shadow-float are only declared once, at :root, as
      // `rgba(var(--shadow-color), alpha)`. A custom property's nested var()
      // references resolve using the element where THAT property is declared, not
      // the element that later consumes it — so overriding --shadow-color here does
      // NOT retroactively change what :root's --shadow-panel/--shadow-float already
      // baked in and pass down via inheritance. They must be set directly too.
      const c = tokens.shadowColor
      result['--shadow-panel'] = `0 12px 32px -8px rgba(${c}, 0.28), 0 2px 8px rgba(${c}, 0.14)`
      result['--shadow-float'] = `0 6px 18px -4px rgba(${c}, 0.22)`
    }
    result.display = 'contents'
    return result as CSSProperties
  }, [accent, fontFamily, tokens])

  return (
    <PortalContainerContext.Provider value={portalContainer}>
      <div ref={containerRef} className={className} style={style}>
        {children}
      </div>
    </PortalContainerContext.Provider>
  )
}
