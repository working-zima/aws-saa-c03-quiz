# Aurora·Aurora Serverless·글로벌 데이터베이스

`aurora` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 18개 · keep 18 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 18 · false 0 · duplicateOf 1
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 16 · 2A 1 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | aurora | Aurora의 관계형 데이터베이스에서 읽기 부하 확대와 리전 분산 요구를 복제본 확장과 글로벌 구성으로 다루는 방식을 이해한다. | keep | — | true | (현재) | — | 3 | 2A |
| 2 | aurora-serverless-v2 | 관계형 데이터베이스의 수요를 예측하기 어려울 때 Aurora Serverless v2의 자동 용량 조정을 선택하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | aurora-serverless-max-acu | Aurora Serverless의 자동 확장도 사람이 정한 최대 ACU에 제약되므로 쓰기 급증에 맞는 상한을 마련해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | aurora-reader-endpoint | Aurora의 Reader Endpoint를 이용하면 복제본별 접속을 직접 나누지 않고 읽기 요청을 분산할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | aurora-endpoint-types | Aurora에서 읽기 워크로드를 전체 복제본·선택한 복제본 집합·개별 인스턴스로 보낼 때 필요한 엔드포인트를 구분한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | aurora-replica-auto-scaling | Aurora Auto Scaling은 공유 스토리지를 쓰는 읽기 레플리카 수를 조정하며 라이터의 쓰기 처리 인스턴스 수를 늘리는 기능은 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | read-replica-no-schema-change | 읽기 확장용 복제본에서는 스키마 변경을 시험할 수 없으며, 변경 검증 후 전환하려면 블루/그린 배포를 선택해야 함을 이해한다. | keep | — | true | (현재) | rds-storage-features.rds-blue-green-deployment | 1 | ① |
| 8 | babelfish | SQL Server에서 Aurora PostgreSQL로 옮길 때 Babelfish의 프로토콜 호환이 애플리케이션 변경을 줄이며 스키마·데이터 이전 도구와는 역할이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | sql-server-license-cost | SQL Server를 유지한 채 실행 위치만 바꾸면 라이선스 비용이 남으며, Babelfish를 활용한 Aurora PostgreSQL 전환은 비용과 코드 변경 부담을 함께 판단하는 선택임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | aurora-pgvector | 이미 Aurora PostgreSQL을 사용할 때 pgvector 확장으로 벡터 저장·질의를 함께 처리하면 별도 저장소의 운영 부담을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | aurora-select-into-outfile-s3 | Aurora MySQL의 쿼리 결과를 S3에 직접 내보내는 기능으로 별도의 ETL 도구 없이 아카이빙 경로를 만들 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | aurora-global-database-dr-targets | Aurora 글로벌 데이터베이스의 복제 지연과 보조 리전 승격 시간을 각각 데이터 손실·복구 시간 목표에 대응시켜 복구 수단을 판단한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | aurora-cross-region-read-replica | Aurora의 리전 간 복제본은 기존 클러스터를 크게 바꾸지 않고 리전 장애에 대비하는 수단이며 같은 리전 안의 가용성 구성과 보호 범위가 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | aurora-global-database-write-region | Aurora 글로벌 데이터베이스의 다중 리전 구성이 다중 쓰기 리전을 뜻하지는 않으며 여러 리전의 동시 쓰기 요구로 DynamoDB 글로벌 테이블과 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | aurora-continuous-backup-rpo | Aurora의 지속적 증분 백업이 보존 기간 안의 특정 시점 복구를 가능하게 하며 주기적 스냅샷보다 손실 가능한 변경 구간을 줄이는 이유를 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 16 | aurora-clone | Aurora 클론은 Aurora 클러스터를 복제하는 기능이므로 일반 RDS 엔진의 장기 백업·복원 요구에 대신 적용할 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | hold |
| 17 | aurora-storage-configurations | Aurora의 스토리지 선택은 RDS의 볼륨 유형 선택과 다르며 Standard와 I/O-Optimized라는 클러스터 구성으로 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | aurora-zdr-and-activity-streams | Aurora의 유지보수 중단 완화·활동 모니터링과 읽기 처리량 확장은 해결하는 문제가 서로 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
