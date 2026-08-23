# Step 9: review-page

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` — 핵심 기능 4(복습). **"시험 오답노트가 아니라 아직 안 익은 개념 목록"이다.**
- `/docs/UI_GUIDE.md` — 카드·타이포그래피
- 이전 step 산출물: `src/pages/ReviewPage.tsx`(자리표시자), `src/pages/TopicListPage.tsx`,
  `src/lib/stats.ts`(`conceptsToReview`), `src/hooks/useProgress.ts`, `src/data/index.ts`

`src/lib/stats.ts`의 `conceptsToReview` 시그니처를 확인하고 그대로 쓴다.
"어떤 개념이 복습 대상인가"를 컴포넌트에서 다시 계산하지 마라.

## 작업

`src/pages/ReviewPage.tsx`를 구현한다. **이 step으로 앱이 완성된다.**

### 보여줄 것

`conceptsToReview`가 돌려준 개념들을 **주제별로 묶어서** 보여준다.

각 개념 항목에:
- 개념 이름과 한 줄 요약
- 그 개념이 속한 주제로 가는 링크 (`/topic/{topicId}`)

주제 묶음마다 그 주제의 확인 문제를 다시 푸는 링크(`/topic/{topicId}/quiz`)를 둔다.

### 비어 있을 때

복습할 개념이 없는 경우는 두 가지고, **구분해서 안내해야 한다**:

- 아직 아무 문제도 안 풀었다 → "확인 문제를 풀면 여기에 복습할 개념이 모인다" + `/`로 가는 링크
- 다 풀었고 전부 맞혔다 → "복습할 개념이 없다" 취지의 문구

둘을 같은 문구로 뭉뚱그리지 마라. 사용자 입장에서 뜻이 완전히 다르다.

### UI 규칙

- 최대 너비 `max-w-3xl`
- 개념 항목은 카드보다 가벼운 목록 형태로. 주제별 묶음에만 구분선을 둔다
- 오답을 강조하는 빨간 배지를 남발하지 마라. 이 화면은 질책이 아니라 할 일 목록이다

### 테스트

`src/pages/ReviewPage.test.tsx`:

- 오답이 있는 개념이 주제별로 묶여 렌더된다
- 맞힌 문제의 개념은 목록에 없다
- 아직 안 푼 문제의 개념은 목록에 없다
- 아무것도 안 푼 상태와 전부 맞힌 상태의 안내 문구가 서로 다르다
- 개념 링크가 `#/topic/{topicId}`를 가리킨다

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

전체 화면이 동작하는지도 확인한다:
```bash
npm run build && echo BUILD_OK
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 복습 대상 판정을 `src/lib/stats.ts`에 위임했는가?
   - `localStorage`를 직접 부르지 않는가?
   - 빈 상태 두 가지를 구분했는가?
3. **이 step은 phase의 마지막 화면이다.** 아래를 추가로 확인하라:
   - 4개 라우트(`/`, `/topic/:id`, `/topic/:id/quiz`, `/review`)가 전부 실제 화면을 렌더하는가?
   - `src/pages/`에 자리표시자로 남은 파일이 없는가?
4. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 복습 대상을 다시 푸는 전용 퀴즈 모드를 만들지 마라. 이유: PRD에 없다.
  기존 `/topic/:id/quiz`로 보내면 충분하다.
- 간격 반복(SRS)·난이도 조정 같은 알고리즘을 넣지 마라. 이유: MVP 범위를 벗어난다.
- 진행 상태를 초기화하는 버튼을 만들지 마라. 이유: 요청받지 않았고, 실수로 누르면 복구가 안 된다.
- 데이터 파일을 수정하지 마라.
- 다른 페이지를 건드리지 마라.
- 기존 테스트를 깨뜨리지 마라.
