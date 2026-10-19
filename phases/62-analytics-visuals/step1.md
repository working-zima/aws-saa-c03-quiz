# Step 1: cluster-cost-diagram

## 배경

EMR 클러스터에서 "노는 비용"이 생기는 자리는 둘이고, 이 주제의 개념 둘이 하나씩 맡는다.

- `emr-transient-cluster`: 클러스터를 계속 띄워 두는 **장기 실행**과, 작업이 도는 동안만 살아 있다가 끝나면 종료되는 **일시적** 클러스터로
  나뉜다. 하루 몇 시간만 도는 작업이라면 나머지 시간의 클러스터 비용이 낭비다.
- `emr-managed-scaling`: 일시적 클러스터가 **클러스터의 수명**을 줄인다면, 관리형 스케일링은 **클러스터가 도는 동안 노드가 노는 문제**를
  다룬다. 부하를 보고 노드를 더하고 뺀다.

문항 q621과 q622는 **서로의 정답을 오답으로 낸다.** q621(매일 몇 시간만 도는 배치)의 정답이 일시적 클러스터이고 q622(작업 도중 노드가 노는
구간)의 정답이 관리형 스케일링인데, 각자 상대를 보기로 둔다. 이 step은 두 문제를 도식 한 장의 위아래 박스로 나눠 그린다. 위 박스는 하루의
시간축이고, 아래 박스는 긴 작업 하나가 도는 동안의 노드다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — EMR·Glue·Athena·Lake Formation 주제(phase 62)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `emr-glue-athena.emr-managed-scaling`다.** 두 개념을 다 읽은 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/62-analytics-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/emr-glue-athena.json`: step 0이 만든 파일이다. 여기에 `diagrams["cluster-cost"]`를 더한다. **표 둘과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·그룹 박스·시나리오 곁말·가로형 `describe`의 선례.
  **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/IdentityCenterAccessDiagram.tsx`: 곁말마다 `textAnchor`를 두고, 가로형 곁말이 자기 `textAnchor`를 갖는 선례
- `src/components/diagrams/VpcScopeDiagram.tsx`: 화살표 마커가 없는 도식의 선례(그룹 박스 안에 그룹 박스를 두는 방식도 여기 있다)
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `emr-glue-athena` 주제 가운데 `emr-transient-cluster`, `emr-managed-scaling`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/EmrClusterCostDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["cluster-cost"]`
- 매핑: `registry.ts`에 `'emr-glue-athena.emr-managed-scaling': EmrClusterCostDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 위에 「하루」 박스, 아래에 「긴 작업 하나가 도는 동안」 박스를 둔다. 아래 박스 안에는 「부하가 클 때」와 「부하가 작을 때」 두 칸이
나란하다. **경로(화살표)가 없는 도식이다.** 장면은 노드의 opacity와 곁말로만 바뀐다.

```
┌ 하루 ──────────────────────────────┐
│ [작업      ]                        │
│ [장기 실행 클러스터                ]│
│ [일시적 클러스터]                   │
└────────────────────────────────────┘
┌ 긴 작업 하나가 도는 동안 ───────────┐
│ ┌ 부하가 클 때 ┐ ┌ 부하가 작을 때 ┐ │
│ │ [노드]       │ │ [노드]         │ │
│ │ [노드]       │ │ [노는 노드]    │ │
│ │ [노드]       │ │ [노는 노드]    │ │
│ └──────────────┘ └────────────────┘ │
└────────────────────────────────────┘
```

가로형은 같은 두 박스를 위아래로 두되, 위 막대를 넓히고 아래 두 칸의 노드를 한 줄로 편다.

**막대 길이는 시간 비율이 아니다**(ADR-037 phase 62). `작업`과 `일시적 클러스터`는 **같은 x·같은 폭**이어야 하고(작업과 함께 끝난다),
`장기 실행 클러스터`는 그보다 길어야 한다. 그 밖의 길이 관계는 뜻이 없다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고 미리보기로 사용자 승인을 받은
**출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 372`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `day` | 하루 | 4, 8, 272, 144 |
| `work` | 긴 작업 하나가 도는 동안 | 4, 168, 272, 196 |
| `high` | 부하가 클 때 | 12, 192, 124, 144 |
| `low` | 부하가 작을 때 | 144, 192, 124, 144 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `job` | 작업 | `stroke-disabled` | 16, 32, 100 |
| `long-running` | 장기 실행 클러스터 | `stroke-diagram-managed` | 16, 72, 248 |
| `transient` | 일시적 클러스터 | `stroke-diagram-managed` | 16, 112, 100 |
| `high-1` | 노드 | `stroke-diagram-managed` | 24, 216, 100 |
| `high-2` | 노드 | `stroke-diagram-managed` | 24, 256, 100 |
| `high-3` | 노드 | `stroke-diagram-managed` | 24, 296, 100 |
| `low-busy` | 노드 | `stroke-diagram-managed` | 156, 216, 100 |
| `low-idle-1` | 노는 노드 | `stroke-diagram-managed` | 156, 256, 100 |
| `low-idle-2` | 노는 노드 | `stroke-diagram-managed` | 156, 296, 100 |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `idle-cost` | 나머지 시간도 비용 | 192, 52 | `middle` | `long-running` |
| `ends-with-job` | 작업과 함께 종료 | 124, 132 | `start` | `transient` |
| `idle-nodes-cost` | 노는 동안에도 비용 | 206, 352 | `middle` | `no-scaling` |
| `add-nodes` | 부하가 크면 더함 | 74, 352 | `middle` | `managed` |
| `remove-nodes` | 부하가 작으면 뺌 | 206, 352 | `middle` | `managed` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **9줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 292`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `day` | 하루 | 4, 8, 432, 144 |
| `work` | 긴 작업 하나가 도는 동안 | 4, 168, 432, 116 |
| `high` | 부하가 클 때 | 12, 192, 204, 64 |
| `low` | 부하가 작을 때 | 224, 192, 204, 64 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `job` | 16, 32, 140 |
| `long-running` | 16, 72, 408 |
| `transient` | 16, 112, 140 |
| `high-1` | 22, 216, 58 |
| `high-2` | 86, 216, 58 |
| `high-3` | 150, 216, 58 |
| `low-busy` | 234, 216, 58 |
| `low-idle-1` | 298, 216, 58 |
| `low-idle-2` | 362, 216, 58 |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `idle-cost` | 나머지 시간도 비용 | 290, 52 | `middle` |
| `ends-with-job` | 작업과 함께 종료 | 164, 132 | `start` |
| `idle-nodes-cost` | 노는 동안에도 비용 | 326, 272 | `middle` |
| `add-nodes` | 부하가 크면 더함 | 114, 272 | `middle` |
| `remove-nodes` | 부하가 작으면 뺌 | 326, 272 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `long-running` | 장기 실행 | `job`, `long-running` | 없음 | `idle-cost` | 클러스터를 계속 띄워 두면 작업이 끝난 뒤 남은 시간의 비용이 그대로 낭비된다. | `emr-glue-athena.emr-transient-cluster` |
| `transient` | 일시적 클러스터 | `job`, `transient` | 없음 | `ends-with-job` | 작업이 도는 동안만 살아 있다가 끝나면 종료된다. 매일 몇 시간만 도는 작업에서 비용을 낮춘다. | `emr-glue-athena.emr-transient-cluster` |
| `no-scaling` | 스케일링 없음 | `high-1`, `high-2`, `high-3`, `low-busy`, `low-idle-1`, `low-idle-2` | 없음 | `idle-nodes-cost` | 작업이 도는 동안에도 부하가 줄면 노드 여럿이 논다. 클러스터의 수명을 줄이는 것과는 다른 문제다. | `emr-glue-athena.emr-managed-scaling` |
| `managed` | 관리형 스케일링 | `high-1`, `high-2`, `high-3`, `low-busy` | 없음 | `add-nodes`, `remove-nodes` | 부하를 보고 노드를 더하고 뺀다. 필요할 때만 노드가 붙어 있어 긴 작업 안의 유휴 시간이 준다. | `emr-glue-athena.emr-managed-scaling` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `EMR 클러스터가 노는 시간은 어떻게 줄일까?`
- `idleCaption`: `방식을 고르면 클러스터와 노드가 언제 놀고 있는지 볼 수 있다.`
- `legend`: `파랑: EMR 클러스터와 노드 · 회색: 작업. 위 박스는 하루가 왼쪽에서 오른쪽으로 흐르며, 막대 길이는 실제 시간의 비율이 아니다.`
- `label`: `EMR 클러스터 비용 도식`, `svgLabel`: `장기 실행·일시적 클러스터와 관리형 스케일링`
- 도식의 `sources`: `emr-glue-athena.emr-transient-cluster`, `emr-glue-athena.emr-managed-scaling`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `EmrClusterCostDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 9개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`), 관문 7(폭 280)을 통과한다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이고, 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. **경로와 화살표 마커가 없다.** 어느 시나리오에서도 `[data-path]`가 없고, SVG 안에 `marker`가 없다.
6. 두 배치 모두 `job`과 `transient`의 x와 폭이 같고, `long-running`의 폭이 그보다 크다.
7. `managed`에서 `low-idle-1`·`low-idle-2`는 `0.25`, `low-busy`와 `high-1~3`은 `1`이다. `no-scaling`에서는 아래 박스의 노드 여섯이 모두 `1`이다.
8. 위 박스의 장면(`long-running`·`transient`)에서는 아래 박스의 노드 여섯이 모두 `0.25`이고, 아래 박스의 장면에서는 위 박스의 노드 셋이 모두 `0.25`다.
9. 노드 아홉 가운데 `job`만 `stroke-disabled`이고 나머지 여덟은 `stroke-diagram-managed`다. 노드 셋은 「하루」 박스 안에, `high-1~3`은 「부하가 클 때」 안에,
   `low-busy`·`low-idle-1~2`는 「부하가 작을 때」 안에 있고, 두 칸은 「긴 작업 하나가 도는 동안」 박스 안에 있다(두 배치 모두).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `emr-glue-athena.emr-managed-scaling` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 292`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 292])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 217개·경로 177개, 가로 노드 217개·경로 177개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 9개·경로 0개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - 바뀐 파일이 `EmrClusterCostDiagram.tsx`, `EmrClusterCostDiagram.test.tsx`, `emr-glue-athena.json`, `registry.ts`, `phases/62-analytics-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식이 그대로인가.
3. `phases/62-analytics-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **시각(00시·24시)·시간 수치·눈금을 그리거나 쓰지 마라. 문항의 "매일 세 시간"도 쓰지 마라.** 이유: 본문에 수치가 없다. 막대 길이는 시간 비율이
  아니다(ADR-037 phase 62).
- **비용을 좌표축이나 막대 높이로 그리지 마라.** 이유: 「비용은 축으로 그리지 않는다」(ADR-036).
- **코어 노드 추가·인스턴스 유형 변경 장면(q621·q622의 나머지 오답)을 더하지 마라.** 이유: 사용자가 승인한 장면은 넷이다. 그 오답은 본문과
  캡션이 가른다.
- **화살표(경로)를 만들지 마라.** 이유: 이 도식은 노드의 존재와 opacity로만 말한다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
