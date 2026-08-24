# Step 0: shell-container

## 배경 — 실측 결과

데스크톱에서 콘텐츠가 화면 왼쪽에 붙고, 헤더만 가로로 벌어진다.
Chrome에서 실제로 렌더링해 잰 값이다(뷰포트 1440px, 주제 목록 화면).

| 항목 | 현재 | 문제 |
|------|------|------|
| 본문 `section` | left=32, right=800 | 오른쪽 **640px**이 통째로 빔 |
| 본문 중심 ↔ 화면 중심 | **-304px** | 콘텐츠가 왼쪽으로 쏠림 |
| 헤더 로고 ↔ 내비 간격 | **1123px** | 로고는 화면 좌단, 내비는 우단으로 찢어짐 |
| 로고 왼쪽 ↔ 본문 왼쪽 | 어긋남 | 시선이 따라갈 세로축이 없음 |

원인은 두 곳이다.

- `src/components/Layout.tsx`의 헤더 안쪽 `div`에 폭 제한이 없다.
  `justify-between`이 화면 전폭에 걸려 로고와 내비를 양 끝으로 밀어낸다.
- `main`과 각 페이지 `section`의 `max-w-*`에 `mx-auto`가 없다.
  `max-w-*`는 상한일 뿐이라 폭이 상한에서 멈출 뿐 가운데로 오지 않는다.

수정안을 같은 방식으로 실측해 확인했다. 이 값이 이 step의 목표다.

| 뷰포트 | 셸 | 로고 왼쪽 ↔ 본문 왼쪽 | 본문 중심 ↔ 화면 중심 |
|------|------|------|------|
| 1024px | left=128, w=768 | 0px | 0 (목록) |
| 1440px | left=336, w=768 | 0px | 0 (목록) |
| 1920px | left=576, w=768 | 0px | 0 (목록) |

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/UI_GUIDE.md` — **"레이아웃 > 데스크톱" 절**에 이 step의 규칙이 이미 반영돼 있다.
  그대로 따르라. "하단 고정 액션 바" 절도 함께 읽어라(이 step에서 건드리지는 않는다).
- `/docs/ARCHITECTURE.md`, `/docs/ADR.md`
- `src/components/Layout.tsx` — 이 step에서 고치는 유일한 컴포넌트
- `src/components/Layout.test.tsx` — 기존 테스트 두 개가 있다. 여기에 덧붙인다.
- `src/pages/TopicListPage.tsx`, `src/pages/ConceptReadPage.tsx`,
  `src/pages/QuizPage.tsx`, `src/pages/ReviewPage.tsx` — 각 화면의 `section`이 쓰는
  `max-w-*` 값을 확인하는 용도다. **이 파일들을 수정하지 마라.**

## 작업

`src/components/Layout.tsx` 한 파일만 고친다.

헤더 안쪽과 `main` 안쪽에 **동일한 중앙 정렬 셸**을 둔다. 구조는 이렇다.

```
header > div(좌우 패딩)      > div(mx-auto max-w-3xl, flex justify-between) > 로고, nav
main(좌우 패딩)              > div(mx-auto max-w-3xl)                       > Outlet
```

핵심 규칙 — 벗어나지 마라:

- **패딩 레이어와 폭 제한 레이어를 분리한다.** 좌우 패딩(`px-5 sm:px-8`)은 바깥 요소에,
  폭 제한과 중앙 정렬(`mx-auto max-w-3xl`)은 안쪽 요소에 건다.
  한 요소에 둘 다 걸지 마라. 이유: `box-sizing: border-box`라서 패딩이 `max-w-3xl` 안쪽으로
  파고들어 본문 폭이 768px보다 좁아진다.
- **헤더 셸과 `main` 셸은 폭·패딩이 같아야 한다.** 값이 어긋나면 로고 왼쪽과 본문 왼쪽이
  같은 세로축에 서지 않는다. 위 표의 "0px"이 이 step의 성공 조건이다.
- 셸 폭은 `max-w-3xl`이다. 다른 값을 고르지 마라.
- 기존 클래스(`min-h-screen bg-page text-body`, `border-b border-border`, `py-4`, `py-8`,
  로고·내비 링크의 `min-h-[44px]` 등)를 그대로 유지하라. 이 step은 폭과 정렬만 다룬다.

## 테스트

`src/components/Layout.test.tsx`에 테스트를 덧붙인다. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

확인할 것:

1. 헤더의 로고·내비를 감싸는 요소가 `mx-auto`와 `max-w-3xl`을 가진다.
2. `Outlet`이 렌더링되는 화면 내용을 감싸는 요소가 `mx-auto`와 `max-w-3xl`을 가진다.
3. 두 셸의 폭 클래스가 서로 같다.

**jsdom은 레이아웃을 계산하지 않는다.** 실제 픽셀 위치는 잴 수 없으므로 클래스 존재만 확인한다.
`getBoundingClientRect`를 모킹해 좌표를 검증하는 테스트를 만들지 마라. 아무것도 증명하지 못한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 헤더 셸과 `main` 셸이 같은 폭 클래스(`max-w-3xl`)와 같은 좌우 패딩을 쓰는가?
   - 좌우 패딩과 `max-w-3xl`이 **서로 다른 요소**에 걸려 있는가?
   - 페이지 파일 4개(`TopicListPage`·`ConceptReadPage`·`QuizPage`·`ReviewPage`)가
     그대로인가? `git diff --name-only`로 확인하라.
   - `HashRouter`·`vite.config.ts`의 `base`를 건드리지 않았는가?
3. 결과에 따라 `phases/6-desktop-layout/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 페이지 `section`의 `max-w-2xl`·`max-w-3xl`을 바꾸지 마라. 이유: 읽기 폭 상한이며,
  UI_GUIDE "레이아웃"에 값이 고정돼 있다.
- 페이지 `section`에 `mx-auto`를 붙이지 마라. 이유: 개념 읽기·확인 문제(`max-w-2xl`)는
  셸 안에서 왼쪽 정렬이어야 로고와 세로축이 맞는다. UI_GUIDE "데스크톱" 절을 봐라.
- `lg:`·`xl:` 브레이크포인트를 새로 도입하지 마라. 이유: 셸 하나로 모든 폭이 해결된다.
  실측표의 1024·1440·1920px 값이 전부 셸 하나로 나온 값이다.
- 사이드바·다단 레이아웃·2열 카드 그리드를 만들지 마라. 이유: 요청받지 않았다.
- 색·테두리·글자 크기·여백(`py-*`)을 바꾸지 마라. 이유: 이 step은 가로 폭과 정렬만 다룬다.
- `ConceptReadPage`의 하단 고정 액션 바를 건드리지 마라. 이유: step 1의 범위다.
- 기존 테스트를 깨뜨리지 마라.
