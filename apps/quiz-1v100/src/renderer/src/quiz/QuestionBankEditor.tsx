import { Button, Drawer, IconButton, Panel, Pencil, Plus, Trash2 } from '@chat-contents/ui'
import { useState } from 'react'
import type { QuizQuestion } from '../../../shared/quiz-types'
import { QuestionEditForm } from './QuestionEditForm'

export interface QuestionBankEditorProps {
  open: boolean
  onClose: () => void
  questions: QuizQuestion[]
  onAdd: (question: QuizQuestion) => void
  onUpdate: (question: QuizQuestion) => void
  onRemove: (id: string) => void
}

export function QuestionBankEditor({
  open,
  onClose,
  questions,
  onAdd,
  onUpdate,
  onRemove,
}: QuestionBankEditorProps) {
  const [editing, setEditing] = useState<QuizQuestion | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (question: QuizQuestion) => {
    setEditing(question)
    setFormOpen(true)
  }

  const handleSave = (question: QuizQuestion) => {
    if (editing) onUpdate(question)
    else onAdd(question)
    setFormOpen(false)
  }

  return (
    <>
      <Drawer open={open} onClose={onClose} title="문제 은행 관리">
        <div className="question-bank-editor">
          <Button onClick={openNew}>
            <Plus size={18} />
            질문 추가
          </Button>
          <div className="question-bank-editor__list">
            {questions.map((question) => (
              <Panel key={question.id} variant="subtle" className="question-bank-editor__row">
                <div className="question-bank-editor__row-info">
                  <span className="question-bank-editor__row-kind">
                    {question.kind === 'choice' ? '객관식' : '주관식'}
                  </span>
                  <span className="question-bank-editor__row-prompt">{question.prompt}</span>
                </div>
                <div className="question-bank-editor__row-actions">
                  <IconButton aria-label="수정" onClick={() => openEdit(question)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton aria-label="삭제" onClick={() => onRemove(question.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </Drawer>
      <QuestionEditForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSave={handleSave}
      />
    </>
  )
}
