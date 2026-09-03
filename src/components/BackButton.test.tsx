import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { BackButton } from './BackButton'

// 검색 화면처럼 자기 주소를 replace로 갈아치우는 화면을 흉내 낸다.
function ReplacingScreen() {
  const navigate = useNavigate()

  return (
    <>
      <button onClick={() => navigate('/search?q=aurora', { replace: true })} type="button">
        주소 갈아치우기
      </button>
      <BackButton />
    </>
  )
}

function renderWithHistory(entries: string[]) {
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      <Routes>
        <Route element={<p>주제 목록 화면</p>} path="/" />
        <Route element={<p>개념 읽기 화면</p>} path="/topic/database" />
        <Route element={<ReplacingScreen />} path="/search" />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BackButton', () => {
  it('직전 화면으로 돌아간다', async () => {
    renderWithHistory(['/topic/database', '/search'])

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('개념 읽기 화면')).toBeInTheDocument()
  })

  it('직접 연 화면이면 앱 밖으로 나가지 않고 주제 목록으로 보낸다', async () => {
    renderWithHistory(['/search'])

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('주제 목록 화면')).toBeInTheDocument()
  })

  it('화면이 주소를 replace해도 진입 시점의 판단을 유지한다', async () => {
    renderWithHistory(['/search'])

    await userEvent.click(screen.getByRole('button', { name: '주소 갈아치우기' }))
    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('주제 목록 화면')).toBeInTheDocument()
  })
})
