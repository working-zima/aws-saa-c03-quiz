import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Question, Topic } from '../types/content'
import type { Progress } from '../types/progress'
import { ReviewPage } from './ReviewPage'

const testTopics: Topic[] = [
  {
    id: 'storage',
    title: '스토리지',
    importance: 3,
    sourcePages: [1, 2],
    concepts: [
      { id: 'storage.s3', name: 'Amazon S3', summary: '객체 스토리지', paragraphs: [] },
      { id: 'storage.ebs', name: 'Amazon EBS', summary: '블록 스토리지', paragraphs: [] },
    ],
  },
  {
    id: 'database',
    title: '데이터베이스',
    importance: 2,
    sourcePages: [3, 4],
    concepts: [
      { id: 'database.rds', name: 'Amazon RDS', summary: '관계형 데이터베이스', paragraphs: [] },
    ],
  },
]

const testQuestions: Question[] = [
  { id: 'q001', topicId: 'storage', conceptId: 'storage.s3', prompt: '질문 1', choices: ['A', 'B', 'C', 'D'], answerIndex: 0, explanation: '해설 1' },
  { id: 'q002', topicId: 'storage', conceptId: 'storage.ebs', prompt: '질문 2', choices: ['A', 'B', 'C', 'D'], answerIndex: 1, explanation: '해설 2' },
  { id: 'q003', topicId: 'database', conceptId: 'database.rds', prompt: '질문 3', choices: ['A', 'B', 'C', 'D'], answerIndex: 2, explanation: '해설 3' },
]

function renderPage(progress: Progress) {
  return render(
    <MemoryRouter>
      <ReviewPage progress={progress} questions={testQuestions} topics={testTopics} />
    </MemoryRouter>,
  )
}

describe('ReviewPage', () => {
  it('오답이 있는 개념을 주제별로 묶어 렌더한다', () => {
    renderPage({ version: 1, read: {}, answers: { q001: false, q003: false } })

    const storageGroup = screen.getByRole('region', { name: '스토리지' })
    const databaseGroup = screen.getByRole('region', { name: '데이터베이스' })
    expect(within(storageGroup).getByText('Amazon S3')).toBeInTheDocument()
    expect(within(databaseGroup).getByText('Amazon RDS')).toBeInTheDocument()
    expect(within(storageGroup).getByRole('link', { name: '확인 문제 다시 풀기' })).toHaveAttribute('href', '/topic/storage/quiz')
  })

  it('맞힌 문제의 개념은 목록에 표시하지 않는다', () => {
    renderPage({ version: 1, read: {}, answers: { q001: false, q002: true } })

    expect(screen.getByText('Amazon S3')).toBeInTheDocument()
    expect(screen.queryByText('Amazon EBS')).not.toBeInTheDocument()
  })

  it('아직 안 푼 문제의 개념은 목록에 표시하지 않는다', () => {
    renderPage({ version: 1, read: {}, answers: { q001: false } })

    expect(screen.queryByText('Amazon RDS')).not.toBeInTheDocument()
  })

  it('아무것도 안 푼 상태와 전부 맞힌 상태를 다르게 안내한다', () => {
    const { unmount } = renderPage({ version: 1, read: {}, answers: {} })
    expect(screen.getByText('확인 문제를 풀면 여기에 복습할 개념이 모입니다.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '주제 목록으로 가기' })).toHaveAttribute('href', '/')

    unmount()
    renderPage({ version: 1, read: {}, answers: { q001: true, q002: true, q003: true } })
    expect(screen.getByText('복습할 개념이 없습니다. 모두 잘 익혔습니다.')).toBeInTheDocument()
  })

  it('개념 링크가 MemoryRouter의 주제 경로를 가리킨다', () => {
    renderPage({ version: 1, read: {}, answers: { q001: false } })

    expect(screen.getByRole('link', { name: /Amazon S3/ })).toHaveAttribute('href', '/topic/storage')
  })
})
