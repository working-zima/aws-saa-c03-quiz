# Step 1: quiz-runner

## 배경 — 두 화면이 문항 푸는 부분을 공유해야 한다

step 2에서 **주제와 무관하게 전체 문항에서 뽑아 푸는 화면**을 만든다. 그 화면은
문항을 푸는 부분이 지금의 확인 문제와 **완전히 같다** — 진행 표시, 보기 4개, 정오 표시,
해설, 이전 문항 이동, 정답 재탭으로 넘어가기까지. 다른 것은 둘뿐이다.
**세트를 어떻게 고르는가**, 그리고 **다 푼 뒤 어디로 보내는가**.

이 step은 **기능을 추가하지 않는다.** 지금 `QuizPage`에 있는 문항 진행 부분을
`QuizRunner` 컴포넌트로 옮기고, `QuizPage`가 그것을 쓰게 만드는 것이 전부다.
**화면에 보이는 것과 동작은 한 톨도 달라지면 안 된다.**

**근거는 `docs/ARCHITECTURE.md`의 "확인 문제 화면의 공유 구조" 절이다. 먼저 읽어라.**

## 읽어야 할 파일

- `docs/ARCHITECTURE.md`의 **"확인 문제 화면의 공유 구조"** — 무엇을 누가 맡는지.
- `docs/ARCHITECTURE.md`의 **"확인 문제 안의 문항 이동"** — `selections` 배열 규칙.
  이 규칙은 옮긴 뒤에도 그대로 유효하다.
- `src/pages/QuizPage.tsx` — 옮길 원본.
- `src/pages/QuizPage.test.tsx` — **이 step의 안전망이다.** 전부 그대로 통과해야 한다.
- `src/components/Layout.tsx` — 이 디렉토리의 코드 스타일.

## 만드는 것

- 새 파일: `src/components/QuizRunner.tsx`, `src/components/QuizRunner.test.tsx`
- 고치는 파일: `src/pages/QuizPage.tsx` **하나뿐**

### 절대 금지 — 테스트를 고치지 마라

**`src/pages/QuizPage.test.tsx`를 한 글자도 고치지 마라.** 지우지도, 옮기지도,
`it`을 `it.skip`으로 바꾸지도 마라. 이 파일이 통과하는 것이 "동작이 안 바뀌었다"의 정의다.
이 파일을 고쳐야만 통과한다면 리팩터가 틀린 것이다 — 코드를 고쳐라.
그래도 막히면 `blocked`로 멈추고 어느 테스트가 왜 깨지는지 적어라.

### `QuizRunner`의 props — 정확히 이 넷

```ts
interface QuizRunnerProps {
  title: string
  questions: Question[]
  answer: (questionId: string, correct: boolean) => void
  renderComplete: (correctCount: number, total: number) => ReactNode
}
```

- `title`은 `<h1>`에 들어간다. `QuizPage`는 `'확인 문제'`를 넘긴다.
- `questions`는 **이미 섞여서 잘린 세트**다. 비어 있지 않다고 가정해라.
  `QuizRunner` 안에서 섞지도, 자르지도, 필터하지도 마라. **`Math.random`을 부르지 마라.**
- `renderComplete`는 마지막 문항까지 끝났을 때 그 반환값을 그대로 렌더한다.
  `<section>` 껍데기를 포함한 완료 화면 전체를 페이지가 준다.
- **`mode`·`isRandom`·`topicId` 같은 prop을 추가하지 마라.** 다섯 번째 prop이 필요하다고
  느끼면 그건 페이지가 해야 할 일을 `QuizRunner`에 넣고 있다는 신호다.
- props에 기본값을 두지 마라. 넷 다 필수다.

### `QuizRunner`로 옮기는 것

`QuizPage`의 아래 것들을 그대로 옮긴다. **로직을 다시 쓰지 말고 옮겨라.**

- 상태 셋: `questionIndex`, `selections`, `complete`. `useState` 초기화 방식도 그대로다.
- `correctCount` 계산 (`selections`에서 유도한다. 카운터를 만들지 마라).
- `selectChoice`·`advance` 함수.
- 문항 화면 JSX 전체 — `<header>`의 제목 줄과 `min-h-[44px]`, 이전 문제 버튼과 그 SVG,
  `N / M` 표시, 보기 버튼 4개, 해설 블록, 안내 문구와 `aria-describedby`.
- 보기 버튼용 클래스 상수 세 개(`choiceBaseClass`·`choiceCorrectClass`·`choiceIncorrectClass`)와
  이전 문제 버튼이 쓰는 ghost 클래스.

### 딱 하나 바뀌는 것 — 근거 개념 링크

해설 안의 `근거 개념으로 돌아가기` 링크가 지금은 라우트의 `topicId`를 쓴다.
**`QuizRunner`에서는 그 문항의 `question.topicId`를 쓴다.**

```
to={`/topic/${question.topicId}`}
```

이유: 랜덤 세트에서는 문항마다 주제가 다르다. 주제별 확인 문제에서는 라우트의 `topicId`와
문항의 `topicId`가 같은 값이라 이 규칙 하나로 양쪽이 맞는다.
`QuizRunner`는 `useParams()`를 쓰지 마라 — 라우트를 모르는 컴포넌트여야 한다.

### `QuizPage`에 남는 것

- `useParams()`로 받은 `topicId`, `useProgress()`, props 인터페이스(`questions`·`topics`·
  `answer`·`shuffle`)와 기본값. **props 인터페이스를 바꾸지 마라.** 테스트가 주입한다.
- `topicQuestions` 계산 — `useMemo` + `filter` + `shuffle`. 지금 그대로다.
- 문항이 없을 때의 "아직 확인 문제가 없습니다" 화면. 지금 그대로다.
- `adjacentTopics`와 완료 화면 JSX. 완료 화면은 `renderComplete`에 넘긴다.
  `topicQuestions.length` 자리에 `total` 인자를, `correctCount` 자리에 `correctCount` 인자를 쓴다.
- Primary·ghost 클래스 상수 중 이 파일이 실제로 쓰는 것.

**클래스 상수를 공유 모듈로 뽑지 마라.** 각 파일이 자기가 쓰는 것만 위에 선언한다.
이 프로젝트의 기존 방식이고, ghost 클래스 한 줄이 두 파일에 있는 것은 문제가 아니다.

## 테스트

`src/components/QuizRunner.test.tsx`를 새로 만든다. `QuizPage.test.tsx`가 이미
문항 진행 동작 전체를 덮고 있으므로 **그것을 베껴 오지 마라.** 이 파일에는
`QuizPage`를 거쳐서는 확인할 수 없는 것만 담는다.

### 반드시 들어가야 하는 검증

1. **문항마다 근거 개념 링크가 그 문항의 주제를 가리킨다.** `topicId`가 서로 다른 문항
   두 개를 넣고, 첫 문항에서 답을 고른 뒤 링크가 첫 문항의 주제를 가리키는지,
   다음 문항으로 넘어간 뒤에는 두 번째 문항의 주제를 가리키는지 확인한다.
   **이것이 이 파일의 존재 이유다.** `QuizPage.test.tsx`는 두 값이 같아서 구분하지 못한다.
2. `title` prop이 `<h1>`에 그대로 나온다.
3. 마지막 문항까지 풀면 `renderComplete`가 **맞힌 개수와 총 개수**를 인자로 받는다.
   문항 두 개 중 하나만 맞혀 `(1, 2)`가 오는지 확인해라.

`MemoryRouter`로 감싸야 `Link`가 렌더된다. `QuizPage.test.tsx`의 렌더 헬퍼 스타일을 따라라.

## 하지 마라

- **`QuizPage.test.tsx`를 고치지 마라.** 위에 적은 그대로다.
- 하는 김에 주변 코드를 정리하지 마라. 클래스 문자열·주석·포매팅을 "개선"하지 마라.
- `useReducer`나 커스텀 훅으로 상태 관리 방식을 바꾸지 마라. 옮기기만 한다.
- `React.memo`·`useCallback`을 새로 붙이지 마라. 지금 없다.
- `src/App.tsx`·`src/lib/`·`src/data/`·`src/types/`를 건드리지 마라. 이 step의 범위가 아니다.
- 랜덤 관련 파일을 미리 만들지 마라. step 2·3이다.

## 검증 절차

아래를 전부 실행해 통과를 확인한 뒤 끝내라.

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

구조 확인 — 기대값이 옆에 적혀 있다. 괄호 안은 리팩터 전 값이다.

```bash
git diff --name-only                                              # QuizPage.tsx 만 (테스트 파일이 나오면 위반)
git status --porcelain src/pages/QuizPage.test.tsx                 # 결과 없음
grep -c 'useState' src/pages/QuizPage.tsx                          # 0   (전: 4)
grep -c '<button' src/pages/QuizPage.tsx                           # 0   (전: 2)
grep -cE 'setSelections|advance\(|selectChoice' src/pages/QuizPage.tsx   # 0   (전: 5)
grep -c 'useMemo' src/pages/QuizPage.tsx                           # 2   (그대로)
grep -c 'adjacentTopics' src/pages/QuizPage.tsx                    # 2   (그대로)
grep -c '<button' src/components/QuizRunner.tsx                    # 2
grep -c 'question\.topicId' src/components/QuizRunner.tsx           # 1 이상
grep -cE 'useParams|Math\.random' src/components/QuizRunner.tsx     # 0
```

**검증 조건과 올바른 코드가 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**
조건을 통과시키려고 문자열을 쪼개거나 표현을 우회하지 마라.
