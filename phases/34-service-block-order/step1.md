# Step 1: sample-reorder

**표본 5개 주제의 개념을 서비스 블록 순서로 옮긴다** — `data-transfer-services`·`sqs-sns-eventbridge`·
`efs-fsx`·`cloudfront-global-accelerator`·`secrets-encryption`.
이 step이 끝나면 phase가 멈춘다. 사람이 실제 화면에서 학습 흐름을 읽어 본 뒤 나머지 32개 주제를
진행할지 정한다. **이 다섯 말고 다른 주제의 순서는 건드리지 않는다.**

## 이 phase의 범위 — 개념 배열 순서뿐이다

사용자의 말을 그대로 옮긴다.

> 작업 범위는 엄격하게 `개념 배열 순서`로 제한한다.

**바꾸지 않는 것**: concept id · name · summary · paragraphs, 문항 파일 전체(question id · prompt ·
choices · explanation · answerIndex · 문항 배열), 주제 메타데이터, 콘텐츠 사실관계와 표현, 용어 표기.
`docs/`와 `phases/NEXT.md`도 이 step에서 건드리지 않는다.

**이 step에서 바꾸는 파일은 셋이다.**

| 파일 | 바꾸는 것 |
|---|---|
| `src/data/topics.json` | 아래 5개 주제의 개념 **줄의 자리**와 그에 따른 끝 쉼표 |
| `src/data/data.test.ts` | 아래 5개 주제의 순서 단언 `it` 블록 5개(제목·주석·기대 배열) |
| `scripts/topics-baseline.json` | 아래 5개 주제의 `concepts` 항목 순서 |

사용자가 `data.test.ts`에 대해 정한 범위: "각 주제의 기존 개념 순서 단언을 새 서비스 블록 순서로
갱신하는 범위만 허용한다. 새로운 기능 테스트나 콘텐츠 테스트를 추가하지 마. 테스트 제목과 주석도
새 정렬 규칙을 정확히 설명하도록 갱신해 줘."

## 새 배열 규칙 — ADR-033

1. 서비스별 블록을 먼저 만든다.
2. 각 서비스 블록 안에서 `기본 개념 → 주요 기능/갈림길 → 세부 기능·설정·한계` 순으로 배치한다.
3. 같은 하위 기능에 속한 개념은 가능한 한 연속해서 둔다.
4. 둘 이상의 서비스를 비교하는 개념은 비교 대상 서비스 블록이 모두 나온 뒤에 둔다.
5. 어떤 개념이 다른 개념을 이해의 전제로 삼는다면 전제 개념을 먼저 둔다. 이 규칙은 위 규칙보다
   우선한다.

**주제별 새 순서는 아래 「주제별 명세」에 개념 id 전부로 정해져 있다. 그대로 적용한다.**
순서를 다시 설계하지 마라 — 사용자가 승인한 순서다.

## 읽어야 할 파일

- `docs/ADR.md` — ADR-033(step 0이 썼다)과 ADR-023
- `docs/ARCHITECTURE.md` — 「주제 안의 개념 배열은 서비스 블록 순서다」 절
- `src/data/data.test.ts` — 아래 5개 주제의 순서 단언(현재 제목으로 찾는다)
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` — 머리 주석
- `phases/34-service-block-order/verify-order.mjs` — 머리 주석(무엇을 검사하는지)

## 작업 — 테스트를 먼저 바꾼다

### 1. `src/data/data.test.ts` — 순서 단언 5개

아래 「주제별 명세」의 **현재 테스트 제목**으로 `it` 블록을 찾아, 그 블록 **전체**를 명세의 코드
블록으로 바꾼다. 다섯 블록 말고는 한 줄도 바꾸지 않는다 — 같은 파일에 이 주제들을 다루는 다른
테스트(갈림길이 한 주제 안에 있는지, 용어가 풀리는지 등)가 있지만 **건드리지 않는다.**

바꾼 뒤 `npm test`를 돌려 **이 다섯 테스트가 실패하는 것을 확인한다.** 데이터가 아직 옛 순서라서
실패해야 맞다. 다른 테스트가 실패하면 네가 무엇을 잘못 건드린 것이다.

### 2. `src/data/topics.json` — 개념 줄을 옮긴다

- 개념 하나가 **정확히 한 줄**이고 `      {"id":"`(공백 6칸)로 시작한다. 한 주제의 개념 줄들은
  `"concepts": [` 줄과 `    ]` 줄 사이에 연달아 있다. **그 안에서 줄의 자리만 바꾼다.**
- 주제의 **마지막 개념 줄만 끝에 쉼표가 없고** 나머지는 `},`로 끝난다. 옮긴 뒤 이 규칙에 맞게
  **끝 쉼표만** 고친다.
- 줄 안의 글자는 한 글자도 바꾸지 마라.
- 파일 전체를 `JSON.stringify`로 다시 쓰지 마라. 개념 한 줄 포맷이 깨져 `check-structure.mjs`가
  실패하고, `verify-order.mjs`의 줄 구성 검사가 순서 외 변경으로 잡는다.
- 줄을 옮기는 스크립트를 쓰면 `node - <<'EOF' … EOF`처럼 한 번 실행하고 끝낸다. **저장소 안에 임시
  파일을 만들지 마라** — 하네스가 `git add -A`로 커밋하므로 그 파일까지 커밋된다.

### 3. `scripts/topics-baseline.json` — 스냅샷의 개념 순서를 맞춘다

- 이 파일은 파싱한 객체를 `JSON.stringify(obj, null, 1) + '\n'`로 쓰면 **원본과 글자까지 똑같이**
  나온다(착수 시점에 확인했다). 그러니 파싱해서 **5개 주제의 `concepts` 배열만** `topics.json`과 같은
  순서로 재배열하고, 이 형식으로 다시 쓴다.
- 개념 항목은 `{"id", "name"}` 두 키뿐이다. id·name과 다른 키(`note`·`conceptLineCount`·
  `questionsSha256`·주제 메타데이터)는 **그대로 둔다.** 항목을 새로 만들지 말고 기존 항목 객체를
  옮긴다.
- **`node scripts/sync-baseline.mjs`를 돌리지 마라.** 순서 변경을 거부하도록 만든 도구다
  (머리 주석: "개념 개수·순서·id — 다르면 거부한다").
- 사용자가 정한 조건: "재정렬 대상 주제의 concept 항목 순서만 `topics.json`과 동일하게 옮겨 줘.
  id, name 및 기타 내용은 수정하지 마. baseline 변경이 순서 변경만이라는 것을 검증해 줘."
  → `verify-order.mjs`가 스냅샷의 내용 해시(항목을 id로 정렬해서)와 줄 구성 해시로 이것을 본다.

## 선행 관계와 충돌하면 — 순서를 바꾸지 말고 적는다

명세의 순서를 적용하다가 어떤 개념의 본문이 **자기보다 뒤에 오는 개념을 이해의 전제로 삼는
것**을 발견하면(규칙 5와 부딪힘), **순서를 임의로 바꾸지 마라.** 명세대로 적용하고 `summary`에
`선행 충돌:`로 시작하는 문장으로 적는다 — 주제, 두 개념 id, 본문의 어느 문장이 전제를 요구하는지.
사람이 보고 판단한다.

아래는 이미 알고 있는 것이고 **충돌이 아니다.** 순서를 바꾸지 말고, 따로 적지 않아도 된다.

- `sqs-sns-eventbridge.sqs-fifo-deduplication-id`(SQS 블록)가 "SNS 주제의 구독 필터 정책은 … 중복 제거
  수단이 아니다"로 SNS를 곁가지로 언급한다 — SNS 블록보다 앞이다.
- `sqs-sns-eventbridge.sns-fifo-topic`(SNS 블록)이 "EventBridge 이벤트 버스는 … 순서를 보장하지
  않는다"로 EventBridge를 곁가지로 언급한다 — EventBridge 블록보다 앞이다.
- `secrets-encryption.rotation-heuristic`(두 저장소의 갈림길)이 "KMS는 암호화 키를 관리하는 서비스이지
  …"로 KMS를 곁가지로 언급한다 — KMS 블록보다 앞이다.
- `efs-fsx.fsx-windows-storage-auto-scaling`이 FSx for Lustre를 언급하지만, 그 앞의 `efs-fsx.fsx`
  (FSx 개요)가 Lustre를 이미 소개하므로 앞선 언급이 아니다.

넷 다 "X는 이 일을 하지 않는다" 식의 대비 문장이고 같은 문장 안에서 X가 무엇인지 말한다.
ADR-033 「트레이드오프」에 적힌 잔여다.

## 주제별 명세

`현재 자리`는 착수 시점 `topics.json`에서 그 주제 안의 몇 번째 개념인지다(1부터).

### `data-transfer-services` — 개념 19개, 자리가 바뀌는 개념 17개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | DataSync | `data-transfer-services.datasync` | DataSync |
| 2 | 8 | DataSync | `data-transfer-services.file-gateway-vs-datasync-continuous` | 지속 수집과 예약 전송의 갈림길 |
| 3 | 12 | DataSync | `data-transfer-services.datasync-scope-limits` | DataSync가 맡지 않는 일 |
| 4 | 13 | DataSync | `data-transfer-services.datasync-in-transit-encryption` | DataSync의 전송 중 암호화 |
| 5 | 14 | DataSync | `data-transfer-services.datasync-manifest` | 전송 대상을 좁히는 DataSync 매니페스트 |
| 6 | 15 | DataSync | `data-transfer-services.datasync-transfer-mode` | DataSync 태스크의 전송 모드 |
| 7 | 16 | DataSync | `data-transfer-services.datasync-task-status-event` | DataSync 작업 실행 상태의 EventBridge 이벤트 |
| 8 | 2 | Snowball Edge | `data-transfer-services.snowball-edge` | Snowball Edge |
| 9 | 3 | Snowball Edge | `data-transfer-services.snowball-edge-compute` | Snowball Edge의 현장 컴퓨팅 기능 |
| 10 | 7 | Snowball Edge | `data-transfer-services.transfer-deadline-vs-bandwidth` | 전송 수단을 정하는 기한과 대역폭 계산 |
| 11 | 4 | Transfer Family | `data-transfer-services.transfer-family` | Transfer Family |
| 12 | 9 | Transfer Family | `data-transfer-services.transfer-family-custom-hostname` | Transfer Family의 사용자 지정 DNS 이름 |
| 13 | 10 | Transfer Family | `data-transfer-services.transfer-family-directory-service-identity-provider` | Transfer Family의 Directory Service ID 공급자 |
| 14 | 11 | Transfer Family | `data-transfer-services.transfer-family-service-managed-users` | Transfer Family의 서비스 관리형 사용자 |
| 15 | 5 | Transfer Family | `data-transfer-services.transfer-family-workflow` | Transfer Family의 업로드 후 워크플로 |
| 16 | 17 | Transfer Family | `data-transfer-services.transfer-family-workflow-actions` | 업로드 후 워크플로의 미리 정의된 액션 |
| 17 | 18 | Transfer Family | `data-transfer-services.transfer-family-structured-logging` | Transfer Family의 구조화된 로깅 |
| 18 | 6 | S3 직접 전송 | `data-transfer-services.s3-transfer-acceleration` | S3 전송 가속 |
| 19 | 19 | S3 직접 전송 | `data-transfer-services.s3-multipart-upload` | 멀티파트 업로드 |

현재 테스트 제목(이것으로 찾는다): `데이터 전송 주제가 전송 도구 넷 다음에 선택 기준과 설정 항목을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('데이터 전송 주제가 DataSync·Snowball Edge·Transfer Family·S3 직접 전송 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'data-transfer-services')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // DataSync: 기본 → 지속 수집과 예약 전송의 갈림길 → 맡지 않는 일 → 전송 중 암호화·매니페스트·
    //   전송 모드·상태 이벤트.
    // Snowball Edge: 기본 → 현장 컴퓨팅 → 기한과 대역폭 계산(회선을 타는 수단이 전부 탈락한 뒤
    //   Snowball Edge가 남는다는 조건이라 이 블록 끝).
    // Transfer Family: 기본 → 사용자 지정 DNS 이름·Directory Service ID 공급자·서비스 관리형 사용자 →
    //   업로드 후 워크플로와 그 미리 정의된 액션 → 구조화된 로깅. 워크플로는 주요 기능이지만 자기
    //   세부와 붙이려고 갈림길 셋 뒤에 둔다.
    // S3 직접 전송: 전송 가속 → 멀티파트 업로드.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'data-transfer-services.datasync',
      'data-transfer-services.file-gateway-vs-datasync-continuous',
      'data-transfer-services.datasync-scope-limits',
      'data-transfer-services.datasync-in-transit-encryption',
      'data-transfer-services.datasync-manifest',
      'data-transfer-services.datasync-transfer-mode',
      'data-transfer-services.datasync-task-status-event',
      'data-transfer-services.snowball-edge',
      'data-transfer-services.snowball-edge-compute',
      'data-transfer-services.transfer-deadline-vs-bandwidth',
      'data-transfer-services.transfer-family',
      'data-transfer-services.transfer-family-custom-hostname',
      'data-transfer-services.transfer-family-directory-service-identity-provider',
      'data-transfer-services.transfer-family-service-managed-users',
      'data-transfer-services.transfer-family-workflow',
      'data-transfer-services.transfer-family-workflow-actions',
      'data-transfer-services.transfer-family-structured-logging',
      'data-transfer-services.s3-transfer-acceleration',
      'data-transfer-services.s3-multipart-upload',
    ])
  })
```

### `sqs-sns-eventbridge` — 개념 33개, 자리가 바뀌는 개념 32개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | SQS | `sqs-sns-eventbridge.sqs` | SQS (Simple Queue Service) |
| 2 | 7 | SQS | `sqs-sns-eventbridge.dead-letter-queue` | 데드레터 큐(DLQ) |
| 3 | 18 | SQS | `sqs-sns-eventbridge.sqs-details` | SQS의 보존 기간과 표준 대기열의 약점 |
| 4 | 21 | SQS | `sqs-sns-eventbridge.sqs-queue-depth-scaling` | 대기열 깊이 기반 오토 스케일링 |
| 5 | 22 | SQS | `sqs-sns-eventbridge.sqs-batch-and-polling` | SQS의 배치·가시성 타임아웃·롱 폴링 |
| 6 | 23 | SQS | `sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time` | 가시성 타임아웃과 소비자의 처리 시간 |
| 7 | 24 | SQS | `sqs-sns-eventbridge.sqs-message-size-limit` | SQS 메시지의 크기 한계 |
| 8 | 25 | SQS | `sqs-sns-eventbridge.sqs-fifo-message-group-id` | FIFO 대기열의 순서 보장 단위인 메시지 그룹 ID |
| 9 | 26 | SQS | `sqs-sns-eventbridge.sqs-fifo-deduplication-id` | 5분 동안 적용되는 FIFO 대기열의 중복 제거 ID |
| 10 | 27 | SQS | `sqs-sns-eventbridge.sqs-content-based-deduplication` | FIFO 대기열의 콘텐츠 기반 중복 제거 |
| 11 | 29 | SQS | `sqs-sns-eventbridge.sqs-queue-policy` | 큐에 직접 붙이는 리소스 기반 정책 |
| 12 | 31 | SQS | `sqs-sns-eventbridge.sqs-encryption-and-consumer-kms-permission` | SQS 큐 암호화와 소비자의 복호화 권한 |
| 13 | 33 | SQS | `sqs-sns-eventbridge.sqs-vpc-endpoint-and-queue-policy` | SQS 인터페이스 VPC 엔드포인트와 큐 정책 |
| 14 | 2 | SNS | `sqs-sns-eventbridge.sns` | SNS (Simple Notification Service) |
| 15 | 19 | SNS | `sqs-sns-eventbridge.sns-fifo-topic` | SNS FIFO 주제 |
| 16 | 28 | SNS | `sqs-sns-eventbridge.sns-no-message-body-rewrite` | SNS의 메시지 본문 재작성 제약 |
| 17 | 32 | SNS | `sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions` | 암호화된 SNS 주제 게시에 필요한 세 가지 권한 |
| 18 | 8 | 비교·연계 — SQS와 SNS | `sqs-sns-eventbridge.sns-is-not-a-queue` | SQS 대기열과 SNS 발행-구독 |
| 19 | 9 | 비교·연계 — SQS와 SNS | `sqs-sns-eventbridge.sns-sqs-fanout-per-consumer` | 소비자마다 큐를 두는 팬아웃 |
| 20 | 30 | 비교·연계 — SQS와 SNS | `sqs-sns-eventbridge.cross-account-sns-to-sqs-queue-policy` | 계정 간 SNS 발행과 큐 정책의 주제 ARN |
| 21 | 3 | EventBridge | `sqs-sns-eventbridge.eventbridge` | EventBridge |
| 22 | 4 | EventBridge | `sqs-sns-eventbridge.eventbridge-scheduler` | EventBridge Scheduler |
| 23 | 10 | EventBridge | `sqs-sns-eventbridge.eventbridge-vs-step-functions` | 이벤트 라우팅과 워크플로 오케스트레이션 |
| 24 | 11 | EventBridge | `sqs-sns-eventbridge.eventbridge-ordering-and-retention` | EventBridge가 보장하지 않는 것 |
| 25 | 12 | EventBridge | `sqs-sns-eventbridge.eventbridge-event-pattern-vs-polling` | 이벤트 패턴 규칙과 주기적 폴링 |
| 26 | 13 | EventBridge | `sqs-sns-eventbridge.eventbridge-event-bus-types` | 기본·사용자 지정·파트너 이벤트 버스 |
| 27 | 14 | EventBridge | `sqs-sns-eventbridge.eventbridge-pipes` | EventBridge 파이프 |
| 28 | 15 | EventBridge | `sqs-sns-eventbridge.eventbridge-api-destination` | EventBridge API 대상 |
| 29 | 16 | EventBridge | `sqs-sns-eventbridge.eventbridge-private-api-target` | 프라이빗 API로 이벤트를 넣는 길 |
| 30 | 17 | EventBridge | `sqs-sns-eventbridge.eventbridge-resource-change-rule` | 리소스 구성 변경에 거는 EventBridge 규칙 |
| 31 | 5 | Amazon MQ | `sqs-sns-eventbridge.amazon-mq` | Amazon MQ |
| 32 | 6 | SES | `sqs-sns-eventbridge.ses` | Amazon SES (Simple Email Service) |
| 33 | 20 | SES | `sqs-sns-eventbridge.ses-inbound-email-receiving` | SES의 이메일 수신 규칙 |

현재 테스트 제목(이것으로 찾는다): `메시징 주제가 서비스 다섯과 데드레터 큐 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('메시징 주제가 SQS·SNS·SQS와 SNS의 조합·EventBridge·Amazon MQ·SES 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'sqs-sns-eventbridge')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // SQS: 기본 → 데드레터 큐 → 보존 기간과 표준 대기열의 약점 → 대기열 깊이 확장·배치·가시성 타임아웃·
    //   크기 한계 → FIFO 셋 → 큐 정책·암호화·VPC 엔드포인트.
    // SNS: 기본 → FIFO 주제 → 본문 재작성 제약 → 암호화된 주제의 게시 권한.
    // SQS와 SNS의 조합: 버퍼인가 발행-구독인가, 소비자마다 큐를 두는 팬아웃, 계정 간 발행. 두 서비스를
    //   가르거나 함께 쓰는 개념이라 두 블록 뒤에 둔다.
    // EventBridge: 기본 → Scheduler → Step Functions와의 갈림길 → 보장하지 않는 것·이벤트 패턴·
    //   버스·파이프·대상·리소스 변경 규칙.
    // Amazon MQ. SES: 기본 → 수신 규칙.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'sqs-sns-eventbridge.sqs',
      'sqs-sns-eventbridge.dead-letter-queue',
      'sqs-sns-eventbridge.sqs-details',
      'sqs-sns-eventbridge.sqs-queue-depth-scaling',
      'sqs-sns-eventbridge.sqs-batch-and-polling',
      'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time',
      'sqs-sns-eventbridge.sqs-message-size-limit',
      'sqs-sns-eventbridge.sqs-fifo-message-group-id',
      'sqs-sns-eventbridge.sqs-fifo-deduplication-id',
      'sqs-sns-eventbridge.sqs-content-based-deduplication',
      'sqs-sns-eventbridge.sqs-queue-policy',
      'sqs-sns-eventbridge.sqs-encryption-and-consumer-kms-permission',
      'sqs-sns-eventbridge.sqs-vpc-endpoint-and-queue-policy',
      'sqs-sns-eventbridge.sns',
      'sqs-sns-eventbridge.sns-fifo-topic',
      'sqs-sns-eventbridge.sns-no-message-body-rewrite',
      'sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions',
      'sqs-sns-eventbridge.sns-is-not-a-queue',
      'sqs-sns-eventbridge.sns-sqs-fanout-per-consumer',
      'sqs-sns-eventbridge.cross-account-sns-to-sqs-queue-policy',
      'sqs-sns-eventbridge.eventbridge',
      'sqs-sns-eventbridge.eventbridge-scheduler',
      'sqs-sns-eventbridge.eventbridge-vs-step-functions',
      'sqs-sns-eventbridge.eventbridge-ordering-and-retention',
      'sqs-sns-eventbridge.eventbridge-event-pattern-vs-polling',
      'sqs-sns-eventbridge.eventbridge-event-bus-types',
      'sqs-sns-eventbridge.eventbridge-pipes',
      'sqs-sns-eventbridge.eventbridge-api-destination',
      'sqs-sns-eventbridge.eventbridge-private-api-target',
      'sqs-sns-eventbridge.eventbridge-resource-change-rule',
      'sqs-sns-eventbridge.amazon-mq',
      'sqs-sns-eventbridge.ses',
      'sqs-sns-eventbridge.ses-inbound-email-receiving',
    ])
  })
```

### `efs-fsx` — 개념 25개, 자리가 바뀌는 개념 24개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | EFS | `efs-fsx.efs` | EFS (Elastic File System) |
| 2 | 7 | EFS | `efs-fsx.efs-throughput-modes` | EFS의 버스팅 처리량과 프로비저닝된 처리량 |
| 3 | 8 | EFS | `efs-fsx.efs-elastic-throughput` | EFS의 Elastic 처리량 모드 |
| 4 | 9 | EFS | `efs-fsx.efs-performance-modes` | EFS의 범용 성능 모드와 최대 I/O 성능 모드 |
| 5 | 10 | EFS | `efs-fsx.efs-one-zone` | EFS One Zone |
| 6 | 11 | EFS | `efs-fsx.efs-posix-permissions` | EFS의 POSIX 권한 모델 |
| 7 | 2 | EFS | `efs-fsx.efs-lifecycle-management` | EFS 수명 주기 관리 |
| 8 | 19 | EFS | `efs-fsx.efs-ia-file-size-threshold` | EFS IA의 128KB 파일 크기 기준 |
| 9 | 20 | EFS | `efs-fsx.efs-lifecycle-transition-to-primary` | EFS 수명 주기의 기본 스토리지 되돌리기 설정 |
| 10 | 21 | EFS | `efs-fsx.efs-mount-target-per-az` | 가용 영역마다 두는 EFS 마운트 대상 |
| 11 | 22 | EFS | `efs-fsx.efs-cross-account-mount` | 계정 간 EFS 마운트 |
| 12 | 23 | EFS | `efs-fsx.efs-replication-one-way` | EFS 복제의 단방향 제약 |
| 13 | 3 | FSx 개요 | `efs-fsx.fsx` | FSx (File System for Extended use) |
| 14 | 4 | FSx for Windows File Server | `efs-fsx.fsx-windows-file-server` | Amazon FSx for Windows File Server |
| 15 | 18 | FSx for Windows File Server | `efs-fsx.sql-server-always-on-shared-storage` | SQL Server Always On 가용성 그룹의 공유 스토리지 |
| 16 | 24 | FSx for Windows File Server | `efs-fsx.fsx-windows-storage-auto-scaling` | FSx for Windows File Server의 자동 스토리지 확장 |
| 17 | 5 | FSx for Lustre | `efs-fsx.fsx-for-lustre` | Amazon FSx for Lustre |
| 18 | 12 | FSx for Lustre | `efs-fsx.fsx-lustre-sub-millisecond-latency` | FSx for Lustre의 1ms 이내 액세스 지연 |
| 19 | 13 | FSx for Lustre | `efs-fsx.fsx-lustre-persistent-deployment` | FSx for Lustre의 영구 배포 유형 |
| 20 | 25 | FSx for Lustre | `efs-fsx.fsx-lustre-s3-data-repository-association` | FSx for Lustre의 데이터 리포지토리 연결 |
| 21 | 14 | FSx for NetApp ONTAP | `efs-fsx.fsx-ontap-multi-az` | FSx for NetApp ONTAP의 다중 AZ 배포 |
| 22 | 15 | FSx for NetApp ONTAP | `efs-fsx.fsx-ontap-multi-protocol-tiering` | FSx for NetApp ONTAP의 NFS·SMB 동시 지원과 자동 계층화 |
| 23 | 16 | FSx for NetApp ONTAP | `efs-fsx.fsx-ontap-iscsi-block` | FSx for NetApp ONTAP의 iSCSI 블록 스토리지 |
| 24 | 17 | FSx for NetApp ONTAP | `efs-fsx.fsx-ontap-snapmirror` | FSx for NetApp ONTAP과 SnapMirror |
| 25 | 6 | FSx File Gateway | `efs-fsx.fsx-file-gateway` | Amazon FSx File Gateway |

현재 테스트 제목(이것으로 찾는다): `EFS·FSx 주제가 파일 시스템 여섯 다음에 선택 기준과 구성 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'efs-fsx')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // EFS: 기본 → 처리량 모드 둘·성능 모드·One Zone·POSIX 권한 → 수명 주기 관리와 그 세부 둘 →
    //   마운트 대상·계정 간 마운트·단방향 복제. 수명 주기 관리는 주요 기능이지만 자기 세부와
    //   붙이려고 갈림길 뒤에 둔다.
    // FSx 개요: Windows·Lustre·ONTAP·OpenZFS를 한 번에 소개한다. ONTAP은 따로 기본 개념이 없어
    //   이 개요가 그 자리를 맡는다.
    // FSx for Windows File Server → FSx for Lustre → FSx for NetApp ONTAP.
    // FSx File Gateway: FSx 파일 시스템이 아니라 온프레미스 쪽 접점이라 FSx 종류를 다 본 뒤에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'efs-fsx.efs',
      'efs-fsx.efs-throughput-modes',
      'efs-fsx.efs-elastic-throughput',
      'efs-fsx.efs-performance-modes',
      'efs-fsx.efs-one-zone',
      'efs-fsx.efs-posix-permissions',
      'efs-fsx.efs-lifecycle-management',
      'efs-fsx.efs-ia-file-size-threshold',
      'efs-fsx.efs-lifecycle-transition-to-primary',
      'efs-fsx.efs-mount-target-per-az',
      'efs-fsx.efs-cross-account-mount',
      'efs-fsx.efs-replication-one-way',
      'efs-fsx.fsx',
      'efs-fsx.fsx-windows-file-server',
      'efs-fsx.sql-server-always-on-shared-storage',
      'efs-fsx.fsx-windows-storage-auto-scaling',
      'efs-fsx.fsx-for-lustre',
      'efs-fsx.fsx-lustre-sub-millisecond-latency',
      'efs-fsx.fsx-lustre-persistent-deployment',
      'efs-fsx.fsx-lustre-s3-data-repository-association',
      'efs-fsx.fsx-ontap-multi-az',
      'efs-fsx.fsx-ontap-multi-protocol-tiering',
      'efs-fsx.fsx-ontap-iscsi-block',
      'efs-fsx.fsx-ontap-snapmirror',
      'efs-fsx.fsx-file-gateway',
    ])
  })
```

### `cloudfront-global-accelerator` — 개념 24개, 자리가 바뀌는 개념 20개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | CloudFront | `cloudfront-global-accelerator.cloudfront` | CloudFront |
| 2 | 2 | CloudFront | `cloudfront-global-accelerator.cloudfront-alb-origin` | CloudFront의 ALB 오리진 |
| 3 | 3 | CloudFront | `cloudfront-global-accelerator.cloudfront-multiple-origins` | 배포 하나에 등록하는 여러 오리진 |
| 4 | 4 | CloudFront | `cloudfront-global-accelerator.cloudfront-onprem-origin` | CloudFront의 온프레미스 오리진 |
| 5 | 14 | CloudFront | `cloudfront-global-accelerator.cloudfront-signed-url` | CloudFront 서명된 URL |
| 6 | 15 | CloudFront | `cloudfront-global-accelerator.cloudfront-signed-cookie` | CloudFront 서명된 쿠키 |
| 7 | 16 | CloudFront | `cloudfront-global-accelerator.cloudfront-geo-restriction` | CloudFront 지리적 제한 |
| 8 | 17 | CloudFront | `cloudfront-global-accelerator.cloudfront-field-level-encryption` | CloudFront 필드 수준 암호화 |
| 9 | 20 | CloudFront | `cloudfront-global-accelerator.cloudfront-price-class` | CloudFront 가격 등급 |
| 10 | 21 | CloudFront | `cloudfront-global-accelerator.cloudfront-ttl` | CloudFront TTL과 캐시 무효화의 관계 |
| 11 | 22 | CloudFront | `cloudfront-global-accelerator.cloudfront-s3-upload-with-oac` | CloudFront를 거쳐 S3에 올리기 |
| 12 | 23 | CloudFront | `cloudfront-global-accelerator.cloudfront-alb-origin-access-restriction` | ALB 오리진 접근을 CloudFront로 좁히는 보안 그룹 |
| 13 | 8 | 엣지 함수 | `cloudfront-global-accelerator.edge-keyword` | 'Edge'라는 키워드 |
| 14 | 9 | 엣지 함수 | `cloudfront-global-accelerator.lambda-at-edge` | Lambda@Edge |
| 15 | 18 | 엣지 함수 | `cloudfront-global-accelerator.lambda-at-edge-origin-selection-by-viewer-location` | 뷰어 위치에 따른 Lambda@Edge의 오리진 선택 |
| 16 | 19 | 엣지 함수 | `cloudfront-global-accelerator.lambda-at-edge-response-compression` | Lambda@Edge의 응답 압축 |
| 17 | 10 | 엣지 함수 | `cloudfront-global-accelerator.cloudfront-functions` | CloudFront Functions |
| 18 | 24 | 엣지 함수 | `cloudfront-global-accelerator.cloudfront-functions-no-external-calls` | CloudFront Functions의 외부 서비스 호출 제약 |
| 19 | 5 | Global Accelerator | `cloudfront-global-accelerator.global-accelerator` | Global Accelerator |
| 20 | 6 | Global Accelerator | `cloudfront-global-accelerator.global-accelerator-static-ip` | Global Accelerator의 고정 IP |
| 21 | 7 | Global Accelerator | `cloudfront-global-accelerator.global-accelerator-endpoints` | Global Accelerator가 앞에 붙는 대상 |
| 22 | 11 | Global Accelerator | `cloudfront-global-accelerator.global-accelerator-protocols` | Global Accelerator가 처리하는 것 |
| 23 | 13 | Global Accelerator | `cloudfront-global-accelerator.global-accelerator-vs-dns-failover` | DNS 캐시에 영향받지 않는 장애 조치 |
| 24 | 12 | 비교 — CloudFront와 Global Accelerator | `cloudfront-global-accelerator.cloudfront-reduces-data-transfer-cost` | 엣지 캐시가 줄이는 데이터 전송 비용 |

현재 테스트 제목(이것으로 찾는다): `CloudFront·Global Accelerator 주제가 두 서비스와 오리진 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('CloudFront·Global Accelerator 주제가 CloudFront·엣지 함수·Global Accelerator 블록 다음에 둘의 비용 비교를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'cloudfront-global-accelerator')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // CloudFront: 기본과 오리진 셋 → 서명된 URL·서명된 쿠키·지리적 제한·필드 수준 암호화 →
    //   가격 등급·TTL과 무효화·OAC로 받는 업로드·ALB 오리진 접근 제한. ALB 오리진 접근 제한은
    //   OAC를 전제로 쓰므로 OAC 업로드 뒤.
    // 엣지 함수: 'Edge'의 뜻 → Lambda@Edge와 그 쓰임 둘(오리진 선택·응답 압축) → CloudFront Functions와
    //   그 제약.
    // Global Accelerator: 기본 → 고정 IP·엔드포인트 → 프로토콜·DNS 캐시와 무관한 장애 조치.
    // 비교: CloudFront와 Global Accelerator를 비용으로 가르므로 두 블록 뒤에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'cloudfront-global-accelerator.cloudfront',
      'cloudfront-global-accelerator.cloudfront-alb-origin',
      'cloudfront-global-accelerator.cloudfront-multiple-origins',
      'cloudfront-global-accelerator.cloudfront-onprem-origin',
      'cloudfront-global-accelerator.cloudfront-signed-url',
      'cloudfront-global-accelerator.cloudfront-signed-cookie',
      'cloudfront-global-accelerator.cloudfront-geo-restriction',
      'cloudfront-global-accelerator.cloudfront-field-level-encryption',
      'cloudfront-global-accelerator.cloudfront-price-class',
      'cloudfront-global-accelerator.cloudfront-ttl',
      'cloudfront-global-accelerator.cloudfront-s3-upload-with-oac',
      'cloudfront-global-accelerator.cloudfront-alb-origin-access-restriction',
      'cloudfront-global-accelerator.edge-keyword',
      'cloudfront-global-accelerator.lambda-at-edge',
      'cloudfront-global-accelerator.lambda-at-edge-origin-selection-by-viewer-location',
      'cloudfront-global-accelerator.lambda-at-edge-response-compression',
      'cloudfront-global-accelerator.cloudfront-functions',
      'cloudfront-global-accelerator.cloudfront-functions-no-external-calls',
      'cloudfront-global-accelerator.global-accelerator',
      'cloudfront-global-accelerator.global-accelerator-static-ip',
      'cloudfront-global-accelerator.global-accelerator-endpoints',
      'cloudfront-global-accelerator.global-accelerator-protocols',
      'cloudfront-global-accelerator.global-accelerator-vs-dns-failover',
      'cloudfront-global-accelerator.cloudfront-reduces-data-transfer-cost',
    ])
  })
```

### `secrets-encryption` — 개념 20개, 자리가 바뀌는 개념 16개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Secrets Manager | `secrets-encryption.secrets-manager` | Secrets Manager |
| 2 | 14 | Secrets Manager | `secrets-encryption.secrets-manager-batch-get-secret-value` | Secrets Manager의 BatchGetSecretValue API |
| 3 | 2 | Parameter Store | `secrets-encryption.parameter-store` | Systems Manager Parameter Store |
| 4 | 6 | 비교 — Secrets Manager와 Parameter Store | `secrets-encryption.secrets-manager-vs-parameter-store` | Secrets Manager vs Systems Manager Parameter Store |
| 5 | 7 | 비교 — Secrets Manager와 Parameter Store | `secrets-encryption.rotation-heuristic` | 자동 순환을 가리키는 신호 |
| 6 | 3 | KMS | `secrets-encryption.kms` | KMS (Key Management Service) |
| 7 | 8 | KMS | `secrets-encryption.kms-key-types-by-management` | KMS 키의 관리 주체: 고객 관리 키·AWS 관리 키·AWS 소유 키 |
| 8 | 9 | KMS | `secrets-encryption.kms-multi-region-key` | KMS 다중 리전 키 |
| 9 | 12 | KMS | `secrets-encryption.kms-key-per-tenant` | 고객마다 따로 만드는 KMS 키 |
| 10 | 10 | KMS | `secrets-encryption.kms-imported-key-material` | KMS의 가져온 키 자료 |
| 11 | 15 | KMS | `secrets-encryption.kms-automatic-key-rotation` | 해마다 이뤄지는 KMS 자동 키 교체 |
| 12 | 16 | KMS | `secrets-encryption.kms-symmetric-vs-asymmetric-rotation` | KMS 대칭 키와 비대칭 키의 자동 교체 |
| 13 | 17 | KMS | `secrets-encryption.imported-key-material-rotation` | KMS의 가져온 키 자료를 교체하는 방법 |
| 14 | 18 | KMS | `secrets-encryption.lambda-env-var-kms` | Lambda 환경 변수의 KMS 암호화 |
| 15 | 5 | CloudHSM | `secrets-encryption.cloudhsm` | AWS CloudHSM |
| 16 | 11 | CloudHSM | `secrets-encryption.kms-cloudhsm-key-store` | CloudHSM이 뒷받침하는 KMS 키 |
| 17 | 4 | ACM | `secrets-encryption.acm` | ACM (AWS Certificate Manager) |
| 18 | 13 | ACM | `secrets-encryption.acm-dns-validation` | ACM의 도메인 검증 방식 |
| 19 | 19 | ACM | `secrets-encryption.acm-cloudfront-region` | CloudFront용 인증서의 us-east-1 발급 제약 |
| 20 | 20 | ACM | `secrets-encryption.acm-expiration-event` | ACM 인증서 만료 임박 이벤트 |

현재 테스트 제목(이것으로 찾는다): `비밀·키 주제가 서비스 다섯 다음에 무엇을 어디에 두는가와 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('비밀·키 주제가 Secrets Manager·Parameter Store·KMS·CloudHSM·ACM 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'secrets-encryption')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // Secrets Manager: 기본 → BatchGetSecretValue. Parameter Store: 기본.
    // 두 저장소의 갈림길: Secrets Manager와 Parameter Store의 차이, 자동 순환을 가리키는 신호. 두
    //   서비스를 가르므로 두 블록 뒤에 둔다.
    // KMS: 기본 → 키 관리 주체·다중 리전 키·고객별 키·가져온 키 자료 → 자동 교체·대칭과 비대칭의
    //   교체 → 가져온 키 자료의 교체 → Lambda 환경 변수 암호화. 가져온 키 자료의 교체는 자동 교체를
    //   전제로 쓰므로 그 뒤에 두고, 가져온 키 자료는 자기 세부와 가깝게 갈림길의 끝에 둔다.
    // CloudHSM: 기본 → CloudHSM이 뒷받침하는 KMS 키(KMS를 먼저 읽어야 하므로 KMS 블록 뒤).
    // ACM: 기본 → DNS 검증 → CloudFront용 인증서의 리전 → 만료 임박 이벤트.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'secrets-encryption.secrets-manager',
      'secrets-encryption.secrets-manager-batch-get-secret-value',
      'secrets-encryption.parameter-store',
      'secrets-encryption.secrets-manager-vs-parameter-store',
      'secrets-encryption.rotation-heuristic',
      'secrets-encryption.kms',
      'secrets-encryption.kms-key-types-by-management',
      'secrets-encryption.kms-multi-region-key',
      'secrets-encryption.kms-key-per-tenant',
      'secrets-encryption.kms-imported-key-material',
      'secrets-encryption.kms-automatic-key-rotation',
      'secrets-encryption.kms-symmetric-vs-asymmetric-rotation',
      'secrets-encryption.imported-key-material-rotation',
      'secrets-encryption.lambda-env-var-kms',
      'secrets-encryption.cloudhsm',
      'secrets-encryption.kms-cloudhsm-key-store',
      'secrets-encryption.acm',
      'secrets-encryption.acm-dns-validation',
      'secrets-encryption.acm-cloudfront-region',
      'secrets-encryption.acm-expiration-event',
    ])
  })
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 1
```

`verify-order.mjs 1`이 보는 것 — 사용자가 매 배치에 검증하라고 한 항목 그대로다.

- 개념 누락·중복 0, 주제별 concept id 집합이 착수 시점과 같다.
- 문항 해시가 착수 시점 `aadc1894…`와 같다 — 문항·보기·해설·answerIndex·문항 배열 변경 0.
- 순서와 무관한 내용 해시가 착수 시점 `8e67f789…`와 같다 — 개념 본문 문자열 변경 0.
- `topics.json`과 `topics-baseline.json`에서 바뀐 것이 줄의 자리(와 끝 쉼표)뿐이다.
- 순서가 바뀐 주제가 정확히 이 다섯이다.
- 다섯 주제마다 서비스 왕복 before → after를 찍고, after가 0이 아니면 실패한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data.test.ts`에서 바뀐 것이 명세한 `it` 블록 다섯뿐인가?
   - 다섯 주제 말고 다른 주제의 개념 순서가 그대로인가? (`verify-order.mjs`가 본다)
   - 저장소에 새 파일이 생기지 않았는가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 아래를 적는다.
     - 주제마다 `자리 바뀐 개념 수`와 `왕복 before → after` — `verify-order.mjs 1`의 출력 그대로
     - `선행 충돌:` 문장. 없으면 "선행 충돌 없음"
     - AC 결과(테스트 수 포함)
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- 명세한 5개 주제 말고 다른 주제의 개념 순서를 바꾸지 마라. 이유: 나머지 32개는 사람이 표본을
  화면에서 본 뒤 진행 여부를 정한다. `verify-order.mjs`가 잡는다.
- 개념 줄 안의 글자, `questions.json`, 주제 메타데이터를 바꾸지 마라. 이유: 이 phase는 순서만
  바꾼다. 해시 검사가 잡는다.
- `data.test.ts`에서 명세한 `it` 블록 다섯 말고는 고치지 말고, 새 테스트를 넣지 마라. 이유:
  사용자가 순서 단언 갱신만 허용했다.
- `node scripts/sync-baseline.mjs`를 돌리지 마라. 이유: 순서 변경을 거부하도록 만든 도구다.
  스냅샷은 위 3번 방법으로만 고친다.
- 명세의 순서를 바꾸거나 "더 나은" 순서로 다시 설계하지 마라. 이유: 사용자가 승인한 순서다.
  문제가 보이면 `summary`에 적는다.
- `docs/`, `phases/NEXT.md`, `docs/source/dump-gaps/topic-plan.md`를 건드리지 마라. 이유: 규칙
  문서는 step 0이 끝냈고, 나머지 둘은 사용자가 건드리지 말라고 했다.
- 저장소 안에 임시 파일을 만들지 마라. 이유: 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
