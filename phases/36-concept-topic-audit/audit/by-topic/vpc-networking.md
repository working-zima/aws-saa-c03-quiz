# VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링

`vpc-networking` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 20개 · keep 20 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 16 · false 4 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 20 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | vpc-subnet | AWS 안의 가상 네트워크를 더 작은 서브넷으로 나누고, 외부에서 접근할 수 있는지에 따라 퍼블릭 서브넷과 프라이빗 서브넷으로 구분하는 기본 구조를 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | internet-gateway | VPC는 기본적으로 인터넷과 분리되어 있어 인터넷 게이트웨이를 연결해야 서브넷이 외부와 양방향으로 통신하는 퍼블릭 서브넷이 된다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | egress-only-igw | 밖으로만 나가는 통신을 IPv4에서는 NAT 게이트웨이가, IPv6에서는 Egress-only 인터넷 게이트웨이가 맡으므로 주소 체계에 따라 출구를 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | nat-gateway | NAT 게이트웨이는 프라이빗 서브넷에서 인터넷으로 나가는 통신만 허용하고 밖에서 시작하는 접근은 막으며, 그 자신은 퍼블릭 서브넷에 배치한다는 것을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 5 | nat-gateway-per-az | NAT 게이트웨이는 놓인 가용 영역에 묶이므로 고가용성이 필요하면 가용 영역마다 하나씩 두고, 각 영역의 프라이빗 서브넷이 자기 영역의 게이트웨이로 나가도록 라우팅해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | internet-gateway-is-not-per-az | 인터넷 게이트웨이는 가용 영역이 아니라 리전 수준 리소스라서, NAT 게이트웨이처럼 가용 영역마다 늘려도 가용성이 올라가지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | nat-gateway-count-by-environment | NAT 게이트웨이를 가용 영역마다 두는 규칙은 고가용성이 필요할 때만 성립하므로, 요구가 없는 환경에서는 하나로 줄여 시간당 요금을 아끼는 대신 영역 장애 위험을 받아들일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | nat-gateway-elastic-ip | NAT 게이트웨이는 엘라스틱 IP를 붙여야 출구가 만들어지고, 프라이빗 서브넷의 기본 경로는 NAT 게이트웨이로, 퍼블릭 서브넷의 기본 경로는 인터넷 게이트웨이로 잡아야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | vpc-endpoint | VPC 엔드포인트는 인터넷을 거치지 않고 AWS 서비스에 닿는 경로이며, 게이트웨이 유형은 S3와 DynamoDB만 덮고 인터페이스 유형은 나머지 서비스와 S3에 닿는다는 유형별 연결 대상을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 10 | endpoint-pricing | 게이트웨이 엔드포인트는 무료이고 인터페이스 엔드포인트는 시간당 요금이 붙으므로, S3만 비용 효율적으로 연결할 때는 게이트웨이를, 접근할 서비스가 여러 종류로 넓어지면 인터페이스를 고르는 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | vpc-endpoint-policy | VPC 엔드포인트에 정책을 붙이면 그 경로로 어떤 주체가 어떤 리소스에 닿을지 좁혀, 서브넷 대역 허용이나 공인 IP 경유보다 좁은 최소 권한을 엔드포인트 단위로 적용할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | s3-is-regional | S3는 VPC나 서브넷 안에 만드는 리소스가 아니어서 보안 그룹을 붙이거나 VPC로 옮길 수 없고, VPC에서의 사설 경로는 엔드포인트가, S3의 접근 제어는 버킷 정책이 맡는다는 경계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | nat-gateway-traffic-uses-public-endpoints | NAT 게이트웨이를 거친 AWS 서비스 호출은 그 서비스의 공용 엔드포인트로 나가므로, 공용 IP를 쓰지 않아야 한다는 요구에는 인터페이스 엔드포인트가 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | nat-instance | 직접 운영하는 NAT 인스턴스는 인스턴스 사양에 묶여 트래픽이 몰리면 병목이 되며, 엔드포인트로 우회할 수 있는 대상은 NAT를 키우기보다 게이트웨이 엔드포인트로 빼는 편이 낫다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | vpc-peering | 서로 다른 두 VPC를 인터넷을 거치지 않는 사설 경로로 직접 이어 통신하게 하는 연결 방식의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 16 | vpc-peering-scaling-limit | VPC 피어링은 두 VPC를 일대일로 잇기 때문에 VPC가 많아지면 연결 수가 급증해 허브 방식이 필요하고, 반대로 VPC끼리 통신하면 안 되는 조건에는 피어링 자체가 맞지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | privatelink | 인터넷을 거치지 않고 한 VPC의 사용자를 다른 VPC에 있는 특정 애플리케이션에 사설로 연결하는 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 18 | privatelink-endpoint-service | 애플리케이션을 엔드포인트 서비스로 게시하면 여러 계정·VPC가 라우팅 테이블을 바꾸지 않고 사설로 접속하며, 엔드포인트 정책으로 애플리케이션 단위의 세분화된 접근 제어를 할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | comparison | VPC 밖과 통신하는 기능은 목적지가 인터넷인지·AWS 서비스인지·다른 VPC의 애플리케이션인지·VPC 전체인지로 갈리므로, 연결 대상을 먼저 확인해 기능을 골라야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 20 | vpc-flow-logs | VPC 플로우 로그가 기록하는 트래픽 메타데이터와 API 호출 기록의 차이를 이해하고 네트워크 통신을 확인할 기록을 구분한다. | keep | — | true | (현재) | — | 1 | ① |
