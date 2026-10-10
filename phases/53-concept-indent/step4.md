# Step 4: hierarchy-batch-b

## 배경

딸린 개념을 머리 개념 아래로 들여써 보이기로 했다(`docs/ADR.md` **ADR-041**). 앞 step에서 끝난 것:

- step 0 — `Concept.parentId`, `ConceptGroup`, `src/lib/concept-groups.ts`(`groupConcepts`·`hierarchyProblems`), `data.test.ts` 끝의
  `개념 계층 (ADR-041)` 전 주제 검사
- step 1 — `ConceptList`가 딸린 개념을 들여써 그린다
- step 2 — 표본 5개 주제에 `parentId` 62개. `check-structure.mjs`가 `parentId`를 대조하고 `sync-baseline.mjs`가 거부한다
- step 3 — 앞 17개 주제에 `parentId` 125개

이 step은 **마지막 17개 주제**에 `parentId`를 넣고, 이 phase에서 유일한 **순서 변경 하나**를 한다 — `waf-shield.cloudfront`를
주제 맨 앞, `waf-shield.waf` 앞으로 옮긴다.

### WAF 순서를 옮기는 이유 (ADR-041 「남은 자리」 1)

지금 `waf-shield`는 `waf` → `cloudfront` → WAF 세부 여덟 순서다. `cloudfront`(일반 CloudFront 소개)가 `waf`와 그 세부 사이에 끼어
있어서, 「딸린 개념은 머리 바로 뒤에 끊김 없이 이어진다」 규칙을 지키면 WAF 세부 여덟을 `waf` 아래로 묶을 수 없다.
`cloudfront`가 거기 있던 이유는 ADR-033 규칙 5다 — `waf-attach-targets`가 멀티 오리진 CloudFront를 전제로 쓴다. 그래서 WAF 묶음
뒤로는 보낼 수 없고, **주제 맨 앞**으로 옮긴다. 전제가 여전히 먼저 오고 `waf`와 세부 여덟이 붙는다. 사용자 결정이다(2026-10-10).

| 주제 | `parentId` 수 |
|---|---|
| `security-groups-nacl` | 5 |
| `hybrid-connectivity` | 8 |
| `route53` | 6 |
| `emr-glue-athena` | 14 |
| `kinesis-streaming` | 10 |
| `redshift-opensearch-quicksight` | 7 |
| `cloudwatch-xray` | 7 |
| `secrets-encryption` | 13 |
| `waf-shield` | 11 (순서 이동 뒤에만 성립) |
| `guardduty-macie-inspector` | 6 |
| `iam-permissions` | 0 |
| `identity-federation` | 5 |
| `organizations-cloudtrail-config` | 12 |
| `cost-management` | 7 |
| `governance-iac` | 2 |
| `systems-manager` | 0 |
| `ai-ml-services` | 1 |

모두 114개다. `iam-permissions`·`systems-manager`는 넣을 것이 없다. 어느 개념의 `parentId`가 무엇인지는
**`phases/53-concept-indent/hierarchy.json`에 정해져 있다. 그대로 적용한다.** 판정을 다시 하지 마라. 사람이 읽을 트리는
같은 폴더의 `hierarchy.md`이고, `waf-shield`는 이동 뒤의 순서로 그려져 있다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041** — 특히 「남은 자리」 1(WAF)과 「데이터 규칙」, 그리고 ADR-033의 규칙 5
- `phases/53-concept-indent/hierarchy.json`, `phases/53-concept-indent/hierarchy.md`의 `waf-shield` 트리
- `phases/53-concept-indent/verify-hierarchy.mjs` — 머리 주석과 `WAF_MOVE_STEP`·`undoWafMove…` 두 함수(무엇을 허용하는지)
- `phases/53-concept-indent/step3.md` — 같은 작업을 앞 17개 주제에 한 방식
- `src/data/data.test.ts`의 `it('WAF·Shield 주제가 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다'` — 아래 「3」에서 고칠 테스트
- `src/data/topics.json`의 `waf-shield` 주제 개념 줄, `scripts/topics-baseline.json`의 `waf-shield` 개념 항목

## 작업

### 1. WAF 순서 이동 — 테스트를 먼저

먼저 아래 「3」의 테스트를 고치고 `npm test`로 **그 테스트 하나가 실패하는 것**을 확인한다(데이터가 아직 옛 순서다). 그다음
데이터를 옮긴다.

- `src/data/topics.json`: `waf-shield` 주제에서 `{"id":"waf-shield.cloudfront",…` 줄과 그 바로 위 `{"id":"waf-shield.waf",…` 줄의
  **자리를 맞바꾼다.** 두 줄 모두 끝에 쉼표가 있으므로 쉼표는 손대지 않는다. 줄 내용은 한 글자도 바꾸지 않는다.
- `scripts/topics-baseline.json`: `waf-shield`의 `"id": "waf-shield.cloudfront"` 항목(`{`부터 `},`까지 네 줄)을 바로 위
  `"id": "waf-shield.waf"` 항목 앞으로 옮긴다. 두 항목의 내용은 그대로다.

### 2. `parentId` 114개

위 17개 주제의 짝만 적용한다. 방식은 step 3과 같다.

- `topics.json`: 개념 줄의 `"id":"<딸린 개념 id>",` 바로 뒤에 `"parentId":"<머리 개념 id>",`를 끼워 넣는다.
- `topics-baseline.json`: 해당 항목의 `"id"` 줄 바로 뒤, `"name"` 줄 앞에 공백 5칸으로 `"parentId": "<머리 개념 id>",` 한 줄을 넣는다.
- **줄 단위 텍스트 치환으로만 한다.** 두 파일 모두 재직렬화하지 마라. 머리와 홀로 선 개념에는 키를 두지 않는다.
- `waf-shield`의 짝은 `waf` 아래 여덟과 `shield` 아래 셋이다. `cloudfront`와 `firewall-manager`는 홀로 선다.

### 3. 기존 테스트 — 아래 한 곳만, 적힌 만큼만

`src/data/data.test.ts`의 `it('WAF·Shield 주제가 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다', …)` 블록 **전체**를 아래로
바꾼다. 같은 파일의 다른 줄은 한 줄도 바꾸지 않는다.

```ts
  it('WAF·Shield 주제가 CloudFront 재소개 다음 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'waf-shield')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: CloudFront 재소개(1) → WAF(9) → Shield(4) → Firewall Manager(1).
    // CloudFront 재소개는 WAF를 붙이는 자리(waf-attach-targets)가 멀티 오리진 CloudFront를 전제로 쓰므로 그보다 앞에 둔다(규칙 5).
    // WAF 블록 안에 두면 waf와 그 세부 여덟 사이가 끊겨 들여쓰기로 묶을 수 없으므로 주제 맨 앞에 둔다(ADR-041 「남은 자리」 1).
    // Firewall Manager는 WAF 규칙을 중앙에서 배포하므로 두 블록 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'waf-shield.cloudfront',
      'waf-shield.waf',
      'waf-shield.waf-attach-targets',
      'waf-shield.waf-rule-types',
      'waf-shield.waf-managed-rule-groups',
      'waf-shield.waf-rate-based-rule',
      'waf-shield.waf-bot-control',
      'waf-shield.waf-body-inspection-size-limit',
      'waf-shield.waf-web-acl-region-must-match-rest-api',
      'waf-shield.waf-logging-to-firehose',
      'waf-shield.shield',
      'waf-shield.shield-standard-network-layer',
      'waf-shield.shield-advanced-drt',
      'waf-shield.shield-advanced-protection-group',
      'waf-shield.firewall-manager',
    ])
  })
```

**이 한 곳 밖의 기존 테스트가 실패하면 고치지 말고 멈춰라.** `"status": "error"`로 두고 `"error_message"`에 실패한 테스트 이름과
단언을 적는다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/53-concept-indent/verify-hierarchy.mjs 4
```

## 검증 절차

1. AC를 실행한다. `sync-baseline.mjs --dry-run`은 「갱신할 것이 없다」로 끝나야 한다.
2. 다음을 확인한다.
   - `verify-hierarchy.mjs 4`가 `parentId 301개, 적용 주제 39개`를 보고하는가.
   - 바뀐 파일이 `src/data/topics.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts` 셋뿐인가(`git status`).
   - `data.test.ts`의 변경이 WAF 순서 테스트 한 블록뿐인가(`git diff`).
   - 일회성으로 쓴 치환 스크립트를 저장소에 남기지 않았는가.
3. `phases/53-concept-indent/index.json`의 step 4를 갱신한다.
   - 성공 → `"summary"`에 17개 주제와 주제별 `parentId` 수, 합계, WAF 순서 이동, 고친 테스트 한 곳, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **WAF 밖의 개념 순서를 바꾸지 마라.** 이유: ADR-041 「남은 자리」 2~5(Aurora·Route 53·VPC·IAM)는 이번에 옮기지 않기로 했다.
  `verify-hierarchy.mjs`는 WAF 이동 하나만 되돌려 해시를 비교하므로 다른 이동을 잡는다.
- **`cloudfront`를 WAF 묶음 뒤나 Shield 뒤로 보내지 마라.** 이유: `waf-attach-targets`가 멀티 오리진 CloudFront를 전제로 쓴다
  (ADR-033 규칙 5). 전제는 그것을 쓰는 개념보다 앞에 있어야 한다.
- **`cloudfront`를 다른 주제로 옮기지 마라.** 이유: 주제를 옮기면 문항의 `topicId`까지 바뀐다. phase 36이 이동을 권했지만 그것은
  별도 phase다.
- **`hierarchy.json`의 짝을 바꾸거나 더하지 마라.** 이유: 사용자가 승인한 판정이다.
- **`topics.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨진다.
- **`src/` 아래 코드, 위 테스트 한 블록 밖의 테스트, `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 step은 데이터와 그 순서
  단언 하나만 바꾼다.
- 기존 테스트를 깨뜨리지 마라.
