# Step 8: quiz-page

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` — 핵심 기능 3(확인 문제). 즉시 채점 + 해설 + 개념으로 돌아가는 링크.
- `/docs/UI_GUIDE.md` — **"보기 버튼" 절에 상태별 스타일이 정의돼 있다**
- `/docs/ADR.md` — ADR-005(4지선다 단일정답)
- 이전 step 산출물: `src/pages/QuizPage.tsx`(자리표시자), `src/pages/ConceptReadPage.tsx`,
  `src/hooks/useProgress.ts`, `src/lib/grading.ts`, `src/data/index.ts`, `src/data/questions.json`

`src/lib/grading.ts`의 `isCorrect` 시그니처를 확인하고 그대로 쓴다. 채점 로직을 컴포넌트에 다시 짜지 마라.

## 작업

`src/pages/QuizPage.tsx`를 구현한다. `topicId`에 속한 문제를 한 번에 하나씩 푼다.

### 흐름

1. 문제 하나를 보여준다. 진행 표시(`3 / 9`)를 함께 둔다.
2. 보기를 고르면 **즉시** 채점한다.
   - 고른 보기가 정답이면 정답 스타일, 틀렸으면 오답 스타일
   - 동시에 **정답 보기도 정답 스타일로 표시**한다. 뭐가 맞는지 보여주는 게 목적이다.
   - 해설을 펼친다
   - 해설 아래에 근거 개념으로 가는 링크를 둔다 (`/topic/{topicId}` — 해당 개념 위치로)
   - `useProgress`의 `answer(questionId, correct)`를 호출한다
3. 정답 공개 후에는 **모든 보기를 비활성화**한다. 다시 고를 수 없다.
4. "다음 문제" 버튼으로 넘어간다. 마지막 문제면 결과 화면을 보여준다.

### 결과 화면

- 맞힌 개수 / 전체
- 틀린 문제가 있으면 `/review`로 가는 링크
- `/topic/{topicId}`로 돌아가는 링크
- `/`로 가는 링크

점수·등급·합격 여부를 표시하지 마라. 시험이 아니라 개념 점검이다 (PRD).

### 문항이 없을 때

`questions.json`에 해당 주제 문제가 아직 없을 수 있다 (step 12, 13 전).
이때는 "아직 확인 문제가 없다"는 안내와 개념으로 돌아가는 링크를 보여준다.
**빈 화면이나 에러가 되면 안 된다.**

없는 `topicId`도 마찬가지로 안내 문구를 보여준다.

### UI 규칙 (UI_GUIDE)

- 최대 너비 `max-w-2xl`
- 보기 버튼은 UI_GUIDE의 기본/선택/정답/오답 스타일을 그대로 쓴다
- 해설 영역 fade-in(0.2s) **하나만** 허용된다. 다른 애니메이션을 넣지 마라.
- 정답에 초록, 오답에 빨강 외의 색을 쓰지 마라

### 접근성

보기는 `button` 요소로 만든다. `div`에 `onClick`을 달지 마라.
정답 공개 후 비활성화는 `disabled`로 처리한다.

### 테스트

`src/pages/QuizPage.test.tsx`:

- 첫 문제와 보기 4개가 렌더된다
- 정답을 고르면 해설이 보이고 진행 상태 기록이 호출된다
- 오답을 고르면 고른 보기와 정답 보기가 모두 표시된다
- 정답 공개 후 보기 버튼이 `disabled`가 된다
- 마지막 문제 후 결과 화면에 맞힌 개수가 나온다
- 문항이 0개인 주제에서 안내 문구가 나오고 앱이 죽지 않는다

`userEvent`로 클릭을 시뮬레이션하라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 채점을 `src/lib/grading.ts`에 위임했는가? 컴포넌트에 정답 비교 로직이 없는가?
   - `localStorage`를 직접 부르지 않는가?
   - 보기가 `button`이고 공개 후 `disabled`인가?
   - UI_GUIDE의 애니메이션 규칙(해설 fade-in 하나)을 지켰는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 타이머·제한시간을 만들지 마라. 이유: PRD의 MVP 제외 사항이다.
- 점수·등급·합격 판정을 표시하지 마라. 이유: 시험 시뮬레이터가 아니다.
- 문제를 랜덤으로 섞지 마라. 이유: 개념 순서대로 푸는 게 학습 흐름이다.
- 정답 공개 후 다시 고를 수 있게 두지 마라. 이유: 진행 기록이 의미를 잃는다.
- 데이터 파일을 수정하지 마라.
- 다른 페이지를 건드리지 마라.
- 기존 테스트를 깨뜨리지 마라.
