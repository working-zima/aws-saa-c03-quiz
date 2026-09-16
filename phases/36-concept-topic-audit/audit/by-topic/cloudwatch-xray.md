# CloudWatch·X-Ray·Performance Insights·Managed Grafana

`cloudwatch-xray` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 11개 · keep 10 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 6 · false 5 · duplicateOf 1
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 9 · 2A 0 · 2B 1 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | cloudwatch | 리소스와 애플리케이션의 상태를 모니터링하고 로그로 동작을 살펴보는 관측 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | cloudwatch-network-monitor | AWS와 온프레미스 사이 연결의 패킷 손실과 왕복 시간을 재려면 프로브를 직접 만들지 않고 AWS가 관리하는 CloudWatch Network Monitor로 측정해 대시보드·경보로 넘길 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | cloudwatch-container-insights | Container Insights는 여러 클러스터에서 실행되는 컨테이너 워크로드의 지표·로그·성능을 관측하는 기능이며, 클러스터를 한곳에 등록해 목록으로 관리하는 요구는 채우지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | log-analysis-options | 간헐적 대용량 로그 조회와 실시간 모니터링을 구분해 저장·분석 도구의 상시 운영 부담을 판단할 수 있음을 이해한다. | keep | — | false | (현재) | emr-glue-athena.log-storage-s3-athena | 1 | 2B |
| 5 | cloudwatch-agent-memory-metric | EC2의 메모리 사용률은 기본 지표로 올라오지 않아 CloudWatch 에이전트를 설치해 사용자 지정 지표로 수집해야 하며, 그 뒤에야 경보나 조정 정책의 기준으로 쓸 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | ec2-detailed-monitoring | EC2 지표는 기본 5분 간격이고 상세 모니터링을 켜야 1분 간격이 되므로, 짧은 급증을 봐야 하는 요구는 로그 분석 파이프라인이 아니라 지표 수집 간격 설정으로 채운다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | cloudwatch-alarm-state-change-event | CloudWatch 알람의 상태 변경이 이벤트로 나가므로 EventBridge 규칙이 이를 받아 조치 서비스를 직접 대상으로 호출하면 중계 함수 없이 자동 대응을 붙일 수 있음을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
| 8 | x-ray | 요청이 여러 서비스를 거쳐 처리되는 경로를 추적하고 시각화하면 복잡한 시스템의 요청 흐름을 파악할 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 9 | performance-insight | 데이터베이스가 내는 성능을 관찰하는 모니터링 도구의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 10 | performance-insights-rightsizing | DB 인스턴스 크기를 올리거나 내릴 근거는 DB 부하·상위 SQL·대기·CPU를 보여 주는 Performance Insights에서 얻으며, 요청 경로 추적이나 직접 만든 로그 분석은 데이터베이스 내부 부하를 보여 주지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | amazon-managed-grafana | 시간에 따라 변하는 지표를 보는 운영 대시보드와 여러 저장소의 분석 결과를 보여 주는 비즈니스 인텔리전스 보고서는 목적이 다름을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
