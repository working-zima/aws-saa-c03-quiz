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
    choiceKeywordIds: ['k2', 'k1', 'k3', 'k4'],
    answerIndex: 1,
  },
  {
    keywordId: 'k3',
    prompt: '가짜 정의 3',
    choices: ['가짜 용어 3', '가짜 용어 1', '가짜 용어 2', '가짜 용어 4'],
    choiceKeywordIds: ['k3', 'k1', 'k2', 'k4'],
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

  it('오답을 누르면 오답 표시와 정답 표시를 함께 하고, 다른 보기를 눌러도 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 2' }))
    const wrong = screen.getByRole('button', { name: '가짜 용어 2' })
    const right = screen.getByRole('button', { name: '가짜 용어 1' })
    expect(wrong).toHaveClass('border-red-500/60')
    expect(right).toHaveClass('border-green-500/60')

    await user.click(wrong)
    await user.click(screen.getByRole('button', { name: '가짜 용어 3' }))
    expect(wrong).toHaveClass('border-red-500/60')
    expect(right).toHaveClass('border-green-500/60')
    expect(screen.getByRole('button', { name: '가짜 용어 3' })).not.toHaveClass('border-red-500/60')
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('정답을 고르면 정답 키워드의 용어와 정의를 함께 보여 준다', async () => {
    const user = userEvent.setup()
    renderRunner({ mode: 'term-to-summary', questions: [{
      keywordId: 'k2',
      prompt: '가짜 용어 2',
      choices: ['가짜 정의 1', '가짜 정의 2', '가짜 정의 3', '가짜 정의 4'],
      choiceKeywordIds: ['k1', 'k2', 'k3', 'k4'],
      answerIndex: 1,
    }] })
    expect(screen.queryByTestId('keyword-answer')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '가짜 정의 2' }))
    const answer = screen.getByTestId('keyword-answer')
    expect(answer).toHaveTextContent('가짜 용어 2')
    expect(answer).toHaveTextContent('가짜 정의 2')
  })

  // 정답은 초록 테두리로 이미 보이므로, 오답일 때는 고른 보기의 짝만 풀어 준다(사용자 결정).
  it('오답을 고르면 고른 보기의 용어와 정의만 보여 주고, 정답 짝과 오답 글자는 띄우지 않는다', async () => {
    const user = userEvent.setup()
    renderRunner()
    expect(screen.queryByTestId('keyword-picked')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '가짜 용어 3' }))
    const picked = screen.getByTestId('keyword-picked')
    expect(picked).toHaveTextContent('고른 보기')
    expect(picked).toHaveTextContent('가짜 용어 3')
    expect(picked).toHaveTextContent('가짜 정의 3')
    expect(screen.queryByTestId('keyword-answer')).not.toBeInTheDocument()
    expect(screen.queryByText('오답')).not.toBeInTheDocument()
  })

  it('키워드 보고 요약 고르기에서도 고른 오답의 용어를 보여 준다', async () => {
    const user = userEvent.setup()
    renderRunner({ mode: 'term-to-summary', questions: [{
      keywordId: 'k2',
      prompt: '가짜 용어 2',
      choices: ['가짜 정의 1', '가짜 정의 2', '가짜 정의 3', '가짜 정의 4'],
      choiceKeywordIds: ['k1', 'k2', 'k3', 'k4'],
      answerIndex: 1,
    }] })
    await user.click(screen.getByRole('button', { name: '가짜 정의 4' }))
    const picked = screen.getByTestId('keyword-picked')
    expect(picked).toHaveTextContent('가짜 용어 4')
    expect(picked).toHaveTextContent('가짜 정의 4')
  })

  it('특징 보고 고르기 모드의 제목을 보여 준다', () => {
    renderRunner({ mode: 'feature-to-term' })
    expect(screen.getByRole('heading', { level: 1, name: '특징 보고 용어 고르기' })).toBeInTheDocument()
  })

  it('정답을 고르면 고른 보기 설명을 따로 띄우지 않는다', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.queryByTestId('keyword-picked')).not.toBeInTheDocument()
  })

  it('공개한 뒤에는 정답 보기만 활성이고, 정답을 한 번 더 누르면 다음 문항으로 간다', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 2' }))
    expect(screen.getByRole('button', { name: '가짜 용어 1' })).toBeEnabled()
    for (const name of ['가짜 용어 2', '가짜 용어 3', '가짜 용어 4']) {
      expect(screen.getByRole('button', { name })).toBeDisabled()
    }
    expect(screen.getByText('정답을 한 번 더 누르면 다음 문제로 넘어갑니다')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '다음' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '가짜 정의 3' })).toBeInTheDocument()
  })

  it('마지막 문항에서는 정답을 한 번 더 누르면 결과를 본다고 안내한다', async () => {
    const user = userEvent.setup()
    renderRunner({ questions: [questions[0]] })
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.getByText('정답을 한 번 더 누르면 결과를 봅니다')).toBeInTheDocument()
  })

  it('첫 문항에는 이전 문제 버튼이 없고, 되돌아간 문항은 고른 답이 남은 읽기 전용이다', async () => {
    const user = userEvent.setup()
    const { onRestart } = renderRunner()
    expect(screen.queryByRole('button', { name: '이전 문제' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '가짜 용어 2' }))
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '이전 문제' }))
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '가짜 용어 2' })).toHaveClass('border-red-500/60')
    expect(screen.getByRole('button', { name: '가짜 용어 2' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '가짜 용어 1' })).toHaveClass('border-green-500/60')
    expect(screen.getByTestId('keyword-picked')).toHaveTextContent('가짜 용어 2')

    // 되돌아간 문항에서 정답을 누르는 것은 채점이 아니라 이동이다.
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '가짜 용어 3' }))
    await user.click(screen.getByRole('button', { name: '가짜 용어 3' }))
    expect(screen.getByText('맞힌 수 1 / 2')).toBeInTheDocument()
    expect(onRestart).not.toHaveBeenCalled()
  })

  it('풀던 중에 돌아가기를 누르면 onExit를 부른다', async () => {
    const user = userEvent.setup()
    const { onExit } = renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    await user.click(screen.getByRole('button', { name: '돌아가기' }))
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('끝까지 풀면 맞힌 수를 보이고 두 버튼이 각 콜백을 부른다', async () => {
    const user = userEvent.setup()
    const { onRestart, onExit } = renderRunner()
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '가짜 용어 4' }))
    await user.click(screen.getByRole('button', { name: '가짜 용어 3' }))

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
    await user.click(screen.getByRole('button', { name: '가짜 용어 1' }))
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('min-h-[44px]')
    }
  })
})
