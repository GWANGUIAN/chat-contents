import { type ChatProxyServerHandle, startChatProxyServer } from '@chat-contents/chat-proxy'
import { app } from 'electron'

/**
 * 임베디드 chat-proxy 서버를 시작하고, 앱 종료 시 정리합니다.
 * 각 앱의 main 프로세스에서 앱 시작 시 한 번 호출하세요.
 */
export async function bootstrapChatProxy(): Promise<ChatProxyServerHandle> {
  const handle = await startChatProxyServer()
  console.log(`[chat-proxy] embedded server listening on ${handle.url}`)

  app.on('before-quit', () => {
    void handle.stop()
  })

  return handle
}
