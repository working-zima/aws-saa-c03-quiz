# Step 0: previous-question

## 배경 — 지금 확인 문제는 단방향이다

`src/pages/QuizPage.tsx`는 문항을 앞으로만 넘긴다.

```
[문항 1] --정답 재탭--> [문항 2] --정답 재탭--> [문항 3] --> ... --> [완료 화면]
   ↑                       ↑
   └── 돌아갈 방법이 없다 ──┘
```

문항 3을 읽다 "아, 문항 2 해설에 뭐라고 돼 있었지" 싶으면 지금은 방법이 없다.
헤더의 `근거 개념`으로 나갔다 돌아오면 `useState`가 전부 초기화돼 문항 1부터 다시 푼다.

**푼 문항으로 되돌아가 문제와 해설을 다시 읽을 수 있게 한다.**

## 결정된 동작

```
확인 문제                                    [←]  2 / 7
```

| 상황 | 이전 화살표 |
|---|---|
| 문항 1 (첫 문항) | **렌더하지 않는다** |
| 문항 2 이상 | 진행 카운터 왼쪽에 렌더한다 |
| 완료 화면 | **렌더하지 않는다** |
| 문항이 없는 주제 | **렌더하지 않는다** |

- **되돌아간 문항은 읽기 전용이다.** 고른 보기와 정답이 색으로 남고, 해설이 펼쳐진 채
  보이며, 보기를 다시 고를 수 없다. 채점은 처음 골랐을 때 이미 끝났다.
- **앞으로 가는 조작은 지금 그대로 정답 보기 재탭 하나뿐이다.** 되돌아간 문항에서
  정답 보기를 누르면 다음 문항으로 간다 — 처음 풀 때와 같다.
- **`→` 다음 화살표를 만들지 마라.** 아래 "금지사항"을 봐라.
- 진행 카운터 숫자는 지금 보고 있는 문항 번호를 따라간다. 되돌아가면 숫자도 내려간다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/UI_GUIDE.md` — **"컴포넌트 > 보기 버튼 (확인 문제)" 절과 그 안의 "문항 사이 이동"**에
  이 step의 규칙이 이미 반영돼 있다. 그대로 따르라. "아이콘"·"터치 영역"·"애니메이션"·
  "AI 슬롭 안티패턴" 절도 읽어라.
- `/docs/ARCHITECTURE.md` — **"라우트 > 확인 문제 안의 문항 이동" 절**에 상태 구조와
  그 근거가 있다. "상태 관리" 절도 읽어라.
- `src/pages/QuizPage.tsx` — 이 step에서 고치는 **유일한 컴포넌트**다.
- `src/pages/QuizPage.test.tsx` — 기존 테스트가 17개 있다. 여기에 덧붙인다.
- `src/pages/ConceptReadPage.tsx` — 하단 바의 화살표 SVG와 `aria-label` 방식이 있다.
  **이 파일을 수정하지 마라.** 같은 SVG를 쓰기 위해 읽는 것이다.
- `src/types/progress.ts` — `Progress`가 무엇을 저장하는지 확인용. **수정하지 마라.**

## 작업

`src/pages/QuizPage.tsx` 하나만 고친다. **새 파일을 만들지 마라.**

### 1. 문항별 선택을 배열 하나로 바꾼다

지금은 현재 문항의 선택 하나만 들고 있어서 되돌아가면 복원할 값이 없다.

```
지금:  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
바꿔:  const [selections, setSelections] = useState<(number | null)[]>(...)
```

- 길이는 그 주제의 문항 수(`topicQuestions.length`)이고, 초기값은 전부 `null`이다.
- 아직 풀지 않은 문항이 `null`이다.
- **정답 공개 여부는 `selections[questionIndex] !== null`로 판별한다.**
  `revealed` 지역 변수는 이렇게 유도한다. 별도의 boolean state를 만들지 마라 —
  되돌아가는 순간 둘이 어긋난다.
- 보기를 고를 때는 해당 인덱스 자리만 갱신한다. **배열을 제자리에서 수정하지 마라**
  (`selections[i] = x` 금지). 새 배열을 만들어 `setSelections`에 넘긴다.
- `advance()`에 있던 `setSelectedIndex(null)` 호출은 **제거한다.** 배열이 문항별로
  값을 들고 있으므로 초기화할 대상이 없다.

### 2. 맞힌 개수를 state가 아니라 파생값으로 바꾼다

```
지금:  const [correctCount, setCorrectCount] = useState(0)  +  setCorrectCount((c) => c + 1)
바꿔:  selections를 훑어 계산한 지역 변수
```

각 자리의 값이 `null`이 아니고 그 문항의 정답이면 센다. 정답 판정은 **반드시 기존
`isCorrect(question, choiceIndex)`를 쓴다.** `question.answerIndex`와 직접 비교하지 마라 —
채점 로직은 `src/lib/grading.ts` 한 곳에 있다.

이유: 증감 카운터를 들고 있으면 같은 문항을 다시 지나는 경로가 생기는 순간 이중 계산의
위험이 생긴다. 값을 유도하면 그 경로가 몇 개든 결과가 같다.

이 변경 뒤 `QuizPage` 안의 `useState` 호출은 **정확히 셋**이다 —
`questionIndex`, `selections`, `complete`.

### 3. 이전 문항 버튼을 헤더 줄에 넣는다

지금 헤더 줄은 이렇다.

```
<div className="flex items-center justify-between gap-3">
  <h1>확인 문제</h1>
  <span className="text-xs text-neutral-500">{questionIndex + 1} / {topicQuestions.length}</span>
</div>
```

카운터 `span`과 이전 버튼을 **오른쪽 그룹으로 묶고**, 버튼을 카운터 **왼쪽**에 둔다.
`justify-between`은 유지한다 — 그래야 버튼이 없는 첫 문항에서도 카운터가 오른쪽 끝에
그대로 있다.

버튼 사양:

- `<button type="button">`이다. `Link`가 아니다 — 라우트가 바뀌지 않는다.
- `aria-label="이전 문제"`. **눈에 보이는 텍스트 라벨을 붙이지 마라.**
- 안에 **개념 읽기 하단 바와 같은 SVG**를 인라인으로 넣는다:
  `fill="none" height="20" width="20" stroke="currentColor" strokeWidth="1.5"
  viewBox="0 0 24 24"`, `path`는 `M15 19l-7-7 7-7`, `aria-hidden="true"`.
- 클래스는 파일 상단의 기존 `ghostLinkClass`를 그대로 쓴다. `min-h-[44px]`가 거기 있다.
  **새 클래스 상수를 만들지 마라.**
- `questionIndex > 0`일 때만 렌더한다.
- `onClick`은 `questionIndex`를 1 줄이는 것 **하나만** 한다. 다른 state를 건드리지 마라.

**아이콘 컴포넌트를 새로 추출하지 마라.** `ConceptReadPage`와 SVG가 겹치지만, 공용
아이콘 파일을 만드는 것은 이 step의 범위가 아니다. 인라인으로 둔다.

### 핵심 규칙 — 벗어나지 마라

- **되돌아간 문항에서 답을 다시 고를 수 없어야 한다.** 기존 `selectChoice`의
  `if (revealed) return` 가드와 오답 보기 `disabled` 처리가 이 역할을 한다.
  **둘 다 그대로 둬라.** `answer()`가 한 문항에 두 번 불리면 안 된다.
- **아직 풀지 않은 문항으로 건너뛰게 하지 마라.** `questionIndex`를 2 이상 줄이거나,
  문항 번호 목록을 만들거나, 앞으로 점프시키는 코드를 넣지 마라.
- **`localStorage`에 아무것도 더 쓰지 마라.** `useProgress`와 `answer()` 호출은
  지금 형태 그대로다. 어느 보기를 골랐는지는 저장하지 않는다 — ARCHITECTURE
  "확인 문제 안의 문항 이동" 절에 이유가 있다.
- **하단 고정 바를 만들지 마라.** 확인 문제 화면에는 `sticky`가 없다. 기존 테스트 두 개가
  `container.querySelector('.sticky')`가 `null`임을 검사한다.
- **최상위 `section`의 `break-keep break-anywhere`를 건드리지 마라.**
- **해설 영역의 `animate-[fade-in_0.2s_ease-out]` 외에 애니메이션을 넣지 마라.**
  문항이 바뀔 때 슬라이드·페이드를 붙이지 마라. UI_GUIDE "애니메이션" 절이 금지한다.
- 헤더의 `근거 개념` 링크(`src/components/Layout.tsx`)와 해설 아래
  `근거 개념으로 돌아가기` 링크는 phase 10에서 정해진 것이다. **건드리지 마라.**

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

`src/pages/QuizPage.test.tsx`에 덧붙인다. **새 테스트 파일을 만들지 마라.**
기존 `testQuestions`(2문항)와 `renderPage` 헬퍼를 그대로 쓴다.

### 추가할 테스트

1. **첫 문항에서는 이전 버튼이 없다.**
   `queryByRole('button', { name: '이전 문제' })`가 `null`.
2. **두 번째 문항에서는 이전 버튼이 있고 `min-h-[44px]`를 가진다.**
   (정답 보기 → 정답 재탭으로 2번 문항까지 간 뒤 확인)
3. **이전 버튼을 누르면 첫 문항으로 돌아간다.**
   카운터가 `1 / 2`이고, `첫 번째 질문` heading이 다시 보인다.
4. **되돌아간 문항은 채점 결과가 남아 있다.**
   1번에서 오답을 고르고 넘어갔다가 돌아왔을 때 —
   고른 오답 보기에 `border-red-500/60`, 정답 보기에 `border-green-500/60`,
   `첫 번째 해설` 텍스트가 보인다.
5. **되돌아간 문항에서 답을 다시 고를 수 없다.**
   4번 상태에서 다른 오답 보기를 클릭해도 `answer`가 여전히 1번만 호출됐다.
   (`toHaveBeenCalledTimes(1)`)
6. **되돌아간 뒤 정답 보기를 누르면 다시 앞으로 간다.**
   카운터가 `2 / 2`로 돌아온다.
7. **되돌아갔다 와서 끝까지 풀어도 맞힌 개수가 부풀지 않는다.**
   1번 정답 → 재탭 → 이전 → 재탭 → 2번 정답 → 재탭 → 완료 화면에서
   `맞힌 개수 2 / 2`. **이 테스트가 이 step의 핵심 회귀 방어선이다.**
8. **완료 화면에는 이전 버튼이 없다.**
9. **문항이 없는 주제 화면에는 이전 버튼이 없다.**

### 기존 테스트

**기존 테스트 17개는 하나도 고칠 필요가 없다. 전부 그대로 통과해야 한다.**
고쳐야 할 것 같으면 구현이 잘못된 것이다. 특히 아래 셋을 확인하라 —
이 step이 깨뜨리기 쉬운 것들이다.

- `'첫 문제와 보기 4개를 렌더한다'` — `getAllByRole('button')`이 **4개**다.
  첫 문항에는 이전 버튼이 없어야 하므로 그대로 통과한다. 5개가 되면 조건이 틀린 것이다.
- `'정답을 맞힌 뒤 정답 보기를 한 번 더 눌러도 진행 상태를 한 번만 기록한다'`
- `'오답 뒤 정답 보기 재탭으로 끝까지 진행해도 맞힌 개수가 늘어나지 않는다'` —
  파생 계산이 맞는지 여기서 드러난다.

**기존 테스트를 지우거나 약화시키지 마라.** `toHaveLength(4)`를 `toBeGreaterThan`으로
바꾸는 식의 완화는 실패로 간주한다.

### 하지 마라

- **렌더링 결과의 픽셀·색·위치를 검증하려 하지 마라.** jsdom은 레이아웃을 계산하지 않고
  Tailwind CSS도 로드되지 않는다. 클래스 존재와 요소 유무·텍스트만 확인한다.
- 새 테스트에서 `container.querySelector`로 버튼을 잡지 마라. 역할·이름으로 잡는다.
  (기존 `.sticky` 검사 두 개는 그대로 둔다.)
- 타이머·`waitFor`·`act`를 새로 쓰지 마라. `userEvent.click`으로 충분하다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래를 그대로 실행해 결과를 확인한다.

```bash
grep -c 'useState' src/pages/QuizPage.tsx                     # 4 (import 1 + 호출 3)
grep -c 'selectedIndex' src/pages/QuizPage.tsx                # 0
grep -c 'setCorrectCount' src/pages/QuizPage.tsx              # 0
grep -c 'selections' src/pages/QuizPage.tsx                   # 1 이상
grep -c 'isCorrect' src/pages/QuizPage.tsx                    # 4 이상 (import + 채점 + 렌더 + 집계)
grep -c 'answerIndex' src/pages/QuizPage.tsx                  # 0
grep -c 'aria-label="이전 문제"' src/pages/QuizPage.tsx        # 1
grep -c 'M15 19l-7-7 7-7' src/pages/QuizPage.tsx              # 1
grep -c 'M9 5l7 7-7 7' src/pages/QuizPage.tsx                 # 0 (다음 화살표 없음)
grep -c '<button' src/pages/QuizPage.tsx                       # 2 (보기 + 이전)
grep -c 'ghostLinkClass' src/pages/QuizPage.tsx               # 4 (정의 1 + 사용 3)
grep -c 'justify-between' src/pages/QuizPage.tsx              # 1
grep -c 'break-keep' src/pages/QuizPage.tsx                    # 3
grep -c 'animate-' src/pages/QuizPage.tsx                     # 1 (해설 fade-in 하나뿐)
grep -c 'transition' src/pages/QuizPage.tsx                    # 3
grep -nE 'sticky|fixed|localStorage|useEffect|backdrop|blur' src/pages/QuizPage.tsx   # 결과 없음
git diff --name-only                                           # 아래 세 개뿐
```

`git diff --name-only`에 나와야 하는 파일:

```
phases/11-previous-question/index.json
src/pages/QuizPage.test.tsx
src/pages/QuizPage.tsx
```

3. 체크리스트:
   - `git diff src/pages/QuizPage.tsx`를 **처음부터 끝까지 직접 읽어라.**
     헤더 줄·상태 선언·`selectChoice`·`advance` 외에 바뀐 줄이 있는가? 있으면 되돌려라.
   - 보기 버튼의 `disabled={revealed && !correctChoice}` 조건이 그대로인가?
   - `answer(question.id, correct)` 호출이 여전히 `selectChoice` 안에 **한 곳뿐**인가?
   - `git diff src/lib/ src/types/ src/hooks/ src/components/ src/data/`가 **비어 있는가?**
     비어 있지 않으면 되돌려라.
   - 완료 화면(`complete` 분기)의 링크 세 개가 그대로인가?
4. 결과에 따라 `phases/11-previous-question/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`→` 다음 문항 화살표를 만들지 마라.** 대칭이 안 맞아 보여도 만들지 마라. 이유:
  다음으로 가는 조작은 정답 보기 재탭 하나로 이미 정해져 있다(UI_GUIDE "보기 버튼" 절).
  화살표를 더하면 같은 이동에 조작이 둘이 되고, 둘 중 어느 쪽이 채점에 영향을 주는지
  헷갈리게 된다.
- **문항 번호 목록·점 표시(dot indicator)·진행 막대를 만들지 마라.** 요청받지 않았다.
  헤더의 `N / M` 카운터가 그 역할을 한다.
- **첫 문항에서 이전 버튼을 회색 비활성으로 두지 마라.** 렌더하지 않는 것이 답이다.
  이유: `justify-between`이라 버튼이 빠져도 카운터는 오른쪽 끝에 그대로 있다.
  개념 읽기 하단 바가 비활성 화살표를 두는 것은 가운데 버튼이 밀리기 때문이고,
  여기엔 그 이유가 없다.
- **완료 화면에 "문항 다시 보기"·"틀린 문제 목록" 같은 것을 만들지 마라.**
  요청받지 않았다. 완료 화면은 지금 그대로다.
- **`Progress` 타입이나 `src/types/`를 건드리지 마라.** 어느 보기를 골랐는지를
  localStorage에 저장하는 코드를 넣지 마라. 저장 스키마는 이 step에서 바뀌지 않는다.
- **`src/lib/`·`src/data/`·`src/hooks/`·`src/components/`를 건드리지 마라.**
  이 step은 `QuizPage` 한 화면의 내부 상태 문제다.
- **키보드 단축키(←/→ 키 핸들러)를 만들지 마라.** 요청받지 않았고 `useEffect`가 필요해진다.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- 되돌아갈 때 스크롤 위치를 조작하지 마라. 지금 다음 문항으로 넘어갈 때도 하지 않는다.
  phase 7의 스크롤 리셋은 라우트가 바뀔 때만 도는 것이고 여기는 라우트가 바뀌지 않는다.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
