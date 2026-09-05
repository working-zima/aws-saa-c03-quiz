# Step 1: leadin-database

## 배경 — 확인 문제가 시험지처럼 읽힌다

이 앱은 시험 시뮬레이터가 아니라 학습 도구다(CLAUDE.md). 그런데 `q170`~`q246` 77문항은
`docs/source/exam-gaps.md`에서 나왔고, 그 파일은 **덤프 해설에서 정답 근거로 쓰인 것만**
추린 문서다. 설계상 정의가 아니라 함정만 모여 있다.

그 결과 문항이 "정의를 주고 이름을 되묻는" 단답 매칭이 되었다. 이미 다 공부한 사람에게는
점검이 되지만, 처음 보는 사람은 **용어가 어디서 나온 말인지부터 막힌다.** 특히 랜덤 문제는
개념을 읽지 않고 문항으로 바로 들어오기 때문에 이 공백이 그대로 드러난다.

이 phase는 그런 문항 29개의 `prompt` 앞에 **상황 한 문장**을 세워, 읽는 것만으로 대상이
무엇이고 왜 쓰는지가 잡히게 한다. 이 step은 그중 RDS·Aurora·DynamoDB·Auto Scaling
6문항을 맡는다.

`step0`(S3·스토리지 7문항)이 먼저 실행되었다면 `src/data/questions.json`의 `q171`~`q177`
프롬프트가 이미 길어져 있다. **그 문항들을 다시 건드리지 마라.** 이 step의 대상과 겹치지 않는다.

## 이 step이 새 사실을 넣지 않는다는 근거

상황 문장의 사실은 전부 두 출처 안에 있다. ADR-006·ADR-008·ADR-009의 출처 제한 안에서
끝나며, **ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.**

| 문항 | 상황 문장이 쓰는 사실 | 근거 |
|---|---|---|
| q179 | 쓰기 작업량이 치솟는 워크로드에서 지연 시간을 보장하려면 IOPS를 직접 지정한다 | `exam-gaps.md` `storage-type-names` — "쓰기 작업량이 급격히 치솟는 워크로드에서 지연 시간을 보장해야 하면 IOPS를 직접 지정할 수 있는 io1/io2를 고른다" |
| q181 | 규정 준수 목적으로 보존 기간을 먼저 따진다 | `exam-gaps.md` `automated-backup-retention` — "'90일 이상 보관해야 한다' 같은 규정 준수 요구가 나오면" |
| q183 | 플레이어 수가 시시각각 바뀌는 게임 서버, 관계형 DB가 필요하고 용량 예측이 어렵다 | `exam-gaps.md` `aurora-serverless-v2` — "플레이어 수가 시시각각 바뀌는 게임 서버처럼 변동이 심한 트래픽에 쓴다. 관계형 데이터베이스가 필요하면서 용량 예측이 어려울 때" |
| q184 | 엔드포인트는 접속 주소를 뜻하고, 요청이 읽기 전용 복제본들로 자동으로 나뉜다 | `topics.json` `aurora-dynamodb-cache.aurora-reader-endpoint` 문단 0 — "엔드포인트는 애플리케이션이 접속할 주소를 뜻하며 … 읽기 전용 복제본들에 자동으로 나뉘어 전달된다" (엔드포인트 풀이는 phase 13이 ADR-010으로 이미 넣은 것) |
| q186 | PITR은 특정 시점으로 데이터를 되돌리는 기능이다 | `exam-gaps.md` `dynamodb-pitr` — "PITR (Point-in-Time Recovery): 최대 35일까지만 데이터를 복구할 수 있는 기능" |
| q188 | 새 인스턴스가 부팅되고 앱이 뜰 때까지 응답이 지연되고, 실행 비용은 들지 않는다 | `exam-gaps.md` `warm-pool` — "새 인스턴스가 부팅되고 애플리케이션이 뜨기까지 시간이 오래 걸려 응답이 지연되는 문제를 푼다", "EC2 실행 비용은 발생하지 않고" |

**출처에 없어서 이 step이 쓰지 않는 것** — 넣으면 `blocked`다.

- `q181`과 `q186`의 상황 문장에 **숫자를 쓰지 마라.** 출처에는 "90일", "7년", "35일"이
  있지만 셋 다 보기에 있거나 답이라서, 상황 문장에 넣으면 소거로 답이 드러난다.
- `q184`의 상황 문장에 **`Reader Endpoint`라는 이름을 쓰지 마라.** 정답 보기다.
  "접속 주소"라는 일반어까지만 쓴다.
- `q188`의 상황 문장에 **오버 프로비저닝이나 중지 상태(Stopped)를 설명하지 마라.**
  출처에는 있지만 정답인 웜 풀의 동작 자체라서 답을 알려주게 된다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010 — 무엇을 쓸 수 있고 무엇을 못 쓰는지.
- `docs/source/exam-gaps.md` — 이 step이 근거로 삼는 유일한 원본 파일.
  (`docs/source/concepts-raw.md`는 저장소에 없다. ADR-009에 따라 gitignore된 외부 참고 자료
  추출본이며, 이 step의 6문항은 전부 `exam-gaps.md`에서 나왔으므로 필요하지 않다.)
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/topics.json` — `q184`의 근거만 읽는다. **고치지 마라.**
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

**q179** (`rds-storage-features.storage-type-names`)

```
지금:
RDS에서 IOPS를 직접 지정할 수 있는 프로비저닝된 IOPS SSD의 표기는?
```
```
바꿔:
쓰기 작업량이 급격히 치솟는 RDS 워크로드에서 지연 시간을 보장하려면 IOPS를 직접 지정하는 스토리지를 고른다. 이 프로비저닝된 IOPS SSD의 표기는?
```

**q181** (`rds-storage-features.automated-backup-retention`)

```
지금:
RDS 자동 백업의 최대 보존 기간은?
```
```
바꿔:
규정 준수를 위해 백업을 얼마나 오래 둘 수 있는지부터 확인하려 한다. RDS 자동 백업의 최대 보존 기간은?
```

**q183** (`aurora-dynamodb-cache.aurora-serverless-v2`)

```
지금:
변동이 심한 워크로드에서 DB 용량을 1초 단위로 자동 조정하는 구성은?
```
```
바꿔:
플레이어 수가 시시각각 바뀌어 용량을 예측하기 어려운 게임 서버에 관계형 데이터베이스가 필요하다. 용량을 1초 단위로 자동 조정하는 구성은?
```

**q184** (`aurora-dynamodb-cache.aurora-reader-endpoint`)

```
지금:
읽기 전용 복제본들에 부하를 자동 분산하는 Aurora 전용 기능은?
```
```
바꿔:
Aurora에 읽기 전용 복제본을 여러 개 두고, 애플리케이션이 어느 쪽으로 보낼지 직접 고르지 않게 하려 한다. 접속 주소 하나로 부하를 자동 분산하는 Aurora 전용 기능은?
```

**q186** (`aurora-dynamodb-cache.dynamodb-pitr`)

```
지금:
DynamoDB의 특정 시점 복구(PITR)로 되돌릴 수 있는 최대 기간은?
```
```
바꿔:
DynamoDB에서 사고가 나기 직전 시점으로 데이터를 되돌리려고 특정 시점 복구(PITR)를 검토한다. PITR로 되돌릴 수 있는 최대 기간은?
```

**q188** (`compute-delivery.warm-pool`)

```
지금:
초기화가 오래 걸리는 EC2의 확장 지연을 줄이면서 실행 비용을 피하는 Auto Scaling 기능은?
```
```
바꿔:
트래픽이 급증할 때 새 EC2가 부팅되고 애플리케이션이 뜰 때까지 응답이 지연된다. 실행 비용은 늘리지 않으면서 이 지연을 없애는 Auto Scaling 기능은?
```

**이 6개 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 6개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·`answerIndex`·
  `explanation`은 한 글자도 바뀌면 안 된다. 이유: 문항이 `conceptId`로 개념을 참조하고,
  `data.test.ts`가 정답 분포와 주제별 문항 수를 하드코딩으로 검증한다.
- **위에 적힌 6문항 외의 문항을 고치지 마라.** 나머지는 다른 step이 맡는다.
  특히 `q180`·`q182`·`q185`·`q187`은 이미 상황형이라 대상이 아니다.
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
it('데이터베이스·확장 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q179).toBe('쓰기 작업량이 급격히 치솟는 RDS 워크로드에서 지연 시간을 보장하려면 IOPS를 직접 지정하는 스토리지를 고른다. 이 프로비저닝된 IOPS SSD의 표기는?')
  expect(prompts.q181).toBe('규정 준수를 위해 백업을 얼마나 오래 둘 수 있는지부터 확인하려 한다. RDS 자동 백업의 최대 보존 기간은?')
  expect(prompts.q183).toBe('플레이어 수가 시시각각 바뀌어 용량을 예측하기 어려운 게임 서버에 관계형 데이터베이스가 필요하다. 용량을 1초 단위로 자동 조정하는 구성은?')
  expect(prompts.q184).toBe('Aurora에 읽기 전용 복제본을 여러 개 두고, 애플리케이션이 어느 쪽으로 보낼지 직접 고르지 않게 하려 한다. 접속 주소 하나로 부하를 자동 분산하는 Aurora 전용 기능은?')
  expect(prompts.q186).toBe('DynamoDB에서 사고가 나기 직전 시점으로 데이터를 되돌리려고 특정 시점 복구(PITR)를 검토한다. PITR로 되돌릴 수 있는 최대 기간은?')
  expect(prompts.q188).toBe('트래픽이 급증할 때 새 EC2가 부팅되고 애플리케이션이 뜰 때까지 응답이 지연된다. 실행 비용은 늘리지 않으면서 이 지연을 없애는 Auto Scaling 기능은?')
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
const TARGET=['q179','q181','q183','q184','q186','q188'];
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
- 검증 스크립트에서 **`prompt`가 바뀐 문항이 정확히 `q179` `q181` `q183` `q184` `q186` `q188`**
  이고, **`prompt` 외 필드 그대로 / id 순서 그대로 / 금지 표현 없음이 전부 `true`**다.
- 6문항 모두 길이 120자 이하이고 정답 문자열을 노출하지 않는다.
- `grep -c`가 246을 출력한다.
- 변경된 파일이 위 세 개뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 이유: `data.test.ts`가 `q170`~`q246` 구간의 정답 분포가
  20~30% 범위에 있는지 검사한다. 하나만 바꿔도 깨진다.
- **상황 문장에 정답 보기의 문자열을 넣지 마라.** 이유: 읽자마자 답이 보이면 문항이 사라진다.
- **상황 문장에 보존 기간·복구 기간의 숫자를 넣지 마라.** 이유: `q181`·`q186`은 그 숫자가
  정답이거나 오답 보기라서, 언급하는 순간 소거가 끝난다.
- **오답을 지워주는 서술을 넣지 마라.** 예: "이것만으로는 안 된다", "X는 답이 아니다".
- **모델이 아는 AWS 지식으로 상황을 지어내지 마라.** 위 근거 표에 없는 사실이 필요하다고
  판단되면 문장을 바꾸지 말고 `blocked`로 멈춰라.
- 기존 테스트를 깨뜨리지 마라.
