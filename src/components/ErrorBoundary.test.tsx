import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

// 렌더 중에 터지는 자식. 화면 하나가 깨졌을 때를 흉내 낸다.
function Exploding(): JSX.Element {
  throw new Error('렌더 중에 터졌다')
}

describe('ErrorBoundary', () => {
  // React가 경계에 걸린 예외를 console.error로 다시 찍는다. 테스트 출력만 조용히 한다.
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('자식이 정상이면 그대로 보여 준다', () => {
    render(
      <ErrorBoundary>
        <p>주제 목록 화면</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('주제 목록 화면')).toBeInTheDocument()
  })

  // 이것이 이 컴포넌트를 만든 이유다. 경계가 없으면 흰 화면이 되고,
  // 학습자는 무엇이 잘못됐는지도 다음에 무엇을 할지도 알 수 없다.
  it('자식이 렌더 중에 터지면 흰 화면 대신 안내를 보여 준다', () => {
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('화면을 그리지 못했습니다')).toBeInTheDocument()
  })

  it('터진 뒤에도 다시 여는 수단을 준다', () => {
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('button', { name: '다시 열기' })).toBeInTheDocument()
  })

  // 학습 기록은 localStorage에만 있다(ADR: 서버를 두지 않는다). 화면이 깨졌다고
  // 진행률이 사라진 것은 아니므로, 그 사실을 알려 불필요한 불안을 덜어 준다.
  it('학습 기록이 남아 있다는 것을 알려 준다', () => {
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )

    expect(screen.getByText(/학습 기록은 그대로 남아 있습니다/)).toBeInTheDocument()
  })
})
