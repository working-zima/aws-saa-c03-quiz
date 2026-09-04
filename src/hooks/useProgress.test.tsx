import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { emptyProgress } from '../lib/progress'
import { loadProgress, saveProgress } from '../lib/storage'
import { useProgress } from './useProgress'

vi.mock('../lib/storage', () => ({
  loadProgress: vi.fn(),
  saveProgress: vi.fn(),
}))

describe('useProgress', () => {
  beforeEach(() => {
    vi.mocked(loadProgress).mockReturnValue(emptyProgress())
    vi.mocked(saveProgress).mockClear()
  })

  it('저장된 진행 상태로 초기화한다', () => {
    vi.mocked(loadProgress).mockReturnValue({
      version: 2,
      read: { ec2: true },
      answers: {},
      wrong: {},
    })

    const { result } = renderHook(() => useProgress())

    expect(result.current.progress.read.ec2).toBe(true)
  })

  it('읽기와 답변 상태를 갱신하고 저장한다', () => {
    const { result } = renderHook(() => useProgress())

    act(() => result.current.markRead('ec2'))
    expect(result.current.progress.read.ec2).toBe(true)
    expect(saveProgress).toHaveBeenLastCalledWith(result.current.progress)

    act(() => result.current.answer('q001', false))
    expect(result.current.progress.answers.q001).toBe(false)
    expect(saveProgress).toHaveBeenLastCalledWith(result.current.progress)
  })

  it('오답노트에서 문항을 지우고 저장한다', () => {
    const { result } = renderHook(() => useProgress())

    act(() => result.current.answer('q001', false))
    expect(result.current.progress.wrong.q001).toBe(true)

    act(() => result.current.forget('q001'))
    expect(result.current.progress.wrong).toEqual({})
    expect(saveProgress).toHaveBeenLastCalledWith(result.current.progress)
  })
})
