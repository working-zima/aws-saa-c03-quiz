// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { emptyProgress, forgetWrong, markTopicRead, recordAnswer } from './progress'

describe('progress', () => {
  it('빈 진행 상태를 만든다', () => {
    expect(emptyProgress()).toEqual({ version: 2, read: {}, answers: {}, wrong: {} })
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

  it('틀린 문항을 오답노트에 넣는다', () => {
    const progress = recordAnswer(emptyProgress(), 'q001', false)

    expect(progress.wrong).toEqual({ q001: true })
  })

  it('맞힌 문항은 오답노트에 넣지 않는다', () => {
    const progress = recordAnswer(emptyProgress(), 'q001', true)

    expect(progress.wrong).toEqual({})
  })

  // 오답노트가 줄어드는 경로는 사용자가 지우는 것 하나뿐이다 (ADR-017).
  it('다시 풀어서 맞혀도 오답노트에서 빼지 않는다', () => {
    const incorrect = recordAnswer(emptyProgress(), 'q001', false)

    const corrected = recordAnswer(incorrect, 'q001', true)

    expect(corrected.answers.q001).toBe(true)
    expect(corrected.wrong).toEqual({ q001: true })
  })

  it('오답노트에서 문항을 지우면서 원본과 다른 문항을 건드리지 않는다', () => {
    const progress = recordAnswer(recordAnswer(emptyProgress(), 'q001', false), 'q002', false)

    const next = forgetWrong(progress, 'q001')

    expect(next.wrong).toEqual({ q002: true })
    expect(progress.wrong).toEqual({ q001: true, q002: true })
    expect(next.answers).toEqual(progress.answers)
  })

  it('오답노트에 없는 문항을 지워도 그대로 둔다', () => {
    const progress = recordAnswer(emptyProgress(), 'q001', false)

    expect(forgetWrong(progress, 'q999').wrong).toEqual({ q001: true })
  })
})
