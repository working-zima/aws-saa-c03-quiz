# Site-to-Site VPN·Direct Connect·Transit Gateway

`hybrid-connectivity` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 19개 · keep 18 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 12 · false 7 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 18 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | site-to-site-vpn | Site-to-Site VPN은 인터넷 위에 암호화 터널을 만들어 개별 사용자가 아니라 두 사이트의 네트워크를 서로 잇는 연결이라는 것을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | access-terms | Customer Gateway는 Site-to-Site VPN의 고객 측 종단이고 Bastion Host는 프라이빗 서브넷의 서버로 들어가는 중간 서버라서, 둘 다 요구된 연결 경로 자체를 만드는 수단이 아님을 이해한다. | ambiguous | — | false | (현재) | — | 1 | hold |
| 3 | client-vpn | 개별 사용자가 원격에서 VPC에 접속하는 VPN과 네트워크 대 네트워크를 잇는 VPN은 용도가 다르므로, 데이터 센터와 AWS를 잇는 요구에는 사용자용 VPN이 맞지 않음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 4 | transit-gateway | 여러 VPC와 온프레미스 네트워크를 각각 짝지어 잇지 않고 하나의 허브에 붙여 통신하게 하는 연결 방식의 역할을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 5 | transit-gateway-cross-region-peering | Transit Gateway는 리전 안의 허브이므로 여러 리전은 리전마다 둔 Transit Gateway를 피어링해 잇고, 그러면 한 리전에 들어온 온프레미스 경로를 다른 리전도 함께 쓸 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | direct-connect | 인터넷을 거치지 않는 전용선으로 온프레미스와 AWS를 이으면 공유 인터넷 경로와 달리 일정한 대역폭과 성능을 얻는다는 연결 방식의 성격을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 7 | virtual-private-gateway | 가상 프라이빗 게이트웨이는 VPN이나 Direct Connect가 VPC로 들어오는 AWS 쪽 종단으로 VPC 하나에 묶이므로, VPC가 매우 많은 환경에서는 Direct Connect Gateway와 Transit Gateway로 넘어가야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | direct-connect-gateway | 일관된 낮은 지연을 주는 전용선과 수백 개 VPC를 묶는 허브가 함께 요구되면 Direct Connect Gateway로 둘을 연결해 대규모 하이브리드 네트워크를 구성함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | direct-connect-caveats | Direct Connect는 인터넷을 우회할 뿐 트래픽을 암호화하지 않고 물리 회선 설치에 오래 걸리므로, 네트워크 계층 암호화나 빠른 연결이 요구되면 Site-to-Site VPN을 골라야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | direct-connect-resiliency | Direct Connect의 최대 복원력은 회선을 두 줄로 늘리는 것만으로 얻어지지 않으며, 데이터 센터·장비·연결 위치의 장애를 각각 이중화해야 한다는 판단 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | direct-connect-vif-types | Direct Connect 회선에서 무엇에 닿을지는 가상 인터페이스 종류가 정하며, Transit Gateway로 묶인 여러 리전의 VPC에 닿으려면 트랜짓 VIF로 Direct Connect Gateway에 연결해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 12 | vpn-vs-direct-connect | 공유 인터넷의 암호화 터널과 별도 전용선은 구축 시간·비용·속도 일관성을 맞바꾸는 연결 방식이므로 요구에 맞춰 선택해야 함을 이해한다. | keep | — | false | (현재) | — | 3 | ① |
| 13 | onprem-connectivity-heuristic | 온프레미스와 AWS의 통신 요구는 VPN과 Direct Connect에서 출발해 암호화·일관된 성능·연결 시점으로 둘을 고르고 VPC가 여럿이면 허브를 더하며, VPC 사이 연결이나 인터넷 출구 기능으로는 풀리지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | per-vpc-vpn-for-isolation | 한 사무실에서 VPC마다 Site-to-Site VPN을 따로 맺으면 VPC 사이에는 경로가 생기지 않아, 사무실은 양쪽에 닿으면서 VPC끼리는 구조적으로 격리됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | onprem-access-via-interface-endpoint | 인터페이스 엔드포인트의 사설 주소는 Direct Connect나 VPN으로 이어진 온프레미스에서도 쓸 수 있으므로, 온프레미스에서 AWS 서비스로 대량 트래픽을 보낼 때 전용 회선과 엔드포인트를 함께 써 성능과 사설 경로를 모두 얻을 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | data-locality-cost | 온프레미스와 AWS 사이로 데이터를 옮길 때 드는 전송 비용을 줄이려면 큰 중간 데이터는 데이터가 있는 쪽에서 처리하고 작은 결과물만 내보내야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 17 | centralized-onprem-egress | 클라우드의 인터넷 송신을 온프레미스 방화벽으로 모으려면 VPC의 직접 출구 대신 하이브리드 연결을 기본 경로로 삼아야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | region-attached-edge-options | Local Zone·Outposts·Wavelength Zone은 사용자 가까이로 인프라를 넓혀 지연을 줄이지만 리전과의 네트워크 연결 위에서 동작하므로, 연결이 완전히 끊긴 환경의 요구와는 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | outposts-data-residency | 데이터를 클라우드로 옮길 수 없는 상주 요건이 있을 때 Outposts로 AWS 인프라를 시설 안으로 들여와 관리형 서비스를 데이터가 있는 자리에서 실행할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
