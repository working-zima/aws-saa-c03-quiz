# Step 0: header-concept-link

## 배경 — 지금 헤더의 문제

`src/components/Layout.tsx`의 헤더는 지금 이렇게 생겼다.

```
[AWS SAA-C03]              [주제 목록] [복습]
     → /                       → /      → /review
```

**로고와 "주제 목록"이 같은 화면으로 간다.** 헤더의 세 자리 중 두 자리가 `/` 하나에 쓰인다.
로고 클릭이 홈이라는 것은 웹의 표준 관례이므로 "주제 목록" 링크는 자리를 낭비하는 것이다.

그 자리를 컨텍스트 링크로 돌린다. 확인 문제를 푸는 중에 개념이 기억나지 않을 때
채점을 기다리지 않고 근거 개념으로 건너뛸 수 있어야 한다. 지금은 정답을 고른 뒤
해설 아래에 나오는 "근거 개념으로 돌아가기"가 유일한 통로다.

## 결정된 동작

| 화면 | 경로 | 헤더 |
|---|---|---|
| 주제 목록 | `/` | `[AWS SAA-C03]` … `[복습]` |
| 개념 읽기 | `/topic/:topicId` | `[AWS SAA-C03]` … `[복습]` |
| 복습 | `/review` | `[AWS SAA-C03]` … `[복습]` |
| **확인 문제** | `/topic/:topicId/quiz` | `[AWS SAA-C03]` … `[근거 개념] [복습]` |

- "근거 개념"의 목적지는 **지금 푸는 문제가 속한 주제의 개념 읽기** — `/topic/{topicId}`다.
- **개념 읽기 화면에는 띄우지 않는다.** 그 화면이 곧 근거 개념이라 자기 자신을 가리키게 된다.
- 주제 목록·복습 화면에는 띄우지 않는다. 가리킬 주제가 없다.

`nav`가 셸 오른쪽 끝에 붙어 있어(`justify-between`) "근거 개념"은 "복습" 왼쪽으로 들어간다.
**"복습"의 위치와 헤더 높이 77px은 화면이 바뀌어도 그대로다.**

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/UI_GUIDE.md` — **"컴포넌트 > 상단 고정 헤더" 절, 특히 그 안의 "헤더 안의 링크"**에
  이 step의 규칙이 이미 반영돼 있다. 그대로 따르라. "AI 슬롭 안티패턴" 표와
  "터치 영역" 절도 읽어라.
- `/docs/ARCHITECTURE.md` — **"라우트 > 헤더의 컨텍스트 링크" 절**에 판별 방법과 그 근거가
  있다. "라우트" 표와 "화면 전환 시 스크롤" 절도 읽어라.
- `src/components/Layout.tsx` — 이 step에서 고치는 **유일한 컴포넌트**다.
- `src/components/Layout.test.tsx` — 기존 테스트가 있다. 여기에 덧붙이고 일부를 고친다.
- `src/App.tsx` — 라우트 정의. **수정하지 마라.** 경로 모양을 확인하는 용도다.
- `src/App.test.tsx` — 헤더 링크를 검사하는 테스트가 하나 있다. 고쳐야 한다.
- `src/pages/QuizPage.tsx` — 해설 아래 "근거 개념으로 돌아가기" 링크가 있다.
  **이 파일을 수정하지 마라.** 어떤 링크가 이미 있는지 확인하는 용도다.

## 작업

`src/components/Layout.tsx` 하나만 고친다. **새 파일을 만들지 마라.**

### 1. nav에서 "주제 목록" 링크를 제거한다

```
제거 전: <NavLink className={linkClassName} end to="/">주제 목록</NavLink>
```

로고(`to="/"`)는 그대로 둔다. 이 변경 뒤 `Layout.tsx` 안에서 `/`를 가리키는 링크는
로고 하나뿐이어야 한다.

### 2. 확인 문제 화면에서만 "근거 개념" 링크를 렌더한다

`react-router-dom`의 `useMatch`로 판별한다.

```ts
const quizMatch = useMatch('/topic/:topicId/quiz')
```

`quizMatch`가 있을 때만 `nav` 안에서 "복습" **앞에** 링크 하나를 렌더한다.

- 라벨: `근거 개념`
- 목적지: `/topic/{quizMatch.params.topicId}`
- 클래스: 기존 `linkClassName`을 그대로 쓴다. 새 클래스·새 색을 만들지 마라.

**`NavLink`를 쓴다.** 기존 두 링크와 같고, `linkClassName`이 `({ isActive }) => string`
시그니처라 `Link`의 `className`에는 타입이 맞지 않는다. 이 링크는 목적지가 현재 경로와
다르므로 활성 상태가 되지 않는다 — 그래도 무방하다.

### 핵심 규칙 — 벗어나지 마라

- **`useParams()`를 쓰지 마라.** `Layout`이 path 없는 레이아웃 라우트인데도 `useParams()`는
  자식 라우트의 `topicId`를 그대로 돌려준다. 실제로 확인한 동작이다. 하지만 그 값만으로는
  `/topic/vpc`와 `/topic/vpc/quiz`를 **구분할 수 없어** 개념 읽기 화면에도 링크가 뜬다.
  `useMatch` 하나가 판별과 `topicId` 획득을 동시에 해준다.
- **`useLocation().pathname`을 문자열로 쪼개지 마라.** `endsWith('/quiz')`·`split('/')`·
  정규식으로 경로를 해석하지 마라. 이유: 경로 모양이 바뀌면 조용히 어긋난다.
  라우트 패턴을 아는 것은 라우터다.
- **`useLocation`을 제거하지 마라.** 스크롤 리셋 `useEffect`가 `const { key } = useLocation()`을
  쓰고 있다. 그 effect 전체를 건드리지 마라 — phase 7에서 정해진 것이다.
- **`<header>`의 클래스를 건드리지 마라.** `sticky top-0 border-b border-border bg-page`는
  phase 8에서 정해진 것이고, `bg-page`가 빠지면 본문과 헤더 글자가 겹쳐 읽을 수 없게 된다.
- **헤더 안쪽 구조를 건드리지 마라.** `div.px-5 py-4 sm:px-8` → `div.mx-auto flex max-w-3xl
  items-center justify-between` → 로고·`nav`. 셸 정렬은 phase 6에서 정해진 것이다.
- `nav`의 `aria-label="주요 내비게이션"`과 `flex items-center gap-1`을 유지한다.
- 모든 헤더 링크는 `min-h-[44px]`를 유지한다. 터치 영역 최소치다.

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

기존 테스트 파일에 덧붙이고 고친다. **새 테스트 파일을 만들지 마라.**

### `src/components/Layout.test.tsx`

이 파일의 테스트들은 `MemoryRouter` + `Routes` + `Route element={<Layout />}` 조합으로
렌더한다. 같은 방식을 쓰되, 화면을 구분해야 하므로 `initialEntries`로 경로를 지정하고
자식 라우트를 `topic/:topicId/quiz`·`topic/:topicId`까지 정의해야 한다.

추가할 것:

1. **`/topic/vpc/quiz`에서** `근거 개념` 링크가 있고 `href`가 `/topic/vpc`다.
2. **`/topic/vpc`에서** `근거 개념` 링크가 **없다**. (`queryByRole` + `toBeNull`)
   이것이 핵심 경계다. `useParams`로 구현하면 이 테스트가 잡는다.
3. **`/`와 `/review`에서** `근거 개념` 링크가 **없다**.
4. `주제 목록` 링크가 어느 화면에도 **없다**.
5. `/topic/vpc/quiz`에서 `근거 개념` 링크가 `min-h-[44px]`를 가진다.

고칠 것:

- `'로고와 내비게이션 링크의 최소 터치 높이를 보장한다'` 테스트가
  `screen.getByRole('link', { name: '주제 목록' })`을 검사한다. 이 링크는 사라지므로
  해당 줄을 **제거**한다. 로고와 `복습` 검사는 남긴다.

건드리지 말 것:

- 스크롤 관련 테스트 세 개(`초기 렌더에서는…`, `링크로 다른 화면에…`, `뒤로 가기에서는…`)와
  `renderTestRoutes` 헬퍼. phase 7의 동작을 지키는 테스트다.
- 헤더 `sticky`/셸 정렬 테스트 두 개.

### `src/App.test.tsx`

`'/에서 주제 목록 화면과 내비게이션 링크를 렌더링한다'` 테스트에 이 줄이 있다.

```ts
expect(screen.getByRole('link', { name: '주제 목록' })).toHaveAttribute('href', '/')
```

이 링크는 사라지므로 **그 줄을 제거한다.** 같은 테스트의 `heading` 검사(`주제 목록`은
`TopicListPage`의 `h1`이라 그대로 남는다)와 `복습` 링크 검사는 건드리지 마라.
다른 테스트 두 개도 건드리지 마라.

### 하지 마라

- **렌더링 결과의 픽셀·색·위치를 검증하려 하지 마라.** jsdom은 레이아웃을 계산하지 않고
  Tailwind CSS도 로드되지 않는다. 클래스 존재와 링크 유무·`href`만 확인한다.
- `container.querySelector`로 요소를 잡지 마라. 역할·이름으로 잡는다.

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
grep -c 'useMatch' src/components/Layout.tsx                  # 2 (import + 호출)
grep -c 'useParams' src/components/Layout.tsx                 # 0
grep -c 'to="/"' src/components/Layout.tsx                    # 1 (로고 하나뿐)
grep -c '<NavLink' src/components/Layout.tsx                  # 3 (로고·근거 개념·복습)
grep -c 'min-h-\[44px\]' src/components/Layout.tsx            # 2 (로고 + linkClassName)
grep -c 'sticky top-0' src/components/Layout.tsx              # 1
grep -c 'bg-page' src/components/Layout.tsx                   # 2
grep -nE 'pathname|endsWith|split\(|z-[0-9]|fixed|backdrop|blur|bg-\[' src/components/Layout.tsx   # 결과 없음
grep -c 'useLocation' src/components/Layout.tsx               # 2 (import + 호출)
grep -c '/topic/' src/pages/QuizPage.tsx                      # 4 (기존 링크 전부 그대로)
git diff --name-only                                          # 아래 네 개뿐
```

`git diff --name-only`에 나와야 하는 파일:

```
phases/10-header-concept-link/index.json
src/App.test.tsx
src/components/Layout.test.tsx
src/components/Layout.tsx
```

3. 체크리스트:
   - `git diff src/components/Layout.tsx`를 직접 읽어라. `nav` 안쪽과 `useMatch` 한 줄 외에
     **바뀐 줄이 있는가?** 있으면 되돌려라.
   - phase 7의 스크롤 리셋 `useEffect`가 그대로 남아 있는가?
   - `<header>` 클래스 문자열이 그대로인가?
   - `git diff src/pages/`가 **비어 있는가?** 비어 있지 않으면 되돌려라.
4. 결과에 따라 `phases/10-header-concept-link/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`src/pages/` 아래 어떤 파일도 수정하지 마라.** 특히 `QuizPage.tsx`의 해설 아래
  "근거 개념으로 돌아가기" 링크와 퀴즈 완료 화면의 "개념으로 돌아가기" 링크를 지우지 마라.
  이유: 헤더 링크와 역할이 다르다. 헤더는 문제를 푸는 도중의 통로이고, 본문 링크는 해설을
  읽은 자리에서 바로 이어지는 링크다. **둘 다 남기기로 결정된 사항이다.**
- **주제 컨텍스트가 없는 화면에 "근거 개념"을 회색 비활성 상태로 두지 마라.** 이유:
  누를 수 없는 항목이 주제 목록·복습 화면에 상시로 떠 있게 된다. 렌더하지 않는 것이 답이다.
- **개념 읽기 화면(`/topic/:topicId`)에 "근거 개념"을 띄우지 마라.** 이유: 그 화면이 곧
  근거 개념이라 자기 자신을 가리키는 링크가 된다.
- **"주제 목록" 링크를 다른 자리로 옮기지 마라.** 로고가 그 역할을 한다. 이유: 헤더 두
  자리가 같은 목적지로 가는 것이 이 step이 없애려는 문제다.
- **헤더에 아이콘·배지·드롭다운·햄버거 메뉴를 만들지 마라.** 요청받지 않았다.
  이유: 항목이 셋뿐이라 320px에서도 한 줄에 들어간다.
- **애니메이션·트랜지션을 새로 넣지 마라.** 링크가 나타나고 사라지는 데 페이드를 붙이지 마라.
  이유: UI_GUIDE "애니메이션" 절이 페이지 전환 애니메이션을 금지한다.
  기존 `transition-colors`(hover 색 전환)는 그대로 둔다.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- `src/lib/`·`src/data/`·`src/types/`·`src/hooks/`를 건드리지 마라. 이 step은 순수 UI다.
- 기존 테스트를 깨뜨리지 마라. 위에서 "고칠 것"으로 지정한 두 줄 외에는 손대지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
