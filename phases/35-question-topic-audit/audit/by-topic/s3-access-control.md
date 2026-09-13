# S3 접근 제어·액세스 포인트·Storage Lens

`s3-access-control` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 13개 · keep 13 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 13 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q247 | s3-cross-account-bucket-policy | keep | — | yes | (현재) | (현재) | false | 다른 AWS 계정에 버킷 접근을 주는 표준 방법은 그 계정 ID를 지정한 버킷 정책을 버킷에 붙이는 것이다. |
| q248 | s3-presigned-url | keep | — | yes | (현재) | (현재) | false | S3 사전 서명된 URL은 버킷을 공개하거나 장기 키를 배포하지 않고 특정 객체에 유효 기간이 있는 접근을 내준다. |
| q249 | s3-access-grants | keep | — | yes | (현재) | (현재) | false | S3 Access Grants는 디렉터리의 사용자·그룹을 버킷 접두사 위치에 매핑하고 접근 시 임시 자격 증명을 발급한다. |
| q250 | s3-access-point | keep | — | yes | (현재) | (현재) | false | 접두사가 계속 늘어나는 버킷을 부서별로 격리하려면 액세스 포인트를 하나씩 만들고 각각에 권한을 건다. |
| q251 | s3-multi-region-access-point | keep | — | yes | (현재) | (현재) | false | 여러 리전의 버킷을 엔드포인트 하나로 묶어 요청을 가까운 버킷으로 보내는 것은 멀티 리전 액세스 포인트다. |
| q252 | s3-storage-lens | keep | — | yes | (현재) | (현재) | false | 계정에 흩어진 버킷의 사용 현황을 한자리에 모아 분석하고 보고하는 기능은 S3 Storage Lens다. |
| q253 | s3-cors-not-authorization | keep | — | yes | (현재) | (현재) | false | CORS를 허용하는 것은 다른 오리진에서 온 요청을 받아들이는 설정일 뿐 요청자를 인증하거나 대상을 특정 사용자로 좁히지 않는다. |
| q254 | s3-requester-pays | keep | — | yes | (현재) | (현재) | false | 접근은 열어 주면서 요청·다운로드 비용을 받아 가는 쪽에 넘기는 설정은 요청자 부담 버킷이다. |
| q255 | s3-storage-lens-advanced-activity-metrics | keep | — | yes | (현재) | (현재) | false | 더 이상 읽히지 않는 버킷을 계정 전체에서 찾는 일은 Storage Lens의 고급 활동 메트릭을 켜면 대시보드 안에서 끝난다. |
| q256 | s3-account-level-public-access-block | keep | — | yes | (현재) | (현재) | false | S3 공개 액세스 차단을 계정 수준에 적용하면 계정의 모든 버킷에서 이후 공개 정책이나 ACL이 추가돼도 공개 접근을 막는다. |
| q257 | block-public-access-allows-explicit-grants | keep | — | yes | (현재) | (현재) | false | 공개 액세스 차단이 막는 것은 누구에게나 열리는 공개 접근이므로 특정 소스 IP만 허용한 버킷 정책은 그대로 통한다. |
| q258 | s3-bucket-policy-source-vpc-condition | keep | — | yes | (현재) | (현재) | false | 접근 경로를 특정 VPC로 좁히려면 허용을 좁히는 대신 aws:SourceVpc 값이 다른 요청을 거부해야 한다. |
| q259 | s3-website-endpoint-no-https | keep | — | yes | (현재) | (현재) | false | S3 정적 웹사이트 엔드포인트는 HTTPS를 지원하지 않으므로 버킷에 인증서를 붙이는 대신 앞에 CloudFront를 세우고 그 배포에 인증서를 붙인다. |
