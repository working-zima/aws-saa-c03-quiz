# Step 0: leadin-storage

## 배경 — 확인 문제가 시험지처럼 읽힌다

이 앱은 시험 시뮬레이터가 아니라 학습 도구다(CLAUDE.md). 그런데 `q170`~`q246` 77문항은
`docs/source/exam-gaps.md`에서 나왔고, 그 파일은 **덤프 해설에서 정답 근거로 쓰인 것만**
추린 문서다. 설계상 정의가 아니라 함정만 모여 있다.

그 결과 문항이 "정의를 주고 이름을 되묻는" 단답 매칭이 되었다. 이미 다 공부한 사람에게는
점검이 되지만, 처음 보는 사람은 **용어가 어디서 나온 말인지부터 막힌다.** 특히 랜덤 문제는
개념을 읽지 않고 문항으로 바로 들어오기 때문에 이 공백이 그대로 드러난다.

이 phase는 그런 문항 29개의 `prompt` 앞에 **상황 한 문장**을 세워, 읽는 것만으로 대상이
무엇이고 왜 쓰는지가 잡히게 한다. 이 step은 그중 S3·스토리지 7문항을 맡는다.

## 이 step이 새 사실을 넣지 않는다는 근거

상황 문장의 사실은 전부 두 출처 안에 있다. ADR-006·ADR-008·ADR-009의 출처 제한 안에서
끝나며, **ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.**

| 문항 | 상황 문장이 쓰는 사실 | 근거 |
|---|---|---|
| q171 | 객체 잠금은 정해진 기간 동안 수정·삭제를 막는다 | `topics.json` `s3-versioning-lifecycle.object-lock` — summary "정해진 기간에 객체가 변경되거나 지워지지 않도록 보호하는 기능이다", 문단 0 "일정 기간 파일의 수정과 삭제를 차단" |
| q172 | 파일이 올라오는 즉시 Lambda 등을 트리거한다 | `exam-gaps.md` `event-notification` — "파일이 업로드되는 즉시 Lambda 등을 트리거해야 할 때 쓴다" |
| q173 | 봉투 암호화 = 데이터 키로 암호화하고 그 키를 마스터 키로 암호화 | `exam-gaps.md` `envelope-encryption` — 한 줄 "데이터를 데이터 키로 암호화하고, 그 데이터 키를 다시 마스터 키로 암호화하는 방식이다" |
| q174 | SSE-KMS는 객체마다 KMS API를 불러 객체가 많으면 비용이 급증한다 | `exam-gaps.md` `sse-kms-cost` — 한 줄 및 "객체를 암호화할 때마다 KMS API를 부르는 구조라" |
| q175 | 수천 개 노드가 동시에 읽고 쓰는 HPC 워크로드 | `exam-gaps.md` `cluster-placement-group` — "수천 개 노드가 동시에 데이터를 읽고 쓰는 HPC(고성능 컴퓨팅) 워크로드" |
| q176 | 볼륨을 떼었다 붙이지 않으므로 운영 중단이 없다 | `exam-gaps.md` `ebs-elastic-volumes` — "볼륨을 떼었다 붙이거나 새 볼륨을 추가하지 않아도 되므로 운영 중단이 발생하지 않는다" |
| q177 | 접근 없는 파일을 자동으로 옮기되 즉시 액세스는 유지된다 | `exam-gaps.md` `efs-lifecycle-management` — 한 줄 및 "필요할 때는 즉시 써야 한다는 조건과 충돌하지 않는다" |

**출처에 없어서 이 step이 쓰지 않는 것** — 넣으면 `blocked`다.

- FSx for Lustre, EFS IA, S3 Glacier Deep Archive 같은 **비교 대상 서비스명**을 상황 문장에
  끌어오지 마라. 출처에는 있지만 전부 오답 소거 근거라서, 상황 문장에 넣으면 답을 알려주게 된다.
- 객체 잠금의 보존 모드(거버넌스/규정 준수), MFA 삭제, 버전 관리의 동작을 설명하지 마라.
  이 step의 대상은 `prompt` 한 줄이지 개념 해설이 아니다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010 — 무엇을 쓸 수 있고 무엇을 못 쓰는지.
- `docs/source/exam-gaps.md` — 이 step이 근거로 삼는 유일한 원본 파일.
  (`docs/source/concepts-raw.md`는 저장소에 없다. ADR-009에 따라 gitignore된 유료 교재
  추출본이며, 이 step의 7문항은 전부 `exam-gaps.md`에서 나왔으므로 필요하지 않다.)
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

**q171** (`s3-versioning-lifecycle.object-lock-prerequisites`)

```
지금:
S3 객체 잠금을 사용하기 위해 버킷에 먼저 활성화해야 하는 기능은?
```
```
바꿔:
S3 객체 잠금은 정해진 기간 동안 객체의 수정과 삭제를 막는 기능이다. 이 잠금을 걸려면 버킷에 먼저 활성화해야 하는 기능은?
```

**q172** (`s3-versioning-lifecycle.event-notification`)

```
지금:
S3 이벤트 알림이 객체 생성 이벤트를 발생시키는 대상은?
```
```
바꿔:
S3 이벤트 알림은 파일이 올라오는 즉시 Lambda 같은 서비스를 자동으로 호출한다. 이 알림이 객체 생성 이벤트를 발생시키는 대상은?
```

**q173** (`s3-encryption-batch.envelope-encryption`)

```
지금:
봉투 암호화와 암호화 키의 주기적 자동 교체가 모두 필요할 때 선택할 방식은?
```
```
바꿔:
봉투 암호화는 데이터를 데이터 키로 암호화하고 그 키를 다시 마스터 키로 암호화하는 방식이다. 이 방식과 암호화 키의 주기적 자동 교체가 모두 필요할 때 선택할 것은?
```

**q174** (`s3-encryption-batch.sse-kms-cost`)

```
지금:
SSE-KMS를 유지하면서 객체별 KMS API 호출 비용을 줄이는 기능은?
```
```
바꿔:
SSE-KMS는 객체를 암호화할 때마다 KMS API를 불러서 객체가 많으면 호출 비용이 급증한다. 암호화 방식은 그대로 두고 이 비용을 줄이는 기능은?
```

**q175** (`block-file-storage.cluster-placement-group`)

```
지금:
HPC 워크로드에서 EC2를 밀집 배치해 낮은 네트워크 지연과 높은 처리량을 얻는 방식은?
```
```
바꿔:
수천 개 노드가 동시에 데이터를 읽고 쓰는 HPC 워크로드에서 노드 사이의 네트워크 지연을 최대한 줄여야 한다. EC2를 어떻게 배치해야 하는가?
```

**q176** (`block-file-storage.ebs-elastic-volumes`)

```
지금:
EC2에서 EBS를 분리하지 않고 연결된 상태로 볼륨 크기를 늘리는 기능은?
```
```
바꿔:
서비스를 멈추지 않고 EC2에 붙어 있는 EBS 볼륨의 크기를 늘려야 한다. 볼륨을 떼었다 붙이지 않고 확장하는 기능은?
```

**q177** (`block-file-storage.efs-lifecycle-management`)

```
지금:
접근이 없는 EFS 파일을 자동으로 저렴한 클래스로 옮기면서 즉시 접근을 유지하는 기능은?
```
```
바꿔:
EFS에 오래 방치된 파일의 보관 비용을 줄이되 필요할 때는 즉시 읽을 수 있어야 한다. 접근이 없는 파일을 자동으로 저렴한 클래스로 옮기는 기능은?
```

**이 7개 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 7개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·`answerIndex`·
  `explanation`은 한 글자도 바뀌면 안 된다. 이유: 문항이 `conceptId`로 개념을 참조하고,
  `data.test.ts`가 정답 분포와 주제별 문항 수를 하드코딩으로 검증한다.
- **위에 적힌 7문항 외의 문항을 고치지 마라.** 나머지는 다른 step이 맡는다.
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
it('S3·스토리지 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q171).toBe('S3 객체 잠금은 정해진 기간 동안 객체의 수정과 삭제를 막는 기능이다. 이 잠금을 걸려면 버킷에 먼저 활성화해야 하는 기능은?')
  expect(prompts.q172).toBe('S3 이벤트 알림은 파일이 올라오는 즉시 Lambda 같은 서비스를 자동으로 호출한다. 이 알림이 객체 생성 이벤트를 발생시키는 대상은?')
  expect(prompts.q173).toBe('봉투 암호화는 데이터를 데이터 키로 암호화하고 그 키를 다시 마스터 키로 암호화하는 방식이다. 이 방식과 암호화 키의 주기적 자동 교체가 모두 필요할 때 선택할 것은?')
  expect(prompts.q174).toBe('SSE-KMS는 객체를 암호화할 때마다 KMS API를 불러서 객체가 많으면 호출 비용이 급증한다. 암호화 방식은 그대로 두고 이 비용을 줄이는 기능은?')
  expect(prompts.q175).toBe('수천 개 노드가 동시에 데이터를 읽고 쓰는 HPC 워크로드에서 노드 사이의 네트워크 지연을 최대한 줄여야 한다. EC2를 어떻게 배치해야 하는가?')
  expect(prompts.q176).toBe('서비스를 멈추지 않고 EC2에 붙어 있는 EBS 볼륨의 크기를 늘려야 한다. 볼륨을 떼었다 붙이지 않고 확장하는 기능은?')
  expect(prompts.q177).toBe('EFS에 오래 방치된 파일의 보관 비용을 줄이되 필요할 때는 즉시 읽을 수 있어야 한다. 접근이 없는 파일을 자동으로 저렴한 클래스로 옮기는 기능은?')
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

변경 범위를 확인한다. 모든 줄이 기대값과 일치해야 한다. **새 스크립트 파일을 만들지 마라.**
이 phase의 산출물이 아니다.

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const TARGET=['q171','q172','q173','q174','q175','q176','q177'];
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
- 검증 스크립트에서 **`prompt`가 바뀐 문항이 정확히 `q171`~`q177` 7개**이고,
  **`prompt` 외 필드 그대로 / id 순서 그대로 / 금지 표현 없음이 전부 `true`**다.
- 7문항 모두 길이 120자 이하이고 정답 문자열을 노출하지 않는다.
- `grep -c`가 246을 출력한다.
- 변경된 파일이 위 세 개뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 이유: `data.test.ts`가 `q170`~`q246` 구간의 정답 분포가
  20~30% 범위에 있는지 검사한다. 하나만 바꿔도 깨진다.
- **상황 문장에 정답 보기의 문자열을 넣지 마라.** 이유: 읽자마자 답이 보이면 문항이 사라진다.
- **오답을 지워주는 서술을 넣지 마라.** 예: "이것만으로는 안 된다", "X는 답이 아니다".
  이유: 소거를 대신해 주면 학습이 아니라 정답 공개가 된다.
- **모델이 아는 AWS 지식으로 상황을 지어내지 마라.** 위 근거 표에 없는 사실이 필요하다고
  판단되면 문장을 바꾸지 말고 `blocked`로 멈춰라.
- 기존 테스트를 깨뜨리지 마라.
