# phase 60 검증 보고 — 가로형 도식 시범 3장 (ADR-047)

검증일 2026-10-15. 대상 `feat-60-wide-diagrams` `f73efb7`(설계 `999cf51` 위 step 0~4).

## 실행

| step | 이름 | 실행 | 결과 |
|---|---|---|---|
| 0 | wide-diagram-hook | codex | `useWideDiagram()`(`useSyncExternalStore`), 테스트 +7 |
| 1 | crossing-checker-wide | codex | 세로·가로 짝을 블록 단위로 따로 검사, 음성 시험 a·b·c 통과(고치기 전 b 실패 확인) |
| 2 | vpc-destination-wide | codex | 가로형 440×400, 출발점 좌표 변경 없음, 테스트 +11 |
| 3 | eventbridge-wide | Claude | 가로형 440×488, 출발점 좌표 변경 없음, 테스트 +16 |
| 4 | vpc-paths-wide | Claude | 가로형 440×640, 출발점 좌표 변경 없음, 테스트 +19 |

step 3에서 codex가 사용량 한도(「try again at Oct 16th, 2026 1:05 AM」)로 세 번 모두 즉시 끝났다. 작업 파일 변경은 없었다. 사용자 결정으로
step 3의 상태를 `pending`으로 되돌리고 같은 worktree에서 `--agent claude`로 step 3부터 다시 실행했다. 재시도 0.

## AC 재실행 (검증자가 직접)

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과(경고 0) |
| `npm test` | 78개 파일, **1439개** 통과(설계 전 1386개, +53) |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `세로 노드 208개·경로 177개, 가로 노드 48개·경로 37개`, 교차 없음 |

## 범위

설계 커밋 이후 바뀐 파일은 명세가 지정한 것뿐이다.

- `src/hooks/useWideDiagram.ts`·`.test.tsx` (새 파일)
- `src/components/diagrams/VpcDestinationDiagram.tsx`·`EventBridgeRoutingDiagram.tsx`·`VpcPathsDiagram.tsx`와 각 테스트
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`
- `phases/60-wide-diagrams/` 메타데이터, `phases/index.json`

`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·데이터 JSON·다른 도식은 그대로다. 기존 테스트의 `it`은 고치지 않았다.

## 코드 확인

- 가로형 좌표(`wideGroups`·`wideNodes`·`widePaths`)가 step 문서의 출발점과 글자 그대로 같다(세 도식 모두 변경 없음).
- 판정은 `useWideDiagram()` 한 곳이고 도식 파일에 `768`이 없다. SVG는 하나이며 래퍼만 `w-full`로 바뀐다.
- 세로형 그룹을 JSX에서 같은 좌표의 배열로 옮겼다(EventBridge·VPC 경로). 선 모양은 `rx`·점선을 id로 정하는 표 하나를 두 배치가 함께 쓴다.

## 브라우저 확인

[실측 기록](measurements.md)을 본다. 요약:

- 768px 미만은 세로형, 768px 이상은 가로형(표시 638px, 노드 글자 14.5px)이다. 가로 넘침·라벨 넘침 0.
- 세로형은 develop과 `figure` HTML이 28개 상태 모두 같다.
- 높이: VPC 경로 1520→928px, EventBridge 1221.4→707.6px, VPC 목적지 1085.7→580px. 설계 미리보기의 값과 같다.
- 'VPC → S3' 등 시나리오를 실제 앱에서 눌러 경로가 미리보기와 같게 그려지는 것을 봤다.

## 남은 것

- 실시간 전환(창 폭 변경)은 이 환경에서 잴 수 없었다. 사용자가 창을 768px 위아래로 바꿔 확인하면 된다.
- 나머지 24장으로 넓힐지는 사용자가 정한다(ADR-047 「검토할 것으로 남긴 것」).
