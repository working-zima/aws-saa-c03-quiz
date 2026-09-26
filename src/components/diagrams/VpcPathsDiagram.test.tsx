import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { VpcPathsDiagram, vpcPathScenarios } from './VpcPathsDiagram'

const diagramText = visualsByTopicId['vpc-networking'].diagrams['vpc-paths']

const labels = {
  internet: '인터넷', onprem: '온프레미스', lambda: 'Lambda 실행 환경',
  logs: 'CloudWatch Logs', s3: 'S3', igw: '인터넷 게이트웨이',
  vgw: '가상 프라이빗 게이트웨이', alb: 'ALB', nat: 'NAT 게이트웨이',
  eni: 'Lambda ENI', ec2: 'EC2', efs: 'EFS 탑재 대상', rds: 'RDS',
  endpoint: 'S3 게이트웨이 엔드포인트',
  'interface-endpoint': '인터페이스 엔드포인트',
  'pl-endpoint': 'PrivateLink 엔드포인트',
  peering: 'VPC 피어링', tgw: 'Transit Gateway', 'other-app': '다른 VPC의 앱',
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
  it('처음에는 노드 19개가 선명하고 경로는 모두 숨겨져 있다', () => {
    render(<VpcPathsDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(19)
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

    expect(caption).toHaveTextContent(/NAT.*퍼블릭 서브넷/)
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

  it.each([
    '사용자 → EC2', 'Lambda → EC2', '프라이빗 → 인터넷', 'VPC → S3',
    'Lambda → 로그', 'Lambda → EFS', '온프레미스 → VPC',
    '프라이빗 → 그 외 AWS 서비스', 'PrivateLink → 다른 VPC의 앱', 'VPC ⇄ VPC 피어링', 'Transit Gateway',
  ])('%s 캡션은 20자를 넘어 조건과 제약을 설명한다', async (label) => {
    const { container } = render(<VpcPathsDiagram />)
    await selectScenario(label)

    expect(container.querySelector('figcaption')!.textContent!.length).toBeGreaterThan(20)
  })

  it('로그 캡션에 근거 없는 VPC 경로 설명을 넣지 않는다', async () => {
    const { container } = render(<VpcPathsDiagram />)
    await selectScenario('Lambda → 로그')

    expect(container.querySelector('figcaption')).not.toHaveTextContent('VPC')
  })

  it('모바일 SVG 래퍼는 figure 패딩을 포함한 폭을 쓰고 sm 이상에서는 여백을 복원한다', () => {
    render(<VpcPathsDiagram />)

    expect(diagram().parentElement).toHaveClass('-mx-4', 'sm:mx-0', 'max-sm:w-[calc(100%+2rem)]')
  })

  it('모든 rect가 280폭 viewBox 경계 안에 있다', () => {
    render(<VpcPathsDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes.length).toBeGreaterThan(19)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('축약하지 않은 19개 라벨이 글자 크기 10과 좌우 여백 12로 노드 안에 들어간다', () => {
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
    ['프라이빗 → 그 외 AWS 서비스', ['ec2', 'interface-endpoint', 'logs']],
    ['PrivateLink → 다른 VPC의 앱', ['ec2', 'pl-endpoint', 'other-app']],
    ['VPC ⇄ VPC 피어링', ['ec2', 'peering', 'other-app']],
    ['Transit Gateway', ['ec2', 'tgw', 'other-app']],
  ])('%s는 지정한 노드와 방향의 경로만 표시한다', async (label, route) => {
    render(<VpcPathsDiagram />)
    await selectScenario(label)

    const nodes = Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (node) => node.getAttribute('data-node'))
    expect(nodes.sort()).toEqual([...route].sort())
    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', route.includes(node.getAttribute('data-node') ?? '') ? '1' : '0.25')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) {
      expect(group.closest('[opacity]')).toBeNull()
    }
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(route.slice(1).map((to, i) => `${route[i]}-${to}`))
    for (const path of paths) {
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end')
    }
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
  })

  it.each([
    ['사용자 → EC2', '외부 접근을 허용하면 퍼블릭, 막으면 프라이빗 서브넷이다.'],
    ['Lambda → EC2', '퍼블릭 배치로는 사설 EC2에 못 닿는다. 수신 보안 그룹의 소스는 상대 그룹 ID다.'],
    ['프라이빗 → 인터넷', 'NAT 게이트웨이는 프라이빗에서 쓰지만 퍼블릭 서브넷에 둔다.'],
    ['VPC → S3', '게이트웨이 엔드포인트는 무료다. S3에는 VPC·서브넷 배치도 보안 그룹도 없다.'],
    ['Lambda → 로그', '로그가 없으면 로깅 설정보다 실행 역할의 쓰기 권한을 먼저 확인한다.'],
    ['Lambda → EFS', '레이어 한도를 넘는 종속성을 재배포 없이 갱신한다. 전송은 TLS로 자동 암호화된다.'],
    ['온프레미스 → VPC', '가상 프라이빗 게이트웨이는 VPC별로 붙으므로 VPC가 늘면 확장이 어렵다.'],
  ])('%s의 기존 캡션을 한 글자도 바꾸지 않는다', async (label, caption) => {
    const { container } = render(<VpcPathsDiagram />)
    await selectScenario(label)

    expect(container.querySelector('figcaption')!.textContent).toBe(caption)
    expect(diagramText.scenarios.find((scenario) => scenario.label === label)?.caption).toBe(caption)
  })

  it('JSON과 좌표 시나리오의 id 집합이 같고 11개 모두 JSON 문구를 표시한다', async () => {
    const { container } = render(<VpcPathsDiagram />)
    const ids = vpcPathScenarios.map(({ id }) => id)

    expect(ids).toHaveLength(11)
    expect(new Set(ids).size).toBe(11)
    expect([...ids].sort()).toEqual(diagramText.scenarios.map(({ id }) => id).sort())
    expect(screen.getAllByRole('button')).toHaveLength(12)
    for (const scenario of diagramText.scenarios) {
      await selectScenario(scenario.label)
      expect(container.querySelector('figcaption')!.textContent).toBe(scenario.caption)
      expect(diagram().querySelectorAll('[data-path]').length).toBeGreaterThan(0)
    }
  })

  it('도식·노드·그룹의 문구와 id는 JSON에서 온다', () => {
    const { container } = render(<VpcPathsDiagram />)

    expect(screen.getByRole('figure', { name: diagramText.label })).toBeInTheDocument()
    expect(diagram()).toHaveAttribute('aria-label', diagramText.svgLabel)
    expect(container.querySelector('figcaption')!.textContent).toBe(diagramText.idleCaption)
    expect(screen.getByText(diagramText.legend!)).toBeInTheDocument()
    expect(diagramText.nodes).toEqual(labels)
    const groupIds = Array.from(diagram().querySelectorAll('[data-group]'), (group) => group.getAttribute('data-group'))
    expect([...new Set(groupIds)].sort()).toEqual(Object.keys(diagramText.groups!).sort())
    for (const label of Object.values(diagramText.groups!)) {
      expect(Array.from(diagram().querySelectorAll('text'), (text) => text.textContent)).toContain(label)
    }
  })

  it('새 엔드포인트는 전체 폭의 프라이빗 노드이고 연결 지점과 다른 VPC는 내 VPC 밖이다', () => {
    render(<VpcPathsDiagram />)
    const groupBox = (id: string) => readBox(diagram().querySelector(`[data-group="${id}"]`)!)
    const nodeBox = (id: string) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
    const inside = (node: ReturnType<typeof readBox>, group: ReturnType<typeof readBox>) => (
      boxesOutsideViewBox([node], [group.x, group.y, group.width, group.height]).length === 0
    )
    const privateBoxes = Array.from(diagram().querySelectorAll('[data-group="private"]'), readBox)
    for (const id of ['interface-endpoint', 'pl-endpoint']) {
      const node = nodeBox(id)
      expect(node.width).toBe(232)
      expect(privateBoxes.some((group) => inside(node, group))).toBe(true)
      expect(inside(node, groupBox('vpc'))).toBe(true)
      expect(diagram().querySelector(`[data-node="${id}"] rect`)).toHaveClass('stroke-diagram-resource')
    }
    for (const group of privateBoxes) {
      expect(inside(nodeBox('endpoint'), group)).toBe(false)
    }
    for (const id of ['peering', 'tgw']) {
      expect(inside(nodeBox(id), groupBox('region'))).toBe(true)
      expect(nodeBox(id).y).toBeGreaterThan(groupBox('vpc').y + groupBox('vpc').height)
      expect(diagram().querySelector(`[data-node="${id}"] rect`)).toHaveClass('stroke-disabled')
    }
    expect(inside(groupBox('other-vpc'), groupBox('region'))).toBe(true)
    expect(groupBox('other-vpc').y).toBeGreaterThan(groupBox('vpc').y + groupBox('vpc').height)
    expect(inside(nodeBox('other-app'), groupBox('other-vpc'))).toBe(true)
    expect(diagram().querySelector('[data-node="other-app"] rect')).toHaveClass('stroke-diagram-resource')
    expect(diagram().querySelector('[data-group="other-vpc"]')).toHaveAttribute(
      'stroke-dasharray', diagram().querySelector('[data-group="vpc"]')!.getAttribute('stroke-dasharray'),
    )
  })

  it('피어링과 Transit Gateway는 겹치지 않는 좌우 통로로 같은 두 끝점을 잇는다', async () => {
    render(<VpcPathsDiagram />)
    const pathVertices = () => Array.from(diagram().querySelectorAll('[data-path]')).flatMap((path) => {
      let x = 0
      let y = 0
      return Array.from(path.getAttribute('d')!.matchAll(/([MHV])(-?\d+)(?:\s+(-?\d+))?/g), ([, command, a, b]) => {
        if (command === 'M') { x = Number(a); y = Number(b) }
        else if (command === 'H') x = Number(a)
        else y = Number(a)
        return { x, y }
      })
    })

    await selectScenario('VPC ⇄ VPC 피어링')
    const peering = pathVertices().filter(({ y }) => y >= 590)
    await selectScenario('Transit Gateway')
    const transitGateway = pathVertices().filter(({ y }) => y >= 590)

    expect(peering.length).toBeGreaterThan(0)
    expect(transitGateway.length).toBeGreaterThan(0)
    expect(Math.max(...peering.map(({ x }) => x))).toBeLessThan(Math.min(...transitGateway.map(({ x }) => x)))
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
