import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Question, Topic } from '../types/content'
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

const testTopics: Topic[] = [
  {
    id: 'test-topic',
    title: '테스트 주제',
    importance: 0,
    sourcePages: [1, 1],
    concepts: [],
  },
  {
    id: 'next-topic',
    title: '다음 주제',
    importance: 0,
    sourcePages: [2, 2],
    concepts: [],
  },
]

function renderPage(
  path = '/topic/test-topic/quiz',
  answer = vi.fn(),
  questions = testQuestions,
  topics?: Topic[],
) {
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/topic/:topicId/quiz" element={<QuizPage answer={answer} questions={questions} topics={topics} />} />
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

  it('정답 공개 후에도 하단 고정 바를 렌더하지 않는다', async () => {
    const user = userEvent.setup()
    const { container } = renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    expect(container.querySelector('.sticky')).toBeNull()
  })

  it('오답을 고르면 고른 보기와 정답 보기를 함께 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '오답 보기 1' }))

    expect(screen.getByRole('button', { name: '오답 보기 1' })).toHaveClass('border-red-500/60')
    expect(screen.getByRole('button', { name: '정답 보기' })).toHaveClass('border-green-500/60')
  })

  it('정답 공개 후 정답 보기만 활성으로 남긴다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    expect(screen.getByRole('button', { name: '정답 보기' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '오답 보기 1' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '오답 보기 2' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '오답 보기 3' })).toBeDisabled()
  })

  it('마지막 문제를 푼 뒤 맞힌 개수를 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '오답 보기 A' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(document.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
    expect(screen.getByRole('heading', { name: '확인 문제 완료' })).toBeInTheDocument()
    expect(screen.getByText('맞힌 개수 1 / 2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '틀린 개념 복습하기' })).toHaveAttribute('href', '/review')
    expect(screen.queryByRole('link', { name: '주제 목록으로 돌아가기' })).toBeNull()
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toBeInTheDocument()
  })

  it('오답이 있고 다음 주제가 있으면 복습과 다음 주제 링크를 함께 렌더한다', async () => {
    const user = userEvent.setup()
    renderPage('/topic/test-topic/quiz', vi.fn(), testQuestions, testTopics)

    await user.click(screen.getByRole('button', { name: '오답 보기 1' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(screen.getByRole('link', { name: '틀린 개념 복습하기' })).toHaveAttribute('href', '/review')
    expect(screen.getByRole('link', { name: '다음 주제 이어가기' })).toHaveAttribute('href', '/topic/next-topic')
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toHaveAttribute('href', '/topic/test-topic')
  })

  it('전부 맞히고 다음 주제가 있으면 다음 주제 링크만 주요 출구로 렌더한다', async () => {
    const user = userEvent.setup()
    renderPage('/topic/test-topic/quiz', vi.fn(), testQuestions, testTopics)

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(screen.getByRole('link', { name: '다음 주제 이어가기' })).toHaveAttribute('href', '/topic/next-topic')
    expect(screen.queryByRole('link', { name: '틀린 개념 복습하기' })).toBeNull()
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toHaveAttribute('href', '/topic/test-topic')
  })

  it('마지막 주제에서는 다음 주제 링크 없이 개념 링크를 렌더한다', async () => {
    const user = userEvent.setup()
    renderPage('/topic/test-topic/quiz', vi.fn(), testQuestions, [testTopics[0]])

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(screen.queryByRole('link', { name: '다음 주제 이어가기' })).toBeNull()
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toHaveAttribute('href', '/topic/test-topic')
  })

  it('정답을 맞힌 뒤 정답 보기를 한 번 더 눌러도 진행 상태를 한 번만 기록한다', async () => {
    const user = userEvent.setup()
    const { answer } = renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    expect(answer).toHaveBeenCalledTimes(1)
  })

  it('오답 뒤 정답 보기 재탭으로 끝까지 진행해도 맞힌 개수가 늘어나지 않는다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '오답 보기 1' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '오답 보기 A' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(screen.getByText('맞힌 개수 0 / 2')).toBeInTheDocument()
  })

  it('마지막 문항에서는 결과 안내 문구를 보여준다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '정답 보기' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(screen.getByText('정답을 한 번 더 누르면 결과를 봅니다')).toBeInTheDocument()
  })

  it('정답 보기에서 조작 안내 문구를 설명으로 참조한다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '정답 보기' }))

    const instruction = screen.getByText('정답을 한 번 더 누르면 다음 문제로 넘어갑니다')
    expect(screen.getByRole('button', { name: '정답 보기' })).toHaveAttribute('aria-describedby', instruction.id)
  })

  it('문항이 없는 주제에서 안내 문구와 개념 링크를 렌더한다', () => {
    renderPage('/topic/empty-topic/quiz', vi.fn(), [])

    expect(screen.getByText('아직 확인 문제가 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '개념으로 돌아가기' })).toHaveAttribute('href', '/topic/empty-topic')
  })
})
