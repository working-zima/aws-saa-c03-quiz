# phase 49 검증 보고 (2026-10-09)

## 실행

- 설계: develop `516d7e0`. 구현: worktree `../aws-saa-c03-quiz-p49` [`feat-49-lambda-concurrency-terms`].
- 첫 실행(`--agent codex`)은 세 번 모두 시작하자마자 끝났다(`You've hit your usage limit … try again at 9:27 PM`). 구현 오류가 아니고 데이터도
  바뀌지 않았다. 남은 것은 step 상태를 `error`로 적은 메타데이터 커밋(`257aa77`)뿐이다. 사용자 결정에 따라 step 0을 `pending`으로 되돌리고
  `--agent claude`로 다시 실행했다(`fb75fe8`).

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (경고 0) |
| `npm test` | 63개 파일 · 1144개 테스트 통과 (1139 → +5) |
| `check-structure.mjs` | 구조 이상 없음 (`questionsSha256`은 `sync-baseline.mjs`로 갱신) |
| `check-verbatim.mjs` | 전사 이상 없음 (원본 `concepts-raw.md`를 worktree에 복사해 실제로 대조했다) |
| `field-diff.mjs HEAD --list` | exit 1 — 아래 「명세의 잘못」 |

## 범위 확인 (설계 커밋과 대조하는 스크립트로)

- 바뀐 개념 필드는 셋뿐이다: `lambda.lambda-reserved-concurrency`의 `summary`·`paragraphs`(2 → 3),
  `api-gateway-step-functions.api-gateway-endpoint-types`의 `paragraphs`. `name`·개념 순서는 그대로다.
- 바뀐 문항 필드는 넷뿐이다: `q086`·`q494`·`q495`·`q496`의 `explanation`. `prompt`·`choices`·`answerIndex`는 그대로다.
- 새 문구는 사용자가 승인한 것과 글자 그대로 같다. 해설 넷은 지정한 구절만 바뀌었고 나머지 문장은 같다.
- `scripts/topics-baseline.json`은 `questionsSha256` 한 줄만 바뀌었다.
- `data.test.ts`에는 테스트 5개가 더해졌고, 기존 줄은 지워지거나 바뀌지 않았다.

## 명세의 잘못

- step 0의 AC에 `field-diff.mjs HEAD --list`를 넣었다. 그런데 이 도구는 phase 32(제목 손질)용이라 `paragraphs`·`explanation`을 바뀌면 안 되는
  필드로 보고, 그 필드를 고치는 이번 step에서는 늘 exit 1이 나온다. 바뀐 항목 목록 자체는 명세의 여섯 자리와 같았다. 에이전트는 도구를
  고치지 않았다. 판정은 위 「범위 확인」의 스크립트 대조로 대신했다.
