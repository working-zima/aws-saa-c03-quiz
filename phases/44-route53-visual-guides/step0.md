# Step 0: diagram-question

## 배경

사용자가 "모르는 상태로 보면 시각 자료가 무엇을 보여 주는지 모르겠다"고 했다(2026-09-27). 원인 가운데 하나는 **도식 이름이 화면에
보이지 않는다**는 것이다. 이름은 `figure`의 `aria-label`에만 있어 화면 낭독기만 읽는다. 비교표(`ComparisonTableFigure`)는 제목을
`<p className="text-sm text-title">`로 보이는데, 도식(`DiagramFrame`)은 그러지 않는다.

이 step은 도식에 **물음형 제목**을 보일 자리를 만든다. 결정의 기록은 `docs/ADR.md`의 **ADR-038**과 `docs/UI_GUIDE.md` 「물음형 제목과
예시」에 있다. 이 step은 틀만 만든다. 실제 물음 문구는 step 1~3이 도식마다 넣는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-038**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**(특히 「물음형 제목과 예시」)
- `src/types/visuals.ts`: `VisualDiagramText`
- `src/components/diagrams/DiagramFrame.tsx`, `src/components/diagrams/DiagramFrame.test.tsx`
- `src/components/diagrams/ComparisonTableFigure.tsx`: 제목 `<p>`의 선례. 같은 클래스를 쓴다.

## 작업

### 1. 타입

`VisualDiagramText`에 선택 필드를 하나 더한다.

```ts
question?: string // 화면에 보이는 물음형 제목. 버튼 위에 표시한다. ADR-038
```

### 2. `DiagramFrame`

- `DiagramFrameProps`에 `question?: string`을 더한다.
- 값이 있으면 `figure`의 **첫 자식**으로, 시나리오 버튼 줄보다 위에 `<p className="text-sm text-title">{question}</p>`를 렌더한다.
  클래스는 `ComparisonTableFigure`의 제목과 같다.
- 값이 없으면 아무것도 렌더하지 않는다. 지금 있는 도식 19개는 `question`을 넘기지 않으므로 **화면이 그대로여야 한다.**
- 헤딩(`h1`~`h6`)을 쓰지 마라. `figure`의 `aria-label`은 지금처럼 `label`에서 온다. 제목이 `aria-label`을 대신하지 않는다.

### 3. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. `DiagramFrame.test.tsx`에 테스트를 더한다.

1. `question`을 넘기면 그 글자가 보이고, 시나리오 버튼 줄보다 문서 순서상 앞에 있으며, 클래스가 `text-sm text-title`이다.
2. `question`이 있어도 `figure` 안에 헤딩 역할(`heading`)이 없고, `figure`의 접근성 이름은 여전히 `label`이다.
3. `question`을 넘기지 않으면 `figure`의 첫 자식이 지금처럼 버튼 줄이다(시나리오가 있는 경우).

기존 테스트는 고치지 마라.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 기존 도식 컴포넌트와 JSON을 하나도 바꾸지 않았는가.
   - `question`이 없을 때 렌더 결과가 전과 같은가(기존 테스트가 그대로 통과하는가).
3. `phases/44-route53-visual-guides/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 타입·prop, 제목 요소의 위치와 클래스, 더한 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **Route 53 도식이나 JSON에 물음을 넣지 마라.** 이유: step 1~3의 범위다.
- **`idleCaption`의 뜻이나 `전체` 상태의 경로 숨김을 바꾸지 마라.** 이유: 사용자가 그 두 안은 고르지 않았다(ADR-038).
- **다른 도식 19개에 `question`을 넘기지 마라.** 이유: 이번에는 Route 53 셋만 시범으로 적용한다(ADR-038).
- **제목을 헤딩으로 만들지 마라.** 이유: `ConceptList`가 화면마다 헤딩 레벨을 바꾼다(UI_GUIDE 「도식」).
- 기존 테스트를 깨뜨리지 마라.
