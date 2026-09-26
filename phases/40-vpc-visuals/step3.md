# Step 3: resource-scope

## 배경

`vpc-networking.internet-gateway-is-not-per-az`는 "NAT 게이트웨이는 AZ마다 두는데 인터넷 게이트웨이는
왜 아닌가"에 답한다. 답은 **존재하는 단위가 다르다**는 것이다. NAT 게이트웨이는 가용 영역 안의
리소스라 그 영역과 함께 무너지고, 인터넷 게이트웨이는 가용 영역 단위로 존재하지 않는다.

이 도식은 그 말을 **상자 안에 누가 들어 있는가**로 보여준다. 사용자가 가져온 HTML의 "어디에 사는가"다.
원본은 칩 목록이었지만 이 앱에서는 280 폭 SVG의 중첩 그룹 박스로 그린다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체.** 정적 도식은 버튼을 렌더하지 않는다.
- `phases/40-vpc-visuals/index.json`의 step 0~2 `summary`
- `src/types/visuals.ts`, `src/data/visuals/vpc-networking.json`
- `src/components/diagrams/VpcPathsDiagram.tsx` — 그룹 박스와 노드의 선례. JSON에서 문구를 읽는 방식.
- `src/components/diagrams/DiagramFrame.tsx` — `scenarios`를 넘기지 않으면 정적 도식이 된다. **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 아래 근거 개념들

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/VpcScopeDiagram.tsx`
- 문구: JSON `diagrams["vpc-scope"]`, `scenarios`는 빈 배열
- 매핑: `registry.ts`에 `'vpc-networking.internet-gateway-is-not-per-az': VpcScopeDiagram` 한 줄

### 그룹 (바깥에서 안으로)

| id | 라벨 |
|---|---|
| `region` | 리전 |
| `vpc` | VPC |
| `az-a` | 가용 영역 A |
| `az-b` | 가용 영역 B |
| `public-a`, `public-b` | 퍼블릭 서브넷 |
| `private-a`, `private-b` | 프라이빗 서브넷 |

가용 영역 둘은 **VPC 안에서 위아래로 쌓는다.** 각 가용 영역 안에 퍼블릭·프라이빗 서브넷을 두 열로 둔다.

### 노드

| id | 라벨 | 들어갈 상자 | 색 | 근거 개념 id |
|---|---|---|---|---|
| `s3` | S3 | 리전 안, **VPC 바깥** | `diagram-managed` | `vpc-networking.s3-is-regional` |
| `igw` | 인터넷 게이트웨이 | VPC 안, **가용 영역 바깥** | 무채색 | `vpc-networking.internet-gateway-is-not-per-az`, `vpc-networking.internet-gateway` |
| `nat-a` | NAT 게이트웨이 | `public-a` | `diagram-resource` | `vpc-networking.nat-gateway`, `vpc-networking.nat-gateway-per-az` |
| `nat-b` | NAT 게이트웨이 | `public-b` | `diagram-resource` | 같음 |
| `ec2-a` | EC2 | `private-a` | `diagram-resource` | `vpc-networking.vpc-subnet` |
| `ec2-b` | EC2 | `private-b` | `diagram-resource` | 같음 |

**이 도식의 핵심은 세 노드의 자리다.** `igw`가 가용 영역 박스 **밖에 하나**, `nat`가 가용 영역마다
**안에 하나씩**, `s3`가 VPC **밖**. 이 셋이 좌표로 성립하는지 테스트가 확인한다.

### 캡션

정적 도식이라 `idleCaption` 하나가 캡션의 전부다. 아래 사실을 직접 써라. 세 줄을 넘기지 마라.

- 인터넷 게이트웨이는 가용 영역에 속하지 않으므로 늘려도 가용성이 오르지 않는다
- NAT 게이트웨이는 자기 가용 영역과 함께 무너지므로 가용 영역마다 둔다
- S3는 VPC 안에 만들 수 없다

도식의 `sources`: `vpc-networking.internet-gateway-is-not-per-az`, `vpc-networking.nat-gateway-per-az`,
`vpc-networking.s3-is-regional`.

`legend`는 두 색과 무채색이 각각 무엇인지 한 줄.

### 테스트 — `VpcScopeDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 시나리오 버튼이 하나도 없다(`전체` 포함).
2. `igw`의 상자가 `vpc` 안에 있고, `az-a`·`az-b` **어느 쪽에도 겹치지 않는다.**
3. `nat-a`가 `public-a` 안, `nat-b`가 `public-b` 안에 있다.
4. `s3`가 `region` 안에 있고 `vpc`와 겹치지 않는다.
5. 관문 5·6·7(viewBox 경계, 라벨 넘침, 폭 280).

2~4의 "안에 있다"는 `boxesOutsideViewBox(노드들, [그룹의 x, y, width, height])`가 빈 배열인 것으로,
"겹치지 않는다"는 두 사각형의 교집합 넓이가 0인 것으로 단언한다.

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
2. 확인한다: 위 노드 표에 없는 노드가 없는가, 캡션에 근거 밖 사실이 없는가.
3. `phases/40-vpc-visuals/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, 그룹 중첩 깊이, 테스트 2~4의 통과 여부.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **DynamoDB·플로우 로그·게이트웨이 엔드포인트·VPC 피어링·가상 프라이빗 게이트웨이를 넣지 마라.**
  이유: 원본 HTML에는 있지만 이 앱 데이터가 그것들의 존재 단위를 말하지 않는다(ADR-037). 이 도식의
  일은 인터넷 게이트웨이와 NAT 게이트웨이의 단위 차이 하나다.
- **"AZ마다 늘려도 가용성 그대로" 같은 칩 부제를 노드 안에 쓰지 마라.** 이유: 노드 라벨은 한 줄이고
  줄이거나 작게 쓸 수 없다(UI_GUIDE). 설명은 캡션이 맡는다.
- **경로선을 그리지 마라.** 이유: 존재 단위는 위치로 말한다. 통신 경로는 step 1의 지도가 맡는다.
- **`DiagramFrame.tsx`·`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
