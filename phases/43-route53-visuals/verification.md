# phase 43 검증 보고 (2026-09-27)

## 실행

- 설계: develop `1b97f86`. 구현: worktree `../aws-saa-c03-quiz-p43` [`feat-43-route53-visuals`].
- step 0~2는 `--agent codex`로 실행했다. step 3은 codex 사용량 한도로 세 번 모두 0초 만에 종료됐다(`You've hit your usage limit`).
  구현 오류가 아니다. 사용자 결정에 따라 step 3을 `pending`으로 되돌려 `--agent claude`로 실행했다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (경고 0) |
| `npm test` | 56개 파일 · 1000개 테스트 통과 (phase 42 끝 953 → +47) |
| `check-structure.mjs` | 구조 이상 없음 |
| `check-path-crossings.mjs` | 노드 161 · 경로 137, 교차 없음 |

## 범위 확인

- 바뀐 소스는 명세한 파일뿐이다. 새 컴포넌트 넷(`route53Tables`, `Route53HealthDiagram`, `Route53AliasDiagram`, `Route53HybridDnsDiagram`)과
  그 테스트, `route53.json`, `registry.ts` 네 줄, `data/index.ts` 한 줄이다.
- `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`과 기존 테스트는 바뀌지 않았다.
- 칸·캡션·곁말에 가중치 비율, TTL, 레코드 유형, IP 숫자, VPN·Direct Connect·AD 노드가 없다. 비정상 표시는 색이 아니라 흐림과 곁말 `비정상`이다.
- 브라우저 실측은 `measurements.md`에 있다.

## 병합 전 수정 (사용자 승인, 2026-09-27)

- 새 `idleCaption` 셋이 "~확인하세요", "~비교하세요"로 끝나 기존 도식의 평서형("~볼 수 있다")과 달랐다. 사용자 결정에 따라
  `route53.json`의 세 문장을 평서형으로 고쳤다. 첫 수정안에서 별칭 도식 문장이 58자로 늘어나 320px에서 3줄이 되었으므로
  53자로 줄였다. 다시 재 보니 세 문장 모두 320px·390px에서 2줄이다. 테스트는 JSON 값을 읽으므로 고치지 않았고, 1000개 모두 통과했다.
