# Step 0: adjacent-topics-lib

## 배경

**주제 목록을 거치지 않고는 앞뒤 주제로 넘어갈 수 없다.** 개념 읽기 화면의 출구는
하단 바의 `확인 문제 풀기` 하나뿐이고, 확인 문제를 다 풀고 나면 `틀린 개념 복습하기`와
`개념으로 돌아가기`뿐이다. 20개 주제를 순서대로 읽으려면 매번 `/` 로 돌아가야 한다.

이 phase는 그 이동 수단을 두 화면에 붙인다. 이 step은 그중 **계산 로직만** 만든다.
화면은 건드리지 않는다.

주제 순서는 `topics.json`의 배열 순서다. `Topic`에 `order`·`prevId`·`nextId` 같은 필드가
없고, 앞으로도 두지 않는다. 배열에서 유도되는 값이라 데이터에 중복 저장하면 순서를 바꿀 때
두 곳을 고쳐야 한다. 근거는 ARCHITECTURE.md "라우트 > 주제 간 이동" 절이다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` — **"라우트 > 주제 간 이동" 절**에 이 phase의 규칙이 이미
  반영돼 있다. 그대로 따르라. "디렉토리 구조"·"데이터 모델" 절도 읽어라.
- `/CLAUDE.md` — "아키텍처 규칙"의 `src/lib/` 항목
- `src/lib/stats.ts` — 이 파일이 `src/lib/`의 작성 관례다. 순수 함수, `Topic` import,
  React 의존 없음. 같은 모양으로 쓴다.
- `src/lib/stats.test.ts` — 테스트 관례
- `src/types/content.ts` — `Topic` 타입. **이 파일을 수정하지 마라.**

## 작업

**새 파일 `src/lib/navigation.ts` 하나만 만든다.** 다른 파일을 건드리지 마라.

```ts
export interface AdjacentTopics {
  prev: Topic | null
  next: Topic | null
}

export function adjacentTopics(topics: Topic[], topicId: string | undefined): AdjacentTopics
```

동작:

| 입력 | `prev` | `next` |
|---|---|---|
| 배열 가운데 주제의 id | 앞 주제 | 뒤 주제 |
| 첫 주제의 id | `null` | 두 번째 주제 |
| 마지막 주제의 id | 마지막 직전 주제 | `null` |
| 배열에 없는 id | `null` | `null` |
| `undefined` | `null` | `null` |
| 주제가 하나뿐인 배열의 그 id | `null` | `null` |
| 빈 배열 | `null` | `null` |

핵심 규칙 — 벗어나지 마라:

- **두 번째 인자 타입은 `string | undefined`다.** 이유: 호출하는 쪽이 `useParams()`이고
  그 반환 타입이 `string | undefined`다. 화면에서 `topicId!`로 단언하게 만들지 마라.
- **찾지 못한 id를 에러로 만들지 마라.** `throw`하지 말고 `{ prev: null, next: null }`을
  돌려준다. 이유: 잘못된 URL은 이미 화면 쪽에서 "주제를 찾을 수 없습니다"로 처리한다.
- **순환시키지 마라.** 마지막 주제의 `next`가 첫 주제가 되면 안 된다. 근거는
  ARCHITECTURE.md "주제 간 이동" 절이다.
- **`null`을 쓴다.** `undefined`가 아니다. 반환 타입에 그렇게 적혀 있다.
- 정렬하지 마라. 배열 순서를 그대로 쓴다.
- **React를 import하지 마라.** 훅을 만들지 마라. 이 파일은 DOM 없이 테스트한다.
- `topics.json`을 이 파일에서 import하지 마라. 인자로 받는다. 이유: `src/lib/`의 다른
  파일들이 전부 그렇다(`stats.ts`를 봐라). 테스트에서 가짜 데이터를 주입할 수 있어야 한다.

## 테스트

**새 파일 `src/lib/navigation.test.ts`를 만든다.**

TDD로 진행하라: 테스트를 먼저 쓰고, 실패를 확인한 뒤, 구현한다.

`@testing-library/react`를 import하지 마라. `render`도 `MemoryRouter`도 필요 없다.
`src/lib/stats.test.ts`처럼 함수만 직접 호출한다.

가짜 주제 3개짜리 배열을 하나 만들어 재사용하라. `Topic` 타입을 만족해야 하므로
`sourcePages`와 `concepts`도 채워야 한다. `concepts`는 빈 배열이어도 된다.

위 동작 표의 **일곱 행을 전부** 검사한다. 반환된 객체를 `toEqual`로 통째로 비교하지 말고
`result.prev?.id`·`result.next` 처럼 필요한 값만 확인하라 — 통째 비교는 `Topic` 내용을
바꿀 때마다 무관한 테스트가 깨진다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아래 grep을 그대로 실행해 결과를 확인한다.

```bash
grep -c 'export function adjacentTopics' src/lib/navigation.ts     # 1
grep -c 'export' src/lib/navigation.ts                             # 2 (interface + function)
grep -nE "from 'react'|useState|useEffect|useParams" src/lib/navigation.ts   # 결과 없음
grep -nE "topics.json|'../data'" src/lib/navigation.ts             # 결과 없음
grep -c 'sort' src/lib/navigation.ts                               # 0
grep -c 'throw' src/lib/navigation.ts                              # 0
grep -c "it(" src/lib/navigation.test.ts                           # 7 이상
git diff --name-only; git status --short                           # navigation.ts, navigation.test.ts, index.json 뿐
```

3. 체크리스트:
   - 마지막 주제의 `next`가 `null`인가? 첫 주제로 돌아가면 안 된다.
   - 빈 배열과 `undefined`에서 던지지 않고 `null` 두 개를 돌려주는가?
   - `src/pages/`·`src/components/` 아래 파일이 하나도 바뀌지 않았는가?
4. 결과에 따라 `phases/9-topic-navigation/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **화면 파일을 건드리지 마라.** `src/pages/`·`src/components/` 아래 어떤 파일도 이 step의
  대상이 아니다. 버튼은 step 1과 step 2에서 붙인다.
- **`src/types/content.ts`를 수정하지 마라.** `Topic`에 필드를 추가하지 마라.
  이유: ARCHITECTURE.md "주제 간 이동" 절이 금지한다.
- **`src/data/topics.json`을 수정하지 마라.** 순서를 바꾸지 마라.
- 훅(`useAdjacentTopics`)이나 컨텍스트를 만들지 마라. 이유: `src/lib/`는 React에 의존하지
  않는 계층이다. CLAUDE.md "아키텍처 규칙"을 봐라.
- 함수를 더 만들지 마라. `adjacentTopics` 하나면 된다. `firstTopic`·`lastTopic`·
  `topicIndex` 같은 것을 미리 만들지 마라 — 쓰는 곳이 없다.
- 기존 테스트를 깨뜨리지 마라.
- **검증 grep과 올바른 코드가 충돌하면 코드를 비틀어 통과시키지 마라.** 문자열을 쪼개거나
  변수로 우회하지 말고 `"status": "blocked"`로 멈추고 사유를 적어라.
