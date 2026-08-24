# Step 2: quiz-complete-exit

## 선행 조건

**step 0이 완료된 뒤에 실행한다.** `src/lib/navigation.ts`의 `adjacentTopics`를 쓴다.
없으면 멈추고 `"status": "blocked"`로 보고하라. **이 step에서 그 함수를 새로 만들지 마라.**

step 1과 겹치는 파일은 없다. step 1은 `ConceptReadPage.tsx`, 이 step은 `QuizPage.tsx`다.

## 배경

확인 문제를 끝까지 풀면 완료 화면이 나온다. 지금 그 화면의 출구는 두 개뿐이다.

| 상황 | 지금 있는 출구 |
|---|---|
| 틀린 문제가 있음 | `틀린 개념 복습하기`(Primary), `개념으로 돌아가기`(Ghost) |
| 전부 맞힘 | `개념으로 돌아가기`(Ghost) 하나 |

**다음 주제로 가려면 반드시 주제 목록을 거쳐야 한다.** 읽기 → 풀기 → 다음 주제라는
학습 흐름이 여기서 끊긴다. step 1이 개념 읽기 화면에 화살표를 붙이지만, 문제를 다 푼
직후는 개념 화면이 아니라 이 화면이다. 여기에도 출구가 필요하다.

전부 맞힌 경우에 Primary 버튼이 하나도 없다는 점도 같이 해결된다. 만점이면 다음으로
넘어가는 것이 주 동작이다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` — **"라우트 > 주제 간 이동" 절.** 표의 두 번째 행이 이 step이다.
- `/docs/UI_GUIDE.md` — "버튼" 절(Primary/Ghost 클래스), "하단 고정 액션 바" 절의
  마지막 항목(**짧은 화면에는 고정 바를 쓰지 않는다**), "AI 슬롭 안티패턴" 표
- `src/lib/navigation.ts` — step 0에서 만든 `adjacentTopics`. **수정하지 마라.**
- `src/pages/QuizPage.tsx` — 이 step에서 고치는 유일한 컴포넌트
- `src/pages/QuizPage.test.tsx` — 기존 테스트가 있다. 여기에 덧붙인다.
- `src/pages/ConceptReadPage.tsx` — props 기본값 패턴(`topics = defaultTopics`)을
  확인하는 용도다. **이 파일을 수정하지 마라.**

## 작업

`src/pages/QuizPage.tsx` 하나만 고친다. **새 파일을 만들지 마라.**

### 1. `topics`를 props로 받는다

`QuizPage`는 지금 `questions`만 받는다. `adjacentTopics`에 넘길 주제 배열이 필요하다.

```
topics?: Topic[]     <- 기본값은 '../data'의 topics
```

`ConceptReadPage`가 이미 같은 모양이다. 그 패턴을 그대로 따른다. **필수 prop으로 만들지
마라** — `App.tsx`가 `<QuizPage />`를 인자 없이 렌더한다.

### 2. 완료 화면에 `다음 주제 이어가기`를 넣는다

`complete` 분기의 `<nav aria-label="퀴즈 완료 후 이동">` 안이 유일한 수정 지점이다.

| 상황 | 버튼 (이 순서로) |
|---|---|
| 틀린 문제 있음 + 다음 주제 있음 | `틀린 개념 복습하기`(Primary) · `다음 주제 이어가기`(Ghost) · `개념으로 돌아가기`(Ghost) |
| 전부 맞힘 + 다음 주제 있음 | `다음 주제 이어가기`(**Primary**) · `개념으로 돌아가기`(Ghost) |
| 다음 주제 없음 (마지막 주제) | 지금과 동일. `다음 주제 이어가기`를 렌더하지 않는다. |

- 목적지는 `/topic/{next.id}` 다. **확인 문제(`/quiz`)로 바로 보내지 마라.** 다음 주제는
  아직 읽지 않았다.
- 문구는 `다음 주제 이어가기` 그대로 쓴다. 다음 주제의 제목을 버튼에 넣지 마라.
- Primary는 화면에 **최대 하나**다. 틀린 문제가 있으면 복습이 Primary고, 만점이면
  다음 주제가 Primary다. 둘 다 Primary로 만들지 마라.
- `개념으로 돌아가기`는 항상 마지막에 남긴다. 문구·클래스·`to`를 바꾸지 마라.

핵심 규칙 — 벗어나지 마라:

- **`complete` 분기 밖을 건드리지 마라.** 문항 화면(보기 버튼·해설·`advance()`)과
  "아직 확인 문제가 없습니다" 분기는 그대로다.
- **자동으로 넘어가게 만들지 마라.** `useEffect`로 `navigate`를 부르거나 타이머를 걸지 마라.
  사용자가 누를 때만 이동한다.
- **하단 고정 바(`sticky bottom-0`)를 이 화면에 만들지 마라.** 이유: 완료 화면은 스크롤이
  생기지 않는다. UI_GUIDE "하단 고정 액션 바" 절 마지막 항목이 금지한다.
- `nav`의 `aria-label`과 `flex flex-wrap gap-3` 클래스를 바꾸지 마라.
- 새 색·새 버튼 스타일을 만들지 마라. 파일 상단의 `primaryButtonClass`·`ghostLinkClass`를
  그대로 쓴다.
- 점수에 따라 문구를 바꾸지 마라(`훌륭합니다`·`아쉽네요` 같은 것). 이유: UI_GUIDE
  "디자인 원칙" 3번 — 도구지 마케팅 페이지가 아니다.

## 테스트

`src/pages/QuizPage.test.tsx`에 덧붙인다. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

완료 화면까지 가려면 문항을 끝까지 풀어야 한다. 기존 테스트에 이미 그 조작이 있다
(정답을 고르고 정답 보기를 한 번 더 눌러 넘어간다). **그 흐름을 그대로 재사용하라.**

`topics` prop에 넘길 가짜 주제 배열이 필요하다. 기존 `testQuestions`의 `topicId`
(`test-topic`)와 맞는 주제가 배열 안에 있어야 하고, 그 뒤에 주제가 하나 더 있어야
`다음 주제 이어가기`가 나온다. `concepts`는 빈 배열이어도 된다.

확인할 것:

1. 다음 주제가 있고 **한 문제라도 틀렸을 때**: `다음 주제 이어가기` 링크가 있고
   `href`가 다음 주제의 `/topic/{id}`다. `틀린 개념 복습하기`도 그대로 있다.
2. 다음 주제가 있고 **전부 맞혔을 때**: `다음 주제 이어가기`가 있고,
   `틀린 개념 복습하기`는 없다.
3. **마지막 주제일 때**(가짜 배열에서 `test-topic`이 마지막): `다음 주제 이어가기`가 없다.
   `개념으로 돌아가기`는 있다.
4. 세 경우 모두 `개념으로 돌아가기`의 `href`가 `/topic/test-topic`이다.

링크는 `screen.getByRole('link', { name: '다음 주제 이어가기' })`로 잡는다.
Primary/Ghost 클래스 문자열을 테스트로 검사하지 마라 — 스타일은 실측·리뷰의 몫이다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래 grep을 그대로 실행해 결과를 확인한다.

```bash
grep -c 'adjacentTopics' src/pages/QuizPage.tsx              # 2 (import + 호출)
grep -c 'findIndex' src/pages/QuizPage.tsx                   # 0
grep -c 'sticky' src/pages/QuizPage.tsx                      # 0
grep -nE 'useEffect|setTimeout|setInterval|useNavigate' src/pages/QuizPage.tsx   # 결과 없음
grep -c 'primaryButtonClass' src/pages/QuizPage.tsx          # 5 이상 (정의 1 + 사용처)
grep -c 'aria-label="퀴즈 완료 후 이동"' src/pages/QuizPage.tsx   # 1
grep -c 'topics' src/pages/QuizPage.tsx                      # 4 이상 (import·props·기본값·호출)
git diff --name-only    # QuizPage.tsx, QuizPage.test.tsx, index.json 뿐
```

3. 체크리스트:
   - `git diff src/pages/QuizPage.tsx`를 **끝까지 직접 읽어라.** `complete` 분기와
     props 선언 밖에 바뀐 줄이 있는가? 있으면 되돌려라.
   - 문항 화면의 `advance()`·`selectChoice()`·보기 버튼이 그대로인가?
   - 만점일 때 Primary가 `다음 주제 이어가기` 하나인가? 틀렸을 때 Primary가
     `틀린 개념 복습하기` 하나인가? **Primary가 두 개인 상태가 없는가?**
   - 마지막 주제에서 `다음 주제 이어가기`가 렌더되지 않는가?
   - `App.tsx`를 고치지 않고도 `npm run build`가 통과하는가? (props에 기본값이 있어야 한다.)
4. 결과에 따라 `phases/9-topic-navigation/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`이전 주제` 링크를 이 화면에 넣지 마라.** 요청 범위가 아니다. 문제를 다 푼 뒤에
  뒤로 가는 동선은 `개념으로 돌아가기`로 충분하다.
- **완료 화면에 진행률 막대·점수 그래프·축하 문구를 추가하지 마라.** 요청받지 않았다.
- **점수에 따라 자동으로 복습이나 다음 주제로 보내지 마라.**
- **`useNavigate`를 도입하지 마라.** 이 화면의 이동은 전부 `Link`다.
- `src/lib/navigation.ts`를 수정하지 마라. 시그니처가 안 맞으면 고치지 말고
  `"status": "blocked"`로 멈춰라.
- `src/pages/ConceptReadPage.tsx`·`src/components/Layout.tsx`를 건드리지 마라.
- `src/data/questions.json`·`topics.json`을 수정하지 마라.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- 기존 테스트를 깨뜨리지 마라. 기존 `testQuestions` 배열을 수정하지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
