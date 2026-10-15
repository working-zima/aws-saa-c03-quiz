# Step 2: vpc-destination-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047). 시범 세 장 가운데 가장 단순한 VPC 목적지 도식(`VpcDestinationDiagram`)을
먼저 바꾸고, **가로형을 넣는 패턴을 이 step에서 세운다.** step 3·4가 이 파일을 선례로 읽는다.

세로형은 목적지 넷(인터넷, AWS 서비스, 다른 VPC의 앱, 다른 VPC 전체)을 한 줄씩 쌓아 높이가 800이다. 가로형은 넷을 2×2로 놓는다.
읽는 순서(왼쪽→오른쪽, 위→아래)가 세로형의 순서와 같다. 경로선은 없다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047)」**
- `phases/60-wide-diagrams/index.json`의 step 0·1 `summary`
- `src/hooks/useWideDiagram.ts`와 그 테스트: step 0이 만든 판정 훅과 `matchMedia` 모의 방식
- `src/components/diagrams/VpcDestinationDiagram.tsx`, `src/components/diagrams/VpcDestinationDiagram.test.tsx`: 고칠 파일
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: step 1이 `wideNodes`를 읽게 고쳤다. 줄 형식을 지켜라.

## 작업

### 컴포넌트

- `useWideDiagram()`으로 배치를 고른다. `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다(래퍼 클래스, `viewBox`, 그룹·노드 좌표,
  DOM 순서, 속성 모두). 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideGroups`·`wideNodes` 상수로 둔다. `wideNodes`는 `nodes`와 같은 한 줄 형식(`{ id: '…', x: N, y: N, width: N }`)으로
  **열두 줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다(AC의 `가로 노드 12개`).
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`은 세로형과 같다.
- 그룹 박스의 `rx`·선 굵기·라벨 글자 크기·노드 높이(44)·두 줄 글자 자리(위 13, 아래 31)는 세로형과 같다. 바뀌는 것은 아래 좌표뿐이다.
- 시나리오(`vpcDestinationScenarios`)·문구·접근성 이름은 두 배치가 함께 쓴다. 고른 목적지는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Chrome 실측)·그룹 소속을 스크립트로 맞춘 값이다. 테스트가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 400`이다.

**그룹 박스**(`wideGroups`, 폭 208·높이 184, 라벨은 크기 9·`fill-muted`):

| id | 라벨 | 박스 x, y | 라벨 자리 x, y |
|---|---|---|---|
| `internet` | 인터넷 | 8, 8 | 20, 22 |
| `services` | AWS 서비스 | 224, 8 | 236, 22 |
| `application` | 다른 VPC의 앱 | 8, 208 | 20, 222 |
| `vpcs` | 다른 VPC 전체 | 224, 208 | 236, 222 |

**노드**(`wideNodes`, 폭 184·높이 44):

| id | 답(라벨) | x, y |
|---|---|---|
| `inet-ipv4` | NAT 게이트웨이 | 20, 36 |
| `inet-ipv6` | Egress-only 인터넷 게이트웨이 | 20, 88 |
| `inet-both` | 인터넷 게이트웨이 | 20, 140 |
| `svc-gateway` | 게이트웨이 엔드포인트 | 236, 36 |
| `svc-interface` | 인터페이스 엔드포인트 | 236, 88 |
| `svc-no-public` | NAT 게이트웨이로는 못 채움 | 236, 140 |
| `app-private` | PrivateLink | 20, 236 |
| `app-scope` | 엔드포인트 정책 | 20, 288 |
| `app-routing` | 피어링·Transit Gateway와 다른 점 | 20, 340 |
| `vpc-pair` | VPC 피어링 | 236, 236 |
| `vpc-many` | Transit Gateway | 236, 288 |
| `vpc-isolated` | VPC마다 Site-to-Site VPN | 236, 340 |

가장 긴 답 `피어링·Transit Gateway와 다른 점`은 어림값으로 169, 여백 12를 더해 181이라 폭 184에 들어간다. Chrome 실측은 더 좁았다.

### 테스트: `VpcDestinationDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트는 고치지 않는다. 가로형 테스트는 `describe('가로형 (768px 이상)', …)`
하나로 묶고, 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서 `vi.unstubAllGlobals()`로 되돌린다.
모의는 이 파일 안에 둔다(step 0 테스트의 모양을 따른다).

1. `viewBox`가 `0 0 440 400`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합과 그룹 id 순서가 세로형과 같다(`internet`, `services`, `application`, `vpcs`).
3. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 400])`로 안에 있다.
4. 노드마다 위 줄(조건, 크기 9)과 아래 줄(답, 크기 10)이 각각 `estimateTextWidth(글, 크기) + 12 <= 폭`이다. 그룹 라벨은
   `라벨 x + estimateTextWidth(라벨, 9)`가 자기 박스 오른쪽 끝을 넘지 않는다.
5. 그룹 넷이 2×2다. `internet`과 `services`의 y가 같고 `application`과 `vpcs`의 y가 같다. 아랫줄이 윗줄 아래에 있다. 왼쪽 열(`internet`,
   `application`)의 오른쪽 끝이 오른쪽 열의 왼쪽 끝보다 작다. 그룹끼리 겹치지 않는다.
6. 목적지마다 노드 셋이 자기 그룹 안에 있고, 위에서 아래로 겹치지 않고 쌓인다.
7. 기존 「`$label`을 고르면 그 그룹 셋만 선명하고…」 시나리오 검사를 가로형에서도 같은 기대값으로 통과한다(같은 `destinations` 표를 쓴다).
8. **폭이 바뀌어도 선택이 유지된다.** `matches: false`로 렌더해 `다른 VPC의 앱`을 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러
   (`act`) `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 12개·경로 0개'
```

**검사기를 고쳐서 통과시키지 마라.**

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 테스트 파일의 기존 `it`이 그대로인가.
   - 바뀐 파일이 `VpcDestinationDiagram.tsx`, `VpcDestinationDiagram.test.tsx`, `phases/60-wide-diagrams/index.json`뿐인가.
3. `phases/60-wide-diagrams/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 세로·가로 배치를 나눈 방식(상수 이름과 고르는 자리 —
     step 3·4가 따른다), 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 하고(ADR-047), 지난 phase들의 실측이 세로형 좌표에 걸려 있다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **문구(JSON)·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`를 고치지 마라.**
- **다른 도식을 고치지 마라.** 이유: step 3·4가 한 장씩 맡는다.
- 기존 테스트를 깨뜨리지 마라.
