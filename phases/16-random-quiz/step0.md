# Step 0: random-quiz-lib

## 배경 — 문항 수를 두 화면이 공유한다

전체 문항에서 무작위로 뽑아 푸는 경로를 만든다. 문항 수는 **10 · 20 · 30 셋뿐**이고
`/random/:count`의 URL 세그먼트로 들어온다. 시작 화면은 그 목록으로 버튼을 그리고,
퀴즈 화면은 URL에서 받은 문자열이 그 셋 중 하나인지 검증해야 한다.
**두 화면이 각자 `[10, 20, 30]`을 적으면 한쪽만 고칠 때 버튼은 있는데 열리지 않는 값이 생긴다.**

**결정과 근거는 `docs/ADR.md`의 ADR-012에 이미 적혀 있다. 먼저 읽어라.**

이 step은 **상수와 파서만** 만든다. 화면은 step 2·3이다.
`src/pages/`·`src/components/`·`src/App.tsx`를 이 step에서 건드리지 마라.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-012** — 왜 셋으로 고정하는지, 왜 허용값 밖을 막는지.
- `docs/ARCHITECTURE.md`의 **"전체 범위 랜덤 세트"** 절 — 이 파일이 지켜야 할 규칙.
- `src/lib/navigation.ts` — 이 디렉토리의 코드 스타일. 짧고, React에 의존하지 않는다.
- `src/lib/grading.test.ts` — lib 테스트 스타일. 첫 줄의 `// @vitest-environment node`를 포함해서.

## 만드는 것

새 파일 **두 개**다. 다른 파일은 만들지도 고치지도 마라.

- `src/lib/random-quiz.ts`
- `src/lib/random-quiz.test.ts`

### 공개 API — 정확히 이 셋

```ts
export const RANDOM_QUIZ_COUNTS = [10, 20, 30] as const
export type RandomQuizCount = (typeof RANDOM_QUIZ_COUNTS)[number]
export function parseQuizCount(value: string | undefined): RandomQuizCount | null
```

- `as const`를 빼지 마라. 빼면 타입이 `number[]`가 되어 `RandomQuizCount`가 `number`가 된다.
- 값을 늘리거나 줄이지 마라. 정확히 `10, 20, 30` 세 개다.

### `parseQuizCount` — 문자열을 그대로 비교한다

**허용값을 문자열로 만들어 입력과 정확히 비교한다.** 이 구현을 그대로 써라.

```ts
export function parseQuizCount(value: string | undefined): RandomQuizCount | null {
  return RANDOM_QUIZ_COUNTS.find((count) => String(count) === value) ?? null
}
```

- **`Number()`·`parseInt()`·`Number.parseInt()`를 쓰지 마라.** `parseInt('20abc')`는 `20`이고
  `Number(' 20 ')`도 `20`이다. URL에 들어온 쓰레기가 유효한 값으로 통과한다.
  문자열 동등 비교는 `'020'`·`' 20 '`·`'20.0'`을 전부 걸러낸다.
- 정규식으로 숫자를 뽑아내지 마라. 위 한 줄로 끝난다.
- `undefined`가 들어올 수 있다. `useParams()`가 그렇게 돌려준다. 별도의 `if`로 처리하지 마라 —
  `String(count) === undefined`는 언제나 거짓이라 위 구현이 그대로 `null`을 낸다.

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

`src/lib/random-quiz.test.ts`를 새로 만든다. 첫 줄은 `// @vitest-environment node`다.

### 반드시 들어가야 하는 검증

1. `RANDOM_QUIZ_COUNTS`가 `[10, 20, 30]`이다.
2. `'10'`·`'20'`·`'30'`이 각각 숫자 `10`·`20`·`30`으로 나온다.
3. `undefined`가 `null`이다.
4. 허용값 밖의 숫자 문자열이 `null`이다 — `'15'`, `'0'`, `'246'`, `'-10'`을 전부 확인해라.
5. **숫자로 변환하면 통과해버리는 입력이 `null`이다** — `'020'`, `' 20 '`, `'20.0'`, `'20abc'`.
   이 넷이 이 파일의 핵심 회귀 방지선이다. 빼지 마라.
6. 빈 문자열 `''`이 `null`이다.

### 하지 마라

- 난수를 이 파일에 들이지 마라. 뽑기는 `src/lib/shuffle.ts`가 이미 한다.
  이 파일은 문항 수만 다룬다.
- `sampleQuestions` 같은 표본 추출 함수를 만들지 마라. 세트 구성은 화면에서
  `shuffleQuestions(...).slice(0, count)` 한 줄로 끝난다. step 2에서 한다.
- 기본값(`DEFAULT_COUNT` 같은 것)을 만들지 마라. 허용값 밖은 시작 화면으로 되돌린다.

## 검증 절차

아래를 전부 실행해 통과를 확인한 뒤 끝내라.

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

구조 확인 — 기대값이 옆에 적혀 있다.

```bash
grep -c 'export' src/lib/random-quiz.ts                       # 3
grep -nE 'parseInt|Number\(' src/lib/random-quiz.ts           # 결과 없음
grep -c 'it(' src/lib/random-quiz.test.ts                     # 6 이상
git diff --name-only                                          # 위 두 파일만
```

**검증 조건과 올바른 코드가 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**
조건을 통과시키려고 문자열을 쪼개거나 표현을 우회하지 마라.
