# Step 4: sg-nacl-boundary-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047, 나머지 24장으로 넓힌 결정은 ADR-048). 이 step은 **`SgNaclBoundaryDiagram`**(세로 360) 한 장에
가로형을 더한다. phase 60이 세운 패턴(`useWideDiagram()`, `wideNodes`·`widePaths`·`wideGroups`, 래퍼 `w-full`)을 그대로 따른다.

위의 경계 그림을 한 줄로 낮게 접고, 아래 왕복을 두 줄로 편다. 윗줄이 요청(바깥 → NACL 인바운드 → 보안 그룹 인바운드 → 리소스, 왼쪽에서 오른쪽), 아랫줄이 응답(오른쪽에서 왼쪽)이다. 세로형 주석의 「280 폭에 네 칸을 가로로 놓을 수 없다」는 폭 440에서는 해당하지 않는다.

데스크톱 높이는 489px(세로형, 표시 380px) → 336px(가로형, 표시 638px)이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047·ADR-048)」**
- `phases/61-wide-diagrams-rest/index.json`의 앞선 step `summary` — 같은 패턴을 먼저 적용한 도식들이다.
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- 선례: `src/components/diagrams/EventBridgeRoutingDiagram.tsx`·`VpcPathsDiagram.tsx`·`VpcDestinationDiagram.tsx`와 각 테스트의 `describe('가로형 (768px 이상)', …)`.
  **상수 이름·배치를 고르는 자리·테스트 묶음 방식을 맞춰라.** JSX에 박힌 세로형 그룹을 배열로 옮긴 방식은 EventBridge·VPC 경로를 본다.
- `src/components/diagrams/SgNaclBoundaryDiagram.tsx`, `src/components/diagrams/SgNaclBoundaryDiagram.test.tsx`: 고칠 파일
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `wideNodes`·`widePaths` 블록을 글자로 읽는다. 줄 형식을 지켜라.

## 작업

### 컴포넌트

- `useWideDiagram()`이 `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다(래퍼 클래스, `viewBox`, 좌표, DOM 순서, 속성 모두). 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideNodes`·`widePaths`·`wideGroups` 상수로 둔다.
  - `wideNodes`는 `{ id: '…', x: N, y: N, width: N }`(높이가 32가 아니면 `, height: N`을 덧붙인다) 한 줄씩, **8줄을 그대로 적는다.** 라벨·색은 세로형에서 id로 가져온다.
  - `widePaths`는 `'id': 'M…'` 한 줄씩, **6줄을 그대로 적는다.** 키 집합은 세로형 `paths`와 같다.
  - 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`, 화살표 마커(`useId`), 경로의 굵기·색·`markerEnd`, 노드의 글자 자리·색, 그룹 박스의 `rx`·선 굵기·점선 규칙은 세로형과 같다.
- 시나리오·캡션·범례·문구(JSON)·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).
- 세로형 그룹과 글자는 JSX에 박혀 있다. **같은 좌표의 배열로 옮기고** 가로형 짝을 더한다. 세로형 DOM은 바이트 단위로 같아야 한다.
- `바깥`과 `리소스`는 가로형에서 두 줄을 잇는 높은 상자(높이 76)다. 세로형의 전체 폭 상자에 해당한다. 노드 높이를 데이터에서 읽게 하되 **세로형은 지금처럼 `height="32"`, 글자 y는 `y + 16`으로 그대로 나와야 한다**(높이 / 2 = 16).
- 「그 응답」에서 보안 그룹 아웃바운드만 점선인 규칙은 그대로다.

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Windows Chrome 실측)·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고,
미리보기로 사용자 승인을 받은 값이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 232`이다.

**그룹 박스**(`wideGroups`, 라벨은 크기 9·`fill-muted`, 라벨 글은 세로형과 같다):

| id | 라벨 | 박스 x, y, 폭, 높이 | 점선 | 라벨 자리 x, y |
|---|---|---|---|---|
| `nacl-boundary` | — | 4, 4, 432, 94 | 없음 | — |
| `sg-boundary` | — | 16, 40, 408, 50 | 없음 | — |

**노드**(`wideNodes`, 높이는 따로 적지 않으면 32):

| id | 라벨 | x, y, 폭 |
|---|---|---|
| `ec2` | EC2 | 200, 49, 96 |
| `rds` | RDS | 312, 49, 96 |
| `outside` | 바깥 | 8, 132, 56, 높이 76 |
| `nacl-in` | NACL 인바운드 | 88, 132, 104 |
| `sg-in` | 보안 그룹 인바운드 | 216, 132, 128 |
| `resource` | 리소스 | 368, 132, 64, 높이 76 |
| `nacl-out` | NACL 아웃바운드 | 88, 176, 104 |
| `sg-out` | 보안 그룹 아웃바운드 | 216, 176, 128 |

**경로**(`widePaths`, 직교 M/H/V만):

| id | `d` |
|---|---|
| `outside-nacl-in` | `M64 148 H88` |
| `nacl-in-sg-in` | `M192 148 H216` |
| `sg-in-resource` | `M344 148 H368` |
| `resource-sg-out` | `M368 192 H344` |
| `sg-out-nacl-out` | `M216 192 H192` |
| `nacl-out-outside` | `M88 192 H64` |

**곁말과 선**(가로형 자리. 글은 세로형과 같은 JSON에서 읽는다):

| id | 글 | x, y | 정렬 | 보이는 때 |
|---|---|---|---|---|
| `nacl-1` | 서브넷 경계 = 네트워크 ACL | 12, 18 | start | 늘 |
| `nacl-2` | IP만 · 허용과 차단 · 상태 비저장 | 12, 31 | start | 늘 |
| `sg-1` | 리소스 경계 = 보안 그룹 | 24, 59 | start | 늘 |
| `sg-2` | 리소스·IP · 허용만 · 상태 저장 | 24, 72 | start | 늘 |
| `req-dir` | 요청 방향 | 88, 124 | start | 늘 |
| `res-dir` | 응답 방향 | 88, 224 | start | 늘 |

### 테스트: `SgNaclBoundaryDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트의 `it`은 고치지 않는다. 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶고, 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다.
`afterEach`에서 `vi.unstubAllGlobals()`로 되돌린다. 모의는 이 파일 안에 둔다.

1. `viewBox`가 `0 0 440 232`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다(6개).
3. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 232])`로 안에 있다.
4. 노드 라벨이 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다. 그룹 라벨은 `라벨 x + estimateTextWidth(라벨, 9)`가 자기 박스 오른쪽 끝을 넘지 않는다.
5. 기존 시나리오 검사(시나리오마다 선명한 노드·보이는 경로·곁말·캡션)를 가로형에서도 같은 기대값으로 통과한다.
6. 보안 그룹 경계가 NACL 경계 안쪽에 완전히 들어가고 리소스 둘을 함께 감싼다(기존 단언 그대로). 세 축의 보조 글자 넷이 각자의 경계 안에 있다.
7. 요청 칸 셋(`nacl-in`·`sg-in`과 `outside`→`resource`의 윗줄)이 같은 y에, 응답 칸 둘이 그 아래 같은 y에 있다. `outside`와 `resource`의 높이가 76이고 두 줄을 모두 덮는다.
8. 요청 경로 셋은 끝점의 x가 시작점보다 크고(오른쪽으로), 응답 경로 셋은 작다(왼쪽으로).
9. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
   `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션과 보이는 경로가 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 81개·경로 66개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 `it`이 그대로인가.
   - 바뀐 파일이 `SgNaclBoundaryDiagram.tsx`, `SgNaclBoundaryDiagram.test.tsx`, `phases/61-wide-diagrams-rest/index.json`뿐인가.
3. `phases/61-wide-diagrams-rest/index.json`의 step 4을 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 세로형 DOM이 그대로인지 확인한 방법, 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 하고(ADR-047), 지난 phase들의 실측이 세로형 좌표에 걸려 있다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **노드·경로를 더하거나 빼지 마라. 문구(JSON)·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·`useWideDiagram.ts`·다른 도식을 고치지 마라.** 이유: step마다 한 장씩 맡는다.
- 기존 테스트를 깨뜨리지 마라.
