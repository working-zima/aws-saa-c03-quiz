import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { questions as defaultQuestions } from '../data'
import { useProgress } from '../hooks/useProgress'
import { isCorrect } from '../lib/grading'
import type { Question } from '../types/content'

interface QuizPageProps {
  questions?: Question[]
  answer?: (questionId: string, correct: boolean) => void
}

const choiceBaseClass = 'w-full rounded-md border border-neutral-800 bg-[#141414] px-4 py-3 text-left text-neutral-300'
const choiceCorrectClass = 'border-green-500/60 bg-green-500/5'
const choiceIncorrectClass = 'border-red-500/60 bg-red-500/5'
const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostLinkClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'

export function QuizPage({ questions = defaultQuestions, answer: providedAnswer }: QuizPageProps) {
  const { topicId } = useParams()
  const { answer: storedAnswer } = useProgress()
  const answer = providedAnswer ?? storedAnswer
  const topicQuestions = questions.filter((question) => question.topicId === topicId)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [complete, setComplete] = useState(false)

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
          <Link className={ghostLinkClass} to={`/topic/${topicId}`}>개념으로 돌아가기</Link>
        </nav>
      </section>
    )
  }

  const question = topicQuestions[questionIndex]
  const revealed = selectedIndex !== null

  function selectChoice(choiceIndex: number) {
    if (revealed) return
    const correct = isCorrect(question, choiceIndex)
    setSelectedIndex(choiceIndex)
    if (correct) setCorrectCount((count) => count + 1)
    answer(question.id, correct)
  }

  function advance() {
    if (questionIndex === topicQuestions.length - 1) {
      setComplete(true)
      return
    }
    setQuestionIndex((index) => index + 1)
    setSelectedIndex(null)
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-title">확인 문제</h1>
          <span className="text-xs text-neutral-500">{questionIndex + 1} / {topicQuestions.length}</span>
        </div>
        <h2 className="text-lg font-medium text-neutral-100">{question.prompt}</h2>
      </header>

      <div className="space-y-3">
        {question.choices.map((choice, choiceIndex) => {
          const correctChoice = revealed && isCorrect(question, choiceIndex)
          const selectedIncorrectChoice = revealed && selectedIndex === choiceIndex && !correctChoice
          const resultClass = correctChoice ? choiceCorrectClass : selectedIncorrectChoice ? choiceIncorrectClass : ''
          return (
            <button
              className={`${choiceBaseClass} ${resultClass}`}
              disabled={revealed}
              key={`${question.id}-${choiceIndex}`}
              onClick={() => selectChoice(choiceIndex)}
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
          <Link className="inline-flex min-h-[44px] items-center text-sm text-neutral-400 transition-colors hover:text-neutral-100" to={`/topic/${topicId}`}>
            근거 개념으로 돌아가기
          </Link>
        </div>
      )}

      {revealed && (
        <div className="sticky bottom-0 -mx-5 border-t border-border bg-page px-5 py-3 sm:-mx-8 sm:px-8">
          <button className={primaryButtonClass} onClick={advance} type="button">
            {questionIndex === topicQuestions.length - 1 ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </section>
  )
}
