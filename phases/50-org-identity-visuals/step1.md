# Step 1: org-scp-diagram

## 배경

`organizations-cloudtrail-config` 주제는 SCP를 **어디에 붙이느냐**를 묻는다. 붙일 수 있는 자리는 조직의 루트, OU, 개별 멤버 계정이고, 붙인 자리
아래에만 적용된다. 루트에 붙이면 제한할 생각이 없던 계정까지 걸린다(q717·q718의 함정). step 0이 더한 문장대로 관리 계정은 예외라서, 루트에
붙여도 관리 계정에는 걸리지 않는다.

이 step은 조직의 구조(루트 · 관리 계정 · OU · 멤버 계정)와 SCP가 걸리는 범위를 도식 하나로 그린다. 사용자가 가져온 그림은 Organizations를
관리 계정 아래 가지로 그렸지만, 여기서는 **조직(루트)을 관리 계정과 멤버 계정을 함께 담는 바깥 박스**로 그린다. 결정은 `docs/ADR.md`
ADR-037 끝의 「2026-10-09 확장 — 조직과 Identity Center(phase 50)」와 ADR-038 끝 문단에 있다. **물음형 제목을 단다**(ADR-038). 예시 값은 없다.
사람 이름·이메일을 쓰지 말고 `계정 A/B/C`·`OU 1/2`로 쓴다.

**앵커는 `organizations-cloudtrail-config.scp-attachment-targets`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두), **ADR-038**(끝 문단 포함), **ADR-039**(끝의 phase 50 확장)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/50-org-identity-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`(`visualsByTopicId`)
- `src/data/visuals/governance-iac.json`: 주제 JSON의 가장 최근 선례
- `src/components/diagrams/ControlTimingDiagram.tsx`와 그 테스트: 그룹 박스·시나리오 곁말·물음형 제목·JSON 문구를 쓰는 가장 최근 도식이다.
  **구조와 테스트 방식을 맞춰라.** 이 파일은 고치지 마라.
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `organizations-cloudtrail-config` 주제 전부(step 0이 고친 `scp-attachment-targets` 포함)

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/organizations-cloudtrail-config.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만들고,
  `diagrams["scp-scope"]`를 더한다. `tables`는 빈 객체, `glossary`는 빈 배열이다(약어 툴팁은 VPC 주제에만 있다 — ADR-037).
- `src/data/index.ts`의 `visualsByTopicId`에 `'organizations-cloudtrail-config'` 키를 더한다. 기존 import·키의 정렬 방식(알파벳순)을 따른다.

### 2. 자리

- 컴포넌트: `src/components/diagrams/OrgScpScopeDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 매핑: `registry.ts`에 `'organizations-cloudtrail-config.scp-attachment-targets': OrgScpScopeDiagram` 한 줄을 더한다.

### 3. 모양

```
            [SCP]
┌ 조직 · 루트 ─────────────────────────────┐
│ [관리 계정]   (곁말: SCP가 걸리지 않음)      │
│ ┌ OU 1 ──────────┐ ┌ OU 2 ──────────┐   │
│ │ [계정 A]        │ │ [계정 C]        │   │
│ │ [계정 B]        │ │                │   │
│ └────────────────┘ └────────────────┘   │
└──────────────────────────────────────────┘
```

화살표는 SCP에서 **붙인 자리**(루트 박스의 위 변, OU 1 박스의 위 변, 계정 C 노드)를 가리킨다.

아래 좌표는 경계·라벨 폭·교차를 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.
`viewBox`는 `0 0 280 256`이다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `root` | 조직 · 루트 | 4, 56, 272, 192 |
| `ou-1` | OU 1 | 12, 128, 124, 112 |
| `ou-2` | OU 2 | 144, 128, 124, 112 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `scp` | SCP | `stroke-diagram-managed` | 82, 8, 116 |
| `management` | 관리 계정 | `stroke-diagram-resource` | 12, 80, 116 |
| `account-a` | 계정 A | `stroke-diagram-resource` | 20, 150, 108 |
| `account-b` | 계정 B | `stroke-diagram-resource` | 20, 194, 108 |
| `account-c` | 계정 C | `stroke-diagram-resource` | 152, 150, 108 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `scp-root` | 루트에 붙인다 | `M140 40 V56` (루트 박스 위 변에서 끝난다) |
| `scp-ou` | OU 1에 붙인다 | `M140 40 V120 H100 V128` (관리 계정 오른쪽으로 내려가 관리 계정과 OU 사이 통로 y 120을 지나 OU 1 위 변에서 끝난다) |
| `scp-account` | 계정 C에 붙인다 | `M190 40 V48 H240 V150` (루트 박스 위쪽 통로 y 48을 지나 OU 2 라벨 오른쪽 x 240으로 내려간다) |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 숨는다.

| id | 문구 | 자리 | 보이는 시나리오 |
|---|---|---|---|
| `management-exempt` | SCP가 걸리지 않음 | 관리 계정 오른쪽(x 150, y 100, `textAnchor="start"`) | `root` |

### 4. 시나리오 셋

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `root` | 루트에 SCP | `scp`, `account-a`, `account-b`, `account-c` | `scp-root` | `management-exempt` | 루트에 붙이면 제한할 생각이 없던 계정까지 모든 멤버 계정에 걸린다. 관리 계정은 예외다. | `organizations-cloudtrail-config.scp-attachment-targets` |
| `ou` | OU에 SCP | `scp`, `account-a`, `account-b` | `scp-ou` | – | OU에 붙이면 안에 든 계정 전부에 한 번에 걸려, 계정마다 정책을 복사하지 않아도 된다. | `organizations-cloudtrail-config.organizational-unit`, `organizations-cloudtrail-config.scp-attachment-targets` |
| `account` | 계정 하나에 SCP | `scp`, `account-c` | `scp-account` | – | 개별 멤버 계정에도 직접 붙일 수 있다. SCP는 붙인 자리 아래에만 적용된다. | `organizations-cloudtrail-config.scp-attachment-targets` |

- `management`는 세 시나리오 모두에서 흐리다(`0.25`). 관리 계정은 어느 자리에 붙여도 SCP가 걸리지 않기 때문이다.
- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 320px에서 두 줄이 되도록 50자 이하로 맞췄다.
- `question`: `SCP를 어디에 붙이면 어느 계정까지 걸릴까?`
- `idleCaption`: `붙이는 자리를 고르면 SCP가 걸리는 계정을 볼 수 있다.`
- `legend`: `파랑: SCP · 청록: 계정. 화살표는 SCP를 붙인 자리를 가리킨다. 바깥 박스는 조직의 루트, 안쪽 박스는 OU다.`
- `label`: `조직과 SCP 적용 범위 도식`, `svgLabel`: `SCP를 붙인 자리와 걸리는 계정`
- 도식의 `sources`: `organizations-cloudtrail-config.organizational-unit`, `organizations-cloudtrail-config.scp-attachment-targets`,
  `organizations-cloudtrail-config.organizations-consolidated-billing`

### 5. 테스트: `OrgScpScopeDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. `visualsByTopicId['organizations-cloudtrail-config']`가 있고 `tables`는 빈 객체, `glossary`는 빈 배열이다.
2. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
3. 처음(`전체`)에는 노드 다섯이 모두 선명하고, 경로와 곁말이 없다.
4. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
5. 세 시나리오 모두에서 `management`의 opacity가 `0.25`다. 그룹 박스 셋은 어느 시나리오에서도 흐려지지 않는다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말과 그룹 라벨 셋은 `estimateTextWidth(문구, 9)`로 잰 가로 범위가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `organizations-cloudtrail-config.scp-attachment-targets` 개념을 주면 본문 뒤에 이 도식이 온다.
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
   - `DiagramFrame.tsx`·`ControlTimingDiagram.tsx`·`topics.json`·`questions.json`·`governance-iac.json`이 그대로인가.
3. `phases/50-org-identity-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 새 JSON 파일과 로더 키, 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수),
     새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **관리 계정을 조직 박스 밖이나 위에 그리지 마라.** 이유: 관리 계정도 조직 안의 계정이다(ADR-037 「phase 50」 — 원본 그림에서 바로잡은 점).
- **IAM Identity Center·통합 청구·태그 정책을 이 도식에 넣지 마라.** 이유: Identity Center는 step 2의 도식이 맡고, 나머지는 사용자가 고른 범위가 아니다.
- **서비스 연결 역할 예외·위임 관리자·FullAWSAccess 같은 문구를 쓰지 마라.** 이유: 출처에 더하지 않은 사양이다(`docs/source/aws-docs.md`).
- **사람 이름·이메일·부서 이름(개발·운영 등)을 라벨로 쓰지 마라.** 이유: 데이터에 없는 예시다(ADR-038 「예시의 경계」).
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·`questions.json`·다른 주제의 visuals JSON을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
