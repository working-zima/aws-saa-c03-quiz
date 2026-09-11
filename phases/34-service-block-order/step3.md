# Step 3: network-analytics-reorder

**7개 주제의 개념을 서비스 블록 순서로 옮긴다** — `vpc-networking`·`security-groups-nacl`·`hybrid-connectivity`·`emr-glue-athena`·`kinesis-streaming`·`redshift-opensearch-quicksight`·`cloudwatch-xray`.

이 step은 사람이 중간에 확인하지 않는 무인 실행으로 돈다. 아래 명세와 AC를 정확히 지키고,
명세와 부딪히는 것을 발견하면 추측으로 넘기지 말고 멈춰라(아래 「선행 관계와 충돌하면」).
**이 7개 말고 다른 주제의 순서는 건드리지 않는다.** 앞 step에서 이미 재정렬한 주제도 다시
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
| `src/data/topics.json` | 아래 7개 주제의 개념 **줄의 자리**와 그에 따른 끝 쉼표 |
| `src/data/data.test.ts` | 아래 7개 주제의 순서 단언 `it` 블록(제목·주석·기대 배열) |
| `scripts/topics-baseline.json` | 아래 7개 주제의 `concepts` 항목 순서 |

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

### 1. `src/data/data.test.ts` — 순서 단언 7개

아래 「주제별 명세」의 **현재 테스트 제목**으로 `it` 블록을 찾아, 그 블록 **전체**를 명세의 코드
블록으로 바꾼다. 이 블록들 말고는 한 줄도 바꾸지 않는다 — 같은 파일에 이 주제들을 다루는 다른
테스트(갈림길이 한 주제 안에 있는지, 용어가 풀리는지 등)가 있지만 **건드리지 않는다.**

바꾼 뒤 `npm test`를 돌려 **이 7개 테스트가 실패하는 것을 확인한다.** 데이터가 아직 옛 순서라서
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

### `vpc-networking` — 개념 20개, 자리가 바뀌는 개념 16개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | VPC와 서브넷 | `vpc-networking.vpc-subnet` | VPC, 서브넷 |
| 2 | 2 | 인터넷 게이트웨이 | `vpc-networking.internet-gateway` | 인터넷 게이트웨이 |
| 3 | 3 | 인터넷 게이트웨이 | `vpc-networking.egress-only-igw` | Egress-only 인터넷 게이트웨이 |
| 4 | 4 | NAT 게이트웨이 | `vpc-networking.nat-gateway` | NAT 게이트웨이 |
| 5 | 10 | NAT 게이트웨이 | `vpc-networking.nat-gateway-traffic-uses-public-endpoints` | NAT 게이트웨이 경로의 목적지인 공용 엔드포인트 |
| 6 | 13 | NAT 게이트웨이 | `vpc-networking.nat-instance` | NAT 인스턴스와 NAT 게이트웨이의 차이 |
| 7 | 14 | NAT 게이트웨이 | `vpc-networking.nat-gateway-per-az` | 가용 영역마다 두는 NAT 게이트웨이 |
| 8 | 15 | NAT 게이트웨이 | `vpc-networking.internet-gateway-is-not-per-az` | 리전 수준 리소스인 인터넷 게이트웨이 |
| 9 | 16 | NAT 게이트웨이 | `vpc-networking.nat-gateway-count-by-environment` | 환경에 따라 달라지는 NAT 게이트웨이 수 |
| 10 | 17 | NAT 게이트웨이 | `vpc-networking.nat-gateway-elastic-ip` | NAT 게이트웨이에 붙이는 엘라스틱 IP |
| 11 | 5 | VPC 엔드포인트 | `vpc-networking.vpc-endpoint` | VPC Endpoint |
| 12 | 11 | VPC 엔드포인트 | `vpc-networking.endpoint-pricing` | 엔드포인트 유형별 비용 차이 |
| 13 | 18 | VPC 엔드포인트 | `vpc-networking.vpc-endpoint-policy` | VPC 엔드포인트 정책 |
| 14 | 20 | VPC 엔드포인트 | `vpc-networking.s3-is-regional` | 리전 수준 서비스인 S3 |
| 15 | 7 | VPC 피어링 | `vpc-networking.vpc-peering` | VPC 피어링 |
| 16 | 19 | VPC 피어링 | `vpc-networking.vpc-peering-scaling-limit` | VPC 피어링의 확장 한계 |
| 17 | 6 | PrivateLink | `vpc-networking.privatelink` | PrivateLink |
| 18 | 12 | PrivateLink | `vpc-networking.privatelink-endpoint-service` | PrivateLink 엔드포인트 서비스 |
| 19 | 9 | 비교 — NAT·엔드포인트·PrivateLink·피어링 | `vpc-networking.comparison` | NAT Gateway vs VPC Endpoint vs PrivateLink vs VPC 피어링 |
| 20 | 8 | VPC 플로우 로그 | `vpc-networking.vpc-flow-logs` | VPC 플로우 로그 |

현재 테스트 제목(이것으로 찾는다): `VPC 주제가 구성 요소 여덟 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('VPC 주제가 구성 요소 블록 다음에 네 연결 방식의 비교와 플로우 로그를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'vpc-networking')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: VPC와 서브넷(1) → 인터넷 게이트웨이(2) → NAT 게이트웨이(7) → VPC 엔드포인트(4) → VPC 피어링(2) → PrivateLink(2) → 비교
    //   — NAT·엔드포인트·PrivateLink·피어링(1) → VPC 플로우 로그(1).
    // internet-gateway-is-not-per-az는 인터넷 게이트웨이 개념이지만 본문이 바로 앞의 nat-gateway-per-az
    // 규칙을 전제로 대비하므로 NAT 블록 안에 둔다(규칙 5). PrivateLink 엔드포인트 서비스가 피어링과
    // 대비하므로 피어링 블록을 PrivateLink 앞에 둔다. 네 연결 방식의 비교는 네 블록 뒤(규칙 4).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'vpc-networking.vpc-subnet',
      'vpc-networking.internet-gateway',
      'vpc-networking.egress-only-igw',
      'vpc-networking.nat-gateway',
      'vpc-networking.nat-gateway-traffic-uses-public-endpoints',
      'vpc-networking.nat-instance',
      'vpc-networking.nat-gateway-per-az',
      'vpc-networking.internet-gateway-is-not-per-az',
      'vpc-networking.nat-gateway-count-by-environment',
      'vpc-networking.nat-gateway-elastic-ip',
      'vpc-networking.vpc-endpoint',
      'vpc-networking.endpoint-pricing',
      'vpc-networking.vpc-endpoint-policy',
      'vpc-networking.s3-is-regional',
      'vpc-networking.vpc-peering',
      'vpc-networking.vpc-peering-scaling-limit',
      'vpc-networking.privatelink',
      'vpc-networking.privatelink-endpoint-service',
      'vpc-networking.comparison',
      'vpc-networking.vpc-flow-logs',
    ])
  })
```

### `security-groups-nacl` — 개념 9개, 자리가 바뀌는 개념 6개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | 보안 그룹 | `security-groups-nacl.security-group` | 보안 그룹 (Security Group) |
| 2 | 5 | 보안 그룹 | `security-groups-nacl.security-group-referencing` | 보안 그룹 참조 |
| 3 | 8 | 보안 그룹 | `security-groups-nacl.alb-security-group-outbound-and-health-check-port` | 로드 밸런서 보안 그룹의 아웃바운드와 상태 검사 포트 |
| 4 | 9 | 보안 그룹 | `security-groups-nacl.nlb-security-group` | NLB에 붙이는 보안 그룹 |
| 5 | 2 | NACL | `security-groups-nacl.nacl` | NACL (Network Access Control List, 네트워크 ACL) |
| 6 | 6 | NACL | `security-groups-nacl.nacl-rule-limit` | NACL의 규칙 수 제한 |
| 7 | 7 | NACL | `security-groups-nacl.nacl-deny-at-source-subnet` | 보내는 쪽 서브넷에 거는 거부 규칙 |
| 8 | 3 | 비교 — 상태 저장과 Web ACL | `security-groups-nacl.security-group-stateful-vs-nacl-stateless` | 상태 저장과 상태 비저장 |
| 9 | 4 | 비교 — 상태 저장과 Web ACL | `security-groups-nacl.web-acl-vs-nacl` | Web ACL과 네트워크 ACL의 차이 |

현재 테스트 제목(이것으로 찾는다): `보안 그룹·NACL 주제가 둘의 소개 다음에 상태 저장 갈림길과 설정을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('보안 그룹·NACL 주제가 보안 그룹·NACL 블록 다음에 둘의 비교를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'security-groups-nacl')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: 보안 그룹(4) → NACL(3) → 비교 — 상태 저장과 Web ACL(2).
    // 상태 저장 ↔ 상태 비저장과 Web ACL ↔ 네트워크 ACL은 두 블록을 가르는 비교라 두 블록 뒤(규칙 4).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'security-groups-nacl.security-group',
      'security-groups-nacl.security-group-referencing',
      'security-groups-nacl.alb-security-group-outbound-and-health-check-port',
      'security-groups-nacl.nlb-security-group',
      'security-groups-nacl.nacl',
      'security-groups-nacl.nacl-rule-limit',
      'security-groups-nacl.nacl-deny-at-source-subnet',
      'security-groups-nacl.security-group-stateful-vs-nacl-stateless',
      'security-groups-nacl.web-acl-vs-nacl',
    ])
  })
```

### `hybrid-connectivity` — 개념 19개, 자리가 바뀌는 개념 18개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Site-to-Site VPN | `hybrid-connectivity.site-to-site-vpn` | Site-to-Site VPN |
| 2 | 5 | Site-to-Site VPN | `hybrid-connectivity.access-terms` | Customer Gateway와 Bastion Host |
| 3 | 2 | Client VPN | `hybrid-connectivity.client-vpn` | AWS Client VPN |
| 4 | 6 | Transit Gateway | `hybrid-connectivity.transit-gateway` | Transit Gateway |
| 5 | 12 | Transit Gateway | `hybrid-connectivity.transit-gateway-cross-region-peering` | 리전 간 Transit Gateway 피어링 |
| 6 | 3 | Direct Connect | `hybrid-connectivity.direct-connect` | Direct Connect |
| 7 | 4 | Direct Connect | `hybrid-connectivity.virtual-private-gateway` | 가상 프라이빗 게이트웨이(VGW) |
| 8 | 7 | Direct Connect | `hybrid-connectivity.direct-connect-gateway` | Direct Connect Gateway |
| 9 | 16 | Direct Connect | `hybrid-connectivity.direct-connect-caveats` | Direct Connect의 두 가지 함정 |
| 10 | 17 | Direct Connect | `hybrid-connectivity.direct-connect-resiliency` | Direct Connect 최대 복원력 구성 |
| 11 | 18 | Direct Connect | `hybrid-connectivity.direct-connect-vif-types` | Direct Connect의 가상 인터페이스(VIF) |
| 12 | 10 | 비교 — VPN과 Direct Connect | `hybrid-connectivity.vpn-vs-direct-connect` | Site-to-Site VPN vs Direct Connect |
| 13 | 9 | 비교 — VPN과 Direct Connect | `hybrid-connectivity.onprem-connectivity-heuristic` | 온프레미스 연결 문제의 출발점 |
| 14 | 11 | 비교 — VPN과 Direct Connect | `hybrid-connectivity.per-vpc-vpn-for-isolation` | VPC마다 따로 맺는 Site-to-Site VPN |
| 15 | 13 | 온프레미스와 오가는 트래픽 | `hybrid-connectivity.onprem-access-via-interface-endpoint` | 온프레미스에서 쓰는 인터페이스 엔드포인트 |
| 16 | 14 | 온프레미스와 오가는 트래픽 | `hybrid-connectivity.data-locality-cost` | 데이터 지역성으로 전송 비용 줄이기 |
| 17 | 19 | 온프레미스와 오가는 트래픽 | `hybrid-connectivity.centralized-onprem-egress` | 온프레미스로 모으는 아웃바운드 인터넷 트래픽 |
| 18 | 8 | 리전에 붙는 엣지 옵션 | `hybrid-connectivity.region-attached-edge-options` | Local Zone·Outposts·Wavelength Zone의 리전 연결 전제 |
| 19 | 15 | 리전에 붙는 엣지 옵션 | `hybrid-connectivity.outposts-data-residency` | Outposts로 지키는 데이터 상주 요건 |

현재 테스트 제목(이것으로 찾는다): `하이브리드 연결 주제가 연결 수단 여덟 다음에 갈림길과 한계를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('하이브리드 연결 주제가 연결 수단 블록 다음에 선택 기준·트래픽 설계·엣지 옵션을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'hybrid-connectivity')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: Site-to-Site VPN(2) → Client VPN(1) → Transit Gateway(2) → Direct Connect(6) → 비교 — VPN과
    //   Direct Connect(3) → 온프레미스와 오가는 트래픽(3) → 리전에 붙는 엣지 옵션(2).
    // Direct Connect 블록의 가상 프라이빗 게이트웨이·Direct Connect Gateway·VIF 유형이 Transit Gateway를
    // 전제로 쓰므로 Transit Gateway를 Direct Connect 앞에 둔다. VPN과 Direct Connect의 비교·출발점·
    // VPC마다 따로 맺는 VPN은 두 수단과 Transit Gateway를 함께 부르므로 연결 수단 블록 뒤(규칙 4).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'hybrid-connectivity.site-to-site-vpn',
      'hybrid-connectivity.access-terms',
      'hybrid-connectivity.client-vpn',
      'hybrid-connectivity.transit-gateway',
      'hybrid-connectivity.transit-gateway-cross-region-peering',
      'hybrid-connectivity.direct-connect',
      'hybrid-connectivity.virtual-private-gateway',
      'hybrid-connectivity.direct-connect-gateway',
      'hybrid-connectivity.direct-connect-caveats',
      'hybrid-connectivity.direct-connect-resiliency',
      'hybrid-connectivity.direct-connect-vif-types',
      'hybrid-connectivity.vpn-vs-direct-connect',
      'hybrid-connectivity.onprem-connectivity-heuristic',
      'hybrid-connectivity.per-vpc-vpn-for-isolation',
      'hybrid-connectivity.onprem-access-via-interface-endpoint',
      'hybrid-connectivity.data-locality-cost',
      'hybrid-connectivity.centralized-onprem-egress',
      'hybrid-connectivity.region-attached-edge-options',
      'hybrid-connectivity.outposts-data-residency',
    ])
  })
```

### `emr-glue-athena` — 개념 20개, 자리가 바뀌는 개념 17개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | EMR | `emr-glue-athena.emr` | EMR (Elastic MapReduce) |
| 2 | 2 | EMR | `emr-glue-athena.emr-node-types` | EMR 클러스터의 세 가지 노드 |
| 3 | 9 | EMR | `emr-glue-athena.emr-transient-cluster` | 일시적 클러스터와 장기 실행 클러스터 |
| 4 | 10 | EMR | `emr-glue-athena.emr-managed-scaling` | EMR 관리형 스케일링 |
| 5 | 17 | EMR | `emr-glue-athena.emr-node-instance-family-choice` | 노드 역할에 따른 인스턴스 제품군 선택 |
| 6 | 18 | EMR | `emr-glue-athena.emr-runtime-role` | EMR 런타임 역할 |
| 7 | 19 | EMR | `emr-glue-athena.emr-security-configuration` | EMR 보안 구성 |
| 8 | 3 | Spark | `emr-glue-athena.spark` | Spark |
| 9 | 4 | Glue | `emr-glue-athena.glue` | Glue |
| 10 | 5 | Glue | `emr-glue-athena.glue-crawler` | AWS Glue Crawler |
| 11 | 6 | Glue | `emr-glue-athena.glue-databrew` | AWS Glue DataBrew |
| 12 | 11 | Glue | `emr-glue-athena.glue-etl-with-per-customer-kms-key` | 고객마다 다른 키로 암호화하는 Glue ETL 작업 |
| 13 | 7 | Athena | `emr-glue-athena.athena` | Athena |
| 14 | 12 | Athena | `emr-glue-athena.athena-encrypted-and-pay-per-query` | Athena의 과금 단위와 암호화된 데이터 |
| 15 | 13 | Athena | `emr-glue-athena.athena-federated-query` | Athena 페더레이션 쿼리 |
| 16 | 14 | Athena | `emr-glue-athena.log-storage-s3-athena` | 조회 빈도로 나뉘는 로그 저장 위치 |
| 17 | 8 | Lake Formation | `emr-glue-athena.lake-formation` | AWS Lake Formation |
| 18 | 15 | Lake Formation | `emr-glue-athena.lake-formation-blueprint-and-athena` | Lake Formation 블루프린트와 Athena의 열 수준 권한 |
| 19 | 16 | Lake Formation | `emr-glue-athena.lake-formation-lf-tags` | LF 태그 기반 액세스 제어 |
| 20 | 20 | Apache Parquet | `emr-glue-athena.parquet-columnar-format` | Apache Parquet |

현재 테스트 제목(이것으로 찾는다): `EMR·Glue·Athena 주제가 서비스 소개 다음에 갈림길과 클러스터 설정을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('EMR·Glue·Athena 주제가 EMR·Spark·Glue·Athena·Lake Formation·Parquet 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'emr-glue-athena')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: EMR(7) → Spark(1) → Glue(4) → Athena(4) → Lake Formation(3) → Apache Parquet(1).
    // EMR 블록: 관리형 스케일링이 코어 노드를 언급하므로 노드 세 가지가 그 앞(규칙 5), 노드 역할별
    // 제품군은 세부라 갈림길 뒤. Glue의 고객별 키 ETL은 EMR과 대비하므로 EMR 블록 뒤, Lake Formation
    // 블루프린트는 Athena를 거친 열 권한을 쓰므로 Athena 블록 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'emr-glue-athena.emr',
      'emr-glue-athena.emr-node-types',
      'emr-glue-athena.emr-transient-cluster',
      'emr-glue-athena.emr-managed-scaling',
      'emr-glue-athena.emr-node-instance-family-choice',
      'emr-glue-athena.emr-runtime-role',
      'emr-glue-athena.emr-security-configuration',
      'emr-glue-athena.spark',
      'emr-glue-athena.glue',
      'emr-glue-athena.glue-crawler',
      'emr-glue-athena.glue-databrew',
      'emr-glue-athena.glue-etl-with-per-customer-kms-key',
      'emr-glue-athena.athena',
      'emr-glue-athena.athena-encrypted-and-pay-per-query',
      'emr-glue-athena.athena-federated-query',
      'emr-glue-athena.log-storage-s3-athena',
      'emr-glue-athena.lake-formation',
      'emr-glue-athena.lake-formation-blueprint-and-athena',
      'emr-glue-athena.lake-formation-lf-tags',
      'emr-glue-athena.parquet-columnar-format',
    ])
  })
```

### `kinesis-streaming` — 개념 16개, 자리가 바뀌는 개념 13개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Kinesis Data Streams | `kinesis-streaming.kinesis-data-streams` | Kinesis Data Streams |
| 2 | 10 | Kinesis Data Streams | `kinesis-streaming.kinesis-retention-and-fanout` | 보존 기간과 향상된 팬아웃 |
| 3 | 11 | Kinesis Data Streams | `kinesis-streaming.kinesis-client-library` | 샤드와 체크포인트를 직접 다루는 소비자 |
| 4 | 13 | Kinesis Data Streams | `kinesis-streaming.kinesis-record-size-limit` | 스트림에 넣을 수 있는 레코드 크기 |
| 5 | 14 | Kinesis Data Streams | `kinesis-streaming.kinesis-partition-key-hot-shard` | 파티션 키 쏠림으로 생기는 핫 샤드 |
| 6 | 15 | Kinesis Data Streams | `kinesis-streaming.kinesis-capacity-mode` | Kinesis 스트림의 프로비저닝 모드와 온디맨드 모드 |
| 7 | 2 | Data Firehose | `kinesis-streaming.data-firehose` | Data Firehose |
| 8 | 8 | Data Firehose | `kinesis-streaming.firehose-lambda-transformation` | Firehose의 적재 전 Lambda 변환 |
| 9 | 9 | Data Firehose | `kinesis-streaming.firehose-format-conversion` | Firehose의 형식 변환 |
| 10 | 16 | Data Firehose | `kinesis-streaming.firehose-buffering` | Firehose의 버퍼링 지연 |
| 11 | 3 | Managed Service for Apache Flink | `kinesis-streaming.managed-service-apache-flink` | Managed Service for Apache Flink |
| 12 | 7 | Managed Service for Apache Flink | `kinesis-streaming.flink-kinesis-source-sink` | Flink의 Kinesis 스트림 소스와 싱크 |
| 13 | 6 | 비교 — 세 서비스의 담당 단계 | `kinesis-streaming.streaming-services-comparison` | Data Firehose vs Kinesis Data Streams vs Managed Service for Apache Flink |
| 14 | 4 | Kinesis Video Streams | `kinesis-streaming.kinesis-video-streams` | Amazon Kinesis Video Streams |
| 15 | 5 | Amazon MSK | `kinesis-streaming.msk` | Amazon MSK (Managed Streaming for Apache Kafka) |
| 16 | 12 | Amazon MSK | `kinesis-streaming.msk-kafka-connect` | MSK가 수집과 변환까지 맡는 방식 |

현재 테스트 제목(이것으로 찾는다): `스트리밍 주제가 서비스 다섯 다음에 갈림길과 한계값을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('스트리밍 주제가 Data Streams·Firehose·Flink 블록과 그 비교 다음에 Video Streams·MSK를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'kinesis-streaming')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: Kinesis Data Streams(6) → Data Firehose(4) → Managed Service for Apache Flink(2) → 비교 — 세
    //   서비스의 담당 단계(1) → Kinesis Video Streams(1) → Amazon MSK(2).
    // Flink의 Kinesis 소스·싱크가 Data Streams를 전제로 쓰므로 Flink가 Data Streams 뒤. 세 서비스의
    // 담당 단계 비교는 세 블록 뒤(규칙 4).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'kinesis-streaming.kinesis-data-streams',
      'kinesis-streaming.kinesis-retention-and-fanout',
      'kinesis-streaming.kinesis-client-library',
      'kinesis-streaming.kinesis-record-size-limit',
      'kinesis-streaming.kinesis-partition-key-hot-shard',
      'kinesis-streaming.kinesis-capacity-mode',
      'kinesis-streaming.data-firehose',
      'kinesis-streaming.firehose-lambda-transformation',
      'kinesis-streaming.firehose-format-conversion',
      'kinesis-streaming.firehose-buffering',
      'kinesis-streaming.managed-service-apache-flink',
      'kinesis-streaming.flink-kinesis-source-sink',
      'kinesis-streaming.streaming-services-comparison',
      'kinesis-streaming.kinesis-video-streams',
      'kinesis-streaming.msk',
      'kinesis-streaming.msk-kafka-connect',
    ])
  })
```

### `redshift-opensearch-quicksight` — 개념 11개, 자리가 바뀌는 개념 8개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | Redshift와 Spectrum | `redshift-opensearch-quicksight.redshift` | Redshift |
| 2 | 2 | Redshift와 Spectrum | `redshift-opensearch-quicksight.redshift-spectrum` | Redshift Spectrum |
| 3 | 5 | Redshift와 Spectrum | `redshift-opensearch-quicksight.oltp-vs-olap` | OLTP와 OLAP |
| 4 | 6 | Redshift와 Spectrum | `redshift-opensearch-quicksight.athena-vs-redshift-workload` | 임시 쿼리와 반복되는 고성능 쿼리 |
| 5 | 7 | Redshift와 Spectrum | `redshift-opensearch-quicksight.redshift-hot-cold-split` | 조회 빈도에 따른 Redshift 적재와 S3 보관 |
| 6 | 9 | Redshift와 Spectrum | `redshift-opensearch-quicksight.redshift-concurrency-scaling` | Redshift 동시성 확장 |
| 7 | 10 | Redshift와 Spectrum | `redshift-opensearch-quicksight.redshift-copy-from-s3` | S3에서 COPY 명령으로 하는 Redshift 병렬 적재 |
| 8 | 3 | OpenSearch | `redshift-opensearch-quicksight.opensearch-text-search` | Amazon OpenSearch Service |
| 9 | 4 | QuickSight | `redshift-opensearch-quicksight.quicksight` | Amazon QuickSight |
| 10 | 8 | QuickSight | `redshift-opensearch-quicksight.quicksight-ml-forecast` | QuickSight에 내장된 머신러닝 예측 |
| 11 | 11 | 운영 데이터를 S3에 남기는 경로 | `redshift-opensearch-quicksight.dynamodb-to-s3-analytics` | S3에 남기는 운영 테이블의 과거 데이터 |

현재 테스트 제목(이것으로 찾는다): `웨어하우스·검색·시각화 주제가 서비스 넷 다음에 갈림길과 적재 경로를 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('웨어하우스·검색·시각화 주제가 Redshift·OpenSearch·QuickSight 블록 다음에 적재 경로를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'redshift-opensearch-quicksight')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: Redshift와 Spectrum(7) → OpenSearch(1) → QuickSight(2) → 운영 데이터를 S3에 남기는 경로(1).
    // Redshift 블록: 기본·Spectrum → OLTP와 OLAP·Athena와의 갈림길·핫 콜드 분리 → 동시성 확장·COPY.
    // 운영 테이블의 과거 데이터를 S3에 남기는 경로는 조회를 Athena·QuickSight에 맡기므로 QuickSight 뒤.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'redshift-opensearch-quicksight.redshift',
      'redshift-opensearch-quicksight.redshift-spectrum',
      'redshift-opensearch-quicksight.oltp-vs-olap',
      'redshift-opensearch-quicksight.athena-vs-redshift-workload',
      'redshift-opensearch-quicksight.redshift-hot-cold-split',
      'redshift-opensearch-quicksight.redshift-concurrency-scaling',
      'redshift-opensearch-quicksight.redshift-copy-from-s3',
      'redshift-opensearch-quicksight.opensearch-text-search',
      'redshift-opensearch-quicksight.quicksight',
      'redshift-opensearch-quicksight.quicksight-ml-forecast',
      'redshift-opensearch-quicksight.dynamodb-to-s3-analytics',
    ])
  })
```

### `cloudwatch-xray` — 개념 11개, 자리가 바뀌는 개념 10개

| 새 자리 | 현재 자리 | 블록 | concept id | name |
|---:|---:|---|---|---|
| 1 | 1 | CloudWatch | `cloudwatch-xray.cloudwatch` | CloudWatch |
| 2 | 5 | CloudWatch | `cloudwatch-xray.cloudwatch-network-monitor` | CloudWatch Network Monitor |
| 3 | 6 | CloudWatch | `cloudwatch-xray.cloudwatch-container-insights` | CloudWatch Container Insights |
| 4 | 7 | CloudWatch | `cloudwatch-xray.log-analysis-options` | 로그 분석 선택지: OpenSearch와 CloudWatch Logs Insights |
| 5 | 9 | CloudWatch | `cloudwatch-xray.cloudwatch-agent-memory-metric` | CloudWatch 에이전트의 메모리 사용률 지표 |
| 6 | 10 | CloudWatch | `cloudwatch-xray.ec2-detailed-monitoring` | EC2 상세 모니터링의 1분 간격 지표 |
| 7 | 11 | CloudWatch | `cloudwatch-xray.cloudwatch-alarm-state-change-event` | CloudWatch 알람의 상태 변경 이벤트 |
| 8 | 2 | X-Ray | `cloudwatch-xray.x-ray` | X-Ray |
| 9 | 3 | Performance Insights | `cloudwatch-xray.performance-insight` | Performance Insights |
| 10 | 8 | Performance Insights | `cloudwatch-xray.performance-insights-rightsizing` | Performance Insights와 적정 규모 조정 |
| 11 | 4 | Managed Grafana | `cloudwatch-xray.amazon-managed-grafana` | Amazon Managed Grafana |

현재 테스트 제목(이것으로 찾는다): `CloudWatch·X-Ray 주제가 서비스 넷 다음에 관측의 경계와 지표 설정을 둔다`

이 `it` 블록 **전체**를 아래로 바꾼다. 제목·주석·기대 배열이 모두 바뀐다.

```ts
  it('CloudWatch·X-Ray 주제가 CloudWatch·X-Ray·Performance Insights·Managed Grafana 블록 순서로 개념을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'cloudwatch-xray')

    // ADR-033 서비스 블록 순서 — 블록마다 기본 → 주요 기능·갈림길 → 세부 기능·설정·한계.
    // 블록: CloudWatch(7) → X-Ray(1) → Performance Insights(2) → Managed Grafana(1).
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'cloudwatch-xray.cloudwatch',
      'cloudwatch-xray.cloudwatch-network-monitor',
      'cloudwatch-xray.cloudwatch-container-insights',
      'cloudwatch-xray.log-analysis-options',
      'cloudwatch-xray.cloudwatch-agent-memory-metric',
      'cloudwatch-xray.ec2-detailed-monitoring',
      'cloudwatch-xray.cloudwatch-alarm-state-change-event',
      'cloudwatch-xray.x-ray',
      'cloudwatch-xray.performance-insight',
      'cloudwatch-xray.performance-insights-rightsizing',
      'cloudwatch-xray.amazon-managed-grafana',
    ])
  })
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/34-service-block-order/verify-order.mjs 3
```

`verify-order.mjs 3`이 보는 것 — 사용자가 매 배치에 검증하라고 한 항목 그대로다.

- 개념 누락·중복 0, 주제별 concept id 집합이 착수 시점과 같다.
- 문항 해시가 착수 시점 `aadc1894…`와 같다 — 문항·보기·해설·answerIndex·문항 배열 변경 0.
- 순서와 무관한 내용 해시가 착수 시점 `8e67f789…`와 같다 — 개념 본문 문자열 변경 0.
- `topics.json`과 `topics-baseline.json`에서 바뀐 것이 줄의 자리(와 끝 쉼표)뿐이다.
- 순서가 바뀐 주제가 정확히 step 1~3에서 명세한 주제들이다.
- 순서가 바뀐 주제마다 서비스 왕복 before → after를 찍고, after가 0이 아니면 실패한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data.test.ts`에서 바뀐 것이 명세한 `it` 블록뿐인가?
   - 명세한 주제 말고 다른 주제의 개념 순서가 그대로인가? (`verify-order.mjs`가 본다)
   - 저장소에 새 파일이 생기지 않았는가?
3. 결과에 따라 `phases/34-service-block-order/index.json`의 step 3을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 아래를 적는다.
     - 주제마다 `자리 바뀐 개념 수`와 `왕복 before → after` — `verify-order.mjs 3`의 이 step 주제 출력
     - "선행 충돌 없음"
     - AC 결과(테스트 수 포함)
   - 선행 충돌 → 위 「선행 관계와 충돌하면」대로 `"blocked"`
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- 명세한 7개 주제 말고 다른 주제의 개념 순서를 바꾸지 마라. 이유: step마다 재정렬할 주제가
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
