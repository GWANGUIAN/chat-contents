import { basename, join } from 'node:path'
import { app } from 'electron'

/**
 * 개발 모드(electron-vite dev)에서는 프로젝트 폴더의 아이콘 원본 경로를 그대로 쓰고,
 * 패키징된 빌드에서는 electron-builder.yml의 extraResources로 복사된 리소스 폴더에서
 * 같은 파일명을 찾습니다. (out/ 아래로는 복사되지 않는 build/ 폴더의 파일을 asar 밖에서
 * 참조하기 위함 — 각 앱의 electron-builder.yml에 다음을 등록해야 합니다:
 * `extraResources: [{ from: <devIconPath와 동일 경로>, to: <파일명> }]`)
 */
export function resolveAppIcon(devIconPath: string): string {
  return app.isPackaged ? join(process.resourcesPath, basename(devIconPath)) : devIconPath
}
