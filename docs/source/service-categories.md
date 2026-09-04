# AWS 서비스 카테고리 (세 번째 출처)

이 파일은 개념 본문에 넣는 **카테고리 한 줄**의 유일한 근거다. 근거는 ADR-019.

`concepts-raw.md`·`exam-gaps.md`와 달리 이 파일은 **AWS 공개 문서에서 뽑은 것**이라
저장소에 커밋한다. 유료 교재가 아니므로 ADR-009의 전사 금지와 부딪치지 않는다.

## 출처

주 출처는 AWS 백서 *Overview of Amazon Web Services*의 "AWS services by category"다.
카테고리 이름과 각 서비스의 배치를 모두 여기서 가져왔다.

- 카테고리 목록 — <https://docs.aws.amazon.com/whitepapers/latest/aws-overview/amazon-web-services-cloud-platform.html>
- 카테고리별 서비스 목록 — 같은 백서의 `analytics.html`, `compute-services.html`,
  `storage-services.html`, `database.html`, `networking-services.html`,
  `application-integration.html`, `management-governance.html`, `security-services.html`,
  `migration-services.html`, `containers.html`, `aws-cost-management.html`,
  `developer-tools.html`, `business-applications.html`

백서의 카테고리별 **Topics 목록에 개별 항목이 없는** 서비스 셋은 보조 출처를 썼다.
어느 것이 보조 출처인지는 아래 매핑 표에 표시했다.

- `STS` — IAM 사용자 가이드 "Temporary security credentials in IAM".
  제목이 밝히는 대로 IAM 문서의 일부이고, 본문이 `AWS STS`가 IAM의 임시 자격 증명을
  발급한다고 적는다. <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html>
- `Billing and Cost Management`·`Cost Anomaly Detection` — AWS Cost Management 사용자 가이드
  "Use AWS Billing and Cost Management for AWS". `Cost Explorer`·`Cost Anomaly Detection`·
  `Budgets`·`Savings Plans`를 모두 Billing and Cost Management의 기능으로 열거한다.
  <https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html>

확인 시점은 2026-09-04다.

## 이 파일에서 가져와도 되는 것과 안 되는 것

가져와도 되는 것은 **카테고리 이름과 어느 서비스가 어느 카테고리에 들어가는지**뿐이다.
서비스의 사양·제약·비교는 여전히 `concepts-raw.md`와 `exam-gaps.md`에서만 가져온다.
ADR-010이 세운 기준("이 사실이 어떤 문항의 정답 근거가 될 수 있는가")은 그대로 살아 있다.

## 카테고리 13종

앱에 쓰는 표기는 `한글 이름(백서의 영문 이름)`이다.

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

## 주제 배치와 어긋나는 자리

이 앱의 주제는 원본 교재의 장 구성을 따르므로, 백서의 카테고리와 갈리는 곳이 있다.
**갈리는 것 자체가 학습 내용이므로 주제를 옮기지 않고 카테고리만 밝힌다.**

| 개념 | 이 앱의 주제 | 백서 카테고리 |
| --- | --- | --- |
| `CloudWatch` | 분석·모니터링 | 관리 및 거버넌스 |
| `X-Ray` | 분석·모니터링 | 개발자 도구 |
| `MSK` | 메시징·백업 | 분석 |
| `AWS Backup` | 메시징·백업 | 스토리지 |
| `SES` | 메시징·백업 | 비즈니스 애플리케이션 |
| `API Gateway` | 서버리스·컨테이너 | 네트워킹 및 콘텐츠 전송 |
| `Storage Gateway` | 데이터 전송 서비스 | 스토리지 |
| `Parameter Store` | Secrets Manager와 같은 주제 | 관리 및 거버넌스 (Secrets Manager는 보안) |
| `Trusted Advisor` | 비용 관리 | 관리 및 거버넌스 |
| `Compute Optimizer` | 비용 관리 | 관리 및 거버넌스 |

## 매핑 — 개념 75개

`보조`란에 표시가 있는 항목은 위 "출처"에 적은 보조 출처를 근거로 배치한 것이다.

| 개념 id | 문장 주어 | 카테고리 | 보조 |
| --- | --- | --- | --- |
| `aws-core-services.ec2` | EC2 | 컴퓨팅 | |
| `aws-core-services.rds` | RDS | 데이터베이스 | |
| `aws-core-services.s3` | S3 | 스토리지 | |
| `aws-core-services.route-53` | Route 53 | 네트워킹 및 콘텐츠 전송 | |
| `aws-core-services.elb` | ELB | 네트워킹 및 콘텐츠 전송 | |
| `aws-core-services.cloudfront` | CloudFront | 네트워킹 및 콘텐츠 전송 | |
| `aws-core-services.lambda` | Lambda | 컴퓨팅 | |
| `block-file-storage.ebs` | EBS | 스토리지 | |
| `block-file-storage.efs` | EFS | 스토리지 | |
| `block-file-storage.fsx` | FSx | 스토리지 | |
| `data-transfer-services.datasync` | DataSync | 마이그레이션 및 전송 | |
| `data-transfer-services.snowball-edge` | Snowball Edge | 마이그레이션 및 전송 | |
| `data-transfer-services.transfer-family` | Transfer Family | 마이그레이션 및 전송 | |
| `data-transfer-services.storage-gateway` | Storage Gateway | 스토리지 | |
| `rds-storage-features.rds` | RDS | 데이터베이스 | |
| `aurora-dynamodb-cache.aurora` | Aurora | 데이터베이스 | |
| `aurora-dynamodb-cache.dynamodb` | DynamoDB | 데이터베이스 | |
| `aurora-dynamodb-cache.elasticache` | ElastiCache | 데이터베이스 | |
| `aurora-dynamodb-cache.documentdb` | DocumentDB | 데이터베이스 | |
| `compute-delivery.ec2` | EC2 | 컴퓨팅 | |
| `compute-delivery.elb` | ELB | 네트워킹 및 콘텐츠 전송 | |
| `compute-delivery.cloudfront` | CloudFront | 네트워킹 및 콘텐츠 전송 | |
| `compute-delivery.global-accelerator` | Global Accelerator | 네트워킹 및 콘텐츠 전송 | |
| `serverless-containers.ecs` | ECS | 컨테이너 | |
| `serverless-containers.lambda` | Lambda | 컴퓨팅 | |
| `serverless-containers.step-functions` | Step Functions | 애플리케이션 통합 | |
| `serverless-containers.api-gateway` | API Gateway | 네트워킹 및 콘텐츠 전송 | |
| `serverless-containers.eks` | EKS | 컨테이너 | |
| `serverless-containers.aws-batch` | AWS Batch | 컴퓨팅 | |
| `messaging-backup.sqs` | SQS | 애플리케이션 통합 | |
| `messaging-backup.sns` | SNS | 애플리케이션 통합 | |
| `messaging-backup.eventbridge` | EventBridge | 애플리케이션 통합 | |
| `messaging-backup.backup` | AWS Backup | 스토리지 | |
| `messaging-backup.msk` | MSK | 분석 | |
| `messaging-backup.ses` | SES | 비즈니스 애플리케이션 | |
| `vpc-networking.vpc-subnet` | VPC | 네트워킹 및 콘텐츠 전송 | |
| `vpc-networking.privatelink` | PrivateLink | 네트워킹 및 콘텐츠 전송 | |
| `hybrid-connectivity.site-to-site-vpn` | Site-to-Site VPN | 네트워킹 및 콘텐츠 전송 | |
| `hybrid-connectivity.direct-connect` | Direct Connect | 네트워킹 및 콘텐츠 전송 | |
| `hybrid-connectivity.transit-gateway` | Transit Gateway | 네트워킹 및 콘텐츠 전송 | |
| `hybrid-connectivity.client-vpn` | Client VPN | 네트워킹 및 콘텐츠 전송 | |
| `route53.route53` | Route53 | 네트워킹 및 콘텐츠 전송 | |
| `analytics-monitoring.emr` | EMR | 분석 | |
| `analytics-monitoring.redshift` | RedShift | 분석 | |
| `analytics-monitoring.athena` | Athena | 분석 | |
| `analytics-monitoring.cloudwatch` | CloudWatch | 관리 및 거버넌스 | |
| `analytics-monitoring.glue` | Glue | 분석 | |
| `analytics-monitoring.x-ray` | X-Ray | 개발자 도구 | |
| `analytics-monitoring.data-firehose` | Data Firehose | 분석 | |
| `analytics-monitoring.kinesis-data-streams` | Kinesis Data Streams | 분석 | |
| `analytics-monitoring.managed-service-apache-flink` | Managed Service for Apache Flink | 분석 | |
| `secrets-encryption.secrets-manager` | Secrets Manager | 보안·자격 증명·규정 준수 | |
| `secrets-encryption.parameter-store` | Parameter Store | 관리 및 거버넌스 | |
| `secrets-encryption.kms` | KMS | 보안·자격 증명·규정 준수 | |
| `secrets-encryption.acm` | ACM | 보안·자격 증명·규정 준수 | |
| `secrets-encryption.cloudhsm` | CloudHSM | 보안·자격 증명·규정 준수 | |
| `threat-protection.waf` | WAF | 보안·자격 증명·규정 준수 | |
| `threat-protection.shield` | Shield | 보안·자격 증명·규정 준수 | |
| `threat-protection.guardduty` | GuardDuty | 보안·자격 증명·규정 준수 | |
| `threat-protection.macie` | Macie | 보안·자격 증명·규정 준수 | |
| `threat-protection.cloudfront` | CloudFront | 네트워킹 및 콘텐츠 전송 | |
| `identity-access.iam` | IAM | 보안·자격 증명·규정 준수 | |
| `identity-access.identity-center` | Identity Center | 보안·자격 증명·규정 준수 | |
| `identity-access.sts` | STS | 보안·자격 증명·규정 준수 | IAM 가이드 |
| `identity-access.cognito` | Cognito | 보안·자격 증명·규정 준수 | |
| `identity-access.cloudtrail` | CloudTrail | 관리 및 거버넌스 | |
| `identity-access.aws-config` | AWS Config | 관리 및 거버넌스 | |
| `identity-access.organizations-scp` | AWS Organizations | 관리 및 거버넌스 | |
| `cost-management.savings-plan` | 절약 플랜 | 클라우드 재무 관리 | |
| `cost-management.aws-budgets` | AWS Budgets | 클라우드 재무 관리 | |
| `cost-management.cost-explorer` | Cost Explorer | 클라우드 재무 관리 | |
| `cost-management.billing-and-cost-management` | Billing and Cost Management | 클라우드 재무 관리 | 비용 관리 가이드 |
| `cost-management.trusted-advisor` | Trusted Advisor | 관리 및 거버넌스 | |
| `cost-management.compute-optimizer` | Compute Optimizer | 관리 및 거버넌스 | |
| `cost-management.cost-anomaly-detection` | Cost Anomaly Detection | 클라우드 재무 관리 | 비용 관리 가이드 |

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

182개 중 107개는 대상이 아니다. 기준은 세 가지다.

1. **AWS 서비스가 아닌 것** — `DNS`, `리전`, `가용 영역`, `온프레미스`, `마이그레이션`,
   `Spark`(오픈소스 엔진), `가용성` 등. 카테고리라는 개념 자체가 성립하지 않는다.
2. **서비스의 기능·설정·유형** — S3 스토리지 클래스 7종, `S3 버전 관리`, `SSE`,
   `인스턴스 스토어`, `NAT 게이트웨이`, `VPC Endpoint`, `보안 그룹`, `NACL`,
   `Route53 라우팅 정책`, `Glue Crawler`, `EventBridge Scheduler` 등. 상위 서비스에
   카테고리가 이미 붙는다.
3. **사실·비교·판단 기준 개념** — `Fargate에는 실행 시간 제한이 없다`,
   `DAX는 DynamoDB 전용`, `계층으로 갈리는 ALB와 NLB`, `시험에서 자주 통하는 판단 기준` 등.
   서비스를 소개하는 자리가 아니다.

`Fargate`·`DAX`·`OpenSearch`처럼 백서에 카테고리가 있는 서비스라도, 이 앱에서 그 이름을 단
개념이 사실·비교 개념이면 문장을 붙이지 않는다. 소개 문장이 아닌 곳에 카테고리를 끼우면
그 문단이 무엇을 말하려는지 흐려진다.
