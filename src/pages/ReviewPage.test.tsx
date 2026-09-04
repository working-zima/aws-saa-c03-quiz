import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
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

function renderPage(progress: Progress, forget = vi.fn()) {
  const view = render(
    <MemoryRouter>
      <ReviewPage
        forget={forget}
        progress={progress}
        questions={testQuestions}
        topics={testTopics}
      />
    </MemoryRouter>,
  )
  return { ...view, forget }
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
              progress={{ version: 2, read: {}, answers: { q001: false }, wrong: { q001: true } }}
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
    const { container } = renderPage({ version: 2, read: {}, answers: {}, wrong: {} })

    expect(container.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
  })

  it('오답노트의 문항을 주제별로 묶어 렌더한다', () => {
    renderPage({
      version: 2,
      read: {},
      answers: { q001: false, q003: false },
      wrong: { q001: true, q003: true },
    })

    const storageGroup = screen.getByRole('region', { name: '스토리지' })
    const databaseGroup = screen.getByRole('region', { name: '데이터베이스' })
    expect(within(storageGroup).getByText('질문 1')).toBeInTheDocument()
    expect(within(databaseGroup).getByText('질문 3')).toBeInTheDocument()
    expect(within(storageGroup).queryByText('질문 3')).not.toBeInTheDocument()
  })

  it('문항마다 근거 개념으로 가는 링크를 붙인다', () => {
    renderPage({ version: 2, read: {}, answers: { q001: false }, wrong: { q001: true } })

    expect(screen.getByRole('link', { name: /Amazon S3/ })).toHaveAttribute('href', '/topic/storage')
  })

  // 오답노트가 줄어드는 경로는 사용자가 지우는 것 하나뿐이다 (ADR-017).
  it('다시 풀어서 맞힌 문항도 오답노트에 남아 있으면 계속 보여준다', () => {
    renderPage({ version: 2, read: {}, answers: { q001: true }, wrong: { q001: true } })

    expect(screen.getByText('질문 1')).toBeInTheDocument()
  })

  it('오답노트에 없는 문항은 마지막 시도가 오답이어도 보여주지 않는다', () => {
    renderPage({ version: 2, read: {}, answers: { q002: false }, wrong: {} })

    expect(screen.queryByText('질문 2')).not.toBeInTheDocument()
  })

  it('지우기를 누르면 그 문항만 오답노트에서 뺀다', async () => {
    const { forget } = renderPage({
      version: 2,
      read: {},
      answers: { q001: false, q002: false },
      wrong: { q001: true, q002: true },
    })

    await userEvent.click(screen.getByRole('button', { name: '오답노트에서 지우기: 질문 1' }))

    expect(forget).toHaveBeenCalledTimes(1)
    expect(forget).toHaveBeenCalledWith('q001')
  })

  it('전체 오답과 주제별 오답을 다시 푸는 링크를 준다', () => {
    renderPage({
      version: 2,
      read: {},
      answers: { q001: false, q003: false },
      wrong: { q001: true, q003: true },
    })

    expect(screen.getByRole('link', { name: '전체 다시 풀기' })).toHaveAttribute('href', '/review/quiz')
    const storageGroup = screen.getByRole('region', { name: '스토리지' })
    const topicLink = within(storageGroup).getByRole('link', { name: '오답 다시 풀기' })
    expect(topicLink).toHaveAttribute('href', '/review/quiz/storage')
    expect(topicLink).toHaveClass('min-h-[44px]')
  })

  it('아무것도 안 푼 상태와 오답노트를 비운 상태를 다르게 안내한다', () => {
    const { unmount } = renderPage({ version: 2, read: {}, answers: {}, wrong: {} })
    expect(screen.getByText('확인 문제를 풀면 여기에 틀린 문항이 모입니다.')).toBeInTheDocument()
    const topicListLink = screen.getByRole('link', { name: '주제 목록으로 가기' })
    expect(topicListLink).toHaveAttribute('href', '/')
    expect(topicListLink).toHaveClass('min-h-[44px]')

    unmount()
    renderPage({ version: 2, read: {}, answers: { q001: true }, wrong: {} })
    expect(screen.getByText('오답노트가 비어 있습니다.')).toBeInTheDocument()
  })

  it('돌아가기를 누르면 복습 화면에 들어오기 전 화면으로 간다', async () => {
    renderWithHistory(['/topic/storage', '/review'])

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('개념 읽기 화면')).toBeInTheDocument()
  })
})
