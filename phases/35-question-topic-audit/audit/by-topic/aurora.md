# Aurora·Aurora Serverless·글로벌 데이터베이스

`aurora` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 21개 · keep 20 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 19 · partial 2 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q066 | aurora | keep | — | yes | (현재) | (현재) | false | Aurora는 MySQL·PostgreSQL 유형을 갖춘 관계형 데이터베이스 서비스여서, 키-값 모델의 NoSQL이나 조회 결과를 얹어 두는 캐시, 파일 저장 서비스와 갈린다. |
| q067 | aurora | keep | — | yes | (현재) | (현재) | false | Aurora Global Database는 여러 리전에 DB를 구성해 재해 복구에 쓰이면서 멀리 있는 사용자의 읽기 성능까지 함께 끌어올리는 기능이다. |
| q068 | aurora | keep | — | partial | (현재) | aurora-replica-auto-scaling | false | Aurora Auto Scaling은 부하 지표가 임계치를 넘을 때 읽기 전용 복제본 수를 자동으로 늘리는 기능이다. |
| q183 | aurora-serverless-v2 | keep | — | yes | (현재) | (현재) | false | Aurora Serverless v2는 데이터베이스 용량 자체를 워크로드에 맞춰 1초 단위로 자동 조정하는 구성이다. |
| q184 | aurora-reader-endpoint | keep | — | yes | (현재) | (현재) | false | Aurora의 Reader Endpoint는 접속 주소 하나로 읽기 전용 복제본들에 요청을 자동으로 나눠 주므로 애플리케이션이 복제본을 고르지 않아도 된다. |
| q391 | aurora-endpoint-types | keep | — | yes | (현재) | (현재) | false | 사용자 지정 엔드포인트는 클러스터 안에서 고른 인스턴스만 묶어 그 집합에만 부하를 분산하므로 워크로드를 격리한다. |
| q392 | aurora-replica-auto-scaling | keep | — | yes | (현재) | (현재) | false | Aurora Auto Scaling이 조정하는 대상은 읽기 전용 레플리카 수이고, 쓰기를 받는 라이터는 한 번에 하나라 늘어나지 않는다. |
| q393 | babelfish | keep | — | yes | (현재) | (현재) | false | Babelfish를 켜면 Aurora PostgreSQL이 SQL Server의 T-SQL과 와이어 프로토콜을 알아들어 쓰던 드라이버와 쿼리를 그대로 둘 수 있다. |
| q394 | aurora-pgvector | keep | — | yes | (현재) | (현재) | false | Aurora PostgreSQL은 pgvector 확장을 지원하므로 벡터 임베딩을 이미 쓰는 데이터베이스 안에서 저장하고 질의해 운영 대상을 늘리지 않는다. |
| q395 | aurora-select-into-outfile-s3 | keep | — | yes | (현재) | (현재) | false | Aurora MySQL은 SELECT INTO OUTFILE S3 쿼리만으로 결과를 S3에 직접 쓸 수 있어 아카이빙에 별도의 ETL 도구를 세우지 않아도 된다. |
| q396 | aurora-global-database-dr-targets | keep | — | yes | (현재) | (현재) | false | Aurora 글로벌 데이터베이스는 리전 간 복제 지연이 1초 미만이고 보조 리전 승격이 몇 분 안에 끝나므로 복구 지점 1분·복구 시간 5분 조건을 채운다. |
| q397 | aurora-cross-region-read-replica | keep | — | yes | (현재) | (현재) | false | 리전 간 Aurora 복제본은 엔진 기본 복제로 다른 리전에 복제본을 만들어, 운영 중인 클러스터의 동작 방식을 바꾸지 않고 리전 재해에 대비한다. |
| q398 | aurora-continuous-backup-rpo | keep | — | yes | (현재) | (현재) | false | Aurora는 변경을 끊이지 않고 S3에 증분으로 쌓아 보존 기간 안의 임의 시점으로 복구하므로 복구 지점 목표가 몇 초 수준까지 좁혀진다. |
| q399 | aurora-continuous-backup-rpo | keep | — | yes | (현재) | (현재) | false | 정해진 간격으로만 스냅샷을 뜨면 그 간격이 복구 지점 목표의 상한이 되어 마지막 스냅샷 이후의 변경을 잃는다. |
| q400 | aurora-clone | ambiguous | — | partial | backup-disaster-recovery | backup-disaster-recovery.backup-long-term-retention | false | 서비스 자체 백업의 보존 한계, 곧 RDS 자동 백업의 35일을 넘겨 보존하면서 특정 시점 복원까지 해야 하면 AWS Backup으로 백업 계획을 세운다. |
| q401 | aurora-storage-configurations | keep | — | yes | (현재) | (현재) | false | Aurora의 스토리지는 볼륨 유형을 고르는 것이 아니라 Aurora Standard와 Aurora I/O-Optimized 두 구성 중 하나를 고르는 일이다. |
| q402 | sql-server-license-cost | keep | — | yes | (현재) | (현재) | false | SQL Server를 EC2에 올리든 RDS for SQL Server로 옮기든 상용 라이선스 비용이 그대로 남으므로, 비용을 줄이려면 라이선스가 필요 없는 엔진으로 가야 한다. |
| q403 | aurora-zdr-and-activity-streams | keep | — | yes | (현재) | (현재) | false | 제로 다운타임 재시작과 Database Activity Streams는 각각 유지보수 중단 축소와 보안 모니터링이라 처리할 수 있는 부하를 늘리는 수단이 아니다. |
| q404 | aurora-global-database-write-region | keep | — | yes | (현재) | (현재) | false | Aurora Global Database는 쓰기를 받는 리전이 하나뿐이라 여러 리전이 동시에 기록해야 한다는 요구를 채우지 못한다. |
| q405 | aurora-serverless-max-acu | keep | — | yes | (현재) | (현재) | false | Aurora Serverless의 용량 단위는 ACU이고, 최대 ACU를 급증에 맞춰 높게 잡아 두면 그 범위 안에서 쓰기 급증을 받아낸다. |
| q406 | read-replica-no-schema-change | keep | — | yes | (현재) | (현재) | false | 읽기 전용 복제본은 읽기만 받으므로 테이블 구조를 고치는 작업 자체가 들어가지 않고, 그래서 복제본에서 스키마를 바꿔 승격시키는 길은 첫 단계에서 막힌다. |
