# Step 0: shuffle-lib

## 배경 — 순서가 고정이라 자리를 외운다

지금 확인 문제는 `questions.json`의 배열 순서를 그대로 낸다. 보기 4개도 JSON에 적힌 순서
그대로다. **주제 하나를 두 번째 풀 때부터는 문제를 읽지 않고 자리로 답하게 된다** —
"이 주제 3번은 두 번째 보기". 이 앱은 복습 화면이 오답 개념으로 되돌려 보내는 구조라
같은 주제를 여러 번 푸는 것이 정상 경로다.

**결정과 근거는 `docs/ADR.md`의 ADR-011에 이미 적혀 있다. 먼저 읽어라.**

이 step은 **섞는 순수 로직만** 만든다. 화면에 붙이는 것은 step 1이다.
`src/pages/`를 이 step에서 건드리지 마라.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-011** — 왜 섞는지, 왜 매핑이 아니라 새 `Question`을 만드는지.
- `docs/ARCHITECTURE.md`의 **"문항과 보기의 순서"** 절 — 이 파일이 지켜야 할 규칙.
- `src/types/content.ts` — `Question`의 `choices`는 **4칸 튜플**이고 `answerIndex`는
  `0 | 1 | 2 | 3` 리터럴 유니온이다. 이 타입을 **바꾸지 마라.**
- `src/lib/stats.ts`, `src/lib/grading.ts` — 이 디렉토리의 코드 스타일.
- `src/lib/grading.test.ts` — lib 테스트 스타일. 첫 줄의 `// @vitest-environment node`를 포함해서.

## 만드는 것

새 파일 **두 개**다. 다른 파일은 만들지도 고치지도 마라.

- `src/lib/shuffle.ts`
- `src/lib/shuffle.test.ts`

### 공개 API — 정확히 이 셋

```ts
export function shuffle<T>(items: T[], rng: () => number): T[]
export function shuffleChoices(question: Question, rng: () => number): Question
export function shuffleQuestions(questions: Question[], rng: () => number): Question[]
```

**난수는 반드시 인자로 받는다. 이 파일에 `Math.random`을 쓰지 마라.** 기본값으로도 두지 마라.
이유: 난수를 주입해야 결과를 단언할 수 있고, `Math.random`이 흩어지면 테스트가 불가능해진다.
`Math.random`을 넘기는 쪽은 화면이고 그건 step 1이다.

### `shuffle` — 알고리즘을 이대로 고정한다

**내림차순 Fisher-Yates다.** 테스트의 기대값이 이 순서에 달려 있으므로 다른 변형을 쓰지 마라.

```
i를 items.length - 1부터 1까지 1씩 줄이며:
    j = Math.floor(rng() * (i + 1))
    items[i]와 items[j]를 맞바꾼다
```

- **원본 배열을 바꾸지 마라.** 복사본을 만들어 그 위에서 맞바꾸고 복사본을 돌려준다.
- 길이 0·1인 배열에서는 `rng`를 **한 번도 부르지 않는다.** 위 루프가 그렇게 돌면 자동이다.
  길이를 특수 처리하는 `if`를 따로 넣지 마라.
- 정렬 함수로 흉내내지 마라 — `items.sort(() => rng() - 0.5)`는 균등하지 않고
  엔진마다 결과가 다르다.

검산해 둔 예시다. 테스트에 그대로 써라.

```
shuffle(['a','b','c','d'], rng)   // rng가 0, 0, 0을 차례로 돌려줄 때
  i=3: j=0 → ['d','b','c','a']
  i=2: j=0 → ['c','b','d','a']
  i=1: j=0 → ['b','c','d','a']
  결과: ['b','c','d','a'],  rng 호출 3회
```

### `shuffleChoices` — 정답이 따라 움직인다

**보기 4개의 순서를 섞고, `answerIndex`를 정답 보기가 옮겨 간 자리로 갱신한 새 `Question`을
돌려준다.** 이 함수가 지켜야 하는 불변식은 하나다.

```
결과.choices[결과.answerIndex] === 원본.choices[원본.answerIndex]
```

권장 구현이다. 튜플 타입을 억지로 캐스팅하지 않아도 된다.

```ts
const order = shuffle([0, 1, 2, 3], rng)          // 섞인 원본 인덱스 4개
const choices = [
  question.choices[order[0]],
  question.choices[order[1]],
  question.choices[order[2]],
  question.choices[order[3]],
] as [string, string, string, string]
const answerIndex = order.indexOf(question.answerIndex) as 0 | 1 | 2 | 3
return { ...question, choices, answerIndex }
```

- **`id`·`topicId`·`conceptId`·`prompt`·`explanation`은 그대로 둔다.**
- **원본 `question` 객체를 수정하지 마라.** 새 객체를 만들어 돌려준다.
- 원본 인덱스와 화면 인덱스의 매핑을 결과에 담지 마라. `Question`에 필드를 더하지 마라.
  ADR-011이 정한 것이다.

### `shuffleQuestions` — 문항 먼저, 그다음 보기

```
1. shuffle(questions, rng)로 문항 순서를 섞는다
2. 그 결과의 각 문항에 shuffleChoices(question, rng)를 순서대로 적용한다
```

이 호출 순서를 바꾸지 마라 — 테스트가 `rng` 호출 순서에 의존한다.
원본 배열과 원본 문항 객체를 둘 다 그대로 둔다.

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

`src/lib/shuffle.test.ts`를 새로 만든다. 첫 줄은 `// @vitest-environment node`다
(`src/lib/grading.test.ts`와 같다. 이 계층은 DOM 없이 테스트한다).

난수 스텁은 이렇게 하나만 두고 재사용해라.

```ts
function seq(...values: number[]) {
  let index = 0
  return () => values[index++]
}
```

### 반드시 들어가야 하는 검증

**`shuffle`**
1. 주어진 난수열에 대해 정해진 순열을 낸다 — 위 검산 예시(`['b','c','d','a']`)를 그대로 쓴다.
2. 원본 배열이 호출 뒤에도 그대로다.
3. 원소를 잃지도 더하지도 않는다 (정렬해 비교하거나 길이 + 포함 여부로 확인).
4. 빈 배열과 원소 1개짜리 배열에서 `rng`를 한 번도 부르지 않는다
   (`vi.fn()`으로 감싸 `toHaveBeenCalledTimes(0)`).

**`shuffleChoices`**
5. **정답 불변식** — `결과.choices[결과.answerIndex]`가 원본의 정답 보기 문자열과 같다.
   이것을 **서로 다른 난수열 여러 개로** 확인해라. 하나만 통과하는 구현은 우연일 수 있다.
   `answerIndex`가 0인 문항과 3인 문항 양쪽을 넣어봐라.
6. 보기 4개의 **집합**이 보존된다.
7. `id`·`prompt`·`explanation`이 그대로다.
8. 원본 문항 객체가 바뀌지 않는다 (`choices`·`answerIndex` 둘 다 확인).

**`shuffleQuestions`**
9. 문항 순서가 바뀐다 — 주어진 난수열에 대한 `id` 순서를 단언한다.
10. 각 문항의 정답 불변식이 그대로 성립한다.
11. 원본 배열과 원본 문항 객체가 바뀌지 않는다.

### 하지 마라

- **통계적 균등성을 검증하려 하지 마라.** 수천 번 돌려 분포를 보는 테스트를 쓰지 마라.
  느리고 간헐적으로 깨진다. 알고리즘이 Fisher-Yates인 것으로 충분하다.
- **`Math.random`을 `vi.spyOn`으로 가로채지 마라.** 이 파일은 `Math.random`을 부르지 않는다.
- `src/data/questions.json`의 실제 문항을 불러다 쓰지 마라. 테스트용 문항을 파일 안에 만든다.
- 기존 테스트 파일을 고치지 마라. **하나도 고칠 필요가 없다.**

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
node scripts/check-structure.mjs
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다. `node scripts/check-structure.mjs`를 빼먹지 마라.
2. 아래를 그대로 실행해 결과를 확인한다.

```bash
grep -c '^export function' src/lib/shuffle.ts        # 3
grep -c 'Math.random' src/lib/shuffle.ts             # 0
grep -c 'Math.random' src/lib/shuffle.test.ts        # 0
grep -nE "from 'react'|useState|useMemo|\.sort\(" src/lib/shuffle.ts   # 결과 없음
grep -c 'vitest-environment node' src/lib/shuffle.test.ts              # 1
git diff --name-only && git status --porcelain       # 아래 세 개뿐
```

변경/추가돼야 하는 파일:

```
phases/15-shuffle/index.json
src/lib/shuffle.ts          (새 파일)
src/lib/shuffle.test.ts     (새 파일)
```

3. 체크리스트:
   - `git diff src/pages/ src/types/ src/hooks/ src/components/ src/data/ docs/`가
     **비어 있는가?** 비어 있지 않으면 되돌려라.
   - `src/lib/shuffle.ts`가 `src/types/content.ts`에서 `Question`을 **타입으로만**
     가져오는가 (`import type`)?
4. 결과에 따라 `phases/15-shuffle/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`src/pages/`를 건드리지 마라.** 화면에 붙이는 것은 step 1이다. 이 step에서 `QuizPage`에
  손을 대면 두 step을 한 번에 리뷰할 수 없게 된다.
- **`src/types/content.ts`를 고치지 마라.** `answerIndex`를 `number`로 넓히거나
  `Question`에 필드를 더하지 마라. 새 `Question`을 만드는 방식이면 타입은 그대로 맞는다.
- **`src/lib/grading.ts`를 고치지 마라.** `isCorrect`는 섞인 문항에도 그대로 맞는다.
  고쳐야 할 것 같으면 `shuffleChoices`의 `answerIndex` 갱신이 틀린 것이다.
- **`src/data/`를 건드리지 마라.** 섞기는 런타임 동작이고 JSON은 저장 순서다.
- **`docs/`를 수정하지 마라.** ADR-011과 ARCHITECTURE는 이미 갱신돼 있다.
- 시드 문자열, 사용자별 고정 순서, localStorage 저장 같은 것을 만들지 마라.
  요청받은 것은 위 세 함수뿐이다.
- 외부 셔플 라이브러리를 설치하지 마라. 로컬 Node가 18.17.1이다.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
