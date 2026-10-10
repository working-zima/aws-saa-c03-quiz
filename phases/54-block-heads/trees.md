# phase 54 바뀐 주제 여덟의 트리 — 사람이 읽는 판정

`changes.json`을 적용한 뒤의 순서와 관계를 그렸다. 규칙은 `docs/ADR.md` ADR-041·ADR-042, 기호는 phase 53 `hierarchy.md`와 같다.

- `■` 머리 개념 — 바로 아래 `│` 개념들을 거느린다.
- `│` 딸린 개념 — `parentId`가 바로 위 `■`를 가리킨다.
- 표시 없음 — 홀로 선 개념.
- `← 새 개념`은 이 phase가 더한 기본 개념, `← 새로 딸림`은 이 phase가 `parentId`를 단 개념, `← 옮김`은 순서를 옮긴 개념이다.

나머지 31개 주제는 phase 53의 `hierarchy.md` 그대로다. 합계는 머리 113개, 딸린 개념 342개(626개 중 55%)다.

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
■ Amazon FSx for NetApp ONTAP   ← 새 개념
│ FSx for NetApp ONTAP의 다중 AZ 배포   ← 새로 딸림
│ FSx for NetApp ONTAP의 NFS·SMB 동시 지원과 자동 계층화   ← 새로 딸림
│ FSx for NetApp ONTAP의 iSCSI 블록 스토리지   ← 새로 딸림
│ FSx for NetApp ONTAP과 SnapMirror   ← 새로 딸림
  Amazon FSx File Gateway
```

### RDS 스토리지 유형과 기능 (`rds-storage-features`)

```text
  RDS
■ RDS 스토리지 유형
│ RDS 스토리지 유형의 약칭
■ RDS 기능
│ 다중 AZ 대기 인스턴스로는 할 수 없는 것   ← 새로 딸림
│ 다중 AZ DB 인스턴스 배포와 다중 AZ DB 클러스터 배포   ← 새로 딸림
│ 다중 AZ 장애 조치에 걸리는 시간   ← 새로 딸림
│ 캐시가 효과를 내지 못하는 조건   ← 새로 딸림
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
■ Aurora 글로벌 데이터베이스가 채우는 RPO와 RTO
│ Aurora Global Database에서 쓰기를 받는 리전   ← 새로 딸림
  리전 간 Aurora 복제본   ← 옮김
  Aurora의 지속적 증분 백업
  Aurora 클론의 적용 범위
  Aurora Standard와 Aurora I/O-Optimized
  확장 수단이 아닌 Aurora 기능 둘
```

### EC2 인스턴스 유형·구매 옵션·Auto Scaling (`ec2-autoscaling`)

```text
  EC2
■ AMI와 시작 템플릿
│ EC2 Image Builder
  메모리 최적화 인스턴스 제품군
  GPU 인스턴스 제품군과 컴퓨팅 서비스 선택
  향상된 네트워킹
■ EC2 구매 옵션   ← 새 개념
│ 표준 예약 인스턴스와 전환 가능 예약 인스턴스   ← 새로 딸림
│ 스팟에 올릴 수 있는 워크로드   ← 새로 딸림
■ EC2 Auto Scaling   ← 새 개념
│ 예약된 조정과 대상 추적의 갈림길   ← 새로 딸림
│ 대상 추적과 단순 조정의 갈림길   ← 새로 딸림
│ 예측 스케일링   ← 새로 딸림
│ 스팟 할당 전략   ← 새로 딸림
│ Auto Scaling 그룹의 인스턴스 유형 재정의   ← 새로 딸림
│ Auto Scaling 그룹의 온디맨드 기반 용량   ← 새로 딸림
│ Auto Scaling 웜 풀   ← 새로 딸림
│ 용량을 1로 고정한 오토 스케일링 그룹의 인스턴스 교체   ← 새로 딸림
│ 로드 밸런서 상태 검사와 인스턴스 교체   ← 새로 딸림
  AWS ParallelCluster
```

### ALB·NLB·Gateway Load Balancer (`elastic-load-balancing`)

```text
  ELB
  계층으로 나뉘는 ALB와 NLB
■ ALB (Application Load Balancer)   ← 새 개념
│ ALB가 볼 수 있는 라우팅 조건   ← 새로 딸림
│ ALB의 쿠키 기반 스티키 세션   ← 새로 딸림
│ 스티키 세션의 부작용   ← 새로 딸림
│ ALB의 분산 알고리즘   ← 새로 딸림
│ 경로별 타깃 그룹과 독립 확장   ← 새로 딸림
│ ALB 리스너 규칙의 사용자 지정 응답   ← 새로 딸림
■ NLB (Network Load Balancer)   ← 새 개념
│ NLB의 TLS 리스너   ← 새로 딸림
│ NLB의 UDP 리스너   ← 새로 딸림
│ NLB 대상 그룹의 IP 주소 등록   ← 새로 딸림
■ 게이트웨이 로드 밸런서
│ 게이트웨이 로드 밸런서 엔드포인트와 계정 간 트래픽 검사
  내부 로드 밸런서
  연결 경로 전체의 유휴 타임아웃
  로드 밸런서 뒤 구간까지의 종단 간 암호화
```

### ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk (`ecs-eks-fargate`)

```text
■ ECS
│ 태스크 역할과 인스턴스 역할
│ 태스크 역할과 태스크 실행 역할
│ ECS의 awsvpc 네트워크 모드
│ ECS 태스크 배치 전략
■ AWS Fargate   ← 새 개념
│ 실행 시간 제한이 없는 Fargate   ← 새로 딸림
│ Fargate Spot   ← 새로 딸림
│ Fargate의 최소 과금 단위   ← 새로 딸림
│ Fargate 태스크의 EFS 마운트   ← 새로 딸림
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
│ 프라이빗 호스팅 영역의 연결 대상   ← 새로 딸림
  별칭 레코드   ← 옮김
  Route 53 쿼리 로깅
```

### IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer (`iam-permissions`)

```text
  IAM (Identity And Access Management)
■ IAM 사용자   ← 새 개념
│ IAM 그룹에 붙이는 정책   ← 새로 딸림
│ 사용자 집합인 IAM 그룹   ← 새로 딸림
│ 계정 안에서만 존재하는 IAM 사용자   ← 새로 딸림
■ IAM 역할   ← 새 개념
│ IAM 인스턴스 프로파일   ← 새로 딸림
│ IAM Roles Anywhere   ← 새로 딸림
│ 계정 간 IAM 역할과 신뢰 정책   ← 새로 딸림
  최소 권한 원칙 (Least Privilege)
  속성 기반 액세스 제어(ABAC)
  권한 경계
  정책 평가 순서와 명시적 거부
  NotAction을 쓴 Deny 문
  aws:RequestedRegion 조건 키
■ IAM Access Analyzer
│ Access Analyzer의 위임 관리자 계정   ← 새로 딸림
  Network Access Analyzer   ← 옮김
  루트 사용자에 여러 개 등록하는 MFA 장치
  비활성화할 수 없는 루트 사용자
```
