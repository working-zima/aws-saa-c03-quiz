# phase 35 문항 topic 배정 감사 — 집계 보고서

이 파일과 `by-topic/`의 주제 파일은 `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/worksheet.jsonl`에서
만든다. **숫자는 전부 스크립트가 센 값이다.** 손으로 고치지 말고, 판정을 고친 뒤 스크립트를 다시 돌린다.
이 보고서는 조사 결과이고 **문항 이동은 아직 승인되지 않았다** — 재배정은 별도 phase에서 한다.

## 판정 기준 — ADR-034

문항의 주제는 시나리오에 등장하는 서비스가 아니라 **정답을 오답과 가르는 결정적 지식**(`decidingKnowledge`)이
정한다. 그 지식을 설명하는 개념이 primary concept이고 그 개념의 주제가 primary topic이며, 정답 구성에 함께 쓰이지만
답을 가르지 않는 지식은 `secondaryTopics`에 기록만 한다. 판정은 결정 지식을 한 문장으로 쓰고, 시나리오 서비스를 같은
계열의 다른 서비스로 바꿔 보고, 오답 셋이 무엇을 오해했는지 본 뒤, 여러 서비스가 조합되면 답을 가르는 쪽을 primary로
잡는 순서로 하며, 이것들이 한 곳을 가리키지 않으면 억지로 옮기지 않고 `ambiguous`로 남긴다. `conceptFit`은 지금
연결된 개념이 그 중심 지식 자체를 직접 설명하는지를 따로 재는 축이다. `coverageConflict`·`retarget`은 판정 뒤에
계산하는 구현 제약이라 의미 판정을 뒤집는 근거가 되지 않고, 실제 재배정은 `topicId`와 `conceptId`를 함께 옮기는 일이다.

## 1. 판정 수와 누락·중복

판정 732건을 워크시트 문항 732건과 문항 id 집합으로 대조했다.

| 항목 | 건수 |
| --- | --- |
| 판정 | 732 |
| 워크시트 문항 | 732 |
| 누락 | 0 |
| 중복 | 0 |
| 워크시트에 없는 id | 0 |
| 현재 topicId·conceptId와 다른 줄 | 0 |

누락·중복이 하나라도 있으면 이 스크립트는 보고서를 쓰지 않고 실패한다.

## 2. verdict

| verdict | 수 | 비율 |
| --- | --- | --- |
| keep | 715 | 97.7% |
| ambiguous | 10 | 1.4% |
| move-recommended | 7 | 1.0% |
| 합계 | 732 | 100.0% |

## 3. move-recommended의 confidence

move-recommended 7건의 확신도다.

| confidence | 수 | 문항 |
| --- | --- | --- |
| high | 6 | q153 · q154 · q223 · q225 · q465 · q508 |
| medium | 1 | q152 |
| low | 0 | 없음 |

## 4. conceptFit

| conceptFit | 수 | 비율 | 문항 |
| --- | --- | --- | --- |
| yes | 711 | 97.1% | — |
| partial | 21 | 2.9% | q037 · q043 · q045 · q046 · q061 · q065 · q068 · q080 · q081 · q086 · q153 · q154 · q159 · q165 · q223 · q225 · q344 · q400 · q472 · q508 · q728 |
| no | 0 | 0.0% | 없음 |

## 5. 현재 topic → 권장 topic별 이동 후보

move-recommended 7건이 주제 쌍 5개로 묶인다.

| 현재 topic | 권장 topic | 수 | 문항 |
| --- | --- | --- | --- |
| `waf-shield` | `cloudfront-global-accelerator` | 3 | q152 · q153 · q154 |
| `elastic-load-balancing` | `secrets-encryption` | 1 | q465 |
| `lambda` | `rds-storage-features` | 1 | q508 |
| `security-groups-nacl` | `waf-shield` | 1 | q225 |
| `cloudwatch-xray` | `emr-glue-athena` | 1 | q223 |

## 6. 주제별 문항 수와 이동 후보 비율

주제 순서는 `topics.json` 배열 순서다. 이동 후보 비율은 그 주제의 move-recommended 수 ÷ 그 주제의 문항 수이고,
들어올 후보는 다른 주제에서 이 주제를 권장한 move-recommended다.

| # | 주제 | 제목 | 문항 | keep | ambiguous | move | 이동 후보 비율 | 들어올 후보 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [aws-core-services](by-topic/aws-core-services.md) | AWS 핵심 서비스·리전·가용 영역·온프레미스 | 18 | 18 | 0 | 0 | 0.0% | 0 |
| 2 | [s3-storage-classes](by-topic/s3-storage-classes.md) | S3 스토리지 클래스 유형 | 17 | 17 | 0 | 0 | 0.0% | 0 |
| 3 | [s3-versioning-lifecycle](by-topic/s3-versioning-lifecycle.md) | S3 버전 관리·객체 잠금·수명 주기·복제 | 16 | 16 | 0 | 0 | 0.0% | 0 |
| 4 | [s3-encryption-batch](by-topic/s3-encryption-batch.md) | S3 암호화(SSE)·Batch Operations·인벤토리 | 16 | 16 | 0 | 0 | 0.0% | 0 |
| 5 | [s3-access-control](by-topic/s3-access-control.md) | S3 접근 제어·액세스 포인트·Storage Lens | 13 | 13 | 0 | 0 | 0.0% | 0 |
| 6 | [ebs-instance-store](by-topic/ebs-instance-store.md) | EBS·인스턴스 스토어·스냅샷·배치 그룹 | 16 | 16 | 0 | 0 | 0.0% | 0 |
| 7 | [efs-fsx](by-topic/efs-fsx.md) | EFS·FSx(Windows·Lustre·ONTAP) | 32 | 31 | 1 | 0 | 0.0% | 0 |
| 8 | [data-transfer-services](by-topic/data-transfer-services.md) | DataSync·Snowball Edge·Transfer Family·S3 전송 | 20 | 19 | 1 | 0 | 0.0% | 0 |
| 9 | [storage-gateway-migration](by-topic/storage-gateway-migration.md) | Storage Gateway·DMS·Application Migration Service | 13 | 13 | 0 | 0 | 0.0% | 0 |
| 10 | [rds-storage-features](by-topic/rds-storage-features.md) | RDS 스토리지 유형과 기능 | 28 | 28 | 0 | 0 | 0.0% | 1 (q508) |
| 11 | [aurora](by-topic/aurora.md) | Aurora·Aurora Serverless·글로벌 데이터베이스 | 21 | 20 | 1 | 0 | 0.0% | 0 |
| 12 | [dynamodb](by-topic/dynamodb.md) | DynamoDB | 20 | 20 | 0 | 0 | 0.0% | 0 |
| 13 | [elasticache-purpose-built-db](by-topic/elasticache-purpose-built-db.md) | ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream | 16 | 16 | 0 | 0 | 0.0% | 0 |
| 14 | [ec2-autoscaling](by-topic/ec2-autoscaling.md) | EC2 인스턴스 유형·구매 옵션·Auto Scaling | 24 | 24 | 0 | 0 | 0.0% | 0 |
| 15 | [elastic-load-balancing](by-topic/elastic-load-balancing.md) | ALB·NLB·Gateway Load Balancer | 20 | 18 | 1 | 1 | 5.0% | 0 |
| 16 | [cloudfront-global-accelerator](by-topic/cloudfront-global-accelerator.md) | CloudFront·Global Accelerator·엣지 함수 | 27 | 27 | 0 | 0 | 0.0% | 3 (q152 · q153 · q154) |
| 17 | [lambda](by-topic/lambda.md) | Lambda | 25 | 23 | 1 | 1 | 4.0% | 0 |
| 18 | [ecs-eks-fargate](by-topic/ecs-eks-fargate.md) | ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk | 25 | 25 | 0 | 0 | 0.0% | 0 |
| 19 | [api-gateway-step-functions](by-topic/api-gateway-step-functions.md) | API Gateway·Step Functions | 25 | 24 | 1 | 0 | 0.0% | 0 |
| 20 | [sqs-sns-eventbridge](by-topic/sqs-sns-eventbridge.md) | SQS·SNS·EventBridge·Amazon MQ·SES | 40 | 40 | 0 | 0 | 0.0% | 0 |
| 21 | [backup-disaster-recovery](by-topic/backup-disaster-recovery.md) | AWS Backup·재해 복구 전략·Elastic Disaster Recovery | 11 | 11 | 0 | 0 | 0.0% | 0 |
| 22 | [vpc-networking](by-topic/vpc-networking.md) | VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링 | 22 | 22 | 0 | 0 | 0.0% | 0 |
| 23 | [security-groups-nacl](by-topic/security-groups-nacl.md) | 보안 그룹·NACL | 17 | 16 | 0 | 1 | 5.9% | 0 |
| 24 | [hybrid-connectivity](by-topic/hybrid-connectivity.md) | Site-to-Site VPN·Direct Connect·Transit Gateway | 24 | 24 | 0 | 0 | 0.0% | 0 |
| 25 | [route53](by-topic/route53.md) | Route 53 | 16 | 16 | 0 | 0 | 0.0% | 0 |
| 26 | [emr-glue-athena](by-topic/emr-glue-athena.md) | EMR·Spark·Glue·Athena·Lake Formation | 21 | 21 | 0 | 0 | 0.0% | 1 (q223) |
| 27 | [kinesis-streaming](by-topic/kinesis-streaming.md) | Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK | 17 | 17 | 0 | 0 | 0.0% | 0 |
| 28 | [redshift-opensearch-quicksight](by-topic/redshift-opensearch-quicksight.md) | Redshift·Redshift Spectrum·OpenSearch·QuickSight | 11 | 11 | 0 | 0 | 0.0% | 0 |
| 29 | [cloudwatch-xray](by-topic/cloudwatch-xray.md) | CloudWatch·X-Ray·Performance Insights·Managed Grafana | 11 | 9 | 1 | 1 | 9.1% | 0 |
| 30 | [secrets-encryption](by-topic/secrets-encryption.md) | Secrets Manager·Parameter Store·KMS·ACM·CloudHSM | 23 | 22 | 1 | 0 | 0.0% | 1 (q465) |
| 31 | [waf-shield](by-topic/waf-shield.md) | WAF·Shield·Firewall Manager | 20 | 17 | 0 | 3 | 15.0% | 1 (q225) |
| 32 | [guardduty-macie-inspector](by-topic/guardduty-macie-inspector.md) | GuardDuty·Macie·Inspector·Security Hub | 12 | 11 | 1 | 0 | 0.0% | 0 |
| 33 | [iam-permissions](by-topic/iam-permissions.md) | IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer | 23 | 23 | 0 | 0 | 0.0% | 0 |
| 34 | [identity-federation](by-topic/identity-federation.md) | IAM Identity Center·STS·Cognito·Directory Service·SAML | 13 | 13 | 0 | 0 | 0.0% | 0 |
| 35 | [organizations-cloudtrail-config](by-topic/organizations-cloudtrail-config.md) | Organizations·SCP·CloudTrail·Config·Audit Manager | 18 | 18 | 0 | 0 | 0.0% | 0 |
| 36 | [cost-management](by-topic/cost-management.md) | 절약 플랜·Budgets·Cost Explorer·Trusted Advisor | 19 | 18 | 1 | 0 | 0.0% | 0 |
| 37 | [governance-iac](by-topic/governance-iac.md) | CloudFormation·Service Catalog·Control Tower·RAM | 7 | 7 | 0 | 0 | 0.0% | 0 |
| 38 | [systems-manager](by-topic/systems-manager.md) | Systems Manager·AppConfig·EC2 Instance Connect | 8 | 8 | 0 | 0 | 0.0% | 0 |
| 39 | [ai-ml-services](by-topic/ai-ml-services.md) | SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract | 7 | 7 | 0 | 0 | 0.0% | 0 |

주제 39개의 문항 합 732건 · 전체 판정 732건.
이동 후보가 나가는 주제 5개, 들어오는 주제 5개.

## 7. 바로 재연결 가능한 이동 후보 — retarget=ready 4건

권장 개념이 있고 문항 단위로는 현재 개념의 유일한 문항이 아닌 후보다. 한 개념에서 여러 후보가 함께 나가 그 개념이
비는 경우는 9절 「개념 단위로 본 제약」에 따로 있다.

| id | 현재 개념 | 권장 개념 | confidence | conceptFit | decidingKnowledge |
| --- | --- | --- | --- | --- | --- |
| q153 | `waf-shield.cloudfront` | `cloudfront-global-accelerator.cloudfront-ttl` | high | partial | 캐시 무효화는 엣지에 남은 캐시 사본을 강제로 지워 TTL이 남아 있어도 다음 요청부터 원본의 새 결과를 가져오게 한다. |
| q154 | `waf-shield.cloudfront` | `cloudfront-global-accelerator.cloudfront-multiple-origins` | high | partial | CloudFront의 멀티 오리진은 배포 하나에 여러 원본을 등록하고 요청 경로별로 응답할 원본을 나누는 기능이다. |
| q465 | `elastic-load-balancing.end-to-end-encryption-behind-alb` | `secrets-encryption.acm` | high | yes | 인증서 발급과 갱신을 관리형 서비스에 맡기면 직접 발급·반입·교체하는 방식보다 인증서 수명 주기의 운영 부담이 줄어든다. |
| q508 | `lambda.serverless-runtime-no-os-access` | `rds-storage-features.rds-custom` | high | partial | 일반 RDS는 OS 접근을 허용하지 않으므로 관리형 관계형 데이터베이스에서 OS 설정을 직접 바꿔야 하면 RDS Custom을 선택한다. |

## 8. 추가 설계가 필요한 후보 — retarget=needs-design 3건

| id | 현재 개념 | 권장 topic | 권장 개념 | 사유 | confidence | conceptFit |
| --- | --- | --- | --- | --- | --- | --- |
| q152 | `waf-shield.cloudfront` | `cloudfront-global-accelerator` | 없음 | 대상 개념 없음 | medium | yes |
| q223 | `cloudwatch-xray.log-analysis-options` | `emr-glue-athena` | `emr-glue-athena.log-storage-s3-athena` | coverageConflict | high | partial |
| q225 | `security-groups-nacl.nacl-rule-limit` | `waf-shield` | `waf-shield.waf-rule-types` | coverageConflict | high | partial |

- **대상 개념 없음** 1건 — 권장 주제에 결정 지식을 중심으로 설명하는 개념이 없다. 옮기려면 추가 설계가 필요하다(ADR-034).
- **coverageConflict** 2건 — 현재 개념의 유일한 문항이라 옮기면 그 개념에 문항이 남지 않는다(ADR-026). 재배정 phase에서 대체 문항이나 개념 재연결로 푼다(ADR-034).

## 9. coverageConflict — 2건

| id | 현재 개념 | 개념의 문항 수 | 권장 개념 | verdict |
| --- | --- | --- | --- | --- |
| q223 | `cloudwatch-xray.log-analysis-options` | 1 | `emr-glue-athena.log-storage-s3-athena` | move-recommended |
| q225 | `security-groups-nacl.nacl-rule-limit` | 1 | `waf-shield.waf-rule-types` | move-recommended |

### 개념 단위로 본 제약

문항 단위 `coverageConflict`는 현재 개념의 **유일한** 문항만 잡는다. 이동 후보를 모두 옮기면 문항이 0개가 되는
개념을 개념 단위로 다시 세면 3개다.

| 개념 | 개념의 문항 수 | 이동 후보 | 문항 단위 coverageConflict로 잡힘 |
| --- | --- | --- | --- |
| `waf-shield.cloudfront` | 3 | q152 · q153 · q154 | 아니요 |
| `cloudwatch-xray.log-analysis-options` | 1 | q223 | 예 |
| `security-groups-nacl.nacl-rule-limit` | 1 | q225 | 예 |

## 10. move-recommended + conceptFit=yes — 2건

현재 개념이 중심 지식을 직접 설명하는데도 다른 주제를 권한 자리다. 개념은 맞고 주제 경계가 어긋난 경우이며,
이유는 각 판정의 `rationale`을 그대로 옮긴다.

### q152 · `waf-shield` → `cloudfront-global-accelerator`

- 문제문: 원본에 접근할 수 있는 주체를 CloudFront로만 한정하는 기능은 무엇인가?
- 현재 개념 `waf-shield.cloudfront` · 권장 개념 없음 · confidence medium · retarget needs-design
- 결정 지식: OAC는 원본에 접근할 수 있는 주체를 CloudFront로 한정해 배포를 거치지 않고 원본에 직접 닿는 경로를 막는 CloudFront의 기능이다.
- 이유: 오답의 캐시 무효화·멀티 오리진은 CloudFront의 다른 기능이고 IP 세트는 WAF 규칙이라, 답을 가르는 것은 CloudFront 기능들의 구분이다. 현재 개념이 OAC를 한 문장으로 직접 정의해 conceptFit은 yes지만 q153·q154처럼 CloudFront 기능 문항은 전송 주제가 경계에 맞다. 그 주제에서 OAC를 담은 cloudfront-s3-upload-with-oac는 업로드 경로가 중심이라 대상 주제에 맞는 개념이 없어 권장 개념을 null로 두고, 원본 보호 수단으로 읽을 여지가 있어 confidence는 medium이다.

### q465 · `elastic-load-balancing` → `secrets-encryption`

- 문제문: 로드 밸런서 뒤 구간까지 TLS로 두기로 하자 관리해야 하는 인증서가 늘어난 상황이다. 이때 운영 부담을 가장 작게 하는 선택은 무엇인가?
- 현재 개념 `elastic-load-balancing.end-to-end-encryption-behind-alb` · 권장 개념 `secrets-encryption.acm` · confidence high · retarget ready
- 결정 지식: 인증서 발급과 갱신을 관리형 서비스에 맡기면 직접 발급·반입·교체하는 방식보다 인증서 수명 주기의 운영 부담이 줄어든다.
- 이유: 로드 밸런서 뒤 구간을 다른 인증서 사용처로 바꿔도 답은 같고, 오답 셋은 자체 서명·외부 반입·하드웨어 키 관리로 인증서 관리 책임을 달리한다. 현재 개념도 수명 주기 책임이라는 결정 축을 직접 설명하므로 conceptFit은 yes지만 이 문항에는 TLS 구간 구성 지식이 필요하지 않아, 발급·갱신을 맡는 ACM을 중심으로 한 보안 주제로 이동을 권한다.

## 11. keep + conceptFit=no — 0건

없음.

참고로 keep + conceptFit=partial은 14건이다. 주제는 맞고 같은 주제 안의 다른 개념이 결정 지식을 더 직접
설명하는 자리라, 판정은 개념 연결만 바꾸기를 권한다.

| id | 주제 | 현재 개념 | 권장 개념 |
| --- | --- | --- | --- |
| q037 | `s3-encryption-batch` | sse-types | sse-kms-cost |
| q043 | `efs-fsx` | efs | efs-lifecycle-management |
| q045 | `efs-fsx` | fsx | fsx-lustre-s3-data-repository-association |
| q046 | `efs-fsx` | fsx | fsx-ontap-multi-protocol-tiering |
| q061 | `rds-storage-features` | features | rds-multi-az-db-cluster |
| q065 | `rds-storage-features` | features | rds-blue-green-deployment |
| q068 | `aurora` | aurora | aurora-replica-auto-scaling |
| q080 | `elastic-load-balancing` | elb | nlb-udp-listener |
| q081 | `elastic-load-balancing` | elb | gateway-load-balancer |
| q086 | `lambda` | lambda | lambda-reserved-concurrency |
| q159 | `identity-federation` | identity-center | identity-center-permission-set |
| q165 | `cost-management` | savings-plan | savings-plan-details |
| q344 | `efs-fsx` | efs-ia-file-size-threshold | efs-lifecycle-management |
| q472 | `cloudfront-global-accelerator` | global-accelerator-static-ip | global-accelerator-protocols |

## 12. ambiguous 전체 목록과 핵심 쟁점 — 10건

주제 경계를 한 곳으로 정하지 못한 문항이다. 두 해석은 각 판정의 `rationale`을 한 줄씩 줄여 옮긴 것이다.
판정의 `recommendedTopic`·`recommendedConceptId`는 잠정 지목일 뿐 이동 권고가 아니다.

| 다른 해석의 주제 | 수 | 문항 |
| --- | --- | --- |
| `sqs-sns-eventbridge` | 5 | q364 · q497 · q656 · q667 · q684 |
| `data-transfer-services` | 1 | q348 |
| `backup-disaster-recovery` | 1 | q400 |
| `route53` | 1 | q459 |
| `cloudfront-global-accelerator` | 1 | q538 |
| `ec2-autoscaling` | 1 | q728 |

### q348 · EFS 복제의 단방향 제약 ↔ DataSync 작업 구성

- 문제문: 두 리전의 애플리케이션이 각자 파일을 쓰고, 양쪽에서 쓴 내용이 서로 반영되어야 하는 상황이다. EFS 자체 복제로는 이 구성이 되지 않는다. 어떻게 구성해야 하는가?
- conceptFit yes · 잠정 지목 `efs-fsx.efs-replication-one-way` · secondaryTopics `data-transfer-services`
- `efs-fsx` 주제로 읽으면: EFS 자체 복제가 단방향이라는 제약과 그 대안을 고르는 문제다. 현재 개념이 두 구성을 직접 설명한다.
- `data-transfer-services` 주제로 읽으면: 문제문이 자체 복제 불가를 이미 알려 주고 해설이 관리형 증분 전송을 rsync·SFTP와 비교하므로 DataSync 작업 구성 문제다. 그 주제에는 양방향 작업을 직접 설명하는 개념이 없다.

### q364 · DataSync 상태 이벤트 ↔ EventBridge·SNS 알림 패턴

- 문제문: 야간에 실행되는 DataSync 작업이 성공했는지 실패했는지를 운영 팀이 이메일로 받아야 하는 상황이다. 관리할 코드는 늘리지 않으려 한다. 어떻게 구성해야 하는가?
- conceptFit yes · 잠정 지목 `data-transfer-services.datasync-task-status-event` · secondaryTopics `sqs-sns-eventbridge`
- `data-transfer-services` 주제로 읽으면: DataSync가 성공·오류 상태 변화를 이벤트로 낸다는 기능을 알아야 매니페스트·Transfer Family 로그 보기를 배제한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 이벤트 소스를 바꿔도 EventBridge 규칙과 SNS가 폴링 코드를 대신하는 논리가 같다(`eventbridge-event-pattern-vs-polling`).

### q400 · Aurora 클론의 적용 범위 ↔ 서비스 백업 보존 한계를 넘는 AWS Backup

- 문제문: RDS for Oracle 인스턴스의 백업을 35일보다 오래 보존해야 하는 상황이다. 특정 시점 복원도 할 수 있어야 한다. 이때 어떤 방법이 알맞은가?
- conceptFit partial · 잠정 지목 `backup-disaster-recovery.backup-long-term-retention` (다른 주제) · secondaryTopics `rds-storage-features`
- `aurora` 주제로 읽으면: 해설이 클론은 Aurora 전용이라 일반 RDS에 쓸 수 없다는 대비를 정답 근거 앞자리에 두므로 클론의 적용 범위를 확인하는 문항이다.
- `backup-disaster-recovery` 주제로 읽으면: 대상을 DynamoDB·EFS로 바꿔도 자동 백업 35일을 넘는 보존과 시점 복원은 AWS Backup 계획이라는 논리가 같다(`backup-long-term-retention`).

### q459 · 내부 로드 밸런서 ↔ 사설 이름 해석(호스팅 영역)

- 문제문: 내부 관리 도구를 사설 네트워크에서만 사용하게 해야 하는 상황이다. 접근할 수 있는 범위는 VPC 안과 VPN·Direct Connect로 이어진 사설 네트워크뿐이다. 그 도구의 이름도 인터넷에서 조회되지 않아야 한다. 이때 알맞은 조합은 무엇인가?
- conceptFit yes · 잠정 지목 `elastic-load-balancing.internal-load-balancer` · secondaryTopics `route53` · `hybrid-connectivity`
- `elastic-load-balancing` 주제로 읽으면: 내부 로드 밸런서의 사설 주소와 DNS 공개 여부를 구분하는 구성 문제다. 현재 개념이 두 조건을 직접 설명한다.
- `route53` 주제로 읽으면: 퍼블릭·프라이빗 호스팅 영역을 가른 두 보기는 내부 로드 밸런서 지식만으로 고를 수 없어 이름 해석 지식이 따로 필요하다.

### q497 · Lambda 동시 실행 한도 진단 ↔ 큐로 급증분을 보관하는 통합 패턴

- 문제문: 판매 행사 기간에 호출이 몰리는 상황이다. 함수가 TooManyRequestsException을 내며 요청을 거절하기 시작했다. 들어온 요청을 잃지 않으려면 어떻게 구성해야 하는가?
- conceptFit yes · 잠정 지목 `lambda.lambda-concurrency-limit-throttling` · secondaryTopics `sqs-sns-eventbridge`
- `lambda` 주제로 읽으면: TooManyRequestsException과 예약된 동시성·메모리 설정의 한계를 진단하는 문제다. 현재 개념이 대응까지 직접 설명한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 처리량이 제한된 다른 소비자로 바꿔도 큐가 급증분을 보관하고 알림은 버퍼가 아니라는 논리가 같다(`sns-is-not-a-queue`).

### q538 · HTTP API를 CloudFront 오리진으로 연동 ↔ 한 배포의 여러 오리진과 엣지 캐싱

- 문제문: 정적 파일은 S3에 두고 동적 응답은 HTTP API가 내주는 애플리케이션이 있다. 이 애플리케이션을 전 세계 사용자에게 내보내면서 지연도 줄이고 오리진 호출도 줄여야 하는 상황이다. 구성 요소를 더 늘리지 않고 이 둘을 함께 해결하는 구성은 무엇인가?
- conceptFit yes · 잠정 지목 `api-gateway-step-functions.api-gateway-behind-cloudfront` · secondaryTopics `cloudfront-global-accelerator`
- `api-gateway-step-functions` 주제로 읽으면: HTTP API를 오리진으로 등록하는 연동 지식이 답을 가르고, WebSocket 유형 변경·사용자 지정 도메인만으로는 요구를 채우지 못한다.
- `cloudfront-global-accelerator` 주제로 읽으면: 동적 원본을 바꿔도 한 배포의 여러 오리진과 엣지 캐싱으로 지연·원본 호출을 줄인다는 전송 지식이 남는다(q154·q468과 같은 구조).

### q656 · CloudWatch 알람 상태 변경 이벤트 ↔ EventBridge 규칙의 직접 대상 호출

- 문제문: CloudWatch 알람이 임계값을 넘어 상태를 바꾸는 순간에 곧바로 조치가 이뤄지게 하려는 상황이다. 사람 손을 거치지 않으면서 함수 코드도 따로 유지하지 않아도 되는 구성은 무엇인가?
- conceptFit yes · 잠정 지목 `cloudwatch-xray.cloudwatch-alarm-state-change-event` · secondaryTopics `sqs-sns-eventbridge`
- `cloudwatch-xray` 주제로 읽으면: 알람의 상태 변경 자체가 이벤트로 나간다는 기능이 상세 모니터링만으로는 대응할 수 없음을 가른다. 현재 개념이 이 연결을 직접 설명한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 상태 변경 소스를 바꿔도 함수 경유와 사람 알림을 배제하는 것은 EventBridge 규칙이 대상을 직접 부른다는 통합 지식이다.

### q667 · ACM 만료 임박 이벤트 ↔ 이벤트 기반 알림 패턴

- 문제문: 가져온 인증서의 만료가 다가오면 담당자가 메일로 통보받게 하려는 상황이다. 새로 작성할 코드가 없는 구성은 무엇인가?
- conceptFit yes · 잠정 지목 `secrets-encryption.acm-expiration-event` · secondaryTopics `sqs-sns-eventbridge`
- `secrets-encryption` 주제로 읽으면: ACM이 만료 임박 이벤트를 발행한다는 기능이 날짜를 계산하는 함수와 도메인 검증 방식 보기를 배제한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 이벤트 소스를 바꿔도 코드 없는 구성을 가르는 것은 폴링 대신 이벤트 패턴, 알림에는 큐가 아니라 SNS라는 통합 지식이다.

### q684 · Macie 탐지 결과의 EventBridge 전달 ↔ 알림 자리에 큐를 두지 않는 통합 패턴

- 문제문: 민감 데이터 탐지 결과가 나오면 보안 팀이 콘솔을 열어 보지 않아도 통보를 받게 하려는 상황이다. 이때 알맞은 구성은 무엇인가?
- conceptFit yes · 잠정 지목 `guardduty-macie-inspector.macie-finding-to-eventbridge` · secondaryTopics `sqs-sns-eventbridge`
- `guardduty-macie-inspector` 주제로 읽으면: Macie 탐지 결과가 EventBridge로 나가 유형별로 걸러진다는 기능이 저장 데이터를 보지 않는 GuardDuty 보기를 배제한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 탐지 서비스를 바꿔도 큐·버킷 두 오답을 가르는 것은 알림이 필요한 곳에 큐를 두지 않는다는 지식이다(`sns-is-not-a-queue`).

### q728 · 용량 예약·절약 플랜과의 비용 비교 ↔ 중단 허용 작업의 스팟 적합성

- 문제문: 중단되어도 재시작하면 그만인 배치 작업을 인스턴스에서 실행하려 한다. 언제까지 끝나야 한다는 요구는 없고 비용만 가장 낮추면 되는 상황이다. 이때 알맞은 선택은 무엇인가?
- conceptFit partial · 잠정 지목 `ec2-autoscaling.spot-workload-fit` (다른 주제) · secondaryTopics 없음
- `cost-management` 주제로 읽으면: 오답 둘이 절약 플랜이고, 약정 할인보다 낮은 비용과 용량 확보의 차이를 현재 개념이 직접 다룬다.
- `ec2-autoscaling` 주제로 읽으면: 중단을 견디는 배치 작업에 스팟을 고르는 문제로 보면 `spot-workload-fit`이 중심 대상을 더 직접 설명한다.

## 13. step별 분포와 급변 경고

### index.json summary에 기록된 분포

각 step이 끝날 때 `summary`에 적은 분포를 읽어 옮겼다. 판정 묶음은 그 step이 새로 판정한 문항만 센 값이다.

| step | 이름 | 판정 | keep | ambiguous | move | confidence high·medium·low | conceptFit yes·partial·no |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | sample-verdicts | 40 | 37 | 1 | 2 | 2·0·0 | 37·3·0 |
| 3 | verdicts-s3-block | 85 | 85 | 0 | 0 | 0·0·0 | 84·1·0 |
| 4 | verdicts-file-db | 86 | 85 | 1 | 0 | 0·0·0 | 80·6·0 |
| 5 | verdicts-db-compute | 79 | 78 | 1 | 0 | 0·0·0 | 78·1·0 |
| 6 | verdicts-delivery-serverless | 94 | 90 | 2 | 2 | 2·0·0 | 89·5·0 |
| 7 | verdicts-integration-backup | 75 | 75 | 0 | 0 | 0·0·0 | 75·0·0 |
| 8 | verdicts-network | 73 | 72 | 0 | 1 | 1·0·0 | 72·1·0 |
| 9 | verdicts-analytics-observability | 55 | 55 | 0 | 0 | 0·0·0 | 55·0·0 |
| 10 | verdicts-security | 76 | 72 | 2 | 2 | 1·1·0 | 75·1·0 |
| 11 | verdicts-identity-cost-ops | 69 | 68 | 1 | 0 | 0·0·0 | 66·3·0 |
| — | 판정 묶음 합계 | 732 | 717 | 8 | 7 | 6·1·0 | 711·21·0 |
| 12 | consistency-pass (전체 재집계) | 732 | 715 | 10 | 7 | 6·1·0 | 711·21·0 |
| — | 현재 판정 파일 | 732 | 715 | 10 | 7 | 6·1·0 | 711·21·0 |

- 판정 묶음 합계와 현재 판정 파일의 차이: keep −2 · ambiguous +2
- step 12 consistency-pass 기록과 현재 판정 파일의 차이: 없음

### 급변 경고

무인 실행기가 판정 묶음마다 걸던 규칙을 위 기록에 다시 적용했다 — 그 묶음의 이동 권고 비율이 앞 묶음 누적 비율보다
max(25%, 누적×3+5%p)를 넘거나, 누적이 10%를 넘는데 그 3분의 1 아래로 떨어지면 경고다.
경고 0건이다.

### 판정 파일의 step 필드로 다시 센 분포

`step` 필드는 그 문항을 처음 판정한 묶음이다. 뒤 step이 고친 판정은 아래 마지막 칸에서 기록과 다르게 드러난다.

| step | 판정 | keep | ambiguous | move | confidence high·medium·low | conceptFit yes·partial·no | summary 기록 이후 바뀐 판정 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 40 | 37 | 1 | 2 | 2·0·0 | 37·3·0 | — |
| 3 | 85 | 85 | 0 | 0 | 0·0·0 | 84·1·0 | — |
| 4 | 86 | 85 | 1 | 0 | 0·0·0 | 80·6·0 | — |
| 5 | 79 | 78 | 1 | 0 | 0·0·0 | 78·1·0 | — |
| 6 | 94 | 90 | 2 | 2 | 2·0·0 | 89·5·0 | — |
| 7 | 75 | 74 | 1 | 0 | 0·0·0 | 75·0·0 | q538 keep→ambiguous |
| 8 | 73 | 72 | 0 | 1 | 1·0·0 | 72·1·0 | — |
| 9 | 55 | 54 | 1 | 0 | 0·0·0 | 55·0·0 | q656 keep→ambiguous |
| 10 | 76 | 72 | 2 | 2 | 1·1·0 | 75·1·0 | — |
| 11 | 69 | 68 | 1 | 0 | 0·0·0 | 66·3·0 | — |

## 14. q364의 최종 판정과 근거

- verdict **ambiguous** · conceptFit **yes** · confidence —
- 현재 개념 `data-transfer-services.datasync-task-status-event` · 지목 개념 `data-transfer-services.datasync-task-status-event` · secondaryTopics `sqs-sns-eventbridge`
- 문제문: 야간에 실행되는 DataSync 작업이 성공했는지 실패했는지를 운영 팀이 이메일로 받아야 하는 상황이다. 관리할 코드는 늘리지 않으려 한다. 어떻게 구성해야 하는가?
- 결정 지식: DataSync가 작업 실행의 성공·오류 상태 변화를 이벤트로 내보내므로 EventBridge 규칙에서 SNS로 연결하면 상태를 폴링하는 코드 없이 이메일로 알릴 수 있다.
- 근거: DataSync가 SUCCESS/ERROR 상태 이벤트를 제공한다는 지식으로 보면 매니페스트·Transfer Family 로그를 배제하는 서비스 기능 문제이고, 현재 개념이 상태 이벤트 지원과 폴링 대안을 중심으로 설명하므로 conceptFit은 yes다. 반면 다른 이벤트 소스로 바꿔도 EventBridge 규칙과 SNS가 폴링 코드를 대신하는 논리가 같고 해설도 CloudWatch 경보에 비유하므로 sqs-sns-eventbridge.eventbridge-event-pattern-vs-polling의 통합 패턴 문제라는 해석이 남아, 현 개념을 잠정 지목하고 주제는 ambiguous로 둔다.
- `data-transfer-services` 주제로 읽으면: DataSync가 성공·오류 상태 변화를 이벤트로 낸다는 기능을 알아야 매니페스트·Transfer Family 로그 보기를 배제한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 이벤트 소스를 바꿔도 EventBridge 규칙과 SNS가 폴링 코드를 대신하는 논리가 같다(`eventbridge-event-pattern-vs-polling`).
