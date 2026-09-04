// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { RANDOM_QUIZ_ALL, RANDOM_QUIZ_COUNTS, parseQuizCount } from './random-quiz'

describe('parseQuizCount', () => {
  it('허용하는 문항 수는 10, 20, 30, 50, 100이다', () => {
    expect(RANDOM_QUIZ_COUNTS).toEqual([10, 20, 30, 50, 100])
  })

  it('허용값 문자열을 문항 수로 변환한다', () => {
    for (const count of RANDOM_QUIZ_COUNTS) {
      expect(parseQuizCount(String(count), 246)).toBe(count)
    }
  })

  // 전체를 숫자로 두면 문제 은행이 늘어날 때 그 숫자가 낡는다 (ADR-018).
  it('전체 세그먼트는 문제 은행 크기를 그대로 돌려준다', () => {
    expect(parseQuizCount(RANDOM_QUIZ_ALL, 246)).toBe(246)
    expect(parseQuizCount(RANDOM_QUIZ_ALL, 7)).toBe(7)
  })

  it('undefined는 null을 반환한다', () => {
    expect(parseQuizCount(undefined, 246)).toBeNull()
  })

  it('허용값 밖의 숫자 문자열은 null을 반환한다', () => {
    for (const value of ['15', '0', '246', '-10', '999']) {
      expect(parseQuizCount(value, 246)).toBeNull()
    }
  })

  it('숫자로 변환하면 허용값이 되는 부정확한 문자열도 거부한다', () => {
    for (const value of ['020', ' 20 ', '20.0', '20abc', 'ALL', ' all']) {
      expect(parseQuizCount(value, 246)).toBeNull()
    }
  })

  it('빈 문자열은 null을 반환한다', () => {
    expect(parseQuizCount('', 246)).toBeNull()
  })
})
