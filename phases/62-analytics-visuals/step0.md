# Step 0: analytics-tables

## 배경

`emr-glue-athena` 주제(개념 20개)는 서비스 일곱 — EMR·Spark·Glue·Glue Crawler·Glue DataBrew·Athena·Lake Formation — 을 다룬다. 기초 문항
q123·q124·q125·q127·q222·q619는 모두 "다른 서비스가 하는 일"을 오답으로 내는데, 문단으로 읽으면 일곱의 맡는 일이 여러 개념에 흩어져 한눈에 견주어지지
않는다. 또 `log-storage-s3-athena`는 로그를 둘 곳 셋(S3와 Athena, OpenSearch, CloudWatch Logs)을 조회 빈도로 가른다(q626).

이 step은 둘을 비교표 둘로 옮기고, 이 주제의 시각 자료 JSON 파일을 만든다. 이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-10-19)은
`docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — EMR·Glue·Athena·Lake Formation 주제(phase 62)」에 있다. 도식 다섯 장은 step 1~5가 더한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 59와 phase 62)
- `docs/UI_GUIDE.md`의 **「비교표」**. 특히 끊을 수 없는 영문 이름과 긴 한글 낱말의 열 폭 규칙
- `src/types/visuals.ts`: `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts`: `visualsByTopicId`
- `src/data/visuals/api-gateway-step-functions.json`: 주제 JSON 파일의 최근 선례. **`tables["api-types"]`가 열 셋(30/35/35%)짜리 표의 선례**, `tables["access-control"]`이 열 둘짜리 표의 선례다.
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/apiGatewayTables.tsx`, `src/components/diagrams/apiGatewayTables.test.tsx`: 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 `emr-glue-athena` 주제 개념 전부(20개)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/emr-glue-athena.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`에 이 파일의 import(`emrGlueAthenaVisuals`)와 `visualsByTopicId['emr-glue-athena']` 키를 더한다. 기존 import·키의 정렬 방식(알파벳순)을
  따른다. 이 키는 `backup-disaster-recovery`와 `governance-iac` 사이다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 1~5가 채운다.

### 2. 표 하나: JSON `tables["service-roles"]`

- `label`: `분석 서비스가 맡는 일`
- `columns`: `["서비스","고를 때","고르지 않을 때"]`
- `columnWidths`: `["30%","35%","35%"]`. **이 값을 바꾸지 마라.** 320px에서 표 폭은 288px이고 칸마다 9px이 빠져, 열 안쪽 폭이
  77.4 / 91.8 / 91.8px이다. Windows Chrome에서 한글은 한 글자 14px이라 칸 문구의 가장 긴 덩어리(`웨어하우스에` 84px)가 35% 열에 들어간다. 행 머리의
  가장 긴 영문 낱말 `Formation`·`DataBrew`(굵기 500)는 30% 열 안쪽 폭보다 짧다고 어림했다. 실측은 phase 끝에 한다(UI_GUIDE 「비교표」).
- `sources`: `emr-glue-athena.emr`, `emr-glue-athena.spark`, `emr-glue-athena.glue`, `emr-glue-athena.glue-crawler`, `emr-glue-athena.glue-databrew`, `emr-glue-athena.glue-etl-with-per-customer-kms-key`, `emr-glue-athena.athena`, `emr-glue-athena.athena-encrypted-and-pay-per-query`, `emr-glue-athena.athena-federated-query`, `emr-glue-athena.lake-formation`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 쉼표도 그대로다.
  `추출, 변환, 적재를`을 가운뎃점으로 잇지 않은 것은 가운뎃점이 줄바꿈 기회가 아니어서 한 덩어리가 칸보다 길어지기 때문이다.

| 행 머리 | 고를 때 | 고르지 않을 때 |
|---|---|---|
| EMR | 대량의 데이터를 처리할 컴퓨팅이 필요할 때 | 가끔 실행하는 조회나, 운영 부담이 작아야 하는 ETL일 때 |
| Spark | 여러 서버가 대량의 데이터를 나누어 처리할 때 | 실시간 분석이 필요할 때 |
| Glue | 추출, 변환, 적재를 관리형 서비스에 맡길 때 | 데이터를 직접 분석해야 할 때 |
| Glue Crawler | S3에 막 들어온 데이터를 바로 쿼리할 수 있게 준비할 때 | 데이터의 형태를 바꾸는 ETL 작업일 때 |
| Glue DataBrew | 분석 전에 값을 정리하고 형태를 고르게 맞출 때 | 누가 어느 행을 볼지 접근을 나눌 때 |
| Athena | S3에 둔 데이터를 옮기지 않고 SQL로 조회할 때 | 데이터 웨어하우스에 정기적으로 대량 적재할 때 |
| Lake Formation | 데이터 레이크의 접근 권한을 행·열 수준까지 나눌 때 | 분석 전에 값을 정리하고 다듬을 때 |

근거: EMR — `emr` p0, `athena-encrypted-and-pay-per-query` p0, `glue-etl-with-per-customer-kms-key` p1·p2 / Spark — `spark` p0·p1 / Glue — `glue` summary·p0,
`glue-etl-with-per-customer-kms-key` p1 / Glue Crawler — `glue-crawler` summary·p0 / Glue DataBrew — `glue-databrew` p0·p1 / Athena — `athena` p0,
`athena-federated-query` p1 / Lake Formation — `lake-formation` summary·p1, `glue-databrew` p1

### 3. 표 둘: JSON `tables["log-storage"]`

- `label`: `조회 빈도로 고르는 로그 저장 위치`
- `columns`: `["저장 위치","맞는 쓰임"]`
- `columnWidths`: `["34%","66%"]`. **이 값을 바꾸지 마라.** 행 머리 `CloudWatch`(굵기 500)가 320px에서 30% 열(77.4px)에 들어간다고 장담할 수
  없어 34%(88.9px)로 둔다(ADR-037 phase 62). CloudWatch Logs의 비용은 본문에 없으므로 「비용」 열을 따로 두지 않고, 칸마다 맞는 쓰임과 그 쓰임의 조건을
  문장 둘로 쓴다.
- `sources`: `emr-glue-athena.log-storage-s3-athena`, `emr-glue-athena.athena-encrypted-and-pay-per-query`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다.

| 행 머리 | 맞는 쓰임 |
|---|---|
| S3와 Athena | 오래 보관하면서 가끔만 조회할 때. 저장은 객체 스토리지 값이고 조회는 실행한 만큼만 내서 가장 싸다. |
| OpenSearch | 검색이 잦고 응답이 빨라야 할 때. 클러스터를 띄워 두는 비용이 계속 붙는다. |
| CloudWatch Logs | 지금 벌어지는 일을 실시간으로 볼 때. 대용량 장기 보관과 분석에는 맞지 않는다. |

근거: `log-storage-s3-athena` summary·p0·p1, `athena-encrypted-and-pay-per-query` p0

### 4. 래퍼와 매핑

- `src/components/diagrams/analyticsTables.tsx`에 `AnalyticsServiceTable`과 `LogStorageTable`을 둔다. `apiGatewayTables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`에 두 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따르고, 키는 기존 키들 **뒤에 이 주제의 줄을 모아** 둔다.
  - `'emr-glue-athena.emr': AnalyticsServiceTable` — 주제 첫 개념이라 표가 읽기 전의 지도 노릇을 한다(phase 59의 `api-types`와 같은 자리).
  - `'emr-glue-athena.log-storage-s3-athena': LogStorageTable`
- step 1~5가 도식 줄을 개념 순서대로 이 사이와 뒤에 끼운다. phase가 끝났을 때 이 주제의 줄은 아래 순서다.

```ts
  'emr-glue-athena.emr': AnalyticsServiceTable, // step 0
  'emr-glue-athena.emr-managed-scaling': EmrClusterCostDiagram, // step 1
  'emr-glue-athena.emr-node-instance-family-choice': EmrNodeRolesDiagram, // step 2
  'emr-glue-athena.emr-security-configuration': EmrRuntimeRoleDiagram, // step 3
  'emr-glue-athena.log-storage-s3-athena': LogStorageTable, // step 0
  'emr-glue-athena.lake-formation-lf-tags': LakePermissionsDiagram, // step 4
  'emr-glue-athena.parquet-columnar-format': ColumnarFormatDiagram, // step 5
```

### 5. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/analyticsTables.test.tsx`:

1. `visualsByTopicId['emr-glue-athena']`가 있고 `glossary`는 빈 배열이다. `diagrams`의 내용은 단언하지 마라 — step 1~5가 도식을 더하면 깨진다.
2. `tables['service-roles']`의 `label`·`columns`·`columnWidths`·`sources`가 위와 같고, 행 머리 일곱이 위 순서와 같으며 칸 문구가 위 표와 같다.
3. `tables['log-storage']`의 `label`·`columns`·`columnWidths`·`sources`가 위와 같고, 행 머리 셋이 위 순서와 같으며 칸 문구가 위 표와 같다.
4. 두 표의 어느 칸에도 `O`·`X`·`○`·`×` 한 글자짜리 판정과 `가능`·`불가`가 없다.
5. 렌더된 `colgroup`의 폭이 각각 `["30%","35%","35%"]`, `["34%","66%"]`다.
6. `ConceptList`에 `emr-glue-athena.emr` 개념을 주면 본문 뒤에 `service-roles` 표가 `figure` 하나로 오고, 그 접근성 이름이 `label`과 같다.
   `emr-glue-athena.log-storage-s3-athena` 개념도 같은 방식으로 `log-storage` 표가 온다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 208개·경로 177개'
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 칸에 위 표 밖의 사실이 없는가.
   - 판정에 색·이모지·O/X가 없는가.
   - `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`topics.json`·`questions.json`·다른 주제의 visuals JSON이 그대로인가.
   - 기존 테스트를 고치지 않았는가.
3. `phases/62-analytics-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 표 id 둘과 앵커, 래퍼 이름, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`columnWidths`를 바꾸거나 칸 문구를 다듬지 마라.** 이유: 320px에서 영문 이름과 긴 한글 낱말이 끊기지 않는 폭과 문구로 정했다. 문구를 바꾸면
  줄바꿈이 달라진다.
- **요금 단위·가격, Glue Data Catalog, Crawler가 결과를 적는 곳, EMR의 배포 방식(EKS·Serverless 등)을 쓰지 마라.** 이유: 데이터에 없다(ADR-037 phase 62).
- **로그 표에 EMR 행이나 「비용」 열을 더하지 마라.** 이유: 본문 `log-storage-s3-athena`는 저장 위치 셋만 가르고, CloudWatch Logs의 비용은 말하지 않는다.
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: 약어 툴팁은 VPC 주제에만 둔다(ADR-037).
- **도식을 만들지 마라.** 이유: step 1~5의 범위다.
- 기존 테스트를 깨뜨리지 마라.
