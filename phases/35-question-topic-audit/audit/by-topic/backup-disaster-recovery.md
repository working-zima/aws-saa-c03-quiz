# AWS Backup·재해 복구 전략·Elastic Disaster Recovery

`backup-disaster-recovery` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 11개 · keep 11 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 11 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q098 | backup | keep | — | yes | (현재) | (현재) | false | 여러 AWS 서비스의 백업 일정·보존·리전 간 사본을 한곳에서 세우는 일과, 서비스 하나의 데이터만 지키는 수단은 미치는 범위가 다르다. |
| q208 | backup-long-term-retention | keep | — | yes | (현재) | (현재) | false | 서비스 자체 백업의 보존 한계인 35일을 넘거나 리전 간 복제가 필요해지는 순간이 통합 백업 서비스로 넘어갈 때다. |
| q577 | elastic-disaster-recovery | keep | — | yes | (현재) | (현재) | false | 디스크 변경을 계속 복제해 두면 전환할 때 할 일이 인스턴스를 띄우는 것뿐이어서 짧은 복구 시간 목표가 성립하며, 갈림길은 데이터가 옮겨져 있는지가 아니라 전환이 즉시 되는지다. |
| q578 | backup-and-restore-dr | keep | — | yes | (현재) | (현재) | false | 복구 시간이 몇 시간까지 허용되고 정상 운영 자원을 최소로 써야 하면 컴퓨팅을 띄워 두지 않는 백업 및 복원이고, 다시 세우는 일은 템플릿으로 반복 가능하게 한다. |
| q579 | warm-standby-for-low-rto | keep | — | yes | (현재) | (현재) | false | 복구 시간 목표가 60초로 내려가면 장애 뒤에 만들거나 켜는 절차가 들어갈 자리가 없어, 대기 리전이 실행 중이어야 하고 전환도 상태 점검이 자동으로 해야 한다. |
| q580 | backup-ec2-resource-assignment | keep | — | yes | (현재) | (현재) | false | 백업 계획의 리소스로 볼륨이 아니라 인스턴스를 지정해야 인스턴스 구성과 연결된 볼륨이 함께 담겨 다른 리전에서 한 번에 복구된다. |
| q581 | organizations-backup-policy | keep | — | yes | (현재) | (현재) | false | 백업 계획을 조직 수준 정책으로 내려보내면 계정이 늘어도 같은 규칙이 따라붙고 관리 지점이 한곳으로 남는다. |
| q582 | backup-cross-account-copy | keep | — | yes | (현재) | (현재) | false | 리전 간 사본은 리전 하나가 멈추는 상황을 대비하고, 계정 간 사본은 그 계정이 침해되거나 실수로 지워지는 경우를 대비한다. |
| q583 | backup-s3-continuous-backup | keep | — | yes | (현재) | (현재) | false | 되돌릴 수 있는 시점이 얼마나 촘촘한가를 기준으로 보면 연속 백업이 하루 한 번 뜨는 구성보다 잃는 변경분이 훨씬 적다. |
| q584 | backup-restore-testing-plan | keep | — | yes | (현재) | (현재) | false | 백업이 실제로 복원되는지 검증하는 일은 복원 테스트 계획이 맡고, 규정 준수를 보는 감사 기능은 그것을 확인해 주지 않는다. |
| q585 | backup-audit-manager | keep | — | yes | (현재) | (현재) | false | 백업이 규정을 지키는지와 암호화됐는지를 프레임워크 기준으로 감사해 보고서를 내는 것은 AWS Backup 안의 백업 전용 감사 기능이다. |
