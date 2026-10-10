# Step 2: sample-hierarchy

## 배경

딸린 개념을 머리 개념 아래로 들여써 보이기로 했다(`docs/ADR.md` **ADR-041**). step 0이 `Concept.parentId`와
`src/lib/concept-groups.ts`(`groupConcepts`·`hierarchyProblems`)를 만들었고, `src/data/data.test.ts` 끝의
`개념 계층 (ADR-041)` 테스트가 전 주제를 검사한다. step 1이 `ConceptList`가 딸린 개념을 들여써 그리게 했다.

이 step은 **표본 5개 주제의 데이터에 `parentId`를 넣는다.** 이 step이 끝나면 phase가 멈춘다. 사람이 실제 화면에서 표본을
읽어 본 뒤 나머지 34개 주제를 진행한다. **이 다섯 말고 다른 주제에는 `parentId`를 넣지 않는다.**

| 주제 | 고른 이유 | `parentId` 수 |
|---|---|---|
| `data-transfer-services` | 사용자가 예로 든 DataSync 주제 | 15 |
| `sqs-sns-eventbridge` | 개념이 가장 많고(33) 머리가 넷 | 25 |
| `vpc-networking` | 딸린 개념에 도식·비교표가 여섯 붙는다 — 모바일 폭 확인용 | 10 |
| `lambda` | 서비스가 하나뿐인 주제 — 하위 기능 블록을 머리로 삼는다 | 5 |
| `backup-disaster-recovery` | 딸린 개념에 비교표 셋과 도식 하나가 붙는다 | 7 |

모두 62개다. 어느 개념의 `parentId`가 무엇인지는 **`phases/53-concept-indent/hierarchy.json`에 정해져 있다. 그대로 적용한다.**
판정을 다시 하지 마라 — 사용자가 승인한 판정이다. 사람이 읽을 트리는 같은 폴더의 `hierarchy.md`다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041** — 특히 「데이터 규칙」과 「구조 가드레일」
- `docs/ARCHITECTURE.md`의 「예외는 `parentId` 하나다」 문단
- `phases/53-concept-indent/hierarchy.json` — 형식은 `{ 주제 id: [[딸린 개념 id, 머리 개념 id], …] }`
- `phases/53-concept-indent/verify-hierarchy.mjs` — 머리 주석(무엇을 검사하는지)
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` — 머리 주석과 개념 비교 부분
- `scripts/topics-baseline.json`의 개념 항목 모양(`id`·`name` 두 키, 공백 5칸 들여쓰기)
- `src/data/topics.json`의 개념 줄 모양(개념 하나가 한 줄, 공백 6칸 뒤 `{"id":"…","name":"…",…}`)
- `src/components/diagrams/backupTables.test.tsx` — 아래 「4」에서 고칠 단언

## 작업

### 1. 구조 가드레일이 `parentId`를 지키게 한다 — 테스트처럼 먼저

`parentId`는 구조다. 문체 작업이 개념 줄을 다시 쓰다 떨어뜨리면 잡아야 한다.

- `scripts/check-structure.mjs`의 「3. 개념 id·name·개수·순서」 비교에 `parentId`를 더한다. 스냅샷 항목의 `parentId`와
  `topics.json` 개념의 `parentId`가 다르면(한쪽에만 있어도) 문제로 보고한다. 문장에 개념 id와 전후 값을 넣고, 키가 없으면 `없음`으로
  적는다. 머리 주석과 마지막 성공 문장의 「개념 id·name」을 「개념 id·name·parentId」로 고친다.
- `scripts/sync-baseline.mjs`는 `parentId`가 다르면 **갱신을 거부한다**(`refusals`). 머리 주석 표에 한 줄을 더한다:
  `| 개념 parentId | 다르면 **거부한다** (ADR-041 — 구조다) |`. 이 도구가 `parentId`를 쓰지는 않는다.

이 두 줄을 먼저 고치고 `node scripts/check-structure.mjs`가 **통과하는 것**을 확인한다(아직 양쪽 다 `parentId`가 없다).

### 2. `src/data/topics.json` — 62개 개념 줄에 `parentId`를 넣는다

`hierarchy.json`에서 위 다섯 주제의 짝만 적용한다. 개념 줄의 `"id":"<딸린 개념 id>",` 바로 뒤에 `"parentId":"<머리 개념 id>",`를
끼워 넣는다.

```text
바꾸기 전:       {"id":"data-transfer-services.datasync-manifest","name":"전송 대상을 좁히는 DataSync 매니페스트",…
바꾼 뒤:         {"id":"data-transfer-services.datasync-manifest","parentId":"data-transfer-services.datasync","name":"전송 대상을 좁히는 DataSync 매니페스트",…
```

- **줄 단위 텍스트 치환으로만 한다.** `JSON.parse` → `JSON.stringify`로 파일을 다시 쓰지 마라 — 한 줄 포맷이 깨지고
  `check-structure.mjs`의 `conceptLineCount`가 무너진다.
- 머리 개념과 홀로 선 개념에는 키를 두지 않는다(`null`도 쓰지 않는다).
- 개념 순서·다른 키·다른 주제는 한 글자도 바꾸지 않는다.

### 3. `scripts/topics-baseline.json` — 같은 62개 항목에 `parentId` 줄을 넣는다

해당 개념 항목의 `"id"` 줄 바로 뒤, `"name"` 줄 앞에 같은 들여쓰기(공백 5칸)로 한 줄을 넣는다.

```text
    {
     "id": "data-transfer-services.datasync-manifest",
     "parentId": "data-transfer-services.datasync",
     "name": "전송 대상을 좁히는 DataSync 매니페스트"
    },
```

`conceptLineCount`·`questionsSha256`·다른 항목은 그대로다. 파일 전체를 다시 직렬화하지 마라.

### 4. 기존 테스트 — 아래 한 곳만, 적힌 만큼만

`src/components/diagrams/backupTables.test.tsx`의 `공유 본문 h%i` 안 `%s 표가 %s의 본문 바로 뒤에 나온다`는 주제 전체를
`ConceptList`로 그린 뒤 표가 붙은 개념의 제목을 `level: headingLevel`로 찾는다. 세 표의 개념(`backup-ec2-resource-assignment`,
`organizations-backup-policy`, `backup-cross-account-copy`)이 모두 `backup` 아래 딸린 개념이 되어 제목이 한 단계 내려가므로
이 단언이 깨진다.

- 그 단언의 `level: headingLevel`을 `level: headingLevel + 1`로 바꾸고, 바로 위에 한 줄 주석을 단다:
  `// 세 표의 개념은 모두 backup 아래 딸린 개념이라 제목이 한 단계 아래다(ADR-041).`
- 같은 테스트의 다른 단언과 파일의 다른 테스트는 고치지 마라.

**이 한 곳 밖의 기존 테스트가 실패하면 고치지 말고 멈춰라.** `"status": "error"`로 두고 `"error_message"`에 실패한 테스트 이름과
단언을 적는다. 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/53-concept-indent/verify-hierarchy.mjs 2
```

## 검증 절차

1. AC를 실행한다. `sync-baseline.mjs --dry-run`은 「갱신할 것이 없다」로 끝나야 한다.
2. 다음을 확인한다.
   - `verify-hierarchy.mjs 2`가 `parentId 62개, 적용 주제 5개`를 보고하는가.
   - `src/data/questions.json`·`src/components/`(위 테스트 한 곳 제외)·`src/lib/`·`src/types/`·`docs/`가 그대로인가(`git status`).
   - `topics.json`에서 바뀐 줄이 62줄이고, 각 줄의 변경이 `"parentId":"…",` 삽입뿐인가(`git diff --stat`과 `git diff`).
   - 일회성으로 쓴 치환 스크립트를 저장소에 남기지 않았는가.
3. `phases/53-concept-indent/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 다섯 주제와 `parentId` 수(주제별), 가드레일 두 파일의 변경, 고친 기존 테스트 한 곳, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **다섯 주제 밖에 `parentId`를 넣지 마라.** 이유: 표본을 사람이 실제 화면에서 확인한 뒤 나머지를 진행하기로 했다.
  `verify-hierarchy.mjs 2`가 이것을 잡는다.
- **`hierarchy.json`의 짝을 바꾸거나 더하지 마라.** 이유: 사용자가 승인한 판정이다. 판정이 이상해 보이면 고치지 말고
  `"summary"`에 적어라.
- **개념 순서를 바꾸지 마라.** 이유: 순서는 ADR-033이 정했고, 이 phase는 관계만 적는다.
- **`topics.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨져 가드레일이
  "구조가 바뀌었다"로 보고하고, 진짜 사고와 구분되지 않는다.
- **`sync-baseline.mjs`가 `parentId`를 쓰게 만들지 마라.** 이유: `parentId`는 구조라서 사람이 의도적으로 바꾸는 값이다.
  도구가 맞춰 주면 가드레일이 고무도장이 된다.
- **`ConceptList.tsx`·`concept-groups.ts`를 고치지 마라.** 이유: 화면과 규칙은 step 0·1에서 끝났다.
- 기존 테스트를 깨뜨리지 마라.
