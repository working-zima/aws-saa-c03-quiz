// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth, type SvgBox } from './svg-bounds'

describe('boxesOutsideViewBox', () => {
  const viewBox: [number, number, number, number] = [10, 20, 100, 80]

  it('안쪽 상자와 빈 배열에는 빈 배열을 반환한다', () => {
    expect(boxesOutsideViewBox([{ id: 'inside', x: 20, y: 30, width: 50, height: 40 }], viewBox)).toEqual([])
    expect(boxesOutsideViewBox([], viewBox)).toEqual([])
  })

  it.each([
    { id: 'left', x: 9, y: 30, width: 10, height: 10 },
    { id: 'top', x: 20, y: 19, width: 10, height: 10 },
    { id: 'right', x: 100, y: 30, width: 11, height: 10 },
    { id: 'bottom', x: 20, y: 90, width: 10, height: 11 },
  ])('$id 변이 넘친 상자를 반환한다', (box) => {
    expect(boxesOutsideViewBox([box], viewBox)).toEqual([box])
  })

  it('네 경계에 정확히 닿으면 넘침이 아니다', () => {
    const box: SvgBox = { id: 'edge', x: 10, y: 20, width: 100, height: 80 }
    expect(boxesOutsideViewBox([box], viewBox)).toEqual([])
  })

  it('음수 원점에서도 넘친 상자만 원래 순서로 반환하고 입력을 바꾸지 않는다', () => {
    const boxes: SvgBox[] = [
      { id: 'outside-left', x: -21, y: -10, width: 5, height: 5 },
      { id: 'inside', x: -20, y: -10, width: 40, height: 20 },
      { id: 'outside-bottom', x: 0, y: 6, width: 5, height: 5 },
    ]
    const original = boxes.map((box) => ({ ...box }))

    expect(boxesOutsideViewBox(boxes, [-20, -10, 40, 20])).toEqual([boxes[0], boxes[2]])
    expect(boxes).toEqual(original)
  })
})

describe('estimateTextWidth', () => {
  it('한글은 글자마다 fontSize만큼 센다', () => {
    expect(estimateTextWidth('가나다', 16)).toBe(3 * 16)
    expect(estimateTextWidth('ㄱㅏᄀ', 16)).toBe(3 * 16)
  })

  it('영문·숫자·기호·공백은 글자마다 fontSize의 0.55배로 센다', () => {
    expect(estimateTextWidth('AWS', 16)).toBeCloseTo(3 * 16 * 0.55)
    expect(estimateTextWidth('AWS', 16)).toBeLessThan(3 * 16)
    expect(estimateTextWidth('A1- ', 16)).toBeCloseTo(4 * 16 * 0.55)
  })

  it('전각 문자와 넓은 동아시아 문자는 fontSize만큼 센다', () => {
    expect(estimateTextWidth('Ａ１！　漢あア', 16)).toBe(7 * 16)
  })

  it('섞인 문자열은 문자별 폭을 합한다', () => {
    expect(estimateTextWidth('가 A1', 20)).toBeCloseTo(20 + 3 * 20 * 0.55)
  })

  it('빈 문자열은 0이다', () => {
    expect(estimateTextWidth('', 16)).toBe(0)
  })
})
