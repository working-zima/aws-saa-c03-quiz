import { describe, expect, it } from 'vitest'

import { questions, topics } from './index'

describe('학습 데이터 무결성', () => {
  it('주제 id가 유일하다', () => {
    const ids = topics.map((topic) => topic.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('주제 중요도가 3, 2 또는 0이다', () => {
    topics.forEach((topic) => {
      expect([3, 2, 0]).toContain(topic.importance)
    })
  })

  it('개념 id가 전역에서 유일하다', () => {
    const ids = topics.flatMap((topic) =>
      topic.concepts.map((concept) => concept.id),
    )

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('문제 id가 유일하다', () => {
    const ids = questions.map((question) => question.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('모든 문제가 실재하는 주제를 참조한다', () => {
    const topicIds = new Set(topics.map((topic) => topic.id))

    questions.forEach((question) => {
      expect(topicIds.has(question.topicId)).toBe(true)
    })
  })

  it('모든 문제가 실재하는 개념을 참조한다', () => {
    const conceptIds = new Set(
      topics.flatMap((topic) => topic.concepts.map((concept) => concept.id)),
    )

    questions.forEach((question) => {
      expect(conceptIds.has(question.conceptId)).toBe(true)
    })
  })

  it('모든 문제는 서로 다른 보기 4개를 가진다', () => {
    questions.forEach((question) => {
      expect(question.choices).toHaveLength(4)
      expect(new Set(question.choices).size).toBe(4)
    })
  })

  it('모든 문제의 정답 인덱스가 0부터 3 범위다', () => {
    questions.forEach((question) => {
      expect(question.answerIndex).toBeGreaterThanOrEqual(0)
      expect(question.answerIndex).toBeLessThanOrEqual(3)
    })
  })

  it('모든 문제의 해설이 빈 문자열이 아니다', () => {
    questions.forEach((question) => {
      expect(question.explanation.trim()).not.toBe('')
    })
  })
})
