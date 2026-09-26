# Step 5: peering-scale

## 배경

`vpc-networking.vpc-peering-scaling-limit`는 "피어링은 1:1 연결이라 VPC가 늘면 연결 수가 폭증한다"고
말하고, 수백 개로 확장할 계획이면 Transit Gateway를 쓰라고 한다. "폭증"이 얼마인지는 글로 잘 서지
않는다. 사용자가 가져온 HTML은 VPC 수 슬라이더로 메시(피어링)와 허브(Transit Gateway)의 선 수를
나란히 보여준다.

이 앱에는 슬라이더가 없다. **VPC 수 셋(3·6·10)을 시나리오 버튼으로 고정한다**(ADR-037).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**, 특히 「수량과 상태를 바꾸는 도식」(사선 허용, 계산 숫자의 전제)
- `phases/40-vpc-visuals/index.json`의 step 0~4 `summary`
- `src/types/visuals.ts`, `src/data/visuals/vpc-networking.json`
- `src/components/diagrams/NatCountDiagram.tsx` — 상태 시나리오의 선례(step 4)
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `vpc-networking.vpc-peering`, `vpc-networking.vpc-peering-scaling-limit`,
  `hybrid-connectivity.transit-gateway`

## 작업

### 1. 순수 함수 — `src/lib/peering.ts` (새 파일)

```ts
// 모든 VPC가 서로 통신해야 할 때 1:1 피어링으로 필요한 연결 수
export function meshConnectionCount(vpcCount: number): number
// 같은 VPC들을 허브 하나에 한 번씩 붙일 때의 연결 수
export function hubAttachmentCount(vpcCount: number): number
// 원 위에 n개를 균등하게 놓는 좌표(12시 방향에서 시작, 시계 방향)
export function ringPoints(count: number, cx: number, cy: number, r: number): Array<{ x: number; y: number }>
```

`src/lib/peering.test.ts`를 **먼저 쓰고 실패를 확인한 뒤** 구현한다. 확인할 값:
`meshConnectionCount`의 2→1, 3→3, 6→15, 10→45, 100→4950. `hubAttachmentCount`의 n→n.
`ringPoints`의 첫 점이 `(cx, cy - r)`이고 점 수가 `count`다. React를 import하지 마라.

### 2. 도식 — `src/components/diagrams/PeeringScaleDiagram.tsx`

- 문구: JSON `diagrams["peering-scale"]`
- 매핑: `registry.ts`에 `'vpc-networking.vpc-peering-scaling-limit': PeeringScaleDiagram` 한 줄

**모양**: 그룹 박스 둘을 위아래로 쌓는다. 위 `mesh`(라벨 `VPC 피어링`), 아래 `hub`(라벨 `Transit Gateway`).

- `mesh`: VPC n개를 원 위에 놓고(`ringPoints`) **모든 쌍을 사선으로** 잇는다.
- `hub`: 같은 n개를 원 위에 놓고 가운데 `Transit Gateway` 노드에 하나씩 잇는다.
- VPC 노드는 라벨 `VPC`의 작은 상자다(`estimateTextWidth('VPC', 10) + 12 <= 폭`). n=10에서도 원 위 상자끼리
  겹치지 않는 반지름을 골라라.
- 각 그룹 아래에 곁말(9)로 `연결 N개`를 쓴다. N은 위 두 함수의 값이다.
- 선은 `stroke-disabled` 1px이다. 메시의 선이 많아지는 것이 이 도식이 보여줄 것이므로 **선을 강조색으로
  칠하지 마라.** 파랑(`diagram-managed`)은 `Transit Gateway` 노드 테두리에만 쓴다(AWS 관리 서비스).

**시나리오 셋**:

| id | label | VPC 수 |
|---|---|---|
| `p3` | VPC 3개 | 3 |
| `p6` | VPC 6개 | 6 |
| `p10` | VPC 10개 | 10 |

`전체`(아무것도 고르지 않음)는 **VPC 4개**로 그린다. `idleCaption`이 수를 골라 보라고 안내한다.
이 도식의 시나리오는 노드를 흐리지 않는다 — 수가 바뀌면 그림 자체가 다시 그려진다.
`DiagramScenario`의 `nodes`·`paths`는 빈 배열로 넘기고, 그리는 수는 컴포넌트가 선택된 시나리오 id로 정한다.

| id | 캡션에 담을 사실 | `sources` |
|---|---|---|
| `p3` | 모든 VPC가 서로 통신해야 한다면, 셋까지는 두 방식의 연결 수가 같다 | `vpc-networking.vpc-peering`, `vpc-networking.vpc-peering-scaling-limit` |
| `p6` | 피어링은 쌍마다 하나라 VPC 수보다 빠르게 늘어난다 | `vpc-networking.vpc-peering-scaling-limit` |
| `p10` | 수백 개로 늘릴 계획이면 VPC마다 허브에 한 번 붙는 Transit Gateway를 쓴다 | `vpc-networking.vpc-peering-scaling-limit`, `hybrid-connectivity.transit-gateway` |

**캡션 셋 모두 "모든 VPC가 서로 통신해야 한다면"이라는 전제를 담거나, 그 전제를 `idleCaption`이 먼저
말해야 한다.** 이유: `n(n-1)/2`는 그 전제에서만 성립한다(UI_GUIDE 「수량과 상태를 바꾸는 도식」).
캡션은 사실에서 직접 써라. 숫자는 쓰되 그림 아래 곁말과 같은 값이어야 한다.

도식의 `sources`: `vpc-networking.vpc-peering-scaling-limit`, `hybrid-connectivity.transit-gateway`.

### 3. 테스트 — `PeeringScaleDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. `전체`에서 메시 선 6개(4개의 쌍), 허브 선 4개가 그려진다.
2. `p3`·`p6`·`p10`에서 메시 선 수가 3·15·45, 허브 선 수가 3·6·10이고, 곁말 `연결 N개`가 같은 값이다.
3. `p10`에서 VPC 상자끼리 겹치지 않는다(모든 쌍의 교집합 넓이 0).
4. 관문 5(viewBox 경계, n=10 포함)·6(라벨 넘침)·7(폭 280).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

메시의 사선은 `paths` 맵에 넣지 않는 그림 요소다. 교차 검사기는 직교 경로를 보는 도구이므로 이 도식의
사선을 검사 대상으로 만들려고 **검사기를 고치지 마라.**

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 슬라이더가 없는가, 선에 강조색이 없는가, 애니메이션이 없는가, 전제가 캡션에 있는가.
3. `phases/40-vpc-visuals/index.json`의 step 5를 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, 원 반지름과 VPC 상자 크기, 테스트 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **슬라이더·숫자 입력을 만들지 마라.** 이유: ADR-037.
- **"100개면 4,950개"처럼 그림에 없는 수를 캡션에 쓰지 마라.** 이유: 캡션의 숫자는 그림의 곁말과 짝이어야
  학습자가 확인할 수 있다. 큰 수의 인상은 `p10`의 45로 충분하다.
- **Transit Gateway의 요금·한도·온프레미스 연결을 넣지 마라.** 이유: 이 도식의 일은 연결 수 하나다.
  온프레미스는 `hybrid-connectivity` 주제가 맡는다.
- **애니메이션을 넣지 마라.** 수가 바뀔 때 선이 자라거나 흐려지는 전환도 금지다(UI_GUIDE 「애니메이션」).
- **`DiagramFrame.tsx`·`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
