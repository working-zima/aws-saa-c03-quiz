# Step 2: destination-tree

## 배경

VPC 주제의 마지막 비교 개념 `vpc-networking.comparison`은 "연결 대상을 보면 네 기능이 갈린다"고
말한다. 목적지는 인터넷, AWS 서비스, 다른 VPC의 애플리케이션, 다른 VPC 전체다.

step 1의 경로 지도는 **어떻게 흐르는가**를 보여준다. 이 도식은 **무엇을 고르는가**를 보여준다 —
목적지 하나에 조건 한 줄을 붙이면 답이 하나로 좁혀진다. 사용자가 가져온 HTML의 "목적지로 답 고르기"
흐름도다.

**온프레미스 목적지는 넣지 않는다.** `hybrid-connectivity` 주제의 내용이고 `HybridPathsDiagram`이
맡는다(사용자 결정, ADR-037).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**, 특히 「한 개념 뒤의 여러 도식」과 「두 줄 노드」
- `phases/40-vpc-visuals/index.json`의 step 0·1 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`, `src/data/visuals/vpc-networking.json`
- `src/components/diagrams/VpcPathsDiagram.tsx` — step 1이 JSON에서 문구를 읽는 방식. 같은 방식을 쓴다.
- `src/components/diagrams/registry.ts` — 이 step이 `comparison` 항목을 배열로 바꾼다.
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 아래 표에 적힌 근거 개념들

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/VpcDestinationDiagram.tsx`
- 문구: JSON `diagrams["vpc-destination"]`
- 매핑: `registry.ts`의 `'vpc-networking.comparison'` 값을 `[VpcPathsDiagram, VpcDestinationDiagram]`로
  바꾼다. **지도가 먼저다**(UI_GUIDE 「한 개념 뒤의 여러 도식」 — 넓은 그림 먼저, 판단 규칙 나중).

### 모양

- **그룹 박스 넷**이 위에서 아래로 쌓인다. 그룹 라벨이 목적지다: `인터넷`, `AWS 서비스`,
  `다른 VPC의 앱`, `다른 VPC 전체`.
- 각 그룹 안에 **두 줄 노드 셋**. 윗줄은 조건(곁말 9, `muted`), 아랫줄은 답(노드 라벨 10, `title`).
  노드 높이 44, 한 줄 전체 폭(240). UI_GUIDE 「두 줄 노드」를 따른다.
- **경로는 없다.** 위치(어느 그룹 안에 있는가)가 1차 채널이다.
- 시나리오 넷 = 목적지 넷. 누르면 그 그룹의 노드 셋만 선명하고 나머지 아홉은 `0.25`다.
  그룹 박스는 흐려지지 않는다.
- `idleCaption`은 목적지부터 고르라는 안내다. 색은 전부 무채색이다 — 이 도식의 노드는 AWS 관리
  영역이나 서브넷 자원이라는 계층을 나타내지 않는다(ADR-036).

### 노드 열둘

`nodeNotes`(윗줄)와 `nodes`(아랫줄)에 넣는다. 문장은 아래 사실에서 직접 써라. 줄마다
`estimateTextWidth + 12 <= 240`을 지켜야 하므로 짧게 쓴다.

| 그룹 | id | 조건(윗줄)의 사실 | 답(아랫줄) | 근거 개념 id |
|---|---|---|---|---|
| 인터넷 | `inet-ipv4` | IPv4, 안에서 밖으로만 | NAT 게이트웨이 | `vpc-networking.nat-gateway`, `vpc-networking.egress-only-igw` |
| 인터넷 | `inet-ipv6` | IPv6, 안에서 밖으로만 | Egress-only 인터넷 게이트웨이 | `vpc-networking.egress-only-igw` |
| 인터넷 | `inet-both` | 밖에서 들어오는 요청도 받음 | 인터넷 게이트웨이 | `vpc-networking.internet-gateway` |
| AWS 서비스 | `svc-gateway` | S3·DynamoDB, 비용 효율 | 게이트웨이 엔드포인트 | `vpc-networking.vpc-endpoint`, `vpc-networking.endpoint-pricing` |
| AWS 서비스 | `svc-interface` | 그 밖의 서비스, 여러 종류 | 인터페이스 엔드포인트 | `vpc-networking.vpc-endpoint`, `vpc-networking.endpoint-pricing` |
| AWS 서비스 | `svc-no-public` | 공용 IP를 쓰면 안 됨 | NAT 게이트웨이로는 못 채움 | `vpc-networking.nat-gateway-traffic-uses-public-endpoints` |
| 다른 VPC의 앱 | `app-private` | 여러 계정·VPC가 사설로 접속 | PrivateLink | `vpc-networking.privatelink`, `vpc-networking.privatelink-endpoint-service` |
| 다른 VPC의 앱 | `app-scope` | 누가 무엇에 닿을지 좁힘 | 엔드포인트 정책 | `vpc-networking.privatelink-endpoint-service` |
| 다른 VPC의 앱 | `app-routing` | 라우팅 테이블을 건드리지 않음 | 피어링·Transit Gateway와 다른 점 | `vpc-networking.privatelink-endpoint-service` |
| 다른 VPC 전체 | `vpc-pair` | 두 VPC 전체를 사설로 | VPC 피어링 | `vpc-networking.vpc-peering`, `vpc-networking.comparison` |
| 다른 VPC 전체 | `vpc-many` | 수백 개로 확장할 계획 | Transit Gateway | `vpc-networking.vpc-peering-scaling-limit` |
| 다른 VPC 전체 | `vpc-isolated` | 두 VPC가 서로 통신하면 안 됨 | VPC마다 Site-to-Site VPN | `vpc-networking.vpc-peering-scaling-limit` |

`svc-no-public`처럼 **탈락을 말하는 답에 빨강·X·취소선을 쓰지 마라.** 글자로 말한다(ADR-036·037).

### 시나리오 넷

| id | label | 선명한 노드 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|
| `d1` | 인터넷 | `inet-*` 셋 | 나가기만인지 들어오기도인지, IPv4인지 IPv6인지로 갈린다 | `vpc-networking.nat-gateway`, `vpc-networking.egress-only-igw`, `vpc-networking.internet-gateway` |
| `d2` | AWS 서비스 | `svc-*` 셋 | 인터넷을 거치지 않는 길은 엔드포인트다 · NAT 경로는 공용 엔드포인트로 나간다 | `vpc-networking.vpc-endpoint`, `vpc-networking.nat-gateway-traffic-uses-public-endpoints` |
| `d3` | 다른 VPC의 앱 | `app-*` 셋 | VPC 전체가 아니라 애플리케이션 하나만 연다 | `vpc-networking.privatelink`, `vpc-networking.privatelink-endpoint-service` |
| `d4` | 다른 VPC 전체 | `vpc-*` 셋 | 개수와 격리 조건이 답을 가른다 | `vpc-networking.vpc-peering-scaling-limit` |

도식의 `sources`는 `vpc-networking.comparison`이다.

### 테스트 — `VpcDestinationDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 처음에는 노드 열둘이 모두 선명하다.
2. 시나리오마다 그 그룹의 노드 셋만 선명하다.
3. 관문 5: 모든 `rect`가 viewBox 안. 관문 6: 노드마다 **두 줄 각각** `estimateTextWidth(윗줄, 9) + 12`와
   `estimateTextWidth(아랫줄, 10) + 12`가 노드 폭 이하. 관문 7: viewBox 폭 280.
4. 각 노드가 자기 그룹 박스 안에 있다.
5. `ConceptList`에 `comparison` 개념을 주면 지도 다음에 흐름도가 온다(두 `figure`의 순서).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 노드 문구에 위 표에 없는 사실이 없는가, 색·빨강·X를 쓰지 않았는가.
3. `phases/40-vpc-visuals/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, 가장 빠듯한 줄과 그 여유, `registry`의 `comparison` 값 모양.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **온프레미스 목적지와 VPN·Direct Connect 답을 넣지 마라.** 이유: 사용자 결정(ADR-037).
- **`Direct Connect + VPN 이중화` 같은 답을 넣지 마라.** 이유: 데이터에 근거가 없다.
- **경로선·화살표로 트리를 그리지 마라.** 이유: 이 도식은 위치가 1차 채널이다. 선을 그리면 열두 줄이
  한 그룹에서 흘러나오는 선으로 엉킨다.
- **`VpcPathsDiagram`을 고치지 마라.** 이유: step 1의 범위이고 이미 검증됐다.
- **`DiagramFrame.tsx`·`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
