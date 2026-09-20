import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { SgNaclBoundaryDiagram } from './SgNaclBoundaryDiagram'

const labels = {
  ec2: 'EC2', rds: 'RDS', outside: '바깥',
  'nacl-in': 'NACL 인바운드', 'nacl-out': 'NACL 아웃바운드',
  'sg-in': '보안 그룹 인바운드', 'sg-out': '보안 그룹 아웃바운드',
  resource: '리소스',
}

function diagram() {
  return screen.getByRole('img', { name: '보안 그룹과 네트워크 ACL 경계' })
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

function opacityOf(id: string) {
  return diagram().querySelector(`[data-node="${id}"]`)!.getAttribute('opacity')
}

describe('SgNaclBoundaryDiagram', () => {
  it('버튼은 전체를 포함해 셋이고 처음에는 전체가 눌려 있다', () => {
    render(<SgNaclBoundaryDiagram />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.map((button) => button.textContent)).toEqual(['전체', '들어오는 요청', '그 응답'])
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
  })

  it('노드 여덟이 모두 있고 그룹 박스는 흐려지지 않는다', async () => {
    render(<SgNaclBoundaryDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())

    await selectScenario('그 응답')

    for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
  })

  it('들어오는 요청을 고르면 인바운드 칸 둘이 선명하고 아웃바운드 칸 둘은 흐리다', async () => {
    render(<SgNaclBoundaryDiagram />)
    await selectScenario('들어오는 요청')

    expect(opacityOf('nacl-in')).toBe('1')
    expect(opacityOf('sg-in')).toBe('1')
    expect(opacityOf('nacl-out')).toBe('0.25')
    expect(opacityOf('sg-out')).toBe('0.25')
    expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path')))
      .toEqual(['outside-nacl-in', 'nacl-in-sg-in', 'sg-in-resource'])
  })

  it('그 응답을 고르면 아웃바운드 칸 둘이 선명하고 인바운드 칸 둘은 흐리다', async () => {
    render(<SgNaclBoundaryDiagram />)
    await selectScenario('그 응답')

    expect(opacityOf('nacl-out')).toBe('1')
    expect(opacityOf('sg-out')).toBe('1')
    expect(opacityOf('nacl-in')).toBe('0.25')
    expect(opacityOf('sg-in')).toBe('0.25')
    expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path')))
      .toEqual(['resource-sg-out', 'sg-out-nacl-out', 'nacl-out-outside'])
  })

  it('그 응답에서는 보안 그룹 아웃바운드 칸만 점선이고 NACL 아웃바운드 칸은 실선이다', async () => {
    render(<SgNaclBoundaryDiagram />)
    expect(Array.from(diagram().querySelectorAll('rect[stroke-dasharray]'))).toHaveLength(0)

    await selectScenario('그 응답')

    const dashed = Array.from(diagram().querySelectorAll('rect[stroke-dasharray]'), readBox)
    expect(dashed.map((box) => box.id)).toEqual(['sg-out'])
    expect(diagram().querySelector('[data-node="nacl-out"] rect')).not.toHaveAttribute('stroke-dasharray')
  })

  it('들어오는 요청에서는 점선 칸이 하나도 없다', async () => {
    render(<SgNaclBoundaryDiagram />)
    await selectScenario('들어오는 요청')

    expect(diagram().querySelectorAll('rect[stroke-dasharray]')).toHaveLength(0)
  })

  it('보안 그룹 경계가 NACL 경계 안쪽에 완전히 들어가고 리소스 둘을 함께 감싼다', () => {
    render(<SgNaclBoundaryDiagram />)
    const nacl = groupBox('nacl-boundary')
    const sg = groupBox('sg-boundary')

    expect(boxesOutsideViewBox([sg], [nacl.x, nacl.y, nacl.width, nacl.height])).toEqual([])
    expect(sg.x).toBeGreaterThan(nacl.x)
    expect(sg.y).toBeGreaterThan(nacl.y)
    expect(sg.x + sg.width).toBeLessThan(nacl.x + nacl.width)
    expect(sg.y + sg.height).toBeLessThan(nacl.y + nacl.height)
    expect(boxesOutsideViewBox([nodeBox('ec2'), nodeBox('rds')], [sg.x, sg.y, sg.width, sg.height])).toEqual([])
    expect(nodeBox('ec2').x + nodeBox('ec2').width).toBeLessThan(nodeBox('rds').x)
  })

  it('세 축의 값을 두 경계에 각각 9px 보조 글자로 단다', () => {
    render(<SgNaclBoundaryDiagram />)
    const smallText = diagram().querySelector('[font-size="9"]')!
    const axisTexts = Array.from(smallText.querySelectorAll('text'), (text) => text.textContent)

    expect(smallText).toHaveClass('fill-muted')
    expect(axisTexts).toContain('IP만 · 허용과 차단 · 상태 비저장')
    expect(axisTexts).toContain('리소스·IP · 허용만 · 상태 저장')
    expect(axisTexts.some((text) => text?.includes('차단') && text.includes('리소스·IP'))).toBe(false)
  })

  it('모든 rect가 280폭 viewBox 경계 안에 있다', () => {
    render(<SgNaclBoundaryDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes.length).toBe(10)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('축약하지 않은 여덟 라벨이 글자 크기 10과 좌우 여백 12로 노드 안에 들어간다', () => {
    render(<SgNaclBoundaryDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const text = diagram().querySelector(`[data-node="${id}"] text`)!
      expect(text).toHaveTextContent(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(nodeBox(id).width)
    }
  })

  it('viewBox 폭은 280이고 SVG 래퍼는 좌측 정렬에 최대 380px이다', () => {
    render(<SgNaclBoundaryDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]', '-mx-4', 'sm:mx-0', 'max-sm:w-[calc(100%+2rem)]')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('기본 캡션은 두 경계가 감싸는 대상이 다르다고 말한다', () => {
    const { container } = render(<SgNaclBoundaryDiagram />)

    expect(container.querySelector('figcaption')).toHaveTextContent(/서브넷/)
    expect(container.querySelector('figcaption')).toHaveTextContent(/리소스/)
  })

  it('응답 캡션은 보안 그룹은 규칙 없이 통과하고 NACL은 규칙이 필요하다는 차이를 담는다', async () => {
    const { container } = render(<SgNaclBoundaryDiagram />)
    const caption = container.querySelector('figcaption')!
    const idleCaption = caption.textContent

    await selectScenario('그 응답')

    expect(caption.textContent).not.toBe(idleCaption)
    expect(caption).toHaveTextContent(/아웃바운드 규칙이 없어도/)
    expect(caption).toHaveTextContent(/네트워크 ACL/)
    expect(caption.textContent!.length).toBeGreaterThan(40)
  })

  it('요청 캡션은 기본 규칙이 두 기능에서 반대라는 조건을 담는다', async () => {
    const { container } = render(<SgNaclBoundaryDiagram />)
    await selectScenario('들어오는 요청')

    expect(container.querySelector('figcaption')).toHaveTextContent(/기본/)
    expect(container.querySelector('figcaption')!.textContent!.length).toBeGreaterThan(40)
  })

  it('전체를 누르면 흐린 노드와 보이는 경로가 사라진다', async () => {
    render(<SgNaclBoundaryDiagram />)
    await selectScenario('그 응답')

    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(diagram().querySelectorAll('rect[stroke-dasharray]')).toHaveLength(0)
  })

  it('공유 본문에서 상태 저장과 상태 비저장 뒤에만 실등록 도식을 표시한다', () => {
    render(<ConceptList headingLevel={4} concepts={[
      { id: 'security-groups-nacl.nacl', name: 'NACL', summary: '요약', paragraphs: ['앞 본문'] },
      { id: 'security-groups-nacl.security-group-stateful-vs-nacl-stateless', name: '상태', summary: '요약', paragraphs: ['비교 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: '보안 그룹과 네트워크 ACL 경계 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 'security-groups-nacl.security-group-stateful-vs-nacl-stateless')
    expect(figure.previousElementSibling).toHaveTextContent('비교 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })

  it('여러 번 렌더해도 화살표 마커가 다른 도식과 충돌하지 않는다', async () => {
    const { container } = render(<><SgNaclBoundaryDiagram /><SgNaclBoundaryDiagram /></>)
    await act(async () => {
      for (const button of screen.getAllByRole('button', { name: '들어오는 요청' })) await userEvent.click(button)
    })

    const markers = Array.from(container.querySelectorAll('marker'))
    expect(new Set(markers.map((marker) => marker.id)).size).toBe(2)
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg.querySelector('[data-path]')).toHaveAttribute('marker-end', `url(#${svg.querySelector('marker')!.id})`)
    }
  })
})
