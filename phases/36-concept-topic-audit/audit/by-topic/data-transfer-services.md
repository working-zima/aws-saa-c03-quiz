# DataSync·Snowball Edge·Transfer Family·S3 전송

`data-transfer-services` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 19개 · keep 18 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 17 · false 2 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 18 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | datasync | DataSync가 온프레미스와 AWS 사이뿐 아니라 AWS 저장소 사이의 대량 데이터 이전도 맡는다는 전송 범위를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | file-gateway-vs-datasync-continuous | 거의 실시간으로 파일을 수집해야 하면 예약 실행마다 동기화하는 DataSync와 공유에 쓰인 파일을 계속 올리는 파일 게이트웨이의 전송 방식을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 3 | datasync-scope-limits | DataSync가 파일·객체 전송을 맡는 도구이므로 데이터베이스 변경 스트림이나 저장소 고유 복제가 필요한 상황에는 맞지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | datasync-in-transit-encryption | DataSync의 TLS 암호화와 전송 검증을 이용하면 기존 인터넷 회선으로 파일을 안전하게 옮기기 위해 별도 암호화 구성을 더할 필요가 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | datasync-manifest | DataSync 매니페스트로 필요한 전송 대상만 지정하고 목록 준비 직후 작업을 시작해 불필요한 전송과 대기를 줄이는 방법을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | datasync-transfer-mode | DataSync의 변경 데이터 전송 모드를 쓰면 직접 비교 코드를 만들지 않고 원본이 달라진 파일만 복사본에 반영할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | datasync-task-status-event | DataSync가 제공하는 작업 상태 이벤트를 이용하면 별도의 상태 조회 코드를 만들지 않고 전송 결과를 알림으로 연결할 수 있음을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
| 8 | snowball-edge | 회선으로 보내는 대신 물리 장비에 데이터를 복사하고 배송해 대량의 데이터를 클라우드로 이전하는 방식을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 9 | snowball-edge-compute | Snowball Edge는 데이터 운송뿐 아니라 리전 연결이 없는 현장에서 컴퓨팅과 스토리지를 제공하는 독립 실행 장비이기도 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | transfer-deadline-vs-bandwidth | 남은 시간과 회선 대역폭으로 전송 가능한 양을 먼저 계산해야 온라인 도구의 기능 비교에 앞서 물리 운송의 필요를 판단할 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 11 | transfer-family | Transfer Family가 기존 FTP 계열 파일 전송 방식을 AWS 스토리지와 연결하는 서버 역할을 제공함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | transfer-family-custom-hostname | 자체 SFTP 서버를 Transfer Family로 바꿀 때 사용자 지정 호스트 이름과 기존 인증을 유지해 클라이언트 변경을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | transfer-family-directory-service-identity-provider | Transfer Family의 ID 공급자를 Directory Service로 지정하고 기존 디렉터리를 연결해 직원의 SFTP 로그인 자격 증명을 유지하는 방법을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | transfer-family-service-managed-users | 외부 디렉터리가 필요 없는 소수 SFTP 사용자라면 Transfer Family에 사용자와 SSH 공개 키를 직접 등록해 기존 클라이언트 절차를 유지할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | transfer-family-workflow | Transfer Family의 관리형 워크플로로 업로드 직후 처리 함수를 연결하면 파일 수집과 후처리를 별도 서버 없이 이어갈 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | transfer-family-workflow-actions | Transfer Family의 업로드 후 복호화·복사는 미리 정의된 워크플로 액션으로 처리할 수 있어 같은 일을 위한 함수나 주기적 작업이 불필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | transfer-family-structured-logging | Transfer Family의 사용자별 다운로드 기록을 이용해야 고객별 전송량을 집계할 수 있으며 네트워크 기록이나 AWS 요금 내역으로는 대신할 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | s3-transfer-acceleration | S3 전송 가속은 먼 클라이언트의 업로드 경로를 개선할 뿐 데이터 사본이나 리전 장애 대비를 만들지는 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | s3-multipart-upload | 큰 S3 객체를 조각으로 나눠 병렬 업로드하고 전송 가속과 결합하면 중간 버킷이나 장비 없이 원거리 데이터 수집을 단순화할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
