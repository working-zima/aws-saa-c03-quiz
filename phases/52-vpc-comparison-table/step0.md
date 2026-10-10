# Step 0: comparison-table

## 배경

`vpc-networking.comparison` 개념의 제목은 「NAT Gateway vs VPC Endpoint vs PrivateLink vs VPC 피어링」이다. 본문은 "연결 대상을 확인하면
네 기능을 구분할 수 있다"고 말한다. 그런데 이 개념 뒤에 붙은 시각 자료는 경로 지도(`VpcPathsDiagram`)와 목적지별 도식(`VpcDestinationDiagram`)
둘뿐이다. 목적지별 도식에는 카드 열둘이 있고 인터넷 게이트웨이·Transit Gateway·VPN 같은 다른 답이 섞여 있다. 그래서 네 기능을 같은 기준으로
나란히 놓은 자료가 없다.

이 step은 넷을 행으로 둔 비교표를 이 개념의 본문 바로 뒤, 도식 둘보다 앞에 붙인다. 함께, 기존 `private-connectivity` 표의 열 폭을 고친다.
그 표는 320px에서 행 머리 `PrivateLink`가 단어 가운데에서 끊긴다. 이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-10-10)은
`docs/ADR.md` ADR-037 끝의 「2026-10-10 확장 — VPC 네 기능 비교표(phase 52)」에 있다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 phase 52 문단)
- `docs/UI_GUIDE.md`의 **「도식」 중 「비교표」**. 끊을 수 없는 영문 이름과 긴 한글 낱말의 열 폭 규칙
- `src/types/visuals.ts`: `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/visuals/vpc-networking.json`: 기존 표 다섯(`tables`)
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/vpcTables.tsx`: 표 래퍼의 선례
- `src/components/diagrams/governanceTables.tsx`, `src/components/diagrams/governanceTables.test.tsx`: 표 래퍼 테스트의 가장 최근 선례
- `src/components/diagrams/registry.ts`
- `src/components/diagrams/ComparisonTableFigure.test.tsx`, `src/components/diagrams/VpcPathsDiagram.test.tsx`,
  `src/components/diagrams/VpcDestinationDiagram.test.tsx`: 아래 「4. 기존 테스트 고치기」에서 고칠 파일
- `src/components/ConceptList.tsx`: 본문 뒤에 figure가 붙는 방식
- `src/data/topics.json`의 `vpc-networking` 주제 개념 가운데 `comparison`, `nat-gateway`, `nat-gateway-traffic-uses-public-endpoints`,
  `vpc-endpoint`, `privatelink`, `privatelink-endpoint-service`, `vpc-peering`

## 작업

### 1. 새 표: JSON `tables["nat-endpoint-privatelink-peering"]`

`src/data/visuals/vpc-networking.json`의 `tables`에 더한다. 기존 표 다섯 뒤에 둔다.

- `label`: `NAT 게이트웨이, VPC Endpoint, PrivateLink, VPC 피어링`
- `columns`: `["", "연결 대상", "인터넷을 거치나"]`. 첫 열 머리는 기존 VPC 표들처럼 빈 문자열이다.
- `columnWidths`: `["32%", "34%", "34%"]`. **이 값을 바꾸지 마라.** 320px에서 표 폭은 288px이고 칸마다 9px이 빠진다. 배포 사이트 Chrome
  실측으로 행 머리 `PrivateLink`(굵기 500)는 73.4px, 칸의 `애플리케이션`·`엔드포인트로`(굵기 400)는 72.7px다. 이 폭에서 단어 중간 끊김과
  가로 넘침이 없음을 확인했다. UI_GUIDE 「비교표」.
- `sources`: `vpc-networking.comparison`, `vpc-networking.nat-gateway`, `vpc-networking.nat-gateway-traffic-uses-public-endpoints`,
  `vpc-networking.vpc-endpoint`, `vpc-networking.privatelink`, `vpc-networking.privatelink-endpoint-service`, `vpc-networking.vpc-peering`
  (이 순서 그대로)
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 마침표도
  그대로다. 행 머리는 각 개념의 `name` 그대로다.

| 행 머리 | 연결 대상 | 인터넷을 거치나 | 근거 개념 |
|---|---|---|---|
| NAT 게이트웨이 | 인터넷. 프라이빗 서브넷에서 나가는 통신만 연다 | 거친다. AWS 서비스로 가도 공용 엔드포인트로 나간다 | `nat-gateway` summary, `nat-gateway-traffic-uses-public-endpoints` summary |
| VPC Endpoint | AWS 서비스 | 거치지 않는다 | `vpc-endpoint` summary |
| PrivateLink | 다른 VPC의 애플리케이션 하나 | 거치지 않는다 | `privatelink` summary·p0, `privatelink-endpoint-service` p1 |
| VPC 피어링 | 다른 VPC 전체 | 거치지 않는다 | `comparison` p1, `vpc-peering` p0 |

### 2. 기존 표의 열 폭: JSON `tables["private-connectivity"]`

- `columnWidths`만 `["24%", "38%", "38%"]`에서 `["32%", "34%", "34%"]`로 바꾼다. 같은 표의 `label`·`columns`·`rows`·`sources`는
  한 글자도 바꾸지 마라.
- 이유: 24% 열은 320px에서 칸 안쪽이 60px이라 `PrivateLink`(73.4px)가 `Priva`와 `teLink`로 끊긴다. 32/34/34%에서는 끊김이 없고
  표 높이가 327px에서 351px로 는다(배포 사이트 Chrome 실측).

### 3. 래퍼와 매핑

- `src/components/diagrams/vpcTables.tsx`에 `ConnectionTargetsTable`을 더한다. 다른 래퍼처럼 JSON 표를 `ComparisonTableFigure`에 넘기기만 한다.
  기존 래퍼 뒤에 둔다.
- `src/components/diagrams/registry.ts`의 `'vpc-networking.comparison'` 값을 `[ConnectionTargetsTable, VpcPathsDiagram, VpcDestinationDiagram]`로
  바꾼다. **표가 배열의 맨 앞이다**(사용자 결정: 본문 → 표 → 경로 지도 → 목적지 도식). import는 기존 `./vpcTables` import 목록에 이름 하나를
  더하고 정렬 방식을 따른다. 다른 키는 건드리지 마라.

### 4. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

#### 새 파일 `src/components/diagrams/vpcTables.test.tsx`

1. `visualsByTopicId['vpc-networking'].tables['nat-endpoint-privatelink-peering']`가 있다. `label`·`columns`·`columnWidths`·`sources`가 위와 같다.
2. 행 머리 넷이 위 표의 순서와 같고, 칸 문구가 위 표와 같다.
3. 어느 칸에도 `O`·`X`·`○`·`×` 한 글자짜리 판정이 없다.
4. `tables['private-connectivity'].columnWidths`가 `["32%", "34%", "34%"]`다.
5. `topics.json`의 실제 `vpc-networking.comparison` 개념을 `ConceptList`에 주면(`headingLevel` 2와 4 둘 다) figure가 셋이다. 순서는 이 표
   (`label`), `VPC 통신 경로 도식`, 목적지별 도식(`visualsByTopicId['vpc-networking'].diagrams['vpc-destination'].label`)이다. 첫 figure의
   `previousElementSibling`에 본문 마지막 문단이 있고, 둘째 figure의 `previousElementSibling`은 첫 figure, 셋째 figure의 것은 둘째 figure다.
   세 figure 모두 `article#vpc-networking.comparison` 안에 있다.

#### 기존 테스트 고치기 — 아래 세 곳만, 적힌 만큼만

표가 이 개념 뒤에 하나 더 붙으면서 "figure가 둘"이라고 단언하던 곳이 깨진다. 단언의 뜻(이 개념 뒤에만 붙는다, 지도 다음에 목적지 도식이 온다)은
그대로 두고 표 하나만큼만 고친다.

- `src/components/diagrams/ComparisonTableFigure.test.tsx`
  - `anchors`에 `'nat-endpoint-privatelink-peering': 'vpc-networking.comparison'`을 더한다.
  - 테스트 이름 `표 다섯이 모두 데이터에 있다`를 `표 여섯이 모두 데이터에 있다`로 바꾼다.
- `src/components/diagrams/VpcPathsDiagram.test.tsx`의 `공유 본문에서 comparison 뒤에만 실등록 도식을 표시한다`
  - `getAllByRole('figure')` 길이를 2에서 3으로 바꾼다.
  - 경로 지도 figure의 `previousElementSibling`이 `'비교 본문'`을 담는다는 단언을, 경로 지도 figure의 `previousElementSibling`이 새 표의
    figure(접근성 이름 = 새 표 `label`)이고 그 표 figure의 `previousElementSibling`이 `'비교 본문'`을 담는다는 단언으로 바꾼다.
- `src/components/diagrams/VpcDestinationDiagram.test.tsx`의 `h%i 공유 본문에서 comparison 뒤에 지도 다음 목적지 도식이 온다`
  - figure 수를 3으로, 인덱스를 한 칸씩 밀어 `figures[0]`이 새 표, `figures[1]`이 `VPC 통신 경로 도식`, `figures[2]`가 목적지별 도식이 되게 한다.
  - `figures[0]`의 `previousElementSibling`이 본문 마지막 문단을, `figures[1]`·`figures[2]`의 `previousElementSibling`이 각각 바로 앞 figure를
    가리키게 한다. 세 figure 모두에 대한 `article` id와 헤딩 없음 단언은 그대로 둔다.
  - 테스트 이름을 `h%i 공유 본문에서 comparison 뒤에 표, 지도, 목적지 도식이 차례로 온다`로 바꾼다.

이 세 곳 밖의 기존 테스트는 고치지 마라.

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
   - 새 표의 칸에 위 표 밖의 사실이 없는가.
   - `private-connectivity` 표에서 `columnWidths` 말고 바뀐 것이 없는가(`git diff`로 확인).
   - 판정에 색·이모지·O/X가 없는가.
   - `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`VpcPathsDiagram.tsx`·`VpcDestinationDiagram.tsx`·`topics.json`·`questions.json`이 그대로인가.
   - 기존 테스트를 위 세 곳 밖에서 고치지 않았는가.
3. `phases/52-vpc-comparison-table/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 표 id와 앵커·배열 순서, `private-connectivity` 폭 변경, 래퍼 이름, 고친 기존 테스트 세 곳, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`columnWidths`를 바꾸거나 칸 문구를 다듬지 마라.** 이유: 320px에서 영문 이름과 긴 한글 낱말이 끊기지 않는 폭과 문구를 배포 사이트에서
  실측해 정했다. 문구를 바꾸면 줄바꿈이 달라진다.
- **비용, 라우팅 테이블, 엔드포인트 정책, 게이트웨이·인터페이스 유형, 1:1 연결·확장 한계를 새 표에 쓰지 마라.** 이유: 네 기능 모두에 근거가
  있는 열만 둔다는 사용자 결정이고, 그 사실들은 기존 표 둘(`endpoint-types`, `private-connectivity`)과 도식이 맡는다(ADR-037 phase 52 확장).
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **도식 컴포넌트(`VpcPathsDiagram.tsx`, `VpcDestinationDiagram.tsx`)와 그 JSON 문구를 고치지 마라.** 이유: 이 step은 표만 더한다.
- **약어 툴팁(`glossary`)에 항목을 더하지 마라.** 이유: 근거 규칙(ADR-037)으로 정한 넷만 둔다.
- 기존 테스트를 깨뜨리지 마라.
