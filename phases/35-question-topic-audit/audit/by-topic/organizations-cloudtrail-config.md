# Organizations·SCP·CloudTrail·Config·Audit Manager

`organizations-cloudtrail-config` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 18개 · keep 18 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 18 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q162 | cloudtrail | keep | — | yes | (현재) | (현재) | false | CloudTrail은 AWS 계정에서 발생한 API 호출을 이벤트로 기록해 어느 계정이 어떤 기능을 사용했는지 감사하게 한다. |
| q163 | aws-config | keep | — | yes | (현재) | (현재) | false | AWS Config는 리소스 구성의 변경 이력을 기록하고 규칙으로 구성의 준수 상태를 검사한다. |
| q242 | organizations-scp | keep | — | yes | (현재) | (현재) | false | SCP는 조직의 계정에 허용되지 않는 행동을 제한하는 조직 차원의 서비스 제어 정책이다. |
| q709 | cloudtrail-lake | keep | — | yes | (현재) | (현재) | false | CloudTrail Lake는 AWS 안팎의 활동 이벤트를 한곳에 수집·장기 보관·쿼리하여 별도 데이터 레이크 구축 부담을 줄인다. |
| q710 | audit-manager | keep | — | yes | (현재) | (현재) | false | Audit Manager는 감사에 필요한 증거 수집을 자동화하며 구성 변경 기록이나 API 호출 기록을 직접 맡는 서비스와 구별된다. |
| q711 | organizational-unit | keep | — | yes | (현재) | (현재) | false | 부서의 계정들을 OU로 묶어 SCP를 붙이면 그 안 계정 전체에 서비스 제한을 적용해 계정별 정책 복사를 줄인다. |
| q712 | organizations-tag-policy | keep | — | yes | (현재) | (현재) | false | Organizations 태그 정책은 조직이 사용할 태그 키와 허용 값을 정해 표기를 통일한다. |
| q713 | organizations-tag-policy | keep | — | yes | (현재) | (현재) | false | 태그 정책은 키·값의 표준화를, SCP는 태그 없는 생성과 태그 삭제의 거부를 맡으므로 두 기능을 함께 적용한다. |
| q714 | organizations-consolidated-billing | keep | — | yes | (현재) | (현재) | false | 조직 하나에 사업부별 멤버 계정을 두면 계정 경계로 워크로드를 격리하면서 관리 계정의 통합 청구서로 비용을 함께 확인한다. |
| q715 | cloudtrail-data-events | keep | — | yes | (현재) | (현재) | false | S3 객체를 가져오고 올린 활동은 CloudTrail 데이터 이벤트를 별도로 켜야 기록되며 관리 이벤트만으로는 남지 않는다. |
| q716 | config-configuration-recorder | keep | — | yes | (현재) | (현재) | false | AWS Config 구성 레코더를 시작하면 대상 리소스에 설치나 설정 변경 없이 지원 리소스의 변경을 구성 항목으로 캡처한다. |
| q717 | scp-attachment-targets | keep | — | yes | (현재) | (현재) | false | SCP는 연결한 계정이나 OU 아래에 적용되므로 일부 계정만 제한하려면 해당 계정들 또는 그 계정들을 담은 OU에 연결한다. |
| q718 | scp-attachment-targets | keep | — | yes | (현재) | (현재) | false | SCP는 부착 위치 아래로 적용되므로 조직 루트에 연결하면 제한 대상에서 빼려던 멤버 계정에도 같은 제한이 전달된다. |
| q719 | scp-condition-exception | keep | — | yes | (현재) | (현재) | false | SCP의 조직 차원 거부에서 특정 역할을 예외로 두려면 Principal이 아니라 Condition의 aws:PrincipalArn 조건 키로 주체를 식별한다. |
| q720 | cloudtrail-log-file-validation | keep | — | yes | (현재) | (현재) | false | CloudTrail 로그 파일 유효성 검사는 전달된 감사 로그가 이후 변경되거나 삭제되었는지 확인할 수 있게 한다. |
| q721 | config-conformance-pack | keep | — | yes | (현재) | (현재) | false | AWS Config 준수 팩은 업계 표준에 맞는 규칙 묶음을 제공해 개별 규칙 작성 부담을 줄이고 결과를 Security Hub와 연동한다. |
| q722 | config-custom-rule | keep | — | yes | (현재) | (현재) | false | AWS Config 사용자 지정 규칙은 관리형 규칙에 없는 리소스 구성 값도 직접 판정할 수 있어 그 결과를 지표와 알림으로 연결할 수 있다. |
| q723 | config-rule-remediation | keep | — | yes | (현재) | (현재) | false | AWS Config 규칙은 규정 미준수 구성을 계속 찾아내고 Systems Manager는 찾아낸 리소스를 자동으로 수정하는 역할을 맡는다. |
