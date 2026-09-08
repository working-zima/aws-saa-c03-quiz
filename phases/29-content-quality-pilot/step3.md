# Step 3: question-prompt-leak

이 phase는 **콘텐츠 품질 시범 개선**이다. 사용자가 실제 화면(`S3 암호화(SSE)·Batch
Operations·인벤토리` 주제 = `s3-encryption-batch`)을 읽다가 막혀서 낸 지적 일곱 가지를
주제 하나에서 전부 고쳐 기준을 세우는 것이 목표다. 나머지 38개 주제로 넓히는 것은
**이 phase의 범위가 아니다.**

이 step은 그중 **④ 프롬프트에 답이 드러난다**를 고친다. 대상은 `s3-encryption-batch`
주제의 문항 16개 중 아래에 적은 것들이다.

## 읽어야 할 파일

- `CLAUDE.md`
- `docs/ADR.md` — **ADR-005**(4지선다 단일정답), **ADR-011**(문항과 보기를 열 때마다 섞는다),
  **ADR-015**(해설의 약어에 풀네임을 괄호로), **ADR-026**(문제 은행 크기를 개념 커버리지로
  정한다 — 「해설을 짧게 쓰지 않는 이유」를 반드시 읽어라), **ADR-027**(해설의 근거는 어디인가)
- `docs/PRD.md` — 「문제 은행」의 오답 보기 구성 규칙
- `src/data/topics.json` — 주제 `s3-encryption-batch`. step 1·2가 이 주제를 이미 고쳤다.
  **고쳐진 본문을 읽어라.** 해설의 근거는 이 본문이다(ADR-027).
- `src/data/questions.json` — `topicId`가 `s3-encryption-batch`인 문항 16개
- `src/data/data.test.ts` — 특히 구간별 `answerIndex` 분포 단언과 해설 길이 하한(187자)
- `scripts/topics-baseline.json` — `questionsSha256`
- `docs/source/exam-gaps.md`, `docs/source/dump-gaps/`

## 사용자가 지적한 것 — 원문

> `AWS KMS가 암호화 키를 생성하고 관리하는 방식은?` → 정답 `SSE-KMS`.
> **답이 문제만 봐도 뭔지 알 수 있잖아.**

프롬프트의 `KMS`와 보기의 `SSE-KMS`가 글자로 이어져 **개념을 몰라도 골라진다.** 이런 문항은
푸는 행위가 학습이 되지 않는다. 이 앱은 시험 시뮬레이터가 아니라 학습 도구다(CLAUDE.md).

**규칙**: 정답 보기의 이름이나 그 이름의 일부를 프롬프트에 쓰지 마라. 대신 **그 개념이
해결하는 상황**을 써서 상황과 개념을 잇게 한다.

## 조사로 확인된 사실 — 이 주제에서 걸리는 문항

`sse-types` 개념 하나에 문항이 넷 걸려 있고, 셋이 개념 본문의 항목을 그대로 되읽는다.

| id | conceptId | 프롬프트 | 정답 | 무엇이 새는가 |
|---|---|---|---|---|
| `q034` | `sse` | S3에 저장하는 파일은 암호화로 보호하며 이 과정에는 키가 필요하다. 이때 **서버가 자체적으로** 데이터를 암호화하는 방식을 무엇이라 하는가? | `SSE` | 「서버 측 암호화」의 뜻이 프롬프트에 그대로 있다. 그리고 오답이 `KMS`·`CloudHSM`·`ACM`으로 **범주가 다르다** — 암호화 방식이 아니라 키·인증서 서비스다 |
| `q035` | `sse-types` | **S3가** 키를 생성하고 관리하는 가장 기본적인 방식은? | `SSE-S3` | `S3가` → `SSE-S3` |
| `q036` | `sse-types` | **AWS KMS가** 암호화 키를 생성하고 관리하는 방식은? | `SSE-KMS` | `KMS` → `SSE-KMS`. 사용자가 직접 지적한 자리 |
| `q038` | `sse-types` | **고객이** 암호화 키를 직접 생성하고 관리하는 방식은? | `SSE-C` | `고객(Customer)` → `SSE-C`. 그리고 개념 본문 `paragraphs[3]`을 거의 그대로 되읽는다 |
| `q037` | `sse-types` | 키를 재사용해 **SSE-KMS** 암호화 비용을 줄이는 기능은? | `S3 Bucket Key` | 정답 문자열은 새지 않는다. 대신 **`q174`와 사실상 같은 문항이다** |
| `q174` | `sse-kms-cost` | SSE-KMS는 객체를 암호화할 때마다 KMS API를 불러서 객체가 많으면 호출 비용이 급증한다. 암호화 방식은 그대로 두고 이 비용을 줄이는 기능은? | `S3 Bucket Key` | `q037`과 묻는 것이 같다. 둘 다 남기려면 무엇이 다른지가 있어야 한다 |

`q039`·`q173`·`q276`~`q283`은 이 결함이 없다. **손대지 마라.**

## 작업

### 1. 위 표의 문항을 다시 쓴다

각 문항의 `prompt`와, 필요하면 `choices`의 문구를 고친다. **`explanation`도 함께 고친다** —
프롬프트가 바뀌면 해설이 가리키는 것이 어긋난다.

`sse-types`의 세 문항(`q035`·`q036`·`q038`)은 **한 개념의 세 갈래를 각각 묻는 구조**다.
갈래를 가르는 축이 "키를 누가 만들고 관리하는가" 하나뿐이라, 그 축을 프롬프트에 쓰지 않고
셋을 구별해 묻는 것이 이 step의 어려운 부분이다. 방향 두 가지를 적어 둔다 —
**어느 쪽을 택할지는 네가 판정한다.**

- **요구로 갈라 묻는다.** 각 방식이 무엇을 주고 무엇을 못 주는지가 개념 본문에 있다
  (SSE-S3는 관리가 쉽고 기본, SSE-KMS는 자동 교체와 감사 추적, SSE-C는 고객 부담).
  "운영이 가장 단순한 쪽"·"키 사용 내역이 남아야 하는 쪽"처럼 **요구를 주고 방식을 고르게 한다.**
  이때 같은 주제의 `q173`(봉투 암호화 + 자동 교체 → SSE-KMS)·`q282`(step 4가 다시 쓴다)와
  **묻는 것이 겹치지 않는지 반드시 확인하라.**
- **상황으로 갈라 묻는다.** `docs/source/exam-gaps.md`와 `docs/source/dump-gaps/`에 이 주제의
  덤프 인용이 있다. 거기 있는 상황을 써라.

`q034`는 둘을 고친다. 프롬프트에서 「서버 측」의 뜻풀이를 빼고, **오답 셋을 같은 범주로
바꿔라** — 프롬프트가 암호화 방식을 물으면 오답도 암호화 방식이어야 한다. 이 주제 안에
`클라이언트 측 암호화`가 있고 `SSE-S3`·`SSE-KMS`·`SSE-C`가 있다. 단 정답이 `SSE`
(방식의 상위 이름)이므로 하위 방식들을 오답으로 놓으면 포함 관계가 어색해질 수 있다.
그 경우 **프롬프트가 묻는 범주를 바꾸는 쪽**을 검토하라.

`q037`과 `q174`는 **하나로 합치지 말고 지우지도 마라.** 두 문항이 다른 것을 묻게 갈라라.
개념 본문에 재료가 있다 — `sse-types`의 `paragraphs[2]`는 "파일마다 새 키를 만들지 않고
버킷 키를 재사용한다"는 **구조**를 말하고, `sse-kms-cost`는 "객체마다 KMS API를 부른다"는
**비용의 원인**과 "보안 수준은 그대로다"를 말한다. 한쪽은 무엇이 비용을 만드는가를,
다른 한쪽은 그것을 줄이면 무엇이 유지되는가를 묻는 식으로 갈릴 수 있다.

### 2. `scripts/topics-baseline.json`의 `questionsSha256`을 갱신한다

`src/data/questions.json`이 바뀌면 `check-structure.mjs`가 막는다. 파일을 고친 **뒤에**
sha256을 다시 계산해 baseline에 넣어라. 계산 방법은 `scripts/check-structure.mjs`에 있다
(파일 바이트 전체의 sha256이다).

### 3. 해설을 ADR-027의 근거로 다시 맞춘다

고친 문항의 `explanation`은 **정답이 왜 맞는지와 오답 셋이 왜 아닌지**를 담아야 하고,
사실의 근거는 셋뿐이다(ADR-027).

1. 그 문항 `conceptId`가 가리키는 개념의 `summary`·`paragraphs`
2. 오답 보기가 가리키는 개념의 본문 — 주제 밖이면 **사양·수치를 가져오지 말고** 그것이
   무엇인지(성격)만 쓴다
3. 그 개념이 `docs/source/exam-gaps.md`에 항목으로 있으면 그 항목

**이 셋 밖의 사실을 쓰지 마라. 모델이 아는 AWS 지식으로 메우지 마라.**

길이 하한은 **187자**이고 `src/data/data.test.ts`의 불변식이다. 길이는 목표가 아니라 통과
조건이다 — 넘기려고 같은 말을 늘려 쓰면 ADR-026·ADR-027을 어긴 것이다.

## Acceptance Criteria

```bash
npm test                          # 해설 길이 하한, answerIndex 분포, 중복 prompt 0건 등 전부 통과
npm run build                     # tsc 타입체크 포함, 에러 없음
node scripts/check-structure.mjs  # exit 0 — questionsSha256을 갱신했으므로 통과해야 한다
node scripts/coverage.mjs         # 618/618, exit 0
node scripts/explanation-audit.mjs s3-encryption-batch   # 미달 문항 0건
```

`explanation-audit.mjs`는 **`q001`~`q246` 구간만 본다**(스크립트 머리주석에 근거가 있다).
이 주제에서는 8개(`q034`~`q039`·`q173`·`q174`)가 걸리고 `q276`~`q283`은 걸리지 않는다.
732문항 전체의 187자 하한을 실제로 지키는 것은 `npm test`의 불변식이므로, 그쪽을 기준으로 삼아라.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. **고친 문항마다 정답 보기의 문자열을 프롬프트에서 찾아라.** 아래로 확인한다.

```bash
node -e "const q=require('./src/data/questions.json');const a=Array.isArray(q)?q:q.questions;
for(const x of a.filter(v=>v.topicId==='s3-encryption-batch')){
  const ans=x.choices[x.answerIndex];
  const toks=(ans.match(/[A-Za-z][A-Za-z0-9-]{2,}/g)||[]);
  const leak=toks.filter(t=>x.prompt.toUpperCase().includes(t.toUpperCase()));
  if(leak.length) console.log(x.id, JSON.stringify(leak), '|', ans, '|', x.prompt);
}"
```

   출력이 비어야 하는 것이 원칙이지만, **상황 단서로 정당한 경우는 남겨도 된다.**
   판정 기준은 "그 낱말이 프롬프트에 없으면 문제가 성립하지 않는가"다. 남긴 것이 있으면
   왜 정당한지 `summary`에 적어라.
3. **고친 문항을 개념 본문을 읽지 않은 사람의 눈으로 소리 내어 읽어라.** 글자만 맞춰 고를 수
   있는 자리가 남아 있으면 다시 고친다.
4. `phases/29-content-quality-pilot/index.json`의 step 3을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **고친 문항 id와 무엇으로 갈라 물었는지**를
     적어라. step 4가 `q282`를 다시 쓸 때 겹치지 않게 하려면 이 정보가 필요하다.
   - 3회 시도 후 실패 → `"status": "error"`, `"error_message"`

## 금지사항

- **문항을 더하거나 지우거나 순서를 바꾸지 마라.** 이유: `src/data/data.test.ts`가
  `questions.slice(178, 187)` 같은 **인덱스 구간**으로 단언을 걸고 있다. 하나만 더해도
  뒤의 모든 구간 단언이 다른 문항을 보게 된다. 그리고 문항을 지우면 개념 커버리지가
  깨진다(ADR-026, `coverage.mjs`).
- **`id`·`topicId`·`conceptId`·`answerIndex`를 바꾸지 마라.** 이유: `answerIndex`는 구간별
  정답 위치 분포 단언이 고정하고 있고, `conceptId`는 커버리지 계산의 기준이다. 고칠 것은
  `prompt`·`choices`·`explanation` 세 필드의 **문구**뿐이다.
- **`src/data/topics.json`을 건드리지 마라.** 이유: 개념 본문은 step 0·1·2가 이미 정했다.
  문항을 성립시키려고 개념 본문을 고치면 두 step이 같은 자리를 다투게 된다. 개념 본문에
  근거가 없어서 문항을 못 고치겠으면 **고치지 말고 그 문항을 그대로 두고 보고하라.**
- **`q039`·`q173`·`q276`~`q283`을 손대지 마라.** 이유: 이 결함이 없는 문항이고,
  `q281`·`q282`는 step 4의 대상이다.
- **모델이 아는 AWS 지식으로 프롬프트의 상황을 지어내지 마라.** 이유: ADR-009·ADR-027의
  금지다. 상황도 사실이다. `docs/source/exam-gaps.md`·`docs/source/dump-gaps/`나 개념 본문
  안에서 찾아라.
- **오답 보기를 프롬프트가 묻는 범주 밖에서 고르지 마라.** 이유: 정답만 그 범주에 속하면
  개념을 몰라도 소거로 풀린다. `q034`가 지금 그 상태다.
- 기존 테스트를 깨뜨리지 마라.
