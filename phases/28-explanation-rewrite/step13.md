# Step 13: invariant-and-baseline — 하한을 테스트로 고정하고 문서를 맞춘다

## 읽어야 할 파일

먼저 아래 파일들을 읽고 앞 step들이 무엇을 했는지 파악하라:

- `/CLAUDE.md` — 「아키텍처 규칙」·「개발 프로세스」
- `/docs/ADR.md` — **ADR-027**(step 0이 추가했다. 이 step이 결과 절을 덧붙인다),
  **ADR-026**(커버리지 100%를 `data.test.ts`의 불변식으로 고정한 전례. 같은 방식을 쓴다)
- `/docs/PRD.md` — 「문제 은행」
- `/docs/ARCHITECTURE.md` — 「데이터 모델」·「테스트 경계」
- `/src/data/data.test.ts` — 불변식을 더할 곳. **기존 `it`을 고치지 말고 새 `it`을 더한다**
- `/src/data/questions.json` — step 1~12가 고친 결과
- `/scripts/explanation-audit.mjs` — step 0이 만든 측정 도구
- `/scripts/topics-baseline.json` — `questionsSha256`을 갱신할 곳
- `/scripts/check-structure.mjs` — 그 해시를 어떻게 계산하는지 확인용
- `/phases/NEXT.md` — 기기를 옮겨 이어받을 때 읽는 인수인계 문서. 숫자를 갱신한다

## 배경

step 1~12가 `q001`~`q246`의 해설을 전부 다시 썼다. 이 step은 **되돌아가지 않게 고정하고**
문서의 숫자를 실측으로 맞춘다.

ADR-026이 커버리지 100%를 달성한 뒤 `data.test.ts`의 불변식으로 굳힌 것과 같은 일이다.
그 절이 남긴 경고도 그대로 적용된다 — **예외 목록을 만들어 통과시키지 마라.**

## 작업

### 1. 실측한다

먼저 지금 상태를 재고, 아래 작업의 숫자를 전부 이 실측값으로 쓴다. 추정값을 쓰지 마라.

```bash
node scripts/explanation-audit.mjs        # 미달 0이어야 한다
```

미달이 남아 있으면 그 주제를 맡은 step이 끝나지 않은 것이다. 이 step에서 그 문항을 대신 쓰지
말고 **`status`를 `blocked`로 두고 어느 문항이 남았는지 적어 멈춰라** — 어느 step이 빠뜨렸는지
사람이 알아야 한다.

`q001`~`q246`의 해설 평균·최소·최대 길이도 함께 재 둔다. 아래 3·4번에서 쓴다.

### 2. `src/data/data.test.ts`에 불변식을 더한다

기존 `it`을 고치지 말고 **새 `it`을 더한다.** 이유: 기존 slice 검증은 phase별로 구간을 나눠
id·`topicId`·`conceptId`·정답 분포를 고정하고 있고, 그 구조가 이 phase와 무관하게 살아야 한다.

단정할 것:

- **문제 은행 732문항 전체**의 `explanation`이 187자 이상이다. `q001`~`q246`만이 아니라
  전 구간에 걸어라 — 앞 구간이 하한을 넘은 지금은 구간을 나눌 이유가 없고, 나누면 다음 사람이
  "옛 구간은 예외"라고 읽는다.
- 하한 상수 187에 **근거를 주석으로 남긴다**: phase 27이 쓴 해설 486개의 실측 최소값이고
  ADR-026·ADR-027이 정한 "정답 근거 + 오답 3개"를 담으면 자연히 넘는 하한선이라는 것.
- 기존 phase 27 step들이 각자 걸어 둔 `>= 100` 단정은 **고치지 마라.** 새 단정이 더 강하므로
  실질적으로 덮이고, 그 단정들은 각 step의 기록이다. 지우면 어느 step이 무엇을 보장했는지가 사라진다.

**예외 목록·화이트리스트를 만들지 마라.** 통과하지 않는 문항이 있으면 그 문항의 해설을 고치는
것이 답이다(단, 1번의 지시대로 이 step에서 대신 쓰지는 않는다 — `blocked`로 멈춘다).

### 3. `scripts/topics-baseline.json`의 `questionsSha256`을 갱신한다

step 1~12가 `questions.json`을 고쳤으므로 지금 `node scripts/check-structure.mjs`는 실패한다.
새 해시를 계산해 넣는다. 계산 방식은 `check-structure.mjs`가 쓰는 것과 같아야 한다 —
**파일 바이트 전체의 sha256**이다.

```bash
node -e "const{createHash}=require('node:crypto');const{readFileSync}=require('node:fs');console.log(createHash('sha256').update(readFileSync('src/data/questions.json')).digest('hex'))"
```

`topics-baseline.json`의 다른 필드(`conceptLineCount`·`topics`)는 **건드리지 마라.**
이 phase는 `topics.json`을 고치지 않았으므로 바뀔 이유가 없다. 바뀌어야 한다면 어떤 step이
금지사항을 어긴 것이니 그 사실을 `summary`에 적어라.

### 4. `docs/ADR.md`의 ADR-027에 결과 절을 덧붙인다

ADR-026이 「결과 — 실측으로 확인한 것」 절을 나중에 덧붙인 것과 같은 형식으로, ADR-027 절
**안에** 결과를 적는다. 새 ADR 번호를 만들지 마라.

담을 내용 — 전부 1번의 실측값으로 쓴다:

- `q001`~`q246` 해설의 재작성 전후 평균·최소 길이 (재작성 전은 평균 126자·최소 58자였다)
- 하한 187자가 `src/data/data.test.ts`의 불변식이 되었고 **문제 은행 732문항 전체**에 걸린다는 것
- step 1~12가 개념 본문에서 발견해 남긴 문제가 있으면 그 목록. 없으면 없다고 적는다.
  이 phase는 개념 본문을 고치지 않았으므로, 있다면 그것은 다음 phase의 후보가 된다.

### 5. `phases/NEXT.md`를 갱신한다

이 파일은 기기를 옮겨 이어받을 때 읽는 인수인계 문서다. 지금은 phase 27 직후 상태로 적혀 있다.

- 「지금 상태」 표의 브랜치·문항·테스트 개수를 실측으로 갱신한다
- 「다음 phase 후보」의 **후보 A(기존 해설 246개 보강)를 지운다** — 이 phase가 그것이다.
  남은 후보 B·C·D는 그대로 두고, 소요 시간 실적에 이 phase의 실측을 한 줄 더한다
- 「옮겨가지 않는 파일」 표는 그대로 둔다. 다만 `concepts-raw.md` 행에 **해설 재작성은
  ADR-027에 따라 개념 본문 근거로 진행했다**는 한 줄을 더해, 다음 사람이 같은 질문을 다시
  하지 않게 한다

### 6. 문서의 낡은 숫자를 확인한다

`docs/PRD.md`·`docs/ARCHITECTURE.md`·`docs/UI_GUIDE.md`에서 **해설 길이**를 언급하는 자리가
있는지 찾아, 있으면 실측으로 맞춘다. 없으면 고치지 마라.

**문제 화면의 픽셀 실측값에 새 숫자를 넣지 마라.** 해설이 길어져 정답 확인 영역이 길어지는 것은
사실이지만, ARCHITECTURE 「화면 전환 시 스크롤」은 다시 재기 전에는 새 숫자를 넣지 말라고 못박고
있고 이 환경에는 브라우저가 없다. 표 아래에 낡았다는 한 문장만 덧붙이는 것까지가 이 step의 범위다
(ADR-026이 복습 화면 36891px를 그렇게 처리한 전례가 있다).

## 이 step에서 반드시 지킬 것

1. **숫자는 전부 실측으로 쓴다.** 추정값이나 앞 step의 `summary`에 적힌 값을 옮겨 적지 마라.
   이유: 이 저장소의 문서는 실측값을 근거로 읽히고, 한 번 틀린 숫자가 들어가면 다음 phase가 그것을
   근거로 결정한다.
2. **`explanation` 이외의 문항 필드를 고치지 마라.** 이 step은 문항 내용을 손대지 않는다.
3. **예외 목록을 만들어 테스트를 통과시키지 마라.** 근거는 ADR-026 마지막 문단.
4. **미달 문항이 남아 있으면 `blocked`로 멈춘다.** 대신 쓰지 마라 — 어느 step이 빠뜨렸는지가
   기록에 남아야 한다.

## 금지사항

- `src/data/topics.json`을 고치지 마라. 이유: 개념 본문은 이 phase의 범위 밖이다.
- `scripts/topics-baseline.json`의 `conceptLineCount`·`topics`를 고치지 마라.
  이유: 이 phase는 `topics.json`을 고치지 않았다.
- 새 ADR 번호를 만들지 마라. 결과는 ADR-027 안에 적는다.
- 브라우저 실측 없이 픽셀 값을 문서에 넣지 마라.
- 기존 테스트를 고치거나 깨뜨리지 마라.

## Acceptance Criteria

```bash
npm run build                          # 컴파일 에러 없음
npm test                               # 새 불변식을 포함해 전부 통과
node scripts/explanation-audit.mjs     # 미달 0
node scripts/check-structure.mjs       # exit 0 — 해시를 갱신했으므로 통과해야 한다
node scripts/coverage.mjs              # exit 0 — 618/618, 이 phase가 깨뜨리지 않았음을 확인
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `npm test`의 통과 개수가 이 phase 시작 시점(453개)보다 늘었는지 확인한다.
   2번에서 새 `it`을 더했으므로 늘어야 한다.
3. `git diff --stat`으로 이 step이 고친 파일이 위 작업에 적힌 것뿐인지 확인한다.
   `src/data/questions.json`이 이 step의 diff에 있으면 금지사항을 어긴 것이다.
4. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
5. 결과에 따라 `phases/28-explanation-rewrite/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **재작성 후 해설 평균·최소 길이, 새 불변식이 걸린 범위, 테스트 총 개수,
개념 본문에서 발견돼 다음 phase로 넘긴 문제**를 적어라.
