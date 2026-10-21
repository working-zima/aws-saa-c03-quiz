# Step 8: eks-scaling-diagram

## 배경

`eks-cluster-autoscaler`는 Horizontal Pod Autoscaler가 파드 수만 늘려 노드에 여유가 없으면 새 파드가 스케줄링되지 못하고 기다리며, Cluster Autoscaler가 그 대기 중인
파드를 감지해 노드를 늘린다고 말한다. Auto Scaling 그룹은 인스턴스를 늘릴 수 있어도 파드가 대기 중이라는 사실을 모른다. 문항 q517의 보기(Cluster Autoscaler, Auto Scaling
그룹만, HPA 목표 사용률 낮추기, Lambda로 직접 구현)가 이 두 층을 묻는다. 이 step은 장면 셋(파드 오토스케일러만, Cluster Autoscaler, Auto Scaling 그룹만)으로 가른다.

사용자 결정(2026-10-21)은 `docs/ADR.md` ADR-037 끝의 「2026-10-21 확장 — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk 주제(phase 64)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23)로 승인한 것이다. 설계 승인본은 `phases/64-container-visuals/tools/design-spec.mjs`의 `diagrams['eks-scaling']`다.

**앵커는 `ecs-eks-fargate.eks-cluster-autoscaler`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 63과 phase 64), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048, ADR-049**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/64-container-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/ecs-eks-fargate.json`: step 1이 만든 파일이다. 여기에 `diagrams["eks-scaling"]`를 더한다. **표 넷과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DelegatedAdminDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례(phase 63)
- `src/components/diagrams/ColumnarFormatDiagram.tsx`와 그 테스트: 경로가 없는 장면(`paths: []`)의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/ContainerImageDiagram.tsx`, `src/components/diagrams/EcsStructureDiagram.tsx`, `src/components/diagrams/EcsRolesDiagram.tsx`, `src/components/diagrams/AwsvpcPathDiagram.tsx`, `src/components/diagrams/TaskPlacementDiagram.tsx`, `src/components/diagrams/EksComputeDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `ecs-eks-fargate` 주제 가운데 `eks-cluster-autoscaler`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/EksScalingDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["eks-scaling"]`
- 매핑: `registry.ts`에 `'ecs-eks-fargate.eks-cluster-autoscaler': EksScalingDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 위 줄에 Horizontal Pod Autoscaler → 대기 중인 파드를 두고, 왼쪽에 `가득 찬 노드` 박스(파드 둘 위아래), 오른쪽에 `새 노드`(노드 상자), 아래 줄에
Cluster Autoscaler와 Auto Scaling 그룹을 둔다.

```
[Horizontal Pod Autoscaler] → [대기 중인 파드]
┌ 가득 찬 노드 ┐                    ↓
│ [파드]       │               [새 노드]
│ [파드]       │                    ↑
└─────────────┘                    │
[Cluster Autoscaler] ───────────────┘   [Auto Scaling 그룹]
```

- **새 노드는 그룹 박스가 아니라 노드 상자(청록)다.** 그룹 박스는 장면이 바뀌어도 흐려지지 않아, 아직 없는 노드를 그룹으로 그리면 처음부터 있는 것처럼 보인다(ADR-037 phase 64).
- 가로형은 같은 줄 구성을 왼쪽에서 오른쪽으로 펴고, Cluster Autoscaler와 Auto Scaling 그룹을 오른쪽 열에 위아래로 둔다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을
`phases/64-container-visuals/tools/check-design.mjs`로 맞추고 미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 252`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `node` | 가득 찬 노드 | 4, 64, 160, 108 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `hpa` | Horizontal Pod Autoscaler | `stroke-disabled` | 8, 8, 156 |
| `pending` | 대기 중인 파드 | `stroke-disabled` | 180, 8, 92 |
| `pod-1` | 파드 | `stroke-disabled` | 16, 88, 136 |
| `pod-2` | 파드 | `stroke-disabled` | 16, 128, 136 |
| `new-node` | 새 노드 | `stroke-diagram-resource` | 172, 104, 100 |
| `ca` | Cluster Autoscaler | `stroke-disabled` | 8, 196, 148 |
| `asg` | Auto Scaling 그룹 | `stroke-disabled` | 164, 196, 108 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `hpa-pending` | 파드 오토스케일러가 파드를 늘린다 | `M164 24 H180` |
| `pending-new-node` | 대기 중이던 파드가 새 노드에 올라간다 | `M226 40 V104` |
| `ca-new-node` | Cluster Autoscaler가 노드를 늘린다 | `M150 196 V184 H222 V136` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `waiting` | 올릴 노드가 없어 대기 | 226, 56 | `middle` | `hpa-only` |
| `added` | 노드를 늘림 | 228, 168 | `start` | `with-ca` |
| `unaware` | 대기 중인 파드를 모름 | 218, 244 | `middle` | `asg-only` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **7줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **3줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 176`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `node` | 가득 찬 노드 | 4, 64, 168, 72 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `hpa` | 8, 8, 156 |
| `pending` | 196, 8, 92 |
| `pod-1` | 16, 88, 68 |
| `pod-2` | 92, 88, 68 |
| `new-node` | 196, 88, 92 |
| `ca` | 312, 88, 120 |
| `asg` | 312, 136, 120 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `hpa-pending` | `M164 24 H196` |
| `pending-new-node` | `M242 40 V88` |
| `ca-new-node` | `M312 104 H288` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `waiting` | 올릴 노드가 없어 대기 | 242, 60 | `middle` |
| `added` | 노드를 늘림 | 300, 80 | `middle` |
| `unaware` | 대기 중인 파드를 모름 | 304, 156 | `end` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `hpa-only` | 파드 오토스케일러만 | `hpa`, `pending`, `pod-1`, `pod-2` | `hpa-pending` | `waiting` | 파드 오토스케일러는 파드 수만 늘린다. 노드에 여유가 없으면 새 파드는 기다린다. | `ecs-eks-fargate.eks-cluster-autoscaler` |
| `with-ca` | Cluster Autoscaler | `pending`, `ca`, `new-node` | `ca-new-node`, `pending-new-node` | `added` | 대기 중인 파드를 감지해 노드를 늘리면, 늘어난 노드에 그 파드가 올라간다. | `ecs-eks-fargate.eks-cluster-autoscaler` |
| `asg-only` | Auto Scaling 그룹만 | `asg`, `pending` | 없음 | `unaware` | Auto Scaling 그룹은 인스턴스를 늘릴 수 있어도 파드가 대기 중이라는 사실을 모른다. | `ecs-eks-fargate.eks-cluster-autoscaler` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `노드가 가득 차면 늘어난 파드는 어디에 올라갈까?`
- `idleCaption`: `켜 둔 기능을 고르면 늘어난 파드가 올라갈 노드를 얻는지 볼 수 있다.`
- `legend`: `청록: 새로 늘린 노드(EC2 인스턴스) · 회색: 파드와 확장 기능. 큰 박스가 가득 찬 노드다.`
- `label`: `EKS 확장 도식`, `svgLabel`: `Horizontal Pod Autoscaler·Cluster Autoscaler·Auto Scaling 그룹과 대기 중인 파드`
- 도식의 `sources`: `ecs-eks-fargate.eks-cluster-autoscaler`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `EksScalingDiagram.test.tsx`

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
6. `pod-1`·`pod-2`는 두 배치 모두 `node` 박스 안이고, 나머지 노드는 박스와 겹치지 않는다. **`new-node`는 그룹이 아니라 노드다**(`data-node="new-node"`, 높이 32).
7. `with-ca`의 경로 둘은 두 배치 모두 `new-node` 상자의 변에서 끝난다. `hpa-only` 장면에서 `new-node`의 opacity는 `0.25`다.
8. `asg-only` 장면은 경로가 없고(`path` 요소 0개), `asg`·`pending`만 선명하다.
9. 버튼 라벨에 `HPA`가 없다(첫 장면 버튼은 `파드 오토스케일러만`).
10. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
11. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
12. `ConceptList`에 `ecs-eks-fargate.eks-cluster-autoscaler` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

13. `viewBox`가 `0 0 440 176`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
14. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
15. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 176])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 338개·경로 263개, 가로 노드 338개·경로 263개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 7개·경로 3개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `EksScalingDiagram.tsx`, `EksScalingDiagram.test.tsx`, `ecs-eks-fargate.json`, `registry.ts`, `phases/64-container-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 1의 표가 그대로인가.
3. `phases/64-container-visuals/index.json`의 step 8을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **약어 `HPA`를 어디에도 쓰지 마라.** 이유: 데이터에 풀이가 없다. 본문은 `Horizontal Pod Autoscaler`와 `파드 오토스케일러`만 쓴다(ADR-037 phase 64).
- **`새 노드`를 그룹 박스로 그리지 마라.** 이유: 위 「모양」.
- **메모리 사용률 지표·Lambda 노드를 더하지 마라.** 이유: q517의 오답이지만 본문이 「이미 있는 기능을 다시 만드는 일」이라고 한 줄로 말할 뿐 그림으로 가를 동작이 없다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **초록·빨강·주황, 이모지, O/X를 쓰지 마라.** 이유: 정답/오답/중요도가 점유한 색이고(ADR-036), 판정은 곁말 글자로만 쓴다(ADR-037 phase 64).
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 1의 표를 고치지 마라.** 이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- **검사기(`check-path-crossings.mjs`·`phases/64-container-visuals/tools/`)를 고쳐서 통과시키지 마라.** 이유: 경로가 노드 상자를 뚫으면 통로를 옮겨야 한다.
- 기존 테스트를 깨뜨리지 마라.
