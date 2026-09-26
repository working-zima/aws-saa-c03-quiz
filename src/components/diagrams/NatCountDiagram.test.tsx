import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth, type SvgBox } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { NatCountDiagram, natCountScenarios } from './NatCountDiagram'
import { diagramsByConceptId } from './registry'

const diagramText = visualsByTopicId['vpc-networking'].diagrams['nat-count']
const nodeIds = ['internet', 'igw', 'nat-a', 'ec2-a', 'nat-b', 'ec2-b', 'nat-c', 'ec2-c']
const conceptId = 'vpc-networking.nat-gateway-count-by-environment'

const expected = {
  n1: {
    label: '프로덕션',
    nodes: nodeIds,
    paths: ['ec2-a-nat-a', 'ec2-b-nat-b', 'ec2-c-nat-c', 'nat-a-igw', 'nat-b-igw', 'nat-c-igw', 'igw-internet'],
  },
  n2: {
    label: '개발',
    nodes: ['internet', 'igw', 'nat-a', 'ec2-a', 'ec2-b', 'ec2-c'],
    paths: ['ec2-a-nat-a', 'ec2-b-nat-a', 'ec2-c-nat-a', 'nat-a-igw', 'igw-internet'],
  },
  n3: {
    label: '프로덕션 · AZ A 장애',
    nodes: ['internet', 'igw', 'nat-b', 'ec2-b', 'nat-c', 'ec2-c'],
    paths: ['ec2-b-nat-b', 'ec2-c-nat-c', 'nat-b-igw', 'nat-c-igw', 'igw-internet'],
  },
  n4: {
    label: '개발 · AZ A 장애',
    nodes: ['internet', 'igw', 'ec2-b', 'ec2-c'],
    paths: [],
  },
} as const

function diagram() {
  return screen.getByRole('img', { name: diagramText.svgLabel })
}

async function select(label: string) {
  await act(async () => {
    await userEvent.click(screen.getByRole('button', { name: label }))
  })
}

function readBox(rect: Element): SvgBox {
  return {
    id: rect.parentElement?.getAttribute('data-node') ?? rect.getAttribute('data-group') ?? '',
    x: Number(rect.getAttribute('x')),
    y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')),
    height: Number(rect.getAttribute('height')),
  }
}

const node = (id: string) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
const group = (id: string) => readBox(diagram().querySelector(`[data-group="${id}"]`)!)
const inside = (child: SvgBox, parent: SvgBox) => boxesOutsideViewBox([child], [parent.x, parent.y, parent.width, parent.height])

function sharpNodes() {
  return Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (el) => el.getAttribute('data-node')).sort()
}

function visiblePaths() {
  return Array.from(diagram().querySelectorAll('[data-path]'), (el) => el.getAttribute('data-path')).sort()
}

describe('NatCountDiagram', () => {
  it('처음에는 노드 여덟이 모두 선명하고 경로가 없으며 캡션은 idleCaption이다', () => {
    const { container } = render(<NatCountDiagram />)

    expect(Array.from(diagram().querySelectorAll('[data-node]'), (el) => el.getAttribute('data-node'))).toEqual(nodeIds)
    expect(sharpNodes()).toEqual([...nodeIds].sort())
    expect(visiblePaths()).toEqual([])
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(diagramText.idleCaption)
  })

  it.each(Object.entries(expected))('%s: 선명한 노드와 보이는 경로가 표와 같고 캡션은 JSON 문구다', async (id, scenario) => {
    const { container } = render(<NatCountDiagram />)
    await select(scenario.label)

    expect(sharpNodes()).toEqual([...scenario.nodes].sort())
    for (const el of diagram().querySelectorAll('[data-node]')) {
      expect(el).toHaveAttribute('opacity', (scenario.nodes as readonly string[]).includes(el.getAttribute('data-node')!) ? '1' : '0.25')
    }
    expect(visiblePaths()).toEqual([...scenario.paths].sort())
    for (const path of diagram().querySelectorAll('[data-path]')) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
    }
    for (const el of diagram().querySelectorAll('[data-group]')) expect(el.closest('[opacity]')).toBeNull()
    expect(container.querySelector('figcaption')!.textContent).toBe(diagramText.scenarios.find((s) => s.id === id)!.caption)
  })

  it('개발 · AZ A 장애에서 EC2 둘은 살아 있는데 나갈 경로가 하나도 없다', async () => {
    render(<NatCountDiagram />)
    await select('개발 · AZ A 장애')

    expect(diagram().querySelector('[data-node="ec2-b"]')).toHaveAttribute('opacity', '1')
    expect(diagram().querySelector('[data-node="ec2-c"]')).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
  })

  it.each([
    ['전체', false], ['프로덕션', false], ['개발', false],
    ['프로덕션 · AZ A 장애', true], ['개발 · AZ A 장애', true],
  ] as const)('%s: 장애 곁말 표시 여부는 %s이다', async (label, shown) => {
    render(<NatCountDiagram />)
    await select(label)

    const note = diagram().querySelector('[data-failure]')
    if (!shown) {
      expect(note).toBeNull()
      return
    }
    expect(note).toHaveTextContent(diagramText.notes!.failure)
    expect(note).toHaveAttribute('data-failure', 'az-a')
    expect(note!.getAttribute('font-size') ?? note!.closest('[font-size]')!.getAttribute('font-size')).toBe('9')
    const azLabel = diagram().querySelector('[data-group-label="az-a"]')!
    expect(Number(note!.getAttribute('y'))).toBe(Number(azLabel.getAttribute('y')))
    expect(Number(note!.getAttribute('x'))).toBeGreaterThan(Number(azLabel.getAttribute('x')) + estimateTextWidth(azLabel.textContent!, 9))
  })

  it('JSON과 좌표 시나리오의 id·순서가 같다', () => {
    expect(natCountScenarios.map(({ id }) => id)).toEqual(['n1', 'n2', 'n3', 'n4'])
    expect(diagramText.scenarios.map(({ id }) => id)).toEqual(['n1', 'n2', 'n3', 'n4'])
    render(<NatCountDiagram />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('노드마다 자기 가용 영역 안에 있고, NAT는 퍼블릭 열·EC2는 프라이빗 열이며, 인터넷 게이트웨이는 VPC 안·가용 영역 밖이다', () => {
    render(<NatCountDiagram />)

    for (const az of ['a', 'b', 'c']) {
      expect(inside(group(`az-${az}`), group('vpc'))).toEqual([])
      expect(inside(node(`nat-${az}`), group(`az-${az}`))).toEqual([])
      expect(inside(node(`ec2-${az}`), group(`az-${az}`))).toEqual([])
      expect(node(`nat-${az}`).x + node(`nat-${az}`).width).toBeLessThan(node(`ec2-${az}`).x)
      expect(inside(node('igw'), group(`az-${az}`))).not.toEqual([])
    }
    expect(group('az-a').y + group('az-a').height).toBeLessThan(group('az-b').y)
    expect(group('az-b').y + group('az-b').height).toBeLessThan(group('az-c').y)
    expect(inside(node('igw'), group('vpc'))).toEqual([])
    expect(inside(node('internet'), group('vpc'))).not.toEqual([])
  })

  it('관문 5: 모든 rect가 viewBox 안에 있다', () => {
    render(<NatCountDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(12)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
  })

  it('관문 6: 노드 라벨(10)은 여백 12를 남기고, 그룹 라벨·서브넷 곁말(9)은 자기 가용 영역 안에 들어간다', () => {
    render(<NatCountDiagram />)

    for (const id of nodeIds) {
      const el = diagram().querySelector(`[data-node="${id}"]`)!
      const label = el.querySelector('text')!
      expect(label).toHaveTextContent(diagramText.nodes[id])
      expect(label).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label.textContent!, 10) + 12, label.textContent!).toBeLessThanOrEqual(readBox(el.querySelector('rect')!).width)
    }
    for (const id of ['vpc', 'az-a', 'az-b', 'az-c']) {
      const label = diagram().querySelector(`[data-group-label="${id}"]`)!
      expect(label.textContent).toBe(diagramText.groups![id])
      expect(label.closest('[font-size]')).toHaveAttribute('font-size', '9')
      const box = group(id)
      expect(Number(label.getAttribute('x')) + estimateTextWidth(label.textContent!, 9)).toBeLessThanOrEqual(box.x + box.width)
    }
    const subnetNotes = diagram().querySelectorAll('[data-subnet-note]')
    expect(subnetNotes).toHaveLength(6)
    for (const note of subnetNotes) {
      const az = group(`az-${note.getAttribute('data-az')}`)
      expect(note.closest('[font-size]')).toHaveAttribute('font-size', '9')
      expect(note.textContent).toBe(diagramText.notes![note.getAttribute('data-subnet-note')!])
      expect(Number(note.getAttribute('x')) + estimateTextWidth(note.textContent!, 9)).toBeLessThanOrEqual(az.x + az.width)
      expect(Number(note.getAttribute('y'))).toBeGreaterThan(az.y)
      expect(Number(note.getAttribute('y'))).toBeLessThan(az.y + az.height)
    }
  })

  it('관문 7: viewBox 폭은 280이고 모바일 여백 보정과 좌측 정렬을 유지한다', () => {
    render(<NatCountDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it.each(['전체', '프로덕션', '개발', '프로덕션 · AZ A 장애', '개발 · AZ A 장애'])('%s: 어떤 요소에도 빨강 계열 색을 쓰지 않는다', async (label) => {
    const { container } = render(<NatCountDiagram />)
    await select(label)

    for (const el of container.querySelectorAll('svg *')) {
      for (const attr of ['fill', 'stroke', 'class']) {
        const value = (el.getAttribute(attr) ?? '').toLowerCase()
        expect(value, `${el.tagName} ${attr}`).not.toMatch(/red|#ef4444/)
      }
    }
  })

  it('색은 NAT·EC2에 서브넷 자원, 인터넷·인터넷 게이트웨이에 무채색을 쓴다', () => {
    render(<NatCountDiagram />)
    const stroke = (id: string) => diagram().querySelector(`[data-node="${id}"] rect`)!.getAttribute('class')

    for (const id of ['internet', 'igw']) expect(stroke(id)).toContain('stroke-disabled')
    for (const az of ['a', 'b', 'c']) {
      expect(stroke(`nat-${az}`)).toContain('stroke-diagram-resource')
      expect(stroke(`ec2-${az}`)).toContain('stroke-diagram-resource')
    }
  })

  it('근거 개념을 적고 환경별 NAT 수 개념 본문 뒤에 붙는다', () => {
    expect(diagramText.sources).toEqual([conceptId])
    expect(diagramsByConceptId[conceptId]).toBe(NatCountDiagram)

    const concept = topics.find(({ id }) => id === 'vpc-networking')!.concepts.find(({ id }) => id === conceptId)!
    render(<ConceptList concepts={[concept]} headingLevel={2} />)
    const figure = screen.getByRole('figure', { name: diagramText.label })
    expect(figure.previousElementSibling).toHaveTextContent(concept.paragraphs[concept.paragraphs.length - 1])
    expect(within(figure).queryByRole('heading')).toBeNull()
  })
})
