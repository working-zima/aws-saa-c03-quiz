import { render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App'

function CurrentPath() {
  return <output aria-label="현재 경로">{useLocation().pathname}</output>
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
      <CurrentPath />
    </MemoryRouter>,
  )
}

describe('App routes', () => {
  it('/에서 주제 목록 화면과 내비게이션 링크를 렌더링한다', () => {
    renderAt('/')

    expect(screen.getByRole('heading', { name: '주제 목록' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '복습' })).toHaveAttribute('href', '/review')
  })

  it('/review에서 복습 화면을 렌더링한다', () => {
    renderAt('/review')

    expect(screen.getByRole('heading', { name: '복습' })).toBeInTheDocument()
  })

  it('/search에서 검색 화면을 렌더링한다', () => {
    renderAt('/search')

    expect(screen.getByRole('heading', { name: '검색' })).toBeInTheDocument()
  })

  it('/random에서 랜덤 문제 시작 화면을 렌더링한다', () => {
    renderAt('/random')

    expect(screen.getByRole('heading', { name: '랜덤 문제' })).toBeInTheDocument()
  })

  it('/random/20에서 랜덤 문제 화면을 렌더링한다', () => {
    renderAt('/random/20')

    expect(screen.getByRole('heading', { name: '랜덤 문제' })).toBeInTheDocument()
    expect(screen.getByText('1 / 20')).toBeInTheDocument()
  })

  it('알 수 없는 경로를 /로 리다이렉트한다', () => {
    renderAt('/unknown')

    expect(screen.getByRole('heading', { name: '주제 목록' })).toBeInTheDocument()
    expect(screen.getByLabelText('현재 경로')).toHaveTextContent('/')
  })
})
