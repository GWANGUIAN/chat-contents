import { spawn } from 'node:child_process'

// src/main/index.ts opens DevTools when this env var is set. Set here (rather than
// via a raw Chromium --auto-open-devtools-for-tabs switch) because that switch doesn't
// reliably open DevTools for Electron's BrowserWindow model.
process.env.OPEN_DEVTOOLS = 'true'

const child = spawn('pnpm', ['exec', 'electron-vite', 'dev'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 0))
