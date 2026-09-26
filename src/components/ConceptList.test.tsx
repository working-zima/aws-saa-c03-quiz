import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Concept } from '../types/content'
import { ConceptList } from './ConceptList'

const concepts: Concept[] = [
  { id: 'x.y', name: '첫 개념', summary: '첫 요약', paragraphs: ['첫 문단', '마지막 문단'] },
  { id: 'x.z', name: '이웃 개념', summary: '이웃 요약', paragraphs: ['이웃 문단'] },
]

function FakeDiagram() {
  return <figure aria-label="가짜 도식"><svg viewBox="0 0 100 100" /></figure>
}

describe('ConceptList', () => {
  it('빈 매핑이면 본문만 그리고 도식용 빈 요소도 남기지 않는다', () => {
    render(<ConceptList concepts={concepts} diagrams={{}} headingLevel={2} />)

    expect(screen.getByText('첫 요약')).toBeInTheDocument()
    expect(screen.getByText('첫 문단')).toBeInTheDocument()
    expect(screen.getByText('마지막 문단')).toBeInTheDocument()
    expect(screen.getByText('이웃 문단')).toBeInTheDocument()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
    for (const article of screen.getAllByRole('article')) {
      expect(article.lastElementChild?.lastElementChild?.tagName).toBe('P')
    }
  })

  it.each([2, 4] as const)('h%i 화면에서 매핑된 개념의 모든 문단 뒤에만 도식을 붙인다', (headingLevel) => {
    render(<ConceptList concepts={concepts} diagrams={{ 'x.y': FakeDiagram }} headingLevel={headingLevel} />)

    const [first, neighbor] = screen.getAllByRole('article')
    const figure = within(first).getByRole('figure', { name: '가짜 도식' })
    expect(screen.getByRole('heading', { name: '첫 개념', level: headingLevel })).toBeInTheDocument()
    expect(first.lastElementChild).toBe(figure)
    expect(figure.previousElementSibling?.lastElementChild).toBe(screen.getByText('마지막 문단'))
    expect(within(neighbor).queryByRole('figure')).not.toBeInTheDocument()
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })

  it.each([2, 4] as const)('h%i 화면에서 배열로 준 도식을 모든 문단 뒤에 배열 순서대로 붙인다', (headingLevel) => {
    const FirstDiagram = () => <figure aria-label="첫 도식" />
    const SecondDiagram = () => <figure aria-label="둘째 도식" />

    render(
      <ConceptList
        concepts={concepts}
        diagrams={{ 'x.y': [FirstDiagram, SecondDiagram] }}
        headingLevel={headingLevel}
      />,
    )

    const [first, neighbor] = screen.getAllByRole('article')
    const firstDiagram = within(first).getByRole('figure', { name: '첫 도식' })
    const secondDiagram = within(first).getByRole('figure', { name: '둘째 도식' })
    expect(screen.getByRole('heading', { name: '첫 개념', level: headingLevel })).toBeInTheDocument()
    expect(within(first).getAllByRole('figure')).toEqual([firstDiagram, secondDiagram])
    expect(firstDiagram.previousElementSibling?.lastElementChild).toBe(screen.getByText('마지막 문단'))
    expect(firstDiagram.nextElementSibling).toBe(secondDiagram)
    expect(first.lastElementChild).toBe(secondDiagram)
    expect(within(neighbor).queryByRole('figure')).not.toBeInTheDocument()
  })

  it('glossary를 주면 한 개념 안에서 같은 약어의 버튼이 하나만 생긴다', () => {
    const withTerms: Concept[] = [
      { id: 'v.a', name: 'NAT 인스턴스', summary: 'EC2로 직접 운영한다', paragraphs: ['뒤의 EC2가 느려진다', 'NACL과 달리 **EC2**다'] },
      { id: 'v.b', name: '이웃', summary: '이웃 요약', paragraphs: ['프라이빗 EC2가 나간다'] },
    ]
    const glossary = [
      { term: 'EC2', expansion: 'Elastic Compute Cloud', meaning: '빌려 쓰는 컴퓨터', sourceConceptId: 'aws-core-services.ec2' },
      { term: 'ACL', expansion: 'Access Control List', meaning: '규칙 목록', sourceConceptId: 'security-groups-nacl.nacl' },
    ]

    render(<ConceptList concepts={withTerms} diagrams={{}} glossary={glossary} headingLevel={2} />)

    const [first, neighbor] = screen.getAllByRole('article')
    expect(within(first).getAllByRole('button', { name: 'EC2' })).toHaveLength(1)
    expect(within(first).getByText(/로 직접 운영한다/)).toContainElement(within(first).getByRole('button', { name: 'EC2' }))
    expect(within(first).queryByRole('button', { name: 'ACL' })).not.toBeInTheDocument()
    expect(within(neighbor).getAllByRole('button', { name: 'EC2' })).toHaveLength(1)
  })

  it('glossary를 주지 않으면 약어가 있어도 버튼이 하나도 없다', () => {
    const withTerms: Concept[] = [{ id: 'v.a', name: 'NAT 인스턴스', summary: 'EC2로 운영한다', paragraphs: ['IAM 역할'] }]

    render(<ConceptList concepts={withTerms} diagrams={{}} headingLevel={2} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('EC2로 운영한다')).toBeInTheDocument()
  })
})
