import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../types/content'
import { QuizPage } from './QuizPage'

const testQuestions: Question[] = [
  {
    id: 'q001',
    topicId: 'test-topic',
    conceptId: 'test-topic.first',
    prompt: '첫 번째 질문',
    choices: ['정답 보기', '오답 보기 1', '오답 보기 2', '오답 보기 3'],
    answerIndex: 0,
    explanation: '첫 번째 해설',
  },
  {
    id: 'q002',
    topicId: 'test-topic',
    conceptId: 'test-topic.second',
    prompt: '두 번째 질문',
    choices: ['오답 보기 A', '두 번째 정답', '오답 보기 B', '오답 보기 C'],
    answerIndex: 1,
    explanation: '두 번째 해설',
  },
]

function renderPage(path = '/topic/test-topic/quiz', answer = vi.fn(), questions = testQuestions) {
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/topic/:topicId/quiz" element={<QuizPage answer={answer} questions={questions} />} />
      </Routes>
    </MemoryRouter>,
  )

  return { ...result, answer }
}

describe('QuizPage', () => {
  it('문제 화면의 최상위 section에 한글 단어와 긴 문자열 줄바꿈 클래스를 함께 적용한다', () => {
    const { container } = renderPage()

    expect(container.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
  })

  it('문항 없음 화면의 최상위 section에 한글 단어와 긴 문자열 줄바꿈 클래스를 함께 적용한다', () => {
    const { container } = renderPage('/topic/empty-topic/quiz', vi.fn(), [])

    expect(container.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
  })

  it('첫 문제와 보기 4개를 렌더한다', () => {
    const { container } = renderPage()

    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '첫 번째 질문' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(container.querySelector('.sticky')).toBeNull()
  })

  it('정답을 고르면 해설을 보여주고 진행 상태를 기록한다', async () => {
    const user = userEvent.setup()
    const { answer } = renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    expect(screen.getByText('첫 번째 해설')).toBeInTheDocument()
    const conceptLink = screen.getByRole('link', { name: '근거 개념으로 돌아가기' })
    expect(conceptLink).toHaveAttribute('href', '/topic/test-topic')
    expect(conceptLink).toHaveClass('min-h-[44px]')
    expect(answer).toHaveBeenCalledWith('q001', true)
  })

  it('다음 문제와 결과 보기 버튼의 최소 터치 높이를 보장한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    expect(screen.getByRole('button', { name: '다음 문제' })).toHaveClass('min-h-[44px]')

    await user.click(screen.getByRole('button', { name: '다음 문제' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))
    expect(screen.getByRole('button', { name: '결과 보기' })).toHaveClass('min-h-[44px]')
  })

  it('정답 공개 후 다음 문제 액션 바를 section의 마지막 자식으로 렌더한다', async () => {
    const user = userEvent.setup()
    const { container } = renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    const actionBar = screen.getByRole('button', { name: '다음 문제' }).parentElement
    expect(actionBar).toHaveClass('sticky', 'bottom-0', 'bg-page', 'border-t')
    expect(container.querySelector('section')?.lastElementChild).toBe(actionBar)
  })

  it('오답을 고르면 고른 보기와 정답 보기를 함께 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '오답 보기 1' }))

    expect(screen.getByRole('button', { name: '오답 보기 1' })).toHaveClass('border-red-500/60')
    expect(screen.getByRole('button', { name: '정답 보기' })).toHaveClass('border-green-500/60')
  })

  it('정답 공개 후 모든 보기 버튼을 비활성화한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    screen.getAllByRole('button').slice(0, 4).forEach((button) => expect(button).toBeDisabled())
  })

  it('마지막 문제를 푼 뒤 맞힌 개수를 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '다음 문제' }))
    await user.click(screen.getByRole('button', { name: '오답 보기 A' }))
    await user.click(screen.getByRole('button', { name: '결과 보기' }))

    expect(document.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
    expect(screen.getByRole('heading', { name: '확인 문제 완료' })).toBeInTheDocument()
    expect(screen.getByText('맞힌 개수 1 / 2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '틀린 개념 복습하기' })).toHaveAttribute('href', '/review')
    expect(screen.queryByRole('link', { name: '주제 목록으로 돌아가기' })).toBeNull()
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toBeInTheDocument()
  })

  it('문항이 없는 주제에서 안내 문구와 개념 링크를 렌더한다', () => {
    renderPage('/topic/empty-topic/quiz', vi.fn(), [])

    expect(screen.getByText('아직 확인 문제가 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toHaveAttribute('href', '/topic/empty-topic')
  })
})
