import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { topics, visualsByTopicId } from '../../data'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { IdentityCenterAccessDiagram, identityCenterAccessScenarios } from './IdentityCenterAccessDiagram'

const topicId = 'identity-federation'
const sourceConceptId = `${topicId}.identity-center-permission-set`
const externalIdpConceptId = `${topicId}.identity-center-external-idp`
const labels = {
  user: '사용자', 'permission-set': '권한 세트', 'role-a': 'IAM 역할',
  'iam-user-a': 'IAM 사용자', 'iam-user-b': 'IAM 사용자',
}
const groupLabels = { 'identity-center': 'IAM Identity Center', 'account-a': '계정 A', 'account-b': '계정 B' }
const noteLabels = {
  'creates-role': '역할을 만든다', 'assume-role': '역할을 맡아 접근',
  'no-assignment': '할당 없음', 'per-account': '계정마다 신원을 따로 관리',
}
const expectedPaths: Record<string, string> = {
  'user-login': 'M140 40 V60',
  'set-role': 'M110 116 V168',
  'user-role': 'M82 24 H8 V184 H28',
  'user-iam-a': 'M82 24 H8 V224 H28',
  'user-iam-b': 'M198 24 H270 V224 H252',
}
const question = '사용자는 여러 계정에 어떻게 들어갈까?'
const idleCaption = '방식을 고르면 사용자가 계정에 들어가는 길을 볼 수 있다.'
const legend = '파랑: IAM Identity Center의 권한 세트 · 청록: 계정 안의 IAM 역할과 IAM 사용자 · 회색: 사용자.'
const expectedScenarios = [
  {
    id: 'assign', label: '권한 세트 할당',
    nodes: ['user', 'permission-set', 'role-a'],
    paths: ['user-login', 'set-role', 'user-role'],
    notes: ['creates-role', 'assume-role', 'no-assignment'],
    caption: '할당하면 계정 A에 IAM 역할이 생기고, 사용자는 포털에서 그 역할을 맡아 들어간다.',
    sources: [sourceConceptId],
  },
  {
    id: 'iam-users', label: '계정마다 IAM 사용자',
    nodes: ['user', 'iam-user-a', 'iam-user-b'],
    paths: ['user-iam-a', 'user-iam-b'], notes: ['per-account'],
    caption: '계정마다 IAM 사용자를 만들면 관리할 신원이 계정 수만큼 늘어 확장되지 않는다.',
    sources: [externalIdpConceptId, sourceConceptId],
  },
]

function diagram() {
  return screen.getByRole('img', { name: '권한 세트 할당과 계정의 IAM 역할' })
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

describe('IdentityCenterAccessDiagram', () => {
  it('Identity Center 주제의 시각 데이터를 로드하고 비교표와 약어 사전은 비워 둔다', () => {
    const visuals = visualsByTopicId[topicId]
    expect(visuals).toBeDefined()
    expect(Object.keys(visuals.diagrams)).toEqual(['identity-center-access'])
    expect(visuals.tables).toEqual({})
    expect(visuals.glossary).toEqual([])
  })

  it('물음형 제목을 헤딩 없이 시나리오 버튼보다 앞에 보인다', () => {
    render(<IdentityCenterAccessDiagram />)
    const title = screen.getByText(question)

    expect(title.tagName).toBe('P')
    expect(title).toHaveClass('text-sm', 'text-title')
    expect(title.compareDocumentPosition(screen.getByRole('button', { name: '전체' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('처음에는 노드 다섯이 모두 선명하고 경로·곁말 없이 선택 안내가 나온다', () => {
    const { container } = render(<IdentityCenterAccessDiagram />)
    const nodes = diagram().querySelectorAll('[data-node]')

    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const node of nodes) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
  })

  it.each(expectedScenarios)('$label: 해당 노드·경로·곁말만 선명하게 보이고 다른 방식의 노드는 흐리다', async (scenario) => {
    const { container } = render(<IdentityCenterAccessDiagram />)
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

  it('방식을 바꾸면 이전 경로·곁말이 사라지고 전체를 누르면 초기 상태로 돌아온다', async () => {
    const { container } = render(<IdentityCenterAccessDiagram />)
    for (const scenario of [...expectedScenarios, expectedScenarios[0]]) {
      await selectScenario(scenario.label)
      expect(Array.from(diagram().querySelectorAll('[data-path]'), (path) => path.getAttribute('data-path'))).toEqual(scenario.paths)
      expect(Array.from(diagram().querySelectorAll('[data-note]'), (note) => note.getAttribute('data-note'))).toEqual(scenario.notes)
    }
    await selectScenario('전체')
    for (const node of diagram().querySelectorAll('[data-node]')) expect(node).toHaveAttribute('opacity', '1')
    expect(diagram().querySelectorAll('[data-path], [data-note]')).toHaveLength(0)
    expect(container.querySelector('figcaption')!.textContent).toBe(idleCaption)
  })

  it('관문 5·7: 모든 상자가 폭 280의 viewBox 안에 있고 모바일 폭 보정을 유지한다', () => {
    render(<IdentityCenterAccessDiagram />)
    expect(diagram()).toHaveAttribute('viewBox', '0 0 280 256')
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes).toHaveLength(8)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, 256])).toEqual([])
    expect(diagram().parentElement).toHaveClass('-mx-4', 'w-full', 'max-w-[380px]', 'max-sm:w-[calc(100%+2rem)]', 'sm:mx-0')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('관문 6: 노드 라벨은 크기 10이고 높이 32 상자 안에 여백 12를 남기며 계층별 색을 쓴다', () => {
    render(<IdentityCenterAccessDiagram />)
    for (const [id, label] of Object.entries(labels)) {
      const node = diagram().querySelector(`[data-node="${id}"]`)!
      const text = node.querySelector('text')!
      const rect = node.querySelector('rect')!
      const box = readBox(rect)
      expect(text.textContent).toBe(label)
      expect(text).toHaveAttribute('font-size', '10')
      expect(box.height).toBe(32)
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(box.width)
      expect(rect).toHaveClass(id === 'user' ? 'stroke-disabled' : id === 'permission-set' ? 'stroke-diagram-managed' : 'stroke-diagram-resource')
    }
  })

  it('Identity Center는 계정 박스 밖에 있고 권한 세트·역할·IAM 사용자는 각 경계 안에 있다', () => {
    render(<IdentityCenterAccessDiagram />)
    const center = readBox(diagram().querySelector('[data-group="identity-center"]')!)
    const accountA = readBox(diagram().querySelector('[data-group="account-a"]')!)
    const accountB = readBox(diagram().querySelector('[data-group="account-b"]')!)

    expect(center.y + center.height).toBeLessThan(accountA.y)
    expect(center.y + center.height).toBeLessThan(accountB.y)
    for (const [group, ids] of [
      [center, ['permission-set']], [accountA, ['role-a', 'iam-user-a']], [accountB, ['iam-user-b']],
    ] as const) {
      const boxes = ids.map((id) => readBox(diagram().querySelector(`[data-node="${id}"] rect`)!))
      expect(boxesOutsideViewBox(boxes, [group.x, group.y, group.width, group.height])).toEqual([])
    }
  })

  it.each(['전체', ...expectedScenarios.map(({ label }) => label)])('%s: 그룹은 흐려지지 않고 그룹 라벨·곁말은 크기 9로 가로 범위 안에 있다', async (label) => {
    render(<IdentityCenterAccessDiagram />)
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
      const left = text.getAttribute('text-anchor') === 'middle' ? x - width / 2 : x
      expect(left).toBeGreaterThanOrEqual(0)
      expect(left + width).toBeLessThanOrEqual(280)
    }
    for (const note of diagram().querySelectorAll('[data-note]')) {
      const id = note.getAttribute('data-note') as keyof typeof noteLabels
      expect(note.textContent).toBe(noteLabels[id])
      expect(note.closest('[opacity]')).toBeNull()
    }
  })

  it('JSON과 컴포넌트의 시나리오 id가 같고 지정한 문구와 존재하는 근거 개념을 JSON에서 읽는다', () => {
    render(<IdentityCenterAccessDiagram />)
    const text = visualsByTopicId[topicId].diagrams['identity-center-access']
    const ids = identityCenterAccessScenarios.map(({ id }) => id).sort()
    const conceptIds = topics.find(({ id }) => id === topicId)!.concepts.map(({ id }) => id)

    expect(ids).toEqual(['assign', 'iam-users'])
    expect(ids).toEqual(text.scenarios.map(({ id }) => id).sort())
    expect(text.nodes).toEqual(labels)
    expect(text.groups).toEqual(groupLabels)
    expect(text.notes).toEqual(noteLabels)
    expect(text.question).toBe(question)
    expect(text.idleCaption).toBe(idleCaption)
    expect(text.legend).toBe(legend)
    expect(text.sources).toEqual([`${topicId}.identity-center`, sourceConceptId, externalIdpConceptId])
    expect(text.label).toBe('IAM Identity Center 접근 도식')
    expect(text.svgLabel).toBe('권한 세트 할당과 계정의 IAM 역할')
    expect(screen.getByText(legend)).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['전체', ...expectedScenarios.map(({ label }) => label)])
    for (const expected of expectedScenarios) {
      const wording = text.scenarios.find(({ id }) => id === expected.id)!
      const scenario = identityCenterAccessScenarios.find(({ id }) => id === expected.id)!
      expect(wording).toEqual({ id: expected.id, label: expected.label, caption: expected.caption, sources: expected.sources })
      expect(scenario.label).toBe(wording.label)
      expect(scenario.caption).toBe(wording.caption)
    }
    for (const source of [...text.sources, ...text.scenarios.flatMap(({ sources }) => sources)]) {
      expect(conceptIds).toContain(source)
    }
  })

  it.each([2, 4] as const)('공유 본문 h%i에서 권한 세트 개념 본문 바로 뒤에 도식을 붙인다', (headingLevel) => {
    const concept = topics.find(({ id }) => id === topicId)!.concepts.find(({ id }) => id === sourceConceptId)!
    render(<ConceptList concepts={[concept]} headingLevel={headingLevel} />)
    const figure = screen.getByRole('figure', { name: 'IAM Identity Center 접근 도식' })

    expect(figure.closest('article')).toHaveAttribute('id', concept.id)
    expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join('').replace(/\*\*/g, ''))
    expect(figure.closest('article')!.lastElementChild).toBe(figure)
    expect(within(figure).queryByRole('heading')).toBeNull()
  })

  it('두 번 렌더해도 화살표 마커 id가 겹치지 않고 각 경로가 자기 마커를 가리킨다', async () => {
    render(<><IdentityCenterAccessDiagram /><IdentityCenterAccessDiagram /></>)
    const figures = screen.getAllByRole('figure', { name: 'IAM Identity Center 접근 도식' })
    for (const figure of figures) {
      await act(async () => { await userEvent.click(within(figure).getByRole('button', { name: '권한 세트 할당' })) })
      expect(figure.querySelectorAll('[data-path]')).toHaveLength(3)
      for (const path of figure.querySelectorAll('[data-path]')) {
        expect(path).toHaveAttribute('marker-end', `url(#${figure.querySelector('marker')!.id})`)
      }
    }
    expect(new Set(figures.map((figure) => figure.querySelector('marker')!.id)).size).toBe(2)
  })
})
