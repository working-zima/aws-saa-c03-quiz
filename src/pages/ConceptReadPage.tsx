import { useParams } from 'react-router-dom'

export function ConceptReadPage() {
  const { topicId } = useParams()
  return <section className="max-w-2xl space-y-8"><h1 className="text-2xl font-semibold text-title">개념 읽기</h1><p className="break-keep text-sm text-muted">주제: {topicId}</p></section>
}
