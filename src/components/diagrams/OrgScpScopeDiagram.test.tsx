import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { OrgScpScopeDiagram, orgScpScopeScenarios } from './OrgScpScopeDiagram'

const topicId = 'organizations-cloudtrail-config'
const sourceConceptId = `${topicId}.scp-attachment-targets`
const ouConceptId = `${topicId}.organizational-unit`
const labels = {
  scp: 'SCP', management: '관리 계정',
  'account-a': '계정 A', 'account-b': '계정 B', 'account-c': '계정 C',
}
const groupLabels = { root: '조직 · 루트', 'ou-1': 'OU 1', 'ou-2': 'OU 2' }
const expectedPaths: Record<string, string> = {
  'scp-root': 'M140 40 V56',
  'scp-ou': 'M140 40 V120 H100 V128',
  'scp-account': 'M190 40 V48 H240 V150',
}
const question = 'SCP를 어디에 붙이면 어느 계정까지 걸릴까?'
const idleCaption = '붙이는 자리를 고르면 SCP가 걸리는 계정을 볼 수 있다.'
const legend = '파랑: SCP · 청록: 계정. 화살표는 SCP를 붙인 자리를 가리킨다. 바깥 박스는 조직의 루트, 안쪽 박스는 OU다.'
const expectedScenarios = [
  {
    id: 'root', label: '루트에 SCP',
    nodes: ['scp', 'account-a', 'account-b', 'account-c'],
    paths: ['scp-root'], notes: ['management-exempt'],
    caption: '루트에 붙이면 제한할 생각이 없던 계정까지 모든 멤버 계정에 걸린다. 관리 계정은 예외다.',
    sources: [sourceConceptId],
  },
  {
    id: 'ou', label: 'OU에 SCP',
    nodes: ['scp', 'account-a', 'account-b'],
    paths: ['scp-ou'], notes: [],
    caption: 'OU에 붙이면 안에 든 계정 전부에 한 번에 걸려, 계정마다 정책을 복사하지 않아도 된다.',
    sources: [ouConceptId, sourceConceptId],
  },
  {
    id: 'account', label: '계정 하나에 SCP',
    nodes: ['scp', 'account-c'],
    paths: ['scp-account'], notes: [],
    caption: '개별 멤버 계정에도 직접 붙일 수 있다. SCP는 붙인 자리 아래에만 적용된다.',
    sources: [sourceConceptId],
  },
]

function diagram() {
  return screen.getByRole('img', { name: 'SCP를 붙인 자리와 걸리는 계정' })
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

describe('OrgScpScopeDiagram', () => {
  it('조직 주제의 시각 데이터를 로드하고 비교표와 약어 사전은 비워 둔다', () => {
    const visuals = visualsByTopicId[topicId]
    expect(visuals).toBeDefined()
    expect(Object.keys(visuals.diagrams)).toEqual(['scp-scope'])
    expect(visuals.tables).toEqual({})
    expect(visuals.glossary).toEqual([])
  })

  it('물음형 제목을 헤딩 없이 시나리오 버튼보다 앞에 보인다', () => {
    render(<OrgScpScopeDiagram />)
    const title = screen.getByText(question)

    expect(title.tagName).toBe('P')
    expect(title).toHaveClass('text-sm', 'text-title')
    expect(title.compareDocumentPosition(screen.getByRole('button', { name: '전체' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('처음에는 노드 다섯이 모두 선명하고 경로·곁말 없이 선택 안내가 나온다', () => {
    const { container } = render(<OrgScpScopeDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
  })

  it.each(expectedScenarios)('$label: 적용 계정과 부착 경로·곁말을 보이고 관리 계정은 흐리다', async (scenario) => {
    const { container } = render(<OrgScpScopeDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    expect(diagram().querySelector('[data-node="management"]')).toHaveAttribute('opacity', '0.25')
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

  it('붙이는 자리를 바꾸면 이전 경로·곁말이 사라지고 전체를 누르면 초기 상태로 돌아온다', async () => {
    const { container } = render(<OrgScpScopeDiagram />)
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

  it('관문 5·7: 그룹 셋과 노드 다섯이 280×256 안에 있고 관리 계정과 OU는 조직 안에 있다', () => {
    render(<OrgScpScopeDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect([x, y, width, height]).toEqual([0, 0, 280, 256])
    expect(boxes).toHaveLength(8)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
    const members = { root: ['management', 'ou-1', 'ou-2'], 'ou-1': ['account-a', 'account-b'], 'ou-2': ['account-c'] }
    for (const [groupId, memberIds] of Object.entries(members)) {
      const group = boxes.find(({ id }) => id === groupId)!
      expect(boxesOutsideViewBox(boxes.filter(({ id }) => memberIds.includes(id)), [group.x, group.y, group.width, group.height])).toEqual([])
    }
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 노드 라벨은 크기 10이고 높이 32 상자 안에 여백 12를 남기며 계층별 색을 쓴다', () => {
    render(<OrgScpScopeDiagram />)
    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const rect = node.querySelector('rect')!
      const box = readBox(rect)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(box.height).toBe(32)
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      expect(rect).toHaveClass(id === 'scp' ? 'stroke-diagram-managed' : 'stroke-diagram-resource')
    }
  })

  it.each(['전체', ...expectedScenarios.map(({ label }) => label)])('%s: 그룹은 흐려지지 않고 그룹 라벨·곁말은 크기 9로 가로 범위 안에 있다', async (label) => {
    render(<OrgScpScopeDiagram />)
    await selectScenario(label)
    expect(diagram().querySelectorAll('[data-group]')).toHaveLength(3)
    expect(diagram().querySelectorAll('[data-group-label]')).toHaveLength(3)
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
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x + width).toBeLessThanOrEqual(280)
    }
    for (const note of diagram().querySelectorAll('[data-note]')) {
      expect(note.textContent).toBe('SCP가 걸리지 않음')
      expect(note).toHaveAttribute('x', '150')
      expect(note).toHaveAttribute('y', '100')
      expect(note).toHaveAttribute('text-anchor', 'start')
      expect(note.closest('[opacity]')).toBeNull()
    }
  })

  it('JSON과 컴포넌트의 시나리오 id가 같고 지정한 문구와 존재하는 근거 개념을 JSON에서 읽는다', () => {
    render(<OrgScpScopeDiagram />)
    const text = visualsByTopicId[topicId].diagrams['scp-scope']
    const ids = orgScpScopeScenarios.map(({ id }) => id).sort()
    const conceptIds = topics.find(({ id }) => id === topicId)!.concepts.map(({ id }) => id)

    expect(ids).toEqual(['account', 'ou', 'root'])
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual(groupLabels)
    expect(text.notes).toEqual({ 'management-exempt': 'SCP가 걸리지 않음' })
    expect(text.question).toBe(question)
    expect(text.idleCaption).toBe(idleCaption)
    expect(text.legend).toBe(legend)
    expect(text.sources).toEqual([ouConceptId, sourceConceptId, `${topicId}.organizations-consolidated-billing`])
    expect(text.label).toBe('조직과 SCP 적용 범위 도식')
    expect(text.svgLabel).toBe('SCP를 붙인 자리와 걸리는 계정')
    expect(screen.getByText(legend)).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['전체', ...expectedScenarios.map(({ label }) => label)])
    for (const expected of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === expected.id)!
      const scenario = orgScpScopeScenarios.find(({ id }) => id === expected.id)!
      expect(wording).toEqual({ id: expected.id, label: expected.label, caption: expected.caption, sources: expected.sources })
      expect(scenario.label).toBe(wording.label)
      expect(scenario.caption).toBe(wording.caption)
    }
    for (const source of [...text.sources, ...text.scenarios.flatMap(({ sources }) => sources)]) {
      expect(conceptIds).toContain(source)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 SCP 부착 대상 개념 본문 바로 뒤에 도식을 붙인다', (headingLevel) => {
    const concept = topics.find(({ id }) => id === topicId)!.concepts.find(({ id }) => id === sourceConceptId)!
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: '조직과 SCP 적용 범위 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join('').replace(/\*\*/g, ''))
    expect(figure.closest('article')!.lastElementChild).toBe(figure)
    expect(within(figure).queryByRole('heading')).toBeNull()
  })

  it('두 번 렌더해도 화살표 마커 id가 겹치지 않고 각 경로가 자기 마커를 가리킨다', async () => {
    render(<><OrgScpScopeDiagram /><OrgScpScopeDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: '조직과 SCP 적용 범위 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: 'OU에 SCP' })) })
      expect(figure.querySelectorAll('[data-path]')).toHaveLength(1)
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    expect(new Set(figures.map((figure) => figure.querySelector('marker')!.id)).size).toBe(2)
  })
})
