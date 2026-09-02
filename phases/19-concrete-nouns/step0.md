# Step 0: concrete-nouns

## 배경 — 막연한 일반 명사에 가리키는 대상이 없다

phase 17·18이 문항 앞에 상황 문장을 세우는 방식으로 33문항을 고쳤다. 그런데 사용자가
또 다른 모양의 사례를 지적했다.

> "여러 작업을 순서대로 연결하고 재시도와 오류 처리를 관리하는 서비스는?" 이 문제에서도
> 작업이 어떤 작업을 말하는 건지 모르겠어.

`q088`이다. 앞의 두 유형(처음 나온 용어를 전제, 수식어에 뜻이 없음)과 달리 **일반 명사
"작업"에 가리키는 대상이 없는** 경우다.

고치는 방법도 다르다. 앞에 설명 문장을 덧붙이는 대신 **그 명사를 구체적인 사례로 바꿔
넣는다.** 사용자의 표현으로는 "람다가 하는 작업을 작업 대신 문제에 쓰면 되는 거 아니야?"다.

이 방식이 리드인보다 나은 이유는 두 가지다. 프롬프트가 길어지지 않고, **보기에 있는
서비스명을 꺼내지 않아도 된다.** 출처상 "작업"의 정체는 `Lambda`인데(`step-functions`
개념 문단 0의 "Lambda 등의 작업") `Lambda`가 `q088`의 보기 중 하나여서, 언급하면
오답 하나가 소거된다. 구체적 사례로 바꾸면 소거 없이 대상이 잡힌다.

## 이 step이 새 사실을 넣지 않는다는 근거

구체적 사례는 **문제 은행 안에서 가져온다.** 없던 예를 만드는 것이 아니라 여러 문항에
흩어진 용례를 끌어오는 것이라, phase 14가 쓴 방법과 같고 출처 제한을 어기지 않는다.

| 상황 문장이 쓰는 사실 | 근거 |
|---|---|
| 이미지 리사이징이 그런 처리의 예다 | `q097` 프롬프트 — "S3 이미지 업로드 뒤 Lambda 이미지 리사이징을 실행하도록 연결할 때 사용하는 서비스는?" |
| 보고서 발송이 그런 처리의 예다 | `q207` 프롬프트 — "Lambda가 만든 보고서를 담당자에게 이메일로 발송할 때 가장 적합한 서비스는?" |
| 여러 처리를 정해진 순서로 이어 실행한다 | `topics.json` `serverless-containers.step-functions` summary — "여러 작업을 정해진 순서로 이어 실행하는 서비스다" |
| 각 단계의 재시도와 오류 처리를 맡는다 | 같은 개념 문단 0 — "각 단계의 실행 상태와 재시도, 오류 처리, 실패를 자동으로 관리한다" |

**ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.**

**서로 다른 문항의 사례를 하나의 시나리오로 합치지 마라.** "S3에 올라온 이미지를
리사이징하고 그 결과를 메일로 보내는 것처럼"이라고 쓰면 `q097`과 `q207`을 이어 붙인
흐름이 되는데, 그 연결은 출처 어디에도 없다. **나란히 나열하는 데서 멈춘다.**

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010.
- `src/data/topics.json` — 근거를 확인만 한다. **고치지 마라.**
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/topics-baseline.json` — `questionsSha256`을 갱신한다.
- `phases/17-leadin-questions/step0.md`, `phases/18-assumed-terms/step0.md` — 선례.
  특히 phase 18의 "대상에서 제외한 문항" 표를 읽어라. 그 5문항은 손대면 정답이 드러난다.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`questions.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/questions.json`은 **문항 하나가 정확히 한 줄**인 포맷이다(전체 248줄).

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** 한 줄 포맷이 깨진다.
- 해당 문항의 줄에서 **`"prompt":"..."` 의 값만** 제자리에서 치환해라.
- 따옴표·역슬래시가 없으므로 JSON 이스케이프가 필요 없다. 그대로 넣는다.

### 문항별 지금 / 바꿔

**q088** (`serverless-containers.step-functions`)

```
지금:
여러 작업을 순서대로 연결하고 재시도와 오류 처리를 관리하는 서비스는?
```
```
바꿔:
이미지 리사이징이나 보고서 발송 같은 처리 여러 개를 정해진 순서로 이어 실행하고, 각 단계의 재시도와 오류 처리를 맡는 서비스는?
```

**이 한 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 1개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·
  `answerIndex`·`explanation`은 한 글자도 바뀌면 안 된다.
- **`q088` 외의 문항을 고치지 마라.**
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/topics.json`을 건드리지 마라.**
- `scripts/topics-baseline.json`의 **`questionsSha256`만** 갱신한다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 덧붙인다.

```ts
it('막연한 일반 명사를 쓰던 문항이 구체적 사례로 바뀐다', () => {
  const question = questions.find(({ id }) => id === 'q088')

  expect(question?.prompt).toBe('이미지 리사이징이나 보고서 발송 같은 처리 여러 개를 정해진 순서로 이어 실행하고, 각 단계의 재시도와 오류 처리를 맡는 서비스는?')
  // 보기에 있는 서비스명을 꺼내면 오답이 소거된다.
  question?.choices.forEach((choice) => {
    expect(question.prompt).not.toContain(choice)
  })
})
```

## 검증 절차

```bash
node -e "const fs=require('fs'),c=require('crypto');const sha=c.createHash('sha256').update(fs.readFileSync('src/data/questions.json')).digest('hex');const b=JSON.parse(fs.readFileSync('scripts/topics-baseline.json','utf8'));b.questionsSha256=sha;fs.writeFileSync('scripts/topics-baseline.json',JSON.stringify(b,null,2)+'\n');console.log('questionsSha256 ->',sha)"
```

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const old=JSON.parse(execSync('git show HEAD:src/data/questions.json').toString());
const now=JSON.parse(readFileSync('src/data/questions.json','utf8'));
const om=Object.fromEntries(old.map(x=>[x.id,x]));
console.log('문항 수', old.length, '->', now.length, '(기대 246 -> 246)');
let fieldOk=true;
for(const n of now){ const o=om[n.id];
  for(const k of ['id','topicId','conceptId','answerIndex','explanation']) if(o[k]!==n[k]){fieldOk=false;console.log('  필드 변경!',n.id,k);}
  if(JSON.stringify(o.choices)!==JSON.stringify(n.choices)){fieldOk=false;console.log('  보기 변경!',n.id);} }
console.log('prompt 외 필드 그대로', fieldOk, '(기대 true)');
const changed=now.filter(n=>om[n.id].prompt!==n.prompt).map(n=>n.id);
console.log('prompt가 바뀐 문항', changed.join(' '), '(기대 q088)');
const q=now.find(x=>x.id==='q088');
const hit=q.choices.filter(c=>q.prompt.includes(c));
console.log('길이', q.prompt.length, '(<=120)', q.prompt.length<=120);
console.log('보기 문자열 등장', hit.length?hit.join(','):'없음', '(기대 없음)');
"
```

```bash
grep -c '^{"id":"q' src/data/questions.json   # 246
```

## 완료 조건

- `test`·`lint`·`build`·`check-structure`가 모두 통과한다.
- **`prompt`가 바뀐 문항이 `q088` 하나**이고 `prompt` 외 필드가 전부 불변이다.
- `q088`의 프롬프트에 **보기 문자열이 하나도 등장하지 않는다**.
- `grep -c`가 246을 출력한다.
- 변경된 파일이 `questions.json`·`data.test.ts`·`topics-baseline.json` 셋뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 정답 분포 테스트가 깨진다.
- **프롬프트에 `Lambda`를 쓰지 마라.** 이유: `q088`의 보기 중 하나여서, 언급하면
  "Lambda는 오케스트레이터가 아니다"가 드러나 오답 하나가 소거된다.
- **`q097`과 `q207`의 사례를 하나의 흐름으로 엮지 마라.** 이유: 그 연결은 출처에 없다.
- 기존 테스트를 깨뜨리지 마라.

---

## 이 phase 이후에 남는 일

여기까지는 사용자와 확정한 범위다. 아래는 **아직 확정하지 않은 것**이므로,
착수하기 전에 사용자에게 범위를 확인받아라.

1. **phase 18에서 제외한 5문항 재검토** — `q053`·`q057`·`q114`·`q144`는 상황 문장을
   붙이면 개념 summary가 곧 정답이 되어 제외했다. 그런데 이 phase의 "명사를 구체적
   사례로 바꾼다"는 방식으로는 풀릴 수 있다. 예컨대 `q114` "Site-to-Site VPN과
   Direct Connect의 **공통 목적**은?"의 "공통 목적"이 막연한 명사다. 다시 검토할 가치가
   있다. **단, 검토 결과 여전히 정답이 드러난다면 phase 18의 제외 판단을 유지하고
   그 사유를 갱신해라.** `q160`은 프롬프트가 이미 성질을 설명하므로 고칠 것이 없다.

2. **246문항 전수 읽기** — 기계적 필터로 후보를 뽑는 방식은 세 번 연속 실패했다.
   사용자가 지적한 `q243`·`q156`·`q088`은 결함의 모양이 매번 달랐고, 정규식이나
   "다른 문항의 정답인 용어를 쓰는가" 같은 지표는 한 유형만 잡고 나머지를 놓쳤다.
   후보 76개를 뽑아도 대부분 `Lambda`·`온프레미스`처럼 전제해도 되는 기본 어휘였다.
   **처음 보는 학습자의 눈으로 246문항의 프롬프트를 직접 읽는 것 외에 방법이 없다.**
   필터는 우선순위 참고로만 쓰고 대상 선정의 근거로 삼지 마라.

3. **개념 본문의 같은 공백** — 문항이 아니라 개념 쪽 문제다. `serverless-containers.lambda`는
   서버리스·콜드 스타트·15분 제한을 다섯 문단에 걸쳐 설명하면서 **Lambda가 무슨 일을
   하는지 예를 한 번도 들지 않는다.** `cost-management.cost-allocation-tag-activation`도
   태그가 무엇인지 말하지 않고 활성화 순서만 가르친다. 섹션 모드로 개념을 읽고 들어오는
   경로에서는 이 공백이 그대로다. Lambda의 경우 용례가 `q097`·`q205`·`q207`에 있어
   ADR 개정 없이 가능하지만, 항목마다 출처 유무를 따로 확인해야 한다.
