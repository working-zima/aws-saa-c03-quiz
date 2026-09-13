# ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream

`elasticache-purpose-built-db` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 16 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q072 | elasticache | keep | — | yes | (현재) | (현재) | false | ElastiCache는 반복 조회되는 데이터를 대신 돌려주어 읽기 속도를 올리고 데이터베이스가 받는 조회 부하를 함께 줄이는 캐시다. |
| q073 | elasticache | keep | — | yes | (현재) | (현재) | false | 캐시의 값어치는 담아 둔 사본을 몇 번 다시 쓰느냐에서 나오므로, 조회할 때마다 결과가 달라지는 데이터는 캐시에 맞지 않는다. |
| q185 | documentdb | keep | — | yes | (현재) | (현재) | false | DocumentDB는 MongoDB와 호환되어 쓰던 쿼리와 데이터 구조를 그대로 받으므로 코드를 고치지 않는 이전의 목적지가 된다. |
| q187 | dax-dynamodb-only | keep | — | yes | (현재) | (현재) | false | DAX는 DynamoDB 테이블 앞에 그대로 얹을 수 있는 전용 호환 캐시라 아키텍처를 바꾸지 않고 읽기 용량 소진을 푼다. |
| q423 | neptune | keep | — | yes | (현재) | (현재) | false | Neptune은 개체 사이의 연결 관계 자체를 저장하고 따라가며 질의하는 그래프 데이터베이스다. |
| q424 | neptune-streams | keep | — | yes | (현재) | (현재) | false | Neptune Streams는 그래프의 변경을 캡처해 다른 서비스로 보내는 내장 기능이라 앞에 별도의 스트림 서비스를 세우지 않아도 된다. |
| q425 | qldb | keep | — | yes | (현재) | (현재) | false | QLDB는 변경을 지울 수 없는 기록으로 쌓고 해시 체인으로 그 기록이 위조되지 않았음을 암호학적으로 검증하게 하는 원장 데이터베이스다. |
| q426 | timestream | keep | — | yes | (현재) | (현재) | false | Timestream은 타임스탬프가 붙은 데이터를 시간 축으로 질의하도록 만든 시계열 데이터베이스이고 기록의 불변성을 약속하지 않는다. |
| q427 | elasticache-redis-vs-memcached | keep | — | yes | (현재) | (현재) | false | Memcached에는 저장한 데이터를 유지하는 기능이 없으므로, 사라지면 안 되는 상태를 캐시에 두어야 하면 Redis를 고른다. |
| q428 | elasticache-redis-vs-memcached | keep | — | yes | (현재) | (현재) | false | 두 엔진의 갈림길은 저장한 데이터를 유지하는 기능과 고급 기능의 유무이고, 조회 가속과 부하 감소는 둘이 함께 갖는 성질이다. |
| q429 | elasticache-multi-az-failover | keep | — | yes | (현재) | (현재) | false | ElastiCache의 다중 AZ 구성은 복제 노드를 다른 가용 영역에 두고 주 노드 장애 시 그 복제본을 자동으로 승격시킨다. |
| q430 | elasticache-global-datastore | keep | — | yes | (현재) | (현재) | false | ElastiCache 글로벌 데이터스토어는 캐시를 리전 간으로 관리형 복제하고 재해 시 복제 클러스터를 주 클러스터로 승격시키며 전송 중·저장 시 암호화를 지원한다. |
| q431 | documentdb-global-cluster | keep | — | yes | (현재) | (현재) | false | DocumentDB 글로벌 클러스터는 보조 리전을 새 주 리전으로 승격하는 관리형 리전 간 장애 조치를 제공한다. |
| q432 | cache-requires-application-change | keep | — | yes | (현재) | (현재) | false | ElastiCache는 애플리케이션이 캐시를 먼저 읽고 없을 때 데이터베이스로 가도록 코드를 바꿔야 효과가 생기므로 애플리케이션 무수정 조건과 부딪힌다. |
| q433 | elasticache-not-a-durable-store | keep | — | yes | (현재) | (현재) | false | 캐시는 빠르게 돌려주기 위한 장치이지 데이터를 계속 지키는 저장소가 아니므로, 보관 요구의 저장 위치로는 캐시가 아니라 데이터베이스를 고른다. |
| q434 | dax-encryption-at-rest | keep | — | yes | (현재) | (현재) | false | DAX의 저장 중 암호화는 클러스터를 만드는 시점에만 켤 수 있어서, 이미 운영 중인 클러스터는 암호화를 켠 새 클러스터로 옮겨야 한다. |
