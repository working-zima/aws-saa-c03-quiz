import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { VpcPathsDiagram } from './VpcPathsDiagram'

const labels = {
  internet: '인터넷', onprem: '온프레미스', lambda: 'Lambda 실행 환경',
  logs: 'CloudWatch Logs', s3: 'S3', igw: '인터넷 게이트웨이',
  vgw: '가상 프라이빗 게이트웨이', alb: 'ALB', nat: 'NAT 게이트웨이',
  eni: 'Lambda ENI', ec2: 'EC2', efs: 'EFS 탑재 대상', rds: 'RDS',
  endpoint: 'S3 게이트웨이 엔드포인트',
}

function diagram() {
  return screen.getByRole('img', { name: 'VPC 통신 경로' })
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

describe('VpcPathsDiagram', () => {
  it('처음에는 노드 14개가 선명하고 경로는 모두 숨겨져 있다', () => {
    render(<VpcPathsDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(14)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('프라이빗 → 인터넷을 고르면 해당 네 노드만 선명해진다', async () => {
    render(<VpcPathsDiagram />)
    await selectScenario('프라이빗 → 인터넷')

    for (const node of diagram().querySelectorAll('[data-node]')) {
      const active = ['ec2', 'nat', 'igw', 'internet'].includes(node.getAttribute('data-node') ?? '')
      expect(node).toHaveAttribute('opacity', active ? '1' : '0.25')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) {
      expect(group.closest('[opacity]')).toBeNull()
    }
  })

  it('선택한 경로의 설명으로 캡션을 바꾼다', async () => {
    const { container } = render(<VpcPathsDiagram />)
    const caption = container.querySelector('figcaption')!
    const idleCaption = caption.textContent

    await selectScenario('프라이빗 → 인터넷')

    expect(caption).toHaveTextContent('NAT를 거쳐 나가며, 외부의 접속 시작은 막는다.')
    expect(caption.textContent).not.toBe(idleCaption)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('전체를 누르면 흐린 노드와 보이는 경로가 사라진다', async () => {
    render(<VpcPathsDiagram />)
    await selectScenario('프라이빗 → 인터넷')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(3)

    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
  })

  it('모든 rect가 280폭 viewBox 경계 안에 있다', () => {
    render(<VpcPathsDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes.length).toBeGreaterThan(14)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('축약하지 않은 14개 라벨이 글자 크기 10과 좌우 여백 12로 노드 안에 들어간다', () => {
    render(<VpcPathsDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const box = readBox(node.querySelector('rect')!)
      expect(text).toHaveTextContent(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
    }
  })

  it('viewBox 폭은 280이고 SVG 래퍼는 좌측 정렬에 최대 380px이다', () => {
    render(<VpcPathsDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it.each([
    ['사용자 → EC2', ['internet', 'igw', 'alb', 'ec2']],
    ['Lambda → EC2', ['lambda', 'eni', 'ec2']],
    ['프라이빗 → 인터넷', ['ec2', 'nat', 'igw', 'internet']],
    ['VPC → S3', ['ec2', 'endpoint', 's3']],
    ['Lambda → 로그', ['lambda', 'logs']],
    ['Lambda → EFS', ['lambda', 'eni', 'efs']],
    ['온프레미스 → VPC', ['onprem', 'vgw', 'rds']],
  ])('%s는 지정한 노드와 방향의 경로만 표시한다', async (label, route) => {
    render(<VpcPathsDiagram />)
    await selectScenario(label)

    const nodes = Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (node) => node.getAttribute('data-node'))
    expect(nodes.sort()).toEqual([...route].sort())
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(route.slice(1).map((to, i) => `${route[i]}-${to}`))
    for (const path of paths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
    }
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it('S3는 리전 안·VPC 밖에 있고 각 자원은 지정한 그룹 안에 있다', () => {
    render(<VpcPathsDiagram />)
    const groupBox = (id: string) => readBox(diagram().querySelector(`[data-group="${id}"]`)!)
    const expectInside = (ids: string[], group: string) => {
      const box = groupBox(group)
      const nodes = ids.map((id) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!))
      expect(boxesOutsideViewBox(nodes, [box.x, box.y, box.width, box.height])).toEqual([])
    }

    expectInside(['lambda', 'logs', 's3'], 'managed')
    expectInside(['igw', 'vgw', 'endpoint'], 'vpc')
    expectInside(['alb', 'nat'], 'public')
    expectInside(['eni', 'ec2', 'efs', 'rds'], 'private')
    const region = groupBox('region')
    for (const group of ['managed', 'vpc', 'public', 'private']) {
      expect(boxesOutsideViewBox([groupBox(group)], [region.x, region.y, region.width, region.height])).toEqual([])
    }
    for (const id of ['internet', 'onprem']) {
      const node = readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
      expect(node.y + node.height).toBeLessThan(region.y)
    }
    const s3 = readBox(diagram().querySelector('[data-node="s3"] rect')!)
    expect(s3.y + s3.height).toBeLessThan(groupBox('vpc').y)
  })

  it('공유 본문에서 comparison 뒤에만 실등록 도식을 표시한다', () => {
    render(<ConceptList headingLevel={4} concepts={[
      { id: 'vpc-networking.vpc-subnet', name: 'VPC', summary: '요약', paragraphs: ['앞 본문'] },
      { id: 'vpc-networking.comparison', name: '비교', summary: '요약', paragraphs: ['비교 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: 'VPC 통신 경로 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'vpc-networking.comparison')
    expect(figure.previousElementSibling).toHaveTextContent('비교 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })

  it('여러 번 렌더해도 화살표 마커가 다른 도식과 충돌하지 않는다', async () => {
    const { container } = render(<><VpcPathsDiagram /><VpcPathsDiagram /></>)
    await act(async () => {
      for (const button of screen.getAllByRole('button', { name: 'Lambda → 로그' })) await userEvent.click(button)
    })

    const markers = Array.from(container.querySelectorAll('marker'))
    expect(new Set(markers.map((marker) => marker.id)).size).toBe(2)
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg.querySelector('[data-path]')).toHaveAttribute('marker-end', `url(#${svg.querySelector('marker')!.id})`)
    }
  })
})
