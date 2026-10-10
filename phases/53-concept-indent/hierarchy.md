# phase 53 머리·딸린 개념 판정 — 사람이 읽는 트리

`hierarchy.json`과 같은 내용을 주제별 트리로 그린 것이다. 규칙은 `docs/ADR.md` ADR-041.

- `■` 머리 개념 — 바로 아래 `│` 개념들을 거느린다.
- `│` 딸린 개념 — `parentId`가 바로 위 `■`를 가리킨다.
- 표시 없음 — 홀로 선 개념(머리도 딸린 개념도 아니다).

순서는 `src/data/topics.json`의 순서 그대로다. 단, `waf-shield`는 step 4가 `cloudfront`를 주제 맨 앞(`waf` 앞)으로 옮긴 뒤의
순서로 그렸다(ADR-041 「남은 자리」 1). 머리 102개, 딸린 개념 301개.

### AWS 핵심 서비스·리전·가용 영역·온프레미스 (`aws-core-services`)

```text
  EC2 (Elastic Compute Cloud)
  RDS (Relational Database Service)
  S3 (Simple Storage Service)
  Route 53
  DNS (Domain Name System)
  ELB (Elastic Load Balancer)
  CloudFront
  Lambda
  리전 (Region)
  가용성 (Availability)
  가용 영역 (Availability Zone)
  다중 AZ (Multi-AZ)
  단일 AZ (Single-AZ)
  온프레미스 (On-premise)
  마이그레이션 (Migration)
  시험에서 자주 통하는 판단 기준
  지수 백오프와 재시도
  큰 파일 본체의 저장 위치
```

### S3 스토리지 클래스 유형 (`s3-storage-classes`)

```text
  S3 Standard
  S3 Intelligent-Tiering
  S3 Standard-IA (Infrequent Access)
  S3 One Zone-IA
  S3 Glacier Instant Retrieval
  S3 Glacier Flexible Retrieval
  S3 Glacier Deep Archive
  S3 Express One Zone
  즉시 조회와 대기 조회
  Glacier와 Standard-IA 중 고르기
  Glacier Flexible Retrieval의 표준 검색 시간
  Glacier Flexible Retrieval의 신속 검색
  아카이브 계열의 비용 순서
  수명 주기 규칙과 자동 계층화의 갈림길
  S3 스토리지 클래스 분석
  스토리지 클래스마다 다른 검색 요금
  Intelligent-Tiering의 객체별 감시 요금
```

### S3 버전 관리·객체 잠금·수명 주기·복제 (`s3-versioning-lifecycle`)

```text
  S3 버전 관리
■ S3 객체 잠금
│ 객체 잠금의 전제 조건과 MFA 삭제의 한계
■ S3 수명 주기 정책
│ 수명 주기 구성의 개수 제한과 규칙의 크기 필터
  S3 이벤트 알림
■ S3 리전 간 복제 (CRR)
│ S3 동일 리전 복제 (SRR)
│ S3 복제 시간 제어 (S3 RTC)
│ 계정을 넘는 복제와 SSE-KMS 키 권한
```

### S3 암호화(SSE)·Batch Operations·인벤토리 (`s3-encryption-batch`)

```text
■ SSE (Server Side Encryption)
│ SSE 종류
│ 클라이언트 측 암호화
│ 봉투 암호화 (Envelope Encryption)
│ SSE-KMS의 감사 추적과 업로드 강제
│ SSE-KMS의 비용 구조와 S3 Bucket Key
│ SSE-C의 자동 교체와 감사 추적 한계
│ 버킷 정책의 전송 구간 암호화 강제
■ S3 Batch Operations
│ S3 인벤토리
│ 일회성 대량 복사와 지속 복제
│ S3 Batch Operations의 Lambda 호출
  S3 Object Lambda
```

### S3 접근 제어·액세스 포인트·Storage Lens (`s3-access-control`)

```text
■ 계정 간 버킷 접근과 버킷 정책
│ 버킷을 특정 VPC에서만 열기
■ 계정 수준 공개 액세스 차단
│ 공개 액세스 차단과 명시적 허용
  S3 사전 서명된 URL
  S3 액세스 권한(Access Grants)
■ S3 액세스 포인트
│ S3 멀티 리전 액세스 포인트
  CORS의 권한 부여 한계
  요청자 부담 버킷
  정적 웹사이트 엔드포인트와 HTTPS
■ S3 Storage Lens
│ S3 Storage Lens의 고급 활동 메트릭
```

### EBS·인스턴스 스토어·스냅샷·배치 그룹 (`ebs-instance-store`)

```text
■ EBS (Elastic Block Store)
│ EBS Elastic Volumes
│ EBS 볼륨 유형의 실제 이름
│ gp3의 IOPS와 용량 분리
│ io2 Block Express가 올려 주는 IOPS 상한
│ 계정 속성으로 켜는 EBS 기본 암호화
│ EBS 암호화와 성능
│ EBS 스냅샷 휴지통
│ EBS 스냅샷의 공개 액세스 차단
│ Amazon Data Lifecycle Manager
│ 스냅샷으로 만든 볼륨의 첫 접근이 느린 이유
  인스턴스 스토어 (Instance Store)
  클러스터 배치 그룹
  분산 배치 그룹
  Elastic Fabric Adapter(EFA)
```

### EFS·FSx(Windows·Lustre·ONTAP) (`efs-fsx`)

```text
■ EFS (Elastic File System)
│ EFS의 버스팅 처리량과 프로비저닝된 처리량
│ EFS의 Elastic 처리량 모드
│ EFS의 범용 성능 모드와 최대 I/O 성능 모드
│ EFS One Zone
│ EFS의 POSIX 권한 모델
│ EFS 수명 주기 관리
│ EFS IA의 128KB 파일 크기 기준
│ EFS 수명 주기의 기본 스토리지 되돌리기 설정
│ 가용 영역마다 두는 EFS 마운트 대상
│ 계정 간 EFS 마운트
│ EFS 복제의 단방향 제약
  FSx (File System for Extended use)
■ Amazon FSx for Windows File Server
│ SQL Server Always On 가용성 그룹의 공유 스토리지
│ FSx for Windows File Server의 자동 스토리지 확장
■ Amazon FSx for Lustre
│ FSx for Lustre의 1ms 이내 액세스 지연
│ FSx for Lustre의 영구 배포 유형
│ FSx for Lustre의 데이터 리포지토리 연결
  FSx for NetApp ONTAP의 다중 AZ 배포
  FSx for NetApp ONTAP의 NFS·SMB 동시 지원과 자동 계층화
  FSx for NetApp ONTAP의 iSCSI 블록 스토리지
  FSx for NetApp ONTAP과 SnapMirror
  Amazon FSx File Gateway
```

### DataSync·Snowball Edge·Transfer Family·S3 전송 (`data-transfer-services`)

```text
■ DataSync
│ 지속 수집과 예약 전송의 갈림길
│ DataSync가 맡지 않는 일
│ DataSync의 전송 중 암호화
│ 전송 대상을 좁히는 DataSync 매니페스트
│ DataSync 태스크의 전송 모드
│ DataSync 작업 실행 상태의 EventBridge 이벤트
■ Snowball Edge
│ Snowball Edge의 현장 컴퓨팅 기능
│ 전송 수단을 정하는 기한과 대역폭 계산
■ Transfer Family
│ Transfer Family의 사용자 지정 DNS 이름
│ Transfer Family의 Directory Service ID 공급자
│ Transfer Family의 서비스 관리형 사용자
│ Transfer Family의 업로드 후 워크플로
│ 업로드 후 워크플로의 미리 정의된 액션
│ Transfer Family의 구조화된 로깅
■ S3 전송 가속
│ 멀티파트 업로드
```

### Storage Gateway·DMS·Application Migration Service (`storage-gateway-migration`)

```text
■ Storage Gateway
│ Storage Gateway의 게이트웨이 유형
│ 저장 볼륨 게이트웨이와 캐시된 볼륨 게이트웨이
│ 가상 테이프가 내려가는 아카이브 계층
■ DMS와 SCT
│ 전체 로드와 변경 데이터 캡처를 함께 하는 복제 태스크
  Application Migration Service
```

### RDS 스토리지 유형과 기능 (`rds-storage-features`)

```text
  RDS
■ RDS 스토리지 유형
│ RDS 스토리지 유형의 약칭
  RDS 기능
  다중 AZ 대기 인스턴스로는 할 수 없는 것
  다중 AZ DB 인스턴스 배포와 다중 AZ DB 클러스터 배포
  다중 AZ 장애 조치에 걸리는 시간
  캐시가 효과를 내지 못하는 조건
■ 연결(Connection) 문제의 정답 신호
│ RDS Proxy의 장애 조치 시간 단축
  RDS 블루/그린 배포
  리전 간 RDS 스냅샷 복사
  RDS 자동 백업의 보존 한계
  특정 시점 복구와 5분 간격 트랜잭션 로그
  만료가 없는 수동 스냅샷
  RDS의 IAM 데이터베이스 인증
■ 저장 중 암호화가 미치는 범위와 전송 중 암호화
│ 기존 RDS 인스턴스의 저장 중 암호화 절차
  RDS 인스턴스 중지와 7일 뒤 자동 재시작
■ RDS Custom
│ RDS Custom의 보유 라이선스 모델
```

### Aurora·Aurora Serverless·글로벌 데이터베이스 (`aurora`)

```text
  Aurora
■ Aurora Serverless v2
│ Aurora Serverless의 최대 ACU 설정
■ Aurora 전용 Reader Endpoint
│ Aurora의 엔드포인트 종류
│ Aurora Auto Scaling의 레플리카 수 조정
│ 읽기 전용 복제본의 스키마 변경 제약
■ Babelfish for Aurora PostgreSQL
│ SQL Server를 그대로 옮길 때의 라이선스 비용
  Aurora PostgreSQL의 pgvector 확장
  Aurora MySQL에서 S3로 바로 내보내기
  Aurora 글로벌 데이터베이스가 채우는 RPO와 RTO
  리전 간 Aurora 복제본
  Aurora Global Database에서 쓰기를 받는 리전
  Aurora의 지속적 증분 백업
  Aurora 클론의 적용 범위
  Aurora Standard와 Aurora I/O-Optimized
  확장 수단이 아닌 Aurora 기능 둘
```

### DynamoDB (`dynamodb`)

```text
■ DynamoDB
│ DynamoDB의 응답 시간
■ DynamoDB Streams
│ DynamoDB Streams의 24시간 보존 한계
│ DynamoDB Streams 소비의 배치 크기
  DynamoDB 글로벌 테이블
■ DynamoDB TTL
│ TTL 삭제의 48시간 지연
  전역 보조 인덱스(GSI)
■ 프로비저닝된 용량과 온디맨드 용량
│ DynamoDB 오토 스케일링과 목표 활용률
  최종 일관성 읽기와 강력한 일관성 읽기
■ 분석용 적재의 S3 내보내기와 스트림 경로
│ S3 내보내기의 증분 형태
│ S3 내보내기와 테이블 읽기 용량
│ DynamoDB PITR의 보존 한계
│ S3 내보내기의 전제 조건인 PITR
  DynamoDB 항목 크기 제한
```

### ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream (`elasticache-purpose-built-db`)

```text
■ ElastiCache
│ Redis와 Memcached의 갈림길
│ ElastiCache의 다중 AZ 자동 장애 조치
│ ElastiCache 글로벌 데이터스토어
│ 캐시 도입에 필요한 애플리케이션 코드 변경
│ 영구 저장소가 아닌 캐시
■ DynamoDB 전용 캐시 DAX
│ DAX 저장 중 암호화의 설정 시점
■ Amazon DocumentDB
│ DocumentDB 글로벌 클러스터
■ Amazon Neptune
│ Neptune Streams
  Amazon Quantum Ledger Database(QLDB)
  Amazon Timestream
```

### EC2 인스턴스 유형·구매 옵션·Auto Scaling (`ec2-autoscaling`)

```text
  EC2
■ AMI와 시작 템플릿
│ EC2 Image Builder
  메모리 최적화 인스턴스 제품군
  GPU 인스턴스 제품군과 컴퓨팅 서비스 선택
  향상된 네트워킹
  표준 예약 인스턴스와 전환 가능 예약 인스턴스
  스팟에 올릴 수 있는 워크로드
  예약된 조정과 대상 추적의 갈림길
  대상 추적과 단순 조정의 갈림길
  예측 스케일링
  스팟 할당 전략
  Auto Scaling 그룹의 인스턴스 유형 재정의
  Auto Scaling 그룹의 온디맨드 기반 용량
  Auto Scaling 웜 풀
  용량을 1로 고정한 오토 스케일링 그룹의 인스턴스 교체
  로드 밸런서 상태 검사와 인스턴스 교체
  AWS ParallelCluster
```

### ALB·NLB·Gateway Load Balancer (`elastic-load-balancing`)

```text
  ELB
  계층으로 나뉘는 ALB와 NLB
  ALB가 볼 수 있는 라우팅 조건
  ALB의 쿠키 기반 스티키 세션
  스티키 세션의 부작용
  ALB의 분산 알고리즘
  경로별 타깃 그룹과 독립 확장
  ALB 리스너 규칙의 사용자 지정 응답
  NLB의 TLS 리스너
  NLB의 UDP 리스너
  NLB 대상 그룹의 IP 주소 등록
■ 게이트웨이 로드 밸런서
│ 게이트웨이 로드 밸런서 엔드포인트와 계정 간 트래픽 검사
  내부 로드 밸런서
  연결 경로 전체의 유휴 타임아웃
  로드 밸런서 뒤 구간까지의 종단 간 암호화
```

### CloudFront·Global Accelerator·엣지 함수 (`cloudfront-global-accelerator`)

```text
■ CloudFront
│ CloudFront의 ALB 오리진
│ 배포 하나에 등록하는 여러 오리진
│ CloudFront의 온프레미스 오리진
│ CloudFront 서명된 URL
│ CloudFront 서명된 쿠키
│ CloudFront 지리적 제한
│ CloudFront 필드 수준 암호화
│ CloudFront 가격 등급
│ CloudFront TTL과 캐시 무효화의 관계
│ CloudFront를 거쳐 S3에 올리기
│ ALB 오리진 접근을 CloudFront로 좁히는 보안 그룹
  'Edge'라는 키워드
■ Lambda@Edge
│ 뷰어 위치에 따른 Lambda@Edge의 오리진 선택
│ Lambda@Edge의 응답 압축
■ CloudFront Functions
│ CloudFront Functions의 외부 서비스 호출 제약
■ Global Accelerator
│ Global Accelerator의 고정 IP
│ Global Accelerator가 앞에 붙는 대상
│ Global Accelerator가 처리하는 것
│ DNS 캐시에 영향받지 않는 장애 조치
  엣지 캐시가 줄이는 데이터 전송 비용
```

### Lambda (`lambda`)

```text
  Lambda
■ Lambda 함수 URL
│ 함수 URL의 AWS_IAM 인증 유형
  이벤트 호출과 요청-응답 호출
  Lambda의 Kinesis 스트림 레코드 처리
  Lambda의 VPC 연결
  Lambda의 컨테이너 이미지 패키징
  Lambda 레이어의 크기 제한
  Lambda 함수의 EFS 마운트
■ 메모리에 비례하는 Lambda의 CPU 배정
│ Lambda 한 번 실행의 메모리 상한
■ 예약된 동시성과 프로비저닝된 동시성
│ 프로비저닝된 동시성의 Application Auto Scaling 조정
│ 동시 실행 한도 초과와 TooManyRequestsException
│ Lambda SnapStart
  Lambda 버전에 고정되는 환경 변수
  실행 역할의 CloudWatch Logs 쓰기 권한
  관리형 런타임의 운영 체제 접근 제약
```

### ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk (`ecs-eks-fargate`)

```text
■ ECS
│ 태스크 역할과 인스턴스 역할
│ 태스크 역할과 태스크 실행 역할
│ ECS의 awsvpc 네트워크 모드
│ ECS 태스크 배치 전략
  실행 시간 제한이 없는 Fargate
  Fargate Spot
  Fargate의 최소 과금 단위
  Fargate 태스크의 EFS 마운트
■ Amazon EKS (Elastic Kubernetes Service)
│ EKS의 세 가지 컴퓨팅 방식과 관리 책임
│ Fargate의 파드 단위 환경 격리
│ Horizontal Pod Autoscaler와 Cluster Autoscaler
│ AWS Load Balancer Controller
│ Amazon EKS Connector
│ Amazon EKS Anywhere
│ 서비스 계정용 IAM 역할(IRSA)
│ EKS 시크릿의 KMS 암호화
  Amazon ECR과 푸시 시 스캔
■ AWS Batch
│ AWS Batch의 컴퓨팅 환경
  AWS Elastic Beanstalk
  AWS App2Container
```

### API Gateway·Step Functions (`api-gateway-step-functions`)

```text
■ API Gateway
│ HTTP API의 JWT 권한 부여자
│ REST API와 HTTP API의 통합 타임아웃
│ REST API의 API 키·요청 유효성 검사·스로틀링
│ WebSocket API
│ 식별 장치인 API 키
│ API Gateway 리소스 정책
│ 엣지 최적화 엔드포인트와 리전 엔드포인트
│ CloudFront의 HTTP API 오리진
│ REST API의 Lambda 프록시 통합
│ API Gateway의 AWS 서비스 통합
│ API Gateway 사용자 지정 도메인 이름
│ 매핑 템플릿으로 되는 변환과 안 되는 변환
│ 리소스 정책의 IP 주소 제한
■ Step Functions
│ Step Functions의 수동 승인과 재시도
│ 최대 1년까지 이어지는 Step Functions 실행
│ Express 워크플로
│ Map 상태의 항목별 반복 호출
  AWS Amplify
```

### SQS·SNS·EventBridge·Amazon MQ·SES (`sqs-sns-eventbridge`)

```text
■ SQS (Simple Queue Service)
│ 데드레터 큐(DLQ)
│ SQS의 보존 기간과 표준 대기열의 약점
│ 대기열 깊이 기반 오토 스케일링
│ SQS의 배치·가시성 타임아웃·롱 폴링
│ 가시성 타임아웃과 소비자의 처리 시간
│ SQS 메시지의 크기 한계
│ FIFO 대기열의 순서 보장 단위인 메시지 그룹 ID
│ 5분 동안 적용되는 FIFO 대기열의 중복 제거 ID
│ FIFO 대기열의 콘텐츠 기반 중복 제거
│ 큐에 직접 붙이는 리소스 기반 정책
│ SQS 큐 암호화와 소비자의 복호화 권한
│ SQS 인터페이스 VPC 엔드포인트와 큐 정책
■ SNS (Simple Notification Service)
│ SNS FIFO 주제
│ SNS의 메시지 본문 재작성 제약
│ 암호화된 SNS 주제 게시에 필요한 세 가지 권한
  SQS 대기열과 SNS 발행-구독
  소비자마다 큐를 두는 팬아웃
  계정 간 SNS 발행과 큐 정책의 주제 ARN
■ EventBridge
│ EventBridge Scheduler
│ 이벤트 라우팅과 워크플로 오케스트레이션
│ EventBridge가 보장하지 않는 것
│ 이벤트 패턴 규칙과 주기적 폴링
│ 기본·사용자 지정·파트너 이벤트 버스
│ EventBridge 파이프
│ EventBridge API 대상
│ 프라이빗 API로 이벤트를 넣는 길
│ 리소스 구성 변경에 거는 EventBridge 규칙
  Amazon MQ
■ Amazon SES (Simple Email Service)
│ SES의 이메일 수신 규칙
```

### AWS Backup·재해 복구 전략·Elastic Disaster Recovery (`backup-disaster-recovery`)

```text
■ AWS Backup
│ AWS Backup으로 넘어가야 하는 순간
│ 백업 계획의 리소스로 지정하는 EC2 인스턴스
│ Organizations의 백업 정책
│ 다른 계정에 두는 백업 사본
│ S3의 연속 백업과 특정 시점 복원
│ AWS Backup의 복원 테스트 계획
│ AWS Backup Audit Manager
  백업 및 복원
  짧은 RTO가 요구하는 대기 리전 구성
  AWS Elastic Disaster Recovery(AWS DRS)
```

### VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링 (`vpc-networking`)

```text
  VPC, 서브넷
■ 인터넷 게이트웨이
│ Egress-only 인터넷 게이트웨이
■ NAT 게이트웨이
│ 가용 영역마다 두는 NAT 게이트웨이
│ 리전 수준 리소스인 인터넷 게이트웨이
│ 환경에 따라 달라지는 NAT 게이트웨이 수
│ NAT 게이트웨이에 붙이는 엘라스틱 IP
■ VPC Endpoint
│ 엔드포인트 유형별 비용 차이
│ VPC 엔드포인트 정책
│ 리전 수준 서비스인 S3
  NAT 게이트웨이 경로의 목적지인 공용 엔드포인트
  NAT 인스턴스와 NAT 게이트웨이의 차이
■ VPC 피어링
│ VPC 피어링의 확장 한계
■ PrivateLink
│ PrivateLink 엔드포인트 서비스
  NAT Gateway vs VPC Endpoint vs PrivateLink vs VPC 피어링
  VPC 플로우 로그
```

### 보안 그룹·NACL (`security-groups-nacl`)

```text
■ 보안 그룹 (Security Group)
│ 보안 그룹 참조
│ 로드 밸런서 보안 그룹의 아웃바운드와 상태 검사 포트
│ NLB에 붙이는 보안 그룹
■ NACL (Network Access Control List, 네트워크 ACL)
│ NACL의 규칙 수 제한
│ 보내는 쪽 서브넷에 거는 거부 규칙
  상태 저장과 상태 비저장
  Web ACL과 네트워크 ACL의 차이
```

### Site-to-Site VPN·Direct Connect·Transit Gateway (`hybrid-connectivity`)

```text
■ Site-to-Site VPN
│ Customer Gateway와 Bastion Host
  AWS Client VPN
■ Transit Gateway
│ 리전 간 Transit Gateway 피어링
■ Direct Connect
│ 가상 프라이빗 게이트웨이(VGW)
│ Direct Connect Gateway
│ Direct Connect의 두 가지 함정
│ Direct Connect 최대 복원력 구성
│ Direct Connect의 가상 인터페이스(VIF)
  Site-to-Site VPN vs Direct Connect
  온프레미스 연결 문제의 출발점
  VPC마다 따로 맺는 Site-to-Site VPN
  온프레미스에서 쓰는 인터페이스 엔드포인트
  데이터 지역성으로 전송 비용 줄이기
  온프레미스로 모으는 아웃바운드 인터넷 트래픽
■ Local Zone·Outposts·Wavelength Zone의 리전 연결 전제
│ Outposts로 지키는 데이터 상주 요건
```

### Route 53 (`route53`)

```text
  Route 53
■ Route 53 라우팅 정책
│ 페일오버 라우팅 정책
│ 리전 장애에 대비하는 다중 리전 장애 조치
│ AWS 밖 엔드포인트의 지연 시간 레코드
│ 다중값 응답 라우팅의 세부 동작
■ Route 53 Resolver
│ 전달 규칙과 VPC 연결
■ 프라이빗 호스팅 영역과 퍼블릭 호스팅 영역
│ DNS 호스팅을 Route 53으로 옮기는 절차
  별칭 레코드
  프라이빗 호스팅 영역의 연결 대상
  Route 53 쿼리 로깅
```

### EMR·Spark·Glue·Athena·Lake Formation (`emr-glue-athena`)

```text
■ EMR (Elastic MapReduce)
│ EMR 클러스터의 세 가지 노드
│ 일시적 클러스터와 장기 실행 클러스터
│ EMR 관리형 스케일링
│ 노드 역할에 따른 인스턴스 제품군 선택
│ EMR 런타임 역할
│ EMR 보안 구성
  Spark
■ Glue
│ AWS Glue Crawler
│ AWS Glue DataBrew
│ 고객마다 다른 키로 암호화하는 Glue ETL 작업
■ Athena
│ Athena의 과금 단위와 암호화된 데이터
│ Athena 페더레이션 쿼리
│ 조회 빈도로 나뉘는 로그 저장 위치
■ AWS Lake Formation
│ Lake Formation 블루프린트와 Athena의 열 수준 권한
│ LF 태그 기반 액세스 제어
  Apache Parquet
```

### Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK (`kinesis-streaming`)

```text
■ Kinesis Data Streams
│ 보존 기간과 향상된 팬아웃
│ 샤드와 체크포인트를 직접 다루는 소비자
│ 스트림에 넣을 수 있는 레코드 크기
│ 파티션 키 쏠림으로 생기는 핫 샤드
│ Kinesis 스트림의 프로비저닝 모드와 온디맨드 모드
■ Data Firehose
│ Firehose의 적재 전 Lambda 변환
│ Firehose의 형식 변환
│ Firehose의 버퍼링 지연
■ Managed Service for Apache Flink
│ Flink의 Kinesis 스트림 소스와 싱크
  Data Firehose vs Kinesis Data Streams vs Managed Service for Apache Flink
  Amazon Kinesis Video Streams
■ Amazon MSK (Managed Streaming for Apache Kafka)
│ MSK가 수집과 변환까지 맡는 방식
```

### Redshift·Redshift Spectrum·OpenSearch·QuickSight (`redshift-opensearch-quicksight`)

```text
■ Redshift
│ Redshift Spectrum
│ OLTP와 OLAP
│ 임시 쿼리와 반복되는 고성능 쿼리
│ 조회 빈도에 따른 Redshift 적재와 S3 보관
│ Redshift 동시성 확장
│ S3에서 COPY 명령으로 하는 Redshift 병렬 적재
  Amazon OpenSearch Service
■ Amazon QuickSight
│ QuickSight에 내장된 머신러닝 예측
  S3에 남기는 운영 테이블의 과거 데이터
```

### CloudWatch·X-Ray·Performance Insights·Managed Grafana (`cloudwatch-xray`)

```text
■ CloudWatch
│ CloudWatch Network Monitor
│ CloudWatch Container Insights
│ 로그 분석 선택지: OpenSearch와 CloudWatch Logs Insights
│ CloudWatch 에이전트의 메모리 사용률 지표
│ EC2 상세 모니터링의 1분 간격 지표
│ CloudWatch 알람의 상태 변경 이벤트
  X-Ray
■ Performance Insights
│ Performance Insights와 적정 규모 조정
  Amazon Managed Grafana
```

### Secrets Manager·Parameter Store·KMS·ACM·CloudHSM (`secrets-encryption`)

```text
■ Secrets Manager
│ Secrets Manager의 BatchGetSecretValue API
  Systems Manager Parameter Store
  Secrets Manager vs Systems Manager Parameter Store
  자동 순환을 가리키는 신호
■ KMS (Key Management Service)
│ KMS 키의 관리 주체: 고객 관리 키·AWS 관리 키·AWS 소유 키
│ KMS 다중 리전 키
│ 고객마다 따로 만드는 KMS 키
│ KMS의 가져온 키 자료
│ 해마다 이뤄지는 KMS 자동 키 교체
│ KMS 대칭 키와 비대칭 키의 자동 교체
│ KMS의 가져온 키 자료를 교체하는 방법
│ Lambda 환경 변수의 KMS 암호화
■ AWS CloudHSM
│ CloudHSM이 뒷받침하는 KMS 키
■ ACM (AWS Certificate Manager)
│ ACM의 도메인 검증 방식
│ CloudFront용 인증서의 us-east-1 발급 제약
│ ACM 인증서 만료 임박 이벤트
```

### WAF·Shield·Firewall Manager (`waf-shield`)

```text
  CloudFront
■ WAF (Web Application Firewall)
│ WAF를 붙일 수 있는 곳
│ WAF 규칙의 종류
│ WAF 관리형 규칙 그룹
│ WAF 속도 기반 규칙
│ AWS WAF Bot Control
│ WAF가 검사하는 요청 본문의 크기 한도
│ REST API에 붙일 Web ACL의 리전 조건
│ Firehose를 거쳐 S3로 가는 WAF 로그
■ Shield
│ Shield Standard가 다루지 않는 계층
│ Shield Advanced와 DRT
│ Shield Advanced 보호 그룹
  AWS Firewall Manager
```

### GuardDuty·Macie·Inspector·Security Hub (`guardduty-macie-inspector`)

```text
■ GuardDuty
│ GuardDuty의 데이터베이스 로그인 이상 탐지
│ GuardDuty 탐지 결과를 자동 대응으로 잇는 EventBridge
■ Macie
│ Macie의 민감 데이터 자동 탐지
│ 조직 전체를 보는 Macie 위임 관리자 계정
│ Macie 탐지 결과를 알림으로 잇는 EventBridge
■ Amazon Inspector
│ Inspector의 ECR 컨테이너 이미지 스캔
  AWS Security Hub
  헷갈리기 쉬운 보안 서비스 네 가지
```

### IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer (`iam-permissions`)

```text
  IAM (Identity And Access Management)
  IAM 그룹에 붙이는 정책
  사용자 집합인 IAM 그룹
  계정 안에서만 존재하는 IAM 사용자
  IAM 인스턴스 프로파일
  IAM Roles Anywhere
  계정 간 IAM 역할과 신뢰 정책
  최소 권한 원칙 (Least Privilege)
  속성 기반 액세스 제어(ABAC)
  권한 경계
  정책 평가 순서와 명시적 거부
  NotAction을 쓴 Deny 문
  aws:RequestedRegion 조건 키
  IAM Access Analyzer
  Network Access Analyzer
  Access Analyzer의 위임 관리자 계정
  루트 사용자에 여러 개 등록하는 MFA 장치
  비활성화할 수 없는 루트 사용자
```

### IAM Identity Center·STS·Cognito·Directory Service·SAML (`identity-federation`)

```text
■ IAM Identity Center
│ IAM Identity Center와 외부 IdP의 연결
│ 권한 세트
■ STS (Security Token Service)
│ STS로 임시 자격 증명 받기
  AWS Directory Service와 AD Connector
  사용자 지정 ID 브로커
  SAML 2.0 페더레이션과 IAM 역할의 AD 그룹 매핑
■ Cognito
│ Cognito 사용자 풀과 자격 증명 풀
│ Cognito 사용자 풀과 소셜 로그인 연동
```

### Organizations·SCP·CloudTrail·Config·Audit Manager (`organizations-cloudtrail-config`)

```text
■ AWS Organizations와 SCP
│ 태그 정책과 SCP
│ Organizations의 통합 청구
│ 조직 단위(OU)
│ SCP를 붙일 수 있는 자리
│ SCP에서 예외를 두는 방법
■ AWS Config
│ 구성 레코더
│ AWS Config 준수 팩
│ AWS Config 사용자 지정 규칙
│ AWS Config 규칙과 자동 수정
■ CloudTrail
│ AWS CloudTrail Lake
│ 관리 이벤트와 데이터 이벤트
│ CloudTrail 로그 파일 유효성 검사
  AWS Audit Manager
```

### 절약 플랜·Budgets·Cost Explorer·Trusted Advisor (`cost-management`)

```text
■ 절약 플랜 (Savings Plan)
│ 절약 플랜의 적용 범위와 결제 옵션
│ 기본 부하와 일시적 증가분의 약정 크기
  RDS 예약 인스턴스
  온디맨드 용량 예약
  Cost Explorer
■ Billing and Cost Management
│ 결제 콘솔에서 하는 비용 할당 태그 활성화
│ 통합 청구에서 비용 할당 태그를 활성화하는 계정
■ AWS Budgets
│ AWS Budgets의 예산 조치
│ 예상 지출에 거는 예산 알림
  Cost Anomaly Detection
  AWS 비용 및 사용량 보고서(CUR)
  Trusted Advisor
■ AWS Compute Optimizer
│ Compute Optimizer의 EBS 볼륨 권장 사항
```

### CloudFormation·Service Catalog·Control Tower·RAM (`governance-iac`)

```text
■ AWS CloudFormation
│ CloudFormation 드리프트 감지
  AWS Service Catalog
■ Control Tower의 랜딩 존
│ Control Tower의 사전 예방적 제어와 탐지 제어
  AWS Resource Access Manager(AWS RAM)
  Workload Discovery on AWS
```

### Systems Manager·AppConfig·EC2 Instance Connect (`systems-manager`)

```text
  Systems Manager Run Command
  Systems Manager Session Manager
  Systems Manager Patch Manager
  관리형 인스턴스를 만드는 정책
  Systems Manager Inventory
  EC2 Instance Connect 엔드포인트
  AWS AppConfig
```

### SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract (`ai-ml-services`)

```text
■ Amazon SageMaker AI
│ SageMaker Autopilot
  음성·이미지·번역·문서를 나눠 맡는 AI 서비스 넷
  Amazon Comprehend
  Amazon Lex
  Rekognition의 콘텐츠 검토
```
