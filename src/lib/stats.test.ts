// @vitest-environment node

import { describe, expect, it } from 'vitest'
import type { Question, Topic } from '../types/content'
import type { Progress } from '../types/progress'
import { overallPercent, reviewQuestions, topicStats } from './stats'

const topics: Topic[] = [
  {
    id: 'topic-a',
    title: '주제 A',
    importance: 3,
    sourcePages: [1, 1],
    concepts: [
      { id: 'topic-a.first', name: '첫째', summary: '요약', paragraphs: ['본문'] },
      { id: 'topic-a.second', name: '둘째', summary: '요약', paragraphs: ['본문'] },
    ],
  },
  {
    id: 'topic-b',
    title: '주제 B',
    importance: 2,
    sourcePages: [2, 2],
    concepts: [
      { id: 'topic-b.first', name: '셋째', summary: '요약', paragraphs: ['본문'] },
    ],
  },
]

const question = (id: string, topicId: string, conceptId: string): Question => ({
  id,
  topicId,
  conceptId,
  prompt: '질문',
  choices: ['A', 'B', 'C', 'D'],
  answerIndex: 0,
  explanation: '해설',
})

const questions = [
  question('q001', 'topic-a', 'topic-a.first'),
  question('q002', 'topic-a', 'topic-a.first'),
  question('q003', 'topic-a', 'topic-a.second'),
  question('q004', 'topic-b', 'topic-b.first'),
]

describe('stats', () => {
  it('주제별 읽기 및 답안 통계를 계산한다', () => {
    const progress: Progress = {
      version: 3,
      read: { 'topic-a': true },
      answers: { q001: true, q002: false, q004: true },
      review: { q002: true },
    }

    expect(topicStats(topics, questions, progress)).toEqual([
      { topicId: 'topic-a', read: true, total: 3, answered: 2, correct: 1 },
      { topicId: 'topic-b', read: false, total: 1, answered: 1, correct: 1 },
    ])
  })

  it('전체 정답률을 0~100 정수로 반올림한다', () => {
    expect(overallPercent([
      { topicId: 'topic-a', read: false, total: 3, answered: 2, correct: 2 },
    ])).toBe(67)
  })

  it('문항이 없을 때 전체 정답률은 0이다', () => {
    expect(overallPercent([])).toBe(0)
    expect(overallPercent([
      { topicId: 'topic-a', read: true, total: 0, answered: 0, correct: 0 },
    ])).toBe(0)
  })

  it('복습 목록에 담긴 문항만 문제 은행 순서로 반환한다', () => {
    const progress: Progress = {
      version: 3,
      read: {},
      answers: {},
      review: { q003: true, q001: true },
    }

    expect(reviewQuestions(questions, progress)).toEqual([questions[0], questions[2]])
  })

  it('복습 목록이 비어 있으면 틀린 문항이 있어도 빈 배열을 반환한다', () => {
    const progress: Progress = { version: 3, read: {}, answers: { q001: false }, review: {} }

    expect(reviewQuestions(questions, progress)).toEqual([])
  })
})
