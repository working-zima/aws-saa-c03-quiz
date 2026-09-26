import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { DrChoiceDiagram, drChoiceScenarios } from './DrChoiceDiagram'

const labels = {
  onprem: '온프레미스', aws: 'AWS',
  'rto-hours': '몇 시간', 'rto-seconds': '60초처럼 짧음',
  'backup-restore': '백업 및 복원', 'warm-standby': '대기 리전', drs: 'Elastic Disaster Recovery',
}
const groups = [
  { id: 'source', label: '원본 위치', nodes: ['onprem', 'aws'] },
  { id: 'rto', label: '복구 시간 목표', nodes: ['rto-hours', 'rto-seconds'] },
  { id: 'strategy', label: '재해 복구 방식', nodes: ['backup-restore', 'warm-standby', 'drs'] },
]
const expectedScenarios = [
  { id: 'r1', label: '백업 및 복원', nodes: ['aws', 'rto-hours', 'backup-restore'], paths: ['aws-hours', 'hours-backup-restore'], source: 'backup-and-restore-dr' },
  { id: 'r2', label: '대기 리전', nodes: ['aws', 'rto-seconds', 'warm-standby'], paths: ['aws-seconds', 'seconds-warm-standby'], source: 'warm-standby-for-low-rto' },
  { id: 'r3', label: 'Elastic Disaster Recovery', nodes: ['onprem', 'drs'], paths: ['onprem-drs'], source: 'elastic-disaster-recovery' },
]
const connections: Record<string, string[]> = {
  'aws-hours': ['aws', 'rto-hours'],
  'hours-backup-restore': ['rto-hours', 'backup-restore'],
  'aws-seconds': ['aws', 'rto-seconds'],
  'seconds-warm-standby': ['rto-seconds', 'warm-standby'],
  'onprem-drs': ['onprem', 'drs'],
}

function diagram() {
  return screen.getByRole('img', { name: '재해 복구 방식 선택' })
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

async function selectScenario(label: string) {
  await act(async () => {
    await userEvent.click(screen.getByRole('button', { name: label }))
  })
}

describe('DrChoiceDiagram', () => {
  it('처음에는 일곱 노드가 모두 선명하고 경로가 없다', () => {
    const { container } = render(<DrChoiceDiagram />)
    const nodes = Array.from(diagram().querySelectorAll('[data-node]'))

    expect(nodes.map((node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(visualsByTopicId['backup-disaster-recovery'].diagrams['dr-choice'].idleCaption)
  })

  it.each(expectedScenarios)('$label은 지정한 노드와 경로만 표시하고 근거 캡션을 읽는다', async (scenario) => {
    const { container } = render(<DrChoiceDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    for (const group of diagram().querySelectorAll('[data-group]')) expect(group.closest('[opacity]')).toBeNull()
    for (const { label } of groups) expect(within(diagram()).getByText(label).closest('[opacity]')).toBeNull()
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(scenario.paths)
    for (const path of paths) {
      expect(path).toHaveClass('stroke-title')
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end', `url(#${diagram().querySelector('marker')!.id})`)
    }
    const wording = visualsByTopicId['backup-disaster-recovery'].diagrams['dr-choice'].scenarios.find(({ id }) => id === scenario.id)!
    expect(container.querySelector('figcaption')!.textContent).toBe(wording.caption)
    expect(container.querySelector('figcaption')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('button', { name: scenario.label })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('온프레미스로 바꾸면 두 RTO 노드는 흐려지고 이전 경로가 사라지며 전체로 초기화된다', async () => {
    const { container } = render(<DrChoiceDiagram />)
    await selectScenario('대기 리전')
    await selectScenario('Elastic Disaster Recovery')

    expect(screen.getByRole('button', { name: '대기 리전' })).toHaveAttribute('aria-pressed', 'false')
    for (const id of ['rto-hours', 'rto-seconds']) expect(diagram().querySelector(`[data-node="${id}"]`)).toHaveAttribute('opacity', '0.25')
    expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path'))).toEqual(['onprem-drs'])

    await selectScenario('전체')
    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(container.querySelector('figcaption')!.textContent).toBe(visualsByTopicId['backup-disaster-recovery'].diagrams['dr-choice'].idleCaption)
  })

  it('관문 5: 노드와 그룹의 모든 상자가 viewBox 안에 있다', () => {
    render(<DrChoiceDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(10)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
  })

  it('관문 6: 방식 노드는 240×44이고 윗줄 9·아랫줄 10 각각 여백 12를 남긴다', () => {
    render(<DrChoiceDiagram />)
    const text = visualsByTopicId['backup-disaster-recovery'].diagrams['dr-choice']

    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const box = readBox(node.querySelector('rect')!)
      const lines = Array.from(node.querySelectorAll('text'))
      const strategy = groups[2].nodes.includes(id)
      expect(lines).toHaveLength(strategy ? 2 : 1)
      if (strategy) {
        expect(box.width).toBe(240)
        expect(box.height).toBe(44)
        expect(lines[0].textContent).toBe(text.nodeNotes![id])
        expect(lines[0]).toHaveClass('fill-muted')
        expect(Number(lines[0].getAttribute('y'))).toBeLessThan(Number(lines[1].getAttribute('y')))
      }
      expect(lines[lines.length - 1].textContent).toBe(label)
      expect(lines[lines.length - 1]).toHaveClass('fill-title')
      for (const [index, line] of lines.entries()) {
        const fontSize = strategy && index === 0 ? 9 : 10
        expect(line.textContent!.trim().length).toBeGreaterThan(0)
        expect(line).toHaveAttribute('font-size', String(fontSize))
        expect(estimateTextWidth(line.textContent!, fontSize) + 12, `${id}: ${line.textContent}`).toBeLessThanOrEqual(box.width)
        expect(Number(line.getAttribute('y'))).toBeGreaterThan(box.y)
        expect(Number(line.getAttribute('y'))).toBeLessThan(box.y + box.height)
      }
    }
  })

  it('관문 7: 폭 280과 최대 표시 폭 380px·모바일 여백 보정·좌측 정렬을 지킨다', () => {
    render(<DrChoiceDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('원본·RTO·방식 순으로 그룹을 쌓고 각 노드는 자기 그룹 안에 둔다', () => {
    render(<DrChoiceDiagram />)
    const boxes = Array.from(diagram().querySelectorAll('[data-group]'), readBox)
    expect(boxes.map(({ id }) => id)).toEqual(groups.map(({ id }) => id))

    for (const [index, { id, label, nodes }] of groups.entries()) {
      const group = boxes[index]
      const children = nodes.map((nodeId) => readBox(diagram().querySelector(`[data-node="${nodeId}"] rect`)!))
      expect(boxesOutsideViewBox(children, [group.x, group.y, group.width, group.height]), id).toEqual([])
      expect(within(diagram()).getByText(label)).toHaveAttribute('font-size', '9')
      if (index > 0) expect(boxes[index - 1].y + boxes[index - 1].height).toBeLessThan(group.y)
      if (id === 'strategy') {
        for (let i = 1; i < children.length; i++) expect(children[i - 1].y + children[i - 1].height).toBeLessThan(children[i].y)
      }
    }
  })

  it.each(expectedScenarios)('$label 경로는 실제 높이 44까지 노드 내부를 피하고 출발·도착 경계에 닿는다', async (scenario) => {
    render(<DrChoiceDiagram />)
    await selectScenario(scenario.label)
    const nodes = Array.from(diagram().querySelectorAll('[data-node] rect'), readBox)

    for (const path of diagram().querySelectorAll('[data-path]')) {
      const d = path.getAttribute('d')!
      expect(d).toMatch(/^M\d+ \d+(?: [HV]\d+)+$/)
      const [, startX, startY] = d.match(/^M(\d+) (\d+)/)!.map(Number)
      let x = startX, y = startY
      for (const [, command, value] of d.matchAll(/([HV])(\d+)/g)) {
        const nextX = command === 'H' ? Number(value) : x
        const nextY = command === 'V' ? Number(value) : y
        for (const node of nodes) {
          const crosses = command === 'H'
            ? node.y < y && y < node.y + node.height && Math.min(Math.max(x, nextX), node.x + node.width) > Math.max(Math.min(x, nextX), node.x)
            : node.x < x && x < node.x + node.width && Math.min(Math.max(y, nextY), node.y + node.height) > Math.max(Math.min(y, nextY), node.y)
          expect(crosses, `${path.getAttribute('data-path')} → ${node.id}`).toBe(false)
        }
        x = nextX
        y = nextY
      }
      const [source, target] = connections[path.getAttribute('data-path')!]
      for (const [id, pointX, pointY] of [[source, startX, startY], [target, x, y]] as const) {
        const box = nodes.find((node) => node.id === id)!
        expect(pointX).toBeGreaterThanOrEqual(box.x)
        expect(pointX).toBeLessThanOrEqual(box.x + box.width)
        expect(pointY).toBeGreaterThanOrEqual(box.y)
        expect(pointY).toBeLessThanOrEqual(box.y + box.height)
        expect(pointX === box.x || pointX === box.x + box.width || pointY === box.y || pointY === box.y + box.height).toBe(true)
      }
    }
  })

  it('JSON의 문구·시나리오 id와 구현이 일치하고 세 근거 개념만 사용한다', () => {
    render(<DrChoiceDiagram />)
    const text = visualsByTopicId['backup-disaster-recovery'].diagrams['dr-choice']

    expect(screen.getByRole('figure', { name: text.label })).toBeInTheDocument()
    expect(diagram()).toHaveAttribute('aria-label', text.svgLabel)
    expect(screen.getByText(text.legend!)).toBeInTheDocument()
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual(Object.fromEntries(groups.map(({ id, label }) => [id, label])))
    expect(Object.keys(text.nodeNotes!).sort()).toEqual([...groups[2].nodes].sort())
    expect(text.sources).toEqual(expectedScenarios.map(({ source }) => `backup-disaster-recovery.${source}`))
    expect(text.idleCaption).toMatch(/원본 위치.*복구 시간 목표/)
    expect(text.scenarios.map(({ id }) => id).sort()).toEqual(expectedScenarios.map(({ id }) => id).sort())
    expect(drChoiceScenarios.map(({ id }) => id).sort()).toEqual(text.scenarios.map(({ id }) => id).sort())
    for (const { source, ...scenario } of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === scenario.id)!
      expect(wording.sources).toEqual([`backup-disaster-recovery.${source}`])
      expect(wording.caption.length).toBeLessThanOrEqual(50)
      expect(drChoiceScenarios.find(({ id }) => id === scenario.id)).toEqual({ ...scenario, caption: wording.caption })
    }
  })

  it('시간 막대·축·눈금·비용 아이콘·애니메이션 없이 방식만 파랑으로 표시한다', async () => {
    const { container } = render(<DrChoiceDiagram />)

    for (const label of ['전체', ...expectedScenarios.map(({ label }) => label)]) {
      await selectScenario(label)
      for (const rect of diagram().querySelectorAll('rect')) expect(rect.matches('[data-group], [data-node] > rect')).toBe(true)
      expect(diagram().querySelector('line, polyline, polygon, circle, image, animate, animateTransform, set')).toBeNull()
      for (const path of diagram().querySelectorAll('path')) expect(path.closest('marker') || path.hasAttribute('data-path')).toBeTruthy()
      for (const node of diagram().querySelectorAll('[data-node]')) {
        expect(node.querySelector('rect')).toHaveClass(groups[2].nodes.includes(node.getAttribute('data-node')!) ? 'stroke-diagram-managed' : 'stroke-disabled')
      }
      expect(container.innerHTML).not.toMatch(/diagram-resource|animate-|(?:stroke|fill|text|bg)-(?:red|green|amber|purple|indigo)/)
      expect(container.textContent).not.toMatch(/\p{Extended_Pictographic}|DataSync|Storage Gateway|파일럿 라이트|다중 사이트/u)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 세 방식 중 마지막 개념 뒤에만 연결한다', (headingLevel) => {
    const concepts = topics.find(({ id }) => id === 'backup-disaster-recovery')!.concepts.slice(-3)
    render(<ConceptList concepts={concepts} headingLevel={headingLevel} />)

    const figure = screen.getByRole('figure', { name: '재해 복구 방식 선택 도식' })
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(figure.closest('article')).toHaveAttribute('id', 'backup-disaster-recovery.elastic-disaster-recovery')
    expect(figure.previousElementSibling?.textContent).toBe(concepts[2].paragraphs.join(''))
    expect(within(figure).queryByRole('heading')).toBeNull()
  })
})
