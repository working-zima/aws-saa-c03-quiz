# Step 0: sns-topic

**SNS 토픽 → 주제** — 이 step이 맡은 표기는 이 하나다.

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

AWS 한국어 SNS 개발자 안내서가 "게시자는 …커뮤니케이션 채널인 *주제*에 메시지를 전송하여"로 쓰고 전 문서가 일관된다. 저장소에는 `토픽`이 더 많지만(43:15) **사용자가 "이 자료는 AWS SAA 학습용이므로 기존 사용 빈도보다 AWS 공식 한국어 용어를 우선한다"고 정했다.**

## 이 step의 주의점

**SNS의 Topic을 가리키는 자리만 바꾼다.** 일반적인 뜻의 주제나 이 앱의 주제 페이지를 가리키는 자리는 건드리지 마라. 다만 조사해 보니 `토픽` 43건은 **전부 SNS Topic을 가리킨다** — `elastic-load-balancing.alb-listener-rule-fixed-response`와 `q462`의 "큐나 토픽으로 인스턴스에 점검 시작을 알린다"도 SQS 큐와 SNS 주제를 함께 부르는 자리다. **그래도 한 건씩 읽고 판단해라.**

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
5. **조사를 자연스럽게 맞추는 것은 허용된다.** `토픽에` → `주제에`처럼 낱말 뒤 조사가
   바뀌는 것은 치환의 일부다. 다만 `notation-diff`가 조사까지 정규화하지는 않으므로,
   받침이 달라져 조사를 바꿔야 하면 그 자리를 `summary`에 적어라 — 도구가 위반으로 잡는다.
   **그런 자리가 나오면 조사를 바꾸지 말고 그대로 두는 쪽을 먼저 검토해라.**

## 대상 목록 — `토픽`이 든 자리 43곳

**이 목록이 전부다.** 문맥 조각을 읽고 바꿀 자리와 둘 자리를 갈라라.

**`elastic-load-balancing`**

- `elastic-load-balancing.alb-listener-rule-fixed-response` `paragraphs[2]` — …에 점검 플래그 테이블을 두고 매 요청마다 조회하거나, 큐나 토픽으로 인스턴스에 점검 시작을 알리는 구성이다. 둘 다 동작은 …
- `q462` `choices[2]` — 큐나 토픽으로 인스턴스에 점검 시작을 알린다
- `q462` `explanation` — …점검 플래그 테이블을 두고 매 요청마다 조회하는 구성이나 큐·토픽으로 인스턴스에 알리는 구성도 동작은 하지만, 애플리케이션 코…

**`sqs-sns-eventbridge`**

- `sqs-sns-eventbridge.sns-fifo-topic` `name` — SNS FIFO 토픽
- `sqs-sns-eventbridge.sns-fifo-topic` `paragraphs[0]` — …몫이다. 여기에 순서대로 전달해야 한다는 조건이 붙으면 표준 토픽으로는 안 되고 FIFO 토픽이어야 한다. FIFO 토픽은 순…
- `sqs-sns-eventbridge.sns-no-message-body-rewrite` `summary` — 구독마다 다른 내용을 보내야 하면 토픽에 게시하기 전에 본문을 바꿔야 한다.
- `sqs-sns-eventbridge.sns-no-message-body-rewrite` `paragraphs[1]` — 그러니 수신자별로 내용을 달리하려면 토픽에 게시하기 **전에** 바꿔야 한다. 큐로 원본을 받아 함수…
- `sqs-sns-eventbridge.cross-account-sns-to-sqs-queue-policy` `name` — 계정 간 SNS 발행과 큐 정책의 토픽 ARN
- `sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions` `name` — 암호화된 SNS 토픽 게시에 필요한 세 가지 권한
- `sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions` `summary` — 고객 관리 키로 암호화한 SNS 토픽에 메시지를 넣으려면 토픽의 리소스 정책, KMS 키의 정책,…
- `sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions` `paragraphs[1]` — 첫째, 토픽에 리소스 정책을 붙여 그 함수가 게시할 수 있게 허용한다. …
- `sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions` `paragraphs[2]` — 고객 관리 키를 AWS 관리 키로 바꿔도 토픽 정책은 여전히 필요하므로 이 요구를 대신하지 못한다. 토픽 …
- `q549` `choices[1]` — SNS 토픽을 만들어 브로커를 대신하게 한다
- `q551` `choices[0]` — SNS 토픽을 두고 주문을 구독자에게 즉시 밀어낸다
- `q553` `choices[0]★` — SNS 토픽에 소비자마다 SQS 큐 하나씩을 구독시킨다
- `q553` `choices[3]` — SNS 토픽에 세 소비자를 큐 없이 바로 구독시킨다
- `q553` `explanation` ⚠단언 — … SNS(Simple Notification Service) 토픽에 소비자를 큐 없이 구독시키는 구성은 모두가 받기는 하지만 …
- `q554` `choices[1]` — SNS 토픽에 서비스마다 구독을 걸고 진행 상태는 토픽이 추적하게 한다
- `q554` `choices[2]` — 앞단에 SNS 토픽을 두고 Step Functions 상태 머신으로 단계를 조율…
- `q554` `explanation` ⚠단언 — …고, 각 건이 지금 어느 단계에 있는지를 들고 있지 않는다. 토픽 역시 진행 상태를 추적하는 장치가 아니다.
- `q558` `choices[2]` — SNS 토픽의 구독 필터 정책으로 조건을 걸고 본문을 바꾼다
- `q559` `choices[0]` — SNS 토픽에 HTTPS 엔드포인트를 구독시켜 그 API를 호출하게 한다
- `q562` `choices[1]` — SNS 표준 토픽
- `q562` `choices[3]★` — SNS FIFO 토픽
- `q562` `explanation` — …몫인데, 여기에 순서대로 전달해야 한다는 조건이 붙으면 표준 토픽으로는 안 되고 FIFO(First In First Out) …
- `q563` `choices[3]` — SNS 토픽에 수신 주소를 구독시켜 도착한 메일을 Lambda로 넘긴다
- `q567` `choices[0]` — 큐를 버리고 SNS 토픽으로 주문 정보를 그대로 발행한다
- `q569` `choices[3]` — SNS 토픽의 구독 필터 정책으로 같은 주문을 걸러낸다
- `q571` `choices[1]` — 토픽을 하나 더 만들어 두 토픽에 같은 메시지를 게시한다
- `q571` `choices[3]★` — 큐로 원본을 받아 함수가 수신자에 맞게 본문을 만들어 해당 토픽에 게시한다
- `q571` `explanation` — …을 고쳐 주지는 않는다. 그러니 수신자별로 내용을 달리하려면 토픽에 게시하기 전에 바꿔야 한다. 큐로 원본 메시지를 받아 함수…
- `q573` `prompt` — 다른 계정에 있는 SNS 토픽이 이 계정의 SQS 큐에 메시지를 넣게 해야 한다. 허용 범…
- `q573` `choices[1]` — 토픽이 이 계정의 모든 큐에 발행할 수 있게 허용한다
- `q573` `choices[2]★` — 큐 정책에 그 토픽의 ARN을 적어 허용하고, 토픽 쪽도 그 큐 ARN에만 발행…
- `q573` `choices[3]` — 큐를 고객 관리 키로 암호화해 그 토픽만 메시지를 넣을 수 있게 한다
- `q575` `prompt` — 고객 관리 키로 암호화한 SNS 토픽에 Lambda가 메시지를 게시하려는데 막히는 상황이다. 게시…
- `q575` `choices[0]` — 키를 AWS 관리 키로 바꿔 토픽 정책 없이 게시되게 한다
- `q575` `choices[1]★` — 토픽의 리소스 정책, 그 키의 정책, 게시하는 함수의 실행 역할 …
- `q575` `choices[2]` — 토픽 앞에 API Gateway를 세워 게시를 중계하게 한다
- `q575` `explanation` — …가 게시하는 쪽에도 있고, 손볼 곳이 하나 더 많다. 첫째, 토픽에 리소스 정책을 붙여 그 함수가 게시할 수 있게 허용한다. …

**`secrets-encryption`**

- `secrets-encryption.acm-expiration-event` `paragraphs[1]` — …람에게 닿는 쪽이어야 한다. 이메일 구독이 붙어 있는 SNS 토픽을 대상으로 두면 규칙 하나로 끝나고, SQS 큐를 대상으로 …
- `q667` `choices[2]★` — …ventBridge 규칙으로 잡아 이메일 구독이 붙은 SNS 토픽으로 보낸다
- `q667` `explanation` — … SNS(Simple Notification Service) 토픽을 대상으로 두면 규칙 하나로 끝나지만, SQS(Simple …


### 정답 보기가 걸린 문항 — 보기 넷을 한 벌로 보고 판단해라

**`q553`** — 주문 이벤트 하나를 서로 다른 세 팀의 소비자가 모두 받아 각자의 속도로 처리해야 한다. 트래픽이 튀어도 이벤트를 잃지 않아야 하는 상황이다. …

- ★정답 `c0` — SNS 토픽에 소비자마다 SQS 큐 하나씩을 구독시킨다
-   오답 `c1` — SQS 큐 하나를 세 소비자가 함께 롱 폴링하게 한다
-   오답 `c2` — EventBridge 규칙의 대상으로 세 소비자를 걸어 직접 호출하게 한다
-   오답 `c3` — SNS 토픽에 세 소비자를 큐 없이 바로 구독시킨다

**`q562`** — 한 발행자가 여러 구독자에게 같은 이벤트를 동시에 보내야 한다. 그 이벤트는 보낸 순서대로 전달되어야 하는 상황이다. 이때 알맞은 선택은 무엇인…

-   오답 `c0` — SQS FIFO 큐
-   오답 `c1` — SNS 표준 토픽
-   오답 `c2` — EventBridge 이벤트 버스
- ★정답 `c3` — SNS FIFO 토픽

**`q571`** — 수신자마다 볼 수 있는 범위가 달라 구독자별로 다른 본문이 전달되어야 하는 상황이다. SNS를 사용해 이 요구를 만족하려면 어떻게 구성해야 하는…

-   오답 `c0` — 구독 필터 정책에 본문을 재작성하는 규칙을 적는다
-   오답 `c1` — 토픽을 하나 더 만들어 두 토픽에 같은 메시지를 게시한다
-   오답 `c2` — 메시지 속성으로 수신자를 표시해 전달 직전에 본문이 바뀌게 한다
- ★정답 `c3` — 큐로 원본을 받아 함수가 수신자에 맞게 본문을 만들어 해당 토픽에 게시한다

**`q573`** — 다른 계정에 있는 SNS 토픽이 이 계정의 SQS 큐에 메시지를 넣게 해야 한다. 허용 범위는 그 토픽과 그 큐 한 쌍으로만 닫으려는 상황이다.…

-   오답 `c0` — 모든 큐에 발행할 수 있는 역할을 만들어 두 계정이 함께 쓰게 한다
-   오답 `c1` — 토픽이 이 계정의 모든 큐에 발행할 수 있게 허용한다
- ★정답 `c2` — 큐 정책에 그 토픽의 ARN을 적어 허용하고, 토픽 쪽도 그 큐 ARN에만 발행하도록 좁힌다
-   오답 `c3` — 큐를 고객 관리 키로 암호화해 그 토픽만 메시지를 넣을 수 있게 한다

**`q575`** — 고객 관리 키로 암호화한 SNS 토픽에 Lambda가 메시지를 게시하려는데 막히는 상황이다. 게시가 통과하려면 무엇을 갖춰야 하는가?…

-   오답 `c0` — 키를 AWS 관리 키로 바꿔 토픽 정책 없이 게시되게 한다
- ★정답 `c1` — 토픽의 리소스 정책, 그 키의 정책, 게시하는 함수의 실행 역할 권한 세 가지
-   오답 `c2` — 토픽 앞에 API Gateway를 세워 게시를 중계하게 한다
-   오답 `c3` — 게시하는 함수의 실행 역할에 키를 쓰는 권한 하나

**`q667`** — 가져온 인증서의 만료가 다가오면 담당자가 메일로 통보받게 하려는 상황이다. 새로 작성할 코드가 없는 구성은 무엇인가?…

-   오답 `c0` — 인증서를 나열하고 남은 날짜를 계산하는 함수를 예약 실행한다
-   오답 `c1` — 만료 임박 이벤트를 SQS 큐로 보내 둔다
- ★정답 `c2` — 만료 임박 이벤트를 EventBridge 규칙으로 잡아 이메일 구독이 붙은 SNS 토픽으로 보낸다
-   오답 `c3` — 도메인 검증 방식을 이메일 검증으로 바꿔 갱신 메일을 받는다


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
