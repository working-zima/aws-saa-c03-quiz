# Step 1: action-bar-width

## 배경

step 0에서 `src/components/Layout.tsx`에 중앙 정렬 셸(`mx-auto max-w-3xl`)을 도입했다.
헤더 안쪽과 `main` 안쪽이 같은 셸을 공유해, 데스크톱에서 콘텐츠가 화면 가운데 놓인다.

그 결과 `src/pages/ConceptReadPage.tsx`의 하단 고정 액션 바가 어중간해진다.

이 바는 지금 `-mx-5 px-5 sm:-mx-8 sm:px-8`로 `main`의 좌우 패딩을 음수 마진으로 상쇄해
**배경이 화면 폭을 채우게** 만들어져 있다. 모바일에서는 이게 맞다. `main`이 화면 전폭이므로
패딩만 상쇄하면 바가 화면 좌우 끝까지 닿는다.

데스크톱에서는 더 이상 닿지 못한다. 셸이 화면 가운데 있어서 바깥으로 나가야 할 거리가
음수 마진 값보다 훨씬 크기 때문이다. 1440px에서 계산하면 이렇다.

| | left | right | 폭 |
|------|------|------|------|
| 개념 읽기 본문 `section` | 336 | 1008 | 672 |
| 화면 | 0 | 1440 | 1440 |
| `sm:-mx-8`을 유지한 바 | 304 | 1040 | 736 |
| **이 step의 목표 (`sm:mx-0`)** | **336** | **1008** | **672** |

`sm:-mx-8`을 유지하면 화면 폭도 아니고 본문 폭도 아닌, 본문보다 좌우 32px씩만 튀어나온
띠가 남는다. 데스크톱에서는 본문 폭에 맞추는 것이 맞다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/UI_GUIDE.md` — **"하단 고정 액션 바" 절**에 목표 클래스와 이유가 이미 반영돼 있다.
  그대로 따르라. "레이아웃 > 데스크톱" 절도 함께 읽어라.
- `/docs/ARCHITECTURE.md`, `/docs/ADR.md`
- `src/components/Layout.tsx` — step 0에서 도입한 셸 구조를 확인하라.
- `src/pages/ConceptReadPage.tsx` — 이 step에서 고치는 유일한 컴포넌트
- `src/pages/ConceptReadPage.test.tsx` — 액션 바를 검증하는 기존 테스트가 있다. 여기에 덧붙인다.

## 작업

`src/pages/ConceptReadPage.tsx`의 하단 고정 액션 바 `div` 하나만 고친다.

데스크톱 분기를 음수 마진에서 폭 맞춤으로 바꾼다.

```
현재:  sticky bottom-0 -mx-5 ... px-5 py-3 sm:-mx-8 sm:px-8
목표:  sticky bottom-0 -mx-5 ... px-5 py-3 sm:mx-0 sm:px-0
```

핵심 규칙 — 벗어나지 마라:

- **모바일 분기 `-mx-5 px-5`는 그대로 둔다.** 이유: 모바일에서는 바 배경이 화면 폭을
  채워야 한다. 이 값을 지우면 그 동작이 깨진다.
- `sticky bottom-0`을 `fixed`로 바꾸지 마라. 이유: UI_GUIDE에 근거가 적혀 있다.
  문서 흐름 안에 남아야 스크롤 최하단에서 마지막 본문 줄을 가리지 않는다.
- 액션 바의 조상에 `overflow: hidden|auto`를 새로 만들지 마라. 이유: 조상에 있으면
  `sticky`가 조용히 동작을 멈춘다.
- 바 안의 `확인 문제 풀기` 링크는 그대로 둔다. `min-h-[44px]`를 포함해 클래스를 바꾸지 마라.

## 테스트

`src/pages/ConceptReadPage.test.tsx`의 액션 바 테스트에 덧붙인다. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

확인할 것:

1. 액션 바가 `sm:mx-0`과 `sm:px-0`을 가진다.
2. 액션 바가 모바일 분기 `-mx-5`와 `px-5`를 여전히 가진다.
3. 액션 바가 `sm:-mx-8`을 **가지지 않는다**.

**jsdom은 레이아웃도 미디어 쿼리도 계산하지 않는다.** 실제 픽셀 폭은 잴 수 없으므로
클래스 존재/부재만 확인한다. `matchMedia`나 `getBoundingClientRect`를 모킹해
폭을 검증하는 테스트를 만들지 마라. 아무것도 증명하지 못한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 액션 바가 `sm:mx-0 sm:px-0`을 쓰고 `sm:-mx-8 sm:px-8`이 남아 있지 않은가?
   - 모바일 분기 `-mx-5 px-5`가 그대로인가?
   - `ConceptReadPage.tsx` 외의 파일을 건드리지 않았는가?
     `git diff --name-only`로 확인하라(테스트 파일은 예외).
   - `QuizPage`에 액션 바를 추가하지 않았는가? 거기는 정답 보기 재탭으로 넘어가므로
     버튼 자체가 없어야 한다. 기존 테스트가 `.sticky`의 부재를 검증하고 있다.
3. 결과에 따라 `phases/6-desktop-layout/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- step 0에서 만든 셸 구조를 바꾸지 마라. 이유: 이 step은 액션 바 한 곳만 다룬다.
- `QuizPage`·`ReviewPage`·`TopicListPage`에 하단 고정 바를 추가하지 마라.
  이유: UI_GUIDE에 "지금 쓰는 곳은 개념 읽기의 `확인 문제 풀기` 하나뿐"이라고 못 박혀 있다.
- 액션 바에 `backdrop-blur`나 반투명 배경을 넣지 마라. 이유: UI_GUIDE 안티패턴 표에 있다.
  배경은 불투명 `bg-page`여야 한다.
- 색·테두리·글자 크기·세로 여백(`py-3`)을 바꾸지 마라. 이유: 이 step은 가로 폭만 다룬다.
- 기존 테스트를 깨뜨리지 마라.
