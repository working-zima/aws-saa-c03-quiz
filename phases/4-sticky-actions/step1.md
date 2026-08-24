# Step 1: sticky-action-bar

## 배경 — 실제 사용에서 확인된 문제

다음으로 넘어가는 버튼이 본문 **끝**에 있어서, 누르려면 매번 스크롤을 내려야 한다.

- 개념 읽기: 주제 하나의 개념 본문이 중간값 1,742자, 최대 2,815자다.
  `확인 문제 풀기`는 그 아래에 있다.
- 확인 문제: 보기 4개와 해설 아래에 `다음 문제`가 있다. **문항마다 반복된다.**
  한 주제에 문항이 최대 16개다.

`docs/UI_GUIDE.md`에 이 step에서 쓸 **"하단 고정 액션 바"** 스펙을 새로 추가해 두었다.
클래스와 금지사항은 거기가 기준이다. 먼저 읽어라.

## 읽어야 할 파일

- `docs/UI_GUIDE.md` — "컴포넌트 > 하단 고정 액션 바" 절 (필수)
- `src/pages/ConceptReadPage.tsx`, `src/pages/QuizPage.tsx`
- `src/components/Layout.tsx` — `main`의 `px-5 sm:px-8`. 바의 `-mx-5 sm:-mx-8`이 이걸 상쇄한다.

## 대상

| 파일 | 감쌀 요소 | 보이는 조건 |
|------|-----------|-------------|
| `src/pages/ConceptReadPage.tsx` | `확인 문제 풀기` `Link` (정상 분기 마지막 요소) | 항상 |
| `src/pages/QuizPage.tsx` | `다음 문제` / `결과 보기` `button` | 정답 공개 후(`revealed`) |

## 작업

각 대상을 `UI_GUIDE`의 하단 고정 액션 바 스펙대로 감싼다.
감싸는 요소는 `div` 하나면 된다. 버튼·링크 자신의 클래스는 **그대로 둔다.**

### CRITICAL — 바를 어디에 두는가

**두 파일 모두, 바는 `section`의 직접 마지막 자식이어야 한다.**

`position: sticky`는 부모(containing block) 영역 안에서만 화면에 붙어 있는다.
`QuizPage`의 버튼은 지금 해설 블록(`revealed && <div ...>`) 안에 들어 있는데,
그 안에 그대로 두고 `sticky`만 붙이면 **해설 블록이 화면에 걸쳐 있을 때만 바가 보인다.**
문제와 보기를 보고 있는 동안에는 바가 화면 밖이라 아무 소용이 없다.

그래서 `QuizPage`에서는:

- 해설 블록 안의 버튼 래퍼 `<div>`와 그 안의 `advance` 버튼을 **해설 블록 밖으로 꺼내서**,
  `section`의 마지막 자식인 sticky 바에 넣는다.
- 바 전체를 `{revealed && ( ... )}`로 감싼다. 정답 공개 전에는 바가 없다.
- `근거 개념으로 돌아가기` 링크는 **해설 블록 안에 그대로 둔다.** 바로 옮기지 마라.
  이유: 그건 해설을 읽다가 근거를 다시 보러 가는 링크지, 다음으로 넘어가는 행동이 아니다.

`ConceptReadPage`에서는 `확인 문제 풀기` `Link`가 이미 `section`의 마지막 자식이므로
그 자리에서 바로 감싸면 된다.

### 적용하지 않는 화면

아래 분기에는 바를 넣지 마라. 스크롤이 생기지 않아 고정할 이유가 없다.

- `QuizPage`의 완료 분기(`complete`)와 문항 없음 분기
- `ConceptReadPage`의 주제 없음 분기

## 테스트

`ConceptReadPage.test.tsx`와 `QuizPage.test.tsx`에 각각 테스트를 추가한다.
jsdom은 레이아웃을 계산하지 않으므로 **클래스와 DOM 위치만** 확인한다.
`getBoundingClientRect`를 모킹하지 마라.

- `ConceptReadPage`: `확인 문제 풀기` 링크의 부모 요소가 `sticky`, `bottom-0`, `bg-page`,
  `border-t` 클래스를 가진다. 그리고 그 부모가 `section`의 **마지막 자식**이다
  (`section.lastElementChild`와 같은 요소인지 확인).
- `QuizPage`: 정답 공개 후 `다음 문제` 버튼의 부모가 같은 클래스를 가지고,
  그 부모가 `section`의 마지막 자식이다.
- `QuizPage`: 정답 공개 **전**에는 `sticky` 클래스를 가진 요소가 없다.

각 화면을 렌더하고 정답을 공개하는 방법은 기존 테스트 파일에 이미 있다. 새로 고안하지 말고 재사용하라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래 명령의 출력이 **정확히 2줄**이어야 한다(대상 2곳):

   ```bash
   grep -n 'sticky bottom-0' src/pages/*.tsx | grep -v test
   ```

3. 아래 명령의 출력이 **비어 있어야 한다.** `sticky`를 깨뜨리는 조상 `overflow`도,
   금지된 `fixed`·반투명 배경도 새로 들어오지 않았다는 뜻이다:

   ```bash
   grep -nE 'overflow-hidden|overflow-auto|overflow-x-|backdrop-blur|fixed bottom' \
     src/pages/*.tsx src/components/*.tsx | grep -v test
   ```

4. phase 3-mobile의 성과가 그대로인가? 아래 명령이 이 값을 그대로 뱉어야 한다.
   숫자가 줄었다면 `break-keep`/`break-anywhere`나 44px 터치 영역을 지운 것이다:

   ```bash
   grep -c 'break-anywhere' src/pages/ConceptReadPage.tsx src/pages/QuizPage.tsx \
     src/pages/ReviewPage.tsx src/pages/TopicListPage.tsx
   # ConceptReadPage.tsx:2  QuizPage.tsx:3  ReviewPage.tsx:1  TopicListPage.tsx:1

   grep -c 'min-h-\[44px\]' src/pages/ConceptReadPage.tsx src/pages/QuizPage.tsx \
     src/pages/ReviewPage.tsx src/components/Layout.tsx
   # ConceptReadPage.tsx:2  QuizPage.tsx:3  ReviewPage.tsx:2  Layout.tsx:2
   ```

5. 결과에 따라 `phases/4-sticky-actions/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `position: fixed`를 쓰지 마라. 이유: `UI_GUIDE`에 적었다 — 마지막 본문 줄을 영구히 가리고,
  본문에 하단 여백 보정을 넣어야 한다.
- 본문에 `pb-*` 하단 여백 보정을 넣지 마라. `sticky`는 문서 흐름 안에 있어서 필요 없다.
- 반투명 배경·`backdrop-blur`·그림자를 넣지 마라. 안티패턴 표에 있다.
- `z-*`를 넣지 마라. 불투명 배경이면 충분하고, 지금 겹칠 요소가 없다.
- 버튼·링크의 문구·색·`min-h-[44px]`·`space-y-8` 간격을 바꾸지 마라.
  이 step은 **위치만** 다룬다.
- `Layout.tsx`를 건드리지 마라. 이유: 바가 `main`의 패딩을 상쇄하는 구조라 패딩이 바뀌면 어긋난다.
- 클래스 상수를 새로 만들지 마라. 각 파일에서 한 번씩만 쓴다.
- 기존 테스트를 깨뜨리지 마라. 특히 `min-h-[44px]`·`break-anywhere` 회귀 테스트.
