# Step 3: vs-titles

## 배경

ADR-051 「기준 4」대로 두 대안을 견주는 개념의 제목 43개를 「A vs B」 꼴로 바꾼다. 기존 제목의 낱말은 그대로 두고 「A와 B」·「A와 B의 갈림길」·「A와 B의 차이」·
「A와 B 중 고르기」의 연결만 ` vs `로 바꾼 것이다(예외 하나: 「계층으로 나뉘는 ALB와 NLB」 → 「ALB vs NLB」). 개념 `id`는 바꾸지 않는다.

무엇을 바꾸는지는 **`phases/66-exam-emphasis/changes.json`의 `renames`에 정해져 있다**(`conceptId`, `before`, `after`). 그대로 적용한다. 어느 제목을 바꿀지
판정하지 마라. 이 step은 **부분 C**만 한다(부분 A·B는 step 0·1이 적용했다).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-051**(「기준 4 — 「A vs B」 제목」)과 **ADR-030**(기준 1 — 개념 `name`은 명사구)
- `phases/66-exam-emphasis/changes.json`의 `renames`
- `phases/66-exam-emphasis/tools/content.mjs` — `applyRenames`(스냅샷의 `name`도 함께 고친다)
- `phases/66-exam-emphasis/tests-renames.patch`
- `scripts/sync-baseline.mjs` 머리 주석 — 이 step이 끝나면 「갱신할 것이 없다」가 나와야 한다

## 작업

### 1. 테스트를 먼저

```bash
git apply phases/66-exam-emphasis/tests-renames.patch
npx vitest run src/data
```

`data.test.ts`의 S3 스토리지 클래스 주제 제목 목록이 새 제목으로 바뀐다. **정확히 하나가 실패해야 한다** — 「S3 스토리지 클래스 주제가 클래스 8개 다음에
갈림길 7개와 비용 개념 2개를 둔다」. 다르면 멈추고 `error`로 끝낸다.

### 2. 데이터

```bash
node phases/66-exam-emphasis/tools/apply.mjs --part C
```

`src/data/topics.json`의 개념 줄 43개에서 `name`이, `scripts/topics-baseline.json`의 같은 항목 43개에서 `name`이 바뀐다. 도구가 던지면 손으로 고치지 말고
멈춰서 `error`로 끝낸다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/66-exam-emphasis/verify-content.mjs --through C
node scripts/content-audit.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` 통과(2698개).
   - `check-structure.mjs` — 「구조 이상 없음」. `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」(도구가 스냅샷 이름까지 고쳤다).
   - `verify-content.mjs --through C` — 「✓ … 부분 A~C를 적용한 결과와 같다」.
   - `content-audit.mjs`의 ① 제목(종결어미) 0건.
2. `git status`로 바뀐 파일이 `src/data/topics.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts`와 phase 메타데이터뿐인지 확인한다.
3. `phases/66-exam-emphasis/index.json`의 step 3을 갱신한다. 성공이면 `summary`에 바뀐 제목 수, 실패를 확인한 테스트, 전체 테스트 수를 적는다.

## 금지사항

- **`changes.json`의 제목을 바꾸거나 더하거나 빼지 마라.** 이유: 사용자가 범위(앱 전체)와 결과를 미리보기로 보고 승인했다. 이상해 보이면 `summary`에 적어라.
- **개념 `id`를 바꾸지 마라.** 이유: 문항의 `conceptId`, 도식의 `sources`, 약어 사전의 `sourceConceptId`가 id로 개념을 찾는다.
- **비교표 제목(`src/data/visuals/*.json`의 `label`)을 바꾸지 마라.** 이유: ADR-051 「기준 4」가 범위 밖으로 남겼다.
- **테스트 안 고정 데이터의 옛 제목(`S3ClassMapDiagram.test.tsx` 등)을 고치지 마라.** 이유: 데이터를 읽지 않는 자리이고 ADR-051 「남겨 둔 것」에 적었다.
- **부분 D를 적용하지 마라.** 이유: step 4의 범위다.
- **`topics.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 형식이 깨진다.
- 기존 테스트를 깨뜨리지 마라.
