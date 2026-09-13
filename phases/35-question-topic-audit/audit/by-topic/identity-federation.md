# IAM Identity Center·STS·Cognito·Directory Service·SAML

`identity-federation` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 13개 · keep 13 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 12 · partial 1 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q158 | identity-center | keep | — | yes | (현재) | (현재) | false | 여러 AWS 계정의 사용자 인증과 권한 부여를 한곳에서 통합 관리하는 서비스는 IAM Identity Center다. |
| q159 | identity-center | keep | — | partial | (현재) | identity-center-permission-set | false | IAM Identity Center의 권한 세트는 대상 계정에서 허용할 작업을 묶어 사용자나 그룹에 부여하는 권한 템플릿이다. |
| q160 | sts | keep | — | yes | (현재) | (현재) | false | STS는 일정 시간이 지나면 만료되는 액세스 키나 토큰 형태의 임시 자격 증명을 발급한다. |
| q161 | cognito | keep | — | yes | (현재) | (현재) | false | Cognito는 웹·모바일 애플리케이션 최종 사용자의 로그인과 회원가입을 제공하고 JWT로 인증과 인가를 처리한다. |
| q240 | sts-assume-role | keep | — | yes | (현재) | (현재) | false | 온프레미스 애플리케이션은 STS AssumeRole로 만료되는 임시 자격 증명을 받아 장기 키 없이 AWS 리소스에 접근한다. |
| q241 | cognito-pools | keep | — | yes | (현재) | (현재) | false | Cognito 사용자 풀은 로그인을 맡고 자격 증명 풀은 인증을 마친 사용자에게 AWS 리소스 접근용 임시 권한을 준다. |
| q702 | aws-directory-service | keep | — | yes | (현재) | (현재) | false | AD Connector는 디렉터리 정보를 AWS에 저장하지 않고 인증을 기존 온프레미스 Active Directory로 넘긴다. |
| q703 | aws-directory-service | keep | — | yes | (현재) | (현재) | false | AD Connector로 기존 AD의 인증을 유지하면서 IAM Identity Center 권한 세트로 여러 AWS 계정의 접근 권한을 중앙에서 배분한다. |
| q704 | identity-center-external-idp | keep | — | yes | (현재) | (현재) | false | IAM Identity Center에 외부 IdP를 SAML 2.0으로 연결하면 기존 자격 증명과 IdP의 사용자·그룹 프로비저닝으로 여러 계정의 접근을 통합한다. |
| q705 | cognito-social-idp-federation | keep | — | yes | (현재) | (현재) | false | 애플리케이션 최종 사용자의 소셜 로그인을 직접 구현하지 않고 API 호출자 인증으로 이어 주는 구성은 외부 IdP와 연동한 Cognito 사용자 풀이다. |
| q706 | custom-identity-broker-for-non-saml | keep | — | yes | (현재) | (현재) | false | SAML을 지원하지 않는 사내 디렉터리는 사용자 지정 ID 브로커가 먼저 신원을 검증한 뒤 STS 임시 자격 증명으로 AWS 접근을 연결한다. |
| q707 | identity-center-permission-set | keep | — | yes | (현재) | (현재) | false | IAM Identity Center에서는 필요한 권한만 담은 권한 세트를 그룹에 할당하고 대상 계정을 정해 팀별 최소 권한을 적용한다. |
| q708 | saml-federation-role-to-ad-group-mapping | keep | — | yes | (현재) | (현재) | false | SAML 페더레이션 환경에서는 권한을 IAM 역할에 붙여 AD 그룹에 매핑함으로써 별도 AWS 사용자 없이 그룹 소속으로 접근 권한을 관리한다. |
