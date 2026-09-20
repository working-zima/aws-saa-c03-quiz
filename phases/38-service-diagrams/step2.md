# Step 2: hybrid-paths

## 배경

`hybrid-connectivity` 주제의 개념 19개는 온프레미스와 AWS를 잇는 방법들이다.
Site-to-Site VPN·Direct Connect·Transit Gateway·Direct Connect Gateway·Client VPN이
**각각 어디로 들어와 무엇에 닿는지**가 서로 다른데, 글로만 읽으면 다섯이 같은 말로 들린다.

step 1이 세운 규약을 그대로 따른다. **규약을 다시 정하지 마라.**

## 읽어야 할 파일

- `phases/38-service-diagrams/step0.md`, `step1.md` — 규약과 금지사항.
- `phases/38-service-diagrams/index.json`의 **step 1 `summary`** — 실측값이 거기 있다.
- `src/components/diagrams/VpcPathsDiagram.tsx` — 먼저 그려진 도식. 구조와 이름을 맞춘다.
- `src/components/diagrams/DiagramFrame.tsx`, `src/lib/svg-bounds.ts`.
- `src/data/topics.json`의 `hybrid-connectivity` 개념들.

## 자리

- 컴포넌트: `src/components/diagrams/HybridPathsDiagram.tsx`
- 매핑: `registry.ts`에 `'hybrid-connectivity.vpn-vs-direct-connect': HybridPathsDiagram`

앵커가 `vpn-vs-direct-connect`인 이유: 두 방식을 비교하는 개념이라 그 자리에서 배치도를
보면 "무엇이 인터넷을 지나고 무엇이 안 지나는가"가 한눈에 갈린다.

## 도식 내용

### 그룹

1. `온프레미스 데이터 센터` — 왼쪽(또는 위) 바깥 박스.
2. `인터넷` — 가운데 층. **VPN과 Client VPN만 이 층을 지난다.**
3. `Direct Connect 위치` — 인터넷과 나란한 별도 층. 전용 회선이 인터넷을 지나지 않음을 위치로 보인다.
4. `리전` 박스 — 그 안에 `VPC A`, `VPC B`.

### 노드

| id | 라벨 | 자리 | 색 |
|---|---|---|---|
| `onprem` | 온프레미스 데이터 센터 | 바깥 | 무채색 |
| `cgw` | Customer Gateway | 온프레미스 쪽 | 무채색 |
| `remote` | 원격 사용자 | 바깥 | 무채색 |
| `internet` | 인터넷 | 가운데 층 | 무채색 |
| `dxloc` | Direct Connect 위치 | 가운데 층 | 무채색 |
| `vgwa` | 가상 프라이빗 게이트웨이 (VPC A) | VPC A | `diagram-resource` |
| `vgwb` | 가상 프라이빗 게이트웨이 (VPC B) | VPC B | `diagram-resource` |
| `tgw` | Transit Gateway | 리전, VPC 밖 | `diagram-managed` |
| `dxgw` | Direct Connect Gateway | 리전, VPC 밖 | `diagram-managed` |
| `vpca` | VPC A 자원 | VPC A | `diagram-resource` |
| `vpcb` | VPC B 자원 | VPC B | `diagram-resource` |

라벨이 280 폭 2열에 안 들어가면 1열 전체 폭으로 펴라. 줄이지 마라.
`가상 프라이빗 게이트웨이 (VPC A)`는 길어서 1열이 될 가능성이 높다.

### 시나리오 여섯

`caption`은 아래 개념 본문의 사실에서 **직접 써라.** 본문 문장을 옮기지 마라.

| id | label | 경로 | 근거 개념 id |
|---|---|---|---|
| `s1` | Site-to-Site VPN | onprem → cgw → internet → vgwa | `site-to-site-vpn`, `access-terms`, `virtual-private-gateway` |
| `s2` | Direct Connect | onprem → dxloc → vgwa | `direct-connect`, `direct-connect-caveats`, `vpn-vs-direct-connect` |
| `s3` | Transit Gateway | onprem → tgw → vpca, tgw → vpcb | `transit-gateway` |
| `s4` | Direct Connect Gateway | onprem → dxloc → dxgw → tgw → vpca·vpcb | `direct-connect-gateway`, `direct-connect-vif-types` |
| `s5` | Client VPN | remote → internet → vpca | `client-vpn` |
| `s6` | VPC마다 따로 맺는 VPN | onprem → vgwa, onprem → vgwb (**둘 사이에는 경로가 없다**) | `per-vpc-vpn-for-isolation` |

모두 `hybrid-connectivity.` 접두사를 붙인 id다.

**캡션에는 바닥이 있다.** 경로 그림이 이미 말하는 것(A에서 B로 간다)을 글로 되풀이하지 마라.
각 캡션은 **그림이 말하지 못하는 것 하나**를 반드시 담는다 — 그 경로가 성립하는 조건,
그 경로의 제약, 또는 왜 다른 경로가 아닌가. 한 줄 요약으로 끝내면 캡션을 둔 이유가 없다.
`figcaption`은 두 줄 자리를 비워 두고 있다.

`s2`의 캡션에는 **전용선이지만 트래픽을 암호화하지 않는다**는 사실을 담아라
(`direct-connect-caveats`). 전용선이 곧 암호화라는 오해가 이 주제의 대표적인 함정이다.

`s6`이 이 도식에서 값이 가장 큰 시나리오다 — 경로 **두 개를 켜되 그 둘을 잇는 선은 없음**을
보여 "연결했는데 왜 안 되는가"를 눈으로 답한다. 빼지 마라.

## 강조 방식

step 1과 같다. 시나리오의 `nodes`에 없는 노드는 흐려지고, `paths`에 있는 경로만 보인다.
그룹 박스는 흐려지지 않는다.

## 테스트

`src/components/diagrams/HybridPathsDiagram.test.tsx`를 먼저 쓴다.

1. 시나리오를 고르지 않으면 흐려진 노드가 없고 보이는 경로도 없다.
2. `Direct Connect`를 고르면 `internet` 노드가 **흐려진다.** (인터넷을 지나지 않는다는 사실의 회귀 테스트다.)
3. `Site-to-Site VPN`을 고르면 `internet`이 선명하다.
4. `VPC마다 따로 맺는 VPN`을 고르면 경로가 정확히 둘이고, `vgwa`와 `vgwb`를 직접 잇는 경로 id가 없다.
5. 경계: 모든 `rect`가 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`에서 빈 배열.
6. 글자 넘침: 모든 노드에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`.
7. `viewBox` 폭이 `280`이다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 금지사항

- **`DiagramFrame.tsx`·`svg-bounds.ts`를 고치지 마라.** 모자라면 `summary`에 적어라.
- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **아래를 이 도식에 넣지 마라** — 280 폭에서 읽히지 않는다:
  `transit-gateway-cross-region-peering`(리전 간 피어링), `direct-connect-resiliency`(이중화 구성),
  `onprem-access-via-interface-endpoint`(인터페이스 엔드포인트),
  `centralized-onprem-egress`(아웃바운드 집중), Local Zone·Outposts·Wavelength.
  전부 이 주제의 개념이지만 한 장에 담으면 도식이 무너진다.
- **없는 사실을 그리지 마라.** 위 표에 근거 개념 id가 없는 노드·경로를 더하지 마라.
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 캡션에 그대로 옮기지 마라.**
- 기존 테스트를 깨뜨리지 마라.
