# 시험 문제 출제 유형 — 강조 기준 (ADR-051)

> 원본: JSCODE 노션 페이지 「시험 문제 출제 유형」(SAA-C03 족보 유형 정리), https://jscode.notion.site/2d211062ff0780c08fb0fca6290bd1be
> 확인한 날: 2026-10-23.
>
> **이 파일은 사실의 출처가 아니다.** 앱이 **무엇을 강조할지** 고르는 기준으로만 쓴다 — 주제 별점, 개념 본문의 굵은 글씨, 「A vs B」 제목.
> 강조한 문장의 사실은 여전히 CLAUDE.md 「원본 데이터」의 세 파일과 덤프 보충 개념에서 온다. 여기 적힌 서비스 동작을 근거로 개념 본문을 쓰지 마라.
>
> 원문은 옮기지 않는다(ADR-009). 아래는 페이지를 읽고 직접 쓴 정리다. 페이지가 매긴 문항 번호는 페이지 자체의 족보 번호라
> `dump-gaps/`의 880문항 번호와 맞지 않는다(예: 노션 Q9는 RDS 고가용성, 덤프 Q009는 SQS 배치). 그래서 번호는 옮기지 않고 개수만 적는다.
> 개수는 페이지가 취소선으로 지운 문항(지엽적·중복·애매)을 뺀 것이다.

## 1. 출제 유형 (6영역 25유형)

| 영역 | 유형 | 핵심으로 짚은 대비 | 문항 |
|---|---|---|---|
| 스토리지 | S3 비용 최적화·수명 주기 | Standard-IA·Intelligent-Tiering·Glacier(Deep Archive)를 고르는 기준 | 8 |
| 스토리지 | S3 데이터 보호(WORM·암호화) | 객체 잠금의 규정 준수 모드 vs 거버넌스 모드, KMS 암호화, 버킷 정책 | 11 |
| 스토리지 | FSx 계열 | Windows용, HPC용 Lustre, NetApp에서 옮겨 오는 ONTAP | 6 |
| 스토리지 | EBS·EFS 관리 | EBS 볼륨 유형 바꾸기, EFS의 리전·계정 간 접근 | 8 |
| 스토리지 | 하이브리드 스토리지·마이그레이션 | Storage Gateway(파일·볼륨·테이프), DataSync | 5 |
| 스토리지 | 파일 전송 프로토콜 | 기존 SFTP 서버를 Transfer Family와 S3로 옮기기 | 4 |
| 데이터베이스 | RDS 고가용성·읽기 확장 | 장애 조치는 다중 AZ, 읽기 분산은 읽기 전용 복제본 | 10 |
| 데이터베이스 | 연결 관리 | 연결이 많은 Lambda 앞의 RDS Proxy(연결 풀링, 장애 조치 단축) | 4 |
| 데이터베이스 | 자격 증명 보안 | 코드에 넣은 암호 대신 Secrets Manager의 자동 교체 | 4 |
| 데이터베이스 | NoSQL·캐싱 | DynamoDB 응답 시간·세션 저장, DAX, ElastiCache Redis vs Memcached | 7 |
| 데이터베이스 | DB 마이그레이션 | 엔진이 다른 DB 사이의 DMS·SCT | 0 |
| 컴퓨팅 | Auto Scaling·로드 밸런싱 | ALB(7계층·경로·스티키 세션) vs NLB(4계층·고정 IP·초저지연), 조정 정책 | 9 |
| 컴퓨팅 | 컨테이너 | Fargate vs EC2 시작 유형, ECR 이미지 스캔 | 2 |
| 컴퓨팅 | 서버리스 | 이벤트 기반 처리, 프로비저닝된 동시성(콜드 스타트), S3 트리거 | 7 |
| 컴퓨팅 | HPC·배치 | EFA와 클러스터 배치 그룹, AWS Batch | 7 |
| 컴퓨팅 | 메시지 대기열 | FIFO(순서) vs 표준(처리량), 가시성 타임아웃, DLQ | 10 |
| 네트워킹 | 프라이빗 연결 | 게이트웨이 엔드포인트 vs 인터페이스 엔드포인트, PrivateLink | 13 |
| 네트워킹 | 하이브리드 연결 | Site-to-Site VPN(빠른 구축·인터넷) vs Direct Connect(전용선·안정), DX 게이트웨이 + Transit Gateway | 13 |
| 네트워킹 | DNS·트래픽 라우팅 | 라우팅 정책(지연 시간·지리적 위치·가중치), 하이브리드 DNS(Resolver) | 8 |
| 네트워킹 | 엣지 보안 | DDoS 방어, WAF의 SQL 주입 차단, 지리적 차단, 서명된 URL | 13 |
| 네트워킹 | 네트워크 허브 | 피어링 대신 Transit Gateway를 중앙 허브로 | 6 |
| 통합·메시징 | 이벤트 라우팅 | EventBridge(SaaS 연동·규칙 라우팅·스케줄) vs SNS(팬아웃·알림 발송) | 13 |
| 통합·메시징 | 데이터 스트리밍 | Kinesis Data Streams(실시간 수집) vs Data Firehose(목적지 적재) | 6 |
| 관리·거버넌스 | 멀티 계정 | Organizations의 SCP, Control Tower의 계정 자동 구성 | 8 |
| 관리·거버넌스 | 비용 관리 | 컴퓨팅 절약 플랜 vs EC2 인스턴스 절약 플랜, 비용 할당 태그 | 11 |
| 관리·거버넌스 | 자격 증명·접근 | Identity Center(SSO), 온프레미스 AD 연동, 계정 간 역할 | 18 |

유형은 25이고 표의 행은 26이다. FSx와 EBS·EFS는 페이지에서 한 항목 안에 둘로 나뉘어 있어 두 행으로 적었다.

## 2. 반드시 익힐 서비스의 우선순위

| 순위 | 페이지의 설명 | 서비스와 하위 항목 |
|---|---|---|
| 1순위 | 무조건 나온다 | EC2(Auto Scaling, ALB vs NLB, 스팟·온디맨드·예약) · VPC(퍼블릭·프라이빗 서브넷, NAT 게이트웨이 vs NAT 인스턴스, 보안 그룹 vs NACL) · S3(스토리지 클래스, 수명 주기, 버전 관리, 정적 웹 호스팅) · RDS·Aurora(다중 AZ vs 읽기 전용 복제본, 백업과 스냅샷) · IAM(역할 vs 사용자, AssumeRole, 최소 권한) |
| 2순위 | 문제 절반 이상에 걸린다 | ELB(ALB의 HTTP·경로, NLB의 TCP·UDP) · CloudFront(CDN, S3·ALB 오리진) · Route 53(라우팅 정책, 상태 검사) · SQS·SNS(비동기, 결합 끊기) · Lambda(서버리스) |
| 3순위 | 나오면 점수를 얻기 쉽다 | EFS vs EBS · Storage Gateway · Snowball · ElastiCache(Redis·Memcached) · AWS Backup |

## 3. 앱에 쓴 방식 (ADR-051)

- **별점**: 2절 1·2순위의 하위 항목을 담은 주제만 ★★★, 나머지는 ★★☆, 기초 주제는 별점 없음.
- **굵은 글씨**: 1절 「핵심으로 짚은 대비」와 2절 하위 항목이 가리키는 판단 문장을 개념 본문에서 찾아 굵게 했다. 글자는 바꾸지 않았다.
- **「A vs B」**: 1·2절의 vs 짝을 포함해, 두 대안을 견주는 개념의 제목을 앱 전체에서 「A vs B」 꼴로 맞췄다. 앱에 전용 자리가 없던 짝 넷
  (다중 AZ vs 읽기 전용 복제본, EFS vs EBS, EventBridge vs SNS, 컴퓨팅 vs EC2 인스턴스 절약 플랜)은 개념과 문항을 새로 세웠다.
- **넣지 않은 것**: 1절 「네트워크 허브」의 Transit Gateway 멀티캐스트는 앱에 없고, 사용자가 넣지 않기로 했다.
