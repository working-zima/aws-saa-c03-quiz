# Step 3: sqs-message-life

## 배경

SQS 개념 열셋 가운데 넷은 **메시지 하나가 큐에서 겪는 일**을 서로 다른 자리에서 말한다.
가시성 타임아웃은 가져간 메시지를 얼마나 숨길지, 데드레터 큐는 계속 실패하는 것을 어디로
보낼지, 보존 기간은 아무도 꺼내지 않은 것이 언제 사라질지를 정한다.

**이 넷은 사실 한 줄기의 네 지점이다.** 따로 읽으면 각각 설정값 하나로 보이고, 왜 중복
처리가 생기는지나 왜 실패한 하나가 뒤를 막는지가 서지 않는다. 한 그림에 놓으면 메시지가
어디에 있다가 어디로 가는지가 경로가 된다.

**시간 흐름을 좌표축으로 그리지 마라.** 이 도식도 다른 넷과 같은 배치도다 — 메시지가
**놓이는 자리**를 노드로 두고, 자리를 옮기는 것을 경로로 그린다. 축을 만들면 본문에 없는
시간 관계를 좌표로 지어내게 된다(ADR-036의 "비용은 축으로 그리지 않는다"와 같은 이유다).

## 읽어야 할 파일

- `phases/39-messaging-diagrams/step0.md` — 이 phase의 규약과 금지사항. 색 배정 원칙이 거기 있다.
- **`phases/39-messaging-diagrams/index.json`의 step 0~2 `summary`** — 실측값과 교차 검사에서
  걸렸던 자리.
- `src/components/diagrams/MessagingShapesDiagram.tsx`,
  `src/components/diagrams/EventBridgeRoutingDiagram.tsx`,
  `src/components/diagrams/SnsFanoutDiagram.tsx` — 앞선 세 도식.
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**, 「색상」, 「AI 슬롭 안티패턴」.
- `docs/ADR.md`의 **ADR-036**.
- `src/components/diagrams/DiagramFrame.tsx` — 공통 틀. **고치지 마라.**
- `src/lib/svg-bounds.ts` — `boxesOutsideViewBox`, `estimateTextWidth`.
- `src/data/topics.json`의 **`sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time`**,
  **`sqs-sns-eventbridge.dead-letter-queue`**, **`sqs-sns-eventbridge.sqs-details`**,
  **`sqs-sns-eventbridge.sqs-batch-and-polling`**.

## 자리

- 컴포넌트: `src/components/diagrams/SqsMessageLifeDiagram.tsx`
- 매핑: `registry.ts`에 `'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time': SqsMessageLifeDiagram` 한 줄.

앵커가 가시성 타임아웃 개념인 이유: 넷 중 **중복 처리라는 증상을 다루는 유일한 개념**이고,
그 증상이 이 그림에서 경로 하나(`reappear`)로 설명된다. 데드레터 큐와 보존 기간은 그보다
앞선 자리(개념 1·2)에서 이미 나오므로 이 자리까지 읽으면 노드 이름이 전부 아는 말이 된다.

## 도식 내용

### 그룹

1. `SQS 큐` 박스 — 점선. 안에 `waiting`과 `hidden` 둘만 넣는다.
2. 박스 **밖**에 나머지 다섯 노드.

**이 도식의 1차 채널은 큐 박스의 안과 밖이다.** 메시지가 아직 큐 안에 있는지(대기 중이든
숨겨졌든), 아니면 큐를 떠났는지(소비자가 들고 있든, 삭제됐든, 데드레터 큐로 옮겨졌든,
보존 기간이 지나 사라졌든)가 위치로 갈린다.

### 색

- `diagram-managed`(파랑): `waiting`, `hidden`, `dlq`. AWS가 관리하는 큐 안팎의 자리다.
- 무채색(`disabled` 테두리): `producer`, `consumer`, `deleted`, `expired`.
- **`diagram-resource`(청록)를 쓰지 마라.** VPC 계층이 없다(ADR-036).

### 노드 (`id`는 아래 그대로 쓴다)

| id | 라벨 | 자리 | 색 |
|---|---|---|---|
| `producer` | 생산자 | 큐 밖, 위 | 무채색 |
| `waiting` | 대기 중인 메시지 | **큐 안** | `diagram-managed` |
| `hidden` | 숨겨진 메시지 | **큐 안** | `diagram-managed` |
| `consumer` | 소비자 | 큐 밖, 아래 | 무채색 |
| `deleted` | 처리 후 삭제 | 큐 밖, 아래 | 무채색 |
| `dlq` | 데드레터 큐 | 큐 밖, 아래 | `diagram-managed` |
| `expired` | 보존 기간 만료 | 큐 밖, 아래 | 무채색 |

노드 7개다. 이 phase에서 가장 작은 도식이다.

`hidden`의 라벨은 `숨겨진 메시지`다. **`가시성 타임아웃`을 노드 라벨로 쓰지 마라** —
그것은 자리가 아니라 그 자리에 머무는 시간을 정하는 설정값이고, 캡션에서 말한다.

### 경로 (`id`는 아래 그대로 쓴다)

| id | 경로 | 뜻 |
|---|---|---|
| `enqueue` | `producer` → `waiting` | 큐에 넣는다 |
| `take` | `waiting` → `consumer` | 소비자가 가져간다 |
| `hide` | `waiting` → `hidden` | 가져간 그 메시지가 큐 안에서 숨는다 |
| `delete` | `consumer` → `deleted` | 처리를 마치고 삭제한다 |
| `reappear` | `hidden` → `waiting` | 삭제 전에 시간이 지나 다시 보인다 |
| `to-dlq` | `waiting` → `dlq` | 재시도 한도를 넘어 옮겨진다 |
| `expire` | `waiting` → `expired` | 보존 기간이 지나 사라진다 |

`take`와 `hide`가 한 동작의 두 결과다. 둘을 하나로 합치지 마라 — **메시지가 소비자에게
가는 것과 큐 안에서 숨는 것이 동시에 일어난다는 것**이 가시성 타임아웃을 이해하는 자리다.

### 시나리오 넷

각 `caption`은 **근거 개념 본문의 사실에서 직접 써라.** 본문 문장을 그대로 옮기지 마라.
두 줄을 넘기지 마라. **그림이 말하지 못하는 조건과 수치를 담아라.**

| id | label | 경로 | 캡션에 담을 사실 | 근거 개념 id |
|---|---|---|---|---|
| `s1` | 정상 처리 | `enqueue` → `take` → `hide` → `delete` | 가져간 메시지는 그동안 숨겨지고, 처리를 마치고 삭제해야 사라진다 | `sqs-visibility-timeout-vs-processing-time` |
| `s2` | 처리가 늦을 때 | `take` → `hide` → `reappear` | 삭제 전에 가시성 타임아웃이 지나면 다시 보여 한 번 더 집혀 간다 · 고치는 방법은 타임아웃을 소비자의 최대 처리 시간 이상으로 올리는 것이고, Lambda면 함수 타임아웃이 그 기준이다 | `sqs-visibility-timeout-vs-processing-time` |
| `s3` | 계속 실패할 때 | `take` → `hide` → `reappear` → `to-dlq` | 처리에 실패해도 사라지지 않고 다시 시도되며, 그래도 실패하면 따로 모인다 · 실패한 하나가 뒤를 막는 것을 그렇게 막는다 | `dead-letter-queue` |
| `s4` | 아무도 안 꺼낼 때 | `enqueue` → `expire` | 보존 기간은 최대 14일이고, 그 안에 꺼내지 않으면 사라진다 · "48시간이 지나면 자동 삭제" 같은 요구를 이 설정만으로 푼다 | `sqs-details` |

**`s2`의 캡션에 Lambda 함수 타임아웃을 반드시 넣어라.** 그림은 "다시 보인다"까지만 말하고,
무엇을 얼마로 올려야 하는지는 말하지 못한다.

**`전달 지연`을 도식에 넣지 마라.** 앵커 개념이 그것을 "이미 가져간 메시지가 되살아나는
재처리에는 손대지 못하는 다른 값"이라고 밀어내고 있다. 노드나 경로로 그리면 이 도식이
그 둘을 같은 줄기에 놓게 된다.

### 범례

색 하나와 무채색이 각각 무엇인지 한 줄.

## 강조 방식

step 0~2와 같다. UI_GUIDE 「도식」 그대로. 큐 그룹 박스는 흐려지지 않는다.

## 테스트

`src/components/diagrams/SqsMessageLifeDiagram.test.tsx`를 **먼저 쓰고 실패를 확인한 뒤**
구현한다.

1. 시나리오를 고르지 않으면 노드 7개가 모두 흐려지지 않은 상태다.
2. `처리가 늦을 때`를 누르면 `waiting`·`hidden`·`consumer`만 선명하고 `dlq`·`expired`·
   `deleted`는 흐리다.
3. `계속 실패할 때`를 누르면 `dlq`가 선명하고 `deleted`는 흐리다.
4. `전체`를 누르면 흐린 노드가 하나도 없고 보이는 경로도 없다.
5. **경계**: 모든 `rect`에서 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`가 빈 배열이다.
6. **글자 넘침**: 노드 7개 각각에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이다.
7. `viewBox`의 폭이 정확히 `280`이다.
8. 캡션 넷이 각각 **20자를 넘는다.**
9. `s2` 캡션에 `Lambda`가 들어 있다. 근거 있는 사실이 캡션에서 빠지는 것을 막는 회귀 테스트다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

`reappear`가 `hidden`에서 `waiting`으로 되돌아가는 역방향 경로라 **`take`·`hide`와 겹치기
쉽다.** 겹치면 큐 박스 안에서 우회시켜라.

## 기록 — `summary`에 반드시 넣는다

- 최종 `viewBox` (`0 0 280 <높이>`)
- `take`·`hide`·`reappear` 셋을 겹치지 않게 어떻게 배치했는지
- 관문 검사 5·6·7의 통과 여부
- **이 phase의 도식 네 장 전체의 `viewBox` 높이 합** — 한 주제에 도식 넷이 들어가면 개념
  읽기 화면이 얼마나 길어지는지의 기록이다.

## 금지사항

- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **다른 도식을 만들거나 step 0~2의 도식을 고치지 마라.**
- **`DiagramFrame.tsx`를 고치지 마라.**
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 도식이나 캡션에 그대로 옮기지 마라.**
- **시간을 좌표축으로 그리지 마라.** 눈금·타임라인·경과 시간 라벨을 넣지 마라.
  이유: 본문은 보존 기간 14일 말고 어떤 시간 값도 말하지 않는다. 축을 그리면 가시성
  타임아웃과 재시도 간격의 길이 관계를 근거 없이 지어내게 된다.
- **배치·롱 폴링·메시지 크기 한계를 이 도식에 넣지 마라.** `sqs-batch-and-polling`을 읽으라고
  한 것은 가시성 타임아웃과 롱 폴링이 **서로 다른 문제를 푼다**는 것을 확인하라는 뜻이다.
  노드로 더하면 한 줄기였던 그림이 설정값 목록이 된다.
- 기존 테스트를 깨뜨리지 마라.
