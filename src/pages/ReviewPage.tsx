import { Link } from 'react-router-dom'
import { questions as defaultQuestions, topics as defaultTopics } from '../data'
import { useProgress } from '../hooks/useProgress'
import { conceptsToReview } from '../lib/stats'
import type { Question, Topic } from '../types/content'
import type { Progress } from '../types/progress'

interface ReviewPageProps {
  topics?: Topic[]
  questions?: Question[]
  progress?: Progress
}

export function ReviewPage({
  topics = defaultTopics,
  questions = defaultQuestions,
  progress: providedProgress,
}: ReviewPageProps) {
  const { progress: storedProgress } = useProgress()
  const progress = providedProgress ?? storedProgress
  const reviewConceptIds = new Set(
    conceptsToReview(topics, questions, progress).map((concept) => concept.id),
  )
  const reviewGroups = topics
    .map((topic) => ({
      topic,
      concepts: topic.concepts.filter((concept) => reviewConceptIds.has(concept.id)),
    }))
    .filter((group) => group.concepts.length > 0)
  const hasAnswered = questions.some((question) => question.id in progress.answers)

  return (
    <section className="max-w-3xl space-y-8 break-keep">
      <h1 className="text-2xl font-semibold text-title">복습</h1>

      {reviewGroups.length === 0 ? (
        hasAnswered ? (
          <p className="text-[15px] leading-7 text-body">
            복습할 개념이 없습니다. 모두 잘 익혔습니다.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-[15px] leading-7 text-body">
              확인 문제를 풀면 여기에 복습할 개념이 모입니다.
            </p>
            <Link className="inline-block rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100" to="/">
              주제 목록으로 가기
            </Link>
          </div>
        )
      ) : (
        <div className="space-y-8">
          {reviewGroups.map(({ topic, concepts }) => {
            const headingId = `review-${topic.id}`

            return (
              <section
                aria-labelledby={headingId}
                className="space-y-4 border-t border-neutral-800 pt-6"
                key={topic.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-medium text-neutral-100" id={headingId}>
                    {topic.title}
                  </h2>
                  <Link
                    className="shrink-0 rounded-md px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                    to={`/topic/${topic.id}/quiz`}
                  >
                    확인 문제 다시 풀기
                  </Link>
                </div>

                <ul className="divide-y divide-neutral-800">
                  {concepts.map((concept) => (
                    <li key={concept.id}>
                      <Link
                        className="block py-4 transition-colors hover:text-neutral-100"
                        to={`/topic/${topic.id}`}
                      >
                        <span className="block text-base font-medium text-neutral-100">
                          {concept.name}
                        </span>
                        <span className="mt-1 block text-sm text-neutral-400">
                          {concept.summary}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
