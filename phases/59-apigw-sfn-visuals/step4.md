# Step 4: map-state-diagram

## 배경

`api-gateway-step-functions.step-functions-map-state` 개념은 이렇게 말한다. Lambda 함수 하나가 목록을 돌며 다른 함수를 여러 번 부르는 구조는
항목 수가 늘면 15분 제한에 걸린다. **Map 상태**를 쓰면 그 반복을 상태 머신이 맡아 항목마다 함수를 한 번씩 호출하고, 병렬로 돌리거나 배치 단위로
나눠 돌릴 수 있다. 핵심은 **기존 함수를 고치지 않는다**는 것이다. 반복문을 함수 밖으로 옮길 뿐이다.

문항 q544는 이 자리에서 EC2로 옮기기, 호출 주기 쪼개기, 비동기 호출을 오답으로 낸다. 이 step은 같은 목록과 같은 함수 호출을 두 열로 나란히
그린다. 왼쪽은 반복문이 함수 **안**에 있고, 오른쪽은 반복을 상태 머신의 Map 상태가 맡는다. 사용자 결정(2026-10-15)은 `docs/ADR.md` ADR-037 끝의
「2026-10-15 확장 — API Gateway·Step Functions 주제(phase 59)」와 ADR-038 끝 문단에 있다. **물음형 제목을 단다**(ADR-038). 늘 보이는 예시
곁말은 없다.

**앵커는 `api-gateway-step-functions.step-functions-map-state`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 59), **ADR-038**(끝 문단 포함)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/59-apigw-sfn-visuals/index.json`의 step 0~3 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/api-gateway-step-functions.json`: 여기에 `diagrams["map-state"]`를 더한다. **이미 있는 표 둘과 도식 셋은 고치지 마라.**
- `src/components/diagrams/StateMachineDiagram.tsx`와 그 테스트: step 3이 만든 같은 주제의 도식이다. **구조와 테스트 방식을 맞춰라.** 고치지 마라.
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 노드 블록·경로 형식과 노드 높이 32를 지켜라.
- `src/data/topics.json`의 `api-gateway-step-functions` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/MapStateDiagram.tsx`
- 문구: JSON `diagrams["map-state"]`
- 매핑: `registry.ts`에 `'api-gateway-step-functions.step-functions-map-state': MapStateDiagram` 한 줄을 더한다. import는 기존 정렬 방식을 따르고,
  키는 이 주제의 줄들 뒤에 둔다.

### 모양

맨 위 가운데에 목록, 왼쪽 열에 `Lambda 함수 하나` 박스(안에 목록을 도는 반복문), 오른쪽 열에 `상태 머신` 박스(안에 Map 상태), 각 박스 아래에
함수 셋을 둔다.

```
              [목록]
┌ Lambda 함수 하나 ┐  ┌ 상태 머신 ──────┐
│ [목록을 도는 반복문]│  │ [Map 상태]      │
└─────────────────┘  └────────────────┘
 [함수][함수][함수]     [함수][함수][함수]
 항목이 늘면 15분 제한   항목마다 한 번씩
```

함수 셋은 "여러 번 호출"을 보이는 그림의 약속이다. 목록의 항목 수를 뜻하지 않는다. 목록에서 Map 상태로 가는 화살표는 목록의 오른쪽 변에서 나와
x 230으로 꺾어 내려간다. 곧게 내리면 그룹 라벨 `상태 머신`(x 154..195)을 가로지르기 때문이다.

아래 좌표는 경계·라벨 폭·교차와 그룹 라벨·곁말의 겹침을 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면
summary에 적는다. `viewBox`는 `0 0 280 212`다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `one-function` | Lambda 함수 하나 | 4, 56, 132, 64 |
| `machine` | 상태 머신 | 144, 56, 132, 64 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `list` | 목록 | `stroke-disabled` | 82, 8, 116 |
| `loop` | 목록을 도는 반복문 | `stroke-disabled` | 12, 80, 116 |
| `map` | Map 상태 | `stroke-diagram-managed` | 152, 80, 116 |
| `loop-fn-1` | 함수 | `stroke-diagram-managed` | 12, 152, 36 |
| `loop-fn-2` | 함수 | `stroke-diagram-managed` | 52, 152, 36 |
| `loop-fn-3` | 함수 | `stroke-diagram-managed` | 92, 152, 36 |
| `map-fn-1` | 함수 | `stroke-diagram-managed` | 152, 152, 36 |
| `map-fn-2` | 함수 | `stroke-diagram-managed` | 192, 152, 36 |
| `map-fn-3` | 함수 | `stroke-diagram-managed` | 232, 152, 36 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `list-loop` | 함수가 목록을 받는다 | `M100 40 V80` |
| `list-map` | Map 상태가 목록을 받는다 | `M198 24 H230 V80` |
| `loop-fn-1` | 반복문이 함수를 부른다 | `M30 112 V152` |
| `loop-fn-2` | 〃 | `M70 112 V152` |
| `loop-fn-3` | 〃 | `M110 112 V152` |
| `map-fn-1` | Map 상태가 항목마다 함수를 부른다 | `M170 112 V152` |
| `map-fn-2` | 〃 | `M210 112 V152` |
| `map-fn-3` | 〃 | `M250 112 V152` |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리(x, y, `textAnchor`) | 보이는 시나리오 |
|---|---|---|---|
| `time-limit` | 항목이 늘면 15분 제한 | 70, 200, `middle` (왼쪽 함수 셋 아래) | `loop` |
| `per-item` | 항목마다 한 번씩 | 210, 200, `middle` (오른쪽 함수 셋 아래) | `map` |

### 시나리오 둘

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `loop` | 함수 안 반복문 | `list`, `loop`, `loop-fn-1`, `loop-fn-2`, `loop-fn-3` | `list-loop`, `loop-fn-1`, `loop-fn-2`, `loop-fn-3` | `time-limit` | 함수 하나가 목록을 돌며 다른 함수를 부르는 구조는 항목 수가 늘면 15분 제한에 걸린다. | `api-gateway-step-functions.step-functions-map-state` |
| `map` | Map 상태 | `list`, `map`, `map-fn-1`, `map-fn-2`, `map-fn-3` | `list-map`, `map-fn-1`, `map-fn-2`, `map-fn-3` | `per-item` | 반복을 상태 머신이 맡아 항목마다 함수를 한 번씩 부른다. 기존 함수 코드는 고치지 않는다. | `api-gateway-step-functions.step-functions-map-state` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `함수를 고치지 않고 15분 제한을 벗어나려면?`
- `idleCaption`: `방식을 고르면 목록의 반복을 누가 맡는지 볼 수 있다.`
- `legend`: `파랑: Lambda 함수와 Map 상태 · 회색: 처리할 목록과 함수 안의 반복문. 함수 셋은 여러 번 부른다는 표시다.`
- `label`: `Map 상태 도식`, `svgLabel`: `함수 안 반복문과 Map 상태의 항목별 호출`
- 도식의 `sources`: `api-gateway-step-functions.step-functions`, `api-gateway-step-functions.step-functions-map-state`

### 테스트: `MapStateDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 아홉이 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
4. `loop`에서 `map`과 `map-fn-1..3`의 opacity가 `0.25`다. `map`에서 `loop`과 `loop-fn-1..3`의 opacity가 `0.25`다. `list`는 두 시나리오에서
   모두 선명하다. 그룹 박스 둘은 어느 시나리오에서도 흐려지지 않는다.
5. `list-map`은 `map`에서만, `list-loop`은 `loop`에서만 보인다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 둘과 그룹 라벨 둘은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `api-gateway-step-functions.step-functions-map-state` 개념을 주면 본문 뒤에 이 도식이 온다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·step 1~3의 도식 파일·`topics.json`·`questions.json`과 JSON의 표 둘·도식 셋이 그대로인가.
3. `phases/59-apigw-sfn-visuals/index.json`의 step 4를 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수), 새 테스트 수와 전체
     테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **동시 실행 수·배치 크기 같은 숫자, 분산 Map·인라인 Map 같은 모드 이름을 쓰지 마라.** 이유: 데이터에 없다. 본문은 "병렬로 돌리거나 배치
  단위로 나눠 돌릴 수 있다"까지만 말한다.
- **목록에 `기기 목록` 같은 구체적 이름을 붙이지 마라.** 이유: 그 이름은 문항 q544에만 있고 본문에는 없다. 예시는 본문에 있는 것만 쓴다(ADR-038).
- **EC2로 옮기기·호출 주기 쪼개기·비동기 호출을 시나리오로 더하지 마라.** 이유: 사용자가 승인한 시나리오는 둘이고, 그 오답들은 캡션의 "기존 함수
  코드는 고치지 않는다"가 가른다.
- **함수 노드의 수로 항목 수나 병렬도를 말하지 마라.** 이유: 함수 셋은 "여러 번 호출"을 보이는 그림의 약속이다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 도식에는 VPC 안 자원이 없다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·step 1~3의 도식·`topics.json`·`questions.json`·JSON의 기존 항목을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
