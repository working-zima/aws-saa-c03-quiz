// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../types/content'
import { shuffle, shuffleChoices, shuffleQuestions } from './shuffle'

function seq(...values: number[]) {
  let index = 0
  return () => values[index++]
}

const firstQuestion: Question = {
  id: 'q001',
  topicId: 'topic-a',
  conceptId: 'topic-a.concept-a',
  prompt: '첫 번째 질문',
  choices: ['A', 'B', 'C', 'D'],
  answerIndex: 0,
  explanation: '첫 번째 해설',
}

const lastQuestion: Question = {
  id: 'q002',
  topicId: 'topic-a',
  conceptId: 'topic-a.concept-b',
  prompt: '두 번째 질문',
  choices: ['E', 'F', 'G', 'H'],
  answerIndex: 3,
  explanation: '두 번째 해설',
}

describe('shuffle', () => {
  it('주어진 난수열로 내림차순 Fisher-Yates 순열을 만든다', () => {
    expect(shuffle(['a', 'b', 'c', 'd'], seq(0, 0, 0))).toEqual([
      'b',
      'c',
      'd',
      'a',
    ])
  })

  it('원본 배열을 바꾸지 않고 모든 원소를 보존한다', () => {
    const original = ['a', 'b', 'c', 'd']
    const result = shuffle(original, seq(0.75, 0.25, 0.5))

    expect(original).toEqual(['a', 'b', 'c', 'd'])
    expect(result).toHaveLength(original.length)
    expect([...result].sort()).toEqual([...original].sort())
  })

  it('빈 배열과 원소 하나인 배열에서는 난수를 사용하지 않는다', () => {
    const rng = vi.fn(() => 0)

    expect(shuffle([], rng)).toEqual([])
    expect(shuffle(['a'], rng)).toEqual(['a'])
    expect(rng).toHaveBeenCalledTimes(0)
  })
})

describe('shuffleChoices', () => {
  it.each([
    [firstQuestion, [0, 0, 0]],
    [firstQuestion, [0.75, 0.25, 0.5]],
    [lastQuestion, [0, 0.5, 0]],
    [lastQuestion, [0.5, 0.25, 0.75]],
  ] as const)('정답 보기가 옮겨 간 위치를 정답 인덱스로 삼는다', (question, values) => {
    const result = shuffleChoices(question, seq(...values))

    expect(result.choices[result.answerIndex]).toBe(
      question.choices[question.answerIndex],
    )
  })

  it('보기 집합과 문항 메타데이터를 보존한다', () => {
    const result = shuffleChoices(firstQuestion, seq(0, 0, 0))

    expect([...result.choices].sort()).toEqual([...firstQuestion.choices].sort())
    expect(result.id).toBe(firstQuestion.id)
    expect(result.prompt).toBe(firstQuestion.prompt)
    expect(result.explanation).toBe(firstQuestion.explanation)
  })

  it('원본 문항의 보기와 정답 인덱스를 바꾸지 않는다', () => {
    const originalChoices = [...firstQuestion.choices]
    const originalAnswerIndex = firstQuestion.answerIndex

    shuffleChoices(firstQuestion, seq(0, 0, 0))

    expect(firstQuestion.choices).toEqual(originalChoices)
    expect(firstQuestion.answerIndex).toBe(originalAnswerIndex)
  })
})

describe('shuffleQuestions', () => {
  it('문항을 먼저 섞고 이어서 각 문항의 보기를 섞는다', () => {
    const thirdQuestion: Question = {
      ...firstQuestion,
      id: 'q003',
      choices: ['I', 'J', 'K', 'L'],
      answerIndex: 2,
    }
    const questions = [firstQuestion, lastQuestion, thirdQuestion]
    const originalReferences = [...questions]
    const originals = structuredClone(questions)

    const result = shuffleQuestions(
      questions,
      seq(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    )

    expect(result.map((question) => question.id)).toEqual(['q002', 'q003', 'q001'])
    result.forEach((question) => {
      const original = questions.find((item) => item.id === question.id)
      expect(original).toBeDefined()
      expect(question.choices[question.answerIndex]).toBe(
        original!.choices[original!.answerIndex],
      )
    })
    expect(questions).toEqual(originals)
    questions.forEach((question, index) => {
      expect(question).toBe(originalReferences[index])
    })
    result.forEach((question) => {
      expect(originalReferences).not.toContain(question)
    })
  })
})
