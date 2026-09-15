# EMR·Spark·Glue·Athena·Lake Formation

`emr-glue-athena` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 20개 · keep 20 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 16 · false 4 · duplicateOf 1
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 20 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | emr | 대량 데이터를 처리할 컴퓨팅을 제공하는 빅데이터 처리 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | emr-node-types | EMR 클러스터에서 프라이머리·코어·태스크 노드가 관리·저장·처리 역할을 다르게 맡으므로, 데이터를 들고 있지 않은 태스크 노드만 스팟 인스턴스로 두어 비용을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 3 | emr-transient-cluster | 실행 구간이 한정된 배치 작업은 작업이 끝나면 종료되는 일시적 EMR 클러스터를 써야 유휴 시간의 클러스터 비용을 없앨 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | emr-managed-scaling | EMR 관리형 스케일링은 실행 중인 클러스터의 노드 수를 부하에 맞춰 조절해 유휴 노드 비용을 줄이며, 노드를 늘리거나 인스턴스 유형을 바꾸는 것으로는 유휴 시간이 줄지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | emr-node-instance-family-choice | 워크로드에 맞춘 인스턴스 제품군은 데이터를 저장·처리하는 코어·태스크 노드에 적용하고 관리만 하는 프라이머리 노드는 범용으로 두어야 성능이 실제 처리에 닿음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | emr-runtime-role | 여러 팀이 한 EMR 클러스터를 함께 쓸 때 작업마다 런타임 역할을 지정해야 팀별로 접근할 수 있는 데이터를 나누고 클러스터 자격 증명을 공유하지 않게 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | emr-security-configuration | EMR 보안 구성 하나로 S3·로컬 디스크의 저장 데이터와 노드 간 전송 데이터를 함께 암호화하며, 볼륨을 따로 붙이거나 접근 역할을 바꾸는 것은 암호화를 켜는 수단이 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | spark | Spark가 여러 서버에 나눠 대량 데이터를 병렬로 처리하는 엔진이지만 실시간 분석에 맞는 기술은 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | glue | 데이터를 꺼내고 변환해 적재하는 ETL은 분석할 데이터를 준비하는 단계이며 분석 자체와 역할이 다름을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 10 | glue-crawler | S3에 들어온 데이터를 바로 SQL로 분석하려면 Glue Crawler가 구조를 파악해 두고 Athena가 그 결과로 조회하며, 이것이 ETL 작업과 다른 역할임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | glue-databrew | Glue DataBrew는 분석 전에 데이터 값을 정리하고 형태를 맞추는 준비 도구이며 행·열 단위 접근 제어는 Lake Formation이 맡는다는 경계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | glue-etl-with-per-customer-kms-key | 고객별 키로 암호화해야 하는 ETL 작업은 관리형 Glue 작업의 KMS 통합으로 처리해야 고객 수만큼 EMR 클러스터를 운영하는 부담을 피할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | athena | Athena는 데이터를 S3에 둔 채 옮기지 않고 SQL로 곧바로 조회하는 분석 서비스라는 위치를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | athena-encrypted-and-pay-per-query | Athena는 서버리스라 쿼리가 스캔한 양만큼만 과금되어 가끔 하는 분석에 유리하고, KMS로 암호화된 객체도 조회할 수 있어 암호화 조건이 Athena를 배제하지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | athena-federated-query | Athena 페더레이션 쿼리는 커넥터로 S3 밖의 데이터 소스를 옮기지 않고 임시로 조회하는 기능이며, 데이터 웨어하우스로 정기 대량 적재하는 경로가 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | log-storage-s3-athena | 로그의 조회 빈도·응답 지연·보관 기간에 따라 장기 저장 후 조회와 상시 검색·모니터링의 비용을 다르게 판단해야 함을 이해한다. | keep | — | false | (현재) | cloudwatch-xray.log-analysis-options | 1 | ① |
| 17 | lake-formation | Lake Formation은 여러 소스에서 모은 데이터 레이크의 접근 권한을 한곳에서 정의하고 데이터 필터로 행·열·셀 수준까지 나눌 수 있어 IAM 정책만으로는 못 하는 세분화를 제공함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | lake-formation-blueprint-and-athena | Lake Formation 블루프린트로 데이터베이스의 데이터를 레이크로 수집하고 Athena를 거쳐 조회하면 열 수준 권한이 그대로 적용되어 시각화 도구에 접근 제어를 다시 만들 필요가 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | lake-formation-lf-tags | Lake Formation의 LF 태그로 리소스가 아니라 태그 기준으로 권한을 주면 테이블과 열이 늘어나도 권한 정의를 다시 고치지 않아도 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 20 | parquet-columnar-format | 열 단위로 저장하는 형식은 필요한 열만 읽어 분석 쿼리의 읽는 양을 줄이므로, 나중에 SQL로 조회할 데이터를 옮길 때 분석을 위한 형식으로 고른다는 것을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
