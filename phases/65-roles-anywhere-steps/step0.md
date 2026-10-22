# Step 0: step-list-parse

## 배경

ADR-050이 개념 하나(`identity-federation.iam-roles-anywhere`, step 2에서 들어온다)에 **단계 목록**을 허용한다. 따라 하는 절차라 번호 목록과 두 단계
하위 항목이 필요하다. 데이터는 지금처럼 `paragraphs: string[]`이고, 문자열 앞머리로 구조를 적는다(ADR-046과 같은 방식). 이 step은 그 표기를 읽는
**순수 함수**만 만든다. 화면(step 1)·데이터(step 2)·그림(step 3)은 뒤 step의 범위다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-050**(특히 「데이터 표기 — 단계 목록」)과 **ADR-046**
- `docs/UI_GUIDE.md`의 「타이포그래피」 중 「본문 목록」·「단계 목록」
- `src/lib/paragraph-blocks.ts`, `src/lib/paragraph-blocks.test.ts` — 지금의 `- ` 목록 묶기
- `src/components/ConceptList.tsx` — 이 함수를 쓰는 곳(이 step에서는 고치지 않는다)
- `phases/65-roles-anywhere-steps/changes.json`의 `paragraphs` — 실제로 읽어야 할 입력(95개 문단)

## 작업

### 표기 규칙 (ADR-050)

- 깊이 = 문단 앞 공백 수 / 2. 0·2·4칸만 온다(0·1·2단).
- 맨 바깥(0단)의 `N. ` → 번호 항목. `N`은 글에 적힌 수다. 0단의 `- ` → 지금의 ADR-046 목록 항목. 0단의 표지 없는 문단 → 일반 문단.
- 1·2단 문단은 **바로 위로 올라가며 처음 만나는 한 단 얕은 항목**에 딸린다. `- `로 시작하면 하위 글머리 항목, 표지 없으면 그 항목 안의 이어지는 문단이다.
  1·2단에는 `N. `가 오지 않는다.
- 잇닿은 번호 항목(사이에 그 하위 문단만 있는)이 단계 목록 하나가 된다. 0단의 일반 문단이나 `- ` 항목이 오면 끝난다. 그래서 같은 개념 안에 단계 목록이
  여럿(1~8, 9~15, 16~19) 생기고 각각 시작 번호를 갖는다.
- 한 항목 안에서 하위 글머리 항목과 이어지는 문단이 번갈아 올 수 있다(예: 항목 → 글머리 여섯 → 문단 → 글머리 셋 → 문단). 글머리 묶음은 잇닿은 것끼리
  하나가 된다.

### 시그니처

`src/lib/paragraph-blocks.ts`에 더한다. 기존 export(`LIST_ITEM_MARKER`, `isListItem`, `groupParagraphs`, `stripListMarker`)의 이름은 그대로 둔다.

```ts
export type ParagraphBlock =
  | { kind: 'paragraph'; index: number; text: string }                 // 그대로
  | { kind: 'list'; items: { index: number; text: string }[] }         // 그대로 (ADR-046, 0단 `- `)
  | { kind: 'steps'; start: number; items: StepItem[] }                 // 새것 (ADR-050)

export interface StepItem { index: number; number: number; text: string; children: SubBlock[] }
export type SubBlock =
  | { kind: 'paragraph'; index: number; text: string }
  | { kind: 'bullets'; items: SubItem[] }
export interface SubItem { index: number; text: string; children: SubBlock[] }
```

- `index`는 원래 `paragraphs` 안의 위치다(약어 툴팁이 이 번호로 조각을 찾는다). `text`는 들여쓰기와 표지(`N. `, `- `)를 뗀 글이다.
- `groupParagraphs(paragraphs)`가 위 세 종류를 돌려준다. 단계 목록이 없는 입력에서는 **지금과 한 글자도 다르지 않은 결과**를 돌려야 한다.
- `stripListMarker(paragraph)`가 들여쓰기와 표지(0단 `N. `, 어느 단이든 `- `)를 뗀다. 표지 없는 들여쓴 문단은 들여쓰기만 뗀다. `-항목`·`A - B`·`''`은 그대로다.
- `isListItem`은 바꾸지 않는다(0단 `- `만 참). 데이터 테스트가 ADR-046 목록을 세는 데 쓴다.
- 규칙에 맞지 않는 입력(부모 없는 들여쓴 문단, 6칸 들여쓰기 등)은 데이터 테스트가 막는다. 함수는 **예외를 던지지 말고** 그런 문단을 0단 일반 문단으로 둔다.
  이유: 화면 렌더 중에 던지면 개념 화면 전체가 ErrorBoundary로 떨어진다.

### 테스트 먼저 (TDD)

`src/lib/paragraph-blocks.test.ts`에 `it`을 더하고, 실패를 확인한 뒤 구현한다. 기존 `it`은 고치지 않는다. 최소한 다음을 단언한다.

1. `['1. 가', '2. 나']` → steps 하나, `start` 1, 항목 둘, `number` 1·2, 자식 없음.
2. `['9. 가', '  - 나', '    - 다', '    라', '  마']` → 9번 항목 하나. 자식: bullets(나 → 자식 bullets(다), paragraph(라)), paragraph(마). 모든 `index`가 원래 위치다.
3. 항목 안에서 글머리 → 문단 → 글머리가 오면 bullets 둘과 그 사이 paragraph가 순서대로 나온다.
4. `['**머리**', '1. 가', '  - 나', '**머리2**', '설명', '9. 다']` → paragraph, steps(start 1), paragraph, paragraph, steps(start 9).
5. 0단 `- ` 목록과 단계 목록이 한 배열에 있어도 서로 섞이지 않는다.
6. `stripListMarker`: `'12. 가'` → `'가'`, `'  - 나'` → `'나'`, `'    다'` → `'다'`, `'  가'` → `'가'`, 기존 반례(`-항목`·`A - B`·`''`)는 그대로.
7. 부모 없는 `'  가'`(맨 앞), 6칸 들여쓰기는 던지지 않고 0단 paragraph가 된다.
8. `changes.json`의 실제 `paragraphs`(테스트 안에 `readFileSync`나 import로 읽어도 되고, 대표 부분을 옮겨 써도 된다)를 넣으면 steps 셋(start 1·9·16, 항목 8·7·4)이
   나오고, 블록을 펼친 글이 `paragraphs.map(stripListMarker)`와 같은 순서·같은 글이다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다. 새 `it`이 구현 전에 실패했는지 `summary`에 적는다.
2. `git status`로 바뀐 파일이 `src/lib/paragraph-blocks.ts`, `src/lib/paragraph-blocks.test.ts`와 phase 메타데이터뿐인지 확인한다.
3. `phases/65-roles-anywhere-steps/index.json`의 step 0을 갱신한다. 성공이면 `summary`에 새 타입 이름·새 테스트 수·전체 테스트 수를 적는다.

## 금지사항

- **`ConceptList.tsx`·데이터·도식을 고치지 마라.** 이유: step 1~3의 범위다. 이 step이 끝나도 화면은 그대로여야 한다(단계 목록이 있는 데이터가 아직 없다).
- **`paragraphs`의 타입을 바꾸지 마라.** 이유: 검색·약어 툴팁·구조 가드·전사 검사가 `string[]`을 읽는다(ADR-046 「데이터 표기로 정한 이유」).
- **기존 `it`과 `isListItem`의 뜻을 바꾸지 마라.** 이유: ADR-046 목록 가드(`목록이 있는 개념은 이 21개뿐이다`)가 0단 `- `만 센다.
- 기존 테스트를 깨뜨리지 마라.
