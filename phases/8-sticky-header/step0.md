# Step 0: sticky-header

## 선행 조건

**`7-scroll-reset`이 완료된 뒤에 실행한다.** 두 phase 모두 `src/components/Layout.tsx`
한 파일을 고친다. phase 7이 끝난 시점의 `Layout.tsx`에는 네비게이션 타입을 보고
`window.scrollTo(0, 0)`을 호출하는 `useEffect`가 이미 들어 있다.
**그 effect를 읽되 건드리지 마라.** 이 step은 헤더의 클래스만 다룬다.

## 배경 — 실측 결과

헤더가 문서 흐름 안에 있어 스크롤을 내리면 화면 밖으로 사라진다. 개념 본문은 2400~3900px,
복습 화면은 오답이 쌓이면 19000px가 넘는다. 본문을 읽는 동안에는 주제 목록·복습으로
돌아갈 수단이 화면에 없다.

390×844 Chrome에서 잰 값이다.

| 항목 | 값 |
|---|---|
| 헤더 높이 | 77px (390·375·1440 모든 뷰포트 동일) |
| 헤더 `position` | `static` |
| 헤더 `background-color` | **`rgba(0, 0, 0, 0)` — 투명** |
| 600px 스크롤 후 헤더 `top` | **-600** (화면 밖) |
| 개념 화면 문서 높이 | 3878 |

**`sticky top-0`만 붙이면 안 된다.** 헤더가 검게 보이는 것은 헤더 자체의 배경이 아니라
부모 `div`의 `bg-page`가 비치기 때문이다. 흐름 안에 있을 때는 드러나지 않지만, 고정하는
순간 아래로 흘러가는 본문이 헤더 글자와 그대로 겹쳐 **둘 다 읽을 수 없는 상태**가 된다.
`sticky top-0`만 준 상태를 390px에서 스크린샷으로 확인한 결과다.
`bg-page`를 헤더 자체에 걸어야 한다.

`sticky`를 막는 요인은 없다. 헤더의 조상 네 개(`div.min-h-screen` → `div#root` → `body`
→ `html`)의 `overflow`가 모두 `visible`이고 `transform`이 `none`이다.

고정 후 남는 읽기 영역을 실측한 값이다. 이 step의 목표 상태다.

| 뷰포트 | 헤더 | 하단 액션 바 | 남는 영역 | 헤더 `top` |
|---|---|---|---|---|
| 390×844 | 77 | 69 | 698 (82.7%) | 0 |
| 375×667 | 77 | 69 | 521 (78.1%) | 0 |
| 1440×900 | 77 | 69 | 754 (83.8%) | 0 |

헤더와 하단 액션 바는 겹치지 않는다. 겹치려면 뷰포트 높이가 146px 아래로 내려가야 한다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/UI_GUIDE.md` — **"컴포넌트 > 상단 고정 헤더" 절**에 이 step의 규칙과 실측표가
  이미 반영돼 있다. 그대로 따르라. 바로 아래 "하단 고정 액션 바" 절도 함께 읽어라
  (이 step에서 건드리지는 않는다). "AI 슬롭 안티패턴" 표도 읽어라.
- `/docs/ARCHITECTURE.md` — "라우트 > 화면 전환 시 스크롤" 절
- `src/components/Layout.tsx` — 이 step에서 고치는 유일한 컴포넌트
- `src/components/Layout.test.tsx` — 기존 테스트가 있다. 여기에 덧붙인다.
- `src/pages/ConceptReadPage.tsx` — 하단 액션 바가 쓰는 클래스를 확인하는 용도다.
  **이 파일을 수정하지 마라.**

## 작업

`src/components/Layout.tsx` 하나만 고친다. **새 파일을 만들지 마라.**

`<header>`의 클래스를 이렇게 바꾼다.

```
변경 전: border-b border-border
변경 후: sticky top-0 border-b border-border bg-page
```

**이 step의 diff는 `<header>` 한 줄의 클래스 문자열뿐이다.**

핵심 규칙 — 벗어나지 마라:

- **`bg-page`를 반드시 함께 넣는다.** 이유는 위 배경에 있다. 빠뜨리면 본문과 헤더 글자가
  겹쳐 읽을 수 없다. `bg-page`는 `tailwind.config.js`에 이미 정의된 색이다.
  새 색·`bg-[#...]` 임의값을 쓰지 마라.
- **`z-index`를 붙이지 마라.** `sticky`는 그 자체로 positioned 요소라 static인 본문 위에
  그려진다. `main` 안에서 positioned인 것은 하단 액션 바 하나뿐이고 헤더와 겹치지 않는다.
  UI_GUIDE "상단 고정 헤더" 절에 근거가 있다.
- `fixed`가 아니라 `sticky`를 쓴다.
- 헤더 안쪽 구조(`div.px-5 py-4 sm:px-8` → `div.mx-auto flex max-w-3xl ...` → 로고·`nav`)를
  건드리지 마라. 셸 정렬은 `6-desktop-layout`에서 정해진 것이다.
- `main`·`Outlet`·`min-h-screen` 래퍼를 건드리지 마라.

## 테스트

`src/components/Layout.test.tsx`에 덧붙인다. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

`<header>`는 `screen.getByRole('banner')`로 잡는다. `container.querySelector`를 쓰지 마라.

확인할 것:

1. 헤더가 `sticky`, `top-0`, `bg-page`, `border-b` 클래스를 **모두** 가진다.
   (`toHaveClass`에 네 개를 한 번에 넘겨라.)
2. 헤더에 `fixed` 클래스가 없다.

**렌더링 결과의 픽셀·색을 검증하려 하지 마라.** jsdom은 레이아웃을 계산하지 않고
Tailwind CSS도 로드되지 않는다. `getComputedStyle(header).position`은 `static`을 돌려준다.
클래스 존재만 확인한다.

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
grep -c 'sticky top-0' src/components/Layout.tsx           # 1
grep -c 'bg-page' src/components/Layout.tsx                # 2 (min-h-screen 래퍼 + header)
grep -c '<header' src/components/Layout.tsx                # 1
grep -nE 'z-[0-9]|fixed|backdrop|blur|opacity|bg-\[' src/components/Layout.tsx   # 결과 없음
grep -nE 'pt-|mt-' src/components/Layout.tsx               # 결과 없음
grep -rn 'sticky top-0' src/pages/                         # 결과 없음
git diff --name-only                                       # Layout.tsx, Layout.test.tsx, index.json 뿐
```

3. 체크리스트:
   - `git diff src/components/Layout.tsx`를 직접 읽어라. **`<header>` 한 줄 외에
     바뀐 줄이 있는가?** 있으면 되돌려라.
   - phase 7에서 추가된 `useEffect`(네비게이션 타입 분기)가 그대로 남아 있는가?
   - 헤더 안쪽 셸(`mx-auto max-w-3xl`)과 로고·내비 링크의 `min-h-[44px]`가 그대로인가?
4. 결과에 따라 `phases/8-sticky-header/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`bg-page` 없이 `sticky top-0`만 넣지 마라.** 이유: 헤더 배경이 투명이라 본문과 글자가
  겹친다. 위 배경에 실측 근거가 있다.
- **반투명 배경·`backdrop-blur`를 쓰지 마라.** 이유: UI_GUIDE "AI 슬롭 안티패턴" 표 1행.
- **스크롤 방향에 따라 헤더를 숨기거나 축소하는 코드를 만들지 마라.** `useState`·스크롤
  리스너·`transform`을 추가하지 마라. 이유: 요청받지 않았고, UI_GUIDE "애니메이션" 절이
  페이지 전환 애니메이션을 금지한다. 고정은 항상 켜져 있는 상태다.
- **헤더 높이를 줄이려고 `py-4`를 건드리지 마라.** 이유: 77px은 `py-4`와 링크의
  `min-h-[44px]`에서 나온 값이고, 44px은 터치 영역 최소치다. 줄여봐야 8px이다.
- **본문에 상단 여백 보정(`pt-*`·`mt-*`)을 넣지 마라.** 이유: `sticky`는 문서 흐름 안에
  남으므로 헤더가 본문 첫 줄을 가리지 않는다. 보정을 넣으면 빈 띠가 생긴다.
- `src/pages/` 아래 어떤 파일도 건드리지 마라. **하단 고정 액션 바를 수정하지 마라.**
  이유: `4-sticky-actions`에서 정해진 것이고 헤더와 겹치지 않는다.
- 조상 요소에 `overflow-hidden`·`overflow-auto`·`transform`을 새로 넣지 마라.
  이유: `sticky`가 조용히 동작을 멈춘다.
- phase 7의 스크롤 리셋 `useEffect`를 수정·삭제하지 마라.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- 기존 테스트를 깨뜨리지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 클래스 문자열을
  쪼개거나 변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
