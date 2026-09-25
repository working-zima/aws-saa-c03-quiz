import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { SnsFanoutDiagram } from './SnsFanoutDiagram'

const labels = {
  publisher: '발행하는 쪽', topic: 'SNS 주제', 'shared-queue': '공유 큐 하나', bus: '이벤트 버스',
  'queue-a': '큐 A', 'queue-b': '큐 B', 'queue-c': '큐 C',
  'consumer-a': '소비자 A', 'consumer-b': '소비자 B', 'consumer-c': '소비자 C',
}
const queues = ['queue-a', 'queue-b', 'queue-c']
const consumers = ['consumer-a', 'consumer-b', 'consumer-c']
const routes = [
  {
    label: '소비자마다 큐', nodes: ['publisher', 'topic', ...queues, ...consumers],
    edges: [['publisher', 'topic'], ...queues.map((queue) => ['topic', queue]), ...queues.map((queue, i) => [queue, consumers[i]])],
  },
  {
    label: '큐 하나를 셋이 폴링', nodes: ['publisher', 'shared-queue', ...consumers],
    edges: [['publisher', 'shared-queue'], ...consumers.map((consumer) => ['shared-queue', consumer])],
  },
  {
    label: '버스가 직접 호출', nodes: ['publisher', 'bus', ...consumers],
    edges: [['publisher', 'bus'], ...consumers.map((consumer) => ['bus', consumer])],
  },
]

function diagram() {
  return screen.getByRole('img', { name: 'SNS 팬아웃 구성 비교' })
}

async function selectScenario(label: string) {
  await act(async () => {
    await userEvent.click(screen.getByRole('button', { name: label }))
  })
}

function readBox(rect: Element) {
  return {
    id: rect.parentElement?.getAttribute('data-node') ?? rect.getAttribute('data-group') ?? '',
    x: Number(rect.getAttribute('x')),
    y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')),
    height: Number(rect.getAttribute('height')),
  }
}

// 교차 검사기는 노드 내부 통과만 본다. 동시에 보이는 직교 경로끼리의 겹침도 검사한다.
function segments(path: Element) {
  let x = 0
  let y = 0
  const result = []
  for (const [, command, first, second] of path.getAttribute('d')!.matchAll(/([MHV])\s*(\d+)(?:\s+(\d+))?/g)) {
    if (command === 'M') {
      x = Number(first)
      y = Number(second)
      continue
    }
    const nextX = command === 'H' ? Number(first) : x
    const nextY = command === 'V' ? Number(first) : y
    result.push({ x1: Math.min(x, nextX), x2: Math.max(x, nextX), y1: Math.min(y, nextY), y2: Math.max(y, nextY) })
    x = nextX
    y = nextY
  }
  return result
}

describe('SnsFanoutDiagram', () => {
  it('처음에는 지정된 노드 10개가 모두 선명하고 경로는 없다', () => {
    render(<SnsFanoutDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(10)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each(routes)('$label에서는 해당 노드와 경로만 선명하게 표시한다', async ({ label, nodes, edges }) => {
    render(<SnsFanoutDiagram />)
    await selectScenario(label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(edges.map(([from, to]) => `${from}-${to}`))
    for (const path of paths) {
      expect(path.getAttribute('d')).toMatch(/^M/)
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
      expect(path).toHaveClass('stroke-title')
    }
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each(['큐 하나를 셋이 폴링', '버스가 직접 호출'])('%s로 바꾸면 큐 셋이 모두 흐려져도 소비자별 큐 단은 같은 자리에 남는다', async (label) => {
    render(<SnsFanoutDiagram />)
    await selectScenario('소비자마다 큐')
    const group = diagram().querySelector('[data-group="queues"]')!
    const before = readBox(group)
    for (const id of queues) expect(diagram().querySelector(`[data-node="${id}"]`)).toHaveAttribute('opacity', '1')
    await selectScenario(label)

    for (const id of queues) expect(diagram().querySelector(`[data-node="${id}"]`)).toHaveAttribute('opacity', '0.25')
    expect(readBox(group)).toEqual(before)
    expect(group).toBeVisible()
    for (const box of diagram().querySelectorAll('[data-group]')) expect(box.closest('[opacity]')).toBeNull()
  })

  it('전체를 누르면 흐린 노드와 보이는 경로가 없고 기본 캡션이 돌아온다', async () => {
    const { container } = render(<SnsFanoutDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario('소비자마다 큐')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(7)
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(caption.textContent).toBe(idle)
  })

  it.each([
    ['소비자마다 큐', /큐마다.*복제.*모두.*전부.*소비자 추가.*발행자.*기존 소비자.*그대로/],
    ['큐 하나를 셋이 폴링', /나눠.*각자.*일부.*모두.*전부.*맞지 않/],
    ['버스가 직접 호출', /소비자별 내구성 버퍼 없이.*여러 대상.*트래픽 급증.*흡수.*못/],
  ])('%s 캡션은 20자를 넘으며 구성이 요구에 맞거나 어긋나는 이유를 설명한다', async (label, content) => {
    const { container } = render(<SnsFanoutDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario(label)

    expect(caption.textContent).not.toBe(idle)
    expect(caption.textContent!.length).toBeGreaterThan(20)
    expect(caption).toHaveTextContent(content)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('관문 5: 노드 10개와 그룹 4개의 rect가 모두 viewBox 안에 있다', () => {
    render(<SnsFanoutDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(14)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('관문 6: 축약하지 않은 라벨 10개가 글자 크기 10과 여백 12로 노드 안에 들어간다', () => {
    render(<SnsFanoutDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(readBox(node.querySelector('rect')!).width)
    }
  })

  it('관문 7: viewBox 폭은 정확히 280이고 공통 모바일 래퍼 규약을 지킨다', () => {
    render(<SnsFanoutDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('네 단을 위치로 구분하고 큐·소비자는 각각 3열이며 AWS 노드만 파랑이다', () => {
    render(<SnsFanoutDiagram />)
    const groups = [
      { id: 'publishing', label: '발행', nodes: ['publisher'] },
      { id: 'delivery', label: '전달 장치', nodes: ['topic', 'shared-queue', 'bus'] },
      { id: 'queues', label: '소비자별 큐', nodes: queues },
      { id: 'consumers', label: '소비자', nodes: consumers },
    ]
    let previousBottom = 0
    for (const group of groups) {
      const box = readBox(diagram().querySelector(`[data-group="${group.id}"]`)!)
      expect(box.y).toBeGreaterThanOrEqual(previousBottom)
      previousBottom = box.y + box.height
      expect(screen.getByText(group.label)).toBeInTheDocument()
      const nodes = group.nodes.map((id) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!))
      expect(boxesOutsideViewBox(nodes, [box.x, box.y, box.width, box.height])).toEqual([])
      if (group.id === 'queues' || group.id === 'consumers') {
        expect(new Set(nodes.map((node) => node.y)).size).toBe(1)
        expect(new Set(nodes.map((node) => node.x)).size).toBe(3)
      }
    }
    for (const node of diagram().querySelectorAll('[data-node]')) {
      const neutral = ['publisher', ...consumers].includes(node.getAttribute('data-node')!)
      expect(node.querySelector('rect')).toHaveClass(neutral ? 'stroke-disabled' : 'stroke-diagram-managed')
    }
    expect(diagram().querySelector('[class*="diagram-resource"]')).toBeNull()
  })

  it.each(routes)('$label의 경로들이 서로 교차하거나 겹치지 않는다', async ({ label }) => {
    render(<SnsFanoutDiagram />)
    await selectScenario(label)
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    for (let i = 0; i < paths.length; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        for (const a of segments(paths[i])) {
          for (const b of segments(paths[j])) {
            const meet = Math.max(a.x1, b.x1) <= Math.min(a.x2, b.x2) && Math.max(a.y1, b.y1) <= Math.min(a.y2, b.y2)
            expect(meet, `${paths[i].getAttribute('data-path')} / ${paths[j].getAttribute('data-path')}`).toBe(false)
          }
        }
      }
    }
  })

  it.each([2, 4] as const)('공유 본문의 h%s 화면에서 팬아웃 개념 바로 뒤에 도식 하나를 붙인다', (headingLevel) => {
    render(<ConceptList headingLevel={headingLevel} concepts={[
      { id: 'sqs-sns-eventbridge.sns', name: 'SNS', summary: '요약', paragraphs: ['SNS 본문'] },
      { id: 'sqs-sns-eventbridge.sns-sqs-fanout-per-consumer', name: '소비자마다 큐를 두는 팬아웃', summary: '요약', paragraphs: ['팬아웃 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: 'SNS 팬아웃 구성 비교 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'sqs-sns-eventbridge.sns-sqs-fanout-per-consumer')
    expect(figure.previousElementSibling).toHaveTextContent('팬아웃 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(figure.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull()
  })
})
