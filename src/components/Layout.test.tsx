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
})
