# Step 5: topic-list-page

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` — 핵심 기능 1(주제 목록), 5(진행률)
- `/docs/UI_GUIDE.md` — 카드·진행률 표시·타이포그래피·레이아웃 규칙
- 이전 step 산출물: `src/pages/TopicListPage.tsx`(자리표시자), `src/components/Layout.tsx`,
  `src/hooks/useProgress.ts`, `src/lib/stats.ts`, `src/data/index.ts`, `src/data/topics.json`

`src/lib/stats.ts`의 `topicStats`, `overallPercent` 시그니처를 먼저 확인하라. 그대로 쓴다.

## 작업

`src/pages/TopicListPage.tsx`를 구현한다. 앱의 첫 화면이다.

### 보여줄 것

1. **전체 진행률** — 화면 상단에 막대 하나와 퍼센트. `overallPercent`를 쓴다.
2. **주제 카드 목록** — `topics` 순서대로. 각 카드에:
   - 주제 제목
   - 중요도 별 표시 — `3`이면 `★★★`, `2`면 `★★☆`, `0`이면 표시하지 않는다.
     색은 UI_GUIDE의 중요도 색을 쓴다.
   - 학습 상태 — 아래 규칙으로 한 가지만 표시한다:
     - 아직 안 읽음 → 아무 표시 없음
     - 읽음, 문제 안 품 → `읽음`
     - 문제를 풀었음 → `정답 N/M`
   - 카드 전체가 `/topic/:topicId`로 가는 링크다

### 데이터가 없을 때

`topics.json`에는 지금 8개만 들어 있고, 문항은 step 7 전까지 0개다.
**문항이 0개인 주제에서 `정답 0/0`이나 `NaN%`가 뜨면 안 된다.** 이 경우를 처리하라.

주제가 아예 0개인 경우도 빈 화면 대신 안내 문구를 보여라.

### UI 규칙

- 최대 너비 `max-w-3xl`, 좌측 정렬
- 카드는 UI_GUIDE의 카드 스타일을 쓴다
- 별점을 이모지로 쓰지 마라. `★` `☆` 문자를 쓴다
- 진행률은 막대 하나 + 숫자다. 원형 게이지·카운터 애니메이션을 만들지 마라

### 화면 내 이동 링크

앱 안에서 다른 화면으로 가는 링크는 **반드시 `react-router-dom`의 `Link`(또는 `NavLink`)를 써라.**
`<a href="#/...">`처럼 해시 경로를 직접 박아 넣지 마라.

이유: `Link`는 현재 라우터에 맞는 href를 알아서 만든다. `HashRouter`에서는 `#/topic/abc`,
`MemoryRouter`(테스트)에서는 `/topic/abc`가 나온다. 해시를 손으로 박으면 컴포넌트가
`HashRouter`에 고정되고, ADR-007이 열어 둔 `BrowserRouter` 전환 경로가 조용히 막힌다.
`Layout.tsx`가 이미 `NavLink`를 쓰고 있으니 그 방식에 맞춰라.

### 테스트

`src/pages/TopicListPage.test.tsx`:

- 주제 제목들이 렌더된다
- 중요도 `3`인 주제에 `★★★`가, `0`인 주제에는 별이 없다
- 문항이 0개인 주제에서 `NaN`이 렌더되지 않는다
- 진행 상태가 있는 주제에 `정답 N/M`이 보인다
- 카드 링크의 href가 `/topic/{id}`를 가리킨다 (`MemoryRouter` 기준)

테스트는 `MemoryRouter`로 감싸고, 진행 상태는 주입 가능한 형태로 검증하라.
localStorage 실제 값에 의존하는 테스트를 쓰지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 진행률 계산을 컴포넌트에서 직접 하지 않고 `src/lib/stats.ts`를 쓰는가?
   - `localStorage`를 직접 부르지 않는가?
   - UI_GUIDE의 색상 토큰을 쓰는가? 하드코딩된 헥스값이 없는가?
   - 최대 너비가 `max-w-3xl`인가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 검색·필터·정렬 기능을 만들지 마라. 이유: PRD의 MVP 제외 사항이다.
- 다른 페이지를 건드리지 마라. 이유: 각 화면마다 step이 따로 있다.
- 데이터 파일을 수정하지 마라. 이유: 데이터 생성은 별도 step이다.
- 문항 0개일 때 0으로 나누지 마라.
- 내부 이동 링크에 `<a href="#/...">`를 쓰지 마라. 이유: 라우터 구현에 컴포넌트가 고정된다. `Link`를 써라.
- 기존 테스트를 깨뜨리지 마라.
