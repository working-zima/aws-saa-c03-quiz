import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { Route53AliasDiagram, route53AliasScenarios, paths as aliasPaths } from './Route53AliasDiagram'

const labels = { record: 'www.example.com', alb: 'ALB', ec2: 'EC2', 'ec2-new': '새 EC2' }
const notes = { replaced: '교체됨', 'record-same': '레코드 그대로', 'record-edit': '교체마다 수정', 'public-ip': '공용 IP 52.123.25.11' }
const expectedScenarios = [
  {
    id: 'alias', label: '별칭 레코드', nodes: ['record', 'alb', 'ec2'],
    paths: ['record-alb', 'alb-ec2'], notes: [],
    sources: ['route53.route53-alias-record', 'elastic-load-balancing.elb'],
  },
  {
    id: 'replace', label: '인스턴스 교체', nodes: ['record', 'alb', 'ec2-new'],
    paths: ['record-alb', 'alb-ec2-new'], notes: ['replaced', 'record-same'],
    sources: ['route53.route53-alias-record'],
  },
  {
    id: 'direct-ip', label: '공용 IP에 직접', nodes: ['record', 'ec2'],
    paths: ['record-ec2'], notes: ['record-edit', 'public-ip'],
    sources: ['route53.route53-alias-record'],
  },
]

function diagram() {
  return screen.getByRole('img', { name: '별칭 레코드와 공용 IP 직접 연결' })
}

async function selectScenario(label: string) {
  await act(async () => { await userEvent.click(screen.getByRole('button', { name: label })) })
}

function readBox(rect: Element) {
  return {
    id: rect.parentElement?.getAttribute('data-node') ?? rect.getAttribute('data-group') ?? '',
    x: Number(rect.getAttribute('x')), y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')), height: Number(rect.getAttribute('height')),
  }
}

describe('Route53AliasDiagram', () => {
  it('처음에는 노드 넷이 선명하고 경로·곁말 없이 선택 안내가 나온다', () => {
    const { container } = render(<Route53AliasDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(visualsByTopicId.route53.diagrams['alias-record'].idleCaption)
  })

  it.each(expectedScenarios)('$label: 지정한 노드·경로·곁말만 보이고 대상 그룹은 흐려지지 않는다', async (scenario) => {
    const { container } = render(<Route53AliasDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    expect(diagram().querySelector('[data-group="tg"]')!.closest('[opacity]')).toBeNull()
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path')).sort()).toEqual([...scenario.paths].sort())
    for (const path of paths) {
      expect(path).toHaveAttribute('d', aliasPaths[path.getAttribute('data-path')!])
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end', `url(#${diagram().querySelector('marker')!.id})`)
      expect(path).toHaveClass('stroke-title')
    }
    const visibleNotes = Array.from(diagram().querySelectorAll('[data-note]'))
    expect(visibleNotes.map((note) => note.getAttribute('data-note')).sort()).toEqual([...scenario.notes].sort())
    const [minX, minY, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    for (const note of visibleNotes) {
      const id = note.getAttribute('data-note')! as keyof typeof notes
      expect(note.textContent).toBe(notes[id])
      expect(note).toHaveAttribute('font-size', '9')
      expect(note).toHaveClass('fill-muted')
      expect(note.closest('[opacity]')).toBeNull()
      expect(note).toHaveAttribute('text-anchor', 'middle')
      const halfWidth = estimateTextWidth(note.textContent!, 9) / 2
      const x = Number(note.getAttribute('x')), y = Number(note.getAttribute('y'))
      expect(x - halfWidth).toBeGreaterThanOrEqual(minX)
      expect(x + halfWidth).toBeLessThanOrEqual(minX + width)
      expect(y - 9).toBeGreaterThanOrEqual(minY)
      expect(y).toBeLessThanOrEqual(minY + height)
      if (id === 'replaced' || id === 'public-ip') {
        const ec2 = readBox(diagram().querySelector('[data-node="ec2"] rect')!)
        expect(x).toBe(ec2.x + ec2.width / 2)
        expect(y - 9).toBeGreaterThan(ec2.y + ec2.height)
      } else {
        const record = readBox(diagram().querySelector('[data-node="record"] rect')!)
        expect(x - halfWidth).toBeGreaterThan(record.x + record.width)
      }
    }
    const wording = visualsByTopicId.route53.diagrams['alias-record'].scenarios.find(({ id }) => id === scenario.id)!
    expect(container.querySelector('figcaption')!.textContent).toBe(wording.caption)
    expect(container.querySelector('figcaption')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('button', { name: scenario.label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('물음형 제목이 시나리오 버튼보다 앞에 보인다', () => {
    render(<Route53AliasDiagram />)
    const question = screen.getByText('인스턴스를 바꿔도 DNS 레코드를 고치지 않으려면?')
    const firstButton = screen.getByRole('button', { name: '전체' })

    expect(question.compareDocumentPosition(firstButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('레코드 노드의 라벨이 예시 이름 www.example.com이다', () => {
    render(<Route53AliasDiagram />)
    expect(diagram().querySelector('[data-node="record"] text')!.textContent).toBe('www.example.com')
  })

  it('공용 IP 52.123.25.11 곁말은 공용 IP에 직접에서만 대상 그룹 안에 보인다', async () => {
    render(<Route53AliasDiagram />)
    expect(diagram().querySelector('[data-note="public-ip"]')).toBeNull()
    for (const label of ['별칭 레코드', '인스턴스 교체']) {
      await selectScenario(label)
      expect(diagram().querySelector('[data-note="public-ip"]')).toBeNull()
    }
    await selectScenario('공용 IP에 직접')
    const note = diagram().querySelector('[data-note="public-ip"]')!
    expect(note.textContent).toBe('공용 IP 52.123.25.11')
    const group = readBox(diagram().querySelector('[data-group="tg"]')!)
    const halfWidth = estimateTextWidth(note.textContent!, 9) / 2
    const x = Number(note.getAttribute('x')), y = Number(note.getAttribute('y'))
    expect(x - halfWidth).toBeGreaterThan(group.x)
    expect(x + halfWidth).toBeLessThan(group.x + group.width)
    expect(y - 9).toBeGreaterThan(group.y)
    expect(y).toBeLessThan(group.y + group.height)
    await selectScenario('전체')
    expect(diagram().querySelector('[data-note="public-ip"]')).toBeNull()
  })

  it('공용 IP 직접 연결에서는 ALB를 흐리게 하고 옆 통로 하나만 표시한다', async () => {
    render(<Route53AliasDiagram />)
    await selectScenario('공용 IP에 직접')

    expect(diagram().querySelector('[data-node="alb"]')).toHaveAttribute('opacity', '0.25')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(1)
    expect(diagram().querySelector('[data-path="record-ec2"]')).toBeInTheDocument()
  })

  it('시나리오를 바꾸면 이전 곁말이 사라지고 전체에서는 노드만 남는다', async () => {
    render(<Route53AliasDiagram />)
    for (const label of ['인스턴스 교체', '공용 IP에 직접', '별칭 레코드']) await selectScenario(label)
    expect(diagram().querySelectorAll('[data-note]')).toHaveLength(0)
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
  })

  it('EC2 둘은 대상 그룹 안에, 도메인 이름과 ALB는 그 위에 둔다', () => {
    render(<Route53AliasDiagram />)
    const group = readBox(diagram().querySelector('[data-group="tg"]')!)
    const box = (id: string) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
    const ec2 = box('ec2'), newEc2 = box('ec2-new')

    expect(boxesOutsideViewBox([ec2, newEc2], [group.x, group.y, group.width, group.height])).toEqual([])
    for (const id of ['record', 'alb']) expect(box(id).y + box(id).height).toBeLessThan(group.y)
    expect(box('record').y + box('record').height).toBeLessThan(box('alb').y)
    expect(ec2.y).toBe(newEc2.y)
    expect(newEc2.x + newEc2.width).toBeLessThan(ec2.x)
    expect(diagram().querySelector('[data-group="tg"]')).toHaveClass('stroke-diagram-resource')
    const groupLabel = within(diagram()).getByText('대상 그룹')
    expect(groupLabel).toHaveAttribute('font-size', '9')
    expect(groupLabel).toHaveClass('fill-muted')
    expect(groupLabel.closest('[opacity]')).toBeNull()
    expect(Number(groupLabel.getAttribute('x'))).toBeGreaterThan(group.x)
    expect(Number(groupLabel.getAttribute('x')) + estimateTextWidth('대상 그룹', 9)).toBeLessThan(group.x + group.width)
    expect(Number(groupLabel.getAttribute('y')) - 9).toBeGreaterThan(group.y)
    expect(Number(groupLabel.getAttribute('y'))).toBeLessThan(ec2.y)
  })

  it('관문 5·7: 그룹을 포함한 모든 상자가 폭 280의 viewBox 안에 있다', () => {
    render(<Route53AliasDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect([x, y, width]).toEqual([0, 0, 280])
    expect(boxes).toHaveLength(5)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]', '-mx-4', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 크기 10 라벨에 여백 12를 확보하고 노드 높이·계층 색을 지킨다', () => {
    render(<Route53AliasDiagram />)
    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const rect = node.querySelector('rect')!
      const text = node.querySelector('text')!
      const box = readBox(rect)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(box.height).toBe(32)
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      expect(rect).toHaveClass(id === 'record' ? 'stroke-diagram-managed' : 'stroke-diagram-resource')
    }
    expect(Object.keys(aliasPaths).sort()).toEqual(['alb-ec2', 'alb-ec2-new', 'record-alb', 'record-ec2'])
    for (const path of Object.values(aliasPaths)) expect(path).toMatch(/^M[\d\sHV]+$/)
  })

  it('JSON과 컴포넌트의 시나리오 id가 같고 문구·근거·50자 안팎의 캡션을 JSON에서 읽는다', () => {
    render(<Route53AliasDiagram />)
    const text = visualsByTopicId.route53.diagrams['alias-record']
    const ids = route53AliasScenarios.map(({ id }) => id).sort()

    expect(ids).toEqual(expectedScenarios.map(({ id }) => id).sort())
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual({ tg: '대상 그룹' })
    expect(text.notes).toEqual(notes)
    expect(text.sources).toEqual(['route53.route53-alias-record', 'elastic-load-balancing.elb'])
    expect(text.label).toBe('별칭 레코드 도식')
    expect(text.svgLabel).toBe('별칭 레코드와 공용 IP 직접 연결')
    expect(screen.getByText(text.legend!)).toBeInTheDocument()
    for (const expected of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === expected.id)!
      const scenario = route53AliasScenarios.find(({ id }) => id === expected.id)!
      expect(wording.sources).toEqual(expected.sources)
      expect(scenario.label).toBe(wording.label)
      expect(scenario.caption).toBe(wording.caption)
      expect(wording.caption.length).toBeGreaterThanOrEqual(40)
      expect(wording.caption.length).toBeLessThanOrEqual(60)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 별칭 레코드 본문 바로 뒤에 도식을 붙인다', (headingLevel) => {
    const concept = topics.find(({ id }) => id === 'route53')!.concepts.find(({ id }) => id === 'route53.route53-alias-record')!
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: '별칭 레코드 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join(''))
    expect(figure.closest('article')!.lastElementChild).toBe(figure)
    expect(within(figure).queryByRole('heading')).toBeNull()
  })

  it('두 번 렌더해도 각 도식의 경로가 서로 다른 화살표 마커를 쓴다', async () => {
    render(<><Route53AliasDiagram /><Route53AliasDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: '별칭 레코드 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: '별칭 레코드' })) })
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    expect(new Set(figures.map((figure) => figure.querySelector('marker')!.id)).size).toBe(2)
  })
})
