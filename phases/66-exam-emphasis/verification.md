# phase 66 검증 보고

확인한 날: 2026-10-23. 설계 커밋 682d927, 마지막 step 커밋 bf35b3a(`feat-66-exam-emphasis`).

## step별 결과

| step | 결과 | 테스트를 먼저 적용했을 때 실패한 것 |
|---|---|---|
| 0 topic-importance | 별점 3→2 열넷, 2→3 하나(route53). ★★★ 15·★★☆ 23 | 별점 표 셋 |
| 1 core-emphasis | 개념 78개·문단 89개에 `**` 표지만 더함 | 문단을 `toBe`로 못박은 둘(Lambda 예약된 동시성, WAF) |
| 2 emphasis-weight | `<strong>`을 `font-semibold`로. 새 테스트 하나 | 새 테스트 하나(구현 전) |
| 3 vs-titles | 제목 43개를 「A vs B」로(id 그대로) | S3 스토리지 클래스 제목 목록 하나 |
| 4 vs-concepts | 개념 넷·문항 넷(q743~q746). 개념 640·문항 746 | 개념 수 둘·개념 순서 넷·목록 개념 목록 하나 |

## 설계와 달라진 것

- **step 2가 테스트 셋을 더 고쳤다.** `QuizRunner.test.tsx` 1곳과 `ConceptReadPage.test.tsx` 2곳이 강조 클래스를 `font-medium`으로 못박고 있었다. 설계 때 강조와
  `font-medium`이 한 줄에 함께 있는 곳만 찾아서 놓쳤다. 클래스 이름만 `font-semibold`로 맞췄고, 같은 이유로 `verify-content.mjs`의 허용 목록에 두 파일과 스크립트
  자신을 더했다. 굵기를 올린다는 결정을 그대로 따른 변경이라 받아들였다.
- step 3이 남긴 메모: 「REST API vs HTTP API의 통합 타임아웃」·「KMS 대칭 키 vs 비대칭 키의 자동 교체」는 끝의 「의 …」가 뒤쪽 대안에만 걸리는 것으로 읽힐
  여지가 있다. 보고 뒤 사용자가 다듬기로 해서 「통합 타임아웃: REST API vs HTTP API」, 「자동 키 교체: KMS 대칭 키 vs 비대칭 키」로 고쳤다(후속 커밋, ADR-051
  「기준 4」). 그 뒤로 `verify-content.mjs`는 이 두 줄에서 `changes.json`과 달라 실패한다 — 일회성 가드라 그대로 둔다.

## 다시 돌린 검증 (phase가 끝난 뒤)

- `npm test` 2698개 통과, `npm run build`·`npm run lint` 통과.
- `verify-content.mjs --through D` — 데이터 세 파일이 `changes.json`을 적용한 결과와 같다. `check-structure.mjs` 이상 없음, `sync-baseline.mjs --dry-run` 갱신할 것 없음.
- `coverage.mjs` — 640개념 100%, 문항 746개. `content-audit.mjs` — ⑤ 장문 4건, ③ 노출 수가 설계 전과 같다.

## 화면 확인 (Chrome, 창 폭 1072px, 개발 서버)

- 주제 목록: ★★★ 15, ★★☆ 23, 별점 없음 1. 가로 넘침 없음.
- RDS 주제: `<strong>`의 계산된 굵기 600. 「Multi AZ 배포는 고가용성, Read Replica는 읽기 확장」이 본문과 갈려 보인다. 새 딸린 개념 「다중 AZ 배포 vs 읽기 전용
  복제본」이 `features` 바로 아래에 들여써 보인다.
- 좁은 폭(320·390px) 실측은 하지 않았다. 바뀐 것은 글자 굵기·제목 글자·딸린 개념 넷이고 표·도식의 폭은 건드리지 않았다.
