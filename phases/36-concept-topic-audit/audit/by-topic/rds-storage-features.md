# RDS 스토리지 유형과 기능

`rds-storage-features` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 21개 · keep 21 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 19 · false 2 · duplicateOf 2
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 20 · 2A 1 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | rds | 관계형 데이터베이스를 직접 마련하는 대신 AWS에서 제공하는 관리형 서비스로 이용할 수 있음을 이해한다. | keep | — | false | (현재) | aws-core-services.rds | 1 | ① |
| 2 | storage-types | RDS의 일반적인 저장 요구와 높은 입출력 성능 요구를 구분해 범용 SSD와 IOPS를 지정하는 스토리지를 선택하는 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | storage-type-names | RDS 스토리지의 gp2·gp3와 io1·io2라는 약칭을 각각의 유형에 연결해 성능 요구에 맞는 이름을 식별할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | features | RDS에서 고가용성·읽기 확장·연결 관리·안전한 변경 배포는 서로 다른 요구이므로 각 기능이 맡는 목적을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 6 | 2A |
| 5 | multi-az-standby-limits | RDS 다중 AZ DB 인스턴스 배포의 대기 인스턴스는 장애 조치용이며 읽기나 쓰기 부하를 나누는 수단이 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | rds-multi-az-db-cluster | RDS의 다중 AZ DB 인스턴스 배포와 DB 클러스터 배포는 대기 인스턴스의 읽기 처리 가능 여부가 다름을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 7 | rds-multi-az-failover-rto | RDS에서 수분 이내 자동 복구가 필요할 때 다중 AZ의 장애 조치 시간과 복제본·스냅샷 복구의 차이를 판단할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | read-replica-vs-cache | 읽기 부하를 줄일 때 같은 결과가 반복 사용되는지를 기준으로 캐시 재사용과 읽기 전용 복제본으로의 부하 분산을 구분해야 함을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 9 | connection-issue-heuristic | 데이터베이스 연결 생성·거부 문제가 읽기 처리량이나 가용성 문제와 다르므로 연결 관리를 맡는 RDS Proxy로 해결해야 하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | rds-proxy-failover | RDS Proxy가 현재 쓰기를 맡는 인스턴스를 식별해 클라이언트의 재연결을 중개하므로 연결 관리와 함께 장애 전환도 단축하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | rds-blue-green-deployment | RDS의 동기화된 별도 스테이징 환경에서 변경을 시험한 뒤 운영으로 전환하면 직접 변경이나 재구축의 중단 위험을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | aurora.read-replica-no-schema-change | 1 | ① |
| 12 | rds-snapshot-cross-region-copy | RDS 재해 복구에서 허용되는 데이터 손실과 복구 시간이 넉넉하면 주기적 리전 간 스냅샷 복사로 상시 대기 자원 비용을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | automated-backup-retention | RDS 자동 백업의 35일 보존 한계를 넘는 장기 보존 요구에는 별도의 백업 계획이 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | rds-pitr-transaction-log-interval | RDS 자동 백업의 주기적 트랜잭션 로그로 보존 기간 안의 특정 시점에 복원할 수 있으며 복제나 고가용성만으로 잘못된 변경을 되돌릴 수는 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | rds-manual-snapshot-retention | 특정 시점의 RDS 백업을 자동 보존 기간보다 오래 남기려면 자동 스냅샷을 직접 삭제할 때까지 유지되는 수동 스냅샷으로 복사해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | rds-iam-database-authentication | RDS 접속에서 장기 비밀번호를 저장하지 않으려면 비밀번호 교체 대신 IAM 역할로 단기 인증 토큰을 받는 방식을 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | rds-encryption-scope-and-in-transit | RDS의 저장 중 암호화가 백업·스냅샷·복제본까지 보호하는 범위와 별도로 데이터베이스 연결의 전송 중 암호화를 설정해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | rds-encrypt-existing-instance | 암호화하지 않고 만든 RDS는 제자리에서 암호화를 켤 수 없어 암호화된 스냅샷 복사본으로 새 인스턴스를 복원해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | rds-stop-instance-restart | RDS 중지는 데이터와 구성을 남기며 일시적으로 실행 요금을 줄이지만 7일 후 자동 재시작되므로 무기한 중단 수단은 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 20 | rds-custom | OS와 데이터베이스 내부를 직접 바꿀 필요가 있을 때만 운영 책임 증가를 감수하는 RDS Custom을 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 21 | rds-custom-byol | RDS Custom으로 특권 기능과 기존 상용 라이선스를 유지하는 선택은 라이선스 자체를 없애려는 엔진 이전과 목적이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
