# Step 0: messaging-shapes

## 배경

`sqs-sns-eventbridge` 주제는 개념 33개를 담은 이 앱에서 가장 큰 주제다. 그런데 학습자가
여기서 막히는 지점은 개념 하나하나가 아니라 **다섯 서비스가 서로 무엇이 다른가**다.
SQS·SNS·EventBridge·Amazon MQ·SES가 모두 "메시지를 어딘가로 보낸다"로 읽혀서
기능이 비슷해 보이고, 어느 것이 어디에 붙는지가 글만으로는 서지 않는다.

이 도식은 **다섯을 같은 배치도 위에 올려 전달 모양의 차이를 위치로 보여준다.**
한 명이 꺼내 가는가(SQS), 모두가 같은 것을 받는가(SNS), 규칙에 맞는 것만 가는가(EventBridge),
프로토콜을 그대로 쓰는가(Amazon MQ), 이메일 자체가 목적인가(SES).

**이 step은 phase 39의 관문이다.** 네 장 중 노드가 가장 많고 라벨도 가장 길다.
280 폭 규약이 이 주제에서 성립하는지 여기서 판정된다. 여기서 깨지면 step 1~3은
그리기 전에 다시 짠다. 그래서 이 step의 `summary`에는 **실측값을 남겨야 한다**(아래 「기록」).

## 읽어야 할 파일

- `docs/UI_GUIDE.md`의 **「도식」 절 전체.** 이 phase의 규약은 전부 거기 확정돼 있다.
  `viewBox` 폭 280, 글자 크기 10/9, 래퍼 클래스, 강조 방식, 접근성 이름, 캡션 규칙.
  **그 절을 읽지 않고 그리지 마라.** phase 38이 브라우저 실측으로 얻은 값들이다.
- `docs/UI_GUIDE.md`의 「색상」·「AI 슬롭 안티패턴」·「터치 영역」.
- `docs/ADR.md`의 **ADR-036** — 도식 전용 두 색의 뜻과 한계.
- `src/components/diagrams/DiagramFrame.tsx` — 공통 틀. **고치지 마라.**
- `src/components/diagrams/VpcPathsDiagram.tsx` — 가장 가까운 선례. 노드 배열·경로 문자열·
  시나리오 배열의 모양과 SVG 뼈대를 그대로 따른다.
- `src/components/diagrams/VpcPathsDiagram.test.tsx` — 테스트의 선례.
- `src/lib/svg-bounds.ts` — `boxesOutsideViewBox`, `estimateTextWidth`.
- `src/components/diagrams/registry.ts` — 매핑. 이 step은 여기에 **한 줄만** 더한다.
- `src/data/topics.json`의 **아래 「근거 개념」에 적힌 개념들.** 도식에 담는 사실은 전부 여기서 나온다.

## 자리

- 컴포넌트: `src/components/diagrams/MessagingShapesDiagram.tsx`
- 매핑: `registry.ts`에 `'sqs-sns-eventbridge.sqs': MessagingShapesDiagram` 한 줄.

**앵커가 주제의 첫 개념인 이유는 이 도식이 정리가 아니라 지도이기 때문이다.**
phase 38의 도식 다섯은 "그 자리까지 읽은 것의 정리"라 개념군 뒤쪽에 붙었다. 이 도식은
반대다 — 다섯 서비스를 읽기 **전에** 전체 배치를 먼저 보여주려는 것이고, 사용자의 결정이다
(2026-09-24). 그래서 도식에는 학습자가 아직 읽지 않은 이름이 먼저 나온다. 그것이 의도다.
**앵커를 뒤로 옮기지 마라.**

## 도식 내용

### 그룹 (위에서 아래로 세 단)

1. `보내는 쪽` — 메시지를 만드는 것들.
2. `AWS 전달 장치` — 다섯 서비스가 여기 나란히 선다. 이 도식의 본체다.
3. `받는 쪽` — 메시지가 닿는 것들.

그룹 박스는 **경계가 아니라 단계**를 가른다. phase 38의 리전·VPC·서브넷과 뜻이 다르지만
1차 채널이 위치라는 규약은 같다 — 색을 전부 회색으로 바꿔도 세 단이 읽혀야 한다.

### 색

- `AWS 전달 장치` 안의 다섯 노드만 `diagram-managed`(파랑). AWS 관리 서비스라는 뜻이다.
- **나머지 노드는 전부 무채색(`disabled` 테두리)이다.**
- **`diagram-resource`(청록)를 이 도식에 쓰지 마라.** ADR-036이 그 색에 "VPC·서브넷 안 자원"
  이라는 뜻을 박아 두었는데 이 도식에는 VPC 계층이 없다. 뜻 없는 색이 하나 늘 뿐이다.

### 노드 (`id`는 아래 그대로 쓴다)

| id | 라벨 | 단 | 색 |
|---|---|---|---|
| `app` | 애플리케이션 | 보내는 쪽 | 무채색 |
| `aws-service` | AWS 서비스 | 보내는 쪽 | 무채색 |
| `saas` | 외부 SaaS | 보내는 쪽 | 무채색 |
| `legacy-app` | 기존 온프레미스 앱 | 보내는 쪽 | 무채색 |
| `queue` | SQS 큐 | AWS 전달 장치 | `diagram-managed` |
| `topic` | SNS 주제 | AWS 전달 장치 | `diagram-managed` |
| `bus` | EventBridge 이벤트 버스 | AWS 전달 장치 | `diagram-managed` |
| `broker` | Amazon MQ 브로커 | AWS 전달 장치 | `diagram-managed` |
| `ses` | SES | AWS 전달 장치 | `diagram-managed` |
| `worker` | 워커 하나 | 받는 쪽 | 무채색 |
| `subscribers` | 구독자 여럿 | 받는 쪽 | 무채색 |
| `targets` | 규칙에 맞는 대상 | 받는 쪽 | 무채색 |
| `legacy-consumer` | 기존 앱 | 받는 쪽 | 무채색 |
| `inbox` | 이메일 수신함 | 받는 쪽 | 무채색 |

`bus`의 라벨은 `estimateTextWidth('EventBridge 이벤트 버스', 10)`이 121.5다.
2열에 넣지 말고 **한 줄 전체 폭으로 펴라.** 라벨을 `EventBridge 버스`로 줄이지 마라 —
개념 본문이 "이벤트 버스"라고 부른다.

`legacy-app`의 `기존 온프레미스 앱`은 91이라 여백을 더하면 103이다. VpcPathsDiagram이 쓴
2열 폭 108에 들어가기는 하지만 여유가 5밖에 없다. **그 노드의 폭을 재서 관문 검사 6을
통과하는지 확인하고, 빠듯하면 그 줄만 전체 폭으로 펴라.**

### 시나리오 다섯

각 `caption`은 **아래 근거 개념 본문의 사실에서 직접 써라.** 본문 문장을 그대로 옮기지 마라
(CLAUDE.md 「원본 데이터」). 두 줄을 넘기지 마라. **그림이 이미 말하는 것을 되풀이하지 말고,
그림이 말하지 못하는 조건이나 제약을 담아라**(UI_GUIDE 「도식」).

| id | label | 경로 | 캡션에 담을 사실 | 근거 개념 id |
|---|---|---|---|---|
| `s1` | SQS | `app` → `queue` → `worker` | 큐는 한 메시지를 한 소비자가 가져간다 · 뒷단이 느려도 쌓아 두는 내구성 버퍼가 된다 | `sqs-sns-eventbridge.sqs`, `sqs-sns-eventbridge.sns-is-not-a-queue` |
| `s2` | SNS | `app` → `topic` → `subscribers` | 같은 메시지가 구독한 모든 대상에 복제된다 · 쌓아 두지 않고 즉시 밀어내므로 버퍼가 아니다 | `sqs-sns-eventbridge.sns`, `sqs-sns-eventbridge.sns-is-not-a-queue` |
| `s3` | EventBridge | `aws-service` → `bus` → `targets` | 규칙에 맞는 이벤트만 대상으로 간다 · 순서를 보장하지 않고 24시간을 넘겨 보관하지 않는다 | `sqs-sns-eventbridge.eventbridge`, `sqs-sns-eventbridge.eventbridge-ordering-and-retention` |
| `s4` | Amazon MQ | `legacy-app` → `broker` → `legacy-consumer` | 표준 프로토콜을 그대로 쓰므로 옮길 때 애플리케이션의 메시징 방식을 바꾸지 않는다 | `sqs-sns-eventbridge.amazon-mq` |
| `s5` | SES | `app` → `ses` → `inbox` | 알림은 SNS로도 되지만 이메일 자체가 목적일 때 고른다 | `sqs-sns-eventbridge.ses` |

`s3`에서 `saas`와 `app`도 버스로 들어갈 수 있지만 **경로를 셋 다 켜지 마라.** 한 시나리오의
선이 셋이면 280 폭에서 엉킨다. 소스가 세 갈래라는 것은 step 1의 EventBridge 도식이 맡는다.
`saas` 노드는 `s3`의 `nodes`에 넣어 선명하게 두되 경로는 `aws-service` 쪽 하나만 그린다.

### 범례

색 하나와 무채색이 각각 무엇인지 한 줄. 위치로도 읽히므로 범례는 거들 뿐이다.

## 강조 방식

UI_GUIDE 「도식」 그대로다. 시나리오의 `nodes`에 없는 노드는 opacity `0.25`, 있는 노드는 `1`.
그룹 박스는 흐려지지 않는다. `전체`에서는 모든 노드가 선명하고 경로는 전부 숨는다.
경로는 `title` 색 2px 선에 화살표 마커. **opacity 전환 애니메이션을 넣지 마라.**

## 테스트

`src/components/diagrams/MessagingShapesDiagram.test.tsx`를 **먼저 쓰고 실패를 확인한 뒤**
구현한다(CLAUDE.md 「개발 프로세스」).

1. 시나리오를 고르지 않으면 노드 14개가 모두 흐려지지 않은 상태다.
2. `SNS`를 누르면 `app`·`topic`·`subscribers`만 선명하고 나머지는 흐리다.
3. 버튼을 누르면 캡션이 그 시나리오의 설명으로 바뀐다.
4. `전체`를 누르면 흐린 노드가 하나도 없고 보이는 경로도 없다.
5. **경계**: 렌더한 SVG의 모든 `rect`에서 `x`/`y`/`width`/`height`를 긁어
   `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`가 빈 배열이다.
6. **글자 넘침**: 노드 14개 각각에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이다.
7. `viewBox`의 폭이 정확히 `280`이다.
8. 캡션 다섯이 각각 **20자를 넘는다.** 한 줄 요약으로 주저앉는 것을 막는 회귀 테스트다.

5·6·7이 이 step의 관문 검사다. **통과하지 못하면 노드를 넓히거나 세로로 펴서 다시 배치해라.**
글자 크기를 10 밑으로 내리거나 라벨을 줄여서 통과시키지 마라.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

마지막 검사기는 `src/components/diagrams` 전체를 보므로 새 도식도 자동으로 대상이 된다.
경로선이 무관한 노드의 상자를 뚫고 지나가면 exit 1이다. **검사기를 고쳐서 통과시키지 마라.**

## 기록 — `summary`에 반드시 넣는다

step 1~3이 같은 규약으로 그리려면 이 step의 실측이 필요하다. `index.json`의 `summary`에
아래를 한 줄로 적어라.

- 최종 `viewBox` (`0 0 280 <높이>`)
- 노드 14개 중 **가장 긴 라벨**과 그 `estimateTextWidth(라벨, 10)` 값, 그 노드에 준 폭
- 2열로 배치한 노드 수와 1열 전체 폭으로 편 노드 수
- 관문 검사 5·6·7의 통과 여부
- `DiagramFrame`에 모자란 것이 있었다면 무엇인지 (고치지는 마라)

## 금지사항

- **`registry.ts`에 두 줄 이상 더하지 마라.** 이 step의 도식은 하나다.
- **다른 도식을 만들지 마라.** step 1~3의 범위다.
- **`DiagramFrame.tsx`를 고치지 마라.** 이유: 이제 아홉 장이 공유하는 파일이고, 한 step이
  혼자 바꾸면 기존 다섯 장의 실측 규약이 함께 흔들린다. 모자란 것은 `summary`에 적어라.
- **`src/data/` 아래 JSON을 고치지 마라.** 도식과 개념 본문이 어긋나 보이면 본문을 고치지 말고
  `summary`에 적어라. 본문 수정은 이 phase의 범위가 아니다.
- **개념 본문 문장을 도식이나 캡션에 그대로 옮기지 마라.** 사실만 가져오고 문장은 직접 쓴다.
  이유: `docs/source/concepts-raw.md`가 외부 참고 자료의 추출 전문이다(ADR-009).
- **없는 사실을 그리지 마라.** 위 표에 근거 개념 id가 없는 노드나 경로를 더하지 마라.
  특히 SQS의 FIFO·표준 구분, SNS의 필터 정책, EventBridge의 파이프·API 대상을 이 도식에
  넣지 마라 — 이 도식의 일은 다섯의 **전달 모양**을 가르는 것 하나다. 세부는 뒤 개념과
  step 1~3의 도식이 맡는다.
- 기존 테스트를 깨뜨리지 마라.
