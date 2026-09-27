# Step 0: policy-table

## 배경

`route53` 주제의 `routing-policies` 개념은 라우팅 정책 일곱 가지를 한 문단에 늘어놓는다. 페일오버 정책은 따로 떨어진
`route53-failover-routing` 개념에 있다. 문항은 "이 요구에 맞는 정책은?"을 묻는데, 문단으로는 정책마다 **무엇을 보고 응답을
고르는지**가 한눈에 대조되지 않는다.

이 step은 정책 여덟 가지를 비교표 하나로 옮긴다. 이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-09-27)은
`docs/ADR.md` ADR-037 끝의 「2026-09-27 확장 — Route 53 주제(phase 43)」에 기록돼 있다.

**앵커는 `route53.routing-policies`다.** 정책 이름이 처음 모두 나오는 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은
표 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두)
- `docs/UI_GUIDE.md`의 **「도식」 중 「비교표」**
- `src/types/visuals.ts`: `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts`: `visualsByTopicId`
- `src/data/visuals/security-groups-nacl.json`: 주제 JSON 파일의 선례
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/sgNaclTables.tsx`, `src/components/diagrams/sgNaclTables.test.tsx`: 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 `route53` 주제 개념 전부

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/route53.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`의 `visualsByTopicId`에 `'route53'` 키를 더한다. 기존 import·키의 정렬 방식을 따른다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 1~3이 채운다.

### 2. 표: JSON `tables["routing-policies"]`

- `label`: `Route 53 라우팅 정책 비교`
- `columns`: `["정책", "응답을 고르는 기준"]`. 두 열짜리 표다. `ComparisonTableFigure`가 두 열을 그대로 그리는지 먼저 확인한다.
  고쳐야만 된다면 고치지 말고 `blocked`로 멈춘다.
- `columnWidths`: `["30%", "70%"]`
- `sources`: `route53.routing-policies`, `route53.route53-failover-routing`, `route53.multivalue-answer-details`,
  `route53.multi-region-failover-for-region-outage`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009).

| 행 머리 | 응답을 고르는 기준 | 근거 개념 |
|---|---|---|
| 단순 | 리소스 하나 · 상태 검사로 거르지 않음 | `routing-policies` p0, `multivalue-answer-details` p1, `multi-region-failover-for-region-outage` p1 |
| 페일오버 | 주 대상 · 비정상이면 보조 대상 | `route53-failover-routing` p0·p1 |
| 지리적 위치 | 사용자의 국가 | `routing-policies` p0 |
| 지리적 근접 | 사용자와 리소스 사이의 거리 | 같음 |
| 지연 시간 | 지연이 가장 짧은 리전 | 같음 |
| 가중치 | 미리 정한 가중치 | 같음 |
| 다중값 응답 | 정상 레코드 최대 8개를 무작위로 · 위치는 보지 않음 | `routing-policies` p0, `multivalue-answer-details` summary·p1 |
| IP 기반 | 클라이언트 IP가 속한 CIDR 범위 | `routing-policies` p0 |

### 3. 래퍼와 매핑

- `src/components/diagrams/route53Tables.tsx`에 `Route53PolicyTable`을 둔다. `sgNaclTables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`에 `'route53.routing-policies': Route53PolicyTable` 한 줄을 더한다. 기존 키의 정렬 방식을 따른다.

### 4. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/route53Tables.test.tsx`:

1. `visualsByTopicId['route53'].tables['routing-policies']`가 있다. `label`·`columns`·`sources`가 위와 같고, `glossary`는 빈 배열이다.
2. 행 머리 여덟이 위 표의 순서와 같고, 칸 문구가 위 표와 같다.
3. 어느 칸에도 `O`·`X`·`○`·`×` 한 글자짜리 판정이 없고, 어느 칸에도 `%`나 숫자 비율이 없다(가중치 비율은 데이터에 없다).
   `8`은 다중값 응답 행에만 나온다.
4. 렌더된 `colgroup`의 폭이 `["30%", "70%"]`다.
5. `ConceptList`에 `route53.routing-policies` 개념을 주면 본문 뒤에 이 표가 `figure` 하나로 온다.

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
   - `ComparisonTableFigure.tsx`·`topics.json`·`questions.json`이 그대로인가.
   - 기존 테스트를 고치지 않았는가.
3. `phases/43-route53-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 표 id와 앵커, 래퍼 이름, 가장 긴 칸의 글자 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **가중치 비율(70/30 같은 숫자)을 쓰지 마라.** 이유: 데이터에 없다(ADR-037 phase 43 확장).
- **"상태 검사" 열이나 레코드 유형·TTL 행을 더하지 마라.** 이유: 상태 검사 지원 여부는 단순·페일오버·다중값 응답 셋에만 근거가
  있고, 레코드 유형·TTL은 데이터에 없다.
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: 약어 툴팁은 VPC 주제에만 둔다(ADR-037).
- **도식을 만들지 마라.** 이유: step 1~3의 범위다.
- 기존 테스트를 깨뜨리지 마라.
