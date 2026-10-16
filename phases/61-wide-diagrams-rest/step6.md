# Step 6: messaging-shapes-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047, 나머지 24장으로 넓힌 결정은 ADR-048). 이 step은 **`MessagingShapesDiagram`**(세로 592) 한 장에
가로형을 더한다. phase 60이 세운 패턴(`useWideDiagram()`, `wideNodes`·`widePaths`·`wideGroups`, 래퍼 `w-full`)을 그대로 따른다.

세 단을 왼쪽에서 오른쪽 세 열로 바꾼다 — 보내는 쪽 → AWS 전달 장치 → 받는 쪽. 서비스마다 한 줄이라 화살표 열한 개 중 여덟이 수평선 하나다. 애플리케이션은 자기가 보내는 SQS·SNS·SES 세 줄의 가운데에 선다.

데스크톱 높이는 803px(세로형, 표시 380px) → 435px(가로형, 표시 638px)이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047·ADR-048)」**
- `phases/61-wide-diagrams-rest/index.json`의 앞선 step `summary` — 같은 패턴을 먼저 적용한 도식들이다.
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- 선례: `src/components/diagrams/EventBridgeRoutingDiagram.tsx`·`VpcPathsDiagram.tsx`·`VpcDestinationDiagram.tsx`와 각 테스트의 `describe('가로형 (768px 이상)', …)`.
  **상수 이름·배치를 고르는 자리·테스트 묶음 방식을 맞춰라.** JSX에 박힌 세로형 그룹을 배열로 옮긴 방식은 EventBridge·VPC 경로를 본다.
- `src/components/diagrams/MessagingShapesDiagram.tsx`, `src/components/diagrams/MessagingShapesDiagram.test.tsx`: 고칠 파일
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `wideNodes`·`widePaths` 블록을 글자로 읽는다. 줄 형식을 지켜라.

## 작업

### 컴포넌트

- `useWideDiagram()`이 `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다(래퍼 클래스, `viewBox`, 좌표, DOM 순서, 속성 모두). 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideNodes`·`widePaths`·`wideGroups` 상수로 둔다.
  - `wideNodes`는 `{ id: '…', x: N, y: N, width: N }`(높이가 32가 아니면 `, height: N`을 덧붙인다) 한 줄씩, **14줄을 그대로 적는다.** 라벨·색은 세로형에서 id로 가져온다.
  - `widePaths`는 `'id': 'M…'` 한 줄씩, **11줄을 그대로 적는다.** 키 집합은 세로형 `paths`와 같다.
  - 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`, 화살표 마커(`useId`), 경로의 굵기·색·`markerEnd`, 노드의 글자 자리·색, 그룹 박스의 `rx`·선 굵기·점선 규칙은 세로형과 같다.
- 시나리오·캡션·범례·문구(JSON)·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).
- 세로형 그룹은 JSX에 박혀 있다(라벨 `x + 12, y + 18`). **같은 좌표의 배열로 옮기고** 가로형 짝을 더한다. 세로형 DOM은 바이트 단위로 같아야 한다.

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Windows Chrome 실측)·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고,
미리보기로 사용자 승인을 받은 값이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 300`이다.

**그룹 박스**(`wideGroups`, 라벨은 크기 9·`fill-muted`, 라벨 글은 세로형과 같다):

| id | 라벨 | 박스 x, y, 폭, 높이 | 점선 | 라벨 자리 x, y |
|---|---|---|---|---|
| `senders` | 보내는 쪽 | 4, 4, 124, 292 | 없음 | 16, 22 |
| `managed` | AWS 전달 장치 | 148, 4, 152, 292 | 없음 | 160, 22 |
| `receivers` | 받는 쪽 | 320, 4, 116, 292 | 없음 | 332, 22 |

**노드**(`wideNodes`, 높이는 따로 적지 않으면 32):

| id | 라벨 | x, y, 폭 |
|---|---|---|
| `app` | 애플리케이션 | 12, 80, 108 |
| `aws-service` | AWS 서비스 | 12, 168, 108 |
| `saas` | 외부 SaaS | 12, 212, 108 |
| `legacy-app` | 기존 온프레미스 앱 | 12, 256, 108 |
| `queue` | SQS 큐 | 156, 36, 136 |
| `topic` | SNS 주제 | 156, 80, 136 |
| `ses` | SES | 156, 124, 136 |
| `bus` | EventBridge 이벤트 버스 | 156, 168, 136 |
| `broker` | Amazon MQ 브로커 | 156, 256, 136 |
| `worker` | 워커 하나 | 328, 36, 100 |
| `subscribers` | 구독자 여럿 | 328, 80, 100 |
| `inbox` | 이메일 수신함 | 328, 124, 100 |
| `targets` | 규칙에 맞는 대상 | 328, 168, 100 |
| `legacy-consumer` | 기존 앱 | 328, 256, 100 |

**경로**(`widePaths`, 직교 M/H/V만):

| id | `d` |
|---|---|
| `app-queue` | `M66 80 V52 H156` |
| `queue-worker` | `M292 52 H328` |
| `app-topic` | `M120 96 H156` |
| `topic-subscribers` | `M292 96 H328` |
| `aws-service-bus` | `M120 184 H156` |
| `saas-bus` | `M120 228 H224 V200` |
| `bus-targets` | `M292 184 H328` |
| `legacy-app-broker` | `M120 272 H156` |
| `broker-legacy-consumer` | `M292 272 H328` |
| `app-ses` | `M66 112 V140 H156` |
| `ses-inbox` | `M292 140 H328` |

### 테스트: `MessagingShapesDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트의 `it`은 고치지 않는다. 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶고, 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다.
`afterEach`에서 `vi.unstubAllGlobals()`로 되돌린다. 모의는 이 파일 안에 둔다.

1. `viewBox`가 `0 0 440 300`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다(11개).
3. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 300])`로 안에 있다.
4. 노드 라벨이 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다. 그룹 라벨은 `라벨 x + estimateTextWidth(라벨, 9)`가 자기 박스 오른쪽 끝을 넘지 않는다.
5. 기존 시나리오 검사(시나리오마다 선명한 노드·보이는 경로·곁말·캡션)를 가로형에서도 같은 기대값으로 통과한다.
6. 기존 「색 없이도 세 단의 배치가 성립한다」를 가로형에 맞게 다시 쓴다 — 세 그룹이 왼쪽에서 오른쪽으로 겹치지 않고 나란하며(y와 높이가 같다), 노드가 자기 그룹 안에 있다.
7. 시나리오 다섯에서 전달 장치 → 받는 쪽 경로가 수평선 하나(`M`과 `H` 하나)다.
8. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
   `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션과 보이는 경로가 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 101개·경로 81개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 `it`이 그대로인가.
   - 바뀐 파일이 `MessagingShapesDiagram.tsx`, `MessagingShapesDiagram.test.tsx`, `phases/61-wide-diagrams-rest/index.json`뿐인가.
3. `phases/61-wide-diagrams-rest/index.json`의 step 6을 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 세로형 DOM이 그대로인지 확인한 방법, 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 하고(ADR-047), 지난 phase들의 실측이 세로형 좌표에 걸려 있다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **노드·경로를 더하거나 빼지 마라. 문구(JSON)·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·`useWideDiagram.ts`·다른 도식을 고치지 마라.** 이유: step마다 한 장씩 맡는다.
- 기존 테스트를 깨뜨리지 마라.
