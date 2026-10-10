# Step 0: inline-code

## 배경

개념 요약·본문은 `**강조**` 마커만 굵은 글자로 그린다. 그런데 개념 16개의 문단 20개에 백틱 한 쌍으로 감싼 표기가 24개 있다
(`NotAction`·`aws:RequestedRegion`·`TooManyRequestsException`·`/api/*` 같은, 콘솔이나 코드에 그대로 치는 글자). 화면 코드가 백틱을 모르므로
지금은 기호 그대로 보인다.

이 step은 **`docs/ADR.md`의 ADR-044**대로 백틱 한 쌍을 `<code>`로 그린다. **데이터(`src/data/`)는 한 글자도 바꾸지 않는다.**

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-044**(이 step의 결정)와 **ADR-037**(약어 툴팁)
- `docs/UI_GUIDE.md` 「타이포그래피」 — 「본문 속 코드 표기」 행과 그 아래 문단, `break-keep`·`break-anywhere` 규칙
- `src/components/EmphasizedText.tsx` — `renderEmphasis`와 머리 주석
- `src/components/ConceptList.tsx` — `EmphasizedText`의 유일한 사용처(요약과 문단)
- `src/lib/glossary.ts`의 `markFirstOccurrences`와 `src/lib/glossary.test.ts`의 「**강조** 안의 약어는 표시하지 않고…」 테스트
- `src/lib/search.ts`의 `stripEmphasis`와 `src/lib/search.test.ts`의 `describe('stripEmphasis')`
- `src/components/ConceptList.test.tsx`·`src/components/GlossaryTerm.test.tsx` — 컴포넌트 테스트의 모양(`render`·`screen`·`within`). 이 둘은 고치지 않는다
- `scripts/hooks/tdd-guard.sh` — 구현 파일을 고치려면 **같은 폴더에 같은 이름의 테스트 파일**(`EmphasizedText.test.tsx`)이 먼저 있어야 한다

## 작업

### 1. 테스트를 먼저

아래 세 파일에 테스트를 **더한다**. 앞의 둘은 기존 파일에 더하고(기존 테스트는 고치지 않는다), 셋째는 새로 만든다. 더한 뒤 `npm test`를
돌려 새 테스트만 실패하는지 확인한다. 새 파일을 먼저 만들어야 TDD 가드(`scripts/hooks/tdd-guard.sh`)가 `EmphasizedText.tsx` 편집을 허용한다.

- `src/lib/glossary.test.ts`의 `describe('markFirstOccurrences')` 안:
  - 백틱 안의 약어는 표시하지 않고 백틱 밖의 첫 자리를 표시한다. 예:

    ```ts
    markFirstOccurrences(['`ACM Certificate` 이벤트는 ACM이 낸다'], ['ACM'])
    // → [[{ text: '`ACM Certificate` 이벤트는 ' }, { text: 'ACM', term: 'ACM' }, { text: '이 낸다' }]]
    ```
  - 백틱 조각이 있어도 조각들을 이으면 원문과 같다.
- `src/lib/search.test.ts`의 `describe('stripEmphasis')` 안:
  - 백틱을 지우고 나머지 글자는 그대로 둔다. 예:

    ```ts
    stripEmphasis('`NotAction`은 **나머지**를 가리킨다') // → 'NotAction은 나머지를 가리킨다'
    ```
- **새 파일** `src/components/EmphasizedText.test.tsx`에 `describe('본문 속 코드 표기 (ADR-044)')`. `EmphasizedText`를 직접 렌더한다(약어
  경우는 `markFirstOccurrences`로 만든 `segments`와 사전을 `glossary` 프롭으로 넘긴다):
  - 백틱 한 쌍이 `code` 요소가 되고, 그 글자에는 백틱이 없으며, 요소의 클래스는 `font-mono`와 `text-[0.9em]`뿐이다.
  - 렌더한 글의 `textContent`에 백틱 기호가 남지 않는다.
  - 한 문단에 `**강조**`와 백틱 표기가 함께 있으면 `strong`과 `code`가 각각 하나씩 생긴다.
  - `glossary`를 주었을 때 백틱 안의 약어는 버튼이 되지 않고 `code`의 글자로 남으며, 백틱 밖에 처음 나온 약어가 버튼이 된다.

### 2. 구현

- `src/components/EmphasizedText.tsx`의 `renderEmphasis`: `**강조**`와 함께 백틱 한 쌍(정규식으로 `` `[^`]+` ``)도 나눈다. 백틱 조각은
  `<code className="font-mono text-[0.9em]">`로 그리고 안의 글자만 넣는다. 색·배경·테두리 클래스를 붙이지 마라(UI_GUIDE). 머리 주석에
  백틱 규칙을 한 줄 더한다.
- `src/lib/glossary.ts`의 `markFirstOccurrences`: `**강조**`를 건너뛰는 것과 같은 방식으로 백틱 한 쌍도 건너뛴다. 이 함수의 주석과
  `EmphasizedText.tsx`의 `glossary` 프롭 주석(「강조 마커는 늘 한 조각 안에 짝으로 들어 있다」)이 백틱도 말하게 고친다.
- `src/lib/search.ts`의 `stripEmphasis`: `**`와 함께 백틱도 지운다. 주석을 맞춘다.

`glossary.ts`처럼 정규식을 템플릿 리터럴 안에서 만들 때 백틱은 역슬래시 **하나**로 이스케이프한다. 역슬래시를 둘 쓰면 역슬래시 글자
하나가 되고 템플릿이 그 백틱에서 끝나 문법 오류가 난다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
```

## 검증 절차

1. AC를 실행한다. 기대 결과: 빌드·린트 통과, 테스트는 기존 1261개와 새로 더한 테스트가 모두 통과, `check-structure.mjs` 「구조 이상 없음」,
   `sync-baseline.mjs --dry-run` 「갱신할 것이 없다」.
2. 바뀐 파일·새 파일이 아래 여섯뿐인지 확인한다. 샌드박스에서 `git`을 실행할 수 없으면 그 사실을 `"summary"`에 적는다. 사람이 다시 확인한다.
   - `src/components/EmphasizedText.tsx`, `src/components/EmphasizedText.test.tsx`(새 파일)
   - `src/lib/glossary.ts`, `src/lib/glossary.test.ts`
   - `src/lib/search.ts`, `src/lib/search.test.ts`
3. `phases/56-inline-code-root-user/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 파일, 더한 테스트 수와 이름, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`src/data/`·`scripts/topics-baseline.json`을 고치지 마라.** 이유: ADR-044는 데이터를 바꾸지 않고 화면에서 그린다. 백틱 표기를 못박은
  데이터 테스트와 스냅샷 해시가 그대로여야 한다. 데이터는 step 1이 따로 다룬다.
- **위 여섯 파일 밖을 고치거나 만들지 마라.** `ConceptList.tsx`·`ConceptList.test.tsx`·`SearchPage.tsx`·`KeywordQuizRunner.tsx` 등도 고칠
  필요가 없다. 이유: 요약과 본문을
  그리는 곳은 `EmphasizedText` 하나이고, 검색 화면은 `stripEmphasis`를 통해 같은 규칙을 쓴다.
- **`code`에 색·배경·테두리·안쪽 여백을 주지 마라.** 이유: UI_GUIDE는 색을 정답/오답/중요도에만 쓰고 배경 하이라이트를 금한다(ADR-044).
- **기존 테스트를 고치거나 지우지 마라.** 새 테스트만 더한다. TDD 가드나 다른 훅을 고치거나 우회하지 마라. 이유: 기존 단언이 깨지면 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.
- 새 의존성을 설치하지 마라.
