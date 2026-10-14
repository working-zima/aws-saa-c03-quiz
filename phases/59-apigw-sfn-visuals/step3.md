# Step 3: state-machine-diagram

## 배경

Step Functions가 무엇을 하는지는 이 주제의 개념 셋에 나뉘어 있다.

- `step-functions`: Lambda 등의 작업을 여러 단계로 잇고, 각 단계의 실행 상태와 재시도·오류 처리·실패를 자동으로 관리한다. Lambda의 15분
  제한과 달리 오래 걸리는 작업도 맡는다.
- `step-functions-features`: 워크플로 중간에 **관리자 승인**을 넣을 수 있다. 같은 흐름을 애플리케이션 코드로 짜면 부담이 훨씬 크다.
- `step-functions-long-running-workflow`: 실행은 **최대 1년** 이어진다. 태스크 하나가 5분이어도 전체가 24시간 걸리면, Lambda 함수 하나로 전
  과정을 감싸는 구성은 15분 제한에 걸린다. 시작 신호는 S3 버킷이 EventBridge로 보낸 이벤트이고, 상태 머신을 대상으로 둔 규칙이 업로드마다
  실행을 시작한다.

문항 q088·q206·q542가 이 자리를 묻는다. q542의 오답 하나가 "Lambda 함수 하나가 전 과정을 감싼다"이다. 이 step은 상태 머신 하나를 박스로 그리고,
그 아래에 함수 하나로 감싸는 구성을 대비로 둔다. 사용자 결정(2026-10-15)은 `docs/ADR.md` ADR-037 끝의 「2026-10-15 확장 — API Gateway·Step
Functions 주제(phase 59)」와 ADR-038 끝 문단에 있다. **물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다.

**앵커는 `api-gateway-step-functions.step-functions-long-running-workflow`다.** 이 도식이 기대는 세 개념(머리 개념, 수동 승인, 장시간 실행)을
다 읽은 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 59), **ADR-038**(끝 문단 포함)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/59-apigw-sfn-visuals/index.json`의 step 0~2 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/api-gateway-step-functions.json`: 여기에 `diagrams["state-machine"]`을 더한다. **이미 있는 표 둘과 도식 둘은 고치지 마라.**
- `src/components/diagrams/ApiIntegrationDiagram.tsx`·`ApiEndpointPathDiagram.tsx`와 그 테스트: 같은 주제의 도식이다. **구조와 테스트 방식을
  맞춰라.** 이 파일들은 고치지 마라.
- `src/components/diagrams/EventBridgeRoutingDiagram.tsx`: Step Functions를 EventBridge의 대상으로 그린 기존 도식이다. 고치지 마라.
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 노드 블록·경로 형식과 노드 높이 32를 지켜라.
- `src/data/topics.json`의 `api-gateway-step-functions` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/StateMachineDiagram.tsx`
- 문구: JSON `diagrams["state-machine"]`
- 매핑: `registry.ts`에 `'api-gateway-step-functions.step-functions-long-running-workflow': StateMachineDiagram` 한 줄을 더한다. import는 기존
  정렬 방식을 따르고, 키는 이 주제의 줄들 뒤에 둔다.

### 모양

맨 위에 S3 버킷과 EventBridge 규칙, 가운데에 `상태 머신` 박스(안에 태스크 → 관리자 승인 → 태스크), 맨 아래에 대비할 구성인 `Lambda 함수 하나로
전부 처리`를 둔다.

```
 [S3 버킷] → [EventBridge 규칙]
                    │
┌ 상태 머신 ─────────────────────────────┐
│ [태스크] → [관리자 승인] → [태스크]        │
│   ↺ (실패하면 다시)                      │
└────────────────────────────────────────┘
 [Lambda 함수 하나로 전부 처리]
```

규칙에서 첫 태스크로 가는 화살표는 S3 버킷 아래의 통로(y 52)로 꺾어 내려간다. 내려가는 세로선(x 70)은 그룹 라벨 `상태 머신`(x 14..55)의 오른쪽을
지난다. 재시도 화살표는 첫 태스크의 아래 변에서 나와 다시 아래 변으로 들어가는 고리다.

아래 좌표는 경계·라벨 폭·교차와 그룹 라벨·곁말의 겹침을 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면
summary에 적는다. `viewBox`는 `0 0 280 256`이다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `machine` | 상태 머신 | 4, 64, 272, 104 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `s3` | S3 버킷 | `stroke-diagram-managed` | 20, 8, 108 |
| `rule` | EventBridge 규칙 | `stroke-diagram-managed` | 152, 8, 108 |
| `task-a` | 태스크 | `stroke-diagram-managed` | 12, 96, 76 |
| `approval` | 관리자 승인 | `stroke-diagram-managed` | 102, 96, 76 |
| `task-b` | 태스크 | `stroke-diagram-managed` | 192, 96, 76 |
| `one-lambda` | Lambda 함수 하나로 전부 처리 | `stroke-diagram-managed` | 20, 200, 240 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `s3-rule` | 버킷이 이벤트를 보낸다 | `M128 24 H152` |
| `rule-task` | 규칙이 상태 머신의 실행을 시작한다 | `M206 40 V52 H70 V96` |
| `retry` | 실패한 태스크를 다시 시도한다 | `M64 128 V144 H36 V128` |
| `task-approval` | 태스크 다음에 승인 단계가 온다 | `M88 112 H102` |
| `approval-task` | 승인 다음 단계로 넘어간다 | `M178 112 H192` |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리(x, y, `textAnchor`) | 보이는 시나리오 |
|---|---|---|---|
| `per-upload` | 업로드마다 실행 시작 | 268, 78, `end` (상태 머신 그룹 라벨 줄의 오른쪽) | `start` |
| `on-failure` | 실패하면 다시 | 72, 150, `start` (재시도 고리 오른쪽) | `retry` |
| `up-to-year` | 실행은 최대 1년 | 268, 78, `end` (상태 머신 그룹 라벨 줄의 오른쪽) | `one-lambda` |
| `limit-15` | 15분 제한에 걸림 | 140, 248, `middle` (맨 아래 노드 아래) | `one-lambda` |

`per-upload`와 `up-to-year`는 같은 자리를 쓰지만 서로 다른 시나리오에서만 보인다.

### 시나리오 넷

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `start` | 업로드로 시작 | `s3`, `rule`, `task-a` | `s3-rule`, `rule-task` | `per-upload` | 업로드 이벤트가 EventBridge로 가고, 상태 머신을 대상으로 둔 규칙이 실행을 시작한다. | `api-gateway-step-functions.step-functions-long-running-workflow` |
| `retry` | 실패하면 재시도 | `task-a` | `retry` | `on-failure` | 단계마다 실행 상태를 상태 머신이 관리해, 실패한 태스크를 자동으로 다시 시도한다. | `api-gateway-step-functions.step-functions` |
| `approval` | 관리자 승인 | `task-a`, `approval`, `task-b` | `task-approval`, `approval-task` | (없음) | 단계 사이에 관리자 승인을 넣을 수 있다. 같은 흐름을 코드로 짜면 부담이 훨씬 크다. | `api-gateway-step-functions.step-functions-features` |
| `one-lambda` | Lambda 하나로 | `one-lambda` | (없음) | `up-to-year`, `limit-15` | 전체가 24시간 걸리면 함수 하나로는 15분 제한에 걸린다. 상태 머신의 실행은 최대 1년이다. | `api-gateway-step-functions.step-functions-long-running-workflow`, `api-gateway-step-functions.step-functions` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `one-lambda`는 경로가 없는 시나리오다. 맨 아래 노드만 선명하고, 상태 머신 박스의 라벨 줄에 `실행은 최대 1년`이 붙어 두 구성이 대비된다.
- `question`: `15분을 넘는 여러 단계 작업은 누가 이어 갈까?`
- `idleCaption`: `장면을 고르면 상태 머신이 단계를 잇고 관리하는 모습을 볼 수 있다.`
- `legend`: `파랑: AWS 서비스와 상태 머신의 단계. 큰 박스가 상태 머신 하나이고, 맨 아래는 견줘 볼 구성이다.`
- `label`: `Step Functions 상태 머신 도식`, `svgLabel`: `상태 머신이 잇는 태스크와 관리자 승인`
- 도식의 `sources`: `api-gateway-step-functions.step-functions`, `api-gateway-step-functions.step-functions-features`,
  `api-gateway-step-functions.step-functions-long-running-workflow`

### 테스트: `StateMachineDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 여섯이 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다. `approval`에는 곁말이 없고, `one-lambda`에는 경로가 없다.
4. 시나리오마다 선명한 노드 밖의 노드는 opacity가 `0.25`다. 특히 `one-lambda`에서 `task-a`·`approval`·`task-b`가, 나머지 셋에서 `one-lambda`가
   `0.25`다. 그룹 박스는 어느 시나리오에서도 흐려지지 않는다.
5. `retry`는 `retry` 시나리오에서만, `rule-task`는 `start`에서만 보인다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 넷과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `api-gateway-step-functions.step-functions-long-running-workflow` 개념을 주면 본문 뒤에 이 도식이 온다.
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
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·step 1·2의 도식 파일·`EventBridgeRoutingDiagram.tsx`·`topics.json`·`questions.json`과 JSON의
     표 둘·도식 둘이 그대로인가.
3. `phases/59-apigw-sfn-visuals/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수), 새 테스트 수와 전체
     테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **상태 이름(Task·Wait·Choice·Parallel 등)·콜백 토큰·Amazon States Language·재시도 횟수와 간격을 쓰지 마라.** 이유: 데이터에 없다.
- **Express·표준 워크플로를 이 도식에 넣지 마라.** 이유: 사용자가 고른 범위 밖이고, 표준 쪽 사실이 하나뿐이다(ADR-037 phase 59).
- **태스크에 Lambda·Batch 같은 서비스 이름을 붙이지 마라.** 이유: 본문은 "Lambda 등의 작업"으로만 말하고 이 흐름의 태스크를 특정하지 않는다.
  예시는 본문에 있는 것만 쓴다(ADR-038).
- **시간을 막대 길이나 축으로 그리지 마라.** 이유: 15분과 1년을 길이로 그리면 본문에 없는 비율 관계를 만든다(ADR-036 「비용은 축으로 그리지 않는다」와
  같은 이유). 시간은 곁말과 캡션의 글자로만 쓴다.
- **`Lambda 함수 하나로 전부 처리` 노드에 경로를 잇지 마라.** 이유: 본문은 그 구성이 어디서 시작되는지 말하지 않는다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 도식에는 VPC 안 자원이 없다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·step 1·2의 도식·`EventBridgeRoutingDiagram.tsx`·`topics.json`·`questions.json`·JSON의 기존 항목을
  고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
