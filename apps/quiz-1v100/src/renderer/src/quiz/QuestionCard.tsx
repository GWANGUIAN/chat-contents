import { Badge, Button, Panel, ProgressBar, Title } from '@chat-contents/ui'
import type { QuizQuestion } from '../../../shared/quiz-types'
import { formatMmSs } from './types'

export interface QuestionCardProps {
  question: QuizQuestion
  answerSeconds: number
  remainingSeconds: number
  onDevInjectMockAnswers?: () => void
}

export function QuestionCard({
  question,
  answerSeconds,
  remainingSeconds,
  onDevInjectMockAnswers,
}: QuestionCardProps) {
  const guideText =
    question.kind === 'choice'
      ? `채팅창에 ${question.options.map((_, index) => `!${index + 1}`).join(', ')} 중 정답 번호를 입력해주세요!`
      : '채팅창에 !정답 형식으로 답을 입력해주세요! (예: !워싱턴DC)'

  return (
    <Panel className="question-card">
      <Title as="h2" size="lg">
        {question.prompt}
      </Title>

      {question.kind === 'choice' ? (
        <ol className="question-card__options">
          {question.options.map((option, index) => (
            <li key={option} className="question-card__option">
              <Badge variant="outline" tone="neutral">
                !{index + 1}
              </Badge>
              <span>{option}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <Badge tone="accent" variant="outline" className="question-card__guide">
        {guideText}
      </Badge>

      <ProgressBar
        value={answerSeconds - remainingSeconds}
        max={answerSeconds}
        formatValue={() => formatMmSs(remainingSeconds)}
      />

      {import.meta.env.DEV && onDevInjectMockAnswers ? (
        <Button variant="ghost" onClick={onDevInjectMockAnswers}>
          테스트: 목업 답변 받기
        </Button>
      ) : null}
    </Panel>
  )
}
