# Storage Gateway·DMS·Application Migration Service

`storage-gateway-migration` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 13개 · keep 13 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 13 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q052 | storage-gateway | keep | — | yes | (현재) | (현재) | false | Storage Gateway는 온프레미스에서 S3를 로컬 저장소처럼 연결한 채 계속 사용하도록 이어 주는 서비스다. |
| q053 | storage-gateway | keep | — | yes | (현재) | (현재) | false | Storage Gateway의 주된 목적은 데이터를 한 번 이전하는 것이 아니라 온프레미스에서 클라우드 스토리지를 연결한 채 사용하는 것이다. |
| q054 | storage-gateway | keep | — | yes | (현재) | (현재) | false | Storage Gateway 중 NFS·SMB 공유로 파일 자체를 S3에 올려 실시간으로 사용하게 하는 유형은 파일 게이트웨이다. |
| q055 | storage-gateway | keep | — | yes | (현재) | (현재) | false | 볼륨 게이트웨이는 파일 자체가 아니라 EBS 스냅샷을 S3에 올리므로 업로드한 내용을 파일처럼 실시간 사용하는 유형이 아니다. |
| q056 | storage-gateway | keep | — | yes | (현재) | (현재) | false | 테이프 게이트웨이는 온프레미스 테이프 데이터를 S3에 백업·아카이빙하는 게이트웨이 유형이다. |
| q057 | storage-gateway | keep | — | yes | (현재) | (현재) | false | Storage Gateway는 자체 저장소를 제공하기보다 온프레미스와 S3 사이에서 파일·블록·테이프 형태의 접근을 이어 주는 통로다. |
| q368 | dms-sct | keep | — | yes | (현재) | (현재) | false | 엔진이 다른 데이터베이스 이전에서는 SCT가 스키마를 변환하고 DMS가 데이터와 이전 중 발생한 변경을 복제해 전환 중단을 줄인다. |
| q369 | application-migration-service | keep | — | yes | (현재) | (현재) | false | Application Migration Service는 복제 에이전트로 가상 머신을 지속 복제하고 테스트 후 컷오버해 애플리케이션 변경 없이 서버째 이전한다. |
| q370 | storage-gateway-gateway-types | keep | — | yes | (현재) | (현재) | false | 파일 게이트웨이는 기존 SMB 공유 접근을 유지하면서 S3에 저장하게 하며 뒤의 버킷에 수명 주기 규칙을 적용할 수 있다. |
| q371 | storage-gateway-volume-modes | keep | — | yes | (현재) | (현재) | false | 저장 볼륨 모드는 데이터 전체를 온프레미스에 유지하고 iSCSI로 제공하면서 스냅샷을 S3에 백업한다. |
| q372 | storage-gateway-volume-modes | keep | — | yes | (현재) | (현재) | false | 캐시된 볼륨 모드는 주 데이터를 AWS에 두고 자주 쓰는 일부만 로컬에 남겨 온프레미스 디스크 사용량을 줄인다. |
| q373 | tape-gateway-archive-tiers | keep | — | yes | (현재) | (현재) | false | 테이프 게이트웨이의 가상 테이프는 Flexible Retrieval과 Deep Archive에 보관할 수 있고 장기 보존·드문 조회에는 더 저렴한 Deep Archive를 고른다. |
| q374 | dms-full-load-and-cdc-task | keep | — | yes | (현재) | (현재) | false | DMS 이전을 장기간 동기화하려면 전체 로드와 CDC를 함께 수행하고 변경 부하가 큰 복제에는 메모리 최적화 인스턴스를 선택한다. |
