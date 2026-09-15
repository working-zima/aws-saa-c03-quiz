# GuardDuty·Macie·Inspector·Security Hub

`guardduty-macie-inspector` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 11개 · keep 9 · ambiguous 2 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 7 · false 4 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 9 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 2

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | guardduty | 공격 활동에서 의심스러운 징후를 찾아 알리는 위협 탐지와 공격에 직접 대응하는 조치는 서로 다른 역할임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | guardduty-db-login | 데이터베이스 로그인 이상을 찾아야 할 때는 AWS API 호출 기록과 탐지 범위가 다르므로 GuardDuty의 로그인 이상 탐지를 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | guardduty-finding-to-eventbridge | GuardDuty의 탐지 결과를 EventBridge 규칙으로 받아 격리 작업을 수행할 함수와 연결하면 탐지와 실제 대응을 분리해 자동화할 수 있음을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
| 4 | macie | Macie는 S3 데이터의 내용에서 보호할 민감 정보를 식별하는 서비스이므로 공격 활동이나 소프트웨어 취약점을 찾는 것과 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | macie-automated-discovery | Macie의 자동 민감 데이터 탐지를 켜면 검색 작업을 별도로 시작하는 로직 없이 지속적으로 검사하고 결과를 후속 처리에 연결할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | macie-delegated-administrator | 조직 전체의 Macie 민감 데이터 탐지를 모으려면 위임 관리자와 구성원 계정을 연결하고 검사할 리전마다 설정해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | macie-finding-to-eventbridge | Macie의 민감 데이터 발견을 보안 팀에 알리려면 탐지 유형을 거른 이벤트를 사람에게 전달할 대상으로 보내야 하며 큐 저장만으로는 부족함을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
| 8 | amazon-inspector | 운영체제와 애플리케이션의 취약점을 찾아내는 검사와 패치를 적용해 원인을 고치는 조치는 서로 다른 역할임을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 9 | inspector-scans-ecr-images | ECR 이미지의 취약점을 찾는 검사 주체는 Inspector이며 발견과 관리자에게 알리는 구성을 역할별로 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | security-hub | 흩어진 보안 발견 사항을 모아 우선순위를 정하는 통합 화면은 개별 위협 탐지나 인스턴스 운영과 다른 역할임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 11 | security-service-lineup | 보안 문제 조사·취약점 탐지·중앙 규칙 관리·트래픽 차단은 서로 다른 일이므로 요구하는 보호 역할에 맞춰 도구를 골라야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
