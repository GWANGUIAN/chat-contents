import { Button, IconButton, Modal, Plus, TextInput, Trash2 } from '@chat-contents/ui'
import { useEffect, useState } from 'react'
import type { QuizQuestion } from '../../../shared/quiz-types'

export interface QuestionEditFormProps {
  open: boolean
  onClose: () => void
  initial: QuizQuestion | null
  onSave: (question: QuizQuestion) => void
}

interface Row {
  id: string
  value: string
}

function toRows(values: string[]): Row[] {
  return values.map((value) => ({ id: crypto.randomUUID(), value }))
}

export function QuestionEditForm({ open, onClose, initial, onSave }: QuestionEditFormProps) {
  const [id, setId] = useState<string>(() => crypto.randomUUID())
  const [kind, setKind] = useState<'choice' | 'short'>('choice')
  const [prompt, setPrompt] = useState('')
  const [optionRows, setOptionRows] = useState<Row[]>(() => toRows(['', '']))
  const [correctRowId, setCorrectRowId] = useState<string | null>(null)
  const [answerRows, setAnswerRows] = useState<Row[]>(() => toRows(['']))

  useEffect(() => {
    if (!open) return
    if (initial) {
      setId(initial.id)
      setKind(initial.kind)
      setPrompt(initial.prompt)
      if (initial.kind === 'choice') {
        const rows = toRows(initial.options)
        setOptionRows(rows)
        setCorrectRowId(rows[initial.correctOptionIndex]?.id ?? rows[0]?.id ?? null)
        setAnswerRows(toRows(['']))
      } else {
        setAnswerRows(toRows(initial.acceptedAnswers))
        setOptionRows(toRows(['', '']))
        setCorrectRowId(null)
      }
    } else {
      setId(crypto.randomUUID())
      setKind('choice')
      setPrompt('')
      const rows = toRows(['', ''])
      setOptionRows(rows)
      setCorrectRowId(rows[0]?.id ?? null)
      setAnswerRows(toRows(['']))
    }
  }, [open, initial])

  const canSave =
    prompt.trim().length > 0 &&
    (kind === 'choice'
      ? optionRows.filter((row) => row.value.trim()).length >= 2 && correctRowId !== null
      : answerRows.some((row) => row.value.trim()))

  const handleSave = () => {
    if (!canSave) return
    if (kind === 'choice') {
      const cleaned = optionRows.filter((row) => row.value.trim())
      const correctIndex = Math.max(
        0,
        cleaned.findIndex((row) => row.id === correctRowId),
      )
      onSave({
        id,
        kind: 'choice',
        prompt: prompt.trim(),
        options: cleaned.map((row) => row.value.trim()),
        correctOptionIndex: correctIndex,
      })
    } else {
      onSave({
        id,
        kind: 'short',
        prompt: prompt.trim(),
        acceptedAnswers: answerRows.map((row) => row.value.trim()).filter(Boolean),
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? '질문 수정' : '질문 추가'}>
      <div className="question-edit-form">
        <TextInput
          placeholder="문제"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />

        <div className="question-edit-form__kind-row">
          <Button
            variant={kind === 'choice' ? 'primary' : 'secondary'}
            onClick={() => setKind('choice')}
          >
            객관식
          </Button>
          <Button
            variant={kind === 'short' ? 'primary' : 'secondary'}
            onClick={() => setKind('short')}
          >
            주관식
          </Button>
        </div>

        {kind === 'choice' ? (
          <div className="question-edit-form__list">
            {optionRows.map((row) => (
              <div key={row.id} className="question-edit-form__list-row">
                <Button
                  variant={correctRowId === row.id ? 'primary' : 'secondary'}
                  onClick={() => setCorrectRowId(row.id)}
                >
                  정답
                </Button>
                <TextInput
                  placeholder="선택지"
                  value={row.value}
                  onChange={(event) =>
                    setOptionRows((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, value: event.target.value } : r)),
                    )
                  }
                />
                <IconButton
                  aria-label="선택지 삭제"
                  disabled={optionRows.length <= 2}
                  onClick={() => {
                    setOptionRows((prev) => prev.filter((r) => r.id !== row.id))
                    if (correctRowId === row.id) setCorrectRowId(null)
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() =>
                setOptionRows((prev) => [...prev, { id: crypto.randomUUID(), value: '' }])
              }
            >
              <Plus size={16} />
              선택지 추가
            </Button>
          </div>
        ) : (
          <div className="question-edit-form__list">
            {answerRows.map((row) => (
              <div key={row.id} className="question-edit-form__list-row">
                <TextInput
                  placeholder="정답(동의어)"
                  value={row.value}
                  onChange={(event) =>
                    setAnswerRows((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, value: event.target.value } : r)),
                    )
                  }
                />
                <IconButton
                  aria-label="정답 삭제"
                  disabled={answerRows.length <= 1}
                  onClick={() => setAnswerRows((prev) => prev.filter((r) => r.id !== row.id))}
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() =>
                setAnswerRows((prev) => [...prev, { id: crypto.randomUUID(), value: '' }])
              }
            >
              <Plus size={16} />
              동의어 추가
            </Button>
          </div>
        )}

        <Button onClick={handleSave} disabled={!canSave}>
          저장
        </Button>
      </div>
    </Modal>
  )
}
