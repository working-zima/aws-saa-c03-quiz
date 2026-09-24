# Step 2: sns-fanout

## 배경

`sqs-sns-eventbridge.sns-sqs-fanout-per-consumer` 개념은 **맞는 구성 하나와 틀린 구성 둘을
글로 나란히 세운다.** 소비자마다 큐를 두면 모두가 모든 이벤트를 받고, 큐 하나를 여럿이
폴링하면 나눠 받게 되어 그 성질이 깨지고, 이벤트 버스가 소비자를 직접 부르면 소비자별
버퍼가 없어진다.

**셋의 차이는 배치의 차이다.** 글로 읽으면 "큐가 몇 개인가"가 왜 중요한지 잘 서지 않는데,
세 구성을 같은 그림 위에서 갈아 끼우면 큐 줄이 통째로 사라지는 것이 눈에 보인다.

step 0·1보다 노드가 적고 경로가 많은 도식이다. **경로가 겹치지 않게 배치하는 것이 이 step의
어려운 부분이다.**

## 읽어야 할 파일

- `phases/39-messaging-diagrams/step0.md` — 이 phase의 규약과 금지사항. 색 배정 원칙이 거기 있다.
- **`phases/39-messaging-diagrams/index.json`의 step 0·1 `summary`** — 실측값과 교차 검사에서
  걸렸던 자리. 같은 실수를 되풀이하지 마라.
- `src/components/diagrams/MessagingShapesDiagram.tsx`,
  `src/components/diagrams/EventBridgeRoutingDiagram.tsx` — 앞선 두 도식. 같은 모양으로 짠다.
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**, 「색상」, 「AI 슬롭 안티패턴」.
- `docs/ADR.md`의 **ADR-036**.
- `src/components/diagrams/DiagramFrame.tsx` — 공통 틀. **고치지 마라.**
- `src/lib/svg-bounds.ts` — `boxesOutsideViewBox`, `estimateTextWidth`.
- `src/data/topics.json`의 **`sqs-sns-eventbridge.sns-sqs-fanout-per-consumer`**(세 문단 전부),
  **`sqs-sns-eventbridge.sns-is-not-a-queue`**, **`sqs-sns-eventbridge.dead-letter-queue`**.

## 자리

- 컴포넌트: `src/components/diagrams/SnsFanoutDiagram.tsx`
- 매핑: `registry.ts`에 `'sqs-sns-eventbridge.sns-sqs-fanout-per-consumer': SnsFanoutDiagram` 한 줄.

이 도식의 앵커는 step 0·1과 달리 **그 개념 바로 그 자리**다. 앵커 개념 본문이 세 구성을
직접 비교하고 있어서, 도식이 그 문단의 그림판이 된다.

## 도식 내용

### 그룹 (위에서 아래로 네 단)

1. `발행` — 발행하는 쪽 하나.
2. `전달 장치` — 주제·공유 큐·이벤트 버스가 이 단에서 갈린다.
3. `소비자별 큐` — 소비자마다 하나씩 놓이는 큐 셋.
4. `소비자` — 소비자 셋.

**`소비자별 큐` 단이 비는 것이 이 도식의 핵심이다.** 시나리오 `s2`·`s3`에서는 이 단의
노드 셋이 모두 흐려져서, 소비자별 버퍼가 없다는 것이 배치로 드러난다. 그룹 박스 자체는
흐려지지 않으므로 빈 칸이 남는다. 그게 의도다 — 박스를 숨기지 마라.

### 색

- `diagram-managed`(파랑): `topic`, `queue-a`, `queue-b`, `queue-c`, `shared-queue`, `bus`.
- 무채색(`disabled` 테두리): `publisher`, `consumer-a`, `consumer-b`, `consumer-c`.
- **`diagram-resource`(청록)를 쓰지 마라.** 이 도식에 VPC 계층이 없다(ADR-036).

### 노드 (`id`는 아래 그대로 쓴다)

| id | 라벨 | 단 | 색 |
|---|---|---|---|
| `publisher` | 발행하는 쪽 | 발행 | 무채색 |
| `topic` | SNS 주제 | 전달 장치 | `diagram-managed` |
| `shared-queue` | 공유 큐 하나 | 전달 장치 | `diagram-managed` |
| `bus` | 이벤트 버스 | 전달 장치 | `diagram-managed` |
| `queue-a` | 큐 A | 소비자별 큐 | `diagram-managed` |
| `queue-b` | 큐 B | 소비자별 큐 | `diagram-managed` |
| `queue-c` | 큐 C | 소비자별 큐 | `diagram-managed` |
| `consumer-a` | 소비자 A | 소비자 | 무채색 |
| `consumer-b` | 소비자 B | 소비자 | 무채색 |
| `consumer-c` | 소비자 C | 소비자 | 무채색 |

노드 10개다. **큐 셋과 소비자 셋은 라벨이 짧으니 3열로 둔다**(`estimateTextWidth('소비자 A', 10)`이
41이라 3열 폭에 여유가 있다). 전달 장치 셋은 2열 + 한 줄로 배치하거나 세로로 쌓는다 —
`공유 큐 하나`가 73, `이벤트 버스`가 67이라 3열은 빠듯하다. **실측으로 판정하고 넘치면 펴라.**

### 시나리오 셋

각 `caption`은 **근거 개념 본문의 사실에서 직접 써라.** 본문 문장을 그대로 옮기지 마라.
두 줄을 넘기지 마라. **`s2`·`s3`의 캡션은 그 구성이 왜 요구를 만족하지 못하는지를 말해야
한다** — 그림은 큐가 없다는 것까지만 보여주고, 그래서 무엇이 깨지는지는 말하지 못한다.

| id | label | 경로 | 캡션에 담을 사실 | 근거 개념 id |
|---|---|---|---|---|
| `s1` | 소비자마다 큐 | `publisher` → `topic` → `queue-a`·`queue-b`·`queue-c` → 각 소비자 | 발행된 이벤트가 큐마다 복제되어 모든 소비자가 모든 이벤트를 받는다 · 소비자를 더할 때 발행하는 쪽도 기존 소비자도 고치지 않는다 | `sns-sqs-fanout-per-consumer` |
| `s2` | 큐 하나를 셋이 폴링 | `publisher` → `shared-queue` → 각 소비자 | 큐는 메시지를 소비자들에게 나눠 주므로 각자 일부만 받는다 · 모두가 모든 이벤트를 받는다는 성질이 깨진다 | `sns-sqs-fanout-per-consumer` |
| `s3` | 버스가 직접 호출 | `publisher` → `bus` → 각 소비자 | 여러 대상에 보내기는 하지만 소비자별 내구성 버퍼가 없다 · 트래픽이 튀는 것을 흡수하지 못한다 | `sns-sqs-fanout-per-consumer`, `sns-is-not-a-queue` |

**`s1`의 경로는 일곱 줄이다**(발행→주제 하나, 주제→큐 셋, 큐→소비자 셋).
세 갈래가 부채꼴로 벌어지므로 선이 서로 겹치거나 무관한 노드를 지나기 쉽다.
**교차 검사기로 확인하면서 배치를 잡아라.**

### 범례

색 하나와 무채색이 각각 무엇인지 한 줄.

## 강조 방식

step 0·1과 같다. UI_GUIDE 「도식」 그대로.

## 테스트

`src/components/diagrams/SnsFanoutDiagram.test.tsx`를 **먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 시나리오를 고르지 않으면 노드 10개가 모두 흐려지지 않은 상태다.
2. `소비자마다 큐`를 누르면 `shared-queue`와 `bus`가 흐리고 큐 셋은 선명하다.
3. **`큐 하나를 셋이 폴링`을 누르면 `queue-a`·`queue-b`·`queue-c`가 모두 흐리다.**
   `버스가 직접 호출`에서도 마찬가지다. 이 도식이 보여주려는 차이 그 자체의 회귀 테스트다.
4. `전체`를 누르면 흐린 노드가 하나도 없고 보이는 경로도 없다.
5. **경계**: 모든 `rect`에서 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`가 빈 배열이다.
6. **글자 넘침**: 노드 10개 각각에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이다.
7. `viewBox`의 폭이 정확히 `280`이다.
8. 캡션 셋이 각각 **20자를 넘는다.**

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 기록 — `summary`에 반드시 넣는다

- 최종 `viewBox` (`0 0 280 <높이>`)
- 전달 장치 셋을 3열로 두었는지 펴서 배치했는지, 그 판정의 근거가 된 폭 값
- 교차 검사에서 걸린 경로가 있었다면 무엇을 어떻게 우회시켰는지
- 관문 검사 5·6·7의 통과 여부

## 금지사항

- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **다른 도식을 만들거나 step 0·1의 도식을 고치지 마라.**
- **`DiagramFrame.tsx`를 고치지 마라.**
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 도식이나 캡션에 그대로 옮기지 마라.**
- **틀린 구성을 빨강이나 X 표시로 낙인찍지 마라.** 이유: 빨강은 오답 표시가 이미 점유했고
  (UI_GUIDE 「색상」·ADR-036), `s2`·`s3`는 틀린 구성이 아니라 **다른 요구에 맞는 구성**이다.
  차이는 흐려지는 노드와 캡션으로만 말한다.
- **데드레터 큐를 이 도식에 그리지 마라.** `dead-letter-queue`를 읽으라고 한 것은 큐가 왜
  버퍼로 불리는지의 근거를 보라는 뜻이다. 노드를 더하면 세 구성의 대비가 흐려진다.
- 기존 테스트를 깨뜨리지 마라.
