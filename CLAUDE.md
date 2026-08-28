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

**Debugging a blank/white renderer in a packaged build**: `electron-vite dev` and `pnpm build` (unpacked `out/`) can both work fine while the actual asar-packaged app still breaks — packaging (bundling scope, asar path resolution) is where preload/renderer wiring bugs actually surface. Don't trust a dev-mode "it works" for this class of bug. To debug: run the packaged exe directly from a terminal so its `console.log` reaches you — `release/win-unpacked/<ProductName>.exe` (not the portable `.exe`, which detaches) — and temporarily add in `src/main/index.ts` after window creation:
```ts
win.webContents.on('console-message', (_e, _level, message) => console.log('[renderer]', message))
win.webContents.on('preload-error', (_e, path, error) => console.log('[preload-error]', path, error))
```
Remove these before committing; they're a debugging aid, not permanent logging (see "Deliberately out of scope" below for the real logging story).

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

Two theming axes injected at app-install time, both via `ThemeProvider` (a CSS-custom-property-injecting wrapper — there is no React Context or Redux in this repo, and this is the deliberate pattern to keep extending instead): **accent color** (required) and **font family** (optional). Everything else (spacing, radius, shadows, surface colors, the font scale) is a fixed token in `theme/tokens.css`.

```tsx
<ThemeProvider accent="#ff6fae" fontFamily="'MyFont', sans-serif"><App /></ThemeProvider>
```

`ThemeProvider` calls `deriveAccentShades()` (`theme/theme.ts`, pure HSL math, no deps) to compute `--accent-hover` / `--accent-soft` / `--accent-softer` / `--accent-text` / **`--accent-border`** from the one input accent and sets them as CSS custom properties. `--accent-border` is a deep, high-saturation/low-lightness "ink" shade in the same hue as accent — it's what the thick borders on `Panel`/`Button`/`TextInput`/`IconButton` use, so every streamer's app gets a border color that matches its own accent automatically (pink accent → deep raspberry border, blue accent → deep navy border, etc.) without any extra config. `fontFamily` (if passed) overrides `--font-family`; if omitted, it falls back to the default in `tokens.css` (Cafe24Surround). **Do not add new theme axes** (e.g. per-app radius or dark mode) without a deliberate decision — the whole point is that structural components stay identical across every streamer's app and only accent/font change.

Fonts live in `theme/fonts.css` (`@import`ed from `tokens.css`) with the actual font files vendored under `theme/assets/` — **never reference a font by CDN URL**. These apps ship as offline portable `.exe`s; a CDN `@font-face` silently falls back to a system font if the streamer's PC is offline or the CDN is blocked. To add another font later, download the file into `theme/assets/` and add an `@font-face` block to `fonts.css`.

The font scale (`--font-size-sm/md/lg/xl/xxl`, 30–64px) is intentionally large — these are broadcast overlays, not desktop app chrome, so text needs to read at streaming resolutions/bitrates from across a room.

`background/DotGradientBackground.tsx` is the "gradient + regular dot grid" look — two stacked layers, a gradient blob tinted by `--accent-soft`/`--accent-softer`, and a tiled `radial-gradient` dot texture faded out via `mask-image`. Render it once near the app root, not per-panel.

Components (`Panel`, `Button`, `Slider`, `SlideInPanel`, `IconButton`, `TextInput`, `Title`, `ChatPanel`/`ChatMessage`) all read tokens via CSS vars and carry their own co-located `.css` file — no CSS-in-JS, no Tailwind. `Slider` uses a `--volume-fill` CSS var trick to paint the filled portion of the track; follow that pattern for any new track-style input. `Panel` uses a real `backdrop-filter: blur(var(--glass-blur))` for glassmorphism (Electron/Chromium supports this natively) rather than alpha-only fake transparency. `Button` and `IconButton` share the same `variant?: 'primary' | 'secondary' | 'ghost'` convention — `primary` is solid-accent-fill, `secondary` is white-fill/thick-accent-border ("outline"), `ghost` is borderless/low-emphasis; follow this convention for any new actionable component. `Title` uses `size`/`tone` props instead of `variant`, since headings are about hierarchy/color, not action emphasis. `Button` and `IconButton` both forward their ref (`forwardRef<HTMLButtonElement, ...>`) specifically so `SlideInPanel`'s `triggerRef` prop works (see below).

**`SlideInPanel`'s toggle-button trigger always lives outside its own DOM subtree** (it's a separate `IconButton`/`Button`, not rendered by `SlideInPanel` itself), which creates a real bug if not wired up correctly: `SlideInPanel`'s outside-click-closes listener runs on `pointerdown` (native, fires before React's `onClick`), so clicking the trigger while the panel is open closes it via that listener *first*, then the trigger's own `onClick={() => setOpen(prev => !prev)}` immediately flips it back open in the same batch — the panel visually never closes. Fix: pass the trigger's ref into `SlideInPanel`'s `triggerRef` prop (see `apps/example/src/renderer/src/App.tsx`) so clicks on the trigger are excluded from the outside-click check, leaving the trigger's own toggle as the only thing that runs. Any new open/close trigger for `SlideInPanel` must do the same.

`ChatPanel`/`ChatMessage` (`components/ChatPanel.tsx`, `components/ChatMessage.tsx`) render live chat feeds. Unlike the rest of the system, `ChatMessage` text is deliberately **white with a black `-webkit-text-stroke`** and `ChatPanel`'s background is the translucent-dark `--backdrop` token (not `--surface-panel`) — this is the one place in the design system meant to float directly over arbitrary game footage, not sit on the usual white glass chrome, so it needs to stay legible regardless of what's behind it. `ChatMessage`'s `nickname` gets a color from `components/chatColors.ts`'s `pickNicknameColor()` (a fixed vivid palette, hashed by a seed) — `colorMode="rainbow"` (default) or `"accent"` to pin it to the theme's accent instead. Composition is the intended usage: wrap `ChatMessage` children in `ChatPanel`, which walks them via `Children.map`/`cloneElement` and assigns each a rainbow color that's guaranteed to differ from the immediately preceding message's color (a message with no `nickname` — for system/donation/subscription lines — is left uncolored and skipped in that sequence). Don't reimplement this coordination in app code; add new `ChatMessage` children under `ChatPanel` instead.

Storybook lives inside this package (`packages/ui/.storybook/`, stories co-located as `*.stories.tsx` next to each component) so every component/variant/token can be browsed in one place:

```bash
pnpm --filter @chat-contents/ui storybook         # dev server at http://localhost:6006
pnpm --filter @chat-contents/ui build-storybook   # static build
```

`.storybook/preview.tsx` wraps every story in `ThemeProvider` + `DotGradientBackground` and exposes an accent-color picker in the toolbar, so switching accent live-previews how every component (including the derived border color) responds. `.storybook/main.ts` aliases `react-dom/test-utils` to a local stub (`.storybook/stubs/react-dom-test-utils.ts`) — React 19 removed that subpath entirely, and `@storybook/react`'s (dead-code, React-18-only) fallback branch still references it statically, which otherwise breaks Vite's dev transform for the whole preview bundle. If upgrading `storybook`/`@storybook/react-vite` ever removes the need for this, the alias can go.

`tokens.css` styles all scrollbars globally (`*::-webkit-scrollbar*`, thin/rounded/accent-colored) so no component needs its own scroll styling. **The `::-webkit-scrollbar-button` (native up/down arrow) hiding rules must stay as separate individual rule blocks, never combined into one comma-separated selector list** — CSS drops an entire selector list if even one selector in it is invalid/unsupported in the current Chromium build, so a single bad combinator (e.g. `:vertical:increment`) can silently kill every other selector in the same list, which is exactly what happened here once. One selector per rule block is the only way to guarantee the working ones still apply even if others don't.

**Never put `overflow-y: auto` directly on the bordered/rounded element itself** (`Panel`, `ChatPanel`) — a native scrollbar always spans the *full outer box* of whatever element has `overflow-y: auto`, edge to edge, so it visually clips through the rounded corners. Instead, nest a plain inner wrapper (`SlideInPanel`'s `.cc-slide-in__scroll`, `ChatPanel`'s `.cc-chat-panel__scroll`) that owns the actual scrolling, and put the vertical inset **on the outer bordered element's own padding, not the inner wrapper's** — e.g. `.cc-slide-in__panel { padding: var(--space-6) 0; }`. This is the part that's easy to get backwards: padding on the *scrolling* element only shifts where its content sits, it does **not** move the scrollbar (which ignores its own element's padding entirely), so putting the inset there does nothing. The outer element's padding, by contrast, genuinely shrinks the box available to its flex child, which *does* push the scrolling child's outer box — and therefore its scrollbar — away from the curve. Horizontally it's the opposite: zero padding on the outer element (so the inner wrapper's box, and its scrollbar, sit flush against the border), with the inner wrapper's own left/right padding used purely for text readability. The outer element keeps `overflow: hidden` (not `auto`) as a clipping safety net, and the inner wrapper needs `min-height: 0` for the scroll to actually trigger inside a flex column.

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

**`src/preload/index.ts` must import `buildPreloadApi` from the `@chat-contents/electron-shared/preload-api` subpath, never from the package root (`@chat-contents/electron-shared`).** The root barrel (`index.ts`) also re-exports `bootstrapChatProxy` (`chat-proxy-bootstrap.ts`), which pulls in `@chat-contents/chat-proxy` and Electron's `app` module — both main-process-only. If preload imports the barrel, its bundle drags that code in too; `@chat-contents/chat-proxy` (correctly, since preload has no reason to need it) isn't in preload's `externalizeDepsPlugin` exclude list, so it gets emitted as a bare `require('@chat-contents/chat-proxy')` — which has no compiled JS to resolve, and **fails silently at runtime only in the packaged asar build** (`electron-vite dev`/unpacked runs can mask this). Symptom: blank white renderer, `window.api` undefined, no error unless you're watching `webContents.on('preload-error')`. If `preload-api.ts` ever needs a new dependency, keep it dependency-light (currently only `ipc-contract.ts`, which has none) — anything heavier belongs behind the main-only barrel, not here.

### Scaffolding a new content app

Copy `apps/example`'s structure. The parts that must not change:
- `electron.vite.config.ts`'s `externalizeDepsPlugin({ exclude: [...] })` on the `main` and `preload` configs — workspace packages (`@chat-contents/chat-proxy`, `@chat-contents/electron-shared`) are TS source with no build step, so they must be **excluded from externalization** (bundled by Vite/Rollup) or Electron will try to `require()` a `.ts` file at runtime and crash. Real npm deps (`ws`, `electron-store`, `zod`) stay externalized as normal.
- The preload build is **forced to CJS** (`electron.vite.config.ts`'s `preload.build.rollupOptions.output: { format: 'cjs', entryFileNames: '[name].js' }`) even though the rest of the repo is `"type": "module"`. Without this override, electron-vite emits an ESM `index.mjs` preload, which **silently fails to load** under `sandbox: true` (`SyntaxError: Cannot use import statement outside a module` from Electron's sandboxed preload loader — it only supports CJS). The symptom is a blank white renderer with no visible error, because `window.api` never gets exposed and the renderer crashes on first `window.api.*` access. `src/main/index.ts` references `../preload/index.js` to match. Keep this override if you scaffold a new app.
- `electron-builder.yml`'s `win.target: portable` — the whole distribution model is "one `.exe`, no installer, no auto-update." Don't add a `publish` block or switch targets without discussing it; it's a deliberate v1 constraint, not an oversight.
- `src/main/index.ts`'s `Menu.setApplicationMenu(null)` call — these are custom-UI streamer apps, not traditional desktop software, so Electron's default File/Edit/View/Window/Help menu bar is always removed.

What *should* change per app: the `accent` color passed to `ThemeProvider`, `productName`/`appId` in `electron-builder.yml`, the window title, and obviously the renderer UI itself.

## Deliberately out of scope for now (do not build unless asked)

- **Auto-update** (`electron-updater`) — `electron-builder.yml` has no `publish` block on purpose.
- **Non-SOOP platforms** (Chzzk etc.) — `Platform` in `chat-types.ts` is hardcoded to `'soop'`. `BaseChatClient` is still an abstract class (cheap to keep) so a second platform *could* be added later, but there's no scaffolding for it today.
- **Shared assets package** (fonts/SFX shared across apps) — doesn't exist yet; only create it when a second app actually duplicates assets with `apps/example`.
- **OBS-overlay-style transparent/always-on-top windows** — not needed by `apps/example`; if a future app needs it, it belongs in `packages/electron-shared/src/window-manager.ts` as a new `createOverlayWindow()` export.
- **Structured logging for crash reports from streamers' machines** (`electron-log`) — worth adding to `packages/electron-shared` when the second app ships, not designed yet.
