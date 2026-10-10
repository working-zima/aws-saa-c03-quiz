# Step 0: concept-groups

## 배경

개념 읽기 화면은 주제 안의 개념을 모두 같은 높이(h2)로 그린다. 그래서 `data-transfer-services`에서 「DataSync」와
「Snowball Edge」 사이에 있는 여섯 개가 DataSync에 딸린 개념이라는 것이 화면에 보이지 않는다. 사용자가 이를 짚었고,
딸린 개념을 머리 개념 아래로 들여써 보이기로 정했다. 결정과 이유는 `docs/ADR.md` **ADR-041**에 있다.

이 phase는 네 단계로 간다. 이 step은 첫 단계다.

| step | 무엇 |
|---|---|
| **0 (이 step)** | 타입에 `parentId`를 더하고, 개념을 머리와 딸린 개념으로 묶는 순수 함수와 규칙 검사 함수를 만든다 |
| 1 | `ConceptList`가 그 함수로 딸린 개념을 들여써 그린다 |
| 2 | 표본 5개 주제의 데이터에 `parentId`를 넣는다 |
| 3~ | 나머지 주제 (표본을 사람이 확인한 뒤 따로 정한다) |

**이 step은 데이터(`topics.json`)와 화면(`ConceptList`)을 건드리지 않는다.**

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-041** 전체, 그리고 ADR-033의 다섯 규칙(규칙 4가 말하는 비교 개념)
- `docs/ARCHITECTURE.md`의 「데이터 모델」 중 `interface Concept`와 그 아래 「주제 안의 개념 배열은 서비스 블록 순서다」 절
  (특히 「예외는 `parentId` 하나다」 문단과 세 규칙)
- `src/types/content.ts`
- `src/lib/navigation.ts`, `src/lib/navigation.test.ts` — 이 저장소의 순수 함수와 테스트 모양
- `src/data/data.test.ts`의 머리(1~5행)와 끝 — 새 `describe`를 붙일 자리
- `src/data/index.ts` — `topics`의 타입

## 작업

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

### 1. 타입 — `src/types/content.ts`

`Concept`에 선택 필드 하나를 더한다. 자리는 `id` 바로 뒤다(데이터 줄에서도 `id` 바로 뒤에 온다).

```ts
export interface Concept {
  id: string
  parentId?: string // 딸린 개념만. 같은 주제 안 머리 개념의 id (ADR-041)
  name: string
  summary: string
  paragraphs: string[]
}
```

같은 파일에 화면이 쓸 묶음 타입을 더한다. 데이터 타입은 `src/types/`에 한 곳에서 정의한다(CLAUDE.md).

```ts
// 머리 개념 하나와 그 바로 뒤에 이어지는 딸린 개념들. 딸린 개념이 없으면 children은 빈 배열이다.
export interface ConceptGroup {
  concept: Concept
  children: Concept[]
}
```

### 2. 순수 함수 — 새 파일 `src/lib/concept-groups.ts`

React에 의존하지 않는다. 두 함수를 내보낸다.

```ts
export function groupConcepts(concepts: Concept[]): ConceptGroup[]
export function hierarchyProblems(topic: Topic): string[]
```

#### `groupConcepts`

배열 순서대로 훑으며 묶음을 만든다. **입력 순서를 바꾸지 않는다** — 묶음을 펼치면(`concept`, 이어서 `children`) 입력과
같은 순서여야 한다.

- 개념의 `parentId`가 **바로 앞 묶음의 머리 id와 같으면** 그 묶음의 `children` 끝에 넣는다.
- 그 밖의 모든 경우 — `parentId`가 없거나, 다른 개념을 가리키거나, 가리키는 머리가 목록에 없거나, 사이에 다른 묶음이
  끼어 있거나, 딸린 개념을 가리키면 — **새 묶음의 머리로 세운다**(평평하게 그린다는 뜻이다).

마지막 규칙이 중요하다. 화면이 개념 하나만 넘겨 그리는 곳이 있다(도식 테스트 등). 그때 딸린 개념은 자기 머리가 목록에
없으므로 지금처럼 평평하게 그려져야 한다. 잘못된 데이터도 화면을 깨지 않고 평평하게 그리며, 그 데이터는 아래
`hierarchyProblems`가 잡는다.

#### `hierarchyProblems`

주제 하나를 받아 ADR-041의 세 규칙을 어긴 자리를 사람이 읽을 문장으로 돌려준다. 어긴 것이 없으면 빈 배열이다.
**각 문장에는 문제가 된 개념의 id를 넣는다.**

1. `parentId`가 같은 주제에 없는 id이거나 자기 자신의 id다.
2. `parentId`가 가리키는 개념에 다시 `parentId`가 있다(세 단).
3. 딸린 개념이 머리 바로 뒤에 끊김 없이 이어지지 않는다 — 머리가 딸린 개념보다 뒤에 있거나, 머리와 그 개념 사이에
   `parentId`가 같지 않은 개념이 하나라도 있다.

한 개념이 여러 규칙을 어겨도 된다. 순서·문구는 구현 재량이다.

### 3. 테스트 — 새 파일 `src/lib/concept-groups.test.ts`

가짜 개념으로 쓴다(`id`·`name`·`summary`·`paragraphs`는 아무 값). 적어도 아래를 단언한다.

`groupConcepts`
1. `parentId`가 없는 개념만 있으면 개념마다 묶음 하나, `children`은 모두 빈 배열이다.
2. `[A, B(parent A), C(parent A), D]` → 묶음 둘: `A`의 `children`이 `[B, C]`, `D`의 `children`이 `[]`.
3. 묶음을 펼친 순서가 입력 순서와 같다(2의 입력과 다른 입력 하나 이상으로).
4. `[B(parent A)]`처럼 머리가 목록에 없으면 `B`가 머리인 묶음 하나다.
5. `[A, X, B(parent A)]`처럼 사이에 다른 개념이 끼면 `B`는 자기 묶음의 머리다.
6. `[A, B(parent A), C(parent B)]`처럼 딸린 개념을 가리키면 `C`는 자기 묶음의 머리다.
7. 빈 배열 → 빈 배열.

`hierarchyProblems`
8. 위 2의 개념들로 만든 주제 → `[]`.
9. 규칙 1(없는 id), 규칙 1(자기 자신), 규칙 2(세 단), 규칙 3(머리가 뒤에 있음), 규칙 3(사이에 다른 개념)을 각각 하나씩 일으킨
   주제 → 결과가 비어 있지 않고, 그 문장에 문제가 된 개념의 id가 들어 있다. 다섯 경우를 따로 단언한다.

### 4. 전 주제 검사 — `src/data/data.test.ts`

파일 **맨 끝**에 `describe` 하나를 새로 붙인다. 다른 줄은 한 줄도 바꾸지 않는다. import는 파일 머리의 기존 import 뒤에
`hierarchyProblems` 하나를 더한다.

```ts
describe('개념 계층 (ADR-041)', () => {
  it('모든 주제의 parentId가 같은 주제·두 단·연속 규칙을 지킨다', () => {
    // 각 주제의 hierarchyProblems를 모아 빈 배열인지 본다. 실패하면 문장이 그대로 보이게 단언한다.
  })
})
```

지금 데이터에는 `parentId`가 없으므로 이 테스트는 통과한다. step 2부터 데이터가 들어오면 이 테스트가 그 데이터를 지킨다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/53-concept-indent/verify-hierarchy.mjs 0
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `src/lib/concept-groups.ts`가 React를 import하지 않는가.
   - `ConceptGroup`을 `src/types/content.ts` 밖에서 다시 정의하지 않았는가.
   - `src/data/topics.json`·`src/data/questions.json`·`scripts/`·`src/components/`가 그대로인가(`git status`로 확인).
   - `data.test.ts`에서 바뀐 것이 import 한 줄과 맨 끝 `describe` 하나뿐인가(`git diff`로 확인).
3. `phases/53-concept-indent/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 두 함수의 시그니처, `ConceptGroup` 위치, `groupConcepts`가 평평하게 그리는 경우, 새 테스트 수와
     전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`src/data/topics.json`에 `parentId`를 넣지 마라.** 이유: 데이터는 step 2에서 판정 파일(`hierarchy.json`)대로 넣는다.
  이 step은 그릇만 만든다.
- **`ConceptList.tsx`를 고치지 마라.** 이유: 화면은 step 1이 한 레이어로 맡는다.
- **`groupConcepts`가 개념의 순서를 바꾸거나, 딸린 개념을 머리 쪽으로 끌어오지 마라.** 이유: 순서는 ADR-033이 정한 학습
  순서다. 떨어진 딸린 개념을 붙여 주면 순서와 화면이 어긋나고, 그런 데이터는 고쳐야 할 대상이지 감출 대상이 아니다.
- **`hierarchyProblems`를 `groupConcepts`의 결과만으로 판정하지 마라.** 이유: 규칙 1(없는 id·자기 자신)은 묶음으로는
  평평한 개념과 구분되지 않는다. 세 규칙을 각각 검사한다.
- **세 단(딸린 개념 아래 딸린 개념)을 지원하지 마라.** 이유: ADR-041이 두 단까지만 허용한다.
- 기존 테스트를 깨뜨리지 마라.
