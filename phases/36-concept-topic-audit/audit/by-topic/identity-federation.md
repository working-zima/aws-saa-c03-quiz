# IAM Identity Center·STS·Cognito·Directory Service·SAML

`identity-federation` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 11개 · keep 11 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 10 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 1개 — `iam-permissions.iam-roles-anywhere`
- 교차 유형 ① 10 · 2A 1 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | identity-center | 여러 AWS 계정의 사용자 인증과 권한 부여를 계정마다 따로 두지 않고 IAM Identity Center 한곳에서 권한 세트·그룹·외부 IdP 연동으로 통합 관리한다는 역할을 이해한다. | keep | — | true | (현재) | — | 2 | 2A |
| 2 | identity-center-external-idp | 회사의 기존 IdP를 SAML 2.0으로 IAM Identity Center에 한 번 연결하면 사용자·그룹이 동기화되므로, 계정마다 IAM 사용자나 SAML 공급자를 따로 두는 구성은 확장되지 않고 중복이 되는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | identity-center-permission-set | IAM Identity Center에서 권한 세트와 그룹·대상 계정의 연결로 팀에 필요한 접근 범위를 부여하는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | sts | 유효 기간이 끝나면 만료되는 임시 자격 증명은 장기 자격 증명보다 노출 위험을 줄인다는 성격을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 5 | sts-assume-role | 장기 자격 증명을 둘 수 없는 AWS 밖 애플리케이션이나 단기 투입 인원에게는 STS로 역할을 맡겨 만료되는 임시 자격 증명을 주는 편이 영구 IAM 사용자를 만들고 지우는 방식보다 안전함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | aws-directory-service | 온프레미스 AD를 AWS에서 쓰는 두 방식(관리형 AD와 신뢰 관계, 디렉터리 정보를 AWS에 저장하지 않는 AD Connector)을 구분하고, 인증 소스 연결과 계정별 권한 부여는 다른 문제라 AD Connector와 Identity Center 권한 세트를 함께 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 7 | custom-identity-broker-for-non-saml | 사내 디렉터리가 SAML을 지원하지 않으면 그 디렉터리로 인증한 뒤 STS에서 단기 자격 증명을 받아 오는 사용자 지정 ID 브로커로 페더레이션을 만들어야 하며, 장기 IAM 자격 증명 동기화나 IAM 정책은 인증을 대신하지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | saml-federation-role-to-ad-group-mapping | 온프레미스 AD를 SAML 2.0으로 AWS에 페더레이션하면 AWS 쪽 사용자 없이 콘솔·CLI·API에 로그인하고, IAM 역할을 AD 그룹에 매핑해 그룹 소속 변경만으로 권한이 바뀐다는 구조를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | cognito | 웹·모바일 애플리케이션의 최종 사용자 회원가입·로그인과 JWT 기반 인증·인가는 Cognito가 맡는다는 서비스의 역할을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | cognito-pools | Cognito 사용자 풀은 로그인(인증)을, 자격 증명 풀은 인증된 사용자에게 AWS 리소스 접근용 임시 권한을 맡으므로 사용자 풀만으로는 S3 접근 권한을 줄 수 없다는 역할 분담을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | cognito-social-idp-federation | 애플리케이션 최종 사용자의 소셜 로그인은 Cognito 사용자 풀이 SAML·OIDC로 외부 공급자와 연동해 처리하고, 그 풀을 API Gateway에 통합하면 API 호출자의 신원을 확인할 수 있어 애플리케이션이 인증을 직접 구현하지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
