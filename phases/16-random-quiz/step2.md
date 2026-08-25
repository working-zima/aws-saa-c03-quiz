# Step 2: random-quiz-page

## 배경 — 주제 이름이라는 힌트를 떼고 푼다

주제별 확인 문제에는 "이 주제의 문제"라는 맥락이 항상 힌트로 붙는다. S3 주제를 푸는 동안에는
보기에 낯선 서비스가 있어도 답이 S3 계열이라는 것을 이미 안다.
**주제 이름 없이 마주해야 서비스를 실제로 구분하는지 드러난다.**

이 step에서 화면 두 개와 라우트 두 개를 만든다. 하나는 문항 수를 고르는 시작 화면이고,
하나는 뽑힌 세트를 푸는 화면이다. 문항을 푸는 부분은 step 1에서 만든 `QuizRunner`가 이미 한다.

**결정과 근거는 `docs/ADR.md`의 ADR-012에 이미 적혀 있다. 먼저 읽어라.**
제한시간·합격선·점수 이력은 **만들지 않는다.** PRD "MVP 제외 사항"이 금지한 선이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-012** — 무엇을 만들고 무엇을 만들지 않는지.
- `docs/ARCHITECTURE.md`의 **"전체 범위 랜덤 세트"**·**"확인 문제 화면의 공유 구조"** 절.
- `docs/UI_GUIDE.md`의 **"랜덤 문제 시작 화면"**·**"랜덤 문제 완료 화면"** 절 — 클래스와 배치.
- `src/lib/random-quiz.ts` — step 0에서 만든 상수와 파서.
- `src/components/QuizRunner.tsx` — step 1에서 만든 컴포넌트. props 넷을 확인해라.
- `src/pages/QuizPage.tsx` — 페이지가 세트와 완료 화면을 어떻게 주는지의 본보기.
- `src/pages/QuizPage.test.tsx` — 페이지 테스트 스타일.

## 만드는 것

- 새 파일 넷: `src/pages/RandomStartPage.tsx`, `src/pages/RandomStartPage.test.tsx`,
  `src/pages/RandomQuizPage.tsx`, `src/pages/RandomQuizPage.test.tsx`
- 고치는 파일 둘: `src/App.tsx`(라우트 2개 추가), `src/App.test.tsx`(라우트 테스트 추가)

`src/components/`·`src/lib/`·`src/data/`·`src/types/`·`src/pages/QuizPage.tsx`를 건드리지 마라.

### 라우트

`src/App.tsx`의 레이아웃 라우트 안에 **두 줄만** 추가한다. `review` 줄 아래가 자연스럽다.

```tsx
<Route path="random" element={<RandomStartPage />} />
<Route path="random/:count" element={<RandomQuizPage />} />
```

`*` → `/` 리다이렉트 줄은 **맨 마지막에 그대로 둔다.** 순서를 바꾸지 마라.

### `RandomStartPage` — 버튼 세 개짜리 화면

```ts
interface RandomStartPageProps {
  questions?: Question[]
}
```

- 제목은 `랜덤 문제`. 설명 한 줄에 전체 문항 수를 넣는다 —
  **숫자를 하드코딩하지 말고 `questions.length`에서 가져와라.**
- 버튼은 `RANDOM_QUIZ_COUNTS`를 `map`해서 그린다. **`[10, 20, 30]`을 이 파일에 적지 마라.**
  각 버튼은 `/random/{count}`로 가는 `Link`다.
- 셋을 **같은 클래스**로 그린다. 하나만 Primary로 만들지 마라. UI_GUIDE가 금지한다.
- 최상위는 `<section className="max-w-2xl space-y-8 break-keep break-anywhere">`.
  이 네 클래스는 이 앱의 모든 본문 화면이 공유한다.
- 예상 소요 시간·난이도·설명 카드를 만들지 마라. 없는 데이터다.

### `RandomQuizPage` — 세트를 뽑아 `QuizRunner`에 넘긴다

```ts
interface RandomQuizPageProps {
  questions?: Question[]
  answer?: (questionId: string, correct: boolean) => void
  shuffle?: (questions: Question[]) => Question[]
}
```

`QuizPage`와 같은 주입 방식이다. 기본값도 같은 모양으로 둔다 —
**`shuffle`의 기본값은 모듈 최상위 상수**여야 한다. 컴포넌트 안에서 만들면 참조가 매 렌더
달라져 `useMemo`가 무의미해지고 보기를 누르는 순간 순서가 바뀐다(ARCHITECTURE "문항과 보기의 순서").

```tsx
const defaultShuffle = (items: Question[]) => shuffleQuestions(items, Math.random)
```

동작 순서다.

1. `useParams()`로 `count` 세그먼트를 받아 `parseQuizCount`에 넘긴다.
   **직접 숫자로 바꾸지 마라.** `parseInt`·`Number`를 이 파일에 쓰지 마라.
2. 세트를 `useMemo`로 만든다 — `shuffle(questions).slice(0, count)`.
   **훅은 조건부 `return`보다 위에 있어야 한다.** `count`가 `null`이면 빈 배열을 내면 된다.
3. `count`가 `null`이면 `<Navigate replace to="/random" />`를 렌더한다.
   `replace`를 빼지 마라 — 잘못된 URL이 뒤로가기 이력에 남는다.
4. `QuizRunner`에 넘긴다. **`key={count}`를 반드시 붙여라.**
   이유: `/random/10`에서 `/random/20`으로 URL만 바뀌면 라우트 element가 같아
   리마운트되지 않는다. `key`가 없으면 문항 20개짜리 세트를 길이 10짜리 `selections`로
   풀게 되어 조용히 어긋난다.

`title`은 `랜덤 문제`다.

**빈 세트를 방어하지 마라.** `questions`는 246문항짜리 정적 JSON이고 `count`는 최소 10이다.
"문항이 없습니다" 화면을 만들지 마라 — `QuizPage`에 그 화면이 있는 것은 주제마다 문항 수가
다르기 때문이고, 전체 범위에는 해당하지 않는다.

### 완료 화면

`renderComplete(correctCount, total)`가 돌려주는 JSX다. UI_GUIDE "랜덤 문제 완료 화면"의
표를 그대로 따른다.

- 제목 `랜덤 문제 완료`, 그 아래 `맞힌 개수 {correctCount} / {total}`.
- 틀린 문항이 있으면 `틀린 개념 복습하기`(→ `/review`)가 Primary, 없으면 `다시 뽑기`가 Primary.
- `다시 뽑기`는 **`/random`으로 보낸다.** 방금 푼 `/random/{count}`가 아니다 —
  같은 경로 링크는 아무 일도 일으키지 않아 화면이 멈춘 것처럼 보인다.
- `주제 목록으로 돌아가기`(→ `/`)를 ghost로 둔다.
- **`다음 주제 이어가기`를 만들지 마라.** 이어갈 주제가 없다.
- 점수·정답률 퍼센트·등급·격려 문구를 만들지 마라. 맞힌 개수 한 줄이 전부다.

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.
`RandomQuizPage.test.tsx`는 `shuffle`에 항등 함수(`(items) => items`)를 주입해 결과를 고정해라.

### `RandomStartPage.test.tsx`

1. 허용 문항 수마다 링크가 하나씩 있고 각각 `/random/10`·`/random/20`·`/random/30`을 가리킨다.
2. 전체 문항 수가 주입한 `questions`의 길이에서 나온다 — 길이가 다른 배열 두 개로 확인해라.
   화면에 246이 하드코딩돼 있으면 이 테스트가 잡는다.

### `RandomQuizPage.test.tsx`

3. `/random/20`에서 주입한 문항 중 **앞의 20개만** 세트가 된다.
   문항을 25개쯤 만들어 진행 표시가 `1 / 20`인지 확인하는 것으로 충분하다.
4. `/random/10`에서 진행 표시가 `1 / 10`이다 — 세그먼트가 실제로 개수를 정하는지 본다.
5. 허용값 밖(`/random/15`)에서 `/random`으로 이동한다. `App.test.tsx`의 `CurrentPath` 방식처럼
   현재 경로를 읽어 단언해라.
6. 세트를 끝까지 풀면 `랜덤 문제 완료`와 `맞힌 개수 N / M`이 나온다.
7. 틀린 문항이 있으면 `틀린 개념 복습하기`가 `/review`를, `다시 뽑기`가 `/random`을 가리킨다.
8. `다음 주제 이어가기` 링크가 **없다**.
9. 해설의 근거 개념 링크가 그 문항의 주제를 가리킨다 — `topicId`가 서로 다른 문항을 넣어 확인해라.

### `App.test.tsx`

10. `/random`에서 시작 화면이, `/random/20`에서 랜덤 문제 화면이 렌더된다.
    **기존 `it`을 고치지 말고 새 `it`을 추가해라.**

## 하지 마라

- 제한시간·타이머·합격선·점수 저장을 만들지 마라. PRD가 금지한다.
- 오답·미풀이 가중치를 넣지 마라. 뽑기는 전체 균등이다(ADR-012).
- `Progress`·`src/types/progress.ts`·`src/lib/storage.ts`를 건드리지 마라.
  랜덤 세트도 `answers[questionId]`에 그대로 기록되고 그것으로 끝이다.
- `src/lib/`에 새 파일을 만들지 마라. 세트 구성은 `shuffleQuestions(...).slice(0, count)` 한 줄이다.
- 헤더(`src/components/Layout.tsx`)에 링크를 추가하지 마라. 진입점은 step 3이다.
- `src/data/*.json`을 건드리지 마라.

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
grep -c '<Route' src/App.tsx                                        # 9   (전: 7)
grep -c 'QuizRunner' src/pages/RandomQuizPage.tsx                    # 2 이상
grep -c 'key={count}' src/pages/RandomQuizPage.tsx                   # 1
grep -c 'parseQuizCount' src/pages/RandomQuizPage.tsx                # 2
grep -cE 'parseInt|Number\(' src/pages/RandomQuizPage.tsx            # 0
grep -c 'RANDOM_QUIZ_COUNTS' src/pages/RandomStartPage.tsx           # 2
grep -cE '\b(10|20|30)\b' src/pages/RandomStartPage.tsx              # 0
grep -c 'questions.length' src/pages/RandomStartPage.tsx             # 1
git diff --name-only                                                 # src/App.tsx, src/App.test.tsx 만
```

마지막 줄에 `src/pages/QuizPage.tsx`나 `src/components/`가 나오면 범위를 벗어난 것이다.

**검증 조건과 올바른 코드가 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**
조건을 통과시키려고 문자열을 쪼개거나 표현을 우회하지 마라.
