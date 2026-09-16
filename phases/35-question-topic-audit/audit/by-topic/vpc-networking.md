# VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링

`vpc-networking` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 22개 · keep 22 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 22 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q100 | vpc-subnet | keep | — | yes | (현재) | (현재) | false | 서브넷은 큰 VPC 네트워크를 더 작은 네트워크 단위로 나눈 구획이다. |
| q101 | internet-gateway | keep | — | yes | (현재) | (현재) | false | 인터넷 게이트웨이는 VPC와 외부 인터넷 사이에 양방향 통신 경로를 마련한다. |
| q102 | nat-gateway | keep | — | yes | (현재) | (현재) | false | NAT 게이트웨이는 프라이빗 서브넷에서 인터넷으로 시작하는 통신을 허용하면서 외부에서 시작하는 접근은 막는다. |
| q103 | nat-gateway | keep | — | yes | (현재) | (현재) | false | 프라이빗 서브넷의 인터넷 통신을 위한 NAT 게이트웨이는 퍼블릭 서브넷에 배치한다. |
| q104 | vpc-endpoint | keep | — | yes | (현재) | (현재) | false | S3와 DynamoDB에 인터넷 없이 함께 접근하는 VPC 엔드포인트 유형은 게이트웨이 엔드포인트다. |
| q105 | vpc-endpoint | keep | — | yes | (현재) | (현재) | false | 게이트웨이 엔드포인트의 연결 대상인 S3와 DynamoDB 이외의 AWS 서비스에 인터넷 없이 접근할 때는 인터페이스 엔드포인트를 쓴다. |
| q106 | privatelink | keep | — | yes | (현재) | (현재) | false | PrivateLink는 인터넷을 거치지 않고 다른 VPC의 특정 애플리케이션에 접속하게 한다. |
| q107 | vpc-peering | keep | — | yes | (현재) | (현재) | false | VPC 피어링은 서로 다른 VPC 두 개를 인터넷 없이 사설 네트워크로 직접 연결한다. |
| q108 | comparison | keep | — | yes | (현재) | (현재) | false | VPC 네트워킹 기능을 연결 대상으로 구분할 때 인터넷 없이 AWS 서비스에 닿는 기능은 VPC Endpoint다. |
| q209 | endpoint-pricing | keep | — | yes | (현재) | (현재) | false | S3의 비공개 접근에서 엔드포인트 시간당 요금을 피하려면 유료 인터페이스 유형 대신 무료 게이트웨이 엔드포인트를 고른다. |
| q210 | egress-only-igw | keep | — | yes | (현재) | (현재) | false | Egress-only 인터넷 게이트웨이가 아웃바운드 통신을 제공하는 IP 버전은 IPv6다. |
| q211 | nat-instance | keep | — | yes | (현재) | (현재) | false | 포화된 NAT 인스턴스를 거치는 S3 트래픽은 게이트웨이 엔드포인트로 우회시켜 해당 병목을 제거할 수 있다. |
| q212 | vpc-peering-scaling-limit | keep | — | yes | (현재) | (현재) | false | 수백 개 VPC를 연결할 때는 1:1 피어링의 연결 수 증가를 피하려고 Transit Gateway로 연결을 모은다. |
| q213 | s3-is-regional | keep | — | yes | (현재) | (현재) | false | S3는 VPC나 서브넷에 놓이지 않으므로 보안 그룹·서브넷 NACL 대신 버킷 정책으로 접근을 제어한다. |
| q586 | vpc-flow-logs | keep | — | yes | (현재) | (현재) | false | 네트워크 인터페이스를 지나는 트래픽의 출발지·목적지·포트·허용 여부는 CloudTrail이 아니라 VPC 플로우 로그에 기록된다. |
| q587 | nat-gateway-traffic-uses-public-endpoints | keep | — | yes | (현재) | (현재) | false | NAT 경로는 AWS 서비스의 공용 엔드포인트를 사용하므로 공용 주소를 피하려면 사설 주소를 제공하는 인터페이스 엔드포인트로 바꿔야 한다. |
| q588 | privatelink-endpoint-service | keep | — | yes | (현재) | (현재) | false | 애플리케이션을 PrivateLink 엔드포인트 서비스로 게시하면 다른 계정의 VPC가 엔드포인트로 접속하고 라우팅 테이블 변경 없이 접근 범위를 좁힐 수 있다. |
| q589 | nat-gateway-per-az | keep | — | yes | (현재) | (현재) | false | NAT 게이트웨이는 가용 영역에 묶이므로 장애를 다른 영역으로 전파하지 않으려면 영역마다 배치하고 각 프라이빗 서브넷을 자기 영역의 NAT로 라우팅한다. |
| q590 | internet-gateway-is-not-per-az | keep | — | yes | (현재) | (현재) | false | 인터넷 게이트웨이는 가용 영역별 리소스가 아니라 리전 수준에서 VPC에 연결하는 리소스라 영역마다 늘리지 않는다. |
| q591 | nat-gateway-count-by-environment | keep | — | yes | (현재) | (현재) | false | 고가용성이 필요 없는 환경은 NAT 게이트웨이를 하나로 줄이고 프라이빗 서브넷의 기본 경로를 모아 게이트웨이별 시간당 비용을 아낄 수 있다. |
| q592 | nat-gateway-elastic-ip | keep | — | yes | (현재) | (현재) | false | 인터넷용 NAT 게이트웨이를 만들 때 엘라스틱 IP를 연결하고 프라이빗 서브넷의 기본 경로가 그 NAT 게이트웨이를 향하게 해야 한다. |
| q593 | vpc-endpoint-policy | keep | — | yes | (현재) | (현재) | false | VPC 엔드포인트 정책은 인터넷 없는 접근 경로에서 허용할 역할과 버킷을 좁혀 역할 기반 접근을 구성한다. |
