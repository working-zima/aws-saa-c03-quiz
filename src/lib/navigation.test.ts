// @vitest-environment node

import { describe, expect, it } from 'vitest'
import type { Topic } from '../types/content'
import { adjacentTopics } from './navigation'

const topics: Topic[] = [
  {
    id: 'topic-a',
    title: '주제 A',
    importance: 3,
    sourcePages: [1, 1],
    concepts: [],
  },
  {
    id: 'topic-b',
    title: '주제 B',
    importance: 2,
    sourcePages: [2, 2],
    concepts: [],
  },
  {
    id: 'topic-c',
    title: '주제 C',
    importance: 0,
    sourcePages: [3, 3],
    concepts: [],
  },
]

describe('adjacentTopics', () => {
  it('가운데 주제의 앞뒤 주제를 반환한다', () => {
    const result = adjacentTopics(topics, 'topic-b')

    expect(result.prev?.id).toBe('topic-a')
    expect(result.next?.id).toBe('topic-c')
  })

  it('첫 주제에는 이전 주제가 없다', () => {
    const result = adjacentTopics(topics, 'topic-a')

    expect(result.prev).toBeNull()
    expect(result.next?.id).toBe('topic-b')
  })

  it('마지막 주제에는 다음 주제가 없다', () => {
    const result = adjacentTopics(topics, 'topic-c')

    expect(result.prev?.id).toBe('topic-b')
    expect(result.next).toBeNull()
  })

  it('배열에 없는 id에는 인접 주제가 없다', () => {
    const result = adjacentTopics(topics, 'topic-missing')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('id가 undefined이면 인접 주제가 없다', () => {
    const result = adjacentTopics(topics, undefined)

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('주제가 하나뿐이면 앞뒤 주제가 없다', () => {
    const result = adjacentTopics([topics[0]], 'topic-a')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('빈 배열에는 인접 주제가 없다', () => {
    const result = adjacentTopics([], 'topic-a')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })
})
