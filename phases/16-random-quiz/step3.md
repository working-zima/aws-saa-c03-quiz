# Step 3: random-entry

## 배경 — 아직 URL을 직접 쳐야만 들어갈 수 있다

step 2에서 `/random`과 `/random/:count`를 만들었지만 앱 안에 그리로 가는 링크가 없다.
**주제 목록에 진입점 한 줄을 둔다.** 그것으로 이 phase가 끝난다.

**배치와 클래스는 `docs/UI_GUIDE.md`의 "랜덤 문제 진입점 (주제 목록)" 절에 이미 적혀 있다.
먼저 읽어라.**

## 읽어야 할 파일

- `docs/UI_GUIDE.md`의 **"랜덤 문제 진입점 (주제 목록)"** — 위치·클래스·금지 사항.
- `docs/UI_GUIDE.md`의 **"AI 슬롭 안티패턴"** 표 — 아이콘·배지·그라데이션을 쓰지 않는 이유.
- `src/pages/TopicListPage.tsx` — 고칠 파일.
- `src/pages/TopicListPage.test.tsx` — 테스트 스타일. `renderPage` 헬퍼의 기본
  `pageQuestions`가 **빈 배열**이라는 점에 주의해라.

## 만드는 것

고치는 파일 **둘뿐**이다. 새 파일을 만들지 마라.

- `src/pages/TopicListPage.tsx`
- `src/pages/TopicListPage.test.tsx`

### 진입점 한 줄

**진행률 바 아래, 주제 카드 그리드 위**에 `/random`으로 가는 `Link`를 둔다.
헤더에 넣지 마라 — 320px에서 헤더 링크가 셋이 되면 로고와 부딪힌다.

```
block rounded-lg border border-neutral-800 px-5 py-4 hover:border-neutral-700
```

- **주제 카드의 배경(`bg-panel` / `#141414`)을 쓰지 마라.** 배경 없이 테두리만 두는 것이
  21번째 주제 카드처럼 보이지 않게 하는 유일한 신호다.
- 왼쪽에 제목, 오른쪽에 전체 문항 수 안내를 보조 색(`text-neutral-500`)으로 둔다.
  좁은 화면에서 두 덩이가 부딪히지 않게 `gap-3`을 두고, **`shrink-0`은 오른쪽 짧은 쪽에만** 쓴다
  (UI_GUIDE "모바일").
- **문항 총계를 숫자로 하드코딩하지 마라.** `questions.length`에서 온다.
- 아이콘·배지·화살표 SVG·강조색을 붙이지 마라. 색은 정답/오답/중요도에만 쓴다.
- 주제 목록이 비어 있을 때(`topics.length === 0`)도 이 줄은 그대로 보인다.
  기존의 "표시할 학습 주제가 없습니다" 분기 **안쪽에 넣지 마라.**

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.
`TopicListPage.test.tsx`에 `it`을 추가한다. **기존 `it`을 고치지 마라.**

### 반드시 들어가야 하는 검증

1. `/random`으로 가는 링크가 있다.
2. 전체 문항 수가 주입한 `questions`의 길이에서 나온다. 헬퍼의 기본값이 빈 배열이므로
   **문항을 넘기는 호출로 확인해라** — 길이가 다른 두 경우를 보는 것이 가장 확실하다.
3. 그 링크가 **주제 카드보다 앞에** 온다. `container.querySelectorAll('a')`의 순서나
   `compareDocumentPosition`으로 확인해라. 위치가 규칙의 일부다.

## 하지 마라

- 헤더(`src/components/Layout.tsx`)를 건드리지 마라. 진입점은 주제 목록 한 곳뿐이다.
- `src/pages/RandomStartPage.tsx`·`RandomQuizPage.tsx`·`src/components/`·`src/lib/`·
  `src/App.tsx`를 건드리지 마라. 이 step의 범위가 아니다.
- 진행률 바나 주제 카드의 기존 마크업을 손보지 마라. 줄 하나를 추가하는 것이 전부다.
- 랜덤 문제를 얼마나 풀었는지 같은 통계를 만들지 마라. 그런 기록은 없다(ADR-012).

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
grep -c '/random' src/pages/TopicListPage.tsx           # 1
grep -c 'questions.length' src/pages/TopicListPage.tsx  # 1
grep -c 'bg-panel' src/pages/TopicListPage.tsx          # 1   (주제 카드가 쓰는 것 하나뿐)
grep -c '<svg' src/pages/TopicListPage.tsx              # 0
git diff --name-only                                    # 위 두 파일만
```

`bg-panel`이 2가 되면 진입점에 카드 배경을 붙인 것이다. UI_GUIDE 위반이다.

**검증 조건과 올바른 코드가 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**
조건을 통과시키려고 문자열을 쪼개거나 표현을 우회하지 마라.
