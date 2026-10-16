# Step 0: vpc-scope-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047, 나머지 24장으로 넓힌 결정은 ADR-048). 이 step은 **`VpcScopeDiagram`**(세로 372) 한 장에
가로형을 더한다. phase 60이 세운 패턴(`useWideDiagram()`, `wideNodes`·`widePaths`·`wideGroups`, 래퍼 `w-full`)을 그대로 따른다.

바깥에서 안으로를 왼쪽에서 오른쪽으로 바꾼다. S3는 리전의 왼쪽 열, 인터넷 게이트웨이는 VPC의 왼쪽 열에 서고, 가용 영역 둘은 VPC 오른쪽에서 세로형처럼 위아래로 쌓인다. 경로와 시나리오가 없는 정적 도식이다.

데스크톱 높이는 505px(세로형, 표시 380px) → 348px(가로형, 표시 638px)이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047·ADR-048)」**
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- 선례: `src/components/diagrams/EventBridgeRoutingDiagram.tsx`·`VpcPathsDiagram.tsx`·`VpcDestinationDiagram.tsx`와 각 테스트의 `describe('가로형 (768px 이상)', …)`.
  **상수 이름·배치를 고르는 자리·테스트 묶음 방식을 맞춰라.** JSX에 박힌 세로형 그룹을 배열로 옮긴 방식은 EventBridge·VPC 경로를 본다.
- `src/components/diagrams/VpcScopeDiagram.tsx`, `src/components/diagrams/VpcScopeDiagram.test.tsx`: 고칠 파일
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `wideNodes`·`widePaths` 블록을 글자로 읽는다. 줄 형식을 지켜라.

## 작업

### 컴포넌트

- `useWideDiagram()`이 `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다(래퍼 클래스, `viewBox`, 좌표, DOM 순서, 속성 모두). 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideNodes`·`wideGroups` 상수로 둔다.
  - `wideNodes`는 `{ id: '…', x: N, y: N, width: N }`(높이가 32가 아니면 `, height: N`을 덧붙인다) 한 줄씩, **6줄을 그대로 적는다.** 라벨·색은 세로형에서 id로 가져온다.
  - 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`, 화살표 마커(`useId`), 경로의 굵기·색·`markerEnd`, 노드의 글자 자리·색, 그룹 박스의 `rx`·선 굵기·점선 규칙은 세로형과 같다.
- 시나리오·캡션·범례·문구(JSON)·접근성 이름은 두 배치가 함께 쓴다.
- 그룹 라벨 자리는 세로형과 같은 공식(`x + 10`, `y + 14`)을 쓴다. `wideGroups`에는 x·y·폭·높이·점선만 둔다.
- 정적 도식이라 고른 상태가 없다. 폭이 바뀌면 그림만 다시 그린다.

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Windows Chrome 실측)·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고,
미리보기로 사용자 승인을 받은 값이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 240`이다.

**그룹 박스**(`wideGroups`, 라벨은 크기 9·`fill-muted`, 라벨 글은 세로형과 같다):

| id | 라벨 | 박스 x, y, 폭, 높이 | 점선 | 라벨 자리 x, y |
|---|---|---|---|---|
| `region` | 리전 | 4, 4, 432, 232 | `6 4` | 14, 18 |
| `vpc` | VPC | 76, 12, 354, 216 | `6 4` | 86, 26 |
| `az-a` | 가용 영역 A | 192, 20, 228, 96 | 없음 | 202, 34 |
| `az-b` | 가용 영역 B | 192, 124, 228, 96 | 없음 | 202, 138 |
| `public-a` | 퍼블릭 서브넷 | 198, 42, 104, 64 | `2 3` | 208, 56 |
| `public-b` | 퍼블릭 서브넷 | 198, 146, 104, 64 | `2 3` | 208, 160 |
| `private-a` | 프라이빗 서브넷 | 310, 42, 104, 64 | `2 3` | 320, 56 |
| `private-b` | 프라이빗 서브넷 | 310, 146, 104, 64 | `2 3` | 320, 160 |

**노드**(`wideNodes`, 높이는 따로 적지 않으면 32):

| id | 라벨 | x, y, 폭 |
|---|---|---|
| `s3` | S3 | 12, 104, 56 |
| `igw` | 인터넷 게이트웨이 | 84, 104, 100 |
| `nat-a` | NAT 게이트웨이 | 204, 64, 92 |
| `nat-b` | NAT 게이트웨이 | 204, 168, 92 |
| `ec2-a` | EC2 | 316, 64, 92 |
| `ec2-b` | EC2 | 316, 168, 92 |

### 테스트: `VpcScopeDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트의 `it`은 고치지 않는다. 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶고, 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다.
`afterEach`에서 `vi.unstubAllGlobals()`로 되돌린다. 모의는 이 파일 안에 둔다.

1. `viewBox`가 `0 0 440 240`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합과 그룹 id 집합이 세로형과 같다.
3. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 240])`로 안에 있다.
4. 노드 라벨이 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다. 그룹 라벨은 `라벨 x + estimateTextWidth(라벨, 9)`가 자기 박스 오른쪽 끝을 넘지 않는다.
5. 기존 소속 단언(리전 > VPC > 가용 영역 > 서브넷 중첩, 가용 영역 둘이 위아래, 인터넷 게이트웨이가 VPC 안·가용 영역 밖, NAT는 퍼블릭 서브넷·EC2는 프라이빗 서브넷 안, S3는 리전 안·VPC 밖)을 가로형에서도 같은 기대값으로 통과한다.
6. S3와 인터넷 게이트웨이가 가용 영역보다 왼쪽에 있다(가로형에서만 성립하는 배치).
7. 폭이 바뀌면 다시 그린다. 세로형으로 렌더한 뒤 `matches: true`로 바꾸면(`act`) `viewBox` 폭이 440이 된다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 54개·경로 37개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 `it`이 그대로인가.
   - 바뀐 파일이 `VpcScopeDiagram.tsx`, `VpcScopeDiagram.test.tsx`, `phases/61-wide-diagrams-rest/index.json`뿐인가.
3. `phases/61-wide-diagrams-rest/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 세로형 DOM이 그대로인지 확인한 방법, 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 하고(ADR-047), 지난 phase들의 실측이 세로형 좌표에 걸려 있다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **노드·경로를 더하거나 빼지 마라. 문구(JSON)·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·`useWideDiagram.ts`·다른 도식을 고치지 마라.** 이유: step마다 한 장씩 맡는다.
- 기존 테스트를 깨뜨리지 마라.
