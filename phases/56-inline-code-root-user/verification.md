# phase 56 검증 보고 (2026-10-11)

## 실행

- 설계: develop `bc85929`, 명세 수정 `1a43525`. 구현: worktree `../aws-saa-c03-quiz-p56` [`feat-56-inline-code-root-user`].
- 설계 전에 scratchpad의 시험 worktree에 코드 변경과 `changes.json`을 적용해 테스트·가드레일·원문 전사·콘텐츠 점검·Chrome 실측을 먼저
  돌렸다. 데이터 변경은 기존 테스트를 그대로 통과했다.
- 1차 실행(`--agent codex`)은 step 0에서 blocked로 끝났다. TDD 가드(`scripts/hooks/tdd-guard.sh`)는 구현 파일과 같은 이름의 테스트 파일이
  있어야 편집을 허용하는데, 명세가 렌더링 테스트를 `ConceptList.test.tsx`에 두라고 해서 `EmphasizedText.tsx` 편집이 막혔다. 명세를 고쳐
  `EmphasizedText.test.tsx`를 새로 만들게 했고(`1a43525`), 막힌 실행이 남긴 테스트 편집은 지웠다. 훅은 고치지 않았다.
- 2차 실행(`--agent codex`)은 codex가 세션을 만들지 못한 채 30분 동안 멈춰 `execute.py`의 시간 제한(`TimeoutExpired`)으로 끝났다. 바뀐
  파일은 없었다. 사용자가 codex 사용량이 부족하다고 알렸고, 사용자 선택으로 `--agent claude`로 다시 돌렸다.
- 3차 실행(`--agent claude`): step 0 23:51~23:54 `8e640ea`, step 1 23:54~23:56 `7ab333b`, 재시도 0.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (exit 0) |
| `npm test` | 71개 파일 · 1268개 테스트 통과 (새 테스트 7개: glossary 2, search 1, EmphasizedText 4) |
| `check-structure.mjs` | 구조 이상 없음 |
| `sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `verify-root-user.mjs` | 기준 `1a43525` — 개념 1개·문항 1개의 문장을 바꿨고 데이터 세 파일이 명세와 한 글자도 다르지 않다 |

## 범위 확인

- 바뀐 파일은 step 0의 여섯(`EmphasizedText.tsx`·`EmphasizedText.test.tsx`(새 파일)·`glossary.ts`·`glossary.test.ts`·`search.ts`·
  `search.test.ts`), step 1의 데이터 셋(`topics.json`·`questions.json`·`topics-baseline.json`), phase 메타데이터뿐이다.
- 구현은 시험 적용본과 같은 규칙이다. `renderEmphasis`가 `**강조**`와 백틱 한 쌍을 함께 나누고, `markFirstOccurrences`가 백틱 안을
  건너뛰고, `stripEmphasis`가 백틱도 지운다.
- 데이터 세 파일의 sha256이 시험 적용본과 같다. 그래서 시험 적용본에서 본 결과와 같은 것을 worktree에서도 다시 확인했다.
  - `check-verbatim.mjs`: 전사 이상 없음.
  - `content-audit.mjs`: develop과 출력이 같다(새 지적 0).
  - `coverage.mjs`: 개념 633개 중 633개 덮임, 문항 739개.
- q701은 보기·정답이 그대로라 q247 이후 정답 위치 분포가 바뀌지 않는다.
- 브라우저 실측은 `measurements.md`에 있다. 117회 모두 `<code>` 24·백틱 0·넘침 0이고 무리 120·딸린 366이 그대로다.

## 남겨 둔 것

- 「루트 비밀번호·액세스 키」처럼 가운뎃점으로 이은 말이 좁은 폭에서 가운뎃점 앞에서 끊긴다. phase 48 실측에 있던 현상과 같다.
