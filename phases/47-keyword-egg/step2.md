# Step 2: keyword-quiz-lib

## 배경

키워드 퀴즈(ADR-040)의 순수 로직을 만든다. 4지선다 문항 생성, 플래시카드 덱, 문항 수 해석, 로고 연속 탭 판정이다.
화면은 step 3·4가 만든다. 이 계층은 React와 DOM에 의존하지 않는다.

퀴즈의 형식은 세 가지다(사용자 결정).
- `summary-to-term`: 요약을 보여 주고 키워드 넷 중 하나를 고른다.
- `term-to-summary`: 키워드를 보여 주고 요약 넷 중 하나를 고른다.
- `flashcard`: 키워드를 보고 떠올린 뒤 뒤집어 요약을 확인한다. 채점하지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-040**
- `docs/ARCHITECTURE.md`의 「헤더는 모든 화면에서 같다」(로고 연속 탭 문단), 「문항과 보기의 순서」
- `src/types/keywords.ts`, `src/lib/keyword-crypto.ts`: step 1 산출물
- `src/lib/shuffle.ts`, `src/lib/shuffle.test.ts`: 섞기 함수와 `rng` 주입 관례. **이 파일의 `shuffle`을 재사용한다.**
- `src/lib/random-quiz.ts`: 문항 수 해석의 선례

## 작업

### 1. `src/types/keywords.ts`에 타입을 더한다

```ts
export type KeywordQuizMode = 'summary-to-term' | 'term-to-summary' | 'flashcard'
export type KeywordChoiceMode = Exclude<KeywordQuizMode, 'flashcard'>

export interface KeywordQuestion {
  keywordId: string
  prompt: string
  choices: [string, string, string, string]
  answerIndex: 0 | 1 | 2 | 3
}
```

### 2. `src/lib/keyword-quiz.ts`

```ts
export const KEYWORD_QUIZ_MODES: readonly KeywordQuizMode[]   // 위 순서 그대로
export const KEYWORD_QUIZ_COUNTS = [10, 20] as const
export const KEYWORD_QUIZ_ALL = 'all'
export type KeywordQuizCount = (typeof KEYWORD_QUIZ_COUNTS)[number] | typeof KEYWORD_QUIZ_ALL

export function resolveKeywordCount(choice: KeywordQuizCount, total: number): number
export function buildKeywordQuestions(keywords: Keyword[], mode: KeywordChoiceMode, count: number, rng: () => number): KeywordQuestion[]
export function buildFlashcards(keywords: Keyword[], count: number, rng: () => number): Keyword[]

export const LOGO_TAP_COUNT = 5
export const LOGO_TAP_WINDOW_MS = 1500
export function registerLogoTap(taps: readonly number[], now: number): { taps: number[]; unlocked: boolean }
```

규칙:

- **`resolveKeywordCount`**: `'all'`이면 `total`을 돌려준다. 숫자면 `Math.min(choice, total)`이다.
- **`buildKeywordQuestions`**
  - 키워드를 섞어 앞에서 `count`개를 고른다. 한 판 안에서 같은 키워드가 두 번 나오지 않는다.
  - `summary-to-term`: `prompt`는 정답의 `summary`, 보기는 `term` 넷이다. `term-to-summary`: `prompt`는 정답의 `term`, 보기는 `summary` 넷이다.
  - **오답 보기 셋은 정답과 같은 `section`에서 먼저 뽑는다.** 같은 단원에서 무작위로 고르고, 셋이 안 되면 나머지를 전체에서
    무작위로 채운다. 헷갈리는 것끼리 구분하는 연습이 목적이다.
  - 오답 후보에서 정답과 `term`이 같거나 `summary`가 같은 키워드는 뺀다. 보기 넷의 문자열이 서로 모두 달라야 한다.
    공백을 지운 값으로 비교한다.
  - 보기 순서는 섞고, `answerIndex`는 섞은 뒤의 정답 위치다.
  - 모든 무작위는 인자로 받은 `rng`로만 한다. `Math.random`을 직접 부르지 마라. 같은 `rng` 수열이면 결과가 같아야 한다.
- **`buildFlashcards`**: 섞어서 앞에서 `count`개를 고른다. 중복은 없다.
- **`registerLogoTap`**: `taps`에서 `now - t < LOGO_TAP_WINDOW_MS`인 것만 남기고 `now`를 덧붙인다. 그 개수가 `LOGO_TAP_COUNT` 이상이면
  `{ taps: [], unlocked: true }`를, 아니면 `{ taps: 남긴 것, unlocked: false }`를 돌려준다. 입력 배열을 변경하지 않는다.

### 3. 테스트 `src/lib/keyword-quiz.test.ts` (첫 줄 `// @vitest-environment node`. 먼저 쓴다)

가짜 키워드 픽스처를 테스트 안에서 만든다. 단원 A에 5개, 단원 B에 2개, 단원 C에 1개 정도로 둔다. 실제 키워드 데이터는 쓰지 않는다.

- `resolveKeywordCount`: `10`/`20`/`'all'`, 그리고 `total`보다 큰 요청을 확인한다.
- 두 모드 각각: 문항 수가 `count`와 같다. `keywordId`가 겹치지 않는다. `choices[answerIndex]`가 정답의 `term`(또는 `summary`)이다.
  `prompt`가 반대쪽 필드다.
- 단원 A의 키워드가 정답이면 오답 셋이 모두 단원 A에서 나온다.
- 단원 C(1개)의 키워드가 정답이면 보기가 넷이고, 오답은 다른 단원에서 채워진다.
- 요약이 정답과 같은 키워드(공백만 다른 것 포함)가 오답 보기에 나오지 않는다.
- 같은 시드 `rng`로 두 번 부르면 결과가 같다. 결정적 `rng`는 테스트 안에서 만든다. 간단한 LCG면 충분하다.
- `buildFlashcards`: 개수와 중복 없음을 확인한다.
- `registerLogoTap`: 1.5초 안에 다섯 번이면 다섯 번째에 `unlocked: true`이고 `taps`가 비워진다. 네 번이면 `false`다. 간격이 1.5초 이상
  벌어지면 창 밖의 탭은 버려진다. 입력 배열이 바뀌지 않는다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `src/lib/keyword-quiz.ts`가 React·DOM·`localStorage`·`Math.random`을 참조하지 않는다.
   - 변경된 파일이 `src/types/keywords.ts`, `src/lib/keyword-quiz.ts`, `src/lib/keyword-quiz.test.ts`뿐이다.
3. `phases/47-keyword-egg/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 공개 함수·상수 시그니처와 오답 선택 규칙을 한 줄로 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **기존 `src/lib/random-quiz.ts`·`shuffle.ts`·`grading.ts`를 고치지 마라.** 이유: 기존 퀴즈와 분리된 기능이다(ADR-040). `shuffle`은 import해서 쓰기만 한다.
- **`Question` 타입이나 `QuizRunner`에 맞추려고 키워드를 `Question`으로 바꾸지 마라.** 이유: `Question`은 `topicId`·`conceptId`·`explanation`을 요구하고,
  기존 진행률·복습과 엮인다.
- **어떤 저장소에도 쓰지 마라.** 이유: 기록 없음이 사용자 결정이다(ADR-040).
- 기존 테스트를 깨뜨리지 마라.
