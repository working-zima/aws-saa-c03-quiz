# Step 6: minor-ops-reorder

**6개 주제의 개념을 서비스 블록 순서로 옮긴다** — `backup-disaster-recovery`·`route53`·`iam-permissions`·`governance-iac`·`systems-manager`·`ai-ml-services`.

이 step은 사람이 중간에 확인하지 않는 무인 실행으로 돈다. 아래 명세와 AC를 정확히 지키고,
명세와 부딪히는 것을 발견하면 추측으로 넘기지 말고 멈춰라(아래 「선행 관계와 충돌하면」).
**이 6개 말고 다른 주제의 순서는 건드리지 않는다.** 앞 step에서 이미 재정렬한 주제도 다시
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
| `src/data/topics.json` | 아래 6개 주제의 개념 **줄의 자리**와 그에 따른 끝 쉼표 |
| `src/data/data.test.ts` | 아래 6개 주제의 순서 단언 `it` 블록(제목·주석·기대 배열) |
| `scripts/topics-baseline.json` | 아래 6개 주제의 `concepts` 항목 순서 |

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

### 1. `src/data/data.test.ts` — 순서 단언 6개

아래 「주제별 명세」의 **현재 테스트 제목**으로 `it` 블록을 찾아, 그 블록 **전체**를 명세의 코드
블록으로 바꾼다. 이 블록들 말고는 한 줄도 바꾸지 않는다 — 같은 파일에 이 주제들을 다루는 다른
테스트(갈림길이 한 주제 안에 있는지, 용어가 풀리는지 등)가 있지만 **건드리지 않는다.**

바꾼 뒤 `npm test`를 돌려 **이 6개 테스트가 실패하는 것을 확인한다.** 데이터가 아직 옛 순서라서
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

이 step의 주제에는 알려진 잔여 교차 언급이 없다.

## 주제별 명세

`현재 자리`는 착수 시점 `topics.json`에서 그 주제 안의 몇 번째 개념인지다(1부터).

### `backup-disaster-recovery` — 개념 11개, 자리가 바뀌는 개념 10개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | AWS Backup | `backup-disaster-recovery.backup` | AWS Backup |
| 2 | 5 | AWS Backup | `backup-disaster-recovery.backup-long-term-retention` | AWS Backup으로 넘어가야 하는 순간 |
| 3 | 6 | AWS Backup | `backup-disaster-recovery.backup-ec2-resource-assignment` | 백업 계획의 리소스로 지정하는 EC2 인스턴스 |
| 4 | 7 | AWS Backup | `backup-disaster-recovery.organizations-backup-policy` | Organizations의 백업 정책 |
| 5 | 8 | AWS Backup | `backup-disaster-recovery.backup-cross-account-copy` | 다른 계정에 두는 백업 사본 |
| 6 | 9 | AWS Backup | `backup-disaster-recovery.backup-s3-continuous-backup` | S3의 연속 백업과 특정 시점 복원 |
| 7 | 10 | AWS Backup | `backup-disaster-recovery.backup-restore-testing-plan` | AWS Backup의 복원 테스트 계획 |
| 8 | 11 | AWS Backup | `backup-disaster-recovery.backup-audit-manager` | AWS Backup Audit Manager |
| 9 | 3 | 재해 복구 전략 | `backup-disaster-recovery.backup-and-restore-dr` | 백업 및 복원 |
| 10 | 4 | 재해 복구 전략 | `backup-disaster-recovery.warm-standby-for-low-rto` | 짧은 RTO가 요구하는 대기 리전 구성 |
| 11 | 2 | Elastic Disaster Recovery | `backup-disaster-recovery.elastic-disaster-recovery` | AWS Elastic Disaster Recovery(AWS DRS) |

현재 테스트 제목(이것으로 찾는다): `백업·재해 복구 주제가 서비스와 전략 넷 다음에 갈림길과 검증을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('백업·재해 복구 주제가 AWS Backup·재해 복구 전략·Elastic Disaster Recovery 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'backup-disaster-recovery')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: AWS Backup(8) → 재해 복구 전략(2) → Elastic Disaster Recovery(1).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'backup-disaster-recovery.backup',
      'backup-disaster-recovery.backup-long-term-retention',
      'backup-disaster-recovery.backup-ec2-resource-assignment',
      'backup-disaster-recovery.organizations-backup-policy',
      'backup-disaster-recovery.backup-cross-account-copy',
      'backup-disaster-recovery.backup-s3-continuous-backup',
      'backup-disaster-recovery.backup-restore-testing-plan',
      'backup-disaster-recovery.backup-audit-manager',
      'backup-disaster-recovery.backup-and-restore-dr',
      'backup-disaster-recovery.warm-standby-for-low-rto',
      'backup-disaster-recovery.elastic-disaster-recovery',
    ])
  })
```

### `route53` — 개념 13개, 자리가 바뀌는 개념 10개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Route 53 | `route53.route53` | Route 53 |
| 2 | 2 | 라우팅 정책 | `route53.routing-policies` | Route 53 라우팅 정책 |
| 3 | 6 | 라우팅 정책 | `route53.route53-failover-routing` | 페일오버 라우팅 정책 |
| 4 | 7 | 라우팅 정책 | `route53.multi-region-failover-for-region-outage` | 리전 장애에 대비하는 다중 리전 장애 조치 |
| 5 | 8 | 라우팅 정책 | `route53.latency-record-for-non-aws-endpoint` | AWS 밖 엔드포인트의 지연 시간 레코드 |
| 6 | 12 | 라우팅 정책 | `route53.multivalue-answer-details` | 다중값 응답 라우팅의 세부 동작 |
| 7 | 3 | Resolver | `route53.resolver` | Route 53 Resolver |
| 8 | 11 | Resolver | `route53.route53-resolver-forward-rule` | 전달 규칙과 VPC 연결 |
| 9 | 4 | 호스팅 영역과 레코드 | `route53.private-hosted-zone` | 프라이빗 호스팅 영역과 퍼블릭 호스팅 영역 |
| 10 | 5 | 호스팅 영역과 레코드 | `route53.route53-zone-file-import` | DNS 호스팅을 Route 53으로 옮기는 절차 |
| 11 | 9 | 호스팅 영역과 레코드 | `route53.route53-alias-record` | 별칭 레코드 |
| 12 | 10 | 호스팅 영역과 레코드 | `route53.private-hosted-zone-vpc-only` | 프라이빗 호스팅 영역의 연결 대상 |
| 13 | 13 | 쿼리 로깅 | `route53.route53-query-logging` | Route 53 쿼리 로깅 |

현재 테스트 제목(이것으로 찾는다): `Route 53 주제가 서비스와 정책 소개 다음에 갈림길과 세부 동작을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('Route 53 주제가 라우팅 정책·Resolver·호스팅 영역·쿼리 로깅 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'route53')

    // ADR-033 하위 기능 블록 순서 — 서비스가 하나라 하위 기능이 블록이다. 블록마다 기본 → 갈림길 → 세부.
    // 블록: Route 53(1) → 라우팅 정책(5) → Resolver(2) → 호스팅 영역과 레코드(4) → 쿼리 로깅(1).
    // 프라이빗 호스팅 영역이 Resolver 아웃바운드 엔드포인트를 언급하므로 Resolver를 호스팅 영역 앞에 둔다(규칙 5).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'route53.route53',
      'route53.routing-policies',
      'route53.route53-failover-routing',
      'route53.multi-region-failover-for-region-outage',
      'route53.latency-record-for-non-aws-endpoint',
      'route53.multivalue-answer-details',
      'route53.resolver',
      'route53.route53-resolver-forward-rule',
      'route53.private-hosted-zone',
      'route53.route53-zone-file-import',
      'route53.route53-alias-record',
      'route53.private-hosted-zone-vpc-only',
      'route53.route53-query-logging',
    ])
  })
```

### `iam-permissions` — 개념 18개, 자리가 바뀌는 개념 14개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | IAM | `iam-permissions.iam` | IAM (Identity And Access Management) |
| 2 | 3 | 사용자와 그룹 | `iam-permissions.iam-group-policy-attachment` | IAM 그룹에 붙이는 정책 |
| 3 | 11 | 사용자와 그룹 | `iam-permissions.iam-group-users-only` | 사용자 집합인 IAM 그룹 |
| 4 | 12 | 사용자와 그룹 | `iam-permissions.iam-user-is-account-scoped` | 계정 안에서만 존재하는 IAM 사용자 |
| 5 | 2 | 역할 | `iam-permissions.instance-profile` | IAM 인스턴스 프로파일 |
| 6 | 4 | 역할 | `iam-permissions.iam-roles-anywhere` | IAM Roles Anywhere |
| 7 | 10 | 역할 | `iam-permissions.cross-account-iam-role` | 계정 간 IAM 역할과 신뢰 정책 |
| 8 | 7 | 정책 — 권한을 좁히는 장치와 평가 규칙 | `iam-permissions.least-privilege` | 최소 권한 원칙 (Least Privilege) |
| 9 | 8 | 정책 — 권한을 좁히는 장치와 평가 규칙 | `iam-permissions.abac` | 속성 기반 액세스 제어(ABAC) |
| 10 | 9 | 정책 — 권한을 좁히는 장치와 평가 규칙 | `iam-permissions.permissions-boundary` | 권한 경계 |
| 11 | 13 | 정책 — 권한을 좁히는 장치와 평가 규칙 | `iam-permissions.iam-explicit-deny-precedence` | 정책 평가 순서와 명시적 거부 |
| 12 | 14 | 정책 — 권한을 좁히는 장치와 평가 규칙 | `iam-permissions.iam-notaction-deny` | NotAction을 쓴 Deny 문 |
| 13 | 15 | 정책 — 권한을 좁히는 장치와 평가 규칙 | `iam-permissions.iam-requested-region-condition` | aws:RequestedRegion 조건 키 |
| 14 | 5 | 분석 도구 | `iam-permissions.iam-access-analyzer` | IAM Access Analyzer |
| 15 | 6 | 분석 도구 | `iam-permissions.network-access-analyzer` | Network Access Analyzer |
| 16 | 16 | 분석 도구 | `iam-permissions.access-analyzer-delegated-administrator` | Access Analyzer의 위임 관리자 계정 |
| 17 | 17 | 루트 사용자 | `iam-permissions.root-user-multiple-mfa` | 루트 사용자에 여러 개 등록하는 MFA 장치 |
| 18 | 18 | 루트 사용자 | `iam-permissions.root-user-cannot-be-disabled` | 비활성화할 수 없는 루트 사용자 |

현재 테스트 제목(이것으로 찾는다): `IAM 권한 주제가 구성 요소 다음에 권한을 좁히는 장치와 평가 규칙을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('IAM 권한 주제가 사용자와 그룹·역할·정책·분석 도구·루트 사용자 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'iam-permissions')

    // ADR-033 하위 기능 블록 순서 — 서비스가 하나라 하위 기능이 블록이다. 블록마다 기본 → 갈림길 → 세부.
    // 블록: IAM(1) → 사용자와 그룹(3) → 역할(3) → 정책 — 권한을 좁히는 장치와 평가 규칙(6) → 분석 도구(3) → 루트 사용자(2).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'iam-permissions.iam',
      'iam-permissions.iam-group-policy-attachment',
      'iam-permissions.iam-group-users-only',
      'iam-permissions.iam-user-is-account-scoped',
      'iam-permissions.instance-profile',
      'iam-permissions.iam-roles-anywhere',
      'iam-permissions.cross-account-iam-role',
      'iam-permissions.least-privilege',
      'iam-permissions.abac',
      'iam-permissions.permissions-boundary',
      'iam-permissions.iam-explicit-deny-precedence',
      'iam-permissions.iam-notaction-deny',
      'iam-permissions.iam-requested-region-condition',
      'iam-permissions.iam-access-analyzer',
      'iam-permissions.network-access-analyzer',
      'iam-permissions.access-analyzer-delegated-administrator',
      'iam-permissions.root-user-multiple-mfa',
      'iam-permissions.root-user-cannot-be-disabled',
    ])
  })
```

### `governance-iac` — 개념 7개, 자리가 바뀌는 개념 6개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | CloudFormation | `governance-iac.cloudformation` | AWS CloudFormation |
| 2 | 7 | CloudFormation | `governance-iac.cloudformation-drift-detection` | CloudFormation 드리프트 감지 |
| 3 | 2 | Service Catalog | `governance-iac.service-catalog` | AWS Service Catalog |
| 4 | 3 | Control Tower | `governance-iac.control-tower-landing-zone` | Control Tower의 랜딩 존 |
| 5 | 6 | Control Tower | `governance-iac.control-tower-controls` | Control Tower의 사전 예방적 제어와 탐지 제어 |
| 6 | 4 | RAM | `governance-iac.resource-access-manager` | AWS Resource Access Manager(AWS RAM) |
| 7 | 5 | Workload Discovery | `governance-iac.workload-discovery` | Workload Discovery on AWS |

현재 테스트 제목(이것으로 찾는다): `거버넌스·IaC 주제가 서비스 넷 다음에 제어의 시점과 감지 범위를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('거버넌스·IaC 주제가 CloudFormation·Service Catalog·Control Tower·RAM·Workload Discovery 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'governance-iac')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: CloudFormation(2) → Service Catalog(1) → Control Tower(2) → RAM(1) → Workload Discovery(1).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'governance-iac.cloudformation',
      'governance-iac.cloudformation-drift-detection',
      'governance-iac.service-catalog',
      'governance-iac.control-tower-landing-zone',
      'governance-iac.control-tower-controls',
      'governance-iac.resource-access-manager',
      'governance-iac.workload-discovery',
    ])
  })
```

### `systems-manager` — 개념 7개, 자리가 바뀌는 개념 6개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Systems Manager | `systems-manager.ssm-run-command` | Systems Manager Run Command |
| 2 | 3 | Systems Manager | `systems-manager.ssm-session-manager` | Systems Manager Session Manager |
| 3 | 5 | Systems Manager | `systems-manager.ssm-patch-manager` | Systems Manager Patch Manager |
| 4 | 6 | Systems Manager | `systems-manager.ssm-managed-instance-core-policy` | 관리형 인스턴스를 만드는 정책 |
| 5 | 7 | Systems Manager | `systems-manager.ssm-inventory` | Systems Manager Inventory |
| 6 | 4 | EC2 Instance Connect 엔드포인트 | `systems-manager.ec2-instance-connect-endpoint` | EC2 Instance Connect 엔드포인트 |
| 7 | 2 | AppConfig | `systems-manager.appconfig` | AWS AppConfig |

현재 테스트 제목(이것으로 찾는다): `Systems Manager 주제가 기능 둘 다음에 접속하는 두 길과 등록 조건을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('Systems Manager 주제가 Systems Manager·EC2 Instance Connect·AppConfig 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'systems-manager')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: Systems Manager(5) → EC2 Instance Connect 엔드포인트(1) → AppConfig(1).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'systems-manager.ssm-run-command',
      'systems-manager.ssm-session-manager',
      'systems-manager.ssm-patch-manager',
      'systems-manager.ssm-managed-instance-core-policy',
      'systems-manager.ssm-inventory',
      'systems-manager.ec2-instance-connect-endpoint',
      'systems-manager.appconfig',
    ])
  })
```

### `ai-ml-services` — 개념 6개, 자리가 바뀌는 개념 4개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | SageMaker AI | `ai-ml-services.sagemaker` | Amazon SageMaker AI |
| 2 | 5 | SageMaker AI | `ai-ml-services.sagemaker-autopilot` | SageMaker Autopilot |
| 3 | 2 | 음성·이미지·번역·문서 AI 서비스 | `ai-ml-services.media-ai-service-lineup` | 음성·이미지·번역·문서를 나눠 맡는 AI 서비스 넷 |
| 4 | 3 | Comprehend | `ai-ml-services.comprehend` | Amazon Comprehend |
| 5 | 4 | Lex | `ai-ml-services.amazon-lex` | Amazon Lex |
| 6 | 6 | 비교 — 훈련 없이 쓰는 콘텐츠 검토 | `ai-ml-services.rekognition-content-moderation` | Rekognition의 콘텐츠 검토 |

현재 테스트 제목(이것으로 찾는다): `AI·ML 주제가 서비스 소개 다음에 훈련이 필요한가와 검토의 쓰임을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('AI·ML 주제가 SageMaker·API로 부르는 AI 서비스 블록 다음에 훈련 없이 쓰는 검토를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ai-ml-services')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: SageMaker AI(2) → 음성·이미지·번역·문서 AI 서비스(1) → Comprehend(1) → Lex(1) → 비교 — 훈련 없이 쓰는 콘텐츠 검토(1).
    // Rekognition의 콘텐츠 검토는 SageMaker·Comprehend와 대비하므로 맨 뒤(규칙 4).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ai-ml-services.sagemaker',
      'ai-ml-services.sagemaker-autopilot',
      'ai-ml-services.media-ai-service-lineup',
      'ai-ml-services.comprehend',
      'ai-ml-services.amazon-lex',
      'ai-ml-services.rekognition-content-moderation',
    ])
  })
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 6
```

`verify-order.mjs 6`이 보는 것 — 사용자가 매 배치에 검증하라고 한 항목 그대로다.

- 개념 누락·중복 0, 주제별 concept id 집합이 착수 시점과 같다.
- 문항 해시가 착수 시점 `aadc1894…`와 같다 — 문항·보기·해설·answerIndex·문항 배열 변경 0.
- 순서와 무관한 내용 해시가 착수 시점 `8e67f789…`와 같다 — 개념 본문 문자열 변경 0.
- `topics.json`과 `topics-baseline.json`에서 바뀐 것이 줄의 자리(와 끝 쉼표)뿐이다.
- 순서가 바뀐 주제가 정확히 step 1~6에서 명세한 주제들이다.
- 순서가 바뀐 주제마다 서비스 왕복 before → after를 찍고, after가 0이 아니면 실패한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data.test.ts`에서 바뀐 것이 명세한 `it` 블록뿐인가?
   - 명세한 주제 말고 다른 주제의 개념 순서가 그대로인가? (`verify-order.mjs`가 본다)
   - 저장소에 새 파일이 생기지 않았는가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 6을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 아래를 적는다.
     - 주제마다 `자리 바뀐 개념 수`와 `왕복 before → after` — `verify-order.mjs 6`의 이 step 주제 출력
     - "선행 충돌 없음"
     - AC 결과(테스트 수 포함)
   - 선행 충돌 → 위 「선행 관계와 충돌하면」대로 `"blocked"`
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- 명세한 6개 주제 말고 다른 주제의 개념 순서를 바꾸지 마라. 이유: step마다 재정렬할 주제가
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
