import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { SgNaclLayersDiagram, sgNaclLayersScenarios, paths as layerPaths } from './SgNaclLayersDiagram'

const labels = {
  internet: '인터넷', 'nacl-public': 'NACL', alb: 'ALB', waf: 'WAF', 'nacl-private': 'NACL', ec2: 'EC2',
}
const requestPaths = ['internet-nacl-public', 'nacl-public-alb', 'alb-nacl-private', 'nacl-private-ec2']
const expectedScenarios = [
  {
    id: 'flow', label: '요청 흐름', nodes: Object.keys(labels), paths: requestPaths,
    sources: ['security-groups-nacl.security-group', 'security-groups-nacl.nacl'],
  },
  {
    id: 'waf', label: 'WAF', nodes: ['internet', 'alb', 'waf'], paths: ['internet-nacl-public', 'nacl-public-alb'],
    sources: ['waf-shield.waf', 'waf-shield.waf-attach-targets'],
  },
  {
    id: 'nacl', label: 'NACL', nodes: ['nacl-public', 'nacl-private'], paths: [],
    sources: ['security-groups-nacl.nacl', 'security-groups-nacl.security-group-stateful-vs-nacl-stateless'],
  },
  {
    id: 'sg-ref', label: '보안 그룹 참조', nodes: ['alb', 'ec2'], paths: ['alb-nacl-private', 'nacl-private-ec2'],
    sources: ['security-groups-nacl.security-group-referencing', 'security-groups-nacl.alb-security-group-outbound-and-health-check-port'],
  },
  {
    id: 'block-ip', label: 'IP 하나 막기', nodes: ['waf', 'nacl-public', 'nacl-private'], paths: [],
    sources: ['security-groups-nacl.security-group-stateful-vs-nacl-stateless', 'security-groups-nacl.nacl-rule-limit'],
  },
]

function diagram() {
  return screen.getByRole('img', { name: '보안 그룹·NACL·WAF 층' })
}

async function selectScenario(label: string) {
  await act(async () => {
    await userEvent.click(screen.getByRole('button', { name: label }))
  })
}

function readBox(rect: Element) {
  return {
    id: rect.parentElement?.getAttribute('data-node') ?? rect.getAttribute('data-group') ?? '',
    x: Number(rect.getAttribute('x')), y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')), height: Number(rect.getAttribute('height')),
  }
}

describe('SgNaclLayersDiagram', () => {
  it('처음에는 여섯 노드가 모두 선명하고 요청 경로가 없다', () => {
    const { container } = render(<SgNaclLayersDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(visualsByTopicId['security-groups-nacl'].diagrams['sg-nacl-layers'].idleCaption)
  })

  it.each(expectedScenarios)('$label은 정해진 노드와 경로만 강조하고 그룹은 흐리지 않는다', async (scenario) => {
    const { container } = render(<SgNaclLayersDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path')).sort()).toEqual([...scenario.paths].sort())
    for (const path of paths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end', `url(#${diagram().querySelector('marker')!.id})`)
      expect(path).toHaveClass('stroke-title')
    }
    const attachment = diagram().querySelector('[data-attachment="alb-waf"]')!
    expect(attachment).toHaveAttribute('opacity', scenario.nodes.includes('waf') ? '1' : '0.25')
    expect(attachment).toHaveClass('stroke-disabled')
    expect(attachment).toHaveAttribute('stroke-width', '1')
    expect(attachment).not.toHaveAttribute('marker-end')
    expect(attachment).not.toHaveAttribute('data-path')
    const wording = visualsByTopicId['security-groups-nacl'].diagrams['sg-nacl-layers'].scenarios.find(({ id }) => id === scenario.id)!
    expect(container.querySelector('figcaption')!.textContent).toBe(wording.caption)
    expect(container.querySelector('figcaption')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('button', { name: scenario.label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('전체로 돌아오면 여섯 노드를 복원하고 요청 경로를 숨긴다', async () => {
    render(<SgNaclLayersDiagram />)
    await selectScenario('보안 그룹 참조')
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(diagram().querySelector('[data-attachment="alb-waf"]')).toHaveAttribute('opacity', '1')
  })

  it('관문 5·7: 모든 상자가 폭 280의 viewBox 안에 있다', () => {
    render(<SgNaclLayersDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect([x, y, width]).toEqual([0, 0, 280])
    expect(boxes).toHaveLength(10)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]', '-mx-4', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 노드 라벨을 크기 10으로, 여백 12를 두고 높이 32 상자 안에 넣는다', () => {
    render(<SgNaclLayersDiagram />)

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

  it('NACL·리소스는 자기 서브넷 안에 있고 ALB·EC2에는 각각 보안 그룹이 있다', () => {
    render(<SgNaclLayersDiagram />)
    const groupBox = (id: string) => readBox(diagram().querySelector(`[data-group="${id}"]`)!)
    for (const [groupId, ids] of Object.entries({ public: ['nacl-public', 'alb'], 'alb-sg': ['alb'], private: ['nacl-private', 'ec2'], 'ec2-sg': ['ec2'] })) {
      const group = groupBox(groupId)
      const boxes = ids.map((id) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!))
      expect(boxesOutsideViewBox(boxes, [group.x, group.y, group.width, group.height])).toEqual([])
    }
    for (const [subnet, sg, nacl] of [['public', 'alb-sg', 'nacl-public'], ['private', 'ec2-sg', 'nacl-private']]) {
      const group = groupBox(subnet)
      expect(boxesOutsideViewBox([groupBox(sg)], [group.x, group.y, group.width, group.height])).toEqual([])
      const naclBox = readBox(diagram().querySelector(`[data-node="${nacl}"] rect`)!)
      expect(naclBox.y + naclBox.height).toBeLessThan(groupBox(sg).y)
    }
    const internet = readBox(diagram().querySelector('[data-node="internet"] rect')!)
    expect(internet.y + internet.height).toBeLessThan(groupBox('public').y)
    expect(groupBox('public').y + groupBox('public').height).toBeLessThan(groupBox('private').y)
  })

  it('WAF는 두 서브넷과 겹치지 않는 오른쪽에서 ALB 옆에 화살표 없이 붙는다', () => {
    render(<SgNaclLayersDiagram />)
    const waf = readBox(diagram().querySelector('[data-node="waf"] rect')!)
    const alb = readBox(diagram().querySelector('[data-node="alb"] rect')!)
    for (const id of ['public', 'private']) {
      const subnet = readBox(diagram().querySelector(`[data-group="${id}"]`)!)
      expect(waf.x).toBeGreaterThan(subnet.x + subnet.width)
    }
    expect(waf.y).toBe(alb.y)
    const line = diagram().querySelector('[data-attachment="alb-waf"]')!
    expect(Number(line.getAttribute('x1'))).toBe(alb.x + alb.width)
    expect(Number(line.getAttribute('x2'))).toBe(waf.x)
    expect(Number(line.getAttribute('y1'))).toBe(alb.y + alb.height / 2)
    expect(line.getAttribute('y1')).toBe(line.getAttribute('y2'))
    expect(Object.keys(layerPaths).sort()).toEqual([...requestPaths].sort())
    for (const [id, path] of Object.entries(layerPaths)) {
      expect(id).not.toContain('waf')
      expect(path).toMatch(/^M[\d\sHV]+$/)
    }
  })

  it('JSON과 시나리오 id가 같고 문구·근거·짧은 캡션을 데이터에서 읽는다', () => {
    render(<SgNaclLayersDiagram />)
    const visuals = visualsByTopicId['security-groups-nacl']
    const text = visuals.diagrams['sg-nacl-layers']
    const ids = sgNaclLayersScenarios.map(({ id }) => id).sort()

    expect(ids).toEqual(expectedScenarios.map(({ id }) => id).sort())
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(visuals.glossary).toEqual([])
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual({ public: '퍼블릭 서브넷', 'alb-sg': 'ALB 보안 그룹', private: '프라이빗 서브넷', 'ec2-sg': 'EC2 보안 그룹' })
    expect(text.notes).toEqual({ 'waf-attach': 'ALB에 붙음', 'sg-source': '소스 =\nALB 보안 그룹' })
    expect(text.sources).toEqual(['security-groups-nacl.security-group', 'security-groups-nacl.nacl', 'security-groups-nacl.web-acl-vs-nacl', 'elastic-load-balancing.elb'])
    expect(screen.getByRole('figure', { name: text.label })).toBeInTheDocument()
    expect(diagram()).toHaveAttribute('aria-label', text.svgLabel)
    expect(screen.getByText(text.legend!)).toBeInTheDocument()
    for (const scenario of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === scenario.id)!
      expect(wording.sources).toEqual(scenario.sources)
      expect(wording.caption.length).toBeLessThanOrEqual(50)
    }
  })

  it('곁말은 크기 9로 오른쪽에 놓고 두 줄 소스 라벨도 viewBox 안에 들어간다', () => {
    render(<SgNaclLayersDiagram />)
    const text = visualsByTopicId['security-groups-nacl'].diagrams['sg-nacl-layers']
    for (const id of ['waf-attach', 'sg-source']) {
      const note = diagram().querySelector(`[data-note="${id}"]`)!
      expect(note).toHaveAttribute('font-size', '9')
      expect(note).toHaveClass('fill-muted')
      const x = Number(note.getAttribute('x'))
      expect(x).toBeGreaterThan(188)
      const lines = note.querySelectorAll('tspan')
      const labels = lines.length ? Array.from(lines, (line) => line.textContent!) : [note.textContent!]
      expect(labels.join('\n')).toBe(text.notes![id])
      for (const label of labels) expect(x + estimateTextWidth(label, 9)).toBeLessThanOrEqual(280)
    }
    expect(diagram().querySelectorAll('[data-note="sg-source"] tspan')).toHaveLength(2)
  })

  it('WAF는 파랑, 보안 그룹·리소스는 청록, NACL·서브넷·인터넷은 회색이다', () => {
    render(<SgNaclLayersDiagram />)
    for (const id of Object.keys(labels)) {
      const color = id === 'waf' ? 'stroke-diagram-managed' : ['alb', 'ec2'].includes(id) ? 'stroke-diagram-resource' : 'stroke-disabled'
      expect(diagram().querySelector(`[data-node="${id}"] rect`)).toHaveClass(color)
    }
    for (const id of ['public', 'private', 'alb-sg', 'ec2-sg']) {
      expect(diagram().querySelector(`[data-group="${id}"]`)).toHaveClass(id.endsWith('-sg') ? 'stroke-diagram-resource' : 'stroke-disabled')
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 마지막 개념 본문 뒤에 층 도식을 붙인다', (headingLevel) => {
    const concepts = topics.find(({ id }) => id === 'security-groups-nacl')!.concepts
    const concept = concepts[concepts.length - 1]
    expect(concept.id).toBe('security-groups-nacl.web-acl-vs-nacl')
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: '보안 그룹·NACL·WAF 층 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join(''))
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })

  it('두 번 렌더해도 각 도식의 요청 경로는 서로 다른 마커를 쓴다', async () => {
    render(<><SgNaclLayersDiagram /><SgNaclLayersDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: '보안 그룹·NACL·WAF 층 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: '요청 흐름' })) })
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    const ids = figures.map((figure) => figure.querySelector('marker')!.id)
    expect(new Set(ids).size).toBe(2)
  })
})
