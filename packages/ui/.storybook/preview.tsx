import type { Preview } from '@storybook/react-vite'
import { DotGradientBackground } from '../src/background/DotGradientBackground'
import { ThemeProvider } from '../src/theme/ThemeProvider'
import '../src/theme/tokens.css'

const ACCENT_PRESETS = [
  { value: '#ff6fae', title: '핑크' },
  { value: '#7c6cff', title: '라벤더' },
  { value: '#2a6df5', title: '남색' },
  { value: '#33c2a0', title: '민트' },
]

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
  },
  globalTypes: {
    accent: {
      description: '앱 설치 시 ThemeProvider에 주입되는 accent 색상',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        items: ACCENT_PRESETS,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    accent: ACCENT_PRESETS[0]?.value,
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider accent={context.globals.accent ?? ACCENT_PRESETS[0]?.value}>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <DotGradientBackground />
          <div style={{ position: 'relative', padding: 32 }}>
            <Story />
          </div>
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
