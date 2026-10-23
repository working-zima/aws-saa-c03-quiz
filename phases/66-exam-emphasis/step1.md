# Step 1: core-emphasis

## 배경

ADR-051 「기준 2」대로 노션 출제 유형의 「핵심」과 우선순위 하위 항목이 가리키는 판단 문장을 개념 본문에서 `**…**`로 감싼다. 개념 78개, 문단 89개, 구절 93개다.
**글자는 바꾸지 않고 표지만 더한다.** 화면은 이미 `**…**`를 `<strong>`으로 그린다(`src/components/EmphasizedText.tsx`). 굵기를 올리는 일은 step 2다.

무엇을 바꾸는지는 **`phases/66-exam-emphasis/changes.json`의 `emphasis`에 문단 단위로 정해져 있다**(`conceptId`, `paragraphIndex`, `before`, `after`).
그대로 적용한다. 어느 구절을 감쌀지 판정하지 마라. 이 step은 **부분 B**만 한다(부분 A는 step 0이 적용했다).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-051**(특히 「기준 2 — 굵은 글씨」)과 **ADR-044**(`**강조**`와 백틱 표기를 그리는 곳 셋)
- `phases/66-exam-emphasis/changes.json`의 `emphasis`
- `phases/66-exam-emphasis/tools/content.mjs` — `applyEmphasis`
- `phases/66-exam-emphasis/tests-emphasis.patch`
- `src/lib/glossary.ts`의 `markFirstOccurrences` — `**` 안의 약어는 툴팁을 달지 않는다. 설계가 툴팁이 사라지는 곳이 없게 골랐다
- `src/components/diagrams/sgNaclTables.test.tsx` — 렌더된 글을 원문 문단과 비교하는 단언

## 작업

### 1. 테스트를 먼저

```bash
git apply phases/66-exam-emphasis/tests-emphasis.patch
npx vitest run src/data src/components/diagrams/sgNaclTables.test.tsx
```

`data.test.ts`에서 문단 전체를 `toBe`로 못박은 단언 둘(Lambda 예약된 동시성의 셋째 문단, WAF의 셋째 문단)의 기대값에 `**`가 들어가고, `sgNaclTables.test.tsx`가
렌더된 `textContent`를 원문 문단에서 `**`를 지운 글과 비교하게 된다. **정확히 둘이 실패해야 한다** — 「첫 문단이 동시 실행 수와 계정 한도를 세운 뒤 예약된
동시성을 정의한다」, 「WAF 기본 개념의 기존 문단과 요약을 유지하고 뒤에 Web ACL과 기본 동작을 정의한다」. 비교표 테스트는 데이터가 바뀌기 전에도 통과한다
(지울 표지가 없다). 다르면 멈추고 `error`로 끝낸다.

### 2. 데이터

```bash
node phases/66-exam-emphasis/tools/apply.mjs --part B
```

`src/data/topics.json`의 개념 줄 78개에서 문단 89개가 `after`로 바뀐다. 도구는 문단이 `before`와 다르거나 `after`에서 `**`를 지운 글이 `before`와 다르면
던진다. 던지면 손으로 고치지 말고 멈춰서 `error`로 끝낸다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/66-exam-emphasis/verify-content.mjs --through B
node scripts/coverage.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` 통과(2697개). 약어 툴팁 테스트(「약어마다 그 주제의 개념 본문에 단어로 한 번 이상 나온다」)도 그대로 통과한다.
   - `check-structure.mjs` — 「구조 이상 없음」(본문은 검사 대상이 아니다). `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-content.mjs --through B` — 「✓ … 부분 A~B를 적용한 결과와 같다」. `coverage.mjs` — 636개념 100%.
2. `git status`로 바뀐 파일이 `src/data/topics.json`, `src/data/data.test.ts`, `src/components/diagrams/sgNaclTables.test.tsx`와 phase 메타데이터뿐인지 확인한다.
3. `phases/66-exam-emphasis/index.json`의 step 1을 갱신한다. 성공이면 `summary`에 바뀐 개념·문단 수, 실패를 확인한 테스트 둘, 전체 테스트 수를 적는다.

## 금지사항

- **`changes.json`의 구절을 바꾸거나 더하거나 빼지 마라.** 이유: 사용자가 미리보기로 보고 승인했고, 각 구절은 테스트의 `toContain` 단언과 약어 툴팁을 피하도록
  골랐다. 이상해 보이면 고치지 말고 `summary`에 적어라.
- **`summary`(개념의 한 줄 요약)를 감싸지 마라.** 이유: ADR-051 「기준 2」. 요약은 한 줄이라 감싸면 줄 전체가 굵어진다.
- **`EmphasizedText.tsx`의 굵기를 바꾸지 마라.** 이유: step 2의 범위다.
- **부분 C·D를 적용하지 마라.** 이유: step 3·4의 범위다.
- **`topics.json`을 재직렬화하지 마라.** 이유: 개념 한 줄 포맷이 깨진다.
- **패치 밖의 테스트를 고치지 마라.** 이유: 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.
- 기존 테스트를 깨뜨리지 마라.
