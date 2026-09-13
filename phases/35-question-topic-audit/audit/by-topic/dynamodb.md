# DynamoDB

`dynamodb` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 20개 · keep 20 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 20 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q069 | dynamodb | keep | — | yes | (현재) | (현재) | false | DynamoDB는 행과 열 대신 키-값·문서 형태로 데이터를 다루는 NoSQL 서비스라 MySQL·PostgreSQL 같은 RDBMS를 제공하지 않는다. |
| q070 | dynamodb | keep | — | yes | (현재) | (현재) | false | DynamoDB Streams는 테이블 데이터에 생긴 변화를 실시간으로 추적해 전달하는 기능이다. |
| q071 | dynamodb | keep | — | yes | (현재) | (현재) | false | DAX는 DynamoDB와 호환되어 테이블에 곧바로 결합하는 캐시이고 특히 읽기 성능을 끌어올린다. |
| q186 | dynamodb-pitr | keep | — | yes | (현재) | (현재) | false | DynamoDB의 특정 시점 복구는 되돌릴 수 있는 범위에 상한이 있고 그 값이 35일이다. |
| q407 | dynamodb-single-digit-latency | keep | — | yes | (현재) | (현재) | false | DynamoDB는 규모가 얼마나 커지든 10밀리초 미만의 응답을 유지하는 분산 NoSQL 데이터베이스다. |
| q408 | dynamodb-streams | keep | — | yes | (현재) | (현재) | false | DynamoDB Streams가 변경을 캡처해 Lambda를 직접 부르면 스트림 서비스와 전송 서비스를 따로 세우지 않고 S3 적재가 끝난다. |
| q409 | dynamodb-global-tables | keep | — | yes | (현재) | (현재) | false | DynamoDB 글로벌 테이블은 여러 리전에서 동시에 쓰기를 받는 액티브-액티브 구성이고 복제 지연이 1초 미만이다. |
| q410 | dynamodb-ttl | keep | — | yes | (현재) | (현재) | false | TTL은 만료 시각이 담긴 속성을 지정해 두면 그 시각이 지난 항목을 알아서 지우므로 삭제 코드나 스케줄러가 필요 없다. |
| q411 | dynamodb-global-secondary-index | keep | — | yes | (현재) | (현재) | false | 전역 보조 인덱스는 대체 키를 정해 기본 키가 아닌 속성으로도 조회할 수 있게 해 주는 장치다. |
| q412 | dynamodb-capacity-modes | keep | — | yes | (현재) | (현재) | false | 프로비저닝 모드는 미리 정한 한도를 넘으면 요청을 제한하고, 온디맨드 모드는 용량 계획 없이 급증을 흡수한다. |
| q413 | dynamodb-auto-scaling-target-utilization | keep | — | yes | (현재) | (현재) | false | 프로비저닝된 용량에 오토 스케일링을 붙일 때 기준이 되는 목표 활용률의 권장값은 70%다. |
| q414 | dynamodb-read-consistency | keep | — | yes | (현재) | (현재) | false | 강력한 일관성 읽기는 최신 값을 보장받는 대신 읽기 용량을 더 써서 비용이 오르고, 용량이 모자라 제한되던 상태를 풀어 주지는 않는다. |
| q415 | dynamodb-s3-export-vs-streams | keep | — | yes | (현재) | (현재) | false | 장기 분석을 위해 테이블 데이터를 S3에 쌓는 일은 기본 기능인 S3 내보내기가 맡고, 스트림을 손으로 이어 붙이는 구성은 운영 부담이 늘어난다. |
| q416 | dynamodb-incremental-export | keep | — | yes | (현재) | (현재) | false | S3 내보내기를 증분 형태로 걸어 두면 지금 있는 데이터와 이후에 쌓이는 데이터를 이어서 분석에 쓸 수 있다. |
| q417 | dynamodb-export-no-read-capacity | keep | — | yes | (현재) | (현재) | false | S3 내보내기는 테이블을 스캔하지 않아 프로비저닝된 읽기 용량을 쓰지 않는 반면, 외부 도구의 직접 읽기는 스캔이 일어나 읽기 용량을 소모한다. |
| q418 | dynamodb-export-requires-pitr | keep | — | yes | (현재) | (현재) | false | 테이블을 S3로 내보내려면 그 테이블에 특정 시점 복구가 켜져 있어야 하고, 버킷이 다른 리전에 있어도 상관없다. |
| q419 | dynamodb-item-size-limit | keep | — | yes | (현재) | (현재) | false | DynamoDB 항목 하나는 400KB를 넘을 수 없어 이미지 같은 바이너리를 그대로 담지 못하므로, 파일은 S3에 두고 테이블에는 메타데이터만 남긴다. |
| q420 | dynamodb-ttl-deletion-delay | keep | — | yes | (현재) | (현재) | false | TTL로 만료된 항목은 대개 만료 시각으로부터 48시간 안에 지워지므로 삭제가 만료 시각과 동시에 일어나지 않는다. |
| q421 | dynamodb-streams-retention-24h | keep | — | yes | (현재) | (현재) | false | DynamoDB Streams는 레코드를 24시간만 보존하므로 며칠치 기록을 남겨야 하는 요구를 스트림으로 대신할 수 없다. |
| q422 | dynamodb-streams-batch-size | keep | — | yes | (현재) | (현재) | false | 스트림 소비의 배치 크기를 항목 크기에 맞춰 키우면 밀림이 줄고, 병목이 되는 용량은 원본이 아니라 갱신을 받는 대상 테이블의 쓰기 용량이다. |
