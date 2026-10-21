# Step 6: task-placement-diagram

## 배경

`ecs-task-placement-strategy`는 분산 전략에 가용 영역 속성을 주고 최소 용량을 영역 수만큼 잡으면 각 영역에 태스크가 최소 하나씩 남아, 한 영역이 통째로 빠져도
서비스가 계속된다고 말한다. 문항 q525의 보기(분산 전략 + 최소 용량, 분산 배치 그룹, 서비스 오토 스케일링, awsvpc)가 이 구성을 묻는다. 이 step은 장면 둘(영역마다
분산, 영역 A가 빠지면)로 가른다.

사용자 결정(2026-10-21)은 `docs/ADR.md` ADR-037 끝의 「2026-10-21 확장 — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk 주제(phase 64)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23)로 승인한 것이다. 설계 승인본은 `phases/64-container-visuals/tools/design-spec.mjs`의 `diagrams['task-placement']`다.

**앵커는 `ecs-eks-fargate.ecs-task-placement-strategy`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 63과 phase 64), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048, ADR-049**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/64-container-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/ecs-eks-fargate.json`: step 1이 만든 파일이다. 여기에 `diagrams["task-placement"]`를 더한다. **표 넷과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DelegatedAdminDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례(phase 63)
- `src/components/diagrams/NatCountDiagram.tsx`와 그 테스트: 영역이 빠지는 장면과 곁말 `장애`의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/ContainerImageDiagram.tsx`, `src/components/diagrams/EcsStructureDiagram.tsx`, `src/components/diagrams/EcsRolesDiagram.tsx`, `src/components/diagrams/AwsvpcPathDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `ecs-eks-fargate` 주제 가운데 `ecs-task-placement-strategy`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/TaskPlacementDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["task-placement"]`
- 매핑: `registry.ts`에 `'ecs-eks-fargate.ecs-task-placement-strategy': TaskPlacementDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형과 가로형 모두 위에 ECS 서비스를 두고, 아래에 가용 영역 박스 셋(A·B·C)을 나란히 둔다. 박스마다 태스크가 하나 있다. `영역 A가 빠지면` 장면은 UI_GUIDE
「수량과 상태를 바꾸는 도식」을 따른다. 무너진 영역의 노드는 `0.25`로 흐리고, 그 그룹 라벨 옆에 곁말 `장애`를 붙이며, 그 영역으로 가는 경로가 사라진다.

```
            [ECS 서비스]
┌ 가용 영역 A ┐ ┌ 가용 영역 B ┐ ┌ 가용 영역 C ┐
│  [태스크]   │ │  [태스크]   │ │  [태스크]   │
└────────────┘ └────────────┘ └────────────┘
```

- 화살표는 그룹 라벨을 피해 각 박스의 오른쪽 부분으로 내려가 태스크의 위 변에 닿는다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을
`phases/64-container-visuals/tools/check-design.mjs`로 맞추고 미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 160`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `az-a` | 가용 영역 A | 4, 64, 88, 72 |
| `az-b` | 가용 영역 B | 96, 64, 88, 72 |
| `az-c` | 가용 영역 C | 188, 64, 88, 72 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `service` | ECS 서비스 | `stroke-disabled` | 82, 8, 116 |
| `task-a` | 태스크 | `stroke-disabled` | 12, 88, 76 |
| `task-b` | 태스크 | `stroke-disabled` | 104, 88, 76 |
| `task-c` | 태스크 | `stroke-disabled` | 196, 88, 76 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `service-task-a` | 서비스가 영역 A에 태스크를 둔다 | `M90 40 V52 H80 V88` |
| `service-task-b` | 서비스가 영역 B에 태스크를 둔다 | `M170 40 V88` |
| `service-task-c` | 서비스가 영역 C에 태스크를 둔다 | `M198 24 H262 V88` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `down` | 장애 | 72, 78 | `start` | `az-down` |
| `each` | 영역마다 하나씩 | 140, 152 | `middle` | `spread` |
| `continue` | 남은 영역이 서비스를 잇는다 | 140, 152 | `middle` | `az-down` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **4줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **3줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 160`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `az-a` | 가용 영역 A | 4, 64, 140, 72 |
| `az-b` | 가용 영역 B | 150, 64, 140, 72 |
| `az-c` | 가용 영역 C | 296, 64, 140, 72 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `service` | 162, 8, 116 |
| `task-a` | 40, 88, 96 |
| `task-b` | 186, 88, 96 |
| `task-c` | 332, 88, 96 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `service-task-a` | `M180 40 V52 H100 V88` |
| `service-task-b` | `M240 40 V88` |
| `service-task-c` | `M278 24 H400 V88` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `down` | 장애 | 72, 78 | `start` |
| `each` | 영역마다 하나씩 | 220, 152 | `middle` |
| `continue` | 남은 영역이 서비스를 잇는다 | 220, 152 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `spread` | 영역마다 분산 | `service`, `task-a`, `task-b`, `task-c` | `service-task-a`, `service-task-b`, `service-task-c` | `each` | 분산 전략에 가용 영역 속성을 주고 최소 용량을 영역 수만큼 잡으면 영역마다 하나씩 남는다. | `ecs-eks-fargate.ecs-task-placement-strategy` |
| `az-down` | 영역 A가 빠지면 | `service`, `task-b`, `task-c` | `service-task-b`, `service-task-c` | `down`, `continue` | 가용 영역 A가 통째로 빠져도 B와 C에 남은 태스크로 서비스가 계속된다. | `ecs-eks-fargate.ecs-task-placement-strategy` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `가용 영역 하나가 빠져도 ECS 서비스가 계속 돌까?`
- `idleCaption`: `상황을 고르면 분산 전략으로 나눠 놓은 태스크가 영역이 빠질 때 어떻게 남는지 볼 수 있다.`
- `legend`: `회색: ECS 서비스와 태스크. 큰 박스 하나가 가용 영역 하나다.`
- `label`: `ECS 태스크 배치 도식`, `svgLabel`: `가용 영역 셋에 나눠 놓은 ECS 태스크`
- 도식의 `sources`: `ecs-eks-fargate.ecs-task-placement-strategy`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `TaskPlacementDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 4개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. 태스크 셋은 두 배치 모두 자기 영역 박스 안이고(`task-a` → `az-a` 등), 서비스는 어느 박스와도 겹치지 않는다.
7. `az-down` 장면에서 `task-a`의 opacity는 `0.25`, `service-task-a` 경로가 없고, 곁말 `장애`는 `az-a` 박스 안에서 그 그룹 라벨의 오른쪽에 있다(가로 범위가 라벨 끝보다 오른쪽이고 박스 오른쪽 끝을 넘지 않는다).
8. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
9. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
10. `ConceptList`에 `ecs-eks-fargate.ecs-task-placement-strategy` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

11. `viewBox`가 `0 0 440 160`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
12. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
13. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 160])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
    그룹 라벨은 `0..440` 안이다.
14. 세로형의 3번·5번과 6~7번을 가로형에서도 같은 기대값으로 통과한다.
15. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 325개·경로 257개, 가로 노드 325개·경로 257개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 4개·경로 3개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `TaskPlacementDiagram.tsx`, `TaskPlacementDiagram.test.tsx`, `ecs-eks-fargate.json`, `registry.ts`, `phases/64-container-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 1의 표가 그대로인가.
3. `phases/64-container-visuals/index.json`의 step 6을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **분산 배치 그룹이나 EC2 하드웨어를 그리지 마라.** 이유: 본문은 분산 배치 그룹이 층이 다른 규칙이라고 말할 뿐이고, 이 도식은 태스크를 영역에 나누는 것만 보인다.
- **`장애`를 색으로 칠하지 마라.** 이유: UI_GUIDE 「수량과 상태를 바꾸는 도식」.
- **태스크 수를 숫자 곁말로 적지 마라(`최소 3` 등).** 이유: 본문은 「영역 수만큼」이라고만 말한다. `A·B·C`는 구별용 이름이다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **초록·빨강·주황, 이모지, O/X를 쓰지 마라.** 이유: 정답/오답/중요도가 점유한 색이고(ADR-036), 판정은 곁말 글자로만 쓴다(ADR-037 phase 64).
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 1의 표를 고치지 마라.** 이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- **검사기(`check-path-crossings.mjs`·`phases/64-container-visuals/tools/`)를 고쳐서 통과시키지 마라.** 이유: 경로가 노드 상자를 뚫으면 통로를 옮겨야 한다.
- 기존 테스트를 깨뜨리지 마라.
