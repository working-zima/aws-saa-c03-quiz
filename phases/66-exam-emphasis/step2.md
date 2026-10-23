# Step 2: emphasis-weight

## 배경

ADR-051 「기준 3」대로 본문 속 강조(`<strong>`)의 굵기를 500(`font-medium`)에서 600(`font-semibold`)으로 올린다. 색은 그대로 `text-neutral-100`이다.
설계 때 개발 서버로 보니 500은 본문(400)과 차이가 작아 step 1이 감싼 구절이 강조로 읽히지 않았다. 사용자가 600을 골랐다(2026-10-23).

바꾸는 곳은 `src/components/EmphasizedText.tsx`의 `renderEmphasis` 한 줄이다. UI_GUIDE 「타이포그래피」의 「본문 속 강조」 행과 설명은 설계 커밋이 이미 고쳤다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-051**(「기준 3 — 굵기 600」)과 **ADR-044**
- `docs/UI_GUIDE.md` 「타이포그래피」 — 「본문 속 강조 (ADR-051)」 행과 「본문 속 강조(ADR-051)」 문단
- `src/components/EmphasizedText.tsx`, `src/components/EmphasizedText.test.tsx`
- `src/components/ConceptList.tsx` — `EmphasizedText`의 유일한 사용처(개념 읽기와 확인 문제의 개념 펼치기가 함께 쓴다)

## 작업

### 1. 테스트를 먼저 (TDD)

`src/components/EmphasizedText.test.tsx`에 `it` 하나를 더한다. 기존 `it`은 고치지 않는다.

- `**강조**`가 든 글을 그리면 `<strong>`에 `font-semibold`와 `text-neutral-100` 클래스가 있고 `font-medium`은 없다.

더한 테스트가 **실패하는 것을 확인한 뒤** 구현한다.

### 2. 구현

`renderEmphasis`의 `<strong className="font-medium text-neutral-100">`을 `font-semibold text-neutral-100`으로 바꾼다. 다른 클래스·마크업은 그대로다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node phases/66-exam-emphasis/verify-content.mjs --through B
```

## 검증 절차

1. AC를 실행한다. 기대 결과: `npm test` 통과(2698개 — 새 테스트 하나). `verify-content.mjs --through B`는 데이터가 그대로라 통과한다.
2. `git status`로 바뀐 파일이 `src/components/EmphasizedText.tsx`, `src/components/EmphasizedText.test.tsx`와 phase 메타데이터뿐인지 확인한다.
3. `phases/66-exam-emphasis/index.json`의 step 2를 갱신한다. 성공이면 `summary`에 바꾼 클래스, 새 테스트(구현 전 실패 확인), 전체 테스트 수를 적는다.

## 금지사항

- **강조에 색·배경·밑줄을 붙이지 마라.** 이유: UI_GUIDE — 색은 정답/오답/중요도에만 쓰고, 배경은 하이라이트다(ADR-044·ADR-051).
- **개념 이름·주제 제목 같은 다른 글자의 굵기를 바꾸지 마라.** 이유: 이 결정은 본문 속 강조 하나만 바꾼다.
- **백틱 코드 표기(`<code>`)의 스타일을 바꾸지 마라.** 이유: ADR-044가 정했고 이번 결정의 범위 밖이다.
- **데이터 파일과 `docs/`를 고치지 마라.** 이유: 데이터는 step 1·3·4, 문서는 설계 커밋의 범위다.
- 기존 테스트를 깨뜨리지 마라.
