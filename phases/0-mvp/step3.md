# Step 3: progress-lib

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` — "상태 관리", "테스트 경계" 절
- `/docs/ADR.md` — ADR-003(localStorage만 쓴다. 실패해도 앱은 돌아야 한다)
- `/CLAUDE.md` — 순수 로직은 React에 의존하지 않는다는 규칙
- 이전 step 산출물: `src/types/content.ts`, `src/types/progress.ts`, `src/data/index.ts`, `src/data/topics.json`

## 작업

진행률·채점·저장소 접근을 `src/lib/`에 순수 함수로 만든다. **React를 import하지 마라.**
이 계층은 DOM 없이 테스트한다.

### 1. `src/lib/storage.ts`

localStorage에 직접 접근하는 **유일한** 파일이다.

```ts
export function loadProgress(): Progress
export function saveProgress(progress: Progress): void
```

- 저장 키는 `aws-quiz.progress` 하나만 쓴다.
- CRITICAL: 읽기·쓰기를 전부 try/catch로 감싸라. 시크릿 모드나 저장소 차단 환경에서
  `localStorage` 접근 자체가 예외를 던진다. ADR-003에 적힌 대로,
  **저장소가 없어도 앱은 정상 동작해야 한다.**
- 읽기 실패·JSON 파싱 실패·`version` 불일치는 전부 "빈 진행 상태"로 처리한다. 예외를 밖으로 던지지 마라.
- 쓰기 실패는 조용히 무시한다. 사용자에게 에러를 띄우지 마라.

### 2. `src/lib/progress.ts`

`Progress`를 갱신하는 순수 함수. **인자를 변형하지 말고 새 객체를 반환하라.**

```ts
export function emptyProgress(): Progress
export function markTopicRead(progress: Progress, topicId: string): Progress
export function recordAnswer(progress: Progress, questionId: string, correct: boolean): Progress
```

`recordAnswer`는 같은 문제를 다시 풀면 **마지막 결과로 덮어쓴다**. 이유: 복습은
"아직 안 익은 개념"을 보여주는 기능이라, 나중에 맞혔으면 목록에서 빠져야 한다.

### 3. `src/lib/grading.ts`

```ts
export function isCorrect(question: Question, choiceIndex: number): boolean
```

### 4. `src/lib/stats.ts`

```ts
export interface TopicStat {
  topicId: string;
  read: boolean;
  total: number;      // 이 주제의 문항 수
  answered: number;   // 푼 문항 수
  correct: number;    // 맞힌 문항 수
}

export function topicStats(topics: Topic[], questions: Question[], progress: Progress): TopicStat[]
export function overallPercent(stats: TopicStat[]): number
export function conceptsToReview(topics: Topic[], questions: Question[], progress: Progress): Concept[]
```

- `overallPercent`는 0~100 정수를 반환한다. 문항이 0개면 0을 반환한다. **0으로 나누지 마라.**
- `conceptsToReview`는 **마지막 시도가 오답인** 문제의 `conceptId`에 해당하는 concept을 중복 없이 반환한다.
  아직 안 푼 문제는 포함하지 않는다.

### 5. 테스트

`src/lib/*.test.ts`. jsdom 없이 도는 순수 단위 테스트로 쓴다.

최소한 아래를 덮어라:
- `loadProgress`가 저장소 예외·깨진 JSON·`version` 불일치에서 빈 상태를 반환한다
- `saveProgress`가 저장소 예외를 밖으로 던지지 않는다
- `recordAnswer`가 인자를 변형하지 않고, 재시도 시 마지막 결과로 덮어쓴다
- `overallPercent`가 문항 0개일 때 0을 반환한다
- `conceptsToReview`가 오답 개념만, 중복 없이 반환한다

저장소 테스트는 `localStorage`를 모킹해서 예외를 던지는 경우까지 확인하라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `src/lib/` 어디에도 `import React`가 없는가?
   - `localStorage`를 직접 부르는 곳이 `storage.ts` 하나뿐인가?
   - 진행 상태 갱신 함수가 인자를 변형하지 않는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `src/lib/`에서 React를 import하지 마라. 이유: 이 계층은 DOM 없이 테스트한다.
- 상태 관리 라이브러리(redux, zustand 등)를 설치하지 마라. 이유: ARCHITECTURE.md에서 배제했다.
- 저장소 실패 시 예외를 던지지 마라. 이유: 시크릿 모드에서 앱 전체가 죽는다.
- UI 컴포넌트를 만들지 마라. 이유: step 4부터다.
- 기존 테스트를 깨뜨리지 마라.
