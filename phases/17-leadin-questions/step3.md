# Step 3: leadin-network

## 배경 — 확인 문제가 시험지처럼 읽힌다

이 앱은 시험 시뮬레이터가 아니라 학습 도구다(CLAUDE.md). 그런데 `q170`~`q246` 77문항은
`docs/source/exam-gaps.md`에서 나왔고, 그 파일은 **덤프 해설에서 정답 근거로 쓰인 것만**
추린 문서다. 설계상 정의가 아니라 함정만 모여 있다.

그 결과 문항이 "정의를 주고 이름을 되묻는" 단답 매칭이 되었다. 이미 다 공부한 사람에게는
점검이 되지만, 처음 보는 사람은 **용어가 어디서 나온 말인지부터 막힌다.** 특히 랜덤 문제는
개념을 읽지 않고 문항으로 바로 들어오기 때문에 이 공백이 그대로 드러난다.

이 phase는 그런 문항 29개의 `prompt` 앞에 **상황 한 문장**을 세워, 읽는 것만으로 대상이
무엇이고 왜 쓰는지가 잡히게 한다. 이 step은 그중 VPC·하이브리드·DNS·분석 5문항을 맡는다.

`step0`~`step2`가 먼저 실행되었다면 `q171`~`q200` 일부의 프롬프트가 이미 길어져 있다.
**그 문항들을 다시 건드리지 마라.** 이 step의 대상과 겹치지 않는다.

## 이 step이 새 사실을 넣지 않는다는 근거

상황 문장의 사실은 전부 두 출처 안에 있다. ADR-006·ADR-008·ADR-009의 출처 제한 안에서
끝나며, **ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.**

| 문항 | 상황 문장이 쓰는 사실 | 근거 |
|---|---|---|
| q210 | Egress-only IGW는 NAT 게이트웨이가 하는 역할(안에서 밖으로만 나가기)을 담당한다 | `exam-gaps.md` `egress-only-igw` — "NAT 게이트웨이가 하는 역할(안에서 밖으로만 나가기)" |
| q213 | S3는 VPC나 서브넷 안에 만들 수 없는 리전 수준 서비스다 | `exam-gaps.md` `s3-is-regional` — 한 줄 "S3는 VPC나 서브넷 안에 만들 수 없고" |
| q215 | 일관되고 낮은 지연 시간과 수백 개 VPC 연결이 동시에 요구된다 | `exam-gaps.md` `direct-connect-gateway` — "'일관되고 낮은 지연 시간'(Direct Connect)과 '수백 개 VPC 연결'(Transit Gateway)이 동시에 요구되면" |
| q221 | 각 레코드에 헬스 체크가 연동돼 장애가 난 곳은 응답에서 빠지고, 무작위로 반환한다 | `exam-gaps.md` `multivalue-answer-details` — 한 줄 "최대 8개의 정상 레코드를 무작위로 반환하며, 각 레코드에 헬스 체크를 연동할 수 있다", "장애가 난 곳은 응답에서 빠진다" |
| q222 | S3에 막 들어온 데이터를 Athena로 곧바로 분석한다 | `exam-gaps.md` `glue-crawler` — "S3에 막 들어온 데이터를 신속하게 분석해야 하는 문제에서 Crawler + Athena 조합이 정석이다" |

**출처에 없어서 이 step이 쓰지 않는 것** — 넣으면 `blocked`다.

- `q210`의 상황 문장에 **`IPv4`를 쓰지 마라.** 출처는 "IPv4에서 NAT 게이트웨이가 하는
  역할을 IPv6에서 담당한다"라고 쓰지만, `IPv4`를 언급하는 순간 보기 `IPv4`·`퍼블릭 IPv4`가
  소거되어 답이 드러난다. `NAT 게이트웨이처럼`까지만 쓴다.
- `q213`의 상황 문장에 **"보안 그룹도 쓰지 않는다"를 쓰지 마라.** 보기 `보안 그룹`을
  직접 지워주는 서술이다.
- `q221`의 상황 문장에 **숫자를 쓰지 마라.** `8개`가 정답이다.
- `q222`의 상황 문장에 **Glue Job과의 대비를 넣지 마라.** 보기 `AWS Glue Job`을 지워준다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010 — 무엇을 쓸 수 있고 무엇을 못 쓰는지.
- `docs/source/exam-gaps.md` — 이 step이 근거로 삼는 유일한 원본 파일.
  (`docs/source/concepts-raw.md`는 저장소에 없다. ADR-009에 따라 gitignore된 유료 교재
  추출본이며, 이 step의 5문항은 전부 `exam-gaps.md`에서 나왔으므로 필요하지 않다.)
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/topics-baseline.json` — `questionsSha256`을 갱신한다.
- `scripts/check-structure.mjs` — 구조 가드레일. 이 step에서 반드시 통과해야 한다.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`questions.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/questions.json`은 **문항 하나가 정확히 한 줄**인 포맷이다(전체 248줄).

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** `JSON.stringify`로 통째로 다시 쓰면
  한 줄 포맷이 깨져 diff를 사람이 읽을 수 없게 된다.
- 해당 문항의 줄에서 **`"prompt":"..."` 의 값만** 제자리에서 치환해라.
- 아래 문자열에는 따옴표·역슬래시가 없으므로 **JSON 이스케이프가 필요 없다.** 그대로 넣는다.
- 줄바꿈을 넣지 마라.

### 문항별 지금 / 바꿔

**q210** (`vpc-networking.egress-only-igw`)

```
지금:
Egress-only 인터넷 게이트웨이가 아웃바운드 통신을 제공하는 IP 버전은?
```
```
바꿔:
Egress-only 인터넷 게이트웨이는 NAT 게이트웨이처럼 안에서 밖으로 나가는 통신만 담당한다. 이 게이트웨이가 아웃바운드 통신을 제공하는 IP 버전은?
```

**q213** (`vpc-networking.s3-is-regional`)

```
지금:
S3 버킷의 접근 제어에 사용하는 것은?
```
```
바꿔:
S3는 VPC나 서브넷 안에 만들 수 없는 리전 수준 서비스다. 이런 S3 버킷의 접근 제어에 사용하는 것은?
```

**q215** (`hybrid-connectivity.direct-connect-gateway`)

```
지금:
Direct Connect와 Transit Gateway를 통합해 대규모 하이브리드 네트워크를 구성하는 통로는?
```
```
바꿔:
일관되고 낮은 지연 시간과 수백 개 VPC 연결이 동시에 필요한 하이브리드 네트워크를 만들려 한다. Direct Connect와 Transit Gateway를 묶는 통로는?
```

**q221** (`route53.multivalue-answer-details`)

```
지금:
다중값 응답 라우팅이 한 번에 반환할 수 있는 정상 레코드의 최댓값은?
```
```
바꿔:
다중값 응답 라우팅은 각 레코드에 연동된 헬스 체크로 장애가 난 곳을 빼고 무작위로 응답한다. 이 정책이 한 번에 반환할 수 있는 정상 레코드의 최댓값은?
```

**q222** (`analytics-monitoring.glue-crawler`)

```
지금:
S3 데이터를 스캔해 구조를 파악하고 Athena가 쿼리할 수 있도록 준비하는 기능은?
```
```
바꿔:
S3에 막 들어온 데이터를 Athena로 곧바로 분석하려 한다. 데이터를 스캔해 구조를 파악하고 쿼리할 수 있는 상태로 준비하는 기능은?
```

**이 5개 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 5개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·`answerIndex`·
  `explanation`은 한 글자도 바뀌면 안 된다. 이유: 문항이 `conceptId`로 개념을 참조하고,
  `data.test.ts`가 정답 분포와 주제별 문항 수를 하드코딩으로 검증한다.
- **위에 적힌 5문항 외의 문항을 고치지 마라.** 나머지는 다른 step이 맡는다.
  특히 `q209`·`q211`·`q212`·`q214`·`q218`·`q219`·`q220`·`q223`은 이미 상황형이고,
  `q216`·`q217`은 용어의 뜻 자체를 묻는 문항이라 대상이 아니다.
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/topics.json`을 건드리지 마라.** 개념 본문은 이 phase의 범위가 아니다.
- **`docs/source/`의 문장을 그대로 옮기지 마라**(ADR-009). 위 문자열은 이미 그 규칙에 맞게
  다시 쓴 것이므로, 그대로 넣으면 된다.
- `scripts/topics-baseline.json`의 **`questionsSha256`만** 갱신한다. `conceptLineCount`와
  `topics`는 건드리지 마라.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 하나를 덧붙인다.
기존 `it`을 수정하거나 지우지 마라.

```ts
it('네트워크·분석 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q210).toBe('Egress-only 인터넷 게이트웨이는 NAT 게이트웨이처럼 안에서 밖으로 나가는 통신만 담당한다. 이 게이트웨이가 아웃바운드 통신을 제공하는 IP 버전은?')
  expect(prompts.q213).toBe('S3는 VPC나 서브넷 안에 만들 수 없는 리전 수준 서비스다. 이런 S3 버킷의 접근 제어에 사용하는 것은?')
  expect(prompts.q215).toBe('일관되고 낮은 지연 시간과 수백 개 VPC 연결이 동시에 필요한 하이브리드 네트워크를 만들려 한다. Direct Connect와 Transit Gateway를 묶는 통로는?')
  expect(prompts.q221).toBe('다중값 응답 라우팅은 각 레코드에 연동된 헬스 체크로 장애가 난 곳을 빼고 무작위로 응답한다. 이 정책이 한 번에 반환할 수 있는 정상 레코드의 최댓값은?')
  expect(prompts.q222).toBe('S3에 막 들어온 데이터를 Athena로 곧바로 분석하려 한다. 데이터를 스캔해 구조를 파악하고 쿼리할 수 있는 상태로 준비하는 기능은?')
})

it('네트워크 보충 문항의 상황 문장이 오답을 대신 지워주지 않는다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q210).not.toContain('IPv4')
  expect(prompts.q213).not.toContain('보안 그룹')
  expect(prompts.q221).not.toContain('8개')
  expect(prompts.q222).not.toContain('Glue Job')
})
```

## 검증 절차

먼저 `questionsSha256`을 갱신한다. 이걸 하기 전에는 `check-structure.mjs`가 반드시 실패한다.

```bash
node -e "const fs=require('fs'),c=require('crypto');const sha=c.createHash('sha256').update(fs.readFileSync('src/data/questions.json')).digest('hex');const b=JSON.parse(fs.readFileSync('scripts/topics-baseline.json','utf8'));b.questionsSha256=sha;fs.writeFileSync('scripts/topics-baseline.json',JSON.stringify(b,null,2)+'\n');console.log('questionsSha256 ->',sha)"
```

그다음 아래를 그대로 실행하고 출력을 step 출력에 붙여라.

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

변경 범위를 확인한다. `HEAD`는 직전 step까지 반영된 상태이므로, **이 step에서 바뀐 문항만**
잡혀야 한다.

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const TARGET=['q210','q213','q215','q221','q222'];
const old=JSON.parse(execSync('git show HEAD:src/data/questions.json').toString());
const now=JSON.parse(readFileSync('src/data/questions.json','utf8'));
const om=Object.fromEntries(old.map(x=>[x.id,x]));
console.log('문항 수', old.length, '->', now.length, '(기대 246 -> 246)');
console.log('id 순서 그대로', old.map(x=>x.id).join()===now.map(x=>x.id).join(), '(기대 true)');
let fieldOk=true;
for(const n of now){ const o=om[n.id];
  for(const k of ['id','topicId','conceptId','answerIndex','explanation']) if(o[k]!==n[k]){fieldOk=false;console.log('  필드 변경!',n.id,k);}
  if(JSON.stringify(o.choices)!==JSON.stringify(n.choices)){fieldOk=false;console.log('  보기 변경!',n.id);} }
console.log('prompt 외 필드 그대로', fieldOk, '(기대 true)');
const changed=now.filter(n=>om[n.id].prompt!==n.prompt).map(n=>n.id);
console.log('prompt가 바뀐 문항', changed.join(' '));
console.log('대상과 정확히 일치', changed.join()===TARGET.join(), '(기대 true)');
for(const id of TARGET){ const q=now.find(x=>x.id===id); const a=q.choices[q.answerIndex];
  console.log(' ', id, '길이', q.prompt.length, '(<=120)', q.prompt.length<=120, '/ 정답 미노출', !q.prompt.includes(a)); }
const banned=/원본에서|원본은|문서에서|본문에서|위 글에 따르면/;
console.log('금지 표현 없음', !now.some(n=>banned.test(n.prompt)), '(기대 true)');
"
```

```bash
grep -c '^{"id":"q' src/data/questions.json   # 246 (문항 한 줄 포맷 유지)
```

`git diff --stat`이 `src/data/questions.json`, `src/data/data.test.ts`,
`scripts/topics-baseline.json` **세 파일만** 보여야 한다(`phases/` 갱신 제외).

## 완료 조건

- 위 네 명령(`test`·`lint`·`build`·`check-structure`)이 모두 통과한다.
- 검증 스크립트에서 **`prompt`가 바뀐 문항이 정확히 `q210` `q213` `q215` `q221` `q222`**이고,
  **`prompt` 외 필드 그대로 / id 순서 그대로 / 금지 표현 없음이 전부 `true`**다.
- 5문항 모두 길이 120자 이하이고 정답 문자열을 노출하지 않는다.
- 소거 방지 테스트(`IPv4`·`보안 그룹`·`8개`·`Glue Job` 미포함)가 통과한다.
- `grep -c`가 246을 출력한다.
- 변경된 파일이 위 세 개뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 이유: `data.test.ts`가 `q170`~`q246` 구간의 정답 분포가
  20~30% 범위에 있는지 검사한다. 하나만 바꿔도 깨진다.
- **`q210`에 `IPv4`, `q213`에 `보안 그룹`, `q221`에 숫자, `q222`에 `Glue Job`을 넣지 마라.**
  이유: 넷 다 보기를 직접 지워주는 서술이라, 상황을 세우는 게 아니라 답을 알려주게 된다.
- **상황 문장에 정답 보기의 문자열을 넣지 마라.**
- **모델이 아는 AWS 지식으로 상황을 지어내지 마라.** 위 근거 표에 없는 사실이 필요하다고
  판단되면 문장을 바꾸지 말고 `blocked`로 멈춰라.
- 기존 테스트를 깨뜨리지 마라.
