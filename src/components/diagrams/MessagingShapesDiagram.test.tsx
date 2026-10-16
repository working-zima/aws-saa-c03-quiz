import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WIDE_DIAGRAM_QUERY } from '../../hooks/useWideDiagram'
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

  describe('가로형 (768px 이상)', () => {
    const scenarios = [
      { label: 'SQS', nodes: ['app', 'queue', 'worker'], paths: ['app-queue', 'queue-worker'], caption: /메시지마다 한 소비자.*느려.*쌓아.*내구성 버퍼/ },
      { label: 'SNS', nodes: ['app', 'topic', 'subscribers'], paths: ['app-topic', 'topic-subscribers'], caption: /모든 구독자.*사본.*즉시.*버퍼.*않/ },
      {
        label: 'EventBridge', nodes: ['aws-service', 'saas', 'bus', 'targets'], paths: ['aws-service-bus', 'saas-bus', 'bus-targets'],
        caption: /규칙.*이벤트.*순서.*24시간.*않/,
      },
      {
        label: 'Amazon MQ', nodes: ['legacy-app', 'broker', 'legacy-consumer'], paths: ['legacy-app-broker', 'broker-legacy-consumer'],
        caption: /표준 프로토콜.*메시징 방식.*바꾸지/,
      },
      { label: 'SES', nodes: ['app', 'ses', 'inbox'], paths: ['app-ses', 'ses-inbox'], caption: /SNS.*알림.*이메일.*목적.*SES/ },
    ]
    const groups = [
      { id: 'senders', label: '보내는 쪽', nodes: ['app', 'aws-service', 'saas', 'legacy-app'] },
      { id: 'managed', label: 'AWS 전달 장치', nodes: ['queue', 'topic', 'bus', 'broker', 'ses'] },
      { id: 'receivers', label: '받는 쪽', nodes: ['worker', 'subscribers', 'targets', 'legacy-consumer', 'inbox'] },
    ]

    function mockMatchMedia(matches: boolean) {
      const listeners = new Set<(event: MediaQueryListEvent) => void>()
      const mediaQuery = {
        matches,
        media: WIDE_DIAGRAM_QUERY,
        addEventListener: vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
          if (type === 'change') listeners.add(listener)
        }),
        removeEventListener: vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
          if (type === 'change') listeners.delete(listener)
        }),
      }
      vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))

      return {
        change(nextMatches: boolean) {
          mediaQuery.matches = nextMatches
          const event = Object.assign(new Event('change'), {
            matches: nextMatches,
            media: mediaQuery.media,
          })
          listeners.forEach((listener) => listener(event))
        },
      }
    }

    async function collectPathIds() {
      const ids = new Set<string>()
      for (const { label } of scenarios) {
        await selectScenario(label)
        for (const path of diagram().querySelectorAll('[data-path]')) ids.add(path.getAttribute('data-path')!)
      }
      return [...ids].sort()
    }

    function ids(selector: string, attribute: string) {
      return Array.from(diagram().querySelectorAll(selector), (element) => element.getAttribute(attribute)).sort()
    }

    const nodeBox = (id: string) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
    const groupBox = (id: string) => readBox(diagram().querySelector(`[data-group="${id}"]`)!)

    beforeEach(() => {
      mockMatchMedia(true)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('440×300 viewBox를 w-full 래퍼 하나로 그리고 SVG 속성과 화살표를 유지한다', () => {
      render(<MessagingShapesDiagram />)

      expect(screen.getAllByRole('img')).toHaveLength(1)
      expect(diagram()).toHaveAttribute('viewBox', '0 0 440 300')
      expect(diagram()).toHaveAttribute('class', 'block h-auto w-full')
      expect(diagram().parentElement).toHaveAttribute('class', 'w-full')
      expect(diagram().parentElement).not.toHaveClass('max-w-[380px]', '-mx-4')
      expect(diagram().querySelector('marker')).not.toBeNull()
    })

    it('노드·그룹 id 집합과 시나리오로 나타나는 경로 id 합집합이 세로형과 같다', async () => {
      const { change } = mockMatchMedia(false)
      render(<MessagingShapesDiagram />)
      expect(diagram()).toHaveAttribute('viewBox', '0 0 280 592')
      const tallNodes = ids('[data-node]', 'data-node')
      const tallGroups = ids('[data-group]', 'data-group')
      const tallPaths = await collectPathIds()

      act(() => change(true))

      expect(diagram()).toHaveAttribute('viewBox', '0 0 440 300')
      expect(ids('[data-node]', 'data-node')).toEqual(tallNodes)
      expect(tallNodes).toEqual(Object.keys(labels).sort())
      expect(ids('[data-group]', 'data-group')).toEqual(tallGroups)
      expect(tallGroups).toEqual(['managed', 'receivers', 'senders'])
      expect(tallPaths).toHaveLength(11)
      expect(await collectPathIds()).toEqual(tallPaths)
    })

    it('노드 14개와 그룹 셋의 모든 rect가 440×300 viewBox 안에 있다', () => {
      render(<MessagingShapesDiagram />)
      const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

      expect(boxes).toHaveLength(17)
      expect(boxesOutsideViewBox(boxes, [0, 0, 440, 300])).toEqual([])
    })

    it('노드 라벨은 크기 10과 여백 12로, 그룹 라벨은 크기 9로 자기 박스 오른쪽 끝 안에 들어간다', () => {
      render(<MessagingShapesDiagram />)

      for (const [id, label] of Object.entries(labels)) {
        const node = diagram().querySelector(`[data-node="${id}"]`)!
        const box = nodeBox(id)
        expect(node.querySelector('text')!.textContent).toBe(label)
        expect(node.querySelector('text')).toHaveAttribute('font-size', '10')
        expect(box.height).toBe(32)
        expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      }

      const groupLabels = Array.from(diagram().querySelectorAll('g.fill-muted > text'))
      expect(groupLabels).toHaveLength(3)
      for (const group of groups) {
        const box = groupBox(group.id)
        const groupLabel = groupLabels.find((element) => element.textContent === group.label)!
        expect(groupLabel.closest('[font-size]')).toHaveAttribute('font-size', '9')
        const x = Number(groupLabel.getAttribute('x'))
        const y = Number(groupLabel.getAttribute('y'))
        expect(x, group.label).toBeGreaterThan(box.x)
        expect(y, group.label).toBeGreaterThan(box.y)
        expect(x + estimateTextWidth(group.label, 9), group.label).toBeLessThanOrEqual(box.x + box.width)
      }
    })

    it.each(scenarios)('$label은 세로형과 같은 노드·경로·캡션을 보인다', async (scenario) => {
      const { container } = render(<MessagingShapesDiagram />)
      const caption = container.querySelector('figcaption')!
      const idle = caption.textContent
      await selectScenario(scenario.label)

      for (const node of diagram().querySelectorAll('[data-node]')) {
        expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
      }
      for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
      const paths = Array.from(diagram().querySelectorAll('[data-path]'))
      expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(scenario.paths)
      for (const path of paths) {
        expect(path.getAttribute('d')).toMatch(/^M\d+ \d+( [HV]\d+)+$/)
        expect(path).toHaveAttribute('stroke-width', '2')
        expect(path).toHaveAttribute('marker-end', `url(#${diagram().querySelector('marker')!.id})`)
        expect(path).toHaveClass('stroke-title')
      }
      expect(caption.textContent).not.toBe(idle)
      expect(caption).toHaveTextContent(scenario.caption)
      expect(caption).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByRole('button', { name: scenario.label })).toHaveAttribute('aria-pressed', 'true')

      await selectScenario('전체')

      for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
      expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
      expect(caption.textContent).toBe(idle)
    })

    it('색 없이도 보내는 쪽 → AWS 전달 장치 → 받는 쪽 세 열이 왼쪽에서 오른쪽으로 나란하다', () => {
      render(<MessagingShapesDiagram />)

      let previousRight = 0
      for (const group of groups) {
        const box = groupBox(group.id)
        expect(box.x, group.id).toBeGreaterThan(previousRight)
        previousRight = box.x + box.width
        expect(box.y, group.id).toBe(groupBox('senders').y)
        expect(box.height, group.id).toBe(groupBox('senders').height)
        expect(screen.getByText(group.label)).toBeInTheDocument()
        expect(boxesOutsideViewBox(group.nodes.map(nodeBox), [box.x, box.y, box.width, box.height]), group.id).toEqual([])
      }
      for (const node of diagram().querySelectorAll('[data-node]')) {
        const managed = groups[1].nodes.includes(node.getAttribute('data-node')!)
        expect(node.querySelector('rect')).toHaveClass(managed ? 'stroke-diagram-managed' : 'stroke-disabled')
      }
      expect(diagram().querySelector('[class*="diagram-resource"]')).toBeNull()
    })

    it.each([
      ['SQS', 'queue-worker', 'queue', 'worker'],
      ['SNS', 'topic-subscribers', 'topic', 'subscribers'],
      ['EventBridge', 'bus-targets', 'bus', 'targets'],
      ['Amazon MQ', 'broker-legacy-consumer', 'broker', 'legacy-consumer'],
      ['SES', 'ses-inbox', 'ses', 'inbox'],
    ])('%s의 전달 장치 → 받는 쪽 경로는 수평선 하나다', async (label, pathId, from, to) => {
      render(<MessagingShapesDiagram />)
      await selectScenario(label)

      const d = diagram().querySelector(`[data-path="${pathId}"]`)!.getAttribute('d')!
      expect(d).toMatch(/^M\d+ \d+ H\d+$/)
      const [x1, y, x2] = d.slice(1).split(/ H?/).map(Number)
      const source = nodeBox(from)
      const target = nodeBox(to)
      expect(x1).toBe(source.x + source.width)
      expect(x2).toBe(target.x)
      expect(y).toBe(source.y + source.height / 2)
      expect(y).toBe(target.y + target.height / 2)
    })

    it('세로형에서 고른 시나리오가 폭을 바꾸어도 유지된다', async () => {
      const { change } = mockMatchMedia(false)
      const { container } = render(<MessagingShapesDiagram />)
      expect(diagram()).toHaveAttribute('viewBox', '0 0 280 592')
      await selectScenario('EventBridge')
      const caption = container.querySelector('figcaption')!.textContent

      act(() => change(true))

      expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(440)
      expect(screen.getByRole('button', { name: 'EventBridge' })).toHaveAttribute('aria-pressed', 'true')
      expect(container.querySelector('figcaption')!.textContent).toBe(caption)
      expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path')))
        .toEqual(['aws-service-bus', 'saas-bus', 'bus-targets'])
    })
  })
})
