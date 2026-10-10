# Step 0: block-heads

## 배경

phase 53이 딸린 개념을 머리 개념 아래로 들여써 보이게 했다(`docs/ADR.md` **ADR-041**). 개념의 `parentId`가 같은 주제 안
머리 개념의 id를 가리키고, `src/components/ConceptList.tsx`가 그 관계를 세로선과 들여쓰기로 그린다. 화면 코드는 끝났다.

그때 소개 개념이 없어 들여쓰지 못한 블록이 남았다(ALB·NLB, Auto Scaling, IAM 사용자·역할, Fargate, FSx for NetApp ONTAP 등).
이 step은 **ADR-042**대로 그 가운데 여덟 블록에 **기본 개념(머리)을 새로 넣고**, 기존 개념 하나를 머리로 다시 판정하고, 순서
세 곳을 옮긴다. 결과는 머리 102 → 113개, 딸린 개념 301 → 342개다.

무엇을 바꾸는지는 **`phases/54-block-heads/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 판정하거나 문장을
다듬지 마라. 사람이 읽을 트리는 같은 폴더의 `trees.md`다.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `newConcepts` | 새 개념. `before` 개념 바로 앞에 넣는다 | 8 |
| `moves` | 개념 `id`를 `after` 개념 바로 뒤로 옮긴다 | 3 |
| `parents` | `children` 각 개념에 `parentId: parent`를 단다 | 41 |
| `relinks` | 문항의 `conceptId`를 `from`에서 `to`로 바꾼다 | 9 |

`step` 키는 설계 기록이다. 이 step이 전부(0과 1)를 적용한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041**(데이터 규칙 셋, 구조 가드레일)과 **ADR-042**(이 step의 결정)
- `phases/54-block-heads/changes.json`, `phases/54-block-heads/trees.md`
- `phases/54-block-heads/verify-heads.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `phases/54-block-heads/data-test.patch` — 아래 「1」에서 적용할 테스트 변경
- `src/data/topics.json`의 개념 줄 하나(예: `elastic-load-balancing.gateway-load-balancer`)와 `parentId`가 있는 줄 하나
  (예: `elastic-load-balancing.gwlb-endpoint-cross-account-inspection`) — 넣을 줄의 모양
- `scripts/topics-baseline.json`의 같은 두 개념 항목 — 스냅샷 쪽 모양
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` 머리 주석 — 스냅샷을 왜 손으로 고치는지

## 작업

### 1. 테스트를 먼저 — 패치 하나

```bash
git apply phases/54-block-heads/data-test.patch
```

`src/data/data.test.ts`의 테스트 아홉 블록이 바뀐다. 개념 수 단언 둘(「보안·운영 데이터 주제는 …」, 「네트워크 데이터 주제는
…」)과 순서 단언 일곱(EFS·FSx, Aurora, EC2·Auto Scaling, 로드 밸런서, 컨테이너, Route 53, IAM 권한)이다. 패치를 고치거나
다른 줄을 더 바꾸지 마라.

적용한 뒤 `npm test`를 돌려 **정확히 이 아홉이 실패하는지** 확인한다(데이터가 아직 옛 상태다). 다른 테스트가 실패하거나
아홉 중 하나라도 통과하면 멈추고 `"status": "error"`, `"error_message"`에 테스트 이름을 적는다.

### 2. `src/data/topics.json`

- `newConcepts` 여덟: `before` 개념 줄 바로 위에 `      `(공백 6칸) + `JSON.stringify(concept)` + `,` 한 줄을 넣는다.
  키 순서는 `id`, `name`, `summary`, `paragraphs`이고 새 개념에는 `parentId`가 없다.
- `moves` 셋: 개념 줄을 그대로 빼서 `after` 개념 줄 바로 아래에 넣는다. 셋 다 주제 끝 줄이 아니므로 줄 끝 쉼표는 그대로다.
- `parents` 41개: 딸린 개념 줄의 `"id":"<id>",` 바로 뒤에 `"parentId":"<parent>",`를 끼운다(phase 53과 같은 모양).
- **줄 단위 텍스트 치환으로만 한다.** `JSON.parse` → `JSON.stringify`로 파일을 다시 쓰지 마라.

### 3. `src/data/questions.json`

`relinks` 아홉: 해당 문항 줄(`{"id":"q079",…`)의 `"conceptId":"<from>"`을 `"conceptId":"<to>"`로 바꾼다. 프롬프트·보기·
정답·해설은 한 글자도 바꾸지 않는다.

### 4. `scripts/topics-baseline.json`

`sync-baseline.mjs`는 개념 개수·id·parentId가 다르면 거부하므로 손으로 고친다. 형식은 지금 파일 그대로(1칸 들여쓰기 블록)다.

- 새 개념 여덟: `before` 개념 항목(`    {`부터 `    },`까지) 바로 위에 아래 모양의 항목을 넣는다.

  ```
      {
       "id": "<id>",
       "name": "<name>"
      },
  ```
- 이동 셋: 항목 블록을 빼서 `after` 개념 항목 바로 뒤에 넣는다.
- parentId 41개: 해당 항목의 `"id"` 줄 바로 뒤에 `     "parentId": "<parent>",` 한 줄을 넣는다(phase 53과 같은 모양).
- `"conceptLineCount": 618`을 `626`으로, `"questionsSha256"`을 바뀐 `src/data/questions.json`의 sha256으로 바꾼다.
  sha256을 고친 뒤 `node scripts/sync-baseline.mjs --dry-run`이 「갱신할 것이 없다」를 내야 맞다.

치환에 쓸 일회성 스크립트는 저장소 밖(`/tmp` 등)에 두고 끝나면 지운다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/54-block-heads/verify-heads.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` — 70개 파일, 1261개 테스트 통과(새 테스트는 없다).
   - `check-structure.mjs` — 「구조 이상 없음」.
   - `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-heads.mjs` — 「새 개념 8개, 이동 3개, parentId 41개 추가, 문항 재연결 9개. 개념 626줄」.
2. `verify-heads.mjs`가 실패하면 출력의 「처음 다른 곳」을 보고 고친다. 기대값을 만드는 규칙은 그 파일의 머리 주석이다.
3. `git status`로 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`,
   `src/data/data.test.ts` 넷과 phase 메타데이터뿐인지 확인한다.
4. `phases/54-block-heads/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 개념 여덟의 id, 이동 셋, parentId 41개, 문항 재연결 아홉, 바뀐 테스트 아홉, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`changes.json`의 문장·짝·위치를 바꾸거나 더하지 마라.** 이유: 사용자가 승인한 내용이다. 이상해 보이면 고치지 말고
  `"summary"`에 적어라.
- **기존 개념의 `name`·`summary`·`paragraphs`를 고치지 마라.** 특히 `elb`·`ec2`·`iam`·`ecs`·`fsx`의 본문은 그대로다. 이유:
  ADR-042는 소개 개념을 그대로 두기로 했고, 그 문단을 못박은 테스트가 여럿이다.
- **새 문항을 만들지 마라.** 이유: 문항은 다시 잇기만 한다(ADR-042). 문항의 `conceptId` 말고는 한 글자도 바꾸지 않는다.
- **`topics.json`·`questions.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨져 가드레일이
  진짜 사고와 구분하지 못한다.
- **`data-test.patch` 밖의 테스트를 고치지 마라.** 패치를 적용해도 다른 테스트가 실패하면 멈춰라. 이유: 설계가 예상하지 못한
  의존이라 사람이 판단해야 한다.
- **`src/` 아래 코드(`.ts`·`.tsx` 중 테스트가 아닌 것), `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 step은 데이터와 그 단언만
  바꾼다.
- 기존 테스트를 깨뜨리지 마라.
