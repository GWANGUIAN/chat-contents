# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Keep this document in sync

This file is the single source of truth for how this repo is structured. **Whenever you make a change that affects anything documented below** — add/rename a package, change an IPC channel, change a default port, change how a new app should be scaffolded, add a shared package, change the theming contract, etc. — **update this file in the same change.** Do not let it drift from the code. If you're unsure whether a change is "architectural enough" to document, err on the side of updating it.

## What this repo is

A pnpm/Turborepo monorepo of **Windows desktop apps for streamers** (built with Electron), sharing a common SOOP live-chat client, a design system, and Electron plumbing. Each app in `apps/` is built and shipped as a single portable `.exe` to a streamer — not as a web service. New content apps are expected to be added over time by scaffolding a new `apps/*` folder that reuses the packages below; they should need almost no new infrastructure code.

This was forked from a sibling monorepo (`../stream`) that runs an equivalent chat proxy as a hosted web service. The fork stripped it down to SOOP-only, anonymous-read-only chat (no Chzzk, no OAuth/cookie login), and restructured it so it runs **embedded inside Electron's main process** instead of as a standalone server process — see "Why chat-proxy runs in-process" below before changing that.

## Commands

Run from the repo root unless noted. All cross-package tasks go through Turborepo.

```bash
pnpm install          # install everything (pnpm workspaces + catalog-pinned versions)
pnpm dev               # turbo run dev — currently just runs apps/example's electron-vite dev server
pnpm build             # turbo run build — electron-vite build for every app, dist build for libs
pnpm typecheck         # turbo run typecheck — tsc --noEmit across all packages/apps
pnpm lint              # biome check .
pnpm format            # biome check --write .   (auto-fixes formatting + import order)
pnpm dist              # turbo run dist — build + package a portable .exe for every app
```

Per-app (inside `apps/example`, same pattern for any future app):

```bash
pnpm dev               # electron-vite dev (hot reload, opens the Electron window)
pnpm build             # electron-vite build -> out/{main,preload,renderer}
pnpm dist              # electron-vite build && electron-builder -> release/*-portable.exe
pnpm typecheck         # tsc --noEmit against tsconfig.node.json (main+preload) and tsconfig.web.json (renderer)
```

There are no tests in this repo yet (`vitest` is pinned in the catalog but not wired into any package). `pnpm test` is a no-op until a package adds one.

To smoke-test the embedded chat-proxy in isolation without Electron: import `startChatProxyServer` from `@chat-contents/chat-proxy` in a throwaway script and `curl -N http://127.0.0.1:<port>/api/chat/soop/stream?channelId=<id>` — this isolates chat-proxy/SOOP-protocol bugs from Electron/IPC bugs.

## Architecture

### Package layout

```
packages/
  config           tsconfig presets (base / library / react-library / electron-main)
  chat-proxy       Node-only SOOP chat client + local HTTP+SSE server (no React/DOM deps)
  chat-client      React-only: useChatStream() hook, EventSource wrapper (no Node deps)
  ui               design system: theming, dot-grid/gradient background, Panel/Button/Slider/etc.
  electron-shared  main+preload-only glue: settings store, IPC contract, window manager, preload API factory
apps/
  example          first Electron app: electron-vite (main/preload/renderer split)
```

All workspace packages are consumed as **raw TypeScript source**, not prebuilt — `package.json#exports` points straight at `./src/index.ts`. There is no per-package build step; whatever bundles the file (electron-vite for apps, `tsc --noEmit` for typecheck) compiles the source directly. Keep this in mind when scaffolding a new package: no `tsup`/`rollup` config needed, just `exports` in `package.json` + a `tsconfig.json` extending one of `@chat-contents/config`'s presets.

### Why chat-proxy runs in-process (not as a child process or hosted service)

`packages/chat-proxy` exports one function apps actually call:

```ts
startChatProxyServer(options?: { host?: string; port?: number }): Promise<{ port; url; stop() }>
```

Electron's **main process is itself Node**, so `apps/*/src/main/index.ts` just calls `bootstrapChatProxy()` (from `@chat-contents/electron-shared`) directly — no spawning a child OS process, no bundling a separate `node.exe`, no sidecar binary. This is *the* reason Electron was chosen over Tauri for this project: chat-proxy has zero runtime dependencies beyond `ws`/`zod`, so it bundles into the Electron main build like any other module.

Consequences that matter if you touch this:
- **Port defaults to `0`** (OS-assigned), not a fixed port — each app embeds its own proxy, so a fixed port would collide if a streamer runs two of these `.exe`s at once. The renderer learns the real port at runtime via IPC (`window.api.chatProxy.getPort()`), never hardcode it.
- **Host is always `127.0.0.1`** — never expose this server beyond localhost.
- `packages/chat-proxy/src/cors.ts` only allows `http://localhost:*` / `http://127.0.0.1:*` / a `null` origin (the packaged app's `file://`-loaded renderer sends `Origin: null`). If you add a way for OBS browser sources or other local tools to hit this server, this is the file to touch.
- Multiple SSE subscribers to the same `channelId` share one upstream SOOP WebSocket via the refcounted hub in `packages/chat-proxy/src/hub.ts` — don't bypass it by instantiating `SoopChatClient` directly outside of `hub.ts`.

### SOOP protocol notes (packages/chat-proxy/src/soop/)

This talks to SOOP's **unofficial** web player API because the official API requires a partner contract:
1. `api.ts` POSTs to `https://live.<domain>/afreeca/player_live_api.php` to get `chatNo` + a chat `webSocketUrl`. Fails if the channel isn't currently live (`RESULT !== 1`) — this is a normal, expected error path, not a bug.
2. `client.ts` (`SoopChatClient`) opens that WebSocket with `rejectUnauthorized: false` (the chat server's cert doesn't match its hostname — this is required, not a security oversight) and does a custom handshake: send `SVC.CONNECT` → wait for the `CONNECT` ack → send `SVC.ENTER` with `chatNo` → the `ENTER` ack means "connected". A 60s `SVC.PING` keeps the socket alive after that.
3. `packet.ts` implements the reverse-engineered binary framing (14-byte header: start bytes + 4-char service code + 6-digit **UTF-8 byte length** — not character count — + trailer, fields separated by `\f`). If SOOP changes this wire format, this is where it breaks.
4. `normalize.ts` maps raw packets (chat/donation/subscription/notification) into the `ChatEvent` union defined in `chat-types.ts`.

Everything here is **read-only and always anonymous** — there is no login/cookie/OAuth code in this fork (it existed in the `../stream` source and was deliberately dropped). If a future app needs to *send* chat messages or read authenticated-only data, that machinery needs to be re-ported from `../stream/packages/auth`, not invented from scratch.

### Design system (packages/ui)

One theming axis only: **accent color**. Everything else (spacing, radius, shadows, surface colors) is a fixed token in `theme/tokens.css`. A per-app/per-streamer color is applied via:

```tsx
<ThemeProvider accent="#ff6fae"><App /></ThemeProvider>
```

`ThemeProvider` calls `deriveAccentShades()` (`theme/theme.ts`, pure HSL math, no deps) to compute `--accent-hover` / `--accent-soft` / `--accent-softer` / `--accent-text` from the one input color and sets them as CSS custom properties. **Do not add new theme axes** (e.g. per-app radius or dark mode) without a deliberate decision — the whole point is that structural components stay identical across every streamer's app and only the accent changes.

`background/DotGradientBackground.tsx` is the "gradient + regular dot grid" look — two stacked layers, a gradient blob tinted by `--accent-soft`/`--accent-softer`, and a tiled `radial-gradient` dot texture faded out via `mask-image`. Render it once near the app root, not per-panel.

Components (`Panel`, `Button`, `Slider`, `SlideInPanel`, `IconButton`, `TextInput`) all read tokens via CSS vars and carry their own co-located `.css` file — no CSS-in-JS, no Tailwind. `Slider` uses a `--volume-fill` CSS var trick to paint the filled portion of the track; follow that pattern for any new track-style input.

### Electron plumbing (packages/electron-shared)

This package is **never imported by renderer code**. Renderer talks to it exclusively through `window.api`, which is `PreloadApi` (the return type of `buildPreloadApi()`). The shape is:

```
window.api.settings.{get,set,getAll,onChange}
window.api.chatProxy.getPort()
window.api.window.{setFullscreen,setResolution,getState}
```

`ipc-contract.ts` is the single source of truth for channel name strings (`IPC.settingsGet`, etc.) — it's imported by both the main-process handlers (`apps/*/src/main/ipc-handlers.ts`) and `preload-api.ts`, so a renamed/mistyped channel is a compile error, not a silent runtime mismatch. **Any new IPC channel must be added here first**, then wired in both `ipc-handlers.ts` (main) and `preload-api.ts` (preload) — never call `ipcRenderer.invoke('some-string')` with a raw string anywhere else.

`settings-store.ts` wraps `electron-store`, namespaced per app via `createSettingsStore(appName)` (writes `<appName>-settings.json` under `app.getPath('userData')`). The `AppSettings` shape (`bgmVolume`, `sfxVolume`, `windowMode`, `resolution`) is intentionally the full set every app is expected to need for the settings-gear pattern — extend it here, not per-app, unless a setting is genuinely app-specific.

`window-manager.ts` is the only place that's allowed to call `BrowserWindow` resize/fullscreen APIs — window mode and resolution changes always go: renderer → IPC → here, never directly.

### Scaffolding a new content app

Copy `apps/example`'s structure. The parts that must not change:
- `electron.vite.config.ts`'s `externalizeDepsPlugin({ exclude: [...] })` on the `main` and `preload` configs — workspace packages (`@chat-contents/chat-proxy`, `@chat-contents/electron-shared`) are TS source with no build step, so they must be **excluded from externalization** (bundled by Vite/Rollup) or Electron will try to `require()` a `.ts` file at runtime and crash. Real npm deps (`ws`, `electron-store`, `zod`) stay externalized as normal.
- The preload build output is `index.mjs` (not `.js`) because these packages are `"type": "module"` — `src/main/index.ts` must reference `../preload/index.mjs` exactly. This bit people; electron-vite's default preload output extension depends on the package's module type.
- `electron-builder.yml`'s `win.target: portable` — the whole distribution model is "one `.exe`, no installer, no auto-update." Don't add a `publish` block or switch targets without discussing it; it's a deliberate v1 constraint, not an oversight.

What *should* change per app: the `accent` color passed to `ThemeProvider`, `productName`/`appId` in `electron-builder.yml`, the window title, and obviously the renderer UI itself.

## Deliberately out of scope for now (do not build unless asked)

- **Auto-update** (`electron-updater`) — `electron-builder.yml` has no `publish` block on purpose.
- **Non-SOOP platforms** (Chzzk etc.) — `Platform` in `chat-types.ts` is hardcoded to `'soop'`. `BaseChatClient` is still an abstract class (cheap to keep) so a second platform *could* be added later, but there's no scaffolding for it today.
- **Shared assets package** (fonts/SFX shared across apps) — doesn't exist yet; only create it when a second app actually duplicates assets with `apps/example`.
- **OBS-overlay-style transparent/always-on-top windows** — not needed by `apps/example`; if a future app needs it, it belongs in `packages/electron-shared/src/window-manager.ts` as a new `createOverlayWindow()` export.
- **Structured logging for crash reports from streamers' machines** (`electron-log`) — worth adding to `packages/electron-shared` when the second app ships, not designed yet.
