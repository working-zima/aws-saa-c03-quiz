// 시나리오 버튼 하나의 문구. id는 컴포넌트의 좌표 데이터와 짝을 맞추는 열쇠다.
export interface VisualScenarioText {
  id: string
  label: string
  caption: string
  sources: string[] // 근거 개념 id. 하나 이상.
}

// 도식 한 장의 문구. 좌표·경로는 컴포넌트에 둔다.
export interface VisualDiagramText {
  label: string // figure aria-label
  svgLabel: string // svg aria-label
  idleCaption: string
  legend?: string
  nodes: Record<string, string> // 노드 id → 라벨
  nodeNotes?: Record<string, string> // 두 줄 노드의 윗줄(조건). UI_GUIDE 「두 줄 노드」
  groups?: Record<string, string> // 그룹 박스 id → 라벨
  scenarios: VisualScenarioText[] // 정적 도식이면 빈 배열
  sources: string[] // idleCaption·노드 배치의 근거 개념 id
}

export interface ComparisonTableRow {
  header: string // 행 머리(th scope="row")
  cells: string[] // columns.length - 1 개
}

export interface ComparisonTable {
  label: string // figure aria-label이자 표 제목
  columns: string[] // 3개 이하. 첫 열은 행 머리 열의 제목.
  rows: ComparisonTableRow[]
  sources: string[]
}

export interface GlossaryTerm {
  term: string // 본문에 나오는 그대로. 예: "IAM"
  expansion?: string // 풀네임. 데이터에 근거가 없으면 두지 않는다.
  meaning: string
  sourceConceptId: string
}

export interface TopicVisuals {
  diagrams: Record<string, VisualDiagramText>
  tables: Record<string, ComparisonTable>
  glossary: GlossaryTerm[]
}
