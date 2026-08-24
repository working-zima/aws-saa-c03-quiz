# Step 1: concept-read-bar

## 선행 조건

**step 0이 완료된 뒤에 실행한다.** `src/lib/navigation.ts`의 `adjacentTopics`를 쓴다.
없으면 멈추고 `"status": "blocked"`로 보고하라. **이 step에서 그 함수를 새로 만들지 마라.**

`7-scroll-reset`이 아직 적용되지 않았다면, 다음 주제로 이동해도 스크롤이 이전 화면의
위치에 그대로 남는다. 이 step의 버그가 아니다. 그 phase에서 고친다.

## 배경 — 실측 결과

개념 읽기 화면의 하단 고정 바에는 지금 `확인 문제 풀기` 하나만 있다. 여기에 좌우로
주제 이동 화살표를 붙여 세 칸으로 만든다.

```
[← 아이콘]      [확인 문제 풀기]      [→ 아이콘]
```

**화살표에 텍스트 라벨을 붙이면 320px에서 넘친다.** 빌드된 CSS를 인라인하고 후보별
마크업을 격리한 컨테이너에 넣어 Chrome에서 잰 값이다.

| 좌우 칸의 내용 | 320px | 375px | 390px |
|---|---|---|---|
| `← 이전` (텍스트 화살표) | **26px 넘침** | 여유 29 | 여유 44 |
| SVG 16px + `이전` 라벨 | **21px 넘침** | 여유 34 | 여유 49 |
| `이전` (라벨만) | 여유 **0** | 여유 55 | 여유 70 |
| **SVG 20px 화살표만** | 여유 **51** | 여유 106 | 여유 121 |

320px에서 바 안쪽에 쓸 수 있는 폭은 278px이고 `확인 문제 풀기`가 123px을 가져간다.
남는 155px을 좌우 두 칸과 `gap-3` 두 개(24px)가 나눠 갖는다. 라벨만 남긴 안이 여유 0으로
간신히 통과하지만 글꼴이 1px만 넓어져도 넘친다. **화살표만 쓴다.**

화살표 버튼은 Ghost 클래스 그대로 폭 52px, 높이 44px로 측정됐다. 터치 영역을 만족한다.

**첫 주제·마지막 주제에서 칸을 비우면 가운데 버튼이 끌려간다.** 320px에서 잰
`확인 문제 풀기`의 왼쪽 좌표다.

| 이전 칸 | 가운데 버튼 좌표 |
|---|---|
| 이전 버튼 있음 (기준) | 77 |
| 빈 `span` | 51 — **26px 밀림** |
| 44px 스페이서 | 73 — 4px 밀림 |
| **비활성 화살표 `span` (52px)** | **77 — 기준과 같다** |

20개 주제 중 두 화면(첫·마지막)에서만 일어나지만, 그 두 화면만 주 버튼 위치가 다르면
손가락이 기억한 자리를 벗어난다. **폭이 같은 요소를 채워 자리를 유지한다.**

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/UI_GUIDE.md` — **"컴포넌트 > 하단 고정 액션 바" 절과 그 안의 "바 안의 3분할 —
  주제 이동" 하위 절**에 이 step의 규칙과 위 실측표가 이미 반영돼 있다. 그대로 따르라.
  "버튼"·"아이콘"·"터치 영역"·"모바일" 절과 "AI 슬롭 안티패턴" 표도 읽어라.
- `/docs/ARCHITECTURE.md` — "라우트 > 주제 간 이동" 절
- `src/lib/navigation.ts` — step 0에서 만든 `adjacentTopics`. **수정하지 마라.**
- `src/pages/ConceptReadPage.tsx` — 이 step에서 고치는 유일한 컴포넌트
- `src/pages/ConceptReadPage.test.tsx` — 기존 테스트가 있다. 여기에 덧붙인다.
- `src/pages/QuizPage.tsx` — Ghost 링크 클래스 문자열(`ghostLinkClass`)이 어떻게 생겼는지
  확인하는 용도다. **이 파일을 수정하지 마라.** 완료 화면은 step 2에서 다룬다.

## 작업

`src/pages/ConceptReadPage.tsx` 하나만 고친다. **새 파일을 만들지 마라.**

### 1. 인접 주제 계산

`adjacentTopics(topics, topicId)`를 컴포넌트 안에서 한 번 호출해 `prev`·`next`를 얻는다.
**`topics.findIndex`를 이 파일에서 직접 부르지 마라.**

`topic`을 찾지 못해 "주제를 찾을 수 없습니다"를 반환하는 분기는 **그대로 둔다.**
그 화면에 화살표를 넣지 마라.

### 2. 하단 바를 세 칸으로

지금 바의 마크업은 이렇다.

```
<div className="sticky bottom-0 -mx-5 border-t border-border bg-page px-5 py-3 sm:mx-0 sm:px-0">
  <Link ...>확인 문제 풀기</Link>
</div>
```

바 자체의 클래스는 **한 글자도 바꾸지 마라.** 그 안에 가로 배치 컨테이너를 하나 넣고
세 칸을 담는다.

```
안쪽 컨테이너: flex items-center justify-between gap-3
왼쪽 칸:       prev가 있으면 링크, 없으면 비활성 span
가운데 칸:     지금 있는 `확인 문제 풀기` 링크 — 클래스·문구·목적지를 바꾸지 마라
오른쪽 칸:     next가 있으면 링크, 없으면 비활성 span
```

### 3. 화살표 아이콘

SVG를 인라인으로 그린다. 아이콘 라이브러리를 설치하지 마라. 이모지·텍스트 화살표
(`←`·`→`·`»`)를 쓰지 마라. UI_GUIDE "아이콘" 절을 따른다.

```
width/height: 20
viewBox:      0 0 24 24
fill:         none
stroke:       currentColor
strokeWidth:  1.5
aria-hidden:  true
왼쪽 path d:  M15 19l-7-7 7-7
오른쪽 path d: M9 5l7 7-7 7
```

두 개는 파일 상단에 상수로 두고 재사용하라. **별도 컴포넌트 파일을 만들지 마라** —
이 파일 밖에서 쓰지 않는다.

### 4. 칸별 클래스와 접근성

| 상태 | 요소 | 클래스 | 접근성 |
|---|---|---|---|
| 이동 가능 | `Link` to `/topic/{prev.id}` | Ghost 버튼 + `text-neutral-400`, hover `text-neutral-100` | `aria-label="이전 주제"` |
| 이동 가능 | `Link` to `/topic/{next.id}` | 같음 | `aria-label="다음 주제"` |
| 갈 곳 없음 | `span` | 같은 Ghost 버튼 클래스 + `text-neutral-500` | `aria-hidden="true"` |

Ghost 버튼 클래스는 UI_GUIDE "버튼" 절의 것이다. `QuizPage.tsx`의 `ghostLinkClass`와
같은 문자열을 쓴다. **`min-h-[44px]`를 빼지 마라** — 터치 영역 최소치다.

`aria-label`이 필요한 이유: 화살표만 있어 접근 가능한 이름이 없다. 아이콘에는
`aria-hidden="true"`를 붙여 SVG가 이름 계산에 끼어들지 않게 한다.

비활성 칸을 `<button disabled>`로 만들지 마라. 누를 수 있어 보이면 안 된다. `span`이다.

핵심 규칙 — 벗어나지 마라:

- **`확인 문제 풀기` 링크를 손대지 마라.** 클래스·문구·`to` 목적지 그대로다.
- **바의 클래스 문자열(`sticky bottom-0 -mx-5 ... sm:px-0`)을 바꾸지 마라.**
  이유: `4-sticky-actions`와 `6-desktop-layout`에서 정해진 값이다.
- **화살표에 라벨 텍스트를 넣지 마라.** 위 실측표가 근거다.
- **`sm:`·`md:` 같은 브레이크포인트를 새로 추가하지 마라.** 화면 폭에 따라 화살표 모양이
  바뀌게 만들지 마라. UI_GUIDE "바 안의 3분할" 절에 이 안을 검토하고 버린 이유가 있다.
- 새 색을 도입하지 마라. `text-neutral-400`·`text-neutral-500`·`text-neutral-100`만 쓴다.
- 바 바깥(본문·헤더)에는 아무것도 추가하지 마라. 주제 위치 표시(`4 / 20`)를 만들지 마라 —
  요청받지 않았다.

## 테스트

`src/pages/ConceptReadPage.test.tsx`에 덧붙인다. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

기존 테스트의 `testTopics`는 주제가 하나뿐이다. **앞뒤가 있는 상황을 만들려면 주제 3개짜리
배열이 필요하다.** 기존 배열을 고치지 말고 새 배열을 추가하라 — 기존 테스트가 그 내용에
의존한다.

화살표는 `screen.getByLabelText('이전 주제')`·`getByLabelText('다음 주제')`로 잡는다.
`container.querySelector('svg')`를 쓰지 마라.

확인할 것:

1. 가운데 주제에서 두 화살표가 모두 렌더되고, `href`가 각각 앞·뒤 주제를 가리킨다.
   (`HashRouter`가 아니라 `MemoryRouter`이므로 `toHaveAttribute('href', '/topic/...')`로
   확인한다. 기존 테스트가 링크를 어떻게 검사하는지 먼저 보고 같은 방식을 쓰라.)
2. 첫 주제에서 `getByLabelText('이전 주제')`가 없다(`queryByLabelText`로 `null` 확인).
   `다음 주제`는 있다.
3. 마지막 주제에서 그 반대다.
4. 어느 경우에도 `확인 문제 풀기` 링크가 그대로 있고 `href`가 `/topic/{id}/quiz`다.

**픽셀 폭·오버플로를 테스트로 검증하려 하지 마라.** jsdom은 레이아웃을 계산하지 않고
Tailwind CSS도 로드되지 않는다. 위 실측표는 이미 브라우저에서 잰 값이다.

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
grep -c 'adjacentTopics' src/pages/ConceptReadPage.tsx        # 2 (import + 호출)
grep -c '<svg' src/pages/ConceptReadPage.tsx                  # 2
grep -c 'aria-hidden' src/pages/ConceptReadPage.tsx           # 3 이상 (svg 2 + 비활성 span)
grep -c 'min-h-\[44px\]' src/pages/ConceptReadPage.tsx        # 3 이상 (기존 2 + Ghost 클래스)
grep -c 'justify-between' src/pages/ConceptReadPage.tsx       # 2 (기존 header 1 + 바 1)
grep -c 'findIndex' src/pages/ConceptReadPage.tsx             # 0
grep -nE 'disabled=|<button' src/pages/ConceptReadPage.tsx    # 결과 없음
grep -nE 'sm:|md:|lg:' src/pages/ConceptReadPage.tsx          # 바의 sm:mx-0 sm:px-0 한 줄만
grep -nE '←|→|»|«' src/pages/ConceptReadPage.tsx              # 결과 없음
grep -c 'sticky bottom-0 -mx-5 border-t border-border bg-page px-5 py-3 sm:mx-0 sm:px-0' src/pages/ConceptReadPage.tsx   # 1
git diff --name-only    # ConceptReadPage.tsx, ConceptReadPage.test.tsx, index.json 뿐
```

3. 체크리스트:
   - `git diff src/pages/ConceptReadPage.tsx`를 **끝까지 직접 읽어라.** 바 안쪽 외에
     바뀐 줄이 있는가? 있으면 되돌려라.
   - `확인 문제 풀기` 링크의 클래스·문구·`to`가 변경 전과 글자 단위로 같은가?
   - 첫·마지막 주제에서 비활성 `span`이 링크와 **같은 Ghost 클래스**를 갖는가?
     (폭이 같아야 가운데 버튼이 움직이지 않는다.)
   - "주제를 찾을 수 없습니다" 분기가 그대로인가?
4. 결과에 따라 `phases/9-topic-navigation/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **화살표에 주제 제목을 넣지 마라.** 이유: 제목이 최장 55자짜리 한 덩어리다
  (`EMR·Spark·Redshift·Athena·Kinesis·Glue·X-Ray·CloudWatch`). 가운뎃점은 줄바꿈 기회가
  아니라서 min-content가 컨테이너를 밀어낸다. UI_GUIDE "모바일" 절을 봐라.
- **첫·마지막 주제에서 칸을 통째로 비우지 마라.** 이유: 위 실측표대로 가운데 버튼이
  26px 밀린다.
- **순환 이동을 만들지 마라.** 마지막 주제의 다음이 첫 주제가 되면 안 된다.
- **키보드 단축키(←/→ 키 리스너)를 만들지 마라.** 요청받지 않았다. `useEffect`로
  `keydown`을 붙이지 마라.
- **스와이프 제스처를 만들지 마라.** 터치 이벤트 핸들러를 추가하지 마라.
- **전환 애니메이션을 넣지 마라.** `transition-colors` 외의 transition, `animate-*`,
  `behavior: 'smooth'`를 쓰지 마라. UI_GUIDE "애니메이션" 절이 금지한다.
- `src/lib/navigation.ts`를 수정하지 마라. 시그니처가 안 맞으면 고치지 말고
  `"status": "blocked"`로 멈춰라.
- `src/pages/QuizPage.tsx`·`src/components/Layout.tsx`를 건드리지 마라.
  이유: 각각 step 2와 phase 7·8의 대상이다.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- 기존 테스트를 깨뜨리지 마라. 기존 `testTopics` 배열을 수정하지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 클래스 문자열을
  쪼개거나 변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
