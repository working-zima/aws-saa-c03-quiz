# Step 3: hybrid-paths-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047, 나머지 24장으로 넓힌 결정은 ADR-048). 이 step은 **`HybridPathsDiagram`**(세로 540) 한 장에
가로형을 더한다. phase 60이 세운 패턴(`useWideDiagram()`, `wideNodes`·`widePaths`·`wideGroups`, 래퍼 `w-full`)을 그대로 따른다.

온프레미스 → 인터넷·전용선 층 → 리전의 위아래 순서는 그대로 두고, 리전 안에서 VPC A와 VPC B를 나란히 둔다. Transit Gateway와 Direct Connect Gateway는 리전 윗줄에 두 VPC 사이를 비우고 선다.

데스크톱 높이는 733px(세로형, 표시 380px) → 464px(가로형, 표시 638px)이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047·ADR-048)」**
- `phases/61-wide-diagrams-rest/index.json`의 앞선 step `summary` — 같은 패턴을 먼저 적용한 도식들이다.
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- 선례: `src/components/diagrams/EventBridgeRoutingDiagram.tsx`·`VpcPathsDiagram.tsx`·`VpcDestinationDiagram.tsx`와 각 테스트의 `describe('가로형 (768px 이상)', …)`.
  **상수 이름·배치를 고르는 자리·테스트 묶음 방식을 맞춰라.** JSX에 박힌 세로형 그룹을 배열로 옮긴 방식은 EventBridge·VPC 경로를 본다.
- `src/components/diagrams/HybridPathsDiagram.tsx`, `src/components/diagrams/HybridPathsDiagram.test.tsx`: 고칠 파일
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `wideNodes`·`widePaths` 블록을 글자로 읽는다. 줄 형식을 지켜라.

## 작업

### 컴포넌트

- `useWideDiagram()`이 `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다(래퍼 클래스, `viewBox`, 좌표, DOM 순서, 속성 모두). 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideNodes`·`widePaths`·`wideGroups` 상수로 둔다.
  - `wideNodes`는 `{ id: '…', x: N, y: N, width: N }`(높이가 32가 아니면 `, height: N`을 덧붙인다) 한 줄씩, **11줄을 그대로 적는다.** 라벨·색은 세로형에서 id로 가져온다.
  - `widePaths`는 `'id': 'M…'` 한 줄씩, **14줄을 그대로 적는다.** 키 집합은 세로형 `paths`와 같다.
  - 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`, 화살표 마커(`useId`), 경로의 굵기·색·`markerEnd`, 노드의 글자 자리·색, 그룹 박스의 `rx`·선 굵기·점선 규칙은 세로형과 같다.
- 시나리오·캡션·범례·문구(JSON)·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).
- 세로형 그룹은 지금 JSX에 박혀 있다. EventBridge(phase 60 step 3)처럼 **같은 좌표의 `groups` 배열로 옮기고** 가로형 `wideGroups`를 더한다. 세로형 DOM은 바이트 단위로 같아야 한다.
- 그룹 라벨 자리는 세로형과 같은 공식(`x + 10`, `y + 14`)이다. 점선은 그룹마다 다르다(온프레미스·리전 `6 4`, VPC 둘 `2 3`)이고 `rx`도 다르다(6, 4). 두 배치가 같은 표에서 읽게 하라.
- 우회 경로는 왼쪽 바깥 통로(x 8), 두 VPC 사이 통로(x 216·224), 오른쪽 바깥 통로(x 432), 인터넷 층 아래 띠(y 128)를 쓴다.

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Windows Chrome 실측)·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고,
미리보기로 사용자 승인을 받은 값이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 320`이다.

**그룹 박스**(`wideGroups`, 라벨은 크기 9·`fill-muted`, 라벨 글은 세로형과 같다):

| id | 라벨 | 박스 x, y, 폭, 높이 | 점선 | 라벨 자리 x, y |
|---|---|---|---|---|
| `onprem-zone` | 온프레미스 | 4, 4, 264, 60 | `6 4` | 14, 18 |
| `region` | 리전 | 4, 136, 432, 180 | `6 4` | 14, 150 |
| `vpc-a` | VPC A | 12, 204, 200, 104 | `2 3` | 22, 218 |
| `vpc-b` | VPC B | 228, 204, 200, 104 | `2 3` | 238, 218 |

**노드**(`wideNodes`, 높이는 따로 적지 않으면 32):

| id | 라벨 | x, y, 폭 |
|---|---|---|
| `onprem` | 온프레미스 데이터 센터 | 12, 24, 128 |
| `cgw` | Customer Gateway | 152, 24, 108 |
| `remote` | 원격 사용자 | 340, 24, 88 |
| `dxloc` | Direct Connect 위치 | 16, 84, 120 |
| `internet` | 인터넷 | 170, 84, 72 |
| `tgw` | Transit Gateway | 168, 156, 104 |
| `dxgw` | Direct Connect Gateway | 288, 156, 140 |
| `vgwa` | 가상 프라이빗 게이트웨이 (VPC A) | 20, 224, 184 |
| `vpca` | VPC A 자원 | 20, 264, 184 |
| `vgwb` | 가상 프라이빗 게이트웨이 (VPC B) | 236, 224, 184 |
| `vpcb` | VPC B 자원 | 236, 264, 184 |

**경로**(`widePaths`, 직교 M/H/V만):

| id | `d` |
|---|---|
| `onprem-cgw` | `M140 40 H152` |
| `cgw-internet` | `M206 56 V84` |
| `internet-vgwa` | `M206 116 V128 H140 V224` |
| `onprem-dxloc` | `M76 56 V84` |
| `dxloc-vgwa` | `M76 116 V224` |
| `onprem-tgw` | `M12 40 H8 V172 H168` |
| `dxloc-dxgw` | `M76 116 V128 H358 V156` |
| `dxgw-tgw` | `M288 172 H272` |
| `tgw-vpca` | `M216 188 V280 H204` |
| `tgw-vpcb` | `M224 188 V280 H236` |
| `remote-internet` | `M384 56 V100 H242` |
| `internet-vpca` | `M206 116 V128 H8 V280 H20` |
| `onprem-vgwa` | `M12 40 H8 V240 H20` |
| `onprem-vgwb` | `M140 32 H146 V128 H432 V240 H420` |

### 테스트: `HybridPathsDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트의 `it`은 고치지 않는다. 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶고, 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다.
`afterEach`에서 `vi.unstubAllGlobals()`로 되돌린다. 모의는 이 파일 안에 둔다.

1. `viewBox`가 `0 0 440 320`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다(14개).
3. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 320])`로 안에 있다.
4. 노드 라벨이 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다. 그룹 라벨은 `라벨 x + estimateTextWidth(라벨, 9)`가 자기 박스 오른쪽 끝을 넘지 않는다.
5. 기존 시나리오 검사(시나리오마다 선명한 노드·보이는 경로·곁말·캡션)를 가로형에서도 같은 기대값으로 통과한다.
6. 기존 소속 단언(허브와 게이트웨이는 리전 안·VPC 밖, VPC 자원은 각자의 VPC 안, 전용선 층은 인터넷 층과 나란하고 둘 다 리전 밖)을 가로형에서도 같은 기대값으로 통과한다.
7. 두 VPC 그룹이 나란하다 — y와 높이가 같고 겹치지 않는다.
8. `VPC마다 따로 맺는 VPN`에서 경로가 둘뿐이고 두 게이트웨이를 잇지 않는다(기존 단언 그대로).
9. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
   `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션과 보이는 경로가 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 73개·경로 60개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 `it`이 그대로인가.
   - 바뀐 파일이 `HybridPathsDiagram.tsx`, `HybridPathsDiagram.test.tsx`, `phases/61-wide-diagrams-rest/index.json`뿐인가.
3. `phases/61-wide-diagrams-rest/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 세로형 DOM이 그대로인지 확인한 방법, 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 하고(ADR-047), 지난 phase들의 실측이 세로형 좌표에 걸려 있다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **노드·경로를 더하거나 빼지 마라. 문구(JSON)·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·`useWideDiagram.ts`·다른 도식을 고치지 마라.** 이유: step마다 한 장씩 맡는다.
- 기존 테스트를 깨뜨리지 마라.
