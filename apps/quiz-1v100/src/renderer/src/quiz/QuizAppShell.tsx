import { useState } from 'react'
import { AnswerRevealPanel } from './AnswerRevealPanel'
import { GameOverScreen } from './GameOverScreen'
import { GameSetup } from './GameSetup'
import { HostAnswerPicker } from './HostAnswerPicker'
import { ParticipantGrid } from './ParticipantGrid'
import { QuestionBankEditor } from './QuestionBankEditor'
import { QuestionCard } from './QuestionCard'
import { QuizHud } from './QuizHud'
import { ReadyView } from './ReadyView'
import { RecruitmentView } from './RecruitmentView'
import { RoundResultBanner } from './RoundResultBanner'
import { useQuestionBank } from './useQuestionBank'
import { useQuizGame } from './useQuizGame'
import { WinnerScreen } from './WinnerScreen'

export interface QuizAppShellProps {
  baseUrl: string | null
  sfxVolume: number
}

const ROUND_PHASES = new Set(['question', 'hostPick', 'answerReveal', 'reveal', 'roundResult'])
/** 이 단계에서는 참가자 그리드 위에 딤드 배경 + 가운데 카드로 덮어서 보여줍니다.
 *  reveal 단계는 제외 — 정답 공개는 그리드 타일이 직접 불 켜지는 연출이라 가려지면 안 됩니다. */
const OVERLAY_PHASES = new Set(['question', 'hostPick', 'answerReveal', 'roundResult'])

export function QuizAppShell({ baseUrl, sfxVolume }: QuizAppShellProps) {
  const bank = useQuestionBank()
  const game = useQuizGame({
    baseUrl,
    questions: bank.questions,
    defaultAnswerSeconds: bank.defaultAnswerSeconds,
    sfxVolume,
  })
  const [questionBankOpen, setQuestionBankOpen] = useState(false)

  const aliveCount = game.participants.filter((p) => p.alive).length

  return (
    <div className="quiz-app-shell">
      <QuizHud
        round={game.round}
        aliveCount={aliveCount}
        totalCount={game.participants.length}
        chatStatus={game.chatStatus}
        onEndGame={game.phase !== 'setup' ? game.resetGame : undefined}
      />

      <div className="quiz-content">
        <div className="quiz-content__inner">
          {game.phase === 'setup' ? (
            <GameSetup
              chatStatus={game.chatStatus}
              chatError={game.chatError}
              onConnect={game.connect}
              targetCount={game.targetCount}
              onTargetCountChange={game.setTargetCount}
              hostParticipates={game.hostParticipates}
              onHostParticipatesChange={game.setHostParticipates}
              hostNickname={game.hostNickname}
              onHostNicknameChange={game.setHostNickname}
              answerSeconds={bank.defaultAnswerSeconds ?? 10}
              onAnswerSecondsChange={bank.setDefaultAnswerSeconds}
              onStartRecruiting={game.startRecruiting}
              onOpenQuestionBank={() => setQuestionBankOpen(true)}
            />
          ) : null}

          {game.phase === 'recruiting' ? (
            <RecruitmentView
              participants={game.participants}
              targetCount={game.targetCount}
              onCloseRecruiting={game.closeRecruiting}
              onDevInjectMockRecruits={() =>
                game.devInjectMockRecruits(Math.max(1, Math.min(5, game.targetCount)))
              }
            />
          ) : null}

          {game.phase === 'ready' ? (
            <ReadyView participants={game.participants} onStartGame={game.startGame} />
          ) : null}

          {ROUND_PHASES.has(game.phase) ? (
            <div className="quiz-stage">
              {/* 참가자 그리드는 항상 뒤쪽에 떠 있고, 문제/결과 카드는 그 위에 딤드 오버레이로 겹쳐 보여줍니다. */}
              <ParticipantGrid participants={game.participants} roundStatus={game.roundStatus} />

              {OVERLAY_PHASES.has(game.phase) ? (
                <div className="quiz-stage__overlay">
                  <div className="quiz-stage__overlay-backdrop" />
                  <div className="quiz-stage__overlay-content">
                    {game.phase === 'question' && game.currentQuestion ? (
                      <QuestionCard
                        question={game.currentQuestion}
                        answerSeconds={game.answerSeconds}
                        remainingSeconds={game.remainingSeconds}
                        onDevInjectMockAnswers={game.devInjectMockAnswers}
                      />
                    ) : null}

                    {game.phase === 'hostPick' && game.currentQuestion ? (
                      <HostAnswerPicker
                        question={game.currentQuestion}
                        onConfirm={game.confirmHostAnswer}
                      />
                    ) : null}

                    {game.phase === 'answerReveal' && game.currentQuestion ? (
                      <AnswerRevealPanel
                        question={game.currentQuestion}
                        answerShown={game.answerShown}
                        onRevealAnswer={game.revealAnswer}
                        onRevealParticipants={game.revealParticipants}
                      />
                    ) : null}

                    {game.phase === 'roundResult' ? (
                      <RoundResultBanner
                        eliminatedThisRound={game.eliminatedThisRound}
                        survivorCount={aliveCount}
                        nextAction={game.nextAction}
                        onProceed={game.proceed}
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {game.phase === 'winner' ? (
            <WinnerScreen winner={game.winner} sfxVolume={sfxVolume} onRestart={game.resetGame} />
          ) : null}

          {game.phase === 'gameOver' ? (
            <GameOverScreen
              survivors={game.participants.filter((p) => p.alive)}
              onRestart={game.resetGame}
            />
          ) : null}
        </div>
      </div>

      <QuestionBankEditor
        open={questionBankOpen}
        onClose={() => setQuestionBankOpen(false)}
        questions={bank.questions ?? []}
        onAdd={bank.addQuestion}
        onUpdate={bank.updateQuestion}
        onRemove={bank.removeQuestion}
      />
    </div>
  )
}
