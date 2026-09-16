# Redshift·Redshift Spectrum·OpenSearch·QuickSight

`redshift-opensearch-quicksight` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 11개 · keep 11 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 11 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q260 | redshift | keep | — | yes | (현재) | (현재) | false | 쌓인 대규모 데이터를 빠르게 분석하는 AWS 데이터베이스 서비스는 Redshift이고, OpenSearch는 검색, QuickSight는 시각화, Spectrum은 S3 조회를 넓히는 기능이다. |
| q261 | redshift-spectrum | keep | — | yes | (현재) | (현재) | false | Redshift Spectrum은 웨어하우스에 적재하지 않은 S3 데이터를 그 자리에서 Redshift 쿼리로 함께 조회하는 기능이다. |
| q262 | opensearch-text-search | keep | — | yes | (현재) | (현재) | false | 들어온 데이터를 거의 실시간으로 색인하고 텍스트로 질의하는 검색 워크로드는 OpenSearch Service가 맡고, DynamoDB는 고급 텍스트 검색을 지원하지 않는다. |
| q263 | quicksight | keep | — | yes | (현재) | (현재) | false | S3 저장·Athena 질의 구성에서 대시보드와 보고서를 만드는 시각화 조각은 Athena에 연결하는 QuickSight다. |
| q264 | oltp-vs-olap | keep | — | yes | (현재) | (현재) | false | 짧은 트랜잭션을 많이 처리하는 OLTP에는 관계형 데이터베이스 계열이 맞고, Redshift는 대규모 분석(OLAP)용 웨어하우스라 트랜잭션 저장소가 아니다. |
| q265 | athena-vs-redshift-workload | keep | — | yes | (현재) | (현재) | false | 필요할 때만 실행하는 Athena는 전용 자원이 없어 복잡한 쿼리가 몰릴 때 일정한 응답 시간을 약속하지 못하므로, 반복되는 고성능 분석에는 Redshift 클러스터가 맞는다. |
| q266 | redshift-hot-cold-split | keep | — | yes | (현재) | (현재) | false | 자주 조회하는 데이터만 Redshift에 적재하고 나머지는 S3에 둔 채 Spectrum으로 읽으면 성능을 지키면서 웨어하우스 비용을 줄인다. |
| q267 | quicksight-ml-forecast | keep | — | yes | (현재) | (현재) | false | QuickSight에는 머신러닝 예측이 내장돼 있어 모델 학습이나 인프라 관리 없이 대시보드 안에서 추세 예측을 만든다. |
| q268 | redshift-concurrency-scaling | keep | — | yes | (현재) | (현재) | false | Redshift 동시성 확장은 동시 쿼리 급증 때 임시 용량을 자동으로 붙였다 떼어, 사람의 개입이나 가용성 영향 없이 성능을 올린다. |
| q269 | redshift-copy-from-s3 | keep | — | yes | (현재) | (현재) | false | 웨어하우스로 정기 대량 적재할 때는 원본을 S3로 내보낸 뒤 COPY 명령으로 여러 노드가 병렬 적재하는 경로가 관리할 것이 가장 적다. |
| q270 | dynamodb-to-s3-analytics | keep | — | yes | (현재) | (현재) | false | 오래된 레코드를 지우는 운영 테이블의 이력은 변경분을 Kinesis Data Streams와 Firehose로 S3에 쌓고 Athena·QuickSight로 서버 없이 조회·시각화해 보고서를 만든다. |
