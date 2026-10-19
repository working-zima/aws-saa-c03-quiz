# Step 3: runtime-role-diagram

## 배경

여러 팀이 한 EMR 클러스터를 함께 쓸 때의 두 물음 — **누가 어느 데이터에 닿는가**와 **무엇이 암호화되는가** — 은 이 주제의 개념 둘이
나눠 맡는다.

- `emr-runtime-role`: 기본 구성에서는 작업이 클러스터 EC2 인스턴스의 **인스턴스 프로파일** 권한으로 돌아, 작업을 낸 모든 팀이 같은 권한을 갖는다.
  **런타임 역할**을 쓰면 작업을 제출할 때 그 작업의 IAM 역할을 지정하므로 팀마다 허용된 S3 데이터에만 닿는다. 인스턴스 프로파일이 런타임 역할을
  **인수**하고, 런타임 역할은 인스턴스 프로파일 역할을 **신뢰**해야 한다.
- `emr-security-configuration`: 저장 중·전송 중 암호화를 한 벌로 묶은 **보안 구성**을 클러스터에 적용하면 S3와 로컬 디스크의 데이터와 노드 사이를
  오가는 데이터가 함께 암호화된다.

문항 q630(팀마다 S3 접근을 나누기)과 q631(S3·로컬 디스크·노드 사이를 모두 암호화)은 **서로를 오답으로 낸다** — q630의 보기에 보안 구성이, q631의
보기에 런타임 역할과 인스턴스 프로파일이 있다. 이 step은 접근과 암호화를 한 그림에 두고 장면 넷으로 가른다.

사용자 결정(2026-10-19)은 `docs/ADR.md` ADR-037 끝의 「2026-10-19 확장 — EMR·Glue·Athena·Lake Formation 주제(phase 62)」와 ADR-038 끝 문단에 있다.
**물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다. **세로형과 가로형을 함께 만든다**(ADR-047·ADR-048, UI_GUIDE 「넓은 화면의 가로형」).
아래 좌표와 문구는 사용자가 미리보기로 승인한 것이다.

**앵커는 `emr-glue-athena.emr-security-configuration`다.** 런타임 역할과 보안 구성을 다 읽은 자리다. 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 62), **ADR-038**(끝 문단 포함), **ADR-047, ADR-048**
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**(「넓은 화면의 가로형」, 「수량과 상태를 바꾸는 도식」, 「물음형 제목과 예시」 포함)
- `phases/62-analytics-visuals/index.json`의 step 0~2 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/emr-glue-athena.json`: step 0이 만든 파일이다. 여기에 `diagrams["runtime-role"]`를 더한다. **표 둘과 앞 step의 도식 문구는 고치지 마라.**
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: JSON 문구·물음형 제목·그룹 박스·그룹 변에서 끝나는 화살표·가로형 `describe`의 선례.
  **구조와 테스트 방식을 맞춰라.**
- `src/components/diagrams/IdentityCenterAccessDiagram.tsx`: 곁말마다 `textAnchor`를 두고, 가로형 곁말이 자기 `textAnchor`를 갖는 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/hooks/useWideDiagram.ts`와 그 테스트: 배치 판정 훅과 `matchMedia` 모의 방식
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [`·`const wideNodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `emr-glue-athena` 주제 가운데 `emr-runtime-role`, `emr-security-configuration`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/EmrRuntimeRoleDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["runtime-role"]`
- 매핑: `registry.ts`에 `'emr-glue-athena.emr-security-configuration': EmrRuntimeRoleDiagram` 한 줄을 더한다. import는 기존 정렬 방식(모듈 경로 알파벳순)을 따른다.
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

세로형은 맨 위에 팀의 작업 둘, 가운데 클러스터 박스(안에 런타임 역할 둘·인스턴스 프로파일·노드 둘), 그 아래 S3 데이터 둘, 맨 아래 보안 구성을 둔다.

```
   [팀 A의 작업]        [팀 B의 작업]
┌ EMR 클러스터 ────────────────────────┐
│  [런타임 역할 A]     [런타임 역할 B]  │
│        [인스턴스 프로파일]            │
│  [노드]        →     [노드]           │
└──────────────────────────────────────┘
   [S3 데이터 A]        [S3 데이터 B]
         [보안 구성]
```

- 기본 구성의 화살표는 두 열 사이 통로(x 136·144)로 내려가 인스턴스 프로파일을 지나고, S3 위의 통로(y 264)에서 좌우로 갈라진다.
- 런타임 역할의 화살표는 역할에서 클러스터 안 바깥 통로(x 24·256)로 내려가 S3의 바깥 변으로 들어간다. 인스턴스 프로파일을 지나지 않는다.
- 보안 구성의 화살표는 S3 둘 사이(x 140)로 올라가 **클러스터 박스의 아래 변에서 끝난다**(DriftScope의 "그룹 변에서 끝나는 화살표"와 같다).

가로형은 같은 세 층(작업 · 클러스터 · S3)을 유지하되 클러스터 안 오른쪽에 노드 둘을 나란히 두고, 보안 구성을 오른쪽 아래(클러스터 밖)에 둔다.
경로가 모두 곧은 수직선이 된다.

### 세로형 좌표 (출발점)

아래 좌표는 경계·라벨 폭·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속·곁말 겹침을 스크립트로 맞추고 미리보기로 사용자 승인을 받은
**출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 280 376`이다.

**그룹 박스**(`groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `cluster` | EMR 클러스터 | 4, 56, 272, 196 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `job-a` | 팀 A의 작업 | `stroke-disabled` | 36, 8, 92 |
| `job-b` | 팀 B의 작업 | `stroke-disabled` | 152, 8, 92 |
| `role-a` | 런타임 역할 A | `stroke-diagram-managed` | 36, 88, 92 |
| `role-b` | 런타임 역할 B | `stroke-diagram-managed` | 152, 88, 92 |
| `profile` | 인스턴스 프로파일 | `stroke-diagram-managed` | 82, 144, 116 |
| `node-1` | 노드 | `stroke-diagram-managed` | 36, 200, 92 |
| `node-2` | 노드 | `stroke-diagram-managed` | 152, 200, 92 |
| `s3-a` | S3 데이터 A | `stroke-diagram-managed` | 36, 280, 92 |
| `s3-b` | S3 데이터 B | `stroke-diagram-managed` | 152, 280, 92 |
| `security` | 보안 구성 | `stroke-diagram-managed` | 82, 336, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `job-a-profile` | 팀 A의 작업이 인스턴스 프로파일 권한으로 돈다 | `M128 24 H136 V144` |
| `job-b-profile` | 팀 B의 작업도 같은 권한으로 돈다 | `M152 24 H144 V144` |
| `profile-s3-a` | 같은 권한으로 S3 데이터 A에 닿는다 | `M136 176 V264 H82 V280` |
| `profile-s3-b` | 같은 권한으로 S3 데이터 B에 닿는다 | `M144 176 V264 H198 V280` |
| `job-a-role-a` | 팀 A의 작업에 런타임 역할 A를 지정한다 | `M82 40 V88` |
| `job-b-role-b` | 팀 B의 작업에 런타임 역할 B를 지정한다 | `M198 40 V88` |
| `role-a-s3-a` | 역할 A는 S3 데이터 A에만 닿는다 | `M36 104 H24 V296 H36` |
| `role-b-s3-b` | 역할 B는 S3 데이터 B에만 닿는다 | `M244 104 H256 V296 H244` |
| `profile-role-a` | 인스턴스 프로파일이 역할 A를 인수한다 | `M100 144 V120` |
| `profile-role-b` | 인스턴스 프로파일이 역할 B를 인수한다 | `M180 144 V120` |
| `node-node` | 노드 사이를 오가는 데이터 | `M128 216 H152` |
| `security-cluster` | 보안 구성을 클러스터에 적용한다 | `M140 336 V252` |

**곁말**(`notes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다):

| id | 글 | x, y | `textAnchor` | 보이는 시나리오 |
|---|---|---|---|---|
| `same-permission` | 같은 권한 | 206, 164 | `start` | `instance-profile` |
| `per-job` | 작업마다 역할 지정 | 140, 76 | `middle` | `runtime-role` |
| `assumes` | 역할을 인수 | 206, 164 | `start` | `trust` |
| `in-transit` | 전송 중 | 140, 194 | `middle` | `encryption` |
| `at-rest` | 저장 중: S3와 로컬 디스크 | 140, 246 | `middle` | `encryption` |

### 가로형 좌표 (출발점)

- `useWideDiagram()`이 `true`면 아래 좌표로 그린다. 가로형 래퍼 `div`의 클래스는 `w-full` 하나다(세로형 래퍼는 기존 도식과 같은 `-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0`).
- `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **10줄을 그대로 적는다.** `widePaths`는 `'id': 'M…'` 한 줄씩 **12줄을 그대로 적는다.** 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 노드 id·경로 id·시나리오·문구·색·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다(상태를 컴포넌트에 둔다).

`viewBox`는 `0 0 440 232`이다.

**그룹 박스**(`wideGroups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 자리는 `x + 10`, `y + 14`):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `cluster` | EMR 클러스터 | 4, 56, 432, 112 |

**노드**(`wideNodes`, 높이 32, 라벨·색은 세로형 `nodes`에서 id로 가져온다):

| id | x, y, 폭 |
|---|---|
| `job-a` | 40, 8, 92 |
| `job-b` | 196, 8, 92 |
| `role-a` | 40, 80, 92 |
| `role-b` | 196, 80, 92 |
| `profile` | 116, 124, 100 |
| `node-1` | 312, 100, 48 |
| `node-2` | 380, 100, 48 |
| `s3-a` | 40, 192, 92 |
| `s3-b` | 196, 192, 92 |
| `security` | 320, 192, 104 |

**경로**(`widePaths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | `d` |
|---|---|
| `job-a-profile` | `M132 24 H160 V124` |
| `job-b-profile` | `M196 24 H172 V124` |
| `profile-s3-a` | `M124 156 V192` |
| `profile-s3-b` | `M208 156 V192` |
| `job-a-role-a` | `M86 40 V80` |
| `job-b-role-b` | `M242 40 V80` |
| `role-a-s3-a` | `M60 112 V192` |
| `role-b-s3-b` | `M268 112 V192` |
| `profile-role-a` | `M124 124 V112` |
| `profile-role-b` | `M208 124 V112` |
| `node-node` | `M360 116 H380` |
| `security-cluster` | `M372 192 V168` |

**곁말**(`wideNotes`, 크기 9, `fill-muted`. 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다. 보이는 시나리오는 세로형 `notes`에서 id로 가져온다):

| id | 글 | x, y | `textAnchor` |
|---|---|---|---|
| `same-permission` | 같은 권한 | 224, 144 | `start` |
| `per-job` | 작업마다 역할 지정 | 164, 72 | `middle` |
| `assumes` | 역할을 인수 | 224, 144 | `start` |
| `in-transit` | 전송 중 | 370, 94 | `middle` |
| `at-rest` | 저장 중: S3와 로컬 디스크 | 370, 152 | `middle` |

### 시나리오

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `instance-profile` | 기본 구성 | `job-a`, `job-b`, `profile`, `s3-a`, `s3-b` | `job-a-profile`, `job-b-profile`, `profile-s3-a`, `profile-s3-b` | `same-permission` | 기본 구성에서는 작업이 인스턴스 프로파일 권한으로 돈다. 작업을 낸 모든 팀이 같은 권한을 갖는다. | `emr-glue-athena.emr-runtime-role` |
| `runtime-role` | 런타임 역할 | `job-a`, `job-b`, `role-a`, `role-b`, `s3-a`, `s3-b` | `job-a-role-a`, `job-b-role-b`, `role-a-s3-a`, `role-b-s3-b` | `per-job` | 작업을 제출할 때 IAM 역할을 지정한다. 팀마다 역할을 달리 주면 허용된 S3 데이터에만 닿는다. | `emr-glue-athena.emr-runtime-role` |
| `trust` | 역할 인수 | `profile`, `role-a`, `role-b` | `profile-role-a`, `profile-role-b` | `assumes` | 인스턴스 프로파일이 런타임 역할을 인수하므로, 런타임 역할이 인스턴스 프로파일 역할을 신뢰해야 한다. | `emr-glue-athena.emr-runtime-role` |
| `encryption` | 보안 구성 | `security`, `node-1`, `node-2`, `s3-a`, `s3-b` | `security-cluster`, `node-node` | `in-transit`, `at-rest` | 보안 구성 하나를 적용하면 S3·로컬 디스크의 데이터와 노드 사이를 오가는 데이터가 함께 암호화된다. | `emr-glue-athena.emr-security-configuration` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `클러스터를 함께 쓰는 팀의 권한과 암호화는 무엇이 정할까?`
- `idleCaption`: `구성을 고르면 작업이 어떤 권한으로 데이터에 닿고 무엇이 암호화되는지 볼 수 있다.`
- `legend`: `파랑: AWS 서비스와 IAM 권한 · 회색: 팀이 제출한 작업. 큰 박스가 EMR 클러스터 하나다.`
- `label`: `EMR 권한과 암호화 도식`, `svgLabel`: `인스턴스 프로파일·런타임 역할·보안 구성`
- 도식의 `sources`: `emr-glue-athena.emr-runtime-role`, `emr-glue-athena.emr-security-configuration`
- JSON의 `nodes`·`groups`·`notes`에는 위 표의 라벨과 글을 그대로 넣는다.

### 테스트: `EmrRuntimeRoleDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 세로형 테스트는 `matchMedia` 없이(jsdom 기본값) 돌리고, 가로형 테스트는
`describe('가로형 (768px 이상)', …)` 하나로 묶어 그 안에서만 `vi.stubGlobal('matchMedia', …)`으로 `matches: true`를 준다. `afterEach`에서
`vi.unstubAllGlobals()`로 되돌린다.

세로형:

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 10개가 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말, 캡션이 위 표와 같다. 선명한 노드 밖의 노드는 opacity가 `0.25`다. 그룹 박스는 어느
   시나리오에서도 흐려지지 않는다.
4. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`), 관문 7(폭 280)을 통과한다.
   곁말과 그룹 라벨은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이고, 그룹 라벨은 자기 박스 오른쪽 끝을 넘지 않는다.
5. `security-cluster`의 끝점은 두 배치 모두 클러스터 박스의 **아래 변 위**에 있다(세로형 y 252, 가로형 y 168).
6. `trust`의 두 경로는 두 배치 모두 끝점의 y가 시작점의 y보다 작다(인스턴스 프로파일에서 **위로** 역할에 닿는다).
7. `runtime-role`에서 `profile`은 `0.25`이고, 보이는 경로 넷 어느 것도 인스턴스 프로파일 상자에 닿지 않는다.
8. 작업 둘·S3 데이터 둘·보안 구성은 두 배치 모두 클러스터 박스 **밖**이고, 역할 둘·인스턴스 프로파일·노드 둘은 **안**이다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).
10. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같고, 문구·근거를 JSON에서 읽는다.
11. `ConceptList`에 `emr-glue-athena.emr-security-configuration` 개념을 주면 본문 뒤에 이 도식이 온다.

가로형:

12. `viewBox`가 `0 0 440 232`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
13. 노드 id 집합과 그룹 id 집합이 세로형과 같다. 시나리오를 모두 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형과 같다.
14. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 232])`로 안에 있다. 노드 라벨은 `estimateTextWidth + 12`로 들어가고, 곁말과
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
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 231개·경로 192개, 가로 노드 231개·경로 192개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 마지막 줄의 수는 이 step까지의 누적이다
(이 도식이 노드 10개·경로 12개를 더한다).

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - 바뀐 파일이 `EmrRuntimeRoleDiagram.tsx`, `EmrRuntimeRoleDiagram.test.tsx`, `emr-glue-athena.json`, `registry.ts`, `phases/62-analytics-visuals/index.json`뿐인가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 도식이 그대로인가.
3. `phases/62-analytics-visuals/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 두 배치의 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`EnableApplicationScopedIAMRole`·`sts:AssumeRole` 같은 설정·권한 이름, 인스턴스 메타데이터 서비스를 그리거나 쓰지 마라.** 이유: 본문에는 있지만
  도식은 권한의 흐름만 보인다. 이름은 본문이 가르친다(ADR-037 phase 62).
- **KMS 키나 암호화 방식(키 종류)을 그리지 마라.** 이유: 이 개념의 본문에 없다.
- **암호화된 EBS 볼륨을 붙이는 오답 구성을 장면으로 더하지 마라.** 이유: 사용자가 승인한 장면은 넷이다. 그 오답은 캡션의 "S3·로컬 디스크와 노드
  사이가 함께"가 가른다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 주제의 본문에는 VPC 안 자원이 나오지 않는다(ADR-037 phase 62).
- **SVG 두 개를 그려 놓고 CSS(`md:hidden` 등)로 하나를 숨기지 마라.** 이유: ADR-047 「대안」 — jsdom에서 같은 이름의 그림이 둘이 된다.
- **기준 폭 문자열(`'(min-width: 768px)'`)을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다(UI_GUIDE).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식·step 0의 표를 고치지 마라.**
  이유: step마다 한 장씩 맡고, 공용 컴포넌트와 콘텐츠 원본은 이 phase의 범위가 아니다.
- 기존 테스트를 깨뜨리지 마라.
