// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { emptyProgress, markForReview, markTopicRead, recordAnswer } from './progress'

describe('progress', () => {
  it('빈 진행 상태를 만든다', () => {
    expect(emptyProgress()).toEqual({ version: 3, read: {}, answers: {}, review: {} })
  })

  it('주제를 읽음 처리하면서 원본을 변경하지 않는다', () => {
    const progress = emptyProgress()

    const next = markTopicRead(progress, 'topic-a')

    expect(next.read).toEqual({ 'topic-a': true })
    expect(progress.read).toEqual({})
    expect(next).not.toBe(progress)
    expect(next.read).not.toBe(progress.read)
  })

  it('답안을 기록하면서 원본을 변경하지 않고 재시도 결과로 덮어쓴다', () => {
    const progress = emptyProgress()
    const incorrect = recordAnswer(progress, 'q001', false)
    const corrected = recordAnswer(incorrect, 'q001', true)

    expect(progress.answers).toEqual({})
    expect(incorrect.answers).toEqual({ q001: false })
    expect(corrected.answers).toEqual({ q001: true })
    expect(corrected.answers).not.toBe(incorrect.answers)
  })

  // 무엇을 복습할지는 사용자가 정한다. 채점 결과로 복습 목록을 채우지도 비우지도 않는다 (ADR-032).
  it('틀린 문항을 복습 목록에 넣지 않는다', () => {
    const progress = recordAnswer(emptyProgress(), 'q001', false)

    expect(progress.review).toEqual({})
  })

  it('복습 목록에 든 문항을 다시 풀어 맞혀도 빼지 않는다', () => {
    const marked = markForReview(emptyProgress(), 'q001', true)

    const corrected = recordAnswer(marked, 'q001', true)

    expect(corrected.answers.q001).toBe(true)
    expect(corrected.review).toEqual({ q001: true })
  })

  it('문항을 복습 목록에 넣으면서 원본을 변경하지 않는다', () => {
    const progress = recordAnswer(emptyProgress(), 'q001', true)

    const next = markForReview(progress, 'q001', true)

    expect(next.review).toEqual({ q001: true })
    expect(progress.review).toEqual({})
    expect(next.answers).toEqual(progress.answers)
  })

  it('복습 목록에서 문항을 빼면서 원본과 다른 문항을 건드리지 않는다', () => {
    const progress = markForReview(markForReview(emptyProgress(), 'q001', true), 'q002', true)

    const next = markForReview(progress, 'q001', false)

    expect(next.review).toEqual({ q002: true })
    expect(progress.review).toEqual({ q001: true, q002: true })
  })

  it('복습 목록에 없는 문항을 빼도 그대로 둔다', () => {
    const progress = markForReview(emptyProgress(), 'q001', true)

    expect(markForReview(progress, 'q999', false).review).toEqual({ q001: true })
  })
})
