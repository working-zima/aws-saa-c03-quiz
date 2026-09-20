# Step 4: s3-class-axis

## 배경

`s3-storage-classes` 주제는 클래스 여덟 개를 하나씩 소개한 뒤 그것들을 가르는 기준을
설명한다. 그런데 **기준이 둘이고 클래스가 여덟이라** 글로 읽으면 어느 클래스가 어느 칸에
들어가는지가 남지 않는다. 이 도식은 본문이 이미 세워 둔 두 기준으로 여덟을 배치한다.

**이 도식에는 시나리오가 없다.** 정적 도식이므로 `DiagramFrame`에 `scenarios`를 넘기지 않는다.
step 0이 그 경우를 지원하도록 만들어 두었다.

## 근거 — 비용을 축으로 그리지 마라

이 도식을 "조회 시간 × 비용" 2차원 산점도로 그리고 싶을 수 있다. **그리지 마라.**
개념 본문이 말하는 비용 관계는 아래 셋뿐이다(`s3-storage-class-cost-order`).

- 장기 저장 용도에서 **S3 Standard-IA는 Glacier 계열보다 비싸다**
- 검색 빈도가 낮은 아카이빙에서 **Glacier Flexible Retrieval은 Deep Archive보다 비싸다**
- **Deep Archive가 가장 저렴하다**

One Zone-IA·Glacier Instant Retrieval·Intelligent-Tiering이 서로 어느 쪽이 싼지는
**어느 본문에도 없다.** 축을 그리면 그 빈자리를 좌표로 지어내게 된다.
비용은 축이 아니라 **위 세 문장의 순서 관계로만** 표시한다.

## 읽어야 할 파일

- `phases/38-service-diagrams/step0.md`, `step1.md` — 규약과 금지사항.
- `src/components/diagrams/DiagramFrame.tsx`, `src/lib/svg-bounds.ts`.
- `src/data/topics.json`의 `s3-storage-classes` 개념 **전부.** 특히
  `retrieval-time`, `glacier-or-standard-ia`, `s3-storage-class-cost-order`,
  `s3-express-one-zone`, `one-zone-ia`, `glacier-flexible-retrieval-standard-time`.

## 자리

- 컴포넌트: `src/components/diagrams/S3ClassMapDiagram.tsx`
- 매핑: `registry.ts`에 `'s3-storage-classes.s3-storage-class-cost-order': S3ClassMapDiagram`

앵커가 `s3-storage-class-cost-order`인 이유: 그 자리까지 오면 클래스 여덟, 첫 번째 기준,
두 번째 기준, 검색 시간, 비용 순서가 전부 읽힌 상태다. 도식이 새로 가르치는 것이 아니라
읽은 것을 한 장으로 접는 자리가 된다.

## 도식 내용

세 덩어리를 **세로로 쌓는다.** 가로 2열 그리드로 만들지 마라 —
`S3 Glacier Flexible Retrieval` 같은 라벨이 열 폭에 들어가지 않는다.

```
┌─ 즉시 조회 ─────────────────────────┐   ← 첫 번째 기준
│ [S3 Standard]                       │
│ [S3 Intelligent-Tiering]            │
│ [S3 Standard-IA]                    │
│ [S3 One Zone-IA]                    │
│ ┌─ 장기 보관 목적 ────────────────┐ │   ← 두 번째 기준
│ │ [S3 Glacier Instant Retrieval]  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
┌─ 대기 조회 ─────────────────────────┐
│ ┌─ 장기 보관 목적 ────────────────┐ │
│ │ [S3 Glacier Flexible Retrieval] │ │
│ │ [S3 Glacier Deep Archive]       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
┌─ 두 기준 밖 ────────────────────────┐
│ [S3 Express One Zone]               │
└─────────────────────────────────────┘
```

**`대기 조회` 안에 `장기 보관 목적` 바깥 칸이 비어 있는 것이 이 도식의 한 수다.**
기다려야 하는 클래스는 전부 Glacier 계열이라는 뜻이고, 빈 칸이 그것을 말한다.
빈 칸을 지우지 마라. 다만 빈 칸에 "없음" 같은 글자를 채우지도 마라 — 구조가 말하게 둔다.

### 노드와 색

여덟 클래스 전부 `diagram-managed`다. 그룹 박스 테두리는 `disabled`.
`S3 Express One Zone`의 `두 기준 밖` 박스는 점선으로 두어 나머지 둘과 구별한다.

### 곁말 (노드 옆 작은 글자, 9px, `muted`)

본문에 있는 것만 붙인다.

| 노드 | 곁말 | 근거 개념 id |
|---|---|---|
| `S3 Standard` | 기본값 · 접근이 잦은 데이터 | `standard` |
| `S3 Intelligent-Tiering` | 접근 시점을 예측하기 어려울 때 · 검색 요금 없음 | `intelligent-tiering`, `s3-retrieval-fee-by-class` |
| `S3 Standard-IA` | 검색 요금 있음 | `s3-retrieval-fee-by-class` |
| `S3 One Zone-IA` | 단일 AZ · 검색 요금 있음 | `one-zone-ia`, `s3-retrieval-fee-by-class` |
| `S3 Glacier Flexible Retrieval` | 표준 검색 3~5시간 | `glacier-flexible-retrieval-standard-time` |
| `S3 Glacier Deep Archive` | 최대 12시간 | `glacier-deep-archive` |
| `S3 Express One Zone` | 1밀리초 미만 · 단일 AZ | `s3-express-one-zone` |

`장기 보관 목적` 그룹 라벨에는 **법·감사·규정 준수**라는 말을 넣어라(`glacier-or-standard-ia`).
그 말이 문제문에서 Glacier를 부르는 신호이기 때문이다.

### 비용 순서 — 축이 아니라 한 줄

도식 아래에 `legend`와 별개로 한 줄을 둔다. 본문 세 문장의 순서 관계만 담고,
클래스 여덟의 전체 순위를 만들지 마라.

## 캡션

`scenarios`가 없으므로 `idleCaption`이 늘 보이는 유일한 설명이다.
**두 기준이 무엇인지**를 여기에 담아라 — 첫 번째는 조회에 기다림이 있는지,
두 번째는 장기 보관 목적이 있는지. 본문 문장을 그대로 옮기지 말고 직접 써라.

## 테스트

`src/components/diagrams/S3ClassMapDiagram.test.tsx`를 먼저 쓴다.

1. 버튼이 하나도 렌더되지 않는다 (`scenarios`를 넘기지 않았으므로 `전체`도 없다).
2. 클래스 여덟 개의 라벨이 모두 화면에 있다.
3. `S3 Express One Zone`이 `즉시 조회`·`대기 조회` 어느 그룹에도 속하지 않는다
   (좌표로 확인한다 — 두 그룹 `rect`의 범위 밖에 있다).
4. `S3 Glacier Flexible Retrieval`과 `S3 Glacier Deep Archive`가 `대기 조회` 그룹 안에 있다.
5. 경계: 모든 `rect`가 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`에서 빈 배열.
6. 글자 넘침: 클래스 노드 여덟 각각에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`.
7. `viewBox` 폭이 `280`이다.

3번이 이 step의 핵심 회귀 테스트다. Express One Zone을 축 위로 끌어올리는 것이
가장 흔한 실수이고, 본문이 명시적으로 막고 있는 것이다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 금지사항

- **비용을 좌표축으로 그리지 마라.** 위 「근거」 절이 이유다.
- **클래스 여덟의 비용 전체 순위를 만들지 마라.** 본문에 없다.
- **시나리오 버튼을 만들지 마라.** 이 도식은 정적이다.
- **`DiagramFrame.tsx`·`svg-bounds.ts`를 고치지 마라.**
- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **아래를 이 도식에 넣지 마라**: 수명 주기 규칙, 스토리지 클래스 분석,
  Intelligent-Tiering 감시 요금, 신속 검색. 전부 이 주제의 개념이지만
  **클래스를 가르는 기준이 아니라 그 위에서 하는 일**이다.
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 캡션·곁말에 그대로 옮기지 마라.**
- 기존 테스트를 깨뜨리지 마라.
