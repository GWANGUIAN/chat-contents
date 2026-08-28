export interface AccentShades {
  accent: string
  accentHover: string
  accentSoft: string
  accentSofter: string
  accentText: string
  accentBorder: string
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const value = Number.parseInt(full, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0)
      break
    case gn:
      h = (bn - rn) / d + 2
      break
    default:
      h = (rn - gn) / d + 4
  }
  return [h * 60, s * 100, l * 100]
}

function hue2rgb(p: number, q: number, t: number): number {
  let tt = t
  if (tt < 0) tt += 1
  if (tt > 1) tt -= 1
  if (tt < 1 / 6) return p + (q - p) * 6 * tt
  if (tt < 1 / 2) return q
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
  return p
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = (((h % 360) + 360) % 360) / 360
  const sn = clamp01(s / 100)
  const ln = clamp01(l / 100)

  if (sn === 0) {
    const v = Math.round(ln * 255)
    return rgbToHex(v, v, v)
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const r = Math.round(hue2rgb(p, q, hn + 1 / 3) * 255)
  const g = Math.round(hue2rgb(p, q, hn) * 255)
  const b = Math.round(hue2rgb(p, q, hn - 1 / 3) * 255)
  return rgbToHex(r, g, b)
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => clampByte(v).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function clampPercent(v: number): number {
  return Math.max(0, Math.min(100, v))
}

function clampRange(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * accent 하나로부터 hover/soft/text 변형을 계산합니다.
 * 구조(간격/라운드/서피스)는 고정하고 이 파생값만 스트리머별로 바뀝니다.
 */
export function deriveAccentShades(hex: string): AccentShades {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex))
  const accentHover = hslToHex(h, s, clampPercent(l - 8))
  // 밝은 배경 위 텍스트로도 읽히도록 채도는 유지하되 명도를 낮춥니다.
  const accentText = hslToHex(h, Math.min(s, 85), clampPercent(Math.min(l, 42)))
  // 두꺼운 보더용 "잉크" 톤: 채도를 끌어올리고 명도를 깊게 낮춰 accent와 같은
  // 색상군이면서도 진하게 대비되도록 합니다 (스트리머 accent마다 보더색이 따라옴).
  const accentBorder = hslToHex(h, Math.max(s, 50), clampRange(l, 16, 24))

  return {
    accent: hex,
    accentHover,
    accentSoft: hexToRgba(hex, 0.16),
    accentSofter: hexToRgba(hex, 0.07),
    accentText,
    accentBorder,
  }
}
