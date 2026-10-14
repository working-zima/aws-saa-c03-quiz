# Step 1: integration-diagram

## 배경

API Gateway가 받은 요청을 백엔드에 넘기는 방식은 이 주제의 개념 셋에 나뉘어 있다.

- `api-gateway-lambda-proxy-integration`: AWS_PROXY 통합은 헤더를 포함한 요청을 Lambda 함수에 그대로 넘기고 **동기식으로** 호출해, 함수의
  결과가 곧 응답이 된다.
- `api-gateway-aws-service-integration`: 통합 유형을 AWS로 두면 메서드가 DynamoDB의 PutItem 같은 서비스 작업을 **직접** 부른다. 사이에 함수가 없다.
- `api-gateway-mapping-template-limits`: 필드 이름을 바꾸거나 값을 옮기는 정도는 매핑 템플릿에서 끝나지만, JSON 주문을 XML 문서로 만드는 것처럼
  형식이 통째로 바뀌는 변환은 매핑 템플릿을 넘어 통합 대상인 Lambda 함수의 코드가 맡는다.

문항 q539·q541·q546·q547은 이 넷을 서로의 오답으로 낸다. 이 step은 넷을 도식 하나로 그리고 시나리오 버튼으로 바꿔 본다. 사용자 결정(2026-10-15)은
`docs/ADR.md` ADR-037 끝의 「2026-10-15 확장 — API Gateway·Step Functions 주제(phase 59)」와 ADR-038 끝 문단에 있다. **물음형 제목을 단다**(ADR-038).
늘 보이는 예시 곁말은 없다.

**앵커는 `api-gateway-step-functions.api-gateway-mapping-template-limits`다.** 통합을 다루는 세 개념을 다 읽은 자리다. 이 개념에는 기존 도식이
없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 59), **ADR-038**(끝 문단 포함)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「물음형 제목과 예시」 포함)
- `phases/59-apigw-sfn-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/api-gateway-step-functions.json`: step 0이 만든 파일이다. 여기에 `diagrams["integration"]`을 더한다. **표 둘은 고치지 마라.**
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·그룹 박스·시나리오 곁말을 쓰는 도식의 선례.
  **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/IdentityCenterAccessDiagram.tsx`: 곁말마다 `textAnchor`가 다른 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `api-gateway-step-functions` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/ApiIntegrationDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["integration"]`
- 매핑: `registry.ts`에 `'api-gateway-step-functions.api-gateway-mapping-template-limits': ApiIntegrationDiagram` 한 줄을 더한다. import는 기존
  정렬 방식을 따르고, 키는 step 0이 모아 둔 이 주제의 줄들 뒤에 둔다.

### 모양

맨 위에 클라이언트, 가운데에 API Gateway 박스(안에 매핑 템플릿), 그 아래 왼쪽에 Lambda 함수, 오른쪽에 DynamoDB PutItem, 맨 아래 오른쪽에 백엔드를 둔다.

```
            [클라이언트]
┌ API Gateway ───────────────────────┐
│                     [매핑 템플릿]    │
└────────────────────────────────────┘
 [Lambda 함수]        [DynamoDB PutItem]
                      [백엔드]
```

프록시 통합의 응답 화살표는 Lambda 함수에서 위로 올라가 클라이언트의 왼쪽 변으로 들어간다. 요청과 응답이 모두 API Gateway 박스를 지난다.
매핑 템플릿에서 백엔드로 가는 화살표는 **오른쪽 바깥 통로(x 270)**로 내려간다. Lambda 함수에서 백엔드로 가는 화살표는 **두 열 사이 통로(x 140)**로
내려간다. 노드를 뚫지 않게 하려는 것이다.

아래 좌표는 경계·라벨 폭·교차를 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.
`viewBox`는 `0 0 280 272`다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `api-gateway` | API Gateway | 4, 56, 272, 72 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `client` | 클라이언트 | `stroke-disabled` | 82, 8, 116 |
| `mapping` | 매핑 템플릿 | `stroke-diagram-managed` | 184, 80, 76 |
| `lambda` | Lambda 함수 | `stroke-diagram-managed` | 20, 168, 108 |
| `dynamodb` | DynamoDB PutItem | `stroke-diagram-managed` | 152, 168, 108 |
| `backend` | 백엔드 | `stroke-disabled` | 152, 232, 108 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `request-lambda` | 요청이 API Gateway를 지나 Lambda 함수로 간다 | `M110 40 V168` |
| `lambda-response` | 함수의 결과가 응답으로 돌아온다 | `M76 168 V24 H82` |
| `request-dynamodb` | 메서드가 PutItem을 직접 부른다 | `M170 40 V168` |
| `request-mapping` | 요청이 매핑 템플릿을 지난다 | `M190 40 V80` |
| `mapping-backend` | 손본 요청이 백엔드로 간다 | `M260 96 H270 V248 H260` |
| `lambda-backend` | 함수가 바꾼 문서가 백엔드로 간다 | `M128 184 H140 V248 H152` |

`request-lambda`는 `proxy`와 `transform` 두 시나리오에 함께 쓰인다.

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리(x, y, `textAnchor`) | 보이는 시나리오 |
|---|---|---|---|
| `as-is` | 헤더까지 그대로 | 116, 150, `start` (요청 화살표 오른쪽) | `proxy` |
| `as-response` | 결과가 곧 응답 | 70, 150, `end` (응답 화살표 왼쪽) | `proxy` |
| `no-function` | 함수 없이 직접 | 176, 150, `start` | `service` |
| `fields-only` | 필드 이름·값만 | 264, 150, `end` (오른쪽 통로 왼쪽) | `mapping` |
| `json` | JSON | 116, 150, `start` | `transform` |
| `xml` | XML | 144, 220, `start` (가운데 통로 오른쪽, 백엔드 위) | `transform` |

### 시나리오 넷

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `proxy` | Lambda 프록시 | `client`, `lambda` | `request-lambda`, `lambda-response` | `as-is`, `as-response` | 요청을 헤더까지 그대로 함수에 넘기는 동기 호출이라, 함수의 결과가 곧 응답이 된다. | `api-gateway-step-functions.api-gateway-lambda-proxy-integration` |
| `service` | AWS 서비스 | `client`, `dynamodb` | `request-dynamodb` | `no-function` | 메서드가 DynamoDB PutItem을 바로 부른다. 사이에 함수가 없어 관리할 코드도 없다. | `api-gateway-step-functions.api-gateway-aws-service-integration` |
| `mapping` | 매핑 템플릿 | `client`, `mapping`, `backend` | `request-mapping`, `mapping-backend` | `fields-only` | 필드 이름을 바꾸거나 값을 옮기는 정도는 매핑 템플릿에서 끝내고 백엔드로 넘긴다. | `api-gateway-step-functions.api-gateway-mapping-template-limits` |
| `transform` | JSON을 XML로 | `client`, `lambda`, `backend` | `request-lambda`, `lambda-backend` | `json`, `xml` | JSON 주문을 XML 문서로 바꾸는 변환은 매핑 템플릿의 범위를 넘어, 함수 코드가 맡는다. | `api-gateway-step-functions.api-gateway-mapping-template-limits` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `API Gateway는 받은 요청을 어떻게 넘길까?`
- `idleCaption`: `통합 방식을 고르면 요청이 무엇을 거쳐 넘어가는지 볼 수 있다.`
- `legend`: `파랑: API Gateway의 기능과 통합 대상 AWS 서비스 · 회색: 클라이언트와 백엔드. 위로 돌아오는 화살표는 응답이다.`
- `label`: `API Gateway 통합 방식 도식`, `svgLabel`: `API Gateway가 요청을 백엔드에 넘기는 방식`
- 도식의 `sources`: `api-gateway-step-functions.api-gateway`, `api-gateway-step-functions.api-gateway-lambda-proxy-integration`,
  `api-gateway-step-functions.api-gateway-aws-service-integration`, `api-gateway-step-functions.api-gateway-mapping-template-limits`

### 테스트: `ApiIntegrationDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 다섯이 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
4. 시나리오마다 선명한 노드 밖의 노드는 opacity가 `0.25`다. 특히 `transform`에서 `mapping`과 `dynamodb`가 `0.25`다.
   그룹 박스는 어느 시나리오에서도 흐려지지 않는다.
5. `request-lambda`는 `proxy`·`transform`에서만, `lambda-response`는 `proxy`에서만, `mapping-backend`는 `mapping`에서만 보인다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 여섯과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `api-gateway-step-functions.api-gateway-mapping-template-limits` 개념을 주면 본문 뒤에 이 도식이 온다.
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
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·step 0의 표 둘이 그대로인가.
3. `phases/59-apigw-sfn-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수), 새 테스트 수와 전체
     테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **매핑 템플릿 문법(VTL 등)·통합 요청/통합 응답·HTTP 프록시 통합·비동기 호출 경로를 그리거나 쓰지 마라.** 이유: 이 도식의 근거 개념에 없거나,
  있더라도(비동기 호출) 오답으로만 나온다. 비동기 호출은 캡션의 "동기 호출"이 가른다.
- **백엔드 노드에 ALB·ECS·EC2 같은 서비스 이름을 붙이지 마라.** 이유: 매핑 템플릿 개념은 백엔드를 특정하지 않는다. 예시는 본문에 있는 것만
  쓴다(ADR-038).
- **AWS 서비스 통합에서 매핑 템플릿이 쓰이는지 쓰지 마라.** 이유: 데이터에 없다. `service`에서 `mapping`이 흐린 것은 "이 시나리오의 요점이
  아니다"라는 표시일 뿐이다.
- **다섯째 시나리오(예: 두 파트너가 서로 다른 형식으로 보내는 q547 구성)를 더하지 마라.** 이유: 사용자가 승인한 것은 이 넷이다. q547의 판단은
  `mapping`·`transform`의 대비로 선다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 도식에는 VPC 안 자원이 없다(ADR-036, ADR-037 phase 59).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·step 0의 표를 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
