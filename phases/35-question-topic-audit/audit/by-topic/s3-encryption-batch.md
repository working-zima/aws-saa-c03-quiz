# S3 암호화(SSE)·Batch Operations·인벤토리

`s3-encryption-batch` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 15 · partial 1 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q034 | sse | keep | — | yes | (현재) | (현재) | false | S3에 도착한 파일을 서버 쪽에서 키로 암호화해 저장하는 방식의 이름이 SSE다. |
| q035 | sse-types | keep | — | yes | (현재) | (현재) | false | S3 객체 암호화에서 별도의 키 교체·사용 기록 없이 키 생성과 관리까지 S3에 맡기는 기본 방식은 SSE-S3다. |
| q036 | sse-types | keep | — | yes | (현재) | (현재) | false | 키 교체를 사람이 챙기지 않아야 하면 키 관리를 KMS에 맡겨 자동 교체까지 받는 SSE-KMS를 고른다. |
| q037 | sse-types | keep | — | partial | (현재) | sse-kms-cost | false | SSE-KMS는 객체마다 키를 만들어 KMS를 호출하므로 객체 수가 많으면 비용이 커지고, S3 Bucket Key로 버킷 키를 재사용하면 그 호출이 줄어든다. |
| q038 | sse-types | keep | — | yes | (현재) | (현재) | false | 키를 만들고 보관하고 챙기는 일이 통째로 쓰는 쪽 몫이 되어 권장되지 않는 SSE 방식은 SSE-C다. |
| q039 | batch-operations | keep | — | yes | (현재) | (현재) | false | 수백만에서 수십억 개 객체에 같은 작업을 한 번에 실행하는 일은 S3 Batch Operations가 맡는다. |
| q173 | envelope-encryption | keep | — | yes | (현재) | (현재) | false | 데이터 키를 마스터 키로 다시 암호화하는 봉투 암호화 구조를 쓰는 S3 암호화 방식은 SSE-KMS다. |
| q174 | sse-kms-cost | keep | — | yes | (현재) | (현재) | false | S3 Bucket Key는 SSE-KMS를 유지하면서 버킷 단위 키를 재사용해 객체별 KMS API 호출 수와 비용을 줄이는 기능이다. |
| q276 | client-side-encryption | keep | — | yes | (현재) | (현재) | false | 버킷에 도착하기 전에 이미 암호화돼 있어야 한다는 요구는 서버 측 암호화로는 채울 수 없고 클라이언트 측 암호화로 푼다. |
| q277 | s3-inventory-report | keep | — | yes | (현재) | (현재) | false | 마지막 수정 날짜가 담긴 객체 목록을 서버 없이 주기적으로 받는 일은 S3 인벤토리 보고서가 맡는다. |
| q278 | s3-object-lambda | keep | — | yes | (현재) | (현재) | false | 같은 데이터 세트를 호출자마다 다르게 내보내려면 객체를 돌려주기 직전에 함수가 변환하는 S3 Object Lambda를 쓴다. |
| q279 | sse-kms-audit-trail | keep | — | yes | (현재) | (현재) | false | 암호화 내역을 나중에 되짚으려면 키 사용 기록이 남는 SSE-KMS를 쓰고, 업로드 쪽이 그 암호화를 바꾸지 못하게 하는 일은 버킷 정책의 거부가 맡는다. |
| q280 | batch-copy-vs-replication | keep | — | yes | (현재) | (현재) | false | 이미 쌓여 있는 객체를 한 번 옮기는 일은 S3 Batch Operations이고 복제 규칙은 앞으로 들어올 객체를 계속 따라 보내는 장치다. |
| q281 | s3-batch-operations-lambda-invoke | keep | — | yes | (현재) | (현재) | false | 객체마다 조건에 따라 다르게 처리해야 하면 S3 Batch Operations가 인벤토리 보고서를 대상 목록으로 받아 객체마다 Lambda 함수를 호출하게 한다. |
| q282 | sse-c-no-rotation-or-audit | keep | — | yes | (현재) | (현재) | false | SSE-C는 키 자동 교체와 키 사용 기록 감사를 둘 다 AWS가 대신하지 않아 둘 중 하나라도 요구되면 후보에서 빠진다. |
| q283 | s3-secure-transport-condition | keep | — | yes | (현재) | (현재) | false | 저장 시 암호화로는 전송 구간이 보호되지 않으므로 버킷 정책의 aws:SecureTransport 조건으로 암호화되지 않은 연결을 거부한다. |
