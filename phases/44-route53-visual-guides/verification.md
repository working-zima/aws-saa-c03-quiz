# phase 44 검증 보고 (2026-09-27)

## 실행

- 설계: develop `2b83f91`. 구현: worktree `../aws-saa-c03-quiz-p44` [`feat-44-route53-visual-guides`]. codex 한도 때문에 사용자 결정에 따라
  step 0~3 모두 `--agent claude`로 실행했다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 |
| `npm test` | 56개 파일 · 1020개 테스트 통과 (phase 43 끝 1000 → +20) |
| `check-structure.mjs` | 구조 이상 없음 |
| `check-path-crossings.mjs` | 노드 161 · 경로 137, 교차 없음 |

## 범위 확인

- `DiagramFrame`은 선택 prop `question` 하나와 조건부 `<p>` 한 줄만 바뀌었다. `question`을 넘기는 곳은 Route 53 도식 셋뿐이다.
  다른 도식 16개와 그 JSON은 바뀌지 않았다.
- 새 값은 `www.example.com`, `52.123.25.11`, `ALB`, 그리고 원래 있던 `db.corp.local`·`app.internal.aws`뿐이다. 가상 리전·IP는 없다.
- 캡션·`idleCaption`은 바뀌지 않았다.
- 고친 기존 단언은 step 문서가 허용한 종류(라벨·곁말 집합·"곁말 없이")뿐이다. 각 step `summary`에 목록이 있다.
- 하이브리드 DNS의 `vpc-only` 곁말은 늘 보이게 된 `app.internal.aws`와 겹치지 않도록 y 332 → 346으로 내려갔고, viewBox가 340 → 352가 됐다.
