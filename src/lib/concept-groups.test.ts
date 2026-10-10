// @vitest-environment node

import { describe, expect, it } from 'vitest'
import type { Concept, Topic } from '../types/content'
import { groupConcepts, hierarchyProblems } from './concept-groups'

function concept(id: string, parentId?: string): Concept {
  return { id, ...(parentId === undefined ? {} : { parentId }), name: id, summary: '', paragraphs: [] }
}

function topic(concepts: Concept[]): Topic {
  return { id: 'topic', title: '주제', importance: 0, sourcePages: [1, 1], concepts }
}

describe('groupConcepts', () => {
  it('parentId가 없으면 개념마다 자식 없는 묶음을 만든다', () => {
    const concepts = [concept('A'), concept('B')]

    expect(groupConcepts(concepts)).toEqual([
      { concept: concepts[0], children: [] },
      { concept: concepts[1], children: [] },
    ])
  })

  it('머리 바로 뒤에 연속한 딸린 개념들을 같은 묶음에 넣는다', () => {
    const [a, b, c, d] = [concept('A'), concept('B', 'A'), concept('C', 'A'), concept('D')]

    expect(groupConcepts([a, b, c, d])).toEqual([
      { concept: a, children: [b, c] },
      { concept: d, children: [] },
    ])
  })

  it.each([
    { name: '연속한 딸린 개념', concepts: [concept('A'), concept('B', 'A'), concept('C', 'A'), concept('D')] },
    {
      name: '없는 머리·끊긴 무리·세 단이 섞인 개념',
      concepts: [concept('B', 'A'), concept('A'), concept('C', 'A'), concept('D', 'C'), concept('E', 'A')],
    },
  ])('$name의 묶음을 펼쳐도 입력 순서가 유지된다', ({ concepts }) => {
    const flattened = groupConcepts(concepts).flatMap((group) => [group.concept, ...group.children])

    expect(flattened).toEqual(concepts)
  })

  it('머리가 목록에 없는 딸린 개념 하나는 평평하게 둔다', () => {
    const b = concept('B', 'A')

    expect(groupConcepts([b])).toEqual([{ concept: b, children: [] }])
  })

  it('머리와 사이에 다른 개념이 끼면 자기 묶음의 머리로 둔다', () => {
    const [a, x, b] = [concept('A'), concept('X'), concept('B', 'A')]

    expect(groupConcepts([a, x, b])).toEqual([
      { concept: a, children: [] },
      { concept: x, children: [] },
      { concept: b, children: [] },
    ])
  })

  it('딸린 개념을 가리키는 개념은 자기 묶음의 머리로 둔다', () => {
    const [a, b, c] = [concept('A'), concept('B', 'A'), concept('C', 'B')]

    expect(groupConcepts([a, b, c])).toEqual([
      { concept: a, children: [b] },
      { concept: c, children: [] },
    ])
  })

  it('없는 머리 때문에 평평하게 둔 딸린 개념에도 자식을 붙이지 않는다', () => {
    const [b, c] = [concept('B', 'A'), concept('C', 'B')]

    expect(groupConcepts([b, c])).toEqual([
      { concept: b, children: [] },
      { concept: c, children: [] },
    ])
  })

  it('빈 배열이면 빈 배열을 반환한다', () => {
    expect(groupConcepts([])).toEqual([])
  })

  it('입력 배열과 개념을 수정하지 않는다', () => {
    const concepts = [concept('A'), concept('B', 'A')]
    const original = structuredClone(concepts)
    concepts.forEach((item) => {
      Object.freeze(item.paragraphs)
      Object.freeze(item)
    })
    Object.freeze(concepts)

    groupConcepts(concepts)

    expect(concepts).toEqual(original)
  })
})

describe('hierarchyProblems', () => {
  it('머리 바로 뒤에 같은 parentId의 개념들이 이어지면 문제가 없다', () => {
    expect(hierarchyProblems(topic([
      concept('A'), concept('B', 'A'), concept('C', 'A'), concept('D'),
    ]))).toEqual([])
  })

  it('parentId가 없는 개념들에는 문제가 없다', () => {
    expect(hierarchyProblems(topic([concept('A'), concept('B')]))).toEqual([])
  })

  it('빈 주제에는 문제가 없다', () => {
    expect(hierarchyProblems(topic([]))).toEqual([])
  })

  it('같은 주제에 없는 머리를 가리키면 문제 개념의 id를 알린다', () => {
    const problems = hierarchyProblems(topic([concept('B', 'other-topic.A')]))

    expect(problems.length).toBeGreaterThan(0)
    expect(problems.some((problem) => problem.includes('B'))).toBe(true)
  })

  it('자기 자신을 가리키면 문제 개념의 id를 알린다', () => {
    const problems = hierarchyProblems(topic([concept('A', 'A')]))

    expect(problems.length).toBeGreaterThan(0)
    expect(problems.some((problem) => problem.includes('A'))).toBe(true)
  })

  it('머리에 parentId가 있는 세 단이면 문제 개념의 id를 알린다', () => {
    const problems = hierarchyProblems(topic([concept('A'), concept('B', 'A'), concept('C', 'B')]))

    expect(problems.length).toBeGreaterThan(0)
    expect(problems.some((problem) => problem.includes('C'))).toBe(true)
  })

  it('머리가 딸린 개념보다 뒤에 있으면 문제 개념의 id를 알린다', () => {
    const problems = hierarchyProblems(topic([concept('B', 'A'), concept('A')]))

    expect(problems.length).toBeGreaterThan(0)
    expect(problems.some((problem) => problem.includes('B'))).toBe(true)
  })

  it('사이에 다른 parentId의 개념이 끼면 문제 개념의 id를 알린다', () => {
    const problems = hierarchyProblems(topic([
      concept('A'), concept('B', 'A'), concept('X'), concept('C', 'A'),
    ]))

    expect(problems.length).toBeGreaterThan(0)
    expect(problems.some((problem) => problem.includes('C'))).toBe(true)
  })
})
