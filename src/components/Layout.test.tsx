import { render, screen, within } from '@testing-library/react'
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
    expect(screen.getByRole('link', { name: '복습' })).toHaveClass('min-h-[44px]')
  })

  // 확인 문제 화면의 근거 개념은 헤더가 아니라 문항 화면 안의 펼치기가 맡는다
  // (UI_GUIDE "보기 버튼 > 근거 개념 펼치기"). 헤더에 다시 넣으면 링크가 세 개가 된다.
  it.each(['/', '/topic/vpc', '/topic/vpc/quiz', '/review'])('%s에서 근거 개념 링크를 렌더링하지 않는다', (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>주제 목록</p>} />
            <Route path="topic/:topicId" element={<p>개념 읽기</p>} />
            <Route path="topic/:topicId/quiz" element={<p>확인 문제</p>} />
            <Route path="review" element={<p>복습 화면</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: '근거 개념' })).toBeNull()
  })

  it.each(['/', '/topic/vpc', '/topic/vpc/quiz', '/review'])('%s에서 주제 목록 링크를 렌더링하지 않는다', (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>주제 목록</p>} />
            <Route path="topic/:topicId" element={<p>개념 읽기</p>} />
            <Route path="topic/:topicId/quiz" element={<p>확인 문제</p>} />
            <Route path="review" element={<p>복습 화면</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: '주제 목록' })).toBeNull()
  })

  it('헤더를 불투명한 sticky 영역으로 고정한다', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>화면 내용</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const header = screen.getByRole('banner')

    expect(header).toHaveClass('sticky', 'top-0', 'bg-page', 'border-b')
    expect(header).not.toHaveClass('fixed')
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

  it.each(['/', '/topic/vpc', '/topic/vpc/quiz', '/review'])('%s에서 검색 링크를 렌더링한다', (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>주제 목록</p>} />
            <Route path="topic/:topicId" element={<p>개념 읽기</p>} />
            <Route path="topic/:topicId/quiz" element={<p>확인 문제</p>} />
            <Route path="review" element={<p>복습 화면</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: '검색' })).toHaveAttribute('href', '/search')
    expect(screen.getByRole('link', { name: '검색' })).toHaveClass('min-h-[44px]')
  })

  // 320px에서 헤더 링크가 세 개가 되면 로고와 부딪힌다(UI_GUIDE "헤더 안의 링크").
  // jsdom에서는 폭을 잴 수 없으므로 링크 개수로 그 제약을 지킨다.
  it.each(['/', '/topic/vpc', '/topic/vpc/quiz', '/review'])('%s에서 내비게이션 링크가 두 개를 넘지 않는다', (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>주제 목록</p>} />
            <Route path="topic/:topicId" element={<p>개념 읽기</p>} />
            <Route path="topic/:topicId/quiz" element={<p>확인 문제</p>} />
            <Route path="review" element={<p>복습 화면</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: '주요 내비게이션' })

    expect(within(nav).getAllByRole('link').length).toBeLessThanOrEqual(2)
  })
})
