# Step 9: pod-permissions-diagram

## 배경

`eks-irsa`는 노드의 IAM 역할에 정책을 붙이면 그 노드의 모든 파드가 같은 권한을 쓰고, IRSA는 쿠버네티스 서비스 계정에 IAM 역할의 ARN을 어노테이션으로 적고 그 역할과
클러스터의 OIDC 공급자 사이에 신뢰 관계를 세워 그 서비스 계정의 파드만 역할을 맡게 하며, 네트워크 정책은 파드 사이의 통신 경로를 다룰 뿐 AWS API 권한이 아니라고
말한다. 문항 q523의 보기 넷(노드 역할, IRSA, 네트워크 정책, ECS 태스크 역할)이 이 자리를 묻는다. 이 step은 장면 셋(노드 역할에 붙이면, 서비스 계정에 붙이면,
네트워크 정책은)으로 가른다.

사용자 결정(2026-10-21)은 `docs/ADR.md` ADR-037 끝의 「2026-10-21 확장 — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk 주제(phase 64)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23)로 승인한 것이다. 설계 승인본은 `phases/64-container-visuals/tools/design-spec.mjs`의 `diagrams['pod-permissions']`다.

**앵커는 `ecs-eks-fargate.eks-irsa`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 63과 phase 64), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048, ADR-049**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/64-container-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/ecs-eks-fargate.json`: step 1이 만든 파일이다. 여기에 `diagrams["pod-permissions"]`를 더한다. **표 넷과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DelegatedAdminDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례(phase 63)
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/ContainerImageDiagram.tsx`, `src/components/diagrams/EcsStructureDiagram.tsx`, `src/components/diagrams/EcsRolesDiagram.tsx`, `src/components/diagrams/AwsvpcPathDiagram.tsx`, `src/components/diagrams/TaskPlacementDiagram.tsx`, `src/components/diagrams/EksComputeDiagram.tsx`, `src/components/diagrams/EksScalingDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `ecs-eks-fargate` 주제 가운데 `eks-irsa`, `ecs-task-role`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/PodPermissionsDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["pod-permissions"]`
- 매핑: `registry.ts`에 `'ecs-eks-fargate.eks-irsa': PodPermissionsDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 위에 노드 IAM 역할(왼쪽)과 OIDC 공급자(오른쪽)를 두고, 오른쪽 열로 OIDC 공급자 → IAM 역할 → 서비스 계정을 내려 쌓고, 왼쪽 열 가운데에 네트워크 정책을,
맨 아래에 `노드` 박스(파드 B 왼쪽, 파드 A 오른쪽)를 둔다.

```
[노드 IAM 역할]      [OIDC 공급자]
      │                  ↓
      │             [IAM 역할]
      │                  ↓
[네트워크 정책]      [서비스 계정]
┌ 노드 ─↓──────────────↓────────┐
│ [파드 B]   →    [파드 A]       │
└──────────────────────────────┘
```

- 노드 IAM 역할의 화살표는 두 열 사이 통로(x 140)로 내려가 노드 박스의 위 변에서 끝난다.
- 가로형은 노드 박스를 왼쪽에(파드 B·A 나란히), 서비스 계정 ← IAM 역할을 오른쪽으로 펴고, OIDC 공급자를 IAM 역할 위에, 네트워크 정책을 서비스 계정 아래에 둔다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을
`phases/64-container-visuals/tools/check-design.mjs`로 맞추고 미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 288`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `node` | 노드 | 4, 192, 272, 72 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `node-role` | 노드 IAM 역할 | `stroke-diagram-managed` | 8, 8, 124 |
| `oidc` | OIDC 공급자 | `stroke-diagram-managed` | 148, 8, 124 |
| `irsa-role` | IAM 역할 | `stroke-diagram-managed` | 148, 72, 124 |
| `netpol` | 네트워크 정책 | `stroke-disabled` | 8, 136, 124 |
| `sa` | 서비스 계정 | `stroke-disabled` | 148, 136, 124 |
| `pod-b` | 파드 B | `stroke-disabled` | 16, 216, 116 |
| `pod-a` | 파드 A | `stroke-disabled` | 148, 216, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `node-role-node` | 노드 IAM 역할이 노드 전체에 붙는다 | `M132 24 H140 V192` |
| `oidc-irsa-role` | IAM 역할이 OIDC 공급자를 신뢰한다 | `M210 40 V72` |
| `irsa-role-sa` | IAM 역할의 ARN을 서비스 계정에 적는다 | `M210 104 V136` |
| `sa-pod-a` | 그 서비스 계정으로 도는 파드 A가 역할을 맡는다 | `M210 168 V216` |
| `pod-b-pod-a` | 파드 사이의 통신(네트워크 정책이 다루는 것) | `M132 232 H148` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `all-pods` | 파드 A와 B가 같은 권한 | 140, 280 | `middle` | `node-role` |
| `trust` | 신뢰 관계 | 218, 60 | `start` | `irsa` |
| `only-a` | 파드 A만 역할을 맡는다 | 140, 280 | `middle` | `irsa` |
| `traffic-only` | 통신 경로만 다룬다 | 70, 184 | `middle` | `netpol` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **7줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **5줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 184`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `node` | 노드 | 4, 64, 196, 72 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `node-role` | 8, 8, 120 |
| `oidc` | 336, 24, 96 |
| `irsa-role` | 336, 88, 96 |
| `sa` | 224, 88, 96 |
| `netpol` | 224, 144, 96 |
| `pod-b` | 16, 88, 80 |
| `pod-a` | 108, 88, 80 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `node-role-node` | `M68 40 V64` |
| `oidc-irsa-role` | `M384 56 V88` |
| `irsa-role-sa` | `M336 104 H320` |
| `sa-pod-a` | `M224 104 H188` |
| `pod-b-pod-a` | `M96 104 H108` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `all-pods` | 파드 A와 B가 같은 권한 | 102, 152 | `middle` |
| `trust` | 신뢰 관계 | 392, 76 | `start` |
| `only-a` | 파드 A만 역할을 맡는다 | 148, 152 | `middle` |
| `traffic-only` | 통신 경로만 다룬다 | 328, 164 | `start` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `node-role` | 노드 역할에 붙이면 | `node-role`, `pod-a`, `pod-b` | `node-role-node` | `all-pods` | 노드의 IAM 역할에 정책을 붙이면 그 노드에서 도는 모든 파드가 같은 권한을 쓴다. | `ecs-eks-fargate.eks-irsa` |
| `irsa` | 서비스 계정에 붙이면 | `oidc`, `irsa-role`, `sa`, `pod-a` | `oidc-irsa-role`, `irsa-role-sa`, `sa-pod-a` | `trust`, `only-a` | 역할 ARN을 서비스 계정에 적고 OIDC 공급자와 신뢰를 세우면 그 계정의 파드만 역할을 맡는다. | `ecs-eks-fargate.eks-irsa` |
| `netpol` | 네트워크 정책은 | `netpol`, `pod-a`, `pod-b` | `pod-b-pod-a` | `traffic-only` | 네트워크 정책은 파드 사이의 통신 경로를 다룬다. AWS API를 부를 권한은 주지 않는다. | `ecs-eks-fargate.eks-irsa` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `파드 하나에만 AWS 권한을 주려면 역할을 어디에 붙일까?`
- `idleCaption`: `붙이는 곳을 고르면 권한이 어느 파드까지 닿는지 볼 수 있다.`
- `legend`: `파랑: IAM 역할과 OIDC 공급자 · 회색: 쿠버네티스 쪽. 큰 박스가 노드 하나다.`
- `label`: `EKS 파드 권한 도식`, `svgLabel`: `노드 IAM 역할·서비스 계정용 IAM 역할·네트워크 정책`
- 도식의 `sources`: `ecs-eks-fargate.eks-irsa`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `PodPermissionsDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 7개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. 파드 둘은 두 배치 모두 `node` 박스 안이고, 나머지 노드는 박스와 겹치지 않는다.
7. `node-role-node`는 두 배치 모두 `node` 박스의 변에서 끝난다. `sa-pod-a`는 `pod-a` 상자의 변에서 끝나고, **`pod-b`의 변에서 끝나는 IAM 쪽 경로는 없다**(`node-role-node`·`oidc-irsa-role`·`irsa-role-sa`·`sa-pod-a` 중 어느 것도 `pod-b`에 닿지 않는다).
8. `irsa` 장면에서 `pod-b`·`node-role`·`netpol`의 opacity는 `0.25`다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `ecs-eks-fargate.eks-irsa` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 184`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 184])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
    그룹 라벨은 `0..440` 안이다.
15. 세로형의 3번·5번과 6~8번을 가로형에서도 같은 기대값으로 통과한다.
16. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 345개·경로 268개, 가로 노드 345개·경로 268개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 7개·경로 5개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `PodPermissionsDiagram.tsx`, `PodPermissionsDiagram.test.tsx`, `ecs-eks-fargate.json`, `registry.ts`, `phases/64-container-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 1의 표가 그대로인가.
3. `phases/64-container-visuals/index.json`의 step 9을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`IRSA` 약어를 라벨·버튼·캡션에 쓰지 마라.** 이유: 화면에 보이는 문구는 본문의 풀어 쓴 말(서비스 계정, IAM 역할)로 쓴다. 약어 풀이는 개념 이름에만 있다.
- **ECS 태스크 역할 노드를 더하지 마라.** 이유: q523의 오답이지만 ECS의 역할은 step 4의 도식이 다룬다.
- **어노테이션 문법·OIDC 발급자 URL을 쓰지 마라.** 이유: 본문은 「ARN을 어노테이션으로 적는다」까지만 말한다.
- IAM 역할·노드 IAM 역할·OIDC 공급자의 색은 `stroke-diagram-managed`(파랑)다. 이유: phase 63의 IAM 도식과 같다. 청록을 쓰지 마라.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **초록·빨강·주황, 이모지, O/X를 쓰지 마라.** 이유: 정답/오답/중요도가 점유한 색이고(ADR-036), 판정은 곁말 글자로만 쓴다(ADR-037 phase 64).
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 1의 표를 고치지 마라.** 이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- **검사기(`check-path-crossings.mjs`·`phases/64-container-visuals/tools/`)를 고쳐서 통과시키지 마라.** 이유: 경로가 노드 상자를 뚫으면 통로를 옮겨야 한다.
- 기존 테스트를 깨뜨리지 마라.
