import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WIDE_DIAGRAM_QUERY } from '../../hooks/useWideDiagram'
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
    expect(screen.getAllByRole('figure')).toEqual([figure, expect.any(HTMLElement)])
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

  describe('가로형 (768px 이상)', () => {
    const scenarioRoutes: [string, string[], string[], RegExp][] = [
      ['들어오는 요청', ['nacl-in', 'sg-in'], ['outside-nacl-in', 'nacl-in-sg-in', 'sg-in-resource'], /기본/],
      ['그 응답', ['sg-out', 'nacl-out'], ['resource-sg-out', 'sg-out-nacl-out', 'nacl-out-outside'], /아웃바운드 규칙이 없어도/],
    ]
    const boundaryNotes: [string, string][] = [
      ['서브넷 경계 = 네트워크 ACL', 'nacl-boundary'],
      ['IP만 · 허용과 차단 · 상태 비저장', 'nacl-boundary'],
      ['리소스 경계 = 보안 그룹', 'sg-boundary'],
      ['리소스·IP · 허용만 · 상태 저장', 'sg-boundary'],
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
      for (const [label] of scenarioRoutes) {
        await selectScenario(label)
        for (const path of diagram().querySelectorAll('[data-path]')) ids.add(path.getAttribute('data-path')!)
      }
      return [...ids].sort()
    }

    function ids(selector: string, attribute: string) {
      return Array.from(diagram().querySelectorAll(selector), (element) => element.getAttribute(attribute)).sort()
    }

    // 직교 경로 'M64 148 H88'의 시작 x와 끝 x를 읽는다.
    function pathEnds(id: string) {
      const d = diagram().querySelector(`[data-path="${id}"]`)!.getAttribute('d')!
      const [, startX] = d.match(/^M(\d+) \d+/)!
      const [, endX] = d.match(/H(\d+)$/)!
      return { start: Number(startX), end: Number(endX) }
    }

    beforeEach(() => {
      mockMatchMedia(true)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('440×232 viewBox를 w-full 래퍼 하나로 그리고 SVG 속성과 화살표를 유지한다', () => {
      render(<SgNaclBoundaryDiagram />)

      expect(screen.getAllByRole('img')).toHaveLength(1)
      expect(diagram()).toHaveAttribute('viewBox', '0 0 440 232')
      expect(diagram()).toHaveAttribute('class', 'block h-auto w-full')
      expect(diagram().parentElement).toHaveAttribute('class', 'w-full')
      expect(diagram().parentElement).not.toHaveClass('max-w-[380px]', '-mx-4')
      expect(diagram().querySelector('marker')).not.toBeNull()
    })

    it('노드·그룹 id 집합과 시나리오로 나타나는 경로 id 합집합이 세로형과 같다', async () => {
      const { change } = mockMatchMedia(false)
      render(<SgNaclBoundaryDiagram />)
      expect(diagram()).toHaveAttribute('viewBox', '0 0 280 360')
      const tallNodes = ids('[data-node]', 'data-node')
      const tallGroups = ids('[data-group]', 'data-group')
      const tallPaths = await collectPathIds()

      act(() => change(true))

      expect(diagram()).toHaveAttribute('viewBox', '0 0 440 232')
      expect(ids('[data-node]', 'data-node')).toEqual(tallNodes)
      expect(tallNodes).toEqual(Object.keys(labels).sort())
      expect(ids('[data-group]', 'data-group')).toEqual(tallGroups)
      expect(tallGroups).toEqual(['nacl-boundary', 'sg-boundary'])
      expect(tallPaths).toHaveLength(6)
      expect(await collectPathIds()).toEqual(tallPaths)
    })

    it('노드 여덟과 경계 둘의 모든 rect가 440×232 viewBox 안에 있다', () => {
      render(<SgNaclBoundaryDiagram />)
      const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

      expect(boxes).toHaveLength(10)
      expect(boxesOutsideViewBox(boxes, [0, 0, 440, 232])).toEqual([])
    })

    it('라벨 여덟이 글자 크기 10과 여백 12로 들어가고 경계 글자 넷이 자기 박스 오른쪽 끝을 넘지 않는다', () => {
      render(<SgNaclBoundaryDiagram />)

      for (const [id, label] of Object.entries(labels)) {
        const text = diagram().querySelector(`[data-node="${id}"] text`)!
        const box = nodeBox(id)
        expect(text.textContent).toBe(label)
        expect(text).toHaveAttribute('font-size', '10')
        expect(Number(text.getAttribute('x'))).toBe(box.x + box.width / 2)
        expect(Number(text.getAttribute('y'))).toBe(box.y + box.height / 2)
        expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      }

      for (const [label, group] of boundaryNotes) {
        const box = groupBox(group)
        const text = within(diagram()).getByText(label)
        expect(text.closest('[font-size]')).toHaveAttribute('font-size', '9')
        expect(text.closest('.fill-muted')).not.toBeNull()
        expect(Number(text.getAttribute('x')) + estimateTextWidth(label, 9), label).toBeLessThanOrEqual(box.x + box.width)
      }
    })

    it.each(scenarioRoutes)('%s는 세로형과 같은 노드·경로·캡션을 보인다', async (label, cells, expected, content) => {
      const { container } = render(<SgNaclBoundaryDiagram />)
      const caption = container.querySelector('figcaption')!
      const idle = caption.textContent
      await selectScenario(label)

      const activeNodes = Array.from(diagram().querySelectorAll('[data-node][opacity="1"]'), (node) => node.getAttribute('data-node'))
      expect(activeNodes.sort()).toEqual(['ec2', 'rds', 'outside', 'resource', ...cells].sort())
      const paths = Array.from(diagram().querySelectorAll('[data-path]'))
      expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(expected)
      for (const path of paths) {
        expect(path.getAttribute('d')).toMatch(/^M\d+ \d+( [HV]\d+)+$/)
        expect(path).toHaveAttribute('stroke-width', '2')
        expect(path).toHaveAttribute('marker-end')
        expect(path).toHaveClass('stroke-title')
      }
      for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
      const dashed = Array.from(diagram().querySelectorAll('rect[stroke-dasharray]'), readBox).map((box) => box.id)
      expect(dashed).toEqual(label === '그 응답' ? ['sg-out'] : [])
      expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
      expect(caption.textContent).not.toBe(idle)
      expect(caption.textContent!.length).toBeGreaterThan(40)
      expect(caption).toHaveTextContent(content)
      expect(caption).toHaveAttribute('aria-live', 'polite')

      await selectScenario('전체')

      for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
      expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
      expect(diagram().querySelectorAll('rect[stroke-dasharray]')).toHaveLength(0)
    })

    it('보안 그룹 경계가 NACL 경계 안쪽에 들어가 리소스 둘을 감싸고 경계 글자 넷은 각자의 경계 안에 있다', () => {
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

      for (const [label, group] of boundaryNotes) {
        const box = groupBox(group)
        const text = within(diagram()).getByText(label)
        const x = Number(text.getAttribute('x'))
        const y = Number(text.getAttribute('y'))
        expect(x, label).toBeGreaterThan(box.x)
        expect(y, label).toBeGreaterThan(box.y)
        expect(y, label).toBeLessThan(box.y + box.height)
        if (group === 'nacl-boundary') expect(y, label).toBeLessThan(sg.y)
      }
    })

    it('요청 칸은 윗줄, 응답 칸은 아랫줄에 서고 바깥과 리소스는 두 줄을 모두 덮는다', () => {
      render(<SgNaclBoundaryDiagram />)
      const top = nodeBox('nacl-in')
      const bottom = nodeBox('nacl-out')

      expect(nodeBox('sg-in').y).toBe(top.y)
      expect(nodeBox('sg-out').y).toBe(bottom.y)
      expect(bottom.y).toBeGreaterThan(top.y + top.height)
      for (const id of ['outside', 'resource']) {
        const box = nodeBox(id)
        expect(box.height, id).toBe(76)
        expect(box.y, id).toBeLessThanOrEqual(top.y)
        expect(box.y + box.height, id).toBeGreaterThanOrEqual(bottom.y + bottom.height)
      }
      expect(nodeBox('outside').x + nodeBox('outside').width).toBeLessThanOrEqual(top.x)
      expect(nodeBox('resource').x).toBeGreaterThanOrEqual(nodeBox('sg-in').x + nodeBox('sg-in').width)
      expect(Number(within(diagram()).getByText('요청 방향').getAttribute('y'))).toBeLessThan(top.y)
      expect(Number(within(diagram()).getByText('응답 방향').getAttribute('y'))).toBeGreaterThan(bottom.y + bottom.height)
    })

    it('요청 경로 셋은 오른쪽으로, 응답 경로 셋은 왼쪽으로 간다', async () => {
      render(<SgNaclBoundaryDiagram />)

      await selectScenario('들어오는 요청')
      for (const id of ['outside-nacl-in', 'nacl-in-sg-in', 'sg-in-resource']) {
        const { start, end } = pathEnds(id)
        expect(end, id).toBeGreaterThan(start)
      }

      await selectScenario('그 응답')
      for (const id of ['resource-sg-out', 'sg-out-nacl-out', 'nacl-out-outside']) {
        const { start, end } = pathEnds(id)
        expect(end, id).toBeLessThan(start)
      }
    })

    it('세로형에서 고른 시나리오가 폭을 바꾸어도 유지된다', async () => {
      const { change } = mockMatchMedia(false)
      const { container } = render(<SgNaclBoundaryDiagram />)
      expect(diagram()).toHaveAttribute('viewBox', '0 0 280 360')
      await selectScenario('그 응답')
      const caption = container.querySelector('figcaption')!.textContent

      act(() => change(true))

      expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(440)
      expect(screen.getByRole('button', { name: '그 응답' })).toHaveAttribute('aria-pressed', 'true')
      expect(container.querySelector('figcaption')!.textContent).toBe(caption)
      expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path')))
        .toEqual(['resource-sg-out', 'sg-out-nacl-out', 'nacl-out-outside'])
    })
  })
})
