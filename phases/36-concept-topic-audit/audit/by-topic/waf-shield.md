# WAF·Shield·Firewall Manager

`waf-shield` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 15개 · keep 14 · ambiguous 0 · move-recommended 1
- 이동 후보 비율 6.7% — `waf-shield.cloudfront`
- 이동 후보의 confidence high 1 · medium 0 · low 0
- serviceSpecificGoal true 14 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 14 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | waf | WAF의 HTTP·HTTPS 요청 검사는 애플리케이션 계층 공격을 대상으로 하며 전송 계층 공격 방어와 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 3 | ① |
| 2 | cloudfront | CloudFront 배포는 콘텐츠 캐시·무효화, 원본 접근 제어와 요청 경로별 오리진 선택을 함께 제공한다는 기능 범위를 이해한다. | move-recommended | high | true | cloudfront-global-accelerator | — | 3 | hold |
| 3 | waf-attach-targets | WAF를 직접 연결할 수 있는 대상과 없는 대상을 구분하고 S3나 여러 오리진을 보호할 때 CloudFront를 검사 지점으로 삼는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | waf-rule-types | WAF에서 직접 지정한 IP 목록·국가·이미 알려진 악성 IP는 서로 다른 필터 기준이므로 요구에 맞는 규칙 유형을 골라야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | waf-managed-rule-groups | WAF 관리형 규칙 그룹은 알려진 공격에 대한 규칙 작성과 갱신을 맡기는 선택이므로 사용자 지정 규칙과 운영 책임이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | waf-rate-based-rule | WAF 속도 기반 규칙은 IP 목록이나 요청 내용 대신 요청 빈도를 기준으로 대상을 자동 차단하므로 용량 확장과 다른 대응임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | waf-bot-control | WAF Bot Control은 봇의 행동 패턴을 보고 제어하므로 알려진 IP의 평판 차단이나 DDoS 방어와 목적이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | waf-body-inspection-size-limit | WAF가 요청 본문의 일부만 검사할 수 있으면 한도를 넘는 요청에 대한 허용·차단 방침을 규칙 우선순위로 따로 정해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | waf-web-acl-region-must-match-rest-api | REST API에 WAF Web ACL을 적용하려면 같은 리전이라는 조건을 지켜야 하며 API 유형에 따라 직접 연결 가능 여부도 달라짐을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | waf-logging-to-firehose | WAF 로깅은 요청 출처와 차단 결과를 확인하게 하며 Firehose를 통한 전달은 그 검사 기록을 후속 분석에 이용하는 경로임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | shield | 대량 요청으로 서비스를 마비시키는 DDoS 공격을 자동으로 찾아내고 방어하는 보안 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 12 | shield-standard-network-layer | Shield Standard의 기본 DDoS 보호는 애플리케이션 계층 요청 필터링까지 대신하지 않으므로 보호 계층과 지원 요구를 나누어 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 13 | shield-advanced-drt | AWS 전담 대응 팀의 지원이 필요한 DDoS 방어에는 Shield Advanced를 선택해야 하며 WAF의 웹 요청 차단과 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | shield-advanced-protection-group | Shield Advanced의 보호 그룹은 여러 리소스의 트래픽을 함께 판단하는 단위이므로 교체된 리소스도 기존 그룹에 포함해야 보호가 이어짐을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | firewall-manager | 여러 계정에 같은 WAF 보호 규칙을 적용할 때 Firewall Manager의 중앙 정의·배포와 규칙 준수 확인의 역할을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
