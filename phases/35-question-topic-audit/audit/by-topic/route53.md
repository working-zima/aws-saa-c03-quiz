# Route 53

`route53` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 16 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q117 | route53 | keep | — | yes | (현재) | (현재) | false | Route 53은 도메인 이름을 IP 주소로 변환하고 요청을 지정한 대상으로 라우팅하는 DNS 서비스다. |
| q118 | routing-policies | keep | — | yes | (현재) | (현재) | false | Route 53의 지리적 위치 라우팅은 사용자 국가를 기준으로 응답할 대상을 고른다. |
| q119 | routing-policies | keep | — | yes | (현재) | (현재) | false | Route 53에서 미리 정한 비율대로 트래픽을 나누는 정책은 가중치 기반 라우팅이다. |
| q120 | routing-policies | keep | — | yes | (현재) | (현재) | false | Route 53의 IP 기반 라우팅은 클라이언트의 CIDR 주소 대역을 기준으로 응답할 리소스를 나눈다. |
| q121 | resolver | keep | — | yes | (현재) | (현재) | false | VPC의 서비스가 온프레미스 내부 도메인을 해석할 때는 AWS에서 밖으로 질의를 보내는 Resolver 아웃바운드 엔드포인트를 쓴다. |
| q122 | resolver | keep | — | yes | (현재) | (현재) | false | 온프레미스 서버가 VPC 내부 도메인을 해석할 때는 AWS 쪽으로 질의를 받는 Resolver 인바운드 엔드포인트를 쓴다. |
| q220 | private-hosted-zone | keep | — | yes | (현재) | (현재) | false | 온프레미스의 사설 도메인을 VPC에서 해석하려면 호스팅 영역에 이름을 올리는 것이 아니라 Resolver 아웃바운드 엔드포인트로 사내 DNS에 질의해야 한다. |
| q221 | multivalue-answer-details | keep | — | yes | (현재) | (현재) | false | Route 53 다중값 응답 라우팅은 상태 검사를 통과한 레코드를 한 번에 최대 8개까지 무작위로 반환한다. |
| q609 | route53-zone-file-import | keep | — | yes | (현재) | (현재) | false | 공용 DNS 호스팅을 Route 53으로 옮길 때는 퍼블릭 호스팅 영역에 기존 존 파일을 가져오고 등록 기관이 Route 53을 사용하도록 갱신한다. |
| q610 | route53-failover-routing | keep | — | yes | (현재) | (현재) | false | Route 53 페일오버 라우팅에서는 주 레코드의 상태 검사로 장애를 판단해 보조 레코드를 응답하며 이 구성의 보조 레코드에는 별도 검사를 두지 않는다. |
| q611 | multi-region-failover-for-region-outage | keep | — | yes | (현재) | (현재) | false | 리전 전체의 장애에 자동 대응하려면 여러 리전에 배포하는 것에 더해 상태 검사 기반 DNS 장애 조치로 정상 리전을 선택해야 한다. |
| q612 | latency-record-for-non-aws-endpoint | keep | — | yes | (현재) | (현재) | false | AWS 밖의 엔드포인트를 Route 53 지연 시간 레코드로 등록할 때는 가장 가까운 AWS 리전을 연결해 그 리전의 지연 측정값을 비교 기준으로 쓴다. |
| q613 | route53-alias-record | keep | — | yes | (현재) | (현재) | false | 도메인을 별칭 레코드로 로드 밸런서에 연결하면 대상 그룹이 인스턴스 교체를 맡으므로 교체마다 DNS 레코드를 고치지 않아도 된다. |
| q614 | private-hosted-zone-vpc-only | keep | — | yes | (현재) | (현재) | false | Route 53 프라이빗 호스팅 영역의 연결 대상은 VPC이며 온프레미스 네트워크에 직접 연결할 수 없다. |
| q615 | route53-resolver-forward-rule | keep | — | yes | (현재) | (현재) | false | 여러 VPC의 특정 도메인 질의를 온프레미스로 전달하려면 Resolver 아웃바운드 엔드포인트 하나와 Forward 규칙을 만들고 사용할 VPC마다 규칙을 연결한다. |
| q616 | route53-query-logging | keep | — | yes | (현재) | (현재) | false | DNS 질의별 도메인·레코드 유형·요청지 IP·응답 코드를 남기는 기능은 Route 53 쿼리 로깅이다. |
