# Step 7: residual-docs

**ADR-033 「트레이드오프」 문단의 잔여 교차 언급 수치를, 재정렬을 모두 마친 뒤 센 실측값으로 고친다.**
바꾸는 파일은 `docs/ADR.md` 하나이고, 그 안에서 바꾸는 것은 아래 「작업」의 네 줄뿐이다.
**데이터·테스트·코드는 이 step에서 한 글자도 바꾸지 않는다.** 37개 주제의 재정렬은 step 1~6이 끝냈다.

이 step은 사람이 중간에 확인하지 않는 무인 실행으로 돈다. 아래 명세를 정확히 지키고, 명세와 부딪히는
것을 발견하면 추측으로 넘기지 말고 멈춰라.

## 이 phase의 범위 — 개념 배열 순서뿐이다

사용자의 말을 그대로 옮긴다.

> 작업 범위는 엄격하게 `개념 배열 순서`로 제한한다.

**바꾸지 않는 것**: concept id · name · summary · paragraphs, 문항 파일 전체(question id · prompt ·
choices · explanation · answerIndex · 문항 배열), 주제 메타데이터, 콘텐츠 사실관계와 표현, 용어 표기.
`docs/source/dump-gaps/topic-plan.md`와 `phases/NEXT.md`도 건드리지 않는다.

**이 step에서 바꾸는 파일은 `docs/ADR.md` 하나다.** 사용자가 이 step에 허용한 일은 ADR-033의 잔여
수치를 최종 실측값으로 갱신하는 것이다.

## 왜 고치는가

step 0이 ADR-033을 쓸 때 「트레이드오프」 문단에 "앞 블록의 개념이 뒤 블록의 서비스를 먼저 언급하는
자리가 6개 주제에 9곳 남는다"고 적었다. 재정렬 전에 영문 서비스명으로만 센 예상치였다. step 3을 처음
실행했을 때 `vpc-networking.nat-instance`가 한국어 표기 `게이트웨이 엔드포인트`로 뒤 블록을 전제로 쓰는
것이 드러났고(영문 이름 검사가 놓친 자리), 순서를 고친 뒤 한국어 표기까지 넣어 다시 셌다. step 6까지
끝난 실제 `src/data/topics.json`에서 센 결과는 **12개 주제 16곳**이다. 사람이 본문을 읽고 모두 순서를
바꿔야 하는 전제가 아니라 같은 문장 안에서 대상을 말하는 곁가지 언급으로 분류했다.

| 주제(`topics.json` 순서) | 곳 | 앞 블록의 개념 → 먼저 언급하는 뒤 블록의 대상 |
|---|---:|---|
| `ebs-instance-store` | 1 | `io2-block-express-iops-ceiling` → 인스턴스 스토어 |
| `data-transfer-services` | 1 | `datasync-in-transit-encryption` → Snowball |
| `rds-storage-features` | 1 | `rds-multi-az-failover-rto` → 스냅샷 |
| `dynamodb` | 1 | `dynamodb-streams-batch-size` → 보조 인덱스 |
| `sqs-sns-eventbridge` | 2 | `sns-fifo-topic` → EventBridge, `sqs-fifo-deduplication-id` → SNS |
| `vpc-networking` | 1 | `nat-gateway-count-by-environment` → NAT 인스턴스 |
| `security-groups-nacl` | 1 | `nlb-security-group` → 네트워크 ACL |
| `secrets-encryption` | 2 | `rotation-heuristic` → KMS, `secrets-manager-batch-get-secret-value` → Parameter Store |
| `waf-shield` | 3 | `waf-rate-based-rule`·`waf-bot-control`·`waf-body-inspection-size-limit` → Shield |
| `iam-permissions` | 1 | `iam-user-is-account-scoped` → 신뢰 정책(역할 블록) |
| `organizations-cloudtrail-config` | 1 | `organizations-tag-policy` → AWS Config |
| `cost-management` | 1 | `budget-actions` → Cost Anomaly Detection |

이 표는 참고용이다. ADR에는 주제별 곳 수만 적는다(아래 새 텍스트).

## 읽어야 할 파일

- `docs/ADR.md` — ADR-033(`### ADR-033:`으로 찾는다)의 「트레이드오프」 문단
- `phases/34-service-block-order/verify-order.mjs` — 머리 주석(이 phase의 불변 조건 검사)

## 작업

`docs/ADR.md`에서 아래 **현재 텍스트**(네 줄, ADR-033 「트레이드오프」 문단 가운데)를 찾아 **새
텍스트**(여섯 줄)로 바꾼다. 줄바꿈 위치까지 글자 그대로 옮긴다. 현재 텍스트의 바로 앞 줄("앞의 몇 개만
읽어도 …")과 바로 뒤 줄("서로를 대비로 부르는 짝이라 …")은 그대로 둔다.

현재 텍스트:

```text
없어진다. 대가를 쟀다 — 앞 블록의 개념이 뒤 블록의 서비스를 먼저 언급하는 자리가 **6개 주제에
9곳** 남는다(`ebs-instance-store` 1, `sqs-sns-eventbridge` 2, `secrets-encryption` 1,
`waf-shield` 3, `organizations-cloudtrail-config` 1, `cost-management` 1). 모두 "X는 이 일을 하지
않는다" 식의 대비 문장이고, 같은 문장 안에서 X가 무엇인지 말한다. `waf-shield`는 WAF와 Shield가
```

새 텍스트:

```text
없어진다. 대가를 쟀다 — 재정렬을 마친 뒤 영문 이름과 한국어 표기를 모두 찾아 세면, 앞 블록의 개념이
뒤 블록의 서비스나 기능을 먼저 언급하는 자리가 **12개 주제에 16곳** 남는다(`ebs-instance-store` 1,
`data-transfer-services` 1, `rds-storage-features` 1, `dynamodb` 1, `sqs-sns-eventbridge` 2,
`vpc-networking` 1, `security-groups-nacl` 1, `secrets-encryption` 2, `waf-shield` 3,
`iam-permissions` 1, `organizations-cloudtrail-config` 1, `cost-management` 1). 대개 "X는 이 일을
하지 않는다" 식의 대비 문장이고, 같은 문장 안에서 X가 무엇인지 말한다. `waf-shield`는 WAF와 Shield가
```

바뀌는 것은 넷이다 — 센 방법("재정렬을 마친 뒤 영문 이름과 한국어 표기를 모두 찾아 세면"), 대상("서비스"
→ "서비스나 기능" — 서비스가 하나뿐인 주제에서는 하위 기능이 블록이다), 수치와 주제 목록(6개 주제 9곳 →
12개 주제 16곳), "모두" → "대개". 마지막은 새로 든 `iam-permissions`의 자리가 "X는 이 일을 하지
않는다"가 아니라 "계정을 넘는 접근은 역할과 신뢰 정책으로만 열린다"는 긍정 문장이기 때문이다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 7
grep -qF '**12개 주제에 16곳** 남는다(`ebs-instance-store` 1,' docs/ADR.md
grep -qF '`iam-permissions` 1, `organizations-cloudtrail-config` 1, `cost-management` 1). 대개 "X는 이 일을' docs/ADR.md
! grep -qF '**6개 주제에' docs/ADR.md
test "$(grep -c '^### ADR-033: ' docs/ADR.md)" = 1
```

`verify-order.mjs 7`은 37개 주제가 모두 재정렬된 상태 그대로이고 개념·문항·스냅샷이 착수 시점과 같다는
것을 본다. 이 step은 문서만 바꾸므로 step 6 뒤와 똑같이 통과해야 한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `docs/ADR.md`에서 바뀐 곳이 위 네 줄뿐이고, 새 텍스트와 글자가 같은가?
   - ADR-033의 다른 문단과 다른 ADR은 그대로인가?
   - `src/`, `scripts/`, 다른 `docs/` 파일이 그대로인가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 7을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 바꾼 곳(ADR-033 「트레이드오프」 잔여 수치 6개 주제
     9곳 → 12개 주제 16곳)과 AC 결과를 한 줄로 적는다.
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- `src/`, `scripts/`, `docs/ARCHITECTURE.md`, `docs/source/`, `phases/NEXT.md`를 건드리지 마라. 이유:
  재정렬은 step 1~6이 끝냈고 이 step은 ADR 수치만 고친다. `topic-plan.md`와 `NEXT.md`는 사용자가
  건드리지 말라고 했다.
- 새 텍스트를 다듬거나 수치를 다시 세지 마라. 이유: 수치는 step 6 뒤의 실제 데이터에서 센 결과이고,
  문장은 사람이 정했다. 틀린 곳을 발견하면 고치지 말고 `summary`에 적어라.
- 잔여를 없애려고 개념 본문이나 순서를 고치지 마라. 이유: ADR-033이 적은 대로 본문 수정은 이 결정의
  범위(배열 순서) 밖이다.
- ADR-023과 다른 ADR, 이 phase의 step 문서와 `verify-order.mjs`를 건드리지 마라.
- 저장소 안에 임시 파일을 만들지 마라. 이유: 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
