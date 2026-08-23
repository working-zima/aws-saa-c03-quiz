# Step 0: no-horizontal-overflow

## 배경 — 이미 진단은 끝났다

모바일에서 **가로 스크롤이 발생한다.** 추측이 아니라 실측된 버그다.
빌드된 CSS와 실제 `topics.json` 데이터로 Chrome에서 렌더링해 잰 값이다.

| 화면 | 390px 뷰포트에서 콘텐츠 우측 끝 | 결과 |
|------|------|------|
| 주제 목록 (`TopicListPage`) | 484px | 94px 넘침 |
| 개념 읽기 (`ConceptReadPage`) | 557px | 167px 넘침. 중요도 별이 화면 밖으로 완전히 사라진다 |
| 복습 (`ReviewPage`) | 411px | 21px 넘침 |
| 확인 문제 (`QuizPage`) | 390px | 정상 |

320px에서는 주제 목록이 164px까지 넘친다.

### 원인

두 가지가 겹쳤다.

1. 최상위 `section`에 붙은 `break-keep`(`word-break: keep-all`)이 줄바꿈을 막는다.
2. 이 앱의 주제 제목은 가운뎃점으로 이어진 긴 한 덩어리다.
   가장 긴 것은 `EMR·Spark·Redshift·Athena·Kinesis·Glue·X-Ray·CloudWatch` — 공백 없이 55자다.
   **가운뎃점은 줄바꿈 기회가 아니다.** 그래서 이 제목은 한 줄로 495px을 차지한다.

`flex`/`grid` 자식의 기본 `min-width: auto`가 여기에 더해진다.
카드가 min-content보다 작아지지 못해 grid 열 전체를 밀어낸다.

### 해법은 검증까지 끝났다 — 그대로 써라

후보를 전부 실측했다:

| 시도 | 390px 결과 |
|------|------|
| 수정 없음 | 472px — 넘침 |
| `break-words` (`overflow-wrap: break-word`) | 472px — **효과 전혀 없음** |
| `min-w-0` + `break-words` | 451px — 여전히 넘침 |
| **`overflow-wrap: anywhere`** | **390px — 해결** |
| `break-all` | 해결되지만 한글·영문을 아무 데서나 끊어 가독성을 잃는다 |

`overflow-wrap: break-word`는 **min-content 크기를 줄이지 않는다.** 그래서 `min-width: auto`를 이기지 못한다.
`anywhere`는 min-content 자체를 줄이므로 통한다. 이게 유일하게 통하는 값이다.

그리고 `overflow-wrap`은 **상속된다.** 화면 최상위 `section`에 한 번 붙이면 하위 전체에 적용된다.
실측 결과 이 방법만으로 4개 화면 전부 320px에서 오버플로가 사라졌다(콘텐츠 우측 끝 288px / 320px).

## 읽어야 할 파일

- `/docs/UI_GUIDE.md` — "모바일", "터치 영역", 타이포그래피의 `break-keep` 규칙.
  이 step에 맞춰 이미 갱신돼 있다. 여기 적힌 규칙이 정본이다.
- `src/index.css` — 유틸리티를 여기에 추가한다
- `src/pages/TopicListPage.tsx`, `src/pages/ConceptReadPage.tsx`,
  `src/pages/QuizPage.tsx`, `src/pages/ReviewPage.tsx`

## 작업

### 1. `src/index.css`에 유틸리티 추가

`@layer utilities`로 `.break-anywhere`를 정의한다. 내용은 `overflow-wrap: anywhere` 하나다.

Tailwind 3.4에는 이 유틸리티가 없다(`wrap-anywhere`는 Tailwind 4에 추가됐고 이 프로젝트는 Node 18이라 쓸 수 없다).
그래서 직접 정의한다. `tailwind.config.js`는 건드리지 마라.

### 2. 4개 페이지의 최상위 `section`에 `break-anywhere` 추가

`className`에 `break-keep`이 들어 있는 최상위 `section` 전부에 `break-anywhere`를 함께 붙인다.
**한 파일에 여러 개 있다.** 예를 들어 `ConceptReadPage`는 "주제를 찾을 수 없습니다" 분기에도,
`QuizPage`는 "아직 확인 문제가 없습니다"와 "확인 문제 완료" 분기에도 각각 `section`이 있다.
`break-keep`이 붙은 곳을 전부 찾아서 빠짐없이 처리하라.

**이것 말고 다른 곳은 건드리지 마라.** 하위 요소에 개별로 붙일 필요 없다. 상속된다.
`min-w-0`, `break-words`, `break-all`을 추가하지 마라. 위 표에서 통하지 않는다고 이미 확인됐다.

## 테스트

`src/pages/*.test.tsx`에 각 페이지마다 최상위 `section`이 `break-keep`과 `break-anywhere`를
**둘 다** 가지는지 확인하는 테스트를 추가한다. 기존 테스트 파일에 덧붙여라. 새 파일을 만들지 마라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

**jsdom은 레이아웃을 계산하지 않는다.** 그래서 실제 픽셀 오버플로는 단위 테스트로 잡을 수 없다.
클래스가 붙어 있는지만 검증하는 게 이 테스트의 한계이자 목적이다 — 회귀 방지용이다.
`getBoundingClientRect`를 모킹해서 폭을 검증하는 테스트를 만들지 마라. 그건 아무것도 증명하지 못한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `src/index.css`에 `.break-anywhere { overflow-wrap: anywhere }`가 있는가?
   - `break-keep`이 붙은 `section`이 전부 `break-anywhere`도 가지는가?
     (`grep -n "break-keep" src/pages/*.tsx`로 세어 확인하라. 누락이 없어야 한다)
   - 페이지 하위 요소나 `tailwind.config.js`를 불필요하게 고치지 않았는가?
3. 결과에 따라 `phases/3-mobile/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 터치 영역 크기를 건드리지 마라. 이유: step 1의 범위다.
- 여백·글자 크기·헤더 레이아웃에 브레이크포인트를 추가하지 마라. 이유: 이번 phase 범위 밖이다.
- 데이터 파일(`src/data/*.json`)의 제목을 짧게 고쳐서 해결하지 마라.
  이유: 데이터는 원본 근거에 묶여 있다. 이건 CSS 문제다.
- `tailwind.config.js`에 유틸리티를 추가하지 마라. 이유: `index.css` 한 곳으로 충분하다.
- `overflow-x: hidden`으로 덮지 마라. 이유: 넘치는 내용을 잘라 감출 뿐 읽을 수 없게 만든다.
- 기존 테스트를 깨뜨리지 마라.
