# Storage Gateway·DMS·Application Migration Service

`storage-gateway-migration` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 7개 · keep 7 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 7 · false 0 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 7 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | storage-gateway | 온프레미스 저장소를 계속 연결해 사용하는 목적에 따라 Storage Gateway의 파일·블록·테이프 연결 방식을 구분할 수 있음을 이해한다. | keep | — | true | (현재) | — | 6 | ① |
| 2 | storage-gateway-gateway-types | 기존 온프레미스의 파일·블록·테이프 접근 방식을 기준으로 Storage Gateway 유형을 선택해 백업이나 저장 절차를 유지할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | storage-gateway-volume-modes | Storage Gateway 볼륨 모드는 전체 원본을 로컬에 남길지 자주 쓰는 일부만 캐시할지에 따라 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 4 | tape-gateway-archive-tiers | 기존 테이프 백업 절차를 유지하면서 장기간 거의 읽지 않는 가상 테이프의 비용을 낮추려면 Tape Gateway의 아카이브 계층을 구분해 골라야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | dms-sct | 데이터베이스 이전에서 진행 중 변경을 복제하는 DMS와 엔진 차이에 맞춰 스키마를 바꾸는 SCT의 역할을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | dms-full-load-and-cdc-task | 단계적으로 데이터베이스를 전환하는 동안 기존 데이터와 새 변경을 모두 유지하려면 DMS 태스크에서 전체 로드와 CDC를 함께 구성해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | application-migration-service | Application Migration Service로 애플리케이션을 고치지 않고 서버째 이전할 때 지속 복제·테스트·컷오버를 순서대로 거치는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
