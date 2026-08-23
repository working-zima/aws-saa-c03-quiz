# Step 1: content-types

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` — "데이터 모델" 절에 타입 정의가 그대로 적혀 있다
- `/docs/ADR.md` — ADR-005(4지선다 단일정답), ADR-006(원본이 유일한 출처)
- `/CLAUDE.md` — 타입 단일 출처 규칙
- 이전 step 산출물: `package.json`, `vite.config.ts`, `src/App.tsx`

## 작업

학습 데이터의 타입을 정의하고, 데이터 파일이 그 타입을 실제로 지키는지 검사하는 테스트를 만든다.
**데이터 자체는 이 step에서 만들지 않는다.** 빈 배열로 시작한다.

### 1. `src/types/content.ts`

`ARCHITECTURE.md`의 "데이터 모델" 절에 적힌 `Importance`, `Topic`, `Concept`, `Question`을
그대로 정의한다. 필드를 추가하거나 이름을 바꾸지 마라. 문서와 코드가 어긋나면 안 된다.

`choices`는 길이 4 튜플, `answerIndex`는 `0 | 1 | 2 | 3`이다. 배열과 number로 느슨하게 두지 마라.
이유: 보기 개수와 정답 범위를 타입으로 못 박는 게 ADR-005의 핵심이다.

### 2. `src/types/progress.ts`

`ARCHITECTURE.md`의 `Progress` 인터페이스를 정의한다.

### 3. `src/data/topics.json`, `src/data/questions.json`

둘 다 빈 배열 `[]`로 만든다. 데이터는 step 2, 7, 10~13에서 채운다.

### 4. `src/data/index.ts`

JSON을 import해 타입이 붙은 상수로 내보낸다.

```ts
export const topics: Topic[]
export const questions: Question[]
```

`resolveJsonModule`을 켜고, import한 JSON에 타입 단언을 붙인다.
컴포넌트가 JSON을 직접 import하지 않게 하는 게 목적이다.

### 5. `src/data/data.test.ts` — 스키마 검증 테스트

데이터가 채워질 때마다 이 테스트가 무결성을 잡아준다. 아래를 전부 검사하라:

- `topics[].id`가 유일하다
- `topics[].importance`가 `3` 또는 `2` 또는 `0`이다
- 모든 `Concept.id`가 전역에서 유일하다
- `questions[].id`가 유일하다
- 모든 `questions[].topicId`가 실재하는 topic을 가리킨다
- 모든 `questions[].conceptId`가 실재하는 concept을 가리킨다
- `questions[].choices`의 길이가 4이고, 4개가 서로 다르다
- `questions[].answerIndex`가 0~3 범위다
- `questions[].explanation`이 빈 문자열이 아니다

지금은 데이터가 비어 있어 전부 자명하게 통과한다. 그래도 테스트를 지금 만들어야 한다.
이유: 데이터를 채우는 step에서 이 테스트가 유일한 안전망이다.

`ARCHITECTURE.md`에 `Importance = 3 | 2`로 적혀 있지만, 원본에 별점이 없는 기초 주제 3개가 있다.
`Importance`에 `0`을 추가하고 "별점 없음(기초)"이라는 주석을 달아라.
그리고 `docs/ARCHITECTURE.md`의 타입 정의도 같이 고쳐라. 문서와 코드는 일치해야 한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 타입이 `src/types/`에만 정의됐는가? 컴포넌트에 중복 정의가 없는가?
   - `docs/ARCHITECTURE.md`의 타입 정의와 코드가 일치하는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 학습 데이터를 채우지 마라. 이 step은 빈 배열까지다. 이유: 데이터 생성은 별도 step으로 나눠 놨다.
- UI 컴포넌트를 만들지 마라. 이유: step 4부터다.
- zod 같은 런타임 스키마 라이브러리를 설치하지 마라.
  이유: 데이터가 빌드 타임 고정이라 런타임 검증이 필요 없다. 테스트에서 검사하면 충분하다.
- 타입을 `any`로 우회하지 마라.
- 기존 테스트를 깨뜨리지 마라.
