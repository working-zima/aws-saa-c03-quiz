// @vitest-environment node

import { describe, expect, it } from 'vitest'
import type { Question } from '../types/content'
import { isCorrect } from './grading'

const question: Question = {
  id: 'q001',
  topicId: 'topic-a',
  conceptId: 'topic-a.concept-a',
  prompt: '질문',
  choices: ['A', 'B', 'C', 'D'],
  answerIndex: 2,
  explanation: '해설',
}

describe('isCorrect', () => {
  it('선택한 보기와 정답 인덱스를 비교한다', () => {
    expect(isCorrect(question, 2)).toBe(true)
    expect(isCorrect(question, 1)).toBe(false)
  })
})
