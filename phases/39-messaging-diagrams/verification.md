# Phase 39 메시징 도식 검증 보고서

## 1. 한 줄 요약

`sqs-sns-eventbridge` 주제에 도식 네 장이 들어갔다. 코드 변경은 새 도식 컴포넌트 넷, 그 테스트 넷,
`registry.ts`의 여덟 줄뿐이다. 모든 검증 명령이 통과했고, 320·390·1280px 브라우저 실측에서 가로
넘침이 없었으며 표시 폭·배율·라벨 크기가 phase 38과 같았다.

## 2. step별 결과

| step | 이름 | 코드 커밋 | 앵커 개념 | `viewBox` | 노드 | 시나리오 |
|---|---|---|---|---|---|---|
| 0 | messaging-shapes | `87eb27d` | `sqs-sns-eventbridge.sqs` | `0 0 280 592` | 14 | 5 |
| 1 | eventbridge-routing | `87c0d24` | `sqs-sns-eventbridge.eventbridge` | `0 0 280 900` | 17 | 7 |
| 2 | sns-fanout | `e58c2cb` | `sqs-sns-eventbridge.sns-sqs-fanout-per-consumer` | `0 0 280 504` | 10 | 3 |
| 3 | sqs-message-life | `90c6a81` | `sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time` | `0 0 280 396` | 7 | 4 |

`viewBox`와 노드·시나리오 수는 브라우저에서 렌더된 DOM을 직접 읽은 값이다(`measurements.md` 「도식별」).
네 장의 `viewBox` 높이 합은 2392, 390px에서 figure 높이 합은 4409px다.

step별 AC(`build`·`lint`·`test`·`check-structure`·`check-path-crossings`)는 codex의 자기 보고로
끝내지 않고 각 step 직후에 직접 다시 돌려 통과를 확인했다.

## 3. step 3의 중단과 재실행

step 3의 첫 실행(2026-09-25)은 codex 사용량 한도로 세 번 모두 비정상 종료했다(`step3-output.json`의
stderr: `You've hit your usage limit`). 실패한 실행이 남긴 부분 코드가 `0f36b2b`·`6073a2f`로 커밋됐다.

부분 코드는 AC를 통과했지만 끊긴 세션의 산출물이라 명세 준수를 보증할 수 없었다. 그래서 한도가 풀린
뒤 두 커밋을 `git revert`로 되돌리고(`dd6ec93`·`5ba75d7`) step 3을 처음부터 다시 실행했다
(2026-09-26, `90c6a81`). 히스토리를 지우지 않았으므로 부분 코드는 `0f36b2b`에 남아 있다.

## 4. 불변 조건

develop 분기점 `15fe9da`와 현재 `HEAD`를 비교했다.

| 조건 | 결과 | 확인 방법 |
|---|---|---|
| `src/` 변경은 도식 넷·테스트 넷·`registry.ts`뿐 | 9개 파일, 1326줄 추가, 삭제 0 | `git diff --stat 15fe9da..HEAD -- src docs scripts` |
| `registry.ts`는 step마다 import 한 줄·매핑 한 줄 | 8줄 추가(import 4, 매핑 4) | `git diff 15fe9da..HEAD -- src/components/diagrams/registry.ts` |
| `DiagramFrame.tsx` 불변 | 변경 없음 | `git diff 15fe9da..HEAD --name-only -- src/components/diagrams/DiagramFrame.tsx` |
| `src/data/` 학습 JSON 불변 | 변경 없음 | `git diff 15fe9da..HEAD --name-only -- src/data` |
| `src/lib/`·`scripts/` 불변 | 변경 없음 | `git diff 15fe9da..HEAD --name-only -- src/lib scripts` |
| 새 ADR 없음 | `docs/ADR.md` 변경 없음 | 위 `--stat`에 `docs/` 없음(문서 변경은 이 보고서와 함께 커밋) |

## 5. 검증 명령과 결과

실행 환경은 `node --version` → `v18.17.1`, `npm --version` → `10.2.1`이다. 2026-09-26에 phase 완료
상태(`8bdf6e5`)에서 직접 실행했고 모두 exit 0이다.

| 명령 | 결과 |
|---|---|
| `npm run lint` | exit 0 (경고 0) |
| `npm run build` | `✓ built in 887ms` |
| `npm test` | `Test Files 37 passed (37)`, `Tests 732 passed (732)` |
| `node scripts/check-structure.mjs` | `✓ 구조 이상 없음` |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `✓ 교차 없음 — 노드 91개, 경로 89개` |

빌드는 청크가 500 kB를 넘는다는 기존 경고를 출력했다. 이번 phase에서 해당 설정을 바꾸지 않았다.

## 6. 브라우저 실측

`measurements.md`에 있다. 요점만 옮긴다.

- 네 장 모두 320·390·1280px에서 가로 넘침 없음, 버튼 최소 높이 44px.
- SVG 표시 폭 320/380/380px, 노드 라벨 11.43/13.57/13.57px — phase 38 「전 도식 공통」과 같다.
- step 1~3의 캡션 열넷은 모두 2줄 이하이고 `figcaption` 높이는 모든 시나리오에서 96px다.
- 가장 빠듯한 라벨은 step 0의 `broker`(여유 24.9)이고, step 1~3에서는 `VPC 연결 Lambda`(25.8)다.

`docs/UI_GUIDE.md` 「도식」의 "다섯 도식 모두…" 문장을 아홉 장 기준으로 고치고 이 기록을 가리키게 했다.

## 7. 아직 하지 않은 것

- `push`와 `main` 릴리스를 하지 않았다. 사람이 판단할 일이다.

## 8. 완료 뒤 반영한 것 — `외부 SaaS` 경로

step 0 도식의 `EventBridge` 시나리오에서 `외부 SaaS`가 선 없이 떠 보였다. 사용자 승인(2026-09-26)으로
`saas-bus` 경로를 더했다. 테스트를 먼저 바꿔 EventBridge 경우만 실패함을 확인한 뒤 구현했다.
반영 뒤에도 `lint`·`build`·`test`(732)·`check-structure`가 통과했고, 교차 검사는 노드 91개·경로 90개에서
0건이다. 자세한 것은 `measurements.md` 「고칠 후보 하나」.
