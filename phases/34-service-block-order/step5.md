# Step 5: minor-data-compute-reorder

**8개 주제의 개념을 서비스 블록 순서로 옮긴다** — `s3-versioning-lifecycle`·`s3-access-control`·`storage-gateway-migration`·`rds-storage-features`·`aurora`·`dynamodb`·`ec2-autoscaling`·`lambda`.

이 step은 사람이 중간에 확인하지 않는 무인 실행으로 돈다. 아래 명세와 AC를 정확히 지키고,
명세와 부딪히는 것을 발견하면 추측으로 넘기지 말고 멈춰라(아래 「선행 관계와 충돌하면」).
**이 8개 말고 다른 주제의 순서는 건드리지 않는다.** 앞 step에서 이미 재정렬한 주제도 다시
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
| `src/data/topics.json` | 아래 8개 주제의 개념 **줄의 자리**와 그에 따른 끝 쉼표 |
| `src/data/data.test.ts` | 아래 8개 주제의 순서 단언 `it` 블록(제목·주석·기대 배열) |
| `scripts/topics-baseline.json` | 아래 8개 주제의 `concepts` 항목 순서 |

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

### 1. `src/data/data.test.ts` — 순서 단언 8개

아래 「주제별 명세」의 **현재 테스트 제목**으로 `it` 블록을 찾아, 그 블록 **전체**를 명세의 코드
블록으로 바꾼다. 이 블록들 말고는 한 줄도 바꾸지 않는다 — 같은 파일에 이 주제들을 다루는 다른
테스트(갈림길이 한 주제 안에 있는지, 용어가 풀리는지 등)가 있지만 **건드리지 않는다.**

바꾼 뒤 `npm test`를 돌려 **이 8개 테스트가 실패하는 것을 확인한다.** 데이터가 아직 옛 순서라서
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

### `s3-versioning-lifecycle` — 개념 10개, 자리가 바뀌는 개념 8개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | 버전 관리 | `s3-versioning-lifecycle.versioning` | S3 버전 관리 |
| 2 | 2 | 객체 잠금 | `s3-versioning-lifecycle.object-lock` | S3 객체 잠금 |
| 3 | 9 | 객체 잠금 | `s3-versioning-lifecycle.object-lock-prerequisites` | 객체 잠금의 전제 조건과 MFA 삭제의 한계 |
| 4 | 3 | 수명 주기 정책 | `s3-versioning-lifecycle.lifecycle-policy` | S3 수명 주기 정책 |
| 5 | 10 | 수명 주기 정책 | `s3-versioning-lifecycle.s3-lifecycle-rules-and-size-filter` | 수명 주기 구성의 개수 제한과 규칙의 크기 필터 |
| 6 | 4 | 이벤트 알림 | `s3-versioning-lifecycle.event-notification` | S3 이벤트 알림 |
| 7 | 5 | 복제 | `s3-versioning-lifecycle.s3-replication` | S3 리전 간 복제 (CRR) |
| 8 | 6 | 복제 | `s3-versioning-lifecycle.s3-same-region-replication` | S3 동일 리전 복제 (SRR) |
| 9 | 7 | 복제 | `s3-versioning-lifecycle.s3-replication-time-control` | S3 복제 시간 제어 (S3 RTC) |
| 10 | 8 | 복제 | `s3-versioning-lifecycle.s3-replication-cross-account-kms` | 계정을 넘는 복제와 SSE-KMS 키 권한 |

현재 테스트 제목(이것으로 찾는다): `S3 버전 관리 주제가 기능 다섯 다음에 복제의 갈래와 구성 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('S3 버전 관리 주제가 버전 관리·객체 잠금·수명 주기·이벤트 알림·복제 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-versioning-lifecycle')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: 버전 관리(1) → 객체 잠금(2) → 수명 주기 정책(2) → 이벤트 알림(1) → 복제(4).
    // 기능 하나가 블록 하나다. 객체 잠금의 전제 조건(버전 관리 필요)은 버전 관리 뒤, 객체 잠금 블록 안.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-versioning-lifecycle.versioning',
      's3-versioning-lifecycle.object-lock',
      's3-versioning-lifecycle.object-lock-prerequisites',
      's3-versioning-lifecycle.lifecycle-policy',
      's3-versioning-lifecycle.s3-lifecycle-rules-and-size-filter',
      's3-versioning-lifecycle.event-notification',
      's3-versioning-lifecycle.s3-replication',
      's3-versioning-lifecycle.s3-same-region-replication',
      's3-versioning-lifecycle.s3-replication-time-control',
      's3-versioning-lifecycle.s3-replication-cross-account-kms',
    ])
  })
```

### `s3-access-control` — 개념 13개, 자리가 바뀌는 개념 12개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | 버킷 정책 | `s3-access-control.s3-cross-account-bucket-policy` | 계정 간 버킷 접근과 버킷 정책 |
| 2 | 12 | 버킷 정책 | `s3-access-control.s3-bucket-policy-source-vpc-condition` | 버킷을 특정 VPC에서만 열기 |
| 3 | 10 | 공개 액세스 차단 | `s3-access-control.s3-account-level-public-access-block` | 계정 수준 공개 액세스 차단 |
| 4 | 11 | 공개 액세스 차단 | `s3-access-control.block-public-access-allows-explicit-grants` | 공개 액세스 차단과 명시적 허용 |
| 5 | 2 | 사전 서명된 URL | `s3-access-control.s3-presigned-url` | S3 사전 서명된 URL |
| 6 | 3 | S3 액세스 권한 | `s3-access-control.s3-access-grants` | S3 액세스 권한(Access Grants) |
| 7 | 4 | 액세스 포인트 | `s3-access-control.s3-access-point` | S3 액세스 포인트 |
| 8 | 5 | 액세스 포인트 | `s3-access-control.s3-multi-region-access-point` | S3 멀티 리전 액세스 포인트 |
| 9 | 7 | CORS | `s3-access-control.s3-cors-not-authorization` | CORS의 권한 부여 한계 |
| 10 | 8 | 요청자 부담 | `s3-access-control.s3-requester-pays` | 요청자 부담 버킷 |
| 11 | 13 | 정적 웹사이트 엔드포인트 | `s3-access-control.s3-website-endpoint-no-https` | 정적 웹사이트 엔드포인트와 HTTPS |
| 12 | 6 | Storage Lens | `s3-access-control.s3-storage-lens` | S3 Storage Lens |
| 13 | 9 | Storage Lens | `s3-access-control.s3-storage-lens-advanced-activity-metrics` | S3 Storage Lens의 고급 활동 메트릭 |

현재 테스트 제목(이것으로 찾는다): `S3 접근 제어 주제가 접근 경로 여섯 다음에 갈림길 둘과 한계 다섯을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('S3 접근 제어 주제가 버킷 정책과 공개 차단부터 Storage Lens까지 접근 경로 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-access-control')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: 버킷 정책(2) → 공개 액세스 차단(2) → 사전 서명된 URL(1) → S3 액세스 권한(1) → 액세스 포인트(2) → CORS(1) → 요청자 부담(1) →
    //   정적 웹사이트 엔드포인트(1) → Storage Lens(2).
    // 공개 액세스 차단 둘은 따로 기본 개념이 없고 버킷 정책을 재정의하거나 그 허용을 통과시키는 관계라
    // 버킷 정책 블록 바로 뒤에 둔다. 접근 수단이 아닌 Storage Lens는 맨 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-access-control.s3-cross-account-bucket-policy',
      's3-access-control.s3-bucket-policy-source-vpc-condition',
      's3-access-control.s3-account-level-public-access-block',
      's3-access-control.block-public-access-allows-explicit-grants',
      's3-access-control.s3-presigned-url',
      's3-access-control.s3-access-grants',
      's3-access-control.s3-access-point',
      's3-access-control.s3-multi-region-access-point',
      's3-access-control.s3-cors-not-authorization',
      's3-access-control.s3-requester-pays',
      's3-access-control.s3-website-endpoint-no-https',
      's3-access-control.s3-storage-lens',
      's3-access-control.s3-storage-lens-advanced-activity-metrics',
    ])
  })
```

### `storage-gateway-migration` — 개념 7개, 자리가 바뀌는 개념 6개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Storage Gateway | `storage-gateway-migration.storage-gateway` | Storage Gateway |
| 2 | 4 | Storage Gateway | `storage-gateway-migration.storage-gateway-gateway-types` | Storage Gateway의 게이트웨이 유형 |
| 3 | 5 | Storage Gateway | `storage-gateway-migration.storage-gateway-volume-modes` | 저장 볼륨 게이트웨이와 캐시된 볼륨 게이트웨이 |
| 4 | 6 | Storage Gateway | `storage-gateway-migration.tape-gateway-archive-tiers` | 가상 테이프가 내려가는 아카이브 계층 |
| 5 | 2 | DMS와 SCT | `storage-gateway-migration.dms-sct` | DMS와 SCT |
| 6 | 7 | DMS와 SCT | `storage-gateway-migration.dms-full-load-and-cdc-task` | 전체 로드와 변경 데이터 캡처를 함께 하는 복제 태스크 |
| 7 | 3 | Application Migration Service | `storage-gateway-migration.application-migration-service` | Application Migration Service |

현재 테스트 제목(이것으로 찾는다): `Storage Gateway·마이그레이션 주제가 서비스 셋 다음에 유형 선택과 설정을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('Storage Gateway·마이그레이션 주제가 Storage Gateway·DMS·Application Migration Service 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'storage-gateway-migration')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: Storage Gateway(4) → DMS와 SCT(2) → Application Migration Service(1).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'storage-gateway-migration.storage-gateway',
      'storage-gateway-migration.storage-gateway-gateway-types',
      'storage-gateway-migration.storage-gateway-volume-modes',
      'storage-gateway-migration.tape-gateway-archive-tiers',
      'storage-gateway-migration.dms-sct',
      'storage-gateway-migration.dms-full-load-and-cdc-task',
      'storage-gateway-migration.application-migration-service',
    ])
  })
```

### `rds-storage-features` — 개념 21개, 자리가 바뀌는 개념 17개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | RDS | `rds-storage-features.rds` | RDS |
| 2 | 2 | 스토리지 유형 | `rds-storage-features.storage-types` | RDS 스토리지 유형 |
| 3 | 8 | 스토리지 유형 | `rds-storage-features.storage-type-names` | RDS 스토리지 유형의 약칭 |
| 4 | 3 | 기능 개요 | `rds-storage-features.features` | RDS 기능 |
| 5 | 9 | 다중 AZ | `rds-storage-features.multi-az-standby-limits` | 다중 AZ 대기 인스턴스로는 할 수 없는 것 |
| 6 | 10 | 다중 AZ | `rds-storage-features.rds-multi-az-db-cluster` | 다중 AZ DB 인스턴스 배포와 다중 AZ DB 클러스터 배포 |
| 7 | 18 | 다중 AZ | `rds-storage-features.rds-multi-az-failover-rto` | 다중 AZ 장애 조치에 걸리는 시간 |
| 8 | 11 | 읽기 전용 복제본 | `rds-storage-features.read-replica-vs-cache` | 캐시가 효과를 내지 못하는 조건 |
| 9 | 12 | RDS Proxy | `rds-storage-features.connection-issue-heuristic` | 연결(Connection) 문제의 정답 신호 |
| 10 | 13 | RDS Proxy | `rds-storage-features.rds-proxy-failover` | RDS Proxy의 장애 조치 시간 단축 |
| 11 | 4 | 블루/그린 배포 | `rds-storage-features.rds-blue-green-deployment` | RDS 블루/그린 배포 |
| 12 | 14 | 백업과 스냅샷 | `rds-storage-features.rds-snapshot-cross-region-copy` | 리전 간 RDS 스냅샷 복사 |
| 13 | 15 | 백업과 스냅샷 | `rds-storage-features.automated-backup-retention` | RDS 자동 백업의 보존 한계 |
| 14 | 17 | 백업과 스냅샷 | `rds-storage-features.rds-pitr-transaction-log-interval` | 특정 시점 복구와 5분 간격 트랜잭션 로그 |
| 15 | 16 | 백업과 스냅샷 | `rds-storage-features.rds-manual-snapshot-retention` | 만료가 없는 수동 스냅샷 |
| 16 | 6 | 인증과 암호화 | `rds-storage-features.rds-iam-database-authentication` | RDS의 IAM 데이터베이스 인증 |
| 17 | 7 | 인증과 암호화 | `rds-storage-features.rds-encryption-scope-and-in-transit` | 저장 중 암호화가 미치는 범위와 전송 중 암호화 |
| 18 | 20 | 인증과 암호화 | `rds-storage-features.rds-encrypt-existing-instance` | 기존 RDS 인스턴스의 저장 중 암호화 절차 |
| 19 | 19 | 인스턴스 중지 | `rds-storage-features.rds-stop-instance-restart` | RDS 인스턴스 중지와 7일 뒤 자동 재시작 |
| 20 | 5 | RDS Custom | `rds-storage-features.rds-custom` | RDS Custom |
| 21 | 21 | RDS Custom | `rds-storage-features.rds-custom-byol` | RDS Custom의 보유 라이선스 모델 |

현재 테스트 제목(이것으로 찾는다): `RDS 주제가 서비스와 기능 다음에 선택 기준과 한계값을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('RDS 주제가 스토리지부터 RDS Custom까지 하위 기능 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'rds-storage-features')

    // ADR-033 하위 기능 블록 순서 — 서비스가 하나라 하위 기능이 블록이다. 블록마다 기본 → 갈림길 → 세부.
    // 블록: RDS(1) → 스토리지 유형(2) → 기능 개요(1) → 다중 AZ(3) → 읽기 전용 복제본(1) → RDS Proxy(2) → 블루/그린 배포(1) → 백업과
    //   스냅샷(4) → 인증과 암호화(3) → 인스턴스 중지(1) → RDS Custom(2).
    // 기능 개요(features)가 다중 AZ → 읽기 전용 복제본 → RDS Proxy → 블루/그린 순으로 소개하므로 그 순서로
    // 블록을 둔다. 백업 블록은 리전 간 스냅샷 복사(갈림길) → 자동 백업 보존·특정 시점 복구·수동 스냅샷(세부).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'rds-storage-features.rds',
      'rds-storage-features.storage-types',
      'rds-storage-features.storage-type-names',
      'rds-storage-features.features',
      'rds-storage-features.multi-az-standby-limits',
      'rds-storage-features.rds-multi-az-db-cluster',
      'rds-storage-features.rds-multi-az-failover-rto',
      'rds-storage-features.read-replica-vs-cache',
      'rds-storage-features.connection-issue-heuristic',
      'rds-storage-features.rds-proxy-failover',
      'rds-storage-features.rds-blue-green-deployment',
      'rds-storage-features.rds-snapshot-cross-region-copy',
      'rds-storage-features.automated-backup-retention',
      'rds-storage-features.rds-pitr-transaction-log-interval',
      'rds-storage-features.rds-manual-snapshot-retention',
      'rds-storage-features.rds-iam-database-authentication',
      'rds-storage-features.rds-encryption-scope-and-in-transit',
      'rds-storage-features.rds-encrypt-existing-instance',
      'rds-storage-features.rds-stop-instance-restart',
      'rds-storage-features.rds-custom',
      'rds-storage-features.rds-custom-byol',
    ])
  })
```

### `aurora` — 개념 18개, 자리가 바뀌는 개념 16개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Aurora | `aurora.aurora` | Aurora |
| 2 | 2 | Aurora Serverless | `aurora.aurora-serverless-v2` | Aurora Serverless v2 |
| 3 | 17 | Aurora Serverless | `aurora.aurora-serverless-max-acu` | Aurora Serverless의 최대 ACU 설정 |
| 4 | 3 | 복제본과 엔드포인트 | `aurora.aurora-reader-endpoint` | Aurora 전용 Reader Endpoint |
| 5 | 4 | 복제본과 엔드포인트 | `aurora.aurora-endpoint-types` | Aurora의 엔드포인트 종류 |
| 6 | 5 | 복제본과 엔드포인트 | `aurora.aurora-replica-auto-scaling` | Aurora Auto Scaling의 레플리카 수 조정 |
| 7 | 18 | 복제본과 엔드포인트 | `aurora.read-replica-no-schema-change` | 읽기 전용 복제본의 스키마 변경 제약 |
| 8 | 6 | SQL Server에서 옮기기 | `aurora.babelfish` | Babelfish for Aurora PostgreSQL |
| 9 | 14 | SQL Server에서 옮기기 | `aurora.sql-server-license-cost` | SQL Server를 그대로 옮길 때의 라이선스 비용 |
| 10 | 7 | pgvector | `aurora.aurora-pgvector` | Aurora PostgreSQL의 pgvector 확장 |
| 11 | 8 | S3로 내보내기 | `aurora.aurora-select-into-outfile-s3` | Aurora MySQL에서 S3로 바로 내보내기 |
| 12 | 9 | 글로벌 데이터베이스와 리전 간 복제본 | `aurora.aurora-global-database-dr-targets` | Aurora 글로벌 데이터베이스가 채우는 RPO와 RTO |
| 13 | 10 | 글로벌 데이터베이스와 리전 간 복제본 | `aurora.aurora-cross-region-read-replica` | 리전 간 Aurora 복제본 |
| 14 | 16 | 글로벌 데이터베이스와 리전 간 복제본 | `aurora.aurora-global-database-write-region` | Aurora Global Database에서 쓰기를 받는 리전 |
| 15 | 11 | 백업과 클론 | `aurora.aurora-continuous-backup-rpo` | Aurora의 지속적 증분 백업 |
| 16 | 12 | 백업과 클론 | `aurora.aurora-clone` | Aurora 클론의 적용 범위 |
| 17 | 13 | 스토리지 구성 | `aurora.aurora-storage-configurations` | Aurora Standard와 Aurora I/O-Optimized |
| 18 | 15 | 확장 수단이 아닌 기능 | `aurora.aurora-zdr-and-activity-streams` | 확장 수단이 아닌 Aurora 기능 둘 |

현재 테스트 제목(이것으로 찾는다): `Aurora 주제가 서비스와 기능 다음에 선택 기준과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('Aurora 주제가 Serverless부터 스토리지 구성까지 하위 기능 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'aurora')

    // ADR-033 하위 기능 블록 순서 — 서비스가 하나라 하위 기능이 블록이다. 블록마다 기본 → 갈림길 → 세부.
    // 블록: Aurora(1) → Aurora Serverless(2) → 복제본과 엔드포인트(4) → SQL Server에서 옮기기(2) → pgvector(1) → S3로
    //   내보내기(1) → 글로벌 데이터베이스와 리전 간 복제본(3) → 백업과 클론(2) → 스토리지 구성(1) → 확장 수단이 아닌 기능(1).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'aurora.aurora',
      'aurora.aurora-serverless-v2',
      'aurora.aurora-serverless-max-acu',
      'aurora.aurora-reader-endpoint',
      'aurora.aurora-endpoint-types',
      'aurora.aurora-replica-auto-scaling',
      'aurora.read-replica-no-schema-change',
      'aurora.babelfish',
      'aurora.sql-server-license-cost',
      'aurora.aurora-pgvector',
      'aurora.aurora-select-into-outfile-s3',
      'aurora.aurora-global-database-dr-targets',
      'aurora.aurora-cross-region-read-replica',
      'aurora.aurora-global-database-write-region',
      'aurora.aurora-continuous-backup-rpo',
      'aurora.aurora-clone',
      'aurora.aurora-storage-configurations',
      'aurora.aurora-zdr-and-activity-streams',
    ])
  })
```

### `dynamodb` — 개념 18개, 자리가 바뀌는 개념 15개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | DynamoDB와 응답 시간 | `dynamodb.dynamodb` | DynamoDB |
| 2 | 2 | DynamoDB와 응답 시간 | `dynamodb.dynamodb-single-digit-latency` | DynamoDB의 응답 시간 |
| 3 | 3 | Streams | `dynamodb.dynamodb-streams` | DynamoDB Streams |
| 4 | 17 | Streams | `dynamodb.dynamodb-streams-retention-24h` | DynamoDB Streams의 24시간 보존 한계 |
| 5 | 18 | Streams | `dynamodb.dynamodb-streams-batch-size` | DynamoDB Streams 소비의 배치 크기 |
| 6 | 4 | 글로벌 테이블 | `dynamodb.dynamodb-global-tables` | DynamoDB 글로벌 테이블 |
| 7 | 5 | TTL | `dynamodb.dynamodb-ttl` | DynamoDB TTL |
| 8 | 16 | TTL | `dynamodb.dynamodb-ttl-deletion-delay` | TTL 삭제의 48시간 지연 |
| 9 | 6 | 전역 보조 인덱스 | `dynamodb.dynamodb-global-secondary-index` | 전역 보조 인덱스(GSI) |
| 10 | 7 | 용량 모드와 오토 스케일링 | `dynamodb.dynamodb-capacity-modes` | 프로비저닝된 용량과 온디맨드 용량 |
| 11 | 8 | 용량 모드와 오토 스케일링 | `dynamodb.dynamodb-auto-scaling-target-utilization` | DynamoDB 오토 스케일링과 목표 활용률 |
| 12 | 9 | 읽기 일관성 | `dynamodb.dynamodb-read-consistency` | 최종 일관성 읽기와 강력한 일관성 읽기 |
| 13 | 10 | S3 내보내기와 PITR | `dynamodb.dynamodb-s3-export-vs-streams` | 분석용 적재의 S3 내보내기와 스트림 경로 |
| 14 | 11 | S3 내보내기와 PITR | `dynamodb.dynamodb-incremental-export` | S3 내보내기의 증분 형태 |
| 15 | 12 | S3 내보내기와 PITR | `dynamodb.dynamodb-export-no-read-capacity` | S3 내보내기와 테이블 읽기 용량 |
| 16 | 13 | S3 내보내기와 PITR | `dynamodb.dynamodb-pitr` | DynamoDB PITR의 보존 한계 |
| 17 | 14 | S3 내보내기와 PITR | `dynamodb.dynamodb-export-requires-pitr` | S3 내보내기의 전제 조건인 PITR |
| 18 | 15 | 항목 크기 제한 | `dynamodb.dynamodb-item-size-limit` | DynamoDB 항목 크기 제한 |

현재 테스트 제목(이것으로 찾는다): `DynamoDB 주제가 서비스와 기능 다음에 선택 기준과 한계값을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('DynamoDB 주제가 Streams부터 항목 크기 제한까지 하위 기능 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'dynamodb')

    // ADR-033 하위 기능 블록 순서 — 서비스가 하나라 하위 기능이 블록이다. 블록마다 기본 → 갈림길 → 세부.
    // 블록: DynamoDB와 응답 시간(2) → Streams(3) → 글로벌 테이블(1) → TTL(2) → 전역 보조 인덱스(1) → 용량 모드와 오토 스케일링(2) →
    //   읽기 일관성(1) → S3 내보내기와 PITR(5) → 항목 크기 제한(1).
    // S3 내보내기 블록이 스트림 경로와 대비하므로 Streams 블록 뒤. PITR은 내보내기의 전제 조건과 붙인다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'dynamodb.dynamodb',
      'dynamodb.dynamodb-single-digit-latency',
      'dynamodb.dynamodb-streams',
      'dynamodb.dynamodb-streams-retention-24h',
      'dynamodb.dynamodb-streams-batch-size',
      'dynamodb.dynamodb-global-tables',
      'dynamodb.dynamodb-ttl',
      'dynamodb.dynamodb-ttl-deletion-delay',
      'dynamodb.dynamodb-global-secondary-index',
      'dynamodb.dynamodb-capacity-modes',
      'dynamodb.dynamodb-auto-scaling-target-utilization',
      'dynamodb.dynamodb-read-consistency',
      'dynamodb.dynamodb-s3-export-vs-streams',
      'dynamodb.dynamodb-incremental-export',
      'dynamodb.dynamodb-export-no-read-capacity',
      'dynamodb.dynamodb-pitr',
      'dynamodb.dynamodb-export-requires-pitr',
      'dynamodb.dynamodb-item-size-limit',
    ])
  })
```

### `ec2-autoscaling` — 개념 18개, 자리가 바뀌는 개념 12개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | EC2와 인스턴스 재료 | `ec2-autoscaling.ec2` | EC2 |
| 2 | 2 | EC2와 인스턴스 재료 | `ec2-autoscaling.ami-and-launch-template` | AMI와 시작 템플릿 |
| 3 | 3 | EC2와 인스턴스 재료 | `ec2-autoscaling.ec2-image-builder` | EC2 Image Builder |
| 4 | 4 | 인스턴스 제품군 | `ec2-autoscaling.memory-optimized-instance-family` | 메모리 최적화 인스턴스 제품군 |
| 5 | 5 | 인스턴스 제품군 | `ec2-autoscaling.gpu-instance-family` | GPU 인스턴스 제품군과 컴퓨팅 서비스 선택 |
| 6 | 17 | 인스턴스 제품군 | `ec2-autoscaling.enhanced-networking` | 향상된 네트워킹 |
| 7 | 6 | 예약 인스턴스 | `ec2-autoscaling.reserved-instance-types` | 표준 예약 인스턴스와 전환 가능 예약 인스턴스 |
| 8 | 7 | 스팟과 혼합 구성 | `ec2-autoscaling.spot-workload-fit` | 스팟에 올릴 수 있는 워크로드 |
| 9 | 11 | 스팟과 혼합 구성 | `ec2-autoscaling.spot-allocation-strategy` | 스팟 할당 전략 |
| 10 | 12 | 스팟과 혼합 구성 | `ec2-autoscaling.asg-instance-type-override` | Auto Scaling 그룹의 인스턴스 유형 재정의 |
| 11 | 13 | 스팟과 혼합 구성 | `ec2-autoscaling.asg-on-demand-base-capacity` | Auto Scaling 그룹의 온디맨드 기반 용량 |
| 12 | 8 | 조정 정책 | `ec2-autoscaling.scheduled-scaling` | 예약된 조정과 대상 추적의 갈림길 |
| 13 | 9 | 조정 정책 | `ec2-autoscaling.target-tracking-vs-simple-scaling` | 대상 추적과 단순 조정의 갈림길 |
| 14 | 10 | 조정 정책 | `ec2-autoscaling.predictive-scaling` | 예측 스케일링 |
| 15 | 14 | Auto Scaling 운영 | `ec2-autoscaling.warm-pool` | Auto Scaling 웜 풀 |
| 16 | 15 | Auto Scaling 운영 | `ec2-autoscaling.asg-single-instance-self-healing` | 용량을 1로 고정한 오토 스케일링 그룹의 인스턴스 교체 |
| 17 | 16 | Auto Scaling 운영 | `ec2-autoscaling.elb-health-check-drives-asg-replacement` | 로드 밸런서 상태 검사와 인스턴스 교체 |
| 18 | 18 | ParallelCluster | `ec2-autoscaling.parallelcluster` | AWS ParallelCluster |

현재 테스트 제목(이것으로 찾는다): `EC2·Auto Scaling 주제가 서비스와 재료 다음에 선택 기준과 설정 항목을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('EC2·Auto Scaling 주제가 인스턴스 재료·제품군·구매 옵션·조정 정책·운영 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ec2-autoscaling')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: EC2와 인스턴스 재료(3) → 인스턴스 제품군(3) → 예약 인스턴스(1) → 스팟과 혼합 구성(4) → 조정 정책(3) → Auto Scaling 운영(3) →
    //   ParallelCluster(1).
    // 향상된 네트워킹은 인스턴스 유형이 지원해야 켜지는 기능이라 인스턴스 제품군 블록 끝에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ec2-autoscaling.ec2',
      'ec2-autoscaling.ami-and-launch-template',
      'ec2-autoscaling.ec2-image-builder',
      'ec2-autoscaling.memory-optimized-instance-family',
      'ec2-autoscaling.gpu-instance-family',
      'ec2-autoscaling.enhanced-networking',
      'ec2-autoscaling.reserved-instance-types',
      'ec2-autoscaling.spot-workload-fit',
      'ec2-autoscaling.spot-allocation-strategy',
      'ec2-autoscaling.asg-instance-type-override',
      'ec2-autoscaling.asg-on-demand-base-capacity',
      'ec2-autoscaling.scheduled-scaling',
      'ec2-autoscaling.target-tracking-vs-simple-scaling',
      'ec2-autoscaling.predictive-scaling',
      'ec2-autoscaling.warm-pool',
      'ec2-autoscaling.asg-single-instance-self-healing',
      'ec2-autoscaling.elb-health-check-drives-asg-replacement',
      'ec2-autoscaling.parallelcluster',
    ])
  })
```

### `lambda` — 개념 18개, 자리가 바뀌는 개념 12개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Lambda | `lambda.lambda` | Lambda |
| 2 | 2 | 호출 | `lambda.lambda-function-url` | Lambda 함수 URL |
| 3 | 3 | 호출 | `lambda.lambda-function-url-iam-auth` | 함수 URL의 AWS_IAM 인증 유형 |
| 4 | 6 | 호출 | `lambda.lambda-invocation-types` | 이벤트 호출과 요청-응답 호출 |
| 5 | 11 | 호출 | `lambda.lambda-kinesis-event-source` | Lambda의 Kinesis 스트림 레코드 처리 |
| 6 | 4 | VPC 연결 | `lambda.lambda-vpc-access` | Lambda의 VPC 연결 |
| 7 | 5 | 패키징과 종속성 | `lambda.lambda-container-image` | Lambda의 컨테이너 이미지 패키징 |
| 8 | 14 | 패키징과 종속성 | `lambda.lambda-layer-size-limit` | Lambda 레이어의 크기 제한 |
| 9 | 15 | 패키징과 종속성 | `lambda.lambda-efs-mount` | Lambda 함수의 EFS 마운트 |
| 10 | 7 | 메모리 | `lambda.lambda-memory-cpu-proportional` | 메모리에 비례하는 Lambda의 CPU 배정 |
| 11 | 13 | 메모리 | `lambda.lambda-memory-ceiling` | Lambda 한 번 실행의 메모리 상한 |
| 12 | 8 | 동시성과 콜드 스타트 | `lambda.lambda-reserved-concurrency` | 예약된 동시성과 프로비저닝된 동시성 |
| 13 | 9 | 동시성과 콜드 스타트 | `lambda.lambda-provisioned-concurrency-autoscaling` | 프로비저닝된 동시성의 Application Auto Scaling 조정 |
| 14 | 10 | 동시성과 콜드 스타트 | `lambda.lambda-concurrency-limit-throttling` | 동시 실행 한도 초과와 TooManyRequestsException |
| 15 | 12 | 동시성과 콜드 스타트 | `lambda.lambda-snapstart` | Lambda SnapStart |
| 16 | 16 | 버전 | `lambda.lambda-version-alias-config-freeze` | Lambda 버전에 고정되는 환경 변수 |
| 17 | 17 | 실행 역할 | `lambda.lambda-execution-role-logs` | 실행 역할의 CloudWatch Logs 쓰기 권한 |
| 18 | 18 | 비교 — 관리형 런타임의 운영 체제 접근 | `lambda.serverless-runtime-no-os-access` | 관리형 런타임의 운영 체제 접근 제약 |

현재 테스트 제목(이것으로 찾는다): `Lambda 주제가 함수를 만드는 이야기 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('Lambda 주제가 호출부터 실행 역할까지 하위 기능 블록 다음에 운영 체제 접근 비교를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'lambda')

    // ADR-033 하위 기능 블록 순서 — 서비스가 하나라 하위 기능이 블록이다. 블록마다 기본 → 갈림길 → 세부.
    // 블록: Lambda(1) → 호출(4) → VPC 연결(1) → 패키징과 종속성(3) → 메모리(2) → 동시성과 콜드 스타트(4) → 버전(1) → 실행 역할(1) →
    //   비교 — 관리형 런타임의 운영 체제 접근(1).
    // SnapStart는 게시된 버전에서만 동작하므로 동시성 블록 끝, 버전 블록 바로 앞에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'lambda.lambda',
      'lambda.lambda-function-url',
      'lambda.lambda-function-url-iam-auth',
      'lambda.lambda-invocation-types',
      'lambda.lambda-kinesis-event-source',
      'lambda.lambda-vpc-access',
      'lambda.lambda-container-image',
      'lambda.lambda-layer-size-limit',
      'lambda.lambda-efs-mount',
      'lambda.lambda-memory-cpu-proportional',
      'lambda.lambda-memory-ceiling',
      'lambda.lambda-reserved-concurrency',
      'lambda.lambda-provisioned-concurrency-autoscaling',
      'lambda.lambda-concurrency-limit-throttling',
      'lambda.lambda-snapstart',
      'lambda.lambda-version-alias-config-freeze',
      'lambda.lambda-execution-role-logs',
      'lambda.serverless-runtime-no-os-access',
    ])
  })
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 5
```

`verify-order.mjs 5`이 보는 것 — 사용자가 매 배치에 검증하라고 한 항목 그대로다.

- 개념 누락·중복 0, 주제별 concept id 집합이 착수 시점과 같다.
- 문항 해시가 착수 시점 `aadc1894…`와 같다 — 문항·보기·해설·answerIndex·문항 배열 변경 0.
- 순서와 무관한 내용 해시가 착수 시점 `8e67f789…`와 같다 — 개념 본문 문자열 변경 0.
- `topics.json`과 `topics-baseline.json`에서 바뀐 것이 줄의 자리(와 끝 쉼표)뿐이다.
- 순서가 바뀐 주제가 정확히 step 1~5에서 명세한 주제들이다.
- 순서가 바뀐 주제마다 서비스 왕복 before → after를 찍고, after가 0이 아니면 실패한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data.test.ts`에서 바뀐 것이 명세한 `it` 블록뿐인가?
   - 명세한 주제 말고 다른 주제의 개념 순서가 그대로인가? (`verify-order.mjs`가 본다)
   - 저장소에 새 파일이 생기지 않았는가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 5을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 아래를 적는다.
     - 주제마다 `자리 바뀐 개념 수`와 `왕복 before → after` — `verify-order.mjs 5`의 이 step 주제 출력
     - "선행 충돌 없음"
     - AC 결과(테스트 수 포함)
   - 선행 충돌 → 위 「선행 관계와 충돌하면」대로 `"blocked"`
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- 명세한 8개 주제 말고 다른 주제의 개념 순서를 바꾸지 마라. 이유: step마다 재정렬할 주제가
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
