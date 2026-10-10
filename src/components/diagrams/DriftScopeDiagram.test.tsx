import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { DriftScopeDiagram, driftScopeScenarios } from './DriftScopeDiagram'

const labels = {
  template: '템플릿', 'stack-a': '리소스', 'stack-b': '리소스',
  'team-a': '팀 A의 리소스', 'team-b': '팀 B의 리소스',
  drift: '드리프트 감지', config: 'AWS Config',
}
const groupLabels = { account: '한 계정', stack: '스택', outside: '스택 밖' }
const notes = {
  'not-seen': { label: '보지 못함', x: 260, y: 94 },
  'all-resources': { label: '모든 지원 리소스', x: 268, y: 70 },
}
const expectedPaths: Record<string, string> = {
  'template-stack': 'M74 40 V102',
  'drift-stack': 'M74 236 V188',
  'config-stack': 'M180 236 V216 H104 V188',
  'config-outside': 'M206 236 V188',
}
const question = '설정이 바뀐 리소스를 어디까지 잡아낼까?'
const idleCaption = '기능을 고르면 설정이 바뀐 리소스를 어디까지 살피는지 볼 수 있다.'
const legend = '파랑: 설정 변경을 살피는 기능 · 청록: 계정의 리소스 · 회색: 템플릿 파일. 위 화살표는 템플릿으로 배포한 것, 아래 화살표는 살피는 범위다.'
const expectedScenarios = [
  {
    id: 'drift', label: '드리프트 감지',
    nodes: ['template', 'stack-a', 'stack-b', 'drift'],
    paths: ['template-stack', 'drift-stack'], notes: ['not-seen'],
    caption: '스택으로 만든 리소스만 템플릿과 비교한다. 팀이 직접 만든 스택 밖 리소스는 빠진다.',
    sources: ['governance-iac.cloudformation-drift-detection', 'governance-iac.cloudformation'],
  },
  {
    id: 'config', label: 'AWS Config',
    nodes: ['stack-a', 'stack-b', 'team-a', 'team-b', 'config'],
    paths: ['config-stack', 'config-outside'], notes: ['all-resources'],
    caption: '스택 안팎을 가리지 않고 계정의 모든 지원 리소스에서 설정 변경을 기록한다.',
    sources: ['governance-iac.cloudformation-drift-detection', 'governance-iac.service-catalog'],
  },
]

function diagram() {
  return screen.getByRole('img', { name: '드리프트 감지와 AWS Config가 살피는 범위' })
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

describe('DriftScopeDiagram', () => {
  it('물음형 제목을 헤딩 없이 시나리오 버튼보다 앞에 보인다', () => {
    render(<DriftScopeDiagram />)
    const title = screen.getByText(question)

    expect(title.tagName).toBe('P')
    expect(title).toHaveClass('text-sm', 'text-title')
    expect(title.compareDocumentPosition(screen.getByRole('button', { name: '전체' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('처음에는 노드 일곱이 모두 선명하고 경로·곁말 없이 선택 안내가 나온다', () => {
    const { container } = render(<DriftScopeDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
    expect(diagram().querySelectorAll('[data-note]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
  })

  it.each(expectedScenarios)('$label: 지정한 노드·경로·곁말만 보이고 나머지 노드는 흐려진다', async (scenario) => {
    const { container } = render(<DriftScopeDiagram />)
    await selectScenario(scenario.label)

    for (const node of diagram().querySelectorAll('[data-node]')) {
      expect(node).toHaveAttribute('opacity', scenario.nodes.includes(node.getAttribute('data-node')!) ? '1' : '0.25')
    }
    const paths = Array.from(diagram().querySelectorAll('[data-path]'))
    expect(paths.map((path) => path.getAttribute('data-path')).sort()).toEqual([...scenario.paths].sort())
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

  it('기능을 바꾸면 이전 범위의 경로·곁말이 사라지고 전체를 누르면 초기 상태로 돌아온다', async () => {
    const { container } = render(<DriftScopeDiagram />)
    for (const scenario of [...expectedScenarios, expectedScenarios[0]]) {
      await selectScenario(scenario.label)
      expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path')).sort()).toEqual([...scenario.paths].sort())
      expect(Array.from(diagram().querySelectorAll('[data-note]'), (note) => note.getAttribute('data-note'))).toEqual(scenario.notes)
    }
    await selectScenario('전체')

    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    for (const { label } of expectedScenarios) expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'false')
  })

  it('관문 5·7: 그룹 셋과 노드 일곱이 280×276 viewBox 안에 있고 모바일 너비 보정을 유지한다', () => {
    render(<DriftScopeDiagram />)
    const [x, y, width, height] = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect([x, y, width, height]).toEqual([0, 0, 280, 276])
    expect(boxes).toHaveLength(10)
    expect(boxesOutsideViewBox(boxes, [x, y, width, height])).toEqual([])
    for (const [groupId, memberIds] of Object.entries({ account: ['stack', 'outside'], stack: ['stack-a', 'stack-b'], outside: ['team-a', 'team-b'] })) {
      const group = boxes.find(({ id }) => id === groupId)!
      expect(boxesOutsideViewBox(boxes.filter(({ id }) => memberIds.includes(id)), [group.x, group.y, group.width, group.height])).toEqual([])
    }
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 노드 라벨은 크기 10이고 높이 32 상자 안에 여백 12를 남기며 계층별 색을 쓴다', () => {
    render(<DriftScopeDiagram />)
    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const rect = node.querySelector('rect')!
      const box = readBox(rect)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(box.height).toBe(32)
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      expect(rect).toHaveClass(id === 'template' ? 'stroke-disabled' : ['drift', 'config'].includes(id) ? 'stroke-diagram-managed' : 'stroke-diagram-resource')
    }
  })

  it.each(['전체', '드리프트 감지', 'AWS Config'])('%s: 그룹은 흐려지지 않고 그룹 라벨·곁말은 크기 9로 가로 범위 안에 있다', async (label) => {
    render(<DriftScopeDiagram />)
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
      const left = text.getAttribute('text-anchor') === 'end' ? x - width : x
      expect(left).toBeGreaterThanOrEqual(0)
      expect(left + width).toBeLessThanOrEqual(280)
    }
    for (const note of diagram().querySelectorAll('[data-note]')) {
      const expected = notes[note.getAttribute('data-note')! as keyof typeof notes]
      expect(note.textContent).toBe(expected.label)
      expect(note).toHaveAttribute('x', String(expected.x))
      expect(note).toHaveAttribute('y', String(expected.y))
      expect(note).toHaveAttribute('text-anchor', 'end')
      expect(note.closest('[opacity]')).toBeNull()
    }
  })

  it('JSON과 컴포넌트의 시나리오 id가 같고 지정한 문구·근거를 JSON에서 읽는다', () => {
    render(<DriftScopeDiagram />)
    const text = visualsByTopicId['governance-iac'].diagrams['drift-scope']
    const ids = driftScopeScenarios.map(({ id }) => id).sort()

    expect(ids).toEqual(['config', 'drift'])
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual(groupLabels)
    expect(text.notes).toEqual(Object.fromEntries(Object.entries(notes).map(([id, note]) => [id, note.label])))
    expect(text.question).toBe(question)
    expect(text.idleCaption).toBe(idleCaption)
    expect(text.legend).toBe(legend)
    expect(text.sources).toEqual(['governance-iac.cloudformation', 'governance-iac.cloudformation-drift-detection', 'governance-iac.service-catalog'])
    expect(text.label).toBe('드리프트 감지와 AWS Config 범위 도식')
    expect(text.svgLabel).toBe('드리프트 감지와 AWS Config가 살피는 범위')
    expect(screen.getByText(legend)).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['전체', '드리프트 감지', 'AWS Config'])
    for (const expected of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === expected.id)!
      const scenario = driftScopeScenarios.find(({ id }) => id === expected.id)!
      expect(wording).toEqual({ id: expected.id, label: expected.label, caption: expected.caption, sources: expected.sources })
      expect(scenario.label).toBe(wording.label)
      expect(scenario.caption).toBe(wording.caption)
      expect(wording.caption.length).toBeLessThanOrEqual(50)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 드리프트 감지 개념 본문 바로 뒤에 도식을 붙인다', (headingLevel) => {
    const concept = topics.find(({ id }) => id === 'governance-iac')!.concepts.find(({ id }) => id === 'governance-iac.cloudformation-drift-detection')!
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: '드리프트 감지와 AWS Config 범위 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join('').replace(/\*\*/g, ''))
    expect(figure.closest('article')!.lastElementChild).toBe(figure)
    expect(within(figure).queryByRole('heading')).toBeNull()
  })

  it('두 번 렌더해도 화살표 마커 id가 겹치지 않고 각 경로가 자기 마커를 가리킨다', async () => {
    render(<><DriftScopeDiagram /><DriftScopeDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: '드리프트 감지와 AWS Config 범위 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: 'AWS Config' })) })
      expect(figure.querySelectorAll('[data-path]')).toHaveLength(2)
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    expect(new Set(figures.map((figure) => figure.querySelector('marker')!.id)).size).toBe(2)
  })
})
