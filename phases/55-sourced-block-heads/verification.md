# phase 55 검증 보고 (2026-10-10)

## 실행

- 설계: develop `61a3e76`. 구현: worktree `../aws-saa-c03-quiz-p55` [`feat-55-sourced-block-heads`].
- 설계 전에 scratchpad의 시험 worktree에 `changes.json`을 적용해 테스트·가드레일·원문 전사·콘텐츠 점검을 먼저 돌렸다. 그때 걸린 것을
  명세에서 고쳤다.
  - 해설 약어 풀이 누락 1건: q734의 `AZ`를 `AZ(Availability Zone)`로 고쳤다.
  - 「⑤ 장문」 신호 3건: q735·q737·q738의 긴 문장을 나눴다.
  - IAM 정책 본문의 백틱 표기를 뺐다.
- 고친 결과에서 실패한 테스트 여덟을 고친 것이 `data-test.patch`다.
- step 0을 `--agent codex`로 실행했다(21:43~21:47, 재시도 0). codex 샌드박스에서 `git`을 쓸 수 없어 codex는 `git apply` 대신 `patch`를 썼고,
  `verify-heads.mjs`는 파일 사본으로 돌렸다(step 요약). 아래 AC는 worktree에서 실제 `git`으로 다시 실행한 결과다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (exit 0) |
| `npm test` | 70개 파일 · 1261개 테스트 통과 (새 테스트 없음, 바뀐 단언 여덟) |
| `check-structure.mjs` | 구조 이상 없음 |
| `sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `verify-heads.mjs` | 기준 `61a3e76` — 새 개념 7개, parentId 24개 추가, 새 문항 7개, 개념 633줄. 데이터 세 파일이 명세와 한 글자도 다르지 않다 |

## 범위 확인

- 바뀐 파일은 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts` 넷과 phase
  메타데이터뿐이다.
- `data.test.ts`의 변경은 `data-test.patch`와 diff까지 같다.
- 데이터 세 파일과 `data.test.ts`의 sha256이 시험 적용본과 같다. 그래서 시험 적용본에서 돌린 세 검사도 그대로 유효하다.
  - `check-verbatim.mjs`: 전사 이상 없음.
  - `content-audit.mjs`: 바뀐 여섯 주제에서 개념·문항 수 말고는 지표가 늘지 않았다.
  - `coverage.mjs`: 문항이 없는 주제 없음. 「모든 개념이 문항 하나 이상을 갖는다」도 통과한다.
- 기존 개념과 기존 문항은 바뀌지 않았다. `questions.json`에서 기존 줄은 q732 끝의 쉼표 하나만 바뀌었다.
- 새 문항 일곱의 정답 위치(2·3·0·1·1·3·2)로 q247 이후 구간은 123·124·123·123(각 25% 안팎)이다.
- 브라우저 실측은 `measurements.md`에 있다. 117회 모두 판정과 같고 가로 넘침과 콘솔 오류가 없다.

## 남겨 둔 것 (ADR-043 「검토할 것으로 남긴 것」)

- 기존 개념 `iam-permissions.root-user-cannot-be-disabled`가 Organizations의 루트 접근 중앙 관리와 어긋날 수 있다. 사용자 결정을 기다린다.
- IAM 개념 셋의 백틱 표기가 화면에 기호 그대로 나온다.
