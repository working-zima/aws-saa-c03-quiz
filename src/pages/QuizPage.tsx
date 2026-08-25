import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QuizRunner } from '../components/QuizRunner'
import { questions as defaultQuestions, topics as defaultTopics } from '../data'
import { useProgress } from '../hooks/useProgress'
import { adjacentTopics } from '../lib/navigation'
import { shuffleQuestions } from '../lib/shuffle'
import type { Question, Topic } from '../types/content'

interface QuizPageProps {
  questions?: Question[]
  topics?: Topic[]
  answer?: (questionId: string, correct: boolean) => void
  shuffle?: (questions: Question[]) => Question[]
}

const defaultShuffle = (items: Question[]) => shuffleQuestions(items, Math.random)

const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostLinkClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'

export function QuizPage({ questions = defaultQuestions, topics = defaultTopics, answer: providedAnswer, shuffle = defaultShuffle }: QuizPageProps) {
  const { topicId } = useParams()
  const { answer: storedAnswer } = useProgress()
  const answer = providedAnswer ?? storedAnswer
  const topicQuestions = useMemo(
    () => shuffle(questions.filter((question) => question.topicId === topicId)),
    [questions, shuffle, topicId],
  )
  const { next } = adjacentTopics(topics, topicId)

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

  return (
    <QuizRunner
      answer={answer}
      questions={topicQuestions}
      renderComplete={(correctCount, total) => {
        const hasIncorrectAnswer = correctCount < total
        return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">확인 문제 완료</h1>
          <p className="text-[15px] leading-7 text-neutral-300">맞힌 개수 {correctCount} / {total}</p>
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
      }}
      title="확인 문제"
    />
  )
}
