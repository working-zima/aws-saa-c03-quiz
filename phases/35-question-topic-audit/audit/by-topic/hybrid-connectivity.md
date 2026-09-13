# Site-to-Site VPN·Direct Connect·Transit Gateway

`hybrid-connectivity` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 24개 · keep 24 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 24 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q109 | site-to-site-vpn | keep | — | yes | (현재) | (현재) | false | Site-to-Site VPN은 인터넷 위에 암호화 터널을 만들어 온프레미스와 AWS의 네트워크를 연결한다. |
| q110 | direct-connect | keep | — | yes | (현재) | (현재) | false | Direct Connect는 공용 인터넷을 통과하지 않는 전용 회선으로 온프레미스와 AWS를 연결한다. |
| q111 | vpn-vs-direct-connect | keep | — | yes | (현재) | (현재) | false | Site-to-Site VPN은 인터넷에 터널을 구성하므로 설정이 쉽고 비용이 낮지만 인터넷 상태에 따라 통신 속도가 일정하지 않을 수 있다. |
| q112 | vpn-vs-direct-connect | keep | — | yes | (현재) | (현재) | false | Direct Connect는 전용 회선을 설치하는 시간과 비용을 들이는 대신 일정한 통신 속도를 제공한다. |
| q113 | transit-gateway | keep | — | yes | (현재) | (현재) | false | Transit Gateway는 여러 VPC와 온프레미스 네트워크를 하나의 연결 허브로 묶는다. |
| q114 | vpn-vs-direct-connect | keep | — | yes | (현재) | (현재) | false | Site-to-Site VPN과 Direct Connect는 사용하는 경로가 달라도 온프레미스와 AWS 네트워크를 연결한다는 목적이 같다. |
| q115 | direct-connect | keep | — | yes | (현재) | (현재) | false | Direct Connect의 보안성·대역폭·성능은 인터넷을 지나지 않는 전용 회선을 통신 기반으로 삼는 데서 나온다. |
| q116 | transit-gateway | keep | — | yes | (현재) | (현재) | false | 여러 VPC와 온프레미스를 함께 연결하는 구성에는 개별 경로를 놓는 VPN·Direct Connect만이 아니라 Transit Gateway 허브가 필요하다. |
| q214 | direct-connect-caveats | keep | — | yes | (현재) | (현재) | false | 전용선 자체로 암호화하지 않고 설치에도 시간이 걸리는 Direct Connect와 달리 Site-to-Site VPN은 인터넷 암호화 터널을 빠르게 구성한다. |
| q215 | direct-connect-gateway | keep | — | yes | (현재) | (현재) | false | Direct Connect의 전용 회선과 Transit Gateway의 다수 VPC 연결을 통합하는 통로는 Direct Connect Gateway다. |
| q216 | client-vpn | keep | — | yes | (현재) | (현재) | false | AWS Client VPN은 사이트 간 네트워크 연결이 아니라 개별 사용자가 자기 장치에서 VPC로 원격 접속하는 서비스다. |
| q217 | access-terms | keep | — | yes | (현재) | (현재) | false | Site-to-Site VPN의 고객 측 연결 종단을 나타내는 구성 요소는 Customer Gateway다. |
| q218 | data-locality-cost | keep | — | yes | (현재) | (현재) | false | 큰 쿼리 중간 결과를 AWS 안에서 시각화하고 작은 최종 결과만 온프레미스로 보내면 Direct Connect를 지나는 데이터량과 전송 비용이 줄어든다. |
| q219 | onprem-connectivity-heuristic | keep | — | yes | (현재) | (현재) | false | 온프레미스 네트워크와 AWS 사이의 연결 방식을 고를 때는 인터넷 암호화 터널인 Site-to-Site VPN과 전용선인 Direct Connect를 먼저 비교한다. |
| q599 | virtual-private-gateway | keep | — | yes | (현재) | (현재) | false | 가상 프라이빗 게이트웨이는 Site-to-Site VPN이 VPC에 들어오는 AWS 쪽 종단이며 VPC에 붙는다. |
| q600 | region-attached-edge-options | keep | — | yes | (현재) | (현재) | false | Local Zone·Outposts·Wavelength Zone은 AWS 리전이나 존과의 네트워크 연결을 전제로 하므로 완전히 단절된 환경에서 독립 실행하는 대안이 아니다. |
| q601 | per-vpc-vpn-for-isolation | keep | — | yes | (현재) | (현재) | false | 사무실에서 VPC마다 VPN을 따로 맺고 사무실로 가는 경로만 두면 사무실은 양쪽에 접속하면서 VPC 사이에는 연결 경로를 만들지 않는다. |
| q602 | transit-gateway-cross-region-peering | keep | — | yes | (현재) | (현재) | false | 리전별 Transit Gateway를 서로 피어링하면 한 리전에 들어온 온프레미스 연결 경로를 다른 리전의 워크로드도 사용할 수 있다. |
| q603 | onprem-access-via-interface-endpoint | keep | — | yes | (현재) | (현재) | false | 온프레미스를 Direct Connect로 VPC에 연결하고 인터페이스 엔드포인트의 사설 주소로 서비스를 호출하면 회선의 일관된 성능과 사설 접근 경로를 함께 얻는다. |
| q604 | outposts-data-residency | keep | — | yes | (현재) | (현재) | false | 데이터를 시설 밖으로 옮기지 않고 AWS 관리형 서비스를 쓰려면 Outposts로 인프라와 서비스를 데이터가 있는 시설에 확장해 처리한다. |
| q605 | direct-connect-resiliency | keep | — | yes | (현재) | (현재) | false | Direct Connect의 최대 복원력은 주·보조 데이터 센터에서 서로 다른 장비와 서로 다른 Direct Connect 위치로 연결을 이중화해 세 장애 범위를 모두 분리하는 구성이다. |
| q606 | direct-connect-vif-types | keep | — | yes | (현재) | (현재) | false | Direct Connect 회선 하나로 여러 리전의 Transit Gateway에 연결하려면 트랜짓 VIF를 Direct Connect Gateway에 붙이고 그 게이트웨이에 리전별 허브를 연결한다. |
| q607 | direct-connect-vif-types | keep | — | yes | (현재) | (현재) | false | Direct Connect에서 VPC의 사설 IP 대역으로 연결하는 프라이빗 VIF는 가상 프라이빗 게이트웨이나 Direct Connect Gateway에 붙는다. |
| q608 | centralized-onprem-egress | keep | — | yes | (현재) | (현재) | false | 인터넷 아웃바운드를 온프레미스에서 일괄 검사하려면 VPC의 직접 인터넷 출구를 없애고 기본 경로를 온프레미스로 이어지는 게이트웨이 쪽에 모은다. |
