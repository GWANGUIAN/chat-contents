import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@chat-contents/chat-proxy', '@chat-contents/electron-shared'],
      }),
    ],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/main/index.ts'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ['@chat-contents/electron-shared'] })],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/preload/index.ts'),
        // 샌드박스 preload 로더는 CJS만 지원합니다. 루트 package.json이
        // "type": "module"이라도 preload만은 강제로 CJS(.js)로 내보냅니다.
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
  },
  renderer: {
    root: 'src/renderer',
    plugins: [react()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
})
