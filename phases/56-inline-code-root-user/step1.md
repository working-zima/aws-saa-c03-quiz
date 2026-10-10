# Step 1: root-user-fact

## 배경

`iam-permissions.root-user-cannot-be-disabled`는 덤프 해설(Q625)에서 온 개념이다. 루트 사용자를 끄는 설정이 없다는 것은 맞지만, 요약과
이 개념에 걸린 문항 q701의 해설이 루트를 지키는 방법을 「IAM 사용자 + 루트 MFA」 하나로 일반화한다. AWS는 Organizations 멤버 계정의 루트
자격 증명을 관리 계정이 지우는 기능을 문서화했다.

이 step은 **`docs/ADR.md`의 ADR-045**대로 개념 한 줄의 `summary`·`paragraphs`와 문항 q701의 `prompt`·`explanation`을 바꾼다. 개념 이름,
문항의 보기·정답은 그대로다.

무엇을 바꾸는지는 **`phases/56-inline-code-root-user/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 판정하거나 문장을
다듬지 마라.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `concepts` | 개념 줄에서 바꿀 필드(`summary`, `paragraphs`) | 1 |
| `questions` | 문항 줄에서 바꿀 필드(`prompt`, `explanation`) | 1 |

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-045**(이 step의 결정)
- `phases/56-inline-code-root-user/changes.json`
- `phases/56-inline-code-root-user/verify-root-user.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `src/data/topics.json`의 `iam-permissions.root-user-cannot-be-disabled` 줄, `src/data/questions.json`의 `q701` 줄 — 바꿀 줄의 모양
- `scripts/topics-baseline.json`의 `"questionsSha256"` 줄
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` 머리 주석 — 스냅샷이 무엇을 대조하는지

## 작업

### 1. `src/data/topics.json`

`      {"id":"iam-permissions.root-user-cannot-be-disabled",`로 시작하는 줄 하나만 바꾼다. 줄 앞 공백 6칸과 끝 쉼표를 떼고 `JSON.parse` →
`summary`와 `paragraphs`에 `changes.json`의 값을 대입 → `JSON.stringify` → 앞 공백과 끝 쉼표를 그대로 붙인다. 키 순서(`id`, `parentId`,
`name`, `summary`, `paragraphs`)는 그대로 남는다.

### 2. `src/data/questions.json`

`{"id":"q701",`로 시작하는 줄 하나만 같은 방식으로 바꾼다. 대입하는 필드는 `prompt`와 `explanation`이다. `choices`·`answerIndex`는
건드리지 않는다.

### 3. `scripts/topics-baseline.json`

`"questionsSha256": "…"`의 값만 바뀐 `src/data/questions.json`의 sha256으로 바꾼다. 개념 이름이 그대로이므로 다른 줄은 바뀌지 않는다.
고친 뒤 `node scripts/sync-baseline.mjs --dry-run`이 「갱신할 것이 없다」를 내야 맞다.

**파일 전체를 `JSON.parse` → `JSON.stringify`로 다시 쓰지 마라.** 줄 단위로만 바꾼다. 치환에 쓸 일회성 스크립트는 저장소 밖(`/tmp` 등)에
두고 끝나면 지운다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/56-inline-code-root-user/verify-root-user.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` — step 0이 끝났을 때와 같은 수의 테스트가 모두 통과한다. 이 step은 테스트를 바꾸지 않는다.
   - `check-structure.mjs` — 「구조 이상 없음」.
   - `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-root-user.mjs` — 「개념 1개·문항 1개의 문장을 바꿨고 데이터 세 파일이 명세와 한 글자도 다르지 않다」.
2. `verify-root-user.mjs`가 실패하면 출력의 「처음 다른 곳」을 보고 고친다. 샌드박스에서 `git`을 실행할 수 없으면 그 사실을 `"summary"`에
   적는다. 사람이 다시 돌린다.
3. 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json` 셋과 phase 메타데이터뿐인지 확인한다.
4. `phases/56-inline-code-root-user/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 바꾼 개념·문항 id와 필드, 새 questionsSha256 앞 12자, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`changes.json`의 문장을 바꾸거나 더하지 마라.** 이유: ADR-045가 정한 사실 수정이다. 이상해 보이면 고치지 말고 `"summary"`에 적어라.
- **개념 `name`, 문항 `choices`·`answerIndex`를 바꾸지 마라.** 이유: 이름의 사실(루트 사용자 자체는 끌 수 없다)은 그대로 맞고, 정답은 단독
  계정에서 그대로 맞다(ADR-045). 이름을 바꾸면 스냅샷 대조도 달라진다.
- **다른 개념·문항 줄을 고치지 마라.** 이유: 이 step은 두 줄만 바꾼다. `verify-root-user.mjs`가 나머지 줄의 바이트 일치를 본다.
- **테스트 파일과 `src/` 아래 코드, `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 데이터 변경은 기존 테스트를 그대로 통과한다. 테스트가
  실패하면 설계가 예상하지 못한 의존이므로 멈추고 `"status": "error"`에 테스트 이름을 적는다.
- 기존 테스트를 깨뜨리지 마라.
