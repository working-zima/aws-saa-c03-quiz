import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Question, Topic } from '../types/content'
import type { Progress } from '../types/progress'
import { TopicListPage } from './TopicListPage'

const testTopics: Topic[] = [
  {
    id: 'high-topic',
    title: '중요 주제',
    importance: 3,
    sourcePages: [1, 1],
    concepts: [],
  },
  {
    id: 'basic-topic',
    title: '기초 주제',
    importance: 0,
    sourcePages: [2, 2],
    concepts: [],
  },
]

const testQuestions: Question[] = [
  {
    id: 'q001',
    topicId: 'high-topic',
    conceptId: 'high-topic.concept',
    prompt: '질문 1',
    choices: ['A', 'B', 'C', 'D'],
    answerIndex: 0,
    explanation: '해설 1',
  },
  {
    id: 'q002',
    topicId: 'high-topic',
    conceptId: 'high-topic.concept',
    prompt: '질문 2',
    choices: ['A', 'B', 'C', 'D'],
    answerIndex: 1,
    explanation: '해설 2',
  },
]

const emptyProgress: Progress = { version: 1, read: {}, answers: {} }

function renderPage(
  progress: Progress = emptyProgress,
  pageTopics: Topic[] = testTopics,
  pageQuestions: Question[] = [],
) {
  return render(
    <MemoryRouter>
      <TopicListPage
        progress={progress}
        questions={pageQuestions}
        topics={pageTopics}
      />
    </MemoryRouter>,
  )
}

describe('TopicListPage', () => {
  it('주제 제목들을 렌더한다', () => {
    renderPage()

    expect(screen.getByText('중요 주제')).toBeInTheDocument()
    expect(screen.getByText('기초 주제')).toBeInTheDocument()
  })

  it('중요도 3에는 별 세 개를 표시하고 중요도 0에는 별을 표시하지 않는다', () => {
    renderPage()

    expect(within(screen.getByRole('link', { name: /중요 주제/ })).getByText('★★★')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /기초 주제/ })).queryByText(/[★☆]/)).not.toBeInTheDocument()
  })

  it('문항이 없는 주제에서 NaN을 렌더하지 않는다', () => {
    renderPage()

    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
    expect(screen.queryByText('정답 0/0')).not.toBeInTheDocument()
  })

  it('문제를 푼 주제에 정답 수와 전체 문항 수를 표시한다', () => {
    renderPage(
      { version: 1, read: { 'high-topic': true }, answers: { q001: true, q002: false } },
      testTopics,
      testQuestions,
    )

    expect(screen.getByText('정답 1/2')).toBeInTheDocument()
  })

  it('카드 링크가 MemoryRouter의 주제 경로를 가리킨다', () => {
    renderPage()

    expect(screen.getByRole('link', { name: /중요 주제/ })).toHaveAttribute('href', '/topic/high-topic')
  })
})
