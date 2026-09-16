# DynamoDB

`dynamodb` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 18개 · keep 18 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 18 · false 0 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 18 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | dynamodb | DynamoDB를 선택할 때 관계형 데이터베이스와 다른 데이터 모델을 전제로 변경 추적과 읽기 캐시를 결합하는 기본 구성을 이해한다. | keep | — | true | (현재) | — | 3 | ① |
| 2 | dynamodb-single-digit-latency | DynamoDB의 규모 확장과 데이터 읽기 응답 시간 보장은 네트워크 전달 지연을 줄이는 것과 다른 요구를 해결함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | dynamodb-streams | DynamoDB의 변경을 후속 처리로 연결할 때 Streams와 Lambda로 충분한 요구와 추가 스트림 구성이 필요한 요구를 구분한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | dynamodb-streams-retention-24h | DynamoDB Streams의 변경 전달 기록은 24시간 뒤 사라지므로 장기간 보관할 감사 기록이나 필요한 복구 지점을 대신하지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | dynamodb-streams-batch-size | DynamoDB Streams 소비가 밀릴 때 호출당 배치 크기와 갱신 대상 테이블의 쓰기 용량을 살펴 실제 처리 병목을 조정해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | dynamodb-global-tables | DynamoDB 글로벌 테이블이 여러 리전에서 쓰기를 받으면서 변경을 복제하므로 다중 리전 기록과 짧은 데이터 손실 목표에 맞는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | dynamodb-ttl | DynamoDB에서 수명이 끝난 항목의 삭제는 TTL에 맡길 수 있으며 만료 삭제와 과거 상태 복원은 별도 기능으로 해결해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | dynamodb-ttl-deletion-delay | DynamoDB TTL의 만료 시각과 실제 삭제 완료 시각이 다르므로 삭제 지연을 허용하는 요구인지 먼저 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | dynamodb-global-secondary-index | DynamoDB GSI는 기본 키와 다른 속성으로 조회하는 요구를 해결하며 읽기 최신성이나 용량 부족을 해결하는 기능은 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | dynamodb-capacity-modes | DynamoDB의 프로비저닝·온디맨드 용량 모드를 수요 예측 가능성으로 선택하고 용량 한계와 예약 할인은 다른 문제임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | dynamodb-auto-scaling-target-utilization | DynamoDB의 프로비저닝된 읽기·쓰기 용량을 목표 활용률과 최소·최대 범위에 따라 자동으로 조절하는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | dynamodb-read-consistency | DynamoDB에서 최신 읽기를 보장하는 선택은 읽기 용량 비용과 맞바꾸는 것이며 스로틀링 해결과는 별개임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | dynamodb-s3-export-vs-streams | DynamoDB 데이터를 분석용으로 옮길 때 준실시간 변경 처리가 필요한지에 따라 Streams 경로와 기본 S3 내보내기를 구분한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | dynamodb-incremental-export | DynamoDB의 기존 데이터와 이후 추가 데이터를 함께 분석하려면 증분 내보내기를 활용해 별도 복사 파이프라인의 운영을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | dynamodb-export-no-read-capacity | DynamoDB에서 운영 읽기 처리량을 유지하며 데이터를 꺼내려면 테이블 스캔과 읽기 용량을 쓰지 않는 내보내기의 차이를 이해해야 한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | dynamodb-pitr | DynamoDB PITR의 복구 가능 기간은 최대 35일이므로 그보다 긴 보존 요구에는 별도의 백업 계획이 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | dynamodb-export-requires-pitr | DynamoDB의 S3 내보내기 실패를 판단할 때 원본 테이블의 PITR 활성화가 전제이며 대상 버킷과 리전을 일치시킬 필요는 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | dynamodb-item-size-limit | DynamoDB 항목의 크기 한계 때문에 큰 파일은 S3에 두고 테이블에는 위치와 메타데이터를 남겨야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
