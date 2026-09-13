# 보안 그룹·NACL

`security-groups-nacl` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 17개 · keep 16 · ambiguous 0 · move-recommended 1
- 이동 후보 비율 5.9% — q225
- conceptFit yes 16 · partial 1 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q129 | security-group | keep | — | yes | (현재) | (현재) | false | 개별 AWS 리소스 단위로 들어오고 나가는 트래픽을 통제하는 방화벽 기능은 보안 그룹이다. |
| q130 | nacl | keep | — | yes | (현재) | (현재) | false | NACL은 서브넷 경계에서 트래픽을 허용하거나 거부하는 제어 수단이다. |
| q131 | security-group | keep | — | yes | (현재) | (현재) | false | 규칙을 추가하지 않은 보안 그룹의 인바운드는 모든 트래픽을 차단한다. |
| q132 | security-group | keep | — | yes | (현재) | (현재) | false | 규칙을 추가하지 않은 보안 그룹의 아웃바운드는 모든 트래픽을 허용한다. |
| q133 | security-group | keep | — | yes | (현재) | (현재) | false | 보안 그룹 규칙에는 특정 트래픽의 허용을 추가할 수 있고 명시적인 차단 동작은 추가할 수 없다. |
| q134 | nacl | keep | — | yes | (현재) | (현재) | false | 이 문항이 다루는 NACL의 기본 규칙은 인바운드와 아웃바운드 트래픽을 모두 허용한다. |
| q135 | nacl | keep | — | yes | (현재) | (현재) | false | NACL 규칙의 통신 상대는 IP로 지정하며 AWS 리소스를 대상으로 직접 지정할 수 없다. |
| q136 | security-group | keep | — | yes | (현재) | (현재) | false | 보안 그룹은 특정 서브넷에 매이지 않고 여러 AWS 리소스에 같은 트래픽 규칙을 적용할 수 있다. |
| q137 | nacl | keep | — | yes | (현재) | (현재) | false | 트래픽을 허용하는 규칙과 명시적으로 차단하는 규칙이 모두 필요하면 NACL을 사용한다. |
| q224 | security-group-referencing | keep | — | yes | (현재) | (현재) | false | DB 보안 그룹의 인바운드 소스를 애플리케이션 보안 그룹 ID로 지정하면 인스턴스 IP가 바뀌어도 그 그룹에 속한 인스턴스만 접근한다. |
| q225 | nacl-rule-limit | move-recommended | high | partial | waf-shield | waf-shield.waf-rule-types | true | 다수의 특정 IP 주소에서 오는 웹 요청만 허용하려면 국가별로 가르는 지리적 일치 규칙이 아니라 WAF IP 세트 일치 규칙을 사용한다. |
| q226 | web-acl-vs-nacl | keep | — | yes | (현재) | (현재) | false | Web ACL은 WAF의 웹 요청 판정 규칙이고 NACL은 서브넷 경계의 IP 기반 통제 기능으로 서로 다른 규칙 체계다. |
| q594 | security-group-stateful-vs-nacl-stateless | keep | — | yes | (현재) | (현재) | false | NACL은 상태를 추적하지 않으므로 인바운드 요청을 허용했어도 응답이 나갈 아웃바운드 규칙을 별도로 허용해야 한다. |
| q595 | security-group-stateful-vs-nacl-stateless | keep | — | yes | (현재) | (현재) | false | 보안 그룹에는 거부 규칙을 만들 수 없으므로 특정 IP를 명시적으로 차단하려면 서브넷의 NACL을 사용한다. |
| q596 | nacl-deny-at-source-subnet | keep | — | yes | (현재) | (현재) | false | 보내는 서브넷에서 상대 서브넷으로 향하는 트래픽을 거부하려면 보내는 쪽 NACL의 아웃바운드에 상대 IP 대역의 거부 규칙을 둔다. |
| q597 | alb-security-group-outbound-and-health-check-port | keep | — | yes | (현재) | (현재) | false | ALB가 대상의 서비스 포트와 별도 상태 검사 포트로 보내는 요청은 각각 보안 그룹 아웃바운드로 허용해야 한다. |
| q598 | nlb-security-group | keep | — | yes | (현재) | (현재) | false | NLB 보안 그룹으로 소스 IP 허용 목록을 적용하고 대상 보안 그룹이 NLB 보안 그룹을 참조하게 하면 로드 밸런서를 거친 접근만 받는다. |
