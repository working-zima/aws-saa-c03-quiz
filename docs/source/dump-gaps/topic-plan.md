# 주제 골격 — 개념 618개를 39개 주제로 재편한다

> phase 26 step 0의 산출물이다. `src/data/topics.json`의 기존 개념 **182개**와
> `docs/source/dump-gaps/`의 신규 개념 **436개**를 합쳐 주제를 다시 나눈 계획이다.
> 개념 하나하나가 어느 주제에 들어가는지는 여기서 정하지 않는다 — 각 step이 자기 범위의
> 본문을 읽고 정한다. 이 문서가 정하는 것은 **주제가 무엇이고 어떤 순서로 놓이는지**다.
>
> 아래 목록의 순서가 그대로 `topics.json`의 배열 순서이자 학습 순서다.
> `adjacentTopics`가 이 배열에서 앞뒤 주제를 계산한다(ARCHITECTURE "주제 간 이동").

### 왜 쪼개는가

기존 20개 주제에 신규 436개를 그대로 이어 붙이면 `serverless-containers`가 62개념,
`analytics-monitoring`이 56개념이 된다. 개념 읽기 화면은 지금 8~14개념에서 2400~3900px이고
(ARCHITECTURE "화면 전환 시 스크롤"의 실측표) 개념당 대략 240px이므로, 62개념은 15,000px
안팎이 된다. PRD가 말하는 "주제 하나의 개념을 처음부터 끝까지 읽는 화면"이 성립하지 않는다.

### 무엇을 기준으로 쪼갰는가

1. **경계는 서비스 단위로 긋는다.** 개념 수를 맞추려고 자르지 않는다. `lambda-basics` ·
   `lambda-advanced` 같은 이름은 학습자에게 아무 뜻이 없다. 주제당 9~20개념을 목표로 하되
   서비스 경계를 지키려면 벗어난다. 벗어난 주제는 아래 "범위를 벗어난 주제"에 근거를 적었다.
2. **헷갈리는 짝은 한 주제에 둔다.** PRD의 사용자는 "언제 무엇을 쓰는지"가 정리되지 않은
   사람이다. 구분해야 하는 서비스를 다른 주제로 떼면 이 앱의 존재 이유가 깨진다.
   배치는 아래 "헷갈리는 짝 배치"에 표로 있다.

### 주제 안의 개념 순서 — 3단으로 정렬한다

기존 182개는 대체로 "이 서비스는 무엇인가"이고, 신규 436개는 대체로 한계값·설정·갈림길이다.
Lambda가 무엇인지 모르는 사람에게 `lambda-layer-size-limit`은 아무것도 주지 않는다.
그래서 주제마다 개념을 아래 순서로 배열한다.

```
1단 [기본]   이 서비스는 무엇이고 무엇에 쓰는가
2단 [갈림길] 비슷한 것들 중 언제 이것을 고르는가
3단 [한계]   한계값·설정 항목·주의점
```

`Concept` 타입에 층을 나타내는 필드를 **추가하지 마라.** `concepts`는 배열이고
`ConceptList`가 배열 순서대로 그리므로 순서만 정하면 타입·UI·테스트가 하나도 바뀌지 않는다.
어떤 주제에 어떤 층이 비는 것은 괜찮다. **층을 채우려고 개념을 만들지 마라.**

### 주제 목록

| # | topicId | 제목 | 개념 수 | step |
|---|---|---|---|---|
| 1 | `aws-core-services` | AWS 핵심 서비스·리전·가용 영역·온프레미스 | 18 | 2 |
| 2 | `s3-storage-classes` | S3 스토리지 클래스 유형 | 17 | 2 |
| 3 | `s3-versioning-lifecycle` | S3 버전 관리·객체 잠금·수명 주기·복제 | 10 | 2 |
| 4 | `s3-encryption-batch` | S3 암호화(SSE)·Batch Operations·인벤토리 | 13 | 3 |
| 5 | `s3-access-control` | S3 접근 제어·액세스 포인트·Storage Lens | 13 | 3 |
| 6 | `ebs-instance-store` | EBS·인스턴스 스토어·스냅샷·배치 그룹 | 15 | 4 |
| 7 | `efs-fsx` | EFS·FSx(Windows·Lustre·ONTAP) | 25 | 4 |
| 8 | `data-transfer-services` | DataSync·Snowball Edge·Transfer Family·S3 전송 | 19 | 5 |
| 9 | `storage-gateway-migration` | Storage Gateway·DMS·Application Migration Service | 7 | 5 |
| 10 | `rds-storage-features` | RDS 스토리지 유형과 기능 | 21 | 6 |
| 11 | `aurora` | Aurora·Aurora Serverless·글로벌 데이터베이스 | 18 | 7 |
| 12 | `dynamodb` | DynamoDB | 18 | 7 |
| 13 | `elasticache-purpose-built-db` | ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream | 14 | 7 |
| 14 | `ec2-autoscaling` | EC2 인스턴스 유형·구매 옵션·Auto Scaling | 18 | 8 |
| 15 | `elastic-load-balancing` | ALB·NLB·Gateway Load Balancer | 16 | 8 |
| 16 | `cloudfront-global-accelerator` | CloudFront·Global Accelerator·엣지 함수 | 24 | 9 |
| 17 | `lambda` | Lambda | 18 | 10 |
| 18 | `ecs-eks-fargate` | ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk | 23 | 11 |
| 19 | `api-gateway-step-functions` | API Gateway·Step Functions | 20 | 11 |
| 20 | `sqs-sns-eventbridge` | SQS·SNS·EventBridge·Amazon MQ·SES | 33 | 12 |
| 21 | `backup-disaster-recovery` | AWS Backup·재해 복구 전략·Elastic Disaster Recovery | 11 | 13 |
| 22 | `vpc-networking` | VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링 | 20 | 14 |
| 23 | `security-groups-nacl` | 보안 그룹·NACL | 9 | 14 |
| 24 | `hybrid-connectivity` | Site-to-Site VPN·Direct Connect·Transit Gateway | 19 | 14 |
| 25 | `route53` | Route 53 | 13 | 16 |
| 26 | `emr-glue-athena` | EMR·Spark·Glue·Athena·Lake Formation | 20 | 15 |
| 27 | `kinesis-streaming` | Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK | 16 | 15 |
| 28 | `redshift-opensearch-quicksight` | Redshift·Redshift Spectrum·OpenSearch·QuickSight | 11 | 15 |
| 29 | `cloudwatch-xray` | CloudWatch·X-Ray·Performance Insights·Managed Grafana | 11 | 16 |
| 30 | `secrets-encryption` | Secrets Manager·Parameter Store·KMS·ACM·CloudHSM | 20 | 18 |
| 31 | `waf-shield` | WAF·Shield·Firewall Manager | 15 | 18 |
| 32 | `guardduty-macie-inspector` | GuardDuty·Macie·Inspector·Security Hub | 11 | 18 |
| 33 | `iam-permissions` | IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer | 18 | 17 |
| 34 | `identity-federation` | IAM Identity Center·STS·Cognito·Directory Service·SAML | 11 | 17 |
| 35 | `organizations-cloudtrail-config` | Organizations·SCP·CloudTrail·Config·Audit Manager | 16 | 17 |
| 36 | `cost-management` | 절약 플랜·Budgets·Cost Explorer·Trusted Advisor | 17 | 19 |
| 37 | `governance-iac` | CloudFormation·Service Catalog·Control Tower·RAM | 7 | 19 |
| 38 | `systems-manager` | Systems Manager·AppConfig·EC2 Instance Connect | 7 | 19 |
| 39 | `ai-ml-services` | SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract | 6 | 20 |

합계 39개 주제 · 618개념 — 기존 182개와 신규 436개를 합친 값이다.

### 범위를 벗어난 주제 — 9개

주제당 9~20개념이 목표다. 아래 9개는 벗어나며, 전부 **규칙 1(서비스 경계)·규칙 2(헷갈리는 짝)**
때문이다. 개념 수를 맞추려고 이 경계를 자르지 마라.

| 주제 | 수 | 벗어난 이유 |
|---|---|---|
| `sqs-sns-eventbridge` | 33 | SQS ↔ SNS ↔ EventBridge를 한 주제에 두는 것이 이 phase의 명시 규칙이다. 셋을 가르면 메시징 세 갈래를 비교할 자리가 없어진다. 가장 큰 주제이고, 그것이 이 규칙의 값이다 |
| `efs-fsx` | 25 | EFS ↔ FSx(Windows·Lustre·ONTAP)는 공유 파일 스토리지 선택 그 자체다. 어디서 잘라도 갈림길이 반으로 쪼개진다 |
| `cloudfront-global-accelerator` | 24 | CloudFront ↔ Global Accelerator는 SAA-C03의 대표 혼동 짝이고 `data.test.ts`가 이미 강제한다. 엣지 함수(Lambda@Edge·CloudFront Functions)도 CloudFront 배포에 붙는 기능이라 같은 주제에 둔다 |
| `ecs-eks-fargate` | 23 | ECS ↔ EKS ↔ Fargate는 컨테이너 실행 방식의 선택이다. Batch·ECR·Beanstalk도 "컨테이너를 어디서 돌리나"의 같은 줄에 있다 |
| `rds-storage-features` | 21 | RDS는 서비스 하나다. 쪼개면 `rds-basics`·`rds-advanced`가 되어 규칙 1에 정면으로 걸린다 |
| `storage-gateway-migration` | 7 | Storage Gateway·DMS·MGN은 "이미 있는 것을 옮긴다"는 한 갈래다. 9를 채우려고 DataSync 쪽을 끌어오면 전송 서비스 갈림길이 흐려진다 |
| `governance-iac` | 7 | CloudFormation ↔ Service Catalog ↔ Control Tower가 거버넌스 갈림길이다. Systems Manager와 합치면 "만드는 도구"와 "돌리는 도구"가 섞인다 |
| `systems-manager` | 7 | Systems Manager의 기능들(Session Manager·Patch Manager·Run Command·Inventory)은 한 서비스의 하위 기능이다 |
| `ai-ml-services` | 6 | 음성·이미지·번역·문서를 나눠 맡는 AI 서비스들은 "무엇을 하는 서비스인가"가 그대로 문항이다. 수를 채우려고 다른 갈래를 붙이지 마라 |

### 헷갈리는 짝 배치

| 짝 | 들어간 주제 | 근거 |
|---|---|---|
| CloudFront ↔ Global Accelerator | `cloudfront-global-accelerator` | SAA-C03 대표 혼동 짝. `data.test.ts`에 갈림길 문장을 검사하는 테스트가 이미 있다 |
| ALB ↔ NLB ↔ Gateway Load Balancer | `elastic-load-balancing` | 세 로드 밸런서의 선택 기준이 문항의 핵심이다 |
| SQS ↔ SNS ↔ EventBridge | `sqs-sns-eventbridge` | 메시징 세 갈래. Amazon MQ와 SES도 같은 보기 줄에 오르므로 함께 둔다 |
| EFS ↔ FSx (Lustre·Windows·ONTAP) | `efs-fsx` | 공유 파일 스토리지 선택 |
| RDS ↔ Aurora | `rds-storage-features` ↔ `aurora` | 배열에서 10번과 11번으로 붙어 있다. 관리형 관계형 DB 두 갈래 |
| S3 스토리지 클래스 전체 | `s3-storage-classes` | 기존 주제를 그대로 유지한다 |
| KMS ↔ Secrets Manager ↔ Parameter Store | `secrets-encryption` | 키·비밀 세 갈래. 기존 주제를 그대로 유지한다 |
| ElastiCache(Redis ↔ Memcached) ↔ DAX | `elasticache-purpose-built-db` | 캐시 갈림길 |
| Lambda@Edge ↔ CloudFront Functions | `cloudfront-global-accelerator` | 엣지 실행 갈림길. `serverless-containers` 쪽에 있던 것을 step 10이 옮겨 온다 |
| Step Functions 표준 ↔ Express | `api-gateway-step-functions` | `messaging-backup`에 있던 `step-functions-features`를 step 11이 함께 가져온다 |
| API Gateway REST ↔ HTTP ↔ WebSocket | `api-gateway-step-functions` | 엔드포인트 유형과 지원 기능이 갈린다 |
| ECS ↔ EKS ↔ Fargate | `ecs-eks-fargate` | 컨테이너 실행 방식의 선택 |
| 스팟 ↔ 온디맨드 ↔ 예약 인스턴스 | `ec2-autoscaling` | 구매 옵션 갈림길 |
| 보안 그룹 ↔ NACL | `security-groups-nacl` | 상태 저장 여부가 대표 문항이다. 기존 주제를 그대로 유지한다 |
| VPN ↔ Direct Connect ↔ Transit Gateway | `hybrid-connectivity` | 기존 주제를 그대로 유지한다 |
| WAF ↔ Shield ↔ Shield Advanced | `waf-shield` | 계층과 대상이 갈린다 |
| GuardDuty ↔ Macie ↔ Inspector ↔ Security Hub | `guardduty-macie-inspector` | 탐지 서비스 갈림길 |
| Kinesis Data Streams ↔ MSK | `kinesis-streaming` | 스트리밍 갈림길. `messaging-backup`에 있던 MSK를 step 15가 옮겨 온다 |
| Athena ↔ Redshift ↔ Redshift Spectrum | `redshift-opensearch-quicksight` | 임시 쿼리와 반복되는 고성능 쿼리. `emr-glue-athena`(26번) 바로 뒤인 28번이다 |
| IAM Access Analyzer ↔ Network Access Analyzer | `iam-permissions` | 이름이 닮아 보기 줄에서 갈린다 |
| Identity Center ↔ SAML 페더레이션 ↔ Cognito | `identity-federation` | 누구를 어떻게 들이는가의 갈림길 |
| CloudFormation ↔ Service Catalog ↔ Control Tower | `governance-iac` | 거버넌스 갈림길 |
| Cost Explorer ↔ Budgets ↔ Cost Anomaly Detection | `cost-management` | 기존 주제를 그대로 유지한다 |
| DR 전략(백업 및 복원 ↔ 웜 스탠바이) | `backup-disaster-recovery` | RTO·RPO로 갈리는 한 벌이다 |
| 백업 및 복원 ↔ AWS Backup | `backup-disaster-recovery` | 백업 서비스와 DR 전략을 한 자리에서 읽는다 |

### step 경계를 넘는 개념 — 9개

아래 개념들은 **자기 step의 원본 그룹과 다른 주제**로 간다. 서비스 경계를 지키려면 어쩔 수
없는 이동이고, 옮기는 쪽은 항상 **뒤에 오는 step**이라 대상 주제가 이미 존재한다.
step 11만 예외로 앞서 가져오는데, 그때 `messaging-backup`이 아직 남아 있어 안전하다.

| 개념 | 원본 그룹 | 가는 주제 | 옮기는 step |
|---|---|---|---|
| `step-functions-features`(기존) | `messaging-backup` | `api-gateway-step-functions` | 11 |
| `lambda-at-edge`(기존) | `serverless-containers` | `cloudfront-global-accelerator` | 10 |
| `cloudfront-functions` | `serverless-containers` | `cloudfront-global-accelerator` | 10 |
| `lambda-at-edge-response-compression` | `serverless-containers` | `cloudfront-global-accelerator` | 10 |
| `msk`(기존) · `msk-kafka-connect` | `messaging-backup` | `kinesis-streaming` | 15 |
| `config-rule-remediation` | `(주제 미정)` | `organizations-cloudtrail-config` | 19 |
| `parallelcluster` | `(주제 미정)` | `ec2-autoscaling` | 20 |
| `amplify` | `(주제 미정)` | `api-gateway-step-functions` | 20 |
| `workload-discovery` | `(주제 미정)` | `governance-iac` | 20 |
| `exponential-backoff-retry` · `blob-offload-to-s3` | `(주제 미정)` | `aws-core-services` | 20 |

`(주제 미정)` 41개의 분배는 이렇다 — step 3이 S3 계열 13개, step 13이 재해 복구 3개,
step 19가 거버넌스·IaC 6개와 Systems Manager 7개, step 20이 AI·ML 6개와 위의 잔여 6개다.
합이 41이고, step 20이 끝나면 하나도 남지 않는다.

---

## aws-core-services — AWS 핵심 서비스·리전·가용 영역·온프레미스

- **importance**: 0
- **sourcePages**: [1, 7]
- **유래**: `aws-core-services` 유지
- **담는 서비스**: EC2·RDS·S3·Route 53·ELB·CloudFront·Lambda의 첫 소개, 리전·가용 영역·다중 AZ·온프레미스·마이그레이션, 시험 판단 기준
- **예상 개념 수**: 기존 16 + 신규 2 = 18
- **3단 구분**: 1단 서비스 일곱과 리전·가용 영역의 뜻 / 2단 다중 AZ와 단일 AZ, 온프레미스와 클라우드 / 3단 시험 판단 기준과 일반 설계 원칙(재시도, 큰 바이너리를 어디에 두는가)
- **담당 step**: 2

## s3-storage-classes — S3 스토리지 클래스 유형

- **importance**: 3
- **sourcePages**: [8, 9]
- **유래**: `s3-storage-classes` 유지
- **담는 서비스**: S3 Standard·Intelligent-Tiering·Standard-IA·One Zone-IA·Glacier 3종·Express One Zone, 스토리지 클래스 분석
- **예상 개념 수**: 기존 9 + 신규 8 = 17
- **3단 구분**: 1단 클래스 여덟이 각각 무엇인가 / 2단 Glacier와 Standard-IA 중 고르기, 조회 시간과 비용 순서, 수명 주기 규칙과 자동 계층화 / 3단 검색 요금·감시 요금 같은 클래스별 비용 항목
- **담당 step**: 2

## s3-versioning-lifecycle — S3 버전 관리·객체 잠금·수명 주기·복제

- **importance**: 3
- **sourcePages**: [10, 12]
- **유래**: `s3-versioning-lifecycle` 유지
- **담는 서비스**: 버전 관리, 객체 잠금, 수명 주기 정책, 이벤트 알림, 리전 간 복제(CRR)·동일 리전 복제(SRR)·복제 시간 제어
- **예상 개념 수**: 기존 5 + 신규 5 = 10
- **3단 구분**: 1단 버전 관리·객체 잠금·수명 주기·복제가 각각 무엇인가 / 2단 CRR과 SRR, 복제와 수명 주기의 역할 차이 / 3단 객체 잠금의 전제 조건, 규칙 개수와 크기 필터 같은 구성 한계
- **담당 step**: 2

## s3-encryption-batch — S3 암호화(SSE)·Batch Operations·인벤토리

- **importance**: 2
- **sourcePages**: [13, 13]
- **유래**: `s3-encryption-batch` 유지
- **담는 서비스**: SSE-S3·SSE-KMS·SSE-C·클라이언트 측 암호화, 봉투 암호화, S3 Bucket Key, Batch Operations, S3 인벤토리, Object Lambda
- **예상 개념 수**: 기존 5 + 신규 8 = 13
- **3단 구분**: 1단 SSE의 뜻과 종류, Batch Operations·인벤토리·Object Lambda / 2단 SSE-S3 ↔ SSE-KMS ↔ SSE-C의 갈림길, 일회성 대량 복사와 지속 복제 / 3단 SSE-KMS의 비용 구조, SSE-C에 없는 것, 전송 중 암호화 강제 조건
- **담당 step**: 3

## s3-access-control — S3 접근 제어·액세스 포인트·Storage Lens

- **importance**: 3
- **sourcePages**: [0, 0]
- **유래**: 신규. 근거가 `dump-gaps/`에만 있어 `concepts-raw.md` 페이지가 없다
- **담는 서비스**: 버킷 정책·계정 간 접근·사전 서명된 URL·Access Grants·액세스 포인트·멀티 리전 액세스 포인트·퍼블릭 액세스 차단·요청자 부담·CORS·정적 웹사이트 엔드포인트·Storage Lens
- **예상 개념 수**: 기존 0 + 신규 13 = 13
- **3단 구분**: 1단 버킷 정책·액세스 포인트·사전 서명된 URL·Storage Lens가 각각 무엇인가 / 2단 정책과 퍼블릭 액세스 차단과 CORS가 서로 무엇을 맡는가 / 3단 계정 수준 차단의 범위, VPC 조건, 정적 웹사이트 엔드포인트의 HTTPS 제약
- **importance 근거**: S3 문항에서 "누가 어떻게 접근하는가"가 정답을 가르는 축이고, 880문항 해설에서 이 갈래로만 13개 개념이 정답 근거로 쓰였다. 다른 S3 주제와 같은 3으로 둔다
- **배열 위치 근거**: S3 주제 넷 중 마지막에 놓는다. 스토리지 클래스·버전 관리·암호화를 읽은 뒤라야 "무엇을 누구에게 여는가"가 얹힌다
- **담당 step**: 3

## ebs-instance-store — EBS·인스턴스 스토어·스냅샷·배치 그룹

- **importance**: 3
- **sourcePages**: [14, 15]
- **유래**: `block-file-storage` 분할
- **담는 서비스**: EBS 볼륨 유형(gp2·gp3·io1·io2·Block Express), Elastic Volumes, EBS 암호화, 스냅샷(휴지통·빠른 복원·공개 차단), Data Lifecycle Manager, 인스턴스 스토어, 클러스터·분산 배치 그룹, EFA
- **예상 개념 수**: 기존 4 + 신규 11 = 15
- **3단 구분**: 1단 EBS·인스턴스 스토어·배치 그룹이 무엇인가 / 2단 볼륨 유형끼리의 갈림길, 클러스터 배치 그룹과 분산 배치 그룹 / 3단 IOPS 상한, 기본 암호화가 계정 속성이라는 것, 스냅샷 복원의 첫 접근 지연
- **담당 step**: 4

## efs-fsx — EFS·FSx(Windows·Lustre·ONTAP)

- **importance**: 3
- **sourcePages**: [14, 15]
- **유래**: `block-file-storage` 분할
- **담는 서비스**: EFS(처리량 모드·성능 모드·One Zone·수명 주기·복제·마운트 대상·POSIX 권한), FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP, FSx File Gateway
- **예상 개념 수**: 기존 4 + 신규 21 = 25
- **3단 구분**: 1단 EFS와 FSx 네 갈래가 각각 무엇인가 / 2단 어느 프로토콜·어느 지연 시간 요구에 무엇을 고르는가, EFS 처리량 모드와 성능 모드의 축이 다르다는 것 / 3단 IA 전환 조건과 파일 크기 기준, 마운트 대상 개수, 복제가 한 방향이라는 것
- **담당 step**: 4

## data-transfer-services — DataSync·Snowball Edge·Transfer Family·S3 전송

- **importance**: 3
- **sourcePages**: [16, 18]
- **유래**: `data-transfer-services` 분할
- **담는 서비스**: DataSync(매니페스트·전송 모드·상태 이벤트·전송 중 암호화), Snowball Edge, Transfer Family(워크플로·사용자 지정 호스트 이름·ID 공급자·로깅), S3 전송 가속, 멀티파트 업로드
- **예상 개념 수**: 기존 3 + 신규 16 = 19
- **3단 구분**: 1단 DataSync·Snowball Edge·Transfer Family가 각각 무엇인가 / 2단 기한과 대역폭을 먼저 곱해 보기, 지속 수집과 예약 전송의 갈림길 / 3단 DataSync가 맡지 않는 일, 워크플로에 이미 들어 있는 액션, 멀티파트 업로드의 조건
- **담당 step**: 5

## storage-gateway-migration — Storage Gateway·DMS·Application Migration Service

- **importance**: 3
- **sourcePages**: [16, 18]
- **유래**: `data-transfer-services` 분할
- **담는 서비스**: Storage Gateway(파일·볼륨·테이프 게이트웨이), DMS와 SCT, Application Migration Service
- **예상 개념 수**: 기존 1 + 신규 6 = 7
- **3단 구분**: 1단 Storage Gateway·DMS·SCT·MGN이 각각 무엇인가 / 2단 게이트웨이 유형 셋의 갈림길, 저장 볼륨과 캐시된 볼륨 / 3단 가상 테이프가 내려가는 아카이브 계층, 전체 로드와 CDC를 한 태스크로 거는 방법
- **담당 step**: 5

## rds-storage-features — RDS 스토리지 유형과 기능

- **importance**: 3
- **sourcePages**: [19, 20]
- **유래**: `rds-storage-features` 유지
- **담는 서비스**: RDS 스토리지 유형, 다중 AZ, 읽기 전용 복제본, 자동 백업과 스냅샷, RDS Proxy, RDS Custom, 블루/그린 배포, IAM 데이터베이스 인증, 암호화
- **예상 개념 수**: 기존 7 + 신규 14 = 21
- **3단 구분**: 1단 RDS와 스토리지 유형·기능 / 2단 다중 AZ와 읽기 전용 복제본의 목적 차이, 다중 AZ DB 인스턴스와 DB 클러스터, 캐시가 듣지 않는 조건 / 3단 백업 보존 한계, 장애 조치에 걸리는 시간, 특정 시점 복구의 정밀도, 기존 인스턴스를 그 자리에서 암호화하지 못한다는 것
- **담당 step**: 6

## aurora — Aurora·Aurora Serverless·글로벌 데이터베이스

- **importance**: 3
- **sourcePages**: [21, 21]
- **유래**: `aurora-dynamodb-cache` 분할
- **담는 서비스**: Aurora, Aurora Serverless v2, 엔드포인트 종류, 글로벌 데이터베이스, 리전 간 복제본, 클론, Babelfish, pgvector, 스토리지 구성, 활동 스트림
- **예상 개념 수**: 기존 3 + 신규 15 = 18
- **3단 구분**: 1단 Aurora와 Serverless v2, 엔드포인트 종류 / 2단 글로벌 데이터베이스가 채우는 RPO·RTO, Standard와 I/O-Optimized, 확장 수단인 것과 아닌 것 / 3단 쓰기 리전이 하나라는 것, ACU 상한, 읽기 전용 복제본에서 스키마를 바꿀 수 없다는 것
- **배열 위치 근거**: `rds-storage-features` 바로 뒤다. RDS ↔ Aurora가 관리형 관계형 DB의 갈림길이라 붙어 있어야 한다
- **담당 step**: 7

## dynamodb — DynamoDB

- **importance**: 3
- **sourcePages**: [21, 21]
- **유래**: `aurora-dynamodb-cache` 분할
- **담는 서비스**: DynamoDB, 용량 모드, 글로벌 테이블, 스트림, TTL, GSI, PITR, S3 내보내기, 오토 스케일링
- **예상 개념 수**: 기존 2 + 신규 16 = 18
- **3단 구분**: 1단 DynamoDB와 그 주변 기능이 각각 무엇인가 / 2단 프로비저닝된 용량과 온디맨드, 최종 일관성과 강력한 일관성, 내보내기와 스트림 / 3단 항목 크기 제한, 스트림 보존 24시간, TTL 삭제가 제때 일어나지 않는다는 것, 내보내기의 PITR 전제
- **담당 step**: 7

## elasticache-purpose-built-db — ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream

- **importance**: 3
- **sourcePages**: [21, 21]
- **유래**: `aurora-dynamodb-cache` 분할
- **담는 서비스**: ElastiCache(Redis·Memcached·글로벌 데이터스토어·다중 AZ 장애 조치), DAX, Neptune과 Neptune Streams, DocumentDB, QLDB, Timestream
- **예상 개념 수**: 기존 3 + 신규 11 = 14
- **3단 구분**: 1단 캐시 둘과 목적별 데이터베이스 넷이 각각 무엇인가 / 2단 Redis와 Memcached의 갈림길, DAX가 DynamoDB 전용이라는 것, 어떤 데이터 모양에 어느 DB를 고르는가 / 3단 캐시는 처리 결과를 두는 자리가 아니라는 것, 캐시를 넣으면 애플리케이션을 고쳐야 한다는 것, DAX 암호화는 만들 때만 켠다는 것
- **담당 step**: 7

## ec2-autoscaling — EC2 인스턴스 유형·구매 옵션·Auto Scaling

- **importance**: 3
- **sourcePages**: [22, 24]
- **유래**: `compute-delivery` 분할
- **담는 서비스**: EC2 인스턴스 제품군(메모리 최적화·GPU), 온디맨드·스팟·예약 인스턴스, AMI와 시작 템플릿, EC2 Image Builder, 향상된 네트워킹, Auto Scaling(웜 풀·예약된 조정·대상 추적·예측 스케일링·혼합 인스턴스), ParallelCluster
- **예상 개념 수**: 기존 3 + 신규 15 = 18
- **3단 구분**: 1단 EC2와 Auto Scaling, AMI·시작 템플릿 / 2단 구매 옵션 셋의 갈림길, 대상 추적과 단순 조정, 예약된 조정과 대상 추적, 스팟에 올릴 수 있는 워크로드 / 3단 할당 전략, 온디맨드 기본 용량, 상태 검사 위치가 교체를 가른다는 것
- **담당 step**: 8

## elastic-load-balancing — ALB·NLB·Gateway Load Balancer

- **importance**: 3
- **sourcePages**: [22, 24]
- **유래**: `compute-delivery` 분할
- **담는 서비스**: ELB 일반, ALB(라우팅 조건·스티키 세션·분산 알고리즘·고정 응답·타깃 그룹), NLB(TLS·UDP·IP 대상·보안 그룹), Gateway Load Balancer와 그 엔드포인트, 내부 로드 밸런서
- **예상 개념 수**: 기존 3 + 신규 13 = 16
- **3단 구분**: 1단 ELB와 세 로드 밸런서가 각각 무엇인가 / 2단 계층으로 갈리는 ALB와 NLB, GWLB를 언제 쓰는가, 내부와 외부 / 3단 유휴 타임아웃, 스티키 세션의 부작용, 종단 간 암호화가 어디까지인가
- **배열 위치 근거**: `ec2-autoscaling` 바로 뒤다. 같은 `compute-delivery`를 쪼갠 조각이고 오토 스케일링의 상태 검사가 로드 밸런서와 맞물린다
- **담당 step**: 8

## cloudfront-global-accelerator — CloudFront·Global Accelerator·엣지 함수

- **importance**: 3
- **sourcePages**: [22, 24]
- **유래**: `compute-delivery` 분할 (+ `serverless-containers`의 엣지 함수)
- **담는 서비스**: CloudFront(오리진·가격 등급·TTL·서명된 URL·서명된 쿠키·지리적 제한·필드 수준 암호화·OAC), Global Accelerator(고정 IP·엔드포인트), Lambda@Edge, CloudFront Functions, 'Edge' 키워드
- **예상 개념 수**: 기존 6 + 신규 18 = 24
- **3단 구분**: 1단 CloudFront·Global Accelerator·엣지 함수 둘이 각각 무엇인가 / 2단 캐싱할 콘텐츠인가 가속할 연결인가, DNS 장애 조치와의 차이, Lambda@Edge와 CloudFront Functions의 갈림길 / 3단 오리진 접근 제한, 무효화와 TTL의 관계, CloudFront Functions가 다른 서비스를 부르지 못한다는 것
- **배열 위치 근거**: `elastic-load-balancing` 바로 뒤다. `compute-delivery`가 있던 자리에 세 조각이 연속으로 놓인다
- **담당 step**: 9

## lambda — Lambda

- **importance**: 3
- **sourcePages**: [25, 26]
- **유래**: `serverless-containers` 분할
- **담는 서비스**: Lambda, 함수 URL, VPC 연결, 동시성(예약·프로비저닝·계정 한도), SnapStart, 컨테이너 이미지 배포, 레이어, 버전과 별칭, 이벤트 소스, EFS 마운트, 실행 역할
- **예상 개념 수**: 기존 3 + 신규 15 = 18
- **3단 구분**: 1단 Lambda와 함수 URL·VPC 연결·컨테이너 이미지 / 2단 동시성 세 갈래의 갈림길, 이벤트 호출과 요청-응답 호출, 콜드 스타트를 줄이는 것과 줄이지 않는 것 / 3단 메모리 상한과 레이어 크기, 환경 변수가 버전과 함께 굳는다는 것, 관리형 런타임에 들어갈 운영 체제가 없다는 것
- **담당 step**: 10

## ecs-eks-fargate — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk

- **importance**: 3
- **sourcePages**: [25, 26]
- **유래**: `serverless-containers` 분할
- **담는 서비스**: ECS(awsvpc·태스크 역할·배치 전략), EKS(컴퓨팅 옵션·IRSA·Cluster Autoscaler·Load Balancer Controller·Connector·Anywhere), Fargate(Spot·과금 단위·EFS 마운트), AWS Batch, ECR, Elastic Beanstalk, App2Container
- **예상 개념 수**: 기존 4 + 신규 19 = 23
- **3단 구분**: 1단 ECS·EKS·Fargate·Batch·ECR·Beanstalk가 각각 무엇인가 / 2단 세 실행 방식의 관리 책임 차이, 파드를 늘리는 것과 노드를 늘리는 것, 태스크 역할과 태스크 실행 역할 / 3단 Fargate의 과금 단위와 실행 시간 제한 없음, 배치 전략, 푸시 시 스캔
- **담당 step**: 11

## api-gateway-step-functions — API Gateway·Step Functions

- **importance**: 3
- **sourcePages**: [25, 26]
- **유래**: `serverless-containers` 분할 (+ `messaging-backup`의 Step Functions 개념)
- **담는 서비스**: API Gateway(REST·HTTP·WebSocket, 엔드포인트 유형, 리소스 정책, 사용자 지정 도메인, 매핑 템플릿, API 키, 서비스 통합, JWT 권한 부여자), Step Functions(표준·Express·Map 상태·수동 승인·재시도), Amplify
- **예상 개념 수**: 기존 4 + 신규 16 = 20
- **3단 구분**: 1단 API Gateway와 Step Functions, Amplify / 2단 REST ↔ HTTP ↔ WebSocket, 표준 ↔ Express, API 키는 인증이 아니라는 것 / 3단 통합 타임아웃, 매핑 템플릿의 한계, 리소스 정책으로 IP를 거르는 자리
- **배열 위치 근거**: `ecs-eks-fargate` 바로 뒤다. `serverless-containers`가 있던 자리에 세 조각이 연속으로 놓인다
- **담당 step**: 11

## sqs-sns-eventbridge — SQS·SNS·EventBridge·Amazon MQ·SES

- **importance**: 3
- **sourcePages**: [27, 29]
- **유래**: `messaging-backup` 분할
- **담는 서비스**: SQS(표준·FIFO·가시성 타임아웃·롱 폴링·큐 정책·암호화·VPC 엔드포인트), SNS(FIFO 토픽·팬아웃·암호화된 토픽 권한), EventBridge(이벤트 버스·규칙·파이프·API 대상·스케줄러), 데드레터 큐, Amazon MQ, SES
- **예상 개념 수**: 기존 7 + 신규 26 = 33
- **3단 구분**: 1단 SQS·SNS·EventBridge·MQ·SES가 각각 무엇인가 / 2단 메시징 세 갈래의 선택, SNS는 큐가 아니라는 것, 이벤트 라우팅과 워크플로 오케스트레이션, 표준 큐와 FIFO 큐 / 3단 메시지 크기 한계, 중복 제거 창, 가시성 타임아웃과 처리 시간의 관계, 암호화한 큐·토픽에 필요한 권한
- **담당 step**: 12

## backup-disaster-recovery — AWS Backup·재해 복구 전략·Elastic Disaster Recovery

- **importance**: 3
- **sourcePages**: [27, 29]
- **유래**: `messaging-backup` 분할 (+ `(주제 미정)`의 재해 복구 계열)
- **담는 서비스**: AWS Backup(리소스 지정·계정 간 복사·연속 백업·Audit Manager·복원 테스트·조직 백업 정책), 백업 및 복원, 웜 스탠바이, AWS Elastic Disaster Recovery
- **예상 개념 수**: 기존 2 + 신규 9 = 11
- **3단 구분**: 1단 AWS Backup과 DRS, DR 전략 둘이 각각 무엇인가 / 2단 RTO·RPO로 갈리는 DR 전략의 선택, 서비스별 백업과 AWS Backup으로 넘어가야 하는 순간 / 3단 계정 간 사본, 연속 백업의 복원 지점, 복원 테스트 계획
- **배열 위치 근거**: `sqs-sns-eventbridge` 바로 뒤다. `messaging-backup`이 있던 자리에 두 조각이 연속으로 놓인다
- **담당 step**: 13

## vpc-networking — VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링

- **importance**: 3
- **sourcePages**: [30, 33]
- **유래**: `vpc-networking` 유지
- **담는 서비스**: VPC와 서브넷, 인터넷 게이트웨이, Egress-only 게이트웨이, NAT 게이트웨이와 NAT 인스턴스, VPC Endpoint와 엔드포인트 정책, PrivateLink와 엔드포인트 서비스, VPC 피어링, 플로우 로그
- **예상 개념 수**: 기존 12 + 신규 8 = 20
- **3단 구분**: 1단 VPC 구성 요소가 각각 무엇인가 / 2단 NAT Gateway ↔ VPC Endpoint ↔ PrivateLink ↔ 피어링의 비교, 게이트웨이 엔드포인트와 인터페이스 엔드포인트 / 3단 가용 영역마다 두는 것과 그렇지 않은 것, 엘라스틱 IP, 엔드포인트 정책, 피어링의 확장 한계
- **담당 step**: 14

## security-groups-nacl — 보안 그룹·NACL

- **importance**: 3
- **sourcePages**: [41, 43]
- **유래**: `security-groups-nacl` 유지
- **담는 서비스**: 보안 그룹(참조·아웃바운드·NLB 보안 그룹), NACL(규칙 수 제한·거부 규칙), Web ACL과의 구분
- **예상 개념 수**: 기존 5 + 신규 4 = 9
- **3단 구분**: 1단 보안 그룹과 NACL이 각각 무엇인가 / 2단 상태 저장과 상태 비저장, Web ACL과 네트워크 ACL은 다른 것 / 3단 규칙 수 제한, 거부 규칙을 어느 서브넷에 거는가, 로드 밸런서 보안 그룹의 아웃바운드
- **배열 위치 근거**: 원래 16번이었던 것을 `vpc-networking` 바로 뒤로 옮긴다. VPC를 읽은 자리에서 트래픽을 거르는 두 장치를 이어 읽는 편이 낫고, step 14가 맡은 세 주제가 배열에서 한 덩어리가 된다
- **담당 step**: 14

## hybrid-connectivity — Site-to-Site VPN·Direct Connect·Transit Gateway

- **importance**: 3
- **sourcePages**: [34, 35]
- **유래**: `hybrid-connectivity` 유지
- **담는 서비스**: Site-to-Site VPN, Client VPN, Direct Connect(VIF·복원력·Direct Connect Gateway), 가상 프라이빗 게이트웨이, Transit Gateway와 리전 간 피어링, Local Zone·Outposts·Wavelength Zone, Bastion Host
- **예상 개념 수**: 기존 10 + 신규 9 = 19
- **3단 구분**: 1단 연결 수단들이 각각 무엇인가 / 2단 VPN과 Direct Connect의 갈림길, VPC마다 따로 걸 것인가 Transit Gateway로 모을 것인가, 데이터 지역성으로 비용 줄이기 / 3단 Direct Connect의 함정과 복원력 구성, VIF 유형, 온프레미스로 되돌리는 아웃바운드
- **담당 step**: 14

## route53 — Route 53

- **importance**: 2
- **sourcePages**: [36, 37]
- **유래**: `route53` 유지
- **담는 서비스**: Route 53, 라우팅 정책(가중치·지연 시간·장애 조치·다중값 응답), 별칭 레코드, Resolver와 전달 규칙, 퍼블릭·프라이빗 호스팅 영역, 쿼리 로깅, 영역 파일 가져오기
- **예상 개념 수**: 기존 5 + 신규 8 = 13
- **3단 구분**: 1단 Route 53과 라우팅 정책·Resolver·호스팅 영역 / 2단 정책들 사이의 갈림길, 리전 장애를 가용 영역으로 막지 못한다는 것, 별칭 레코드와 CNAME / 3단 프라이빗 호스팅 영역이 VPC에만 붙는다는 것, 다중값 응답의 세부 동작, 쿼리 로깅
- **배열 위치 근거**: 네트워크 주제 넷의 마지막이다. 원래도 `hybrid-connectivity` 바로 뒤였다
- **담당 step**: 16

## emr-glue-athena — EMR·Spark·Glue·Athena·Lake Formation

- **importance**: 2
- **sourcePages**: [38, 40]
- **유래**: `analytics-monitoring` 분할
- **담는 서비스**: EMR(노드 유형·일시적 클러스터·관리형 스케일링·런타임 역할·보안 구성), Spark, Glue와 Crawler, Glue DataBrew, Athena(과금·페더레이션 쿼리), Lake Formation(블루프린트·LF 태그), Parquet
- **예상 개념 수**: 기존 5 + 신규 15 = 20
- **3단 구분**: 1단 EMR·Spark·Glue·Athena·Lake Formation이 각각 무엇인가 / 2단 EMR과 Glue의 갈림길, 일시적 클러스터와 장기 실행 클러스터, 가끔 조회하는 로그를 어디에 쌓는가 / 3단 노드 역할별 인스턴스 제품군, 암호화 설정을 클러스터 밖에 두는 방법, 열 지향 형식이 주는 것
- **담당 step**: 15

## kinesis-streaming — Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK

- **importance**: 2
- **sourcePages**: [38, 40]
- **유래**: `analytics-monitoring` 분할 (+ `messaging-backup`의 MSK)
- **담는 서비스**: Kinesis Data Streams(샤드·파티션 키·용량 모드·보존·향상된 팬아웃·KCL), Data Firehose(버퍼링·형식 변환·Lambda 변환), Managed Service for Apache Flink, Kinesis Video Streams, Amazon MSK와 Kafka Connect
- **예상 개념 수**: 기존 5 + 신규 11 = 16
- **3단 구분**: 1단 스트리밍 서비스 다섯이 각각 무엇인가 / 2단 Data Streams ↔ Firehose ↔ Flink의 비교, Kinesis와 MSK의 갈림길 / 3단 레코드 크기 제한, 파티션 키 쏠림, 프로비저닝 모드와 온디맨드 모드, 버퍼링 조건
- **배열 위치 근거**: `emr-glue-athena` 바로 뒤다. `analytics-monitoring`이 있던 자리에 네 조각이 연속으로 놓인다
- **담당 step**: 15

## redshift-opensearch-quicksight — Redshift·Redshift Spectrum·OpenSearch·QuickSight

- **importance**: 2
- **sourcePages**: [38, 40]
- **유래**: `analytics-monitoring` 분할
- **담는 서비스**: Redshift(동시성 확장·Spectrum·COPY 적재), OpenSearch, QuickSight와 ML 예측, OLTP와 OLAP
- **예상 개념 수**: 기존 1 + 신규 10 = 11
- **3단 구분**: 1단 Redshift·Spectrum·OpenSearch·QuickSight가 각각 무엇인가 / 2단 OLTP와 OLAP, 임시 쿼리와 반복되는 고성능 쿼리, 검색 워크로드는 어디로 가는가, 자주 쓰는 데이터만 웨어하우스에 넣기 / 3단 동시성 확장, S3에서 병렬로 적재하는 방법, 운영 테이블의 과거 데이터를 흘려보내는 자리
- **담당 step**: 15

## cloudwatch-xray — CloudWatch·X-Ray·Performance Insights·Managed Grafana

- **importance**: 2
- **sourcePages**: [38, 40]
- **유래**: `analytics-monitoring` 분할
- **담는 서비스**: CloudWatch(지표·로그·경보·에이전트·Container Insights·Network Monitor·상세 모니터링), X-Ray, Performance Insights, Amazon Managed Grafana, 로그 분석 선택지
- **예상 개념 수**: 기존 4 + 신규 7 = 11
- **3단 구분**: 1단 CloudWatch·X-Ray·Performance Insights·Managed Grafana가 각각 무엇인가 / 2단 지표와 로그와 추적이 각각 무엇을 답하는가, OpenSearch와 CloudWatch Logs Insights, 적정 규모 조정의 근거 / 3단 메모리 사용률이 기본 지표가 아니라는 것, 상세 모니터링의 간격, 경보 상태 변경이 이벤트로 흘러간다는 것
- **배열 위치 근거**: `analytics-monitoring`을 쪼갠 네 조각 중 마지막이다. step 15의 세 주제 바로 뒤라 인접 조건을 만족한다
- **담당 step**: 16

## secrets-encryption — Secrets Manager·Parameter Store·KMS·ACM·CloudHSM

- **importance**: 3
- **sourcePages**: [44, 44]
- **유래**: `secrets-encryption` 유지
- **담는 서비스**: Secrets Manager, Systems Manager Parameter Store, KMS(키 종류·자동 교체·다중 리전 키·가져온 키 자료·CloudHSM 키 저장소), ACM(DNS 검증·만료 이벤트·리전 제약), CloudHSM
- **예상 개념 수**: 기존 9 + 신규 11 = 20
- **3단 구분**: 1단 네 서비스가 각각 무엇인가 / 2단 Secrets Manager와 Parameter Store의 갈림길, 고객 관리 키·AWS 관리 키·AWS 소유 키, 자동 순환이 나오면 무엇인가 / 3단 자동 교체 주기와 대칭 키 제약, 가져온 키 자료의 교체, CloudFront 인증서의 리전
- **담당 step**: 18

## waf-shield — WAF·Shield·Firewall Manager

- **importance**: 3
- **sourcePages**: [45, 47]
- **유래**: `threat-protection` 분할
- **담는 서비스**: WAF(붙일 수 있는 곳·규칙 종류·관리형 규칙 그룹·속도 기반 규칙·Bot Control·로깅), Shield와 Shield Advanced(DRT·보호 그룹), Firewall Manager, CloudFront의 방어 역할
- **예상 개념 수**: 기존 7 + 신규 8 = 15
- **3단 구분**: 1단 WAF·Shield·Firewall Manager가 각각 무엇인가 / 2단 Shield Standard가 다루지 않는 계층, Shield와 Shield Advanced, 계정이 여러 개면 어디서 거는가 / 3단 본문 검사 크기 한도, Web ACL의 리전 조건, 로그가 Firehose를 거친다는 것
- **담당 step**: 18

## guardduty-macie-inspector — GuardDuty·Macie·Inspector·Security Hub

- **importance**: 3
- **sourcePages**: [45, 47]
- **유래**: `threat-protection` 분할
- **담는 서비스**: GuardDuty(데이터베이스 로그인 이상 탐지·탐지 결과 연동), Macie(자동 탐지·위임 관리자·알림), Amazon Inspector(ECR 이미지 스캔), Security Hub, 헷갈리기 쉬운 보안 서비스 네 가지
- **예상 개념 수**: 기존 4 + 신규 7 = 11
- **3단 구분**: 1단 GuardDuty·Macie·Inspector·Security Hub가 각각 무엇인가 / 2단 네 서비스가 각각 무엇을 찾는가, 취약점 스캔은 어디인가 / 3단 위임 관리자 계정에서 조직 전체를 보는 방법, 탐지 결과를 EventBridge로 이어 자동 대응을 붙이는 방법
- **배열 위치 근거**: `waf-shield` 바로 뒤다. `threat-protection`이 있던 자리에 두 조각이 연속으로 놓인다
- **담당 step**: 18

## iam-permissions — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer

- **importance**: 3
- **sourcePages**: [48, 49]
- **유래**: `identity-access` 분할
- **담는 서비스**: IAM(사용자·그룹·역할·정책·인스턴스 프로파일), 최소 권한, ABAC, 권한 경계, 계정 간 역할, IAM Roles Anywhere, 루트 사용자, IAM Access Analyzer, Network Access Analyzer
- **예상 개념 수**: 기존 4 + 신규 14 = 18
- **3단 구분**: 1단 IAM 구성 요소와 Access Analyzer가 각각 무엇인가 / 2단 최소 권한과 ABAC, 권한 경계와 정책, IAM Access Analyzer와 Network Access Analyzer / 3단 명시적 거부가 허용을 이긴다는 것, NotAction을 쓴 Deny, 리전 조건, IAM 사용자가 계정 밖으로 나가지 않는다는 것
- **담당 step**: 17

## identity-federation — IAM Identity Center·STS·Cognito·Directory Service·SAML

- **importance**: 3
- **sourcePages**: [48, 49]
- **유래**: `identity-access` 분할
- **담는 서비스**: IAM Identity Center(권한 세트·외부 IdP), STS와 임시 자격 증명, Cognito(사용자 풀·자격 증명 풀·소셜 로그인), AWS Directory Service와 AD Connector, SAML 2.0 페더레이션, 사용자 지정 ID 브로커
- **예상 개념 수**: 기존 5 + 신규 6 = 11
- **3단 구분**: 1단 Identity Center·STS·Cognito·Directory Service가 각각 무엇인가 / 2단 사내 디렉터리와 앱 사용자 중 어느 쪽인가, 사용자 풀과 자격 증명 풀, SAML을 못 쓰는 디렉터리는 어떻게 잇는가 / 3단 권한 세트가 계정에 배포되는 방식, 역할을 그룹에 맵핑하는 방법
- **배열 위치 근거**: `iam-permissions` 바로 뒤다. `identity-access`가 있던 자리에 세 조각이 연속으로 놓인다
- **담당 step**: 17

## organizations-cloudtrail-config — Organizations·SCP·CloudTrail·Config·Audit Manager

- **importance**: 3
- **sourcePages**: [48, 49]
- **유래**: `identity-access` 분할
- **담는 서비스**: AWS Organizations(조직 단위·통합 청구·태그 정책), SCP(붙일 자리·조건 예외), CloudTrail(관리 이벤트·데이터 이벤트·Lake·로그 파일 유효성 검사), AWS Config(구성 레코더·준수 팩·사용자 지정 규칙·자동 수정), Audit Manager
- **예상 개념 수**: 기존 3 + 신규 13 = 16
- **3단 구분**: 1단 Organizations·SCP·CloudTrail·Config·Audit Manager가 각각 무엇인가 / 2단 SCP와 태그 정책이 하는 일의 차이, CloudTrail과 Config가 각각 무엇을 기록하는가, 관리 이벤트와 데이터 이벤트 / 3단 SCP를 붙일 수 있는 자리와 예외를 두는 방법, 준수 팩과 사용자 지정 규칙, 규칙에 자동 수정을 붙이는 방법
- **담당 step**: 17

## cost-management — 절약 플랜·Budgets·Cost Explorer·Trusted Advisor

- **importance**: 2
- **sourcePages**: [50, 50]
- **유래**: `cost-management` 유지
- **담는 서비스**: 절약 플랜, 예약 인스턴스(EC2·RDS), 온디맨드 용량 예약, AWS Budgets(예산 조치·예측 알림), Cost Explorer, Billing and Cost Management, 비용 및 사용량 보고서, Cost Anomaly Detection, 비용 할당 태그, Trusted Advisor, Compute Optimizer
- **예상 개념 수**: 기존 9 + 신규 8 = 17
- **3단 구분**: 1단 비용 도구들이 각각 무엇인가 / 2단 Cost Explorer ↔ Budgets ↔ Cost Anomaly Detection, 약정은 기준 용량까지만 건다는 것, 용량 예약과 예약 인스턴스 / 3단 태그를 관리 계정에서 활성화한다는 것, 예산 조치, 권장 대상에 EBS 볼륨도 있다는 것
- **담당 step**: 19

## governance-iac — CloudFormation·Service Catalog·Control Tower·RAM

- **importance**: 2
- **sourcePages**: [0, 0]
- **유래**: 신규. 근거가 `dump-gaps/`에만 있어 `concepts-raw.md` 페이지가 없다
- **담는 서비스**: CloudFormation과 드리프트 감지, Service Catalog, Control Tower(랜딩 존·사전 예방적 제어·탐지 제어), AWS Resource Access Manager, Workload Discovery
- **예상 개념 수**: 기존 0 + 신규 7 = 7
- **3단 구분**: 1단 CloudFormation·Service Catalog·Control Tower·RAM이 각각 무엇인가 / 2단 셋 중 무엇이 어느 자리를 맡는가, 사전 예방적 제어와 탐지 제어 / 3단 드리프트 감지, 랜딩 존이 만들어 주는 것
- **importance 근거**: 관리·거버넌스 계열이라 `cost-management`와 같은 2로 둔다. 시험에서 서비스 구분 수준으로 나오고 사양·한계까지 파고들지 않는다
- **배열 위치 근거**: `cost-management` 바로 뒤다. 관리·거버넌스 계열 셋을 배열 끝에 모은다
- **담당 step**: 19

## systems-manager — Systems Manager·AppConfig·EC2 Instance Connect

- **importance**: 2
- **sourcePages**: [0, 0]
- **유래**: 신규. 근거가 `dump-gaps/`에만 있어 `concepts-raw.md` 페이지가 없다
- **담는 서비스**: Systems Manager(Session Manager·Patch Manager·Run Command·Inventory·관리형 인스턴스 정책), AWS AppConfig, EC2 Instance Connect 엔드포인트
- **예상 개념 수**: 기존 0 + 신규 7 = 7
- **3단 구분**: 1단 Systems Manager의 기능들과 AppConfig가 각각 무엇인가 / 2단 배스천 호스트 없이 접속하는 두 길(Session Manager와 EC2 Instance Connect 엔드포인트), 패치를 어디서 도는가 / 3단 관리형 인스턴스를 만드는 정책, 인벤토리가 모으는 것
- **importance 근거**: `governance-iac`와 같은 관리 도구 계열이라 2로 둔다. Parameter Store는 `secrets-encryption`에 남는데, 두 주제가 갈리는 것 자체가 학습 내용이다(ADR-019의 같은 판단)
- **배열 위치 근거**: `governance-iac` 바로 뒤다
- **담당 step**: 19

## ai-ml-services — SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract

- **importance**: 2
- **sourcePages**: [0, 0]
- **유래**: 신규. 근거가 `dump-gaps/`에만 있어 `concepts-raw.md` 페이지가 없다
- **담는 서비스**: SageMaker AI와 Autopilot, Comprehend, Rekognition과 콘텐츠 검토, Amazon Lex, 음성·이미지·번역·문서를 나눠 맡는 AI 서비스 넷
- **예상 개념 수**: 기존 0 + 신규 6 = 6
- **3단 구분**: 1단 SageMaker와 API로 부르는 AI 서비스들이 각각 무엇인가 / 2단 모델을 직접 만드는 자리와 이미 만들어진 기능을 부르는 자리, 어느 입력을 다루는가로 갈라 보기 / 3단 Autopilot이 대신해 주는 것, 콘텐츠 검토의 쓰임
- **importance 근거**: SAA-C03에서는 "무엇을 하는 서비스인가"까지만 묻고 사양·한계로 들어가지 않는다. 기초(0)로 두기에는 뒤에서 처음 만나는 서비스들이라 2로 둔다
- **배열 위치 근거**: 배열 맨 뒤다. 성격이 가까운 기존 주제가 없고, 다른 주제를 다 읽은 뒤 마지막에 훑는 갈래다
- **담당 step**: 20
