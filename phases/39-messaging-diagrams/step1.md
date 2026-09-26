# Step 1: eventbridge-routing

## 배경

`sqs-sns-eventbridge` 주제의 EventBridge 개념은 열 개다. 이벤트 버스 세 종류, Scheduler,
이벤트 패턴과 폴링의 대비, 파이프, API 대상, 사설 API로 가는 길, 구성 변경 규칙,
순서·보존의 한계, Step Functions와의 역할 구분. **이 열 개가 지금은 서로 이어지지 않은
열 개의 글이다.** 학습자는 "이벤트가 들어와서 어디를 지나 어디로 나가는가"라는 한 줄기를
머릿속에서 다시 꿰어야 한다.

이 도식은 그 줄기를 한 장에 편다. 소스 세 갈래가 버스 세 종류로 들어오고, 규칙이 이벤트
패턴이냐 일정이냐로 갈리고, 대상이 AWS 안·밖·VPC 안으로 나뉜다. 여기에 규칙과 성격이
다른 파이프가 옆줄로 선다.

step 0이 280 폭 규약이 이 주제에서 성립하는지 이미 판정했다. **이 step은 그 결과 위에 그린다.**

## 읽어야 할 파일

- `phases/39-messaging-diagrams/step0.md` — 이 phase의 규약과 금지사항. 색 배정 원칙이 거기 있다.
- **`phases/39-messaging-diagrams/index.json`의 step 0 `summary`** — 실측값. 가장 긴 라벨과
  그 폭, 2열/전폭 배치의 결과가 적혀 있다. 그 값을 기준으로 이 도식의 배치를 잡아라.
- `src/components/diagrams/MessagingShapesDiagram.tsx` — step 0이 만든 도식. 같은 모양으로 짠다.
- `docs/UI_GUIDE.md`의 **「도식」 절 전체.** `viewBox` 폭 280, 글자 크기 10/9, 래퍼 클래스,
  강조 방식, 접근성 이름, 캡션 규칙이 전부 거기 있다.
- `docs/ADR.md`의 **ADR-036** — 도식 전용 두 색의 뜻과 한계.
- `src/components/diagrams/VpcPathsDiagram.tsx` — VPC 그룹 박스를 그린 선례.
- `src/components/diagrams/DiagramFrame.tsx` — 공통 틀. **고치지 마라.**
- `src/lib/svg-bounds.ts` — `boxesOutsideViewBox`, `estimateTextWidth`.
- `src/data/topics.json`의 **아래 「근거 개념」에 적힌 개념들.**

## 자리

- 컴포넌트: `src/components/diagrams/EventBridgeRoutingDiagram.tsx`
- 매핑: `registry.ts`에 `'sqs-sns-eventbridge.eventbridge': EventBridgeRoutingDiagram` 한 줄.

**앵커가 EventBridge 개념군의 첫 개념인 이유는 이 도식이 지도이기 때문이다.** 뒤에 오는
아홉 개념이 이 그림의 어느 자리를 말하는지 먼저 보여준다. 사용자의 결정이다(2026-09-24).
**앵커를 뒤로 옮기지 마라.**

## 도식 내용

### 그룹

1. `이벤트 소스` — 맨 위.
2. `이벤트 버스` — 세 종류가 세로로 쌓인다.
3. `규칙` — 이벤트 패턴과 일정이 갈리는 자리. 파이프도 이 단에 선다.
4. `대상` — 맨 아래. **그 안에 `VPC` 박스를 점선으로 하나 더 그린다.**

`VPC` 박스가 이 도식의 핵심 한 수다. 대상 대부분은 VPC 밖에 있고, 사설 API만 안에 있다.
그 안과 밖의 차이가 `eventbridge-private-api-target`이 말하는 문제 그대로다.

### 색

- AWS 관리 서비스는 `diagram-managed`(파랑): 버스 셋, 규칙 둘, 파이프, 파이프 소스,
  `aws-service`, `lambda`, `queue`, `sfn`, `api-destination`.
- **`VPC` 박스 안의 노드만 `diagram-resource`(청록)**: `vpc-lambda`, `private-api`.
  ADR-036이 그 색에 준 뜻이 정확히 이것이다.
- 나머지는 무채색(`disabled` 테두리): `my-app`, `partner-saas`, `external-api`.

### 노드 (`id`는 아래 그대로 쓴다)

| id | 라벨 | 단 | 색 |
|---|---|---|---|
| `aws-service` | AWS 서비스 | 이벤트 소스 | `diagram-managed` |
| `my-app` | 내 애플리케이션 | 이벤트 소스 | 무채색 |
| `partner-saas` | 외부 SaaS | 이벤트 소스 | 무채색 |
| `default-bus` | 기본 이벤트 버스 | 이벤트 버스 | `diagram-managed` |
| `custom-bus` | 사용자 지정 이벤트 버스 | 이벤트 버스 | `diagram-managed` |
| `partner-bus` | 파트너 이벤트 버스 | 이벤트 버스 | `diagram-managed` |
| `pattern-rule` | 이벤트 패턴 규칙 | 규칙 | `diagram-managed` |
| `schedule-rule` | 일정 규칙 | 규칙 | `diagram-managed` |
| `pipe-source` | 큐·스트림 | 규칙 | `diagram-managed` |
| `pipe` | EventBridge 파이프 | 규칙 | `diagram-managed` |
| `lambda` | Lambda 함수 | 대상 | `diagram-managed` |
| `queue` | SQS 큐 | 대상 | `diagram-managed` |
| `sfn` | Step Functions | 대상 | `diagram-managed` |
| `api-destination` | API 대상 | 대상 | `diagram-managed` |
| `external-api` | 외부 HTTP API | 대상, VPC 밖 | 무채색 |
| `vpc-lambda` | VPC 연결 Lambda | 대상, **VPC 안** | `diagram-resource` |
| `private-api` | 사설 API | 대상, **VPC 안** | `diagram-resource` |

노드 17개다. step 0보다 셋 많으므로 세로가 더 길어진다. **세로로 긴 것은 허용이고 가로로
넘치는 것이 버그다**(UI_GUIDE 「도식」). 줄이려고 노드를 빼지 마라.

**이벤트 버스 셋은 세로로 쌓아 각각 한 줄 전체 폭을 쓴다.** 이유가 둘이다 —
`사용자 지정 이벤트 버스`의 `estimateTextWidth`가 116을 넘어 2열에 들어가지 않고,
셋이 한 줄씩 나란히 서야 "버스가 세 종류"라는 것이 배치로 읽힌다.
`EventBridge 파이프`도 전체 폭으로 편다(96 + 여백이 2열 폭에 빠듯하다).

### 시나리오 일곱

각 `caption`은 **아래 근거 개념 본문의 사실에서 직접 써라.** 본문 문장을 그대로 옮기지 마라.
두 줄을 넘기지 마라. **그림이 이미 말하는 것을 되풀이하지 말고, 그림이 말하지 못하는 조건이나
제약을 담아라**(UI_GUIDE 「도식」).

| id | label | 경로 | 캡션에 담을 사실 | 근거 개념 id |
|---|---|---|---|---|
| `s1` | AWS 서비스 변경 | `aws-service` → `default-bus` → `pattern-rule` → `lambda` | AWS 서비스가 내는 이벤트는 계정마다 있는 기본 버스로 들어온다 · 리소스의 생성·수정 같은 구성 변경도 이벤트가 되므로 주기적 확인 없이 변경 시점에 대응한다 | `eventbridge-event-bus-types`, `eventbridge-resource-change-rule` |
| `s2` | 내 앱 이벤트 | `my-app` → `custom-bus` → `pattern-rule` → `queue` | 내가 만든 애플리케이션이 이벤트를 올리려면 사용자 지정 버스를 만들어 그쪽으로 보낸다 | `eventbridge-event-bus-types` |
| `s3` | 외부 SaaS | `partner-saas` → `partner-bus` → `pattern-rule` → `lambda` | 파트너 버스는 AWS 밖 SaaS가 보내는 이벤트를 받는 통로다 · 내 애플리케이션의 이벤트를 여기로 흘리는 구성은 용도가 어긋난다 | `eventbridge-event-bus-types` |
| `s4` | 일정 | `schedule-rule` → `lambda` | 시각이나 주기로 실행하므로 "업로드되는 즉시" 같은 요구에는 어긋난다 · 빈 확인에도 비용이 들고 최대 한 주기만큼 늦는다 | `eventbridge-scheduler`, `eventbridge-event-pattern-vs-polling` |
| `s5` | 외부 API로 | `pattern-rule` → `api-destination` → `external-api` | 인증 정보를 EventBridge가 들고 있어 OAuth로 보호된 API도 대상이 된다 · 중계 계층을 직접 만들지 않아도 된다 | `eventbridge-api-destination` |
| `s6` | VPC 안 API | `pattern-rule` → `vpc-lambda` → `private-api` | 대상이 인터넷에 노출되면 안 될 때 VPC에 연결한 함수가 다리가 된다 · 공용 로드 밸런서를 앞에 세우는 구성은 조건을 이미 어긴다 | `eventbridge-private-api-target` |
| `s7` | 파이프(점 대 점) | `pipe-source` → `pipe` → `sfn` | 규칙이 여러 대상으로 라우팅하는 것과 달리 소스 하나와 대상 하나를 잇는다 · 넘기기 전에 걸러내고 형식을 바꿔 주므로 사이에 함수를 끼우지 않아도 된다 | `eventbridge-pipes` |

`s4`가 버스를 지나지 않는 유일한 시나리오다. 빼지 마라 — 일정과 패턴이 갈리는 지점이
`eventbridge-event-pattern-vs-polling`의 본체다.

### 범례

두 색과 무채색이 각각 무엇인지 한 줄.

## 강조 방식

step 0과 같다. UI_GUIDE 「도식」 그대로. 그룹 박스(`VPC` 포함)는 흐려지지 않는다.

## 테스트

`src/components/diagrams/EventBridgeRoutingDiagram.test.tsx`를 **먼저 쓰고 실패를 확인한 뒤**
구현한다.

1. 시나리오를 고르지 않으면 노드 17개가 모두 흐려지지 않은 상태다.
2. `VPC 안 API`를 누르면 `pattern-rule`·`vpc-lambda`·`private-api`만 선명하고 나머지는 흐리다.
3. `일정`을 누르면 버스 세 노드가 모두 흐리다. (버스를 지나지 않는 경로의 회귀 테스트다.)
4. `전체`를 누르면 흐린 노드가 하나도 없고 보이는 경로도 없다.
5. **경계**: 모든 `rect`에서 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`가 빈 배열이다.
6. **글자 넘침**: 노드 17개 각각에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이다.
7. `viewBox`의 폭이 정확히 `280`이다.
8. 캡션 일곱이 각각 **20자를 넘는다.**

5·6·7이 관문 검사다. **글자 크기를 10 밑으로 내리거나 라벨을 줄여서 통과시키지 마라.**

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

경로가 넷 단을 가로질러 내려오므로 **교차 검사기가 이 step에서 걸릴 가능성이 가장 높다.**
걸리면 경로를 우회시키거나 노드 자리를 옮겨라. **검사기를 고쳐서 통과시키지 마라.**

## 기록 — `summary`에 반드시 넣는다

- 최종 `viewBox` (`0 0 280 <높이>`)
- 전체 폭으로 편 노드 목록과 2열로 둔 노드 수
- 교차 검사에서 걸린 경로가 있었다면 무엇을 어떻게 우회시켰는지
- 관문 검사 5·6·7의 통과 여부

## 금지사항

- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **다른 도식을 만들거나 step 0의 도식을 고치지 마라.**
- **`DiagramFrame.tsx`를 고치지 마라.** 모자란 것은 `summary`에 적어라.
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 도식이나 캡션에 그대로 옮기지 마라.** 사실만 가져오고 문장은 직접 쓴다.
- **없는 사실을 그리지 마라.** 위 표에 근거 개념 id가 없는 노드나 경로를 더하지 마라.
  특히 **Step Functions를 "EventBridge의 대체재"로 그리지 마라** — `eventbridge-vs-step-functions`가
  말하는 것은 역할의 차이이지 라우팅 경로가 아니다. 이 도식에서 `sfn`은 파이프의 대상일 뿐이다.
- **EventBridge가 사설 API를 직접 대상으로 삼는 경로를 그리지 마라.** 그런 경로가 있기는 하지만
  연결과 VPC Lattice 리소스 구성이 따로 필요해서, `eventbridge-private-api-target`이 그것을
  "엔드포인트를 그대로 대상 자리에 적는 것과는 다른 이야기"라고 선을 긋는다.
- 기존 테스트를 깨뜨리지 마라.
