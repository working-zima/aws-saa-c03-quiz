# Step 2: touch-targets-empty-states

## 배경 — step 1 명세의 누락을 메운다

step 1의 표는 정상 경로 화면을 실측해서 만들었다. 그래서 **빈 상태·에러 분기에서만 렌더되는
링크 두 개가 표에서 빠졌다.** step 1은 명세대로 정확히 수행됐다. 빠뜨린 쪽은 명세다.

남은 두 곳:

| 파일 | 위치 | 요소 | 언제 보이나 |
|------|------|------|------|
| `src/pages/ConceptReadPage.tsx` | 34행 부근 | `주제 목록으로 돌아가기` | 없는 주제 id로 들어왔을 때 |
| `src/pages/ReviewPage.tsx` | 46행 부근 | `주제 목록으로 가기` | 확인 문제를 아직 하나도 안 풀었을 때 |

둘 다 `inline-block rounded-md px-4 py-2`에 `text-base`라 높이가 40px이다.
`UI_GUIDE.md`의 버튼 스펙(Primary·Ghost 모두 `inline-flex items-center min-h-[44px]`)과 어긋난 채 남아 있다.

`ConceptReadPage` 쪽은 Primary(`bg-neutral-100 text-neutral-900`), `ReviewPage` 쪽은 Ghost(`text-neutral-400`)다.

## 읽어야 할 파일

- `/docs/UI_GUIDE.md` — "터치 영역" 절과 "버튼" 컴포넌트 스펙
- `src/pages/ConceptReadPage.tsx`, `src/pages/ReviewPage.tsx`
- step 1이 같은 문제를 어떻게 고쳤는지 보라: `src/pages/QuizPage.tsx`의
  `primaryButtonClass` / `ghostLinkClass` 정의. **그 방식과 똑같이 맞춰라.**

## 작업

위 표의 **두 요소에만** `inline-flex items-center min-h-[44px]`를 추가하고,
`inline-block`은 `inline-flex`로 바꾼다. 나머지 클래스는 그대로 둔다.

`py-*`를 키워서 높이를 맞추지 마라. 이유는 step 1과 같다 — 글자 크기가 바뀌면 조용히 44px 아래로 내려간다.

두 파일 각각에서 이 링크는 한 번씩만 쓰인다. **클래스 상수로 뽑지 마라.** 한 번 쓰는 값에 이름을 붙일 이유가 없다.

## 테스트

`ConceptReadPage.test.tsx`와 `ReviewPage.test.tsx`에 각각 테스트를 추가한다.

- `ConceptReadPage`: 존재하지 않는 `topicId`로 렌더했을 때 `주제 목록으로 돌아가기` 링크가
  `min-h-[44px]`를 가진다
- `ReviewPage`: 아무 문제도 풀지 않은 `progress`로 렌더했을 때 `주제 목록으로 가기` 링크가
  `min-h-[44px]`를 가진다

**이 두 분기를 렌더하는 방법은 기존 테스트 파일에 이미 있다.** 새로 고안하지 말고 그 방식을 재사용하라.

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.
jsdom은 레이아웃을 계산하지 않으므로 클래스 존재만 확인한다. `getBoundingClientRect`를 모킹하지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래 명령의 출력이 **비어 있어야 한다.** 44px이 빠진 인터랙티브 요소가 하나도 남지 않았다는 뜻이다:

   ```bash
   grep -nE 'className="[^"]*(px-4 py-2|inline-block)[^"]*"' src/pages/*.tsx src/components/*.tsx \
     | grep -v test | grep -v 'min-h-\[44px\]'
   ```

3. step 0의 `break-anywhere`와 step 1의 `min-h-[44px]`가 그대로 남아 있는가?
4. 결과에 따라 `phases/3-mobile/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 표의 두 요소 외에는 아무것도 바꾸지 마라. 이유: 나머지는 step 0·1에서 이미 처리했고 실측으로 확인됐다.
- 빈 상태 문구·레이아웃·색을 손보지 마라. 이유: 이 step은 터치 영역 크기만 다룬다.
- 클래스 상수를 새로 만들지 마라. 이유: 각 파일에서 한 번씩만 쓰인다.
- 기존 테스트를 깨뜨리지 마라.
