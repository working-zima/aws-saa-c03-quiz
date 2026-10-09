# Step 1: drift-scope-diagram

## 배경

`governance-iac.cloudformation-drift-detection` 개념은 드리프트 감지가 하는 일은 맞지만 **대상이 좁다**고 말한다. CloudFormation이
만들고 관리하는 리소스, 즉 스택에만 동작한다. 여러 팀이 각자 만든 리소스가 섞인 계정에서 계정 전체의 변경을 잡아야 한다면 스택 밖이
통째로 빠지고, 계정의 모든 지원 리소스를 대상으로 삼는 것은 AWS Config다. 문항 q301은 바로 이 자리에서 드리프트 감지를 오답으로 낸다.

이 step은 그 범위 차이를 도식 하나로 그린다. 계정 안을 `스택`과 `스택 밖`으로 나누고, 두 기능이 각각 어디까지 살피는지를 시나리오
버튼으로 바꿔 본다. 사용자 결정(2026-10-09)은 `docs/ADR.md` ADR-037 끝의 「2026-10-09 확장 — 거버넌스 주제(phase 48)」와 ADR-038
끝의 「2026-10-09 — phase 48」에 있다. **이 도식에는 물음형 제목을 단다**(ADR-038). 예시 값은 없다.

**앵커는 `governance-iac.cloudformation-drift-detection`이다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두), **ADR-038**(끝 문단 포함)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「물음형 제목과 예시」 포함)
- `phases/48-governance-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/governance-iac.json`: step 0이 만든 파일이다. 여기에 `diagrams["drift-scope"]`를 더한다.
- `src/components/diagrams/Route53HealthDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·시나리오 곁말을 쓰는 도식의 가장 최근 선례
- `src/components/diagrams/VpcScopeDiagram.tsx`: 라벨 붙은 그룹 박스(`const groups`)의 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `governance-iac` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/DriftScopeDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["drift-scope"]`
- 매핑: `registry.ts`에 `'governance-iac.cloudformation-drift-detection': DriftScopeDiagram` 한 줄을 더한다.

### 모양

맨 위에 템플릿, 가운데에 계정, 맨 아래에 살피는 기능 둘을 둔다. 계정 안은 왼쪽 열 `스택`, 오른쪽 열 `스택 밖`이다.

```
 [템플릿]
    ↓
┌ 한 계정 ───────────────────────────┐
│ ┌ 스택 ────────┐ ┌ 스택 밖 ───────┐ │
│ │ [리소스]     │ │ [팀 A의 리소스] │ │
│ │ [리소스]     │ │ [팀 B의 리소스] │ │
│ └──────────────┘ └───────────────┘ │
└────────────────────────────────────┘
 [드리프트 감지]      [AWS Config]
```

아래 좌표는 경계·라벨 폭·교차를 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.
`viewBox`는 `0 0 280 276`이다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `account` | 한 계정 | 4, 56, 272, 140 |
| `stack` | 스택 | 12, 80, 124, 108 |
| `outside` | 스택 밖 | 144, 80, 124, 108 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `template` | 템플릿 | `stroke-disabled` | 20, 8, 108 |
| `stack-a` | 리소스 | `stroke-diagram-resource` | 20, 102, 108 |
| `stack-b` | 리소스 | `stroke-diagram-resource` | 20, 146, 108 |
| `team-a` | 팀 A의 리소스 | `stroke-diagram-resource` | 152, 102, 108 |
| `team-b` | 팀 B의 리소스 | `stroke-diagram-resource` | 152, 146, 108 |
| `drift` | 드리프트 감지 | `stroke-diagram-managed` | 20, 236, 108 |
| `config` | AWS Config | `stroke-diagram-managed` | 152, 236, 108 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `template-stack` | 템플릿으로 배포한 것 | `M74 40 V102` |
| `drift-stack` | 드리프트 감지가 살피는 범위 | `M74 236 V188` (스택 박스 아래 변에서 끝난다) |
| `config-stack` | AWS Config가 살피는 범위 | `M180 236 V216 H104 V188` (계정 박스와 아래 줄 사이 통로 y 216) |
| `config-outside` | AWS Config가 살피는 범위 | `M206 236 V188` |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리 | 보이는 시나리오 |
|---|---|---|---|
| `not-seen` | 보지 못함 | `스택 밖` 그룹 라벨 줄의 오른쪽 끝(x 260, y 94, `textAnchor="end"`) | `drift` |
| `all-resources` | 모든 지원 리소스 | `한 계정` 그룹 라벨 줄의 오른쪽 끝(x 268, y 70, `textAnchor="end"`) | `config` |

### 시나리오 둘

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `drift` | 드리프트 감지 | `template`, `stack-a`, `stack-b`, `drift` | `template-stack`, `drift-stack` | `not-seen` | 스택으로 만든 리소스만 템플릿과 비교한다. 팀이 직접 만든 스택 밖 리소스는 빠진다. | `governance-iac.cloudformation-drift-detection`, `governance-iac.cloudformation` |
| `config` | AWS Config | `stack-a`, `stack-b`, `team-a`, `team-b`, `config` | `config-stack`, `config-outside` | `all-resources` | 스택 안팎을 가리지 않고 계정의 모든 지원 리소스에서 설정 변경을 기록한다. | `governance-iac.cloudformation-drift-detection`, `governance-iac.service-catalog` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 320px에서 두 줄이 되도록 50자 이하로 맞췄다.
- `question`: `설정이 바뀐 리소스를 어디까지 잡아낼까?`
- `idleCaption`: `기능을 고르면 설정이 바뀐 리소스를 어디까지 살피는지 볼 수 있다.`
- `legend`: `파랑: 설정 변경을 살피는 기능 · 청록: 계정의 리소스 · 회색: 템플릿 파일. 위 화살표는 템플릿으로 배포한 것, 아래 화살표는 살피는 범위다.`
- `label`: `드리프트 감지와 AWS Config 범위 도식`, `svgLabel`: `드리프트 감지와 AWS Config가 살피는 범위`
- 도식의 `sources`: `governance-iac.cloudformation`, `governance-iac.cloudformation-drift-detection`, `governance-iac.service-catalog`

### 테스트: `DriftScopeDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 일곱이 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
4. `drift`에서 `team-a`·`team-b`·`config`의 opacity가 `0.25`다. `config`에서 `template`·`drift`의 opacity가 `0.25`다.
   그룹 박스 셋은 어느 시나리오에서도 흐려지지 않는다.
5. `drift-stack`은 `drift`에서만, `config-stack`·`config-outside`는 `config`에서만 보인다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 둘과 그룹 라벨 셋은 `estimateTextWidth(문구, 9)`로 잰 가로 범위가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `governance-iac.cloudformation-drift-detection` 개념을 주면 본문 뒤에 이 도식이 온다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·step 0의 표가 그대로인가.
3. `phases/48-governance-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수), 새 테스트 수와 전체
     테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **드리프트 감지나 Config가 리소스를 살피는 방식(주기·규칙·자동 수정)을 쓰지 마라.** 이유: 이 주제의 데이터에 없다(ADR-037 phase 48 확장).
- **스택 리소스에 EC2·S3 같은 구체적 서비스 이름을 붙이지 마라.** 이유: 본문이 스택의 리소스를 특정하지 않는다. 예시는 본문에 있는
  것만 쓴다(ADR-038).
- **세 번째 시나리오(예: 스택 리소스가 바뀐 상태, Service Catalog)를 더하지 마라.** 이유: 사용자가 승인한 시나리오는 둘이다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·step 0의 표를 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
