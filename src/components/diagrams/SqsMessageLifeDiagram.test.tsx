import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { SqsMessageLifeDiagram } from './SqsMessageLifeDiagram'

const labels = {
  producer: '생산자', waiting: '대기 중인 메시지', hidden: '숨겨진 메시지', consumer: '소비자',
  deleted: '처리 후 삭제', dlq: '데드레터 큐', expired: '보존 기간 만료',
}
const edges = [
  { id: 'enqueue', from: 'producer', to: 'waiting' },
  { id: 'take', from: 'waiting', to: 'consumer' },
  { id: 'hide', from: 'waiting', to: 'hidden' },
  { id: 'delete', from: 'consumer', to: 'deleted' },
  { id: 'reappear', from: 'hidden', to: 'waiting' },
  { id: 'to-dlq', from: 'waiting', to: 'dlq' },
  { id: 'expire', from: 'waiting', to: 'expired' },
]
const scenarios = [
  {
    label: '정상 처리', nodes: ['producer', 'waiting', 'hidden', 'consumer', 'deleted'],
    paths: ['enqueue', 'take', 'hide', 'delete'], facts: [/가져.*숨/, /처리.*삭제.*사라/],
  },
  {
    label: '처리가 늦을 때', nodes: ['waiting', 'hidden', 'consumer'],
    paths: ['take', 'hide', 'reappear'], facts: [/삭제 전.*만료.*재처리/, /가시성 타임아웃.*≥.*최대 처리 시간/, /Lambda.*함수 타임아웃/],
  },
  {
    label: '계속 실패할 때', nodes: ['waiting', 'hidden', 'consumer', 'dlq'],
    paths: ['take', 'hide', 'reappear', 'to-dlq'], facts: [/실패.*남아.*재시도/, /계속 실패.*따로.*뒤.*막히지/],
  },
  {
    label: '아무도 안 꺼낼 때', nodes: ['producer', 'waiting', 'expired'],
    paths: ['enqueue', 'expire'], facts: [/최대 14일/, /안 꺼낸 메시지/, /48시간.*삭제.*설정/],
  },
]

function diagram() {
  return screen.getByRole('img', { name: 'SQS 메시지의 이동' })
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

function points(path: Element) {
  let x = 0
  let y = 0
  return Array.from(path.getAttribute('d')!.matchAll(/([MHV])\s*(\d+)(?:\s+(\d+))?/g), ([, command, first, second]) => {
    if (command === 'M') {
      x = Number(first)
      y = Number(second)
    } else if (command === 'H') {
      x = Number(first)
    } else {
      y = Number(first)
    }
    return { x, y }
  })
}

// 공용 교차 검사기가 보지 않는, 동시에 켜진 경로끼리의 교차·겹침을 검사한다.
function segments(path: Element) {
  const vertices = points(path)
  return vertices.slice(1).map((to, index) => {
    const from = vertices[index]
    return { x1: Math.min(from.x, to.x), x2: Math.max(from.x, to.x), y1: Math.min(from.y, to.y), y2: Math.max(from.y, to.y) }
  })
}

describe('SqsMessageLifeDiagram', () => {
  it('처음에는 지정된 노드 7개가 모두 선명하고 경로는 없다', () => {
    render(<SqsMessageLifeDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(7)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each(scenarios)('$label에서는 해당 노드와 경로만 선명하고 큐 경계는 흐려지지 않는다', async ({ label, nodes, paths }) => {
    render(<SqsMessageLifeDiagram />)
    await selectScenario(label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    const visiblePaths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(visiblePaths.map((path) => path.getAttribute('data-path'))).toEqual(paths)
    for (const path of visiblePaths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveClass('stroke-title')
      expect(path).toHaveAttribute('marker-end')
    }
    const queue = diagram().querySelector('[data-group="queue"]')!
    expect(queue).toBeVisible()
    expect(queue.closest('[opacity]')).toBeNull()
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('전체를 누르면 흐린 노드와 보이는 경로가 없고 기본 캡션이 돌아온다', async () => {
    const { container } = render(<SqsMessageLifeDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario('계속 실패할 때')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(4)
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(caption.textContent).toBe(idle)
  })

  it.each(scenarios)('$label 캡션은 20자를 넘고 근거의 조건·수치를 담는다', async ({ label, facts }) => {
    const { container } = render(<SqsMessageLifeDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario(label)

    expect(caption.textContent).not.toBe(idle)
    expect(caption.textContent!.length).toBeGreaterThan(20)
    for (const fact of facts) expect(caption).toHaveTextContent(fact)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('관문 5: 노드 7개와 큐 경계의 rect가 모두 viewBox 안에 있다', () => {
    render(<SqsMessageLifeDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(8)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('관문 6: 축약하지 않은 라벨 7개가 글자 크기 10과 여백 12로 노드 안에 들어간다', () => {
    render(<SqsMessageLifeDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(readBox(node.querySelector('rect')!).width)
    }
  })

  it('관문 7: viewBox 폭은 정확히 280이고 공통 모바일 래퍼 규약을 지킨다', () => {
    render(<SqsMessageLifeDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('점선 큐 안에는 대기·숨김만 있고 생산자는 위, 나머지는 아래에 있다', () => {
    render(<SqsMessageLifeDiagram />)
    const group = diagram().querySelector('[data-group="queue"]')!
    const queue = readBox(group)
    expect(diagram().querySelectorAll('[data-group]')).toHaveLength(1)
    expect(group).toHaveAttribute('stroke-dasharray')
    expect(screen.getByText('SQS 큐')).toHaveAttribute('font-size', '9')

    for (const node of diagram().querySelectorAll('[data-node]')) {
      const box = readBox(node.querySelector('rect')!)
      if (['waiting', 'hidden'].includes(box.id)) {
        expect(boxesOutsideViewBox([box], [queue.x, queue.y, queue.width, queue.height])).toEqual([])
      } else if (box.id === 'producer') {
        expect(box.y + box.height).toBeLessThan(queue.y)
      } else {
        expect(box.y).toBeGreaterThan(queue.y + queue.height)
      }
      expect(node.querySelector('rect')).toHaveClass(['waiting', 'hidden', 'dlq'].includes(box.id) ? 'stroke-diagram-managed' : 'stroke-disabled')
    }
    expect(diagram().querySelector('[class*="diagram-resource"]')).toBeNull()
  })

  it.each(scenarios)('$label의 경로가 지정된 두 노드에 연결되고 서로 교차하거나 겹치지 않는다', async ({ label }) => {
    render(<SqsMessageLifeDiagram />)
    await selectScenario(label)
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))

    for (const path of paths) {
      const edge = edges.find(({ id }) => id === path.getAttribute('data-path'))!
      const vertices = points(path)
      for (const [id, point] of [[edge.from, vertices[0]], [edge.to, vertices[vertices.length - 1]]] as const) {
        const box = readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
        const onVerticalEdge = (point.x === box.x || point.x === box.x + box.width) && point.y >= box.y && point.y <= box.y + box.height
        const onHorizontalEdge = (point.y === box.y || point.y === box.y + box.height) && point.x >= box.x && point.x <= box.x + box.width
        expect(onVerticalEdge || onHorizontalEdge, edge.id).toBe(true)
      }
    }
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

  it('재등장 경로는 큐 안에서 대기 메시지로 돌아온다', async () => {
    render(<SqsMessageLifeDiagram />)
    await selectScenario('처리가 늦을 때')
    const queue = readBox(diagram().querySelector('[data-group="queue"]')!)
    const route = diagram().querySelector('[data-path="reappear"]')!
    for (const point of points(route)) {
      expect(point.x).toBeGreaterThan(queue.x)
      expect(point.x).toBeLessThan(queue.x + queue.width)
      expect(point.y).toBeGreaterThan(queue.y)
      expect(point.y).toBeLessThan(queue.y + queue.height)
    }
  })

  it.each([2, 4] as const)('공유 본문의 h%s 화면에서 가시성 타임아웃 개념 뒤에만 도식을 붙인다', (headingLevel) => {
    render(<ConceptList headingLevel={headingLevel} concepts={[
      { id: 'sqs-sns-eventbridge.dead-letter-queue', name: '데드레터 큐', summary: '요약', paragraphs: ['데드레터 큐 본문'] },
      { id: 'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time', name: '가시성 타임아웃과 소비자의 처리 시간', summary: '요약', paragraphs: ['가시성 타임아웃 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: 'SQS 메시지 이동 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time')
    expect(figure.previousElementSibling).toHaveTextContent('가시성 타임아웃 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(figure.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull()
  })
})
