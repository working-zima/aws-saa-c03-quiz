import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { MessagingShapesDiagram } from './MessagingShapesDiagram'

const labels = {
  app: '애플리케이션', 'aws-service': 'AWS 서비스', saas: '외부 SaaS',
  'legacy-app': '기존 온프레미스 앱', queue: 'SQS 큐', topic: 'SNS 주제',
  bus: 'EventBridge 이벤트 버스', broker: 'Amazon MQ 브로커', ses: 'SES',
  worker: '워커 하나', subscribers: '구독자 여럿', targets: '규칙에 맞는 대상',
  'legacy-consumer': '기존 앱', inbox: '이메일 수신함',
}

function diagram() {
  return screen.getByRole('img', { name: '메시징 전달 모양' })
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

describe('MessagingShapesDiagram', () => {
  it('처음에는 지정된 노드 14개가 모두 선명하고 경로는 없다', () => {
    render(<MessagingShapesDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(14)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('SNS를 고르면 app·topic·subscribers만 선명하고 그룹은 흐려지지 않는다', async () => {
    render(<MessagingShapesDiagram />)
    await selectScenario('SNS')

    for (const node of diagram().querySelectorAll('[data-node]')) {
      const active = ['app', 'topic', 'subscribers'].includes(node.getAttribute('data-node') ?? '')
      expect(node).toHaveAttribute('opacity', active ? '1' : '0.25')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
  })

  it.each([
    ['SQS', /메시지마다 한 소비자.*느려.*쌓아.*내구성 버퍼/],
    ['SNS', /모든 구독자.*사본.*즉시.*버퍼.*않/],
    ['EventBridge', /규칙.*이벤트.*순서.*24시간.*않/],
    ['Amazon MQ', /표준 프로토콜.*메시징 방식.*바꾸지/],
    ['SES', /SNS.*알림.*이메일.*목적.*SES/],
  ])('%s 캡션은 선택에 따라 바뀌며 20자를 넘어 조건과 제약을 설명한다', async (label, content) => {
    const { container } = render(<MessagingShapesDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario(label)

    expect(caption.textContent).not.toBe(idle)
    expect(caption.textContent!.length).toBeGreaterThan(20)
    expect(caption).toHaveTextContent(content)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('전체로 돌아오면 흐린 노드와 보이는 경로가 사라지고 기본 캡션이 돌아온다', async () => {
    const { container } = render(<MessagingShapesDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario('SNS')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(2)
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(caption.textContent).toBe(idle)
  })

  it.each([
    ['SQS', ['app', 'queue', 'worker'], ['app-queue', 'queue-worker']],
    ['SNS', ['app', 'topic', 'subscribers'], ['app-topic', 'topic-subscribers']],
    ['EventBridge', ['aws-service', 'saas', 'bus', 'targets'], ['aws-service-bus', 'saas-bus', 'bus-targets']],
    ['Amazon MQ', ['legacy-app', 'broker', 'legacy-consumer'], ['legacy-app-broker', 'broker-legacy-consumer']],
    ['SES', ['app', 'ses', 'inbox'], ['app-ses', 'ses-inbox']],
  ])('%s는 선명한 노드마다 경로가 닿고 지정한 경로만 그린다', async (label, route, expectedPaths) => {
    render(<MessagingShapesDiagram />)
    await selectScenario(label)

    const nodes = Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (node) => node.getAttribute('data-node'))
    expect(nodes.sort()).toEqual([...route].sort())
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(expectedPaths)
    for (const path of paths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
      expect(path).toHaveClass('stroke-title')
    }
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('관문 5: 노드와 그룹의 모든 rect가 viewBox 안에 있다', () => {
    render(<MessagingShapesDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(17)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('관문 6: 축약하지 않은 라벨 14개가 글자 크기 10과 여백 12로 노드 안에 들어간다', () => {
    render(<MessagingShapesDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const box = readBox(node.querySelector('rect')!)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
    }
    expect(readBox(diagram().querySelector('[data-node="bus"] rect')!).width).toBeGreaterThan(200)
  })

  it('관문 7: viewBox 폭이 280이고 기존 모바일 래퍼 규약을 따른다', () => {
    render(<MessagingShapesDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('색 없이도 보내는 쪽 → AWS 전달 장치 → 받는 쪽 세 단의 배치가 성립한다', () => {
    render(<MessagingShapesDiagram />)
    const groups = [
      { id: 'senders', label: '보내는 쪽', nodes: ['app', 'aws-service', 'saas', 'legacy-app'] },
      { id: 'managed', label: 'AWS 전달 장치', nodes: ['queue', 'topic', 'bus', 'broker', 'ses'] },
      { id: 'receivers', label: '받는 쪽', nodes: ['worker', 'subscribers', 'targets', 'legacy-consumer', 'inbox'] },
    ]
    let previousBottom = 0
    for (const group of groups) {
      const box = readBox(diagram().querySelector(`[data-group="${group.id}"]`)!)
      expect(box.y).toBeGreaterThanOrEqual(previousBottom)
      previousBottom = box.y + box.height
      expect(screen.getByText(group.label)).toBeInTheDocument()
      const nodes = group.nodes.map((id) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!))
      expect(boxesOutsideViewBox(nodes, [box.x, box.y, box.width, box.height])).toEqual([])
    }
    for (const node of diagram().querySelectorAll('[data-node]')) {
      const managed = groups[1].nodes.includes(node.getAttribute('data-node')!)
      expect(node.querySelector('rect')).toHaveClass(managed ? 'stroke-diagram-managed' : 'stroke-disabled')
    }
    expect(diagram().querySelector('[class*="diagram-resource"]')).toBeNull()
  })

  it.each([2, 4] as const)('공유 본문의 h%s 화면에서 SQS 본문 바로 뒤에 도식 하나를 표시한다', (headingLevel) => {
    render(<ConceptList headingLevel={headingLevel} concepts={[
      { id: 'sqs-sns-eventbridge.sqs', name: 'SQS', summary: '요약', paragraphs: ['SQS 본문'] },
      { id: 'sqs-sns-eventbridge.sns', name: 'SNS', summary: '요약', paragraphs: ['SNS 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: '메시징 전달 모양 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'sqs-sns-eventbridge.sqs')
    expect(figure.previousElementSibling).toHaveTextContent('SQS 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(figure.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull()
  })
})
