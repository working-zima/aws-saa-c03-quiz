// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { emptyProgress, markTopicRead, recordAnswer } from './progress'

describe('progress', () => {
  it('빈 진행 상태를 만든다', () => {
    expect(emptyProgress()).toEqual({ version: 1, read: {}, answers: {} })
  })

  it('주제를 읽음 처리하면서 원본을 변경하지 않는다', () => {
    const progress = emptyProgress()

    const next = markTopicRead(progress, 'topic-a')

    expect(next).toEqual({ version: 1, read: { 'topic-a': true }, answers: {} })
    expect(progress).toEqual({ version: 1, read: {}, answers: {} })
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
})
