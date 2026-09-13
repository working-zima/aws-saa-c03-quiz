# WAF·Shield·Firewall Manager

`waf-shield` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 20개 · keep 17 · ambiguous 0 · move-recommended 3
- 이동 후보 비율 15.0% — q152 · q153 · q154
- conceptFit yes 18 · partial 2 · no 0
- 이 주제로 들어올 이동 후보 1개 — q225(`security-groups-nacl`)

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q146 | waf | keep | — | yes | (현재) | (현재) | false | HTTP·HTTPS 요청의 내용을 검사해 공격 트래픽을 차단하는 것은 WAF이고, Shield는 DDoS 방어, GuardDuty·Macie는 탐지만 한다. |
| q147 | waf | keep | — | yes | (현재) | (현재) | false | WAF의 방어 범위는 L7 애플리케이션 계층이며, TCP·UDP가 속한 L4 전송 계층 공격은 막지 못한다. |
| q148 | waf | keep | — | yes | (현재) | (현재) | false | SQL Injection과 XSS는 요청 안에 담겨 오는 애플리케이션 계층 공격이라 웹 요청을 검사하는 WAF가 막는다. |
| q149 | shield | keep | — | yes | (현재) | (현재) | false | DDoS 위협의 탐지부터 방어까지 자동으로 수행하는 서비스는 Shield이며, WAF는 요청 내용 검사, GuardDuty는 탐지만 한다. |
| q152 | cloudfront | move-recommended | medium | yes | cloudfront-global-accelerator | 없음 | false | OAC는 원본에 접근할 수 있는 주체를 CloudFront로 한정해 배포를 거치지 않고 원본에 직접 닿는 경로를 막는 CloudFront의 기능이다. |
| q153 | cloudfront | move-recommended | high | partial | cloudfront-global-accelerator | cloudfront-global-accelerator.cloudfront-ttl | false | 캐시 무효화는 엣지에 남은 캐시 사본을 강제로 지워 TTL이 남아 있어도 다음 요청부터 원본의 새 결과를 가져오게 한다. |
| q154 | cloudfront | move-recommended | high | partial | cloudfront-global-accelerator | cloudfront-global-accelerator.cloudfront-multiple-origins | false | CloudFront의 멀티 오리진은 배포 하나에 여러 원본을 등록하고 요청 경로별로 응답할 원본을 나누는 기능이다. |
| q231 | waf-attach-targets | keep | — | yes | (현재) | (현재) | false | WAF를 S3 정적 웹사이트나 NLB에 직접 연결할 수 없으므로 S3 앞에 CloudFront를 두고 그 배포에 WAF를 연결해야 한다. |
| q232 | waf-bot-control | keep | — | yes | (현재) | (현재) | false | 요청 속도 같은 행동 패턴으로 봇 트래픽을 탐지·제어하는 것은 WAF Bot Control이며, IP 평판 규칙은 알려진 악성 IP만 막는다. |
| q233 | waf-rule-types | keep | — | yes | (현재) | (현재) | false | 국가를 기준으로 트래픽을 허용하거나 차단하는 WAF 규칙은 지리적 일치 규칙이고, IP 세트는 주소 목록을 기준으로 삼는다. |
| q234 | shield-advanced-drt | keep | — | yes | (현재) | (현재) | false | 정교한 DDoS 방어와 AWS 전담 대응 팀(DRT) 지원을 함께 받으려면 기본 Shield가 아니라 Shield Advanced를 쓴다. |
| q668 | firewall-manager | keep | — | yes | (현재) | (현재) | false | 조직의 여러 계정에 같은 WAF 규칙을 한 번에 배포하고 유지하는 것은 전용 보안 계정에 둔 Firewall Manager가 맡는다. |
| q669 | waf-managed-rule-groups | keep | — | yes | (현재) | (현재) | false | 알려진 웹 취약점 패턴에 대한 보호를 규칙 작성 없이 얻으려면 AWS가 계속 갱신하는 관리형 규칙 그룹을 Web ACL에 붙인다. |
| q670 | waf-rate-based-rule | keep | — | yes | (현재) | (현재) | false | 속도 기반 규칙은 요청 내용이 아니라 한 주소의 요청 빈도를 보고 임계값을 넘긴 주소를 자동 차단하므로 주소가 바뀌어도 목록 갱신이 필요 없다. |
| q671 | shield-standard-network-layer | keep | — | yes | (현재) | (현재) | false | 추가 비용 없는 기본 DDoS 보호인 Shield Standard는 네트워크 계층까지만 다루므로, 정상 요청 모양의 애플리케이션 계층 공격은 WAF를 붙여 검사해야 막힌다. |
| q672 | shield-standard-network-layer | keep | — | yes | (현재) | (현재) | false | Shield Standard의 방어 범위는 네트워크 계층까지이며, 애플리케이션 계층 필터링·DRT 지원·봇 제어는 다른 기능의 몫이다. |
| q673 | shield-advanced-protection-group | keep | — | yes | (현재) | (현재) | false | Shield Advanced에서 새 리소스를 기존 보호 그룹에 넣으면 개별 설정 없이 같은 보호와 통합된 판단이 이어진다. |
| q674 | waf-body-inspection-size-limit | keep | — | yes | (현재) | (현재) | false | WAF는 요청 본문을 크기 한도까지만 검사하므로, 큰 요청은 기본 차단하고 신뢰할 수 있는 출처만 우선 규칙으로 허용하는 처리 방침을 규칙 논리로 정해야 한다. |
| q675 | waf-web-acl-region-must-match-rest-api | keep | — | yes | (현재) | (현재) | false | API Gateway REST API에 Web ACL을 적용하려면 WAF를 그 API와 같은 리전에 만들어야 하고, 그러면 검사 트래픽이 리전 경계를 넘지 않아 지연도 줄어든다. |
| q676 | waf-logging-to-firehose | keep | — | yes | (현재) | (현재) | false | WAF 로깅을 켜고 Data Firehose에 연결하면 차단된 요청과 트래픽 출처가 담긴 로그가 거의 실시간으로 S3에 쌓여 분석할 수 있다. |
