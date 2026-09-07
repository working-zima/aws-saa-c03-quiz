# AWS 서비스 카테고리 (세 번째 출처)

이 파일은 개념 본문에 넣는 **카테고리 한 줄**의 유일한 근거다. 근거는 ADR-019.

`concepts-raw.md`·`exam-gaps.md`와 달리 이 파일은 **AWS 공개 문서에서 뽑은 것**이라
저장소에 커밋한다. 외부 참고 자료가 아니므로 ADR-009의 전사 금지와 부딪치지 않는다.

## 출처

주 출처는 AWS 백서 *Overview of Amazon Web Services*의 "AWS services by category"다.
카테고리 이름과 각 서비스의 배치를 모두 여기서 가져왔다.

- 카테고리 목록 — <https://docs.aws.amazon.com/whitepapers/latest/aws-overview/amazon-web-services-cloud-platform.html>
- 카테고리별 서비스 목록 — 같은 백서의 `analytics.html`, `compute-services.html`,
  `storage-services.html`, `database.html`, `networking-services.html`,
  `application-integration.html`, `management-governance.html`, `security-services.html`,
  `migration-services.html`, `containers.html`, `aws-cost-management.html`,
  `developer-tools.html`, `business-applications.html`, `machine-learning.html`,
  `mobile-services.html`

백서의 카테고리별 **Topics 목록에 개별 항목이 없는** 서비스는 보조 출처를 썼다.
어느 것이 보조 출처인지는 아래 매핑 표에 표시했다.

- `STS` — IAM 사용자 가이드 "Temporary security credentials in IAM".
  제목이 밝히는 대로 IAM 문서의 일부이고, 본문이 `AWS STS`가 IAM의 임시 자격 증명을
  발급한다고 적는다. <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html>
- `Billing and Cost Management`·`Cost Anomaly Detection` — AWS Cost Management 사용자 가이드
  "Use AWS Billing and Cost Management for AWS". `Cost Explorer`·`Cost Anomaly Detection`·
  `Budgets`·`Savings Plans`를 모두 Billing and Cost Management의 기능으로 열거한다.
  <https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html>
- `SCT` — AWS Database Migration Service 사용 설명서 "What is AWS Database Migration Service?".
  DMS로 스키마를 변환하는 절차를 설명하면서 `AWS Schema Conversion Tool (AWS SCT)`을 내려받아
  쓰는 길을 같은 흐름의 대안으로 적는다. 곧 SCT는 DMS 문서 안에서 DMS의 마이그레이션 절차로
  다뤄진다. <https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html>

확인 시점은 2026-09-04다. **phase 26에서 더한 부분(아래 "phase 26에서 들어오는 서비스"와
"카테고리 없음")의 확인 시점은 2026-09-07이다.** 매핑 표의 `OpenSearch` 한 행도 2026-09-07에
백서 분석 페이지의 Topics 목록(앵커 `#amazon-opensearch-service`)에서 확인했다.

### 백서의 제목이 이 파일과 다른 셋

2026-09-07에 다시 받아 보니 백서가 아래 셋을 다른 이름으로 적고 있었다. 링크와 앵커,
본문이 같은 서비스를 가리키므로 그대로 근거로 쓰되, 다음에 대조할 때 헷갈리지 않도록 남긴다.

| 이 파일의 이름 | 백서의 제목 | 확인한 근거 |
| --- | --- | --- |
| QuickSight | Quick | 앵커가 `#amazon-quicksight`이고 본문이 `QuickSight lets you create and publish interactive dashboards`로 이어진다 |
| Application Migration Service | AWS Transform MGN | 링크가 `aws.amazon.com/application-migration-service`이고 약칭을 `AWS MGN`으로 적는다 |
| Security Hub | AWS Security Hub CSPM | 링크가 `aws.amazon.com/security-hub`다 |

## 이 파일에서 가져와도 되는 것과 안 되는 것

가져와도 되는 것은 **카테고리 이름과 어느 서비스가 어느 카테고리에 들어가는지**뿐이다.
서비스의 사양·제약·비교는 여전히 `concepts-raw.md`와 `exam-gaps.md`에서만 가져온다.
ADR-010이 세운 기준("이 사실이 어떤 문항의 정답 근거가 될 수 있는가")은 그대로 살아 있다.

## 카테고리 15종

앱에 쓰는 표기는 `한글 이름(백서의 영문 이름)`이다.

마지막 두 종은 phase 26에서 더했다. 근거는 ADR-022이고, 출처는 위와 같은 백서
같은 페이지다. 백서는 카테고리 21종을 싣고 있는데 앞의 13종은 **그때 앱에 서비스가
있던 것만** 적어 둔 것이었다.

| 표기 | 백서 카테고리 |
| --- | --- |
| `컴퓨팅(Compute)` | Compute |
| `컨테이너(Containers)` | Containers |
| `스토리지(Storage)` | Storage |
| `데이터베이스(Databases)` | Databases |
| `분석(Analytics)` | Analytics |
| `네트워킹 및 콘텐츠 전송(Networking and Content Delivery)` | Networking and content delivery |
| `애플리케이션 통합(Application Integration)` | Application integration |
| `관리 및 거버넌스(Management and Governance)` | Management and governance |
| `보안·자격 증명·규정 준수(Security, Identity, and Compliance)` | Security, identity, and compliance |
| `마이그레이션 및 전송(Migration and Transfer)` | Migration and transfer |
| `클라우드 재무 관리(Cloud Financial Management)` | Cloud Financial Management |
| `개발자 도구(Developer Tools)` | Developer tools |
| `비즈니스 애플리케이션(Business Applications)` | Business applications |
| `기계 학습(Machine Learning and Artificial Intelligence)` | Machine Learning (ML) and Artificial Intelligence (AI) |
| `프런트엔드 웹 및 모바일(Front-end Web and Mobile)` | Front-end web and mobile |

표기의 영문은 백서의 문장형 대소문자를 제목형으로 고쳐 적는다
(`Networking and content delivery` → `Networking and Content Delivery`).
`기계 학습`은 여기에 더해 **괄호 약어를 뺐다.** 백서의 이름이
`Machine Learning (ML) and Artificial Intelligence (AI)`라 표기 형식의 괄호와 중첩되고,
이 표기가 개념 본문 문장 안으로 들어가면 읽기 어려워지기 때문이다. `(ML)`·`(AI)`는
바로 앞 단어를 줄인 것이라 빼도 가리키는 대상이 달라지지 않는다. 근거는 ADR-022.

## 주제 배치와 어긋나는 자리

주제는 서비스 경계로 잘려 있고(ADR-023), 백서는 그와 다른 기준으로 서비스를 묶는다.
그래서 **한 주제 안에서 어떤 개념의 카테고리가 이웃과 갈리는** 자리가 생긴다.
**갈리는 것 자체가 학습 내용이므로 개념을 옮기지 않고 카테고리만 밝힌다.**

`이 앱의 주제`는 `topicId`로 적는다. 주제 제목은 담는 서비스를 나열한 것이라 길다.
표는 주제 배열 순서를 따른다.

| 개념 | 이 앱의 주제 | 백서 카테고리 |
| --- | --- | --- |
| `Storage Gateway` | `storage-gateway-migration` | 스토리지 (DMS·Application Migration Service는 마이그레이션 및 전송) |
| `Elastic Beanstalk` | `ecs-eks-fargate` | 컴퓨팅 (ECS·EKS·ECR은 컨테이너) |
| `API Gateway` | `api-gateway-step-functions` | 네트워킹 및 콘텐츠 전송 (Step Functions는 애플리케이션 통합) |
| `Amplify` | `api-gateway-step-functions` | 프런트엔드 웹 및 모바일 |
| `SES` | `sqs-sns-eventbridge` | 비즈니스 애플리케이션 (SQS·SNS·EventBridge·Amazon MQ는 애플리케이션 통합) |
| `AWS Backup` | `backup-disaster-recovery` | 스토리지 |
| `Elastic Disaster Recovery` | `backup-disaster-recovery` | 스토리지 (AWS Backup과 같은 자리) |
| `CloudWatch` | `cloudwatch-xray` | 관리 및 거버넌스 |
| `Managed Grafana` | `cloudwatch-xray` | 관리 및 거버넌스 (CloudWatch와 같은 자리) |
| `X-Ray` | `cloudwatch-xray` | 개발자 도구 |
| `Parameter Store` | `secrets-encryption` | 관리 및 거버넌스 (Secrets Manager는 보안) |
| `Audit Manager` | `organizations-cloudtrail-config` | 보안·자격 증명·규정 준수 |
| `Trusted Advisor` | `cost-management` | 관리 및 거버넌스 (절약 플랜·Budgets·Cost Explorer는 클라우드 재무 관리) |
| `Compute Optimizer` | `cost-management` | 관리 및 거버넌스 (Trusted Advisor와 같은 자리) |
| `Resource Access Manager` | `governance-iac` | 보안·자격 증명·규정 준수 |

`MSK`는 한때 이 표에 있었다 — 옛 `메시징·백업` 주제에 있으면서 백서 카테고리는 분석이었다.
phase 26이 MSK를 `kinesis-streaming`으로 옮기면서 이웃(Kinesis 계열)과 카테고리가 같아졌으므로
표에서 뺐다.

## 매핑 — 개념 107개

`보조`란에 표시가 있는 항목은 위 "출처"에 적은 보조 출처를 근거로 배치한 것이다.

| 개념 id | 문장 주어 | 카테고리 | 보조 |
| --- | --- | --- | --- |
| `aws-core-services.ec2` | EC2 | 컴퓨팅 |  |
| `aws-core-services.rds` | RDS | 데이터베이스 |  |
| `aws-core-services.s3` | S3 | 스토리지 |  |
| `aws-core-services.route-53` | Route 53 | 네트워킹 및 콘텐츠 전송 |  |
| `aws-core-services.elb` | ELB | 네트워킹 및 콘텐츠 전송 |  |
| `aws-core-services.cloudfront` | CloudFront | 네트워킹 및 콘텐츠 전송 |  |
| `aws-core-services.lambda` | Lambda | 컴퓨팅 |  |
| `ebs-instance-store.ebs` | EBS | 스토리지 |  |
| `efs-fsx.efs` | EFS | 스토리지 |  |
| `efs-fsx.fsx` | FSx | 스토리지 |  |
| `data-transfer-services.datasync` | DataSync | 마이그레이션 및 전송 |  |
| `data-transfer-services.snowball-edge` | Snowball Edge | 마이그레이션 및 전송 |  |
| `data-transfer-services.transfer-family` | Transfer Family | 마이그레이션 및 전송 |  |
| `storage-gateway-migration.storage-gateway` | Storage Gateway | 스토리지 |  |
| `storage-gateway-migration.dms-sct` | DMS와 SCT | 마이그레이션 및 전송 | DMS 가이드 (SCT) |
| `storage-gateway-migration.application-migration-service` | Application Migration Service | 마이그레이션 및 전송 |  |
| `rds-storage-features.rds` | RDS | 데이터베이스 |  |
| `aurora.aurora` | Aurora | 데이터베이스 |  |
| `dynamodb.dynamodb` | DynamoDB | 데이터베이스 |  |
| `elasticache-purpose-built-db.elasticache` | ElastiCache | 데이터베이스 |  |
| `elasticache-purpose-built-db.documentdb` | DocumentDB | 데이터베이스 |  |
| `elasticache-purpose-built-db.neptune` | Neptune | 데이터베이스 |  |
| `elasticache-purpose-built-db.timestream` | Timestream | 데이터베이스 |  |
| `ec2-autoscaling.ec2` | EC2 | 컴퓨팅 |  |
| `ec2-autoscaling.ec2-image-builder` | EC2 Image Builder | 컴퓨팅 |  |
| `elastic-load-balancing.elb` | ELB | 네트워킹 및 콘텐츠 전송 |  |
| `cloudfront-global-accelerator.cloudfront` | CloudFront | 네트워킹 및 콘텐츠 전송 |  |
| `cloudfront-global-accelerator.global-accelerator` | Global Accelerator | 네트워킹 및 콘텐츠 전송 |  |
| `lambda.lambda` | Lambda | 컴퓨팅 |  |
| `ecs-eks-fargate.ecs` | ECS | 컨테이너 |  |
| `ecs-eks-fargate.eks` | EKS | 컨테이너 |  |
| `ecs-eks-fargate.ecr-image-scan-on-push` | ECR | 컨테이너 |  |
| `ecs-eks-fargate.aws-batch` | AWS Batch | 컴퓨팅 |  |
| `ecs-eks-fargate.elastic-beanstalk` | Elastic Beanstalk | 컴퓨팅 |  |
| `ecs-eks-fargate.app2container` | App2Container | 컨테이너 |  |
| `api-gateway-step-functions.api-gateway` | API Gateway | 네트워킹 및 콘텐츠 전송 |  |
| `api-gateway-step-functions.step-functions` | Step Functions | 애플리케이션 통합 |  |
| `sqs-sns-eventbridge.sqs` | SQS | 애플리케이션 통합 |  |
| `sqs-sns-eventbridge.sns` | SNS | 애플리케이션 통합 |  |
| `sqs-sns-eventbridge.eventbridge` | EventBridge | 애플리케이션 통합 |  |
| `sqs-sns-eventbridge.amazon-mq` | Amazon MQ | 애플리케이션 통합 |  |
| `sqs-sns-eventbridge.ses` | SES | 비즈니스 애플리케이션 |  |
| `backup-disaster-recovery.backup` | AWS Backup | 스토리지 |  |
| `backup-disaster-recovery.elastic-disaster-recovery` | Elastic Disaster Recovery | 스토리지 |  |
| `vpc-networking.vpc-subnet` | VPC | 네트워킹 및 콘텐츠 전송 |  |
| `vpc-networking.privatelink` | PrivateLink | 네트워킹 및 콘텐츠 전송 |  |
| `hybrid-connectivity.site-to-site-vpn` | Site-to-Site VPN | 네트워킹 및 콘텐츠 전송 |  |
| `hybrid-connectivity.direct-connect` | Direct Connect | 네트워킹 및 콘텐츠 전송 |  |
| `hybrid-connectivity.transit-gateway` | Transit Gateway | 네트워킹 및 콘텐츠 전송 |  |
| `hybrid-connectivity.client-vpn` | Client VPN | 네트워킹 및 콘텐츠 전송 |  |
| `hybrid-connectivity.region-attached-edge-options` | Local Zones·Outposts·Wavelength | 컴퓨팅 |  |
| `route53.route53` | Route53 | 네트워킹 및 콘텐츠 전송 |  |
| `emr-glue-athena.emr` | EMR | 분석 |  |
| `emr-glue-athena.glue` | Glue | 분석 |  |
| `emr-glue-athena.athena` | Athena | 분석 |  |
| `emr-glue-athena.lake-formation` | Lake Formation | 분석 |  |
| `kinesis-streaming.kinesis-data-streams` | Kinesis Data Streams | 분석 |  |
| `kinesis-streaming.data-firehose` | Data Firehose | 분석 |  |
| `kinesis-streaming.managed-service-apache-flink` | Managed Service for Apache Flink | 분석 |  |
| `kinesis-streaming.kinesis-video-streams` | Kinesis Video Streams | 분석 |  |
| `kinesis-streaming.msk` | MSK | 분석 |  |
| `redshift-opensearch-quicksight.redshift` | RedShift | 분석 |  |
| `redshift-opensearch-quicksight.opensearch-text-search` | OpenSearch | 분석 |  |
| `redshift-opensearch-quicksight.quicksight` | QuickSight | 분석 |  |
| `cloudwatch-xray.cloudwatch` | CloudWatch | 관리 및 거버넌스 |  |
| `cloudwatch-xray.x-ray` | X-Ray | 개발자 도구 |  |
| `cloudwatch-xray.amazon-managed-grafana` | Managed Grafana | 관리 및 거버넌스 |  |
| `secrets-encryption.secrets-manager` | Secrets Manager | 보안·자격 증명·규정 준수 |  |
| `secrets-encryption.parameter-store` | Parameter Store | 관리 및 거버넌스 |  |
| `secrets-encryption.kms` | KMS | 보안·자격 증명·규정 준수 |  |
| `secrets-encryption.acm` | ACM | 보안·자격 증명·규정 준수 |  |
| `secrets-encryption.cloudhsm` | CloudHSM | 보안·자격 증명·규정 준수 |  |
| `waf-shield.waf` | WAF | 보안·자격 증명·규정 준수 |  |
| `waf-shield.shield` | Shield | 보안·자격 증명·규정 준수 |  |
| `waf-shield.cloudfront` | CloudFront | 네트워킹 및 콘텐츠 전송 |  |
| `waf-shield.firewall-manager` | Firewall Manager | 보안·자격 증명·규정 준수 |  |
| `guardduty-macie-inspector.guardduty` | GuardDuty | 보안·자격 증명·규정 준수 |  |
| `guardduty-macie-inspector.macie` | Macie | 보안·자격 증명·규정 준수 |  |
| `guardduty-macie-inspector.amazon-inspector` | Inspector | 보안·자격 증명·규정 준수 |  |
| `guardduty-macie-inspector.security-hub` | Security Hub | 보안·자격 증명·규정 준수 |  |
| `iam-permissions.iam` | IAM | 보안·자격 증명·규정 준수 |  |
| `identity-federation.identity-center` | Identity Center | 보안·자격 증명·규정 준수 |  |
| `identity-federation.sts` | STS | 보안·자격 증명·규정 준수 | IAM 가이드 |
| `identity-federation.cognito` | Cognito | 보안·자격 증명·규정 준수 |  |
| `identity-federation.aws-directory-service` | Directory Service | 보안·자격 증명·규정 준수 |  |
| `organizations-cloudtrail-config.cloudtrail` | CloudTrail | 관리 및 거버넌스 |  |
| `organizations-cloudtrail-config.aws-config` | AWS Config | 관리 및 거버넌스 |  |
| `organizations-cloudtrail-config.organizations-scp` | AWS Organizations | 관리 및 거버넌스 |  |
| `organizations-cloudtrail-config.audit-manager` | Audit Manager | 보안·자격 증명·규정 준수 |  |
| `cost-management.savings-plan` | 절약 플랜 | 클라우드 재무 관리 |  |
| `cost-management.aws-budgets` | AWS Budgets | 클라우드 재무 관리 |  |
| `cost-management.cost-explorer` | Cost Explorer | 클라우드 재무 관리 |  |
| `cost-management.billing-and-cost-management` | Billing and Cost Management | 클라우드 재무 관리 | 비용 관리 가이드 |
| `cost-management.trusted-advisor` | Trusted Advisor | 관리 및 거버넌스 |  |
| `cost-management.compute-optimizer` | Compute Optimizer | 관리 및 거버넌스 |  |
| `cost-management.cost-anomaly-detection` | Cost Anomaly Detection | 클라우드 재무 관리 | 비용 관리 가이드 |
| `cost-management.cost-and-usage-report` | Cost and Usage Report | 클라우드 재무 관리 |  |
| `governance-iac.cloudformation` | CloudFormation | 관리 및 거버넌스 |  |
| `governance-iac.service-catalog` | Service Catalog | 관리 및 거버넌스 |  |
| `governance-iac.control-tower-landing-zone` | Control Tower | 관리 및 거버넌스 |  |
| `governance-iac.resource-access-manager` | Resource Access Manager | 보안·자격 증명·규정 준수 |  |
| `systems-manager.ssm-run-command` | Systems Manager | 관리 및 거버넌스 |  |
| `api-gateway-step-functions.amplify` | Amplify | 프런트엔드 웹 및 모바일 |  |
| `ai-ml-services.sagemaker` | SageMaker AI | 기계 학습 |  |
| `ai-ml-services.media-ai-service-lineup` | Transcribe·Rekognition·Translate·Textract | 기계 학습 |  |
| `ai-ml-services.comprehend` | Comprehend | 기계 학습 |  |
| `ai-ml-services.amazon-lex` | Lex | 기계 학습 |  |
## phase 26에서 들어오는 서비스

`dump-gaps/`의 개념이 다루는 서비스 중 위 표에 없던 것들이다.
개념 id는 step 2~20이 주제를 확정하면서 정해지므로 여기서는 **서비스 이름으로만** 적는다.
각 step이 자기 개념에 한 줄을 붙일 때 이 표에서 주어와 카테고리를 가져간다.

**표에 있다고 해서 그 개념에 문장을 붙이라는 뜻이 아니다.** 아래
"카테고리 문장을 붙이지 않는 개념"의 세 기준은 그대로 적용된다 — 예를 들어
`fargate-per-second-billing`처럼 사실·비교 개념이면 서비스가 이 표에 있어도 붙이지 않는다.
한 서비스에 개념이 여럿 붙는 경우(`ssm-run-command`·`ssm-patch-manager` 등) 그중
**그 서비스를 소개하는 개념 하나**에만 붙인다.

`문장 주어`의 조사는 주어의 읽는 소리에 맞춰 여기서 확정했다. 뒤 step이 다시 정하지 마라.

| 서비스 | 문장 주어 | 카테고리 | 보조 |
| --- | --- | --- | --- |
| Elastic Beanstalk | Elastic Beanstalk는 | 컴퓨팅 | |
| EC2 Auto Scaling | EC2 Auto Scaling은 | 컴퓨팅 | |
| EC2 Image Builder | EC2 Image Builder는 | 컴퓨팅 | |
| Outposts | Outposts는 | 컴퓨팅 | |
| Wavelength | Wavelength는 | 컴퓨팅 | |
| Local Zones | Local Zones는 | 컴퓨팅 | 컴퓨팅 비교 표 |
| ECR | ECR은 | 컨테이너 | |
| App2Container | App2Container는 | 컨테이너 | |
| Neptune | Neptune은 | 데이터베이스 | |
| Timestream | Timestream은 | 데이터베이스 | |
| Lake Formation | Lake Formation은 | 분석 | |
| QuickSight | QuickSight는 | 분석 | |
| Kinesis Video Streams | Kinesis Video Streams는 | 분석 | |
| Amazon MQ | Amazon MQ는 | 애플리케이션 통합 | |
| CloudFormation | CloudFormation은 | 관리 및 거버넌스 | |
| Service Catalog | Service Catalog는 | 관리 및 거버넌스 | |
| Control Tower | Control Tower는 | 관리 및 거버넌스 | |
| Systems Manager | Systems Manager는 | 관리 및 거버넌스 | |
| Managed Grafana | Managed Grafana는 | 관리 및 거버넌스 | |
| Inspector | Inspector는 | 보안·자격 증명·규정 준수 | |
| Security Hub | Security Hub는 | 보안·자격 증명·규정 준수 | |
| Audit Manager | Audit Manager는 | 보안·자격 증명·규정 준수 | |
| Firewall Manager | Firewall Manager는 | 보안·자격 증명·규정 준수 | |
| Directory Service | Directory Service는 | 보안·자격 증명·규정 준수 | |
| Resource Access Manager | Resource Access Manager는 | 보안·자격 증명·규정 준수 | |
| DMS | DMS는 | 마이그레이션 및 전송 | |
| SCT | SCT는 | 마이그레이션 및 전송 | DMS 가이드 |
| Application Migration Service | Application Migration Service는 | 마이그레이션 및 전송 | |
| Elastic Disaster Recovery | Elastic Disaster Recovery는 | 스토리지 | |
| Cost and Usage Report | Cost and Usage Report는 | 클라우드 재무 관리 | |
| SageMaker AI | SageMaker AI는 | 기계 학습 | |
| Comprehend | Comprehend는 | 기계 학습 | |
| Rekognition | Rekognition은 | 기계 학습 | |
| Lex | Lex는 | 기계 학습 | |
| Transcribe | Transcribe는 | 기계 학습 | |
| Translate | Translate는 | 기계 학습 | |
| Textract | Textract는 | 기계 학습 | |
| Amplify | Amplify는 | 프런트엔드 웹 및 모바일 | |

38개다. 카테고리별 분포는 기계 학습 7 · 컴퓨팅 6 · 보안·자격 증명·규정 준수 6 ·
관리 및 거버넌스 5 · 마이그레이션 및 전송 3 · 분석 3 · 컨테이너 2 · 데이터베이스 2 ·
애플리케이션 통합 1 · 스토리지 1 · 클라우드 재무 관리 1 · 프런트엔드 웹 및 모바일 1이다.

마지막 여덟은 **처음에 "카테고리 없음"으로 뺐다가 되돌린 것이다.** 백서 카테고리가
그때의 13종 밖이었기 때문인데, ADR-022가 13종을 15종으로 넓히면서 붙일 수 있게 됐다.

`보조`란의 뜻은 위 표와 같다. 둘뿐이다.

- `Local Zones` — 백서 컴퓨팅 페이지에 있지만 Topics 목록이 아니라 그 페이지의
  "Compare AWS compute services" 표의 `Edge and hybrid` 줄에 있다. 같은 카테고리 페이지이므로
  근거로 쓰되 자리가 다르다는 것을 표시한다.
- `SCT` — 위 "출처"의 AWS DMS 사용 설명서다.

`Auto Scaling`은 백서가 둘로 나눠 싣는다. **`Amazon EC2 Auto Scaling`은 컴퓨팅**,
**`AWS Auto Scaling`은 관리 및 거버넌스**다. 이 앱의 개념(`asg-*`·`predictive-scaling`·
`target-tracking-vs-simple-scaling`)은 전부 EC2 인스턴스를 늘리고 줄이는 이야기이므로
컴퓨팅 쪽을 쓴다. 둘을 섞지 마라.

## 카테고리 없음

아래 서비스는 카테고리 한 줄을 **붙이지 않는다.** 뒤 step은 이 절을 보고 건너뛴다.

**한때 여기 있다가 빠진 여덟이 있다.** `SageMaker AI`·`Comprehend`·`Rekognition`·`Lex`·
`Transcribe`·`Translate`·`Textract`·`Amplify`는 백서 카테고리가 그때의 13종 밖이라
처음에 이 절에 넣었는데, ADR-022가 13종을 15종으로 넓히면서 위 "phase 26에서 들어오는
서비스" 표로 옮겼다. **지금은 카테고리 한 줄을 붙인다.**

### 백서에서도 보조 출처에서도 카테고리를 찾지 못했다

다섯이다. 근거 없이 채우지 않는다.

| 서비스 | 찾지 못한 근거 |
| --- | --- |
| Amazon QLDB | 백서 데이터베이스 Topics 목록에 없다. 개발자 안내서 URL(`docs.aws.amazon.com/qldb/latest/developerguide/what-is.html`)도 404다 |
| AWS ParallelCluster | 백서 컴퓨팅 Topics 목록에 없다. 오픈소스 클러스터 관리 도구라 백서가 다루는 서비스 목록에 오르지 않는다 |
| Workload Discovery on AWS | 백서 어느 카테고리 Topics 목록에도 없다. 이름대로 AWS Solutions 쪽 솔루션이지 백서가 세는 서비스가 아니다 |
| AWS AppConfig | 백서 관리 및 거버넌스·개발자 도구 Topics 목록 어디에도 없다. Systems Manager 사용 설명서의 도구 목록에도 AppConfig가 없어 보조 출처로도 잇지 못했다 |
| AWS Glue DataBrew | 백서 분석 Topics 목록에 `AWS Glue`는 있지만 `DataBrew`가 개별 항목으로 없다 |

`Network Access Analyzer`·`IAM Access Analyzer`·`IAM Roles Anywhere`·`RDS Proxy`·
`Data Lifecycle Manager`·`Redshift Spectrum`·`Glue Crawler`·`Backup Audit Manager`·
`EC2 Instance Connect`·`Route 53 Resolver`처럼 **이미 표에 있는 서비스의 기능**은 이 절의
대상이 아니다. 아래 "카테고리 문장을 붙이지 않는 개념"의 기준 2가 이미 덮는다.

## 문장 형태

`{주어}는 AWS 분류로는 {카테고리} 쪽 서비스다.` 형태로 개념 `paragraphs[0]` 맨 앞에 붙인다.
조사는 주어의 읽는 소리에 맞춘다(`Route 53은`, `AWS Backup은`, `EMR은`, `CloudTrail은`,
`ACM은`, `CloudHSM은`, `IAM은`, `Site-to-Site VPN은`, `Client VPN은`, `Cost Anomaly Detection은`).

**`AWS 분류로는`을 빼지 마라.** 원본에서 온 정의 문장이 다른 갈래의 이름을 쓰는 개념이 있어서다.
`EMR`의 정의는 `대량의 데이터를 처리해야 할 때 사용하는 컴퓨팅 서비스다`이고 `RedShift`는
`AWS 데이터베이스 서비스다`인데, 백서 카테고리는 둘 다 분석이다. 프레임 없이 `EMR은 분석 쪽
서비스다`를 앞에 붙이면 이어지는 정의 문장과 서로 다투는 것처럼 읽힌다. 이 표현은 카테고리가
**AWS가 매긴 분류**라는 것도 함께 밝혀 준다 — 서비스의 정체를 다시 정의하는 문장이 아니다.

`절약 플랜`은 서술만 예외로 `쪽에 속한다`를 쓴다. 백서가 이것을 서비스가 아니라
`a flexible pricing model`로 소개하기 때문이다.

## 카테고리 문장을 붙이지 않는 개념

618개 중 511개는 대상이 아니다. 기준은 세 가지다.

1. **AWS 서비스가 아닌 것** — `DNS`, `리전`, `가용 영역`, `온프레미스`, `마이그레이션`,
   `Spark`(오픈소스 엔진), `가용성` 등. 카테고리라는 개념 자체가 성립하지 않는다.
2. **서비스의 기능·설정·유형** — S3 스토리지 클래스 7종, `S3 버전 관리`, `SSE`,
   `인스턴스 스토어`, `NAT 게이트웨이`, `VPC Endpoint`, `보안 그룹`, `NACL`,
   `Route53 라우팅 정책`, `Glue Crawler`, `EventBridge Scheduler` 등. 상위 서비스에
   카테고리가 이미 붙는다.
3. **사실·비교·판단 기준 개념** — `Fargate에는 실행 시간 제한이 없다`,
   `DAX는 DynamoDB 전용`, `계층으로 갈리는 ALB와 NLB`, `시험에서 자주 통하는 판단 기준` 등.
   서비스를 소개하는 자리가 아니다.

`Fargate`·`DAX`처럼 백서에 카테고리가 있는 서비스라도, 이 앱에서 그 이름을 단
개념이 사실·비교 개념이면 문장을 붙이지 않는다. 소개 문장이 아닌 곳에 카테고리를 끼우면
그 문단이 무엇을 말하려는지 흐려진다.

`OpenSearch`도 한때 이 예에 있었다. 그때는 OpenSearch를 단 개념이 로그 분석 선택지를
비교하는 자리뿐이었기 때문인데, phase 26이 서비스를 소개하는 개념
(`redshift-opensearch-quicksight.opensearch-text-search`)을 들여왔으므로 지금은 위 매핑 표에
있고 한 줄을 붙인다. **이 예는 서비스 이름이 아니라 개념의 성격으로 갈린다** — 서비스가
이 목록에 올랐다는 것만 보고 뒤 작업이 한 줄을 빠뜨리지 않게, 개념이 새로 생기면 다시 본다.
