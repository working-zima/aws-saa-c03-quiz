# Step 0: same-category-distractors

## 배경 — 오답 보기가 정답과 다른 범주에 있으면 소거로 풀린다

사용자가 `q034`를 풀고 알려준 결함이다. 프롬프트는 암호화를 묻는데 보기 네 개 중
암호화에 속하는 것은 정답뿐이었다.

```
서버가 자체적으로 데이터를 암호화하는 방식을 무엇이라 하는가?
  S3 Batch Operations | SSE(정답) | S3 버전 관리 | S3 객체 잠금
```

`SSE`가 무엇인지 몰라도 "버전 관리는 버전, 객체 잠금은 잠금, Batch는 대량 작업"이라는
것만 알면 정답이 나온다. 근거 개념을 모르는 사람이 정답을 맞히므로 학습이 일어나지 않는다.
CLAUDE.md는 이 앱을 "시험 시뮬레이터가 아니라 학습 도구"라고 못박고 있으므로,
**오답 보기는 프롬프트가 묻는 범주 안에 들어와 있어야 한다.**

이 결함은 phase 18~21이 다룬 것과 축이 다르다. 그쪽은 프롬프트가 전제를 세우지 못해
학습자를 막는 경우였고, 이쪽은 보기가 학습자를 통과시켜 버리는 경우다.

### 전수 읽기 결과 — 고치는 4문항

246문항의 프롬프트와 보기를 모두 읽어 "정답만 질문이 묻는 범주에 속하는" 문항을 골랐다.
그중 **출처 두 파일 안에 같은 범주의 대체 항목이 있는 것**만 고친다.

| 문항 | 지금 오답이 속한 범주 | 넣을 같은 범주 항목 |
|---|---|---|
| `q034` | 대량 작업·버전 보존·변경 차단 (암호화 아님) | `KMS`·`CloudHSM`·`ACM` |
| `q075` | 세션 고정·요금 모델·Lambda 설정 (조정 정책 아님) | `예약된 조정` |
| `q098` | SQS·SNS·EventBridge (전부 메시징) | `RDS 자동 백업`·`EBS 스냅샷`·`S3 버전 관리` |
| `q164` | 예산·비용 조회·점검 도구 (요금 모델 아님) | `온디맨드 인스턴스` |

`q075`·`q164`는 **오답 하나만 바꾼다.** 오답 셋을 다 같은 범주로 끌어오면 인접 문항과
보기 세트가 통째로 겹쳐 중복 문항이 된다(`q189`·`q165`).

### 전수 읽기 결과 — 고치지 않는 문항과 이유

아래는 같은 결함이 있지만 **출처 안에 대체할 항목이 없거나, 고치면 더 큰 결함이 생긴다.**
사실을 지어내 오답을 채우는 것은 ADR-006·008·009 위반이다.

| 문항 | 정답 | 왜 못 고치는가 |
|---|---|---|
| `q085` | 콜드 스타트 | 출처에 견줄 다른 "지연 현상"이 없다. `프로비저닝된 동시성`은 콜드 스타트의 해결책이라 지연 현상이 아니고, `q086`의 정답이다 |
| `q083` | ECS | 같은 범주 오답은 `EKS`뿐인데, 프롬프트가 "Docker 컨테이너를 쉽게 운영"이라 `EKS`도 정답으로 읽힌다. 갈라지게 하려면 프롬프트를 "원래 쿠버네티스였는가"로 바꿔야 하고, 그러면 `q195`와 같은 축을 묻는 중복 문항이 되면서 ECS의 정의를 가르치는 문항이 사라진다 |
| `q100` | 서브넷 | VPC를 나누는 단위가 출처에 서브넷뿐이다. 퍼블릭·프라이빗 서브넷은 형제가 아니라 하위 구분이다 |
| `q175` | 클러스터 배치 그룹 | 출처에 다른 배치 그룹 유형이 없다 |
| `q176` | EBS Elastic Volumes | 출처에 EBS 볼륨을 무중단으로 다루는 다른 기능이 없다 |
| `q123` | EMR | 오답 `Redshift`·`Athena`가 이미 같은 분석 범주다. 소거가 통하지 않으므로 결함이 아니다 |

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-011.
- `src/data/topics.json` — 오답의 근거를 확인만 한다. **이 step에서는 고치지 마라.**
  근거 위치: `s3-encryption-batch.sse`, `secrets-encryption.kms`, `secrets-encryption.acm`,
  `secrets-encryption.cloudhsm`, `compute-delivery.ec2`, `compute-delivery.scheduled-scaling`,
  `messaging-backup.backup`, `messaging-backup.backup-long-term-retention`,
  `cost-management.savings-plan`.
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 지우지 않는다.
- `scripts/topics-baseline.json` — `questionsSha256`을 갱신한다.
- `phases/21-concept-referents/step0.md` — 편집 방식과 검증 스크립트의 선례.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 반영해 실패를 확인한 뒤**
`questions.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/questions.json`은 **문항 하나가 정확히 한 줄**인 포맷이다(전체 248줄:
`[` + 246문항 + `]`). 문항 23개는 줄이 `,{"id":"q...`처럼 콤마로 시작한다.

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** 한 줄 포맷이 깨진다.
- 아래 네 줄에서 해당 필드 값만 제자리에서 치환해라. 이 네 줄은 모두 `{`로 시작한다
  (35·76·99·165행).
- 아래 문자열에는 따옴표·역슬래시가 없다. JSON 이스케이프 없이 그대로 넣는다.
- **`answerIndex`는 네 문항 모두 그대로다.** 정답 문자열의 위치를 유지하도록 보기를 넣어라.

### 문항 지금 / 바꿔

**q034** (`s3-encryption-batch.sse`) — `prompt`·`choices`·`explanation`

```
prompt 지금:
서버가 자체적으로 데이터를 암호화하는 방식을 무엇이라 하는가?
```
```
prompt 바꿔:
S3에 저장하는 파일은 암호화로 보호하며 이 과정에는 키가 필요하다. 이때 서버가 자체적으로 데이터를 암호화하는 방식을 무엇이라 하는가?
```
```
choices 지금:
["S3 Batch Operations","SSE","S3 버전 관리","S3 객체 잠금"]
```
```
choices 바꿔:
["KMS","SSE","CloudHSM","ACM"]
```
```
explanation 바꿔:
SSE(Server Side Encryption)는 서버가 자체적으로 데이터를 암호화하는 방식이다. KMS는 암호화에 쓸 키를 만들어 보관하는 서비스, CloudHSM은 전용 하드웨어로 키를 보관하는 서비스, ACM은 HTTPS에 필요한 SSL/TLS 인증서를 관리하는 서비스라 데이터를 대신 암호화해 주지 않는다.
```

`answerIndex`는 `1`로 그대로다. 리드인은 개념 `s3-encryption-batch.sse`의 문단 0
("S3에 저장하는 파일은 암호화로 보호하며, 이 과정에는 키가 필요하다")에서 가져온 것이다.

**q075** (`compute-delivery.ec2`) — `choices` 한 개와 `explanation`

```
choices 지금:
["Sticky Session","대상 추적 정책","예약 인스턴스","프로비저닝된 동시성"]
```
```
choices 바꿔:
["Sticky Session","대상 추적 정책","예약 인스턴스","예약된 조정"]
```
```
explanation 바꿔:
대상 추적 정책은 설정한 목표값을 벗어나지 않도록 서버를 자동 확장하거나 축소한다. 예약된 조정은 몰리는 시각을 미리 알 때 용량을 앞당겨 늘려두는 방식이라 목표값을 따라가지 않는다.
```

`prompt`는 건드리지 마라. `answerIndex`는 `1`로 그대로다.

**q098** (`messaging-backup.backup`) — `choices`와 `explanation`

```
choices 지금:
["AWS Backup","SQS","SNS","EventBridge"]
```
```
choices 바꿔:
["AWS Backup","RDS 자동 백업","EBS 스냅샷","S3 버전 관리"]
```
```
explanation 바꿔:
AWS Backup은 서비스별 백업 작업을 한곳에서 자동화하고 관리한다. RDS 자동 백업, EBS 스냅샷, S3 버전 관리는 각각 한 서비스의 데이터만 지키는 수단이다.
```

`prompt`는 건드리지 마라. `answerIndex`는 `0`으로 그대로다.

**q164** (`cost-management.savings-plan`) — `choices` 한 개와 `explanation`

```
choices 지금:
["AWS Budgets","Cost Explorer","Trusted Advisor","절약 플랜"]
```
```
choices 바꿔:
["AWS Budgets","Cost Explorer","온디맨드 인스턴스","절약 플랜"]
```
```
explanation 바꿔:
절약 플랜은 일정 기간과 사용량을 약정해 할인된 요금을 적용받는 모델이다. 온디맨드 인스턴스는 약정 없이 이용한 시간만큼 나중에 비용을 내는 방식이고, AWS Budgets는 예산을 설정하고 초과 시 알림을 제공한다.
```

`prompt`는 건드리지 마라. `answerIndex`는 `3`으로 그대로다.

### 핵심 규칙 — 벗어나지 마라

- **위 네 문항 외의 문항을 고치지 마라.** 특히 배경 표에 제외 사유를 적은
  `q083`·`q085`·`q100`·`q123`·`q175`·`q176`은 그대로 둔다.
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`answerIndex`를 바꾸지 마라.** 이유: `q164`는 `questions.slice(116, 169)`의 정답
  분포를 20~30%로 검사하는 테스트 안에 있고, `q034`·`q075`·`q098`도 위치를 바꿀 이유가 없다.
- **`id`·`topicId`·`conceptId`를 건드리지 마라.**
- **`src/data/topics.json`을 건드리지 마라.** 이유: 오답으로 넣는 항목은 모두 이미
  `topics.json`에 개념으로 있다. 개념을 새로 만들 필요가 없다.
- **출처 밖의 항목을 오답으로 넣지 마라.** 특히 클라이언트 측 암호화(CSE)는
  `docs/source/` 두 파일에 없으므로 `q034`의 오답이 될 수 없다.
- **`SSE-S3`·`SSE-KMS`·`SSE-C`를 `q034`의 오답으로 넣지 마라.** 이유: 셋 다 서버 측
  암호화의 하위 방식이라 정답으로도 읽힌다. 정답이 애매해지면 결함이 더 커진다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 덧붙인다.
기존 테스트는 한 줄도 지우거나 바꾸지 마라.

```ts
it('오답만으로 소거되던 4문항이 정답과 같은 범주의 보기를 받는다', () => {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

  expect(byId.q034.choices).toEqual(['KMS', 'SSE', 'CloudHSM', 'ACM'])
  expect(byId.q034.prompt).toBe('S3에 저장하는 파일은 암호화로 보호하며 이 과정에는 키가 필요하다. 이때 서버가 자체적으로 데이터를 암호화하는 방식을 무엇이라 하는가?')
  expect(byId.q075.choices).toEqual(['Sticky Session', '대상 추적 정책', '예약 인스턴스', '예약된 조정'])
  expect(byId.q098.choices).toEqual(['AWS Backup', 'RDS 자동 백업', 'EBS 스냅샷', 'S3 버전 관리'])
  expect(byId.q164.choices).toEqual(['AWS Budgets', 'Cost Explorer', '온디맨드 인스턴스', '절약 플랜'])
})

it('보기를 고친 4문항의 정답 위치와 프롬프트가 그대로 유지된다', () => {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

  expect(byId.q034.answerIndex).toBe(1)
  expect(byId.q075.answerIndex).toBe(1)
  expect(byId.q098.answerIndex).toBe(0)
  expect(byId.q164.answerIndex).toBe(3)
  // 프롬프트가 보기를 꺼내면 오답이 소거된다.
  ;['q034', 'q075', 'q098', 'q164'].forEach((id) => {
    expect(byId[id].prompt.length).toBeLessThanOrEqual(120)
    byId[id].choices.forEach((choice) => {
      expect(byId[id].prompt).not.toContain(choice)
    })
  })
})

it('같은 범주 오답을 만들 수 없어 제외한 문항은 보기가 그대로다', () => {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

  // 출처에 같은 범주의 대체 항목이 없거나, 넣으면 정답이 애매해지는 문항들이다.
  expect(byId.q083.choices).toEqual(['Lambda', 'ECS', 'Step Functions', 'API Gateway'])
  expect(byId.q085.choices).toEqual(['Sticky Session', '대상 추적', '엣지 최적화', '콜드 스타트'])
  expect(byId.q100.choices).toEqual(['인터넷 게이트웨이', 'VPC 피어링', '서브넷', 'PrivateLink'])
  expect(byId.q175.choices).toEqual(['클러스터 배치 그룹', 'EFS 수명 주기 관리', 'EBS Elastic Volumes', 'FSx for NetApp ONTAP'])
})

it('q034의 오답이 서버 측 암호화의 하위 방식이 아니다', () => {
  const question = questions.find(({ id }) => id === 'q034')
  const wrongChoices = question?.choices.filter((_, index) => index !== question.answerIndex) ?? []

  expect(wrongChoices).toHaveLength(3)
  // SSE-S3·SSE-KMS·SSE-C는 모두 서버 측 암호화라 오답이 될 수 없다.
  wrongChoices.forEach((choice) => {
    expect(choice.startsWith('SSE')).toBe(false)
  })
})
```

## 검증 절차

1. 보기를 고친 뒤 `questionsSha256`을 갱신한다.

```bash
node -e "const fs=require('fs'),c=require('crypto');const sha=c.createHash('sha256').update(fs.readFileSync('src/data/questions.json')).digest('hex');const b=JSON.parse(fs.readFileSync('scripts/topics-baseline.json','utf8'));b.questionsSha256=sha;fs.writeFileSync('scripts/topics-baseline.json',JSON.stringify(b,null,2)+'\n');console.log('questionsSha256 ->',sha)"
```

2. AC 커맨드를 실행한다.

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

3. 변경 범위를 직접 확인한다.

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const old=JSON.parse(execSync('git show HEAD:src/data/questions.json').toString());
const now=JSON.parse(readFileSync('src/data/questions.json','utf8'));
const om=Object.fromEntries(old.map(x=>[x.id,x]));
console.log('문항 수', old.length, '->', now.length, '(기대 246 -> 246)');
let fieldOk=true;
for(const n of now){ const o=om[n.id];
  for(const k of ['id','topicId','conceptId','answerIndex']) if(o[k]!==n[k]){fieldOk=false;console.log('  필드 변경!',n.id,k);} }
console.log('id·topicId·conceptId·answerIndex 전부 불변', fieldOk, '(기대 true)');
const ch=now.filter(n=>JSON.stringify(om[n.id].choices)!==JSON.stringify(n.choices)).map(n=>n.id);
const pr=now.filter(n=>om[n.id].prompt!==n.prompt).map(n=>n.id);
const ex=now.filter(n=>om[n.id].explanation!==n.explanation).map(n=>n.id);
console.log('보기가 바뀐 문항', ch.join(' '), '(기대 q034 q075 q098 q164)');
console.log('프롬프트가 바뀐 문항', pr.join(' ')||'없음', '(기대 q034)');
console.log('해설이 바뀐 문항', ex.join(' '), '(기대 q034 q075 q098 q164)');
for(const id of ['q034','q075','q098','q164']){const q=now.find(x=>x.id===id);
  const hit=q.choices.filter(c=>q.prompt.includes(c));
  console.log(' ', id, '길이', q.prompt.length, '(<=120)', q.prompt.length<=120, '| 보기 등장', hit.length?hit.join(','):'없음', '(기대 없음)');}
for(const id of ['q083','q085','q100','q123','q175','q176']){const q=now.find(x=>x.id===id);
  console.log('  제외 유지', id, JSON.stringify(om[id].choices)===JSON.stringify(q.choices));}
"
```

4. 한 줄 포맷이 살아 있는지 본다.

```bash
grep -c '{"id":"q' src/data/questions.json   # 246
wc -l < src/data/questions.json              # 248
```

5. 아키텍처 체크리스트를 확인한다.
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙(출처 제한·정적 JSON·localStorage)을 위반하지 않았는가?
6. 결과에 따라 `phases/23-distractor-category/index.json`의 해당 step을 업데이트한다.
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 완료 조건

- `test`·`lint`·`build`·`check-structure`가 모두 통과한다.
- **보기가 바뀐 문항이 `q034`·`q075`·`q098`·`q164` 넷**이고, 프롬프트가 바뀐 문항은
  `q034` 하나다.
- 네 문항의 `id`·`topicId`·`conceptId`·`answerIndex`가 모두 불변이다.
- 네 문항의 프롬프트에 보기 문자열이 등장하지 않고 길이가 120자 이하다.
- `q083`·`q085`·`q100`·`q123`·`q175`·`q176`의 보기가 그대로다.
- `grep -c '{"id":"q'`가 246, `wc -l`이 248을 출력한다.
- 변경된 파일이 `questions.json`·`data.test.ts`·`topics-baseline.json` 셋뿐이다.

## 금지사항

- **출처 밖의 사실로 오답을 만들지 마라.** 이유: `docs/source/concepts-raw.md`와
  `docs/source/exam-gaps.md` 두 파일이 유일한 근거다(ADR-006·008·009). 클라이언트 측
  암호화(CSE)처럼 그럴듯하지만 출처에 없는 항목을 넣으면 설계 위반이다.
- **`q034`의 오답을 `SSE-S3`·`SSE-KMS`·`SSE-C`로 채우지 마라.** 이유: 셋 다 서버 측
  암호화의 하위 방식이어서 "서버가 자체적으로 데이터를 암호화하는 방식"이라는 프롬프트에
  모두 해당한다. 정답이 둘 이상이 된다.
- **`q075`·`q164`의 오답 셋을 전부 바꾸지 마라.** 이유: `q189`(예약된 조정·대상 추적
  조정·웜 풀·스티키 세션)와 `q165`(컴퓨팅 절약 플랜·EC2 인스턴스 절약 플랜·Budgets·
  Cost Explorer)와 보기 세트가 겹쳐 중복 문항이 된다. 오답 하나만 바꾼다.
- **`answerIndex`를 바꾸지 마라.** 이유: `questions.slice(116, 169)`의 정답 분포를
  20~30%로 검사하는 테스트가 깨진다.
- **`src/data/topics.json`을 고치지 마라.** 이유: 이 step은 보기 설계만 다룬다.
  개념 본문은 오답의 근거로 읽기만 한다.
- **기존 테스트를 지우거나 이름을 바꾸지 마라.** 이 step에서 테스트 파일에 하는 일은
  블록 끝에 새 `it`을 덧붙이는 것뿐이다.
- **`prompt`를 `q034` 외의 문항에서 바꾸지 마라.** 이유: `q075`의 프롬프트는
  phase 20의 테스트가 문자열로 고정하고 있다.
