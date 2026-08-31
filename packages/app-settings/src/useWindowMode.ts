import type { AppSettings } from '@chat-contents/electron-shared'
import { useEffect, useRef, useState } from 'react'
import { type ResolutionOption, STANDARD_RESOLUTIONS } from './resolutions'

export interface UseWindowModeOptions {
  resolutions?: ResolutionOption[]
}

export interface UseWindowModeResult {
  resolutions: ResolutionOption[]
  fullscreen: boolean
  setFullscreen: (value: boolean) => void
  resolutionIndex: number
  setResolutionIndex: (index: number) => void
  apply: () => void
}

export function useWindowMode(
  settings: AppSettings | null,
  options?: UseWindowModeOptions,
): UseWindowModeResult {
  const resolutions = options?.resolutions ?? STANDARD_RESOLUTIONS
  const [fullscreen, setFullscreen] = useState(false)
  const [resolutionIndex, setResolutionIndex] = useState(0)
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !settings) return
    hydrated.current = true
    setFullscreen(settings.windowMode === 'fullscreen')
    const matchedIndex = resolutions.findIndex(
      (option) =>
        option.width === settings.resolution.width && option.height === settings.resolution.height,
    )
    if (matchedIndex >= 0) setResolutionIndex(matchedIndex)
  }, [settings, resolutions])

  const apply = () => {
    void window.api.window.setFullscreen(fullscreen)
    if (!fullscreen) {
      const resolution = resolutions[resolutionIndex]
      if (resolution) {
        void window.api.window.setResolution({ width: resolution.width, height: resolution.height })
      }
    }
  }

  return {
    resolutions,
    fullscreen,
    setFullscreen,
    resolutionIndex,
    setResolutionIndex,
    apply,
  }
}
