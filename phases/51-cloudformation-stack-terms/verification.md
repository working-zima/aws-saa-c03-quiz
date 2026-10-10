# phase 51 검증 보고 (2026-10-10)

## 실행

- 설계: develop `3f673b4`. 구현: worktree `../aws-saa-c03-quiz-p51` [`feat-51-cloudformation-stack-terms`].
- step 0을 `--agent codex`로 실행했다(09:09~09:14, 재시도 없음). 코드 커밋은 `d4370ce`다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (경고 0) |
| `npm test` | 68개 파일 · 1219개 테스트 통과 (1216 → +3) |
| `check-structure.mjs` | 구조 이상 없음 (`questionsSha256`만 갱신) |
| `check-verbatim.mjs` | 전사 이상 없음 (원본 `concepts-raw.md`를 worktree에 복사해 실제로 대조했다) |
| `check-path-crossings.mjs` | 노드 183 · 경로 153, 교차 없음 |

## 범위 확인 (설계 커밋과 대조하는 스크립트로)

- 바뀐 개념 필드는 셋뿐이다: `governance-iac.cloudformation`의 `paragraphs`(2 → 3), `governance-iac.cloudformation-drift-detection`의
  `summary`와 `paragraphs`(2 → 3). 기존 문단은 한 글자도 바뀌지 않았고, 새 문구는 승인한 것과 글자 그대로 같다.
- 바뀐 문항 필드는 `q296`·`q299`·`q301`의 `explanation`뿐이다. 지정한 구절만 바뀌었고 보기·정답은 그대로다.
- `scripts/topics-baseline.json`은 `questionsSha256` 한 줄만 바뀌었다. `data.test.ts`에는 테스트 3개만 더해졌다.

## 명세 밖 변경 하나 — 기존 테스트 단언

codex가 `src/components/diagrams/DriftScopeDiagram.test.tsx`의 단언 한 줄을 고쳤다. step 문서는 "기존 테스트가 깨지면 고치지 말고 blocked로
멈춘다"고 했으므로 명세를 벗어난 변경이다.

- 바꾸기 전: `expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join(''))`
- 바꾼 뒤: `expect(figure.previousElementSibling?.textContent).toBe(concept.paragraphs.join('').replace(/\*\*/g, ''))`

판단:
- **원래 단언은 승인 문구와 함께 통과할 수 없었다.** 화면은 `**드리프트**`를 굵은 글자로 그리고 `**`를 보여 주지 않는다. 그런데 원래 단언은
  `**`가 들어간 원문과 그대로 비교한다. 바꾸기 전 줄을 임시 테스트 파일에 넣고 새 데이터로 돌리면 두 케이스(h2·h4)가 실패한다(확인 후 임시
  파일은 지웠다). 드리프트 감지 개념에 굵은 말이 처음 들어온 이번 phase에서 처음 드러난 조건이다. step 문서를 쓸 때 이 단언을 놓친 것은
  설계의 잘못이다.
- **느슨해지지 않았다.** 기대값에서 `**` 표시만 지우고, 본문 전체를 글자 그대로 비교하는 것은 같다. 같은 패턴이
  `ControlTimingDiagram`·`OrgScpScopeDiagram`·`IdentityCenterAccessDiagram` 테스트에 이미 있다. 개념 본문에 굵은 말이 있는 도식은 모두 이렇게 비교한다.
