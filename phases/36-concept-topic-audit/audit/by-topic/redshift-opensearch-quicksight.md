# Redshift·Redshift Spectrum·OpenSearch·QuickSight

`redshift-opensearch-quicksight` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 11개 · keep 11 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 7 · false 4 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 11 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | redshift | 대규모 데이터를 빠르게 분석하기 위한 데이터베이스 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | redshift-spectrum | Redshift Spectrum은 웨어하우스에 적재하지 않은 S3 데이터를 그 자리에서 함께 조회하도록 대상을 넓히는 기능이며 동시 쿼리 성능이나 스트리밍 처리 수단이 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | oltp-vs-olap | 짧은 트랜잭션을 많이 처리하는 OLTP와 쌓인 데이터를 분석하는 OLAP를 구분해 관계형 데이터베이스와 데이터 웨어하우스를 고르고, 둘이 섞인 경우 읽기 부하를 복제본으로 떼어 낸다는 판단을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 4 | athena-vs-redshift-workload | SQL 분석 도구를 고를 때 데이터 성격보다 쿼리가 들어오는 방식을 기준으로, 가끔 하는 임시 분석은 쓴 만큼 내는 서버리스 질의로, 성능이 일정해야 하는 반복 분석은 전용 자원의 웨어하우스로 나눈다는 것을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 5 | redshift-hot-cold-split | 조회가 몰리는 데이터만 Redshift에 적재하고 나머지는 S3에 둔 채 Spectrum으로 필요할 때 읽으면 성능을 지키면서 웨어하우스 비용을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | redshift-concurrency-scaling | Redshift 동시성 확장은 동시 쿼리 급증 때 임시 용량을 자동으로 붙여 클러스터 크기를 사람이 조작하지 않고 가용성에 영향 없이 성능을 올린다는 점에서 크기 조정과 갈린다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | redshift-copy-from-s3 | 데이터 웨어하우스에 정기적으로 대량 적재할 때는 S3로 내보낸 파일을 COPY 명령으로 병렬 적재하는 것이 원본 부하와 유지할 코드를 가장 줄이는 경로임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | opensearch-text-search | OpenSearch는 들어온 데이터를 거의 실시간으로 색인해 텍스트 검색·분석을 제공하므로, 고급 텍스트 검색이 요구되면 이를 지원하지 않는 DynamoDB나 배치 적재 구성 대신 고른다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | quicksight | QuickSight가 저장이나 질의 자체보다 보고서·대시보드 시각화를 맡고 Athena의 질의 결과를 활용하는 위치를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | quicksight-ml-forecast | QuickSight에 내장된 머신러닝 예측으로 대시보드 안에서 시계열 추세를 만들 수 있어, 예측이 필요하다는 이유만으로 모델 학습 서비스를 붙일 필요가 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | dynamodb-to-s3-analytics | 운영 테이블에서 지우는 과거 데이터를 변경 캡처로 S3에 쌓아 두면 데이터 웨어하우스를 유지하지 않고 서버리스 질의와 시각화로 과거 보고를 만들 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
