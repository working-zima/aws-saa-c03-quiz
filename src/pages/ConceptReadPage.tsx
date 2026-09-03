import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConceptList } from '../components/ConceptList'
import { topics as defaultTopics } from '../data'
import { useProgress } from '../hooks/useProgress'
import { adjacentTopics } from '../lib/navigation'
import type { Topic } from '../types/content'

interface ConceptReadPageProps {
  topics?: Topic[]
  markRead?: (topicId: string) => void
}

const previousIcon = (
  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
    <path d="M15 19l-7-7 7-7" />
  </svg>
)

const nextIcon = (
  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const ghostLinkClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'

const importanceLabel = {
  3: { label: '★★★', className: 'text-importance-high' },
  2: { label: '★★☆', className: 'text-importance-medium' },
} as const

export function ConceptReadPage({ topics = defaultTopics, markRead: providedMarkRead }: ConceptReadPageProps) {
  const { topicId } = useParams()
  const { markRead: storedMarkRead } = useProgress()
  const markRead = providedMarkRead ?? storedMarkRead
  const topic = topics.find((candidate) => candidate.id === topicId)
  const { prev, next } = adjacentTopics(topics, topicId)

  useEffect(() => {
    if (topicId && topic) markRead(topicId)
  }, [markRead, topic, topicId])

  if (!topic) {
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">주제를 찾을 수 없습니다.</h1>
          <p className="text-[15px] leading-7 text-neutral-300">요청한 학습 주제가 존재하지 않습니다.</p>
        </div>
        <Link className="inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white" to="/">
          주제 목록으로 돌아가기
        </Link>
      </section>
    )
  }

  const importance = topic.importance === 0 ? null : importanceLabel[topic.importance]

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-title">{topic.title}</h1>
          {importance && <span className={`shrink-0 text-sm ${importance.className}`}>{importance.label}</span>}
        </div>
      </header>

      <ConceptList concepts={topic.concepts} headingLevel={2} />

      <div className="sticky bottom-0 -mx-5 border-t border-border bg-page px-5 py-3 sm:mx-0 sm:px-0">
        <div className="flex items-center justify-between gap-3">
          {prev ? (
            <Link aria-label="이전 주제" className={ghostLinkClass} to={`/topic/${prev.id}`}>
              {previousIcon}
            </Link>
          ) : (
            <span aria-hidden="true" className={`${ghostLinkClass} text-neutral-500`}>
              {previousIcon}
            </span>
          )}
          <Link className="inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white" to={`/topic/${topic.id}/quiz`}>
            확인 문제 풀기
          </Link>
          {next ? (
            <Link aria-label="다음 주제" className={ghostLinkClass} to={`/topic/${next.id}`}>
              {nextIcon}
            </Link>
          ) : (
            <span aria-hidden="true" className={`${ghostLinkClass} text-neutral-500`}>
              {nextIcon}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
