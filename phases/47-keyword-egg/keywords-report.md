# phase 47 step 0 — 키워드 추출 보고서

평문 `docs/source/keywords-raw.json`(gitignore 대상, 커밋하지 않는다)을 만든 결과다. 이 파일은 공개되므로 요약 문장은 적지 않는다(ADR-040).

## 개수

- 키워드 **107개**, 단원 **22개**.
- `✅` 제목 97개: 키워드 80 · 하위 항목으로 풂 6(하위 키워드 27개) · 합침 8 · 뺌 3.
- 뺀 하위 항목은 없다. 요약이 같은 쌍은 모두 같은 단원의 원문 구절로 구분했다(아래).

| 단원 | 키워드 수 |
|---|---|
| [간단 요약] EC2, RDS, S3, Route53, ELB, CloudFront, Lambda | 8 |
| [간단 요약] 리전, 가용성, 가용 영역, 다중 AZ, 단일 AZ | 5 |
| [간단 요약] 온프레미스, 마이그레이션 | 2 |
| S3 스토리지 클래스 유형 | 7 |
| S3 버전 관리, 객체 잠금, 수명 주기 정책 | 3 |
| S3 암호화 - SSE, S3 Batch Operations | 5 |
| EBS, EFS, FSx, 인스턴스 스토어 | 4 |
| DataSync, Snowball Edge, Transfer Family, Storage Gateway | 4 |
| RDS, 스토리지 유형, 기능 | 8 |
| Aurora, DynamoDB, ElastiCache | 3 |
| EC2, ELB, Global Accelerator, CloudFront | 1 |
| ECS, Lambda, Step Functions, API Gateway | 3 |
| SQS, SNS, EventBridge, Backup | 4 |
| VPC, 서브넷, 인터넷 게이트웨이, NAT 게이트웨이, VPC Endpoint, PrivateLink, VPC 피어링 | 7 |
| Site-to-Site VPN, Direct Connect, Transit Gateway | 3 |
| Route53 | 8 |
| EMR, Spark, RedShift, Athena, Kinesis, Glue, X-Ray, CloudWatch | 11 |
| 보안그룹, NACL | 2 |
| Secrets Manager, System Manager Parameter Store, KMS, ACM | 4 |
| WAF, Shield, GuardDuty, Macie, CloudFront | 4 |
| IAM, Identity Center, STS, Cognito, CloudTrail | 6 |
| 절약 플랜, Budgets, Cost Explorer, Billing and Cost Management, Trusted Advisor | 5 |

## `✅` 제목 처리 결과 (97개)

| PDF 쪽 | ✅ 제목 | 처리 | 만든 키워드 id 또는 합친 대상 |
|---|---|---|---|
| 1 | EC2 (Elastic Compute Cloud) 란 ? | 키워드 | kw-001 |
| 1 | RDS (Relational Database Service) 란 ? | 키워드 | kw-002 |
| 1 | S3 (Simple Storage Service) 란 ? | 키워드 | kw-003 |
| 1 | Route 53 이란 ? | 키워드 | kw-004 |
| 1 | DNS (Domain Name System) 란 ? | 키워드 | kw-005 |
| 2 | ELB (Elastic Load Balancer) 란 ? | 키워드 | kw-006 |
| 3 | CloudFront 란 ? | 키워드 | kw-007 |
| 4 | Lambda 란 ? | 키워드 | kw-008 |
| 5 | 리전 (Region) 이란 ? | 키워드 | kw-009 |
| 5 | 가용성 (Availability) | 키워드 | kw-010 |
| 5 | 가용 영역 (Availability Zone) 이란 ? | 키워드 | kw-011 |
| 6 | 다중 AZ (Multi-AZ) 란 ? | 키워드 | kw-012 |
| 6 | 단일 AZ (Single-AZ) 란 ? | 키워드 | kw-013 |
| 7 | 온프레미스 (On-premise) | 키워드 | kw-014 |
| 7 | 마이그레이션 (Migration) | 키워드 | kw-015 |
| 8 | S3 스토리지 클래스 유형 | 하위 항목으로 풂 | kw-016 S3 Standard, kw-017 S3 Intelligent-Tiering, kw-018 S3 Standard-IA (Infrequent Access), kw-019 S3 One Zone-IA, kw-020 S3 Glacier Instant Retrieval, kw-021 S3 Glacier Flexible Retrieval, kw-022 S3 Glacier Deep Archive |
| 10 | S3 버전 관리 | 키워드 | kw-023 |
| 10 | S3 객체 잠금 | 키워드 | kw-024 |
| 11 | S3 수명 주기 정책 | 키워드 | kw-025 |
| 13 | SSE (Server Side Encryption) | 키워드 | kw-026 |
| 13 | SSE 종류 | 하위 항목으로 풂 | kw-027 SSE-S3, kw-028 SSE-KMS, kw-029 SSE-C |
| 13 | S3 Batch Operations 란 ? | 키워드 | kw-030 |
| 14 | EBS (Elastic Block Store) | 키워드 | kw-031 |
| 14 | EFS (Elastic File System) | 키워드 | kw-032 |
| 15 | 인스턴스 스토어 (Instance Store) | 키워드 | kw-033 |
| 15 | FSx (File System for Extended use) | 키워드 | kw-034 |
| 16 | DataSync | 키워드 | kw-035 |
| 17 | Snowball Edge | 키워드 | kw-036 |
| 17 | Transfer Family | 키워드 | kw-037 |
| 18 | Storage Gateway | 키워드 | kw-038 |
| 19 | RDS란 ? | 합침 | kw-002에 합침 |
| 19 | RDS 스토리지 유형 | 하위 항목으로 풂 | kw-039 범용 SSD 스토리지 (gp3, gp2), kw-040 프로비저닝된 IOPS SSD |
| 19 | 기능 | 하위 항목으로 풂 | kw-041 Multi AZ 배포 (다중 AZ 배포), kw-042 Multi AZ DB Cluster (다중 AZ 클러스터 배포), kw-043 Read Replica (읽기 전용 복제본), kw-044 Cross Region Read Replica (리전 간 읽기 전용 복제본), kw-045 RDS Proxy (프록시), kw-046 RDS Blue/Green Deployment (블루/그린 배포) |
| 21 | Aurora | 키워드 | kw-047 |
| 21 | DynamoDB | 키워드 | kw-048 |
| 21 | ElastiCache | 키워드 | kw-049 |
| 22 | EC2 | 합침 | kw-001에 합침 |
| 22 | ELB | 합침 | kw-006에 합침 |
| 23 | CloudFront | 합침 | kw-007에 합침 |
| 24 | Global Accelerator | 키워드 | kw-050 |
| 25 | ECS | 키워드 | kw-051 |
| 25 | Lambda | 합침 | kw-008에 합침 |
| 25 | Step Functions | 키워드 | kw-052 |
| 25 | API Gateway | 키워드 | kw-053 |
| 27 | SQS (Simple Queue Service) | 키워드 | kw-054 |
| 27 | SNS (Simple Notification Service) | 키워드 | kw-055 |
| 28 | EventBridge | 키워드 | kw-056 |
| 29 | Backup | 키워드 | kw-057 |
| 30 | VPC, 서브넷 | 하위 항목으로 풂 | kw-058 VPC, kw-059 서브넷 |
| 30 | 인터넷 게이트웨이 | 키워드 | kw-060 |
| 31 | NAT 게이트웨이 | 키워드 | kw-061 |
| 32 | VPC Endpoint | 키워드 | kw-062 |
| 33 | PrivateLink | 키워드 | kw-063 |
| 33 | VPC 피어링 | 키워드 | kw-064 |
| 33 | NAT Gateway vs VPC Endpoint vs PrivateLink vs VPC 피어링 | 뺌 | — |
| 34 | Site-to-Site VPN | 키워드 | kw-065 |
| 34 | Direct Connect | 키워드 | kw-066 |
| 34 | Site-to-Site VPN vs Direct Connect | 뺌 | — |
| 35 | Transit Gateway | 키워드 | kw-067 |
| 36 | Route53 | 합침 | kw-004에 합침 |
| 36 | Route53 라우팅 정책 | 하위 항목으로 풂 | kw-068 단순 라우팅 (Simple Routing), kw-069 지리적 위치 라우팅 (Geolocation Routing), kw-070 지리적 근접 라우팅 (Geoproximity Routing), kw-071 다중값 응답 라우팅 (Multi-value Answer Routing), kw-072 가중치 기반 라우팅 (Weighted Routing), kw-073 지연시간 기반 라우팅 (Latency-based Routing), kw-074 IP 기반 라우팅 (IP-based Routing) |
| 36 | Route53 Resolver | 키워드 | kw-075 |
| 38 | EMR (Elastic MapReduce) | 키워드 | kw-076 |
| 38 | Spark | 키워드 | kw-077 |
| 38 | RedShift | 키워드 | kw-078 |
| 38 | Athena | 키워드 | kw-079 |
| 38 | Performance Insight | 키워드 | kw-080 |
| 38 | CloudWatch | 키워드 | kw-081 |
| 38 | Glue | 키워드 | kw-082 |
| 39 | X-Ray | 키워드 | kw-083 |
| 39 | Data Firehose | 키워드 | kw-084 |
| 39 | Kinesis Data Streams | 키워드 | kw-085 |
| 39 | Managed Service for Apache Flink | 키워드 | kw-086 |
| 39 | Data Firehose (뒤 줄: vs Kinesis Data Streams vs Managed Service for Apache Flink) | 합침 | kw-084에 합침 |
| 41 | 보안 그룹 (Security Group) | 키워드 | kw-087 |
| 42 | NACL (Network Access Control List, 네트워크 ACL) | 키워드 | kw-088 |
| 44 | Secrets Manager | 키워드 | kw-089 |
| 44 | System Manager Parameter Store | 키워드 | kw-090 |
| 44 | Secrets Manager vs System Manager Parameter Store | 뺌 | — |
| 44 | KMS (Key Management Service) | 키워드 | kw-091 |
| 44 | ACM (AWS Certificate Manager) | 키워드 | kw-092 |
| 45 | WAF (Web Application Firewall) | 키워드 | kw-093 |
| 45 | Shield | 키워드 | kw-094 |
| 45 | GuardDuty | 키워드 | kw-095 |
| 46 | Macie | 키워드 | kw-096 |
| 46 | CloudFront | 합침 | kw-007에 합침 |
| 48 | IAM (Identity And Access Management) | 키워드 | kw-097 |
| 48 | Identity Center | 키워드 | kw-098 |
| 49 | STS (Security Token Service) | 키워드 | kw-099 |
| 49 | Cognito | 키워드 | kw-100 |
| 49 | CloudTrail | 키워드 | kw-101 |
| 49 | AWS Config | 키워드 | kw-102 |
| 50 | 절약 플랜 (Savings Plan) | 키워드 | kw-103 |
| 50 | AWS Budgets | 키워드 | kw-104 |
| 50 | Cost Explorer | 키워드 | kw-105 |
| 50 | Billing and Cost Management | 키워드 | kw-106 |
| 50 | Trusted Advisor | 키워드 | kw-107 |

## 판단이 필요했던 곳

### 요약이 같아 구분한 쌍
- `S3 Standard-IA`와 `S3 Glacier Instant Retrieval` — 이름 뒤의 설명이 한 글자도 다르지 않다. 같은 단원의 `[Glacier]` 단락에서 두 문장(Glacier 클래스의 용도, 그 용도가 아닐 때 Standard-IA를 쓴다는 것)을 각각 괄호로 덧붙여 갈랐다. Glacier Instant Retrieval 쪽 구절의 `Glacier`는 키워드 이름의 일부라 `○○`로 가렸다.
- `Secrets Manager`와 `System Manager Parameter Store` — 정의 문장이 같다. 같은 단원의 `vs` 비교 단락에서 각자의 주용도 구절을 괄호로 덧붙여 갈랐다. 원문의 `Systems Manager`·오탈자 표기도 키워드 이름이므로 `○○`로 가렸다.

### 합침
- EC2·RDS·ELB·Lambda·Route 53 — 1쪽의 `💡 한 줄 요약`에서 요약을 가져왔고 `section`·`page`도 그쪽을 따른다. `RDS란 ?`(19쪽), `Route53`(36쪽)은 표기가 달라도 같은 키워드로 봤다.
- CloudFront(3·23·46쪽) — 3쪽에만 `💡 한 줄 요약`이 있어 그쪽을 쓴다.
- Data Firehose(39쪽 두 번째) — 추출본에서는 `✅ Data Firehose` 한 줄로 보이지만 뒤 줄이 `vs Kinesis Data Streams vs Managed Service for Apache Flink`로 이어지는 비교 제목이다. step 문서가 이것을 중복으로 셌으므로 합침으로 적었고, 새 키워드는 만들지 않았다(뺌과 결과가 같다).

### 키워드인지·어떻게 풀지 애매했던 제목
- `VPC, 서브넷` — 한 제목에 두 키워드가 각자의 정의 문장과 함께 있어 묶음 제목으로 보고 `VPC`와 `서브넷`으로 풀었다.
- `기능`(19쪽) — RDS 단원의 묶음 제목이다. 번호 붙은 여섯 항목을 각각 키워드로 만들었다.
- `SSE (Server Side Encryption)`과 `SSE 종류` — 앞의 것은 정의가 있는 키워드, 뒤의 것은 묶음 제목이라 따로 처리했다. `SSE 종류` 아래의 `AWS KMS : …` 줄과 `S3 Bucket Key` 설명은 SSE-KMS의 부연이라 하위 항목으로 만들지 않았다. KMS는 44쪽 `✅ KMS`에서 키워드가 된다.
- 키워드 제목 아래의 유형·기능 목록(ELB의 ALB·NLB·GLB, EC2 요금 유형, ECS·API Gateway·SQS·Storage Gateway·FSx·VPC 엔드포인트 유형, Aurora·DynamoDB·WAF·CloudFront·IAM·Identity Center 기능, 절약 플랜 유형, Route53 Resolver 엔드포인트, S3 객체 잠금의 보존 모드 등)은 묶음 제목이 아니라 키워드 제목의 본문이므로 풀지 않았다. 범위는 `✅` 제목과 묶음 제목의 하위 항목이다.

### 요약 고르기가 애매했던 곳
- DNS — `💡 한 줄 요약`이 없고, 정의가 2쪽 본문의 연달은 두 문장에 걸쳐 있다. 두 문장을 쓰되 앞 문맥을 받는 첫 머리 구절만 뗐다.
- 가용 영역 — 정의 문장이 앞 문장("이와 같이")을 받으므로 두 문장을 함께 썼다. 약어 `AZ`도 이 키워드의 이름이라 가렸다.
- VPC 피어링 — 원문의 `(Peering)`은 키워드 이름의 영문이라 함께 가렸다.
- Transit Gateway — 원문의 `(전송 게이트웨이)`는 키워드 이름의 한국어라 함께 가렸다.
- RDS Blue/Green Deployment — 정의가 20쪽에 있어 `page`를 20으로 적었다.
- 하위 항목(S3 스토리지 클래스, SSE 종류, RDS 스토리지 유형, 라우팅 정책)은 이름 뒤의 설명을 그대로 썼다. RDS `기능`의 여섯 항목은 이름 뒤에 설명이 없어 바로 아래 첫 줄을 썼다.
- 원문의 오탈자(`Conenct`, `Privary` 등)는 추출 아티팩트가 아니라 원문이므로 고치지 않았다. 키워드 이름에 있는 오탈자는 가려져 보이지 않는다.
- `section`은 `concepts-raw.md`의 단원 제목을 따랐고, 추출 아티팩트 `X -\nRay`만 `X-Ray`로 붙였다.
