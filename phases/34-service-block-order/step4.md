# Step 4: security-cost-reorder

**5개 주제의 개념을 서비스 블록 순서로 옮긴다** — `waf-shield`·`guardduty-macie-inspector`·`identity-federation`·`organizations-cloudtrail-config`·`cost-management`.

이 step은 사람이 중간에 확인하지 않는 무인 실행으로 돈다. 아래 명세와 AC를 정확히 지키고,
명세와 부딪히는 것을 발견하면 추측으로 넘기지 말고 멈춰라(아래 「선행 관계와 충돌하면」).
**이 5개 말고 다른 주제의 순서는 건드리지 않는다.** 앞 step에서 이미 재정렬한 주제도 다시
손대지 않는다.

## 이 phase의 범위 — 개념 배열 순서뿐이다

사용자의 말을 그대로 옮긴다.

> 작업 범위는 엄격하게 `개념 배열 순서`로 제한한다.

**바꾸지 않는 것**: concept id · name · summary · paragraphs, 문항 파일 전체(question id · prompt ·
choices · explanation · answerIndex · 문항 배열), 주제 메타데이터, 콘텐츠 사실관계와 표현, 용어 표기.
`docs/`와 `phases/NEXT.md`도 이 step에서 건드리지 않는다.

**이 step에서 바꾸는 파일은 셋이다.**

| 파일 | 바꾸는 것 |
|---|---|
| `src/data/topics.json` | 아래 5개 주제의 개념 **줄의 자리**와 그에 따른 끝 쉼표 |
| `src/data/data.test.ts` | 아래 5개 주제의 순서 단언 `it` 블록(제목·주석·기대 배열) |
| `scripts/topics-baseline.json` | 아래 5개 주제의 `concepts` 항목 순서 |

사용자가 `data.test.ts`에 대해 정한 범위: "각 주제의 기존 개념 순서 단언을 새 서비스 블록 순서로
갱신하는 범위만 허용한다. 새로운 기능 테스트나 콘텐츠 테스트를 추가하지 마. 테스트 제목과 주석도
새 정렬 규칙을 정확히 설명하도록 갱신해 줘."

## 새 배열 규칙 — ADR-033

1. 서비스별 블록을 먼저 만든다.
2. 각 서비스 블록 안에서 `기본 개념 → 주요 기능/갈림길 → 세부 기능·설정·한계` 순으로 배치한다.
3. 같은 하위 기능에 속한 개념은 가능한 한 연속해서 둔다.
4. 둘 이상의 서비스를 비교하는 개념은 비교 대상 서비스 블록이 모두 나온 뒤에 둔다.
5. 어떤 개념이 다른 개념을 이해의 전제로 삼는다면 전제 개념을 먼저 둔다. 이 규칙은 위 규칙보다
   우선한다.

서비스가 하나뿐인 주제는 하위 기능을 블록으로 삼는다. 주요 기능에 세부가 딸려 있으면 그 기능을
가운데 층의 끝, 자기 세부 바로 앞에 둔다.

**주제별 새 순서는 아래 「주제별 명세」에 개념 id 전부로 정해져 있다. 그대로 적용한다.**
순서를 다시 설계하지 마라 — 규칙에 맞춰 사람이 검토해 정한 순서다.

## 읽어야 할 파일

- `docs/ADR.md` — ADR-033과 ADR-023
- `docs/ARCHITECTURE.md` — 「주제 안의 개념 배열은 서비스 블록 순서다」 절
- `src/data/data.test.ts` — 아래 주제들의 순서 단언(현재 제목으로 찾는다)
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` — 머리 주석
- `phases/34-service-block-order/verify-order.mjs` — 머리 주석(무엇을 검사하는지)
- `phases/34-service-block-order/step1.md` — 표본 5개 주제를 같은 방법으로 옮긴 step

## 작업 — 테스트를 먼저 바꾼다

### 1. `src/data/data.test.ts` — 순서 단언 5개

아래 「주제별 명세」의 **현재 테스트 제목**으로 `it` 블록을 찾아, 그 블록 **전체**를 명세의 코드
블록으로 바꾼다. 이 블록들 말고는 한 줄도 바꾸지 않는다 — 같은 파일에 이 주제들을 다루는 다른
테스트(갈림길이 한 주제 안에 있는지, 용어가 풀리는지 등)가 있지만 **건드리지 않는다.**

바꾼 뒤 `npm test`를 돌려 **이 5개 테스트가 실패하는 것을 확인한다.** 데이터가 아직 옛 순서라서
실패해야 맞다. 다른 테스트가 실패하면 네가 무엇을 잘못 건드린 것이다.

### 2. `src/data/topics.json` — 개념 줄을 옮긴다

- 개념 하나가 **정확히 한 줄**이고 `      {"id":"`(공백 6칸)로 시작한다. 한 주제의 개념 줄들은
  `"concepts": [` 줄과 `    ]` 줄 사이에 연달아 있다. **그 안에서 줄의 자리만 바꾼다.**
- 주제의 **마지막 개념 줄만 끝에 쉼표가 없고** 나머지는 `},`로 끝난다. 옮긴 뒤 이 규칙에 맞게
  **끝 쉼표만** 고친다.
- 줄 안의 글자는 한 글자도 바꾸지 마라.
- 파일 전체를 `JSON.stringify`로 다시 쓰지 마라. 개념 한 줄 포맷이 깨져 `check-structure.mjs`가
  실패하고, `verify-order.mjs`의 줄 구성 검사가 순서 외 변경으로 잡는다.
- 줄을 옮기는 스크립트를 쓰면 `node - <<'EOF' … EOF`처럼 한 번 실행하고 끝낸다. **저장소 안에 임시
  파일을 만들지 마라** — 하네스가 `git add -A`로 커밋하므로 그 파일까지 커밋된다.

### 3. `scripts/topics-baseline.json` — 스냅샷의 개념 순서를 맞춘다

- 이 파일은 파싱한 객체를 `JSON.stringify(obj, null, 1) + '\n'`로 쓰면 **원본과 글자까지 똑같이**
  나온다. 그러니 파싱해서 **이 step 주제들의 `concepts` 배열만** `topics.json`과 같은 순서로
  재배열하고, 이 형식으로 다시 쓴다.
- 개념 항목은 `{"id", "name"}` 두 키뿐이다. id·name과 다른 키(`note`·`conceptLineCount`·
  `questionsSha256`·주제 메타데이터)는 **그대로 둔다.** 항목을 새로 만들지 말고 기존 항목 객체를
  옮긴다.
- **`node scripts/sync-baseline.mjs`를 돌리지 마라.** 순서 변경을 거부하도록 만든 도구다.

## 선행 관계와 충돌하면 — 멈춘다

명세의 순서를 적용하다가 어떤 개념의 본문이 **자기보다 뒤에 오는 개념을 이해의 전제로 삼는
것**을 발견하면(규칙 5와 부딪힘), **순서를 임의로 바꾸지 마라.** 그 자리에서 멈춘다:
`phases/34-service-block-order/index.json`에서 이 step의 `status`를 `"blocked"`로 두고
`blocked_reason`을 `선행 충돌:`로 시작하는 문장으로 적는다 — 주제, 두 개념 id, 본문의 어느 문장이
전제를 요구하는지. 이미 고친 파일은 그대로 둔다. 무인 실행이 여기서 멈추고 사람이 판단한다.

아래는 이미 알고 있는 것이고 **충돌이 아니다.** 순서를 바꾸지 말고 멈추지도 마라.

- `waf-shield.waf-rate-based-rule`·`waf-shield.waf-bot-control`·`waf-shield.waf-body-inspection-size-limit`(WAF 블록)이 Shield를 대비로 언급한다 — Shield 블록보다 앞이다. WAF와 Shield는 서로를 대비로 부르는 짝이라 어느 쪽을 앞에 두어도 남는다.
- `organizations-cloudtrail-config.organizations-tag-policy`(Organizations 블록)가 "AWS Config는 이 둘과 하는 일이 다르다"로 Config를 언급한다 — Config 블록보다 앞이다.
- `cost-management.budget-actions`(Budgets 블록)가 "Cost Anomaly Detection은 평소와 다른 지출을 알아채며"로 Cost Anomaly Detection을 언급한다 — 그 블록보다 앞이다.

이것들은 "X는 이 일을 하지 않는다" 식의 대비 문장이고 같은 문장 안에서 X가 무엇인지 말한다. ADR-033 「트레이드오프」에 적힌 잔여다.

- `organizations-cloudtrail-config.organizations-tag-policy`가 "둘을 각각 알맞은 조직 단위에 붙이는 것이 답이다"로 조직 단위를 쓴다 — 같은 블록의 `organizational-unit`보다 앞이다. 이 개념의 요점은 태그 정책과 SCP의 분업이고, 조직 단위에 붙이는 방식은 `organizational-unit`이 곧이어 다룬다.

이것들은 뒤 개념이 다루는 말을 먼저 쓰지만 말 자체가 뜻을 드러내고, 그 개념의 요점이 그 말에 기대지 않는다. 전제가 아니고, 잔여 목록에도 넣지 않는다.

## 주제별 명세

`현재 자리`는 착수 시점 `topics.json`에서 그 주제 안의 몇 번째 개념인지다(1부터).

### `waf-shield` — 개념 15개, 자리가 바뀌는 개념 14개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | WAF | `waf-shield.waf` | WAF (Web Application Firewall) |
| 2 | 3 | WAF | `waf-shield.cloudfront` | CloudFront |
| 3 | 5 | WAF | `waf-shield.waf-attach-targets` | WAF를 붙일 수 있는 곳 |
| 4 | 6 | WAF | `waf-shield.waf-rule-types` | WAF 규칙의 종류 |
| 5 | 7 | WAF | `waf-shield.waf-managed-rule-groups` | WAF 관리형 규칙 그룹 |
| 6 | 8 | WAF | `waf-shield.waf-rate-based-rule` | WAF 속도 기반 규칙 |
| 7 | 9 | WAF | `waf-shield.waf-bot-control` | AWS WAF Bot Control |
| 8 | 13 | WAF | `waf-shield.waf-body-inspection-size-limit` | WAF가 검사하는 요청 본문의 크기 한도 |
| 9 | 14 | WAF | `waf-shield.waf-web-acl-region-must-match-rest-api` | REST API에 붙일 Web ACL의 리전 조건 |
| 10 | 15 | WAF | `waf-shield.waf-logging-to-firehose` | Firehose를 거쳐 S3로 가는 WAF 로그 |
| 11 | 2 | Shield | `waf-shield.shield` | Shield |
| 12 | 10 | Shield | `waf-shield.shield-standard-network-layer` | Shield Standard가 다루지 않는 계층 |
| 13 | 11 | Shield | `waf-shield.shield-advanced-drt` | Shield Advanced와 DRT |
| 14 | 12 | Shield | `waf-shield.shield-advanced-protection-group` | Shield Advanced 보호 그룹 |
| 15 | 4 | Firewall Manager | `waf-shield.firewall-manager` | AWS Firewall Manager |

현재 테스트 제목(이것으로 찾는다): `WAF·Shield 주제가 서비스 넷 다음에 규칙의 축과 검사의 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('WAF·Shield 주제가 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'waf-shield')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: WAF(10) → Shield(4) → Firewall Manager(1).
    // CloudFront 재소개는 WAF를 붙이는 자리(waf-attach-targets)가 멀티 오리진 CloudFront를 전제로 쓰므로
    // WAF 블록 안, 그 앞에 둔다(규칙 5). Firewall Manager는 WAF 규칙을 중앙에서 배포하므로 두 블록 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'waf-shield.waf',
      'waf-shield.cloudfront',
      'waf-shield.waf-attach-targets',
      'waf-shield.waf-rule-types',
      'waf-shield.waf-managed-rule-groups',
      'waf-shield.waf-rate-based-rule',
      'waf-shield.waf-bot-control',
      'waf-shield.waf-body-inspection-size-limit',
      'waf-shield.waf-web-acl-region-must-match-rest-api',
      'waf-shield.waf-logging-to-firehose',
      'waf-shield.shield',
      'waf-shield.shield-standard-network-layer',
      'waf-shield.shield-advanced-drt',
      'waf-shield.shield-advanced-protection-group',
      'waf-shield.firewall-manager',
    ])
  })
```

### `guardduty-macie-inspector` — 개념 11개, 자리가 바뀌는 개념 10개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | GuardDuty | `guardduty-macie-inspector.guardduty` | GuardDuty |
| 2 | 6 | GuardDuty | `guardduty-macie-inspector.guardduty-db-login` | GuardDuty의 데이터베이스 로그인 이상 탐지 |
| 3 | 10 | GuardDuty | `guardduty-macie-inspector.guardduty-finding-to-eventbridge` | GuardDuty 탐지 결과를 자동 대응으로 잇는 EventBridge |
| 4 | 2 | Macie | `guardduty-macie-inspector.macie` | Macie |
| 5 | 7 | Macie | `guardduty-macie-inspector.macie-automated-discovery` | Macie의 민감 데이터 자동 탐지 |
| 6 | 9 | Macie | `guardduty-macie-inspector.macie-delegated-administrator` | 조직 전체를 보는 Macie 위임 관리자 계정 |
| 7 | 11 | Macie | `guardduty-macie-inspector.macie-finding-to-eventbridge` | Macie 탐지 결과를 알림으로 잇는 EventBridge |
| 8 | 3 | Inspector | `guardduty-macie-inspector.amazon-inspector` | Amazon Inspector |
| 9 | 8 | Inspector | `guardduty-macie-inspector.inspector-scans-ecr-images` | Inspector의 ECR 컨테이너 이미지 스캔 |
| 10 | 4 | Security Hub | `guardduty-macie-inspector.security-hub` | AWS Security Hub |
| 11 | 5 | 비교 — 헷갈리는 보안 서비스 넷 | `guardduty-macie-inspector.security-service-lineup` | 헷갈리기 쉬운 보안 서비스 네 가지 |

현재 테스트 제목(이것으로 찾는다): `탐지 주제가 서비스 넷 다음에 각각 무엇을 찾는가와 조직 설정을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('탐지 주제가 GuardDuty·Macie·Inspector·Security Hub 블록 다음에 넷의 비교를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'guardduty-macie-inspector')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: GuardDuty(3) → Macie(4) → Inspector(2) → Security Hub(1) → 비교 — 헷갈리는 보안 서비스 넷(1).
    // 헷갈리는 보안 서비스 넷은 네 블록을 가르는 비교라 네 블록 뒤(규칙 4).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'guardduty-macie-inspector.guardduty',
      'guardduty-macie-inspector.guardduty-db-login',
      'guardduty-macie-inspector.guardduty-finding-to-eventbridge',
      'guardduty-macie-inspector.macie',
      'guardduty-macie-inspector.macie-automated-discovery',
      'guardduty-macie-inspector.macie-delegated-administrator',
      'guardduty-macie-inspector.macie-finding-to-eventbridge',
      'guardduty-macie-inspector.amazon-inspector',
      'guardduty-macie-inspector.inspector-scans-ecr-images',
      'guardduty-macie-inspector.security-hub',
      'guardduty-macie-inspector.security-service-lineup',
    ])
  })
```

### `identity-federation` — 개념 11개, 자리가 바뀌는 개념 9개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | IAM Identity Center | `identity-federation.identity-center` | IAM Identity Center |
| 2 | 6 | IAM Identity Center | `identity-federation.identity-center-external-idp` | IAM Identity Center와 외부 IdP의 연결 |
| 3 | 10 | IAM Identity Center | `identity-federation.identity-center-permission-set` | 권한 세트 |
| 4 | 2 | STS | `identity-federation.sts` | STS (Security Token Service) |
| 5 | 5 | STS | `identity-federation.sts-assume-role` | STS로 임시 자격 증명 받기 |
| 6 | 4 | Directory Service | `identity-federation.aws-directory-service` | AWS Directory Service와 AD Connector |
| 7 | 9 | 페더레이션 — ID 브로커와 SAML 2.0 | `identity-federation.custom-identity-broker-for-non-saml` | 사용자 지정 ID 브로커 |
| 8 | 11 | 페더레이션 — ID 브로커와 SAML 2.0 | `identity-federation.saml-federation-role-to-ad-group-mapping` | SAML 2.0 페더레이션과 IAM 역할의 AD 그룹 매핑 |
| 9 | 3 | Cognito | `identity-federation.cognito` | Cognito |
| 10 | 7 | Cognito | `identity-federation.cognito-pools` | Cognito 사용자 풀과 자격 증명 풀 |
| 11 | 8 | Cognito | `identity-federation.cognito-social-idp-federation` | Cognito 사용자 풀과 소셜 로그인 연동 |

현재 테스트 제목(이것으로 찾는다): `자격 증명 페더레이션 주제가 서비스 넷 다음에 누구를 어떻게 들이는가를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('자격 증명 페더레이션 주제가 Identity Center·STS·Directory Service·페더레이션·Cognito 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'identity-federation')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: IAM Identity Center(3) → STS(2) → Directory Service(1) → 페더레이션 — ID 브로커와 SAML 2.0(2) →
    //   Cognito(3).
    // 페더레이션 블록은 사내 디렉터리를 STS와 SAML로 잇는 두 방식이라 STS·Directory Service 뒤.
    // 앱 사용자를 다루는 Cognito는 사내 사용자 쪽 블록을 다 본 뒤에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'identity-federation.identity-center',
      'identity-federation.identity-center-external-idp',
      'identity-federation.identity-center-permission-set',
      'identity-federation.sts',
      'identity-federation.sts-assume-role',
      'identity-federation.aws-directory-service',
      'identity-federation.custom-identity-broker-for-non-saml',
      'identity-federation.saml-federation-role-to-ad-group-mapping',
      'identity-federation.cognito',
      'identity-federation.cognito-pools',
      'identity-federation.cognito-social-idp-federation',
    ])
  })
```

### `organizations-cloudtrail-config` — 개념 16개, 자리가 바뀌는 개념 15개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Organizations와 SCP | `organizations-cloudtrail-config.organizations-scp` | AWS Organizations와 SCP |
| 2 | 7 | Organizations와 SCP | `organizations-cloudtrail-config.organizations-tag-policy` | 태그 정책과 SCP |
| 3 | 8 | Organizations와 SCP | `organizations-cloudtrail-config.organizations-consolidated-billing` | Organizations의 통합 청구 |
| 4 | 6 | Organizations와 SCP | `organizations-cloudtrail-config.organizational-unit` | 조직 단위(OU) |
| 5 | 11 | Organizations와 SCP | `organizations-cloudtrail-config.scp-attachment-targets` | SCP를 붙일 수 있는 자리 |
| 6 | 12 | Organizations와 SCP | `organizations-cloudtrail-config.scp-condition-exception` | SCP에서 예외를 두는 방법 |
| 7 | 4 | AWS Config | `organizations-cloudtrail-config.aws-config` | AWS Config |
| 8 | 10 | AWS Config | `organizations-cloudtrail-config.config-configuration-recorder` | 구성 레코더 |
| 9 | 14 | AWS Config | `organizations-cloudtrail-config.config-conformance-pack` | AWS Config 준수 팩 |
| 10 | 15 | AWS Config | `organizations-cloudtrail-config.config-custom-rule` | AWS Config 사용자 지정 규칙 |
| 11 | 16 | AWS Config | `organizations-cloudtrail-config.config-rule-remediation` | AWS Config 규칙과 자동 수정 |
| 12 | 2 | CloudTrail | `organizations-cloudtrail-config.cloudtrail` | CloudTrail |
| 13 | 3 | CloudTrail | `organizations-cloudtrail-config.cloudtrail-lake` | AWS CloudTrail Lake |
| 14 | 9 | CloudTrail | `organizations-cloudtrail-config.cloudtrail-data-events` | 관리 이벤트와 데이터 이벤트 |
| 15 | 13 | CloudTrail | `organizations-cloudtrail-config.cloudtrail-log-file-validation` | CloudTrail 로그 파일 유효성 검사 |
| 16 | 5 | Audit Manager | `organizations-cloudtrail-config.audit-manager` | AWS Audit Manager |

현재 테스트 제목(이것으로 찾는다): `조직·감사 주제가 서비스 다섯 다음에 무엇을 기록하는가와 설정 항목을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('조직·감사 주제가 Organizations·Config·CloudTrail·Audit Manager 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'organizations-cloudtrail-config')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: Organizations와 SCP(6) → AWS Config(5) → CloudTrail(4) → Audit Manager(1).
    // Organizations 블록: 태그 정책·통합 청구 다음에 조직 단위를 두어 SCP를 붙이는 자리·예외(세부)와
    // 붙인다(주요 기능을 가운데 층의 끝에). CloudTrail 로그 파일 유효성 검사가 Config 규칙을 쓰므로
    // Config를 CloudTrail 앞에 둔다. Audit Manager는 구성 변경 추적 도구가 아니라는 대비로 Config 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'organizations-cloudtrail-config.organizations-scp',
      'organizations-cloudtrail-config.organizations-tag-policy',
      'organizations-cloudtrail-config.organizations-consolidated-billing',
      'organizations-cloudtrail-config.organizational-unit',
      'organizations-cloudtrail-config.scp-attachment-targets',
      'organizations-cloudtrail-config.scp-condition-exception',
      'organizations-cloudtrail-config.aws-config',
      'organizations-cloudtrail-config.config-configuration-recorder',
      'organizations-cloudtrail-config.config-conformance-pack',
      'organizations-cloudtrail-config.config-custom-rule',
      'organizations-cloudtrail-config.config-rule-remediation',
      'organizations-cloudtrail-config.cloudtrail',
      'organizations-cloudtrail-config.cloudtrail-lake',
      'organizations-cloudtrail-config.cloudtrail-data-events',
      'organizations-cloudtrail-config.cloudtrail-log-file-validation',
      'organizations-cloudtrail-config.audit-manager',
    ])
  })
```

### `cost-management` — 개념 17개, 자리가 바뀌는 개념 15개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | 약정 할인 | `cost-management.savings-plan` | 절약 플랜 (Savings Plan) |
| 2 | 9 | 약정 할인 | `cost-management.savings-plan-details` | 절약 플랜의 적용 범위와 결제 옵션 |
| 3 | 10 | 약정 할인 | `cost-management.savings-plan-baseline-vs-spike` | 기본 부하와 일시적 증가분의 약정 크기 |
| 4 | 11 | 약정 할인 | `cost-management.rds-reserved-instance` | RDS 예약 인스턴스 |
| 5 | 12 | 약정 할인 | `cost-management.on-demand-capacity-reservation` | 온디맨드 용량 예약 |
| 6 | 3 | Cost Explorer·결제 콘솔·비용 할당 태그 | `cost-management.cost-explorer` | Cost Explorer |
| 7 | 6 | Cost Explorer·결제 콘솔·비용 할당 태그 | `cost-management.billing-and-cost-management` | Billing and Cost Management |
| 8 | 13 | Cost Explorer·결제 콘솔·비용 할당 태그 | `cost-management.cost-allocation-tag-activation` | 결제 콘솔에서 하는 비용 할당 태그 활성화 |
| 9 | 14 | Cost Explorer·결제 콘솔·비용 할당 태그 | `cost-management.cost-allocation-tag-activation-in-management-account` | 통합 청구에서 비용 할당 태그를 활성화하는 계정 |
| 10 | 2 | AWS Budgets | `cost-management.aws-budgets` | AWS Budgets |
| 11 | 15 | AWS Budgets | `cost-management.budget-actions` | AWS Budgets의 예산 조치 |
| 12 | 16 | AWS Budgets | `cost-management.budget-forecasted-alert` | 예상 지출에 거는 예산 알림 |
| 13 | 4 | Cost Anomaly Detection | `cost-management.cost-anomaly-detection` | Cost Anomaly Detection |
| 14 | 5 | 비용 및 사용량 보고서 | `cost-management.cost-and-usage-report` | AWS 비용 및 사용량 보고서(CUR) |
| 15 | 7 | 권장 도구 — Trusted Advisor·Compute Optimizer | `cost-management.trusted-advisor` | Trusted Advisor |
| 16 | 8 | 권장 도구 — Trusted Advisor·Compute Optimizer | `cost-management.compute-optimizer` | AWS Compute Optimizer |
| 17 | 17 | 권장 도구 — Trusted Advisor·Compute Optimizer | `cost-management.compute-optimizer-ebs-recommendations` | Compute Optimizer의 EBS 볼륨 권장 사항 |

현재 테스트 제목(이것으로 찾는다): `비용 관리 주제가 도구 여덟 다음에 약정의 크기와 설정 항목을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('비용 관리 주제가 약정·비용 조회·예산·이상 탐지·보고서·권장 도구 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'cost-management')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: 약정 할인(5) → Cost Explorer·결제 콘솔·비용 할당 태그(4) → AWS Budgets(3) → Cost Anomaly Detection(1) → 비용
    //   및 사용량 보고서(1) → 권장 도구 — Trusted Advisor·Compute Optimizer(3).
    // Cost Anomaly Detection은 '예산 초과가 아닌'으로 정의되므로 Budgets 뒤. 비용 및 사용량 보고서는
    // Cost Explorer·Budgets와 대비하므로 둘 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'cost-management.savings-plan',
      'cost-management.savings-plan-details',
      'cost-management.savings-plan-baseline-vs-spike',
      'cost-management.rds-reserved-instance',
      'cost-management.on-demand-capacity-reservation',
      'cost-management.cost-explorer',
      'cost-management.billing-and-cost-management',
      'cost-management.cost-allocation-tag-activation',
      'cost-management.cost-allocation-tag-activation-in-management-account',
      'cost-management.aws-budgets',
      'cost-management.budget-actions',
      'cost-management.budget-forecasted-alert',
      'cost-management.cost-anomaly-detection',
      'cost-management.cost-and-usage-report',
      'cost-management.trusted-advisor',
      'cost-management.compute-optimizer',
      'cost-management.compute-optimizer-ebs-recommendations',
    ])
  })
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 4
```

`verify-order.mjs 4`이 보는 것 — 사용자가 매 배치에 검증하라고 한 항목 그대로다.

- 개념 누락·중복 0, 주제별 concept id 집합이 착수 시점과 같다.
- 문항 해시가 착수 시점 `aadc1894…`와 같다 — 문항·보기·해설·answerIndex·문항 배열 변경 0.
- 순서와 무관한 내용 해시가 착수 시점 `8e67f789…`와 같다 — 개념 본문 문자열 변경 0.
- `topics.json`과 `topics-baseline.json`에서 바뀐 것이 줄의 자리(와 끝 쉼표)뿐이다.
- 순서가 바뀐 주제가 정확히 step 1~4에서 명세한 주제들이다.
- 순서가 바뀐 주제마다 서비스 왕복 before → after를 찍고, after가 0이 아니면 실패한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data.test.ts`에서 바뀐 것이 명세한 `it` 블록뿐인가?
   - 명세한 주제 말고 다른 주제의 개념 순서가 그대로인가? (`verify-order.mjs`가 본다)
   - 저장소에 새 파일이 생기지 않았는가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 4을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 아래를 적는다.
     - 주제마다 `자리 바뀐 개념 수`와 `왕복 before → after` — `verify-order.mjs 4`의 이 step 주제 출력
     - "선행 충돌 없음"
     - AC 결과(테스트 수 포함)
   - 선행 충돌 → 위 「선행 관계와 충돌하면」대로 `"blocked"`
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- 명세한 5개 주제 말고 다른 주제의 개념 순서를 바꾸지 마라. 이유: step마다 재정렬할 주제가
  정해져 있고, `verify-order.mjs`가 그 목록과 다르면 실패한다.
- 개념 줄 안의 글자, `questions.json`, 주제 메타데이터를 바꾸지 마라. 이유: 이 phase는 순서만
  바꾼다. 해시 검사가 잡는다.
- `data.test.ts`에서 명세한 `it` 블록 말고는 고치지 말고, 새 테스트를 넣지 마라. 이유: 사용자가
  순서 단언 갱신만 허용했다.
- `node scripts/sync-baseline.mjs`를 돌리지 마라. 이유: 순서 변경을 거부하도록 만든 도구다.
  스냅샷은 위 3번 방법으로만 고친다.
- 명세의 순서를 바꾸거나 "더 나은" 순서로 다시 설계하지 마라. 이유: 규칙에 맞춰 검토해 정한
  순서다. 규칙과 부딪히는 것이 보이면 멈춘다.
- `docs/`, `phases/NEXT.md`, `docs/source/dump-gaps/topic-plan.md`, 이 phase의 step 문서와
  `verify-order.mjs`를 건드리지 마라. 이유: 규칙 문서는 step 0이 끝냈고, 나머지는 사용자가 건드리지
  말라고 했거나 이 phase의 명세다.
- 저장소 안에 임시 파일을 만들지 마라. 이유: 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
