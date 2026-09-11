# Step 1: fifo-queue

**FIFO 큐 → FIFO 대기열** — 이 step이 맡은 표기는 이 하나다.

## 이 phase의 범위 — 용어 표기 치환뿐이다

사용자의 말을 그대로 옮긴다.

> 이번 phase의 목적은 용어 표기 통일뿐이다.
> **사실관계, 정답 논리, 문항 구조, 수치나 조건은 변경하지 마.**
> `paragraphs`와 `explanation`도 이번 phase에서는 필요한 범위에 한해 수정 가능하게 하되,
> **표기 치환 외의 문장 수정은 하지 마.**

**phase 32와 다른 점이 하나 있다.** 그때는 `paragraphs`·`explanation`이 얼어 있었지만
이번에는 열린다 — 같은 대상을 두 이름으로 부르는 자리가 그 두 필드에 걸쳐 있어 열지 않으면
통일할 수 없기 때문이다. **열렸다는 것은 고쳐도 된다는 뜻이지 다듬어도 된다는 뜻이 아니다.**
낱말을 바꾸는 것 외에 문장을 손대면 아래 도구가 잡는다.

## 가드레일 — 기계가 잡는다

```bash
node scripts/notation-diff.mjs 7f46259          # 바뀐 것이 표기 치환으로 설명되는지 본다
node scripts/notation-diff.mjs 7f46259 --list   # 바뀐 항목의 id를 전부 찍는다
```

이 도구는 승인된 표기 짝을 같은 자리표로 바꾼 뒤 기준 커밋과 대조한다.

| 결과 | 뜻 |
|---|---|
| 정규화한 것이 같다 | 바뀐 것은 표기뿐이다. **통과** |
| 정규화해도 다르다 | 표기 말고 문장·수치·조건이 바뀌었다. **exit 1** |
| 구조가 바뀌었다 | `answerIndex`·id·순서·개수·문단 수·보기 수. **exit 1** |

**exit 1이면 되돌려라.** 부분 치환은 통과한다 — SNS의 `토픽`만 바꾸고 Kafka의 `토픽`을
두는 것이 이번 요구이므로 그렇게 설계돼 있다.

## 표준을 이렇게 정한 근거

AWS 한국어 SQS 문서가 "Amazon SQS는 **표준 대기열**과 **FIFO 대기열**이라는 두 가지 유형의 대기열을 지원합니다"로 쓰고 `큐`를 쓰지 않는다. `src/data/data.test.ts`도 이미 `sqs` 본문에 `**표준 대기열**`·`**선입선출 대기열**`을 단언으로 고정하고 있어 저장소 자체가 대기열 쪽에 기준선을 둔다.

## 이 step의 주의점

`FIFO 큐`가 든 자리만 본다. **`큐`를 전부 `대기열`로 바꾸는 것이 아니다** — 이번 범위는 `FIFO 큐`라는 한 덩어리다. 개념 `name` 3개가 바뀐다.

## 지켜야 할 것

1. **문맥을 먼저 갈라라.** 같은 낱말이라도 다른 대상을 가리키면 **건드리지 않는다.**
   아래 대상 목록에 문맥 조각을 붙여 두었으니 읽고 판단해라.
2. **정답 보기가 걸린 문항은 보기 넷을 통째로 본다.** 한 보기만 표기를 바꾸면 그 보기가
   나머지 셋과 결이 달라지고 **그 차이가 정답을 가리키는 신호가 된다.** 넷 중 둘 이상이 같은
   낱말을 쓰고 있으면 **함께 바꾼다.** 한쪽만 바꿔야 할 이유가 있으면 `summary`에 적어라.
3. **`data.test.ts`가 글자로 고정한 자리는 단언도 함께 고친다.** 대상 목록에 `⚠단언`으로
   표시했다. **단언의 뜻을 바꾸거나 지우지 마라.** 문구만 새 표기로 맞춘다.
4. **개념 `name`을 고쳤거나 `questions.json`을 고쳤으면 `node scripts/sync-baseline.mjs`를
   돌린다.** `scripts/topics-baseline.json`을 손으로 고치지 마라.
5. **받침이 달라지면 조사를 반드시 함께 고쳐라.** `토픽이` → `주제가`, `토픽을` → `주제를`,
   `토픽이어야` → `주제여야`가 그런 자리다. 한국어 문법이 강제하는 것이라 고치지 않으면
   비문이 된다. `notation-diff.mjs`는 자리표 뒤의 조사와 계사 활용을 함께 눌러 대조하므로
   **이런 변경은 위반으로 잡지 않는다.** 반대로 조사를 안 고치고 두면 문장이 깨진다.

## 대상 목록 — `FIFO 큐`이 든 자리 14곳

**이 목록이 전부다.** 문맥 조각을 읽고 바꿀 자리와 둘 자리를 갈라라.

**`sqs-sns-eventbridge`**

- `sqs-sns-eventbridge.sns-fifo-topic` `paragraphs[1]` ⚠단언 — …조건에서 함께 떠오르는 두 가지는 이 점에서 다르다. SQS FIFO 큐는 순서를 지키지만 메시지를 한 소비자가 가져가는 지점 간 큐…
- `sqs-sns-eventbridge.sqs-fifo-message-group-id` `name` — FIFO 큐의 순서 보장 단위인 메시지 그룹 ID
- `sqs-sns-eventbridge.sqs-fifo-message-group-id` `summary` — FIFO 큐는 같은 메시지 그룹 ID를 가진 메시지끼리 순서를 지키므로,…
- `sqs-sns-eventbridge.sqs-fifo-message-group-id` `paragraphs[0]` ⚠단언 — FIFO 큐의 순서 보장은 큐 전체가 아니라 메시지 그룹 단위로 적용된다…
- `sqs-sns-eventbridge.sqs-fifo-deduplication-id` `name` — 5분 동안 적용되는 FIFO 큐의 중복 제거 ID
- `sqs-sns-eventbridge.sqs-fifo-deduplication-id` `summary` — FIFO 큐에 중복 제거 ID를 붙여 보내면 5분 동안 같은 ID의 메시…
- `sqs-sns-eventbridge.sqs-fifo-deduplication-id` `paragraphs[0]` ⚠단언 — FIFO 큐는 순서와 함께 중복 제거도 제공한다. 메시지를 보낼 때 중복…
- `sqs-sns-eventbridge.sqs-content-based-deduplication` `name` — FIFO 큐의 콘텐츠 기반 중복 제거
- `sqs-sns-eventbridge.sqs-content-based-deduplication` `summary` — FIFO 큐에 콘텐츠 기반 중복 제거를 켜면 중복 제거 창 안에서 본문이…
- `sqs-sns-eventbridge.sqs-content-based-deduplication` `paragraphs[1]` ⚠단언 — …수 있고 그 동작을 끌 수 없으며, 콘텐츠 기반 중복 제거는 FIFO 큐에서만 켤 수 있다. 그래서 최소 변경이라는 조건이 있어도 큐…
- `q562` `choices[0]` — SQS FIFO 큐
- `q562` `explanation` — …에서 다르다. SQS(Simple Queue Service) FIFO 큐는 순서를 지키지만 메시지를 한 소비자가 가져가는 지점 간 큐…
- `q568` `prompt` — …다. 서로 다른 결제 건은 동시에 처리되어도 되는 상황이다. FIFO 큐에서 무엇을 지정해야 하는가?
- `q569` `choices[2]★` — FIFO 큐에 중복 제거 ID를 실어 보내 큐가 걸러내게 한다


### 정답 보기가 걸린 문항 — 보기 넷을 한 벌로 보고 판단해라

**`q569`** — 5분 안에 같은 주문이 두 번 들어오면 한 번만 처리하면 되는 상황이다. 중복을 걸러내는 로직을 직접 만들어 유지하지는 않으려 한다. 이때 알맞…

-   오답 `c0` — 표준 큐에 중복 제거 ID를 실어 보낸다
-   오답 `c1` — 주문 식별자와 시각을 메시지에 담아 소비하는 쪽에서 걸러낸다
- ★정답 `c2` — FIFO 큐에 중복 제거 ID를 실어 보내 큐가 걸러내게 한다
-   오답 `c3` — SNS 토픽의 구독 필터 정책으로 같은 주문을 걸러낸다


## 작업 순서

1. 아래 대상 목록을 **문맥 조각과 함께** 읽고, 바꿀 자리와 둘 자리를 먼저 가른다.
2. 바꾼다. **낱말만 바꾼다.**
3. 정답 보기가 걸린 문항은 보기 넷을 다시 읽는다.
4. `node scripts/sync-baseline.mjs` → `npm test` → 깨지면 단언 문구만 맞춘다.
5. `node scripts/notation-diff.mjs 7f46259`가 exit 0인지 본다.

## Acceptance Criteria

```bash
npm test                                    # 전부 통과
npm run build                               # tsc 타입체크 포함
npm run lint
node scripts/sync-baseline.mjs              # 거부당하면 범위를 넘은 것이다
node scripts/check-structure.mjs            # exit 0
node scripts/notation-diff.mjs 7f46259        # exit 0 — 표기 치환으로만 설명돼야 한다
node scripts/coverage.mjs                   # 618/618
node scripts/check-verbatim.mjs
```

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `node scripts/notation-diff.mjs 7f46259 --list`를 읽고 **이 step이 맡은 표기 말고
   다른 것이 바뀌지 않았는지** 확인한다.
3. `phases/33-notation-standardization/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 남길 것

마지막 step이 이것만 보고 사용자 보고서를 쓴다.

1. **바꾼 건수** — 표기별로, 그리고 필드별로(`name`·`summary`·`paragraphs`·`prompt`·`choices`·`explanation`)
2. **문맥이 달라 두고 온 자리와 그 이유** — 이것이 이 step의 핵심 산출물이다
3. **정답 보기를 고친 문항 id와, 보기 넷을 함께 봤는지**
4. **`data.test.ts` 단언을 고쳤으면 어느 것을 어떻게**

## 금지사항

- **표기 치환 외의 문장 수정을 하지 마라.** 이유: 사용자가 이 phase의 목적을 표기 통일
  하나로 못 박았고, `notation-diff.mjs`가 exit 1로 잡는다.
- **`answerIndex`·id·문항 순서·문단 수·보기 수를 바꾸지 마라.** 이유: 정답이 달라지고
  `data.test.ts`·`check-structure.mjs`가 불변식으로 고정한다.
- **수치·조건·서비스 특성·제한 사항을 건드리지 마라.**
- **다른 step이 맡은 표기를 건드리지 마라.** 이유: step마다 표기를 나눈 것이 이 phase의 구조다.
- **`Deny`와 `거부`를 통일하지 마라.** 이유: 표기 갈림이 아니다. `Deny`는 IAM 정책의
  `Effect` 값이고 `거부`는 그 동작을 설명하는 서술어다. 사용자가 작업 대상에서 뺐다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** `sync-baseline.mjs`를 써라.
- 기존 테스트를 깨뜨리지 마라.
