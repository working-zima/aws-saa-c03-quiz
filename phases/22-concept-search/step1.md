# Step 1: search-page

## 배경

step 0이 `src/lib/search.ts`에 순수 검색 로직을 만들었다. `searchContent(topics, query)`가
`SearchHit[]`을 돌려주고, 히트는 두 종류다.

```ts
export type SearchHit =
  | { kind: 'topic'; topic: Topic }
  | { kind: 'concept'; topic: Topic; concept: Concept }
```

이 step은 그 결과를 보여주는 화면과 라우트를 만든다. 헤더의 진입 링크는 step 2가 만든다.
**이 step이 끝난 시점에는 주소창에 `/search`를 직접 쳐야 들어갈 수 있는 상태가 정상이다.**

## 읽어야 할 파일

- `CLAUDE.md` — 아키텍처 규칙과 TDD 규칙.
- `docs/ARCHITECTURE.md` — "라우트" 표, "개념·주제 검색" 절, "화면 전환 시 스크롤" 절.
- `docs/UI_GUIDE.md` — **"검색 입력"과 "검색 화면"** 절. 클래스 문자열이 거기 있다.
  "레이아웃", "터치 영역", "모바일", "타이포그래피" 절도 함께 읽어라.
- `docs/ADR.md`의 **ADR-013**.
- `src/lib/search.ts`, `src/lib/search.test.ts` — step 0의 산출물. 시그니처와 정렬 규칙을 확인한다.
- `src/pages/TopicListPage.tsx` — 목록형 화면의 선례다. 카드 클래스와 `props` 기본값 패턴
  (`topics = defaultTopics`)을 그대로 따른다.
- `src/pages/ReviewPage.tsx` — 빈 상태 문구를 다루는 선례.
- `src/pages/RandomStartPage.tsx`, `src/pages/RandomQuizPage.tsx` — 최근에 추가된 화면과 테스트.
- `src/App.tsx`, `src/App.test.tsx` — 라우트를 추가할 곳.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **테스트를 먼저 쓰고 실패를 확인한 뒤** 구현한다.

### 1. `src/pages/SearchPage.tsx`

```tsx
interface SearchPageProps {
  topics?: Topic[]
}

export function SearchPage({ topics = defaultTopics }: SearchPageProps)
```

**질의는 URL의 `?q=`에 둔다.** `useState`가 아니라 `react-router-dom`의 `useSearchParams`다.

- 입력이 바뀔 때마다 `setSearchParams(..., { replace: true })`로 갱신한다.
  **`replace: true`를 빠뜨리지 마라.** 이유: 글자를 칠 때마다 히스토리가 쌓여 뒤로 가기가
  한 글자씩 되감긴다.
- 질의를 URL에 두는 이유는 결과에서 개념으로 들어갔다가 **뒤로 왔을 때 질의가 남아 있어야**
  하기 때문이다. `useState`로 바꾸지 마라.
- 질의가 빈 문자열이 되면 `q` 파라미터를 지운다. `?q=`만 남은 주소를 만들지 마라.

화면 구조와 문구는 아래로 고정한다. 클래스는 UI_GUIDE "검색 입력"·"검색 화면" 절을 따른다.

| 자리 | 내용 |
|---|---|
| 제목 | `검색` (`h1`) |
| 제목 줄 오른쪽 | 질의가 있을 때만 `결과 {n}개` |
| 입력 | `placeholder="개념·주제 검색"`, `aria-label="개념·주제 검색"`, 마운트 시 초점 |
| 질의가 빈 상태 | `개념 이름이나 주제 이름을 입력하면 결과가 여기에 나옵니다.` |
| 결과 0건 | `검색 결과가 없습니다.` |

**개념 히트 카드** — `to={`/topic/${topic.id}`}`

```
개념 이름        text-base font-medium text-neutral-100
주제 제목        text-xs text-neutral-500
한 줄 요약       text-sm text-neutral-400
```

**주제 히트 카드** — `to={`/topic/${topic.id}`}`

```
주제 제목        text-lg font-medium text-neutral-100
주제             text-xs text-neutral-500
```

- **한 줄 요약의 `**강조**` 마커를 그대로 출력하지 마라.** 화면에 별표가 보이면 안 된다.
  `ConceptReadPage`의 `renderEmphasis`를 가져다 쓰지 말고(그 파일을 건드리지 마라),
  마커를 지운 평문으로 보여준다. 지우는 함수는 **step 0이 만든 `src/lib/search.ts`에 이미
  있을 가능성이 높다** — 있으면 export해서 쓰고, 없으면 거기에 만들어 export해라.
  화면 파일 안에 문자열 처리 함수를 두지 마라.
- 카드는 `bg-panel`(주제 목록과 같은 `#141414`)에 `rounded-lg border border-neutral-800 p-5`.
  개념 히트와 주제 히트를 **다른 색으로 구분하지 마라.**
- 맞은 글자를 하이라이트하지 마라.
- 결과를 자르거나 `더 보기`를 만들지 마라.
- 최상위 `section`에 `max-w-3xl space-y-8 break-keep break-anywhere`를 건다.
  `break-keep`과 `break-anywhere`는 **함께** 쓴다(UI_GUIDE "타이포그래피").

### 2. `src/App.tsx`에 라우트 추가

```tsx
<Route path="search" element={<SearchPage />} />
```

`review` 라우트 옆에 둔다. `path="*"` 폴백보다 **앞에** 있어야 한다.

## 테스트

`src/pages/SearchPage.test.tsx`를 새로 만들고, `src/App.test.tsx`에 라우트 테스트를 덧붙인다.
`MemoryRouter`의 `initialEntries`에 `'/search?q=aurora'`를 넘기면 초기 질의를 검증할 수 있다.

1. 질의가 없을 때 안내 문구가 보이고 결과 카드가 없다.
2. 입력에 글자를 치면(`userEvent.type`) 결과가 나타난다.
3. `?q=`가 붙은 주소로 들어가면 그 질의의 결과가 **처음부터** 보이고, 입력에도 그 값이 들어 있다.
4. 개념 히트 카드가 `/topic/{topicId}`로 링크한다.
5. 맞는 것이 없는 질의는 `검색 결과가 없습니다.`를 보여준다.
6. 결과 개수 표시가 실제 카드 수와 같다.
7. 한 줄 요약에 `**`가 화면에 보이지 않는다(마커 제거 회귀 테스트).
8. `src/App.test.tsx`: `/search`에서 검색 화면(`heading` `검색`)이 렌더된다.

픽스처 `Topic[]`을 만들어 넘기면(`<SearchPage topics={fixture} />`) 실데이터 변화에
테스트가 흔들리지 않는다. `TopicListPage.test.tsx`가 쓰는 방식을 그대로 따른다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 검증 절차

1. 위 AC 커맨드를 모두 실행한다. 넷 다 통과해야 한다.
2. 아키텍처 체크리스트:
   - 라우터가 여전히 `HashRouter`인가? `BrowserRouter`로 바꾸지 않았는가?
   - 매칭 로직을 화면 안에서 다시 구현하지 않고 `searchContent`만 부르는가?
   - `fetch`나 외부 호스트 호출이 없는가?
   - `localStorage`에 닿는 코드가 없는가? 검색은 아무 상태도 남기지 않는다(ADR-013).
   - UI_GUIDE "AI 슬롭 안티패턴" 표에 걸리는 것이 없는가(이모지·그라데이션·blur 등)?
3. 결과에 따라 `phases/22-concept-search/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 3회 시도 후 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 중단

## 금지사항

- **`src/components/Layout.tsx`를 고치지 마라.** 이유: 헤더 링크는 step 2의 범위이고,
  거기엔 320px에서 링크가 세 개가 되면 안 된다는 별도 제약이 걸려 있다.
- **개념 위치로 점프하는 앵커(`#concept-id`)를 만들지 마라.** 이유: `Layout`이 라우트
  전환마다 맨 위로 되돌리는 계약을 갖고 있고(ARCHITECTURE "화면 전환 시 스크롤"),
  실측으로 확정된 그 규칙과 정면으로 부딪힌다. ADR-013이 명시적으로 범위 밖에 두었다.
- **`src/pages/ConceptReadPage.tsx`를 고치지 마라.** `renderEmphasis`를 공용으로 빼내는
  리팩터링도 하지 마라. 이유: 요청 범위 밖이고, 그 화면에는 회귀 테스트가 걸려 있다.
- **검색 결과에 문항을 넣지 마라.** `questions.json`을 import하지 마라.
- **디바운스·가상 스크롤·검색 결과 애니메이션을 넣지 마라.** 이유: 측정된 문제가 없고,
  UI_GUIDE "애니메이션" 절이 허용한 것은 해설 fade-in과 hover `transition-colors`뿐이다.
- 기존 테스트를 깨뜨리지 마라.
