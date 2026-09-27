import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Keyword } from '../types/keywords'
import { KeywordFlashcards } from './KeywordFlashcards'

const cards: Keyword[] = [
  { id: 'k1', term: '가짜 용어 1', summary: '가짜 정의 1', section: '단원 A', page: 1 },
  { id: 'k2', term: '가짜 용어 2', summary: '가짜 정의 2', section: '단원 A', page: 2 },
  { id: 'k3', term: '가짜 용어 3', summary: '가짜 정의 3', section: '단원 B', page: 3 },
]

function renderCards() {
  const onRestart = vi.fn()
  const onExit = vi.fn()
  render(<KeywordFlashcards cards={cards} onExit={onExit} onRestart={onRestart} />)
  return { onRestart, onExit }
}

describe('KeywordFlashcards', () => {
  it('처음에는 용어만 보이고 정의와 판정 버튼이 없다', () => {
    renderCards()
    expect(screen.getByText('가짜 용어 1')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    expect(screen.queryByText('가짜 정의 1')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '알았음' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '몰랐음' })).not.toBeInTheDocument()
  })

  it('뒤집으면 정의와 판정 버튼이 나타난다', async () => {
    const user = userEvent.setup()
    renderCards()
    await user.click(screen.getByRole('button', { name: '뒤집기' }))
    expect(screen.getByText('가짜 정의 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '알았음' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '몰랐음' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '뒤집기' })).not.toBeInTheDocument()
  })

  it('판정하면 다음 카드를 앞면으로 보여 준다', async () => {
    const user = userEvent.setup()
    renderCards()
    await user.click(screen.getByRole('button', { name: '뒤집기' }))
    await user.click(screen.getByRole('button', { name: '알았음' }))
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText('가짜 용어 2')).toBeInTheDocument()
    expect(screen.queryByText('가짜 정의 2')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '알았음' })).not.toBeInTheDocument()
  })

  it('끝나면 개수를 보이고 두 버튼이 각 콜백을 부른다', async () => {
    const user = userEvent.setup()
    const { onRestart, onExit } = renderCards()
    for (const verdict of ['알았음', '몰랐음', '몰랐음']) {
      await user.click(screen.getByRole('button', { name: '뒤집기' }))
      await user.click(screen.getByRole('button', { name: verdict }))
    }
    expect(screen.getByText('알았음 1 · 몰랐음 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '한 판 더' }))
    expect(onRestart).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: '처음으로' }))
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('누를 수 있는 버튼은 모두 터치 영역을 확보한다', async () => {
    const user = userEvent.setup()
    renderCards()
    const expectTouchTargets = () => {
      for (const button of screen.getAllByRole('button')) {
        expect(button).toHaveClass('min-h-[44px]')
      }
    }
    expectTouchTargets()
    for (let i = 0; i < cards.length; i += 1) {
      await user.click(screen.getByRole('button', { name: '뒤집기' }))
      expectTouchTargets()
      await user.click(screen.getByRole('button', { name: '알았음' }))
    }
    expectTouchTargets()
  })
})
