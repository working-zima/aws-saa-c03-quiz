# Step 1: touch-targets

## 배경 — 실측 결과

누를 수 있는 요소가 손가락에 비해 작다. Chrome에서 실제로 렌더링해 잰 크기다.
기준은 44px(iOS HIG·WCAG 2.5.8이 공통으로 권고하는 최소 터치 영역)이다.

| 화면 | 요소 | 실측 크기 | 부족분 |
|------|------|------|------|
| `Layout` | 로고 `AWS SAA-C03` | 109×**24** | 20px |
| `Layout` | 내비 `주제 목록` | 84×**36** | 8px |
| `Layout` | 내비 `복습` | 56×**36** | 8px |
| `ConceptReadPage` | `확인 문제 풀기` | 123×**40** | 4px |
| `QuizPage` | `다음 문제` / `결과 보기` | 92×**40** | 4px |
| `QuizPage` | `근거 개념으로 돌아가기` | 129×**20** | 24px |
| `ReviewPage` | `확인 문제 다시 풀기` | 140×**36** | 8px |

이미 충분해서 **건드리면 안 되는 것**도 실측으로 확인했다:

- `TopicListPage`의 주제 카드 — `p-5`라 이미 크다
- `QuizPage`의 보기 버튼 — `py-3`이라 44px을 넘는다
- `ReviewPage`의 개념 목록 항목 — `block py-4`에 2줄 텍스트라 충분하다

## 읽어야 할 파일

- `/docs/UI_GUIDE.md` — "터치 영역" 절과 갱신된 "버튼" 컴포넌트 스펙.
  버튼 스펙에 `inline-flex items-center min-h-[44px]`가 이미 반영돼 있다. 그대로 따르라.
- `src/components/Layout.tsx`, `src/pages/ConceptReadPage.tsx`,
  `src/pages/QuizPage.tsx`, `src/pages/ReviewPage.tsx`

## 작업

위 표의 **7개 요소에만** `inline-flex items-center min-h-[44px]`를 추가한다.

`py-*`를 키워서 44px을 맞추지 마라. 요소마다 글자 크기가 달라(`text-sm`·`text-base`) 필요한 패딩이
제각각이라, 값이 흩어지고 나중에 글자 크기가 바뀌면 조용히 44px 아래로 내려간다.
`min-h-[44px]`는 글자 크기와 무관하게 바닥을 보장한다.

`QuizPage`와 `Layout`은 클래스를 상수/함수로 뽑아 두었다
(`primaryButtonClass`, `ghostLinkClass`, `linkClassName`). 그 정의를 고쳐라 — 사용처마다 붙이지 마라.

`inline-block`으로 돼 있던 것은 `inline-flex`로 바꾼다. 나머지 클래스는 그대로 둔다.

## 테스트

각 페이지 테스트 파일에, 위 표의 요소가 `min-h-[44px]`를 가지는지 확인하는 테스트를 추가한다.
`Layout.test.tsx`에는 로고와 내비 링크 두 개를 확인하는 테스트를 넣는다.
기존 테스트 파일에 덧붙여라. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

**jsdom은 레이아웃을 계산하지 않으므로 실제 높이는 잴 수 없다.** 클래스 존재만 확인한다.
`getBoundingClientRect`를 모킹해 높이를 검증하는 테스트를 만들지 마라. 아무것도 증명하지 못한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 표의 7개 요소가 전부 `min-h-[44px]`를 가지는가?
   - 건드리면 안 되는 3개(주제 카드·보기 버튼·복습 개념 항목)를 그대로 두었는가?
   - `py-*` 값을 바꿔서 높이를 맞추지 않았는가?
   - step 0에서 추가한 `break-anywhere`가 그대로 남아 있는가?
3. 결과에 따라 `phases/3-mobile/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 표에 없는 요소의 크기를 바꾸지 마라. 이유: 실측으로 이미 충분한 것들이다.
- 여백·글자 크기·헤더 레이아웃에 브레이크포인트를 추가하지 마라. 이유: 이번 phase 범위 밖이다.
- 햄버거 메뉴·하단 탭바·드로어를 만들지 마라. 이유: 요청받지 않았다. 내비 항목은 두 개뿐이라 필요 없다.
- 색·테두리·hover 효과를 바꾸지 마라. 이유: 이 step은 크기만 다룬다.
- 기존 테스트를 깨뜨리지 마라.
