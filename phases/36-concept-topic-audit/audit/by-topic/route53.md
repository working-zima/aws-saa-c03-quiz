# Route 53

`route53` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 13개 · keep 13 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 12 · false 1 · duplicateOf 2
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 13 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | route53 | 도메인 이름을 IP 주소로 바꾸는 데서 그치지 않고 요청을 지정한 대상으로 보내는 라우팅까지 맡는 DNS 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | routing-policies | Route 53의 라우팅 정책은 단일 리소스·국가·거리·다중 IP·가중치·지연 시간·클라이언트 IP 대역 가운데 무엇을 기준으로 응답할지에 따라 갈린다는 것을 이해한다. | keep | — | true | (현재) | — | 3 | ① |
| 3 | route53-failover-routing | 페일오버 라우팅은 주 레코드에 상태 검사를 연결해 주 대상이 비정상일 때 보조 레코드로 응답하는 내장 장애 조치이며, 보조 대상은 S3 정적 웹사이트처럼 다른 종류여도 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | multi-region-failover-for-region-outage | 리전 장애에 대비하려면 여러 리전에 배포할 뿐 아니라 Route 53의 상태 검사 기반 장애 조치로 정상 리전을 응답해야 하며 단순 라우팅 레코드로는 자동 전환되지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | latency-record-for-non-aws-endpoint | 리전이 없는 온프레미스 엔드포인트도 가장 가까운 AWS 리전에 연결해 지연 시간 레코드를 만들면, AWS에 올린 사이트와 같은 기준으로 사용자마다 빠른 쪽을 고를 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | multivalue-answer-details | 다중값 응답 라우팅은 상태 검사를 통과한 레코드를 최대 8개까지 무작위로 돌려주어 트래픽을 나누면서 비정상 대상을 빼지만, 사용자 위치는 고려하지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | resolver | Route 53 Resolver 엔드포인트는 AWS를 기준으로 방향을 나누어, 아웃바운드는 VPC에서 온프레미스 도메인을, 인바운드는 온프레미스에서 VPC 내부 도메인을 해석할 때 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 8 | route53-resolver-forward-rule | VPC의 쿼리를 온프레미스 DNS로 넘기려면 아웃바운드 엔드포인트와 도메인별 전달 규칙이 함께 필요하고, 엔드포인트는 하나로 두되 규칙은 쓰려는 VPC마다 연결해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | private-hosted-zone | 프라이빗 호스팅 영역은 VPC 안에서만 통하는 이름을 관리하므로 온프레미스 도메인을 해석하는 요구는 Resolver 아웃바운드 엔드포인트가 맡고, 내부 도메인을 퍼블릭 호스팅 영역에 올려서도 안 됨을 이해한다. | keep | — | true | (현재) | private-hosted-zone-vpc-only | 1 | ① |
| 10 | route53-zone-file-import | 다른 DNS 공급자에서 Route 53으로 옮기려면 퍼블릭 호스팅 영역을 만들고 존 파일로 레코드를 가져온 뒤 등록 기관이 Route 53을 쓰도록 바꾸며, 프라이빗 호스팅 영역이나 Resolver는 공용 DNS 호스팅을 대신하지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | route53-alias-record | 별칭 레코드로 도메인 이름을 로드 밸런서 같은 AWS 리소스에 연결하면 뒤의 인스턴스가 교체되어도 DNS를 고칠 필요가 없고, 공용 IP에 직접 묶으면 교체 때마다 레코드를 고쳐야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | private-hosted-zone-vpc-only | 프라이빗 호스팅 영역은 VPC에만 연결되어 온프레미스 네트워크에 붙일 수 없으므로, 사내 DNS의 사설 이름을 VPC에서 풀 때는 Resolver 아웃바운드 엔드포인트와 전달 규칙을, 반대 방향에는 인바운드 엔드포인트를 써야 함을 이해한다. | keep | — | true | (현재) | private-hosted-zone | 1 | ① |
| 13 | route53-query-logging | Route 53의 DNS 질의별 응답 코드를 확인하려면 API 호출 기록이나 집계 지표가 아니라 쿼리 로깅을 사용해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
