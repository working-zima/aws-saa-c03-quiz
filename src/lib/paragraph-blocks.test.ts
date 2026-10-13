// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { groupParagraphs, isListItem, stripListMarker } from './paragraph-blocks'

describe('paragraph-blocks (ADR-046)', () => {
  it('isListItem은 문단 맨 앞의 하이픈과 공백만 목록 표지로 판정한다', () => {
    expect(isListItem('- 항목')).toBe(true)
    for (const paragraph of ['항목', '-항목', 'A - B', '']) {
      expect(isListItem(paragraph)).toBe(false)
    }
  })

  it('stripListMarker는 목록 표지만 떼고 표지 없는 문단은 그대로 둔다', () => {
    expect(stripListMarker('- **파일 게이트웨이**는')).toBe('**파일 게이트웨이**는')
    for (const paragraph of ['항목', '-항목', 'A - B', '']) {
      expect(stripListMarker(paragraph)).toBe(paragraph)
    }
  })

  it('groupParagraphs는 일반 문단의 글과 원래 번호를 순서대로 보존한다', () => {
    expect(groupParagraphs(['첫 문단', '둘째 문단'])).toEqual([
      { kind: 'paragraph', index: 0, text: '첫 문단' },
      { kind: 'paragraph', index: 1, text: '둘째 문단' },
    ])
  })

  it('groupParagraphs는 잇닿은 항목을 표지 없이 묶고 원래 번호를 보존한다', () => {
    expect(groupParagraphs(['머리', '- 가', '- 나', '꼬리'])).toEqual([
      { kind: 'paragraph', index: 0, text: '머리' },
      { kind: 'list', items: [{ index: 1, text: '가' }, { index: 2, text: '나' }] },
      { kind: 'paragraph', index: 3, text: '꼬리' },
    ])
  })

  it('groupParagraphs는 문단이 사이에 끼면 목록을 둘로 나눈다', () => {
    expect(groupParagraphs(['- 가', '- 나', '중간', '- 다', '- 라'])).toEqual([
      { kind: 'list', items: [{ index: 0, text: '가' }, { index: 1, text: '나' }] },
      { kind: 'paragraph', index: 2, text: '중간' },
      { kind: 'list', items: [{ index: 3, text: '다' }, { index: 4, text: '라' }] },
    ])
  })

  it('groupParagraphs는 항목만 있는 배열을 목록 하나로 묶는다', () => {
    expect(groupParagraphs(['- 가', '- 나'])).toEqual([
      { kind: 'list', items: [{ index: 0, text: '가' }, { index: 1, text: '나' }] },
    ])
  })

  it('groupParagraphs는 빈 배열에 빈 배열을 반환한다', () => {
    expect(groupParagraphs([])).toEqual([])
  })

  it('groupParagraphs의 블록을 펼치면 표지만 뗀 원래 글의 순서와 같다', () => {
    const paragraphs = ['머리', '- **가**', '- 나', '중간', '- 다', '- 라', '꼬리']
    const original = [...paragraphs]
    Object.freeze(paragraphs)

    const texts = groupParagraphs(paragraphs).flatMap((block) => (
      block.kind === 'paragraph' ? [block.text] : block.items.map(({ text }) => text)
    ))

    expect(texts).toEqual(paragraphs.map(stripListMarker))
    expect(paragraphs).toEqual(original)
  })
})
