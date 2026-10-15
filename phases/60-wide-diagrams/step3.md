# Step 3: eventbridge-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047). 이 step은 EventBridge 이벤트 경로 도식(`EventBridgeRoutingDiagram`, 세로 900)에
가로형을 더한다. step 2가 VPC 목적지 도식에서 세운 패턴을 그대로 따른다.

가로형은 네 단계(이벤트 소스 → 이벤트 버스 → 규칙 → 대상)를 세로형처럼 위에서 아래로 쌓되, 단계 **안에서** 노드를 가로로 편다.

- 소스 셋은 각자 받는 버스 **바로 위에** 선다. 소스→버스 화살표가 곧은 세로선 하나다.
- 규칙 줄에는 이벤트 패턴 규칙, 일정 규칙, 큐·스트림 → EventBridge 파이프가 한 줄로 선다.
- 대상 윗줄은 규칙·파이프가 바로 부르는 Lambda 함수·SQS 큐·Step Functions(파이프 바로 아래)다. 아랫줄은 대상이 다시 다른 곳을 부르는 두 짝,
  점선 VPC 안의 VPC 연결 Lambda → 사설 API와 API 대상 → 외부 HTTP API다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047)」**
- `phases/60-wide-diagrams/index.json`의 step 0·1·2 `summary`
- `src/hooks/useWideDiagram.ts`
- `src/components/diagrams/VpcDestinationDiagram.tsx`와 그 테스트: **step 2가 세운 가로형 선례다. 상수 이름·배치를 고르는 자리·테스트
  묶음 방식을 맞춰라.**
- `src/components/diagrams/EventBridgeRoutingDiagram.tsx`, `src/components/diagrams/EventBridgeRoutingDiagram.test.tsx`: 고칠 파일
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `wideNodes`·`widePaths` 블록의 줄 형식을 읽는다. 경로 키는 따옴표로 감싼다(`'pipe-sfn': 'M…'`).

## 작업

### 컴포넌트

- `useWideDiagram()`이 `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다. 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideNodes`·`widePaths`·`wideGroups` 상수로 둔다.
  - `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩, **열일곱 줄을 그대로 적는다.** 라벨과 색은 세로형 `nodes`에서 id로 가져온다.
  - `widePaths`는 `'id': 'M…'` 한 줄씩, **열다섯 줄을 그대로 적는다.** 키 집합은 세로형 `paths`와 같다.
  - 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`, 화살표 마커(`useId`), 경로의 굵기·색·`markerEnd`,
  노드 높이(32)·글자 자리, 그룹 박스의 `rx`(단계 넷은 4, VPC는 6)와 점선(VPC만 `6 4`)은 세로형과 같다.
- 시나리오·캡션·범례·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다.

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Chrome 실측)·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속을 스크립트로 맞춘 값이다.
테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 488`이다.

**그룹 박스**(`wideGroups`, 라벨은 크기 9·`fill-muted`, 라벨 글은 세로형과 같다):

| id | 라벨 | 박스 x, y, 폭, 높이 | 점선 | 라벨 자리 x, y |
|---|---|---|---|---|
| `sources` | 이벤트 소스 | 12, 4, 416, 76 | 없음 | 24, 22 |
| `buses` | 이벤트 버스 | 12, 104, 416, 76 | 없음 | 24, 122 |
| `rules` | 규칙 | 12, 204, 416, 76 | 없음 | 24, 222 |
| `targets` | 대상 | 12, 304, 416, 172 | 없음 | 24, 322 |
| `vpc` | VPC | 20, 384, 216, 80 | `6 4` | 28, 402 |

**노드**(`wideNodes`, 높이 32):

| id | 라벨 | x, y, 폭 |
|---|---|---|
| `aws-service` | AWS 서비스 | 20, 36, 124 |
| `my-app` | 내 애플리케이션 | 152, 36, 136 |
| `partner-saas` | 외부 SaaS | 296, 36, 124 |
| `default-bus` | 기본 이벤트 버스 | 20, 136, 124 |
| `custom-bus` | 사용자 지정 이벤트 버스 | 152, 136, 136 |
| `partner-bus` | 파트너 이벤트 버스 | 296, 136, 124 |
| `pattern-rule` | 이벤트 패턴 규칙 | 20, 236, 104 |
| `schedule-rule` | 일정 규칙 | 136, 236, 72 |
| `pipe-source` | 큐·스트림 | 220, 236, 68 |
| `pipe` | EventBridge 파이프 | 304, 236, 116 |
| `lambda` | Lambda 함수 | 20, 336, 88 |
| `queue` | SQS 큐 | 124, 336, 64 |
| `sfn` | Step Functions | 304, 336, 116 |
| `vpc-lambda` | VPC 연결 Lambda | 28, 416, 108 |
| `private-api` | 사설 API | 152, 416, 76 |
| `api-destination` | API 대상 | 248, 416, 64 |
| `external-api` | 외부 HTTP API | 328, 416, 92 |

가운데 열(136)이 양옆(124)보다 넓은 것은 `사용자 지정 이벤트 버스`(어림값 116.5 + 여백 12 = 128.5) 때문이다.

**경로**(`widePaths`, 직교 M/H/V만):

| id | `d` | 길 |
|---|---|---|
| `aws-service-default-bus` | `M82 68 V136` | 곧게 아래 |
| `my-app-custom-bus` | `M220 68 V136` | 곧게 아래 |
| `partner-saas-partner-bus` | `M358 68 V136` | 곧게 아래 |
| `default-bus-pattern-rule` | `M74 168 V236` | 곧게 아래 |
| `custom-bus-pattern-rule` | `M220 168 V192 H112 V236` | 버스와 규칙 띠 사이(y 192)로 왼쪽 |
| `partner-bus-pattern-rule` | `M358 168 V192 H112 V236` | 같은 길 |
| `pattern-rule-lambda` | `M60 268 V336` | 곧게 아래 |
| `pattern-rule-queue` | `M112 268 V292 H156 V336` | 규칙과 대상 띠 사이(y 292) |
| `schedule-rule-lambda` | `M172 268 V292 H88 V336` | 같은 띠 사이 |
| `pattern-rule-api-destination` | `M112 268 V292 H280 V416` | SQS 큐와 Step Functions 사이로 내려감 |
| `api-destination-external-api` | `M312 432 H328` | 오른쪽 |
| `pattern-rule-vpc-lambda` | `M20 252 H8 V432 H28` | 왼쪽 바깥 통로(x 8) |
| `vpc-lambda-private-api` | `M136 432 H152` | 오른쪽 |
| `pipe-source-pipe` | `M288 252 H304` | 오른쪽 |
| `pipe-sfn` | `M362 268 V336` | 곧게 아래 |

### 테스트: `EventBridgeRoutingDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트는 고치지 않는다. step 2처럼 `describe('가로형 (768px 이상)', …)`
하나로 묶고 그 안에서만 `matchMedia`를 모의한다.

1. `viewBox`가 `0 0 440 488`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합이 세로형과 같다(17개). 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형의 15개와 같다.
3. 모든 `rect`(노드 17, 그룹 5)가 `boxesOutsideViewBox(…, [0, 0, 440, 488])`로 안에 있다.
4. 라벨 17개가 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다. 그룹 라벨 다섯이 `라벨 x + estimateTextWidth(라벨, 9)` ≤ 자기 박스 오른쪽 끝이다.
5. 네 단계가 위에서 아래로 겹치지 않고 쌓이고, 노드가 자기 단계 안에 있다(기존 「네 단계와 대상 내부의 점선 VPC가…」와 같은 묶음).
   VPC 박스는 `targets` 안에 있고 점선이다. `vpc-lambda`·`private-api`는 VPC 안에 있고, **나머지 노드는 VPC 박스와 겹치지 않는다.**
   (세로형의 「VPC보다 위에 있다」는 가로형에서 「겹치지 않는다」로 바꾼다 — ADR-047 배치 원칙.) 노드 색은 세로형과 같다.
6. 소스 셋이 각자의 버스 바로 위에 있다. `aws-service`/`default-bus`, `my-app`/`custom-bus`, `partner-saas`/`partner-bus`가 x와 폭이 같고,
   세 시나리오(`AWS 서비스 변경`, `내 앱 이벤트`, `외부 SaaS`)에서 소스→버스 경로의 `d`가 `M`과 `V` 하나뿐이다(곧은 세로선).
7. 기존 시나리오 검사(시나리오마다 선명한 노드·보이는 경로·캡션)를 가로형에서도 같은 기대값으로 통과한다.
8. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 `VPC 안 API`를 고른 뒤 `matches: true`로 바꾸면(`act`) `viewBox` 폭이 440이 되고,
   그 버튼이 여전히 눌려 있으며 `pattern-rule-vpc-lambda`·`vpc-lambda-private-api` 두 경로가 그대로 보인다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 29개·경로 15개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 `it`이 그대로인가.
   - 바뀐 파일이 `EventBridgeRoutingDiagram.tsx`, `EventBridgeRoutingDiagram.test.tsx`, `phases/60-wide-diagrams/index.json`뿐인가.
3. `phases/60-wide-diagrams/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 한다(ADR-047).
- **SVG 두 개를 겹쳐 두고 CSS로 하나를 숨기지 마라.** 이유: ADR-047 「대안」.
- **기준 폭 문자열을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다.
- **노드를 더하거나 빼지 마라. 문구·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **흐르는 점 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·다른 도식을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
