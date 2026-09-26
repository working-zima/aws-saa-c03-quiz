# Phase 41 백업 시각 요소 검증 보고서

## 1. 한 줄 요약

`backup-disaster-recovery` 주제에 사용자가 가져온 백업·재해 복구 HTML의 내용을 phase 40과 같은 규약으로 옮겼다.
백업 흐름 도식, 비교표 셋, 재해 복구 선택 도식이다. 모든 검증 명령이 통과했고 320·390·1280px에서 가로 넘침이 없다.
세 step 모두 codex가 구현했다.

## 2. step별 결과

| step | 이름 | 코드 커밋 | 결과 |
|---|---|---|---|
| 0 | backup-flow | `50a1da9` | 노드 11·시나리오 7, `0 0 280 556`, 백업 주제 JSON과 로더 키 |
| 1 | backup-tables | `3d5a6de` | 표 셋(대상 지정·정책 범위·사본 목적지), 공용 표 컴포넌트 그대로 |
| 2 | dr-choice | `dabf532` | 노드 7·시나리오 3, `0 0 280 444`, 온프레미스 경로가 RTO 단을 건너뜀 |

step마다 AC를 자기 보고로 끝내지 않고 직접 다시 돌려 통과를 확인했고, JSON에 들어간 문구(캡션·노드·표 칸)를 읽어
근거 범위를 확인했다.

## 3. 옮기지 않은 것 (ADR-037 확장)

백업 볼트(데이터에 없다), 복구 시간 막대(RTO 예시값을 길이로 그리면 근거 없는 관계를 만든다), 대기 리전과 Elastic DR의
비용 비교(근거 없음), 비유와 이모지(사용자 결정), 표의 "새 계정은 빠지기 쉽다"(근거 없음, `—`로 둠).

## 4. 불변 조건

설계 커밋 `8391cd7`과 현재 `HEAD`를 비교했다.

| 조건 | 결과 |
|---|---|
| `DiagramFrame.tsx`·`ComparisonTableFigure.tsx` 불변 | 변경 없음 |
| `topics.json`·`questions.json` 불변 | 변경 없음 |
| VPC 주제 파일(`vpc-networking.json`·VPC 도식·`vpcTables.tsx`) 불변 | 변경 없음 |

## 5. 검증 명령과 결과

Node `v18.17.1`, phase 완료 상태(`cd6c497`)에서 직접 실행했고 모두 exit 0이다.

| 명령 | 결과 |
|---|---|
| `npm run lint` | exit 0 |
| `npm run build` | `✓ built` |
| `npm test` | `Test Files 50 passed (50)`, `Tests 930 passed (930)` |
| `node scripts/check-structure.mjs` | `✓ 구조 이상 없음` |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `✓ 교차 없음 — 노드 140개, 경로 121개` |

## 6. 브라우저 실측

`measurements.md`에 있다. 가로 넘침 없음, 표시 폭·배율이 기존 도식과 같음, 모든 캡션 2줄 이하, 백업 주제에 약어 버튼 없음.
`docs/UI_GUIDE.md` 「도식」의 실측 문장을 열다섯 장·비교표 여덟 기준으로 고쳤다.

## 7. 아직 하지 않은 것

`push`와 `main` 릴리스를 하지 않았다.
