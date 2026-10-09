# Step 2: control-timing-diagram

## 배경

`governance-iac.control-tower-controls` 개념은 Control Tower의 제어를 **언제 작동하는지**로 나눈다.

- **사전 예방적 제어**는 배포 시점에 템플릿을 평가해 규칙을 어기는 스택 작업을 거부한다. 규정에 어긋나는 리소스가 아예 생기지 않는다.
- **탐지 제어**는 이미 만들어진 리소스에서 규정 미준수를 찾아 보고한다. 찾은 것을 자동으로 지우도록 설계된 기능이 아니다.
- 탐지한 뒤 자동으로 고치는 구성도 그럴듯해 보이지만, 고치기 전까지 위험한 리소스가 존재하는 시간이 남으므로 방지가 아니다.

문항 q300은 "탐지 제어가 찾아낸 리소스를 자동으로 지우도록 구성한다"를 오답으로 낸다. 이 step은 세 경우를 도식 하나로 그린다.
**세로축이 시간이다.** 위쪽 띠가 `배포 시점`, 아래쪽 띠가 `만들어진 뒤`이고, 규칙을 어기는 배포가 어느 띠에서 걸러지는지를 시나리오로
바꿔 본다. 사용자 결정(2026-10-09)은 `docs/ADR.md` ADR-037 끝의 「2026-10-09 확장 — 거버넌스 주제(phase 48)」와 ADR-038 끝의
「2026-10-09 — phase 48」에 있다. **이 도식에는 물음형 제목을 단다**(ADR-038). 예시 값은 없다.

**앵커는 `governance-iac.control-tower-controls`다.** 이 개념에는 기존 도식이 없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두), **ADR-038**(끝 문단 포함)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/48-governance-visuals/index.json`의 step 0·1 `summary`
- `src/data/visuals/governance-iac.json`: step 0·1이 채운 파일이다. 여기에 `diagrams["control-timing"]`를 더한다.
- `src/components/diagrams/DriftScopeDiagram.tsx`와 그 테스트: step 1이 만든 같은 주제의 도식이다. **구조와 테스트 방식을 맞춰라.**
  이 파일은 고치지 마라.
- `src/components/diagrams/Route53HealthDiagram.tsx`: 흐린 노드로 향하는 경로를 남기지 않고, 시나리오 곁말을 쓰는 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [` 블록의 `{ id: '…', x: N, y: N, width: N` 순서와
  `'id': 'M…'` 경로를 정규식으로 읽고, 노드 높이를 32로 본다. 이 형식을 지켜라.
- `src/data/topics.json`의 `governance-iac` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/ControlTimingDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["control-timing"]`
- 매핑: `registry.ts`에 `'governance-iac.control-tower-controls': ControlTimingDiagram` 한 줄을 더한다.

### 모양

```
          [규칙을 어기는 배포]
┌ 배포 시점 ──────────────────────────────┐
│ [사전 예방적 제어] → [스택 작업 거부]      │
└─────────────────────────────────────────┘
┌ 만들어진 뒤 ────────────────────────────┐
│ [규정에 어긋난 리소스] ← [탐지 제어]       │
│      (곁말)                 (곁말)        │
└─────────────────────────────────────────┘
```

탐지 제어 시나리오의 배포 경로는 `사전 예방적 제어`와 `스택 작업 거부` **사이의 통로(x 140)**로 내려가 위쪽 띠를 지나친다. 흐린 노드를
뚫고 지나가지 않게 하려는 것이다. 탐지 제어의 화살표는 리소스를 향한다 — "찾아낸다"는 뜻이다.

아래 좌표는 경계·라벨 폭·교차를 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.
`viewBox`는 `0 0 280 240`이다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `deploy-time` | 배포 시점 | 4, 56, 272, 64 |
| `after` | 만들어진 뒤 | 4, 144, 272, 88 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `request` | 규칙을 어기는 배포 | `stroke-disabled` | 82, 8, 116 |
| `preventive` | 사전 예방적 제어 | `stroke-diagram-managed` | 12, 80, 116 |
| `reject` | 스택 작업 거부 | `stroke-disabled` | 152, 80, 116 |
| `resource` | 규정에 어긋난 리소스 | `stroke-diagram-resource` | 12, 168, 116 |
| `detective` | 탐지 제어 | `stroke-diagram-managed` | 152, 168, 116 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `request-preventive` | 배포가 사전 예방적 제어의 평가를 받는다 | `M110 40 V80` |
| `preventive-reject` | 평가 결과 스택 작업을 거부한다 | `M128 96 H152` |
| `request-resource` | 배포가 그대로 리소스를 만든다 | `M140 40 V132 H70 V168` (두 노드 사이 통로 x 140, 띠 사이 통로 y 132) |
| `detective-resource` | 탐지 제어가 리소스를 찾아낸다 | `M152 184 H128` |

**곁말**(`notes`, 크기 9, `fill-muted`, `textAnchor="middle"`, y 218). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | x | 보이는 시나리오 |
|---|---|---|---|
| `not-created` | 생기지 않음 | 70 | `preventive` |
| `report-only` | 찾아서 보고 · 지우지 않음 | 210 | `detective` |
| `exists-until-fixed` | 고치기 전까지 존재 | 70 | `auto-fix` |
| `auto-fix` | 탐지 뒤 자동 수정 | 210 | `auto-fix` |

### 시나리오 셋

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 |
|---|---|---|---|---|---|
| `preventive` | 사전 예방적 제어 | `request`, `preventive`, `reject` | `request-preventive`, `preventive-reject` | `not-created` | 배포 시점에 템플릿을 평가해 위반 스택 작업을 거부한다. 리소스가 아예 생기지 않는다. |
| `detective` | 탐지 제어 | `request`, `resource`, `detective` | `request-resource`, `detective-resource` | `report-only` | 이미 만들어진 리소스에서 규정 미준수를 찾아 보고한다. 찾은 것을 지우지는 않는다. |
| `auto-fix` | 탐지 후 자동 수정 | `request`, `resource`, `detective` | `request-resource`, `detective-resource` | `exists-until-fixed`, `auto-fix` | 탐지한 뒤 자동으로 고치게 엮어도 고치기 전까지 위반 리소스가 존재한다. 방지가 아니다. |

- 세 시나리오의 `sources`는 모두 `governance-iac.control-tower-controls`다.
- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 320px에서 두 줄이 되도록 50자 이하로 맞췄다.
- `detective`와 `auto-fix`는 노드·경로가 같고 곁말과 캡션만 다르다. 의도한 것이다 — 자동 수정을 엮어도 리소스가 생기는 시점은
  바뀌지 않는다는 것이 요점이다.
- `question`: `규칙을 어기는 리소스는 언제 걸러질까?`
- `idleCaption`: `제어를 고르면 규칙을 어기는 배포가 어느 시점에 걸러지는지 볼 수 있다.`
- `legend`: `파랑: Control Tower의 제어 · 청록: 배포로 생기는 리소스 · 회색: 배포 요청과 거부. 위에서 내려가는 화살표는 배포가 지나가는 길, 탐지 제어의 화살표는 찾아내는 대상이다.`
- `label`: `Control Tower 제어 시점 도식`, `svgLabel`: `사전 예방적 제어와 탐지 제어가 작동하는 시점`
- 도식의 `sources`: `governance-iac.control-tower-controls`

### 테스트: `ControlTimingDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 다섯이 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
4. `preventive`에서 `resource`·`detective`의 opacity가 `0.25`이고 곁말 `생기지 않음`이 보인다. `detective`·`auto-fix`에서
   `preventive`·`reject`의 opacity가 `0.25`다. 그룹 박스 둘은 어느 시나리오에서도 흐려지지 않는다.
5. `request-resource` 경로는 `preventive`에서 보이지 않고, `preventive-reject`는 `detective`·`auto-fix`에서 보이지 않는다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 넷과 그룹 라벨 둘은 `estimateTextWidth(문구, 9)`로 잰 가로 범위가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `governance-iac.control-tower-controls` 개념을 주면 본문 뒤에 이 도식이 온다.
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
   - 이모지·O/X·빨강·애니메이션이 없는가. 거부·위반을 빨강으로 칠하지 않았는가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`DriftScopeDiagram.tsx`·`topics.json`·step 0의 표·step 1의 도식 문구가 그대로인가.
3. `phases/48-governance-visuals/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수), 새 테스트 수와 전체
     테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **자동 수정을 맡는 서비스 이름(Config 규칙·Systems Manager 등)을 쓰지 마라.** 이유: 이 개념의 본문은 "자동으로 고치는 구성"이라고만
  말한다. 그 조합은 다른 주제의 내용이다.
- **고치기까지 걸리는 시간을 숫자나 막대 길이로 그리지 마라.** 이유: 데이터에 없다. 길이로 그리면 근거 없는 시간 관계를 만든다
  (ADR-036 "도식은 콘텐츠다", ADR-037 phase 41 확장의 복구 시간 막대와 같은 이유).
- **거부·위반·탐지를 빨강·초록으로 칠하지 마라.** 이유: 초록·빨강은 정답/오답 표시가 점유했다(ADR-036).
- **랜딩 존·계정 구조·SCP를 그리지 마라.** 이유: 사용자가 이번 범위로 고른 것은 제어 시점뿐이다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`DriftScopeDiagram.tsx`·`topics.json`·`questions.json`·step 0의 표를 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
