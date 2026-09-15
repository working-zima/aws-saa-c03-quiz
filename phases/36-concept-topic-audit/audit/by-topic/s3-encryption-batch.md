# S3 암호화(SSE)·Batch Operations·인벤토리

`s3-encryption-batch` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 13개 · keep 12 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 12 · false 1 · duplicateOf 2
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 11 · 2A 1 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | sse | S3에 저장한 객체를 암호화하지 않으면 침해 시 내용이 그대로 드러나므로 서버 측 암호화로 보호하며 그 과정에 키가 필요하다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | sse-types | SSE-S3·SSE-KMS·SSE-C는 암호화 키를 누가 만들고 관리하는지로 갈리며, SSE-KMS의 객체별 키 비용은 S3 Bucket Key로 줄인다는 것을 이해한다. | keep | — | true | (현재) | — | 4 | 2A |
| 3 | client-side-encryption | S3로 보내기 전에 암호화해야 한다는 조건은 클라이언트 측 암호화를 가리키며, 그 대가로 키 보관·교체가 모두 사용자 몫이 된다는 교환 관계를 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 4 | envelope-encryption | 봉투 암호화나 키 자동 교체가 요구되면 S3 암호화 방식 가운데 SSE-KMS를 골라야 하고 SSE-S3·SSE-C는 자동 교체를 제공하지 않는다는 것을 이해한다. | keep | — | true | (현재) | sse-c-no-rotation-or-audit | 1 | ① |
| 5 | sse-kms-audit-trail | SSE-KMS를 선택하면 키 사용 이력을 확인하고 지정한 키를 쓰는 업로드를 강제할 수 있는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | sse-kms-cost | SSE-KMS는 객체마다 KMS API를 호출해 객체가 많으면 비용이 급증하고, S3 Bucket Key가 버킷 단위 데이터 키를 재사용해 보안 수준을 유지한 채 호출을 줄인다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | sse-c-no-rotation-or-audit | SSE-C는 키 자동 교체와 키 사용 감사를 제공하지 않고 SSE-S3도 세분화된 제어·감사를 주지 않으므로 교체·감사 요구가 붙으면 SSE-KMS만 남는다는 것을 이해한다. | keep | — | true | (현재) | envelope-encryption | 1 | ① |
| 8 | s3-secure-transport-condition | 저장 시 암호화는 전송 구간을 보호하지 않으므로 버킷 정책의 aws:SecureTransport 조건으로 HTTPS가 아닌 요청을 거부해 전송 중 암호화를 강제한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | batch-operations | S3 Batch Operations가 수백만 개 이상의 객체에 복사·삭제·설정 적용 같은 같은 작업을 한 번에 실행한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | s3-inventory-report | S3 인벤토리가 객체와 메타데이터를 나열한 보고서를 주기적으로 만들어 대량 작업의 대상 목록을 마련하며, 서버 스크립트나 ETL 도구 없이 Batch Operations와 이어진다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | batch-copy-vs-replication | 이미 쌓인 객체를 한 번 옮기는 일은 S3 Batch Operations, 앞으로 들어올 객체를 계속 보내는 일은 복제라는 갈림 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | s3-batch-operations-lambda-invoke | 정해진 동작으로 표현되지 않는 조건 판단은 S3 Batch Operations가 객체마다 Lambda 함수를 호출하게 해 서버 없이 처리할 수 있다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | s3-object-lambda | 같은 원본을 요청하는 애플리케이션마다 다르게 보여줘야 할 때 사본을 만들지 않고 S3 Object Lambda가 반환 직전에 객체를 변환한다는 것을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
