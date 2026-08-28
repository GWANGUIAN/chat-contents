import type { ReactNode } from 'react'
import './DotGradientBackground.css'

export interface DotGradientBackgroundProps {
  /**
   * 그라데이션/도트 위에 떠 있는 장식 요소(별, 구름 등). 위치·애니메이션은 전달하는
   * 쪽(앱)에서 자체 CSS로 구현합니다 — 이 컴포넌트는 도트 그리드 위, 실제 콘텐츠 아래에
   * 놓일 레이어 하나만 제공합니다.
   */
  decorations?: ReactNode
}

/**
 * 고정된 전체 화면 배경 레이어. accent를 반영한 그라데이션 블롭 위에
 * 규칙적인 도트 그리드를 겹칩니다. 앱 루트에서 한 번만 렌더링하세요.
 */
export function DotGradientBackground({ decorations }: DotGradientBackgroundProps) {
  return (
    <div className="cc-bg" aria-hidden="true">
      <div className="cc-bg__gradient" />
      <div className="cc-bg__dots" />
      {decorations && <div className="cc-bg__decorations">{decorations}</div>}
    </div>
  )
}
