# Step 4: lake-permissions-diagram

## 배경

Lake Formation 개념 셋은 데이터 레이크에 **데이터가 들어오는 길**과 **읽히는 길**, 그리고 그 길에서 **권한이 어디서 걸리는지**를 말한다.

- `lake-formation`: 여러 소스의 데이터를 모은 데이터 레이크의 접근 권한을 한곳에서 정의하고, 데이터 필터로 행·열 수준까지 나눈다. IAM 정책만으로는
  같은 일을 할 수 없다.
- `lake-formation-blueprint-and-athena`: **블루프린트**는 관계형 데이터베이스 같은 소스의 데이터를 레이크로 가져오는 수집 방식이다. 시각화 도구가
  **Athena**를 데이터 소스로 쓰면 Athena가 Lake Formation의 열 수준 권한을 적용한다. 수집할 때 열을 빼 두거나 IAM·버킷 정책으로 대신하는 방식은
  SQL 질의 단위의 열 권한이 되지 못한다.
- `lake-formation-lf-tags`: 테이블·열·데이터베이스에 **LF 태그**를 달고 역할에는 태그 기준으로 권한을 준다. 새 테이블도 태그만 달면 된다.

문항 q620(행·열 권한을 설정만으로)·q627(블루프린트와 Athena 경유 조회)·q628(테이블이 수천 개로 늘 때)은 IAM 정책, 함수, DataBrew, S3 직접 읽기,
테이블을 하나씩 명시하는 정책을 오답으로 낸다. 이 step은 들어오는 길과 읽히는 길을 한 그림에 그리고 장면 넷으로 가른다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — EMR·Glue·Athena·Lake Formation 주제(phase 62)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `emr-glue-athena.lake-formation-lf-tags`다.** Lake Formation 개념 셋을 다 읽은 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/62-analytics-visuals/index.json`의 step 0~3 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/emr-glue-athena.json`: step 0이 만든 파일이다. 여기에 `diagrams["lake-permissions"]`를 더한다. **표 둘과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·그룹 박스·그룹 변에서 끝나는 화살표·가로형 `describe`의 선례.
  **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/IdentityCenterAccessDiagram.tsx`: 곁말마다 `textAnchor`를 두고, 가로형 곁말이 자기 `textAnchor`를 갖는 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `emr-glue-athena` 주제 가운데 `lake-formation`, `lake-formation-blueprint-and-athena`, `lake-formation-lf-tags`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/LakePermissionsDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["lake-permissions"]`
- 매핑: `registry.ts`에 `'emr-glue-athena.lake-formation-lf-tags': LakePermissionsDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
  이 주제의 키는 **주제 안 개념 순서**로 모은다. phase가 끝났을 때의 순서는 아래와 같고, 이 step은 자기 줄을 그 자리에 끼운다.

```ts
  'emr-glue-athena.emr': AnalyticsServiceTable, // step 0
  'emr-glue-athena.emr-managed-scaling': EmrClusterCostDiagram, // step 1
  'emr-glue-athena.emr-node-instance-family-choice': EmrNodeRolesDiagram, // step 2
  'emr-glue-athena.emr-security-configuration': EmrRuntimeRoleDiagram, // step 3
  'emr-glue-athena.log-storage-s3-athena': LogStorageTable, // step 0
  'emr-glue-athena.lake-formation-lf-tags': LakePermissionsDiagram, // step 4
  'emr-glue-athena.parquet-columnar-format': ColumnarFormatDiagram, // step 5
```

### 모양

세로형은 맨 위에 관계형 데이터베이스(왼쪽)와 시각화 도구(오른쪽), 시각화 도구 아래에 Athena, 가운데 Lake Formation 박스(LF 태그·블루프린트·
열·행 권한), 맨 아래 데이터 레이크 박스(테이블 둘·새 테이블)를 둔다.

```
[관계형 데이터베이스]        [시각화 도구]
                             [Athena]
┌ Lake Formation ──────────────────┐
│ [LF 태그] [블루프린트] [열·행 권한]│
└──────────────────────────────────┘ ← 오른쪽 바깥 통로(x 272)는 비워 둔다
┌ 데이터 레이크 ─────────────────────────┐
│ [테이블]   [테이블]   [새 테이블]       │
└────────────────────────────────────────┘
```

- **Lake Formation 박스는 폭이 240이라 오른쪽에 통로가 남는다.** `S3 직접 읽기`의 화살표는 시각화 도구의 오른쪽 변에서 나와 이 통로(x 272)로 내려가
  데이터 레이크 박스의 위 변에서 끝난다. **Lake Formation 박스를 지나지 않는다는 것이 이 장면의 뜻이다.**
- 레이크로 들어가는 화살표(`blueprint-lake`·`permissions-lake`·`lf-tags-lake`·`viz-lake`)는 테이블 노드가 아니라 **데이터 레이크 박스의 변에서 끝난다.**
- 그룹 라벨(`Lake Formation`·`데이터 레이크`)이 박스 왼쪽 위에 있으므로, 박스로 들어가는 세로 화살표는 라벨이 놓인 x 14~84 구간을 지나지 않는다.

가로형은 왼쪽에서 오른쪽으로 「데이터베이스·시각화 도구 → Athena → Lake Formation → 데이터 레이크」다. Lake Formation과 데이터 레이크는 세로로
긴 박스이고, `S3 직접 읽기`는 시각화 도구의 아래 변에서 내려가 두 박스 **아래**를 지나 데이터 레이크 박스의 아래 변으로 들어간다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고 미리보기로 사용자 승인을 받은
**출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 272`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `lake-formation` | Lake Formation | 4, 112, 240, 64 |
| `lake` | 데이터 레이크 | 4, 200, 272, 64 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `database` | 관계형 데이터베이스 | `stroke-disabled` | 8, 8, 120 |
| `viz` | 시각화 도구 | `stroke-disabled` | 160, 8, 104 |
| `athena` | Athena | `stroke-diagram-managed` | 160, 64, 104 |
| `lf-tags` | LF 태그 | `stroke-diagram-managed` | 12, 136, 72 |
| `blueprint` | 블루프린트 | `stroke-diagram-managed` | 88, 136, 72 |
| `permissions` | 열·행 권한 | `stroke-diagram-managed` | 164, 136, 72 |
| `table-1` | 테이블 | `stroke-disabled` | 12, 224, 80 |
| `table-2` | 테이블 | `stroke-disabled` | 100, 224, 80 |
| `table-new` | 새 테이블 | `stroke-disabled` | 188, 224, 80 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `database-blueprint` | 데이터베이스의 데이터를 블루프린트가 가져온다 | `M108 40 V136` |
| `blueprint-lake` | 가져온 데이터가 레이크에 들어간다 | `M124 168 V200` |
| `viz-athena` | 시각화 도구가 Athena로 조회한다 | `M212 40 V64` |
| `athena-permissions` | Athena가 열·행 권한을 거친다 | `M200 96 V136` |
| `permissions-lake` | 권한이 걸린 채로 레이크를 읽는다 | `M200 168 V200` |
| `viz-lake` | 시각화 도구가 S3를 직접 읽는다 | `M264 24 H272 V200` |
| `lf-tags-lake` | 태그 기준 권한이 레이크의 테이블에 걸린다 | `M48 168 V200` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `ingest` | 레이크로 수집 | 102, 92 | `end` | `blueprint` |
| `applied` | 열·행 권한 적용 | 206, 192 | `start` | `via-athena` |
| `policy-only` | IAM·버킷 정책만 | 266, 192 | `end` | `direct-s3` |
| `by-tag` | 태그 기준 권한 | 54, 192 | `start` | `lf-tags` |
| `new-table` | 태그만 달면 됨 | 228, 218 | `middle` | `lf-tags` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **9줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **7줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 192`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `lake-formation` | Lake Formation | 216, 8, 104, 152 |
| `lake` | 데이터 레이크 | 336, 8, 100, 168 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `database` | 8, 32, 120 |
| `viz` | 8, 76, 104 |
| `athena` | 128, 76, 72 |
| `blueprint` | 224, 32, 88 |
| `permissions` | 224, 76, 88 |
| `lf-tags` | 224, 120, 88 |
| `table-1` | 344, 32, 84 |
| `table-2` | 344, 76, 84 |
| `table-new` | 344, 120, 84 |

**경로**(`widePaths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | `d` |
|---|---|
| `database-blueprint` | `M128 48 H224` |
| `blueprint-lake` | `M312 48 H336` |
| `viz-athena` | `M112 92 H128` |
| `athena-permissions` | `M200 92 H224` |
| `permissions-lake` | `M312 92 H336` |
| `viz-lake` | `M60 108 V184 H386 V176` |
| `lf-tags-lake` | `M312 136 H336` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `ingest` | 레이크로 수집 | 176, 42 | `middle` |
| `applied` | 열·행 권한 적용 | 164, 124 | `middle` |
| `policy-only` | IAM·버킷 정책만 | 140, 180 | `middle` |
| `by-tag` | 태그 기준 권한 | 208, 140 | `end` |
| `new-table` | 태그만 달면 됨 | 386, 170 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `blueprint` | 블루프린트 수집 | `database`, `blueprint`, `table-1`, `table-2`, `table-new` | `database-blueprint`, `blueprint-lake` | `ingest` | 블루프린트가 관계형 데이터베이스의 데이터를 레이크로 가져온다. 수집 파이프라인을 따로 짜지 않는다. | `emr-glue-athena.lake-formation-blueprint-and-athena` |
| `via-athena` | Athena로 조회 | `viz`, `athena`, `permissions`, `table-1`, `table-2`, `table-new` | `viz-athena`, `athena-permissions`, `permissions-lake` | `applied` | 시각화 도구가 Athena로 조회하면 Lake Formation의 열 수준 권한이 그대로 걸린다. | `emr-glue-athena.lake-formation-blueprint-and-athena`, `emr-glue-athena.lake-formation` |
| `direct-s3` | S3 직접 읽기 | `viz`, `table-1`, `table-2`, `table-new` | `viz-lake` | `policy-only` | S3를 직접 읽게 하고 IAM·버킷 정책으로 막으면, SQL 질의 단위의 열 권한이 되지 못한다. | `emr-glue-athena.lake-formation-blueprint-and-athena`, `emr-glue-athena.lake-formation` |
| `lf-tags` | LF 태그 | `lf-tags`, `table-1`, `table-2`, `table-new` | `lf-tags-lake` | `by-tag`, `new-table` | 테이블·열에 LF 태그를 달고 역할에는 태그 기준으로 권한을 준다. 새 테이블도 태그만 달면 된다. | `emr-glue-athena.lake-formation-lf-tags` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `데이터 레이크의 열·행 권한은 어디서 걸릴까?`
- `idleCaption`: `경로를 고르면 데이터가 들어오고 읽히는 길에서 권한이 어디서 걸리는지 볼 수 있다.`
- `legend`: `파랑: AWS 서비스와 Lake Formation의 기능 · 회색: 데이터와 그것을 읽는 쪽.`
- `label`: `Lake Formation 권한 경로 도식`, `svgLabel`: `블루프린트 수집과 Athena 조회에 걸리는 Lake Formation 권한`
- 도식의 `sources`: `emr-glue-athena.lake-formation`, `emr-glue-athena.lake-formation-blueprint-and-athena`, `emr-glue-athena.lake-formation-lf-tags`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `LakePermissionsDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 9개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`), 관문 7(폭 280)을 통과한다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이고, 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. `viz-lake`의 어느 선분도 두 배치 모두 Lake Formation 그룹 박스 안을 지나지 않는다(선분과 박스 내부가 겹치지 않는다).
6. `blueprint-lake`·`permissions-lake`·`lf-tags-lake`·`viz-lake`의 끝점은 두 배치 모두 데이터 레이크 박스의 변 위에 있다.
7. 관계형 데이터베이스·시각화 도구·Athena는 두 배치 모두 두 그룹 박스 **밖**이고, LF 태그·블루프린트·열·행 권한은 Lake Formation 박스 **안**,
   테이블 셋은 데이터 레이크 박스 **안**이다.
8. 두 배치 모두 어느 경로 선분도 그룹 라벨이 차지하는 상자(가로 `x + 10` ~ `x + 10 + estimateTextWidth(라벨, 9)`, 세로 `y + 6` ~ `y + 15`)와 겹치지 않는다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `emr-glue-athena.lake-formation-lf-tags` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 192`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 192])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
    그룹 라벨은 `0..440` 안이며 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
15. 세로형의 3번과, 위 5~9번 가운데 배치에 묶이지 않은 단언을 가로형에서도 같은 기대값으로 통과한다.
16. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 240개·경로 199개, 가로 노드 240개·경로 199개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 9개·경로 7개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - 바뀐 파일이 `LakePermissionsDiagram.tsx`, `LakePermissionsDiagram.test.tsx`, `emr-glue-athena.json`, `registry.ts`, `phases/62-analytics-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식이 그대로인가.
3. `phases/62-analytics-visuals/index.json`의 step 4을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **Glue Data Catalog·Crawler·DataBrew를 그리지 마라.** 이유: Crawler가 결과를 어디에 적는지는 데이터에 없고(ADR-037 phase 62), DataBrew와의 구별은
  서비스 역할 비교표(step 0)가 맡는다.
- **셀 수준 필터, 태그의 키·값 예시, 부서 이름을 쓰지 마라.** 이유: 데이터에 예시가 없다(ADR-038 「예시의 경계」).
- **데이터 레이크 박스를 `S3`라고 부르지 마라.** 이유: 본문은 레이크가 S3·RDS 같은 여러 소스의 데이터를 모은다고 말한다. S3 직접 읽기는 장면
  이름과 캡션이 말한다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다(ADR-037 phase 62).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
