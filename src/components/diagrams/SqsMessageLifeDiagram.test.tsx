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
const routes = [
  { label: '정상 처리', nodes: ['producer', 'waiting', 'hidden', 'consumer', 'deleted'], paths: ['enqueue', 'take', 'hide', 'delete'] },
  { label: '처리가 늦을 때', nodes: ['waiting', 'hidden', 'consumer'], paths: ['take', 'hide', 'reappear'] },
  { label: '계속 실패할 때', nodes: ['waiting', 'hidden', 'consumer', 'dlq'], paths: ['take', 'hide', 'reappear', 'to-dlq'] },
  { label: '아무도 안 꺼낼 때', nodes: ['producer', 'waiting', 'expired'], paths: ['enqueue', 'expire'] },
]
const endpoints: Record<string, [string, string]> = {
  enqueue: ['producer', 'waiting'], take: ['waiting', 'consumer'], hide: ['waiting', 'hidden'],
  delete: ['consumer', 'deleted'], reappear: ['hidden', 'waiting'], 'to-dlq': ['waiting', 'dlq'], expire: ['waiting', 'expired'],
}

function diagram() {
  return screen.getByRole('img', { name: 'SQS 메시지의 자리와 이동' })
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

// 경로·노드 검사기가 보지 않는 경로끼리의 겹침과 화살표의 연결 대상을 함께 확인한다.
function points(path: Element) {
  let x = 0
  let y = 0
  const result = []
  for (const [, command, first, second] of path.getAttribute('d')!.matchAll(/([MHV])\s*(\d+)(?:\s+(\d+))?/g)) {
    if (command === 'M') { x = Number(first); y = Number(second) }
    else if (command === 'H') x = Number(first)
    else y = Number(first)
    result.push({ x, y })
  }
  return result
}

function segments(path: Element) {
  const vertices = points(path)
  return vertices.slice(1).map((to, i) => ({
    x1: Math.min(vertices[i].x, to.x), x2: Math.max(vertices[i].x, to.x),
    y1: Math.min(vertices[i].y, to.y), y2: Math.max(vertices[i].y, to.y),
  }))
}

describe('SqsMessageLifeDiagram', () => {
  it('처음에는 노드 7개가 모두 선명하고 경로는 없다', () => {
    render(<SqsMessageLifeDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(nodes).toHaveLength(7)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each(routes)('$label에서는 지정한 노드와 경로만 표시하고 큐 경계는 유지한다', async ({ label, nodes, paths }) => {
    render(<SqsMessageLifeDiagram />)
    const queue = diagram().querySelector('[data-group="queue"]')!
    const before = readBox(queue)
    await selectScenario(label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    const shownPaths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(shownPaths.map((path) => path.getAttribute('data-path'))).toEqual(paths)
    for (const path of shownPaths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
      expect(path).toHaveClass('stroke-title')
      const vertices = points(path)
      const [from, to] = endpoints[path.getAttribute('data-path')!]
      for (const [id, point] of [[from, vertices[0]], [to, vertices[vertices.length - 1]]] as const) {
        const box = readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
        const onHorizontal = (point.y === box.y || point.y === box.y + box.height) && point.x >= box.x && point.x <= box.x + box.width
        const onVertical = (point.x === box.x || point.x === box.x + box.width) && point.y >= box.y && point.y <= box.y + box.height
        expect(onHorizontal || onVertical, `${path.getAttribute('data-path')}의 ${id} 연결`).toBe(true)
      }
    }
    expect(readBox(queue)).toEqual(before)
    expect(queue.closest('[opacity]')).toBeNull()
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('전체로 돌아오면 흐린 노드와 보이는 경로가 없고 기본 캡션이 돌아온다', async () => {
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

  it.each(routes)('$label 캡션은 20자를 넘고 선택에 따라 바뀐다', async ({ label }) => {
    const { container } = render(<SqsMessageLifeDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario(label)

    expect(caption.textContent).not.toBe(idle)
    expect(caption.textContent!.length).toBeGreaterThan(20)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('처리 지연 캡션에 가시성 타임아웃의 기준과 Lambda 함수 타임아웃을 남긴다', async () => {
    const { container } = render(<SqsMessageLifeDiagram />)
    await selectScenario('처리가 늦을 때')
    const caption = container.querySelector('figcaption')!

    expect(caption).toHaveTextContent('가시성 타임아웃')
    expect(caption).toHaveTextContent('최대 처리 시간')
    expect(caption).toHaveTextContent(/Lambda.*함수 타임아웃/)
    expect(caption).toHaveTextContent(/삭제 전.*만료.*재처리/)
    expect(caption).toHaveTextContent(/가시성 타임아웃 ≥ 최대 처리 시간/)
  })

  it('보존 기간 캡션은 최대 14일과 48시간 자동 삭제 설정을 설명한다', async () => {
    const { container } = render(<SqsMessageLifeDiagram />)
    await selectScenario('아무도 안 꺼낼 때')
    const caption = container.querySelector('figcaption')!

    expect(caption).toHaveTextContent(/최대 14일/)
    expect(caption).toHaveTextContent(/48시간.*설정/)
  })

  it('관문 5: 노드 7개와 큐 경계의 rect가 모두 viewBox 안에 있다', () => {
    render(<SqsMessageLifeDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(8)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('관문 6: 노드 라벨 7개가 글자 크기 10과 여백 12로 상자 안에 들어간다', () => {
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

  it('점선 큐 안에는 대기·숨김 메시지만 두고 지정한 세 노드만 파랑으로 표시한다', () => {
    render(<SqsMessageLifeDiagram />)
    const group = diagram().querySelector('[data-group="queue"]')!
    const queue = readBox(group)
    const boxes = Array.from(diagram().querySelectorAll('[data-node] rect'), readBox)
    const outside = boxesOutsideViewBox(boxes, [queue.x, queue.y, queue.width, queue.height])

    expect(group).toHaveAttribute('stroke-dasharray', '6 4')
    expect(screen.getByText('SQS 큐')).toBeInTheDocument()
    expect(outside.map((box) => box.id).sort()).toEqual(['producer', 'consumer', 'deleted', 'dlq', 'expired'].sort())
    for (const box of outside) {
      if (box.id === 'producer') expect(box.y + box.height).toBeLessThan(queue.y)
      else expect(box.y).toBeGreaterThan(queue.y + queue.height)
    }
    for (const node of diagram().querySelectorAll('[data-node]')) {
      const managed = ['waiting', 'hidden', 'dlq'].includes(node.getAttribute('data-node')!)
      expect(node.querySelector('rect')).toHaveClass(managed ? 'stroke-diagram-managed' : 'stroke-disabled')
    }
    expect(diagram().querySelector('[class*="diagram-resource"]')).toBeNull()
  })

  it.each(routes)('$label에서 동시에 보이는 경로끼리 교차하거나 겹치지 않는다', async ({ label }) => {
    render(<SqsMessageLifeDiagram />)
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

  it('숨김·재노출 경로는 큐 안에 머물고 take와 서로 다른 연결점을 쓴다', async () => {
    render(<SqsMessageLifeDiagram />)
    await selectScenario('처리가 늦을 때')
    const queue = readBox(diagram().querySelector('[data-group="queue"]')!)
    for (const id of ['hide', 'reappear']) {
      for (const point of points(diagram().querySelector(`[data-path="${id}"]`)!)) {
        expect(point.x).toBeGreaterThan(queue.x)
        expect(point.x).toBeLessThan(queue.x + queue.width)
        expect(point.y).toBeGreaterThan(queue.y)
        expect(point.y).toBeLessThan(queue.y + queue.height)
      }
    }
  })

  it.each([2, 4] as const)('공유 본문의 h%s 화면에서 가시성 타임아웃 개념 뒤에 도식 하나를 붙인다', (headingLevel) => {
    render(<ConceptList headingLevel={headingLevel} concepts={[
      { id: 'sqs-sns-eventbridge.dead-letter-queue', name: '데드레터 큐', summary: '요약', paragraphs: ['실패 처리 본문'] },
      { id: 'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time', name: '가시성 타임아웃과 소비자의 처리 시간', summary: '요약', paragraphs: ['가시성 타임아웃 본문'] },
    ]} />)
    const figure = screen.getByRole('figure', { name: 'SQS 메시지 흐름 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', 'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time')
    expect(figure.previousElementSibling).toHaveTextContent('가시성 타임아웃 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(figure.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull()
  })
})
