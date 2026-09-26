# Step 1: paths-extension

## 배경

`VpcPathsDiagram`은 phase 38에서 만든 VPC 통신 경로 도식이다(`vpc-networking.comparison` 뒤).
시나리오 일곱이 인터넷·NAT·게이트웨이 엔드포인트·Lambda·온프레미스 경로를 보여준다.

사용자가 가져온 HTML의 "아키텍처 지도"는 같은 일을 하는 그림이고, 여기에 없는 경로 넷을 더 가진다 —
**인터페이스 엔드포인트, PrivateLink, VPC 피어링, Transit Gateway.** 사용자는 새 도식을 만들지 말고
**이 도식을 확장하라**고 했고, 넷을 모두 더하기로 정했다(2026-09-26).

이 step은 두 가지를 한다.

1. 기존 시나리오 일곱의 **문구를 JSON으로 옮긴다.** 문장은 한 글자도 바꾸지 않는다.
2. 시나리오 넷과 그에 필요한 노드·그룹을 더한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**
- `phases/40-vpc-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`, `src/data/visuals/vpc-networking.json`,
  `src/data/visuals.test.ts` — step 0이 만든 틀
- `src/components/diagrams/VpcPathsDiagram.tsx`, `VpcPathsDiagram.test.tsx` — 이 step이 고치는 파일
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/step1.md` — 기존 시나리오 일곱의 **근거 개념 id 표**
- `src/data/topics.json`의 아래 「근거 개념」에 적힌 개념들

## 작업

### 1. 문구를 JSON으로 — `diagrams["vpc-paths"]`

`src/data/visuals/vpc-networking.json`의 `diagrams`에 `"vpc-paths"` 키로 `VisualDiagramText`를 더한다.

- `label`·`svgLabel`·`idleCaption`·`legend`·노드 라벨 14개·시나리오 일곱의 `label`·`caption`은
  **지금 컴포넌트에 있는 문자열을 그대로 옮긴다.** 다듬지 마라.
- 시나리오 일곱의 `sources`는 `phases/38-service-diagrams/step1.md`의 「시나리오 일곱」 표에 있는
  근거 개념 id를 그대로 적는다.
- `groups`에 그룹 박스 라벨(리전·AWS 관리 영역·VPC·퍼블릭 서브넷·프라이빗 서브넷)을 옮긴다.
- 도식의 `sources`는 `vpc-networking.comparison`, `vpc-networking.vpc-subnet`이다.

컴포넌트는 이 JSON에서 문구를 읽는다. 좌표(`nodes`의 x·y·width·color)와 `paths` 문자열,
시나리오별 `nodes`·`paths` 배열은 **컴포넌트에 남긴다.** 시나리오 문구와 좌표는 `id`로 짝을 맞춘다.
짝이 안 맞는 id가 있으면 테스트가 실패해야 한다.

### 2. 시나리오 넷 더하기

새 노드와 그룹(`id`는 아래 그대로):

| id | 라벨 | 자리 | 색 |
|---|---|---|---|
| `interface-endpoint` | 인터페이스 엔드포인트 | 프라이빗 서브넷 안 | `diagram-resource` |
| `pl-endpoint` | PrivateLink 엔드포인트 | 프라이빗 서브넷 안 | `diagram-resource` |
| `peering` | VPC 피어링 | VPC 박스 바깥, 리전 안 | 무채색(`disabled`) |
| `tgw` | Transit Gateway | VPC 박스 바깥, 리전 안 | 무채색(`disabled`) |
| `other-app` | 다른 VPC의 앱 | 새 그룹 `other-vpc` 안 | `diagram-resource` |

- 새 그룹 `other-vpc`(라벨 `다른 VPC`)는 리전 안, 내 VPC 박스 바깥이다. 점선은 VPC 박스와 같다.
- `logs`(CloudWatch Logs) 노드는 이미 있다. 인터페이스 엔드포인트 시나리오의 목적지로 다시 쓴다.
- `estimateTextWidth(라벨, 10)`이 `PrivateLink 엔드포인트`는 116, `인터페이스 엔드포인트`는 105.5다.
  여백 12를 더하면 둘 다 2열 폭(112)을 넘으므로 **둘 다 한 줄 전체 폭으로 펴라.** 라벨을 줄이지 마라 —
  개념 본문이 "인터페이스 엔드포인트"라고 부른다.

| id | label | 경로 | 캡션에 담을 사실 | 근거 개념 id (`sources`) |
|---|---|---|---|---|
| `s8` | 프라이빗 → 그 외 AWS 서비스 | `ec2` → `interface-endpoint` → `logs` | 게이트웨이가 덮지 않는 나머지 서비스로 간다 · 서비스 주소가 VPC 안 사설 주소로 잡혀 공용 IP 금지 조건을 채운다 · 시간당 요금이 붙는다 | `vpc-networking.vpc-endpoint`, `vpc-networking.endpoint-pricing`, `vpc-networking.nat-gateway-traffic-uses-public-endpoints` |
| `s9` | PrivateLink → 다른 VPC의 앱 | `ec2` → `pl-endpoint` → `other-app` | 다른 VPC의 특정 애플리케이션 하나에만 닿는다 · 라우팅 테이블을 건드리지 않고 범위는 엔드포인트 정책으로 좁힌다 | `vpc-networking.privatelink`, `vpc-networking.privatelink-endpoint-service` |
| `s10` | VPC ⇄ VPC 피어링 | `ec2` → `peering` → `other-app` | 두 VPC 전체를 사설 경로로 잇는다 · 1:1 연결이라 VPC가 늘면 연결이 폭증한다 | `vpc-networking.vpc-peering`, `vpc-networking.vpc-peering-scaling-limit`, `vpc-networking.comparison` |
| `s11` | Transit Gateway | `ec2` → `tgw` → `other-app` | 여러 VPC를 허브 하나로 묶는다 · 수백 개로 늘릴 계획이면 이쪽이다 · 연결을 열 뿐 앱 단위로 막지는 않는다 | `hybrid-connectivity.transit-gateway`, `vpc-networking.vpc-peering-scaling-limit`, `vpc-networking.privatelink-endpoint-service` |

캡션은 **위 근거 개념 본문의 사실에서 직접 써라.** 본문 문장을 그대로 옮기지 마라(ADR-009).
두 줄을 넘기지 마라. 그림이 이미 말하는 경로를 되풀이하지 말고 조건·제약을 담아라.

`s10`·`s11`은 같은 두 끝점을 다른 장치로 잇는다. 두 경로가 **서로 다른 통로**를 써서 겹치지 않게
배치하라 — 겹치면 학습자가 둘을 같은 선으로 읽는다.

### 3. 테스트 — `VpcPathsDiagram.test.tsx`

**먼저 테스트를 고치고 실패를 확인한 뒤** 구현한다(CLAUDE.md 「개발 프로세스」).

1. 기존 테스트의 기대값(노드 수 14, 시나리오 7 등)을 새 수(노드 19, 시나리오 11)로 고친다.
   **기존 시나리오 일곱의 캡션 문자열 기대값은 바꾸지 마라** — 문장이 그대로 옮겨졌다는 확인이다.
2. 새 시나리오 넷 각각: 누르면 위 표의 노드만 선명하고, 보이는 경로가 표의 순서와 같다.
3. 관문 5·6·7(viewBox 경계, 노드 라벨 넘침, 폭 280)을 새 노드까지 포함해 통과한다.
4. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

마지막 검사기는 경로선이 무관한 노드의 상자를 뚫으면 exit 1이다. **검사기를 고쳐서 통과시키지 마라.**
걸리면 경로를 우회시키거나 노드를 옮긴다. 세로는 얼마든 늘려도 된다.

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 기존 캡션 일곱이 바이트 단위로 같은가, 새 캡션에 근거 표에 없는 사실이 없는가,
   `DiagramFrame.tsx`와 `topics.json`이 그대로인가.
3. `phases/40-vpc-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, 노드·시나리오 수, 전체 폭으로 편 노드, `s10`·`s11`을
     떼어 놓은 방법, 관문 5·6·7 통과 여부, 교차 검사 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **기존 시나리오 일곱의 문장·경로·노드를 바꾸지 마라.** 이유: phase 38에서 실측·검증을 마친 그림이다.
  이 step은 옮기고 더할 뿐이다.
- **온프레미스 쪽(`onprem`·`vgw`)에 새 경로를 더하지 마라.** 이유: Transit Gateway의 온프레미스 연결은
  `hybrid-connectivity` 주제와 `HybridPathsDiagram`이 맡는다.
- **`NLB`·`ENI`·`vpce-` 같은 말을 새 노드나 캡션에 쓰지 마라.** 이유: VPC 주제 데이터에 근거가 없다
  (ADR-037 「원본 HTML에서 옮기지 않은 것」). 기존 `Lambda ENI` 노드는 phase 38의 것이라 그대로 둔다.
- **`DiagramFrame.tsx`를 고치지 마라.**
- **다른 도식을 만들지 마라.** 흐름도는 step 2의 범위다.
- **`topics.json`·`questions.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라(기대값을 새 수로 고치는 것은 위 「테스트」 1의 범위에서만).
