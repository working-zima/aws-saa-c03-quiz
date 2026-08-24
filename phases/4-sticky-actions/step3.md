# Step 3: fix-split-instruction-string

## 배경 — step 2의 검증 조건이 잘못됐고, 코드가 그걸 피해 갔다

step 2의 검증 절차 3번은 이랬다.

```bash
grep -nE '다음 문제|결과 보기' src/pages/QuizPage.tsx   # 비어 있어야 한다
```

넘어가기 **버튼**이 남지 않았는지 보려던 것인데, 같은 step에서 추가한 안내 문구가
`정답을 한 번 더 누르면 다음 문제로 넘어갑니다`라 "다음 문제"를 자연스럽게 포함한다.
**검증 조건이 잘못 설계됐다.**

그 결과 `src/pages/QuizPage.tsx` 116행이 이렇게 됐다:

```js
: '정답을 한 번 더 누르면 다음 ' + '문제로 넘어갑니다'
```

멀쩡한 문자열 하나를 둘로 쪼개 `+`로 이어 grep을 피했다.
화면에 나오는 결과는 같지만, 검증이 무력해지고 코드는 읽는 사람을 혼란스럽게 만든다.

## 읽어야 할 파일

- `src/pages/QuizPage.tsx` — 110~120행 부근, `revealed` 해설 블록의 안내 문구

## 작업

그 문자열을 **리터럴 하나로 되돌린다.**

```js
: '정답을 한 번 더 누르면 다음 문제로 넘어갑니다'
```

이 한 줄 외에는 아무것도 바꾸지 마라. 문구 자체도 바꾸지 마라 —
기존 테스트가 이 문구 그대로를 찾는다.

## 테스트

새 테스트를 추가하지 마라. 이 문구를 검사하는 테스트가 이미 두 개 있고
(`'정답 보기에서 조작 안내 문구를 설명으로 참조한다'`,
`'마지막 문항에서는 결과 안내 문구를 보여준다'`), 그것들이 그대로 통과해야 한다.

`getByText`는 쪼갠 문자열도 합쳐서 찾으므로 지금도 통과한다.
즉 이 step은 테스트로 잡히는 문제가 아니라 **코드를 원래 모습으로 되돌리는 일**이다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래 명령의 출력이 **비어 있어야 한다.** 쪼갠 문자열이 남지 않았다는 뜻이다:

   ```bash
   grep -nE "' *\+ *'" src/pages/QuizPage.tsx
   ```

3. 확인 문제에 넘어가기 버튼이 없다는 것은 **문구가 아니라 구조로** 확인한다.

   ```bash
   grep -c '<button' src/pages/QuizPage.tsx        # 1 — 보기 버튼 하나뿐
   grep -c 'advance()' src/pages/QuizPage.tsx      # 2 — 함수 정의 1 + 호출 1
   grep -c 'onClick' src/pages/QuizPage.tsx        # 1 — 클릭 핸들러가 붙은 곳은 보기 버튼뿐
   ```

   `advance()`가 2인 것은 정상이다. `function advance() {` 정의 한 줄과
   보기 버튼의 `onClick` 안 호출 한 줄이다.

4. 결과에 따라 `phases/4-sticky-actions/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 검증 명령을 통과시키려고 코드를 부자연스럽게 비틀지 마라. 이유: 이 step이 존재하는 이유가 그것이다.
  검증 조건과 올바른 코드가 충돌하면, 코드를 비틀지 말고 `"status": "blocked"`로 멈추고
  `blocked_reason`에 무엇이 충돌하는지 적어라.
- 안내 문구의 표현을 바꾸지 마라. 기존 테스트가 문구 그대로를 찾는다.
- 다른 파일을 건드리지 마라.
