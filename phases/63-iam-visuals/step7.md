# Step 7: region-condition-diagram

## 배경

`iam-requested-region-condition`은 `aws:RequestedRegion`이 요청이 대상으로 삼은 리전을 값으로 갖는 조건 키라고 말한다. 승인된 리전 목록과 맞을 때만
허용하면 잘못된 리전으로 가는 요청이 요청 시점에 차단된다. 요청의 출발지를 보는 `aws:SourceIp`는 목적지 리전을 전혀 제한하지 못하고, 규정에 어긋난
동작을 일어난 뒤에 알려 주는 구성은 실수 자체를 막지 못한다.

문항 q698의 보기 넷 가운데 셋(SourceIp, 사후 알림, 인스턴스 실행만 거부)이 오답이다. 이 step은 앞의 둘과 정답을 장면 셋으로 가른다. 인스턴스 실행만
거부하는 보기는 범위의 문제라 그리지 않는다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `iam-permissions.iam-requested-region-condition`다.** `aws:RequestedRegion`을 정의하는 개념이다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/63-iam-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/iam-permissions.json`: step 0이 만든 파일이다. 여기에 `diagrams["region-condition"]`를 더한다. **표 셋과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례
- `src/components/diagrams/DriftScopeDiagram.tsx`: 그룹 박스와 그룹 변에서 끝나는 화살표의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/GroupPolicyDiagram.tsx`, `src/components/diagrams/RolePathsDiagram.tsx`, `src/components/diagrams/AbacTagDiagram.tsx`, `src/components/diagrams/PermissionsBoundaryDiagram.tsx`, `src/components/diagrams/PolicyEvaluationDiagram.tsx`, `src/components/diagrams/NotActionDenyDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `iam-permissions` 주제 가운데 `iam-requested-region-condition`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/RegionConditionDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["region-condition"]`
- 매핑: `registry.ts`에 `'iam-permissions.iam-requested-region-condition': RegionConditionDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 위에서 아래로 `사용자 → 정책 평가 → (리전 A · 승인됨 | 리전 B · 승인 안 됨)`이고, 리전 B 아래에 `일어난 뒤 알림`을 둔다.
`출발지를 본다`는 사용자 옆, `목적지를 본다`는 정책 평가 옆 곁말이다.

```
          [사용자]        출발지를 본다
          [정책 평가]     목적지를 본다
  [리전 A · 승인됨]   [리전 B · 승인 안 됨]
                      [일어난 뒤 알림]
```

가로형은 사용자 → 정책 평가를 왼쪽에서 오른쪽으로 두고, 리전 둘과 알림을 오른쪽 열에 세로로 둔다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고
미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 288`이다.

그룹 박스는 없다.

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `user` | 사용자 | `stroke-disabled` | 82, 8, 116 |
| `policy` | 정책 평가 | `stroke-diagram-managed` | 82, 80, 116 |
| `region-a` | 리전 A · 승인됨 | `stroke-diagram-managed` | 12, 176, 116 |
| `region-b` | 리전 B · 승인 안 됨 | `stroke-diagram-managed` | 152, 176, 116 |
| `notify` | 일어난 뒤 알림 | `stroke-diagram-managed` | 152, 248, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `user-policy` | 사용자의 요청이 정책 평가를 지난다 | `M140 40 V80` |
| `policy-a` | 리전 A로 가는 요청 | `M110 112 V144 H70 V176` |
| `policy-b` | 리전 B로 가는 요청 | `M170 112 V144 H210 V176` |
| `b-notify` | 리전 B에서 일어난 일을 뒤에 알린다 | `M210 208 V248` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `origin` | 출발지를 본다 | 206, 28 | `start` | `source-ip` |
| `destination` | 목적지를 본다 | 206, 100 | `start` | `requested-region` |
| `a-allowed` | 허용 | 70, 224 | `middle` | `requested-region` |
| `b-denied` | 요청 시점에 거부 | 210, 224 | `middle` | `requested-region` |
| `b-reached` | 막지 못함 | 210, 224 | `middle` | `source-ip` |
| `happened` | 이미 일어남 | 144, 268 | `end` | `after-fact` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **5줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **4줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 208`이다.

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `user` | 8, 56, 88 |
| `policy` | 136, 56, 104 |
| `region-a` | 284, 8, 120 |
| `region-b` | 284, 104, 120 |
| `notify` | 284, 168, 120 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `user-policy` | `M96 72 H136` |
| `policy-a` | `M240 64 H256 V24 H284` |
| `policy-b` | `M240 80 H256 V120 H284` |
| `b-notify` | `M300 136 V168` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `origin` | 출발지를 본다 | 52, 108 | `middle` |
| `destination` | 목적지를 본다 | 188, 108 | `middle` |
| `a-allowed` | 허용 | 344, 56 | `middle` |
| `b-denied` | 요청 시점에 거부 | 352, 152 | `middle` |
| `b-reached` | 막지 못함 | 352, 152 | `middle` |
| `happened` | 이미 일어남 | 276, 188 | `end` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `requested-region` | aws:RequestedRegion | `user`, `policy`, `region-a`, `region-b` | `user-policy`, `policy-a` | `destination`, `a-allowed`, `b-denied` | aws:RequestedRegion은 요청이 향한 리전을 본다. 목록 밖 리전이면 요청 시점에 막힌다. | `iam-permissions.iam-requested-region-condition` |
| `source-ip` | aws:SourceIp | `user`, `policy`, `region-a`, `region-b` | `user-policy`, `policy-a`, `policy-b` | `origin`, `b-reached` | aws:SourceIp는 요청이 출발한 곳을 본다. 목적지 리전은 전혀 제한하지 못한다. | `iam-permissions.iam-requested-region-condition` |
| `after-fact` | 일어난 뒤 알림 | `user`, `policy`, `region-b`, `notify` | `user-policy`, `policy-b`, `b-notify` | `happened` | 규정에 어긋난 동작을 일어난 뒤에 알리는 구성은 실수로 일어나는 것 자체를 막지 못한다. | `iam-permissions.iam-requested-region-condition` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `승인된 리전 밖으로 가는 요청은 무엇이 막을까?`
- `idleCaption`: `구성을 고르면 조건이 요청의 어느 쪽을 보고, 승인되지 않은 리전으로 가는 요청이 어떻게 되는지 볼 수 있다.`
- `legend`: `파랑: 정책 평가와 리전, 알림 구성 · 회색: 요청을 보내는 사용자. 리전 A·B는 구별하는 이름이다.`
- `label`: `리전 조건 키 도식`, `svgLabel`: `aws:RequestedRegion·aws:SourceIp·사후 알림`
- 도식의 `sources`: `iam-permissions.iam-requested-region-condition`
- JSON의 `nodes`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다. 그룹 박스가 없으므로 `groups` 키는 두지 않는다.

### 테스트: `RegionConditionDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 5개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
5. `requested-region`에서는 `region-b` 상자의 변에서 끝나는 경로가 없고 곁말 `b-denied`가 보인다. `source-ip`에서는 `region-b`의 변에서 끝나는 경로가 있고 곁말 `b-reached`가 보인다.
6. `after-fact`의 마지막 경로는 `notify` 상자의 변에서 끝나고, `region-a`는 `0.25`다.
7. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
8. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
9. `ConceptList`에 `iam-permissions.iam-requested-region-condition` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

10. `viewBox`가 `0 0 440 208`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
11. 노드 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
12. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 208])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말은 `0..440` 안이다.
13. 세로형의 3번과 5~6번을 가로형에서도 같은 기대값으로 통과한다.
14. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 시나리오 하나를 고른 뒤, 모의의 `change` 리스너를 `matches: true`로 불러(`act`)
    `viewBox` 폭이 440이 되었는지, 그 버튼이 여전히 `aria-pressed="true"`인지, 캡션이 그대로인지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 292개·경로 233개, 가로 노드 292개·경로 233개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 5개·경로 4개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `RegionConditionDiagram.tsx`, `RegionConditionDiagram.test.tsx`, `iam-permissions.json`, `registry.ts`, `phases/63-iam-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 0의 표가 그대로인가.
3. `phases/63-iam-visuals/index.json`의 step 7을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **서울·us-east-1 같은 실제 리전 이름을 쓰지 마라.** 이유: 리전 이름은 `A`·`B`로 남긴다(ADR-038 「예시의 경계」).
- **IP 숫자나 CIDR을 쓰지 마라.** 이유: 이 주제의 본문에 예시 값이 없다.
- **인스턴스 실행만 거부하는 구성을 장면으로 더하지 마라.** 이유: 사용자가 승인한 장면은 셋이다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다. 계정을 청록으로 그리는 위임 관리자 도식(step 8)만 예외다(ADR-037 phase 63).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
