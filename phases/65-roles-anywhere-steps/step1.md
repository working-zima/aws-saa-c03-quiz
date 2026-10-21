# Step 1: step-list-render

## 배경

step 0이 `groupParagraphs`에 단계 목록(`kind: 'steps'`)을 더했다. 이 step은 `ConceptList`가 그것을 그리게 하고, **번호 항목마다 단계 그림을 끼울 자리**를
만든다(ADR-050 「단계 그림」). 그림 자체는 step 3이 만든다. 이 step에서는 등록된 그림이 없으므로 실제 화면은 바뀌지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-050**, **ADR-046**, **ADR-037**(도식 등록)
- `docs/UI_GUIDE.md`의 「타이포그래피」(본문 목록·단계 목록 표)와 「도식」 중 「단계 그림」
- `src/lib/paragraph-blocks.ts`(step 0 결과)와 그 테스트
- `src/components/ConceptList.tsx`, `src/components/ConceptList.test.tsx`
- `src/components/diagrams/registry.ts`
- `src/components/EmphasizedText.tsx`, `src/lib/glossary.ts`(`markFirstOccurrences`)

## 작업

### 1. 단계 목록 렌더 (`ConceptList.tsx`)

`kind: 'steps'` 블록을 그린다. 클래스는 UI_GUIDE 「타이포그래피」의 「단계 목록」 행 그대로다.

```text
<ol start={start} class="list-decimal space-y-4 pl-7 text-[15px] leading-7 text-neutral-300 marker:text-neutral-500">
  <li class="break-keep">
    {항목 글 — EmphasizedText, 약어 조각은 glossaryAt(index + 1)}
    {단계 그림 — 등록돼 있으면 <StepFigure step={number} />}
    {자식 블록 — 순서대로}
  </li>
</ol>
```

- 자식 `paragraph` → `<p class="mt-2">`(글자는 목록 것을 물려받는다).
- 자식 `bullets` → `<ul class="mt-2 list-disc space-y-2 pl-5 marker:text-neutral-500">`, 2단은 `list-[circle]`. 항목은 `<li class="break-keep">`이고 그 아래 자식도
  같은 규칙으로 그린다.
- 모든 글은 `EmphasizedText`로 그리고, 약어 툴팁 조각은 그 글의 원래 `index`로 찾는다(`glossaryAt(index + 1)`). `markFirstOccurrences`에 넘기는 글은 지금처럼
  `stripListMarker`를 거친다(step 0이 들여쓰기·번호를 떼게 했다).
- React key는 지금처럼 `${concept.id}-${index}`를 쓴다.
- `paragraph`·`list` 블록의 렌더는 **바꾸지 않는다.**

### 2. 단계 그림 자리

- `src/components/diagrams/registry.ts`에 `stepFiguresByConceptId: Record<string, ComponentType<{ step: number }>>`를 더한다. 이 step에서는 **빈 객체**다.
- `ConceptList`에 선택 prop `stepFigures?: Record<string, ComponentType<{ step: number }>>`를 더하고 기본값을 `stepFiguresByConceptId`로 둔다(`diagrams` prop과 같은 방식).
- 개념에 등록된 그림이 있으면 번호 항목마다 **항목 글 바로 뒤, 자식 블록 앞**에 `<StepFigure step={item.number} />`를 그린다. 없으면 아무것도 그리지 않는다.

### 테스트 먼저 (TDD)

`src/components/ConceptList.test.tsx`에 `it`을 더하고 실패를 확인한 뒤 구현한다. 기존 `it`은 고치지 않는다. 테스트 데이터는 가짜 개념을 쓴다(실제 개념은 step 2에서 들어온다).

1. 번호 항목 셋이 `<ol>` 하나로 그려지고, `start`가 첫 번호다(9로 시작하면 `start="9"`). 구간 제목 문단이 끼면 `<ol>`이 둘로 나뉜다.
2. 하위 글머리가 그 번호 `<li>` 안의 `<ul>`로, 2단 글머리는 그 안의 `<ul>`로 그려진다. 이어지는 문단은 그 `<li>` 안의 `<p>`다.
3. 화면 어디에도 `1. `·`- ` 표지나 앞 공백이 글자로 남지 않는다(`<li>`의 textContent가 표지 없이 시작).
4. `**굵게**`와 백틱이 단계 목록 안에서도 `<strong>`·`<code>`로 그려진다.
5. `stepFigures`에 가짜 컴포넌트(`({ step }) => <figure data-step={step} />`)를 넘기면 번호 항목마다 하나씩, `step`이 그 항목 번호로, 항목 글 뒤·하위 `<ul>` 앞에 그려진다.
   등록이 없는 개념에서는 그려지지 않는다.
6. 약어 사전을 넘기면 들여쓴 문단 안의 약어에도 첫 등장 한 곳에만 툴팁이 붙는다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다. 새 `it`이 구현 전에 실패했는지 `summary`에 적는다.
2. `git status`로 바뀐 파일이 `src/components/ConceptList.tsx`, `src/components/ConceptList.test.tsx`, `src/components/diagrams/registry.ts`와 phase 메타데이터뿐인지 확인한다.
3. `phases/65-roles-anywhere-steps/index.json`의 step 1을 갱신한다. 성공이면 `summary`에 새 prop·새 registry 이름·새 테스트 수·전체 테스트 수를 적는다.

## 금지사항

- **기존 일반 문단·`- ` 목록의 마크업과 클래스를 바꾸지 마라.** 이유: phase 57의 목록 21개 실측과 다른 화면의 HTML이 그대로여야 한다.
- **단계 그림 컴포넌트·문구 JSON을 만들지 마라.** 이유: step 3의 범위다. 이 step의 registry는 빈 객체다.
- **데이터(`src/data/*.json`)를 고치지 마라.** 이유: step 2의 범위다.
- **단계 그림을 개념 본문 뒤(`diagramsByConceptId` 자리)에 두지 마라.** 이유: 사용자가 단계마다 그 단계 글 바로 아래의 그림을 골랐다(ADR-050).
- 기존 테스트를 깨뜨리지 마라.
