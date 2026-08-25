# Step 0: glacier-legal-keyword

## 배경 — 법·감사 신호가 Glacier 문항 5개 중 2개에만 있다

`src/data/questions.json`에서 **정답 보기가 Glacier 계열인 문항은 5개**다(q020~q024).
그런데 문제문에 법·감사 목적이 드러나는 것은 q020, q023 둘뿐이다.

| 문항 | 정답 | 현재 변별 축 | 법 키워드 |
|---|---|---|---|
| q020 | S3 Glacier Instant Retrieval | 법·감사 + 즉시 조회 | 있음 |
| q021 | S3 Glacier Flexible Retrieval | 조회 최대 1시간 | **없음** |
| q022 | S3 Glacier Deep Archive | 조회 최대 12시간 | **없음** |
| q023 | Glacier 계열 | 법·감사·규정 | 있음 |
| q024 | S3 Glacier Deep Archive | 즉시 조회 분류 | **없음** |

원본 근거는 `docs/source/concepts-raw.md` PAGE 8이다 — "Glacier 스토리지 클래스는
법 / 감사 / 규정 목적으로 장기 보관할 때 사용한다." 같은 문장이 개념
`s3-storage-classes.glacier-or-standard-ia`에도 이미 반영돼 있다.
**이 step은 새 사실을 넣는 것이 아니라, 이미 있는 사실을 세 문항의 문제문에 드러내는 것이다.**

## 결정된 동작

**정답이 Glacier 계열인 5문항 모두가 문제문에 법·감사(·규정) 목적을 담는다.**

단, 그 키워드가 **답을 바로 알려주는 문항이 있어서는 안 된다.** q024는 지금 보기 4개 중
Glacier가 `S3 Glacier Deep Archive` 하나뿐이라, 법 키워드를 넣으면 조회 시간을 몰라도
답이 정해진다. 그래서 q024는 **보기 하나를 교체해 Glacier 보기를 2개로 만든 뒤** 키워드를 넣는다.

`S3 Glacier Instant Retrieval`이 "즉시 조회 가능" 쪽으로 분류된다는 것은 원본 PAGE 8의
`[즉시 조회 여부]` 목록과 개념 `s3-storage-classes.retrieval-time`에 이미 있다.

## 읽어야 할 파일

- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `docs/source/concepts-raw.md` PAGE 8 — 근거. 문장을 그대로 옮기지 마라(ADR-009).

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`questions.json`을 고쳐 통과시킨다.

### 1. q021 — prompt와 explanation

```
prompt 지금:  조회에 최대 1시간이 걸려도 되는 데이터에 맞는 클래스는?
prompt 바꿔:  법·감사·규정 목적으로 장기 보관하는 데이터 중, 조회에 최대 1시간이 걸려도 되는 것에 맞는 클래스는?
```

```
explanation 바꿔:  S3 Glacier Flexible Retrieval은 조회에 최대 1시간이 걸려도 될 때 쓴다. Instant는 즉시 조회하고 Deep Archive는 최대 12시간이며, Standard-IA는 Glacier가 아니라 법·감사·규정 목적의 장기 보관에 쓰지 않는다.
```

`choices`와 `answerIndex`는 **그대로 둔다.**

### 2. q022 — prompt와 explanation

```
prompt 지금:  조회에 최대 12시간이 걸려도 되는 데이터에 맞는 클래스는?
prompt 바꿔:  법·감사·규정 목적으로 장기 보관하는 데이터 중, 조회에 최대 12시간이 걸려도 되는 것에 맞는 클래스는?
```

```
explanation 바꿔:  S3 Glacier Deep Archive는 조회에 최대 12시간이 걸릴 수 있다. Flexible은 최대 1시간, Instant는 즉시 조회하며, One Zone-IA는 Glacier가 아니라 법·감사·규정 목적의 장기 보관에 쓰지 않는다.
```

`choices`와 `answerIndex`는 **그대로 둔다.**

### 3. q024 — prompt, choices, explanation

```
prompt 지금:  다음 중 즉시 조회가 가능하다고 분류되지 않은 클래스는?
prompt 바꿔:  법·감사 목적으로 장기 보관하는 클래스 중, 즉시 조회가 가능하다고 분류되지 않은 것은?
```

`choices`에서 **두 번째 항목 `S3 One Zone-IA`를 `S3 Glacier Instant Retrieval`로 바꾼다.**
나머지 세 항목과 순서는 그대로다.

```
choices 지금:  ["S3 Standard-IA", "S3 One Zone-IA",              "S3 Intelligent-Tiering", "S3 Glacier Deep Archive"]
choices 바꿔:  ["S3 Standard-IA", "S3 Glacier Instant Retrieval", "S3 Intelligent-Tiering", "S3 Glacier Deep Archive"]
```

`answerIndex`는 **3 그대로다.** 정답 보기 `S3 Glacier Deep Archive`의 위치가 바뀌지 않았다.

```
explanation 바꿔:  S3 Glacier Deep Archive는 조회에 최대 12시간이 걸릴 수 있다. 같은 Glacier 계열이라도 Instant Retrieval은 즉시 조회되고, Standard-IA와 Intelligent-Tiering도 즉시 조회할 수 있다.
```

**이 세 문항이 이 step의 데이터 변경 전부다.**

### 핵심 규칙 — 벗어나지 마라

- **q018을 건드리지 마라.** q018은 정답이 `S3 Standard-IA`이면서 문제문이
  "법·감사 목적의 장기 보관은 **아니면서**"로 시작한다. 이 부정형이 "법이 보이면 무조건
  Glacier"라는 잘못된 암기를 막는 안전장치다. prompt·choices·explanation 모두 그대로 둔다.
- **q020, q023을 건드리지 마라.** 이미 법 키워드가 있다.
- **다른 문항, `topics.json`, 개념 텍스트를 건드리지 마라.** 개념에는 이미 같은 사실이 있다.
- **문항 수(246)와 id 목록을 바꾸지 마라.** 문항을 추가·삭제하지 않는다.
- **q024 외의 문항에서 `choices`나 `answerIndex`를 바꾸지 마라.**
- **`docs/source/concepts-raw.md`의 문장을 그대로 옮기지 마라.** 위에 적힌 문장을 쓴다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 세 개를 덧붙인다.
기존 `it`을 수정하거나 지우지 마라.

```ts
it('정답이 Glacier 계열인 문항은 모두 법·감사 목적을 문제문에 담는다', () => {
  const glacierAnswered = questions.filter((question) =>
    question.choices[question.answerIndex].includes('Glacier'),
  )

  expect(glacierAnswered.map(({ id }) => id)).toEqual([
    'q020',
    'q021',
    'q022',
    'q023',
    'q024',
  ])
  glacierAnswered.forEach((question) => {
    expect(question.prompt).toContain('법')
    expect(question.prompt).toContain('감사')
  })
})

it('법·감사 키워드가 Glacier의 무조건 신호가 되지 않도록 q018이 부정형을 유지한다', () => {
  const question = questions.find(({ id }) => id === 'q018')

  expect(question?.choices[question.answerIndex]).toBe('S3 Standard-IA')
  expect(question?.prompt).toContain('아니면서')
})

it('q024는 Glacier 보기를 둘 이상 두어 법 키워드만으로 답이 정해지지 않는다', () => {
  const question = questions.find(({ id }) => id === 'q024')
  const glacierChoices = question?.choices.filter((choice) => choice.includes('Glacier')) ?? []

  expect(glacierChoices.length).toBeGreaterThanOrEqual(2)
  expect(question?.choices[question.answerIndex]).toBe('S3 Glacier Deep Archive')
})
```

## 검증 절차

아래를 그대로 실행하고 출력을 step 출력에 붙여라.

```bash
npm run test
npm run lint
npm run build
```

```bash
python3 - <<'EOF'
import json
qs = json.load(open('src/data/questions.json'))
by = {q['id']: q for q in qs}
g = [q for q in qs if 'Glacier' in q['choices'][q['answerIndex']]]
print('문항 수', len(qs), '(기대 246)')
print('Glacier 정답 id', [q['id'] for q in g], "(기대 ['q020','q021','q022','q023','q024'])")
print("법 포함", sum(1 for q in g if '법' in q['prompt']), '(기대 5)')
print("감사 포함", sum(1 for q in g if '감사' in q['prompt']), '(기대 5)')
q18 = by['q018']
print('q018 정답', q18['choices'][q18['answerIndex']], "(기대 S3 Standard-IA)")
print("q018 부정형", '아니면서' in q18['prompt'], '(기대 True)')
q24 = by['q024']
print('q024 Glacier 보기 수', sum(1 for c in q24['choices'] if 'Glacier' in c), '(기대 2)')
print('q024 answerIndex', q24['answerIndex'], '(기대 3)')
print('q024 정답', q24['choices'][q24['answerIndex']], '(기대 S3 Glacier Deep Archive)')
print('One Zone-IA 정답 문항', [q['id'] for q in qs if q['choices'][q['answerIndex']] == 'S3 One Zone-IA'], "(기대 ['q019'])")
EOF
```

`git diff --stat`이 `src/data/questions.json`과 `src/data/data.test.ts` **두 파일만**
보여야 한다(`phases/` 갱신 제외).

## 완료 조건

- 위 세 명령이 모두 통과한다.
- 검증 스크립트의 모든 줄이 기대값과 일치한다.
- 변경된 파일이 `src/data/questions.json`, `src/data/data.test.ts` 둘뿐이다.
