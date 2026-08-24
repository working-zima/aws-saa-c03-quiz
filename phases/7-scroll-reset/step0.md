# Step 0: scroll-reset-on-push

## 배경

**라우트를 옮겨도 스크롤 위치가 그대로 남는다.** 앱 전체에 스크롤을 되돌리는 코드가 없다
(`grep -rni scroll src/` 결과가 비어 있다). 브라우저는 `pushState` 이동에서 스크롤을
유지하므로, 목록에서 내린 만큼 그대로 다음 화면에 착지한다.

390×844 Chrome에서 클릭 전후 `window.scrollY`를 실측한 값이다.

| 이동 | 클릭 전 scrollY | 이동 후 scrollY | 목적지 최대 scrollY |
|---|---|---|---|
| 목록 → 마지막 카드(절약 플랜) | 1533 | **1533** | 1570 |
| 목록 → 중간 카드(서버리스) | 405 | **405** | 2494 |
| 복습(오답 246개) → 개념 | 18568 | **1570** | 1570 |
| 목록 → 확인 문제 | 1533 | 0 | 0 |

특정 주제만의 문제가 아니다. 목록에서 스크롤을 내린 뒤 어떤 카드를 눌러도 같다.
마지막 카드가 유독 눈에 띄는 이유는 두 가지가 겹쳐서다 — 목록 맨 아래라 클릭 시점 스크롤이
최대치이고, 그 개념 화면이 짧은 축(2414px)이라 유지된 스크롤이 그 화면의 최대치와 거의 같아
정확히 맨 아래에 떨어진다. 다른 주제는 중간에 착지한다.

마지막 줄이 0인 것은 그 경로가 멀쩡해서가 아니다. 확인 문제 화면은 문서 높이가 뷰포트를
넘지 않아 브라우저가 0으로 클램프할 뿐이다. 원인은 같다.

**이미 잘 되는 동작이 하나 있다.** 목록을 2069px까지 내린 뒤 개념에 들어갔다가 뒤로 가면
2069px가 그대로 복원된다. 브라우저 기본 `history.scrollRestoration = 'auto'` 덕이다.
이 step은 그 동작을 유지한 채 링크 이동만 고친다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` — **"라우트 > 화면 전환 시 스크롤" 절**에 이 step의 규칙과
  네비게이션 타입별 동작 표가 이미 반영돼 있다. 그대로 따르라.
- `/docs/ADR.md` — ADR-007(HashRouter + 상대 경로 base), ADR-004(react-router-dom)
- `/docs/UI_GUIDE.md` — "애니메이션" 절
- `src/components/Layout.tsx` — 이 step에서 고치는 유일한 컴포넌트
- `src/components/Layout.test.tsx` — 기존 테스트가 있다. 여기에 덧붙인다.
- `src/App.tsx` — `Layout`이 모든 라우트의 부모 element라는 것을 확인하라.

## 작업

`src/components/Layout.tsx` 하나만 고친다. **새 파일을 만들지 마라.**

`Layout`은 모든 라우트를 감싸는 부모 element이고 라우터 컨텍스트 안에 있다.
여기에 `useEffect` 하나를 추가한다.

```
useLocation().key       <- 이동마다 바뀌는 값. effect 의존성으로 쓴다.
useNavigationType()     <- 'PUSH' | 'REPLACE' | 'POP'
```

동작 규칙:

| 네비게이션 타입 | 동작 |
|---|---|
| `PUSH` / `REPLACE` | `window.scrollTo(0, 0)` |
| `POP` | 아무것도 하지 않는다 (early return) |

핵심 규칙 — 벗어나지 마라:

- **effect 의존성은 `useLocation().key`를 쓴다.** `pathname`이 아니다. 이유: 복습 화면에서
  같은 주제에 속한 개념 링크는 목적지 경로가 서로 같다. `pathname`만 보면 같은 경로로 다시
  이동했을 때 effect가 돌지 않는다. `key`는 이동마다 새로 발급된다.
- **`POP`은 반드시 건너뛴다.** 이유: 위 배경의 "이미 잘 되는 동작"이 깨진다.
- `Layout`의 JSX·클래스·헤더 구조를 바꾸지 마라. 이 step은 effect 추가뿐이다.
- 반환하는 JSX는 지금과 100% 동일해야 한다.

## 테스트

`src/components/Layout.test.tsx`에 덧붙인다. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

jsdom의 `window.scrollTo`는 호출하면 "Not implemented"를 뱉는다.
`vi.spyOn(window, 'scrollTo').mockImplementation(() => {})`로 스파이를 세우고
`afterEach`에서 복원하라.

`MemoryRouter`로 라우팅을 시뮬레이션한다. 테스트용 라우트 두 개와 이동 수단을 갖춘
헬퍼를 하나 만들어 세 케이스에서 재사용하라.

- 목록 역할 라우트: 개념 라우트로 가는 `Link`
- 개념 역할 라우트: `useNavigate()`로 `navigate(-1)`을 호출하는 `button`
  (`MemoryRouter`에는 브라우저 히스토리가 없다. `history.back()`을 쓰지 마라.)

확인할 것:

1. 초기 렌더에서는 `window.scrollTo`를 호출하지 않는다. (초기 네비게이션 타입은 `POP`이다.
   새로고침 시 브라우저 복원을 존중해야 한다.)
2. `Link`를 클릭해 다른 화면으로 이동하면 `window.scrollTo`가 `0, 0`으로 호출된다.
3. 이동한 뒤 뒤로 가기(`navigate(-1)`)를 하면 그 이후로 `window.scrollTo`가
   추가 호출되지 않는다. (케이스 2에서 이미 1회 호출된 상태이므로, 뒤로 가기 **직전의
   호출 횟수와 직후의 호출 횟수가 같은지**를 비교하라. 단순히 "호출되지 않았다"를
   검사하면 케이스 2의 호출이 잡혀 잘못된 실패가 난다.)

**스크롤 위치 자체를 검증하려 하지 마라.** jsdom은 레이아웃을 계산하지 않아
`window.scrollY`가 항상 0이다. 스파이 호출만 확인한다.

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
grep -c "useNavigationType" src/components/Layout.tsx      # 2 (import + 호출)
grep -c "window.scrollTo" src/components/Layout.tsx        # 1
grep -rn "scrollRestoration" src/                          # 결과 없음
grep -rnE "ScrollRestoration|createHashRouter|createBrowserRouter" src/   # 결과 없음
grep -rnE "scrollTo|scrollIntoView" src/pages/             # 결과 없음
grep -c "smooth" src/components/Layout.tsx                 # 0
git diff --name-only                                       # Layout.tsx, Layout.test.tsx, index.json 뿐
```

3. 체크리스트:
   - `POP`에서 early return 하는가?
   - effect 의존성이 `key`인가?
   - `Layout`이 반환하는 JSX가 변경 전과 동일한가? `git diff`로 직접 확인하라.
4. 결과에 따라 `phases/7-scroll-reset/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`POP`에서 스크롤을 리셋하지 마라.** 이유: 뒤로 가기 복원(2069px → 2069px)이 깨진다.
  ARCHITECTURE.md에 근거가 있다.
- **`history.scrollRestoration`을 건드리지 마라.** 이유: 위 복원이 브라우저 기본값
  `'auto'`에 기대고 있다. `'manual'`로 바꾸면 직접 복원을 구현해야 하고, 그건 이 step의 범위가 아니다.
- `<ScrollRestoration>`을 쓰지 마라. data router 전용이라 `<Routes>` 구조에서 동작하지 않는다.
  `createHashRouter`/`createBrowserRouter`로 라우터를 교체하지 마라. 이유: ADR-007.
- `src/pages/` 아래 어떤 파일도 건드리지 마라. **확인 문제의 문항 전환에 스크롤 조작을
  추가하지 마라.** 이유: 375×667에서 해설이 펼쳐진 상태의 최대 스크롤이 91px로 측정됐다.
  라우트 이동이 아니라 `useState` 변경이고, 고칠 문제가 없다.
- 새 훅 파일(`src/hooks/useScrollReset.ts`)이나 새 컴포넌트(`ScrollToTop`)를 만들지 마라.
  이유: 한 곳에서만 쓰는 5줄이다. 호출 지점이 하나뿐인 코드에 추상화를 만들지 않는다.
- `behavior: 'smooth'`나 `scrollIntoView`를 쓰지 마라. 이유: UI_GUIDE "애니메이션" 절이
  페이지 전환 애니메이션을 금지한다. 전환은 즉시 일어나야 한다.
- `App.tsx`의 라우트 구조를 바꾸지 마라.
- 기존 테스트를 깨뜨리지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
