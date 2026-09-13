# S3 버전 관리·객체 잠금·수명 주기·복제

`s3-versioning-lifecycle` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 16 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q025 | versioning | keep | — | yes | (현재) | (현재) | false | S3 버전 관리를 켜면 같은 이름으로 덮어쓴 뒤에도 객체의 이전 상태가 버킷에 남는다. |
| q026 | versioning | keep | — | yes | (현재) | (현재) | false | 버전 관리가 꺼진 버킷은 같은 이름의 객체를 다시 올리면 알림 없이 기존 파일을 덮어쓰고 되돌릴 방법이 남지 않는다. |
| q027 | object-lock | keep | — | yes | (현재) | (현재) | false | S3 객체 잠금은 정해진 기간 동안 객체의 수정과 삭제를 막아 실수로 인한 변경과 삭제를 방지한다. |
| q028 | object-lock | keep | — | yes | (현재) | (현재) | false | 객체 잠금의 거버넌스 모드는 특별 권한을 가진 관리자에게만 수정과 삭제를 허용한다. |
| q029 | object-lock | keep | — | yes | (현재) | (현재) | false | 객체 잠금의 규정 준수 모드는 보존 기간 동안 루트 사용자를 포함해 누구에게도 수정과 삭제를 허용하지 않는다. |
| q030 | object-lock | keep | — | yes | (현재) | (현재) | false | 법적 보존은 정해진 만료일과 무관하게 사용자가 직접 해제할 때까지 객체의 수정과 삭제를 막는 장치다. |
| q031 | lifecycle-policy | keep | — | yes | (현재) | (현재) | false | 수명 주기 정책은 미리 건 규칙이 시간 경과에 따라 저절로 적용되고, 대상 목록을 받아 한 번에 실행하는 일괄 작업과 다르다. |
| q032 | lifecycle-policy | keep | — | yes | (현재) | (현재) | false | 접근 빈도를 미리 예상할 수 있으면 일정 기간이 지난 객체를 다른 스토리지 클래스로 옮기는 수명 주기 정책을 쓴다. |
| q033 | lifecycle-policy | keep | — | yes | (현재) | (현재) | false | 보존 기한이 끝난 객체를 곧바로 자동 삭제하는 일은 수명 주기 정책의 만료 규칙이 맡는다. |
| q171 | object-lock-prerequisites | keep | — | yes | (현재) | (현재) | false | 객체 잠금은 버전 관리가 활성화된 버킷에서만 동작하므로 잠금을 걸기 전에 버전 관리를 먼저 켜야 한다. |
| q172 | event-notification | keep | — | yes | (현재) | (현재) | false | S3 이벤트 알림은 새로 생성되는 객체에만 걸리고 버킷에 이미 쌓여 있던 객체에는 발생하지 않는다. |
| q271 | s3-replication | keep | — | yes | (현재) | (현재) | false | 여러 리전에 사본을 두라는 요구는 스토리지 클래스로 풀리지 않고 리전 간 복제로 풀리며, 즉시 조회 조건이 함께 붙으면 대상 버킷의 클래스까지 봐야 한다. |
| q272 | s3-same-region-replication | keep | — | yes | (현재) | (현재) | false | S3 동일 리전 복제는 새 객체를 같은 리전의 다른 버킷으로 자동 복사하며 필요한 권한이 있으면 계정을 넘어 로그를 모을 수 있다. |
| q273 | s3-replication-time-control | keep | — | yes | (현재) | (현재) | false | 복제본이 몇 분 안에 사용 가능해야 한다는 시간 조건은 복제 규칙의 복제 시간 제어(S3 RTC)로 채운다. |
| q274 | s3-replication-cross-account-kms | keep | — | yes | (현재) | (현재) | false | SSE-KMS로 암호화한 객체를 다른 계정의 버킷으로 복제하려면 대상 계정이 소스 버킷의 KMS 키를 쓸 수 있게 키 권한을 따로 열어야 한다. |
| q275 | s3-lifecycle-rules-and-size-filter | keep | — | yes | (현재) | (현재) | false | 버킷당 수명 주기 구성은 하나뿐이고 그 안의 규칙마다 객체 크기 필터로 대상을 좁힐 수 있다. |
