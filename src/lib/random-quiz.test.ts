// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { RANDOM_QUIZ_COUNTS, parseQuizCount } from './random-quiz'

describe('parseQuizCount', () => {
  it('허용하는 문항 수는 10, 20, 30이다', () => {
    expect(RANDOM_QUIZ_COUNTS).toEqual([10, 20, 30])
  })

  it('허용값 문자열을 문항 수로 변환한다', () => {
    expect(parseQuizCount('10')).toBe(10)
    expect(parseQuizCount('20')).toBe(20)
    expect(parseQuizCount('30')).toBe(30)
  })

  it('undefined는 null을 반환한다', () => {
    expect(parseQuizCount(undefined)).toBeNull()
  })

  it('허용값 밖의 숫자 문자열은 null을 반환한다', () => {
    for (const value of ['15', '0', '246', '-10']) {
      expect(parseQuizCount(value)).toBeNull()
    }
  })

  it('숫자로 변환하면 허용값이 되는 부정확한 문자열도 거부한다', () => {
    for (const value of ['020', ' 20 ', '20.0', '20abc']) {
      expect(parseQuizCount(value)).toBeNull()
    }
  })

  it('빈 문자열은 null을 반환한다', () => {
    expect(parseQuizCount('')).toBeNull()
  })
})
