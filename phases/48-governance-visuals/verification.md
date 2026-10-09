# phase 48 검증 보고 (2026-10-09)

## 실행

- 설계: develop `c2a7cf4`. 구현: worktree `../aws-saa-c03-quiz-p48` [`feat-48-governance-visuals`].
- step 0~2를 모두 `--agent codex`로 실행했다(16:27~16:38). 재시도와 사용량 한도는 없었다.
- 세 step 모두 출발점 좌표를 바꾸지 않았다(step 1·2 summary).

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 (청크 크기 경고는 기존과 같다) |
| `npm run lint` | 통과 (경고 0) |
| `npm test` | 66개 파일 · 1175개 테스트 통과 (설계 직후 1139 → +36) |
| `check-structure.mjs` | 구조 이상 없음 |
| `check-path-crossings.mjs` | 노드 173 · 경로 145, 교차 없음 |

## 범위 확인

- 바뀐 소스는 명세한 파일뿐이다. 새 컴포넌트 셋(`governanceTables`, `DriftScopeDiagram`, `ControlTimingDiagram`)과 그 테스트,
  `governance-iac.json`, `registry.ts`(import 셋·키 셋), `data/index.ts`(import 하나·키 하나)다.
- `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`과 기존 테스트는 바뀌지 않았다.
- `governance-iac.json`의 표 일곱 행, 캡션 다섯, 물음·범례·노드·곁말 문구가 step 문서와 글자 그대로 같다(스크립트로 대조).
- 칸·캡션·곁말에 Service Catalog와 템플릿의 관계, Control Tower의 공유 계정, Account Factory, RAM 공유 범위, 자동 수정 서비스 이름,
  시간 숫자가 없다. 거부·위반은 색이 아니라 흐림과 곁말로 보인다.
- 브라우저 실측은 `measurements.md`에 있다.

## 남은 것

- **320px 표에서 `달라졌는지`가 `달라졌는` / `지`로 끊긴다**(`measurements.md` 「표의 줄바꿈」). 설계에서 영문 이름만 재고 한글 단어의
  길이는 재지 않아 생긴 것이다. 고칠 문구 후보 `템플릿과 다른지 볼 때`는 320px에서 끊김이 없다. 사용자 결정 대기.
