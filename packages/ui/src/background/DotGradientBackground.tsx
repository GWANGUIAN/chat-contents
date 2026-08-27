import './DotGradientBackground.css'

/**
 * 고정된 전체 화면 배경 레이어. accent를 반영한 그라데이션 블롭 위에
 * 규칙적인 도트 그리드를 겹칩니다. 앱 루트에서 한 번만 렌더링하세요.
 */
export function DotGradientBackground() {
  return (
    <div className="cc-bg" aria-hidden="true">
      <div className="cc-bg__gradient" />
      <div className="cc-bg__dots" />
    </div>
  )
}
