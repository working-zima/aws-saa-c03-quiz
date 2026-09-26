# Phase 40 VPC 시각 요소 검증 보고서

## 1. 한 줄 요약

`vpc-networking` 주제에 사용자가 가져온 HTML의 내용을 이 앱의 규약으로 옮겼다. 경로 지도 확장(시나리오 7→11),
새 도식 넷(목적지별 흐름도·존재 단위·NAT 개수 실험·피어링 비교), 비교표 다섯, 약어 툴팁 넷이다.
모든 검증 명령이 통과했고 320·390·1280px에서 가로 넘침이 없다. 결정은 ADR-037에 있다.

## 2. step별 결과

| step | 이름 | 코드 커밋 | 구현 | 결과 |
|---|---|---|---|---|
| 0 | visual-slots | `7ce8c60` | codex | 타입·빈 JSON·로더·근거 id 검사, 한 개념에 여러 도식 |
| 1 | paths-extension | `b28d079` | codex | 지도 문구를 JSON으로, 시나리오 11·노드 19, `0 0 280 1120` |
| 2 | destination-tree | `6328033` | codex | 목적지 넷·두 줄 노드 열둘, `0 0 280 800` |
| 3 | resource-scope | `1ad6db9` | Claude | 정적 도식, 그룹 8·노드 6, `0 0 280 372` |
| 4 | nat-count | `f0f9fac` | Claude | 가용 영역 셋을 행으로, 시나리오 넷, `0 0 280 424` |
| 5 | peering-scale | `199d5ee` | Claude | `src/lib/peering.ts`, VPC 3·6·10, `0 0 280 440` |
| 6 | comparison-tables | `0b9cc7d` | Claude | `ComparisonTableFigure`와 표 다섯, 모두 3열 |
| 7 | glossary-tooltip | `f717dc0` | Claude | `src/lib/glossary.ts`, `GlossaryTerm`, 약어 넷 |

step마다 AC(`build`·`lint`·`test`·`check-structure`·`check-path-crossings`)를 자기 보고로 끝내지 않고 직접 다시 돌려
통과를 확인했고, JSON에 들어간 문구를 읽어 근거 범위를 확인했다.

## 3. 구현 주체가 바뀐 경위

step 3의 첫 실행(2026-09-26 11:05)이 codex 사용량 한도로 세 번 모두 곧바로 끝났다. 코드 커밋은 없었고 실패 기록 커밋
`1ba1995`만 생겨 `git revert`(`3187193`)로 되돌렸다. 한도 해제(15:44)를 기다리지 않고 **사용자 결정으로** step 3~7을
`--agent claude`로 실행했다. step 문서는 자기완결적이라 명세는 같다.

## 4. 명세와 어긋난 것

- **타입에 선택 필드 `notes`가 더해졌다**(step 4). step 0은 필드를 바꾸지 말라 했지만, 기존 필드는 그대로이고
  곁말(서브넷 이름·`장애`)을 담는 선택 필드 추가뿐이라 받아들였다.
- **캡션 일부가 두 줄을 넘었다.** 320px에서 흐름도 최대 4줄, 피어링 최대 4줄, NAT 한 개 3줄. 아래 8에서 고쳤다.
- 표의 NAT 게이트웨이 쪽 두 칸("인스턴스 사양에 묶이지 않는다", "사람이 떠안지 않는다")은 본문의 "관리형인 NAT
  게이트웨이와 달리"에서 끌어낸 대비다. 근거 범위로 판단했다.

## 5. 불변 조건

설계 커밋 `6e39174`와 현재 `HEAD`를 비교했다.

| 조건 | 결과 |
|---|---|
| `DiagramFrame.tsx` 불변 | 변경 없음 |
| `src/data/topics.json`·`questions.json` 불변 | 변경 없음 |
| 다른 주제의 도식 여덟 장 불변 | 변경 없음(Edge·Hybrid·Messaging·S3Class·SgNacl·EventBridge·SnsFanout·SqsMessageLife) |
| 교차 검사기 불변 | 변경 없음 |
| 약어 툴팁은 VPC 주제만 | 다른 주제는 `visualsByTopicId`에 키가 없어 렌더 불변(테스트로 확인) |

## 6. 검증 명령과 결과

Node `v18.17.1`, phase 완료 상태(`f06bb23`)에서 직접 실행했고 모두 exit 0이다.

| 명령 | 결과 |
|---|---|
| `npm run lint` | exit 0 |
| `npm run build` | `✓ built` |
| `npm test` | `Test Files 47 passed (47)`, `Tests 877 passed (877)` |
| `node scripts/check-structure.mjs` | `✓ 구조 이상 없음` |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `✓ 교차 없음 — 노드 122개, 경로 107개` |

## 7. 브라우저 실측

`measurements.md`에 있다. 가로 넘침 없음, 도식 표시 폭·배율이 phase 38·39와 같음, 버튼 최소 44px, 약어 툴팁이
320px에서 8px 안쪽에 붙잡힘. `docs/UI_GUIDE.md` 「도식」의 실측 문장을 열세 장·비교표 기준으로 고쳤다.

## 8. 완료 뒤 고친 것 (사용자 승인)

- **캡션 길이**: 위 4의 두 번째 항목을 고쳤다. 모든 시나리오 캡션이 320px에서 2줄 이하다.
- **비교표 열 폭**: `ComparisonTable`에 선택 필드 `columnWidths`를 더하고 `colgroup`으로 나눴다. 테스트를 먼저 더해
  실패(6건)를 확인한 뒤 구현했다. 320px에서 가장 긴 표의 높이가 623 → 519px.
- 고친 뒤 `lint`·`build`·`test`(883)·`check-structure`·교차 검사(0건)가 통과했다. 실측은 `measurements.md` 「완료 뒤 고친 둘」.

## 9. 아직 하지 않은 것

`push`와 `main` 릴리스를 하지 않았다.
