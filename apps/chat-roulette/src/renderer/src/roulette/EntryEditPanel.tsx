import { Badge, Button, IconButton, Plus, TextInput, Trash2 } from '@chat-contents/ui'
import { useState } from 'react'
import type { RouletteEntry } from './types'

export interface EntryEditPanelProps {
  entries: RouletteEntry[]
  onAdd: (text: string) => void
  onRemove: (id: string) => void
}

/** 언제든 열어서 제출 목록을 추가/삭제할 수 있는 편집 서랍 내용. 수동 추가는 닉네임
 *  없이 제출 내용만 입력합니다. */
export function EntryEditPanel({ entries, onAdd, onRemove }: EntryEditPanelProps) {
  const [text, setText] = useState('')

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(text)
    setText('')
  }

  return (
    <div className="entry-edit-panel">
      <div className="entry-edit-panel__form">
        <TextInput
          placeholder="제출 내용"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleAdd()
          }}
        />
        <Button onClick={handleAdd}>
          <Plus size={18} />
          추가
        </Button>
      </div>

      <div className="entry-edit-panel__list">
        {entries.length === 0 ? (
          <p className="entry-edit-panel__empty">제출 항목이 없습니다.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="entry-edit-panel__row">
              <div className="entry-edit-panel__row-info">
                {entry.nickname ? (
                  <span className="entry-edit-panel__row-nickname">{entry.nickname}</span>
                ) : null}
                <span className="entry-edit-panel__row-text">{entry.text}</span>
                {entry.source === 'manual' ? (
                  <Badge tone="neutral" variant="outline">
                    수동
                  </Badge>
                ) : null}
              </div>
              <IconButton
                aria-label={`"${entry.text}" 삭제`}
                variant="ghost"
                onClick={() => onRemove(entry.id)}
              >
                <Trash2 size={18} />
              </IconButton>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
