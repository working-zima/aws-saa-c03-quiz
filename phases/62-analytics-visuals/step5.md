# Step 5: columnar-diagram

## 배경

`parquet-columnar-format`은 Parquet이 데이터를 행이 아니라 열 기준으로 담아, 필요한 열만 읽으면 되므로 집계·보고서 쿼리의 읽는 양이 준다고
말한다. `athena-encrypted-and-pay-per-query`는 Athena가 스캔한 데이터 양에만 요금을 매기고, Parquet은 필요한 열만 읽어 스캔량 자체를 줄인다고
말한다. 문항 q632는 "행 기준으로 담아 한 행을 통째로 빨리 읽기 때문"을 오답으로 낸다.

이 step은 같은 표(열 A·B·C × 행 1·2·3)를 행 기준과 열 기준으로 담은 두 박스를 나란히 그리고, 열 B만 쓰는 쿼리가 어디에 닿는지 장면 둘로 비교한다.

**행 기준 장면에는 화살표가 없다**(ADR-037 phase 62). 본문은 행 기준에서 무엇을 읽는지 말하지 않는다. 그래서 행 기준 장면은 "같은 열의 값이 행마다
흩어진다"는 정의만 보이고, "읽는다"는 말은 Parquet 장면에만 쓴다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — EMR·Glue·Athena·Lake Formation 주제(phase 62)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `emr-glue-athena.parquet-columnar-format`다.** 주제의 마지막 개념이고 Parquet을 정의하는 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/62-analytics-visuals/index.json`의 step 0~4 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/emr-glue-athena.json`: step 0이 만든 파일이다. 여기에 `diagrams["columnar"]`를 더한다. **표 둘과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·그룹 박스·시나리오 곁말·가로형 `describe`의 선례.
  **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/MapStateDiagram.tsx`: 같은 대상을 두 방식으로 나란히 그리고 장면 둘로 비교하는 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `emr-glue-athena` 주제 가운데 `parquet-columnar-format`, `athena-encrypted-and-pay-per-query`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/ColumnarFormatDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["columnar"]`
- 매핑: `registry.ts`에 `'emr-glue-athena.parquet-columnar-format': ColumnarFormatDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
  이 주제의 키는 **주제 안 개념 순서**로 모은다. phase가 끝났을 때의 순서는 아래와 같고, 이 step은 자기 줄을 그 자리에 끼운다.

```ts
  'emr-glue-athena.emr': AnalyticsServiceTable, // step 0
  'emr-glue-athena.emr-managed-scaling': EmrClusterCostDiagram, // step 1
  'emr-glue-athena.emr-node-instance-family-choice': EmrNodeRolesDiagram, // step 2
  'emr-glue-athena.emr-security-configuration': EmrRuntimeRoleDiagram, // step 3
  'emr-glue-athena.log-storage-s3-athena': LogStorageTable, // step 0
  'emr-glue-athena.lake-formation-lf-tags': LakePermissionsDiagram, // step 4
  'emr-glue-athena.parquet-columnar-format': ColumnarFormatDiagram, // step 5
```

### 모양

세로형은 맨 위 가운데에 쿼리, 그 아래 왼쪽에 「행 기준」, 오른쪽에 「열 기준 (Parquet)」 박스를 두고 박스마다 블록 셋을 쌓는다.

```
            [열 B만 쓰는 쿼리]
┌ 행 기준 ─────┐   ┌ 열 기준 (Parquet) ┐
│ [행 1의 A·B·C]│   │ [열 A의 값]       │
│ [행 2의 A·B·C]│ ┐ │ [열 B의 값] ←─────┘ (쿼리에서 두 박스 사이 통로 x 140으로 내려와 들어간다)
│ [행 3의 A·B·C]│   │ [열 C의 값]       │
└──────────────┘   └───────────────────┘
```

가로형은 왼쪽에 쿼리, 가운데에 「열 기준 (Parquet)」, 오른쪽에 「행 기준」을 둔다. 쿼리에서 `열 B의 값`으로 가는 화살표가 곧은 수평선이 된다.
**박스의 좌우 순서가 세로형과 다르다**(ADR-048 「흐름의 방향을 바꿀 수 있다」). 소속은 같다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고 미리보기로 사용자 승인을 받은
**출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 224`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `row-based` | 행 기준 | 4, 56, 132, 144 |
| `columnar` | 열 기준 (Parquet) | 144, 56, 132, 144 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `query` | 열 B만 쓰는 쿼리 | `stroke-disabled` | 82, 8, 116 |
| `row-1` | 행 1의 A·B·C | `stroke-diagram-managed` | 12, 80, 116 |
| `row-2` | 행 2의 A·B·C | `stroke-diagram-managed` | 12, 120, 116 |
| `row-3` | 행 3의 A·B·C | `stroke-diagram-managed` | 12, 160, 116 |
| `col-a` | 열 A의 값 | `stroke-diagram-managed` | 152, 80, 116 |
| `col-b` | 열 B의 값 | `stroke-diagram-managed` | 152, 120, 116 |
| `col-c` | 열 C의 값 | `stroke-diagram-managed` | 152, 160, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `query-col-b` | 쿼리가 열 B의 값만 읽는다 | `M140 40 V136 H152` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `scattered` | 열 B가 세 행에 흩어짐 | 70, 216 | `middle` | `row-based` |
| `only-b` | 열 B만 읽음 | 210, 216 | `middle` | `columnar` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **7줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **1줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 176`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `columnar` | 열 기준 (Parquet) | 136, 8, 144, 144 |
| `row-based` | 행 기준 | 292, 8, 144, 144 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `query` | 8, 72, 112 |
| `col-a` | 144, 32, 128 |
| `col-b` | 144, 72, 128 |
| `col-c` | 144, 112, 128 |
| `row-1` | 300, 32, 128 |
| `row-2` | 300, 72, 128 |
| `row-3` | 300, 112, 128 |

**경로**(`widePaths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | `d` |
|---|---|
| `query-col-b` | `M120 88 H144` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `scattered` | 열 B가 세 행에 흩어짐 | 364, 168 | `middle` |
| `only-b` | 열 B만 읽음 | 208, 168 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `row-based` | 행 기준 | `query`, `row-1`, `row-2`, `row-3` | 없음 | `scattered` | 행 기준으로 담으면 같은 열의 값이 행마다 흩어진다. 열 B의 값이 세 블록에 다 들어 있다. | `emr-glue-athena.parquet-columnar-format` |
| `columnar` | Parquet | `query`, `col-b` | `query-col-b` | `only-b` | Parquet는 같은 열을 한데 담아 필요한 열만 읽는다. Athena라면 요금이 붙는 스캔량이 준다. | `emr-glue-athena.parquet-columnar-format`, `emr-glue-athena.athena-encrypted-and-pay-per-query` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `열 기준으로 담으면 쿼리가 읽는 곳이 어떻게 달라질까?`
- `idleCaption`: `저장 방식을 고르면 열 B의 값이 어디에 담기는지 볼 수 있다.`
- `legend`: `파랑: 저장된 데이터 블록 · 회색: 쿼리. 열 A·B·C와 행 1·2·3은 같은 표의 열과 행이다.`
- `label`: `열 지향 형식 도식`, `svgLabel`: `행 기준과 열 기준(Parquet)으로 담은 같은 데이터`
- 도식의 `sources`: `emr-glue-athena.parquet-columnar-format`, `emr-glue-athena.athena-encrypted-and-pay-per-query`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `ColumnarFormatDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 7개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`), 관문 7(폭 280)을 통과한다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이고, 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. `row-based`에는 경로가 없고, `query-col-b`는 `columnar`에서만 보인다.
6. `query-col-b`의 끝점은 두 배치 모두 `col-b` 상자의 왼쪽 변 위에 있다.
7. `columnar`에서 `col-a`·`col-c`와 행 블록 셋이 `0.25`다. `row-based`에서 열 블록 셋이 `0.25`다.
8. 행 블록 셋은 두 배치 모두 「행 기준」 박스 안에, 열 블록 셋은 「열 기준 (Parquet)」 박스 안에, 쿼리는 두 박스 밖에 있다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `emr-glue-athena.parquet-columnar-format` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 176`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 176])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
    그룹 라벨은 `0..440` 안이며 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
15. 세로형의 3번과, 위 5~9번 가운데 배치에 묶이지 않은 단언을 가로형에서도 같은 기대값으로 통과한다.
16. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 247개·경로 200개, 가로 노드 247개·경로 200개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 7개·경로 1개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - 바뀐 파일이 `ColumnarFormatDiagram.tsx`, `ColumnarFormatDiagram.test.tsx`, `emr-glue-athena.json`, `registry.ts`, `phases/62-analytics-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식이 그대로인가.
3. `phases/62-analytics-visuals/index.json`의 step 5을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **행 기준 장면에 쿼리 화살표를 그리지 마라. "행 전체를 읽는다"·"더 많이 읽는다"는 말을 쓰지 마라.** 이유: 본문은 행 기준에서 무엇을 읽는지
  말하지 않는다(ADR-037 phase 62).
- **열 이름(날짜·매출 같은 것)이나 값 예시를 쓰지 마라.** 이유: 데이터에 예시가 없다. `열 A·B·C`·`행 1·2·3`은 구별용 이름이다(ADR-038 「예시의 경계」).
- **압축률·파일 크기·요금 수치를 쓰지 마라.** 이유: 데이터에 없다.
- **장면을 더하지 마라.** 이유: 사용자가 승인한 장면은 둘이다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
