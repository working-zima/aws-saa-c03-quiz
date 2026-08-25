import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../types/content'
import { QuizRunner } from './QuizRunner'

const testQuestions: Question[] = [
  {
    id: 'q001',
    topicId: 'first-topic',
    conceptId: 'first-topic.first',
    prompt: '첫 번째 질문',
    choices: ['첫 번째 정답', '오답 보기 1', '오답 보기 2', '오답 보기 3'],
    answerIndex: 0,
    explanation: '첫 번째 해설',
  },
  {
    id: 'q002',
    topicId: 'second-topic',
    conceptId: 'second-topic.second',
    prompt: '두 번째 질문',
    choices: ['오답 보기 A', '두 번째 정답', '오답 보기 B', '오답 보기 C'],
    answerIndex: 1,
    explanation: '두 번째 해설',
  },
]

function renderRunner(renderComplete = vi.fn(() => <section>완료</section>)) {
  const result = render(
    <MemoryRouter>
      <QuizRunner
        answer={vi.fn()}
        questions={testQuestions}
        renderComplete={renderComplete}
        title="사용자 지정 제목"
      />
    </MemoryRouter>,
  )

  return { ...result, renderComplete }
}

describe('QuizRunner', () => {
  it('문항마다 근거 개념 링크가 그 문항의 주제를 가리킨다', async () => {
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByRole('button', { name: '첫 번째 정답' }))
    expect(screen.getByRole('link', { name: '근거 개념으로 돌아가기' })).toHaveAttribute('href', '/topic/first-topic')

    await user.click(screen.getByRole('button', { name: '첫 번째 정답' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))
    expect(screen.getByRole('link', { name: '근거 개념으로 돌아가기' })).toHaveAttribute('href', '/topic/second-topic')
  })

  it('title을 제목으로 렌더한다', () => {
    renderRunner()

    expect(screen.getByRole('heading', { level: 1, name: '사용자 지정 제목' })).toBeInTheDocument()
  })

  it('완료 화면에 맞힌 개수와 총 개수를 전달한다', async () => {
    const user = userEvent.setup()
    const { renderComplete } = renderRunner()

    await user.click(screen.getByRole('button', { name: '첫 번째 정답' }))
    await user.click(screen.getByRole('button', { name: '첫 번째 정답' }))
    await user.click(screen.getByRole('button', { name: '오답 보기 A' }))
    await user.click(screen.getByRole('button', { name: '두 번째 정답' }))

    expect(renderComplete).toHaveBeenLastCalledWith(1, 2)
    expect(screen.getByText('완료')).toBeInTheDocument()
  })
})
