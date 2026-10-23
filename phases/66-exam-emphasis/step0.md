# Step 0: topic-importance

## 배경

ADR-051대로 주제 별점을 노션 「시험 문제 출제 유형」의 우선순위로 다시 매긴다. 1·2순위 하위 항목을 담은 주제만 ★★★, 나머지는 ★★☆, 기초 주제는 별점 없음이다.
14개 주제가 3 → 2, `route53` 하나가 2 → 3이 된다(★★★ 28 → 15, ★★☆ 10 → 23).

무엇을 바꾸는지는 **`phases/66-exam-emphasis/changes.json`의 `importance`에 정해져 있다. 그대로 적용한다.** 어느 주제를 올리고 내릴지 판정하지 마라.

이 phase의 데이터 변경은 네 부분(A 별점, B 굵은 글씨, C 「A vs B」 제목, D 새 개념·문항)이고 step 0·1·3·4가 하나씩 맡는다. 이 step은 **부분 A**만 한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-051**(특히 「기준 1 — 별점」)
- `docs/source/exam-types.md` — 별점 기준이 된 노션 정리. 사실의 출처가 아니다
- `phases/66-exam-emphasis/changes.json`의 `importance`
- `phases/66-exam-emphasis/tools/content.mjs`·`tools/apply.mjs`·`verify-content.mjs` — 머리 주석
- `phases/66-exam-emphasis/tests-importance.patch`
- `scripts/check-structure.mjs`·`scripts/sync-baseline.mjs` 머리 주석 — 스냅샷이 importance를 들고 있고, sync-baseline은 importance를 고치지 않는다

## 작업

### 1. 테스트를 먼저

```bash
git apply phases/66-exam-emphasis/tests-importance.patch
npx vitest run src/data
```

`src/data/data.test.ts`의 별점 표 셋(39개 주제 전체, 24~38번, 9~23번)이 새 값으로 바뀌고 주석이 붙는다. **정확히 셋이 실패해야 한다** —
「보충 개념 추가 후에도 39개 주제의 메타데이터가 그대로다」, 「보안·운영 데이터 주제가 지정된 순서와 메타데이터로 추가된다」, 「네트워크 데이터 주제가 지정된
순서와 메타데이터로 추가된다」. 다른 테스트가 실패하거나 셋 중 하나라도 통과하면 멈추고 `"status": "error"`, `"error_message"`에 테스트 이름을 적는다.

### 2. 데이터

```bash
node phases/66-exam-emphasis/tools/apply.mjs --part A
```

`src/data/topics.json`의 주제 머리 줄 15곳과 `scripts/topics-baseline.json`의 같은 주제 15곳에서 `importance`만 바뀐다. 도구가 던지면(이미 적용됐거나 자리가
다르다) 손으로 고치지 말고 멈춰서 `error`로 끝낸다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/66-exam-emphasis/verify-content.mjs --through A
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` 통과(2697개).
   - `check-structure.mjs` — 「구조 이상 없음」. `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-content.mjs --through A` — 「✓ 데이터 세 파일이 changes.json의 부분 A~A를 적용한 결과와 같다」.
2. `git status`로 바뀐 파일이 `src/data/topics.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts`와 phase 메타데이터뿐인지 확인한다.
3. `phases/66-exam-emphasis/index.json`의 step 0을 갱신한다. 성공이면 `summary`에 바뀐 주제 수(3→2 열넷, 2→3 하나), 실패를 확인한 테스트 셋, 전체 테스트 수를 적는다.

## 금지사항

- **`changes.json`의 값을 바꾸지 마라.** 이유: 사용자가 미리보기로 보고 승인한 별점이다. 이상해 보이면 고치지 말고 `summary`에 적어라.
- **부분 B·C·D를 적용하지 마라.** 이유: step 1·3·4의 범위다. 한 번에 적용하면 step마다의 대조(`--through`)가 깨진다.
- **`topics.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 개념 한 줄 포맷과 스냅샷 형식이 깨져 가드레일이 진짜 사고와 구분하지 못한다.
- **패치 밖의 테스트를 고치지 마라.** 패치를 적용해도 다른 테스트가 실패하면 멈춰라. 이유: 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.
- **`src/` 아래 코드, `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 step은 데이터와 그 단언만 바꾼다.
- 기존 테스트를 깨뜨리지 마라.
