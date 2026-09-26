# Step 0: sg-nacl-table

## 배경

`security-groups-nacl` 주제는 보안 그룹과 NACL을 적용 범위(리소스 대 서브넷), 규칙 종류(허용만 대 허용·차단),
상태 기억(저장 대 비저장)으로 가른다. 이 세 축은 `security-group-stateful-vs-nacl-stateless` 개념에서 한데 모이고,
그 뒤에는 phase 38의 경계 도식(`SgNaclBoundaryDiagram`)이 이미 붙어 있다.

사용자가 두 기능을 한눈에 대조하는 비교표를 가져왔다. 이 step은 그 표를 이 앱의 비교표 규약(ADR-037)으로 옮긴다.
사용자 결정(2026-09-26): 원래 여섯 행에 **기본 규칙** 행을 더해 일곱 행으로 하고, 칸은 O/X가 아니라 **짧은 말**로 쓴다.
결정의 기록은 `docs/ADR.md` ADR-037 끝의 「2026-09-26 확장 — 보안 그룹·NACL 주제(phase 42)」에 있다.

**앵커는 `security-groups-nacl.security-group-stateful-vs-nacl-stateless`다.** 세 축이 모두 나온 자리라 표의 모든 행을
이미 읽은 상태에서 표를 본다. 이 개념에는 경계 도식이 있으므로 registry 값은 **배열** `[SgNaclBoundaryDiagram, 표]`가
된다 — 넓은 그림을 먼저, 대조표를 나중에(UI_GUIDE 「한 개념 뒤의 여러 도식」).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 둘까지)
- `docs/UI_GUIDE.md`의 **「도식」 중 「한 개념 뒤의 여러 도식」**, **「비교표」**
- `src/types/visuals.ts` — `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts` — `visualsByTopicId`
- `src/data/visuals/backup-disaster-recovery.json` — 주제 JSON 파일의 선례
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx` — **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/backupTables.tsx`, `src/components/diagrams/backupTables.test.tsx` — 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/components/diagrams/SgNaclBoundaryDiagram.test.tsx` — 끝부분의 `ConceptList` 배치 테스트
- `src/data/topics.json`의 `security-groups-nacl` 주제 개념 전부

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/security-groups-nacl.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`의 `visualsByTopicId`에 `'security-groups-nacl'` 키를 더한다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 1이 채운다.

### 2. 표 — JSON `tables["sg-vs-nacl"]`

- `label`: `보안 그룹과 NACL 비교`
- `columns`: `["", "보안 그룹", "NACL"]` — 첫 열(행 머리 열)의 제목은 빈 문자열이다. 기존 표들이 첫 열 제목을 어떻게
  두는지 먼저 확인하고 같은 방식을 따른다.
- `columnWidths`: `["24%", "38%", "38%"]` (phase 40 실측으로 정한 행 머리 열 폭)
- `sources`: `security-groups-nacl.security-group`, `security-groups-nacl.nacl`,
  `security-groups-nacl.security-group-referencing`, `security-groups-nacl.security-group-stateful-vs-nacl-stateless`
- `rows` — **이 순서, 이 문구 그대로** 쓴다. 칸 문장은 아래처럼 이미 직접 쓴 것이다(ADR-009).

| 행 머리 | 보안 그룹 | NACL | 근거 개념 |
|---|---|---|---|
| 적용 위치 | 리소스 · 서브넷에 매이지 않음 | 서브넷 | `security-group` p2, `nacl` 이름·`web-acl-vs-nacl` |
| 허용 규칙 | 가능 | 가능 | `security-group` p3, `nacl` p0 |
| 차단 규칙 | 불가 | 가능 | 같음 |
| 상태 기억 | 함 · 응답은 규칙 없이 나감 | 안 함 · 양방향에 규칙 필요 | `security-group-stateful-vs-nacl-stateless` p0 |
| 규칙 대상 IP | 가능 | 가능 | `security-group` p2, `nacl` p1 |
| 다른 보안 그룹 참조 | 가능 | 불가 | `security-group-referencing` p1, `nacl` p1 |
| 기본 규칙 | 인바운드 차단 · 아웃바운드 허용 | 양방향 허용 | `security-group` p3, `nacl` p0 |

### 3. 래퍼와 매핑

- `src/components/diagrams/sgNaclTables.tsx`에 `SgNaclCompareTable`을 둔다. `backupTables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`의 `'security-groups-nacl.security-group-stateful-vs-nacl-stateless'` 값을
  `[SgNaclBoundaryDiagram, SgNaclCompareTable]`로 바꾼다. **순서를 지켜라** — 도식이 먼저다.

### 4. 테스트

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/sgNaclTables.test.tsx`:

1. `visualsByTopicId['security-groups-nacl'].tables['sg-vs-nacl']`가 있고, 열 머리가 `보안 그룹`·`NACL`, 행 머리 일곱이
   위 표의 순서와 같다.
2. 칸 문구가 위 표와 같다. 특히 `차단 규칙` 행이 `불가`·`가능`, `다른 보안 그룹 참조` 행이 `가능`·`불가`다.
3. 어느 칸에도 `O`·`X`·`○`·`×` 한 글자짜리 판정이 없다.
4. 렌더된 `colgroup`의 폭이 `["24%", "38%", "38%"]`다.
5. `ConceptList`에 `security-group-stateful-vs-nacl-stateless` 개념을 주면 본문 뒤에 **경계 도식 → 비교표** 순서로
   `figure` 둘이 온다.

기존 `SgNaclBoundaryDiagram.test.tsx`의 「공유 본문에서 상태 저장과 상태 비저장 뒤에만 실등록 도식을 표시한다」 테스트는
`expect(screen.getAllByRole('figure')).toHaveLength(1)`로 figure가 하나라고 단언한다. 이 앵커에 표가 더해지므로
**이 단언 한 줄만** 고친다 — figure가 둘이고 첫째가 경계 도식임을 단언하는 것으로. 그 테스트의 다른 단언과
다른 테스트는 건드리지 마라. 테스트 이름도 그대로 둔다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 칸에 위 표 밖의 사실이 없는가, 판정에 색·이모지·O/X가 없는가, `ComparisonTableFigure.tsx`·`topics.json`·
   `SgNaclBoundaryDiagram.tsx`가 그대로인가, 기존 테스트 변경이 위에서 허용한 한 줄뿐인가.
3. `phases/42-sg-nacl-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`: 새 JSON 파일과 로더 키, 표 id와 앵커, registry 배열 순서, 가장 긴 칸의 글자 수, 고친 기존 단언.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **칸을 O/X로 쓰지 마라.** 이유: 사용자 결정. 화면 낭독기가 O/X를 판정으로 읽지 못한다.
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답이 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **"같은 서브넷 안 통신은 NACL을 지나지 않는다", "규칙 번호 순으로 평가한다" 같은 칸이나 행을 더하지 마라.**
  이유: 데이터에 근거가 없다.
- **`ComparisonTableFigure.tsx`·`SgNaclBoundaryDiagram.tsx`·`topics.json`을 고치지 마라.** 이유: 실측·검증을 마친
  공용 컴포넌트와 기존 도식, 그리고 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: VPC 주제에만 둔다(ADR-037).
- **층 도식을 만들지 마라.** 이유: step 1의 범위다.
- 기존 테스트를 깨뜨리지 마라. 고쳐도 되는 것은 위에서 지정한 단언 한 줄뿐이다.
