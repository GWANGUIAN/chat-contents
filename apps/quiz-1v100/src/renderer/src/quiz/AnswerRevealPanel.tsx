import { Badge, Button, Panel, Title } from '@chat-contents/ui'
import type { QuizQuestion } from '../../../shared/quiz-types'

export interface AnswerRevealPanelProps {
  question: QuizQuestion
  answerShown: boolean
  onRevealAnswer: () => void
  onRevealParticipants: () => void
}

/** 답변 수집이 끝난 뒤: "정답 공개"를 눌러 정답만 먼저 보여주고, "정답자 공개"를 눌러야 참가자 타일이 색칠됩니다. */
export function AnswerRevealPanel({
  question,
  answerShown,
  onRevealAnswer,
  onRevealParticipants,
}: AnswerRevealPanelProps) {
  return (
    <Panel className="answer-reveal-panel">
      <Title as="h2" size="lg">
        {question.prompt}
      </Title>

      {question.kind === 'choice' ? (
        <ol className="question-card__options">
          {question.options.map((option, index) => {
            const isCorrect = answerShown && index === question.correctOptionIndex
            return (
              <li
                key={option}
                className={[
                  'question-card__option',
                  isCorrect ? 'question-card__option--correct' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Badge
                  variant={isCorrect ? 'solid' : 'outline'}
                  tone={isCorrect ? 'success' : 'neutral'}
                >
                  !{index + 1}
                </Badge>
                <span>{option}</span>
              </li>
            )
          })}
        </ol>
      ) : answerShown ? (
        <Badge tone="success" variant="solid" className="answer-reveal-panel__short-answer">
          정답: {question.acceptedAnswers[0]}
        </Badge>
      ) : null}

      {!answerShown ? (
        <Button onClick={onRevealAnswer}>정답 공개</Button>
      ) : (
        <Button onClick={onRevealParticipants}>정답자 공개</Button>
      )}
    </Panel>
  )
}
