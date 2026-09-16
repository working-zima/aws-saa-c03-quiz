# RDS 스토리지 유형과 기능

`rds-storage-features` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 28개 · keep 28 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 26 · partial 2 · no 0
- 이 주제로 들어올 이동 후보 1개 — q508(`lambda`)

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q058 | rds | keep | — | yes | (현재) | (현재) | false | RDS는 MySQL과 PostgreSQL 같은 관계형 데이터베이스 엔진을 관리형으로 제공하는 서비스다. |
| q059 | storage-types | keep | — | yes | (현재) | (현재) | false | RDS의 프로비저닝된 IOPS SSD는 초당 입출력 횟수를 직접 지정해 높은 처리량과 낮은 지연 요구에 대응한다. |
| q060 | features | keep | — | yes | (현재) | (현재) | false | RDS Multi AZ DB 인스턴스 배포는 장애 시 대기 DB가 주 DB 역할을 자동으로 넘겨받게 하는 고가용성 기능이다. |
| q061 | features | keep | — | partial | (현재) | rds-multi-az-db-cluster | false | RDS Multi AZ DB 클러스터는 읽기를 받는 대기 DB들을 두어 고가용성과 읽기 처리 능력을 함께 확보한다. |
| q062 | features | keep | — | yes | (현재) | (현재) | false | RDS Read Replica는 읽기 요청을 별도 DB로 옮겨 읽기 처리 능력을 높이고 주 DB의 부하를 줄인다. |
| q063 | features | keep | — | yes | (현재) | (현재) | false | RDS Cross Region Read Replica는 다른 리전의 복제본을 이용해 리전 규모의 재해 뒤 복구에 대비하는 기능이다. |
| q064 | features | keep | — | yes | (현재) | (현재) | false | RDS Proxy는 애플리케이션과 DB 사이에서 연결을 재사용하고 관리하는 기능이다. |
| q065 | features | keep | — | partial | (현재) | rds-blue-green-deployment | false | RDS 블루/그린 배포는 운영과 동기화된 스테이징 환경에서 변경을 검증하고 그 환경으로 운영을 전환한다. |
| q179 | storage-type-names | keep | — | yes | (현재) | (현재) | false | RDS 스토리지 표기에서 io1·io2는 프로비저닝된 IOPS SSD를 뜻하고 gp2·gp3는 범용 SSD를 뜻한다. |
| q180 | multi-az-standby-limits | keep | — | yes | (현재) | (현재) | false | RDS Multi AZ DB 인스턴스 배포의 대기 인스턴스는 장애 조치를 기다리며 평소 분석용 읽기 트래픽을 처리하지 않는다. |
| q181 | automated-backup-retention | keep | — | yes | (현재) | (현재) | false | RDS 자동 백업의 보존 기간 상한은 35일이므로 그보다 긴 규정 보존 기간은 자체 자동 백업만으로 충족하지 못한다. |
| q182 | connection-issue-heuristic | keep | — | yes | (현재) | (현재) | false | RDS의 연결 수 급증으로 발생하는 연결 거부는 RDS Proxy의 연결 재사용·관리로 대응하며 읽기 복제나 다중 AZ로 해결하는 문제가 아니다. |
| q375 | rds-blue-green-deployment | keep | — | yes | (현재) | (현재) | false | RDS 블루/그린 배포는 스테이징 복사본에서 스키마 변경을 시험한 뒤 운영으로 전환해 변경 배포의 중단을 줄인다. |
| q376 | rds-custom | keep | — | yes | (현재) | (현재) | false | RDS Custom은 일반 RDS가 열어 주지 않는 운영체제와 DB 수준의 직접 접근·사용자 지정을 제공한다. |
| q377 | rds-iam-database-authentication | keep | — | yes | (현재) | (현재) | false | RDS의 IAM 데이터베이스 인증은 역할의 임시 자격 증명으로 받은 단기 인증 토큰을 비밀번호 대신 사용해 저장된 DB 비밀번호 없이 접속하게 한다. |
| q378 | rds-encryption-scope-and-in-transit | keep | — | yes | (현재) | (현재) | false | RDS 저장 중 암호화의 범위에는 자동 백업·스냅샷·읽기 전용 복제본이 포함되어 사본별 암호화 설정을 다시 하지 않는다. |
| q379 | rds-multi-az-db-cluster | keep | — | yes | (현재) | (현재) | false | RDS 다중 AZ DB 클러스터는 두 대기 인스턴스의 읽기와 리더 엔드포인트를 제공하는 배포 형태다. |
| q380 | rds-multi-az-db-cluster | keep | — | yes | (현재) | (현재) | false | RDS for MySQL에서 복제 지연을 허용하며 트랜잭션과 분석을 분리하려면 읽기 전용 복제본으로 분석 쿼리를 보낸다. |
| q381 | read-replica-vs-cache | keep | — | yes | (현재) | (현재) | false | 같은 쿼리가 거의 반복되지 않거나 데이터가 자주 바뀌면 캐시 효과가 작으므로 읽기 부하는 RDS 읽기 전용 복제본으로 분리한다. |
| q382 | read-replica-vs-cache | keep | — | yes | (현재) | (현재) | false | 캐시와 읽기 전용 복제본을 고르는 중심 기준은 동일한 쿼리 결과를 반복해서 재사용할 수 있는지다. |
| q383 | rds-proxy-failover | keep | — | yes | (현재) | (현재) | false | RDS Proxy는 연결을 관리하면서 현재 쓰기 인스턴스를 자동 식별해 읽기 복제본 승격 뒤 재접속 전환 시간도 줄인다. |
| q384 | rds-snapshot-cross-region-copy | keep | — | yes | (현재) | (현재) | false | RDS 스냅샷을 주기적으로 다른 리전에 복사하면 느슨한 복구 목표를 채우면서 상시 대기 인스턴스 비용을 줄일 수 있다. |
| q385 | rds-manual-snapshot-retention | keep | — | yes | (현재) | (현재) | false | RDS 자동 스냅샷을 수동 스냅샷으로 복사하면 자동 보존 기간과 무관하게 사용자가 삭제할 때까지 남는다. |
| q386 | rds-pitr-transaction-log-interval | keep | — | yes | (현재) | (현재) | false | RDS 자동 백업은 5분 간격 트랜잭션 로그로 보존 기간 안의 임의 시점에 복구해 잘못된 변경 이전으로 되돌릴 수 있다. |
| q387 | rds-multi-az-failover-rto | keep | — | yes | (현재) | (현재) | false | RDS 다중 AZ 배포는 리전 내 대기 인스턴스로 자동 장애 조치를 수행하며 1~2분 수준의 전환으로 5분 미만 복구 목표에 대응한다. |
| q388 | rds-stop-instance-restart | keep | — | yes | (현재) | (현재) | false | 중지한 RDS 인스턴스는 구성과 데이터를 유지하며 실행 요금이 멈추지만 7일 뒤 자동으로 다시 시작된다. |
| q389 | rds-encrypt-existing-instance | keep | — | yes | (현재) | (현재) | false | 기존 비암호화 RDS를 암호화하려면 스냅샷의 암호화된 복사본을 만들고 그 복사본에서 새 인스턴스를 복원해야 한다. |
| q390 | rds-custom-byol | keep | — | yes | (현재) | (현재) | false | RDS Custom의 BYOL은 기존 라이선스를 활용하면서 특권 접근이 필요한 데이터베이스 기능을 유지하는 이전에 맞는다. |
