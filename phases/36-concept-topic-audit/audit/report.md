# phase 36 개념 topic 배정 감사 — 집계 보고서

이 파일과 `by-topic/`의 주제 파일, [handoff-fixes.md](handoff-fixes.md)는 `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·
`audit/concepts.jsonl`·`audit/cross-phase35.jsonl`에서 만든다. **숫자는 전부 스크립트가 센 값이다.** 손으로 고치지 말고,
판정을 고친 뒤 스크립트를 다시 돌린다. 이 보고서는 조사 결과이고 **개념·문항 이동은 아직 승인되지 않았다** — 재배정은 별도
phase에서 하며 그 입력은 `handoff-fixes.md`다.

## 판정 기준 — ADR-035

개념의 주제는 이름에 들어간 서비스나 본문이 언급하는 서비스가 아니라 **그 개념을 학습한 뒤 이해해야 하는 중심 학습 목표**
(`learningGoal`)가 정한다. 다른 서비스를 언급해도 현재 서비스를 이해하는 데 필요한 통합·제약·비교·운영 판단이면 현재 주제에
남고, 비교의 축 자체가 학습 목표인 비교 개념도 현재 주제를 유지한다. 공통 기능은 "현재 서비스에서 어떻게 이용하는가"가
중심이면 남고 "공통 패턴 자체"가 중심이면 옮길 후보다. 한 곳을 가리키지 않으면 `ambiguous`로 남기고, `confidence`는
`move-recommended`에만 적는다. `duplicateOf`는 판정과 분리한 기록이고, 이동의 구현 비용(`blockImpact`)은 판정을 뒤집는
근거가 되지 않는다. 문항 판정(ADR-034)과는 독립으로 먼저 판정한 뒤 교차해 네 경우로 나눈다.

## 1. 판정 수와 누락·중복

판정 618건을 워크시트 개념 618건과 개념 id 집합으로 대조했다.

| 항목 | 건수 |
| --- | --- |
| 판정 | 618 |
| 워크시트 개념 | 618 |
| 누락 | 0 |
| 중복 | 0 |
| 워크시트에 없는 id | 0 |
| 워크시트와 topicId·questionIds가 다른 줄 | 0 |
| 판정이 있는 주제 | 39 |

누락·중복이 하나라도 있으면 이 스크립트는 아무것도 쓰지 않고 실패한다.

## 2. fit

| fit | 수 | 비율 |
| --- | --- | --- |
| keep | 600 | 97.1% |
| ambiguous | 11 | 1.8% |
| move-recommended | 7 | 1.1% |
| 합계 | 618 | 100.0% |

## 3. move-recommended의 confidence

move-recommended 7건의 확신도다.

| confidence | 수 | 개념 |
| --- | --- | --- |
| high | 4 | `ebs-instance-store.spread-placement-group` · `ebs-instance-store.elastic-fabric-adapter` · `api-gateway-step-functions.api-gateway-behind-cloudfront` · `waf-shield.cloudfront` |
| medium | 3 | `ebs-instance-store.cluster-placement-group` · `sqs-sns-eventbridge.sqs-queue-depth-scaling` · `iam-permissions.iam-roles-anywhere` |
| low | 0 | 없음 |

## 4. serviceSpecificGoal

| 범위 | true | false | true 비율 |
| --- | --- | --- | --- |
| 전체 | 514 | 104 | 83.2% |
| move-recommended | 6 | 1 | 85.7% |

move-recommended 안에서 false인 개념: `sqs-sns-eventbridge.sqs-queue-depth-scaling`

## 5. 현재 주제 → 권장 주제별 이동 후보

move-recommended 7건이 주제 쌍 5개로 묶인다.

| 현재 주제 | 권장 주제 | 수 | 개념 |
| --- | --- | --- | --- |
| `ebs-instance-store` | `ec2-autoscaling` | 3 | `ebs-instance-store.cluster-placement-group` · `ebs-instance-store.spread-placement-group` · `ebs-instance-store.elastic-fabric-adapter` |
| `api-gateway-step-functions` | `cloudfront-global-accelerator` | 1 | `api-gateway-step-functions.api-gateway-behind-cloudfront` |
| `sqs-sns-eventbridge` | `ec2-autoscaling` | 1 | `sqs-sns-eventbridge.sqs-queue-depth-scaling` |
| `waf-shield` | `cloudfront-global-accelerator` | 1 | `waf-shield.cloudfront` |
| `iam-permissions` | `identity-federation` | 1 | `iam-permissions.iam-roles-anywhere` |

## 6. 주제별 개념 수와 이동 후보 비율

주제 순서는 `topics.json` 배열 순서다. 이동 후보 비율은 그 주제의 move-recommended 수 ÷ 그 주제의 개념 수이고, 들어올 후보는
다른 주제에서 이 주제를 권장한 move-recommended다. 교차 ①이 아닌 개념은 교차 분류가 2A·2B·3·4·hold인 개념 수다.

| # | 주제 | 제목 | 개념 | keep | ambiguous | move | 이동 후보 비율 | 들어올 후보 | 교차 ①이 아닌 개념 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [aws-core-services](by-topic/aws-core-services.md) | AWS 핵심 서비스·리전·가용 영역·온프레미스 | 18 | 18 | 0 | 0 | 0.0% | 0 | 0 |
| 2 | [s3-storage-classes](by-topic/s3-storage-classes.md) | S3 스토리지 클래스 유형 | 17 | 17 | 0 | 0 | 0.0% | 0 | 0 |
| 3 | [s3-versioning-lifecycle](by-topic/s3-versioning-lifecycle.md) | S3 버전 관리·객체 잠금·수명 주기·복제 | 10 | 10 | 0 | 0 | 0.0% | 0 | 0 |
| 4 | [s3-encryption-batch](by-topic/s3-encryption-batch.md) | S3 암호화(SSE)·Batch Operations·인벤토리 | 13 | 12 | 1 | 0 | 0.0% | 0 | 2 |
| 5 | [s3-access-control](by-topic/s3-access-control.md) | S3 접근 제어·액세스 포인트·Storage Lens | 13 | 11 | 2 | 0 | 0.0% | 0 | 2 |
| 6 | [ebs-instance-store](by-topic/ebs-instance-store.md) | EBS·인스턴스 스토어·스냅샷·배치 그룹 | 15 | 12 | 0 | 3 | 20.0% | 0 | 3 |
| 7 | [efs-fsx](by-topic/efs-fsx.md) | EFS·FSx(Windows·Lustre·ONTAP) | 25 | 25 | 0 | 0 | 0.0% | 0 | 4 |
| 8 | [data-transfer-services](by-topic/data-transfer-services.md) | DataSync·Snowball Edge·Transfer Family·S3 전송 | 19 | 18 | 1 | 0 | 0.0% | 0 | 1 |
| 9 | [storage-gateway-migration](by-topic/storage-gateway-migration.md) | Storage Gateway·DMS·Application Migration Service | 7 | 7 | 0 | 0 | 0.0% | 0 | 0 |
| 10 | [rds-storage-features](by-topic/rds-storage-features.md) | RDS 스토리지 유형과 기능 | 21 | 21 | 0 | 0 | 0.0% | 0 | 1 |
| 11 | [aurora](by-topic/aurora.md) | Aurora·Aurora Serverless·글로벌 데이터베이스 | 18 | 18 | 0 | 0 | 0.0% | 0 | 2 |
| 12 | [dynamodb](by-topic/dynamodb.md) | DynamoDB | 18 | 18 | 0 | 0 | 0.0% | 0 | 0 |
| 13 | [elasticache-purpose-built-db](by-topic/elasticache-purpose-built-db.md) | ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream | 14 | 14 | 0 | 0 | 0.0% | 0 | 0 |
| 14 | [ec2-autoscaling](by-topic/ec2-autoscaling.md) | EC2 인스턴스 유형·구매 옵션·Auto Scaling | 18 | 18 | 0 | 0 | 0.0% | 4 (`ebs-instance-store.cluster-placement-group` · `ebs-instance-store.spread-placement-group` · `ebs-instance-store.elastic-fabric-adapter` · `sqs-sns-eventbridge.sqs-queue-depth-scaling`) | 0 |
| 15 | [elastic-load-balancing](by-topic/elastic-load-balancing.md) | ALB·NLB·Gateway Load Balancer | 16 | 16 | 0 | 0 | 0.0% | 0 | 3 |
| 16 | [cloudfront-global-accelerator](by-topic/cloudfront-global-accelerator.md) | CloudFront·Global Accelerator·엣지 함수 | 24 | 24 | 0 | 0 | 0.0% | 2 (`api-gateway-step-functions.api-gateway-behind-cloudfront` · `waf-shield.cloudfront`) | 1 |
| 17 | [lambda](by-topic/lambda.md) | Lambda | 18 | 18 | 0 | 0 | 0.0% | 0 | 3 |
| 18 | [ecs-eks-fargate](by-topic/ecs-eks-fargate.md) | ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk | 23 | 22 | 1 | 0 | 0.0% | 0 | 1 |
| 19 | [api-gateway-step-functions](by-topic/api-gateway-step-functions.md) | API Gateway·Step Functions | 20 | 18 | 1 | 1 | 5.0% | 0 | 2 |
| 20 | [sqs-sns-eventbridge](by-topic/sqs-sns-eventbridge.md) | SQS·SNS·EventBridge·Amazon MQ·SES | 33 | 32 | 0 | 1 | 3.0% | 0 | 1 |
| 21 | [backup-disaster-recovery](by-topic/backup-disaster-recovery.md) | AWS Backup·재해 복구 전략·Elastic Disaster Recovery | 11 | 11 | 0 | 0 | 0.0% | 0 | 0 |
| 22 | [vpc-networking](by-topic/vpc-networking.md) | VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링 | 20 | 20 | 0 | 0 | 0.0% | 0 | 0 |
| 23 | [security-groups-nacl](by-topic/security-groups-nacl.md) | 보안 그룹·NACL | 9 | 9 | 0 | 0 | 0.0% | 0 | 1 |
| 24 | [hybrid-connectivity](by-topic/hybrid-connectivity.md) | Site-to-Site VPN·Direct Connect·Transit Gateway | 19 | 18 | 1 | 0 | 0.0% | 0 | 1 |
| 25 | [route53](by-topic/route53.md) | Route 53 | 13 | 13 | 0 | 0 | 0.0% | 0 | 0 |
| 26 | [emr-glue-athena](by-topic/emr-glue-athena.md) | EMR·Spark·Glue·Athena·Lake Formation | 20 | 20 | 0 | 0 | 0.0% | 0 | 0 |
| 27 | [kinesis-streaming](by-topic/kinesis-streaming.md) | Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK | 16 | 16 | 0 | 0 | 0.0% | 0 | 0 |
| 28 | [redshift-opensearch-quicksight](by-topic/redshift-opensearch-quicksight.md) | Redshift·Redshift Spectrum·OpenSearch·QuickSight | 11 | 11 | 0 | 0 | 0.0% | 0 | 0 |
| 29 | [cloudwatch-xray](by-topic/cloudwatch-xray.md) | CloudWatch·X-Ray·Performance Insights·Managed Grafana | 11 | 10 | 1 | 0 | 0.0% | 0 | 2 |
| 30 | [secrets-encryption](by-topic/secrets-encryption.md) | Secrets Manager·Parameter Store·KMS·ACM·CloudHSM | 20 | 19 | 1 | 0 | 0.0% | 0 | 1 |
| 31 | [waf-shield](by-topic/waf-shield.md) | WAF·Shield·Firewall Manager | 15 | 14 | 0 | 1 | 6.7% | 0 | 1 |
| 32 | [guardduty-macie-inspector](by-topic/guardduty-macie-inspector.md) | GuardDuty·Macie·Inspector·Security Hub | 11 | 9 | 2 | 0 | 0.0% | 0 | 2 |
| 33 | [iam-permissions](by-topic/iam-permissions.md) | IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer | 18 | 17 | 0 | 1 | 5.6% | 0 | 1 |
| 34 | [identity-federation](by-topic/identity-federation.md) | IAM Identity Center·STS·Cognito·Directory Service·SAML | 11 | 11 | 0 | 0 | 0.0% | 1 (`iam-permissions.iam-roles-anywhere`) | 1 |
| 35 | [organizations-cloudtrail-config](by-topic/organizations-cloudtrail-config.md) | Organizations·SCP·CloudTrail·Config·Audit Manager | 16 | 16 | 0 | 0 | 0.0% | 0 | 0 |
| 36 | [cost-management](by-topic/cost-management.md) | 절약 플랜·Budgets·Cost Explorer·Trusted Advisor | 17 | 17 | 0 | 0 | 0.0% | 0 | 2 |
| 37 | [governance-iac](by-topic/governance-iac.md) | CloudFormation·Service Catalog·Control Tower·RAM | 7 | 7 | 0 | 0 | 0.0% | 0 | 0 |
| 38 | [systems-manager](by-topic/systems-manager.md) | Systems Manager·AppConfig·EC2 Instance Connect | 7 | 7 | 0 | 0 | 0.0% | 0 | 0 |
| 39 | [ai-ml-services](by-topic/ai-ml-services.md) | SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract | 6 | 6 | 0 | 0 | 0.0% | 0 | 0 |

주제 39개의 개념 합 618건 · 전체 판정 618건.
이동 후보가 나가는 주제 5개, 들어오는 주제 3개.

## 7. duplicateOf

`duplicateOf`를 적은 개념 16개가 쌍 8개로 묶인다.
같은 주제 쌍 4개 · 다른 주제 쌍 4개 · 한쪽에만 적은 쌍 0개다.
중복 기록은 소속 판정과 분리한 것이라 병합은 이 audit의 범위 밖이다(ADR-035).

### 같은 주제 쌍 — 쌍 4개 · 개념 8개

| 개념 | 주제 | fit | 상대 개념 | 상대의 주제 | 상대도 적었는가 |
| --- | --- | --- | --- | --- | --- |
| `s3-storage-classes.glacier-flexible-retrieval` | `s3-storage-classes` | keep | `s3-storage-classes.glacier-flexible-retrieval-standard-time` | `s3-storage-classes` | 예 |
| `s3-storage-classes.glacier-flexible-retrieval-standard-time` | `s3-storage-classes` | keep | `s3-storage-classes.glacier-flexible-retrieval` | `s3-storage-classes` | 예 |
| `s3-encryption-batch.envelope-encryption` | `s3-encryption-batch` | keep | `s3-encryption-batch.sse-c-no-rotation-or-audit` | `s3-encryption-batch` | 예 |
| `s3-encryption-batch.sse-c-no-rotation-or-audit` | `s3-encryption-batch` | keep | `s3-encryption-batch.envelope-encryption` | `s3-encryption-batch` | 예 |
| `route53.private-hosted-zone` | `route53` | keep | `route53.private-hosted-zone-vpc-only` | `route53` | 예 |
| `route53.private-hosted-zone-vpc-only` | `route53` | keep | `route53.private-hosted-zone` | `route53` | 예 |
| `secrets-encryption.secrets-manager-vs-parameter-store` | `secrets-encryption` | keep | `secrets-encryption.rotation-heuristic` | `secrets-encryption` | 예 |
| `secrets-encryption.rotation-heuristic` | `secrets-encryption` | keep | `secrets-encryption.secrets-manager-vs-parameter-store` | `secrets-encryption` | 예 |

### 다른 주제 쌍 — 쌍 4개 · 개념 8개

| 개념 | 주제 | fit | 상대 개념 | 상대의 주제 | 상대도 적었는가 |
| --- | --- | --- | --- | --- | --- |
| `aws-core-services.rds` | `aws-core-services` | keep | `rds-storage-features.rds` | `rds-storage-features` | 예 |
| `rds-storage-features.rds` | `rds-storage-features` | keep | `aws-core-services.rds` | `aws-core-services` | 예 |
| `rds-storage-features.rds-blue-green-deployment` | `rds-storage-features` | keep | `aurora.read-replica-no-schema-change` | `aurora` | 예 |
| `aurora.read-replica-no-schema-change` | `aurora` | keep | `rds-storage-features.rds-blue-green-deployment` | `rds-storage-features` | 예 |
| `ec2-autoscaling.ec2-image-builder` | `ec2-autoscaling` | keep | `systems-manager.ssm-patch-manager` | `systems-manager` | 예 |
| `emr-glue-athena.log-storage-s3-athena` | `emr-glue-athena` | keep | `cloudwatch-xray.log-analysis-options` | `cloudwatch-xray` | 예 |
| `cloudwatch-xray.log-analysis-options` | `cloudwatch-xray` | keep | `emr-glue-athena.log-storage-s3-athena` | `emr-glue-athena` | 예 |
| `systems-manager.ssm-patch-manager` | `systems-manager` | keep | `ec2-autoscaling.ec2-image-builder` | `ec2-autoscaling` | 예 |

## 8. 추가 설계가 필요한 자리 — 대상 개념·자리가 없는 이동 후보 2건

`blockImpact`가 대상 개념·자리의 정리를 뒤로 미룬 문장, 지정한 앞뒤 개념이 대상 주제에 아직 없어 자리가 정해지지 않는 경우,
옮긴 id(`<권장 주제>.<slug>`)가 이미 있는 개념 id와 겹치는 경우, 개념을 따라갈 문항의 권장 개념이 비어 있는 경우를 센다.

| 개념 | 권장 주제 | confidence | 교차 유형 | 사유 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `ebs-instance-store.spread-placement-group` | `ec2-autoscaling` | high | 3 | 지정한 앞뒤 개념이 대상 주제에 아직 없다 | ebs-instance-store.cluster-placement-group |
| `waf-shield.cloudfront` | `cloudfront-global-accelerator` | high | hold | blockImpact가 대상 개념·자리의 정리를 뒤로 미룬다 | cloudfront-global-accelerator의 CloudFront 블록에서 기본 소개 cloudfront 뒤·cloudfront-alb-origin 앞에 두어 캐시·OAC·멀티 오리진의 기능 개요를 각 오리진과 캐시 세부보다 먼저 읽게 하며, 기존 multiple-origins·ttl과 부분적으로 겹치는 내용의 정리는 후속 설계에 남긴다. |
| `waf-shield.cloudfront` | `cloudfront-global-accelerator` | high | hold | 옮긴 id가 이미 있는 개념 id와 겹친다 | cloudfront-global-accelerator.cloudfront |
| `waf-shield.cloudfront` | `cloudfront-global-accelerator` | high | hold | 따라갈 문항의 권장 개념이 없다(phase 35) | q152 · confidence medium |

`blockImpact` 7건 중 원 주제 id를 적은 것은 0건이다. 원 주제에 남는 개념이 받는 영향은
`handoff-fixes.md`의 후보마다 「원 주제 쪽 영향」으로 채웠다.

## 9. ambiguous 전체 목록과 핵심 쟁점 — 11건

주제 경계를 한 곳으로 정하지 못한 개념이다. 두 해석은 각 판정의 `rationale`을 한 줄씩 줄여 옮긴 것이다.

| 다른 해석의 주제 | 수 | 개념 |
| --- | --- | --- |
| `sqs-sns-eventbridge` | 6 | `data-transfer-services.datasync-task-status-event` · `api-gateway-step-functions.amplify` · `cloudwatch-xray.cloudwatch-alarm-state-change-event` · `secrets-encryption.acm-expiration-event` · `guardduty-macie-inspector.guardduty-finding-to-eventbridge` · `guardduty-macie-inspector.macie-finding-to-eventbridge` |
| `s3-storage-classes` | 2 | `s3-access-control.s3-storage-lens` · `s3-access-control.s3-storage-lens-advanced-activity-metrics` |
| `s3-access-control` | 1 | `s3-encryption-batch.s3-object-lambda` |
| `s3-versioning-lifecycle` | 1 | `s3-access-control.s3-storage-lens` |
| `ec2-autoscaling` | 1 | `ecs-eks-fargate.elastic-beanstalk` |
| `systems-manager` | 1 | `hybrid-connectivity.access-terms` |
| `vpc-networking` | 1 | `hybrid-connectivity.access-terms` |

### `s3-encryption-batch.s3-object-lambda` · Lambda로 객체를 처리하는 데이터 보호 ↔ 요청자마다 다른 형태로 내주는 접근 방식

- 학습 목표: 같은 원본을 요청하는 애플리케이션마다 다르게 보여줘야 할 때 사본을 만들지 않고 S3 Object Lambda가 반환 직전에 객체를 변환한다는 것을 이해한다.
- serviceSpecificGoal true · 연결 문항 q278 keep · 교차 유형 hold
- `s3-encryption-batch` 주제로 읽으면: PII 제거처럼 Lambda로 객체를 처리하는 기능으로 읽으면 암호화와 Batch Operations의 Lambda 호출을 묶은 현재 주제에 둔다.
- `s3-access-control` 주제로 읽으면: 중심이 같은 데이터를 요청하는 쪽마다 다른 형태로 내주는 접근 방식이라, 버킷에 닿는 방식을 나누는 접근 제어 주제가 자연스럽다.

### `s3-access-control.s3-storage-lens` · S3 운영 기능으로서의 사용 현황 대시보드 ↔ 접근 제어와 무관한 사용 현황 분석

- 학습 목표: S3 Storage Lens는 계정 전반의 스토리지 사용 현황을 분석·보고하는 기능이라 객체 생성에 반응해 처리하는 이벤트 알림과 다르다는 것을 이해한다.
- serviceSpecificGoal true · 연결 문항 q252 keep · 교차 유형 hold
- `s3-access-control` 주제로 읽으면: S3 사용 현황 분석을 맡는 다른 주제가 없고 계정 전체 버킷을 한자리에서 보는 관리 기능이라, 접근 경로 뒤에 운영 기능을 붙인 현재 주제에 둔다.
- `s3-storage-classes` · `s3-versioning-lifecycle` 주제로 읽으면: 학습 목표가 접근 제어와 무관한 사용 현황 분석이라 `s3-storage-class-analysis` 곁이나 이벤트 알림이 있는 버전 관리·수명 주기 주제에서 가르치는 편이 자연스럽다.

### `s3-access-control.s3-storage-lens-advanced-activity-metrics` · Storage Lens 기본 개념의 세부 설정 ↔ 접근이 식은 데이터를 찾아 비용을 줄이는 일

- 학습 목표: S3 Storage Lens의 고급 활동 메트릭을 켜면 접근 로그를 직접 모아 분석하지 않고도 계정 전체에서 더 이상 읽히지 않는 버킷을 찾아 스토리지 비용 절감 대상을 고를 수 있음을 이해한다.
- serviceSpecificGoal true · 연결 문항 q255 keep · 교차 유형 hold
- `s3-access-control` 주제로 읽으면: Storage Lens 기본 개념의 세부 설정이라 기본 개념과 같은 블록에 붙어 있어야 한다.
- `s3-storage-classes` 주제로 읽으면: 학습 목표가 접근이 식은 데이터를 찾아 스토리지 비용을 줄이는 일이라 접근 패턴 분석과 클래스 비용을 다루는 주제가 자연스럽다.

### `data-transfer-services.datasync-task-status-event` · DataSync 작업 상태 알림 기능 ↔ 폴링 대신 이벤트 규칙을 쓰는 공통 패턴

- 학습 목표: DataSync가 제공하는 작업 상태 이벤트를 이용하면 별도의 상태 조회 코드를 만들지 않고 전송 결과를 알림으로 연결할 수 있음을 이해한다.
- serviceSpecificGoal true · 연결 문항 q364 ambiguous · 교차 유형 hold
- `data-transfer-services` 주제로 읽으면: DataSync 작업의 완료·실패를 통지하는 고유 연동 기능으로 읽으면 전송 운영을 다루는 현재 주제의 내용이다.
- `sqs-sns-eventbridge` 주제로 읽으면: 두 번째 문단이 CloudWatch에도 같은 원리를 적용하며 이벤트가 있으면 폴링을 만들지 말라는 공통 패턴을 가르치므로 이벤트 규칙 주제의 내용이다.

### `ecs-eks-fargate.elastic-beanstalk` · 기존 애플리케이션의 배포 방식 선택 ↔ EC2 기반 환경에 남는 운영 책임

- 학습 목표: Elastic Beanstalk의 코드 배포 자동화가 인스턴스 운영 책임까지 없애지는 않으며 애플리케이션을 함수로 나누기 어려울 때 선택지가 되는 이유를 이해한다.
- serviceSpecificGoal true · 연결 문항 q510 keep · 교차 유형 hold
- `ecs-eks-fargate` 주제로 읽으면: 뒤의 App2Container가 코드 배포와 컨테이너 변환을 대비하므로, 배포 방식을 고르는 지식으로 읽으면 현재 주제에 둔다.
- `ec2-autoscaling` 주제로 읽으면: 개념 자체의 중심이 EC2 기반 환경에 남는 운영 책임과 Lambda와의 차이라서 관리형 배포를 EC2 주제에서 설명하는 편이 자연스럽다.

### `api-gateway-step-functions.amplify` · 앱 개발·배포와 백엔드 처리의 책임 구분 ↔ 푸시 알림 서비스 선택 기준

- 학습 목표: Amplify의 웹·모바일 개발·배포 지원과 백엔드 처리 완료 알림은 구분해야 하며 알림은 별도 서비스가 맡는다는 경계를 이해한다.
- serviceSpecificGoal true · 연결 문항 q529 keep · 교차 유형 hold
- `api-gateway-step-functions` 주제로 읽으면: 웹·모바일 앱 개발·배포와 백엔드 처리 흐름의 책임을 구분하는 소개로 읽으면 API와 워크플로를 다루는 현재 주제에 둔다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문이 처리 완료 푸시 알림을 Amplify가 아니라 SNS가 맡는다는 대비에 집중하므로 알림 서비스 선택 기준으로 읽힌다.

### `hybrid-connectivity.access-terms` · VPN 구성 요소 Customer Gateway ↔ 프라이빗 인스턴스 접속 수단 Bastion Host

- 학습 목표: Customer Gateway는 Site-to-Site VPN의 고객 측 종단이고 Bastion Host는 프라이빗 서브넷의 서버로 들어가는 중간 서버라서, 둘 다 요구된 연결 경로 자체를 만드는 수단이 아님을 이해한다.
- serviceSpecificGoal false · 연결 문항 q217 keep · 교차 유형 hold
- `hybrid-connectivity` 주제로 읽으면: Customer Gateway를 VPN 구성 요소로 읽으면 뒤의 `virtual-private-gateway`가 온프레미스 쪽 종단으로 전제하므로 현재 주제에 둔다.
- `systems-manager` · `vpc-networking` 주제로 읽으면: Bastion Host의 실제 역할은 프라이빗 서브넷 인스턴스 접속이라 배스천 없는 접속을 다루는 Systems Manager 주제나 VPC 주제가 자연스럽다. 성격이 다른 두 용어가 한 개념에 묶여 있다.

### `cloudwatch-xray.cloudwatch-alarm-state-change-event` · CloudWatch 알람 상태 변경을 자동 대응의 출발점으로 쓰기 ↔ 규칙이 대상을 직접 호출하는 EventBridge 설계

- 학습 목표: CloudWatch 알람의 상태 변경이 이벤트로 나가므로 EventBridge 규칙이 이를 받아 조치 서비스를 직접 대상으로 호출하면 중계 함수 없이 자동 대응을 붙일 수 있음을 이해한다.
- serviceSpecificGoal true · 연결 문항 q656 ambiguous · 교차 유형 hold
- `cloudwatch-xray` 주제로 읽으면: 알람을 알림 장치로만 쓰지 않고 상태 변경을 자동 대응의 출발점으로 삼는 CloudWatch 알람의 활용으로 읽으면 CloudWatch 블록에 둔다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문 후반이 함수를 끼우지 않고 규칙이 대상을 직접 호출하는 EventBridge 규칙 설계를 가르치며 `eventbridge-resource-change-rule`과 같은 패턴이다.

### `secrets-encryption.acm-expiration-event` · ACM 인증서 만료 이벤트 기능 ↔ 이벤트 우선·SNS 알림 전달 패턴

- 학습 목표: ACM이 제공하는 인증서 만료 임박 이벤트를 사람에게 전달할 알림으로 연결하면 만료 날짜를 반복 조회하는 코드를 줄일 수 있음을 이해한다.
- serviceSpecificGoal true · 연결 문항 q667 ambiguous · 교차 유형 hold
- `secrets-encryption` 주제로 읽으면: 가져온 ACM 인증서의 만료를 관리하는 고유 이벤트 기능으로 읽으면 ACM 블록의 운영 내용이다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문 후반이 SNS와 SQS의 알림 전달 차이와 폴링보다 이벤트를 우선하는 공통 패턴을 가르쳐 메시징 주제에 둘 근거가 강하다.

### `guardduty-macie-inspector.guardduty-finding-to-eventbridge` · GuardDuty가 직접 대응하지 않는 한계의 보완 ↔ 탐지와 조치를 잇는 EventBridge 규칙 패턴

- 학습 목표: GuardDuty의 탐지 결과를 EventBridge 규칙으로 받아 격리 작업을 수행할 함수와 연결하면 탐지와 실제 대응을 분리해 자동화할 수 있음을 이해한다.
- serviceSpecificGoal true · 연결 문항 q683 keep · 교차 유형 hold
- `guardduty-macie-inspector` 주제로 읽으면: GuardDuty가 직접 대응하지 않는 한계를 보완하는 운영 통합으로 읽으면 탐지 블록에서 배울 내용이고, 본문도 탐지 출발점의 차이를 강조한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문이 탐지와 조치를 잇는 EventBridge 규칙을 구성의 요점으로 명시하므로 이벤트 기반 대응 패턴으로 읽힌다.

### `guardduty-macie-inspector.macie-finding-to-eventbridge` · Macie 결과의 유형과 침해 탐지와의 차이 ↔ 큐에 쌓기와 사람에게 알리기의 차이

- 학습 목표: Macie의 민감 데이터 발견을 보안 팀에 알리려면 탐지 유형을 거른 이벤트를 사람에게 전달할 대상으로 보내야 하며 큐 저장만으로는 부족함을 이해한다.
- serviceSpecificGoal true · 연결 문항 q684 ambiguous · 교차 유형 hold
- `guardduty-macie-inspector` 주제로 읽으면: Macie가 만든 결과의 유형과 침해 징후 탐지와의 차이를 배우는 활용 개념으로 보면 민감 데이터 탐지 블록에 속한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 후반의 핵심이 큐에 쌓는 것과 사람에게 알리는 것의 차이라 이벤트에서 알림으로 잇는 패턴으로 읽힌다.

## 10. 재검토 신호 조합

### move-recommended + serviceSpecificGoal=true — 6건

서비스 고유 목표인데도 다른 주제를 권한 자리다. 이유는 각 판정의 `rationale`을 그대로 옮긴다.

| 개념 | 권장 주제 | confidence | rationale |
| --- | --- | --- | --- |
| `ebs-instance-store.cluster-placement-group` | `ec2-autoscaling` | medium | 학습 목표는 EC2 인스턴스를 물리적으로 어디에 놓는가라는 EC2 고유 설정이고, 블록 스토리지나 인스턴스 스토어의 지속성과는 관계가 없다. EC2 서비스를 다루는 ec2-autoscaling에 이 개념을 전제로 쓰는 향상된 네트워킹이 이미 있어 그쪽이 더 자연스럽지만, 본문 유일한 문단이 FSx for Lustre와 짝을 이루는 HPC 스토리지 구성을 말해 스토리지 쪽 맥락으로 읽을 여지가 남으므로 medium으로 둔다. |
| `ebs-instance-store.spread-placement-group` | `ec2-autoscaling` | high | 학습 목표는 EC2 인스턴스의 물리 배치 전략으로 가용성을 얻는 방법이며 본문에 블록 스토리지·스냅샷·인스턴스 스토어와 이어지는 내용이 없다. 목표가 EC2 고유 기능이고 EC2 서비스를 다루는 주제가 ec2-autoscaling으로 따로 있으므로, 서비스 고유 목표이면서도 다른 주제를 명확히 더 적절한 자리로 권한다. |
| `ebs-instance-store.elastic-fabric-adapter` | `ec2-autoscaling` | high | 학습 목표는 EC2 인스턴스 사이 통신 경로를 줄이는 네트워크 장치이며 스토리지와 이어지는 내용이 없다. 본문이 비교 기준으로 쓰는 향상된 네트워킹이 EC2 서비스 주제인 ec2-autoscaling에 있어 그쪽이 명확히 더 적절하므로, 서비스 고유 목표이면서도 다른 주제를 권한다. |
| `api-gateway-step-functions.api-gateway-behind-cloudfront` | `cloudfront-global-accelerator` | high | 중심은 CloudFront가 동적 응답도 오리진에서 받아 엣지로 전달·캐시한다는 기능이며 HTTP API는 그 기능을 적용할 백엔드다. API Gateway의 고유 설정이나 유형 선택보다 CloudFront의 오리진 범위를 가르치므로, 서비스 고유 목표를 실제 소유한 엣지 주제로 옮기는 것이 맞다. |
| `waf-shield.cloudfront` | `cloudfront-global-accelerator` | high | 중심은 WAF의 공격 검사나 적용 조건이 아니라 CloudFront 배포 자체의 캐시·OAC·멀티 오리진 기능이다. 뒤의 WAF 연결을 위한 소개 역할은 있지만 본문 전체가 가르치는 고유 기능의 주제는 cloudfront-global-accelerator이며, aws-core-services.cloudfront는 CDN의 거리 문제만 설명해 깊이가 달라 중복으로 보지 않는다. |
| `iam-permissions.iam-roles-anywhere` | `identity-federation` | medium | 온프레미스에도 IAM 역할을 쓰게 하는 확장이라는 해석은 있지만, 본문이 가르는 것은 역할의 권한 범위가 아니라 기존 인증서를 AWS 자격 증명으로 교환하는 인증 연동 방식이다. 서비스 고유 목표의 중심이 SAML·OIDC·상호 TLS·서명과의 자격 증명 획득 비교에 있어 identity-federation을 권하며, 역할 활용이라는 현재 블록의 해석 여지는 medium으로 남긴다. |

### keep + duplicateOf — 16건

중복을 기록하고도 소속은 유지한 자리다.

| 개념 | 상대 개념 | rationale |
| --- | --- | --- |
| `aws-core-services.rds` | `rds-storage-features.rds` | 핵심 서비스 지형에서 데이터베이스 서비스의 자리를 세우는 입문 개념이라 현재 주제에 둔다. rds-storage-features.rds도 관계형 데이터베이스를 AWS에서 제공받는 서비스라는 같은 깊이의 소개만 담아 중복으로 기록하지만, 한쪽은 전체 지형을, 다른 쪽은 RDS 서비스 블록의 기본을 맡으므로 병합 여부는 소속 판정과 분리한다. |
| `s3-storage-classes.glacier-flexible-retrieval` | `s3-storage-classes.glacier-flexible-retrieval-standard-time` | 아카이브 클래스 하나를 소개하는 기본 개념이라 현재 주제에 둔다. 같은 주제의 glacier-flexible-retrieval-standard-time도 이 클래스의 표준 검색이 3~5시간이라 몇 시간 이내 조회 조건을 채운다는 같은 사실을 가르쳐 중복으로 기록하며, 두 개념이 모두 이 주제 안에 있어 병합 여부는 소속 판정과 무관하다. Deep Archive와는 허용 대기 시간이 달라 중복으로 보지 않는다. |
| `s3-storage-classes.glacier-flexible-retrieval-standard-time` | `s3-storage-classes.glacier-flexible-retrieval` | 클래스의 조회 시간 세부를 다루는 개념이라 현재 주제에 속한다. 다만 같은 주제의 glacier-flexible-retrieval이 이미 표준 검색 3~5시간과 몇 시간 대기라는 선택 조건을 담고 있어 거의 같은 사실을 가르치므로 중복으로 기록하며, 신속 검색 개념과는 검색 방식이 달라 중복으로 보지 않는다. |
| `s3-encryption-batch.envelope-encryption` | `s3-encryption-batch.sse-c-no-rotation-or-audit` | 한 줄 요약은 봉투 암호화의 정의를 담지만 본문 전체는 요구 조건을 S3 암호화 방식 선택으로 옮기는 내용이라 KMS 주제로 옮기지 않는다. 같은 주제의 sse-c-no-rotation-or-audit도 자동 교체가 없는 SSE-S3·SSE-C를 지우고 봉투 암호화·교체 요구에서 SSE-KMS만 남기는 같은 선택 규칙을 가르쳐 중복으로 기록하며, 둘 다 현재 주제 안이라 병합 여부는 소속과 분리한다. |
| `s3-encryption-batch.sse-c-no-rotation-or-audit` | `s3-encryption-batch.envelope-encryption` | S3 암호화 방식의 한계로 후보를 지우는 세부 개념이라 현재 주제에 속한다. 같은 주제의 envelope-encryption도 자동 교체가 없는 SSE-S3·SSE-C를 제외하고 SSE-KMS를 고르는 같은 규칙을 가르쳐 중복으로 기록하되, 이 개념은 감사 추적의 한계까지 더해 다루므로 병합하더라도 이쪽 내용이 더 넓다. |
| `rds-storage-features.rds` | `aws-core-services.rds` | 현재 RDS 블록의 출발점으로 관계형 데이터베이스 서비스의 역할을 세우므로 유지한다. aws-core-services.rds도 같은 깊이의 소개를 가르쳐 중복으로 기록하지만, 그쪽은 전체 서비스 지형을 익히는 자리이고 이쪽은 저장·복구 기능을 배우기 위한 도입이므로 병합 여부와 소속 판정은 분리한다. |
| `rds-storage-features.rds-blue-green-deployment` | `aurora.read-replica-no-schema-change` | step 12 축 4·9 재검토에서 aurora.read-replica-no-schema-change와의 duplicateOf를 추가해 한쪽에만 있던 중복 기록을 맞췄다. 두 본문 모두 읽기 복제본에서는 스키마를 바꿀 수 없고 별도 그린 환경에서 시험한 뒤 전환해야 한다는 같은 구분을 가르친다. RDS에서는 변경 배포 기능을, Aurora에서는 읽기 복제본의 한계를 세우므로 keep은 유지하며 병합 여부는 소속 판정과 분리한다. |
| `aurora.read-replica-no-schema-change` | `rds-storage-features.rds-blue-green-deployment` | 읽기 복제본을 변경 시험 환경으로 오해하지 않도록 Aurora 복제본의 사용 경계를 세우므로 현재 블록에 둔다. rds-storage-features.rds-blue-green-deployment도 같은 제약과 블루/그린 대안을 가르쳐 중복으로 기록하지만, RDS의 배포 기능 소개와 Aurora의 읽기 확장 한계에 각각 필요한 비교이므로 병합 여부는 소속 유지와 분리한다. |
| `ec2-autoscaling.ec2-image-builder` | `systems-manager.ssm-patch-manager` | step 12 축 4·9 재검토에서 systems-manager.ssm-patch-manager와의 duplicateOf를 추가해 한쪽에만 있던 중복 기록을 맞췄다. 실행 중인 인스턴스에 패치를 해도 옛 AMI에서 나오는 새 인스턴스는 고쳐지지 않아 이미지 제작 단계에서 해결해야 한다는 중심 구분이 두 본문에 있다. 이쪽은 AMI 파이프라인을, 상대는 패치 도구의 한계를 가르치므로 keep은 유지하고 병합 여부는 별도로 남긴다. |
| `route53.private-hosted-zone` | `route53.private-hosted-zone-vpc-only` | 호스팅 영역의 종류와 적용 범위라는 Route 53 기능이 중심이고 Active Directory는 해석할 도메인의 예라 현재 주제에 둔다. 같은 주제의 private-hosted-zone-vpc-only도 VPC 전용 영역으로는 온프레미스 이름을 풀지 못해 Resolver 아웃바운드를 쓰고 퍼블릭 영역은 내부 이름을 드러낸다는 같은 판단을 가르쳐 중복으로 기록하며, 둘 다 현재 주제 안이라 병합 여부는 소속 판정과 분리한다. |
| `route53.private-hosted-zone-vpc-only` | `route53.private-hosted-zone` | 호스팅 영역의 연결 대상과 Resolver 방향 선택이 중심인 Route 53 세부 개념이라 현재 주제에 둔다. 같은 주제의 private-hosted-zone도 VPC 전용 영역으로는 온프레미스 이름을 풀지 못해 Resolver 아웃바운드를 쓰고 퍼블릭 영역은 내부 이름을 드러낸다는 같은 판단을 가르쳐 중복으로 기록하되, 이 개념은 인바운드 방향과 전달 규칙까지 더해 병합하더라도 내용이 더 넓다. |
| `emr-glue-athena.log-storage-s3-athena` | `cloudwatch-xray.log-analysis-options` | Athena를 이용한 간헐적 로그 조회와 상시 검색·모니터링의 비용 차이가 중심이므로 현재 Athena 블록의 선택 기준으로 필요하다. cloudwatch-xray.log-analysis-options도 거의 같은 선택 기준을 가르쳐 중복으로 기록하되, 그쪽은 모니터링 도구의 경계를 설명하므로 두 자리의 필요성과 향후 병합 여부는 소속 판정과 분리한다. |
| `cloudwatch-xray.log-analysis-options` | `emr-glue-athena.log-storage-s3-athena` | 로그를 항상 검색·감시할 필요가 있는지에 따라 CloudWatch Logs Insights의 역할과 한계를 판단하는 내용이라 현재 모니터링 주제에 필요하다. emr-glue-athena.log-storage-s3-athena와 선택 기준은 거의 같아 중복으로 기록하지만, 양쪽 독자가 도구의 사용 경계를 이해하는 데 필요한 비교이며 병합 여부는 소속 유지와 별도 판단이다. |
| `secrets-encryption.secrets-manager-vs-parameter-store` | `secrets-encryption.rotation-heuristic` | 안전한 저장이라는 공통점과 자동 순환의 유무로 두 저장 수단을 가르는 비교이므로 현재 주제에 맞는다. rotation-heuristic도 정기 교체 요구에서 같은 서비스를 고르는 기준을 가르쳐 중복으로 기록하되, 두 저장소의 기본 비교와 요구 적용이라는 배치 역할 및 병합 가능성은 소속 유지와 분리한다. |
| `secrets-encryption.rotation-heuristic` | `secrets-encryption.secrets-manager-vs-parameter-store` | RDS·Lambda·EventBridge는 비밀값 자동 순환의 적용 대상과 직접 구현 대안이고 중심은 Secrets Manager의 선택 기준이다. secrets-manager-vs-parameter-store와 자동 교체 요구로 두 저장 수단을 가르는 지식이 거의 같아 중복으로 남기며, 이쪽의 KMS·직접 구현 대비까지 보존할지는 향후 병합 판단으로 분리한다. |
| `systems-manager.ssm-patch-manager` | `ec2-autoscaling.ec2-image-builder` | 중심은 Patch Manager의 적용 대상이 실행 중 인스턴스에 한정된다는 한계라 현재 Systems Manager 블록에 둔다. ec2-autoscaling.ec2-image-builder 문단 1도 실행 중 인스턴스 패치로는 옛 이미지에서 나오는 새 인스턴스를 막지 못한다는 같은 구분을 가르쳐 중복으로 기록하되, 이쪽은 Patch Manager의 한계를, 그쪽은 해법인 이미지 파이프라인을 맡으므로 병합 여부는 소속 판정과 분리한다. |

## 11. 교차 분류 요약 — phase 35 문항 판정과의 교차

개념 판정과 연결 문항 판정을 교차한 유형이다. `cross-phase35.jsonl`에는 ①이 아닌 개념만 38줄이 있고, 이 스크립트가
`cross-phase35.mjs`의 `classify`로 전부 다시 계산해 파일과 같음을 확인했다. 영향 문항은 2A·2B에서는 권장이 달라진 문항,
3·4·hold에서는 연결 문항 전부다.

| 유형 | 뜻 | 개념 | 영향 문항 | 개념(영향 문항 수) |
| --- | --- | --- | --- | --- |
| ① | 개념·문항 둘 다 맞음 | 580 | 0 | — |
| 2A | 개념은 맞고 문항이 같은 주제의 다른 개념을 가리킴 — 문항 conceptId만 바꾼다 | 11 | 14 | `s3-encryption-batch.sse-types`(1) · `efs-fsx.efs`(1) · `efs-fsx.efs-ia-file-size-threshold`(1) · `efs-fsx.fsx`(2) · `rds-storage-features.features`(2) · `aurora.aurora`(1) · `elastic-load-balancing.elb`(2) · `cloudfront-global-accelerator.global-accelerator-static-ip`(1) · `lambda.lambda`(1) · `identity-federation.identity-center`(1) · `cost-management.savings-plan`(1) |
| 2B | 개념은 맞고 문항이 다른 주제의 개념을 가리킴 — 문항 topicId·conceptId를 함께 바꾼다 | 4 | 4 | `elastic-load-balancing.end-to-end-encryption-behind-alb`(1) · `lambda.serverless-runtime-no-os-access`(1) · `security-groups-nacl.nacl-rule-limit`(1) · `cloudwatch-xray.log-analysis-options`(1) |
| 3 | 문항은 맞고 개념의 주제가 잘못됨 — 개념을 옮기고 연결 문항이 따라간다 | 2 | 2 | `ebs-instance-store.spread-placement-group`(1) · `ebs-instance-store.elastic-fabric-adapter`(1) |
| 4 | 개념과 문항 둘 다 재배정 | 0 | 0 | 없음 |
| hold | 보류 — 어느 한쪽이 ambiguous이거나 이동 권고의 확신이 높지 않다 | 21 | 24 | `s3-encryption-batch.s3-object-lambda`(1) · `s3-access-control.s3-storage-lens`(1) · `s3-access-control.s3-storage-lens-advanced-activity-metrics`(1) · `ebs-instance-store.cluster-placement-group`(1) · `efs-fsx.efs-replication-one-way`(1) · `data-transfer-services.datasync-task-status-event`(1) · `aurora.aurora-clone`(1) · `elastic-load-balancing.internal-load-balancer`(1) · `lambda.lambda-concurrency-limit-throttling`(1) · `ecs-eks-fargate.elastic-beanstalk`(1) · `api-gateway-step-functions.api-gateway-behind-cloudfront`(1) · `api-gateway-step-functions.amplify`(1) · `sqs-sns-eventbridge.sqs-queue-depth-scaling`(1) · `hybrid-connectivity.access-terms`(1) · `cloudwatch-xray.cloudwatch-alarm-state-change-event`(1) · `secrets-encryption.acm-expiration-event`(1) · `waf-shield.cloudfront`(3) · `guardduty-macie-inspector.guardduty-finding-to-eventbridge`(1) · `guardduty-macie-inspector.macie-finding-to-eventbridge`(1) · `iam-permissions.iam-roles-anywhere`(1) · `cost-management.on-demand-capacity-reservation`(2) |
| 합계 |  | 618 | 44 |  |

교차 파일 38줄 + ① 580개 = 618개 · 전체 판정 618건.

| hold 사유 | 수 | 개념 |
| --- | --- | --- |
| 개념 ambiguous | 11 | `s3-encryption-batch.s3-object-lambda` · `s3-access-control.s3-storage-lens` · `s3-access-control.s3-storage-lens-advanced-activity-metrics` · `data-transfer-services.datasync-task-status-event` · `ecs-eks-fargate.elastic-beanstalk` · `api-gateway-step-functions.amplify` · `hybrid-connectivity.access-terms` · `cloudwatch-xray.cloudwatch-alarm-state-change-event` · `secrets-encryption.acm-expiration-event` · `guardduty-macie-inspector.guardduty-finding-to-eventbridge` · `guardduty-macie-inspector.macie-finding-to-eventbridge` |
| 문항 ambiguous | 6 | `efs-fsx.efs-replication-one-way` · `aurora.aurora-clone` · `elastic-load-balancing.internal-load-balancer` · `lambda.lambda-concurrency-limit-throttling` · `api-gateway-step-functions.api-gateway-behind-cloudfront` · `cost-management.on-demand-capacity-reservation` |
| 개념과 문항의 이동 방향이 어긋남 | 0 | 없음 |
| 이동 권고의 confidence가 high가 아님 | 4 | `ebs-instance-store.cluster-placement-group` · `sqs-sns-eventbridge.sqs-queue-depth-scaling` · `waf-shield.cloudfront` · `iam-permissions.iam-roles-anywhere` |

step 13 cross-phase35의 summary 기록과 다시 센 값의 차이: 없음

## 12. step별 분포와 급변 경고

### index.json summary에 기록된 분포

각 step이 끝날 때 `summary`에 적은 분포를 읽어 옮겼다. 판정 묶음은 그 step이 새로 판정한 개념만 센 값이다.

| step | 이름 | 판정 | keep | ambiguous | move | confidence high·medium·low | serviceSpecificGoal true·false | duplicateOf |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | sample-criteria | 40 | 37 | 3 | 0 | 0·0·0 | 30·10 | 2 |
| 3 | concepts-s3-block | 80 | 74 | 3 | 3 | 2·1·0 | 62·18 | 5 |
| 4 | concepts-file-db | 68 | 68 | 0 | 0 | 0·0·0 | 62·6 | 1 |
| 5 | concepts-db-compute | 64 | 64 | 0 | 0 | 0·0·0 | 59·5 | 1 |
| 6 | concepts-delivery-serverless | 77 | 77 | 0 | 0 | 0·0·0 | 71·6 | 0 |
| 7 | concepts-integration-backup | 60 | 57 | 1 | 2 | 1·1·0 | 49·11 | 0 |
| 8 | concepts-network | 57 | 56 | 1 | 0 | 0·0·0 | 43·14 | 2 |
| 9 | concepts-analytics-observability | 54 | 53 | 1 | 0 | 0·0·0 | 50·4 | 0 |
| 10 | concepts-security | 60 | 56 | 2 | 2 | 1·1·0 | 57·3 | 2 |
| 11 | concepts-identity-cost-ops | 58 | 57 | 1 | 0 | 0·0·0 | 56·2 | 1 |
| — | 판정 묶음 합계 | 618 | 599 | 12 | 7 | 4·3·0 | 539·79 | 14 |
| 12 | consistency-pass (전체 재집계) | 618 | 600 | 11 | 7 | 4·3·0 | 514·104 | 16 |
| — | 현재 판정 파일 | 618 | 600 | 11 | 7 | 4·3·0 | 514·104 | 16 |

- 판정 묶음 합계와 현재 판정 파일의 차이: keep +1 · ambiguous −1 · serviceSpecificGoal true −25 · serviceSpecificGoal false +25 · duplicateOf +2
- step 12 consistency-pass 기록과 현재 판정 파일의 차이: 없음

### 급변 경고

무인 실행기(p36 프로파일)가 판정 묶음마다 걸던 규칙을 위 기록에 다시 적용했다 — 그 묶음의 이동 권고 비율이 앞 묶음 누적
비율보다 max(25%, 누적×3+5%p)를 넘거나, 누적이 10%를 넘는데 그 3분의 1 아래로 떨어지면 경고다.
경고 0건이다.

### 판정 파일의 step 필드로 다시 센 분포

`step` 필드는 그 개념을 처음 판정한 묶음이다. 뒤 step이 고친 판정은 summary 기록과 다르게 드러난다.

| step | 판정 | keep | ambiguous | move | confidence high·medium·low | serviceSpecificGoal true·false | duplicateOf | summary 기록과의 차이 | step 12 표식이 붙은 줄 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 40 | 37 | 3 | 0 | 0·0·0 | 30·10 | 2 | 없음 | 0 |
| 3 | 80 | 74 | 3 | 3 | 2·1·0 | 62·18 | 5 | 없음 | 0 |
| 4 | 68 | 68 | 0 | 0 | 0·0·0 | 63·5 | 2 | serviceSpecificGoal true +1 · serviceSpecificGoal false −1 · duplicateOf +1 | 2 |
| 5 | 64 | 64 | 0 | 0 | 0·0·0 | 59·5 | 2 | duplicateOf +1 | 1 |
| 6 | 77 | 77 | 0 | 0 | 0·0·0 | 70·7 | 0 | serviceSpecificGoal true −1 · serviceSpecificGoal false +1 | 2 |
| 7 | 60 | 57 | 1 | 2 | 1·1·0 | 49·11 | 0 | 없음 | 0 |
| 8 | 57 | 56 | 1 | 0 | 0·0·0 | 45·12 | 2 | serviceSpecificGoal true +2 · serviceSpecificGoal false −2 | 4 |
| 9 | 54 | 53 | 1 | 0 | 0·0·0 | 40·14 | 0 | serviceSpecificGoal true −10 · serviceSpecificGoal false +10 | 11 |
| 10 | 60 | 56 | 2 | 2 | 1·1·0 | 50·10 | 2 | serviceSpecificGoal true −7 · serviceSpecificGoal false +7 | 7 |
| 11 | 58 | 58 | 0 | 0 | 0·0·0 | 46·12 | 1 | keep +1 · ambiguous −1 · serviceSpecificGoal true −10 · serviceSpecificGoal false +10 | 11 |

## 13. 표본 기준과 전체 판정의 어긋남 — step 12 consistency-pass의 기록

표본(step 2)이 세운 기준을 전체 판정에 맞춰 본 일관성 검토의 summary를 그대로 옮긴다.

> 618건을 10개 축으로 교차 비교해 38개 개념의 판정 필드만 수정했다. 축 1·3·5: 일반 역할·비교 원리의 serviceSpecificGoal true→false 29건(emr-glue-athena.emr, emr-glue-athena.glue, kinesis-streaming.kinesis-data-streams, kinesis-streaming.data-firehose, kinesis-streaming.managed-service-apache-flink, redshift-opensearch-quicksight.redshift, cloudwatch-xray.cloudwatch, cloudwatch-xray.x-ray, cloudwatch-xray.performance-insight, cloudwatch-xray.amazon-managed-grafana, secrets-encryption.secrets-manager, secrets-encryption.parameter-store, secrets-encryption.acm, waf-shield.shield, guardduty-macie-inspector.guardduty, guardduty-macie-inspector.amazon-inspector, guardduty-macie-inspector.security-hub, identity-federation.sts, organizations-cloudtrail-config.aws-config, organizations-cloudtrail-config.cloudtrail, organizations-cloudtrail-config.audit-manager, cost-management.billing-and-cost-management, cost-management.trusted-advisor, governance-iac.cloudformation, governance-iac.service-catalog, ecs-eks-fargate.aws-batch, ai-ml-services.comprehend, ai-ml-services.amazon-lex, hybrid-connectivity.vpn-vs-direct-connect); 축 3·5: 서비스별 전송 방식·연결 제약·라우팅 선택의 serviceSpecificGoal false→true 4건(data-transfer-services.file-gateway-vs-datasync-continuous, hybrid-connectivity.onprem-connectivity-heuristic, hybrid-connectivity.region-attached-edge-options, route53.multi-region-failover-for-region-outage); 축 4·9: 한쪽에만 있던 duplicateOf를 상호 기록한 2건(rds-storage-features.rds-blue-green-deployment, ec2-autoscaling.ec2-image-builder); 축 3·6: 할인과 용량 확보의 비교를 EC2 이름·스팟 결론으로 보류하지 않도록 ambiguous→keep 1건(cost-management.on-demand-capacity-reservation); 축 3·8: 비교 결론과 주제 간 선행 독서를 소속 근거로 쓴 rationale 정리 2건(ecs-eks-fargate.fargate-no-time-limit, redshift-opensearch-quicksight.athena-vs-redshift-workload). 모든 수정 rationale에 변경 내용과 이유를 남겼다. 최종 fit keep 600·ambiguous 11·move-recommended 7, confidence high 4·medium 3·low 0(null 611), serviceSpecificGoal true 514·false 104, duplicateOf 16행(8쌍), 재검토 신호 조합 22건(keep+중복 16·move+고유 목표 6). 이동 권고 7건의 방향과 blockImpact는 대상 배열 및 ADR-033의 전제·블록 순서와 대조해 유지했다. 가장 높은 ebs-instance-store의 이동 비율 3/15도 EC2 배치·네트워크 기능이라는 학습 목표로 재확인했고 비율은 맞추지 않았다. 축 2의 서비스별 권한·암호화·로깅 조건은 keep, DataSync·ACM·CloudWatch·GuardDuty·Macie의 이벤트 연동은 서비스 운영과 공통 이벤트 패턴의 두 해석으로 ambiguous를 유지했다. 580행은 바이트 단위로 보존했으며 전체 618행의 개념 id·순서·questionCount·questionIds와 나머지 고정 필드도 그대로다. Node 18.17.1에서 lint·build·512개 테스트·구조 검사·검사기 --expect 618 --complete·id 집합/신호 검사·잠긴 파일 5종 해시·교차 파일 부재 등 AC 9개를 모두 통과했다. phase 35 판정 내용은 열람하지 않고 AC의 해시만 계산했으며 개념·문항·제품 코드·테스트·검사기는 수정하지 않았다.

판정 파일에서 이 step의 표식(`step 12`)이 `rationale`에 붙은 줄은 38건이고,
그중 표본에서 온 줄(step 필드 2)은 0건이다.

| 개념 | 처음 판정 step | fit | serviceSpecificGoal | 기록 문장 |
| --- | --- | --- | --- | --- |
| `data-transfer-services.file-gateway-vs-datasync-continuous` | 4 | keep | true | step 12 축 3·5 재검토에서 serviceSpecificGoal을 false에서 true로 고치고 학습 목표에 두 서비스의 전송 방식을 되살렸다. |
| `rds-storage-features.rds-blue-green-deployment` | 4 | keep | true | step 12 축 4·9 재검토에서 aurora.read-replica-no-schema-change와의 duplicateOf를 추가해 한쪽에만 있던 중복 기록을 맞췄다. |
| `ec2-autoscaling.ec2-image-builder` | 5 | keep | true | step 12 축 4·9 재검토에서 systems-manager.ssm-patch-manager와의 duplicateOf를 추가해 한쪽에만 있던 중복 기록을 맞췄다. |
| `ecs-eks-fargate.fargate-no-time-limit` | 6 | keep | true | step 12 축 3 재검토에서 결론과 블록의 주인이 Fargate라서 유지한다는 근거를 비교 축 자체로 고쳤다. |
| `ecs-eks-fargate.aws-batch` | 6 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `hybrid-connectivity.vpn-vs-direct-connect` | 8 | keep | false | step 12 축 3·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `hybrid-connectivity.onprem-connectivity-heuristic` | 8 | keep | true | step 12 축 3·5 재검토에서 serviceSpecificGoal을 false에서 true로 고쳤다. |
| `hybrid-connectivity.region-attached-edge-options` | 8 | keep | true | step 12 축 3·5 재검토에서 serviceSpecificGoal을 false에서 true로 고쳤다. |
| `route53.multi-region-failover-for-region-outage` | 8 | keep | true | step 12 축 3·5 재검토에서 serviceSpecificGoal을 false에서 true로 고치고 학습 목표를 실제 라우팅 선택에 맞췄다. |
| `emr-glue-athena.emr` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `emr-glue-athena.glue` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `kinesis-streaming.kinesis-data-streams` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `kinesis-streaming.data-firehose` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `kinesis-streaming.managed-service-apache-flink` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `redshift-opensearch-quicksight.redshift` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `redshift-opensearch-quicksight.athena-vs-redshift-workload` | 9 | keep | false | step 12 축 3·8 재검토에서 앞 주제에 Athena가 있어 두 블록을 이미 읽었다는 전제와 결론이 웨어하우스라서 유지한다는 근거를 없앴다. |
| `cloudwatch-xray.cloudwatch` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `cloudwatch-xray.x-ray` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `cloudwatch-xray.performance-insight` | 9 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `cloudwatch-xray.amazon-managed-grafana` | 9 | keep | false | step 12 축 3·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `secrets-encryption.secrets-manager` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `secrets-encryption.parameter-store` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `secrets-encryption.acm` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `waf-shield.shield` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `guardduty-macie-inspector.guardduty` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `guardduty-macie-inspector.amazon-inspector` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `guardduty-macie-inspector.security-hub` | 10 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `identity-federation.sts` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `organizations-cloudtrail-config.aws-config` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `organizations-cloudtrail-config.cloudtrail` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `organizations-cloudtrail-config.audit-manager` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `cost-management.on-demand-capacity-reservation` | 11 | keep | true | step 12 축 3·6 재검토에서 ambiguous를 keep으로 고쳤다. |
| `cost-management.billing-and-cost-management` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `cost-management.trusted-advisor` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `governance-iac.cloudformation` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `governance-iac.service-catalog` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `ai-ml-services.comprehend` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |
| `ai-ml-services.amazon-lex` | 11 | keep | false | step 12 축 1·5 재검토에서 serviceSpecificGoal을 true에서 false로 고쳤다. |

## 14. 집계하며 확인한 것 — 판정은 고치지 않았다

- 이동 권고를 대상 주제에 모두 넣어 보면 `blockImpact`가 지정한 앞뒤와 맞붙지 않는 자리 1건:
  - `ec2-autoscaling` — `ebs-instance-store.cluster-placement-group`의 뒤로 지정한 `ec2-autoscaling.enhanced-networking` 대신 `ebs-instance-store.spread-placement-group`이 붙는다
- 옮긴 id가 이미 있는 개념 id와 겹치는 후보 1건: `waf-shield.cloudfront`
- 원 주제 id를 적은 `blockImpact` 0건 / 7건

위 어긋남과 겹침은 대상 주제의 자리·id를 정하는 설계 문제이고 `fit`·`confidence`를 바꿀 근거가 아니어서 판정 파일을 고치지
않았다. 후보별 상세는 `handoff-fixes.md`에 있다.
