import type { Concept, Topic } from '../types/content'

// 문항의 `conceptId`로 근거 개념을 찾는다. 개념 id는 주제 전체에서 유일하다(data 스키마 테스트).
export function findConcept(topics: Topic[], conceptId: string): Concept | null {
  for (const topic of topics) {
    const concept = topic.concepts.find((candidate) => candidate.id === conceptId)
    if (concept !== undefined) {
      return concept
    }
  }

  return null
}
