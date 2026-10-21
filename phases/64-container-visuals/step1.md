# Step 1: container-tables

## 배경

`ecs-eks-fargate` 주제(step 0 뒤 개념 26개)에 시각 자료를 들인다. 이 step은 이 주제의 시각 자료 JSON 파일과 비교표 넷을 만든다. 도식 여덟 장은 step 2~9가 더한다.

- **오케스트레이션 서비스와 컨테이너를 올리는 곳**: ECS·EKS 두 행에 EC2·Fargate 두 열. 주제 둘째 개념(step 0이 넣은 `container-orchestration`)에 붙어 읽기 전 지도가 된다.
- **경로별로 나눠 보낼 때 견주는 구성**: Ingress와 ALB, NLB와 인그레스 게이트웨이, API Gateway.
- **AWS 밖의 쿠버네티스 클러스터를 다룰 때 견주는 것**: EKS Connector, EKS Anywhere, 마이그레이션, 모니터링 도구.
- **컨테이너와 함께 비교되는 실행 방식**: Lambda, Fargate, EC2 기반 ECS, Elastic Beanstalk, Batch, App2Container. 주제 마지막 개념에 붙는다.

이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-10-21)은 `docs/ADR.md` ADR-037 끝의 「2026-10-21 확장 — ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk 주제(phase 64)」에 있다.
표의 문구와 열 폭은 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23)로 승인한 것이다. 설계 승인본은 `phases/64-container-visuals/tools/design-spec.mjs`의 `tables`다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 63과 phase 64), **ADR-049**
- `docs/UI_GUIDE.md`의 **「비교표」**. 특히 끊을 수 없는 영문 이름과 긴 한글 낱말의 열 폭 규칙
- `phases/64-container-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`: `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts`: `visualsByTopicId`
- `src/data/visuals/iam-permissions.json`: 주제 JSON 파일의 최근 선례
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/iamTables.tsx`, `src/components/diagrams/iamTables.test.tsx`: 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 `ecs-eks-fargate` 주제 개념 전부(26개)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/ecs-eks-fargate.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`에 이 파일의 import(`ecsEksFargateVisuals`)와 `visualsByTopicId['ecs-eks-fargate']` 키를 더한다. 기존 import·키의 정렬 방식(알파벳순)을
  따른다. 이 키는 `backup-disaster-recovery`와 `emr-glue-athena` 사이다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 2~9가 채운다.

### 2. JSON `tables["orchestration-compute"]`

- 앵커: `ecs-eks-fargate.container-orchestration`. 앵커(주제 둘째 개념)가 `파드`·`노드`를 정의하는 `eks`보다 앞이라 칸에 그 말을 쓰지 않는다. 문항 q084(EC2 기반 vs Fargate 기반)·q512(EKS에서 인스턴스를 다루지 않는 방식)를 가른다.
- 컴포넌트: `OrchestrationComputeTable`
- `label`: `오케스트레이션 서비스와 컨테이너를 올리는 곳`
- `columns`: `["서비스","EC2 인스턴스에 올리면","Fargate에 올리면"]`
- `columnWidths`: `["20%","40%","40%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 48.6 / 106.2 / 106.2px이다. 가장 긴 덩어리 `프로비저닝하지`(Windows Chrome 한글 14px로 98px)가 40% 열에 들어간다. 폭은 phase 59·62·63의 Windows Chrome 실측 글자 폭으로 어림했고, 실측은 phase 마무리에서 한다.
- `sources`: `ecs-eks-fargate.container-orchestration`, `ecs-eks-fargate.ecs`, `ecs-eks-fargate.fargate`, `ecs-eks-fargate.eks`, `ecs-eks-fargate.eks-compute-options`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 가운뎃점도 그대로다.

| 서비스 | EC2 인스턴스에 올리면 | Fargate에 올리면 |
|---|---|---|
| ECS | 사용자가 EC2 인스턴스를 직접 관리한다. 구성을 조정할 수 있는 대신 운영 부담이 크다 | 서버 관리와 확장·축소를 AWS가 맡는다 |
| EKS | EC2 인스턴스의 패치와 관리가 사용자 몫이다. 관리를 거드는 방식을 써도 그대로다 | 인스턴스도 클러스터 용량도 프로비저닝하지 않는다 |

근거: ECS·EC2 — `ecs` p0 / ECS·Fargate — `ecs` p1, `fargate` p0 / EKS·EC2 — `eks` p3, `eks-compute-options` p0 / EKS·Fargate — `eks-compute-options` p1. 「서비스」 열의 ECS·EKS가 오케스트레이션 서비스라는 것 — `container-orchestration` p2

### 3. JSON `tables["eks-routing"]`

- 앵커: `ecs-eks-fargate.eks-aws-load-balancer-controller`. 문항 q518의 보기(NLB + 인그레스 게이트웨이, Ingress + ALB, API Gateway)를 가른다.
- 컴포넌트: `EksRoutingTable`
- `label`: `경로별로 나눠 보낼 때 견주는 구성`
- `columns`: `["구성","하는 일","비용과 운영"]`
- `columnWidths`: `["30%","38%","32%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 77.4 / 100.4 / 83.2px이다. 행 머리의 `게이트웨이`(70px)가 30% 열에, 둘째 열의 `스로틀링이나`(84px)가 38% 열에 들어간다. `스로틀링·사용량`처럼 가운뎃점으로 붙인 덩어리는 끊기므로 쓰지 않았다. 폭은 phase 59·62·63의 Windows Chrome 실측 글자 폭으로 어림했고, 실측은 phase 마무리에서 한다.
- `sources`: `ecs-eks-fargate.eks-aws-load-balancer-controller`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 가운뎃점도 그대로다.

| 구성 | 하는 일 | 비용과 운영 |
|---|---|---|
| Ingress와 ALB | 컨트롤러가 Ingress를 읽어 ALB를 만들고, ALB가 7계층에서 경로별로 나눈다 | 클러스터 안에 라우팅 계층을 더 세우지 않는다 |
| NLB와 인그레스 게이트웨이 | NLB는 4계층이라 경로를 보지 못해 게이트웨이를 따로 붙인다 | 비용과 운영이 함께 늘어난다 |
| API Gateway | 스로틀링이나 사용량 계획 같은 API 관리 기능을 더한다 | 단순한 경로 분기에는 요청당 비용과 구성이 더 붙는다 |

근거: Ingress와 ALB — `eks-aws-load-balancer-controller` p0 / NLB와 인그레스 게이트웨이 — 같은 개념 p1 / API Gateway — 같은 개념 p1

### 4. JSON `tables["eks-hybrid"]`

- 앵커: `ecs-eks-fargate.eks-anywhere`. 문항 q519·q520은 서로의 정답을 오답으로 쓴다. 네 행이 두 문항의 보기를 모두 덮는다.
- 컴포넌트: `EksHybridTable`
- `label`: `AWS 밖의 쿠버네티스 클러스터를 다룰 때 견주는 것`
- `columns`: `["방법","기존 클러스터","하는 일"]`
- `columnWidths`: `["34%","24%","42%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 88.9 / 60.1 / 112px이다. 행 머리의 `마이그레이션`(84px)이 34% 열에, 열 머리 `기존 클러스터`의 `클러스터`(56px)가 24% 열에 들어간다. 폭은 phase 59·62·63의 Windows Chrome 실측 글자 폭으로 어림했고, 실측은 phase 마무리에서 한다.
- `sources`: `ecs-eks-fargate.eks`, `ecs-eks-fargate.eks-connector`, `ecs-eks-fargate.eks-anywhere`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 가운뎃점도 그대로다.

| 방법 | 기존 클러스터 | 하는 일 |
|---|---|---|
| EKS Connector | 그대로 둔다 | 외부 클러스터를 AWS에 등록해 EKS 콘솔에서 함께 보이게 한다 |
| EKS Anywhere | 데이터 센터에 새로 세운다 | 자기 데이터 센터에서 쿠버네티스를 운영한다. 흩어진 클러스터를 모아 보는 수단은 아니다 |
| EKS로 마이그레이션 | AWS로 옮긴다 | 코드와 배포 프로세스를 그대로 쓰며 EKS에서 운영한다 |
| 모니터링 도구 | 그대로 둔다 | 지표와 로그로 클러스터의 상태를 보여 준다. 클러스터 목록은 모으지 않는다 |

근거: EKS Connector — `eks-connector` p0·p1 / EKS Anywhere — `eks-anywhere` p0·p1, 「새로 세운다」는 `eks-connector` p1의 「다시 만들지 않고」의 반대편 / EKS로 마이그레이션 — `eks` p0, `eks-connector` p1 / 모니터링 도구 — `eks-connector` p1

### 5. JSON `tables["compute-choice"]`

- 앵커: `ecs-eks-fargate.app2container`. 주제 마지막 개념에 두어 다 읽은 뒤의 정리로 쓴다. 문항 q196·q201·q510·q511·q515·q526을 가른다.
- 컴포넌트: `ComputeChoiceTable`
- `label`: `컨테이너와 함께 비교되는 실행 방식`
- `columns`: `["서비스","서버 관리","맞는 작업"]`
- `columnWidths`: `["38%","24%","38%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 100.4 / 60.1 / 100.4px이다. 끊을 수 없는 행 머리 `App2Container`(굵기 500)가 38% 열에, 셋째 열의 `애플리케이션을`(98px)이 38% 열에 들어간다. Batch 행의 둘째 칸은 `Fargate로`가 24% 열에서 끊기지 않도록 `Fargate 환경이면`으로 썼다. 폭은 phase 59·62·63의 Windows Chrome 실측 글자 폭으로 어림했고, 실측은 phase 마무리에서 한다.
- `sources`: `ecs-eks-fargate.fargate`, `ecs-eks-fargate.fargate-no-time-limit`, `ecs-eks-fargate.fargate-per-second-billing`, `ecs-eks-fargate.ecs`, `ecs-eks-fargate.elastic-beanstalk`, `ecs-eks-fargate.aws-batch`, `ecs-eks-fargate.batch-fargate-compute-environment`, `ecs-eks-fargate.app2container`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 가운뎃점도 그대로다.

| 서비스 | 서버 관리 | 맞는 작업 |
|---|---|---|
| AWS Lambda | 없다 | 15분 안에 끝나는 짧은 작업. 수십 초짜리는 Fargate보다 싸다 |
| AWS Fargate | 없다 | 15분을 넘기는 컨테이너 작업. 실행 시간 제한이 없고 최소 1분이 과금된다 |
| EC2 기반 ECS | 사용자가 EC2를 관리한다 | 구성을 직접 조정해야 하는 컨테이너 작업 |
| AWS Elastic Beanstalk | 줄지만 EC2가 남는다 | 함수 단위로 쪼갤 수 없는 애플리케이션을 코드 그대로 올릴 때 |
| AWS Batch | Fargate 환경이면 없다 | 여러 작업을 모아 처리하는 배치. 순서대로 잇는 워크플로는 Step Functions 몫이다 |
| AWS App2Container | 실행 환경이 아니다 | 기존 Java·.NET 애플리케이션을 컨테이너 이미지로 바꿀 때 |

근거: AWS Lambda — `fargate` p1, `fargate-per-second-billing` p1 / AWS Fargate — `fargate` p1, `fargate-no-time-limit`, `fargate-per-second-billing` p0 / EC2 기반 ECS — `ecs` p0 / AWS Elastic Beanstalk — `elastic-beanstalk` p0~p2 / AWS Batch — `aws-batch` p0, `batch-fargate-compute-environment` p0 / AWS App2Container — `app2container` p0·p1

### 6. 래퍼와 매핑

- `src/components/diagrams/containerTables.tsx`에 `OrchestrationComputeTable`·`EksRoutingTable`·`EksHybridTable`·`ComputeChoiceTable`을 둔다. `iamTables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`에 네 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따르고, 키는 기존 키들 **뒤에 이 주제의 줄을 모아** 둔다.
- step 2~9가 도식 줄을 개념 순서대로 이 사이와 앞뒤에 끼운다. phase가 끝났을 때 이 주제의 줄은 아래 순서다.

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

### 7. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/containerTables.test.tsx`:

1. `visualsByTopicId['ecs-eks-fargate']`가 있고 `glossary`는 빈 배열이다. `diagrams`의 내용은 단언하지 마라 — step 2~9가 도식을 더하면 깨진다.
2. 네 표 각각의 `label`·`columns`·`columnWidths`·`sources`가 위와 같고, 행 머리가 위 순서와 같으며 칸 문구가 위 표와 같다.
3. 네 표 어디에도 `가능`·`불가` 칸이 없고, `O`·`X`·`○`·`×` 한 글자짜리 판정이 없다.
4. `orchestration-compute`의 어느 칸에도 `파드`·`노드`가 없다(앵커가 그 말을 정의하는 개념보다 앞이다). `compute-choice`의 어느 칸에도 `Fargate로`가 없다.
5. 렌더된 `colgroup`의 폭이 각 표의 `columnWidths`와 같다.
6. `ConceptList`에 각 앵커 개념(`ecs-eks-fargate.container-orchestration`·`ecs-eks-fargate.eks-aws-load-balancer-controller`·`ecs-eks-fargate.eks-anywhere`·
   `ecs-eks-fargate.app2container`)을 주면 본문 뒤에 그 표가 `figure` 하나로 오고, 그 접근성 이름이 `label`과 같다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 297개·경로 237개, 가로 노드 297개·경로 237개'
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 칸에 위 표 밖의 사실이 없는가.
   - 판정에 색·이모지·O/X가 없는가.
   - `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`topics.json`·`questions.json`·다른 주제의 visuals JSON이 그대로인가.
   - 기존 테스트를 고치지 않았는가.
3. `phases/64-container-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 표 id 넷과 앵커, 래퍼 이름, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`columnWidths`를 바꾸거나 칸 문구를 다듬지 마라.** 이유: 320px에서 영문 이름과 긴 한글 낱말이 끊기지 않는 폭과 문구로 정했다. 문구를 바꾸면 줄바꿈이 달라진다.
- **`orchestration-compute`에 `파드`·`노드`나 ECS와 EKS를 고르는 기준을 넣지 마라.** 이유: 앵커가 그 말을 정의하는 `eks`보다 앞이고, 기준은 `eks` 본문이 말한다(ADR-037 phase 64).
- **`HPA`·`ENI` 같은 데이터에 풀이가 없는 약어를 쓰지 마라.** 이유: 본문의 말과 표의 말이 같아야 한다.
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: 약어 툴팁은 VPC 주제에만 둔다(ADR-037).
- **도식을 만들지 마라.** 이유: step 2~9의 범위다.
- 기존 테스트를 깨뜨리지 마라.
