export interface ResolutionOption {
  label: string
  width: number
  height: number
}

export const STANDARD_RESOLUTIONS: ResolutionOption[] = [
  { label: '1280 x 720', width: 1280, height: 720 },
  { label: '1600 x 900', width: 1600, height: 900 },
  { label: '1920 x 1080', width: 1920, height: 1080 },
]
