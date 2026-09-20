import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { HybridPathsDiagram } from './HybridPathsDiagram'

const labels = {
  onprem: '온프레미스 데이터 센터', cgw: 'Customer Gateway', remote: '원격 사용자',
  internet: '인터넷', dxloc: 'Direct Connect 위치',
  dxgw: 'Direct Connect Gateway', tgw: 'Transit Gateway',
  vgwa: '가상 프라이빗 게이트웨이 (VPC A)', vpca: 'VPC A 자원',
  vgwb: '가상 프라이빗 게이트웨이 (VPC B)', vpcb: 'VPC B 자원',
}

function diagram() {
  return screen.getByRole('img', { name: '온프레미스 연결 경로' })
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

describe('HybridPathsDiagram', () => {
  it('처음에는 노드 11개가 선명하고 경로는 모두 숨겨져 있다', () => {
    render(<HybridPathsDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(11)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('Direct Connect를 고르면 인터넷 노드가 흐려진다', async () => {
    render(<HybridPathsDiagram />)
    await selectScenario('Direct Connect')

    expect(diagram().querySelector('[data-node="internet"]')).toHaveAttribute('opacity', '0.25')
    expect(diagram().querySelector('[data-node="dxloc"]')).toHaveAttribute('opacity', '1')
  })

  it('Site-to-Site VPN을 고르면 인터넷 노드가 선명하다', async () => {
    render(<HybridPathsDiagram />)
    await selectScenario('Site-to-Site VPN')

    expect(diagram().querySelector('[data-node="internet"]')).toHaveAttribute('opacity', '1')
    expect(diagram().querySelector('[data-node="dxloc"]')).toHaveAttribute('opacity', '0.25')
  })

  it('VPC마다 따로 맺는 VPN은 경로가 둘뿐이고 두 게이트웨이를 잇지 않는다', async () => {
    render(<HybridPathsDiagram />)
    await selectScenario('VPC마다 따로 맺는 VPN')

    const paths = Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path'))
    expect(paths).toHaveLength(2)
    expect(paths).toEqual(['onprem-vgwa', 'onprem-vgwb'])
    for (const path of paths) expect(path).not.toMatch(/vgwa-vgwb|vgwb-vgwa/)
  })

  it('선택한 경로의 설명으로 캡션을 바꾼다', async () => {
    const { container } = render(<HybridPathsDiagram />)
    const caption = container.querySelector('figcaption')!
    const idleCaption = caption.textContent

    await selectScenario('VPC마다 따로 맺는 VPN')

    expect(caption).toHaveTextContent(/라우팅 테이블/)
    expect(caption.textContent).not.toBe(idleCaption)
    expect(caption).toHaveAttribute('aria-live', 'polite')
  })

  it('전체를 누르면 흐린 노드와 보이는 경로가 사라진다', async () => {
    render(<HybridPathsDiagram />)
    await selectScenario('Direct Connect Gateway')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(5)

    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
  })

  it.each([
    'Site-to-Site VPN', 'Direct Connect', 'Transit Gateway',
    'Direct Connect Gateway', 'Client VPN', 'VPC마다 따로 맺는 VPN',
  ])('%s 캡션은 20자를 넘어 조건과 제약을 설명한다', async (label) => {
    const { container } = render(<HybridPathsDiagram />)
    await selectScenario(label)

    expect(container.querySelector('figcaption')!.textContent!.length).toBeGreaterThan(20)
  })

  it('Direct Connect 캡션은 전용선이 암호화하지 않는다는 함정을 담는다', async () => {
    const { container } = render(<HybridPathsDiagram />)
    await selectScenario('Direct Connect')

    expect(container.querySelector('figcaption')).toHaveTextContent(/암호화/)
    expect(container.querySelector('figcaption')).toHaveTextContent(/VPN/)
  })

  it('모든 rect가 280폭 viewBox 경계 안에 있다', () => {
    render(<HybridPathsDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes.length).toBeGreaterThan(11)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('축약하지 않은 11개 라벨이 글자 크기 10과 좌우 여백 12로 노드 안에 들어간다', () => {
    render(<HybridPathsDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      expect(text).toHaveTextContent(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(nodeBox(id).width)
    }
  })

  it('viewBox 폭은 280이고 SVG 래퍼는 좌측 정렬에 최대 380px이다', () => {
    render(<HybridPathsDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]', '-mx-4', 'sm:mx-0', 'max-sm:w-[calc(100%+2rem)]')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it.each([
    ['Site-to-Site VPN', ['onprem', 'cgw', 'internet', 'vgwa'], ['onprem-cgw', 'cgw-internet', 'internet-vgwa']],
    ['Direct Connect', ['onprem', 'dxloc', 'vgwa'], ['onprem-dxloc', 'dxloc-vgwa']],
    ['Transit Gateway', ['onprem', 'tgw', 'vpca', 'vpcb'], ['onprem-tgw', 'tgw-vpca', 'tgw-vpcb']],
    ['Direct Connect Gateway', ['onprem', 'dxloc', 'dxgw', 'tgw', 'vpca', 'vpcb'], ['onprem-dxloc', 'dxloc-dxgw', 'dxgw-tgw', 'tgw-vpca', 'tgw-vpcb']],
    ['Client VPN', ['remote', 'internet', 'vpca'], ['remote-internet', 'internet-vpca']],
    ['VPC마다 따로 맺는 VPN', ['onprem', 'vgwa', 'vgwb'], ['onprem-vgwa', 'onprem-vgwb']],
  ])('%s는 지정한 노드와 경로만 표시한다', async (label, route, expected) => {
    render(<HybridPathsDiagram />)
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

  it('허브와 게이트웨이는 리전 안 VPC 밖이고 VPC 자원은 각자의 VPC 안이다', () => {
    render(<HybridPathsDiagram />)
    const groupBox = (id: string) => readBox(diagram().querySelector(`[data-group="${id}"]`)!)
    const expectInside = (ids: string[], group: string) => {
      const box = groupBox(group)
      expect(boxesOutsideViewBox(ids.map(nodeBox), [box.x, box.y, box.width, box.height])).toEqual([])
    }

    expectInside(['onprem', 'cgw'], 'onprem-zone')
    expectInside(['dxgw', 'tgw', 'vgwa', 'vpca', 'vgwb', 'vpcb'], 'region')
    expectInside(['vgwa', 'vpca'], 'vpc-a')
    expectInside(['vgwb', 'vpcb'], 'vpc-b')
    for (const id of ['dxgw', 'tgw']) {
      for (const group of ['vpc-a', 'vpc-b']) {
        const box = groupBox(group)
        expect(boxesOutsideViewBox([nodeBox(id)], [box.x, box.y, box.width, box.height])).toHaveLength(1)
      }
    }
    for (const group of ['vpc-a', 'vpc-b']) {
      const region = groupBox('region')
      expect(boxesOutsideViewBox([groupBox(group)], [region.x, region.y, region.width, region.height])).toEqual([])
    }
  })

  it('전용 회선 층은 인터넷 층과 나란하고 둘 다 리전 밖이다', () => {
    render(<HybridPathsDiagram />)
    const region = readBox(diagram().querySelector('[data-group="region"]')!)

    expect(nodeBox('dxloc').y).toBe(nodeBox('internet').y)
    expect(nodeBox('internet').x + nodeBox('internet').width).toBeLessThan(nodeBox('dxloc').x)
    for (const id of ['onprem', 'cgw', 'remote', 'internet', 'dxloc']) {
      expect(nodeBox(id).y + nodeBox(id).height).toBeLessThan(region.y)
    }
    expect(readBox(diagram().querySelector('[data-group="onprem-zone"]')!).y).toBeLessThan(nodeBox('internet').y)
  })

  it('공유 본문에서 vpn-vs-direct-connect 뒤에만 실등록 도식을 표시한다', () => {
    render(<ConceptList headingLevel={4} concepts={[
      { id: 'hybrid-connectivity.direct-connect', name: 'Direct Connect', summary: '요약', paragraphs: ['앞 본문'] },
      { id: 'hybrid-connectivity.vpn-vs-direct-connect', name: '비교', summary: '요약', paragraphs: ['비교 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: '온프레미스 연결 경로 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'hybrid-connectivity.vpn-vs-direct-connect')
    expect(figure.previousElementSibling).toHaveTextContent('비교 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })

  it('여러 번 렌더해도 화살표 마커가 다른 도식과 충돌하지 않는다', async () => {
    const { container } = render(<><HybridPathsDiagram /><HybridPathsDiagram /></>)
    await act(async () => {
      for (const button of screen.getAllByRole('button', { name: 'Client VPN' })) await userEvent.click(button)
    })

    const markers = Array.from(container.querySelectorAll('marker'))
    expect(new Set(markers.map((marker) => marker.id)).size).toBe(2)
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg.querySelector('[data-path]')).toHaveAttribute('marker-end', `url(#${svg.querySelector('marker')!.id})`)
    }
  })
})
