import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWideDiagram, WIDE_DIAGRAM_QUERY } from './useWideDiagram'

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQuery = {
    matches,
    media: WIDE_DIAGRAM_QUERY,
    addEventListener: vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === 'change') listeners.add(listener)
    }),
    removeEventListener: vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === 'change') listeners.delete(listener)
    }),
  }
  const matchMedia = vi.fn(() => mediaQuery)
  vi.stubGlobal('matchMedia', matchMedia)

  return {
    mediaQuery,
    matchMedia,
    change(nextMatches: boolean) {
      mediaQuery.matches = nextMatches
      const event = Object.assign(new Event('change'), {
        matches: nextMatches,
        media: mediaQuery.media,
      })
      listeners.forEach((listener) => listener(event))
    },
  }
}

describe('useWideDiagram', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each([undefined, null])('matchMedia가 함수가 아니면 false다 (%s)', (matchMedia) => {
    vi.stubGlobal('matchMedia', matchMedia)

    const { result } = renderHook(() => useWideDiagram())

    expect(result.current).toBe(false)
  })

  it.each([true, false])('첫 렌더부터 실제 matches 값을 반환한다 (%s)', (matches) => {
    mockMatchMedia(matches)
    const renderedValues: boolean[] = []

    const { result } = renderHook(() => {
      const wide = useWideDiagram()
      renderedValues.push(wide)
      return wide
    })

    expect(renderedValues[0]).toBe(matches)
    expect(result.current).toBe(matches)
  })

  it('768px 이상 질의를 상수로 정의하고 matchMedia에 넘긴다', () => {
    const { matchMedia } = mockMatchMedia(false)

    renderHook(() => useWideDiagram())

    expect(WIDE_DIAGRAM_QUERY).toBe('(min-width: 768px)')
    expect(matchMedia).toHaveBeenCalledWith(WIDE_DIAGRAM_QUERY)
  })

  it('change 이벤트에 따라 양방향으로 값을 갱신한다', () => {
    const { change } = mockMatchMedia(false)
    const { result } = renderHook(() => useWideDiagram())

    act(() => change(true))
    expect(result.current).toBe(true)

    act(() => change(false))
    expect(result.current).toBe(false)
  })

  it('언마운트하면 등록한 change 리스너를 해제한다', () => {
    const { mediaQuery } = mockMatchMedia(false)
    const { unmount } = renderHook(() => useWideDiagram())

    expect(mediaQuery.addEventListener).toHaveBeenCalledTimes(1)
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    const listener = mediaQuery.addEventListener.mock.calls[0][1]

    unmount()

    expect(mediaQuery.removeEventListener).toHaveBeenCalledTimes(1)
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', listener)
  })
})
