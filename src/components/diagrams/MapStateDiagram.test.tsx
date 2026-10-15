import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { stripListMarker } from '../../lib/paragraph-blocks'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { MapStateDiagram, mapStateScenarios } from './MapStateDiagram'

const topicId = 'api-gateway-step-functions'
const anchorConceptId = `${topicId}.step-functions-map-state`
const headConceptId = `${topicId}.step-functions`
const labels = {
  list: '목록', loop: '목록을 도는 반복문', map: 'Map 상태',
  'loop-fn-1': '함수', 'loop-fn-2': '함수', 'loop-fn-3': '함수',
  'map-fn-1': '함수', 'map-fn-2': '함수', 'map-fn-3': '함수',
}
const managedNodes = ['map', 'loop-fn-1', 'loop-fn-2', 'loop-fn-3', 'map-fn-1', 'map-fn-2', 'map-fn-3']
const groupLabels = { 'one-function': 'Lambda 함수 하나', machine: '상태 머신' }
const notes = {
  'time-limit': { label: '항목이 늘면 15분 제한', x: 70, y: 200, anchor: 'middle' },
  'per-item': { label: '항목마다 한 번씩', x: 210, y: 200, anchor: 'middle' },
}
const expectedPaths: Record<string, string> = {
  'list-loop': 'M100 40 V80',
  'list-map': 'M198 24 H230 V80',
  'loop-fn-1': 'M30 112 V152',
  'loop-fn-2': 'M70 112 V152',
  'loop-fn-3': 'M110 112 V152',
  'map-fn-1': 'M170 112 V152',
  'map-fn-2': 'M210 112 V152',
  'map-fn-3': 'M250 112 V152',
}
const question = '함수를 고치지 않고 15분 제한을 벗어나려면?'
const idleCaption = '방식을 고르면 목록의 반복을 누가 맡는지 볼 수 있다.'
const legend = '파랑: Lambda 함수와 Map 상태 · 회색: 처리할 목록과 함수 안의 반복문. 함수 셋은 여러 번 부른다는 표시다.'
const expectedScenarios = [
  {
    id: 'loop', label: '함수 안 반복문',
    nodes: ['list', 'loop', 'loop-fn-1', 'loop-fn-2', 'loop-fn-3'],
    paths: ['list-loop', 'loop-fn-1', 'loop-fn-2', 'loop-fn-3'], notes: ['time-limit'],
    caption: '함수 하나가 목록을 돌며 다른 함수를 부르는 구조는 항목 수가 늘면 15분 제한에 걸린다.',
    sources: [anchorConceptId],
  },
  {
    id: 'map', label: 'Map 상태',
    nodes: ['list', 'map', 'map-fn-1', 'map-fn-2', 'map-fn-3'],
    paths: ['list-map', 'map-fn-1', 'map-fn-2', 'map-fn-3'], notes: ['per-item'],
    caption: '반복을 상태 머신이 맡아 항목마다 함수를 한 번씩 부른다. 기존 함수 코드는 고치지 않는다.',
    sources: [anchorConceptId],
  },
]

function diagram() {
  return screen.getByRole('img', { name: '함수 안 반복문과 Map 상태의 항목별 호출' })
}

async function selectScenario(label: string) {
  await act(async () => { await userEvent.click(screen.getByRole('button', { name: label })) })
}

function readBox(rect: Element) {
  return {
    id: rect.getAttribute('data-group') ?? rect.parentElement?.getAttribute('data-node') ?? '',
    x: Number(rect.getAttribute('x')), y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')), height: Number(rect.getAttribute('height')),
  }
}

describe('MapStateDiagram', () => {
  it('물음형 제목을 헤딩 없이 시나리오 버튼보다 앞에 보인다', () => {
    render(<MapStateDiagram />)
    const title = screen.getByText(question)

    expect(title.tagName).toBe('P')
    expect(title).toHaveClass('text-sm', 'text-title')
    expect(title.compareDocumentPosition(screen.getByRole('button', { name: '전체' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('처음에는 노드 아홉이 모두 선명하고 경로·곁말 없이 선택 안내가 나온다', () => {
    const { container } = render(<MapStateDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
  })

  it.each(expectedScenarios)('$label: 지정한 노드·경로·곁말만 보이고 나머지 노드는 흐려진다', async (scenario) => {
    const { container } = render(<MapStateDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path'))).toEqual(scenario.paths)
    for (const path of paths) {
      expect(path).toHaveAttribute('d', expectedPaths[path.getAttribute('data-path')!])
      expect(path).toHaveAttribute('stroke-width', '2')
      expect(path).toHaveAttribute('marker-end', `url(#${diagram().querySelector('marker')!.id})`)
      expect(path).toHaveClass('stroke-title')
      expect(path.closest('[opacity]')).toBeNull()
    }
    expect(Array.from(diagram().querySelectorAll('[data-note]'), (note) => note.getAttribute('data-note'))).toEqual(scenario.notes)
    expect(container.querySelector('figcaption')!.textContent).toBe(scenario.caption)
    expect(container.querySelector('figcaption')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('button', { name: scenario.label })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('함수 안 반복문에서는 Map 쪽 넷이, Map 상태에서는 반복문 쪽 넷이 흐리고 목록은 둘 다 선명하다', async () => {
    render(<MapStateDiagram />)
    const dimmed: Record<string, string[]> = {
      '함수 안 반복문': ['map', 'map-fn-1', 'map-fn-2', 'map-fn-3'],
      'Map 상태': ['loop', 'loop-fn-1', 'loop-fn-2', 'loop-fn-3'],
    }
    for (const [label, ids] of Object.entries(dimmed)) {
      await selectScenario(label)
      for (const id of ids) {
        expect(diagram().querySelector(`[data-node="${id}"]`), `${label}: ${id}`).toHaveAttribute('opacity', '0.25')
      }
      expect(diagram().querySelector('[data-node="list"]'), label).toHaveAttribute('opacity', '1')
    }
  })

  it('목록에서 나가는 경로는 각자 자기 시나리오에서만 보인다', async () => {
    render(<MapStateDiagram />)
    const visibleIn: Record<string, string[]> = {
      'list-loop': ['loop'],
      'list-map': ['map'],
    }
    for (const scenario of expectedScenarios) {
      await selectScenario(scenario.label)
      for (const [pathId, scenarioIds] of Object.entries(visibleIn)) {
        expect(diagram().querySelector(`[data-path="${pathId}"]`) !== null, `${scenario.id}: ${pathId}`).toBe(scenarioIds.includes(scenario.id))
      }
    }
  })

  it('Map 상태로 가는 경로는 그룹 라벨 오른쪽으로 내려가 Map 상태 위 변에 닿는다', async () => {
    render(<MapStateDiagram />)
    await selectScenario('Map 상태')
    const groupLabel = diagram().querySelector('[data-group-label="machine"]')!
    const labelRight = Number(groupLabel.getAttribute('x')) + estimateTextWidth(groupLabel.textContent!, 9)
    const map = readBox(diagram().querySelector('[data-node="map"] rect')!)
    const [, x, y] = diagram().querySelector('[data-path="list-map"]')!.getAttribute('d')!.match(/H(\d+) V(\d+)$/u)!.map(Number)

    expect(x).toBeGreaterThan(labelRight)
    expect(x).toBeGreaterThan(map.x)
    expect(x).toBeLessThan(map.x + map.width)
    expect(y).toBe(map.y)
  })

  it('시나리오를 바꾸면 이전 경로·곁말이 사라지고 전체를 누르면 초기 상태로 돌아온다', async () => {
    const { container } = render(<MapStateDiagram />)
    for (const scenario of [...expectedScenarios, expectedScenarios[0]]) {
      await selectScenario(scenario.label)
      expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path'))).toEqual(scenario.paths)
      expect(Array.from(diagram().querySelectorAll('[data-note]'), (note) => note.getAttribute('data-note'))).toEqual(scenario.notes)
    }
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    for (const { label } of expectedScenarios) expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'false')
  })

  it('관문 5·7: 그룹 둘과 노드 아홉이 280×212 viewBox 안에 있고 반복문과 Map 상태가 각자 그룹 안에 있다', () => {
    render(<MapStateDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)
    const frameOf = (id: string) => {
      const group = boxes.find((box) => box.id === id)!
      return [group.x, group.y, group.width, group.height] as [number, number, number, number]
    }
    const pick = (ids: string[]) => boxes.filter((box) => ids.includes(box.id))

    expect([x, y, width, height]).toEqual([0, 0, 280, 212])
    expect(boxes).toHaveLength(11)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
    expect(boxesOutsideViewBox(pick(['loop']), frameOf('one-function'))).toEqual([])
    expect(boxesOutsideViewBox(pick(['map']), frameOf('machine'))).toEqual([])
    for (const outsider of pick(['list', ...managedNodes.filter((id) => id !== 'map')])) {
      expect(boxesOutsideViewBox([outsider], frameOf('one-function')), outsider.id).toHaveLength(1)
      expect(boxesOutsideViewBox([outsider], frameOf('machine')), outsider.id).toHaveLength(1)
    }
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 노드 라벨은 크기 10이고 높이 32 상자 안에 여백 12를 남기며 청록을 쓰지 않는다', () => {
    render(<MapStateDiagram />)
    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const rect = node.querySelector('rect')!
      const box = readBox(rect)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(box.height).toBe(32)
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      expect(rect).toHaveClass(managedNodes.includes(id) ? 'stroke-diagram-managed' : 'stroke-disabled')
    }
    expect(diagram().querySelector('.stroke-diagram-resource, .fill-diagram-resource')).toBeNull()
  })

  it.each(['전체', ...expectedScenarios.map(({ label }) => label)])('%s: 그룹은 흐려지지 않고 그룹 라벨·곁말은 크기 9로 가로 범위 안에 있다', async (label) => {
    render(<MapStateDiagram />)
    await selectScenario(label)
    expect(diagram().querySelectorAll('[data-group]')).toHaveLength(2)
    expect(diagram().querySelectorAll('[data-group-label]')).toHaveLength(2)
    for (const [id, wording] of Object.entries(groupLabels)) {
      const group = diagram().querySelector(`[data-group="${id}"]`)!
      const groupLabel = diagram().querySelector(`[data-group-label="${id}"]`)!
      expect(group.closest('[opacity]')).toBeNull()
      expect(groupLabel.closest('[opacity]')).toBeNull()
      expect(groupLabel.textContent).toBe(wording)
      expect(groupLabel).toHaveAttribute('x', String(Number(group.getAttribute('x')) + 10))
      expect(groupLabel).toHaveAttribute('y', String(Number(group.getAttribute('y')) + 14))
    }
    for (const text of diagram().querySelectorAll('[data-group-label], [data-note]')) {
      expect(text).toHaveAttribute('font-size', '9')
      expect(text).toHaveClass('fill-muted')
      const x = Number(text.getAttribute('x'))
      const width = estimateTextWidth(text.textContent!, 9)
      const anchor = text.getAttribute('text-anchor')
      const left = anchor === 'end' ? x - width : anchor === 'middle' ? x - width / 2 : x
      expect(left, text.textContent!).toBeGreaterThanOrEqual(0)
      expect(left + width, text.textContent!).toBeLessThanOrEqual(280)
    }
    for (const note of diagram().querySelectorAll('[data-note]')) {
      const expected = notes[note.getAttribute('data-note')! as keyof typeof notes]
      expect(note.textContent).toBe(expected.label)
      expect(note).toHaveAttribute('x', String(expected.x))
      expect(note).toHaveAttribute('y', String(expected.y))
      expect(note).toHaveAttribute('text-anchor', expected.anchor)
      expect(note.closest('[opacity]')).toBeNull()
    }
  })

  it('JSON과 컴포넌트의 시나리오 id가 같고 지정한 문구·근거를 JSON에서 읽는다', () => {
    render(<MapStateDiagram />)
    const text = visualsByTopicId[topicId].diagrams['map-state']
    const ids = mapStateScenarios.map(({ id }) => id).sort()
    const conceptIds = topics.find(({ id }) => id === topicId)!.concepts.map(({ id }) => id)

    expect(ids).toEqual(['loop', 'map'])
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual(groupLabels)
    expect(text.notes).toEqual(Object.fromEntries(Object.entries(notes).map(([id, note]) => [id, note.label])))
    expect(text.question).toBe(question)
    expect(text.idleCaption).toBe(idleCaption)
    expect(text.legend).toBe(legend)
    expect(text.sources).toEqual([headConceptId, anchorConceptId])
    expect(text.label).toBe('Map 상태 도식')
    expect(text.svgLabel).toBe('함수 안 반복문과 Map 상태의 항목별 호출')
    expect(screen.getByText(legend)).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['전체', ...expectedScenarios.map(({ label }) => label)])
    for (const expected of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === expected.id)!
      const scenario = mapStateScenarios.find(({ id }) => id === expected.id)!
      expect(wording).toEqual({ id: expected.id, label: expected.label, caption: expected.caption, sources: expected.sources })
      expect(scenario.label).toBe(wording.label)
      expect(scenario.caption).toBe(wording.caption)
      expect(wording.caption.length).toBeLessThanOrEqual(57)
    }
    for (const source of [...text.sources, ...text.scenarios.flatMap(({ sources }) => sources)]) {
      expect(conceptIds).toContain(source)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 Map 상태 개념 본문 바로 뒤에 도식을 붙인다', (headingLevel) => {
    const concept = topics.find(({ id }) => id === topicId)!.concepts.find(({ id }) => id === anchorConceptId)!
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: 'Map 상태 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(screen.getAllByRole('figure')).toEqual([figure])
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.map(stripListMarker).join('').replace(/\*\*/gu, ''))
    expect(figure.closest('article')!.lastElementChild).toBe(figure)
    expect(within(figure).queryByRole('heading')).toBeNull()
  })

  it('두 번 렌더해도 화살표 마커 id가 겹치지 않고 각 경로가 자기 마커를 가리킨다', async () => {
    render(<><MapStateDiagram /><MapStateDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: 'Map 상태 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: 'Map 상태' })) })
      expect(figure.querySelectorAll('[data-path]')).toHaveLength(4)
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    expect(new Set(figures.map((figure) => figure.querySelector('marker')!.id)).size).toBe(2)
  })
})
