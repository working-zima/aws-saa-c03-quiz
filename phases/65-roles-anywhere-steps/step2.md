# Step 2: roles-anywhere-concept

## 배경

ADR-050대로 `identity-federation.sts` 아래, `identity-federation.sts-assume-role` 바로 뒤에 딸린 개념 `identity-federation.iam-roles-anywhere`를 넣고, 문항
파일 끝에 q742를 붙인다. 개념 635 → 636개, 문항 741 → 742개. 본문은 사용자가 정리하고 공식 문서와 대조해 고친 19단계 절차이고, 사용자가 승인한 글자 그대로다
(근거: ADR-039 「2026-10-21 확장 — IAM Roles Anywhere」, `docs/source/aws-docs.md` 「IAM Roles Anywhere와 AWS CLI의 외부 자격 증명 프로세스」).

무엇을 바꾸는지는 **`phases/65-roles-anywhere-steps/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 판정하거나 문장을 다듬지 마라.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `newConcepts` | 새 개념. `after` 개념(`identity-federation.sts-assume-role`) 바로 뒤에 넣는다. `parentId`는 `identity-federation.sts` | 1 |
| `newQuestions` | 새 문항. 문항 파일 끝(q741 뒤)에 붙인다 | 1 |

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-050**과 ADR-039 끝의 **「2026-10-21 확장 — IAM Roles Anywhere」**, 같은 작업의 선례인 **ADR-049**
- `phases/65-roles-anywhere-steps/changes.json`
- `phases/65-roles-anywhere-steps/verify-content.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `phases/65-roles-anywhere-steps/data-test.patch` — 아래 「1」에서 적용할 테스트 변경
- `src/data/topics.json`의 `identity-federation.sts-assume-role` 줄, `src/data/questions.json`의 마지막 두 줄과 닫는 `]`
- `scripts/topics-baseline.json`의 `identity-federation.sts-assume-role` 항목(`parentId`가 있는 모양), `scripts/check-structure.mjs`·`scripts/sync-baseline.mjs` 머리 주석
- `phases/64-container-visuals/step0.md` — 같은 작업의 선례

## 작업

### 1. 테스트를 먼저 — 패치 하나

```bash
git apply phases/65-roles-anywhere-steps/data-test.patch
```

`src/data/data.test.ts`의 단언 둘이 바뀌고(보안·운영 주제 개념 수 identity-federation 11 → 12, 이 주제의 개념 순서) 끝에 `describe('ADR-050 — 단계 목록')`
(`it` 넷)이 붙는다. 적용한 뒤 `npm test`를 돌려 **정확히 넷이 실패하는지** 확인한다 — 개념 수, 개념 순서, 「번호 목록과 들여쓴 문단이 있는 개념은 이 하나뿐이다」,
「단계 번호가 1부터 19까지」. 다른 테스트가 실패하거나 넷 중 하나라도 통과하면 멈추고 `"status": "error"`, `"error_message"`에 테스트 이름을 적는다.

### 2. `src/data/topics.json`

- `identity-federation.sts-assume-role` 개념 줄 **바로 아래**에 `      `(공백 6칸) + `JSON.stringify(concept)` + `,` 한 줄을 넣는다. 키 순서는 `id`, `parentId`, `name`,
  `summary`, `paragraphs`다.
- **줄 단위 텍스트 치환으로만 한다.** `JSON.parse` → `JSON.stringify`로 파일을 다시 쓰지 마라.

### 3. `src/data/questions.json`

- 마지막 문항 줄(`{"id":"q741",…}`) 끝에 쉼표 하나를 붙이고, 닫는 `]` 앞에 q742를 `JSON.stringify(question)` 한 줄로 넣는다(쉼표 없음).
  키 순서는 `id`, `topicId`, `conceptId`, `prompt`, `choices`, `answerIndex`, `explanation`이다.

### 4. `scripts/topics-baseline.json`

`sync-baseline.mjs`는 개념 개수·id가 다르면 거부하므로 손으로 고친다. 형식은 지금 파일 그대로다.

- `identity-federation.sts-assume-role` 항목(`    {`부터 `    },`까지) **바로 아래**에 아래 모양의 항목을 넣는다.

  ```
      {
       "id": "identity-federation.iam-roles-anywhere",
       "parentId": "identity-federation.sts",
       "name": "IAM Roles Anywhere로 임시 자격 증명 받기"
      },
  ```
- `"conceptLineCount": 635`를 `636`으로, `"questionsSha256"`을 바뀐 `src/data/questions.json`의 sha256으로 바꾼다. 고친 뒤 `node scripts/sync-baseline.mjs --dry-run`이
  「갱신할 것이 없다」를 내야 맞다.

치환에 쓸 일회성 스크립트는 저장소 밖(임시 폴더)에 두고 끝나면 지운다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/65-roles-anywhere-steps/verify-content.mjs
node phases/65-roles-anywhere-steps/tools/check-steps.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` 통과. 새 테스트는 패치의 넷뿐이다.
   - `check-structure.mjs` — 「구조 이상 없음」. `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-content.mjs` — 「새 개념 1개, 새 문항 1개. 개념 636줄」.
   - `check-steps.mjs` — 「✓ 문제 없음 — 단계 그림 19장」(새 개념이 생겨 앵커·번호 검사가 통과한다).
2. 화면 실측(320·390·768·1440px)은 사람이 phase 끝에 Chrome으로 한다. 이 step에서 새 화면 테스트를 더하지 마라.
3. `git status`로 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts` 넷과 phase 메타데이터뿐인지 확인한다.
4. `phases/65-roles-anywhere-steps/index.json`의 step 2를 갱신한다. 성공이면 `summary`에 새 개념 id, 새 문항, 바뀐·새 테스트, 전체 테스트 수를 적는다.

## 금지사항

- **`changes.json`의 문장·위치·문항을 바꾸거나 더하지 마라.** 이유: 사용자가 승인한 글자 그대로다(「단어 하나 빼먹지 말고」). 이상해 보이면 고치지 말고 `summary`에 적어라.
- **기존 개념과 기존 문항을 고치지 마라.** 이유: ADR-050은 새 개념·새 문항만 더한다. `sts-assume-role`의 문장도 그대로다.
- **새 개념에 분류 문장(「AWS 분류로는 … 쪽 서비스다」)을 넣지 마라.** 이유: 서비스 소개 개념이 아니라 딸린 절차 개념이다.
- **`topics.json`·`questions.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨져 가드레일이 진짜 사고와 구분하지 못한다.
- **`data-test.patch` 밖의 테스트를 고치지 마라.** 패치를 적용해도 다른 테스트가 실패하면 멈춰라. 이유: 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.
- **`src/` 아래 코드(테스트가 아닌 `.ts`·`.tsx`), `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 step은 데이터와 그 단언만 바꾼다.
- **단계 그림을 만들지 마라.** 이유: step 3의 범위다.
- 기존 테스트를 깨뜨리지 마라.
