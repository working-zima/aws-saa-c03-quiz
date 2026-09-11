// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Progress } from '../types/progress'
import { loadProgress, saveProgress } from './storage'

const empty: Progress = { version: 3, read: {}, answers: {}, review: {} }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('storage', () => {
  it('저장된 진행 상태를 읽는다', () => {
    const stored: Progress = {
      version: 3,
      read: { s3: true },
      answers: { q001: false },
      review: { q001: true },
    }
    const getItem = vi.fn(() => JSON.stringify(stored))
    vi.stubGlobal('localStorage', { getItem })

    expect(loadProgress()).toEqual(stored)
    expect(getItem).toHaveBeenCalledWith('aws-quiz.progress')
  })

  // version 2의 오답노트는 틀리면 저절로 채워졌다. 복습 목록은 이제 사용자가 고르지만,
  // 이미 쌓인 목록은 사용자가 지우지 않고 남겨 둔 것이라 그대로 옮긴다.
  it('version 2 저장분을 옮기면서 오답노트를 복습 목록으로 잇는다', () => {
    const getItem = vi.fn(() => JSON.stringify({
      version: 2,
      read: { s3: true },
      answers: { q001: false, q002: true },
      wrong: { q001: true, q002: true },
    }))
    vi.stubGlobal('localStorage', { getItem })

    expect(loadProgress()).toEqual({
      version: 3,
      read: { s3: true },
      answers: { q001: false, q002: true },
      review: { q001: true, q002: true },
    })
  })

  // version 1에는 오답노트가 없었다. 기록이 끊기지 않도록 그때 틀린 문항을 씨앗으로 삼는다.
  it('version 1 저장분을 옮기면서 틀린 문항을 복습 목록에 채운다', () => {
    const getItem = vi.fn(() => JSON.stringify({
      version: 1,
      read: { s3: true },
      answers: { q001: false, q002: true, q003: false },
    }))
    vi.stubGlobal('localStorage', { getItem })

    expect(loadProgress()).toEqual({
      version: 3,
      read: { s3: true },
      answers: { q001: false, q002: true, q003: false },
      review: { q001: true, q003: true },
    })
  })

  it.each([
    ['저장소 접근 예외', () => { throw new Error('blocked') }],
    ['깨진 JSON', () => '{broken'],
    ['모르는 version', () => JSON.stringify({ version: 4, read: {}, answers: {}, review: {} })],
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
