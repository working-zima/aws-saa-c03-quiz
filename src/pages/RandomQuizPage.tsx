import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { QuizRunner } from '../components/QuizRunner'
import { questions as defaultQuestions } from '../data'
import { useProgress } from '../hooks/useProgress'
import { parseQuizCount } from '../lib/random-quiz'
import { shuffleQuestions } from '../lib/shuffle'
import type { Question } from '../types/content'

interface RandomQuizPageProps {
  questions?: Question[]
  answer?: (questionId: string, correct: boolean) => void
  shuffle?: (questions: Question[]) => Question[]
}

const defaultShuffle = (items: Question[]) => shuffleQuestions(items, Math.random)

const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostLinkClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'

export function RandomQuizPage({ questions = defaultQuestions, answer: providedAnswer, shuffle = defaultShuffle }: RandomQuizPageProps) {
  const { count: countSegment } = useParams()
  const count = parseQuizCount(countSegment)
  const { answer: storedAnswer } = useProgress()
  const answer = providedAnswer ?? storedAnswer
  const selectedQuestions = useMemo(
    () => count === null ? [] : shuffle(questions).slice(0, count),
    [count, questions, shuffle],
  )

  if (count === null) {
    return <Navigate replace to="/random" />
  }

  return (
    <QuizRunner
      answer={answer}
      key={count}
      questions={selectedQuestions}
      renderComplete={(correctCount, total) => {
        const hasIncorrectAnswer = correctCount < total
        return (
          <section className="max-w-2xl space-y-8 break-keep break-anywhere">
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold text-title">랜덤 문제 완료</h1>
              <p className="text-[15px] leading-7 text-neutral-300">맞힌 개수 {correctCount} / {total}</p>
            </div>
            <nav aria-label="랜덤 문제 완료 후 이동" className="flex flex-wrap gap-3">
              {hasIncorrectAnswer && <Link className={primaryButtonClass} to="/review">틀린 개념 복습하기</Link>}
              <Link className={hasIncorrectAnswer ? ghostLinkClass : primaryButtonClass} to="/random">다시 뽑기</Link>
              <Link className={ghostLinkClass} to="/">주제 목록으로 돌아가기</Link>
            </nav>
          </section>
        )
      }}
      title="랜덤 문제"
    />
  )
}
