# S3 버전 관리·객체 잠금·수명 주기·복제

`s3-versioning-lifecycle` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 10개 · keep 10 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 10 · false 0 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 10 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | versioning | S3 버전 관리를 켜지 않으면 같은 이름의 업로드가 기존 객체를 되돌릴 수 없게 덮어쓰고, 켜면 이전 버전이 남아 복원할 수 있음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 2 | object-lock | S3 객체 잠금은 정해진 기간 객체의 수정·삭제를 막으며 거버넌스 모드·규정 준수 모드·법적 보존이 누구에게 무엇을 허용하는지로 갈린다는 것을 이해한다. | keep | — | true | (현재) | — | 4 | ① |
| 3 | object-lock-prerequisites | S3 객체 잠금은 버전 관리가 켜진 버킷에서만 동작하고, MFA 삭제는 삭제를 어렵게 할 뿐 루트 사용자까지 막지 못한다는 한계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | lifecycle-policy | S3 수명 주기 정책이 지정한 시간이 지난 객체를 다른 스토리지 클래스로 옮기거나 보존 기한 뒤 삭제하도록 자동화한다는 것을 이해한다. | keep | — | true | (현재) | — | 3 | ① |
| 5 | s3-lifecycle-rules-and-size-filter | 버킷당 수명 주기 구성은 하나지만 그 안에 규칙을 여러 개 두고 접두사·객체 크기로 대상을 좁혀 조건이 다른 보존 정책을 표현한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | event-notification | S3 이벤트 알림은 객체가 새로 생성될 때 다른 서비스를 곧바로 호출하지만 이미 있던 객체에는 이벤트가 발생하지 않는다는 범위를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | s3-replication | 리전 간 복제가 객체를 다른 리전 버킷에 자동으로 복사해 여러 위치 보관 요구를 채우며, 스토리지 클래스로는 이 요구가 풀리지 않고 아카이브 대상은 즉시 접근을 깨뜨린다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | s3-same-region-replication | 동일 리전 복제로 여러 계정 버킷의 새 객체를 같은 리전의 한 버킷에 모을 수 있으며, 수명 주기 정책은 객체를 복사하지 못한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | s3-replication-time-control | 기본 복제는 완료 시간을 약속하지 않으므로 복제본이 몇 분 안에 있어야 한다는 조건에는 S3 RTC를 켜야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | s3-replication-cross-account-kms | S3 복제를 다른 계정으로 구성할 수 있으며 암호화된 객체의 복제에는 KMS 키 사용 권한까지 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
