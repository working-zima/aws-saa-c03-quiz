# Step 5: awsvpc-diagram

## 배경

`ecs-awsvpc-mode`는 awsvpc 모드에서 태스크 하나하나가 자기 몫의 엘라스틱 네트워크 인터페이스를 받고, 프라이빗 서브넷의 태스크는 퍼블릭 서브넷의 NAT
게이트웨이를 거쳐 나가며, 밖으로 드러나는 것은 로드 밸런서 하나뿐이라 태스크로 직접 들어오는 길이 없다고 말한다. 문항 q524가 이 구성을 묻는다. 이 step은
장면 둘(들어오는 요청, 나가는 요청)로 가른다.

사용자 결정(2026-10-21)은 `docs/ADR.md` ADR-037 끝의 「2026-10-21 확장 — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk 주제(phase 64)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23)로 승인한 것이다. 설계 승인본은 `phases/64-container-visuals/tools/design-spec.mjs`의 `diagrams['awsvpc']`다.

**앵커는 `ecs-eks-fargate.ecs-awsvpc-mode`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 63과 phase 64), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048, ADR-049**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/64-container-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/ecs-eks-fargate.json`: step 1이 만든 파일이다. 여기에 `diagrams["awsvpc"]`를 더한다. **표 넷과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DelegatedAdminDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례(phase 63)
- `src/components/diagrams/VpcPathsDiagram.tsx`와 그 테스트: VPC 안에 서브넷을 겹쳐 넣는 그룹과 청록 노드의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/ContainerImageDiagram.tsx`, `src/components/diagrams/EcsStructureDiagram.tsx`, `src/components/diagrams/EcsRolesDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `ecs-eks-fargate` 주제 가운데 `ecs-awsvpc-mode`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/AwsvpcPathDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["awsvpc"]`
- 매핑: `registry.ts`에 `'ecs-eks-fargate.ecs-awsvpc-mode': AwsvpcPathDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
  이 주제의 키는 **주제 안 개념 순서**로 모아 기존 키들 뒤에 둔다. phase가 끝났을 때의 순서는 아래와 같고, 이 step은 자기 줄을 그 자리에 끼운다.

```ts
  'ecs-eks-fargate.container': ContainerImageDiagram, // step 2
  'ecs-eks-fargate.container-orchestration': OrchestrationComputeTable, // step 1
  'ecs-eks-fargate.ecs': EcsStructureDiagram, // step 3
  'ecs-eks-fargate.ecs-task-role-vs-task-execution-role': EcsRolesDiagram, // step 4
  'ecs-eks-fargate.ecs-awsvpc-mode': AwsvpcPathDiagram, // step 5
  'ecs-eks-fargate.ecs-task-placement-strategy': TaskPlacementDiagram, // step 6
  'ecs-eks-fargate.eks-fargate-pod-isolation': EksComputeDiagram, // step 7
  'ecs-eks-fargate.eks-cluster-autoscaler': EksScalingDiagram, // step 8
  'ecs-eks-fargate.eks-aws-load-balancer-controller': EksRoutingTable, // step 1
  'ecs-eks-fargate.eks-anywhere': EksHybridTable, // step 1
  'ecs-eks-fargate.eks-irsa': PodPermissionsDiagram, // step 9
  'ecs-eks-fargate.app2container': ComputeChoiceTable, // step 1
```

### 모양

**그룹이 겹쳐 들어간다.** VPC 박스 안에 퍼블릭 서브넷과 프라이빗 서브넷이 있고, 프라이빗 서브넷 안에 태스크 박스 둘이 있으며, 태스크 박스마다 엘라스틱 네트워크
인터페이스 노드가 하나씩 있다. 선례는 `VpcPathsDiagram`(VPC 안의 서브넷)이다. 그룹은 바깥부터 그린다(`vpc` → `public` → `private` → `task-a` → `task-b`).

```
        [인터넷]
┌ VPC ───────────────────────────┐
│ ┌ 퍼블릭 서브넷 ──────────────┐ │
│ │ [NAT 게이트웨이] [로드 밸런서] │ │
│ └────────────────────────────┘ │
│ ┌ 프라이빗 서브넷 ────────────┐ │
│ │ ┌ 태스크 ────────────────┐ │ │
│ │ │ [엘라스틱 네트워크 인터페이스] │ │
│ │ └────────────────────────┘ │ │
│ │ ┌ 태스크 ────────────────┐ │ │
│ │ │ [엘라스틱 네트워크 인터페이스] │ │
│ │ └────────────────────────┘ │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

- 세로형은 라벨 `엘라스틱 네트워크 인터페이스`(폭 160)가 들어가도록 태스크 박스 둘을 위아래로 쌓는다. 퍼블릭 서브넷의 NAT 게이트웨이가 왼쪽, 로드 밸런서가 오른쪽이다.
- 가로형은 인터넷을 왼쪽에, 퍼블릭 서브넷(로드 밸런서 위, NAT 게이트웨이 아래)을 가운데에, 프라이빗 서브넷을 오른쪽에 둔다. 두 배치에서 로드 밸런서와 NAT 게이트웨이의 위치가 다른 것은 의도한 것이다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을
`phases/64-container-visuals/tools/check-design.mjs`로 맞추고 미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 336`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `vpc` | VPC | 4, 56, 272, 272 |
| `public` | 퍼블릭 서브넷 | 12, 76, 256, 68 |
| `private` | 프라이빗 서브넷 | 12, 160, 256, 160 |
| `task-a` | 태스크 | 20, 184, 240, 60 |
| `task-b` | 태스크 | 20, 252, 240, 60 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `internet` | 인터넷 | `stroke-disabled` | 82, 8, 116 |
| `nat` | NAT 게이트웨이 | `stroke-diagram-resource` | 24, 100, 104 |
| `lb` | 로드 밸런서 | `stroke-diagram-resource` | 152, 100, 104 |
| `eni-a` | 엘라스틱 네트워크 인터페이스 | `stroke-diagram-resource` | 28, 204, 160 |
| `eni-b` | 엘라스틱 네트워크 인터페이스 | `stroke-diagram-resource` | 28, 272, 160 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `internet-lb` | 인터넷의 요청이 로드 밸런서로 들어온다 | `M190 40 V100` |
| `lb-eni-a` | 로드 밸런서가 위 태스크의 네트워크 인터페이스로 보낸다 | `M170 132 V204` |
| `lb-eni-b` | 로드 밸런서가 아래 태스크의 네트워크 인터페이스로 보낸다 | `M230 132 V288 H188` |
| `eni-a-nat` | 태스크가 NAT 게이트웨이로 나간다 | `M100 204 V132` |
| `nat-internet` | NAT 게이트웨이가 인터넷으로 내보낸다 | `M100 100 V40` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `exposed` | 로드 밸런서만 드러남 | 140, 70 | `middle` | `inbound` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **5줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **5줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 216`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `vpc` | VPC | 96, 8, 340, 200 |
| `public` | 퍼블릭 서브넷 | 104, 32, 132, 168 |
| `private` | 프라이빗 서브넷 | 244, 32, 188, 168 |
| `task-a` | 태스크 | 252, 56, 172, 60 |
| `task-b` | 태스크 | 252, 128, 172, 64 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `internet` | 8, 64, 72 |
| `lb` | 114, 64, 112 |
| `nat` | 114, 144, 112 |
| `eni-a` | 258, 76, 160 |
| `eni-b` | 258, 152, 160 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `internet-lb` | `M80 80 H114` |
| `lb-eni-a` | `M226 80 H258` |
| `lb-eni-b` | `M226 88 H240 V168 H258` |
| `eni-a-nat` | `M258 100 H240 V160 H226` |
| `nat-internet` | `M114 160 H44 V96` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `exposed` | 로드 밸런서만 드러남 | 170, 112 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `inbound` | 들어오는 요청 | `internet`, `lb`, `eni-a`, `eni-b` | `internet-lb`, `lb-eni-a`, `lb-eni-b` | `exposed` | 밖에 드러난 것은 로드 밸런서 하나다. 요청은 태스크마다 붙은 네트워크 인터페이스로 간다. | `ecs-eks-fargate.ecs-awsvpc-mode` |
| `outbound` | 나가는 요청 | `eni-a`, `nat`, `internet` | `eni-a-nat`, `nat-internet` | 없음 | 태스크는 퍼블릭 서브넷의 NAT 게이트웨이를 거쳐 나간다. 태스크로 바로 들어오는 길은 없다. | `ecs-eks-fargate.ecs-awsvpc-mode` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `프라이빗 서브넷의 태스크로는 어떤 길이 열려 있을까?`
- `idleCaption`: `방향을 고르면 요청이 로드 밸런서와 NAT 게이트웨이 중 어디를 지나는지 볼 수 있다.`
- `legend`: `청록: VPC 안 자원 · 회색: 인터넷. 작은 박스 하나가 태스크 하나다.`
- `label`: `awsvpc 네트워크 모드 도식`, `svgLabel`: `퍼블릭 서브넷의 로드 밸런서·NAT 게이트웨이와 프라이빗 서브넷의 태스크`
- 도식의 `sources`: `ecs-eks-fargate.ecs-awsvpc-mode`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `AwsvpcPathDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 5개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. 소속이 두 배치 모두 위 표와 같다. `lb`·`nat`은 `public` 안, `eni-a`는 `task-a` 안, `eni-b`는 `task-b` 안이고, `task-a`·`task-b` 박스는 `private` 안, `public`·`private`는 `vpc` 안이다. `internet`은 `vpc` 밖이다.
7. `internet-lb`는 `lb` 상자의 변에서, `lb-eni-a`·`lb-eni-b`는 각자 `eni-a`·`eni-b` 상자의 변에서 끝난다. `nat-internet`은 `internet` 상자의 변에서 끝난다.
8. **인터넷에서 엘라스틱 네트워크 인터페이스로 바로 가는 경로가 없다**(어느 경로도 `internet`의 변에서 시작해 `eni-a`·`eni-b`의 변에서 끝나지 않는다).
9. `outbound` 장면에는 곁말이 없다.
10. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
11. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
12. `ConceptList`에 `ecs-eks-fargate.ecs-awsvpc-mode` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

13. `viewBox`가 `0 0 440 216`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
14. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
15. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 216])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
    그룹 라벨은 `0..440` 안이다.
16. 세로형의 3번·5번과 6~9번을 가로형에서도 같은 기대값으로 통과한다.
17. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 321개·경로 254개, 가로 노드 321개·경로 254개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 5개·경로 5개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `AwsvpcPathDiagram.tsx`, `AwsvpcPathDiagram.test.tsx`, `ecs-eks-fargate.json`, `registry.ts`, `phases/64-container-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 1의 표가 그대로인가.
3. `phases/64-container-visuals/index.json`의 step 5을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`ENI` 약어를 쓰지 마라. 라벨을 `네트워크 인터페이스`로 줄이지도 마라.** 이유: 본문은 `엘라스틱 네트워크 인터페이스`라고만 쓰고 약어 풀이가 없다. 본문의 말과 도식의 말이 같아야 한다(UI_GUIDE 「도식」).
- **인터넷 게이트웨이·라우팅 테이블·보안 그룹을 더하지 마라.** 이유: 이 개념의 본문이 말하지 않는다. VPC 경로의 세부는 `vpc-networking` 주제의 도식이 맡는다.
- **그룹 박스를 장면에 따라 흐리게 하지 마라.** 이유: 그룹 박스는 흐려지지 않는다(ADR-036).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **초록·빨강·주황, 이모지, O/X를 쓰지 마라.** 이유: 정답/오답/중요도가 점유한 색이고(ADR-036), 판정은 곁말 글자로만 쓴다(ADR-037 phase 64).
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 1의 표를 고치지 마라.** 이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- **검사기(`check-path-crossings.mjs`·`phases/64-container-visuals/tools/`)를 고쳐서 통과시키지 마라.** 이유: 경로가 노드 상자를 뚫으면 통로를 옮겨야 한다.
- 기존 테스트를 깨뜨리지 마라.
