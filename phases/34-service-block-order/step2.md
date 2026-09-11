# Step 2: compute-db-reorder

**6개 주제의 개념을 서비스 블록 순서로 옮긴다** — `s3-encryption-batch`·`ebs-instance-store`·`elasticache-purpose-built-db`·`elastic-load-balancing`·`ecs-eks-fargate`·`api-gateway-step-functions`.

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

- `ebs-instance-store.io2-block-express-iops-ceiling`(EBS 볼륨 블록)이 "범용 SSD나 인스턴스 스토어를 섞은 구성으로는 그 수치에 닿지 못한다"로 인스턴스 스토어를 곁가지로 언급한다 — 인스턴스 스토어 블록보다 앞이다.

이것들은 "X는 이 일을 하지 않는다" 식의 대비 문장이고 같은 문장 안에서 X가 무엇인지 말한다. ADR-033 「트레이드오프」에 적힌 잔여다.

## 주제별 명세

`현재 자리`는 착수 시점 `topics.json`에서 그 주제 안의 몇 번째 개념인지다(1부터).

### `s3-encryption-batch` — 개념 13개, 자리가 바뀌는 개념 10개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.sse` | SSE (Server Side Encryption) |
| 2 | 2 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.sse-types` | SSE 종류 |
| 3 | 3 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.client-side-encryption` | 클라이언트 측 암호화 |
| 4 | 7 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.envelope-encryption` | 봉투 암호화 (Envelope Encryption) |
| 5 | 8 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.sse-kms-audit-trail` | SSE-KMS의 감사 추적과 업로드 강제 |
| 6 | 11 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.sse-kms-cost` | SSE-KMS의 비용 구조와 S3 Bucket Key |
| 7 | 12 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.sse-c-no-rotation-or-audit` | SSE-C의 자동 교체와 감사 추적 한계 |
| 8 | 13 | 서버 측·클라이언트 측 암호화 | `s3-encryption-batch.s3-secure-transport-condition` | 버킷 정책의 전송 구간 암호화 강제 |
| 9 | 4 | Batch Operations와 인벤토리 | `s3-encryption-batch.batch-operations` | S3 Batch Operations |
| 10 | 5 | Batch Operations와 인벤토리 | `s3-encryption-batch.s3-inventory-report` | S3 인벤토리 |
| 11 | 9 | Batch Operations와 인벤토리 | `s3-encryption-batch.batch-copy-vs-replication` | 일회성 대량 복사와 지속 복제 |
| 12 | 10 | Batch Operations와 인벤토리 | `s3-encryption-batch.s3-batch-operations-lambda-invoke` | S3 Batch Operations의 Lambda 호출 |
| 13 | 6 | S3 Object Lambda | `s3-encryption-batch.s3-object-lambda` | S3 Object Lambda |

현재 테스트 제목(이것으로 찾는다): `S3 암호화 주제가 암호화·배치·인벤토리 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('S3 암호화 주제가 암호화·Batch Operations와 인벤토리·Object Lambda 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-encryption-batch')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: 서버 측·클라이언트 측 암호화(8) → Batch Operations와 인벤토리(4) → S3 Object Lambda(1).
    // Batch Operations 블록은 일회성 복사와 지속 복제의 갈림길이 Lambda 호출(세부)보다 앞선다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-encryption-batch.sse',
      's3-encryption-batch.sse-types',
      's3-encryption-batch.client-side-encryption',
      's3-encryption-batch.envelope-encryption',
      's3-encryption-batch.sse-kms-audit-trail',
      's3-encryption-batch.sse-kms-cost',
      's3-encryption-batch.sse-c-no-rotation-or-audit',
      's3-encryption-batch.s3-secure-transport-condition',
      's3-encryption-batch.batch-operations',
      's3-encryption-batch.s3-inventory-report',
      's3-encryption-batch.batch-copy-vs-replication',
      's3-encryption-batch.s3-batch-operations-lambda-invoke',
      's3-encryption-batch.s3-object-lambda',
    ])
  })
```

### `ebs-instance-store` — 개념 15개, 자리가 바뀌는 개념 13개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | EBS 볼륨 | `ebs-instance-store.ebs` | EBS (Elastic Block Store) |
| 2 | 2 | EBS 볼륨 | `ebs-instance-store.ebs-elastic-volumes` | EBS Elastic Volumes |
| 3 | 6 | EBS 볼륨 | `ebs-instance-store.ebs-volume-type-names` | EBS 볼륨 유형의 실제 이름 |
| 4 | 7 | EBS 볼륨 | `ebs-instance-store.gp3-iops-independent-of-size` | gp3의 IOPS와 용량 분리 |
| 5 | 9 | EBS 볼륨 | `ebs-instance-store.io2-block-express-iops-ceiling` | io2 Block Express가 올려 주는 IOPS 상한 |
| 6 | 10 | EBS 볼륨 | `ebs-instance-store.ebs-encryption-by-default` | 계정 속성으로 켜는 EBS 기본 암호화 |
| 7 | 11 | EBS 볼륨 | `ebs-instance-store.ebs-encryption-performance` | EBS 암호화와 성능 |
| 8 | 12 | EBS 스냅샷 | `ebs-instance-store.ebs-recycle-bin` | EBS 스냅샷 휴지통 |
| 9 | 13 | EBS 스냅샷 | `ebs-instance-store.ebs-snapshot-block-public-access` | EBS 스냅샷의 공개 액세스 차단 |
| 10 | 14 | EBS 스냅샷 | `ebs-instance-store.data-lifecycle-manager` | Amazon Data Lifecycle Manager |
| 11 | 15 | EBS 스냅샷 | `ebs-instance-store.ebs-fast-snapshot-restore` | 스냅샷으로 만든 볼륨의 첫 접근이 느린 이유 |
| 12 | 3 | 인스턴스 스토어 | `ebs-instance-store.instance-store` | 인스턴스 스토어 (Instance Store) |
| 13 | 4 | 배치 그룹 | `ebs-instance-store.cluster-placement-group` | 클러스터 배치 그룹 |
| 14 | 8 | 배치 그룹 | `ebs-instance-store.spread-placement-group` | 분산 배치 그룹 |
| 15 | 5 | EFA | `ebs-instance-store.elastic-fabric-adapter` | Elastic Fabric Adapter(EFA) |

현재 테스트 제목(이것으로 찾는다): `EBS 주제가 기본 다섯 다음에 볼륨 유형의 갈림길과 스냅샷 운영을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ebs-instance-store')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: EBS 볼륨(7) → EBS 스냅샷(4) → 인스턴스 스토어(1) → 배치 그룹(2) → EFA(1).
    // EFA 본문이 클러스터 배치 그룹과 분산 배치 그룹을 둘 다 전제로 쓰므로 배치 그룹 블록 뒤에 둔다(규칙 5).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ebs-instance-store.ebs',
      'ebs-instance-store.ebs-elastic-volumes',
      'ebs-instance-store.ebs-volume-type-names',
      'ebs-instance-store.gp3-iops-independent-of-size',
      'ebs-instance-store.io2-block-express-iops-ceiling',
      'ebs-instance-store.ebs-encryption-by-default',
      'ebs-instance-store.ebs-encryption-performance',
      'ebs-instance-store.ebs-recycle-bin',
      'ebs-instance-store.ebs-snapshot-block-public-access',
      'ebs-instance-store.data-lifecycle-manager',
      'ebs-instance-store.ebs-fast-snapshot-restore',
      'ebs-instance-store.instance-store',
      'ebs-instance-store.cluster-placement-group',
      'ebs-instance-store.spread-placement-group',
      'ebs-instance-store.elastic-fabric-adapter',
    ])
  })
```

### `elasticache-purpose-built-db` — 개념 14개, 자리가 바뀌는 개념 13개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | ElastiCache | `elasticache-purpose-built-db.elasticache` | ElastiCache |
| 2 | 7 | ElastiCache | `elasticache-purpose-built-db.elasticache-redis-vs-memcached` | Redis와 Memcached의 갈림길 |
| 3 | 9 | ElastiCache | `elasticache-purpose-built-db.elasticache-multi-az-failover` | ElastiCache의 다중 AZ 자동 장애 조치 |
| 4 | 10 | ElastiCache | `elasticache-purpose-built-db.elasticache-global-datastore` | ElastiCache 글로벌 데이터스토어 |
| 5 | 12 | ElastiCache | `elasticache-purpose-built-db.cache-requires-application-change` | 캐시 도입에 필요한 애플리케이션 코드 변경 |
| 6 | 13 | ElastiCache | `elasticache-purpose-built-db.elasticache-not-a-durable-store` | 영구 저장소가 아닌 캐시 |
| 7 | 8 | DAX | `elasticache-purpose-built-db.dax-dynamodb-only` | DynamoDB 전용 캐시 DAX |
| 8 | 14 | DAX | `elasticache-purpose-built-db.dax-encryption-at-rest` | DAX 저장 중 암호화의 설정 시점 |
| 9 | 2 | DocumentDB | `elasticache-purpose-built-db.documentdb` | Amazon DocumentDB |
| 10 | 11 | DocumentDB | `elasticache-purpose-built-db.documentdb-global-cluster` | DocumentDB 글로벌 클러스터 |
| 11 | 3 | Neptune | `elasticache-purpose-built-db.neptune` | Amazon Neptune |
| 12 | 4 | Neptune | `elasticache-purpose-built-db.neptune-streams` | Neptune Streams |
| 13 | 5 | QLDB | `elasticache-purpose-built-db.qldb` | Amazon Quantum Ledger Database(QLDB) |
| 14 | 6 | Timestream | `elasticache-purpose-built-db.timestream` | Amazon Timestream |

현재 테스트 제목(이것으로 찾는다): `캐시·목적별 DB 주제가 서비스 여섯 다음에 갈림길 다섯과 한계 셋을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('캐시·목적별 DB 주제가 ElastiCache·DAX·DocumentDB·Neptune·QLDB·Timestream 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'elasticache-purpose-built-db')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: ElastiCache(6) → DAX(2) → DocumentDB(2) → Neptune(2) → QLDB(1) → Timestream(1).
    // DAX는 따로 기본 개념이 없어 DynamoDB 전용 캐시라는 갈림길이 블록 머리다.
    // Timestream은 기록의 불변성을 보장하지 않는다는 대비로 QLDB를 부르므로 QLDB 뒤에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'elasticache-purpose-built-db.elasticache',
      'elasticache-purpose-built-db.elasticache-redis-vs-memcached',
      'elasticache-purpose-built-db.elasticache-multi-az-failover',
      'elasticache-purpose-built-db.elasticache-global-datastore',
      'elasticache-purpose-built-db.cache-requires-application-change',
      'elasticache-purpose-built-db.elasticache-not-a-durable-store',
      'elasticache-purpose-built-db.dax-dynamodb-only',
      'elasticache-purpose-built-db.dax-encryption-at-rest',
      'elasticache-purpose-built-db.documentdb',
      'elasticache-purpose-built-db.documentdb-global-cluster',
      'elasticache-purpose-built-db.neptune',
      'elasticache-purpose-built-db.neptune-streams',
      'elasticache-purpose-built-db.qldb',
      'elasticache-purpose-built-db.timestream',
    ])
  })
```

### `elastic-load-balancing` — 개념 16개, 자리가 바뀌는 개념 15개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | ELB 개요와 ALB·NLB의 계층 갈림길 | `elastic-load-balancing.elb` | ELB |
| 2 | 3 | ELB 개요와 ALB·NLB의 계층 갈림길 | `elastic-load-balancing.alb-l7-vs-nlb-l4` | 계층으로 나뉘는 ALB와 NLB |
| 3 | 4 | ALB | `elastic-load-balancing.alb-routing-conditions` | ALB가 볼 수 있는 라우팅 조건 |
| 4 | 8 | ALB | `elastic-load-balancing.alb-cookie-stickiness` | ALB의 쿠키 기반 스티키 세션 |
| 5 | 10 | ALB | `elastic-load-balancing.sticky-session-tradeoff` | 스티키 세션의 부작용 |
| 6 | 11 | ALB | `elastic-load-balancing.alb-least-outstanding-requests` | ALB의 분산 알고리즘 |
| 7 | 12 | ALB | `elastic-load-balancing.alb-target-group-independent-scaling` | 경로별 타깃 그룹과 독립 확장 |
| 8 | 13 | ALB | `elastic-load-balancing.alb-listener-rule-fixed-response` | ALB 리스너 규칙의 사용자 지정 응답 |
| 9 | 5 | NLB | `elastic-load-balancing.nlb-tls-listener` | NLB의 TLS 리스너 |
| 10 | 6 | NLB | `elastic-load-balancing.nlb-udp-listener` | NLB의 UDP 리스너 |
| 11 | 7 | NLB | `elastic-load-balancing.nlb-ip-targets` | NLB 대상 그룹의 IP 주소 등록 |
| 12 | 2 | Gateway Load Balancer | `elastic-load-balancing.gateway-load-balancer` | 게이트웨이 로드 밸런서 |
| 13 | 16 | Gateway Load Balancer | `elastic-load-balancing.gwlb-endpoint-cross-account-inspection` | 게이트웨이 로드 밸런서 엔드포인트와 계정 간 트래픽 검사 |
| 14 | 9 | 공통 설정 | `elastic-load-balancing.internal-load-balancer` | 내부 로드 밸런서 |
| 15 | 14 | 공통 설정 | `elastic-load-balancing.load-balancer-idle-timeout` | 연결 경로 전체의 유휴 타임아웃 |
| 16 | 15 | 공통 설정 | `elastic-load-balancing.end-to-end-encryption-behind-alb` | 로드 밸런서 뒤 구간까지의 종단 간 암호화 |

현재 테스트 제목(이것으로 찾는다): `로드 밸런서 주제가 세 로드 밸런서 다음에 선택 기준과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('로드 밸런서 주제가 ELB 개요·ALB·NLB·Gateway Load Balancer·공통 설정 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'elastic-load-balancing')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: ELB 개요와 ALB·NLB의 계층 갈림길(2) → ALB(6) → NLB(3) → Gateway Load Balancer(2) → 공통 설정(3).
    // alb-l7-vs-nlb-l4는 비교 개념이지만 첫 개념 elb가 ALB·NLB를 이미 소개했고 ALB 블록의
    // alb-routing-conditions가 이 비교를 전제로 쓰므로 ALB 블록 앞에 둔다(규칙 5가 규칙 4보다 앞선다).
    // 공통 설정의 유휴 타임아웃이 Gateway Load Balancer를 언급하므로 공통 설정을 맨 뒤에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'elastic-load-balancing.elb',
      'elastic-load-balancing.alb-l7-vs-nlb-l4',
      'elastic-load-balancing.alb-routing-conditions',
      'elastic-load-balancing.alb-cookie-stickiness',
      'elastic-load-balancing.sticky-session-tradeoff',
      'elastic-load-balancing.alb-least-outstanding-requests',
      'elastic-load-balancing.alb-target-group-independent-scaling',
      'elastic-load-balancing.alb-listener-rule-fixed-response',
      'elastic-load-balancing.nlb-tls-listener',
      'elastic-load-balancing.nlb-udp-listener',
      'elastic-load-balancing.nlb-ip-targets',
      'elastic-load-balancing.gateway-load-balancer',
      'elastic-load-balancing.gwlb-endpoint-cross-account-inspection',
      'elastic-load-balancing.internal-load-balancer',
      'elastic-load-balancing.load-balancer-idle-timeout',
      'elastic-load-balancing.end-to-end-encryption-behind-alb',
    ])
  })
```

### `ecs-eks-fargate` — 개념 23개, 자리가 바뀌는 개념 22개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | ECS | `ecs-eks-fargate.ecs` | ECS |
| 2 | 16 | ECS | `ecs-eks-fargate.ecs-task-role` | 태스크 역할과 인스턴스 역할 |
| 3 | 17 | ECS | `ecs-eks-fargate.ecs-task-role-vs-task-execution-role` | 태스크 역할과 태스크 실행 역할 |
| 4 | 19 | ECS | `ecs-eks-fargate.ecs-awsvpc-mode` | ECS의 awsvpc 네트워크 모드 |
| 5 | 20 | ECS | `ecs-eks-fargate.ecs-task-placement-strategy` | ECS 태스크 배치 전략 |
| 6 | 8 | Fargate | `ecs-eks-fargate.fargate-no-time-limit` | 실행 시간 제한이 없는 Fargate |
| 7 | 9 | Fargate | `ecs-eks-fargate.fargate-spot` | Fargate Spot |
| 8 | 21 | Fargate | `ecs-eks-fargate.fargate-per-second-billing` | Fargate의 최소 과금 단위 |
| 9 | 22 | Fargate | `ecs-eks-fargate.fargate-efs-mount` | Fargate 태스크의 EFS 마운트 |
| 10 | 2 | EKS | `ecs-eks-fargate.eks` | Amazon EKS (Elastic Kubernetes Service) |
| 11 | 7 | EKS | `ecs-eks-fargate.eks-compute-options` | EKS의 세 가지 컴퓨팅 방식과 관리 책임 |
| 12 | 11 | EKS | `ecs-eks-fargate.eks-fargate-pod-isolation` | Fargate의 파드 단위 환경 격리 |
| 13 | 12 | EKS | `ecs-eks-fargate.eks-cluster-autoscaler` | Horizontal Pod Autoscaler와 Cluster Autoscaler |
| 14 | 13 | EKS | `ecs-eks-fargate.eks-aws-load-balancer-controller` | AWS Load Balancer Controller |
| 15 | 14 | EKS | `ecs-eks-fargate.eks-connector` | Amazon EKS Connector |
| 16 | 15 | EKS | `ecs-eks-fargate.eks-anywhere` | Amazon EKS Anywhere |
| 17 | 18 | EKS | `ecs-eks-fargate.eks-irsa` | 서비스 계정용 IAM 역할(IRSA) |
| 18 | 23 | EKS | `ecs-eks-fargate.eks-secrets-kms-encryption` | EKS 시크릿의 KMS 암호화 |
| 19 | 3 | ECR | `ecs-eks-fargate.ecr-image-scan-on-push` | Amazon ECR과 푸시 시 스캔 |
| 20 | 4 | AWS Batch | `ecs-eks-fargate.aws-batch` | AWS Batch |
| 21 | 10 | AWS Batch | `ecs-eks-fargate.batch-fargate-compute-environment` | AWS Batch의 컴퓨팅 환경 |
| 22 | 5 | Elastic Beanstalk | `ecs-eks-fargate.elastic-beanstalk` | AWS Elastic Beanstalk |
| 23 | 6 | App2Container | `ecs-eks-fargate.app2container` | AWS App2Container |

현재 테스트 제목(이것으로 찾는다): `컨테이너 주제가 서비스 소개 다음에 실행 방식 갈림길과 설정을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('컨테이너 주제가 ECS·Fargate·EKS·ECR·Batch·Elastic Beanstalk·App2Container 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ecs-eks-fargate')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: ECS(5) → Fargate(4) → EKS(9) → ECR(1) → AWS Batch(2) → Elastic Beanstalk(1) →
    //   App2Container(1).
    // Fargate는 따로 기본 개념이 없고 ECS 첫 개념이 Fargate 기반 ECS를 소개하므로 ECS 바로 뒤에 둔다.
    // EKS의 Fargate 파드 격리와 Batch의 Fargate 컴퓨팅 환경이 Fargate를 전제로 쓰므로 둘 다 Fargate 블록 뒤.
    // App2Container는 본문이 Elastic Beanstalk와 대비하므로 그 뒤에 둔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ecs-eks-fargate.ecs',
      'ecs-eks-fargate.ecs-task-role',
      'ecs-eks-fargate.ecs-task-role-vs-task-execution-role',
      'ecs-eks-fargate.ecs-awsvpc-mode',
      'ecs-eks-fargate.ecs-task-placement-strategy',
      'ecs-eks-fargate.fargate-no-time-limit',
      'ecs-eks-fargate.fargate-spot',
      'ecs-eks-fargate.fargate-per-second-billing',
      'ecs-eks-fargate.fargate-efs-mount',
      'ecs-eks-fargate.eks',
      'ecs-eks-fargate.eks-compute-options',
      'ecs-eks-fargate.eks-fargate-pod-isolation',
      'ecs-eks-fargate.eks-cluster-autoscaler',
      'ecs-eks-fargate.eks-aws-load-balancer-controller',
      'ecs-eks-fargate.eks-connector',
      'ecs-eks-fargate.eks-anywhere',
      'ecs-eks-fargate.eks-irsa',
      'ecs-eks-fargate.eks-secrets-kms-encryption',
      'ecs-eks-fargate.ecr-image-scan-on-push',
      'ecs-eks-fargate.aws-batch',
      'ecs-eks-fargate.batch-fargate-compute-environment',
      'ecs-eks-fargate.elastic-beanstalk',
      'ecs-eks-fargate.app2container',
    ])
  })
```

### `api-gateway-step-functions` — 개념 20개, 자리가 바뀌는 개념 19개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | API Gateway | `api-gateway-step-functions.api-gateway` | API Gateway |
| 2 | 5 | API Gateway | `api-gateway-step-functions.api-gateway-jwt-authorizer` | HTTP API의 JWT 권한 부여자 |
| 3 | 6 | API Gateway | `api-gateway-step-functions.api-gateway-rest-vs-http-timeout` | REST API와 HTTP API의 통합 타임아웃 |
| 4 | 7 | API Gateway | `api-gateway-step-functions.api-gateway-rest-only-features` | REST API의 API 키·요청 유효성 검사·스로틀링 |
| 5 | 8 | API Gateway | `api-gateway-step-functions.api-gateway-websocket-api` | WebSocket API |
| 6 | 9 | API Gateway | `api-gateway-step-functions.api-gateway-api-key-not-auth` | 식별 장치인 API 키 |
| 7 | 10 | API Gateway | `api-gateway-step-functions.api-gateway-resource-policy` | API Gateway 리소스 정책 |
| 8 | 11 | API Gateway | `api-gateway-step-functions.api-gateway-endpoint-types` | 엣지 최적화 엔드포인트와 리전 엔드포인트 |
| 9 | 12 | API Gateway | `api-gateway-step-functions.api-gateway-behind-cloudfront` | CloudFront의 HTTP API 오리진 |
| 10 | 13 | API Gateway | `api-gateway-step-functions.api-gateway-lambda-proxy-integration` | REST API의 Lambda 프록시 통합 |
| 11 | 14 | API Gateway | `api-gateway-step-functions.api-gateway-aws-service-integration` | API Gateway의 AWS 서비스 통합 |
| 12 | 18 | API Gateway | `api-gateway-step-functions.api-gateway-custom-domain-name` | API Gateway 사용자 지정 도메인 이름 |
| 13 | 19 | API Gateway | `api-gateway-step-functions.api-gateway-mapping-template-limits` | 매핑 템플릿으로 되는 변환과 안 되는 변환 |
| 14 | 20 | API Gateway | `api-gateway-step-functions.api-gateway-ip-restriction-by-resource-policy` | 리소스 정책의 IP 주소 제한 |
| 15 | 2 | Step Functions | `api-gateway-step-functions.step-functions` | Step Functions |
| 16 | 3 | Step Functions | `api-gateway-step-functions.step-functions-features` | Step Functions의 수동 승인과 재시도 |
| 17 | 15 | Step Functions | `api-gateway-step-functions.step-functions-long-running-workflow` | 최대 1년까지 이어지는 Step Functions 실행 |
| 18 | 16 | Step Functions | `api-gateway-step-functions.step-functions-express-workflow` | Express 워크플로 |
| 19 | 17 | Step Functions | `api-gateway-step-functions.step-functions-map-state` | Map 상태의 항목별 반복 호출 |
| 20 | 4 | Amplify | `api-gateway-step-functions.amplify` | AWS Amplify |

현재 테스트 제목(이것으로 찾는다): `API Gateway·Step Functions 주제가 두 서비스 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('API Gateway·Step Functions 주제가 API Gateway·Step Functions·Amplify 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'api-gateway-step-functions')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: API Gateway(14) → Step Functions(5) → Amplify(1).
    // API Gateway 블록은 기본 → API 유형·API 키·접근 통제·엔드포인트·통합 방식(갈림길) →
    // 인증서 리전·매핑 템플릿·IP 제한(세부) 순이다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'api-gateway-step-functions.api-gateway',
      'api-gateway-step-functions.api-gateway-jwt-authorizer',
      'api-gateway-step-functions.api-gateway-rest-vs-http-timeout',
      'api-gateway-step-functions.api-gateway-rest-only-features',
      'api-gateway-step-functions.api-gateway-websocket-api',
      'api-gateway-step-functions.api-gateway-api-key-not-auth',
      'api-gateway-step-functions.api-gateway-resource-policy',
      'api-gateway-step-functions.api-gateway-endpoint-types',
      'api-gateway-step-functions.api-gateway-behind-cloudfront',
      'api-gateway-step-functions.api-gateway-lambda-proxy-integration',
      'api-gateway-step-functions.api-gateway-aws-service-integration',
      'api-gateway-step-functions.api-gateway-custom-domain-name',
      'api-gateway-step-functions.api-gateway-mapping-template-limits',
      'api-gateway-step-functions.api-gateway-ip-restriction-by-resource-policy',
      'api-gateway-step-functions.step-functions',
      'api-gateway-step-functions.step-functions-features',
      'api-gateway-step-functions.step-functions-long-running-workflow',
      'api-gateway-step-functions.step-functions-express-workflow',
      'api-gateway-step-functions.step-functions-map-state',
      'api-gateway-step-functions.amplify',
    ])
  })
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 2
```

`verify-order.mjs 2`이 보는 것 — 사용자가 매 배치에 검증하라고 한 항목 그대로다.

- 개념 누락·중복 0, 주제별 concept id 집합이 착수 시점과 같다.
- 문항 해시가 착수 시점 `aadc1894…`와 같다 — 문항·보기·해설·answerIndex·문항 배열 변경 0.
- 순서와 무관한 내용 해시가 착수 시점 `8e67f789…`와 같다 — 개념 본문 문자열 변경 0.
- `topics.json`과 `topics-baseline.json`에서 바뀐 것이 줄의 자리(와 끝 쉼표)뿐이다.
- 순서가 바뀐 주제가 정확히 step 1~2에서 명세한 주제들이다.
- 순서가 바뀐 주제마다 서비스 왕복 before → after를 찍고, after가 0이 아니면 실패한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data.test.ts`에서 바뀐 것이 명세한 `it` 블록뿐인가?
   - 명세한 주제 말고 다른 주제의 개념 순서가 그대로인가? (`verify-order.mjs`가 본다)
   - 저장소에 새 파일이 생기지 않았는가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 2을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 아래를 적는다.
     - 주제마다 `자리 바뀐 개념 수`와 `왕복 before → after` — `verify-order.mjs 2`의 이 step 주제 출력
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
