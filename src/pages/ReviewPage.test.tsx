import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
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

// 돌아가기가 실제로 어느 화면에 닿는지 보려면 복습 화면 밖의 라우트가 있어야 한다.
function renderWithHistory(entries: string[]) {
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      <Routes>
        <Route element={<p>개념 읽기 화면</p>} path="/topic/storage" />
        <Route
          element={
            <ReviewPage
              progress={{ version: 1, read: {}, answers: { q001: false } }}
              questions={testQuestions}
              topics={testTopics}
            />
          }
          path="/review"
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewPage', () => {
  it('최상위 section에 한글 단어와 긴 문자열 줄바꿈 클래스를 함께 적용한다', () => {
    const { container } = renderPage({ version: 1, read: {}, answers: {} })

    expect(container.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
  })

  it('오답이 있는 개념을 주제별로 묶어 렌더한다', () => {
    renderPage({ version: 1, read: {}, answers: { q001: false, q003: false } })

    const storageGroup = screen.getByRole('region', { name: '스토리지' })
    const databaseGroup = screen.getByRole('region', { name: '데이터베이스' })
    expect(within(storageGroup).getByText('Amazon S3')).toBeInTheDocument()
    expect(within(databaseGroup).getByText('Amazon RDS')).toBeInTheDocument()
    const retryLink = within(storageGroup).getByRole('link', { name: '확인 문제 다시 풀기' })
    expect(retryLink).toHaveAttribute('href', '/topic/storage/quiz')
    expect(retryLink).toHaveClass('min-h-[44px]')
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
    const topicListLink = screen.getByRole('link', { name: '주제 목록으로 가기' })
    expect(topicListLink).toHaveAttribute('href', '/')
    expect(topicListLink).toHaveClass('min-h-[44px]')

    unmount()
    renderPage({ version: 1, read: {}, answers: { q001: true, q002: true, q003: true } })
    expect(screen.getByText('복습할 개념이 없습니다. 모두 잘 익혔습니다.')).toBeInTheDocument()
  })

  it('개념 링크가 MemoryRouter의 주제 경로를 가리킨다', () => {
    renderPage({ version: 1, read: {}, answers: { q001: false } })

    expect(screen.getByRole('link', { name: /Amazon S3/ })).toHaveAttribute('href', '/topic/storage')
  })
  it('돌아가기를 누르면 복습 화면에 들어오기 전 화면으로 간다', async () => {
    renderWithHistory(['/topic/storage', '/review'])

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('개념 읽기 화면')).toBeInTheDocument()
  })
})
