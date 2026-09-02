# chat-contents

스트리머를 위한 **Windows 데스크톱 방송 콘텐츠 앱** 모음 모노레포입니다. SOOP(아프리카TV) 라이브 채팅을 실시간으로 받아, 방송 화면 위에 얹는 인터랙티브 오버레이 앱들을 만듭니다. 각 앱은 별도의 설치 없이 실행되는 단일 `.exe`로 배포됩니다.

pnpm workspaces + Turborepo로 구성했고, 채팅 수신·디자인 시스템·Electron 연동 로직을 공용 패키지로 뽑아 새 콘텐츠 앱을 최소한의 보일러플레이트로 추가할 수 있게 만든 것이 이 레포의 핵심 목표입니다.

## 앱

| 앱 | 설명 |
| --- | --- |
| **quiz-1v100** | 시청자가 채팅 명령으로 답을 제출하는 "1대100" 형식의 실시간 퀴즈쇼. 라운드별 정답 공개 연출, 오답자 자동 탈락, 전원탈락 시 재경기 처리를 포함합니다. |
| **chat-roulette** | 접속한 채팅 참여자 중 한 명을 뽑는 룰렛 추첨 오버레이. 채팅 수집 → 릴 연출 → 결과 발표 흐름으로 동작합니다. |
| **example** | 위 두 앱이 공유하는 인프라(테마, 설정 패널, 채팅 테스트 패널, 온보딩)를 보여주는 레퍼런스/스타터 앱. 새 앱을 추가할 때 이 구조를 그대로 복제해서 시작합니다. |

## 기술 스택

- **Electron** + **electron-vite** (main / preload / renderer 분리 빌드), **electron-builder**로 portable `.exe` 패키징
- **React 19** + **TypeScript** (strict)
- SOOP 비공식 웹 플레이어 API에 직접 붙는 자체 채팅 클라이언트 — WebSocket + 리버스 엔지니어링한 바이너리 프레이밍 프로토콜 파싱, Node.js 없이 Electron 메인 프로세스에 내장되어 별도 서버 프로세스 없이 동작
- 자체 디자인 시스템(토큰 기반 테마, Radix UI 위에 쌓은 컴포넌트, Storybook)
- **Turborepo** 기반 태스크 파이프라인, **Biome**로 린트/포맷 통일

## 레포 구조

```
apps/
  quiz-1v100       "1대100" 실시간 퀴즈쇼 앱
  chat-roulette    채팅 참여자 룰렛 추첨 앱
  example          공용 인프라 레퍼런스/스타터 앱
packages/
  chat-proxy       SOOP 채팅 클라이언트 + 로컬 HTTP/SSE 서버 (Node 전용)
  chat-client      React용 채팅 스트림 훅 (EventSource 래핑)
  app-settings     설정 패널(볼륨/해상도/창모드) 공용 훅
  tts              Web Speech API로 채팅을 읽어주는 TTS 훅
  ui               디자인 시스템 — 테마, 배경, Panel/Button/Modal 등 컴포넌트, Storybook
  electron-shared  main/preload 전용 IPC 계약, 설정 저장소, 윈도우 매니저
  config           tsconfig 프리셋
```

모든 워크스페이스 패키지는 사전 빌드 없이 TypeScript 소스 그대로 소비됩니다(`package.json#exports`가 `./src/index.ts`를 바로 가리킴). 새 앱은 각자 필요한 만큼만 패키지를 가져다 쓰고, 앱 전용으로만 필요한 데이터는 공용 설정 스키마를 건드리지 않고 자체 IPC 브리지로 따로 둡니다.

## 실행

```bash
pnpm install
pnpm dev          # apps/example 개발 서버 (electron-vite, HMR)
```

앱별로 실행하려면:

```bash
cd apps/quiz-1v100   # 또는 chat-roulette, example
pnpm dev
```

```bash
pnpm build         # 전 패키지/앱 빌드
pnpm typecheck      # 전 패키지 tsc --noEmit
pnpm lint           # biome check
pnpm dist           # 앱별 portable .exe 패키징
```

## 개발 문서

에이전트/개발자를 위한 아키텍처 상세, 디자인 시스템의 세부 규칙과 알려진 함정(gotcha), 새 앱 스캐폴딩 절차는 [CLAUDE.md](CLAUDE.md)에 정리되어 있습니다.
