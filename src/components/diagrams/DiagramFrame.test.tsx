import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const scenarios: DiagramScenario[] = [
  { id: 'first', label: '첫 경로', caption: '첫 경로 설명', nodes: ['a'], paths: ['a-b'] },
  { id: 'second', label: '둘째 경로', caption: '둘째 경로 설명', nodes: ['b'], paths: ['b-c'] },
]

const frameProps = {
  label: '테스트 도식',
  idleCaption: '전체 경로 설명',
  scenarios,
  active: null,
  onSelect: vi.fn(),
  children: <svg aria-label="가짜 도식" role="img" viewBox="0 0 100 100" />,
}

describe('DiagramFrame', () => {
  it('모바일에서는 좌우 여백·테두리·둥근 모서리를 없애고 sm 이상에서 복원한다', () => {
    render(<DiagramFrame {...frameProps} />)

    expect(screen.getByRole('figure', { name: '테스트 도식' })).toHaveClass(
      '-mx-5', 'sm:mx-0', 'rounded-none', 'sm:rounded-lg',
      'border', 'border-x-0', 'sm:border-x',
    )
  })

  it('버튼 간격과 좌우 여백을 좁히면서 터치 높이 44px을 유지한다', () => {
    render(<DiagramFrame {...frameProps} />)

    expect(screen.getByRole('group', { name: '통신 시나리오' })).toHaveClass('flex-wrap', 'gap-2')
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('min-h-[44px]', 'px-2.5')
    }
  })

  it('시나리오 선택을 전달하고 active가 바뀔 때까지 화면 상태를 유지한다', async () => {
    const onSelect = vi.fn()
    render(<DiagramFrame {...frameProps} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: '첫 경로' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(scenarios[0])
    expect(screen.getByText('전체 경로 설명')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('전체 버튼이 첫 번째에 있고 누르면 null을 전달한다', async () => {
    const onSelect = vi.fn()
    render(<DiagramFrame {...frameProps} active={scenarios[0]} onSelect={onSelect} />)

    const group = screen.getByRole('group', { name: '통신 시나리오' })
    const allButton = within(group).getAllByRole('button')[0]
    expect(allButton).toHaveAccessibleName('전체')
    await userEvent.click(allButton)

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('active에 맞는 캡션과 선택 상태를 표시하고 null이면 전체로 돌아간다', () => {
    const { rerender } = render(<DiagramFrame {...frameProps} />)
    const expectSelection = (name: string, caption: string) => {
      expect(screen.getAllByRole('button', { pressed: true })).toEqual([
        screen.getByRole('button', { name }),
      ])
      expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(2)
      expect(screen.getByText(caption)).toHaveAttribute('aria-live', 'polite')
    }

    expectSelection('전체', '전체 경로 설명')
    rerender(<DiagramFrame {...frameProps} active={{ ...scenarios[0] }} />)
    expectSelection('첫 경로', '첫 경로 설명')
    expect(screen.queryByText('전체 경로 설명')).not.toBeInTheDocument()
    rerender(<DiagramFrame {...frameProps} active={scenarios[1]} />)
    expectSelection('둘째 경로', '둘째 경로 설명')
    expect(screen.queryByText('첫 경로 설명')).not.toBeInTheDocument()
    rerender(<DiagramFrame {...frameProps} />)
    expectSelection('전체', '전체 경로 설명')
  })

  it('scenarios가 없으면 전체 버튼과 버튼 줄도 렌더하지 않는다', () => {
    render(
      <DiagramFrame active={null} idleCaption="정적 도식 설명" label="정적 도식" onSelect={vi.fn()}>
        {frameProps.children}
      </DiagramFrame>,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
    expect(screen.getByText('정적 도식 설명')).toBeInTheDocument()
  })

  it('figure의 접근성 이름을 제공하고 자식 도식과 범례를 헤딩 없이 표시한다', () => {
    const { rerender } = render(<DiagramFrame {...frameProps} legend="도식 범례" />)
    const figure = screen.getByRole('figure', { name: '테스트 도식' })

    expect(within(figure).getByRole('img', { name: '가짜 도식' })).toBeInTheDocument()
    expect(within(figure).getByText('도식 범례')).toBeInTheDocument()
    expect(within(figure).queryByRole('heading')).not.toBeInTheDocument()

    rerender(<DiagramFrame {...frameProps} />)
    expect(screen.queryByText('도식 범례')).not.toBeInTheDocument()
  })
})
