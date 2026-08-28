interface StarProps {
  className: string
  fill: string
  stroke: string
}

function Star({ className, fill, stroke }: StarProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0 C12 6 15 9 21 9 C15 9 12 12 12 18 C12 12 9 9 3 9 C9 9 12 6 12 0Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * DotGradientBackground의 decorations 슬롯에 꽂아 넣는 장식 요소. 위치와 애니메이션은
 * 전부 이 앱의 styles.css에서 정의합니다(ui 패키지는 레이어만 제공 — CLAUDE.md 참고).
 */
export function BackgroundDecorations() {
  return (
    <div className="background-decorations">
      <Star
        className="background-decorations__star background-decorations__star--1"
        fill="#FFD84D"
        stroke="#FFB300"
      />
      <Star
        className="background-decorations__star background-decorations__star--2"
        fill="#FF8FC6"
        stroke="#F857A6"
      />
      <Star
        className="background-decorations__star background-decorations__star--3"
        fill="#7FD8E8"
        stroke="#3DB8CE"
      />

      <svg
        className="background-decorations__cloud background-decorations__cloud--left"
        viewBox="0 0 120 70"
        aria-hidden="true"
      >
        <ellipse cx="30" cy="45" rx="28" ry="22" />
        <ellipse cx="60" cy="30" rx="32" ry="28" />
        <ellipse cx="92" cy="46" rx="24" ry="19" />
        <rect x="18" y="40" width="84" height="26" rx="13" />
      </svg>

      <svg
        className="background-decorations__cloud background-decorations__cloud--right"
        viewBox="0 0 120 70"
        aria-hidden="true"
      >
        <ellipse cx="30" cy="45" rx="28" ry="22" />
        <ellipse cx="60" cy="30" rx="32" ry="28" />
        <ellipse cx="92" cy="46" rx="24" ry="19" />
        <rect x="18" y="40" width="84" height="26" rx="13" />
      </svg>
    </div>
  )
}
