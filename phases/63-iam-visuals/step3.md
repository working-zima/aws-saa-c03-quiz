# Step 3: abac-diagram

## 배경

`abac`는 리소스와 주체에 붙은 태그를 조건 키로 비교해 접근을 허용하므로, 정책을 고치지 않고도 새 리소스가 규칙에 들어온다고 말한다.
리소스가 늘 때마다 정책에 이름을 하나씩 추가하는 방식은 오래 못 간다. 키가 여러 리전에 걸쳐 계속 생기는 상황이 그 예다.

문항 q689의 오답은 "이름 추가 절차를 자동화한다", "그룹을 하나 더 만든다", "권한 경계를 붙인다"다. 이 step은 세 장면(태그 비교, 새 키가 생기면,
이름을 나열하면)으로 태그 비교와 이름 나열을 가른다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `iam-permissions.abac`다.** ABAC를 정의하는 개념이다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/63-iam-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/iam-permissions.json`: step 0이 만든 파일이다. 여기에 `diagrams["abac"]`를 더한다. **표 셋과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례
- `src/components/diagrams/DriftScopeDiagram.tsx`: 그룹 박스와 그룹 변에서 끝나는 화살표의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/GroupPolicyDiagram.tsx`, `src/components/diagrams/RolePathsDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `iam-permissions` 주제 가운데 `abac`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/AbacTagDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["abac"]`
- 매핑: `registry.ts`에 `'iam-permissions.abac': AbacTagDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 맨 위에 요청하는 역할, 가운데에 정책 둘(태그 비교, 이름 나열), 맨 아래에 키 셋을 나란히 둔다.

```
              [역할 · 팀 A]
   [태그가 같으면 허용]  [이름을 나열한 정책]
[키 1 · 팀 A] [키 2 · 팀 B] [새 키 · 팀 A]
```

- 정책에서 키로 가는 경로는 정책 줄 아래 통로(y 128·136)를 지나 키의 위 변으로 들어간다.

가로형은 왼쪽에 역할, 가운데에 정책 둘을 위아래로, 오른쪽에 키 셋을 세로로 둔다. 키로 가는 경로는 정책과 키 사이 통로(x 280·288·296)를 지난다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고
미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 216`이다.

그룹 박스는 없다.

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `principal` | 역할 · 팀 A | `stroke-disabled` | 82, 8, 116 |
| `tag-policy` | 태그가 같으면 허용 | `stroke-diagram-managed` | 12, 80, 124 |
| `list-policy` | 이름을 나열한 정책 | `stroke-diagram-managed` | 144, 80, 124 |
| `key-1` | 키 1 · 팀 A | `stroke-diagram-managed` | 10, 160, 80 |
| `key-2` | 키 2 · 팀 B | `stroke-diagram-managed` | 100, 160, 80 |
| `key-new` | 새 키 · 팀 A | `stroke-diagram-managed` | 190, 160, 80 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `principal-tag` | 역할의 요청을 태그 비교 정책이 평가한다 | `M120 40 V60 H74 V80` |
| `principal-list` | 역할의 요청을 이름 나열 정책이 평가한다 | `M160 40 V60 H206 V80` |
| `tag-key-1` | 태그가 같아 키 1에 닿는다 | `M50 112 V160` |
| `tag-key-new` | 새 키도 태그가 같아 닿는다 | `M120 112 V136 H230 V160` |
| `list-key-1` | 목록에 적힌 키 1에만 닿는다 | `M170 112 V128 H60 V160` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `mismatch` | 태그가 달라 닿지 않음 | 140, 208 | `middle` | `tag-compare` |
| `auto` | 정책 수정 없이 들어옴 | 230, 208 | `middle` | `new-key` |
| `manual` | 이름을 더해야 닿음 | 230, 208 | `middle` | `name-list` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **6줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **5줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 192`이다.

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `principal` | 8, 72, 96 |
| `tag-policy` | 136, 32, 124 |
| `list-policy` | 136, 112, 124 |
| `key-1` | 320, 8, 96 |
| `key-2` | 320, 72, 96 |
| `key-new` | 320, 136, 96 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `principal-tag` | `M104 80 H120 V48 H136` |
| `principal-list` | `M104 96 H120 V128 H136` |
| `tag-key-1` | `M260 48 H288 V24 H320` |
| `tag-key-new` | `M260 56 H280 V152 H320` |
| `list-key-1` | `M260 120 H296 V32 H320` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `mismatch` | 태그가 달라 닿지 않음 | 368, 120 | `middle` |
| `auto` | 정책 수정 없이 들어옴 | 368, 184 | `middle` |
| `manual` | 이름을 더해야 닿음 | 368, 184 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `tag-compare` | 태그 비교 | `principal`, `tag-policy`, `key-1`, `key-2` | `principal-tag`, `tag-key-1` | `mismatch` | 주체와 리소스에 붙은 태그를 조건 키로 비교한다. 태그가 같은 리소스에만 접근이 허용된다. | `iam-permissions.abac` |
| `new-key` | 새 키가 생기면 | `principal`, `tag-policy`, `key-1`, `key-new` | `principal-tag`, `tag-key-1`, `tag-key-new` | `auto` | 새 키에 같은 태그를 붙이면 정책을 고치지 않아도 규칙에 들어온다. 키가 여러 리전에 생겨도 같다. | `iam-permissions.abac` |
| `name-list` | 이름을 나열하면 | `principal`, `list-policy`, `key-1`, `key-new` | `principal-list`, `list-key-1` | `manual` | 리소스 이름을 정책에 나열하면 새 키가 생길 때마다 정책에 이름을 하나씩 추가해야 한다. | `iam-permissions.abac` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `리소스가 계속 늘어도 정책을 고치지 않으려면?`
- `idleCaption`: `방식을 고르면 태그로 비교할 때와 이름을 나열할 때 새 키가 어떻게 되는지 볼 수 있다.`
- `legend`: `파랑: 정책과 리소스 · 회색: 요청하는 주체. 팀 A·B는 태그 값을 구별하는 이름이다.`
- `label`: `속성 기반 액세스 제어 도식`, `svgLabel`: `태그 비교와 이름 나열`
- 도식의 `sources`: `iam-permissions.abac`
- JSON의 `nodes`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다. 그룹 박스가 없으므로 `groups` 키는 두지 않는다.

### 테스트: `AbacTagDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 6개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
5. `tag-compare`에서 `key-2`는 선명하지만, 보이는 경로 어느 것도 `key-2` 상자의 변에서 끝나지 않는다.
6. `new-key`에서는 `key-new` 상자의 변에서 끝나는 경로가 있고, `name-list`에서는 없다.
7. `name-list`에서 `tag-policy`는 `0.25`이고, `tag-compare`·`new-key`에서 `list-policy`는 `0.25`다.
8. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
9. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
10. `ConceptList`에 `iam-permissions.abac` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

11. `viewBox`가 `0 0 440 192`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
12. 노드 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
13. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 192])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말은 `0..440` 안이다.
14. 세로형의 3번과 5~7번을 가로형에서도 같은 기대값으로 통과한다.
15. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 267개·경로 215개, 가로 노드 267개·경로 215개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 6개·경로 5개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `AbacTagDiagram.tsx`, `AbacTagDiagram.test.tsx`, `iam-permissions.json`, `registry.ts`, `phases/63-iam-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 0의 표가 그대로인가.
3. `phases/63-iam-visuals/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`aws:ResourceTag`·`aws:PrincipalTag` 같은 조건 키 이름이나 태그 키 이름을 쓰지 마라.** 이유: 본문에 없다. `팀 A/B`는 태그 값을 구별하는 이름이다.
- **KMS·리전 이름을 노드 라벨에 쓰지 마라.** 이유: 본문은 "키"와 "여러 리전"이라고만 말한다. 문항 q689의 서비스 이름은 본문 밖이다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다. 계정을 청록으로 그리는 위임 관리자 도식(step 8)만 예외다(ADR-037 phase 63).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
