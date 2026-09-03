import { describe, expect, it } from 'vitest'
import type { Topic } from '../types/content'
import { findConcept } from './concepts'

const topics: Topic[] = [
  {
    id: 'first-topic',
    title: '첫 번째 주제',
    importance: 3,
    sourcePages: [1, 2],
    concepts: [
      { id: 'first-topic.a', name: '개념 A', summary: '요약 A', paragraphs: ['본문 A'] },
      { id: 'first-topic.b', name: '개념 B', summary: '요약 B', paragraphs: ['본문 B'] },
    ],
  },
  {
    id: 'second-topic',
    title: '두 번째 주제',
    importance: 2,
    sourcePages: [3, 4],
    concepts: [
      { id: 'second-topic.c', name: '개념 C', summary: '요약 C', paragraphs: ['본문 C'] },
    ],
  },
]

describe('findConcept', () => {
  it('첫 주제가 아닌 주제에 있는 개념도 찾는다', () => {
    expect(findConcept(topics, 'second-topic.c')?.name).toBe('개념 C')
  })

  it('같은 주제 안에서 id로 개념을 가른다', () => {
    expect(findConcept(topics, 'first-topic.b')?.name).toBe('개념 B')
  })

  it('없는 id에는 null을 돌려준다', () => {
    expect(findConcept(topics, 'first-topic.missing')).toBeNull()
  })
})
