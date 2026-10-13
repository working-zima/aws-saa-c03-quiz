# phase 57 검증 보고 (2026-10-13)

## 실행

- 설계: develop `931212a`. 구현: worktree `../aws-saa-c03-quiz-p57` [`feat-57-concept-lists`].
- 설계 전에 scratchpad의 시험 worktree에 렌더러 시안과 `changes.json`을 적용해 테스트·전사·콘텐츠 점검·Chrome 실측을 먼저 돌렸다. 데이터만
  바꾸면 데이터 테스트 5개, 렌더러까지 넣으면 도식 테스트 2개(각 h2·h4 두 경우)가 깨졌다. 모두 문단 번호·개수나 표지 없는 본문 글자를 박아
  둔 단언이라, 뜻은 그대로 두고 번호를 옮기거나 표지를 떼고 비교하는 수정 9건을 `changes.json`의 `testEdits`에 글자 그대로 넣었다.
- 실행(`--agent codex`): step 0 21:23~21:29 `cf51d61`, step 1 21:29~21:34 `04fff37`, 재시도 0. codex 샌드박스는 git을 실행하지 못해
  `verify-concept-lists.mjs`를 돌리지 못했다고 보고했다. 아래 AC는 worktree에서 실제 git으로 다시 돌린 결과다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (exit 0) |
| `npm test` | 72개 파일 · 1286개 테스트 통과 (새 테스트 18개: paragraph-blocks 8, ConceptList 본문 목록 6, data ADR-046 4) |
| `check-structure.mjs` | 구조 이상 없음 |
| `sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `verify-concept-lists.mjs` | 기준 `931212a` — 개념 21개의 본문을 목록으로 바꿨고(항목 65개) 데이터가 명세와 한 글자도 다르지 않다. 테스트 수정 9건이 모두 들어 있다 |

## 범위 확인

- 바뀐 파일은 step 0의 넷(`paragraph-blocks.ts`·`paragraph-blocks.test.ts`(새 파일)·`ConceptList.tsx`·`ConceptList.test.tsx`), step 1의
  `topics.json`과 테스트 셋(`data.test.ts`·`ControlTimingDiagram.test.tsx`·`route53Tables.test.tsx`), phase 메타데이터뿐이다.
- 구현은 시험 적용본과 같은 규칙이다. `groupParagraphs`가 잇닿은 `- ` 문단을 묶고 원래 번호를 지니며, `ConceptList`가 `<ul>`로 그리고
  약어 첫 등장 판정에 표지를 뗀 글을 넘긴다. `<p>`의 클래스는 그대로다.
- `topics.json`의 sha256이 시험 적용본과 같다(`dd28410cb0d75dd2…`). 같은 데이터로 worktree에서 다시 확인했다.
  - `check-verbatim.mjs`: 전사 이상 없음.
  - `content-audit.mjs`: develop과 출력이 같다(새 지적 0).
  - `coverage.mjs`: 개념 633개 중 633개 덮임, 문항 739개.
- 개념 `name`·`summary`, 문항 파일, 구조 스냅샷은 바뀌지 않았다.

## Chrome 실측 (미리보기 4378, worktree 빌드)

39개 주제 전체를 iframe 폭 320·390·1280px으로 열어 쟀다.

| 폭 | `<ul>` | `<li>` | 목록 가로 넘침 | 문서 가로 넘침 | 화면에 남은 `- ` | 글머리 기호가 본문 상자 밖 |
|---|---|---|---|---|---|---|
| 320 | 21 | 65 | 0 | 0 | 0 | 0 |
| 390 | 21 | 65 | 0 | 0 | 0 | 0 |
| 1280 | 21 | 65 | 0 | 0 | 0 | 0 |

딸린 개념의 들여쓰기(ADR-041) 안에 있는 목록(ECS 태스크 역할 둘)도 세로선 안쪽에 글머리 기호가 선다(시험 적용 때 390px 화면으로 확인).

## 남겨 둔 것

- `ec2-autoscaling.ec2`와 `ec2-autoscaling.ec2-purchase-options`에 같은 구매 옵션 셋이 두 번 나온다. 이 phase 전부터 있던 중복이고 한 주제
  안에서 목록 둘로 보이게 됐다. 개념을 합치거나 지우는 일은 범위 밖이다(ADR-046 「트레이드오프」).
- 영문 이름은 목록 항목에만 붙였다. 목록 밖 본문의 한국어 유형 이름(대상 추적 정책, 성능 모드, 법적 보존 등)은 그대로다 — 사용자 결정.
