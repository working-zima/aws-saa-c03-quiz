# Step 4: leadin-security

## 배경 — 확인 문제가 시험지처럼 읽힌다

이 앱은 시험 시뮬레이터가 아니라 학습 도구다(CLAUDE.md). 그런데 `q170`~`q246` 77문항은
`docs/source/exam-gaps.md`에서 나왔고, 그 파일은 **덤프 해설에서 정답 근거로 쓰인 것만**
추린 문서다. 설계상 정의가 아니라 함정만 모여 있다.

그 결과 문항이 "정의를 주고 이름을 되묻는" 단답 매칭이 되었다. 이미 다 공부한 사람에게는
점검이 되지만, 처음 보는 사람은 **용어가 어디서 나온 말인지부터 막힌다.** 특히 랜덤 문제는
개념을 읽지 않고 문항으로 바로 들어오기 때문에 이 공백이 그대로 드러난다.

이 phase는 그런 문항 29개의 `prompt` 앞에 **상황 한 문장**을 세워, 읽는 것만으로 대상이
무엇이고 왜 쓰는지가 잡히게 한다. 이 step은 마지막으로 보안·권한·비용 7문항을 맡는다.

`step0`~`step3`가 먼저 실행되었다면 `q171`~`q222` 일부의 프롬프트가 이미 길어져 있다.
**그 문항들을 다시 건드리지 마라.** 이 step의 대상과 겹치지 않는다.

## 이 step이 새 사실을 넣지 않는다는 근거

상황 문장의 사실은 전부 두 출처 안에 있다. ADR-006·ADR-008·ADR-009의 출처 제한 안에서
끝나며, **ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.**

| 문항 | 상황 문장이 쓰는 사실 | 근거 |
|---|---|---|
| q225 | NACL은 규칙 수 제한이 있어 매장 5만 곳의 IP를 개별 등록할 수 없다 | `exam-gaps.md` `nacl-rule-limit` — 한 줄 및 "매장 5만 곳의 공인 IP를 허용하거나 … NACL로 처리할 수 없다" |
| q227 | S3에 올린 정적 사이트를 CloudFront로 서비스하며 사용자 지정 도메인에 HTTPS를 적용한다 | `exam-gaps.md` `acm-cloudfront-region` — 한 줄 "CloudFront에서 사용자 지정 도메인에 HTTPS를 적용하려면", 본문 "S3 버킷이 eu-west-1에 있든 어디에 있든" |
| q232 | 악성 봇이 대량의 요청을 보내 컴퓨팅 리소스를 낭비한다 | `exam-gaps.md` `waf-bot-control` — "전 세계에서 오는 악성 봇이 불필요한 요청을 대량으로 보내 컴퓨팅 리소스를 낭비하는 상황에 쓴다" |
| q236 | CVE는 공개적으로 알려진 보안 취약점이다 | `topics.json` `threat-protection.security-service-lineup` 문단 1 — "CVE(Common Vulnerabilities and Exposures)는 공개적으로 알려진 보안 취약점에 붙는 공용 식별 번호다" (phase 13이 ADR-010으로 이미 넣은 풀이) |
| q239 | EC2에 권한을 주려고 IAM 그룹에 인스턴스를 넣으려는 시도가 있다 | `exam-gaps.md` `iam-group-users-only` — "EC2에 권한을 주는 선택지로 'IAM 그룹에 인스턴스를 추가한다'가 나오면 성립하지 않는 문장이다" |
| q241 | Cognito로 로그인을 마친 사용자가 S3에 접근해야 한다 | `exam-gaps.md` `cognito-pools` — "사용자 풀(User Pool)로 로그인을 처리하고, 자격 증명 풀(Identity Pool)로 인증된 사용자에게 S3 같은 AWS 리소스에 접근할 임시 권한을 준다" |
| q243 | 부서별로 비용을 나눠 보려고 리소스에 사용자 정의 태그를 붙였다 | `exam-gaps.md` `cost-allocation-tag-activation` — 본문 "먼저 리소스에 태그를 붙이고", 인용 `[비용관리 #162 p337]` "부서별 비용 분석" |

**출처에 없어서 이 step이 쓰지 않는 것** — 넣으면 `blocked`다.

- `q225`의 상황 문장에 **`WAF`를 쓰지 마라.** 정답이 WAF 규칙이다.
- `q227`의 상황 문장에 **리전 이름을 쓰지 마라.** `us-east-1`이 정답이고 `eu-west-1`은
  출처에 있지만 언급하면 혼선만 준다.
- `q236`에서 **CVE의 영문 풀네임(Common Vulnerabilities and Exposures)까지 넣지 마라.**
  개념 본문에 이미 있고, 문항에는 "공개적으로 알려진 보안 취약점"이라는 뜻만 필요하다.
- `q241`의 상황 문장에 **`사용자 풀`을 쓰지 마라.** 보기 `Cognito 사용자 풀`을 지워준다.
  "Cognito로 로그인을 마친"까지만 쓴다.
- `q243`의 상황 문장에 **"태그를 다는 것만으로는 나타나지 않는다"를 쓰지 마라.**
  정답을 사실상 알려주는 서술이다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010 — 무엇을 쓸 수 있고 무엇을 못 쓰는지.
- `docs/source/exam-gaps.md` — 이 step이 근거로 삼는 유일한 원본 파일.
  (`docs/source/concepts-raw.md`는 저장소에 없다. ADR-009에 따라 gitignore된 유료 교재
  추출본이며, 이 step의 7문항은 전부 `exam-gaps.md`에서 나왔으므로 필요하지 않다.)
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/topics.json` — `q236`의 근거만 읽는다. **고치지 마라.**
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
  `(CVE)`의 괄호도 이스케이프 대상이 아니다.
- 줄바꿈을 넣지 마라.

### 문항별 지금 / 바꿔

**q225** (`security-groups-nacl.nacl-rule-limit`)

```
지금:
5만 개 매장 IP만 웹 요청을 허용할 때 NACL 대신 적합한 기능은?
```
```
바꿔:
NACL은 규칙 수에 제한이 있어 매장 5만 곳의 IP를 개별 등록할 수 없다. 이 IP에서 오는 웹 요청만 허용할 때 적합한 기능은?
```

**q227** (`secrets-encryption.acm-cloudfront-region`)

```
지금:
CloudFront에 사용자 지정 도메인의 HTTPS를 적용할 때 ACM 인증서를 발급해야 하는 리전은?
```
```
바꿔:
S3에 올린 정적 사이트를 CloudFront로 서비스하면서 사용자 지정 도메인에 HTTPS를 적용하려 한다. ACM 인증서를 발급해야 하는 리전은?
```

**q232** (`threat-protection.waf-bot-control`)

```
지금:
요청 속도 같은 행동 패턴으로 악성 봇 트래픽을 탐지하고 제어하는 기능은?
```
```
바꿔:
전 세계에서 오는 악성 봇이 대량의 요청을 보내 컴퓨팅 리소스를 낭비하고 있다. 요청 속도 같은 행동 패턴으로 이를 탐지하고 제어하는 기능은?
```

**q236** (`threat-protection.security-service-lineup`)

```
지금:
EC2의 패치 누락과 CVE 취약점을 스캔하는 서비스는?
```
```
바꿔:
EC2의 소프트웨어 패치 누락과 공개적으로 알려진 보안 취약점(CVE)을 스캔하는 서비스는?
```

**q239** (`identity-access.iam-group-users-only`)

```
지금:
IAM 그룹에 직접 추가할 수 있는 대상은?
```
```
바꿔:
EC2에 S3 접근 권한을 주려고 IAM 그룹에 그 인스턴스를 넣으려 한다. IAM 그룹에 직접 추가할 수 있는 대상은?
```

**q241** (`identity-access.cognito-pools`)

```
지금:
Cognito에서 인증된 사용자에게 S3 접근용 임시 권한을 제공하는 구성 요소는?
```
```
바꿔:
Cognito로 로그인을 마친 사용자가 S3에 접근할 수 있게 하려 한다. 인증된 사용자에게 임시 권한을 제공하는 구성 요소는?
```

**q243** (`cost-management.cost-allocation-tag-activation`)

```
지금:
사용자 정의 태그를 Cost Explorer에서 사용하려면 리소스에 태그를 붙인 뒤 무엇을 해야 하는가?
```
```
바꿔:
부서별로 비용을 나눠 보려고 리소스에 사용자 정의 태그를 붙였다. Cost Explorer에서 이 태그로 비용을 집계하려면 그다음 무엇을 해야 하는가?
```

**이 7개 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 7개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·`answerIndex`·
  `explanation`은 한 글자도 바뀌면 안 된다. 이유: 문항이 `conceptId`로 개념을 참조하고,
  `data.test.ts`가 정답 분포와 주제별 문항 수를 하드코딩으로 검증한다.
- **위에 적힌 7문항 외의 문항을 고치지 마라.** 특히 `q229`(CloudHSM)·`q245`·`q246`은
  상황 문장을 붙이면 그대로 오답 소거가 되어 **의도적으로 제외한** 문항이다.
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/topics.json`을 건드리지 마라.** 개념 본문은 이 phase의 범위가 아니다.
- **`docs/source/`의 문장을 그대로 옮기지 마라**(ADR-009). 위 문자열은 이미 그 규칙에 맞게
  다시 쓴 것이므로, 그대로 넣으면 된다.
- `scripts/topics-baseline.json`의 **`questionsSha256`만** 갱신한다. `conceptLineCount`와
  `topics`는 건드리지 마라.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 셋을 덧붙인다.
기존 `it`을 수정하거나 지우지 마라. 마지막 것은 이 phase 전체(29문항)를 한 번에 확인한다.

```ts
it('보안·권한·비용 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q225).toBe('NACL은 규칙 수에 제한이 있어 매장 5만 곳의 IP를 개별 등록할 수 없다. 이 IP에서 오는 웹 요청만 허용할 때 적합한 기능은?')
  expect(prompts.q227).toBe('S3에 올린 정적 사이트를 CloudFront로 서비스하면서 사용자 지정 도메인에 HTTPS를 적용하려 한다. ACM 인증서를 발급해야 하는 리전은?')
  expect(prompts.q232).toBe('전 세계에서 오는 악성 봇이 대량의 요청을 보내 컴퓨팅 리소스를 낭비하고 있다. 요청 속도 같은 행동 패턴으로 이를 탐지하고 제어하는 기능은?')
  expect(prompts.q236).toBe('EC2의 소프트웨어 패치 누락과 공개적으로 알려진 보안 취약점(CVE)을 스캔하는 서비스는?')
  expect(prompts.q239).toBe('EC2에 S3 접근 권한을 주려고 IAM 그룹에 그 인스턴스를 넣으려 한다. IAM 그룹에 직접 추가할 수 있는 대상은?')
  expect(prompts.q241).toBe('Cognito로 로그인을 마친 사용자가 S3에 접근할 수 있게 하려 한다. 인증된 사용자에게 임시 권한을 제공하는 구성 요소는?')
  expect(prompts.q243).toBe('부서별로 비용을 나눠 보려고 리소스에 사용자 정의 태그를 붙였다. Cost Explorer에서 이 태그로 비용을 집계하려면 그다음 무엇을 해야 하는가?')
})

it('보안 보충 문항의 상황 문장이 오답을 대신 지워주지 않는다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q225).not.toContain('WAF')
  expect(prompts.q227).not.toContain('us-east-1')
  expect(prompts.q241).not.toContain('사용자 풀')
})

it('리드인을 붙인 29문항이 정답을 노출하지 않고 길이 상한을 지킨다', () => {
  const leadInIds = [
    'q171', 'q172', 'q173', 'q174', 'q175', 'q176', 'q177',
    'q179', 'q181', 'q183', 'q184', 'q186', 'q188',
    'q192', 'q197', 'q198', 'q200',
    'q210', 'q213', 'q215', 'q221', 'q222',
    'q225', 'q227', 'q232', 'q236', 'q239', 'q241', 'q243',
  ]

  const targets = questions.filter(({ id }) => leadInIds.includes(id))

  expect(targets).toHaveLength(29)
  targets.forEach((question) => {
    expect(question.prompt.length).toBeLessThanOrEqual(120)
    expect(question.prompt).not.toContain(question.choices[question.answerIndex])
  })
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

이 step에서 바뀐 문항을 확인한다.

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const TARGET=['q225','q227','q232','q236','q239','q241','q243'];
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
"
```

phase 전체 결과를 확인한다. `BASE`는 **이 phase의 첫 커밋 직전** 상태다. 아래 명령이
`17-leadin-questions`를 언급한 가장 오래된 커밋의 부모를 찾아 준다. 값이 비면 멈추고
`git log --oneline | head -20`으로 직접 확인해 해시를 넣어라.

```bash
BASE=$(git log --format=%H --grep='17-leadin-questions' --reverse | head -1)^
echo "BASE=$BASE" && git show --stat --oneline "$BASE" | head -3
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const LEADIN=['q171','q172','q173','q174','q175','q176','q177','q179','q181','q183','q184','q186','q188','q192','q197','q198','q200','q210','q213','q215','q221','q222','q225','q227','q232','q236','q239','q241','q243'];
const old=JSON.parse(execSync('git show '+process.env.BASE+':src/data/questions.json').toString());
const now=JSON.parse(readFileSync('src/data/questions.json','utf8'));
const om=Object.fromEntries(old.map(x=>[x.id,x]));
const changed=now.filter(n=>om[n.id].prompt!==n.prompt).map(n=>n.id);
console.log('phase 전체에서 바뀐 문항 수', changed.length, '(기대 29)');
console.log('대상 29개와 정확히 일치', changed.join()===LEADIN.join(), '(기대 true)');
const untouched=now.filter(n=>!LEADIN.includes(n.id)).every(n=>om[n.id].prompt===n.prompt);
console.log('나머지 217문항 prompt 그대로', untouched, '(기대 true)');
"
```

```bash
grep -c '^{"id":"q' src/data/questions.json   # 246 (문항 한 줄 포맷 유지)
```

`git diff --stat`이 `src/data/questions.json`, `src/data/data.test.ts`,
`scripts/topics-baseline.json` **세 파일만** 보여야 한다(`phases/` 갱신 제외).

## 완료 조건

- 위 네 명령(`test`·`lint`·`build`·`check-structure`)이 모두 통과한다.
- 이 step에서 **`prompt`가 바뀐 문항이 정확히 `q225` `q227` `q232` `q236` `q239` `q241` `q243`**
  이고, **`prompt` 외 필드 그대로 / id 순서 그대로가 `true`**다.
- phase 전체 검증에서 **바뀐 문항이 29개**이고 **나머지 217문항의 `prompt`가 그대로**다.
- 소거 방지 테스트(`q225`의 `WAF`, `q227`의 `us-east-1`, `q241`의 `사용자 풀` 미포함)가 통과한다.
- 29문항 전체 길이·정답 미노출 테스트가 통과한다.
- `grep -c`가 246을 출력한다.
- 변경된 파일이 위 세 개뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 이유: `data.test.ts`가 `q170`~`q246` 구간의 정답 분포가
  20~30% 범위에 있는지 검사한다. 하나만 바꿔도 깨진다.
- **`q225`에 `WAF`, `q227`에 리전 이름, `q241`에 `사용자 풀`을 넣지 마라.**
  이유: 셋 다 보기를 직접 지워주는 서술이다.
- **`q229`·`q245`·`q246`에 상황 문장을 붙이지 마라.** 이유: 세 문항 모두 출처의 상황이
  곧 오답 소거 근거라서, 붙이는 순간 답이 드러난다. 의도적으로 제외한 것이지 빠뜨린 것이 아니다.
- **모델이 아는 AWS 지식으로 상황을 지어내지 마라.** 위 근거 표에 없는 사실이 필요하다고
  판단되면 문장을 바꾸지 말고 `blocked`로 멈춰라.
- 기존 테스트를 깨뜨리지 마라.
