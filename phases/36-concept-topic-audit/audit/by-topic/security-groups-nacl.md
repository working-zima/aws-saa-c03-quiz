# 보안 그룹·NACL

`security-groups-nacl` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 9개 · keep 9 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 8 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 8 · 2A 0 · 2B 1 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | security-group | 보안 그룹은 개별 리소스에 붙는 방화벽으로 서브넷에 매이지 않고, 기본적으로 인바운드는 막고 아웃바운드는 열며, 허용 규칙만 추가할 수 있다는 동작 방식을 이해한다. | keep | — | true | (현재) | — | 5 | ① |
| 2 | security-group-referencing | 보안 그룹 규칙의 소스로 다른 보안 그룹을 지정하면 IP가 계속 바뀌는 인스턴스도 그룹 소속만으로 허용할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | alb-security-group-outbound-and-health-check-port | 트래픽이 로드 밸런서에서 대상으로 흐르므로 로드 밸런서 보안 그룹에는 대상의 서비스 포트와 별도 상태 검사 포트로 나가는 아웃바운드가 필요하고, 응답은 상태 저장 덕분에 규칙 없이 돌아온다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | nlb-security-group | NLB에 보안 그룹을 붙여 허용할 소스 IP를 좁히고 대상 보안 그룹이 NLB의 보안 그룹을 참조하게 하면, 상태 비저장인 NACL보다 간단하게 허용 목록 기반 접근을 구성할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | nacl | NACL은 서브넷 경계에 걸리며 기본적으로 모든 트래픽을 허용하고, IP만 대상으로 허용과 차단 규칙을 모두 둘 수 있다는 점에서 보안 그룹과 다른 통제 수단임을 이해한다. | keep | — | true | (현재) | — | 4 | ① |
| 6 | nacl-rule-limit | NACL은 규칙 수가 적게 제한되어 수만 개의 IP나 국가 단위 필터링을 감당하지 못하므로, 그런 규모의 IP·지역 필터링에는 다른 수단이 필요하다는 한계를 이해한다. | keep | — | true | (현재) | — | 1 | 2B |
| 7 | nacl-deny-at-source-subnet | NACL은 서브넷마다 인바운드와 아웃바운드가 따로 있으므로 한 방향의 통신을 막으려면 보내는 쪽 서브넷의 아웃바운드에 거부 규칙을 걸어야 하고, 차단 규칙이 없는 보안 그룹으로는 할 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | security-group-stateful-vs-nacl-stateless | 보안 그룹은 허용한 연결의 응답을 자동으로 통과시키는 상태 저장 방식이고 NACL은 두 방향에 각각 규칙이 필요한 상태 비저장 방식이며, 차단 규칙이 없는 보안 그룹으로는 특정 IP를 막을 수 없음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 9 | web-acl-vs-nacl | 이름에 ACL이 들어가더라도 웹 요청 검사 규칙과 서브넷 경계의 트래픽 통제는 적용 대상이 다름을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
