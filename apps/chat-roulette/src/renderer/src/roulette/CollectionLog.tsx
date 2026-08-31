import { ChatMessage, ChatPanel, Panel } from '@chat-contents/ui'
import type { RouletteEntry } from './types'

export interface CollectionLogProps {
  entries: RouletteEntry[]
}

export function CollectionLog({ entries }: CollectionLogProps) {
  // 수동 추가 항목은 닉네임이 없어 이 문장 형태로 표현할 수 없으므로, 실시간 채팅
  // 로그에는 채팅에서 들어온 제출만 보여줍니다(수동 추가분은 편집 서랍에서 확인).
  const chatEntries = entries.filter((entry) => entry.source === 'chat')

  return (
    <Panel className="collection-log">
      <ChatPanel maxHeight={280}>
        {chatEntries.length === 0 ? (
          <ChatMessage>아직 제출된 채팅이 없습니다.</ChatMessage>
        ) : (
          chatEntries.map((entry) => (
            <ChatMessage key={entry.id}>
              {entry.nickname}님이 "{entry.text}"를 제출했습니다
            </ChatMessage>
          ))
        )}
      </ChatPanel>
    </Panel>
  )
}
