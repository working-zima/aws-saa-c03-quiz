import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { EdgeToOriginDiagram } from './EdgeToOriginDiagram'

const labels = {
  viewer: '뷰어', route53: 'Route 53',
  cf: 'CloudFront 배포', ga: 'Global Accelerator 고정 IP',
  alb: 'ALB', ec2: 'EC2', s3: 'S3 버킷',
  nlba: 'NLB (리전 A)', nlbb: 'NLB (리전 B)', onpremapi: '온프레미스 API',
}

function diagram() {
  return screen.getByRole('img', { name: '엣지에서 오리진까지의 경로' })
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

function nodeBox(id: string) {
  return readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
}

function groupBox(id: string) {
  return readBox(diagram().querySelector(`[data-group="${id}"]`)!)
}

describe('EdgeToOriginDiagram', () => {
  it('처음에는 노드 10개가 선명하고 경로는 모두 숨겨져 있다', () => {
    render(<EdgeToOriginDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(10)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('엣지 캐시 적중은 오리진까지 가지 않아 오리진 넷이 모두 흐려진다', async () => {
    render(<EdgeToOriginDiagram />)
    await selectScenario('엣지 캐시 적중')

    for (const id of ['alb', 'ec2', 's3', 'onpremapi']) {
      expect(diagram().querySelector(`[data-node="${id}"]`), id).toHaveAttribute('opacity', '0.25')
    }
    expect(diagram().querySelector('[data-node="cf"]')).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(1)
  })

  it('리전 장애 조치는 Route 53을 지나지 않고 리전 B로 간다', async () => {
    render(<EdgeToOriginDiagram />)
    await selectScenario('리전 장애 조치')

    expect(diagram().querySelector('[data-node="route53"]')).toHaveAttribute('opacity', '0.25')
    expect(diagram().querySelector('[data-node="nlbb"]')).toHaveAttribute('opacity', '1')
    expect(diagram().querySelector('[data-node="nlba"]')).toHaveAttribute('opacity', '0.25')
  })

  it('Route 53은 어느 시나리오에서도 경로에 들어가지 않는다', async () => {
    render(<EdgeToOriginDiagram />)

    for (const label of ['엣지 캐시 적중', 'ALB 오리진', 'S3 오리진', '온프레미스 오리진', 'Global Accelerator', '리전 장애 조치']) {
      await selectScenario(label)
      expect(diagram().querySelector('[data-node="route53"]'), label).toHaveAttribute('opacity', '0.25')
      for (const path of diagram().querySelectorAll('[data-path]')) {
        expect(path.getAttribute('data-path'), label).not.toMatch(/route53/)
      }
    }
  })

  it('Global Accelerator와 리전 장애 조치는 서로 다른 캡션을 낸다', async () => {
    const { container } = render(<EdgeToOriginDiagram />)
    const caption = container.querySelector('figcaption')!
    const idleCaption = caption.textContent

    await selectScenario('Global Accelerator')
    const accelerator = caption.textContent

    await selectScenario('리전 장애 조치')

    expect(caption.textContent).not.toBe(accelerator)
    expect(caption.textContent).not.toBe(idleCaption)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('리전 장애 조치 캡션은 주소가 변하지 않아 DNS 캐시를 기다리지 않는다는 사실을 담는다', async () => {
    const { container } = render(<EdgeToOriginDiagram />)
    await selectScenario('리전 장애 조치')

    const caption = container.querySelector('figcaption')!
    expect(caption).toHaveTextContent(/주소/)
    expect(caption).toHaveTextContent(/DNS 캐시/)
    expect(caption).toHaveTextContent(/Route 53/)
  })

  it('엣지 캐시 적중 캡션은 TTL이 남으면 옛 사본이 나간다는 함정을 담는다', async () => {
    const { container } = render(<EdgeToOriginDiagram />)
    await selectScenario('엣지 캐시 적중')

    expect(container.querySelector('figcaption')).toHaveTextContent(/TTL/)
    expect(container.querySelector('figcaption')).toHaveTextContent(/무효화/)
  })

  it.each([
    '엣지 캐시 적중', 'ALB 오리진', 'S3 오리진', '온프레미스 오리진', 'Global Accelerator', '리전 장애 조치',
  ])('%s 캡션은 20자를 넘어 조건과 제약을 설명한다', async (label) => {
    const { container } = render(<EdgeToOriginDiagram />)
    await selectScenario(label)

    expect(container.querySelector('figcaption')!.textContent!.length).toBeGreaterThan(20)
  })

  it('전체를 누르면 흐린 노드와 보이는 경로가 사라진다', async () => {
    render(<EdgeToOriginDiagram />)
    await selectScenario('ALB 오리진')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(3)

    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
  })

  it.each([
    ['엣지 캐시 적중', ['viewer', 'cf'], ['viewer-cf']],
    ['ALB 오리진', ['viewer', 'cf', 'alb', 'ec2'], ['viewer-cf', 'cf-alb', 'alb-ec2']],
    ['S3 오리진', ['viewer', 'cf', 's3'], ['viewer-cf', 'cf-s3']],
    ['온프레미스 오리진', ['viewer', 'cf', 'onpremapi'], ['viewer-cf', 'cf-onpremapi']],
    ['Global Accelerator', ['viewer', 'ga', 'nlba'], ['viewer-ga', 'ga-nlba']],
    ['리전 장애 조치', ['viewer', 'ga', 'nlbb'], ['viewer-ga', 'ga-nlbb']],
  ])('%s는 지정한 노드와 경로만 표시한다', async (label, route, expected) => {
    render(<EdgeToOriginDiagram />)
    await selectScenario(label)

    const nodes = Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (node) => node.getAttribute('data-node'))
    expect(nodes.sort()).toEqual([...route].sort())
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(expected)
    for (const path of paths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('모든 rect가 280폭 viewBox 경계 안에 있다', () => {
    render(<EdgeToOriginDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes.length).toBeGreaterThan(10)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('축약하지 않은 10개 라벨이 글자 크기 10과 좌우 여백 12로 노드 안에 들어간다', () => {
    render(<EdgeToOriginDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const text = diagram().querySelector(`[data-node="${id}"] text`)!
      expect(text).toHaveTextContent(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(nodeBox(id).width)
    }
  })

  it('viewBox 폭은 280이고 SVG 래퍼는 좌측 정렬에 최대 380px이다', () => {
    render(<EdgeToOriginDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]', '-mx-4', 'sm:mx-0', 'max-sm:w-[calc(100%+2rem)]')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('두 리전을 가로가 아니라 세로로 쌓는다', () => {
    render(<EdgeToOriginDiagram />)
    const regionA = groupBox('region-a')
    const regionB = groupBox('region-b')

    expect(regionA.y + regionA.height).toBeLessThanOrEqual(regionB.y)
    expect(regionA.x).toBe(regionB.x)
    expect(regionA.width).toBe(regionB.width)
    expect(nodeBox('nlba').y).toBeLessThan(nodeBox('nlbb').y)
  })

  it('뷰어와 엣지 층이 리전 위에 있고 온프레미스 API는 두 리전 밖이다', () => {
    render(<EdgeToOriginDiagram />)
    const regionA = groupBox('region-a')
    const inside = (id: string, group: string) => {
      const box = groupBox(group)
      return boxesOutsideViewBox([nodeBox(id)], [box.x, box.y, box.width, box.height]).length === 0
    }

    for (const id of ['viewer', 'cf', 'ga', 'route53']) {
      expect(nodeBox(id).y + nodeBox(id).height, id).toBeLessThan(regionA.y)
    }
    expect(nodeBox('viewer').y + nodeBox('viewer').height).toBeLessThan(groupBox('edge').y)
    for (const id of ['cf', 'ga']) expect(inside(id, 'edge'), id).toBe(true)
    expect(inside('route53', 'edge')).toBe(false)
    for (const id of ['alb', 'ec2', 's3', 'nlba']) expect(inside(id, 'region-a'), id).toBe(true)
    expect(inside('nlbb', 'region-b')).toBe(true)
    expect(inside('onpremapi', 'region-a')).toBe(false)
    expect(inside('onpremapi', 'region-b')).toBe(false)
    expect(nodeBox('onpremapi').y).toBeGreaterThanOrEqual(groupBox('region-b').y + groupBox('region-b').height)
  })

  it('S3 버킷은 리전 안이되 VPC 자원이 아닌 색으로 그린다', () => {
    render(<EdgeToOriginDiagram />)
    const strokeOf = (id: string) => diagram().querySelector(`[data-node="${id}"] rect`)!.getAttribute('class')

    expect(strokeOf('s3')).toContain('stroke-diagram-managed')
    for (const id of ['alb', 'ec2', 'nlba', 'nlbb']) expect(strokeOf(id), id).toContain('stroke-diagram-resource')
    for (const id of ['cf', 'ga']) expect(strokeOf(id), id).toContain('stroke-diagram-managed')
    for (const id of ['viewer', 'route53', 'onpremapi']) expect(strokeOf(id), id).toContain('stroke-disabled')
  })

  it('공유 본문에서 global-accelerator-vs-dns-failover 뒤에만 실등록 도식을 표시한다', () => {
    render(<ConceptList headingLevel={4} concepts={[
      { id: 'cloudfront-global-accelerator.global-accelerator', name: 'Global Accelerator', summary: '요약', paragraphs: ['앞 본문'] },
      { id: 'cloudfront-global-accelerator.global-accelerator-vs-dns-failover', name: '장애 조치', summary: '요약', paragraphs: ['비교 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: '엣지에서 오리진까지의 경로 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'cloudfront-global-accelerator.global-accelerator-vs-dns-failover')
    expect(figure.previousElementSibling).toHaveTextContent('비교 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })

  it('여러 번 렌더해도 화살표 마커가 다른 도식과 충돌하지 않는다', async () => {
    const { container } = render(<><EdgeToOriginDiagram /><EdgeToOriginDiagram /></>)
    await act(async () => {
      for (const button of screen.getAllByRole('button', { name: 'S3 오리진' })) await userEvent.click(button)
    })

    const markers = Array.from(container.querySelectorAll('marker'))
    expect(new Set(markers.map((marker) => marker.id)).size).toBe(2)
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg.querySelector('[data-path]')).toHaveAttribute('marker-end', `url(#${svg.querySelector('marker')!.id})`)
    }
  })
})
