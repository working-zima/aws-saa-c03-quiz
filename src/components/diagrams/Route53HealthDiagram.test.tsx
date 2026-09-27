import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { Route53HealthDiagram, route53HealthScenarios, paths as healthPaths } from './Route53HealthDiagram'

const labels = { user: '사용자', route53: 'Route 53', 'region-a': '리전 A의 ALB', 'region-b': '리전 B의 ALB' }
const notes = { unhealthy: '비정상', primary: '주 · 상태 검사', secondary: '보조', dropped: '응답에서 빠짐', query: 'www.example.com의 주소는?' }
const question = '리전 A가 멈추면 Route 53은 어디를 알려 줄까?'
const expectedScenarios = [
  {
    id: 'simple', label: '단순', nodes: ['user', 'route53'],
    paths: ['user-route53', 'route53-region-a'], notes: ['unhealthy'],
    sources: ['route53.routing-policies', 'route53.multivalue-answer-details', 'route53.multi-region-failover-for-region-outage'],
  },
  {
    id: 'failover', label: '페일오버', nodes: ['user', 'route53', 'region-b'],
    paths: ['user-route53', 'route53-region-b'], notes: ['unhealthy', 'primary', 'secondary'],
    sources: ['route53.route53-failover-routing', 'route53.multi-region-failover-for-region-outage'],
  },
  {
    id: 'multivalue', label: '다중값 응답', nodes: ['user', 'route53', 'region-b'],
    paths: ['user-route53', 'route53-region-b'], notes: ['unhealthy', 'dropped'],
    sources: ['route53.multivalue-answer-details'],
  },
]

function diagram() {
  return screen.getByRole('img', { name: '상태 검사와 Route 53 응답' })
}

async function selectScenario(label: string) {
  await act(async () => { await userEvent.click(screen.getByRole('button', { name: label })) })
}

function readBox(rect: Element) {
  return {
    id: rect.parentElement?.getAttribute('data-node') ?? '',
    x: Number(rect.getAttribute('x')), y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')), height: Number(rect.getAttribute('height')),
  }
}

describe('Route53HealthDiagram', () => {
  it('처음에는 노드 넷이 모두 선명하고 경로 없이 예시 곁말만 두고 선택 안내가 나온다', () => {
    const { container } = render(<Route53HealthDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(Array.from(diagram().querySelectorAll('[data-note]'), (note) => note.getAttribute('data-note'))).toEqual(['query'])
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(visualsByTopicId.route53.diagrams['health-answers'].idleCaption)
  })

  it.each(expectedScenarios)('$label: 지정한 노드·경로·곁말만 표시하고 리전 A는 항상 비정상이다', async (scenario) => {
    const { container } = render(<Route53HealthDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    expect(diagram().querySelector('[data-node="region-a"]')).toHaveAttribute('opacity', '0.25')
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path')).sort()).toEqual([...scenario.paths].sort())
    for (const path of paths) {
      expect(path).toHaveAttribute('d', healthPaths[path.getAttribute('data-path')!])
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end', `url(#${diagram().querySelector('marker')!.id})`)
      expect(path).toHaveClass('stroke-title')
      expect(path.closest('[opacity]')).toBeNull()
    }
    const allNotes = Array.from(diagram().querySelectorAll('[data-note]'))
    expect(allNotes.map((note) => note.getAttribute('data-note')).sort()).toEqual([...scenario.notes, 'query'].sort())
    const visibleNotes = allNotes.filter((note) => note.getAttribute('data-note') !== 'query')
    expect(diagram().querySelector('[data-note="unhealthy"]')).toHaveTextContent('비정상')
    const [minX, minY, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    for (const note of visibleNotes) {
      const id = note.getAttribute('data-note')! as keyof typeof notes
      expect(note.textContent).toBe(notes[id])
      expect(note.textContent).not.toContain('장애')
      expect(note).toHaveAttribute('font-size', '9')
      expect(note).toHaveClass('fill-muted')
      expect(note.closest('[opacity]')).toBeNull()
      expect(note).toHaveAttribute('text-anchor', 'middle')
      const halfWidth = estimateTextWidth(note.textContent!, 9) / 2
      expect(Number(note.getAttribute('x')) - halfWidth).toBeGreaterThanOrEqual(minX)
      expect(Number(note.getAttribute('x')) + halfWidth).toBeLessThanOrEqual(minX + width)
      expect(Number(note.getAttribute('y')) - 9).toBeGreaterThanOrEqual(minY)
      expect(Number(note.getAttribute('y'))).toBeLessThanOrEqual(minY + height)
    }
    const regionA = readBox(diagram().querySelector('[data-node="region-a"] rect')!)
    expect(Number(diagram().querySelector('[data-note="unhealthy"]')!.getAttribute('y'))).toBeGreaterThan(regionA.y + regionA.height)
    const wording = visualsByTopicId.route53.diagrams['health-answers'].scenarios.find(({ id }) => id === scenario.id)!
    expect(container.querySelector('figcaption')!.textContent).toBe(wording.caption)
    expect(container.querySelector('figcaption')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('button', { name: scenario.label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('정책을 연달아 바꿔도 이전 곁말이 남지 않고 전체에서 경로를 숨기고 예시 곁말만 남긴다', async () => {
    render(<Route53HealthDiagram />)
    for (const label of ['페일오버', '다중값 응답', '단순']) await selectScenario(label)

    expect(diagram().querySelectorAll('[data-note]')).toHaveLength(2)
    expect(diagram().querySelector('[data-path="route53-region-a"]')).toBeInTheDocument()
    expect(diagram().querySelector('[data-path="route53-region-b"]')).toBeNull()
    await selectScenario('전체')
    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(Array.from(diagram().querySelectorAll('[data-note]'), (note) => note.getAttribute('data-note'))).toEqual(['query'])
  })

  it('물음형 제목이 시나리오 버튼보다 앞에 보인다', () => {
    render(<Route53HealthDiagram />)
    const title = screen.getByText(question)

    expect(visualsByTopicId.route53.diagrams['health-answers'].question).toBe(question)
    expect(title.compareDocumentPosition(screen.getByRole('button', { name: '전체' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.tagName).toBe('P')
  })

  it.each(['전체', '단순', '페일오버', '다중값 응답'])('%s: 예시 곁말이 질의 화살표 오른쪽에 보이고 viewBox 안에 있다', async (label) => {
    render(<Route53HealthDiagram />)
    if (label !== '전체') await selectScenario(label)
    const query = diagram().querySelector('[data-note="query"]')!
    const [minX, minY, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const user = readBox(diagram().querySelector('[data-node="user"] rect')!)
    const route53 = readBox(diagram().querySelector('[data-node="route53"] rect')!)
    const x = Number(query.getAttribute('x')), y = Number(query.getAttribute('y'))

    expect(query.textContent).toBe(notes.query)
    expect(query).toHaveAttribute('font-size', '9')
    expect(query).toHaveClass('fill-muted')
    expect(query).toHaveAttribute('text-anchor', 'start')
    expect(query).toHaveAttribute('opacity', diagram().querySelector('[data-node="user"]')!.getAttribute('opacity'))
    expect(x).toBeGreaterThan(140)
    expect(x).toBeGreaterThanOrEqual(minX)
    expect(x + estimateTextWidth(notes.query, 9)).toBeLessThanOrEqual(minX + width)
    expect(y - 9).toBeGreaterThanOrEqual(user.y + user.height)
    expect(y).toBeLessThanOrEqual(route53.y)
    expect(y).toBeLessThanOrEqual(minY + height)
  })

  it('관문 5·7: 네 상자가 폭 280의 viewBox 안에 있고 모바일 너비 보정을 유지한다', () => {
    render(<Route53HealthDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect([x, y, width]).toEqual([0, 0, 280])
    expect(boxes).toHaveLength(4)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 노드 라벨은 크기 10이고 높이 32 상자 안에 여백 12를 남긴다', () => {
    render(<Route53HealthDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const box = readBox(node.querySelector('rect')!)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(box.height).toBe(32)
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
    }
  })

  it('사용자·Route 53은 중앙에, 두 리전은 그 아래 나란히 있고 색은 지정한 계층만 구분한다', () => {
    render(<Route53HealthDiagram />)
    const box = (id: string) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
    const user = box('user'), route53 = box('route53'), a = box('region-a'), b = box('region-b')

    expect(user.x + user.width / 2).toBe(140)
    expect(route53.x + route53.width / 2).toBe(140)
    expect(user.y + user.height).toBeLessThan(route53.y)
    expect(route53.y + route53.height).toBeLessThan(a.y)
    expect(a.y).toBe(b.y)
    expect(a.x + a.width).toBeLessThan(b.x)
    for (const [id, color] of Object.entries({ user: 'stroke-disabled', route53: 'stroke-diagram-managed', 'region-a': 'stroke-diagram-resource', 'region-b': 'stroke-diagram-resource' })) {
      expect(diagram().querySelector(`[data-node="${id}"] rect`)).toHaveClass(color)
    }
    expect(Object.keys(healthPaths).sort()).toEqual(['route53-region-a', 'route53-region-b', 'user-route53'])
    for (const path of Object.values(healthPaths)) expect(path).toMatch(/^M[\d\sHV]+$/)
  })

  it('JSON과 컴포넌트의 시나리오 id가 같고 문구·근거와 50자 이하 캡션을 JSON에서 읽는다', () => {
    render(<Route53HealthDiagram />)
    const text = visualsByTopicId.route53.diagrams['health-answers']
    const ids = route53HealthScenarios.map(({ id }) => id).sort()

    expect(ids).toEqual(expectedScenarios.map(({ id }) => id).sort())
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(text.nodes).toEqual(labels)
    expect(text.notes).toEqual(notes)
    expect(text.sources).toEqual(['route53.route53', 'route53.routing-policies', 'route53.route53-failover-routing', 'route53.multi-region-failover-for-region-outage'])
    expect(text.label).toBe('상태 검사와 Route 53 응답 도식')
    expect(text.svgLabel).toBe('상태 검사와 Route 53 응답')
    expect(screen.getByText(text.legend!)).toBeInTheDocument()
    for (const expected of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === expected.id)!
      const scenario = route53HealthScenarios.find(({ id }) => id === expected.id)!
      expect(wording.sources).toEqual(expected.sources)
      expect(scenario.label).toBe(wording.label)
      expect(scenario.caption).toBe(wording.caption)
      expect(wording.caption.length).toBeLessThanOrEqual(50)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 다중값 응답 개념 본문 바로 뒤에 도식을 붙인다', (headingLevel) => {
    const concept = topics.find(({ id }) => id === 'route53')!.concepts.find(({ id }) => id === 'route53.multivalue-answer-details')!
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: '상태 검사와 Route 53 응답 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join(''))
    expect(figure.closest('article')!.lastElementChild).toBe(figure)
    expect(within(figure).queryByRole('heading')).toBeNull()
  })

  it('두 번 렌더해도 각 도식의 경로는 서로 다른 화살표 마커를 쓴다', async () => {
    render(<><Route53HealthDiagram /><Route53HealthDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: '상태 검사와 Route 53 응답 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: '단순' })) })
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    expect(new Set(figures.map((figure) => figure.querySelector('marker')!.id)).size).toBe(2)
  })
})
