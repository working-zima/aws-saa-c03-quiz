import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { topics as defaultTopics } from '../data'
import { useProgress } from '../hooks/useProgress'
import type { Topic } from '../types/content'

interface ConceptReadPageProps {
  topics?: Topic[]
  markRead?: (topicId: string) => void
}

const importanceLabel = {
  3: { label: '★★★', className: 'text-importance-high' },
  2: { label: '★★☆', className: 'text-importance-medium' },
} as const

export function ConceptReadPage({ topics = defaultTopics, markRead: providedMarkRead }: ConceptReadPageProps) {
  const { topicId } = useParams()
  const { markRead: storedMarkRead } = useProgress()
  const markRead = providedMarkRead ?? storedMarkRead
  const topic = topics.find((candidate) => candidate.id === topicId)

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

      <div className="space-y-8">
        {topic.concepts.map((concept) => (
          <article className="space-y-3" key={concept.id}>
            <div className="space-y-1">
              <h2 className="text-base font-medium text-neutral-100">{concept.name}</h2>
              <p className="text-sm text-neutral-400">{concept.summary}</p>
            </div>
            <div className="space-y-3">
              {concept.paragraphs.map((paragraph, index) => (
                <p className="whitespace-pre-line break-keep text-[15px] leading-7 text-neutral-300" key={`${concept.id}-${index}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <Link className="inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white" to={`/topic/${topic.id}/quiz`}>
        확인 문제 풀기
      </Link>
    </section>
  )
}
