import { Button, Panel, TextInput, Title } from '@chat-contents/ui'
import { useState } from 'react'
import type { QuizQuestion } from '../../../shared/quiz-types'

export interface HostAnswerPickerProps {
  question: QuizQuestion
  onConfirm: (rawText: string) => void
}

/** 시청자 답변 수집이 끝난 뒤, 스트리머가 무제한 시간으로 자신의 답을 고르는 화면. */
export function HostAnswerPicker({ question, onConfirm }: HostAnswerPickerProps) {
  const [text, setText] = useState('')

  return (
    <Panel className="host-answer-picker">
      <Title as="h2" size="md" tone="accent">
        스트리머 답변 선택
      </Title>

      {question.kind === 'choice' ? (
        <div className="host-answer-picker__options">
          {question.options.map((option, index) => (
            <Button key={option} onClick={() => onConfirm(String(index + 1))}>
              {index + 1}. {option}
            </Button>
          ))}
        </div>
      ) : (
        <div className="host-answer-picker__row">
          <TextInput
            placeholder="정답 입력"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button onClick={() => onConfirm(text)} disabled={!text.trim()}>
            확인
          </Button>
        </div>
      )}
    </Panel>
  )
}
