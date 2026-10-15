# Step 0: api-gateway-tables

## 배경

`api-gateway-step-functions` 주제는 개념 20개 가운데 14개가 API Gateway다. 그중 둘이 문항에서 가장 자주 섞인다.

- **어느 API 유형을 고르나.** REST API·HTTP API·WebSocket API, 그리고 함께 후보로 오르는 Lambda 함수 URL이다(q089·q200·q530·q531·q532·q533).
  문단으로 읽으면 비용·지연·JWT·타임아웃·고급 기능이 다섯 개념에 흩어져 있어 한눈에 견주어지지 않는다.
- **API 호출을 무엇이 거르나.** 리소스 정책·권한 부여자·API 키·엔드포인트 정책·보안 그룹이다(q534·q535·q540·q548).
  오답이 늘 "다른 장치가 하는 일"을 엉뚱한 장치에 붙인 것이다.

이 step은 둘을 비교표 둘로 옮긴다. 이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-10-15)은 `docs/ADR.md` ADR-037 끝의
「2026-10-15 확장 — API Gateway·Step Functions 주제(phase 59)」에 있다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 59)
- `docs/UI_GUIDE.md`의 **「도식」 중 「비교표」**. 특히 끊을 수 없는 영문 이름과 긴 한글 낱말의 열 폭 규칙
- `src/types/visuals.ts`: `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts`: `visualsByTopicId`
- `src/data/visuals/governance-iac.json`: 주제 JSON 파일의 최근 선례
- `src/data/visuals/route53.json`의 `tables["routing-policies"]`: **열 둘(30/70%)짜리 표의 선례**
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/governanceTables.tsx`, `src/components/diagrams/governanceTables.test.tsx`: 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 `api-gateway-step-functions` 주제 개념 전부(20개)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/api-gateway-step-functions.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`에 이 파일의 import와 `visualsByTopicId['api-gateway-step-functions']` 키를 더한다. 기존 import·키의 정렬 방식(알파벳순)을
  따른다. 이 키는 알파벳순으로 맨 앞이다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 1~4가 채운다.

### 2. 표 하나: JSON `tables["api-types"]`

- `label`: `API Gateway 유형과 Lambda 함수 URL`
- `columns`: `["유형", "고를 때", "고르지 않을 때"]`
- `columnWidths`: `["30%", "35%", "35%"]`. **이 값을 바꾸지 마라.** 320px에서 표 폭은 288px이고 칸마다 9px이 빠진다. 배포 사이트 Windows
  Chrome 실측으로 행 머리 `WebSocket`(굵기 500)이 70.6px, 칸의 `스로틀링이`가 70px이다. 30%(77.4px)·35%(91.8px)보다 좁히면 320px에서
  이 낱말들이 가운데에서 끊긴다(UI_GUIDE 「비교표」).
- `sources`: `api-gateway-step-functions.api-gateway`, `api-gateway-step-functions.api-gateway-jwt-authorizer`,
  `api-gateway-step-functions.api-gateway-rest-vs-http-timeout`, `api-gateway-step-functions.api-gateway-rest-only-features`,
  `api-gateway-step-functions.api-gateway-websocket-api`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 쉼표도
  그대로다. `API 키, 요청 검증, 스로틀링이`를 가운뎃점으로 잇지 않은 것은 가운뎃점이 줄바꿈 기회가 아니어서 한 덩어리가 칸보다 길어지기 때문이다.

| 행 머리 | 고를 때 | 고르지 않을 때 | 근거 개념 |
|---|---|---|---|
| REST API | API 키, 요청 검증, 스로틀링이 필요할 때 | 비용과 지연을 낮추는 것이 먼저일 때 | `api-gateway` p1, `api-gateway-rest-only-features` p0·p1, `api-gateway-jwt-authorizer` p0 |
| HTTP API | 싸고 빠르게 JWT 인증과 ALB 통합을 쓸 때 | 몇 분 걸리는 동기 호출이나 API 키가 필요할 때 | `api-gateway` p2, `api-gateway-jwt-authorizer` summary, `api-gateway-rest-vs-http-timeout` p0, `api-gateway-rest-only-features` p0 |
| WebSocket API | 연결을 열어 둔 채 메시지를 주고받을 때 | 요청에 응답하고 끝나는 RESTful 호출일 때 | `api-gateway-websocket-api` p0·p1, `api-gateway-rest-vs-http-timeout` p1 |
| Lambda 함수 URL | 함수를 곧장 열기만 하면 될 때 | API 관리 기능이 필요할 때 | `api-gateway-rest-vs-http-timeout` p1 |

### 3. 표 둘: JSON `tables["access-control"]`

- `label`: `API 호출을 거르는 장치`
- `columns`: `["장치", "하는 일"]`
- `columnWidths`: `["30%", "70%"]`. **이 값을 바꾸지 마라.** 행 머리 `엔드포인트 정책`의 `엔드포인트`(굵기 500)가 Windows Chrome에서 70px이라
  30%(77.4px)에 들어간다. 둘째 열의 가장 긴 덩어리 `엔드포인트를`·`인터페이스`는 70%(192.6px)에 넉넉히 들어간다.
- `sources`: `api-gateway-step-functions.api-gateway-resource-policy`, `api-gateway-step-functions.api-gateway-ip-restriction-by-resource-policy`,
  `api-gateway-step-functions.api-gateway-api-key-not-auth`, `api-gateway-step-functions.api-gateway-jwt-authorizer`,
  `api-gateway-step-functions.api-gateway-lambda-proxy-integration`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다.

| 행 머리 | 하는 일 | 근거 개념 |
|---|---|---|
| 리소스 정책 | 호출할 수 있는 계정과 IP 주소 범위를 정한다. 다른 계정에만 열거나 사내 IP만 허용할 때 쓴다. | `api-gateway-resource-policy` summary·p0, `api-gateway-ip-restriction-by-resource-policy` p0 |
| 권한 부여자 | 로그인한 사용자의 신원을 확인한다. 인증 방식이 표준이 아니면 사용자 지정 권한 부여자를 붙인다. | `api-gateway-api-key-not-auth` p0, `api-gateway-lambda-proxy-integration` p1, `api-gateway-jwt-authorizer` p0 |
| API 키 | 어느 클라이언트가 호출했는지 구분해 사용량을 잰다. 신원은 확인하지 않는다. | `api-gateway-api-key-not-auth` summary·p0 |
| 엔드포인트 정책 | 프라이빗 API를 부르는 인터페이스 VPC 엔드포인트의 트래픽에 통제를 더한다. 계정 간 접근은 리소스 정책이 정한다. | `api-gateway-resource-policy` p1 |
| 보안 그룹 | 붙일 수 없다. API Gateway는 VPC 안에 만들어지는 리소스가 아니다. | `api-gateway-ip-restriction-by-resource-policy` p1 |

### 4. 래퍼와 매핑

- `src/components/diagrams/apiGatewayTables.tsx`에 `ApiTypeTable`과 `ApiAccessControlTable`을 둔다. `governanceTables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`에 두 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따르고, 키는 기존 키들 **뒤에 이 주제의 줄을 모아** 둔다.
  - `'api-gateway-step-functions.api-gateway': ApiTypeTable` — 주제 첫 개념이라 표가 읽기 전의 지도 노릇을 한다(phase 48 `tool-choice`와 같은 자리).
  - `'api-gateway-step-functions.api-gateway-ip-restriction-by-resource-policy': ApiAccessControlTable` — 장치 다섯을 모두 읽은 뒤인 API Gateway의
    마지막 개념이다.
- 두 개념 모두 기존 도식이 없으므로 registry 값은 표 컴포넌트 하나씩이다.

### 5. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/apiGatewayTables.test.tsx`:

1. `visualsByTopicId['api-gateway-step-functions']`가 있고 `glossary`는 빈 배열이다. `diagrams`의 내용은 단언하지 마라 — step 1~4가
   도식을 더하면 깨진다.
2. `tables['api-types']`의 `label`·`columns`·`columnWidths`·`sources`가 위와 같고, 행 머리 넷이 위 순서와 같으며 칸 문구가 위 표와 같다.
3. `tables['access-control']`의 `label`·`columns`·`columnWidths`·`sources`가 위와 같고, 행 머리 다섯이 위 순서와 같으며 칸 문구가 위 표와 같다.
4. 두 표의 어느 칸에도 `O`·`X`·`○`·`×` 한 글자짜리 판정과 `가능`·`불가`가 없다.
5. 렌더된 `colgroup`의 폭이 각각 `["30%", "35%", "35%"]`, `["30%", "70%"]`다.
6. `ConceptList`에 `api-gateway-step-functions.api-gateway` 개념을 주면 본문 뒤에 `api-types` 표가 `figure` 하나로 오고, 그 접근성 이름이
   `label`과 같다. `api-gateway-ip-restriction-by-resource-policy` 개념도 같은 방식으로 `access-control` 표가 온다.

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
2. 다음을 확인한다.
   - 칸에 위 표 밖의 사실이 없는가.
   - 판정에 색·이모지·O/X가 없는가.
   - `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`topics.json`·`questions.json`·다른 주제의 visuals JSON이 그대로인가.
   - 기존 테스트를 고치지 않았는가.
3. `phases/59-apigw-sfn-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 표 id 둘과 앵커, 래퍼 이름, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **`columnWidths`를 바꾸거나 칸 문구를 다듬지 마라.** 이유: 320px에서 영문 이름과 긴 한글 낱말이 끊기지 않는 폭과 문구를 실측해 정했다.
  문구를 바꾸면 줄바꿈이 달라진다.
- **HTTP API가 리소스 정책을 지원하는지, 엣지 최적화가 REST API 전용인지, 타임아웃 초 단위 수치, 스로틀링 한도를 쓰지 마라.** 이유: 데이터에 없다.
- **Lambda 함수 URL을 API Gateway 유형이라고 쓰지 마라.** 이유: 본문은 "함께 후보로 오르는" 것으로만 다룬다. 표 제목이 둘을 나눠 부른다.
- **Express·표준 워크플로 표를 만들지 마라.** 이유: 사용자가 고른 표는 둘이고, 표준 쪽 사실이 하나뿐이다(ADR-037 phase 59).
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: 약어 툴팁은 VPC 주제에만 둔다(ADR-037).
- **도식을 만들지 마라.** 이유: step 1~4의 범위다.
- 기존 테스트를 깨뜨리지 마라.
