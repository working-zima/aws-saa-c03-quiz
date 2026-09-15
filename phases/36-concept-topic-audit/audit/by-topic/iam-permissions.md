# IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer

`iam-permissions` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 18개 · keep 17 · ambiguous 0 · move-recommended 1
- 이동 후보 비율 5.6% — `iam-permissions.iam-roles-anywhere`
- 이동 후보의 confidence high 0 · medium 1 · low 0
- serviceSpecificGoal true 15 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 17 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | iam | IAM 사용자에게 장기 액세스 키를 주는 방식과 역할로 필요한 접근을 부여하는 방식은 자격 증명의 보관 책임과 권한 관리 방법이 다름을 이해한다. | keep | — | true | (현재) | — | 3 | ① |
| 2 | iam-group-policy-attachment | 직무별 IAM 그룹에 정책을 모아 권한 기준을 관리하려면 사용자에게 따로 남은 직접 권한도 정리해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | iam-group-users-only | IAM 그룹은 사용자 집합이므로 컴퓨팅 리소스에 권한을 줄 때 그룹 소속이나 직접 정책 부착 대신 역할을 사용해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | iam-user-is-account-scoped | IAM 사용자는 계정 경계를 넘어 그룹에 공유되지 않으므로 외부 계정 주체의 접근은 사용자 편입과 다른 신뢰 관계로 열어야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | instance-profile | EC2에 장기 키를 보관하지 않고 AWS 호출 권한을 주려면 IAM 역할을 인스턴스 프로파일로 연결해 임시 자격 증명을 사용해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | iam-roles-anywhere | 기존 X.509 인증서를 AWS 임시 자격 증명으로 교환하는 IAM Roles Anywhere를 통신 상대 검증이나 이미 가진 자격 증명으로 요청에 서명하는 절차와 구분해야 함을 이해한다. | move-recommended | medium | true | identity-federation | — | 1 | hold |
| 7 | cross-account-iam-role | 계정 간 접근에서 자원을 가진 계정의 역할과 신뢰 정책으로 허용할 주체를 한정하면 장기 키를 나눠 주지 않고 임시 접근을 통제할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | least-privilege | 필요한 업무에 맞춰 접근 권한을 최소화해야 하며 계정 공유나 모든 리소스에 대한 상시 권한 부여는 그 원칙과 어긋남을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 9 | abac | 리소스와 주체의 속성을 정책 조건으로 비교하면 리소스가 늘어날 때마다 개별 이름을 정책에 추가하지 않고 접근 범위를 관리할 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 10 | permissions-boundary | IAM 권한 경계는 개별 주체 권한의 상한이고 실제 권한은 부여 정책과 겹치는 범위이며 경계 부착의 강제는 별도 통제가 필요함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 11 | iam-explicit-deny-precedence | IAM 정책에 허용이 있어도 조건에 맞는 명시적 거부가 우선하므로 접근 실패를 판단할 때 작업 목록과 조건부 거부를 함께 봐야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 12 | iam-notaction-deny | 한 서비스 외의 작업을 막으려면 NotAction을 쓴 Deny가 필요하며 허용문만 추가하거나 전부 거부한 뒤 일부 허용하는 방식과 결과가 다름을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 13 | iam-requested-region-condition | IAM의 aws:RequestedRegion은 요청 목적지 리전을 제한하는 조건이므로 출발 IP 제한이나 사후 경고와 구분해 예방적 통제에 사용해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | iam-access-analyzer | IAM Access Analyzer는 정책이 부여한 권한과 외부 공유 범위를 분석하므로 리소스 생성·변경 사실을 알리는 것과 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | network-access-analyzer | 이름이 비슷한 접근 분석 도구라도 네트워크의 통신 가능 경로와 권한 정책의 허용 범위는 서로 다른 분석 대상임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 16 | access-analyzer-delegated-administrator | 조직의 Access Analyzer 정책 분석 결과를 감사 계정에서 통합하려면 관리 계정의 위임 관리자 지정이 선행되어야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | root-user-multiple-mfa | 루트 사용자의 MFA 장치 장애에 대비하려면 여러 장치를 미리 등록해야 하며 IAM 관리자 계정을 예비로 두는 것만으로는 대체할 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | root-user-cannot-be-disabled | 루트 사용자 비활성화를 전제로 운영을 설계하지 말고 일상 작업을 IAM 사용자로 분리하면서 루트 접근을 보호해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
