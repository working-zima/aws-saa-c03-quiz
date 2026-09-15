# AWS Backup·재해 복구 전략·Elastic Disaster Recovery

`backup-disaster-recovery` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
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
| 1 | backup | 서비스마다 흩어진 백업 작업을 한곳에서 자동화하고 관리하는 중앙 백업 관리의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | backup-long-term-retention | 서비스 자체 백업의 보존 한계를 넘는 요구에는 AWS Backup의 계획으로 보존·복제·만료를 관리하고 복구할 범위에 맞춰 대상을 지정해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | backup-ec2-resource-assignment | AWS Backup에서 EC2 전체를 복구하려면 개별 볼륨이 아닌 인스턴스를 백업 대상으로 지정해 구성 정보와 연결된 볼륨을 함께 남겨야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | organizations-backup-policy | 조직의 백업 정책으로 계획을 회원 계정에 적용하면 계정마다 별도로 설정하지 않고 백업 규칙을 중앙에서 일관되게 유지할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | backup-cross-account-copy | 백업 사본의 계정 분리는 계정 침해·삭제 위험에, 리전 분리는 리전 장애에 대비하므로 보호할 사고 유형에 맞춰 사본 위치를 골라야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 6 | backup-s3-continuous-backup | AWS Backup의 S3 연속 백업은 복원할 시점을 촘촘하게 제공하므로 백업 간격에 따른 변경분 손실을 줄이는 선택임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | backup-restore-testing-plan | 백업 정책을 지켰다는 사실만으로 실제 복원이 검증되지는 않으므로 AWS Backup의 복원 테스트 계획으로 복구 가능성을 확인해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | backup-audit-manager | AWS Backup Audit Manager가 백업 활동의 준수·암호화 증거를 보고하는 기능이며 일반 감사 증거 수집이나 구성 변경 기록과 역할이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | backup-and-restore-dr | 평상시 대기 컴퓨팅 자원을 줄이는 재해 복구 방식은 장애 후 환경을 다시 마련하는 시간과 맞바꾸는 선택임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 10 | warm-standby-for-low-rto | 복구 시간을 짧게 제한하면 대기 환경·데이터 복제·자동 전환을 장애 전에 준비해야 하며 장애 뒤의 생성이나 수동 전환 시간을 감당할 수 없음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 11 | elastic-disaster-recovery | Elastic Disaster Recovery의 지속적인 블록 복제와 복구 시험을 이용하면 데이터만 옮기는 방식보다 짧은 시간 안에 서버 환경을 복구할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
