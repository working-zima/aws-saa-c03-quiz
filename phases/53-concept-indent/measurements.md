# phase 53 표본 실측 — 딸린 개념 들여쓰기

2026-10-10, `feat-53-concept-indent` `9dbe8ca`의 `npm run build` 결과를 `vite preview`로 띄우고 Chrome에서 쟀다.
폭은 같은 출처 iframe(320·390·1280px)으로 만들었다. 대상은 step 2가 `parentId`를 넣은 표본 5개 주제다.

## 무리와 제목

| 주제 | 무리 | 딸린 개념 | 개념 읽기 h3 | 기대(`hierarchy.json`) |
|---|---|---|---|---|
| `data-transfer-services` | 4 | 15 | 15 | 15 |
| `sqs-sns-eventbridge` | 4 | 25 | 25 | 25 |
| `vpc-networking` | 5 | 10 | 10 | 10 |
| `lambda` | 3 | 5 | 5 | 5 |
| `backup-disaster-recovery` | 1 | 7 | 7 | 7 |

세 폭 모두 같다. 확인 문제의 개념 펼치기(`vpc-networking` 첫 문항)에서는 h4 10·h5 10·무리 5였다.

## 무리와 글 폭

| 뷰포트 | 무리 왼쪽 | 세로선 | 안쪽 여백 | 글 폭 머리 / 딸린 개념 | 가로 넘침 |
|---|---|---|---|---|---|
| 320px | 20px | 1px `rgb(38, 38, 38)` | 16px | 280 / 263px | 0 (5개 주제 모두) |
| 390px | 20px | 같음 | 16px | 350 / 333px | 0 |
| 1280px | 256px | 같음 | 16px | 672 / 655px | 0 |

## 딸린 개념에 붙은 도식·비교표

모바일에서는 화면 끝까지 펼쳐지고(UI_GUIDE 「딸린 개념」의 `-37px`), 1280px에서는 무리 안쪽에 선다. 단어 중간 끊김은
표의 모든 칸 글자를 낱말마다 Range rect로 쟀다(줄 위치가 둘 이상이면 끊김).

| 개념 | 종류 | 320px 왼쪽·폭 | 320px SVG/표 | 390px 폭 | 390px SVG/표 | 1280px 왼쪽·폭 | 1280px SVG/표 | 끊김 |
|---|---|---|---|---|---|---|---|---|
| `sqs-visibility-timeout-vs-processing-time` | 도식 | 0 · 320 | 320 | 390 | 380 | 273 · 655 | 380 | — |
| `internet-gateway-is-not-per-az` | 도식 | 0 · 320 | 320 | 390 | 380 | 273 · 655 | 380 | — |
| `nat-gateway-count-by-environment` | 도식 | 0 · 320 | 320 | 390 | 380 | 273 · 655 | 380 | — |
| `vpc-peering-scaling-limit` | 도식 | 0 · 320 | 320 | 390 | 380 | 273 · 655 | 380 | — |
| `backup-audit-manager` | 도식 | 0 · 320 | 320 | 390 | 380 | 273 · 655 | 380 | — |
| `endpoint-pricing` | 표 | 0 · 320 | 288 | 390 | 358 | 273 · 655 | 621 | 0 |
| `s3-is-regional` | 표 | 0 · 320 | 288 | 390 | 358 | 273 · 655 | 621 | 0 |
| `privatelink-endpoint-service` | 표 | 0 · 320 | 288 | 390 | 358 | 273 · 655 | 621 | 0 |
| `backup-ec2-resource-assignment` | 표 | 0 · 320 | 288 | 390 | 358 | 273 · 655 | 621 | 0 |
| `organizations-backup-policy` | 표 | 0 · 320 | 288 | 390 | 358 | 273 · 655 | 621 | 0 |
| `backup-cross-account-copy` | 표 | 0 · 320 | 288 | 390 | 358 | 273 · 655 | 621 | 0 |

320px의 SVG 320px·표 288px는 UI_GUIDE 「도식」·「비교표」의 기존 실측과 같다. 머리나 홀로 선 개념에 붙은 도식·표
(`vpc-networking`의 `nat-instance`·`comparison`·`vpc-flow-logs` 등)도 320px에서 0 · 320, 표 288px로 바뀌지 않았다.

## 콘솔

다섯 주제와 확인 문제 화면을 다시 불러온 뒤 오류·예외 0건. (측정 도중 기록된 예외 5건은 측정 스크립트가 지운 iframe을 읽은
것이라 앱과 무관하다.)

## 눈으로 본 것

- 320px에서 세로선(`#262626`)은 보이지만 옅다. 무리를 가르는 일은 17px 들여쓰기가 주로 한다.
- 도식·표가 있는 자리는 `bg-panel` 띠가 화면 끝까지 펼쳐져 세로선이 그 자리에서 끊긴다(UI_GUIDE 그대로).
