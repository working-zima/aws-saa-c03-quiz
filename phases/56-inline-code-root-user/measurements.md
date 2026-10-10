# phase 56 실측 — 본문 속 코드 표기와 루트 사용자 개념

2026-10-11, `feat-56-inline-code-root-user` `7ab333b`(step 1)의 `npm run build` 결과를 `vite preview`로 띄우고 Chrome에서 쟀다. 방식은
phase 53~55 `measurements.md`와 같다 — 같은 출처 iframe(320·390·1280px), 39개 주제 × 세 폭 = 117회.

## 코드 표기와 무리

| 뷰포트 | `<code>` | 백틱이 남은 개념 | 코드가 문단 밖으로 나간 곳 | 가로 넘침 | 무리 / 딸린 개념 / h3 |
|---|---|---|---|---|---|
| 320px | 24 | 0 | 0 | 0 (39개 주제 모두) | 120 / 366 / 366 |
| 390px | 24 | 0 | 0 | 0 | 120 / 366 / 366 |
| 1280px | 24 | 0 | 0 | 0 | 120 / 366 / 366 |

- `<code>`의 클래스는 모두 `font-mono text-[0.9em]` 하나뿐이다. 계산값은 글자 13.5px(본문 15px의 0.9배), 색 `rgb(212, 212, 212)`(본문
  `text-neutral-300`을 물려받음), 배경 투명이다.
- 코드가 있는 주제 열: `lambda` 3, `emr-glue-athena` 2, `kinesis-streaming` 1, `cloudwatch-xray` 1, `secrets-encryption` 3, `waf-shield` 3,
  `iam-permissions` 5, `organizations-cloudtrail-config` 4, `cost-management` 1, `systems-manager` 1.
- 가장 긴 `ProvisionedThroughputExceededException`(kinesis-streaming)은 320px에서 한 줄에 들어가지 않아 `break-anywhere`로 끊긴다. 백틱
  기호 그대로일 때와 같은 동작이다.
- 약어 툴팁이 있는 주제(`vpc-networking` 등)에는 코드 표기가 없다. 백틱 안 약어를 건너뛰는 규칙은 단위 테스트가 본다.

## 루트 사용자 개념

`iam-permissions.root-user-cannot-be-disabled`는 `iam-permissions.root-user` 무리 안에 그대로 있고(h3 「비활성화할 수 없는 루트 사용자」), 요약
하나와 문단 넷이 나온다. 390px에서 셋째 문단의 「루트 비밀번호·액세스 키」가 가운뎃점 앞에서 줄이 바뀌어 다음 줄이 `·`로 시작한다.
가운뎃점은 줄바꿈 기회가 아니어서 `break-anywhere`가 끊은 것이고, phase 48 실측에 적은 비교표의 가운뎃점 줄바꿈과 같은 현상이다.

## 콘솔

주제 목록과 39개 주제를 세 폭으로 오가는 동안 오류·예외 0건.
