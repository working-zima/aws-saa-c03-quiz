# Step 5: policy-evaluation-diagram

## 배경

`iam-explicit-deny-precedence`는 정책 여러 개가 겹칠 때의 평가 순서를 말한다. 명시적 거부, 허용, 그리고 아무 데도 걸리지 않으면 기본 거부다.
모든 리소스에 작업을 허용하는 문장이 있어도, 같은 작업에 조건부 거부가 붙고 그 조건이 성립하면 요청이 막히고 403이 돌아온다. `aws:SourceIp`로
허용 대역을 정해 두면 그 밖에서 온 호출이 거부에 걸린다.

문항 q694(허용과 조건부 거부가 함께 있을 때)·q695(재택 근무자만 403)·q697(전체 거부 + 한 서비스 허용)이 이 순서를 묻는다. 이 step은 평가 흐름도
한 장에 요청 넷을 장면으로 둔다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `iam-permissions.iam-explicit-deny-precedence`다.** 평가 순서를 정의하는 개념이다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/63-iam-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/iam-permissions.json`: step 0이 만든 파일이다. 여기에 `diagrams["policy-evaluation"]`를 더한다. **표 셋과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례
- `src/components/diagrams/DriftScopeDiagram.tsx`: 그룹 박스와 그룹 변에서 끝나는 화살표의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/GroupPolicyDiagram.tsx`, `src/components/diagrams/RolePathsDiagram.tsx`, `src/components/diagrams/AbacTagDiagram.tsx`, `src/components/diagrams/PermissionsBoundaryDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `iam-permissions` 주제 가운데 `iam-explicit-deny-precedence`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/PolicyEvaluationDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["policy-evaluation"]`
- 매핑: `registry.ts`에 `'iam-permissions.iam-explicit-deny-precedence': PolicyEvaluationDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 왼쪽 열을 위에서 아래로 `요청 → 명시적 거부가 걸리나 → 허용 문장이 있나 → 기본 거부`로 쌓고, 두 물음 노드의 오른쪽에 결과(`거부 · 403`, `허용`)를
둔다. "예"는 오른쪽, "아니오"는 아래로 간다.

```
[요청]
[명시적 거부가 걸리나] →예→ [거부 · 403]
        ↓아니오
[허용 문장이 있나]   →예→ [허용]
        ↓아니오
[기본 거부]
```

가로형은 같은 흐름을 왼쪽에서 오른쪽으로 펴고, "예"는 아래로 간다. 곁말 `예`·`아니오`는 그 경로가 보이는 장면에서만 보인다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고
미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 248`이다.

그룹 박스는 없다.

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `request` | 요청 | `stroke-disabled` | 12, 8, 128 |
| `check-deny` | 명시적 거부가 걸리나 | `stroke-diagram-managed` | 12, 64, 128 |
| `denied` | 거부 · 403 | `stroke-disabled` | 168, 64, 100 |
| `check-allow` | 허용 문장이 있나 | `stroke-diagram-managed` | 12, 136, 128 |
| `allowed` | 허용 | `stroke-disabled` | 168, 136, 100 |
| `default-deny` | 기본 거부 | `stroke-disabled` | 12, 208, 128 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `request-deny` | 요청은 명시적 거부부터 본다 | `M76 40 V64` |
| `deny-yes` | 거부 문장에 걸리면 403으로 막힌다 | `M140 80 H168` |
| `deny-no` | 걸리지 않으면 허용 문장을 본다 | `M76 96 V136` |
| `allow-yes` | 허용 문장이 있으면 허용된다 | `M140 152 H168` |
| `allow-no` | 없으면 기본 거부다 | `M76 168 V208` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `yes-1` | 예 | 154, 74 | `middle` | `conditional-deny`, `source-ip` |
| `no-1` | 아니오 | 84, 120 | `start` | `allowed`, `none` |
| `yes-2` | 예 | 154, 146 | `middle` | `allowed` |
| `no-2` | 아니오 | 84, 192 | `start` | `none` |
| `allow-exists` | 허용 문장이 있어도 | 148, 28 | `start` | `conditional-deny` |
| `source-ip` | aws:SourceIp 대역 밖 | 148, 28 | `start` | `source-ip` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **6줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **5줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 128`이다.

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `request` | 8, 16, 56 |
| `check-deny` | 88, 16, 116 |
| `check-allow` | 236, 16, 96 |
| `default-deny` | 364, 16, 72 |
| `denied` | 96, 88, 100 |
| `allowed` | 234, 88, 100 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `request-deny` | `M64 32 H88` |
| `deny-yes` | `M146 48 V88` |
| `deny-no` | `M204 32 H236` |
| `allow-yes` | `M284 48 V88` |
| `allow-no` | `M332 32 H364` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `yes-1` | 예 | 152, 72 | `start` |
| `no-1` | 아니오 | 220, 26 | `middle` |
| `yes-2` | 예 | 290, 72 | `start` |
| `no-2` | 아니오 | 348, 26 | `middle` |
| `allow-exists` | 허용 문장이 있어도 | 8, 80 | `start` |
| `source-ip` | aws:SourceIp 대역 밖 | 8, 80 | `start` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `conditional-deny` | 조건부 거부 | `request`, `check-deny`, `denied` | `request-deny`, `deny-yes` | `yes-1`, `allow-exists` | 모든 리소스에 허용 문장이 있어도 같은 작업의 조건부 거부가 성립하면 막히고 403이 돌아온다. | `iam-permissions.iam-explicit-deny-precedence` |
| `source-ip` | 대역 밖 IP | `request`, `check-deny`, `denied` | `request-deny`, `deny-yes` | `yes-1`, `source-ip` | aws:SourceIp로 대역을 정해 두면 그 밖에서 온 호출은 권한이 있어도 거부 문장에 걸린다. | `iam-permissions.iam-explicit-deny-precedence` |
| `allowed` | 허용만 | `request`, `check-deny`, `check-allow`, `allowed` | `request-deny`, `deny-no`, `allow-yes` | `no-1`, `yes-2` | 어느 거부에도 걸리지 않고 허용 문장이 있으면 요청이 허용된다. | `iam-permissions.iam-explicit-deny-precedence` |
| `none` | 아무 데도 안 걸림 | `request`, `check-deny`, `check-allow`, `default-deny` | `request-deny`, `deny-no`, `allow-no` | `no-1`, `no-2` | 거부에도 허용에도 걸리지 않으면 요청은 기본 거부로 막힌다. | `iam-permissions.iam-explicit-deny-precedence` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `허용과 거부가 겹치면 어느 쪽이 이길까?`
- `idleCaption`: `요청을 고르면 정책 평가가 어떤 순서로 진행돼 어디에서 끝나는지 볼 수 있다.`
- `legend`: `파랑: 정책을 평가하는 단계 · 회색: 요청과 결과. 명시적 거부부터 차례로 본다.`
- `label`: `정책 평가 순서 도식`, `svgLabel`: `명시적 거부·허용·기본 거부`
- 도식의 `sources`: `iam-permissions.iam-explicit-deny-precedence`
- JSON의 `nodes`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다. 그룹 박스가 없으므로 `groups` 키는 두지 않는다.

### 테스트: `PolicyEvaluationDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 6개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
5. `conditional-deny`와 `source-ip`는 선명한 노드와 보이는 경로가 같고, 보이는 곁말만 다르다(`allow-exists` / `source-ip`).
6. 두 배치 모두 `check-deny`가 흐름에서 `check-allow`보다 앞이다(세로형은 y가 작고, 가로형은 x가 작다).
7. `none`의 마지막 경로는 `default-deny` 상자의 변에서 끝나고, `allowed`의 마지막 경로는 `allowed` 상자의 변에서 끝난다.
8. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
9. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
10. `ConceptList`에 `iam-permissions.iam-explicit-deny-precedence` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

11. `viewBox`가 `0 0 440 128`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
12. 노드 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
13. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 128])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말은 `0..440` 안이다.
14. 세로형의 3번과 5~7번을 가로형에서도 같은 기대값으로 통과한다.
15. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 281개·경로 224개, 가로 노드 281개·경로 224개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 6개·경로 5개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `PolicyEvaluationDiagram.tsx`, `PolicyEvaluationDiagram.test.tsx`, `iam-permissions.json`, `registry.ts`, `phases/63-iam-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 0의 표가 그대로인가.
3. `phases/63-iam-visuals/index.json`의 step 5을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **결과 노드를 초록·빨강으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답이 점유했다(ADR-036). 결과는 글자와 회색 테두리로만 쓴다.
- **SCP·권한 경계·세션 정책을 평가 단계로 더하지 마라.** 이유: 이 개념의 본문은 명시적 거부·허용·기본 거부 셋만 말한다.
- **정책 JSON(Effect·Action·Condition 키 이름)을 그림에 쓰지 마라.** 이유: 이 그림은 판정 순서만 보인다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다. 계정을 청록으로 그리는 위임 관리자 도식(step 8)만 예외다(ADR-037 phase 63).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
