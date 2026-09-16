# S3 접근 제어·액세스 포인트·Storage Lens

`s3-access-control` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 13개 · keep 11 · ambiguous 2 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 12 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 11 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 2

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | s3-cross-account-bucket-policy | 다른 AWS 계정에 S3 버킷 접근을 열 때는 그 계정 ID를 지정한 버킷 정책을 붙이며, 복제나 서명된 URL과는 목적이 다르다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | s3-bucket-policy-source-vpc-condition | 버킷 접근을 특정 VPC로 좁히려면 aws:SourceVpc가 일치하지 않는 요청을 거부하는 버킷 정책을 써야 하며 허용문 조건이나 계정 조건으로는 같은 제한이 되지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | s3-account-level-public-access-block | S3 공개 액세스 차단을 계정 수준에 걸면 공개를 여는 버킷 정책·ACL을 재정의해 계정의 모든 버킷을 비공개로 유지한다는 범위를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | block-public-access-allows-explicit-grants | 공개 액세스 차단은 누구에게나 열리는 공개 접근만 막으므로 특정 소스 IP로 명시적으로 허용한 버킷 정책은 그대로 통하며, 정적 웹사이트 호스팅은 이 차단에 막힌다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | s3-presigned-url | S3 사전 서명된 URL은 버킷을 열지 않고 특정 객체의 업로드·다운로드를 유효 기간 동안만 허용한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | s3-access-grants | S3 Access Grants가 사용자·그룹을 저장 경로에 연결하고 임시 자격 증명을 발급해 접근을 나누는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | s3-access-point | S3 액세스 포인트는 버킷 하나에 별도 접근 경로를 여러 개 두어 접두사 단위 권한을 포인트마다 나누므로 버킷 정책 하나가 비대해지는 문제를 푼다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | s3-multi-region-access-point | 멀티 리전 액세스 포인트는 여러 리전 버킷을 글로벌 엔드포인트 하나로 묶어 가까운 버킷으로 요청을 보내고 리전 간 읽기를 액티브-액티브로 만든다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | s3-cors-not-authorization | CORS는 다른 오리진의 요청을 허용할 뿐 요청자를 인증하거나 대상을 좁히지 않으므로 외부 사용자의 안전한 업로드에는 사전 서명된 URL을 써야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 10 | s3-requester-pays | 요청자 부담 설정은 누가 읽을 수 있는지가 아니라 요청·다운로드 비용을 누가 내는지를 바꾸므로 다른 계정에 데이터를 제공하는 비용을 줄일 때 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | s3-website-endpoint-no-https | S3 정적 웹사이트 엔드포인트는 HTTPS를 지원하지 않으므로 HTTPS 제공에는 버킷을 오리진으로 둔 CloudFront 배포에 인증서를 붙여야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | s3-storage-lens | S3 Storage Lens는 계정 전반의 스토리지 사용 현황을 분석·보고하는 기능이라 객체 생성에 반응해 처리하는 이벤트 알림과 다르다는 것을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
| 13 | s3-storage-lens-advanced-activity-metrics | S3 Storage Lens의 고급 활동 메트릭을 켜면 접근 로그를 직접 모아 분석하지 않고도 계정 전체에서 더 이상 읽히지 않는 버킷을 찾아 스토리지 비용 절감 대상을 고를 수 있음을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
