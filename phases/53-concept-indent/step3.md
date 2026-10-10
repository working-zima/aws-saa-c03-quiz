# Step 3: hierarchy-batch-a

## 배경

딸린 개념을 머리 개념 아래로 들여써 보이기로 했다(`docs/ADR.md` **ADR-041**). 앞 step에서 끝난 것:

- step 0 — `Concept.parentId`, `ConceptGroup`, `src/lib/concept-groups.ts`(`groupConcepts`·`hierarchyProblems`), `data.test.ts` 끝의
  `개념 계층 (ADR-041)` 전 주제 검사
- step 1 — `ConceptList`가 딸린 개념을 들여써 그린다
- step 2 — 표본 5개 주제에 `parentId` 62개. `check-structure.mjs`가 `parentId`를 대조하고 `sync-baseline.mjs`가 거부한다.
  사람이 실제 화면에서 표본을 확인했고 나머지를 진행하기로 했다(2026-10-10).

이 step은 **나머지 34개 주제 가운데 앞 17개 주제**에 `parentId`를 넣는다. 뒤 17개는 step 4다. 개념 순서는 바꾸지 않는다.

| 주제 | `parentId` 수 |
|---|---|
| `aws-core-services` | 0 |
| `s3-storage-classes` | 0 |
| `s3-versioning-lifecycle` | 5 |
| `s3-encryption-batch` | 10 |
| `s3-access-control` | 4 |
| `ebs-instance-store` | 10 |
| `efs-fsx` | 16 |
| `storage-gateway-migration` | 4 |
| `rds-storage-features` | 4 |
| `aurora` | 5 |
| `dynamodb` | 9 |
| `elasticache-purpose-built-db` | 8 |
| `ec2-autoscaling` | 1 |
| `elastic-load-balancing` | 1 |
| `cloudfront-global-accelerator` | 18 |
| `ecs-eks-fargate` | 13 |
| `api-gateway-step-functions` | 17 |

모두 125개다. `aws-core-services`·`s3-storage-classes`는 넣을 것이 없다 — 소개 개념 없이 같은 높이의 개념이 나란히 있는 주제다.
어느 개념의 `parentId`가 무엇인지는 **`phases/53-concept-indent/hierarchy.json`에 정해져 있다. 그대로 적용한다.**
판정을 다시 하지 마라 — 사용자가 승인한 판정이다. 사람이 읽을 트리는 같은 폴더의 `hierarchy.md`다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041** — 특히 「판정 규칙」·「데이터 규칙」·「구조 가드레일」
- `phases/53-concept-indent/hierarchy.json` — 형식은 `{ 주제 id: [[딸린 개념 id, 머리 개념 id], …] }`
- `phases/53-concept-indent/verify-hierarchy.mjs` — 머리 주석
- `phases/53-concept-indent/step2.md` — 같은 작업을 표본에 한 방식(「2」·「3」)
- `src/data/topics.json`에서 step 2가 넣은 줄 하나(예: `data-transfer-services.datasync-manifest`) — 넣는 모양의 선례
- `scripts/topics-baseline.json`에서 step 2가 넣은 항목 하나 — 스냅샷 쪽 선례

## 작업

### 1. `src/data/topics.json` — 125개 개념 줄에 `parentId`를 넣는다

위 17개 주제의 짝만 적용한다. 개념 줄의 `"id":"<딸린 개념 id>",` 바로 뒤에 `"parentId":"<머리 개념 id>",`를 끼워 넣는다.
step 2와 똑같은 모양이다.

- **줄 단위 텍스트 치환으로만 한다.** `JSON.parse` → `JSON.stringify`로 파일을 다시 쓰지 마라 — 한 줄 포맷이 깨지고
  `check-structure.mjs`의 `conceptLineCount`가 무너진다.
- 머리 개념과 홀로 선 개념에는 키를 두지 않는다(`null`도 쓰지 않는다).
- 개념 순서·다른 키·다른 주제(step 2의 다섯 주제 포함)는 한 글자도 바꾸지 않는다.

### 2. `scripts/topics-baseline.json` — 같은 125개 항목에 `parentId` 줄을 넣는다

해당 개념 항목의 `"id"` 줄 바로 뒤, `"name"` 줄 앞에 같은 들여쓰기(공백 5칸)로 `"parentId": "<머리 개념 id>",` 한 줄을 넣는다.
파일 전체를 다시 직렬화하지 마라. `conceptLineCount`·`questionsSha256`·다른 항목은 그대로다.

### 3. 확인

먼저 `node phases/53-concept-indent/verify-hierarchy.mjs 3`과 `node scripts/check-structure.mjs`로 데이터를 확인한 뒤
`npm test`를 돈다. `data.test.ts` 끝의 `개념 계층 (ADR-041)` 테스트가 같은 주제·두 단·연속 규칙을 검사한다.

**이 step에서 고칠 기존 테스트는 없다.** 설계 단계에서 이 17개 주제의 개념을 주제 전체로 그려 제목 레벨을 단언하는 테스트를
찾지 못했다. **기존 테스트가 하나라도 실패하면 고치지 말고 멈춰라.** `"status": "error"`로 두고 `"error_message"`에 실패한
테스트 이름과 단언을 적는다. 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/53-concept-indent/verify-hierarchy.mjs 3
```

## 검증 절차

1. AC를 실행한다. `sync-baseline.mjs --dry-run`은 「갱신할 것이 없다」로 끝나야 한다.
2. 다음을 확인한다.
   - `verify-hierarchy.mjs 3`이 `parentId 187개, 적용 주제 22개`를 보고하는가(step 2의 62개 + 이 step의 125개).
   - 바뀐 파일이 `src/data/topics.json`과 `scripts/topics-baseline.json` 둘뿐인가(`git status`).
   - `topics.json`에서 바뀐 줄이 125줄이고, 각 줄의 변경이 `"parentId":"…",` 삽입뿐인가(`git diff --stat`과 `git diff`).
   - 일회성으로 쓴 치환 스크립트를 저장소에 남기지 않았는가.
3. `phases/53-concept-indent/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 17개 주제와 주제별 `parentId` 수, 합계, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **위 17개 주제 밖에 `parentId`를 넣지 마라.** 이유: 뒤 17개 주제는 step 4가 WAF 순서 이동과 함께 맡는다.
  `verify-hierarchy.mjs 3`이 이것을 잡는다.
- **`hierarchy.json`의 짝을 바꾸거나 더하지 마라.** 이유: 사용자가 승인한 판정이다. 판정이 이상해 보이면 고치지 말고
  `"summary"`에 적어라.
- **개념 순서를 바꾸지 마라.** 이유: 순서는 ADR-033이 정했다. 이 phase에서 순서를 바꾸는 곳은 step 4의 WAF 하나뿐이다.
- **`topics.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨져 가드레일이
  "구조가 바뀌었다"로 보고하고, 진짜 사고와 구분되지 않는다.
- **`src/` 아래 코드·테스트, `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 화면·규칙·가드레일은 step 0~2에서 끝났고, 이 step은
  데이터만 넣는다.
- 기존 테스트를 깨뜨리지 마라.
