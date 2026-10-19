# Step 2: node-roles-diagram

## 배경

EMR 클러스터의 노드 셋은 역할이 다르고, 비용과 성능을 어디에 쓸지가 그 차이에서 나온다. 이 주제의 개념 둘에 있다.

- `emr-node-types`: 프라이머리 노드는 클러스터를 관리하고, 코어 노드는 분산 파일 시스템에 데이터를 저장하며, 태스크 노드는 저장 없이 추가
  처리만 한다. 그래서 태스크 노드는 회수돼도 다시 시도하면 되므로 **스팟**으로 돌리고, 코어 노드를 스팟으로 돌리면 **회수될 때 데이터가 함께
  사라지므로** 손실이 없어야 하는 워크로드에서는 프라이머리·코어를 **온디맨드**로 둔다.
- `emr-node-instance-family-choice`: 데이터를 저장·처리하는 코어·태스크 노드에 **메모리 최적화**를 쓰고, 관리만 하는 프라이머리 노드는
  **범용**으로 둔다.

문항 q617(코어와 태스크를 가르는 기준)·q618(스팟으로 둬도 되는 노드)·q629(메모리 최적화를 쓸 노드)는 셋 다 "다른 노드의 역할"을 오답으로 낸다.
q621의 보기 "프라이머리 노드를 스팟으로"도 같은 축이다. 이 step은 노드 셋과 분산 파일 시스템을 그리고 장면 넷으로 바꿔 본다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — EMR·Glue·Athena·Lake Formation 주제(phase 62)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `emr-glue-athena.emr-node-instance-family-choice`다.** 노드를 다루는 두 개념을 다 읽은 자리다. 같은 주제의 `emr-managed-scaling`에 붙는 클러스터 비용 도식(step 1)보다 뒤에 나온다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/62-analytics-visuals/index.json`의 step 0~1 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/emr-glue-athena.json`: step 0이 만든 파일이다. 여기에 `diagrams["node-roles"]`를 더한다. **표 둘과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·그룹 박스·시나리오 곁말·가로형 `describe`의 선례.
  **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/IdentityCenterAccessDiagram.tsx`: 곁말마다 `textAnchor`를 두고, 가로형 곁말이 자기 `textAnchor`를 갖는 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `emr-glue-athena` 주제 가운데 `emr`, `emr-node-types`, `emr-node-instance-family-choice`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/EmrNodeRolesDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["node-roles"]`
- 매핑: `registry.ts`에 `'emr-glue-athena.emr-node-instance-family-choice': EmrNodeRolesDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 클러스터 박스 하나 안에 위쪽 가운데 프라이머리 노드, 그 아래 왼쪽 코어·오른쪽 태스크, 코어 아래 분산 파일 시스템을 둔다.

```
┌ EMR 클러스터 ─────────────────────┐
│          [프라이머리 노드]         │
│                                    │
│   [코어 노드]       [태스크 노드]  │
│                                    │
│   [분산 파일 시스템]               │
└────────────────────────────────────┘
```

가로형은 왼쪽에 프라이머리, 가운데 열에 코어(위)와 태스크(아래), 코어 오른쪽에 분산 파일 시스템을 둔다. 관리 화살표는 프라이머리의 위·아래
변에서 나와 꺾여 코어·태스크의 왼쪽 변으로 들어간다.

코어 노드가 회수되는 장면(`core-spot`)은 UI_GUIDE 「수량과 상태를 바꾸는 도식」의 장애 표시를 따른다 — 색을 칠하지 않고 코어 노드와 분산 파일
시스템을 흐리게(`0.25`) 두고 곁말로 말한다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고 미리보기로 사용자 승인을 받은
**출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 248`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `cluster` | EMR 클러스터 | 4, 8, 272, 232 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `primary` | 프라이머리 노드 | `stroke-diagram-managed` | 82, 36, 116 |
| `core` | 코어 노드 | `stroke-diagram-managed` | 20, 116, 108 |
| `task` | 태스크 노드 | `stroke-diagram-managed` | 152, 116, 108 |
| `fs` | 분산 파일 시스템 | `stroke-disabled` | 20, 196, 108 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `primary-core` | 프라이머리가 코어 노드를 관리한다 | `M110 68 V116` |
| `primary-task` | 프라이머리가 태스크 노드를 관리한다 | `M170 68 V116` |
| `core-fs` | 코어 노드가 데이터를 저장한다 | `M74 148 V196` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `manage` | 클러스터 관리 | 204, 56 | `start` | `roles` |
| `store` | 데이터 저장 | 80, 176 | `start` | `roles` |
| `compute-only` | 추가 처리만 | 206, 168 | `middle` | `roles` |
| `on-demand-primary` | 온디맨드 | 204, 56 | `start` | `task-spot` |
| `on-demand-core` | 온디맨드 | 74, 168 | `middle` | `task-spot` |
| `spot-task` | 스팟 | 206, 168 | `middle` | `task-spot`, `core-spot` |
| `core-reclaimed` | 스팟이라 회수됨 | 74, 168 | `middle` | `core-spot` |
| `data-lost` | 데이터도 함께 사라짐 | 134, 216 | `start` | `core-spot` |
| `general-primary` | 범용 | 204, 56 | `start` | `memory` |
| `memory-core` | 메모리 최적화 | 74, 168 | `middle` | `memory` |
| `memory-task` | 메모리 최적화 | 206, 168 | `middle` | `memory` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **4줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **3줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 160`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `cluster` | EMR 클러스터 | 4, 8, 432, 144 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `primary` | 16, 64, 104 |
| `core` | 168, 32, 104 |
| `task` | 168, 104, 104 |
| `fs` | 316, 32, 108 |

**경로**(`widePaths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | `d` |
|---|---|
| `primary-core` | `M68 64 V48 H168` |
| `primary-task` | `M68 96 V120 H168` |
| `core-fs` | `M272 48 H316` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `manage` | 클러스터 관리 | 68, 140 | `middle` |
| `store` | 데이터 저장 | 220, 84 | `middle` |
| `compute-only` | 추가 처리만 | 280, 124 | `start` |
| `on-demand-primary` | 온디맨드 | 68, 140 | `middle` |
| `on-demand-core` | 온디맨드 | 220, 84 | `middle` |
| `spot-task` | 스팟 | 280, 124 | `start` |
| `core-reclaimed` | 스팟이라 회수됨 | 220, 84 | `middle` |
| `data-lost` | 데이터도 함께 사라짐 | 370, 84 | `middle` |
| `general-primary` | 범용 | 68, 140 | `middle` |
| `memory-core` | 메모리 최적화 | 220, 84 | `middle` |
| `memory-task` | 메모리 최적화 | 280, 124 | `start` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `roles` | 노드 역할 | `primary`, `core`, `task`, `fs` | `primary-core`, `primary-task`, `core-fs` | `manage`, `store`, `compute-only` | 프라이머리는 클러스터를 관리하고 코어는 분산 파일 시스템에 데이터를 저장한다. 태스크는 처리만 한다. | `emr-glue-athena.emr-node-types` |
| `task-spot` | 태스크만 스팟 | `primary`, `core`, `task`, `fs` | 없음 | `on-demand-primary`, `on-demand-core`, `spot-task` | 태스크 노드는 회수돼도 다시 시도하면 되므로 스팟으로 돌린다. 프라이머리·코어는 온디맨드로 둔다. | `emr-glue-athena.emr-node-types` |
| `core-spot` | 코어도 스팟 | `primary`, `task` | 없음 | `core-reclaimed`, `data-lost`, `spot-task` | 코어 노드를 스팟으로 돌리면 회수될 때 그 위의 데이터가 함께 사라진다. 손실이 없어야 하면 피한다. | `emr-glue-athena.emr-node-types` |
| `memory` | 메모리 최적화 | `core`, `task` | 없음 | `general-primary`, `memory-core`, `memory-task` | 메모리 최적화는 데이터를 저장·처리하는 코어와 태스크에 쓴다. 관리만 하는 프라이머리는 범용이면 된다. | `emr-glue-athena.emr-node-instance-family-choice` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `EMR 클러스터의 노드는 저마다 무엇을 맡을까?`
- `idleCaption`: `장면을 고르면 노드마다 맡는 일과 알맞은 인스턴스를 볼 수 있다.`
- `legend`: `파랑: 클러스터의 노드 · 회색: 코어 노드가 데이터를 담는 분산 파일 시스템. 프라이머리 노드에서 나가는 화살표는 관리다.`
- `label`: `EMR 노드 역할 도식`, `svgLabel`: `EMR 클러스터의 프라이머리·코어·태스크 노드`
- 도식의 `sources`: `emr-glue-athena.emr`, `emr-glue-athena.emr-node-types`, `emr-glue-athena.emr-node-instance-family-choice`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `EmrNodeRolesDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 4개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`), 관문 7(폭 280)을 통과한다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이고, 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 경로 셋은 `roles`에서만 보인다. 나머지 장면에는 경로가 없다.
6. `spot-task` 곁말은 `task-spot`과 `core-spot` 두 장면에서 보이고, 나머지에서는 없다.
7. `core-spot`에서 `core`·`fs`가 `0.25`이고 `primary`·`task`는 `1`이다. `memory`에서 `primary`·`fs`가 `0.25`다.
8. 노드 넷은 두 배치 모두 클러스터 박스 안에 있다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `emr-glue-athena.emr-node-instance-family-choice` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 160`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 160])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 221개·경로 180개, 가로 노드 221개·경로 180개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 4개·경로 3개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - 바뀐 파일이 `EmrNodeRolesDiagram.tsx`, `EmrNodeRolesDiagram.test.tsx`, `emr-glue-athena.json`, `registry.ts`, `phases/62-analytics-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식이 그대로인가.
3. `phases/62-analytics-visuals/index.json`의 step 2을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **분산 파일 시스템에 제품 이름(HDFS 등)을 붙이지 마라.** 이유: 본문은 「분산 파일 시스템」이라고만 쓴다(ADR-037 phase 62).
- **인스턴스 유형 이름(r5 같은 것)이나 가격·할인율을 쓰지 마라.** 이유: 데이터에 없다.
- **코어 노드가 관리를 함께 한다는 것을 곁말로 따로 그리지 마라.** 이유: 본문의 "관리에 더해 저장"을 그림으로 옮기면 프라이머리와 구별이 흐려진다.
  가르는 점인 저장만 그린다.
- **장면을 더하지 마라.** 이유: 사용자가 승인한 장면은 넷이다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
