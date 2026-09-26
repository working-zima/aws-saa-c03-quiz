# Step 4: nat-count

## 배경

`vpc-networking.nat-gateway-count-by-environment`는 NAT 게이트웨이 수가 **가용성과 시간당 요금의
맞바꿈**이라고 말한다. 프로덕션은 가용 영역마다 하나씩 두어 한쪽이 무너져도 나머지가 나가게 하고,
개발 환경은 하나만 남겨 모든 프라이빗 서브넷의 기본 경로를 그쪽으로 모은다. 그러면 남은 게이트웨이가
있는 가용 영역이 무너질 때 그 환경 전체가 인터넷을 잃는다.

사용자가 가져온 HTML의 "NAT 게이트웨이 개수 실험"은 이것을 **환경 전환 + 장애 버튼**으로 보여준다.
이 앱에는 토글이 없으므로 **네 상태를 시나리오 버튼으로 고정한다**(ADR-037, UI_GUIDE 「수량과 상태를
바꾸는 도식」). 가용 영역은 사용자 결정대로 **셋**이다(2026-09-26).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**, 특히 「수량과 상태를 바꾸는 도식」
- `phases/40-vpc-visuals/index.json`의 step 0~3 `summary`
- `src/types/visuals.ts`, `src/data/visuals/vpc-networking.json`
- `src/components/diagrams/VpcScopeDiagram.tsx` — 가용 영역 그룹의 선례(step 3)
- `src/components/diagrams/VpcPathsDiagram.tsx` — 시나리오·경로의 선례
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `vpc-networking.nat-gateway-per-az`, `vpc-networking.nat-gateway-count-by-environment`,
  `vpc-networking.nat-gateway`, `vpc-networking.nat-gateway-elastic-ip`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/NatCountDiagram.tsx`
- 문구: JSON `diagrams["nat-count"]`
- 매핑: `registry.ts`에 `'vpc-networking.nat-gateway-count-by-environment': NatCountDiagram` 한 줄

### 모양 — 가용 영역 셋을 **행으로** 쌓는다

가용 영역 셋을 세 열로 두면 노드 폭이 72 남짓이 된다. `estimateTextWidth('NAT 게이트웨이', 10)`은 72라
여백 12를 더하면 84가 필요하다. **그래서 가용 영역을 위에서 아래로 세 행으로 쌓고**, 각 행을 두 열
(퍼블릭 서브넷 | 프라이빗 서브넷)로 나눈다. 세로는 얼마든 늘어나도 된다(UI_GUIDE).

- 맨 위, VPC 박스 바깥에 `internet`(인터넷). VPC 박스 안, 가용 영역 바깥에 `igw`(인터넷 게이트웨이).
- 그룹: `vpc`(VPC), `az-a`·`az-b`·`az-c`(가용 영역 A·B·C). 서브넷은 그룹 박스 대신 각 행 안의
  열 위치와 곁말(9)로 구분해도 된다 — 박스를 겹겹이 두어 폭이 모자라면 그렇게 한다.
- 노드: `nat-a`·`nat-b`·`nat-c`(NAT 게이트웨이, 퍼블릭 열), `ec2-a`·`ec2-b`·`ec2-c`(EC2, 프라이빗 열).
  NAT는 `diagram-resource`, EC2도 `diagram-resource`, 인터넷·인터넷 게이트웨이는 무채색.

### 시나리오 넷

| id | label | 선명한 노드 | 보이는 경로 |
|---|---|---|---|
| `n1` | 프로덕션 | 전부 | `ec2-a→nat-a`, `ec2-b→nat-b`, `ec2-c→nat-c`, 세 NAT → `igw`, `igw→internet` |
| `n2` | 개발 | `nat-b`·`nat-c`만 흐림 | `ec2-a→nat-a`, `ec2-b→nat-a`, `ec2-c→nat-a`, `nat-a→igw`, `igw→internet` |
| `n3` | 프로덕션 · AZ A 장애 | `nat-a`·`ec2-a`만 흐림 | `ec2-b→nat-b`, `ec2-c→nat-c`, 두 NAT → `igw`, `igw→internet` |
| `n4` | 개발 · AZ A 장애 | `nat-a`·`ec2-a`·`nat-b`·`nat-c` 흐림 | **없음** |

- `n4`에서 `ec2-b`·`ec2-c`는 **선명한데 경로가 없다.** 살아 있는데 나갈 길이 없다는 뜻이다. 이것이
  이 도식이 보여줄 한 장면이다.
- `n3`·`n4`에서는 `가용 영역 A` 그룹 라벨 옆에 곁말(9) `장애`를 붙인다. **색을 칠하지 마라** — 빨강은
  오답 표시가 점유했다(ADR-036). 그룹 박스는 흐려지지 않는다.
- `n2`의 경로 셋이 `nat-a` 하나로 모인다. 서로 겹치지 않게 통로를 나눠라.

| id | 캡션에 담을 사실 | `sources` |
|---|---|---|
| `n1` | 각 가용 영역이 자기 NAT로 나간다 · 요금은 NAT 개수만큼 붙는다 | `vpc-networking.nat-gateway-per-az`, `vpc-networking.nat-gateway-count-by-environment` |
| `n2` | 모든 프라이빗 서브넷의 기본 경로를 NAT 하나로 모아 요금을 한 개분으로 줄인다 | `vpc-networking.nat-gateway-count-by-environment` |
| `n3` | 한 가용 영역이 무너져도 나머지는 자기 NAT로 계속 나간다 | `vpc-networking.nat-gateway-per-az` |
| `n4` | NAT가 있던 가용 영역이 무너지면 살아 있는 가용 영역도 인터넷을 잃는다 · 고가용성이 필요 없는 환경이면 감수할 대가다 | `vpc-networking.nat-gateway-per-az`, `vpc-networking.nat-gateway-count-by-environment` |

캡션은 사실에서 직접 써라. 본문 문장을 옮기지 마라(ADR-009). 두 줄을 넘기지 마라.
`idleCaption`은 환경과 장애를 골라 보라는 안내 한 문장이다. 도식의 `sources`는
`vpc-networking.nat-gateway-count-by-environment`.

### 테스트 — `NatCountDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 시나리오 넷 각각에서 선명한 노드 집합과 보이는 경로 집합이 위 표와 같다.
2. `n4`에서 `ec2-b`·`ec2-c`의 opacity가 1이고 보이는 경로가 0개다.
3. `n3`·`n4`에서만 `장애` 곁말이 보이고, `n1`·`n2`·`전체`에서는 없다.
4. 관문 5·6·7(viewBox 경계, 라벨 넘침, 폭 280). 노드마다 자기 가용 영역 그룹 안에 있다.
5. 도식 안 어떤 요소에도 `fill`·`stroke`로 빨강 계열(`red`·`#ef4444`)을 쓰지 않는다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 NAT·EC2 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 새 입력 컨트롤(슬라이더·토글)을 만들지 않았는가, 장애를 색으로 칠하지 않았는가,
   애니메이션이 없는가.
3. `phases/40-vpc-visuals/index.json`의 step 4를 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, 서브넷을 그룹 박스로 그렸는지 곁말로 갈랐는지, `n2`의 세 경로를
     떼어 놓은 방법, 교차 검사 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **슬라이더·토글·체크박스를 만들지 마라.** 이유: ADR-037. 상태는 시나리오 버튼으로 고정한다.
- **장애를 빨강·빗금·경고 아이콘으로 표시하지 마라.** 이유: ADR-036. 흐림과 곁말, 사라진 경로로 말한다.
- **요금을 숫자나 축으로 그리지 마라**("시간당 ×3" 같은 배지 포함). 이유: 본문은 "개수만큼"이라는 관계만
  말한다. 금액·배수를 도식에 적으면 본문에 없는 수치를 만든다(ADR-036 「비용은 축으로 그리지 않는다」).
- **엘라스틱 IP 노드를 더하지 마라.** 이유: 이 도식의 일은 개수와 가용성이다. 엘라스틱 IP는 step 6의
  「무엇을 어디에 붙이나」 표가 맡는다.
- **`DiagramFrame.tsx`·`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
