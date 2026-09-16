# ALB·NLB·Gateway Load Balancer

`elastic-load-balancing` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 13 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 13 · 2A 1 · 2B 1 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | elb | ELB 계열의 ALB·NLB·GLB가 각각 다루는 트래픽과 용도가 달라 요구하는 프로토콜·목적에 맞춰 종류를 골라야 함을 이해한다. | keep | — | true | (현재) | — | 4 | 2A |
| 2 | alb-l7-vs-nlb-l4 | 로드 밸런서가 동작하는 계층에 따라 요청의 URL 경로를 볼 수 있는지가 갈리므로 경로 기반 분기에는 7계층인 ALB가 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | alb-routing-conditions | ALB는 요청 내용을 보는 7계층 장치라 경로뿐 아니라 헤더·호스트 이름으로도 대상을 나눌 수 있고, 특정 요청을 막는 일은 라우팅이 아니라 웹 ACL이 맡는다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | alb-cookie-stickiness | 세션 상태를 서버에 두는 애플리케이션을 여러 인스턴스로 확장할 때 ALB의 쿠키 기반 스티키 세션으로 같은 사용자를 같은 인스턴스에 보내야 하며 4계층 NLB는 이 방식을 주지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | sticky-session-tradeoff | 세션을 한 인스턴스에 고정하면 트래픽이 편중될 때 일부 인스턴스에 부하가 몰리므로 불균형의 원인으로 스티키 세션을 의심해야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 6 | alb-least-outstanding-requests | ALB의 분산 알고리즘으로 라운드 로빈 외에 최소 미처리 요청을 고를 수 있으며 요청마다 처리 시간이 크게 다르면 후자가 부하를 고르게 퍼뜨림을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | alb-target-group-independent-scaling | 성격이 다른 경로가 한 대상 그룹을 공유하면 서로의 응답 시간에 영향을 주므로 경로 기반 라우팅으로 대상 그룹을 나누고 그룹마다 확장 경계를 따로 두어야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | alb-listener-rule-fixed-response | ALB 리스너 규칙이 요청을 대상에 전달하지 않고 사용자 지정 응답을 반환할 수 있어 점검 안내 같은 응답을 애플리케이션 변경 없이 낼 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | nlb-tls-listener | TLS 연결을 받는 일은 NLB도 할 수 있으므로 요청 내용을 볼 필요가 없는 단일 TLS 진입점에는 NLB로 충분함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | nlb-udp-listener | NLB는 UDP 리스너를 지원하고 ALB는 원시 UDP를 처리하지 못하므로 UDP 트래픽을 받는 로드 밸런서는 NLB로 정해짐을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | nlb-ip-targets | NLB의 IP 주소 대상 등록을 이용해 AWS와 온프레미스 서버로 트래픽을 분산하고 고정 주소 요구를 함께 다루는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | gateway-load-balancer | 게이트웨이 로드 밸런서는 방화벽 같은 가상 어플라이언스를 배포·확장하는 용도라 애플리케이션 서버 앞에서 사용자 요청을 나누는 ALB·NLB와 쓰임이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | gwlb-endpoint-cross-account-inspection | 보안 장비와 게이트웨이 로드 밸런서를 한 계정에 모으고 다른 계정의 VPC에서 게이트웨이 로드 밸런서 엔드포인트로 라우팅하면 장비를 복제하지 않고 계정 간 트래픽을 검사할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | internal-load-balancer | 로드 밸런서를 내부용으로 만들면 사설 네트워크에서만 닿지만 이름 공개 여부는 호스팅 영역이 따로 정하므로 둘 다 사설로 두어야 완전히 숨겨짐을 이해한다. | keep | — | true | (현재) | — | 1 | hold |
| 15 | load-balancer-idle-timeout | 오래 유지되는 연결을 지키려면 로드 밸런서 하나가 아니라 연결이 지나는 모든 구성 요소의 유휴 타임아웃을 필요한 시간 이상으로 맞춰야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 16 | end-to-end-encryption-behind-alb | 로드 밸런서에서 TLS가 끝나면 대상까지의 구간은 평문이므로 종단 간 암호화에는 뒤 구간도 TLS가 필요하고, 그 구성의 운영 부담은 대상 인증서의 발급·갱신을 누가 맡는가로 갈린다는 것을 이해한다. | keep | — | false | (현재) | — | 2 | 2B |
