# Step 0: sourced-block-heads

## 배경

phase 53이 딸린 개념을 머리 개념 아래로 들여써 보이게 했고(`docs/ADR.md` **ADR-041**), phase 54가 소개 개념이 없던 블록 여덟에
기본 개념을 세웠다(**ADR-042**). 화면 코드는 끝났다. 개념의 `parentId`가 같은 주제 안 머리 개념의 id를 가리키면
`src/components/ConceptList.tsx`가 세로선과 들여쓰기로 그린다.

이 step은 **ADR-043**대로 남은 블록 일곱에 **기본 개념(머리)을 새로 넣고**, 그 블록의 개념 24개에 `parentId`를 달고, 머리마다
**새 문항 하나씩(q733~q739)**을 문항 파일 끝에 붙인다. 정의는 AWS 공식 문서에서 가져왔다(ADR-039 「2026-10-10 확장 — 블록의 기본 개념
일곱」, `docs/source/aws-docs.md`). 결과는 머리 113 → 120개, 딸린 개념 342 → 366개, 문항 732 → 739개다.

무엇을 바꾸는지는 **`phases/55-sourced-block-heads/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 판정하거나 문장을
다듬지 마라. 사람이 읽을 트리는 같은 폴더의 `trees.md`다.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `newConcepts` | 새 개념. `before` 개념 바로 앞에 넣는다 | 7 |
| `parents` | `children` 각 개념에 `parentId: parent`를 단다 | 24 |
| `newQuestions` | 새 문항. 문항 파일 끝(q732 뒤)에 이 순서대로 붙인다 | 7 |

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041**(데이터 규칙 셋, 구조 가드레일)과 **ADR-043**(이 step의 결정)
- `phases/55-sourced-block-heads/changes.json`, `phases/55-sourced-block-heads/trees.md`
- `phases/55-sourced-block-heads/verify-heads.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `phases/55-sourced-block-heads/data-test.patch` — 아래 「1」에서 적용할 테스트 변경
- `src/data/topics.json`의 개념 줄 하나(예: `elastic-load-balancing.alb`)와 `parentId`가 있는 줄 하나
  (예: `elastic-load-balancing.alb-routing-conditions`) — 넣을 줄의 모양
- `src/data/questions.json`의 마지막 두 줄(q731·q732)과 닫는 `]` — 문항을 붙일 자리
- `scripts/topics-baseline.json`의 같은 개념 항목들 — 스냅샷 쪽 모양
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` 머리 주석 — 스냅샷을 왜 손으로 고치는지

## 작업

### 1. 테스트를 먼저 — 패치 하나

```bash
git apply phases/55-sourced-block-heads/data-test.patch
```

`src/data/data.test.ts`의 테스트 여덟 블록이 바뀐다. 개념 수 단언 둘(「보안·운영 데이터 주제는 …」, 「네트워크 데이터 주제는
…」)과 순서 단언 여섯(EBS, RDS, EC2·Auto Scaling, 백업·재해 복구, IAM 권한, Systems Manager)이다. 패치를 고치거나 다른 줄을 더
바꾸지 마라.

적용한 뒤 `npm test`를 돌려 **정확히 이 여덟이 실패하는지** 확인한다(데이터가 아직 옛 상태다). 다른 테스트가 실패하거나 여덟 중
하나라도 통과하면 멈추고 `"status": "error"`, `"error_message"`에 테스트 이름을 적는다.

### 2. `src/data/topics.json`

- `newConcepts` 일곱: `before` 개념 줄 바로 위에 `      `(공백 6칸) + `JSON.stringify(concept)` + `,` 한 줄을 넣는다.
  키 순서는 `id`, `name`, `summary`, `paragraphs`이고 새 개념에는 `parentId`가 없다.
- `parents` 24개: 딸린 개념 줄의 `"id":"<id>",` 바로 뒤에 `"parentId":"<parent>",`를 끼운다(phase 53·54와 같은 모양).
- **줄 단위 텍스트 치환으로만 한다.** `JSON.parse` → `JSON.stringify`로 파일을 다시 쓰지 마라.

### 3. `src/data/questions.json`

- 마지막 문항 줄(`{"id":"q732",…}`) 끝에 쉼표 하나를 붙인다.
- 그 바로 뒤, 닫는 `]` 앞에 `newQuestions` 일곱을 이 순서대로 `JSON.stringify(question)` 한 줄씩 넣는다. 마지막(q739) 줄에는 쉼표를
  붙이지 않는다. 키 순서는 `id`, `topicId`, `conceptId`, `prompt`, `choices`, `answerIndex`, `explanation`이다.
- 기존 문항 줄은 q732 끝의 쉼표 말고 한 글자도 바꾸지 않는다.

### 4. `scripts/topics-baseline.json`

`sync-baseline.mjs`는 개념 개수·id·parentId가 다르면 거부하므로 손으로 고친다. 형식은 지금 파일 그대로(1칸 들여쓰기 블록)다.

- 새 개념 일곱: `before` 개념 항목(`    {`부터 `    },`까지) 바로 위에 아래 모양의 항목을 넣는다.

  ```
      {
       "id": "<id>",
       "name": "<name>"
      },
  ```
- parentId 24개: 해당 항목의 `"id"` 줄 바로 뒤에 `     "parentId": "<parent>",` 한 줄을 넣는다.
- `"conceptLineCount": 626`을 `633`으로, `"questionsSha256"`을 바뀐 `src/data/questions.json`의 sha256으로 바꾼다.
  sha256을 고친 뒤 `node scripts/sync-baseline.mjs --dry-run`이 「갱신할 것이 없다」를 내야 맞다.

치환에 쓸 일회성 스크립트는 저장소 밖(`/tmp` 등)에 두고 끝나면 지운다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/55-sourced-block-heads/verify-heads.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` — 70개 파일, 1261개 테스트 통과(새 테스트는 없다).
   - `check-structure.mjs` — 「구조 이상 없음」.
   - `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-heads.mjs` — 「새 개념 7개, parentId 24개 추가, 새 문항 7개. 개념 633줄」.
2. `verify-heads.mjs`가 실패하면 출력의 「처음 다른 곳」을 보고 고친다. 기대값을 만드는 규칙은 그 파일의 머리 주석이다.
   샌드박스에서 `git`을 실행할 수 없으면 그 사실을 `"summary"`에 적는다. 사람이 다시 돌린다.
3. `git status`로 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`,
   `src/data/data.test.ts` 넷과 phase 메타데이터뿐인지 확인한다.
4. `phases/55-sourced-block-heads/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 개념 일곱의 id, parentId 24개, 새 문항 일곱, 바뀐 테스트 여덟, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`changes.json`의 문장·짝·위치·문항을 바꾸거나 더하지 마라.** 이유: 사용자가 승인한 내용이다. 이상해 보이면 고치지 말고
  `"summary"`에 적어라.
- **기존 개념과 기존 문항을 고치지 마라.** 이유: ADR-043은 새 개념·새 문항만 더한다. 기존 문항 줄은 q732 끝의 쉼표 하나만 바뀐다.
- **`topics.json`·`questions.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨져 가드레일이
  진짜 사고와 구분하지 못한다.
- **`data-test.patch` 밖의 테스트를 고치지 마라.** 패치를 적용해도 다른 테스트가 실패하면 멈춰라. 이유: 설계가 예상하지 못한
  의존이라 사람이 판단해야 한다.
- **`src/` 아래 코드(`.ts`·`.tsx` 중 테스트가 아닌 것), `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 step은 데이터와 그 단언만
  바꾼다.
- 기존 테스트를 깨뜨리지 마라.
