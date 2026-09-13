# CloudFormation·Service Catalog·Control Tower·RAM

`governance-iac` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 7개 · keep 7 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 7 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q295 | cloudformation | keep | — | yes | (현재) | (현재) | false | CloudFormation은 인프라를 템플릿 파일로 정의해 같은 구성을 반복해서 자동 배포하는 서비스다. |
| q296 | service-catalog | keep | — | yes | (현재) | (현재) | false | Service Catalog는 조직이 승인한 구성을 제품으로 등록하고 사용자가 그중에서 선택해 배포하게 한다. |
| q297 | control-tower-landing-zone | keep | — | yes | (현재) | (현재) | false | Control Tower의 랜딩 존은 다중 계정의 계정 구조·통제·중앙 로깅을 갖춘 기준 환경을 자동 구성해 반복 설정을 줄인다. |
| q298 | resource-access-manager | keep | — | yes | (현재) | (현재) | false | RAM은 서브넷이나 Transit Gateway 같은 기존 리소스를 다른 AWS 계정과 공유하는 서비스다. |
| q299 | workload-discovery | keep | — | yes | (현재) | (현재) | false | Workload Discovery on AWS는 여러 계정과 리전의 리소스를 자동 탐색해 관계가 드러나는 아키텍처 다이어그램을 만든다. |
| q300 | control-tower-controls | keep | — | yes | (현재) | (현재) | false | Control Tower 사전 예방적 제어는 배포 시점에 템플릿을 평가해 미준수 스택 작업을 거부하며 탐지 제어는 생성 후의 위반을 찾는다. |
| q301 | cloudformation-drift-detection | keep | — | yes | (현재) | (현재) | false | CloudFormation 드리프트 감지는 스택으로 관리하는 리소스만 보므로 스택 밖까지 포함한 구성 변경 기록에는 AWS Config가 필요하다. |
