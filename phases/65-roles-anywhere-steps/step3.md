# Step 3: roles-anywhere-step-figures

## 배경

step 1이 `ConceptList`에 단계 그림 자리(`stepFiguresByConceptId`)를 만들었고 step 2가 개념 `identity-federation.iam-roles-anywhere`를 넣었다. 이 step은
그 개념의 **단계 그림 19장**을 만든다(ADR-050 「단계 그림」, UI_GUIDE 「도식」 중 「단계 그림」). 사용자가 「단계마다 본문 안에 작은 그림」을 골랐다.

좌표·문구는 **`phases/65-roles-anywhere-steps/tools/step-figures.mjs`에 정해져 있다. 그대로 옮긴다.** 그 파일은 `check-steps.mjs` 검사(경계·라벨 폭·겹침·
소속·그룹 라벨·경로 교차·끝점·곁말)를 통과한 설계본이다. 좌표나 문구를 바꾸지 마라.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-050**, **ADR-036**(색은 보조 채널), **ADR-037**(문구는 데이터, 좌표는 컴포넌트)
- `docs/UI_GUIDE.md`의 「도식」 — 글자 크기·색·접근성 규칙과 「단계 그림」
- `phases/65-roles-anywhere-steps/tools/step-figures.mjs`(설계본), `tools/check-steps.mjs`(검사 규칙)
- `src/components/ConceptList.tsx`(step 1 결과), `src/components/diagrams/registry.ts`
- `src/components/diagrams/IdentityCenterAccessDiagram.tsx` — 같은 주제의 기존 도식(노드·그룹·곁말·화살표 마커를 그리는 방식)
- `src/types/visuals.ts`, `src/data/index.ts`, `src/data/visuals/identity-federation.json`, `src/data/visuals.test.ts`
- `src/lib/svg-bounds.ts`(`boxesOutsideViewBox`, `estimateTextWidth`)

## 작업

### 1. 타입과 문구 데이터

`src/types/visuals.ts`에 더한다.

```ts
// 단계 그림 한 장의 문구. 좌표는 컴포넌트에 둔다(ADR-050).
export interface StepFigureText {
  label: string                  // figure aria-label
  nodes: Record<string, string>  // 노드 id → 라벨
  groups?: Record<string, string>
  notes?: Record<string, string> // 곁말 id → 글
  sources: string[]
}

export interface TopicVisuals {
  // 기존 필드 그대로
  stepFigures?: Record<string, Record<string, StepFigureText>> // 개념 id → 단계 번호("1"~"19") → 문구
}
```

`src/data/visuals/identity-federation.json`에 `stepFigures`를 더한다. 키는 `identity-federation.iam-roles-anywhere`, 그 안의 키는 `"1"`~`"19"`다. 각 단계의
`label`·노드 라벨(그 그림에 쓰는 노드만, `nodeTexts`의 라벨)·그룹 라벨(`groupTexts`)·곁말 글(`notes`의 넷째 값)은 `step-figures.mjs` 그대로다. `sources`는 모두
`["identity-federation.iam-roles-anywhere"]`다. 기존 `diagrams`·`tables`·`glossary`는 건드리지 않는다.

### 2. 컴포넌트

`src/components/diagrams/RolesAnywhereStepFigure.tsx`에 `export function RolesAnywhereStepFigure({ step }: { step: number })`를 만든다.

- 좌표(노드 `[x, y, 폭]`·높이 32, 그룹 `[x, y, 폭, 높이]`, 경로 `d`, 곁말 `[x, y, textAnchor]`)와 노드 색은 `step-figures.mjs`의 `figures[step]`·`nodeTexts` 그대로
  컴포넌트 안의 상수로 둔다. 글은 1의 JSON에서 읽는다.
- 마크업: `<figure aria-label={label} className="mt-2 rounded-md border border-border bg-panel">` 안에
  `<svg role="img" aria-label={label} viewBox="0 0 208 {높이}" className="block h-auto w-full max-w-[288px]">`. 버튼·캡션·범례·물음형 제목은 없다.
  `DiagramFrame`을 쓰지 않는다.
- 그리는 순서와 모양은 기존 도식과 같다: 그룹 `rect`(`fill-none stroke-disabled`, rx 4) → 그룹 라벨(x+10, y+14, 9, `fill-muted`) → 경로(`fill-none stroke-title`,
  굵기 2, 화살표 마커, `useId`로 마커 id) → 노드(`fill-panel` + 색, rx 4, 굵기 1.5, 라벨 10 `fill-title` 가운데) → 곁말(9, `fill-muted`).
  모든 경로와 곁말이 늘 보인다(정지 그림). 노드 opacity는 1이다.
- 노드·그룹·경로·곁말에 `data-node`·`data-group`·`data-path`·`data-note` 속성을 단다(테스트가 쓴다).
- `useWideDiagram()`을 쓰지 않는다. 배치는 하나다.

`src/components/diagrams/registry.ts`의 `stepFiguresByConceptId`에 `'identity-federation.iam-roles-anywhere': RolesAnywhereStepFigure`를 더한다.

### 테스트 먼저 (TDD)

`src/components/diagrams/RolesAnywhereStepFigure.test.tsx`를 먼저 쓰고 실패를 확인한 뒤 구현한다. 1~19 단계마다(`it.each`):

1. `figure`의 `aria-label`이 JSON의 `label`이고, 버튼이 없다.
2. 노드·그룹·경로·곁말의 id 집합과 좌표가 설계본과 같다(설계본의 값을 테스트 안 상수로 옮겨 단언해도 된다).
3. 모든 `rect`가 `boxesOutsideViewBox`로 viewBox(폭 208) 안이고, 노드마다 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다.
4. 노드 라벨·그룹 라벨·곁말 글이 JSON과 같다.

그리고 `ConceptList`로 실제 개념을 그리면 번호 항목 19개 각각의 글 바로 뒤에 그 번호의 단계 그림이 있고(19개), 다른 개념에는 단계 그림이 없다.
`src/data/visuals.test.ts`에 「단계 그림의 근거는 실제 개념 id이고, 키가 단계 목록을 가진 개념이며 단계 번호가 그 개념의 번호 항목과 같다」를 더한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node phases/65-roles-anywhere-steps/tools/check-steps.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. AC를 실행한다. `check-path-crossings.mjs`가 새 컴포넌트의 좌표 형식을 읽지 못하면(노드 배열 이름이 다르면) 실패로 보지 말고 그 사실을 `summary`에 적는다.
   좌표는 `check-steps.mjs`가 이미 검사했다.
2. `git status`로 바뀐 파일이 `src/types/visuals.ts`, `src/data/visuals/identity-federation.json`, `src/data/visuals.test.ts`,
   `src/components/diagrams/RolesAnywhereStepFigure.tsx`·`.test.tsx`, `src/components/diagrams/registry.ts`(필요하면 `ConceptList.test.tsx`)와 phase 메타데이터뿐인지 확인한다.
3. `phases/65-roles-anywhere-steps/index.json`의 step 3을 갱신한다. 성공이면 `summary`에 컴포넌트 이름, 그림 수, 바꾼 좌표가 없다는 것, 새 테스트 수, 전체 테스트 수를 적는다.

## 금지사항

- **`step-figures.mjs`의 좌표·라벨·곁말을 바꾸지 마라.** 이유: 검사를 통과한 설계본이다. 맞지 않아 보이면 고치지 말고 `summary`에 적어라.
- **그림을 개념 본문 뒤의 도식 자리(`diagramsByConceptId`)에 두지 마라.** 이유: 단계마다 그 단계 글 바로 아래에 둔다(ADR-050).
- **구간 버튼 도식(`tools/design-spec.mjs`)을 구현하지 마라.** 이유: 사용자가 고르지 않은 안의 기록이다.
- **가로형 배치·버튼·캡션을 만들지 마라.** 이유: 단계 그림은 정지 그림 하나다(UI_GUIDE 「단계 그림」).
- **개념 본문·문항 데이터를 고치지 마라.** 이유: step 2에서 승인본 그대로 들어갔다.
- 기존 테스트를 깨뜨리지 마라.
