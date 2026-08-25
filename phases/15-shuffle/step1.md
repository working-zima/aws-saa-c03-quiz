# Step 1: quiz-shuffle

## 배경

step 0에서 `src/lib/shuffle.ts`에 `shuffle` · `shuffleChoices` · `shuffleQuestions`를 만들었다.
아직 아무도 부르지 않는다. 이 step에서 **확인 문제 화면에 붙인다.**

결정과 근거는 `docs/ADR.md`의 **ADR-011**, 지켜야 할 규칙은 `docs/ARCHITECTURE.md`의
**"문항과 보기의 순서"** 절에 있다. 둘 다 먼저 읽어라.

## 읽어야 할 파일

- `docs/ADR.md`의 ADR-011, `docs/ARCHITECTURE.md`의 "문항과 보기의 순서" 절.
- `docs/ARCHITECTURE.md`의 **"확인 문제 안의 문항 이동"** 절 — `selections` 배열 규칙.
  이 step은 그 규칙을 **바꾸지 않는다.**
- `src/lib/shuffle.ts` — step 0이 만든 API.
- `src/pages/QuizPage.tsx` — 이 step에서 고치는 **유일한 소스 파일**이다.
- `src/pages/QuizPage.test.tsx` — 기존 테스트 26개가 있다.

## 결정된 동작

**확인 문제 화면에 들어갈 때 그 주제의 문항 순서와 각 문항의 보기 순서를 한 번 섞는다.**
섞은 결과는 그 화면에 머무는 동안 고정이다. 화면을 벗어났다 다시 들어오면 다시 섞인다.
순서를 저장하지 않는다.

## 작업

`src/pages/QuizPage.tsx` 하나만 고친다.

### 1) 섞기 함수를 주입 가능한 prop으로 받는다

`QuizPageProps`에 한 줄을 더한다. 기존 세 prop(`questions`·`topics`·`answer`)과 같은 방식이다.

```ts
shuffle?: (questions: Question[]) => Question[]
```

기본값은 **모듈 최상위**에 상수로 둔다.

```ts
const defaultShuffle = (items: Question[]) => shuffleQuestions(items, Math.random)
```

- **이 함수를 컴포넌트 안에서 만들지 마라.** 매 렌더 새 참조가 되어 아래 `useMemo`가 매번
  다시 돌고, 보기를 누르는 순간 자리가 바뀐다. ARCHITECTURE "문항과 보기의 순서"가
  못박아 둔 함정이다.
- `useCallback`으로 감싸 컴포넌트 안에 두는 것도 답이 아니다. 그냥 모듈 최상위에 둬라.
- `Math.random`을 넘기는 지점은 **여기 한 곳뿐이다.**

### 2) 주제 문항을 섞어서 쓴다

지금:

```ts
const topicQuestions = questions.filter((question) => question.topicId === topicId)
```

바꿔서: 같은 `filter` 결과를 `shuffle`에 통과시키고 **`useMemo`로 감싼다.**
`useMemo`의 의존성 배열은 `[questions, shuffle, topicId]`다 — 셋 다 넣어라.
`react-hooks/exhaustive-deps`가 경고를 내면 lint가 실패한다(`--max-warnings 0`).

- `useMemo`는 `react`에서 `useState`와 같은 줄로 가져온다.
- **위치는 지금 `topicQuestions`가 선언된 자리 그대로다.** `selections` state 초기화가
  이 값을 읽으므로 그 앞에 있어야 한다. 조기 반환(`if (!topicId || ...)`)보다 앞이다.
- 의존성 배열에 `topicQuestions.length` 같은 파생값을 넣지 마라.

**이것이 이 step의 소스 변경 전부다.** 렌더 부분·`selections`·`advance`·`selectChoice`·
클래스 문자열은 한 줄도 건드리지 마라.

### 핵심 규칙 — 벗어나지 마라

- **`useEffect`로 섞지 마라.** 첫 렌더가 섞이지 않은 순서를 한 번 보여주고 깜빡인다.
- **`useState`의 초기화 함수로 섞지 마라.** 주제가 바뀌어도 다시 섞이지 않는다.
- **순서를 `localStorage`에 저장하지 마라.** `Progress`에 필드를 더하지 마라.
  ADR-011과 ADR-003이 정한 것이다. `src/hooks/useProgress.ts`·`src/lib/progress.ts`·
  `src/types/progress.ts`를 건드리지 마라.
- **`isCorrect` 호출부를 고치지 마라.** 섞인 문항은 `answerIndex`가 이미 새 자리를
  가리키므로 지금 코드가 그대로 맞다. 고쳐야 할 것 같으면 step 0의 구현이 틀린 것이다.
- **`answer(question.id, correct)`를 그대로 둬라.** 기록은 questionId 기준이라 순서와 무관하다.
- 정답 보기가 특정 자리에 오지 않게 하는 보정(예: "정답이 1번이면 다시 섞기")을 넣지 마라.

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

### 기존 테스트 26개는 헬퍼 한 곳만 고쳐 전부 통과시킨다

`renderPage` 헬퍼에 `shuffle` 인자를 **마지막 자리**에 더하고, 기본값을 항등 함수로 준다.
그러면 기존 호출부는 인자 위치가 그대로라 **한 줄도 고칠 필요가 없다.**

```ts
const noShuffle = (items: Question[]) => items
```

- 기존 `it` 26개의 본문을 고치지 마라. 고쳐야 할 것 같으면 구현이나 헬퍼가 잘못된 것이다.
- `testQuestions`·`testTopics` 데이터를 고치지 마라.

### 추가할 테스트 셋

**1. 주입된 순서대로 문항을 낸다.**
문항 배열을 뒤집어 돌려주는 `shuffle`을 넘기고, 첫 화면의 문제문이 `두 번째 질문`인지 확인한다.

**2. 섞인 보기 위치로 채점한다.**
보기 순서를 바꾸고 `answerIndex`를 그 자리에 맞춘 문항을 돌려주는 `shuffle`을 넘긴다
(step 0의 `shuffleChoices`를 실제 난수 없이 흉내내는 것이다. 테스트 안에서 문항 객체를
직접 만들어라). **옮겨 간 자리의 정답 보기를 눌렀을 때** `answer`가 `(id, true)`로
불리는지 확인한다. 원래 자리의 보기를 눌렀을 때가 아니다.

**3. 렌더가 다시 일어나도 다시 섞지 않는다.**
`shuffle`을 `vi.fn()`으로 감싸 넘기고, 보기를 눌러 정답이 공개된 뒤에도
`toHaveBeenCalledTimes(1)`인지 확인한다. **이 테스트가 이 step의 회귀 테스트다** —
기본값을 컴포넌트 안에서 만드는 실수를 잡는 유일한 장치다.

### 하지 마라

- **테스트에서 `Math.random`을 가로채지 마라.** `shuffle` prop을 주입하면 된다.
- 실제 난수로 "순서가 달라진다"를 확인하려 하지 마라. 간헐적으로 실패한다.
  무작위성 자체는 step 0의 `shuffle.test.ts`가 이미 검증했다.
- `src/data/questions.json`의 실제 문항을 불러다 쓰지 마라.

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
grep -c 'shuffleQuestions' src/pages/QuizPage.tsx     # 2 (import 1 + defaultShuffle 1)
grep -c 'Math.random' src/pages/QuizPage.tsx          # 1
grep -c 'useMemo' src/pages/QuizPage.tsx              # 2 (import 1 + 호출 1)
grep -c 'min-h-\[44px\]' src/pages/QuizPage.tsx       # 4 (기존 그대로)
grep -c '<button' src/pages/QuizPage.tsx              # 2 (기존 그대로)
grep -c 'isCorrect' src/pages/QuizPage.tsx            # 4 (기존 그대로)
grep -nE 'useEffect|localStorage|\.sort\(' src/pages/QuizPage.tsx       # 결과 없음
grep -nE 'Math\.random' src/pages/QuizPage.test.tsx                     # 결과 없음
git diff --name-only                                   # 아래 세 개뿐
```

`git diff --name-only`에 나와야 하는 파일:

```
phases/15-shuffle/index.json
src/pages/QuizPage.test.tsx
src/pages/QuizPage.tsx
```

3. 체크리스트:
   - `git diff src/pages/QuizPage.tsx`를 읽어라. 바뀐 곳이 **props 타입 한 줄 + 모듈 상수
     하나 + import 두 줄 + `topicQuestions` 한 군데**인가? 그보다 많으면 되돌려라.
   - `defaultShuffle`(또는 그에 해당하는 기본값)이 **`export function QuizPage` 바깥**에
     선언돼 있는가? 안쪽에 있으면 틀린 것이다.
   - `git diff src/lib/ src/types/ src/hooks/ src/components/ src/data/ docs/`가
     **비어 있는가?** 비어 있지 않으면 되돌려라. step 0이 만든 `src/lib/shuffle.ts`를
     이 step에서 고치면 안 된다.
4. 결과에 따라 `phases/15-shuffle/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **step 0이 만든 것을 고치지 마라.** `src/lib/shuffle.ts`와 그 테스트는 그대로다.
- **`selections` 배열 구조를 바꾸지 마라.** `Record<questionId, ...>`로 바꾸지 마라 —
  ARCHITECTURE "확인 문제 안의 문항 이동"이 금지한 것이고, 섞인 배열도 배열이다.
- **이전 문항 화살표·`min-h-[44px]`·정답 보기 재탭 방식을 건드리지 마라.**
  phase 11에서 실측으로 정해진 것들이다.
- **레이아웃·문구·클래스를 "개선"하지 마라.** 요청받은 것은 순서 하나다.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- `src/pages/`의 다른 화면(`ConceptReadPage`·`ReviewPage`·`TopicListPage`)을 건드리지 마라.
  복습 화면은 개념 목록이지 문항 목록이 아니라 섞을 것이 없다.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
