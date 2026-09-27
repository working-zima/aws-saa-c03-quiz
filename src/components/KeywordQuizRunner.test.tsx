import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Keyword, KeywordQuestion } from '../types/keywords'
import { KeywordQuizRunner } from './KeywordQuizRunner'

const keywords: Keyword[] = [
  { id: 'k1', term: '가짜 용어 1', summary: '가짜 정의 1', section: '단원 A', page: 1 },
  { id: 'k2', term: '가짜 용어 2', summary: '가짜 정의 2', section: '단원 A', page: 2 },
  { id: 'k3', term: '가짜 용어 3', summary: '가짜 정의 3', section: '단원 B', page: 3 },
  { id: 'k4', term: '가짜 용어 4', summary: '가짜 정의 4', section: '단원 B', page: 4 },
]

const questions: KeywordQuestion[] = [
  {
    keywordId: 'k1',
    prompt: '가짜 정의 1',
    choices: ['가짜 용어 2', '가짜 용어 1', '가짜 용어 3', '가짜 용어 4'],
    answerIndex: 1,
  },
  {
    keywordId: 'k3',
    prompt: '가짜 정의 3',
    choices: ['가짜 용어 3', '가짜 용어 1', '가짜 용어 2', '가짜 용어 4'],
    answerIndex: 0,
  },
]

function renderRunner(overrides: Partial<Parameters<typeof KeywordQuizRunner>[0]> = {}) {
  const onRestart = vi.fn()
  const onExit = vi.fn()
  render(
    <KeywordQuizRunner
      keywords={keywords}
      mode="summary-to-term"
      onExit={onExit}
      onRestart={onRestart}
      questions={questions}
      {...overrides}
    />,
  )
  return { onRestart, onExit }
}

describe('KeywordQuizRunner', () => {
  it('첫 문항의 물음과 보기 넷, 진행을 보여 준다', () => {
    renderRunner()
    expect(screen.getByRole('heading', { name: '가짜 정의 1' })).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    for (const choice of questions[0].choices) {
      expect(screen.getByRole('button', { name: choice })).toBeInTheDocument()
    }
  })

  it('정답을 누르면 정답 표시를 하고 짝을 보여 준다', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.getByRole('button', { name: '가짜 용어 1' })).toHaveClass('border-green-500/60')
    expect(screen.getByRole('button', { name: '가짜 용어 2' })).not.toHaveClass('border-red-500/60')
    expect(screen.getByText('정답')).toBeInTheDocument()
  })

  it('오답을 누르면 오답 표시와 정답 표시를 함께 하고, 다시 눌러도 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 2' }))
    const wrong = screen.getByRole('button', { name: '가짜 용어 2' })
    const right = screen.getByRole('button', { name: '가짜 용어 1' })
    expect(wrong).toHaveClass('border-red-500/60')
    expect(right).toHaveClass('border-green-500/60')
    expect(screen.getByText('오답')).toBeInTheDocument()

    await user.click(right)
    await user.click(screen.getByRole('button', { name: '가짜 용어 3' }))
    expect(wrong).toHaveClass('border-red-500/60')
    expect(right).toHaveClass('border-green-500/60')
    expect(screen.getByRole('button', { name: '가짜 용어 3' })).not.toHaveClass('border-red-500/60')
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('공개한 뒤 정답 키워드의 용어와 정의를 함께 보여 준다', async () => {
    const user = userEvent.setup()
    renderRunner({ mode: 'term-to-summary', questions: [{
      keywordId: 'k2',
      prompt: '가짜 용어 2',
      choices: ['가짜 정의 1', '가짜 정의 2', '가짜 정의 3', '가짜 정의 4'],
      answerIndex: 1,
    }] })
    expect(screen.queryByTestId('keyword-answer')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '가짜 정의 3' }))
    const answer = screen.getByTestId('keyword-answer')
    expect(answer).toHaveTextContent('가짜 용어 2')
    expect(answer).toHaveTextContent('가짜 정의 2')
  })

  it('공개하기 전에는 다음 버튼이 없다', () => {
    renderRunner()
    expect(screen.queryByRole('button', { name: '다음' })).not.toBeInTheDocument()
  })

  it('끝까지 풀면 맞힌 수를 보이고 두 버튼이 각 콜백을 부른다', async () => {
    const user = userEvent.setup()
    const { onRestart, onExit } = renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    await user.click(screen.getByRole('button', { name: '다음' }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '가짜 용어 4' }))
    await user.click(screen.getByRole('button', { name: '결과 보기' }))

    expect(screen.getByText('맞힌 수 1 / 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '한 판 더' }))
    expect(onRestart).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: '처음으로' }))
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('누를 수 있는 버튼은 모두 터치 영역을 확보한다', async () => {
    const user = userEvent.setup()
    renderRunner({ questions: [questions[0]] })
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('min-h-[44px]')
    }
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('min-h-[44px]')
    }
    await user.click(screen.getByRole('button', { name: '결과 보기' }))
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('min-h-[44px]')
    }
  })
})
