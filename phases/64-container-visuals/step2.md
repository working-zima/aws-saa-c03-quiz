# Step 2: image-flow-diagram

## 배경

새 기본 개념 `container`(step 0이 넣었다)는 이미지를 Dockerfile에 적은 대로 빌드해 만들고, 레지스트리(Amazon ECR)에 올리고, 서버가 내려받아 실행한 것이
컨테이너이며, 컨테이너는 운영 체제를 따로 담지 않고 서버의 운영 체제를 함께 쓴다고 말한다. 문항 q509(이미지 검사는 레지스트리 쪽 설정이다)와 q740(올린 것과
실행된 것의 이름)이 이 흐름을 묻는다. 이 step은 장면 셋(만들어 올리기, 내려받아 실행, 한 서버 안에서)으로 가른다.

사용자 결정(2026-10-21)은 `docs/ADR.md` ADR-037 끝의 「2026-10-21 확장 — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk 주제(phase 64)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23)로 승인한 것이다. 설계 승인본은 `phases/64-container-visuals/tools/design-spec.mjs`의 `diagrams['image-flow']`다.

**앵커는 `ecs-eks-fargate.container`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 63과 phase 64), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048, ADR-049**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/64-container-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/ecs-eks-fargate.json`: step 1이 만든 파일이다. 여기에 `diagrams["image-flow"]`를 더한다. **표 넷과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DelegatedAdminDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례(phase 63)
- `src/components/diagrams/ColumnarFormatDiagram.tsx`와 그 테스트: 경로가 없는 장면(`paths: []`)의 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `ecs-eks-fargate` 주제 가운데 `container`(step 0이 넣은 새 개념)와 `ecr-image-scan-on-push`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/ContainerImageDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["image-flow"]`
- 매핑: `registry.ts`에 `'ecs-eks-fargate.container': ContainerImageDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 위에 Dockerfile → 컨테이너 이미지를 가로로 두고, 이미지 아래에 Amazon ECR을, 그 아래에 서버 박스를 둔다. 서버 박스 안에는 `다른 컨테이너`와
`컨테이너`가 나란하고 그 밑에 `서버의 운영 체제`가 박스 폭으로 깔린다.

```
[Dockerfile] → [컨테이너 이미지]
                     ↓
                [Amazon ECR]
┌ 서버 ─────────────↓──────────┐
│ [다른 컨테이너]   [컨테이너]   │
│ [   서버의 운영 체제       ]   │
└──────────────────────────────┘
```

가로형은 Dockerfile → 이미지 → ECR을 위 줄에 왼쪽에서 오른쪽으로 두고, 서버 박스를 그 아래 오른쪽에 둔다. ECR에서 바로 아래의 `컨테이너`로 내려간다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을
`phases/64-container-visuals/tools/check-design.mjs`로 맞추고 미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 296`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `server` | 서버 | 4, 144, 272, 124 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `dockerfile` | Dockerfile | `stroke-disabled` | 12, 8, 104 |
| `image` | 컨테이너 이미지 | `stroke-disabled` | 152, 8, 116 |
| `registry` | Amazon ECR | `stroke-diagram-managed` | 152, 80, 116 |
| `other` | 다른 컨테이너 | `stroke-disabled` | 24, 168, 104 |
| `container` | 컨테이너 | `stroke-disabled` | 152, 168, 104 |
| `os` | 서버의 운영 체제 | `stroke-disabled` | 24, 224, 232 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `dockerfile-image` | Dockerfile에 적은 대로 빌드해 이미지를 만든다 | `M116 24 H152` |
| `image-registry` | 이미지를 레지스트리(ECR)에 올린다 | `M210 40 V80` |
| `registry-container` | 서버가 ECR에서 이미지를 내려받아 컨테이너로 실행한다 | `M204 112 V168` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `build` | 빌드 | 134, 52 | `middle` | `build` |
| `push` | 올린다 | 202, 64 | `end` | `build` |
| `pull` | 내려받아 실행 | 196, 132 | `end` | `run` |
| `shared-os` | 운영 체제 하나를 함께 쓴다 | 140, 284 | `middle` | `share` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **6줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **3줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 200`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `server` | 서버 | 152, 72, 284, 112 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `dockerfile` | 16, 8, 104 |
| `image` | 168, 8, 104 |
| `registry` | 320, 8, 104 |
| `other` | 168, 100, 104 |
| `container` | 320, 100, 104 |
| `os` | 168, 144, 256 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `dockerfile-image` | `M120 24 H168` |
| `image-registry` | `M272 24 H320` |
| `registry-container` | `M372 40 V100` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `build` | 빌드 | 144, 52 | `middle` |
| `push` | 올린다 | 296, 52 | `middle` |
| `pull` | 내려받아 실행 | 364, 60 | `end` |
| `shared-os` | 운영 체제 하나를 함께 쓴다 | 296, 196 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `build` | 만들어 올리기 | `dockerfile`, `image`, `registry` | `dockerfile-image`, `image-registry` | `build`, `push` | Dockerfile에 적은 대로 빌드하면 이미지가 생기고, 그 이미지를 레지스트리인 ECR에 올린다. | `ecs-eks-fargate.container` |
| `run` | 내려받아 실행 | `registry`, `container`, `os` | `registry-container` | `pull` | 서버가 ECR에서 이미지를 내려받아 실행한 것이 컨테이너다. ECR은 이미지를 보관만 한다. | `ecs-eks-fargate.container` |
| `share` | 한 서버 안에서 | `other`, `container`, `os` | 없음 | `shared-os` | 컨테이너는 운영 체제를 따로 담지 않고 서버의 운영 체제를 함께 쓴다. 그래서 가볍다. | `ecs-eks-fargate.container` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `컨테이너 이미지는 어디에서 만들어져 어디에서 실행될까?`
- `idleCaption`: `단계를 고르면 이미지가 만들어져 레지스트리에 오르고 서버에서 컨테이너로 실행되는 길을 볼 수 있다.`
- `legend`: `파랑: AWS의 레지스트리 · 회색: 파일과 컨테이너. 큰 박스가 서버 한 대다.`
- `label`: `컨테이너 이미지 흐름 도식`, `svgLabel`: `Dockerfile·컨테이너 이미지·Amazon ECR·서버의 컨테이너`
- 도식의 `sources`: `ecs-eks-fargate.container`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `ContainerImageDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 6개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. 노드 셋(`other`·`container`·`os`)은 두 배치 모두 `server` 박스 안이고, 나머지 셋(`dockerfile`·`image`·`registry`)은 박스와 겹치지 않는다.
7. `registry-container`는 두 배치 모두 `container` 상자의 변에서 끝난다. **`other`의 변에서 끝나는 경로는 어느 장면에도 없다.**
8. `share` 장면은 경로가 없고(`path` 요소 0개), 노드 셋(`other`·`container`·`os`)만 선명하다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `ecs-eks-fargate.container` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 200`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 200])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 303개·경로 240개, 가로 노드 303개·경로 240개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 6개·경로 3개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `ContainerImageDiagram.tsx`, `ContainerImageDiagram.test.tsx`, `ecs-eks-fargate.json`, `registry.ts`, `phases/64-container-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 1의 표가 그대로인가.
3. `phases/64-container-visuals/index.json`의 step 2을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`registry`에서 `other`로 가는 경로를 만들지 마라.** 이유: 「이미지 하나로 컨테이너를 여럿 띄운다」는 공식 문서에서 확인하지 못했다. 두 컨테이너를 같은 이미지에서 나온 것으로 그리면 근거 없는 사실이 된다(ADR-037 phase 64).
- **Docker Hub나 다른 레지스트리 노드를 더하지 마라.** 이유: 본문의 예는 Amazon ECR 하나다.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **초록·빨강·주황, 이모지, O/X를 쓰지 마라.** 이유: 정답/오답/중요도가 점유한 색이고(ADR-036), 판정은 곁말 글자로만 쓴다(ADR-037 phase 64).
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 1의 표를 고치지 마라.** 이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- **검사기(`check-path-crossings.mjs`·`phases/64-container-visuals/tools/`)를 고쳐서 통과시키지 마라.** 이유: 경로가 노드 상자를 뚫으면 통로를 옮겨야 한다.
- 기존 테스트를 깨뜨리지 마라.
