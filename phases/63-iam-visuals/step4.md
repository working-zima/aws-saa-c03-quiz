# Step 4: boundary-diagram

## 배경

`permissions-boundary`는 권한 경계를 개별 주체가 가질 수 있는 권한의 최대치로 정의한다. 경계를 붙이면 그 주체의 실제 권한은 붙어 있는
정책과 경계가 **겹치는 범위**로 줄어든다. 경계는 붙여야 효력이 있으므로, 역할을 만들 때 경계 부착을 조건으로 요구하는 SCP를 함께 걸어 예방적 통제로 만든다.
규정을 어긴 역할을 나중에 찾아 지우는 방식은 만들어진 뒤에야 작동한다. `iam-policy`는 권한 경계가 권한을 주지 않고 최대치만 정한다고 말한다.

문항 q690(최대치를 정하는 장치)과 q691(어긴 역할이 아예 생기지 않게)이 이 두 대목을 묻는다. 이 step은 위쪽에 겹친 두 범위, 아래쪽에 역할 생성
흐름을 두고 장면 셋으로 가른다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `iam-permissions.permissions-boundary`다.** 권한 경계를 정의하는 개념이다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/63-iam-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/iam-permissions.json`: step 0이 만든 파일이다. 여기에 `diagrams["boundary"]`를 더한다. **표 셋과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례
- `src/components/diagrams/DriftScopeDiagram.tsx`: 그룹 박스와 그룹 변에서 끝나는 화살표의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/GroupPolicyDiagram.tsx`, `src/components/diagrams/RolePathsDiagram.tsx`, `src/components/diagrams/AbacTagDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `iam-permissions` 주제 가운데 `permissions-boundary`, `iam-policy`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/PermissionsBoundaryDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["boundary"]`
- 매핑: `registry.ts`에 `'iam-permissions.permissions-boundary': PermissionsBoundaryDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형 위쪽은 **겹친 그룹 박스 둘**이다. 오른쪽 위 박스가 붙인 정책의 범위, 왼쪽 아래 박스가 권한 경계의 범위이고, 둘이 겹친 칸에
`실제 권한`을 둔다. 아래쪽은 역할 생성 요청에서 두 갈래(SCP → 생성 거부, 규정 어긴 역할 → 나중에 찾아 지움)로 내려가는 흐름이다.

```
           ┌ 붙인 정책 ──────────┐
           │            [경계 밖] │
┌ 권한 경계 ┼──[실제 권한]        │
│ [정책에 없음] └───────────┼─────┘
└───────────────────────────┘
        [경계 없는 역할 생성 요청]
      [SCP]               [규정 어긴 역할]
    [생성 거부]           [나중에 찾아 지움]
```

- 그룹 라벨은 늘 `x + 10`, `y + 14`다. 두 박스가 겹쳐도 라벨이 상대 박스 안에 놓이지 않게 좌표를 잡았다.
- 흐름의 화살표는 모두 곧은 수직선이다.

가로형은 겹친 두 박스를 왼쪽에, 생성 흐름을 오른쪽에 둔다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고
미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 344`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `policy-range` | 붙인 정책 | 104, 8, 172, 88 |
| `boundary-range` | 권한 경계 | 4, 48, 172, 88 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `policy-only` | 경계 밖 | `stroke-disabled` | 196, 32, 64 |
| `effective` | 실제 권한 | `stroke-diagram-managed` | 108, 56, 64 |
| `boundary-only` | 정책에 없음 | `stroke-disabled` | 12, 72, 72 |
| `request` | 경계 없는 역할 생성 요청 | `stroke-disabled` | 72, 160, 136 |
| `scp` | SCP | `stroke-diagram-managed` | 30, 224, 80 |
| `rejected` | 생성 거부 | `stroke-disabled` | 30, 288, 80 |
| `created` | 규정 어긴 역할 | `stroke-disabled` | 162, 224, 96 |
| `found` | 나중에 찾아 지움 | `stroke-diagram-managed` | 162, 288, 96 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `request-scp` | 경계 없는 생성 요청이 SCP에 걸린다 | `M100 192 V224` |
| `scp-rejected` | SCP가 생성을 거부한다 | `M70 256 V288` |
| `request-created` | 요청대로 규정을 어긴 역할이 만들어진다 | `M180 192 V224` |
| `created-found` | 나중에 찾아 지운다 | `M210 256 V288` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `not-usable` | 쓸 수 없음 | 228, 82 | `middle` | `boundary` |
| `not-granted` | 부여되지 않음 | 48, 122 | `middle` | `boundary` |
| `scp-requires` | 경계 부착을 요구 | 94, 216 | `end` | `scp` |
| `never-created` | 역할이 생기지 않음 | 70, 336 | `middle` | `scp` |
| `exists-until` | 지우기 전까지 존재 | 210, 336 | `middle` | `detect` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **8줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **4줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 192`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `policy-range` | 붙인 정책 | 88, 8, 148, 88 |
| `boundary-range` | 권한 경계 | 4, 48, 156, 88 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `policy-only` | 168, 32, 60 |
| `effective` | 92, 56, 64 |
| `boundary-only` | 8, 72, 72 |
| `request` | 276, 8, 140 |
| `scp` | 252, 72, 80 |
| `rejected` | 252, 136, 80 |
| `created` | 340, 72, 96 |
| `found` | 340, 136, 96 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `request-scp` | `M300 40 V72` |
| `scp-rejected` | `M292 104 V136` |
| `request-created` | `M388 40 V72` |
| `created-found` | `M388 104 V136` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `not-usable` | 쓸 수 없음 | 198, 82 | `middle` |
| `not-granted` | 부여되지 않음 | 44, 122 | `middle` |
| `scp-requires` | 경계 부착을 요구 | 306, 60 | `start` |
| `never-created` | 역할이 생기지 않음 | 292, 184 | `middle` |
| `exists-until` | 지우기 전까지 존재 | 388, 184 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `boundary` | 경계를 붙이면 | `effective` | 없음 | `not-usable`, `not-granted` | 실제 권한은 붙인 정책과 권한 경계가 겹치는 범위다. 경계만으로는 권한이 생기지 않는다. | `iam-permissions.permissions-boundary`, `iam-permissions.iam-policy` |
| `scp` | SCP가 부착 요구 | `request`, `scp`, `rejected` | `request-scp`, `scp-rejected` | `scp-requires`, `never-created` | 역할을 만들 때 경계 부착을 요구하는 SCP를 걸면 경계 없는 역할은 처음부터 만들어지지 않는다. | `iam-permissions.permissions-boundary` |
| `detect` | 나중에 찾아 지움 | `request`, `created`, `found` | `request-created`, `created-found` | `exists-until` | 어긴 역할을 나중에 찾아 지우는 방식은 만들어진 뒤에야 작동한다. 지우기 전까지 그 역할이 있다. | `iam-permissions.permissions-boundary` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `넓은 정책을 붙여도 권한이 넘지 않게 하려면?`
- `idleCaption`: `장면을 고르면 경계가 실제 권한을 어떻게 줄이고, 경계 없는 역할을 어떻게 막는지 볼 수 있다.`
- `legend`: `파랑: 실제 권한과 이를 지키는 장치 · 회색: 쓸 수 없는 권한과 역할 생성 쪽. 겹친 두 박스는 붙인 정책과 권한 경계의 범위다.`
- `label`: `권한 경계 도식`, `svgLabel`: `붙인 정책과 권한 경계가 겹치는 범위, 경계 부착 요구`
- 도식의 `sources`: `iam-permissions.permissions-boundary`, `iam-permissions.iam-policy`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `PermissionsBoundaryDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 8개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. `effective`는 두 배치 모두 두 그룹 박스 **모두의 안**이다. `policy-only`는 `policy-range` 안이고 `boundary-range`와 겹치지 않는다. `boundary-only`는 `boundary-range` 안이고 `policy-range`와 겹치지 않는다. 흐름 노드 다섯은 어느 그룹 박스와도 겹치지 않는다.
7. 각 그룹 라벨의 왼쪽 끝 점(`x + 10`, `y + 14`)이 **다른** 그룹 박스 안에 있지 않다(두 배치).
8. `boundary` 장면에는 보이는 경로가 없고, 선명한 노드는 `effective` 하나다. `scp`에서는 `created`의 변에서 끝나는 경로가 없고, `detect`에서는 `scp`·`rejected`의 변에서 끝나는 경로가 없다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `iam-permissions.permissions-boundary` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 192`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 192])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 275개·경로 219개, 가로 노드 275개·경로 219개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 8개·경로 4개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `PermissionsBoundaryDiagram.tsx`, `PermissionsBoundaryDiagram.test.tsx`, `iam-permissions.json`, `registry.ts`, `phases/63-iam-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 0의 표가 그대로인가.
3. `phases/63-iam-visuals/index.json`의 step 4을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **원·사선으로 벤 다이어그램을 그리지 마라.** 이유: 이 앱의 도식은 직교 경로와 사각 박스다(UI_GUIDE 「수량과 상태를 바꾸는 도식」 — 사선은 메시·허브 그림만 허용한다).
- **SCP를 범위 박스로 그리지 마라.** 이유: SCP와 경계가 함께 거는 상한의 관계는 본문에 없다. SCP는 생성 흐름의 노드로만 나온다(ADR-037 phase 63).
- **`iam:PermissionsBoundary` 같은 조건 키 이름이나 관리자 정책 이름(AdministratorAccess 등)을 쓰지 마라.** 이유: 본문에 없다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다. 계정을 청록으로 그리는 위임 관리자 도식(step 8)만 예외다(ADR-037 phase 63).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
