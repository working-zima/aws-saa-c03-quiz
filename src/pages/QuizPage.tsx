import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { questions as defaultQuestions, topics as defaultTopics } from '../data'
import { useProgress } from '../hooks/useProgress'
import { isCorrect } from '../lib/grading'
import { adjacentTopics } from '../lib/navigation'
import type { Question, Topic } from '../types/content'

interface QuizPageProps {
  questions?: Question[]
  topics?: Topic[]
  answer?: (questionId: string, correct: boolean) => void
}

const choiceBaseClass = 'w-full rounded-md border border-neutral-800 bg-[#141414] px-4 py-3 text-left text-neutral-300'
const choiceCorrectClass = 'border-green-500/60 bg-green-500/5'
const choiceIncorrectClass = 'border-red-500/60 bg-red-500/5'
const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostLinkClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'

export function QuizPage({ questions = defaultQuestions, topics = defaultTopics, answer: providedAnswer }: QuizPageProps) {
  const { topicId } = useParams()
  const { answer: storedAnswer } = useProgress()
  const answer = providedAnswer ?? storedAnswer
  const topicQuestions = questions.filter((question) => question.topicId === topicId)
  const { next } = adjacentTopics(topics, topicId)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selections, setSelections] = useState<(number | null)[]>(() => topicQuestions.map(() => null))
  const [complete, setComplete] = useState(false)
  const correctCount = selections.filter(
    (selection, index) => selection !== null && isCorrect(topicQuestions[index], selection),
  ).length

  if (!topicId || topicQuestions.length === 0) {
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">아직 확인 문제가 없습니다.</h1>
          <p className="text-[15px] leading-7 text-neutral-300">이 주제의 확인 문제는 준비 중입니다.</p>
        </div>
        {topicId && <Link className={primaryButtonClass} to={`/topic/${topicId}`}>개념으로 돌아가기</Link>}
        {!topicId && <Link className={primaryButtonClass} to="/">주제 목록으로 돌아가기</Link>}
      </section>
    )
  }

  if (complete) {
    const hasIncorrectAnswer = correctCount < topicQuestions.length
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">확인 문제 완료</h1>
          <p className="text-[15px] leading-7 text-neutral-300">맞힌 개수 {correctCount} / {topicQuestions.length}</p>
        </div>
        <nav className="flex flex-wrap gap-3" aria-label="퀴즈 완료 후 이동">
          {hasIncorrectAnswer && <Link className={primaryButtonClass} to="/review">틀린 개념 복습하기</Link>}
          {next && (
            <Link className={hasIncorrectAnswer ? ghostLinkClass : primaryButtonClass} to={`/topic/${next.id}`}>
              다음 주제 이어가기
            </Link>
          )}
          <Link className={ghostLinkClass} to={`/topic/${topicId}`}>개념으로 돌아가기</Link>
        </nav>
      </section>
    )
  }

  const question = topicQuestions[questionIndex]
  const selectedChoice = selections[questionIndex]
  const revealed = selectedChoice !== null
  const advanceInstructionId = `quiz-advance-instruction-${question.id}`

  function selectChoice(choiceIndex: number) {
    if (revealed) return
    const correct = isCorrect(question, choiceIndex)
    setSelections((currentSelections) => currentSelections.map(
      (selection, index) => index === questionIndex ? choiceIndex : selection,
    ))
    answer(question.id, correct)
  }

  function advance() {
    if (questionIndex === topicQuestions.length - 1) {
      setComplete(true)
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <header className="space-y-3">
        <div className="flex min-h-[44px] items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-title">확인 문제</h1>
          <div className="flex items-center gap-3">
            {questionIndex > 0 && (
              <button
                aria-label="이전 문제"
                className={ghostLinkClass}
                onClick={() => setQuestionIndex((index) => index - 1)}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className="text-xs text-neutral-500">{questionIndex + 1} / {topicQuestions.length}</span>
          </div>
        </div>
        <h2 className="text-lg font-medium text-neutral-100">{question.prompt}</h2>
      </header>

      <div className="space-y-3">
        {question.choices.map((choice, choiceIndex) => {
          const correctChoice = revealed && isCorrect(question, choiceIndex)
          const selectedIncorrectChoice = revealed && selectedChoice === choiceIndex && !correctChoice
          const resultClass = correctChoice ? choiceCorrectClass : selectedIncorrectChoice ? choiceIncorrectClass : ''
          const advanceClass = correctChoice ? 'cursor-pointer hover:border-green-500' : ''
          return (
            <button
              aria-describedby={correctChoice ? advanceInstructionId : undefined}
              className={`${choiceBaseClass} ${resultClass} ${advanceClass}`}
              disabled={revealed && !correctChoice}
              key={`${question.id}-${choiceIndex}`}
              onClick={() => revealed ? advance() : selectChoice(choiceIndex)}
              type="button"
            >
              {choice}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="animate-[fade-in_0.2s_ease-out] space-y-3 border-t border-neutral-800 pt-5">
          <p className="text-[15px] leading-7 text-neutral-300">{question.explanation}</p>
          <p className="text-xs text-neutral-500" id={advanceInstructionId}>
            {questionIndex === topicQuestions.length - 1
              ? '정답을 한 번 더 누르면 결과를 봅니다'
              : '정답을 한 번 더 누르면 다음 문제로 넘어갑니다'}
          </p>
          <Link className="inline-flex min-h-[44px] items-center text-sm text-neutral-400 transition-colors hover:text-neutral-100" to={`/topic/${topicId}`}>
            근거 개념으로 돌아가기
          </Link>
        </div>
      )}
    </section>
  )
}
