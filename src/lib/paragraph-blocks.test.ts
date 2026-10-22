// @vitest-environment node

import { describe, expect, it } from 'vitest'
// @types/node가 없어 node:fs 대신 Vite의 ?raw로 실제 입력(phase 65 명세의 개념)을 읽는다.
import changesText from '../../phases/65-roles-anywhere-steps/changes.json?raw'
import { groupParagraphs, isListItem, stripListMarker, type ParagraphBlock, type SubBlock } from './paragraph-blocks'

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

describe('paragraph-blocks — 단계 목록 (ADR-050)', () => {
  // 블록을 문서 순서대로 펼쳐 [원래 번호, 글]로 돌려준다. 항목 글이 먼저, 그 아래 자식이 뒤에 온다.
  function flatten(blocks: (ParagraphBlock | SubBlock)[]): [number, string][] {
    return blocks.flatMap((block): [number, string][] => {
      if (block.kind === 'paragraph') return [[block.index, block.text]]
      if (block.kind === 'list') return block.items.map(({ index, text }): [number, string] => [index, text])
      return block.items.flatMap(({ index, text, children }): [number, string][] => [[index, text], ...flatten(children)])
    })
  }

  it('잇닿은 번호 항목을 단계 목록 하나로 묶고 첫 번호를 시작 번호로 둔다', () => {
    expect(groupParagraphs(['1. 가', '2. 나'])).toEqual([
      {
        kind: 'steps',
        start: 1,
        items: [
          { index: 0, number: 1, text: '가', children: [] },
          { index: 1, number: 2, text: '나', children: [] },
        ],
      },
    ])
  })

  it('두 칸은 번호 항목에, 네 칸은 그 위 하위 글머리 항목에 딸리고 원래 번호를 보존한다', () => {
    expect(groupParagraphs(['9. 가', '  - 나', '    - 다', '    라', '  마'])).toEqual([
      {
        kind: 'steps',
        start: 9,
        items: [
          {
            index: 0,
            number: 9,
            text: '가',
            children: [
              {
                kind: 'bullets',
                items: [
                  {
                    index: 1,
                    text: '나',
                    children: [
                      { kind: 'bullets', items: [{ index: 2, text: '다', children: [] }] },
                      { kind: 'paragraph', index: 3, text: '라' },
                    ],
                  },
                ],
              },
              { kind: 'paragraph', index: 4, text: '마' },
            ],
          },
        ],
      },
    ])
  })

  it('항목 안에서 글머리와 이어지는 문단이 번갈아 오면 잇닿은 글머리끼리만 묶는다', () => {
    expect(groupParagraphs(['1. 가', '  - 나', '  - 다', '  라', '  - 마'])).toEqual([
      {
        kind: 'steps',
        start: 1,
        items: [
          {
            index: 0,
            number: 1,
            text: '가',
            children: [
              { kind: 'bullets', items: [{ index: 1, text: '나', children: [] }, { index: 2, text: '다', children: [] }] },
              { kind: 'paragraph', index: 3, text: '라' },
              { kind: 'bullets', items: [{ index: 4, text: '마', children: [] }] },
            ],
          },
        ],
      },
    ])
  })

  it('맨 바깥 일반 문단이 끼면 단계 목록이 끝나고, 다음 번호 항목이 새 목록을 그 번호로 시작한다', () => {
    expect(groupParagraphs(['**머리**', '1. 가', '  - 나', '**머리2**', '설명', '9. 다'])).toEqual([
      { kind: 'paragraph', index: 0, text: '**머리**' },
      {
        kind: 'steps',
        start: 1,
        items: [
          {
            index: 1,
            number: 1,
            text: '가',
            children: [{ kind: 'bullets', items: [{ index: 2, text: '나', children: [] }] }],
          },
        ],
      },
      { kind: 'paragraph', index: 3, text: '**머리2**' },
      { kind: 'paragraph', index: 4, text: '설명' },
      { kind: 'steps', start: 9, items: [{ index: 5, number: 9, text: '다', children: [] }] },
    ])
  })

  it('맨 바깥 글머리 목록과 단계 목록은 한 배열에 있어도 섞이지 않는다', () => {
    expect(groupParagraphs(['- 가', '- 나', '1. 다', '2. 라', '- 마'])).toEqual([
      { kind: 'list', items: [{ index: 0, text: '가' }, { index: 1, text: '나' }] },
      {
        kind: 'steps',
        start: 1,
        items: [
          { index: 2, number: 1, text: '다', children: [] },
          { index: 3, number: 2, text: '라', children: [] },
        ],
      },
      { kind: 'list', items: [{ index: 4, text: '마' }] },
    ])
  })

  it('stripListMarker는 들여쓰기와 번호·글머리 표지를 떼고, 표지 없는 들여쓴 문단은 들여쓰기만 뗀다', () => {
    expect(stripListMarker('12. 가')).toBe('가')
    expect(stripListMarker('  - 나')).toBe('나')
    expect(stripListMarker('    - 나')).toBe('나')
    expect(stripListMarker('    다')).toBe('다')
    expect(stripListMarker('  가')).toBe('가')
    // 번호는 맨 바깥에서만 표지다.
    expect(stripListMarker('  1. 가')).toBe('1. 가')
    for (const paragraph of ['항목', '-항목', 'A - B', '', '1.가', '2026년']) {
      expect(stripListMarker(paragraph)).toBe(paragraph)
    }
  })

  it('isListItem은 맨 바깥 글머리 표지만 참이다', () => {
    for (const paragraph of ['1. 가', '  - 나', '    - 다', '  라']) {
      expect(isListItem(paragraph)).toBe(false)
    }
  })

  it('규칙에 맞지 않는 들여쓴 문단은 던지지 않고 맨 바깥 일반 문단이 된다', () => {
    // 부모 없는 두 칸 문단(맨 앞)
    expect(groupParagraphs(['  가', '1. 나'])).toEqual([
      { kind: 'paragraph', index: 0, text: '가' },
      { kind: 'steps', start: 1, items: [{ index: 1, number: 1, text: '나', children: [] }] },
    ])
    // 여섯 칸 들여쓰기는 규칙 밖이라 글을 그대로 둔 일반 문단이 되고, 단계 목록을 끊는다.
    expect(groupParagraphs(['1. 가', '      나', '2. 다'])).toEqual([
      { kind: 'steps', start: 1, items: [{ index: 0, number: 1, text: '가', children: [] }] },
      { kind: 'paragraph', index: 1, text: '      나' },
      { kind: 'steps', start: 2, items: [{ index: 2, number: 2, text: '다', children: [] }] },
    ])
    // 네 칸 문단 바로 위의 얕은 문단이 글머리 항목이 아니면 부모가 없다.
    expect(groupParagraphs(['1. 가', '  나', '    다'])).toEqual([
      {
        kind: 'steps',
        start: 1,
        items: [{ index: 0, number: 1, text: '가', children: [{ kind: 'paragraph', index: 1, text: '나' }] }],
      },
      { kind: 'paragraph', index: 2, text: '다' },
    ])
    expect(() => groupParagraphs(['    - 가', '   셋', ' 하나'])).not.toThrow()
  })

  it('IAM Roles Anywhere 개념의 실제 문단을 단계 목록 셋으로 나누고, 펼치면 원래 순서와 글이 그대로다', () => {
    const changes = JSON.parse(changesText) as { newConcepts: { concept: { id: string; paragraphs: string[] } }[] }
    const concept = changes.newConcepts.find(({ concept: { id } }) => id === 'identity-federation.iam-roles-anywhere')?.concept
    expect(concept).toBeDefined()
    const paragraphs = concept?.paragraphs ?? []

    const blocks = groupParagraphs(paragraphs)
    const steps = blocks.flatMap((block) => (block.kind === 'steps' ? [block] : []))

    expect(steps.map(({ start }) => start)).toEqual([1, 9, 16])
    expect(steps.map(({ items }) => items.length)).toEqual([8, 7, 4])
    expect(steps.flatMap(({ items }) => items.map(({ number }) => number))).toEqual(
      Array.from({ length: 19 }, (_, index) => index + 1),
    )

    const flat = flatten(blocks)
    expect(flat.map(([index]) => index)).toEqual(paragraphs.map((_, index) => index))
    expect(flat.map(([, text]) => text)).toEqual(paragraphs.map(stripListMarker))
  })
})
