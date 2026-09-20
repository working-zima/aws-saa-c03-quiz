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
})
