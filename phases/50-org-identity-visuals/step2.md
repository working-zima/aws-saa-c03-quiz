# Step 2: identity-center-diagram

## 배경

`identity-federation` 주제는 IAM Identity Center가 여러 계정의 인증과 권한을 한곳에서 관리하고, **권한 세트**를 사용자·그룹에 계정별로 할당한다고
말한다. step 0이 더한 문장대로, 권한 세트를 계정에 할당하면 Identity Center가 그 계정 안에 IAM 역할을 만들고 사용자는 그 역할을 맡아 들어간다.
할당하지 않은 계정에는 역할이 생기지 않는다. 데이터는 이것과 대비되는 구성도 말한다. 계정마다 IAM 사용자를 만드는 구성은 관리 대상이 계정 수만큼
늘어 확장되지 않는다(`identity-center-external-idp`, `identity-center-permission-set`, 문항 q703·q707의 오답).

이 step은 사용자가 가져온 그림("계정 A에 관리자 권한 할당 → IAM 역할 자동 생성 → 그 역할로 접근")을 이 앱의 도식 규약으로 그린다. "관리자 권한
할당"은 데이터의 말인 **권한 세트 할당**으로 쓴다. 결정은 `docs/ADR.md` ADR-037 끝의 「2026-10-09 확장 — 조직과 Identity Center(phase 50)」와
ADR-038 끝 문단에 있다. **물음형 제목을 단다**(ADR-038). 예시 값은 없다. 사람 이름·이메일을 쓰지 말고 `사용자`·`계정 A/B`로 쓴다.
**Identity Center가 어느 계정에서 켜지는지는 그리지 않는다** — 출처를 더하지 않았다. Identity Center 박스는 계정 박스들 밖에 둔다.

**앵커는 `identity-federation.identity-center-permission-set`이다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두), **ADR-038**(끝 문단 포함), **ADR-039**(끝의 phase 50 확장)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/50-org-identity-visuals/index.json`의 step 0·1 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`(`visualsByTopicId`)
- `src/data/visuals/organizations-cloudtrail-config.json`: step 1이 만든 주제 JSON이다. 같은 모양으로 새 파일을 만든다.
- `src/components/diagrams/OrgScpScopeDiagram.tsx`와 그 테스트: step 1이 만든 도식이다. **구조와 테스트 방식을 맞춰라.** 이 파일은 고치지 마라.
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 노드 블록·경로 형식과 노드 높이 32를 지켜라.
- `src/data/topics.json`의 `identity-federation` 주제 전부(step 0이 고친 `identity-center-permission-set` 포함)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/identity-federation.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만들고,
  `diagrams["identity-center-access"]`를 더한다. `tables`는 빈 객체, `glossary`는 빈 배열이다.
- `src/data/index.ts`의 `visualsByTopicId`에 `'identity-federation'` 키를 더한다. 기존 정렬 방식(알파벳순)을 따른다.

### 2. 자리

- 컴포넌트: `src/components/diagrams/IdentityCenterAccessDiagram.tsx`
- 매핑: `registry.ts`에 `'identity-federation.identity-center-permission-set': IdentityCenterAccessDiagram` 한 줄을 더한다.

### 3. 모양

```
              [사용자]
┌ IAM Identity Center ─────────────────┐
│            [권한 세트]                 │
└──────────────────────────────────────┘
┌ 계정 A ──────────┐ ┌ 계정 B ──────────┐
│ [IAM 역할]        │ │   (곁말)          │
│ [IAM 사용자]      │ │ [IAM 사용자]      │
└──────────────────┘ └──────────────────┘
```

사용자에서 계정으로 가는 화살표는 박스들 **바깥 왼쪽 통로(x 8)**와 **오른쪽 통로(x 270)**로 돌아간다. 박스 안 노드를 뚫지 않게 하려는 것이다.

아래 좌표는 경계·라벨 폭·교차를 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.
`viewBox`는 `0 0 280 256`이다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `identity-center` | IAM Identity Center | 20, 60, 240, 64 |
| `account-a` | 계정 A | 20, 144, 116, 104 |
| `account-b` | 계정 B | 144, 144, 116, 104 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `user` | 사용자 | `stroke-disabled` | 82, 8, 116 |
| `permission-set` | 권한 세트 | `stroke-diagram-managed` | 82, 84, 116 |
| `role-a` | IAM 역할 | `stroke-diagram-resource` | 28, 168, 100 |
| `iam-user-a` | IAM 사용자 | `stroke-diagram-resource` | 28, 208, 100 |
| `iam-user-b` | IAM 사용자 | `stroke-diagram-resource` | 152, 208, 100 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `user-login` | 사용자가 Identity Center에 로그인한다 | `M140 40 V60` (Identity Center 박스 위 변에서 끝난다) |
| `set-role` | 권한 세트를 할당하면 계정 A에 역할이 생긴다 | `M110 116 V168` |
| `user-role` | 사용자가 그 역할을 맡아 계정 A에 들어간다 | `M82 24 H8 V184 H28` |
| `user-iam-a` | 계정 A의 IAM 사용자로 들어간다 | `M82 24 H8 V224 H28` |
| `user-iam-b` | 계정 B의 IAM 사용자로 들어간다 | `M198 24 H270 V224 H252` |

`user-role`과 `user-iam-a`는 같은 왼쪽 통로를 쓰지만 서로 다른 시나리오에서만 보인다.

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리(x, y, `textAnchor`) | 보이는 시나리오 |
|---|---|---|---|
| `creates-role` | 역할을 만든다 | 116, 138, `start` (`set-role` 오른쪽, Identity Center 박스와 계정 박스 사이) | `assign` |
| `assume-role` | 역할을 맡아 접근 | 14, 52, `start` (왼쪽 통로 옆, 사용자 노드 아래) | `assign` |
| `no-assignment` | 할당 없음 | 202, 188, `middle` (계정 B 안, IAM 사용자 위) | `assign` |
| `per-account` | 계정마다 신원을 따로 관리 | 140, 52, `middle` (사용자 노드 아래) | `iam-users` |

### 4. 시나리오 둘

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `assign` | 권한 세트 할당 | `user`, `permission-set`, `role-a` | `user-login`, `set-role`, `user-role` | `creates-role`, `assume-role`, `no-assignment` | 할당하면 계정 A에 IAM 역할이 생기고, 사용자는 포털에서 그 역할을 맡아 들어간다. | `identity-federation.identity-center-permission-set` |
| `iam-users` | 계정마다 IAM 사용자 | `user`, `iam-user-a`, `iam-user-b` | `user-iam-a`, `user-iam-b` | `per-account` | 계정마다 IAM 사용자를 만들면 관리할 신원이 계정 수만큼 늘어 확장되지 않는다. | `identity-federation.identity-center-external-idp`, `identity-federation.identity-center-permission-set` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 320px에서 두 줄이 되도록 50자 이하로 맞췄다.
- `question`: `사용자는 여러 계정에 어떻게 들어갈까?`
- `idleCaption`: `방식을 고르면 사용자가 계정에 들어가는 길을 볼 수 있다.`
- `legend`: `파랑: IAM Identity Center의 권한 세트 · 청록: 계정 안의 IAM 역할과 IAM 사용자 · 회색: 사용자.`
- `label`: `IAM Identity Center 접근 도식`, `svgLabel`: `권한 세트 할당과 계정의 IAM 역할`
- 도식의 `sources`: `identity-federation.identity-center`, `identity-federation.identity-center-permission-set`,
  `identity-federation.identity-center-external-idp`

### 5. 테스트: `IdentityCenterAccessDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. `visualsByTopicId['identity-federation']`가 있고 `tables`는 빈 객체, `glossary`는 빈 배열이다.
2. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
3. 처음(`전체`)에는 노드 다섯이 모두 선명하고, 경로와 곁말이 없다.
4. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
5. `assign`에서 `iam-user-a`·`iam-user-b`의 opacity가 `0.25`다. `iam-users`에서 `permission-set`·`role-a`의 opacity가 `0.25`다.
   그룹 박스 셋은 어느 시나리오에서도 흐려지지 않는다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 넷과 그룹 라벨 셋은 `estimateTextWidth(문구, 9)`로 잰 가로 범위가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `identity-federation.identity-center-permission-set` 개념을 주면 본문 뒤에 이 도식이 온다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - `DiagramFrame.tsx`·`OrgScpScopeDiagram.tsx`·`organizations-cloudtrail-config.json`·`topics.json`·`questions.json`이 그대로인가.
3. `phases/50-org-identity-visuals/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수),
     새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **Identity Center를 관리 계정 안에 그리거나 "관리 계정에서 켠다"고 쓰지 마라.** 이유: 이번에 출처를 더하지 않았다(ADR-037 「phase 50」).
- **역할 이름(AWSReservedSSO 등)·세션 지속 시간·STS·임시 자격 증명 문구를 쓰지 마라.** 이유: 이 도식의 근거에 없다. 역할을 "맡는다"까지만 쓴다.
- **외부 IdP·AD Connector·Cognito를 이 도식에 넣지 마라.** 이유: 사용자가 고른 범위는 권한 세트 할당과 그 대비 구성이다.
- **사람 이름(철수)·이메일·"관리자" 같은 권한 세트 이름을 라벨로 쓰지 마라.** 이유: 데이터에 없는 예시다(ADR-038 「예시의 경계」).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`OrgScpScopeDiagram.tsx`·`topics.json`·`questions.json`·다른 주제의 visuals JSON을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
