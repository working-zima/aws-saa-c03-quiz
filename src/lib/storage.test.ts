// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Progress } from '../types/progress'
import { loadProgress, saveProgress } from './storage'

const empty: Progress = { version: 1, read: {}, answers: {} }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('storage', () => {
  it('저장된 진행 상태를 읽는다', () => {
    const stored: Progress = { version: 1, read: { s3: true }, answers: { q001: false } }
    const getItem = vi.fn(() => JSON.stringify(stored))
    vi.stubGlobal('localStorage', { getItem })

    expect(loadProgress()).toEqual(stored)
    expect(getItem).toHaveBeenCalledWith('aws-quiz.progress')
  })

  it.each([
    ['저장소 접근 예외', () => { throw new Error('blocked') }],
    ['깨진 JSON', () => '{broken'],
    ['version 불일치', () => JSON.stringify({ version: 2, read: {}, answers: {} })],
  ])('%s에서는 빈 상태를 반환한다', (_label, getItem) => {
    vi.stubGlobal('localStorage', { getItem })

    expect(loadProgress()).toEqual(empty)
  })

  it('localStorage 전역 접근 자체가 실패해도 빈 상태를 반환한다', () => {
    vi.stubGlobal('localStorage', undefined)

    expect(loadProgress()).toEqual(empty)
  })

  it('진행 상태를 지정된 키에 저장한다', () => {
    const setItem = vi.fn()
    vi.stubGlobal('localStorage', { setItem })

    saveProgress(empty)

    expect(setItem).toHaveBeenCalledWith('aws-quiz.progress', JSON.stringify(empty))
  })

  it('쓰기 실패를 밖으로 던지지 않는다', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => { throw new Error('blocked') },
    })

    expect(() => saveProgress(empty)).not.toThrow()
  })
})
