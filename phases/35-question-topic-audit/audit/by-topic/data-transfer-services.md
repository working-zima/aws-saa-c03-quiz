# DataSync·Snowball Edge·Transfer Family·S3 전송

`data-transfer-services` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 20개 · keep 19 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 20 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q049 | datasync | keep | — | yes | (현재) | (현재) | false | DataSync는 온프레미스와 AWS 사이뿐 아니라 AWS 스토리지 서비스 사이에서도 대량 데이터를 전송한다. |
| q050 | snowball-edge | keep | — | yes | (현재) | (현재) | false | Snowball Edge는 배송받은 물리 장비에 데이터를 복사하고 AWS로 돌려보내는 방식으로 대량 데이터를 이전한다. |
| q051 | transfer-family | keep | — | yes | (현재) | (현재) | false | Transfer Family는 FTP·SFTP·FTPS로 파일을 송수신하는 서버 역할을 맡으며 S3와 연동한다. |
| q351 | snowball-edge-compute | keep | — | yes | (현재) | (현재) | false | Snowball Edge는 리전과 연결이 끊긴 현장에서도 EC2와 EKS Anywhere를 실행해 데이터를 저장하고 처리한다. |
| q352 | transfer-family-workflow | keep | — | yes | (현재) | (현재) | false | Transfer Family의 업로드 후 관리형 워크플로는 처리 단계에서 Lambda를 호출해 수신 파일을 변환하고 결과를 저장할 수 있다. |
| q353 | s3-transfer-acceleration | keep | — | yes | (현재) | (현재) | false | S3 전송 가속은 원거리 업로드 경로만 빠르게 하고 객체 사본을 여러 리전에 만들어 장애 복구를 제공하지는 않는다. |
| q354 | transfer-deadline-vs-bandwidth | keep | — | yes | (현재) | (현재) | false | 회선으로 기한 안에 옮길 수 있는 양이 부족하면 온라인 도구 대신 Snowball Edge로 데이터를 물리 전송해야 한다. |
| q355 | file-gateway-vs-datasync-continuous | keep | — | yes | (현재) | (현재) | false | DataSync는 실행 사이에 새 파일이 대기하는 예약 전송이고, 파일 게이트웨이는 공유에 쓰이는 파일을 계속 S3로 보내므로 거의 실시간 수집 요구를 채운다. |
| q356 | file-gateway-vs-datasync-continuous | keep | — | yes | (현재) | (현재) | false | DataSync는 실행할 때마다 원본과 대상을 맞추는 예약 전송이므로 즉시 수집이 필요 없는 일 단위 파일 이전에 맞는다. |
| q357 | transfer-family-custom-hostname | keep | — | yes | (현재) | (현재) | false | Transfer Family는 기존 호스트 이름을 서버 엔드포인트에 연결하고 기존 인증 체계를 연동해 클라이언트 설정을 유지하면서 SFTP 서버를 대체한다. |
| q358 | transfer-family-directory-service-identity-provider | keep | — | yes | (현재) | (현재) | false | Transfer Family의 ID 공급자를 Directory Service로 정하고 AD Connector로 기존 Active Directory에 연결하면 같은 계정으로 SFTP에 로그인할 수 있다. |
| q359 | transfer-family-service-managed-users | keep | — | yes | (현재) | (현재) | false | Transfer Family의 서비스 관리형 사용자는 사용자와 SSH 공개 키를 서비스에 등록해 외부 디렉터리 없이 기존 SFTP 접속 절차를 유지한다. |
| q360 | datasync-scope-limits | keep | — | yes | (현재) | (현재) | false | DataSync가 전송하는 단위는 파일과 객체이므로 데이터베이스의 실시간 변경 스트림을 전달하는 역할은 맡지 못한다. |
| q361 | datasync-in-transit-encryption | keep | — | yes | (현재) | (현재) | false | DataSync는 파일 전송 구간을 TLS로 암호화하므로 충분한 인터넷 회선이 있으면 별도 보안 장치 없이 암호화된 대량 전송을 할 수 있다. |
| q362 | datasync-manifest | keep | — | yes | (현재) | (현재) | false | DataSync 매니페스트는 전송할 파일·객체 목록을 지정해 목록 밖의 데이터를 보내지 않게 한다. |
| q363 | datasync-transfer-mode | keep | — | yes | (현재) | (현재) | false | DataSync 태스크를 변경 데이터만 전송하는 모드로 두면 원본과 대상을 비교해 바뀐 파일만 덮어쓴다. |
| q364 | datasync-task-status-event | ambiguous | — | yes | (현재) | (현재) | false | DataSync가 작업 실행의 성공·오류 상태 변화를 이벤트로 내보내므로 EventBridge 규칙에서 SNS로 연결하면 상태를 폴링하는 코드 없이 이메일로 알릴 수 있다. |
| q365 | transfer-family-workflow-actions | keep | — | yes | (현재) | (현재) | false | Transfer Family 업로드 후 워크플로의 DECRYPT와 COPY 액션은 별도 함수 없이 수신 파일을 복호화하고 처리 디렉터리로 복사한다. |
| q366 | transfer-family-structured-logging | keep | — | yes | (현재) | (현재) | false | Transfer Family의 구조화된 사용자 활동 로그에는 고객별 파일 다운로드 내역이 담겨 있어 Athena 집계로 사용량 과금의 근거를 얻을 수 있다. |
| q367 | s3-multipart-upload | keep | — | yes | (현재) | (현재) | false | S3 전송 가속과 멀티파트 업로드를 함께 쓰면 큰 객체를 병렬로 직접 올려 원거리 전송을 빠르게 하면서 중간 구성 요소를 줄인다. |
