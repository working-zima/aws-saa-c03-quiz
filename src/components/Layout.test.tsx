import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Layout } from './Layout'

function ConceptRoute() {
  const navigate = useNavigate()

  return <button onClick={() => navigate(-1)}>뒤로 가기</button>
}

function renderTestRoutes() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Link to="/topic/example">개념 보기</Link>} />
          <Route path="topic/example" element={<ConceptRoute />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Layout', () => {
  it('앱 이름과 공통 내비게이션을 렌더링한다', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>화면 내용</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'AWS SAA-C03' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '주요 내비게이션' })).toBeInTheDocument()
    expect(screen.getByText('화면 내용')).toBeInTheDocument()
  })

  it('로고와 내비게이션 링크의 최소 터치 높이를 보장한다', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>화면 내용</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'AWS SAA-C03' })).toHaveClass('min-h-[44px]')
    expect(screen.getByRole('link', { name: '주제 목록' })).toHaveClass('min-h-[44px]')
    expect(screen.getByRole('link', { name: '복습' })).toHaveClass('min-h-[44px]')
  })

  it('헤더와 화면 내용을 동일한 중앙 정렬 셸에 배치한다', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>화면 내용</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const headerShell = screen.getByRole('link', { name: 'AWS SAA-C03' }).parentElement
    const mainShell = screen.getByText('화면 내용').parentElement

    expect(headerShell).toHaveClass('mx-auto', 'max-w-3xl')
    expect(mainShell).toHaveClass('mx-auto', 'max-w-3xl')

    const headerWidthClass = [...(headerShell?.classList ?? [])].find((className) => className.startsWith('max-w-'))
    const mainWidthClass = [...(mainShell?.classList ?? [])].find((className) => className.startsWith('max-w-'))
    expect(headerWidthClass).toBe(mainWidthClass)
  })

  it('초기 렌더에서는 스크롤 위치를 변경하지 않는다', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    renderTestRoutes()

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('링크로 다른 화면에 이동하면 맨 위로 스크롤한다', async () => {
    const user = userEvent.setup()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    renderTestRoutes()

    await user.click(screen.getByRole('link', { name: '개념 보기' }))

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('뒤로 가기에서는 스크롤 위치를 변경하지 않는다', async () => {
    const user = userEvent.setup()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    renderTestRoutes()
    await user.click(screen.getByRole('link', { name: '개념 보기' }))
    const callCountBeforeBack = scrollTo.mock.calls.length

    await user.click(screen.getByRole('button', { name: '뒤로 가기' }))

    expect(scrollTo).toHaveBeenCalledTimes(callCountBeforeBack)
  })
})
