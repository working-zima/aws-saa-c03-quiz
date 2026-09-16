# CloudFormation·Service Catalog·Control Tower·RAM

`governance-iac` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 7개 · keep 7 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 4 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 7 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | cloudformation | 인프라 구성을 파일로 정의해 반복 배포하면 수동 구성의 실수를 줄이고 같은 환경을 다시 만들 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | cloudformation-drift-detection | CloudFormation 드리프트 감지는 스택이 만든 리소스가 템플릿과 달라졌는지만 보므로, 스택 밖 리소스까지 계정 전체의 구성 변경을 잡으려면 AWS Config를 써야 한다는 대상 범위 차이를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | service-catalog | 조직이 승인한 구성 중 하나를 골라 배포하게 하는 제품 카탈로그와 리소스 변경 이력을 기록하는 도구의 역할 차이를 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 4 | control-tower-landing-zone | Control Tower는 계정 구조·통제·중앙 로깅을 갖춘 다중 계정 기준 환경(랜딩 존)을 자동으로 세워, 계정이 늘어도 같은 통제를 손으로 반복하지 않게 한다는 역할을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | control-tower-controls | Control Tower의 사전 예방적 제어는 배포 시점에 규칙 위반 스택 작업을 거부해 리소스가 생기지 않게 하고, 탐지 제어는 만들어진 뒤 미준수를 찾아 보고할 뿐이라 배포 방지 요구에는 사전 예방적 제어가 맞음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | resource-access-manager | 다른 계정에 리소스를 공유하는 일과 사용자의 신원을 확인하는 인증은 서로 다른 요구임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 7 | workload-discovery | 넘겨받은 다중 계정·다중 리전 환경의 리소스와 그 관계를 파악하려면 Workload Discovery on AWS로 자동 탐색해 아키텍처 다이어그램을 만들며, 요청 경로를 추적하는 X-Ray는 리소스 지도를 만들지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
