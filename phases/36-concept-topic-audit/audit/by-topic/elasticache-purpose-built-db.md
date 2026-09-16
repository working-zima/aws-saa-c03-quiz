# ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream

`elasticache-purpose-built-db` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 14개 · keep 14 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 8 · false 6 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 14 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | elasticache | 반복 조회 결과를 캐시에 두면 읽기 지연과 데이터베이스 부하를 줄일 수 있지만 결과가 자주 바뀌면 이점이 줄어드는 이유를 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 2 | elasticache-redis-vs-memcached | ElastiCache 엔진을 고를 때 잠시 재사용할 조회 결과와 유지해야 할 상태를 구분해 Redis와 Memcached의 지속성 차이를 적용한다. | keep | — | true | (현재) | — | 2 | ① |
| 3 | elasticache-multi-az-failover | ElastiCache에서 사람의 개입 없이 노드 장애를 넘기려면 다른 가용 영역의 복제본을 자동 승격하는 다중 AZ 구성을 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | elasticache-global-datastore | ElastiCache 글로벌 데이터스토어의 리전 간 복제로 캐시 계층의 원거리 접근과 리전 장애 대비를 함께 다루는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | cache-requires-application-change | 캐시를 먼저 조회하는 흐름을 애플리케이션에 추가해야 효과가 생기므로 코드 변경 허용 여부가 읽기 확장 수단을 가르는 기준임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 6 | elasticache-not-a-durable-store | 빠른 재조회를 위한 캐시와 처리 결과를 지속적으로 보관할 데이터베이스는 서로 다른 역할임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 7 | dax-dynamodb-only | DAX의 적용 대상은 DynamoDB로 한정되므로 RDS 읽기 부하용 캐시와 구분해 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | dax-encryption-at-rest | DAX의 저장 중 암호화는 생성 시점의 선택이므로 기존 클러스터를 암호화하려면 새 클러스터로 이전해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | documentdb | MongoDB 애플리케이션을 크게 바꾸지 않으면서 운영을 맡기려면 호환성을 갖춘 DocumentDB와 다른 NoSQL·직접 설치 구성을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | documentdb-global-cluster | DocumentDB의 리전 전체 중단에 대비하려면 보조 리전을 승격하는 글로벌 클러스터와 단일 리전 복제·스냅샷 복원의 차이를 이해해야 한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | neptune | 개체 자체보다 개체 사이의 연결을 따라가며 질의하는 것이 핵심인 데이터에는 그래프 데이터베이스가 필요한 이유를 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 12 | neptune-streams | Neptune 그래프의 변경을 후속 처리로 전달할 때 내장 Streams를 사용하면 별도 스트림 구성의 운영 부담을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | qldb | 데이터 변경 이력 자체가 증거가 되어야 할 때 기록의 불변성과 위변조 검증을 함께 제공하는 원장 데이터베이스가 필요한 이유를 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 14 | timestream | 시간이 붙은 데이터를 저장·질의하는 목적과 변경 이력의 불변성·위변조 검증을 요구하는 목적은 서로 다름을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
