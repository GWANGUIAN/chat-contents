import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      // React 19는 react-dom/test-utils를 제거했습니다. @storybook/react의 act()
      // 감지 코드가 (실행되지 않는) 폴백 분기에서 이걸 정적 import하는데, Vite가
      // 이 경로를 리졸브 못 하면 프리뷰 번들 전체가 깨집니다 — 스텁으로 대체.
      'react-dom/test-utils': fileURLToPath(
        new URL('./stubs/react-dom-test-utils.ts', import.meta.url),
      ),
    }
    return viteConfig
  },
}

export default config
