# Step 2: role-paths-diagram

## 배경

역할을 맡는 쪽은 셋으로 갈리고, 이 주제의 개념 넷이 그 길을 나눠 말한다.

- `instance-profile`: EC2는 IAM 역할을 인스턴스 프로파일에 연결해 붙인다. 인스턴스에 장기 키를 두는 구성은 어떤 형태든 답이 되지 못한다.
- `iam-roles-anywhere`: 데이터 센터의 시스템이 신뢰한 인증 기관의 X.509 인증서를 제시하면 IAM Roles Anywhere가 역할의 임시 자격 증명과 바꿔 준다.
- `cross-account-iam-role`: 자원이 있는 계정의 역할이 신뢰 정책으로 다른 계정의 주체를 허용하고, 그 주체가 역할을 맡는다.
- `iam-role`: 역할에는 액세스 키가 없고, 맡은 쪽은 임시 자격 증명을 받는다.

문항 q238(EC2)·q686(데이터 센터)·q692·q693(다른 계정)이 이 셋을 상황으로 가른다. 이 step은 맡는 쪽마다 장면 하나씩, 셋이 같은 IAM 역할로
모이는 그림을 만든다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `iam-permissions.cross-account-iam-role`다.** 세 길을 말하는 개념(`instance-profile`·`iam-roles-anywhere`·`cross-account-iam-role`)을 다 읽은 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/63-iam-visuals/index.json`의 앞 step `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/iam-permissions.json`: step 0이 만든 파일이다. 여기에 `diagrams["role-paths"]`를 더한다. **표 셋과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·곁말의 `textAnchor`·가로형 `wide…` 배열과 가로형 `describe`의 최근 선례
- `src/components/diagrams/DriftScopeDiagram.tsx`: 그룹 박스와 그룹 변에서 끝나는 화살표의 선례
- 이 phase의 앞 step이 만든 도식: `src/components/diagrams/GroupPolicyDiagram.tsx`와 그 테스트. **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `iam-permissions` 주제 가운데 `iam-role`, `instance-profile`, `iam-roles-anywhere`, `cross-account-iam-role`, `iam-user-is-account-scoped`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/RolePathsDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["role-paths"]`
- 매핑: `registry.ts`에 `'iam-permissions.cross-account-iam-role': RolePathsDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 줄마다 맡는 쪽(왼쪽)과 역할을 맡기는 수단(오른쪽)을 두고, 맨 아래 오른쪽에 IAM 역할을 둔다. 줄 순서는 개념 순서(EC2 → 데이터 센터 → 다른 계정)다.

```
  [EC2 인스턴스]  → [인스턴스 프로파일] ─┐
┌ 데이터 센터 ┐                         │
│ [시스템]    │ → [IAM Roles Anywhere] ─┤ (오른쪽 통로 x 274)
└─────────────┘                         │
┌ 다른 계정 ──┐                         │
│ [워크로드]  │ → [신뢰 정책]           │
└─────────────┘        ↓                │
                   [IAM 역할] ←──────────┘
```

- 위 두 줄의 수단은 오른쪽 통로(x 274)로 내려가 **역할의 오른쪽 변**으로 들어간다. 신뢰 정책은 곧게 내려가 역할의 위 변으로 들어간다.
- 박스는 맡는 쪽이 있는 곳 둘(데이터 센터, 다른 계정)에만 둔다. **역할을 감싸는 계정 박스는 없다.**

가로형은 열마다 맡는 쪽(위)과 수단(가운데)을 두고 IAM 역할을 아래 가운데에 둔다. 왼쪽·오른쪽 열은 수단 아래에서 꺾여 역할의 옆 변으로 들어간다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·노드 겹침·그룹 라벨 침범·그룹 라벨을 지나는 경로·같은 장면 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고
미리보기로 사용자 승인을 받은 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 280`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `datacenter` | 데이터 센터 | 4, 56, 120, 60 |
| `other-account` | 다른 계정 | 4, 132, 120, 60 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `ec2` | EC2 인스턴스 | `stroke-disabled` | 16, 8, 92 |
| `profile` | 인스턴스 프로파일 | `stroke-diagram-managed` | 152, 8, 116 |
| `system` | 시스템 | `stroke-disabled` | 16, 76, 92 |
| `roles-anywhere` | IAM Roles Anywhere | `stroke-diagram-managed` | 152, 76, 116 |
| `workload` | 워크로드 | `stroke-disabled` | 16, 152, 92 |
| `trust` | 신뢰 정책 | `stroke-diagram-managed` | 152, 152, 116 |
| `role` | IAM 역할 | `stroke-diagram-managed` | 152, 220, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `ec2-profile` | EC2에 인스턴스 프로파일로 역할을 붙인다 | `M108 24 H152` |
| `profile-role` | 인스턴스 프로파일을 거쳐 역할에 이른다 | `M268 24 H274 V236 H268` |
| `system-ra` | 시스템이 X.509 인증서를 제시한다 | `M108 92 H152` |
| `ra-role` | IAM Roles Anywhere가 역할의 임시 자격 증명으로 바꾼다 | `M268 92 H274 V236 H268` |
| `workload-trust` | 다른 계정의 워크로드가 신뢰 정책에 적힌 주체다 | `M108 168 H152` |
| `trust-role` | 신뢰 정책이 허용한 주체가 역할을 맡는다 | `M210 184 V220` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `no-key` | 인스턴스에 키를 두지 않음 | 62, 50 | `middle` | `instance-profile` |
| `cert` | X.509 인증서 제시 | 62, 128 | `middle` | `roles-anywhere` |
| `temp` | 임시 자격 증명을 받는다 | 210, 272 | `middle` | `instance-profile`, `roles-anywhere`, `trust-policy` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **7줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **6줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 224`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `datacenter` | 데이터 센터 | 152, 8, 136, 60 |
| `other-account` | 다른 계정 | 296, 8, 136, 60 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `ec2` | 28, 28, 96 |
| `system` | 172, 28, 96 |
| `workload` | 316, 28, 96 |
| `profile` | 18, 96, 116 |
| `roles-anywhere` | 162, 96, 116 |
| `trust` | 306, 96, 116 |
| `role` | 162, 168, 116 |

**경로**(`widePaths` 맵, 직교 M/H/V만):

| id | `d` |
|---|---|
| `ec2-profile` | `M76 60 V96` |
| `profile-role` | `M76 128 V184 H162` |
| `system-ra` | `M220 60 V96` |
| `ra-role` | `M220 128 V168` |
| `workload-trust` | `M364 60 V96` |
| `trust-role` | `M364 128 V184 H278` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `no-key` | 인스턴스에 키를 두지 않음 | 76, 20 | `middle` |
| `cert` | X.509 인증서 제시 | 228, 82 | `start` |
| `temp` | 임시 자격 증명을 받는다 | 220, 216 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `instance-profile` | EC2 | `ec2`, `profile`, `role` | `ec2-profile`, `profile-role` | `no-key`, `temp` | EC2에는 IAM 역할을 인스턴스 프로파일에 연결해 붙인다. 인스턴스 안에 액세스 키를 두지 않는다. | `iam-permissions.instance-profile`, `iam-permissions.iam-role` |
| `roles-anywhere` | 데이터 센터 | `system`, `roles-anywhere`, `role` | `system-ra`, `ra-role` | `cert`, `temp` | 신뢰한 인증 기관의 X.509 인증서를 IAM Roles Anywhere가 임시 자격 증명으로 바꾼다. | `iam-permissions.iam-roles-anywhere` |
| `trust-policy` | 다른 계정 | `workload`, `trust`, `role` | `workload-trust`, `trust-role` | `temp` | 자원이 있는 계정의 역할이 신뢰 정책으로 다른 계정의 주체를 허용한다. 그 주체가 역할을 맡는다. | `iam-permissions.cross-account-iam-role`, `iam-permissions.iam-user-is-account-scoped` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `역할을 맡는 쪽은 어떤 길로 임시 자격 증명을 받을까?`
- `idleCaption`: `맡는 쪽을 고르면 어떤 수단을 거쳐 IAM 역할에 이르는지 볼 수 있다. 역할에는 액세스 키가 없다.`
- `legend`: `파랑: IAM 역할과 역할을 맡기는 수단 · 회색: 역할을 맡는 쪽. 데이터 센터와 다른 계정은 박스로 나타냈다.`
- `label`: `IAM 역할을 맡는 경로 도식`, `svgLabel`: `인스턴스 프로파일·IAM Roles Anywhere·신뢰 정책`
- 도식의 `sources`: `iam-permissions.iam-role`, `iam-permissions.instance-profile`, `iam-permissions.iam-roles-anywhere`, `iam-permissions.cross-account-iam-role`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `RolePathsDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 7개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 모든 `rect`가 `boxesOutsideViewBox`로 `viewBox` 안이고, `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이며, 폭은 280이다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다. 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. 어떤 경로 선분도 그룹 라벨 영역(가로 `x + 10`부터 `estimateTextWidth(라벨, 9)` 폭, 세로 `y + 7`..`y + 16`)을 지나지 않는다.
6. `system`은 두 배치 모두 `datacenter` 박스 안, `workload`는 `other-account` 박스 안이다. 나머지 다섯 노드는 어느 그룹 박스와도 겹치지 않는다.
7. 시나리오마다 마지막 경로(`profile-role`·`ra-role`·`trust-role`)의 끝점이 두 배치 모두 `role` 상자의 변 위에 있다.
8. 곁말 `temp`는 세 시나리오 모두에서 보인다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `iam-permissions.cross-account-iam-role` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 224`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 224])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 261개·경로 210개, 가로 노드 261개·경로 210개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 7개·경로 6개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·초록·애니메이션이 없는가.
   - 바뀐 파일이 `RolePathsDiagram.tsx`, `RolePathsDiagram.test.tsx`, `iam-permissions.json`, `registry.ts`, `phases/63-iam-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식·step 0의 표가 그대로인가.
3. `phases/63-iam-visuals/index.json`의 step 2을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **역할·인스턴스 프로파일·IAM Roles Anywhere를 계정 박스로 감싸지 마라.** 이유: 어느 계정에 놓이는지 본문이 말하지 않는다(ADR-037 phase 63).
- **S3 같은 대상 자원, STS 노드, `sts:AssumeRole` 같은 API 이름, 인스턴스 메타데이터를 그리지 마라.** 이유: 이 그림은 역할에 이르는 길만 보인다. 이름은 본문이 가르친다.
- **상호 TLS·서명 버전 4·케르베로스를 노드로 더하지 마라.** 이유: 본문이 탈락 이유를 말하는 보기다. 승인된 장면은 셋이다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다. 계정을 청록으로 그리는 위임 관리자 도식(step 8)만 예외다(ADR-037 phase 63).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
