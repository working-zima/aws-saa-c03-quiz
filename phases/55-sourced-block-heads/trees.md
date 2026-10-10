# phase 55 바뀐 주제 여섯의 트리 — 사람이 읽는 판정

`changes.json`을 적용한 뒤의 순서와 관계를 그렸다. 규칙은 `docs/ADR.md` ADR-041·ADR-043, 기호는 phase 53 `hierarchy.md`와 같다.

- `■` 머리 개념 — 바로 아래 `│` 개념들을 거느린다.
- `│` 딸린 개념 — `parentId`가 바로 위 `■`를 가리킨다.
- 표시 없음 — 홀로 선 개념.
- `← 새 개념`은 이 phase가 더한 기본 개념, `← 새로 딸림`은 이 phase가 `parentId`를 단 개념이다.

나머지 33개 주제는 phase 54 그대로다. 합계는 머리 120개, 딸린 개념 366개(633개 중 58%)다.

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
■ EC2 배치 그룹   ← 새 개념
│ 클러스터 배치 그룹   ← 새로 딸림
│ 분산 배치 그룹   ← 새로 딸림
  Elastic Fabric Adapter(EFA)
```

### RDS 스토리지 유형과 기능 (`rds-storage-features`)

```text
  RDS
■ RDS 스토리지 유형
│ RDS 스토리지 유형의 약칭
■ RDS 기능
│ 다중 AZ 대기 인스턴스로는 할 수 없는 것
│ 다중 AZ DB 인스턴스 배포와 다중 AZ DB 클러스터 배포
│ 다중 AZ 장애 조치에 걸리는 시간
│ 캐시가 효과를 내지 못하는 조건
■ 연결(Connection) 문제의 정답 신호
│ RDS Proxy의 장애 조치 시간 단축
  RDS 블루/그린 배포
■ RDS 자동 백업과 DB 스냅샷   ← 새 개념
│ 리전 간 RDS 스냅샷 복사   ← 새로 딸림
│ RDS 자동 백업의 보존 한계   ← 새로 딸림
│ 특정 시점 복구와 5분 간격 트랜잭션 로그   ← 새로 딸림
│ 만료가 없는 수동 스냅샷   ← 새로 딸림
  RDS의 IAM 데이터베이스 인증
■ 저장 중 암호화가 미치는 범위와 전송 중 암호화
│ 기존 RDS 인스턴스의 저장 중 암호화 절차
  RDS 인스턴스 중지와 7일 뒤 자동 재시작
■ RDS Custom
│ RDS Custom의 보유 라이선스 모델
```

### EC2 인스턴스 유형·구매 옵션·Auto Scaling (`ec2-autoscaling`)

```text
  EC2
■ AMI와 시작 템플릿
│ EC2 Image Builder
■ EC2 인스턴스 유형과 제품군   ← 새 개념
│ 메모리 최적화 인스턴스 제품군   ← 새로 딸림
│ GPU 인스턴스 제품군과 컴퓨팅 서비스 선택   ← 새로 딸림
│ 향상된 네트워킹   ← 새로 딸림
■ EC2 구매 옵션
│ 표준 예약 인스턴스와 전환 가능 예약 인스턴스
│ 스팟에 올릴 수 있는 워크로드
■ EC2 Auto Scaling
│ 예약된 조정과 대상 추적의 갈림길
│ 대상 추적과 단순 조정의 갈림길
│ 예측 스케일링
│ 스팟 할당 전략
│ Auto Scaling 그룹의 인스턴스 유형 재정의
│ Auto Scaling 그룹의 온디맨드 기반 용량
│ Auto Scaling 웜 풀
│ 용량을 1로 고정한 오토 스케일링 그룹의 인스턴스 교체
│ 로드 밸런서 상태 검사와 인스턴스 교체
  AWS ParallelCluster
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
■ 재해 복구 전략   ← 새 개념
│ 백업 및 복원   ← 새로 딸림
│ 짧은 RTO가 요구하는 대기 리전 구성   ← 새로 딸림
  AWS Elastic Disaster Recovery(AWS DRS)
```

### IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer (`iam-permissions`)

```text
  IAM (Identity And Access Management)
■ IAM 사용자
│ IAM 그룹에 붙이는 정책
│ 사용자 집합인 IAM 그룹
│ 계정 안에서만 존재하는 IAM 사용자
■ IAM 역할
│ IAM 인스턴스 프로파일
│ IAM Roles Anywhere
│ 계정 간 IAM 역할과 신뢰 정책
■ IAM 정책   ← 새 개념
│ 최소 권한 원칙 (Least Privilege)   ← 새로 딸림
│ 속성 기반 액세스 제어(ABAC)   ← 새로 딸림
│ 권한 경계   ← 새로 딸림
│ 정책 평가 순서와 명시적 거부   ← 새로 딸림
│ NotAction을 쓴 Deny 문   ← 새로 딸림
│ aws:RequestedRegion 조건 키   ← 새로 딸림
■ IAM Access Analyzer
│ Access Analyzer의 위임 관리자 계정
  Network Access Analyzer
■ 루트 사용자   ← 새 개념
│ 루트 사용자에 여러 개 등록하는 MFA 장치   ← 새로 딸림
│ 비활성화할 수 없는 루트 사용자   ← 새로 딸림
```

### Systems Manager·AppConfig·EC2 Instance Connect (`systems-manager`)

```text
■ AWS Systems Manager   ← 새 개념
│ Systems Manager Run Command   ← 새로 딸림
│ Systems Manager Session Manager   ← 새로 딸림
│ Systems Manager Patch Manager   ← 새로 딸림
│ 관리형 인스턴스를 만드는 정책   ← 새로 딸림
│ Systems Manager Inventory   ← 새로 딸림
  EC2 Instance Connect 엔드포인트
  AWS AppConfig
```
