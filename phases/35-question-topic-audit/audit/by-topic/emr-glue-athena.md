# EMR·Spark·Glue·Athena·Lake Formation

`emr-glue-athena` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 21개 · keep 21 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 21 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 1개 — q223(`cloudwatch-xray`)

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q123 | emr | keep | — | yes | (현재) | (현재) | false | 빅데이터 작업에 필요한 계산 자원을 내주는 것은 EMR이고, Redshift·Athena는 데이터를 담거나 질의하는 쪽, CloudWatch는 관찰하는 쪽이다. |
| q124 | spark | keep | — | yes | (현재) | (현재) | false | Spark는 여러 서버에 나눠 대량 데이터를 병렬 처리하는 오픈소스 엔진이지만 실시간 분석에는 알맞지 않다. |
| q125 | athena | keep | — | yes | (현재) | (현재) | false | Athena는 S3에 저장된 데이터를 다른 곳으로 옮기지 않고 SQL로 바로 조회하는 분석 서비스다. |
| q127 | glue | keep | — | yes | (현재) | (현재) | false | Glue는 추출·변환·적재를 관리하는 ETL 서비스이며 자체적으로 데이터를 분석하는 기능은 없다. |
| q222 | glue-crawler | keep | — | yes | (현재) | (현재) | false | S3 데이터를 훑어 구조를 파악해 Athena가 곧바로 질의할 수 있게 준비하는 것은 Glue Crawler이고, 변환·적재를 하는 Glue Job과 역할이 다르다. |
| q617 | emr-node-types | keep | — | yes | (현재) | (현재) | false | EMR 코어 노드는 분산 파일 시스템에 데이터를 저장하고 태스크 노드는 저장 없이 추가 처리만 맡는다. |
| q618 | emr-node-types | keep | — | yes | (현재) | (현재) | false | 태스크 노드는 데이터를 저장하지 않아 회수되어도 재시도로 끝나므로 스팟으로 두고, 데이터를 저장하는 코어와 클러스터를 관리하는 프라이머리는 온디맨드로 둔다. |
| q619 | glue-databrew | keep | — | yes | (현재) | (현재) | false | 분석 전에 값을 정리하고 형태를 고르게 맞추는 데이터 준비는 Glue DataBrew가 맡고, 구조 파악·조회·접근 제어는 다른 서비스의 몫이다. |
| q620 | lake-formation | keep | — | yes | (현재) | (현재) | false | Lake Formation 데이터 필터는 행 수준과 셀·열 수준까지 권한을 나누므로 민감한 열을 설정만으로 가릴 수 있고, IAM 정책만으로는 이 세분화가 되지 않는다. |
| q621 | emr-transient-cluster | keep | — | yes | (현재) | (현재) | false | 실행 구간이 한정된 배치 작업은 작업이 끝나면 스스로 종료되는 일시적 클러스터로 돌려야 나머지 시간의 클러스터 비용이 사라진다. |
| q622 | emr-managed-scaling | keep | — | yes | (현재) | (현재) | false | 작업이 도는 도중에 노드가 노는 문제는 부하에 맞춰 노드를 더하고 빼는 관리형 스케일링이 해결하고, 일시적 클러스터는 클러스터 수명만 줄인다. |
| q623 | glue-etl-with-per-customer-kms-key | keep | — | yes | (현재) | (현재) | false | KMS와 통합된 관리형 ETL인 Glue 작업은 클러스터 운영 없이 고객별 키로 처리 위치에서 암호화하므로, 고객 수만큼 EMR 클러스터를 두는 구성보다 운영 부담이 작다. |
| q624 | athena-encrypted-and-pay-per-query | keep | — | yes | (현재) | (현재) | false | Athena는 서버리스라 쓰지 않는 동안 비용이 없고 스캔한 데이터에만 과금되며, KMS 연동으로 암호화된 S3 객체를 복호화 없이 그대로 조회한다. |
| q625 | athena-federated-query | keep | — | yes | (현재) | (현재) | false | Athena 페더레이션 쿼리는 커넥터로 S3 밖 데이터 소스를 옮기지 않고 질의하게 하지만, 임시 분석용이라 웨어하우스로 정기 대량 적재하는 경로로는 맞지 않는다. |
| q626 | log-storage-s3-athena | keep | — | yes | (현재) | (현재) | false | 오래 보관하며 가끔만 조회하는 대용량 로그는 S3에 두고 Athena로 읽을 때 가장 싸고, 상시 클러스터가 필요한 OpenSearch·EMR이나 실시간 관찰용 CloudWatch Logs는 비용과 용도가 맞지 않는다. |
| q627 | lake-formation-blueprint-and-athena | keep | — | yes | (현재) | (현재) | false | 블루프린트로 데이터베이스의 데이터를 레이크로 수집하고 시각화 도구가 Athena를 데이터 소스로 쓰면, Athena가 Lake Formation의 열 수준 권한을 적용해 조회한다. |
| q628 | lake-formation-lf-tags | keep | — | yes | (현재) | (현재) | false | Lake Formation LF 태그를 테이블·열·데이터베이스에 달고 역할에 태그 기준으로 권한을 주면, 리소스가 늘어도 권한 정의를 고치지 않는다. |
| q629 | emr-node-instance-family-choice | keep | — | yes | (현재) | (현재) | false | 데이터를 저장하고 처리하는 코어·태스크 노드에 워크로드가 요구하는 제품군을 쓰고, 클러스터 관리만 하는 프라이머리 노드는 범용으로 둔다. |
| q630 | emr-runtime-role | keep | — | yes | (현재) | (현재) | false | EMR 런타임 역할은 클러스터 전체의 인스턴스 프로파일 권한 대신 제출하는 작업마다 IAM 역할을 지정해 팀별 데이터 접근을 나눈다. |
| q631 | emr-security-configuration | keep | — | yes | (현재) | (현재) | false | EMR 보안 구성에 저장 중·전송 중 암호화를 묶어 클러스터에 적용하면 S3와 로컬 디스크의 데이터와 노드 간 통신이 함께 암호화된다. |
| q632 | parquet-columnar-format | keep | — | yes | (현재) | (현재) | false | Parquet은 데이터를 열 기준으로 담아 분석 쿼리가 필요한 열만 읽으면 되므로 읽는 양이 줄어든다. |
