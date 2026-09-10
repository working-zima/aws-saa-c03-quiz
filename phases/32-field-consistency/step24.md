# Step 24: ratchet-closeout-and-report

앞선 step 0~23이 주제 39개의 개념 `name`·`summary`와 문항 `prompt`·`choices`를 훑었다.
이 step은 **콘텐츠를 고치지 않는다.** 래칫을 닫고, 결과를 세어 사용자에게 보고하는 것이 전부다.

## 읽어야 할 파일

- `CLAUDE.md`
- `src/data/data.test.ts` — 명사구 단언 두 개를 하나로 합친다
- `phases/32-field-consistency/index.json` — step 0~23의 `summary`가 보고서의 원자료다
- `phases/NEXT.md` — 보고서를 여기 맨 앞에 넣는다
- `scripts/field-diff.mjs` · `scripts/content-audit.mjs` — 수치의 출처

## 작업 1 — 명사구 래칫을 전 주제 검사로 갈아치운다

`src/data/data.test.ts`에는 지금 개념 제목을 명사구로 고정하는 단언이 **둘**이다.

1. `it('S3 암호화 주제의 개념 제목이 모두 문장이 아니라 명사구다', …)` — phase 29가 시범
   주제 하나에 건 것
2. `const nounPhraseRatchet = [...]`와 `it('phase 31이 끝낸 주제의 개념 제목이 모두 문장이
   아니라 명사구다', …)` — 끝낸 주제를 하나씩 더해 온 래칫

주제 39개가 전부 끝났으므로 **둘을 지우고 전 주제 검사 하나로 바꾼다.**

```ts
it('개념 제목이 모두 문장이 아니라 명사구다', () => {
  topics.forEach((topic) => {
    topic.concepts.forEach((concept) => {
      expect(concept.name, `${concept.id}의 name이 문장이다: "${concept.name}"`).not.toMatch(/다$/)
    })
  })
})
```

**주석을 함께 옮겨라.** 두 단언 위에 붙어 있는 「제목은 이름표이지 주장이 아니다」와
「예외 목록을 만들지 마라」는 이 기준이 왜 있는지를 적은 것이라 그대로 살아 있어야 한다.
범위를 한정하는 이유를 적은 문단(「나머지 38개 주제에 문장형 제목이 아직 남아 있다」,
「phase 31이 위 기준을 넓히는 동안…」)은 사실이 아니게 되므로 **지운다.**

**이 단언이 실패하면 남은 주제가 있다는 뜻이다.** 통과시키려고 예외 목록을 만들지 마라 —
어느 주제가 남았는지 찾아 `status: "error"`로 보고하고 멈춰라. 그 주제는 담당 step으로 돌아간다.

## 작업 2 — 주제 안 제목 중복을 불변식으로 고정한다

이 phase가 개념 제목 다수를 명사구로 줄였다. 줄이는 과정에서 **한 주제 안에 같은 제목이
둘 생기면** 목록에서 구분되지 않는다 — 이 phase가 새로 만들 수 있는 유일한 종류의 회귀다.
착수 시점에 주제 안 중복은 0건이었고, 그것을 붙잡는 단언을 더한다.

```ts
it('한 주제 안에서 개념 제목이 겹치지 않는다', () => {
  topics.forEach((topic) => {
    const names = topic.concepts.map((concept) => concept.name)
    expect(new Set(names).size, `${topic.id}에 같은 제목이 둘 있다`).toBe(names.length)
  })
})
```

**주제를 넘는 중복은 검사하지 않는다.** 같은 서비스가 두 주제에 나오면 제목이 같은 것이
자연스럽고, 착수 시점에도 3건 있었다. 좁히는 것이 목적이 아니다.

## 작업 3 — 사용자 보고서를 쓴다

`phases/NEXT.md`의 **맨 앞**에 「phase 32 결과 보고」 절로 넣어라. 사용자가 완료 후 정리해
달라고 한 것이 넷이고, **그 넷을 그 순서 그대로** 만든다.

### 1. `name` / `summary` / `prompt` / `choices` 각각 수정 건수

**자기 보고 수치를 쓰지 마라.** 실측으로 낸다.

```bash
node scripts/field-diff.mjs 04f6946 --list
```

이 값이 phase 착수 시점(`04f6946`) 대비 누적 실측이다. 네 필드의 건수를 표로 내고,
step별 내역은 `index.json`의 `summary`에서 모아 주제별 표로 함께 붙여라.
**정답 보기의 글자가 바뀐 문항은 따로 세어 밝힌다** — 도구가 경고로 찍는 값이다.

착수 시점의 기계 지표와도 대조한다.

```bash
node scripts/content-audit.mjs
```

기준 커밋의 지표는 phase 31 보고서에 이미 있다 — **① 181 / ② 91 / ③ 62 / ④ 1 / ⑤ 3 / ⑥ 8쌍**.
이번 phase의 목표값은 **① 0**이고, ②는 줄거나 같아야 하며, **③④⑤⑥은 늘지 않아야 한다.**
늘어난 지표가 있으면 그 사실을 숨기지 말고 어느 주제에서 늘었는지 적어라.

### 2. 보류한 항목과 이유

step 0~23 `summary`의 「보류」를 **한 목록으로 합친다.** 주제별로 묶고 사유별로 소분류해라.
사유가 같은 것이 여럿이면 건수를 세어 앞에 적는다.

### 3. 의미 변경 위험 때문에 손대지 않은 항목

**2와 따로 적어라.** 사용자가 둘을 나눠 요구했다. 여기 들어가는 것은 「고치면 사실·조건·
수치의 뜻이 달라질 것 같아서」·「오답 보기의 함정이 그 표현에 걸려 있어서」·「대체어가
사실을 넓히거나 좁힐 수 있어서」인 것들이다. 단순히 판단이 갈렸거나 범위 밖이라 남긴 것은
2에 둔다. **항목마다 무엇이 달라질 뻔했는지를 한 줄로 적어라** — 그것이 이 목록의 쓸모다.

### 4. 마지막 커밋 상태

브랜치 이름, 마지막 커밋 해시와 제목, 분기 지점, `develop` 대비 커밋 수,
**push 여부(하지 않았다 — 병합과 push는 사람이 판단한다)**, 그리고 검증 결과 표
(`npm test` 개수, `build`, `check-structure`, `field-diff`, `coverage`, `check-verbatim`, `content-audit`).

## Acceptance Criteria

```bash
npm test                                  # 전부 통과. 명사구 단언이 전 주제로 걸린 상태여야 한다
npm run build
node scripts/check-structure.mjs
node scripts/field-diff.mjs 04f6946       # exit 0
node scripts/coverage.mjs                 # 618/618
node scripts/check-verbatim.mjs
node scripts/content-audit.mjs            # ① 이 0이어야 한다
```

**① 문장형 제목이 0이 아니면 이 step은 실패다.** `status: "error"`로 두고 어느 주제에
남았는지 `error_message`에 적어라.

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `node scripts/content-audit.mjs`의 ① 합계가 0인지 눈으로 확인한다.
3. `phases/32-field-consistency/index.json`의 이 step을 갱신한다.

## 금지사항

- **콘텐츠를 고치지 마라.** 이유: 이 step은 래칫 정리와 보고만 맡는다. 눈에 걸리는 것이
  있으면 보고서의 보류 목록에 적어라.
- **명사구 단언을 통과시키려고 예외 목록을 만들지 마라.** 이유: 목록이 생기는 순간 거기에
  개념이 추가되어 사각지대가 되살아난다(ADR-026의 경고와 같다). 남은 주제가 있으면
  통과시키지 말고 `error`로 보고해라.
- **`docs/ADR.md`에 ADR을 쓰지 마라.** 이유: 이번 범위는 문체 수정이고 새로 정할 설계
  결정이 없다. 문체 기준을 ADR로 굳힐지는 사용자가 판단한다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** 이유: `sync-baseline.mjs`가 있다.
- 기존 테스트를 깨뜨리지 마라.
