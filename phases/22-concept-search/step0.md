# Step 0: search-lib

## 배경

이 앱에는 개념이 182개 있는데 주제 목록에는 주제 제목 20개만 보인다. 주제 제목은
`Aurora·DynamoDB·ElastiCache`처럼 **대표 서비스만 이어 붙인 것이라 나머지 개념은 제목에
아예 없다.** "Aurora가 어느 주제였더라"를 풀 방법이 지금은 없다. 검색 화면이 그 경로를 맡는다.

이 step은 **순수 로직만** 만든다. 화면은 step 1이, 헤더 진입 링크는 step 2가 만든다.

## 읽어야 할 파일

- `CLAUDE.md` — 아키텍처 규칙과 TDD 규칙.
- `docs/ARCHITECTURE.md` — "개념·주제 검색" 절(매칭 규칙 표가 여기 있다), "테스트 경계" 절.
- `docs/ADR.md`의 **ADR-013**.
- `src/types/content.ts` — `Topic`·`Concept` 타입. **여기 있는 타입을 쓰고 새로 만들지 마라.**
- `src/lib/navigation.ts` + `src/lib/navigation.test.ts` — 같은 계층의 선례다.
  데이터를 인자로 받고 React를 import하지 않는 형태를 그대로 따른다.
- `src/data/index.ts` — 실데이터를 import하는 방법.

## 작업

`src/lib/search.ts`를 새로 만든다. CLAUDE.md의 TDD 규칙에 따라 **`src/lib/search.test.ts`를
먼저 쓰고 실패를 확인한 뒤** 구현한다.

### 시그니처

```ts
import type { Concept, Topic } from '../types/content'

export type SearchHit =
  | { kind: 'topic'; topic: Topic }
  | { kind: 'concept'; topic: Topic; concept: Concept }

export function searchContent(topics: Topic[], query: string): SearchHit[]
```

내부 구현은 재량이다. 아래 규칙만 지켜라.

### 매칭 규칙

1. **질의 토큰화** — 질의를 공백으로 쪼개고 빈 토큰을 버린다. 남은 토큰이 하나도 없으면
   빈 배열을 돌려준다(공백만 입력한 경우 포함).
2. **비교 전 정규화** — 양쪽을 소문자로 바꾸고, 텍스트에서 `**` 마커를 지운다.
   이유: `**장기** 보관`이 `장기 보관` 질의에 걸려야 한다. 마커는 개념 본문과 한 줄 요약에
   실제로 들어 있다.
3. **개념 히트** — 개념의 `name`·`summary`·`paragraphs`를 이어 붙인 텍스트에
   **모든 토큰**이 들어 있으면 히트다. 하나라도 없으면 히트가 아니다.
   토큰이 서로 다른 필드에 흩어져 있어도 된다(`aurora 관계형`처럼).
4. **주제 히트** — 주제의 `title`에 **모든 토큰**이 들어 있으면 히트다.
5. **주제 제목을 개념의 매칭 텍스트에 넣지 마라.** 넣으면 `스토리지 클래스` 같은 질의에
   그 주제의 개념 전부가 딸려 나와 결과가 무의미해진다. 주제 제목은 주제 히트만 만든다.
6. **`questions.json`을 읽지 마라.** `import`도 하지 마라. 이유: 검색 결과에 문제문과
   해설이 뜨면 확인 문제가 무의미해진다(ADR-013). 시그니처가 `questions`를 받지 않는 것이
   그 규칙의 표현이다. 인자를 추가하지 마라.

### 순위 규칙

필드 우선순위는 **개념 이름(0) → 주제 제목(1) → 한 줄 요약(2) → 개념 본문(3)** 이다.

- 개념 히트의 순위는 **토큰 중 하나라도 등장하는 가장 앞선 필드**의 값이다.
  `name`에 토큰이 하나라도 있으면 0, 없고 `summary`에 있으면 2, 둘 다 없으면 3.
- 주제 히트의 순위는 항상 1이다.
- 결과는 순위 오름차순으로 정렬한다. **순위가 같으면 `topics` 배열 순서, 그 안에서는
  `concepts` 배열 순서**다. 그 순서가 곧 학습 순서다.
- 같은 개념이 여러 필드에서 걸려도 **결과에 한 번만** 넣는다.
- 점수 함수(빈도·등장 위치 가중치)를 만들지 마라. ADR-013이 금지한다.

### 결과 개수

자르지 마라. 상한 인자(`limit`)를 만들지 마라. 최대가 개념 182개 + 주제 20개다.

## 테스트

`src/lib/search.test.ts`에 최소한 아래를 담는다. 대부분은 **작은 픽스처 `Topic[]`**로
검증하고, 실데이터 확인은 마지막 하나로 끝낸다.

1. 빈 질의(`''`)와 공백만 있는 질의(`'   '`)는 빈 배열을 돌려준다.
2. 개념 이름으로 찾는다. 대소문자가 달라도 찾는다(`'aurora'` → `Aurora`).
3. 주제 제목으로 찾으면 `kind: 'topic'` 히트가 나온다.
4. 토큰이 여러 개면 **전부** 들어 있어야 한다 — 하나라도 없으면 결과에서 빠진다.
5. 토큰이 서로 다른 필드에 흩어져 있어도 개념 히트가 된다.
6. `**강조**` 마커를 사이에 둔 문구를 마커 없는 질의로 찾을 수 있다.
7. 이름에서 걸린 개념이 본문에서만 걸린 개념보다 **앞에** 온다.
8. 같은 개념이 이름과 본문 양쪽에 걸려도 결과에 한 번만 나온다.
9. 주제 제목에 걸린 질의가 그 주제의 개념 전부를 끌고 오지 않는다(규칙 5의 회귀 테스트).
10. 실데이터 스모크: `src/data`의 `topics`로 `'aurora'`를 찾으면 결과가 비어 있지 않다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 검증 절차

1. 위 AC 커맨드를 모두 실행한다. 넷 다 통과해야 한다.
2. 아키텍처 체크리스트:
   - `src/lib/search.ts`가 `react`를 import하지 않는가?
   - `src/data/questions.json`을 import하지 않는가?
   - 타입을 `src/types/content.ts`에서 가져오는가(인라인 재정의 금지)?
   - `node scripts/check-structure.mjs`가 통과하는가? 이 step은 학습 데이터를 건드리지 않으므로
     반드시 통과해야 한다. 실패한다면 `src/data/`의 무언가를 잘못 고친 것이다.
3. 결과에 따라 `phases/22-concept-search/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 3회 시도 후 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 중단

## 금지사항

- **화면(`.tsx`)을 만들지 마라.** 이유: step 1의 범위다. 이 step은 `src/lib/`만 건드린다.
- **`src/data/` 아래 JSON을 고치지 마라.** 이유: 검색은 기존 데이터를 읽기만 한다.
  개념에 `keywords` 같은 검색용 필드를 추가하지 마라 — 본문에서 유도되는 값을 데이터에
  중복 저장하는 것이고, `scripts/check-structure.mjs`가 구조 변경으로 잡아낸다.
- **검색 라이브러리를 설치하지 마라**(fuse.js·lunr 등). 이유: ADR-013이 금지한다.
  182개를 매번 훑어도 사람이 느끼지 못한다.
- **`useMemo`·캐시·인덱스 사전 계산을 넣지 마라.** 이유: 측정된 문제가 없다.
  최적화가 필요하다고 판단되면 구현하지 말고 그 판단을 summary에 적어라.
- 기존 테스트를 깨뜨리지 마라.
