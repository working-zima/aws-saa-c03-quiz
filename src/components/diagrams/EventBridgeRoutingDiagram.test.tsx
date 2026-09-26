import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { EventBridgeRoutingDiagram } from './EventBridgeRoutingDiagram'

const labels = {
  'aws-service': 'AWS 서비스', 'my-app': '내 애플리케이션', 'partner-saas': '외부 SaaS',
  'default-bus': '기본 이벤트 버스', 'custom-bus': '사용자 지정 이벤트 버스', 'partner-bus': '파트너 이벤트 버스',
  'pattern-rule': '이벤트 패턴 규칙', 'schedule-rule': '일정 규칙', 'pipe-source': '큐·스트림', pipe: 'EventBridge 파이프',
  lambda: 'Lambda 함수', queue: 'SQS 큐', sfn: 'Step Functions', 'api-destination': 'API 대상',
  'external-api': '외부 HTTP API', 'vpc-lambda': 'VPC 연결 Lambda', 'private-api': '사설 API',
}

function diagram() {
  return screen.getByRole('img', { name: 'EventBridge 이벤트 경로' })
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

describe('EventBridgeRoutingDiagram', () => {
  it('처음에는 지정된 노드 17개가 모두 선명하고 경로는 없다', () => {
    render(<EventBridgeRoutingDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(17)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('VPC 안 API를 고르면 패턴 규칙·VPC 연결 Lambda·사설 API만 선명하고 그룹은 흐려지지 않는다', async () => {
    render(<EventBridgeRoutingDiagram />)
    await selectScenario('VPC 안 API')

    for (const node of diagram().querySelectorAll('[data-node]')) {
      const active = ['pattern-rule', 'vpc-lambda', 'private-api'].includes(node.getAttribute('data-node') ?? '')
      expect(node).toHaveAttribute('opacity', active ? '1' : '0.25')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
  })

  it('일정은 버스 세 종류를 모두 흐리게 두고 버스를 거치지 않는다', async () => {
    render(<EventBridgeRoutingDiagram />)
    await selectScenario('일정')

    for (const id of ['default-bus', 'custom-bus', 'partner-bus']) {
      expect(diagram().querySelector(`[data-node="${id}"]`)).toHaveAttribute('opacity', '0.25')
    }
    expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path'))).toEqual(['schedule-rule-lambda'])
  })

  it('전체로 돌아오면 모든 노드가 선명해지고 경로가 숨으며 기본 캡션이 돌아온다', async () => {
    const { container } = render(<EventBridgeRoutingDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario('VPC 안 API')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(2)
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(caption.textContent).toBe(idle)
  })

  it.each([
    ['AWS 서비스 변경', ['aws-service', 'default-bus', 'pattern-rule', 'lambda']],
    ['내 앱 이벤트', ['my-app', 'custom-bus', 'pattern-rule', 'queue']],
    ['외부 SaaS', ['partner-saas', 'partner-bus', 'pattern-rule', 'lambda']],
    ['일정', ['schedule-rule', 'lambda']],
    ['외부 API로', ['pattern-rule', 'api-destination', 'external-api']],
    ['VPC 안 API', ['pattern-rule', 'vpc-lambda', 'private-api']],
    ['파이프(점 대 점)', ['pipe-source', 'pipe', 'sfn']],
  ])('%s는 지정된 노드와 경로만 표시한다', async (label, route) => {
    render(<EventBridgeRoutingDiagram />)
    await selectScenario(label)

    const activeNodes = Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (node) => node.getAttribute('data-node'))
    expect(activeNodes.sort()).toEqual([...route].sort())
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(route.slice(1).map((to, i) => `${route[i]}-${to}`))
    for (const path of paths) {
      expect(path.getAttribute('d')).toMatch(/^M/)
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
      expect(path).toHaveClass('stroke-title')
    }
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each([
    ['AWS 서비스 변경', /계정별.*기본 버스.*AWS.*생성·수정.*이벤트.*폴링 없이/],
    ['내 앱 이벤트', /앱.*사용자 지정 버스.*만들.*이벤트/],
    ['외부 SaaS', /파트너 버스.*외부 SaaS.*내 앱.*아니/],
    ['일정', /시각·주기.*즉시.*빈 확인.*유료.*한 주기/],
    ['외부 API로', /EventBridge.*인증.*OAuth.*중계.*불필요/],
    ['VPC 안 API', /인터넷.*비공개.*VPC.*함수.*공용.*어긋/],
    ['파이프(점 대 점)', /규칙.*여러 대상.*파이프.*일대일.*필터·변환.*함수 없이/],
  ])('%s 캡션은 20자를 넘어 조건과 제약을 설명한다', async (label, content) => {
    const { container } = render(<EventBridgeRoutingDiagram />)
    const caption = container.querySelector('figcaption')!
    const idle = caption.textContent
    await selectScenario(label)

    expect(caption.textContent).not.toBe(idle)
    expect(caption.textContent!.length).toBeGreaterThan(20)
    expect(caption).toHaveTextContent(content)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('관문 5: 노드와 VPC를 포함한 그룹의 모든 rect가 viewBox 안에 있다', () => {
    render(<EventBridgeRoutingDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(22)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('관문 6: 라벨 17개가 축약 없이 글자 크기 10과 여백 12로 들어가며 버스 셋과 파이프는 전체 폭이다', () => {
    render(<EventBridgeRoutingDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const box = readBox(node.querySelector('rect')!)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
    }
    const fullWidth = ['default-bus', 'custom-bus', 'partner-bus', 'pipe']
    for (const id of fullWidth) expect(readBox(diagram().querySelector(`[data-node="${id}"] rect`)!).width).toBeGreaterThan(200)
  })

  it('관문 7: viewBox 폭은 280이며 기존 모바일 래퍼 규약을 따른다', () => {
    render(<EventBridgeRoutingDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('네 단계와 대상 내부의 점선 VPC가 위치로 구분되고 VPC 안 노드만 청록이다', () => {
    render(<EventBridgeRoutingDiagram />)
    const groups = [
      { id: 'sources', label: '이벤트 소스', nodes: ['aws-service', 'my-app', 'partner-saas'] },
      { id: 'buses', label: '이벤트 버스', nodes: ['default-bus', 'custom-bus', 'partner-bus'] },
      { id: 'rules', label: '규칙', nodes: ['pattern-rule', 'schedule-rule', 'pipe-source', 'pipe'] },
      { id: 'targets', label: '대상', nodes: ['lambda', 'queue', 'sfn', 'api-destination', 'external-api', 'vpc-lambda', 'private-api'] },
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
    const vpc = diagram().querySelector('[data-group="vpc"]')!
    expect(vpc).toHaveAttribute('stroke-dasharray')
    expect(screen.getByText('VPC')).toBeInTheDocument()
    const vpcBox = readBox(vpc)
    const targets = readBox(diagram().querySelector('[data-group="targets"]')!)
    expect(boxesOutsideViewBox([vpcBox], [targets.x, targets.y, targets.width, targets.height])).toEqual([])
    const inside = ['vpc-lambda', 'private-api']
    const neutral = ['my-app', 'partner-saas', 'external-api']
    for (const node of diagram().querySelectorAll('[data-node]')) {
      const id = node.getAttribute('data-node')!
      const rect = node.querySelector('rect')!
      expect(rect).toHaveClass(inside.includes(id) ? 'stroke-diagram-resource' : neutral.includes(id) ? 'stroke-disabled' : 'stroke-diagram-managed')
      const box = readBox(rect)
      if (inside.includes(id)) {
        expect(boxesOutsideViewBox([box], [vpcBox.x, vpcBox.y, vpcBox.width, vpcBox.height])).toEqual([])
      } else {
        expect(box.y + box.height).toBeLessThanOrEqual(vpcBox.y)
      }
    }
  })

  it.each([2, 4] as const)('공유 본문의 h%s 화면에서 EventBridge 첫 개념 본문 뒤에 도식 하나를 붙인다', (headingLevel) => {
    render(<ConceptList headingLevel={headingLevel} concepts={[
      { id: 'sqs-sns-eventbridge.eventbridge', name: 'EventBridge', summary: '요약', paragraphs: ['EventBridge 본문'] },
      { id: 'sqs-sns-eventbridge.eventbridge-event-bus-types', name: '이벤트 버스', summary: '요약', paragraphs: ['버스 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: 'EventBridge 이벤트 경로 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'sqs-sns-eventbridge.eventbridge')
    expect(figure.previousElementSibling).toHaveTextContent('EventBridge 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(figure.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull()
  })
})
