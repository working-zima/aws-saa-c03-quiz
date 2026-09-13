# IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer

`iam-permissions` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 23개 · keep 23 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 23 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q155 | iam | keep | — | yes | (현재) | (현재) | false | AWS 리소스를 누가 쓸 수 있는지 접근 권한을 관리하는 것은 IAM이고, Identity Center는 여러 계정 통합, STS는 임시 자격 증명 발급, Cognito는 앱 사용자 인증을 맡는다. |
| q156 | iam | keep | — | yes | (현재) | (현재) | false | IAM 역할은 액세스 키 같은 자격 증명을 주고받지 않고 권한을 부여하며 언제든 해제할 수 있어, 만료 없는 장기 키를 흩뿌리지 않는 방식이다. |
| q157 | iam | keep | — | yes | (현재) | (현재) | false | IAM 사용자가 발급받는 액세스 키는 만료 시점이 없는 장기 자격 증명이며, STS 토큰은 만료되는 임시 자격 증명이다. |
| q237 | least-privilege | keep | — | yes | (현재) | (현재) | false | 업무 수행에 딱 필요한 만큼만 권한을 주는 기준은 최소 권한 원칙이며, 다중 AZ는 가용성을 위한 배치 전략이다. |
| q238 | instance-profile | keep | — | yes | (현재) | (현재) | false | EC2가 장기 키 없이 다른 서비스를 호출하려면 IAM 역할을 인스턴스 프로파일로 연결해 STS 임시 자격 증명을 받게 한다. |
| q239 | iam-group-users-only | keep | — | yes | (현재) | (현재) | false | IAM 그룹은 IAM 사용자의 집합이라 넣을 수 있는 대상은 사용자뿐이며, 인스턴스·역할·버킷은 구성원이 될 수 없다. |
| q685 | iam-group-policy-attachment | keep | — | yes | (현재) | (현재) | false | 직무별 IAM 그룹에 정책을 붙이고 사용자를 넣은 뒤 사용자에게 직접 붙은 정책을 떼면 권한 기준이 그룹 하나로 모인다. |
| q686 | iam-roles-anywhere | keep | — | yes | (현재) | (현재) | false | SAML·OIDC 없이 사내 인증서 체계로 장기 키 없이 AWS API를 부르려면 IAM Roles Anywhere가 X.509 인증서를 IAM 역할의 임시 자격 증명과 바꿔 준다. |
| q687 | iam-access-analyzer | keep | — | yes | (현재) | (현재) | false | 정책이 실제로 부여한 권한을 분석해 과도한 권한과 외부 공유를 조직 전체에서 찾는 도구는 IAM Access Analyzer다. |
| q688 | network-access-analyzer | keep | — | yes | (현재) | (현재) | false | Network Access Analyzer는 VPC 안에서 통신이 어디까지 닿는지를 분석할 뿐 IAM 권한 정책은 다루지 않는다. |
| q689 | abac | keep | — | yes | (현재) | (현재) | false | 리소스와 주체의 태그를 조건 키로 비교하는 ABAC는 새 자원이 태그만 맞으면 정책 수정 없이 규칙에 들어오므로, 늘어나는 대상에 운영 부담 없이 세분화된 접근을 건다. |
| q690 | permissions-boundary | keep | — | yes | (현재) | (현재) | false | 권한 경계는 개별 주체가 가질 수 있는 권한의 최대치를 정해 붙인 정책과 겹치는 범위만 남기므로, 어떤 정책을 붙여도 관리자 권한 역할이 나오지 않는다. |
| q691 | permissions-boundary | keep | — | yes | (현재) | (현재) | false | 권한 경계는 붙어 있어야 효력이 있으므로, 역할을 만들 때 경계 부착을 조건으로 요구하는 SCP를 함께 걸어야 규정을 어긴 역할이 아예 만들어지지 않는다. |
| q692 | cross-account-iam-role | keep | — | yes | (현재) | (현재) | false | 계정 간 접근은 자원이 있는 계정에 역할을 만들고 신뢰 정책으로 상대 주체를 허용해 임시 자격 증명으로 일하게 하면 장기 키 없이 한곳에서 통제된다. |
| q693 | iam-user-is-account-scoped | keep | — | yes | (현재) | (현재) | false | IAM 사용자는 그 계정 안에서만 존재해 다른 계정의 사용자를 내 계정 그룹에 넣을 수 없고, 계정 간 접근은 역할과 신뢰 정책으로만 열린다. |
| q694 | iam-explicit-deny-precedence | keep | — | yes | (현재) | (현재) | false | 한 정책에 허용과 조건부 거부가 함께 있으면 조건이 성립할 때 명시적 거부가 이겨 요청이 막히고 403이 돌아온다. |
| q695 | iam-explicit-deny-precedence | keep | — | yes | (현재) | (현재) | false | 재택에서만 403이 나는 증상은 요청 출발지 IP를 조건으로 삼은 거부 문장 때문이며, 명시적 거부가 허용을 이긴다. |
| q696 | iam-notaction-deny | keep | — | yes | (현재) | (현재) | false | 다른 정책이 무엇을 열어도 한 서비스만 남기려면 효과를 거부로 두고 NotAction에 그 서비스를 적는다. |
| q697 | iam-notaction-deny | keep | — | yes | (현재) | (현재) | false | 모든 작업을 거부하는 문장은 명시적 거부가 허용을 이기므로 그 아래에서 허용한 서비스까지 막으며, 한 서비스만 남기려면 NotAction 거부를 쓴다. |
| q698 | iam-requested-region-condition | keep | — | yes | (현재) | (현재) | false | aws:RequestedRegion 조건 키는 요청이 향하는 리전을 값으로 가져, 서비스 종류와 무관하게 승인된 리전 밖의 요청을 요청 시점에 막는다. |
| q699 | access-analyzer-delegated-administrator | keep | — | yes | (현재) | (현재) | false | 조직의 Access Analyzer 결과를 한 계정에 모으는 첫 조치는 관리 계정에서 그 계정을 위임 관리자로 지정하는 것이다. |
| q700 | root-user-multiple-mfa | keep | — | yes | (현재) | (현재) | false | 루트 사용자에는 MFA 장치를 여러 개 등록할 수 있어 하나를 잃어도 다른 장치로 인증해 계정 잠김을 막는다. |
| q701 | root-user-cannot-be-disabled | keep | — | yes | (현재) | (현재) | false | 루트 사용자는 비활성화할 수 없으므로 일상 작업을 IAM 사용자로 옮기고 루트에는 MFA를 켜는 조합만 실행할 수 있다. |
