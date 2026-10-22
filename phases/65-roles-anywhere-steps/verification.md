# phase 65 검증 보고 — IAM Roles Anywhere 19단계 개념과 단계 그림 19장 (ADR-050, ADR-039 확장)

검증일 2026-10-22. 대상 `feat-65-roles-anywhere-steps` `6a52555`(설계 `29a05f1` 위 step 0~3)과 실측 뒤 틀 수정 `7d5c342`.
이 브랜치는 `origin/develop`(`29a05f1`, phase 65 설계)에서 팠고, 작업 폴더는 worktree `aws-saa-c03-quiz-roles-anywhere`다.

## 실행

| step | 이름 | 내용 | 시간 |
|---|---|---|---|
| 0 | `step-list-parse` | `groupParagraphs`에 단계 목록(`kind: 'steps'`)과 하위 블록, `stripListMarker`가 들여쓰기·번호를 뗀다 | 08:18–08:23 |
| 1 | `step-list-render` | `ConceptList`가 `<ol start>`·하위 `<ul>`·항목 안 `<p>`를 그리고, 번호 항목마다 단계 그림 자리(`stepFiguresByConceptId`, 빈 객체) | 08:24–08:30 |
| 2 | `roles-anywhere-concept` | 개념 `identity-federation.iam-roles-anywhere`(문단 95개)와 문항 q742, `data-test.patch` | 10:13–10:16 |
| 3 | `roles-anywhere-step-figures` | `RolesAnywhereStepFigure` 19장, 문구 JSON `stepFigures`, 타입 `StepFigureText` | 10:16–10:26 |

step 0~1을 `--max-steps 2`로 돌려 결과를 본 뒤, 사용자가 이어서 하라고 해 step 2~3을 이어 돌렸다. 네 step 모두 `completed`이고 두 실행 로그 모두
재시도 줄이 없다.

- step 1은 계획 밖 파일 하나를 고쳤다. `registry.test.tsx`의 `vi.mock('./registry', …)` 팩토리에 `stepFiguresByConceptId: {}` 한 줄이다. 모듈 전체를 대체하는
  mock에 새 export가 없어 기존 테스트가 깨졌기 때문이고(step 1 summary), 단언은 그대로다. 받아들였다.
- step 2는 `data-test.patch`를 적용한 뒤 데이터 적용 전에 **정확히 넷**(개념 수, 개념 순서, 단계 목록 개념은 하나뿐, 번호 1~19)이 실패함을 확인했다.
- step 3의 summary: 좌표·라벨·곁말은 설계본 그대로이고 바꾼 것이 없다.

## 승인본 대조 (검증자가 직접)

- **데이터**: `verify-content.mjs` — 「데이터 세 파일이 명세와 한 글자도 다르지 않다」. 새 개념은 `sts-assume-role` 바로 뒤, `parentId` `identity-federation.sts`, 문단 95개,
  q742는 문항 파일 끝이다.
- **그림**: 테스트와 별개로, 설계본(`tools/step-figures.mjs`)을 import하고 컴포넌트의 `layouts`·`nodeColors` 상수와 `identity-federation.json`의 `stepFigures`를
  읽어 대조하는 일회성 스크립트(저장소 밖)를 돌렸다 — 「19장 — 좌표·색·라벨·그룹·곁말·접근성 이름이 설계본과 같다」. 틀 수정 뒤에도 같다.
- **기존 개념 영향**: 새 파서는 `N. `와 앞 공백을 새로 해석한다. 착수 시점 개념 635개의 문단 1,396개와 요약 가운데 그렇게 시작하는 것은 0개라, 다른 개념의
  블록은 바뀌지 않는다. 데이터 테스트 「번호 목록과 들여쓴 문단이 있는 개념은 이 하나뿐이다」가 앞으로도 이를 막는다.

## AC 재실행 (검증자가 직접, 틀 수정 뒤)

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과(경고 0) |
| `npm test` | 103개 파일, **2695개** 통과(착수 2595개, +100) |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node scripts/sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `node phases/65-roles-anywhere-steps/verify-content.mjs` | 기준 `29a05f1` — 새 개념 1개, 새 문항 1개. 개념 636줄. 데이터 세 파일이 명세와 한 글자도 다르지 않다 |
| `node phases/65-roles-anywhere-steps/tools/check-steps.mjs` | 문제 없음 — 단계 그림 19장(노드 43·경로 27) |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | 교차 없음 — 세로·가로 노드 345개·경로 268개(phase 64 끝과 같다) |

테스트 증가분은 step 0 +9, step 1 +7, step 2 +4, step 3 +79(그림 테스트 78, `visuals.test.ts` 1), 틀 수정 +1이다.
`check-path-crossings.mjs`는 파일 이름이 `*Diagram.tsx`인 컴포넌트만 읽어 새 컴포넌트를 세지 않는다(step 3 summary와 같다). 단계 그림의 교차·경계·겹침은
`check-steps.mjs`와 그림 테스트, 그리고 실측이 봤다.

## 실측과 그 뒤의 수정

[실측 기록](measurements.md). 그림 안은 처음부터 문제가 없었고, 틀 자리 두 가지가 UI_GUIDE 「단계 그림」과 달라 고쳤다(`7d5c342`).

- 640px 미만에서 딸린 무리의 `max-sm:[&_figure]:-ml-[37px]`가 목록 안의 틀까지 끌어내 틀이 항목 글보다 37px 왼쪽에서 시작했다 → `!ml-0`.
- 768px 이상에서 틀이 항목 폭 627px까지 퍼지고 그림은 288px에서 멈췄다 → `max-w-[290px]`.

테스트를 먼저 고쳐(그림 테스트의 틀 클래스 단언 19개 + 새 단언 1개, 20개 실패 확인) 컴포넌트를 고쳤고, UI_GUIDE 「단계 그림」에 두 클래스와 이유를 적었다.
수정 커밋 메시지의 「1024px에서 틀 511px」는 축소된 스크린샷의 픽셀을 읽은 잘못이고, 실측은 「틀 627px, 빈 곳 337px」이다. 이 보고와 함께 UI_GUIDE·테스트
주석의 같은 수치를 고쳤다.

## 남긴 것

- 처음 미리보기의 구간 버튼 도식(`tools/design-spec.mjs`)은 ADR-050 「남겨 둔 것」대로 구현하지 않았다.
- develop 병합과 배포는 하지 않았다. 사람이 판단한다.
