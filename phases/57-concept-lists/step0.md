# Step 0: list-render

## 배경

개념 본문은 문단 문자열 배열(`paragraphs: string[]`)이고, 화면은 문단마다 `<p>` 하나를 그린다. 한 대상의 종류를 굵은 이름으로 하나씩 세운
본문(Storage Gateway의 세 게이트웨이, Route 53 라우팅 정책 일곱 같은 것)을 글머리 기호 목록으로 보이려 한다.

이 step은 **`docs/ADR.md`의 ADR-046**대로 **`- `(하이픈과 공백)로 시작하는 문단을 목록 항목으로 그리는 기능**만 만든다. 잇닿은 항목
문단들이 `<ul>` 하나가 된다. **데이터(`src/data/`)는 한 글자도 바꾸지 않는다** — 지금 데이터에는 `- `로 시작하는 문단이 없으므로, 이 step이
끝나도 실제 화면은 그대로다. 데이터는 step 1이 바꾼다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-046**(이 step의 결정), **ADR-044**(백틱 코드 표기 — 같은 「문자열 안의 표지」 방식), **ADR-037**(약어 툴팁)
- `docs/UI_GUIDE.md` 「타이포그래피」 — 「본문 목록」 행과 그 아래 **본문 목록(ADR-046)** 문단
- `src/components/ConceptList.tsx` — 문단을 그리는 곳. `markFirstOccurrences`에 `[summary, ...paragraphs]`를 넘기고 `glossaryAt(index + 1)`로
  문단마다 약어 조각을 꺼내는 구조를 이해하라
- `src/components/ConceptList.test.tsx` — 컴포넌트 테스트의 모양(가짜 개념을 만들어 `render`, `diagrams={{}}`, `glossary` 프롭)
- `src/lib/concept-groups.ts`와 `src/lib/concept-groups.test.ts` — 배열을 묶음으로 나누는 기존 순수 함수의 모양. 새 함수도 이렇게 짠다
- `src/lib/glossary.ts`의 `markFirstOccurrences`
- `src/components/EmphasizedText.tsx` — 항목 글도 이 컴포넌트로 그린다(고치지 않는다)
- `scripts/hooks/tdd-guard.sh` — 구현 파일을 고치려면 **같은 폴더에 같은 이름의 테스트 파일**이 먼저 있어야 한다

## 작업

### 1. 테스트를 먼저

두 파일에 테스트를 쓴다. 첫째는 새 파일, 둘째는 기존 파일에 `describe`를 **더한다**(기존 테스트는 고치지 않는다). 쓴 뒤 `npm test`를 돌려 새
테스트만 실패하는지 확인한다. 새 테스트 파일을 먼저 만들어야 TDD 가드가 `paragraph-blocks.ts` 생성을 허용한다.

**새 파일 `src/lib/paragraph-blocks.test.ts`** — `describe('paragraph-blocks (ADR-046)')`:

- `isListItem`: `'- 항목'`은 참. `'항목'`, `'-항목'`(공백 없음), `'A - B'`(중간의 하이픈), `''`은 거짓.
- `stripListMarker`: `'- **파일 게이트웨이**는'` → `'**파일 게이트웨이**는'`. 표지가 없는 문단은 그대로 돌려준다.
- `groupParagraphs`:
  - 표지 없는 문단만 있으면 `{ kind: 'paragraph' }` 블록만 원래 순서로 나오고, 각 `index`는 원래 배열 위치다.
  - `['머리', '- 가', '- 나', '꼬리']` → 문단(index 0) · 목록(항목 index 1·2, 글 `'가'`·`'나'`) · 문단(index 3).
  - 문단이 사이에 끼면 목록이 둘로 갈린다: `['- 가', '- 나', '중간', '- 다', '- 라']` → 목록 · 문단 · 목록.
  - 항목만 있는 배열(`['- 가', '- 나']`)은 목록 블록 하나다.
  - 빈 배열은 빈 배열이다.
  - 블록의 글을 원래 순서대로 이으면 `paragraphs.map(stripListMarker)`와 같다.

**`src/components/ConceptList.test.tsx`에 `describe('본문 목록 (ADR-046)')`** — 가짜 개념을 만들어 `ConceptList`를 렌더한다(`diagrams={{}}`):

- `paragraphs: ['머리 문단', '- **가**는 첫째다', '- **나**는 둘째다', '꼬리 문단']`이면 `<article>` 안에 `list`가 하나, `listitem`이 둘이고,
  머리·꼬리 문단은 `<p>`로 남는다. 순서는 머리 문단 → 목록 → 꼬리 문단이다(DOM 순서로 확인).
- `listitem`의 `textContent`는 `'- '`로 시작하지 않는다(표지가 화면에 나오지 않는다). `**가**`는 `strong`이 된다.
- `<ul>`의 클래스는 `docs/UI_GUIDE.md` 「본문 목록」 행 그대로다:
  `list-disc space-y-2 pl-5 text-[15px] leading-7 text-neutral-300 marker:text-neutral-500`. `<li>`의 클래스는 `break-keep`이다.
- 약어가 처음 나오는 곳이 목록 항목이면 그 `listitem` 안에서 버튼이 된다. 예: 요약과 첫 문단에 약어가 없고 `'- **가**는 NFS를 쓴다'`가 처음
  나오는 곳이면, `glossary`에 `NFS`를 주었을 때 버튼은 그 항목 안에 하나뿐이고, 버튼 뒤의 글은 표지 없이 이어진다.
- 문단 사이에 낀 두 목록은 `<ul>` 둘이 된다.
- 목록이 없는 개념은 지금과 같다 — `list` 역할 요소가 없고 문단마다 `<p>` 하나다.

### 2. 구현

**새 파일 `src/lib/paragraph-blocks.ts`** — React에 의존하지 않는 순수 함수다(ARCHITECTURE의 `src/lib/` 규칙).

```ts
export const LIST_ITEM_MARKER = '- '

export type ParagraphBlock =
  | { kind: 'paragraph'; index: number; text: string }
  | { kind: 'list'; items: { index: number; text: string }[] }

export function isListItem(paragraph: string): boolean
export function stripListMarker(paragraph: string): string
// 잇닿은 목록 항목을 목록 블록 하나로 묶는다. text는 표지를 뗀 글, index는 원래 paragraphs의 위치다.
export function groupParagraphs(paragraphs: string[]): ParagraphBlock[]
```

**`src/components/ConceptList.tsx`**:

- `concept.paragraphs.map(...)`으로 `<p>`를 그리던 자리를 `groupParagraphs(concept.paragraphs)`의 블록으로 바꾼다.
  - 문단 블록 → 지금과 **같은** `<p className="whitespace-pre-line break-keep text-[15px] leading-7 text-neutral-300">`.
  - 목록 블록 → `<ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-neutral-300 marker:text-neutral-500">` 안에 항목마다
    `<li className="break-keep">`. 항목 글은 `EmphasizedText`로 그린다.
  - `key`는 원래 문단 번호로 만든다(`${concept.id}-${index}`, 목록은 첫 항목의 번호).
- 약어 첫 등장 판정: `markFirstOccurrences`에 `[concept.summary, ...concept.paragraphs.map(stripListMarker)]`를 넘긴다. 표지를 떼지 않으면
  `- `가 첫 조각에 섞여 화면에 나온다. 블록의 `index`로 `glossaryAt(index + 1)`을 꺼낸다(지금과 같은 번호 체계).
- 컴포넌트 머리 주석에 「`- `로 시작하는 문단은 목록 항목이다(ADR-046)」를 한 줄 더한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
```

## 검증 절차

1. AC를 실행한다. 기대 결과: 빌드·린트 통과, 테스트는 기존 1268개와 새로 더한 테스트가 모두 통과, `check-structure.mjs` 「구조 이상 없음」,
   `sync-baseline.mjs --dry-run` 「갱신할 것이 없다」.
2. 바뀐 파일·새 파일이 아래 넷뿐인지 확인한다. 샌드박스에서 `git`을 실행할 수 없으면 그 사실을 `"summary"`에 적는다. 사람이 다시 확인한다.
   - `src/lib/paragraph-blocks.ts`(새 파일), `src/lib/paragraph-blocks.test.ts`(새 파일)
   - `src/components/ConceptList.tsx`, `src/components/ConceptList.test.tsx`
3. `phases/57-concept-lists/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 파일, 내보낸 함수 이름, 더한 테스트 수와 이름, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`src/data/`·`scripts/topics-baseline.json`·`phases/57-concept-lists/changes.json`을 고치지 마라.** 이유: 데이터는 step 1이
  `changes.json`대로 바꾼다. 이 step에서 데이터가 바뀌면 step 1의 검증(`verify-concept-lists.mjs`)이 기준을 잃는다.
- **위 네 파일 밖을 고치거나 만들지 마라.** `EmphasizedText.tsx`·`glossary.ts`·`search.ts`·도식 컴포넌트와 그 테스트도 고칠 필요가 없다.
  이유: 항목 글은 기존 `EmphasizedText`가 그리고, 검색은 표지를 지우지 않기로 했다(ADR-046 「데이터 표기로 정한 이유」). 도식 테스트 두 개가
  표지를 떼고 비교하도록 바꾸는 일은 데이터가 바뀌는 step 1이 한다 — 지금 데이터에는 표지가 없어 그 테스트들이 그대로 통과한다.
- **`Concept` 타입(`src/types/content.ts`)을 바꾸지 마라.** 이유: ADR-046은 `paragraphs: string[]`을 그대로 두고 문자열 안의 표지로 정했다.
- **번호 목록(`<ol>`)·중첩 목록·글머리 기호 색 강조를 만들지 마라.** 이유: UI_GUIDE 「본문 목록」이 금한다. 글머리 기호는 `neutral-500`뿐이다.
- **`<p>`의 클래스를 바꾸지 마라.** 이유: 목록이 아닌 문단은 지금과 한 글자도 다르지 않게 그려야 한다.
- **기존 테스트를 고치거나 지우지 마라.** 새 테스트만 더한다. TDD 가드나 다른 훅을 고치거나 우회하지 마라. 이유: 기존 단언이 깨지면 설계가
  예상하지 못한 의존이라 사람이 판단해야 한다.
- 새 의존성을 설치하지 마라.
