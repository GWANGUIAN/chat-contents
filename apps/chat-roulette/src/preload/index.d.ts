import type { PreloadApi } from '@chat-contents/electron-shared'

declare global {
  interface Window {
    api: PreloadApi
  }
}
