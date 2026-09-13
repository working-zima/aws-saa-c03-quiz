# CloudWatch·X-Ray·Performance Insights·Managed Grafana

`cloudwatch-xray` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 11개 · keep 9 · ambiguous 1 · move-recommended 1
- 이동 후보 비율 9.1% — q223
- conceptFit yes 10 · partial 1 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q126 | cloudwatch | keep | — | yes | (현재) | (현재) | false | AWS 리소스와 애플리케이션 전반을 지표와 로그로 관찰하는 서비스는 CloudWatch이고, 데이터베이스 성능·요청 경로·API 호출 기록은 각각 다른 서비스가 맡는다. |
| q223 | log-analysis-options | move-recommended | high | partial | emr-glue-athena | emr-glue-athena.log-storage-s3-athena | true | 대용량 로그를 가끔 분석할 때는 S3에 보관하고 조회한 만큼 과금하는 Athena를 사용해 상시 클러스터 운영 비용을 피한다. |
| q648 | x-ray | keep | — | yes | (현재) | (현재) | false | 요청 하나가 여러 구성 요소를 지나며 쓰는 시간과 경로를 추적해 보여 주는 서비스는 X-Ray다. |
| q649 | performance-insight | keep | — | yes | (현재) | (현재) | false | 데이터베이스가 내는 성능을 모니터링하는 서비스는 Performance Insights이고, 요청 경로·컨테이너·시계열 대시보드는 보는 대상이 다르다. |
| q650 | amazon-managed-grafana | keep | — | yes | (현재) | (현재) | false | Managed Grafana는 시계열 지표를 관찰하는 운영 대시보드 도구라 정형·비정형 데이터를 함께 분석하는 비즈니스 인텔리전스 보고서에는 맞지 않고, 그 일은 QuickSight가 맡는다. |
| q651 | cloudwatch-network-monitor | keep | — | yes | (현재) | (현재) | false | CloudWatch Network Monitor는 AWS가 관리하는 프로브로 온프레미스와 AWS 사이의 패킷 손실과 왕복 시간을 재므로 프로브를 직접 만들고 일정을 관리하지 않아도 된다. |
| q652 | cloudwatch-container-insights | keep | — | yes | (현재) | (현재) | false | Container Insights는 여러 클러스터의 지표·로그로 워크로드 상태를 보여 주는 관측 기능이라, 클러스터를 한곳에 등록해 목록으로 관리하는 요구는 해결하지 못한다. |
| q653 | performance-insights-rightsizing | keep | — | yes | (현재) | (현재) | false | Performance Insights는 DB 부하·상위 SQL·대기·CPU 사용률을 별도 파이프라인 없이 보여 줘 데이터베이스 인스턴스 크기를 올릴지 내릴지 판단하는 근거가 된다. |
| q654 | cloudwatch-agent-memory-metric | keep | — | yes | (현재) | (현재) | false | EC2 메모리 사용률은 CloudWatch에 기본으로 올라오지 않아 CloudWatch 에이전트로 사용자 지정 지표를 만든 뒤에야 그 지표에 대상 추적 정책을 걸 수 있다. |
| q655 | ec2-detailed-monitoring | keep | — | yes | (현재) | (현재) | false | EC2 지표는 기본 5분 간격이라 짧은 급증을 놓치고, 상세 모니터링을 켜면 1분 간격으로 올라온다. |
| q656 | cloudwatch-alarm-state-change-event | ambiguous | — | yes | (현재) | (현재) | false | CloudWatch 알람의 상태 변경은 EventBridge 이벤트로 전달되므로, 규칙이 그 이벤트를 잡아 조치 서비스를 대상으로 직접 호출하면 사이에 함수를 두지 않아도 된다. |
