# Step 1: title-row-height

## 배경 — step 0이 만든 12px 점프

step 0에서 확인 문제 제목 줄에 이전 문항 화살표를 넣었다. 첫 문항에서는 렌더하지 않으므로
**그 줄의 높이가 문항 1과 문항 2에서 다르다.** 화살표가 `min-h-[44px]`를 가지기 때문이다.

`390×844`에서 실제 앱을 클릭해 실측한 값이다.

| 문항 | 제목 줄 높이 | 문제문 y | 첫 보기 y |
|---|---|---|---|
| 1번 (화살표 없음) | 32 | 153 | 241 |
| 2번 (화살표 있음) | 44 | 165 | **253 — 12px 밀림** |
| 3번 이후 | 44 | 165 | 253 |

1번에서 2번으로 넘어가는 순간 본문 전체가 12px 아래로 밀린다. 3번 이후로는 안정적이다.

12px은 작아 보이지만, 넘어가는 조작이 **정답 보기 재탭**이라 그 순간 손가락은 이미 보기
버튼 위에 있다. 그 자리를 유지하는 것이 재탭 방식을 고른 이유다(UI_GUIDE "보기 버튼" 절).
주제 20개마다 매번 한 번씩 일어난다.

## 결정된 동작

**제목 줄의 최소 높이를 44px로 고정한다.** 화살표가 있든 없든 줄 높이가 44px이므로
문항 1·2·3의 좌표가 모두 44 / 165 / 253으로 같아진다.

**첫 문항에서 화살표를 렌더하지 않는 규칙은 그대로다.** 비활성 화살표나 투명 스페이서를
넣어 자리를 채우는 것이 아니다 — 줄 자체의 높이를 고정하는 것이다.

## 읽어야 할 파일

- `/docs/UI_GUIDE.md` — **"보기 버튼 (확인 문제) > 문항 사이 이동" 절**에 위 표와 규칙이
  이미 반영돼 있다. 그대로 따르라. "터치 영역" 절도 읽어라.
- `src/pages/QuizPage.tsx` — 이 step에서 고치는 **유일한 파일**이다. 고치는 줄은 **하나**다.
- `src/pages/QuizPage.test.tsx` — 테스트 하나를 덧붙인다.

## 작업

`src/pages/QuizPage.tsx`의 제목 줄 `div` **한 줄만** 고친다.

```
지금:  <div className="flex items-center justify-between gap-3">
바꿔:  같은 div에 min-h-[44px]를 더한다
```

Tailwind 클래스 순서는 기존 파일의 관례를 따른다(`flex` 뒤, `items-center` 앞).

**이것이 이 step의 변경 전부다.** 다른 줄을 건드리지 마라.

### 핵심 규칙 — 벗어나지 마라

- **`h-[44px]`나 `height`로 고정하지 마라.** `min-h-`여야 한다. 이유: 글꼴 크기가 커지거나
  제목이 두 줄이 되는 환경에서 잘려서는 안 된다.
- **첫 문항에 비활성 화살표·투명 스페이서·`invisible` 요소를 넣지 마라.** step 0에서
  "렌더하지 않는다"로 정해진 것이고, 이 step은 그 결정을 뒤집는 것이 아니다.
  높이 문제는 줄 자체에서 푼다.
- **화살표 버튼의 `min-h-[44px]`(= `ghostLinkClass`)를 빼서 높이를 맞추려 하지 마라.**
  44px은 터치 영역 최소치다. UI_GUIDE "터치 영역" 절.
- **`justify-between`·`gap-3`·`items-center`를 그대로 둬라.** 가로 배치는 이미 맞다.
- `header`의 `space-y-3`, `h1`·`span`의 클래스를 건드리지 마라.

## 테스트

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

`src/pages/QuizPage.test.tsx`에 **테스트 하나**를 덧붙인다.

### 추가할 테스트

**제목 줄이 화살표 유무와 무관하게 최소 높이 클래스를 가진다.**

`h1`(`확인 문제`)의 부모 요소가 `min-h-[44px]`를 가지는지 확인한다. 첫 문항과
두 번째 문항 **양쪽에서** 확인해야 의미가 있다. 한 `it` 안에서 둘 다 검사해도 되고
`it` 둘로 나눠도 된다.

요소를 잡을 때는 `screen.getByRole('heading', { name: '확인 문제' }).parentElement`를 쓴다.
`container.querySelector`로 `div`를 찾아 내려가지 마라.

### 하지 마라

- **높이를 픽셀로 검증하려 하지 마라.** jsdom은 레이아웃을 계산하지 않고 Tailwind CSS도
  로드되지 않는다. `getBoundingClientRect()`는 전부 0을 돌려준다. 클래스 존재만 확인한다.
- 기존 테스트 25개는 **하나도 고칠 필요가 없다.** 전부 그대로 통과해야 한다.
  고쳐야 할 것 같으면 구현이 잘못된 것이다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래를 그대로 실행해 결과를 확인한다.

```bash
grep -c 'min-h-\[44px\]' src/pages/QuizPage.tsx               # 4 (기존 3 + 제목 줄 1)
grep -c 'justify-between' src/pages/QuizPage.tsx              # 1
grep -c 'items-center' src/pages/QuizPage.tsx                  # 5
grep -c '<button' src/pages/QuizPage.tsx                       # 2
grep -c 'aria-label="이전 문제"' src/pages/QuizPage.tsx        # 1
grep -nE 'invisible|opacity-0|h-\[44px\]|sticky|fixed|useEffect' src/pages/QuizPage.tsx   # 결과 없음
git diff --name-only                                           # 아래 세 개뿐
```

`git diff --name-only`에 나와야 하는 파일:

```
phases/11-previous-question/index.json
src/pages/QuizPage.test.tsx
src/pages/QuizPage.tsx
```

3. 체크리스트:
   - `git diff src/pages/QuizPage.tsx`를 읽어라. **바뀐 줄이 하나인가?**
     둘 이상이면 되돌려라.
   - `git diff src/lib/ src/types/ src/hooks/ src/components/ src/data/ docs/`가
     **비어 있는가?** 비어 있지 않으면 되돌려라.
4. 결과에 따라 `phases/11-previous-question/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **step 0에서 만든 것을 되돌리지 마라.** 이전 문항 화살표, `selections` 배열,
  파생 `correctCount`는 그대로 둔다. 이 step은 높이 한 줄만 고친다.
- **레이아웃을 "개선"하지 마라.** 제목 줄의 여백·정렬·글꼴을 조정하지 마라.
  요청받은 것은 최소 높이 하나다.
- **`docs/`를 수정하지 마라.** 이미 갱신돼 있다.
- `src/lib/`·`src/data/`·`src/types/`·`src/hooks/`·`src/components/`를 건드리지 마라.
- `App.tsx`의 라우트 구조, `HashRouter`, `vite.config.ts`의 `base`를 건드리지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
