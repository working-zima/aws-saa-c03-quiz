# Step 0: iam-tables

## 배경

`iam-permissions` 주제(개념 22개)에 시각 자료를 들인다. 이 step은 비교표 셋과 이 주제의 시각 자료 JSON 파일을 만든다. 도식 여덟 장은 step 1~8이 더한다.

- **IAM 그룹에 넣을 수 있는 것**: 그룹은 같은 계정의 사용자만 담는다. 문항 q239(그룹에 넣을 수 있는 대상)·q238(EC2를 그룹에 넣는 보기)·q692·q693(다른 계정의
  사용자를 그룹에 넣는 보기)을 가른다.
- **IAM 사용자와 IAM 역할의 자격 증명**: 액세스 키와 임시 자격 증명을 견준다. q156·q157을 가른다. 「멈추는 방법」 행은 이 phase가 올라선 커밋
  `1f55c24`(fix: 유출된 액세스 키 문장)가 고친 본문과 같은 사실을 쓴다.
- **권한 검토에서 함께 비교되는 것**: IAM Access Analyzer와 그 오답들. q687·q688의 보기를 그대로 가른다.

이 앱의 비교표 규약(ADR-037)을 따른다. 사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 주제(phase 63)」에 있다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62와 phase 63), **ADR-039 끝의 「2026-10-19 확장 — 유출된 액세스 키의 처리」**
- `docs/UI_GUIDE.md`의 **「비교표」**. 특히 끊을 수 없는 영문 이름과 긴 한글 낱말의 열 폭 규칙
- `src/types/visuals.ts`: `TopicVisuals`, `ComparisonTable`(선택 필드 `columnWidths`)
- `src/data/index.ts`: `visualsByTopicId`
- `src/data/visuals/emr-glue-athena.json`: 주제 JSON 파일의 최근 선례
- `src/data/visuals.test.ts`
- `src/components/diagrams/ComparisonTableFigure.tsx`: **이 컴포넌트를 그대로 쓴다. 고치지 마라.** `가능`·`불가` 칸은 이 컴포넌트가 굵게 쓴다.
- `src/components/diagrams/analyticsTables.tsx`, `src/components/diagrams/analyticsTables.test.tsx`: 표 래퍼와 테스트의 선례
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 `iam-permissions` 주제 개념 전부(22개)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/iam-permissions.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만든다.
- `src/data/index.ts`에 이 파일의 import(`iamPermissionsVisuals`)와 `visualsByTopicId['iam-permissions']` 키를 더한다. 기존 import·키의 정렬 방식(알파벳순)을
  따른다. 이 키는 `governance-iac`와 `identity-federation` 사이다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).
- `diagrams`는 빈 객체로 둔다. step 1~8이 채운다.

### 2. JSON `tables["group-members"]`

- 앵커: `iam-permissions.iam-user-is-account-scoped`. 그룹이 담을 수 있는 것을 말하는 개념 셋(`iam-user`·`iam-group-users-only`·`iam-user-is-account-scoped`)을 다 읽은 자리다.
- `label`: `IAM 그룹에 넣을 수 있는 것`
- `columns`: `["대상","그룹에 넣기","권한을 주는 방법"]`
- `columnWidths`: `["34%","20%","46%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 88.9 / 48.6 / 123.5px이다. 가운데 열 머리 `그룹에 넣기`는 `그룹에`(42px, Windows Chrome 한글 14px)에서 줄을 바꾼다.
- `sources`: `iam-permissions.iam-user`, `iam-permissions.iam-group-users-only`, `iam-permissions.iam-user-is-account-scoped`, `iam-permissions.iam-policy`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 괄호도 그대로다.

| 대상 | 그룹에 넣기 | 권한을 주는 방법 |
|---|---|---|
| 같은 계정의 IAM 사용자 | 가능 | 그룹에 넣으면 그룹에 붙인 정책을 받는다 |
| 다른 계정의 IAM 사용자 | 불가 | 자원이 있는 계정의 역할을 신뢰 정책으로 허용한다 |
| EC2 인스턴스 | 불가 | IAM 역할을 쓴다 |
| IAM 역할 | 불가 | 역할에 정책을 직접 붙인다 |

근거: 같은 계정 — `iam-user` p1 / 다른 계정 — `iam-user-is-account-scoped` p0·p1 / EC2 — `iam-group-users-only` p0 / IAM 역할 — `iam-user` p1, `iam-policy` p2

### 3. JSON `tables["credentials"]`

- 앵커: `iam-permissions.iam-role`. IAM 사용자와 IAM 역할을 다 읽은 자리다.
- `label`: `IAM 사용자와 IAM 역할의 자격 증명`
- `columns`: `["견주는 것","IAM 사용자","IAM 역할"]`
- `columnWidths`: `["24%","40%","36%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 60.1 / 106.2 / 94.7px이다. 가장 긴 덩어리 `비활성화하거나`(98px)가 40% 열에 들어간다. 37%에서는 단어 가운데에서 끊겼다(미리보기 Chrome 실측).
- `sources`: `iam-permissions.iam`, `iam-permissions.iam-user`, `iam-permissions.iam-role`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 괄호도 그대로다.

| 견주는 것 | IAM 사용자 | IAM 역할 |
|---|---|---|
| 접근 수단 | 액세스 키(만료 시점 없음) | 역할을 맡아 받는 임시 자격 증명 |
| 보관과 전달 | 사용자가 키를 직접 보관한다 | 자격 증명을 서로 건넬 필요가 없다 |
| 멈추는 방법 | 키를 비활성화하거나 삭제한다. 그 전까지 계속 유효하다 | 필요할 때 언제든 역할을 해제한다 |

근거: 접근 수단 — `iam` p1, `iam-user` p0, `iam-role` p0 / 보관과 전달 — `iam-user` p0, `iam-role` p0 / 멈추는 방법 — `iam-user` p0, `iam-role` p0

### 4. JSON `tables["analyzer-tools"]`

- 앵커: `iam-permissions.network-access-analyzer`. IAM Access Analyzer·위임 관리자·Network Access Analyzer를 다 읽은 자리다.
- `label`: `권한 검토에서 함께 비교되는 것`
- `columns`: `["도구·구성","다루는 것","하는 일"]`
- `columnWidths`: `["34%","26%","40%"]`. **이 값을 바꾸지 마라.** 320px에서 열 안쪽 폭은 88.9 / 65.9 / 106.2px이다. 행 머리의 영문 낱말(`Network`·`Analyzer`, 굵기 500)은 공백에서 줄을 바꾸고 낱말 하나는 88.9px보다 짧다.
- `sources`: `iam-permissions.iam-access-analyzer`, `iam-permissions.network-access-analyzer`, `iam-permissions.permissions-boundary`
- `rows`: 아래 표의 **순서와 문구를 그대로** 쓴다. 칸 문장은 원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009). 띄어쓰기와 괄호도 그대로다.

| 도구·구성 | 다루는 것 | 하는 일 |
|---|---|---|
| IAM Access Analyzer | 정책이 부여한 권한 | 외부 주체와 공유되는 리소스와 최소 권한에서 벗어난 부분을 찾는다 |
| Network Access Analyzer | VPC 네트워크 경로 | VPC 안에서 통신이 어디까지 닿는지 분석한다. 권한 정책은 다루지 않는다 |
| 변경 경보 구성 | 리소스 생성과 변경 | 일이 일어났다는 사실을 알린다. 권한이 얼마나 넓은지는 분석하지 못한다 |
| 권한 경계 | 주체 하나의 권한 상한 | 그 주체가 가질 수 있는 권한의 최대치를 정한다 |

근거: IAM Access Analyzer — `iam-access-analyzer` summary·p0 / Network Access Analyzer — `network-access-analyzer` p0 / 변경 경보 구성 — `iam-access-analyzer` p1 / 권한 경계 — `permissions-boundary` p0

### 5. 래퍼와 매핑

- `src/components/diagrams/iamTables.tsx`에 `GroupMembersTable`·`CredentialTable`·`AnalyzerToolTable`을 둔다. `analyticsTables.tsx`처럼 JSON 표를
  `ComparisonTableFigure`에 넘기기만 한다.
- `registry.ts`에 세 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따르고, 키는 기존 키들 **뒤에 이 주제의 줄을 모아** 둔다.
- step 1~8이 도식 줄을 개념 순서대로 이 사이와 뒤에 끼운다. phase가 끝났을 때 이 주제의 줄은 아래 순서다.

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

### 6. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

새 파일 `src/components/diagrams/iamTables.test.tsx`:

1. `visualsByTopicId['iam-permissions']`가 있고 `glossary`는 빈 배열이다. `diagrams`의 내용은 단언하지 마라 — step 1~8이 도식을 더하면 깨진다.
2. 세 표 각각의 `label`·`columns`·`columnWidths`·`sources`가 위와 같고, 행 머리가 위 순서와 같으며 칸 문구가 위 표와 같다.
3. `group-members`의 둘째 열은 `가능`·`불가`만 쓰고(첫 행만 `가능`), 나머지 두 표의 어느 칸에도 `가능`·`불가`가 없다. 세 표 어디에도 `O`·`X`·`○`·`×`
   한 글자짜리 판정이 없다.
4. 렌더된 `colgroup`의 폭이 각 표의 `columnWidths`와 같다.
5. `ConceptList`에 각 앵커 개념(`iam-permissions.iam-user-is-account-scoped`·`iam-permissions.iam-role`·`iam-permissions.network-access-analyzer`)을 주면
   본문 뒤에 그 표가 `figure` 하나로 오고, 그 접근성 이름이 `label`과 같다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 247개·경로 200개, 가로 노드 247개·경로 200개'
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 칸에 위 표 밖의 사실이 없는가.
   - 판정에 색·이모지·O/X가 없는가.
   - `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`topics.json`·`questions.json`·다른 주제의 visuals JSON이 그대로인가.
   - 기존 테스트를 고치지 않았는가.
3. `phases/63-iam-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 표 id 셋과 앵커, 래퍼 이름, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`columnWidths`를 바꾸거나 칸 문구를 다듬지 마라.** 이유: 320px에서 영문 이름과 긴 한글 낱말이 끊기지 않는 폭과 문구로 정했다. 문구를 바꾸면
  줄바꿈이 달라진다.
- **`group-members`에서 `인스턴스 프로파일`이라는 말을 쓰지 마라.** 이유: 이 표의 앵커(개념 5번째)는 인스턴스 프로파일을 정의하는 개념(7번째)보다 앞이다.
  EC2 행은 `iam-group-users-only`의 말인 "IAM 역할을 쓴다"로 쓴다.
- **`credentials`에 「회수할 방법이 없다」를 쓰지 마라.** 이유: AWS 공식 문서와 어긋나 ADR-039 「2026-10-19 확장」에서 고친 문장이다.
- **분석 도구 표에 SCP 행을 더하지 마라.** 이유: 이 주제의 본문은 SCP가 분석 도구인지 말하지 않는다. q688의 SCP 보기는 표 밖이다.
- **판정을 색으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036, UI_GUIDE 「비교표」).
- **`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 실측·검증을 마친 공용 컴포넌트와 콘텐츠 원본이다.
- **약어 툴팁을 더하지 마라.** 이유: 약어 툴팁은 VPC 주제에만 둔다(ADR-037).
- **도식을 만들지 마라.** 이유: step 1~8의 범위다.
- 기존 테스트를 깨뜨리지 마라.
