# Step 0: diagram-shell

## 배경

이 앱에는 그림이 한 장도 없다. 개념 618개가 전부 글이다. 네트워크 계열 주제는
"무엇이 무엇에 어떤 경로로 닿는가"가 본체인데, 그것을 글로만 읽으면 학습자가 머릿속에서
배치도를 다시 그려야 한다. phase 38은 주제 다섯 곳에 도식을 하나씩 넣는다.

**이 step은 껍데기만 만든다. 도식은 한 장도 만들지 않는다.** step 1~5가 하나씩 그린다.
껍데기를 먼저 세우는 이유는, 도식마다 버튼·캡션·범례를 따로 짜면 다섯 장이 서로 다르게
동작하기 때문이다.

도식이 붙는 자리는 **개념 읽기 본문 안**이다. 독립 화면을 만들지 않는다 —
라우트를 추가하지 마라.

## 읽어야 할 파일

- `CLAUDE.md` — 아키텍처 규칙과 TDD 규칙.
- `docs/UI_GUIDE.md` — **「AI 슬롭 안티패턴」**(보라·인디고 금지가 여기 있다), 「색상」,
  「레이아웃」의 **'모바일'**(기준 폭 320px, 가로 스크롤은 버그), 「터치 영역」,
  「타이포그래피」, 「애니메이션」, 「아이콘」.
- `docs/ARCHITECTURE.md` — 「디렉토리 구조」, 「테스트 경계」.
- `docs/PRD.md` — 「디자인」.
- `src/components/ConceptList.tsx` — **삽입점이 여기다.** 이 컴포넌트가 개념 읽기 화면과
  확인 문제의 개념 펼치기 **양쪽**을 렌더한다는 점을 그 파일 주석이 못박고 있다.
  여기에 도식을 넣으면 두 화면에 함께 나온다. 그게 의도다.
- `src/components/EmphasizedText.tsx` — 같은 계층의 선례. 작게 유지하는 방식을 따른다.
- `src/pages/ConceptReadPage.tsx` — `topics`·`questions`를 optional prop으로 받아 기본값에
  실데이터를 쓰는 패턴이 여기 있다. 이 step도 같은 패턴을 쓴다.
- `src/components/QuizRunner.tsx` — `ConceptList`를 쓰는 또 한 곳.
- `tailwind.config.js` — 색 토큰.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **테스트를 먼저 쓰고 실패를 확인한 뒤** 구현한다.

### 1. 색 토큰 — 새 색은 둘뿐이다

`tailwind.config.js`의 `colors`에 아래 둘만 더한다.

```js
'diagram-managed': '#60a5fa',   // AWS 관리 영역 (리전 안, VPC 밖)
'diagram-resource': '#2dd4bf',  // 서브넷 안에 놓인 내 자원
```

그 밖에는 **기존 토큰을 쓴다.** 경계선·그룹 테두리는 `disabled`(#737373),
강조된 통신 경로와 노드 글자는 `title`(#fafafa), 보조 글자는 `muted`(#a3a3a3),
도식 바탕은 `panel`(#141414). 새 토큰을 셋 이상 만들지 마라.

**보라·인디고 계열을 쓰지 마라.** UI_GUIDE 「AI 슬롭 안티패턴」이 금지한다.
초록(#22c55e)·빨강(#ef4444)·주황(#f59e0b)도 쓰지 마라 — 정답/오답/중요도가 이미 점유한
색이고, 도식 안에서 쓰면 학습자가 그 뜻으로 읽는다.

**색은 보조 채널이다.** 계층을 가르는 1차 채널은 **위치** — 라벨이 붙은 그룹 박스의 안과 밖이다.
색을 전부 회색으로 바꿔도 도식이 읽혀야 한다. 색에만 실린 정보를 만들지 마라.

### 2. 껍데기 `src/components/diagrams/DiagramFrame.tsx`

도식 다섯 장이 공유하는 바깥 틀이다. **SVG는 여기서 만들지 않는다** — `children`으로 받는다.

```ts
export interface DiagramScenario {
  id: string
  label: string      // 버튼에 쓰는 짧은 말 (예: '사용자 → EC2')
  caption: string    // 고른 뒤 아래에 뜨는 설명
  nodes: string[]    // 이 시나리오에서 살려 둘 노드 id. 나머지는 흐려진다.
  paths: string[]    // 켤 경로 id
}

interface DiagramFrameProps {
  label: string                      // 도식 전체의 접근성 이름
  idleCaption: string                // 시나리오를 고르지 않았을 때의 캡션
  legend?: string                    // 범례 한 줄
  scenarios?: DiagramScenario[]      // 없으면 버튼 줄을 아예 그리지 않는다 (정적 도식)
  active: DiagramScenario | null
  onSelect: (scenario: DiagramScenario | null) => void
  children: ReactNode                // 각 도식의 <svg>
}
```

**껍데기는 `nodes`·`paths`를 읽지 않는다.** 그 둘을 쓰는 것은 각 도식 컴포넌트다 —
자기 SVG의 어느 요소를 흐리고 어느 경로를 켤지는 자기만 안다. 껍데기가 `children`을 뒤져
`id`를 찾아다니게 만들지 마라. `DiagramScenario`가 공용 타입인 것은 다섯 장이 같은 모양의
시나리오를 쓰기 때문이고, 껍데기가 그 필드를 전부 쓰기 때문이 아니다.

**상태를 여기서 들지 마라.** `active`와 `onSelect`를 받는 controlled 컴포넌트다.
상태는 도식 컴포넌트가 든다. 이유: 껍데기가 상태를 들면 도식이 자기 시나리오 목록을
껍데기에 넘겨주고 다시 돌려받는 왕복이 생긴다.

마크업 뼈대:

```
<figure aria-label={label}>
  {scenarios && <div role="group" aria-label="통신 시나리오">버튼들</div>}
  {children}                              <- 각 도식의 <svg>
  <figcaption aria-live="polite">캡션</figcaption>
  {legend && <p>범례</p>}
</figure>
```

- **제목에 `<h1>`~`<h6>`를 쓰지 마라.** `ConceptList`가 호출 화면에 따라 개념을 h2로도
  h4로도 그리므로, 도식이 헤딩을 쓰면 헤딩 레벨을 전파받아야 한다. `figure`의 `aria-label`로
  끝내면 그 문제가 없다.
- 버튼 줄의 첫 버튼은 **`전체`**이고, 누르면 `onSelect(null)`이다.
- 선택된 버튼에 `aria-pressed="true"`, 나머지는 `"false"`.
- 버튼은 `inline-flex items-center min-h-[44px]`로 터치 영역 44px을 확보한다
  (UI_GUIDE 「터치 영역」). 줄이 넘치면 `flex-wrap`으로 감싼다.
- 캡션은 `text-sm text-muted`, 범례는 `text-xs text-disabled`.
  캡션 영역에 **최소 높이를 주어**, 시나리오를 바꿀 때 아래 본문이 위아래로 튀지 않게 한다.
- `transition-colors`(150ms) 외의 애니메이션을 넣지 마라. UI_GUIDE 「애니메이션」이 금지한다.

### 3. 매핑 `src/components/diagrams/registry.ts`

```ts
import type { ComponentType } from 'react'

// 개념 id → 그 개념 본문 바로 뒤에 붙는 도식.
// step 1~5가 여기에 한 줄씩 더한다.
export const diagramsByConceptId: Record<string, ComponentType> = {}
```

이 step에서는 **빈 객체 그대로 둔다.**

### 4. `src/components/ConceptList.tsx` 수정

optional prop을 하나 더한다. 기본값은 위 매핑이다.

```ts
interface ConceptListProps {
  concepts: Concept[]
  headingLevel: 2 | 4
  diagrams?: Record<string, ComponentType>
}
```

개념의 `paragraphs`를 그린 **뒤에**, 매핑에 그 개념 id가 있으면 도식을 렌더한다.
없으면 아무것도 렌더하지 않는다 — 빈 `div`도 남기지 마라.

`ConceptReadPage`·`QuizRunner`는 **고치지 마라.** 기본값이 실매핑을 가리키므로 그대로 동작한다.

### 5. 경계 검사 `src/lib/svg-bounds.ts`

도식이 좁은 화면에서 넘치는지를 **기계로** 잡기 위한 순수 함수다. 브라우저 없이 돈다.

```ts
export interface SvgBox { id: string; x: number; y: number; width: number; height: number }

// viewBox = [minX, minY, width, height]
export function boxesOutsideViewBox(boxes: SvgBox[], viewBox: [number, number, number, number]): SvgBox[]
```

상자의 네 변 중 하나라도 viewBox 밖으로 나가면 그 상자를 결과에 넣는다. 안쪽이면 넣지 않는다.
경계에 정확히 닿는 것(`x + width === minX + width`)은 **넘침이 아니다.**

상자의 네 변 중 하나라도 viewBox 밖으로 나가면 그 상자를 결과에 넣는다.

같은 파일에 글자 폭 어림 함수도 둔다. 도식의 라벨이 노드 상자를 비집고 나가는지를
브라우저 없이 잡기 위한 것이다.

```ts
// 한글·전각 문자는 fontSize의 1.0배, 그 밖(영문·숫자·기호·공백)은 0.55배로 어림한다.
export function estimateTextWidth(text: string, fontSize: number): number
```

정확한 값이 아니라 **넉넉한 어림**이다. 실제 렌더 폭보다 크게 나오는 쪽이 안전하다.
step 1~5의 테스트가 `estimateTextWidth(라벨, 글자크기) + 좌우 여백 <= 노드 폭`을 단언한다.

React를 import하지 마라. DOM을 import하지 마라. 두 함수 모두 값만 받고 값만 돌려준다.
step 1~5의 테스트가 렌더한 SVG에서 `x`/`y`/`width`/`height` 속성을 긁어 이 함수에 넘긴다.

## 테스트

`src/components/diagrams/DiagramFrame.test.tsx`, `src/components/ConceptList.test.tsx`(없으면 새로),
`src/lib/svg-bounds.test.ts`에 최소한 아래를 담는다.

1. 시나리오 버튼을 누르면 `onSelect`가 그 시나리오로 불린다.
2. `active`가 주어지면 캡션이 그 시나리오의 `caption`이고, `null`이면 `idleCaption`이다.
3. `전체` 버튼을 누르면 `onSelect(null)`이 불린다.
4. 선택된 버튼만 `aria-pressed="true"`다.
5. `scenarios`를 넘기지 않으면 버튼이 하나도 렌더되지 않는다(`전체`도 없다).
6. `figure`가 `label`로 접근성 이름을 갖는다.
7. `ConceptList`에 빈 매핑을 주면 개념 본문만 나온다 — `figure`가 없다.
8. `ConceptList`에 `{ 'x.y': FakeDiagram }`을 주면 개념 `x.y` **뒤에만** 도식이 나오고
   다른 개념 뒤에는 나오지 않는다.
9. `boxesOutsideViewBox`: 안쪽 상자는 빈 배열, 오른쪽으로 넘친 상자는 그 상자를 돌려준다,
   경계에 정확히 닿는 상자는 넘침이 아니다.
10. `estimateTextWidth`: 한글만 있는 문자열은 `글자수 × fontSize`, 영문만 있는 문자열은
    그보다 작다, 빈 문자열은 0이다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 검증 절차

1. 위 AC 커맨드를 모두 실행한다. 넷 다 통과해야 한다.
2. 체크리스트:
   - `src/lib/svg-bounds.ts`가 `react`를 import하지 않는가? DOM 타입을 쓰지 않는가?
   - `tailwind.config.js`에 더한 색이 정확히 둘인가? 보라·인디고·초록·빨강·주황이 없는가?
   - `src/components/diagrams/registry.ts`가 빈 객체인가?
   - `ConceptReadPage.tsx`·`QuizRunner.tsx`가 변경되지 않았는가? (`git diff --stat`으로 확인)
   - `node scripts/check-structure.mjs`가 통과하는가? 이 step은 학습 데이터를 건드리지
     않으므로 반드시 통과해야 한다. 실패하면 `src/data/`의 무언가를 잘못 고친 것이다.

## 금지사항

- **SVG 도식을 만들지 마라.** 이유: step 1~5의 범위다. 이 step의 산출물에 `<svg>`가
  들어가는 곳은 테스트의 가짜 도식뿐이다.
- **라우트를 추가하지 마라.** 자리는 개념 읽기 본문 안으로 정해졌다.
- **`src/data/` 아래 JSON을 고치지 마라.** 도식은 기존 개념을 그릴 뿐이고, 개념에
  `diagram` 같은 필드를 더하지 않는다. `check-structure.mjs`가 구조 변경으로 잡아낸다.
- **라이브러리를 설치하지 마라**(d3·mermaid·react-flow·framer-motion 등).
  이유: SVG를 손으로 쓴다. 다섯 장뿐이고 레이아웃이 전부 다르다.
- **범용 도식 렌더러를 만들지 마라.** 노드·엣지를 JSON으로 받아 자동 배치하는 엔진을
  만들지 마라. 이유: 다섯 장의 레이아웃이 서로 달라 공통분모가 껍데기까지다.
- **`docs/` 아래 문서를 고치지 마라.** PRD·ADR·UI_GUIDE 개정은 step 6의 범위다.
- 기존 테스트를 깨뜨리지 마라.
