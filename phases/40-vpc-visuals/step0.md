# Step 0: visual-slots

## 배경

phase 40은 사용자가 가져온 단독 HTML(VPC 네트워킹 시각화)의 **내용**을 `vpc-networking` 주제에
옮긴다. 형태는 옮기지 않는다 — 이 앱의 도식 규약으로 다시 그린다. 결정과 이유는
`docs/ADR.md`의 **ADR-037**에 있다.

이 phase의 시각 요소는 여섯 가지다(도식 다섯, 비교표 다섯, 약어 툴팁). 그 전에 셋이 필요하다.

1. 시각 요소의 **문구를 담을 데이터 파일과 타입.** 사용자가 문구를 코드에서 빼 달라고 했다.
2. 한 개념 뒤에 **도식을 여러 개** 붙이는 자리. `comparison` 개념 뒤에 경로 지도와 흐름도가 함께 붙는다.
3. 문구마다 붙는 **근거 개념 id를 기계로 확인하는 테스트.** 이 앱의 도식은 콘텐츠다(ADR-036).

이 step은 그 셋만 만든다. **도식·표·툴팁은 하나도 만들지 않는다.**

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/ARCHITECTURE.md` — 「디렉토리 구조」, 「데이터 모델」(시각 요소 문구 문단)
- `docs/UI_GUIDE.md`의 「도식」 절, 특히 「한 개념 뒤의 여러 도식」
- `src/types/content.ts` — 타입 정의의 선례
- `src/data/index.ts` — 로더의 선례
- `src/data/data.test.ts` — 데이터 테스트의 선례
- `src/components/ConceptList.tsx`, `src/components/ConceptList.test.tsx`
- `src/components/diagrams/registry.ts`, `src/components/diagrams/registry.test.tsx`
- `src/components/diagrams/DiagramFrame.tsx` — `DiagramScenario`의 모양. **고치지 마라.**

## 작업

### 1. 타입 — `src/types/visuals.ts` (새 파일)

아래 인터페이스를 정의한다. 필드 이름과 뜻을 바꾸지 마라. 다음 step들이 이 모양을 그대로 쓴다.

```ts
// 시나리오 버튼 하나의 문구. id는 컴포넌트의 좌표 데이터와 짝을 맞추는 열쇠다.
export interface VisualScenarioText {
  id: string
  label: string
  caption: string
  sources: string[]          // 근거 개념 id. 하나 이상.
}

// 도식 한 장의 문구. 좌표·경로는 컴포넌트에 둔다.
export interface VisualDiagramText {
  label: string              // figure aria-label
  svgLabel: string           // svg aria-label
  idleCaption: string
  legend?: string
  nodes: Record<string, string>        // 노드 id → 라벨
  nodeNotes?: Record<string, string>   // 두 줄 노드의 윗줄(조건). UI_GUIDE 「두 줄 노드」
  groups?: Record<string, string>      // 그룹 박스 id → 라벨
  scenarios: VisualScenarioText[]      // 정적 도식이면 빈 배열
  sources: string[]                    // idleCaption·노드 배치의 근거 개념 id
}

export interface ComparisonTableRow {
  header: string             // 행 머리(th scope="row")
  cells: string[]            // columns.length - 1 개
}

export interface ComparisonTable {
  label: string              // figure aria-label이자 표 제목
  columns: string[]          // 3개 이하. 첫 열은 행 머리 열의 제목.
  rows: ComparisonTableRow[]
  sources: string[]
}

export interface GlossaryTerm {
  term: string               // 본문에 나오는 그대로. 예: "IAM"
  expansion?: string         // 풀네임. 데이터에 근거가 없으면 두지 않는다.
  meaning: string
  sourceConceptId: string
}

export interface TopicVisuals {
  diagrams: Record<string, VisualDiagramText>
  tables: Record<string, ComparisonTable>
  glossary: GlossaryTerm[]
}
```

### 2. 데이터 — `src/data/visuals/vpc-networking.json` (새 파일)

```json
{ "diagrams": {}, "tables": {}, "glossary": [] }
```

**비워 둔다.** 내용은 step 1~7이 각자 자기 몫을 더한다.

### 3. 로더 — `src/data/index.ts`

기존 export는 그대로 두고 하나를 더한다.

```ts
export const visualsByTopicId: Record<string, TopicVisuals>
```

지금은 `'vpc-networking'` 키 하나다. 런타임 fetch를 쓰지 마라 — 빌드 타임 import다(CLAUDE.md).

### 4. 데이터 테스트 — `src/data/visuals.test.ts` (새 파일)

아래를 **모든 주제의 visuals에 대해** 검사한다. 지금은 비어 있어도 통과하고, 다음 step들이 문구를
더할 때마다 자동으로 검사 대상이 된다.

1. `visualsByTopicId`의 키가 모두 `topics`에 있는 주제 id다.
2. 모든 `sources`와 `sourceConceptId`가 `topics.json`에 실제로 있는 개념 id다. 빈 `sources`는 실패다.
3. 표마다 `columns.length <= 3`이고, 모든 행의 `cells.length === columns.length - 1`이다.
4. 시나리오 `id`가 도식 안에서 겹치지 않는다. 시나리오 `caption`은 20자를 넘는다.
5. 약어 `term`이 겹치지 않는다.

### 5. 한 개념에 여러 도식 — `ConceptList`와 `registry`

- `registry.ts`의 타입을 `Record<string, ComponentType | ComponentType[]>`로 넓힌다. **기존 항목
  아홉 개의 값은 바꾸지 마라.**
- `ConceptList`의 `diagrams` prop도 같은 타입이다. 배열이면 **배열 순서대로** 본문 뒤에 렌더한다.
  단일 값은 지금과 똑같이 렌더한다.
- `ConceptList.test.tsx`에 테스트를 더한다: 배열로 준 두 도식이 **순서대로** 본문 뒤에 나온다.
  기존 테스트는 고치지 않고 통과해야 한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. 위 AC를 실행한다.
2. 확인한다: 타입이 `src/types/`에만 있는가, `src/lib/`에 React 의존이 생기지 않았는가,
   런타임 fetch가 없는가.
3. `phases/40-vpc-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`: 만든 파일 경로, `visualsByTopicId`의 시그니처,
     `ConceptList`가 배열을 받는 방식, 데이터 테스트 다섯 항목의 이름.
   - 3회 시도 후 실패 → `"status": "error"`, `"error_message"`.

## 금지사항

- **도식·표·툴팁 컴포넌트를 만들지 마라.** 이유: step 1~7의 범위다. 빈 틀이 먼저 서야 각 step이
  자기 몫만 더한다.
- **`DiagramFrame.tsx`를 고치지 마라.** 이유: 아홉 장이 공유하고 실측 규약이 걸려 있다.
- **`registry.ts`의 기존 항목 아홉 개를 바꾸거나 배열로 감싸지 마라.** 이유: 이 step의 변경은 타입을
  넓히는 것뿐이다.
- **`topics.json`·`questions.json`을 고치지 마라.**
- **`src/data/visuals/vpc-networking.json`에 문구를 넣지 마라.** 이유: 문구마다 근거가 step 문서에
  지정돼 있고, 그 지정은 step 1~7에 있다.
- 기존 테스트를 깨뜨리지 마라.
