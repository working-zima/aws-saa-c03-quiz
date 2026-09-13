# ALB·NLB·Gateway Load Balancer

`elastic-load-balancing` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 20개 · keep 18 · ambiguous 1 · move-recommended 1
- 이동 후보 비율 5.0% — q465
- conceptFit yes 18 · partial 2 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q078 | elb | keep | — | yes | (현재) | (현재) | false | ELB는 들어오는 트래픽을 여러 서버에 나눠 보내며 서버 대수 조정이나 콘텐츠 캐싱과 역할이 다르다. |
| q079 | elb | keep | — | yes | (현재) | (현재) | false | HTTP·HTTPS 웹 요청을 다루고 WAF를 연결할 수 있는 로드 밸런서는 ALB다. |
| q080 | elb | keep | — | partial | (현재) | nlb-udp-listener | false | NLB는 TCP와 UDP 트래픽을 모두 받아 낮은 지연으로 대상에 전달하는 로드 밸런서다. |
| q081 | elb | keep | — | partial | (현재) | gateway-load-balancer | false | 게이트웨이 로드 밸런서는 애플리케이션 서버가 아니라 방화벽 같은 보안 어플라이언스에 트래픽을 분산한다. |
| q190 | alb-l7-vs-nlb-l4 | keep | — | yes | (현재) | (현재) | false | ALB는 7계층에서 요청의 URL 경로를 읽어 대상을 나눌 수 있지만 4계층 NLB는 경로를 읽지 못한다. |
| q191 | sticky-session-tradeoff | keep | — | yes | (현재) | (현재) | false | 스티키 세션은 같은 사용자를 같은 인스턴스에 고정하므로 일부 사용자에게 트래픽이 편중되면 특정 인스턴스만 과부하가 된다. |
| q453 | gateway-load-balancer | keep | — | yes | (현재) | (현재) | false | 게이트웨이 로드 밸런서는 타사 보안 어플라이언스를 배포·확장하는 장치이므로 일반 게임 요청을 애플리케이션 서버에 분산하는 용도가 아니다. |
| q454 | alb-routing-conditions | keep | — | yes | (현재) | (현재) | false | HTTP 헤더 값에 따라 대상 그룹을 나누는 것은 요청 내용을 읽는 ALB의 헤더 기반 라우팅 기능이다. |
| q455 | nlb-tls-listener | keep | — | yes | (현재) | (현재) | false | NLB는 4계층 로드 밸런서여도 TLS 연결을 받아 공용 진입점 하나를 제공할 수 있다. |
| q456 | nlb-udp-listener | keep | — | yes | (현재) | (현재) | false | NLB의 UDP 리스너는 대량 UDP 트래픽을 낮은 지연으로 대상 서버에 전달하며 ALB는 원시 UDP를 처리하지 못한다. |
| q457 | nlb-ip-targets | keep | — | yes | (현재) | (현재) | false | NLB는 IP 주소로 AWS 안팎의 서버를 대상 그룹에 등록할 수 있고 고정 IP 진입점도 제공한다. |
| q458 | alb-cookie-stickiness | keep | — | yes | (현재) | (현재) | false | 서버 메모리에 세션을 보관한 웹 애플리케이션에서 코드를 고치지 않고 사용자를 같은 인스턴스에 보내려면 ALB의 쿠키 기반 스티키 세션을 쓴다. |
| q459 | internal-load-balancer | ambiguous | — | yes | (현재) | (현재) | false | 접속 경로와 이름 해석을 모두 사설로 제한하려면 내부 로드 밸런서와 프라이빗 호스팅 영역을 함께 사용해야 한다. |
| q460 | alb-least-outstanding-requests | keep | — | yes | (현재) | (현재) | false | ALB의 최소 미처리 요청 알고리즘은 아직 응답하지 않은 요청이 가장 적은 대상에 다음 요청을 보내 처리 시간 차이로 생기는 불균형을 줄인다. |
| q461 | alb-target-group-independent-scaling | keep | — | yes | (현재) | (현재) | false | 성격이 다른 경로를 ALB의 별도 대상 그룹으로 나누고 각 그룹에 독립된 Auto Scaling 그룹을 붙이면 CPU 경합과 확장 경계를 분리한다. |
| q462 | alb-listener-rule-fixed-response | keep | — | yes | (현재) | (현재) | false | ALB 리스너에 모든 경로를 덮는 고정 응답 규칙을 기존 규칙보다 앞에 두면 애플리케이션 변경 없이 점검 안내를 반환한다. |
| q463 | load-balancer-idle-timeout | keep | — | yes | (현재) | (현재) | false | 긴 연결의 유휴 중단을 막으려면 경로의 모든 로드 밸런서와 방화벽에서 유휴 타임아웃을 필요한 시간 이상으로 맞춰야 한다. |
| q464 | end-to-end-encryption-behind-alb | keep | — | yes | (현재) | (현재) | false | ALB 앞 구간에서 TLS가 끝나면 뒤 구간은 보호되지 않으므로 종단 간 암호화에는 대상 인스턴스까지 TLS와 인증서가 필요하다. |
| q465 | end-to-end-encryption-behind-alb | move-recommended | high | yes | secrets-encryption | secrets-encryption.acm | false | 인증서 발급과 갱신을 관리형 서비스에 맡기면 직접 발급·반입·교체하는 방식보다 인증서 수명 주기의 운영 부담이 줄어든다. |
| q466 | gwlb-endpoint-cross-account-inspection | keep | — | yes | (현재) | (현재) | false | 여러 계정의 트래픽을 공용 검사 장비로 모으려면 검사 계정의 GWLB를 가리키는 GWLB 엔드포인트를 각 애플리케이션 계정에 두고 그쪽으로 라우팅한다. |
