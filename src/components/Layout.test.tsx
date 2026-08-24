import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Layout } from './Layout'

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
})
