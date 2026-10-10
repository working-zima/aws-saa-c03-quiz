# Step 1: indented-children

## 배경

개념 읽기 화면은 주제 안의 개념을 모두 같은 높이로 그린다. 그래서 「DataSync」와 「Snowball Edge」 사이에 있는 여섯 개가
DataSync에 딸린 개념이라는 것이 보이지 않는다. 사용자가 고른 장치는 **들여쓰기와 세로선**이다. 결정과 이유는 `docs/ADR.md`
**ADR-041**, 화면 규약은 `docs/UI_GUIDE.md` **「딸린 개념 (ADR-041)」**에 있다.

step 0이 `Concept.parentId`, `ConceptGroup`, `src/lib/concept-groups.ts`의 `groupConcepts`·`hierarchyProblems`를 만들었다.
이 step은 `ConceptList`가 `groupConcepts`로 개념을 묶어 딸린 개념을 들여써 그리게 한다. **데이터는 아직 `parentId`가 없다** —
실데이터 화면은 이 step 뒤에도 그대로이고, 들여쓰기는 테스트의 가짜 개념으로 확인한다. 데이터는 step 2가 넣는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041** 「화면」 문단
- `docs/UI_GUIDE.md`의 **「딸린 개념 (ADR-041)」**, 그리고 바로 아래 **「도식」**의 모바일 음수 마진 설명(`-mx-5`)
- `src/types/content.ts`(`Concept.parentId`, `ConceptGroup`)
- `src/lib/concept-groups.ts`(`groupConcepts`가 평평하게 그리는 경우)
- `src/components/ConceptList.tsx`, `src/components/ConceptList.test.tsx`
- `src/components/diagrams/DiagramFrame.tsx`, `src/components/diagrams/ComparisonTableFigure.tsx` — `figure`의 클래스
  (`-mx-5 … sm:mx-0`). **읽기만 한다.**
- `src/pages/ConceptReadPage.tsx`(h2로 부른다), `src/components/QuizRunner.tsx`(h4로 부른다)

## 작업

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

### 1. `src/components/ConceptList.tsx`

`concepts`를 `groupConcepts`로 묶어 그린다. Props(`concepts`·`headingLevel`·`diagrams`·`glossary`)는 그대로다.

DOM은 아래 모양이다. 바깥 `div.space-y-8`의 직계 자식이 머리 `article`과 딸린 무리 `div`가 번갈아 온다.

```text
<div class="space-y-8">                         ← 지금 그대로
  <article id="머리">…</article>                 ← 지금과 똑같은 article
  <div class="space-y-8 border-l border-border pl-4 max-sm:[&_figure]:-ml-[37px]">   ← children이 있을 때만
    <article id="딸린 개념">…</article>          ← 제목만 한 단계 아래
    <article id="딸린 개념">…</article>
  </div>
  <article id="다음 머리">…</article>
</div>
```

- **무리 `div`의 클래스는 위 문자열 그대로 쓴다.** `max-sm:[&_figure]:-ml-[37px]`는 모바일에서 딸린 개념의 도식·비교표를
  지금처럼 화면 끝까지 펼치는 값이다. `figure`의 `-mx-5`(20px)에 세로선 1px과 `pl-4` 16px을 더한 것이다. Tailwind가 클래스
  이름을 소스에서 찾으므로 문자열을 쪼개거나 조합해 만들지 마라.
- **딸린 개념의 제목**은 `headingLevel`이 2면 `h3`, 4면 `h5`다. 클래스는 머리 제목과 같은
  `text-base font-medium text-neutral-100`이다.
- **`article` 안쪽은 머리와 딸린 개념이 같다** — `id`, `scroll-mt-24`, 요약·문단·약어 툴팁·도식 렌더가 지금 그대로다.
  같은 마크업을 두 번 쓰지 말고 한 곳(내부 함수나 같은 파일의 작은 컴포넌트)에서 그린다. 헤딩 태그만 인자로 받는다.
- `children`이 빈 묶음은 머리 `article`만 그리고 무리 `div`를 남기지 않는다.
- `key`는 개념 id를 쓴다. 묶음을 감싸는 데는 `Fragment`를 쓰고, 바깥에 새 요소를 더하지 않는다.

### 2. 테스트 — `src/components/ConceptList.test.tsx`

기존 `it` 블록은 고치지 마라. 파일 끝에 `describe('딸린 개념 (ADR-041)', …)`를 새로 붙이고, 가짜 개념으로 아래를 단언한다.
`headingLevel` 2와 4 둘 다(`it.each([2, 4] as const)`)로 돈다.

가짜 개념: `A`, `B(parentId A)`, `C(parentId A)`, `D`.

1. `A`·`D`의 제목은 `headingLevel`, `B`·`C`의 제목은 `headingLevel + 1`이다(`getByRole('heading', { level, name })`).
2. `B`와 `C`의 `article`이 같은 부모 요소를 갖고, 그 부모의 `previousElementSibling`이 `A`의 `article`이며,
   `nextElementSibling`이 `D`의 `article`이다.
3. 그 부모 요소가 `border-l`, `border-border`, `pl-4`, `max-sm:[&_figure]:-ml-[37px]` 클래스를 갖는다.
4. `A`와 `D`의 `article`은 바깥 목록(첫 `article`의 부모)의 직계 자식이다.
5. `getAllByRole('article')`의 `id` 순서가 `A`, `B`, `C`, `D`다.
6. `B`에 가짜 도식(`diagrams={{ [B.id]: FakeDiagram }}`)을 주면 그 `figure`가 `B`의 `article` 안, 마지막 문단 뒤에 있다.
7. `[B]` 하나만 넘기면(머리가 목록에 없으면) `B`의 제목이 `headingLevel`이고, `border-l` 클래스를 가진 요소가 없다.
8. `[A, D, B]`처럼 사이에 다른 개념이 끼면 `B`의 제목이 `headingLevel`이고, `border-l` 클래스를 가진 요소가 없다.
9. `parentId`가 하나도 없는 개념 목록이면 `border-l` 클래스를 가진 요소가 없다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/53-concept-indent/verify-hierarchy.mjs 1
grep -q 'margin-left:-37px' dist/assets/*.css   # 빌드된 CSS에 모바일 도식 당김 규칙이 실제로 생겼다
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `ConceptList.tsx`에서 `article` 마크업이 한 곳에만 있는가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·도식 컴포넌트·`ConceptReadPage.tsx`·`QuizRunner.tsx`가 그대로인가.
   - `src/data/`·`scripts/`가 그대로인가(`git status`로 확인).
   - `ConceptList.test.tsx`에서 기존 `it` 블록이 한 줄도 바뀌지 않았는가(`git diff`로 확인).
3. `phases/53-concept-indent/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 무리 `div`의 클래스 문자열, 딸린 개념의 헤딩 레벨, `article` 마크업을 한 곳에 둔 방식, 새 테스트 수와
     전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **딸린 개념 위에 머리 이름·화살표·아이콘을 붙이거나 접기를 만들지 마라.** 이유: 사용자가 고른 장치는 들여쓰기와 세로선뿐이다
  (ADR-041 기각한 안).
- **세로선에 색을 칠하거나 `border-l-2` 이상으로 굵게 하지 마라.** 이유: 색은 정답·오답·중요도에만 쓴다(UI_GUIDE 「디자인 원칙」).
  선은 경계선 색 `border-border`다.
- **딸린 개념의 제목 글자 크기·굵기를 바꾸지 마라.** 이유: 소속은 들여쓰기가 보이고, 제목까지 줄이면 딸린 개념이 덜 중요해 보인다
  (UI_GUIDE 「딸린 개념」).
- **딸린 개념들을 머리 `article` 안에 넣지 마라.** 이유: 도식 테스트 여럿이 `figure.closest('article')`의 `lastElementChild`와
  `figure` 수를 단언한다. 머리 `article` 안에 딸린 개념이 들어가면 그 단언이 깨지고, 검색에서 들어온 `#id` 스크롤의 대상도
  흐려진다.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`의 `figure` 클래스를 고치지 마라.** 이유: phase 38~52가 320·390·1280px에서
  실측한 값이다. 딸린 무리 쪽 클래스 하나(`max-sm:[&_figure]:-ml-[37px]`)로 같은 폭을 지킨다.
- **`src/data/topics.json`을 고치지 마라.** 이유: 데이터는 step 2가 판정 파일대로 넣는다.
- 기존 테스트를 깨뜨리지 마라.
