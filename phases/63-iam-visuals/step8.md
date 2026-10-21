# Step 8: delegated-admin-diagram

## 배경

`access-analyzer-delegated-administrator`는 조직의 모든 계정에서 나온 IAM Access Analyzer 결과를 한 계정에 모으려면 관리 계정에서 그 계정을
위임 관리자로 지정하는 것이 첫 조치라고 말한다. 버킷과 정책을 먼저 만들어 로그를 모으는 구성은 순서가 어긋나고, 감사 추적을 한곳으로 보내는 것은
API 호출 기록을 모으는 일이지 정책 분석 결과를 통합하는 설정이 아니다.

문항 q699의 보기(버킷부터 만들기, 손으로 합치기, 위임 관리자 지정, 감사 추적)가 이 순서를 묻는다. 이 step은 장면 둘(위임 관리자 지정, 버킷부터
만들면)로 가른다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `iam-permissions.access-analyzer-delegated-administrator`다.** 위임 관리자 지정을 말하는 개념이다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/63-iam-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/iam-permissions.json`: step 0이 만든 파일이다. 여기에 `diagrams["delegated-admin"]`를 더한다. **표 셋과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례
- `src/components/diagrams/DriftScopeDiagram.tsx`: 그룹 박스와 그룹 변에서 끝나는 화살표의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/GroupPolicyDiagram.tsx`, `src/components/diagrams/RolePathsDiagram.tsx`, `src/components/diagrams/AbacTagDiagram.tsx`, `src/components/diagrams/PermissionsBoundaryDiagram.tsx`, `src/components/diagrams/PolicyEvaluationDiagram.tsx`, `src/components/diagrams/NotActionDenyDiagram.tsx`, `src/components/diagrams/RegionConditionDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `iam-permissions` 주제 가운데 `access-analyzer-delegated-administrator`, `iam-access-analyzer`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/DelegatedAdminDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["delegated-admin"]`
- 매핑: `registry.ts`에 `'iam-permissions.access-analyzer-delegated-administrator': DelegatedAdminDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
  이 주제의 키는 **주제 안 개념 순서**로 모은다. phase가 끝났을 때의 순서는 아래와 같고, 이 step은 자기 줄을 그 자리에 끼운다.

```ts
  'iam-permissions.iam-group-policy-attachment': GroupPolicyDiagram, // step 1
  'iam-permissions.iam-user-is-account-scoped': GroupMembersTable, // step 0
  'iam-permissions.iam-role': CredentialTable, // step 0
  'iam-permissions.cross-account-iam-role': RolePathsDiagram, // step 2
  'iam-permissions.abac': AbacTagDiagram, // step 3
  'iam-permissions.permissions-boundary': PermissionsBoundaryDiagram, // step 4
  'iam-permissions.iam-explicit-deny-precedence': PolicyEvaluationDiagram, // step 5
  'iam-permissions.iam-notaction-deny': NotActionDenyDiagram, // step 6
  'iam-permissions.iam-requested-region-condition': RegionConditionDiagram, // step 7
  'iam-permissions.access-analyzer-delegated-administrator': DelegatedAdminDiagram, // step 8
  'iam-permissions.network-access-analyzer': AnalyzerToolTable, // step 0
```

### 모양

세로형은 조직 박스 하나 안에 위에서 아래로 관리 계정, 구성원 계정 둘, 감사 계정, S3 버킷과 정책을 둔다.

```
┌ 조직 ──────────────────────────┐
│          [관리 계정]            │
│  [구성원 계정]  │  [구성원 계정]  │
│          [감사 계정]            │
│        [S3 버킷과 정책]          │
└────────────────────────────────┘
```

- 관리 계정의 화살표는 구성원 계정 둘 사이(x 140)로 내려가 감사 계정의 위 변으로 들어간다.
- 구성원 계정의 화살표는 각자 아래로 내려가 감사 계정의 옆 변으로 들어간다.

가로형은 관리 계정 → 감사 계정을 왼쪽에서 오른쪽으로 두고, 구성원 계정 둘을 오른쪽 열에, 버킷을 감사 계정 아래에 둔다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고
미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 304`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `org` | 조직 | 4, 8, 272, 288 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `management` | 관리 계정 | `stroke-diagram-resource` | 82, 32, 116 |
| `member-1` | 구성원 계정 | `stroke-diagram-resource` | 12, 104, 116 |
| `member-2` | 구성원 계정 | `stroke-diagram-resource` | 152, 104, 116 |
| `audit` | 감사 계정 | `stroke-diagram-resource` | 82, 176, 116 |
| `bucket` | S3 버킷과 정책 | `stroke-diagram-managed` | 82, 240, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `management-audit` | 관리 계정이 감사 계정을 위임 관리자로 지정한다 | `M140 64 V176` |
| `member-1-audit` | 구성원 계정의 결과가 감사 계정에 모인다 | `M70 136 V192 H82` |
| `member-2-audit` | 구성원 계정의 결과가 감사 계정에 모인다 | `M210 136 V192 H198` |
| `audit-bucket` | 감사 계정에 S3 버킷과 정책을 먼저 만든다 | `M140 208 V240` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `delegate` | 위임 관리자로 지정 | 148, 92 | `start` | `delegate` |
| `gathered` | 결과가 모인다 | 140, 224 | `middle` | `delegate` |
| `not-gathered` | 결과가 모이지 않음 | 140, 288 | `middle` | `bucket-first` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **5줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **4줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 192`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `org` | 조직 | 4, 8, 432, 176 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `management` | 16, 56, 104 |
| `audit` | 168, 56, 104 |
| `member-1` | 320, 24, 104 |
| `member-2` | 320, 88, 104 |
| `bucket` | 168, 128, 104 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `management-audit` | `M120 72 H168` |
| `member-1-audit` | `M320 40 H296 V64 H272` |
| `member-2-audit` | `M320 104 H296 V80 H272` |
| `audit-bucket` | `M220 88 V128` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `delegate` | 위임 관리자로 지정 | 144, 50 | `middle` |
| `gathered` | 결과가 모인다 | 220, 112 | `middle` |
| `not-gathered` | 결과가 모이지 않음 | 220, 176 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `delegate` | 위임 관리자 지정 | `management`, `audit`, `member-1`, `member-2` | `management-audit`, `member-1-audit`, `member-2-audit` | `delegate`, `gathered` | 관리 계정에서 감사 계정을 위임 관리자로 지정하면 구성원 계정들의 결과가 그 계정에 모인다. | `iam-permissions.access-analyzer-delegated-administrator` |
| `bucket-first` | 버킷부터 만들면 | `audit`, `bucket`, `member-1`, `member-2` | `audit-bucket` | `not-gathered` | 버킷과 정책을 먼저 만들거나 감사 추적을 보내도 분석 결과는 모이지 않는다. 지정이 첫 조치다. | `iam-permissions.access-analyzer-delegated-administrator` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `조직 전체의 Access Analyzer 결과는 어떻게 한곳에 모일까?`
- `idleCaption`: `순서를 고르면 구성원 계정들의 결과가 감사 계정에 모이는지 볼 수 있다.`
- `legend`: `파랑: S3 버킷 · 청록: 계정. 큰 박스가 조직이다.`
- `label`: `Access Analyzer 위임 관리자 도식`, `svgLabel`: `관리 계정·감사 계정·구성원 계정`
- 도식의 `sources`: `iam-permissions.access-analyzer-delegated-administrator`, `iam-permissions.iam-access-analyzer`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `DelegatedAdminDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 5개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. 노드 다섯은 두 배치 모두 `org` 박스 안이다.
7. `delegate`의 경로 셋은 두 배치 모두 `audit` 상자의 변에서 끝난다. `bucket-first`에서는 `audit` 상자의 변에서 끝나는 경로가 없다.
8. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
9. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
10. `ConceptList`에 `iam-permissions.access-analyzer-delegated-administrator` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

11. `viewBox`가 `0 0 440 192`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
12. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
13. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 192])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 297개·경로 237개, 가로 노드 297개·경로 237개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 5개·경로 4개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `DelegatedAdminDiagram.tsx`, `DelegatedAdminDiagram.test.tsx`, `iam-permissions.json`, `registry.ts`, `phases/63-iam-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 0의 표가 그대로인가.
3. `phases/63-iam-visuals/index.json`의 step 8을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **감사 추적(CloudTrail) 노드를 그리지 마라.** 이유: 승인된 장면은 둘이고, 감사 추적은 `bucket-first`의 캡션이 말한다.
- **OU나 계정 이름·이메일을 쓰지 마라.** 이유: 본문에 없다(ADR-038 「예시의 경계」).
- 계정 노드의 색은 `stroke-diagram-resource`(청록)다. 이유: phase 50의 조직 도식이 계정을 청록으로 그린 선례를 따른다(ADR-037 phase 63). 다른 노드에 청록을 쓰지 마라.
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
