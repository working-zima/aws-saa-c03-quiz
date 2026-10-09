# Step 0: tool-table

## 배경

`governance-iac` 주제(CloudFormation·Service Catalog·Control Tower·RAM)는 개념 일곱 개가 모두 "이 도구는 무엇을 하고, 무엇과
헷갈리는가"를 말한다. 문항도 그 짝을 오답으로 낸다(CloudFormation과 Organizations, 드리프트 감지와 AWS Config, Service Catalog와
AWS Config, 사전 예방적 제어와 탐지 제어, RAM과 사용자 인증, Workload Discovery와 X-Ray). 문단으로 읽으면 일곱 개의 짝이 한눈에
대조되지 않는다.

이 step은 그 일곱 개를 비교표 하나로 옮긴다. 이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-10-09)은 `docs/ADR.md`
ADR-037 끝의 「2026-10-09 확장 — 거버넌스 주제(phase 48)」에 있다.

**앵커는 `governance-iac.cloudformation`이다.** 주제의 맨 앞 개념이라, 표가 읽기 전의 지도 노릇을 한다(사용자 결정). 이 개념에는 기존
도식이 없으므로 registry 값은 표 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두)
- `docs/UI_GUIDE.md`의 **「도식」 중 「비교표」**. 특히 끊을 수 없는 영문 이름의 열 폭 규칙
- `src/types/visuals.ts`: `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts`: `visualsByTopicId`
- `src/data/visuals/route53.json`: 주제 JSON 파일의 가장 최근 선례
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/route53Tables.tsx`, `src/components/diagrams/route53Tables.test.tsx`: 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 `governance-iac` 주제 개념 전부(일곱 개)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/governance-iac.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`의 `visualsByTopicId`에 `'governance-iac'` 키를 더한다. 기존 import·키의 정렬 방식(알파벳순)을 따른다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 1·2가 채운다.

### 2. 표: JSON `tables["tool-choice"]`

- `label`: `도구별 고를 때와 헷갈리는 짝`
- `columns`: `["도구", "고를 때", "헷갈리는 짝"]`
- `columnWidths`: `["41%", "24%", "35%"]`. **이 값을 바꾸지 마라.** 320px에서 표 폭은 288px이고 칸마다 9px이 빠진다.
  배포 사이트 Chrome 실측으로 `CloudFormation`(행 머리 굵기 500)은 105.7px, `Organizations`는 89.4px다. 41%·35%보다 좁히면
  320px에서 이 두 단어가 중간에서 끊긴다(40%·34%에서 실제로 끊겼다). UI_GUIDE 「비교표」.
- `sources`: `governance-iac.cloudformation`, `governance-iac.cloudformation-drift-detection`, `governance-iac.service-catalog`,
  `governance-iac.control-tower-landing-zone`, `governance-iac.control-tower-controls`, `governance-iac.resource-access-manager`,
  `governance-iac.workload-discovery`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009).
  띄어쓰기와 가운뎃점(`·`)도 그대로다. 영문 이름의 자리(칸 끝, `X-Ray`만 칸 첫머리)는 320px 줄바꿈을 재고 정한 것이다.

| 행 머리 | 고를 때 | 헷갈리는 짝 | 근거 개념 |
|---|---|---|---|
| CloudFormation | 인프라를 반복해 같게 만들 때 | 계정 관리는 Organizations | `cloudformation` summary·p0·p1 |
| CloudFormation 드리프트 감지 | 템플릿과 달라졌는지 볼 때 | 스택 밖까지는 AWS Config | `cloudformation-drift-detection` summary·p0·p1 |
| Service Catalog | 허용된 구성만 배포하게 할 때 | 변경 추적·감사는 AWS Config | `service-catalog` p0·p1 |
| Control Tower 랜딩 존 | 계정마다 같은 통제·로깅을 걸 때 | 계정마다 따로 두는 사용자·역할 | `control-tower-landing-zone` summary·p0·p1 |
| Control Tower 사전 예방적 제어 | 위반 배포를 막을 때 | 만든 뒤 찾아 보고하는 탐지 제어 | `control-tower-controls` summary·p0·p1 |
| RAM | 다른 계정과 리소스를 공유할 때 | 사용자 인증은 못 한다 | `resource-access-manager` summary·p0·p1 |
| Workload Discovery | 리소스 관계를 그림으로 볼 때 | X-Ray는 요청 경로만 좇는다 | `workload-discovery` summary·p0·p1 |

### 3. 래퍼와 매핑

- `src/components/diagrams/governanceTables.tsx`에 `GovernanceToolTable`을 둔다. `route53Tables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`에 `'governance-iac.cloudformation': GovernanceToolTable` 한 줄을 더한다. import와 키는 기존 정렬 방식을 따른다.

### 4. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/governanceTables.test.tsx`:

1. `visualsByTopicId['governance-iac'].tables['tool-choice']`가 있다. `label`·`columns`·`columnWidths`·`sources`가 위와 같고,
   `glossary`는 빈 배열이다.
2. 행 머리 일곱이 위 표의 순서와 같고, 칸 문구가 위 표와 같다.
3. 어느 칸에도 `O`·`X`·`○`·`×` 한 글자짜리 판정과 `가능`·`불가`가 없다.
4. 렌더된 `colgroup`의 폭이 `["41%", "24%", "35%"]`다.
5. `ConceptList`에 `governance-iac.cloudformation` 개념을 주면 본문 뒤에 이 표가 `figure` 하나로 오고, 그 `figure`의 접근성 이름이
   `label`과 같다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 칸에 위 표 밖의 사실이 없는가.
   - 판정에 색·이모지·O/X가 없는가.
   - `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`topics.json`·`questions.json`이 그대로인가.
   - 기존 테스트를 고치지 않았는가.
3. `phases/48-governance-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 표 id와 앵커, 래퍼 이름, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **`columnWidths`를 바꾸거나 칸 문구를 다듬지 마라.** 이유: 320px에서 영문 이름이 끊기지 않는 폭과 문구를 실측해 정했다. 문구를
  바꾸면 줄바꿈이 달라진다.
- **Service Catalog와 CloudFormation을 잇는 문구(제품이 템플릿으로 만들어진다 등), Control Tower의 공유 계정(로그 아카이브·감사),
  Account Factory, RAM의 공유 범위를 쓰지 마라.** 이유: 데이터에 없다(ADR-037 phase 48 확장).
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: 약어 툴팁은 VPC 주제에만 둔다(ADR-037).
- **도식을 만들지 마라.** 이유: step 1·2의 범위다.
- 기존 테스트를 깨뜨리지 마라.
