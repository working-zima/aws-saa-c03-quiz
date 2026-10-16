# phase 61 검증 보고 — 나머지 도식 24장의 가로형 (ADR-048)

검증일 2026-10-16. 대상 `feat-61-wide-diagrams-rest` `22f818b`(설계 `886c21e` 위 step 0~23).

## 실행

24 step 모두 `--agent claude`로 실행했고 재시도는 0번이다. step 0~5(묶음 A)는 `--max-steps 6`으로 먼저 돌렸고, 사용자 요청으로 나머지 18개는
멈추지 않고 이어서 돌렸다. 09:23에 시작해 11:16에 끝났다(step 하나에 4~6분).

| 묶음 | step | 도식 |
|---|---|---|
| A VPC·보안 | 0~5 | VPC 범위 · NAT 수 · 피어링 규모 · 온프레미스 연결 경로 · SG/NACL 경계 · SG/NACL/WAF 층 |
| B 메시징·엣지·S3 | 6~10 | 메시징 전달 모양 · SNS 팬아웃 · SQS 메시지 흐름 · 엣지에서 오리진 · S3 클래스 분류 |
| C Route 53·백업 | 11~15 | 하이브리드 DNS · 별칭 레코드 · 상태 검사 응답 · 백업 흐름 · 재해 복구 방식 |
| D API·거버넌스·계정 | 16~23 | API 엔드포인트 경로 · API 통합 방식 · 상태 머신 · Map 상태 · 드리프트 범위 · 제어 시점 · Identity Center 접근 · SCP 범위 |

## AC 재실행 (검증자가 직접)

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과(경고 0) |
| `npm test` | 78개 파일, **1736개** 통과(설계 전 1439개, +297) |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `세로 노드 208개·경로 177개, 가로 노드 208개·경로 177개`, 교차 없음 |

교차 검사의 가로 수가 세로 수와 같아졌다. 경로가 있는 도식이 모두 가로형을 가졌다는 뜻이다(S3 분류는 경로가 없고 배열 이름이
`storageClasses`라 두 수 모두에 들지 않는다).

검증은 이 기기의 Node 24.19.0으로 했다(이 기기에는 18.17.1이 없다). 각 step의 summary도 같은 환경이다.

## 범위

설계 커밋 이후 바뀐 파일은 `src/components/diagrams/`의 도식 24장과 각 테스트, `phases/61-wide-diagrams-rest/index.json`, `phases/index.json`뿐이다.
`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·`useWideDiagram.ts`·데이터 JSON·시범 세 장은 그대로다.

## 코드 확인

- **좌표가 승인한 설계와 글자까지 같다.** 설계 스펙과 코드를 기계로 대조했다 — `viewBox` 24개, `wideNodes` 160줄과 `wideStorageClasses` 8줄,
  `widePaths` 140줄, `wideGroups` 70개. 어느 step도 출발점 좌표를 바꾸지 않았다(summary 24개 모두 「바꾼 값은 없다」).
- 판정은 `useWideDiagram()` 한 곳이고 도식 파일에 `768`이 없다. SVG는 하나이며 래퍼만 `w-full`로 바뀐다.
- JSX에 박혀 있던 세로형 그룹·곁말은 같은 좌표·같은 속성 순서의 배열로 옮겼다. step마다 원래 컴포넌트와 새 컴포넌트를 jsdom에서 나란히
  렌더해 `innerHTML`이 같음을 임시 테스트로 확인하고 지웠다.
- 세로형에만 맞는 위치 단언은 기존 `it`을 그대로 두고, 가로형 `describe` 안에서 step 문서의 대응 단언으로 바꿔 검사한다
  (예: 「두 리전을 세로로 쌓는다」 → 「나란하다」, 「아웃바운드 경로는 위로」 → 「온프레미스 쪽으로」).

## 브라우저 확인

[실측 기록](measurements.md)을 본다. 요약:

- **세로형은 develop과 같다.** 390px에서 27장 156개 상태의 `figure` HTML이 모두 같았다.
- 767px까지 세로형, 768px부터 가로형이다. 768·1024·1440px 값이 서로 같고, 가로 넘침은 어느 폭에서도 0이다.
- 실제 글꼴 여백은 모두 12 이상이다(가장 빠듯한 값 12.0, IAM Identity Center 접근의 `IAM 사용자`).
- 1440px의 모든 시나리오 상태에서 글자끼리, 글자와 다른 노드가 겹치지 않는다.
- 이 phase 24장의 데스크톱 표시 높이 합계는 12,301px → 7,931px(36%↓)이다.
- **실시간 전환**(phase 60이 재지 못한 것): 27장 모두 700 → 800 → 700px에서 세로 → 가로 → 세로로 바뀌고, 고른 시나리오·경로·캡션이 유지됐다.

## 남은 것

- 확인 문제 「개념 보기」 안의 도식은 따로 재지 않았다(폭은 개념 읽기와 같다).
- macOS 글꼴로는 재지 않았다. 여백이 가장 빠듯한 `IAM 사용자`(12.0)가 macOS에서 12 아래로 내려가는지 한 번 보면 된다.
- 병합과 push는 사람이 판단한다(CLAUDE.md).
