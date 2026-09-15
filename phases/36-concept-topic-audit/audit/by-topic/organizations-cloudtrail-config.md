# Organizations·SCP·CloudTrail·Config·Audit Manager

`organizations-cloudtrail-config` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 13 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 16 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | organizations-scp | SCP는 계정이 할 수 없는 행동을 금지 목록으로 거는 도구이며 비정상 패턴을 탐지·분석하지 않으므로 위협 탐지 요구에는 답이 되지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | organizations-tag-policy | 태그 정책은 조직 안 태그 키·값의 표기를 통일하고, 태그 없는 생성이나 태그 삭제를 막는 일은 SCP가 하며, Config는 위반을 찾아 알리는 사후 수단이라 예방이 아님을 구분해 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 3 | organizations-consolidated-billing | 사업부별 워크로드 격리와 비용 통합 청구를 함께 요구하면 계정을 나누되 하나의 조직에 멤버 계정으로 묶어야 하며, 태그로만 나누거나 조직을 여러 개 만드는 구성은 한쪽 요구를 잃음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | organizational-unit | Organizations는 계정을 조직 단위로 묶고, SCP를 OU에 붙이면 그 안 모든 계정의 사용자·그룹·역할에 한꺼번에 적용되어 계정마다 정책을 복사하거나 템플릿·카탈로그로 제한하지 않아도 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | scp-attachment-targets | SCP는 루트·OU·개별 멤버 계정 어디에나 붙일 수 있고 붙인 자리 아래에만 적용되므로, 일부 계정만 제한하려면 그 계정이나 그 계정을 담은 OU에 붙여야 하고 루트에 붙이면 범위가 넘친다는 것을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 6 | scp-condition-exception | SCP로 조직 차원 금지를 걸면서 특정 역할만 예외로 두려면 Principal 요소가 아니라 Condition의 aws:PrincipalArn 조건 키로 허용할 주체를 지목해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | aws-config | 리소스 설정의 변경 시점·주체·내용을 기록하면 시간이 지나며 구성이 어떻게 달라졌는지 추적할 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 8 | config-configuration-recorder | AWS Config는 구성 레코더를 시작해야 지원 리소스의 변경을 구성 항목으로 캡처하며, 대상 리소스를 설치·수정하지 않으므로 레코더가 꺼진 계정에는 변경 이력이 쌓이지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | config-conformance-pack | CIS·PCI-DSS 같은 준수 프레임워크 검사는 Config 준수 팩으로 규칙 묶음을 한 번에 켜고 결과 화면은 연동된 Security Hub에 맡기는 조합이 유지 관리가 가장 적으며, 준수 팩은 Inspector의 기능이 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | config-custom-rule | 관리형 규칙이 다루지 않는 구성 값은 AWS Config 사용자 지정 규칙으로 직접 판정해 감시할 수 있고, 찾은 것을 고치지 않고 알림으로 이어 비용·성능을 미리 조정하는 데 쓸 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | config-rule-remediation | AWS Config의 규정 미준수 탐지와 Systems Manager의 자동 수정을 연결하되 새 리소스 생성 차단과는 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | cloudtrail | 계정에서 일어난 API 호출을 활동 기록으로 남기면 누가 어떤 기능을 사용했는지 감시할 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 13 | cloudtrail-lake | CloudTrail 이벤트를 수년간 보관·조회해야 하거나 AWS 밖 활동까지 한곳에 모아야 하면 S3 데이터 레이크를 직접 짓지 않고 CloudTrail Lake의 관리형 수집·저장·쿼리를 쓴다는 선택 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | cloudtrail-data-events | CloudTrail은 리소스 자체를 다루는 관리 이벤트와 객체 읽기·쓰기 같은 데이터 이벤트를 나눠 기록하며, 객체 수준 접근 감사는 데이터 이벤트를 따로 켜야 남고 VPC 플로우 로그로 대신할 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | cloudtrail-log-file-validation | 감사 로그가 증거가 되려면 남아 있는 것만이 아니라 변조·삭제되지 않았음을 보여야 하므로 CloudTrail 로그 파일 유효성 검사를 켜고, 보관 요구에는 KMS 암호화와 그 구성 유지를 확인하는 Config 규칙을 함께 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | audit-manager | 감사에 제출할 증거를 모으는 일과 리소스 설정 변경 이력을 직접 기록하는 일은 역할이 다름을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
