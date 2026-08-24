# Step 0: remove-redundant-topic-list-link

## 배경

확인 문제를 끝까지 풀면 완료 화면에 이동 링크가 세 개 나온다.

```
틀린 개념 복습하기  |  개념으로 돌아가기  |  주제 목록으로 돌아가기
```

세 번째 `주제 목록으로 돌아가기`는 `/`로 간다. 그런데 `src/components/Layout.tsx`의 헤더에
같은 곳으로 가는 `주제 목록` NavLink가 **모든 화면에 항상 떠 있다.** 중복이다.

## 읽어야 할 파일

- `src/pages/QuizPage.tsx` — `if (complete)` 분기
- `src/components/Layout.tsx` — 헤더에 이미 있는 `주제 목록` NavLink 확인용
- `src/pages/QuizPage.test.tsx` — `'마지막 문제를 푼 뒤 맞힌 개수를 표시한다'` 테스트

## 작업

`QuizPage.tsx`의 **완료 분기**(`if (complete)`) 안 `nav` 요소에서
`주제 목록으로 돌아가기` `Link` **한 줄만** 지운다.

남는 것: `틀린 개념 복습하기`(오답이 있을 때만), `개념으로 돌아가기`.

주의 — 같은 파일의 **빈 상태 분기**(`topicQuestions.length === 0`)에도
`주제 목록으로 돌아가기` 링크가 있다. **그건 그대로 둔다.** 이유: 그 분기는 `topicId`조차 없어
개념으로 돌아갈 수도 없는 화면이라 그 링크가 유일한 다음 행동이다.

`ConceptReadPage.tsx`의 `주제 목록으로 돌아가기`(주제를 못 찾은 에러 분기)와
`ReviewPage.tsx`의 `주제 목록으로 가기`(빈 상태)도 같은 이유로 건드리지 않는다.

`ghostLinkClass` 상수는 `개념으로 돌아가기`가 계속 쓰므로 지우지 마라.

## 테스트

`src/pages/QuizPage.test.tsx`의 `'마지막 문제를 푼 뒤 맞힌 개수를 표시한다'` 테스트에
단언 두 줄을 **추가**한다. 새 테스트 케이스를 만들지 마라 — 완료 화면까지 가는 절차가
이 테스트에 이미 있다.

- `screen.queryByRole('link', { name: '주제 목록으로 돌아가기' })`가 `null`이다
- `개념으로 돌아가기` 링크는 그대로 있다

TDD로 진행하라: 단언을 먼저 추가하고, 실패를 확인한 뒤, 구현한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래 명령의 출력이 **정확히 2줄**이어야 한다. 빈 상태 분기(QuizPage)와
   에러 분기(ConceptReadPage)의 링크만 남았다는 뜻이다:

   ```bash
   grep -n '주제 목록으로 돌아가기' src/pages/*.tsx | grep -v test
   ```

3. 결과에 따라 `phases/4-sticky-actions/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 링크 한 줄 외에 아무것도 바꾸지 마라. `nav`의 `aria-label`·`className`·완료 화면 문구를 손대지 마라.
- 빈 상태·에러 분기의 유사 링크를 지우지 마라. 이유: 위에 적었다.
- 헤더(`Layout.tsx`)를 건드리지 마라. 이유: 이 step은 중복된 쪽을 지우는 것이지 헤더를 바꾸는 게 아니다.
- 기존 테스트를 깨뜨리지 마라.
