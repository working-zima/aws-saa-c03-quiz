# Step 0: assumed-terms

## 배경 — 문항이 전제한 용어를 어디서도 알려주지 않는다

phase 17이 `q170`~`q246`(exam-gaps 유래) 중 29문항에 상황 리드인을 세웠다. 그런데 사용자가
곧바로 범위 **밖**의 사례를 짚었다.

> "장기 Access Key 공유 없이 언제든 해제할 수 있는 권한 부여 방식은?"이라는 문제를 보면
> 장기 Access Key가 무엇을 말하는 지 모르겠어.

`q156`이다. 인덱스 155라 exam-gaps 구간(169~245)에 들어가지 않아 phase 17에서 구조적으로
걸러질 수 없었다. **결함은 출처와 무관하게 문제 은행 전체에 퍼져 있다.**

`q157`이 정확히 이 용어를 가르친다 — "IAM 사용자가 발급받는 만료 기간 없는 장기 자격
증명은? → Access Key". 하지만 ADR-011에 따라 확인 문제는 열 때마다 문항 순서를 섞고,
랜덤 문제는 전체에서 일부만 뽑는다. `q157`이 먼저 나온다는 보장이 없고 같은 세트에 없을
수도 있다. **각 문항은 단독으로 읽혀야 한다.**

이 step은 그런 문항 4개를 고친다. `q131`·`q132`·`q134`는 "**기본**"이 무슨 뜻인지가
막히는 자리다. 기본값이라는 것이 있다는 사실 자체를 알아야 풀 수 있었다.

## 이 step이 새 사실을 넣지 않는다는 근거

대상 4문항은 `q001`~`q169` 구간이라 원래 출처는 `docs/source/concepts-raw.md`인데
**그 파일은 저장소에 없다**(ADR-009에 따라 gitignore된 외부 참고 자료 추출본). 대신 그것을
재작성한 `src/data/topics.json`의 개념 본문이 근거다. 상황 문장의 사실은 전부 그 안에 있다.

| 문항 | 상황 문장이 쓰는 사실 | 근거 (`src/data/topics.json`) |
|---|---|---|
| q131 | 보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다 | `security-groups-nacl.security-group` 문단 0 — "리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽 역할을 한다" |
| q131 | "기본"은 규칙을 추가하지 않은 초기 상태를 뜻한다 | 같은 개념 문단 3 — "초기 상태에서는 …" |
| q132 | 보안 그룹은 밖으로 나가는 트래픽에도 규칙을 적용한다 | 같은 개념 문단 1 — "규칙은 들어오는 인바운드와 밖으로 나가는 아웃바운드 트래픽에 각각 적용한다" |
| q134 | NACL은 서브넷 경계에서 트래픽을 통제한다 | `security-groups-nacl.nacl` summary — "NACL은 서브넷 경계에서 트래픽을 허용하거나 거부한다" |
| q134 | 보안 그룹과 달리 개별 리소스 단위가 아니다 | `security-groups-nacl.security-group` summary — "개별 AWS 리소스로 오가는 트래픽을 통제한다" |
| q156 | Access Key는 만료 시점이 없어 장기 자격 증명으로 분류한다 | `identity-access.iam` 문단 1 — "Access Key에는 만료 시점이 없어서 장기 자격 증명으로 분류한다" |
| q156 | 자격 증명을 서로 전달하지 않고 언제든 해제할 수 있다 | 같은 개념 문단 2 — "자격 증명을 서로 전달할 필요가 없으며, 필요할 때 언제든 역할을 해제할 수 있다" |

**ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.** 위 사실은 전부 두 출처를 재작성한
개념 본문 안에 있어 예외가 필요하지 않다.

## 대상에서 제외한 문항 — 빠뜨린 것이 아니다

아래 5문항은 같은 결함으로 후보에 올랐지만 **의도적으로 제외했다.** 앞에 상황 문장을 세우면
그 문장이 곧 정답이 된다. 나중에 이 문항들을 "아직 안 고친 것"으로 보고 손대지 마라.

| 문항 | 정답 | 왜 못 고치는가 |
|---|---|---|
| q053 | 스토리지를 연결해서 사용한다 | `data-transfer-services.storage-gateway` summary가 "온프레미스에서 S3를 로컬 저장소처럼 이용하도록 이어 주는 서비스"다. 리드인으로 쓰면 정답을 그대로 알려준다 |
| q057 | 자체 스토리지 없이 통로 역할을 한다 | 같은 개념 문단 0의 "자체 저장 공간을 제공하지 않으며 … 통로로 동작한다"가 정답 문장이다 |
| q114 | 온프레미스와 AWS를 하나의 네트워크처럼 묶는다 | `hybrid-connectivity.vpn-vs-direct-connect` summary가 정답과 같은 문장이다 |
| q144 | 설정값과 비밀값의 안전한 저장 | `secrets-encryption.secrets-manager-vs-parameter-store` 문단 0이 정답과 같은 문장이다 |
| q160 | STS | 프롬프트가 이미 "만료 기간이 있는 … 임시 권한"이라고 성질을 다 설명한다. 고칠 것이 없다 |

앞 넷은 **정의 자체를 묻는 문항**이라 보기를 다시 설계해야 손볼 수 있고, 그러면
`explanation`·`answerIndex`와의 정합성까지 건드려야 해서 이 phase의 범위를 벗어난다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010·ADR-011 — 특히 ADR-011(섞기)이
  "앞 문항이 용어를 가르쳐 준다"는 가정을 무효로 만든 근거다.
- `src/data/topics.json` — 근거를 확인만 한다. **고치지 마라.**
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/topics-baseline.json` — `questionsSha256`을 갱신한다.
- `scripts/check-structure.mjs` — 구조 가드레일. 이 step에서 반드시 통과해야 한다.
- `phases/17-leadin-questions/step0.md` — 같은 작업의 선례. 리드인 규약이 같다.

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

**q131** (`security-groups-nacl.security-group`)

```
지금:
보안 그룹의 기본 인바운드 규칙은?
```
```
바꿔:
보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다. 규칙을 하나도 추가하지 않은 초기 상태의 인바운드는?
```

**q132** (`security-groups-nacl.security-group`)

```
지금:
보안 그룹의 기본 아웃바운드 규칙은?
```
```
바꿔:
보안 그룹은 리소스에서 밖으로 나가는 트래픽에도 규칙을 적용한다. 규칙을 하나도 추가하지 않은 초기 상태의 아웃바운드는?
```

**q134** (`security-groups-nacl.nacl`)

```
지금:
NACL의 기본 인바운드와 아웃바운드 상태는?
```
```
바꿔:
NACL은 개별 리소스가 아니라 서브넷 경계에서 트래픽을 통제한다. 규칙을 손대지 않은 초기 상태의 인바운드와 아웃바운드는?
```

**q156** (`identity-access.iam`)

```
지금:
장기 Access Key 공유 없이 언제든 해제할 수 있는 권한 부여 방식은?
```
```
바꿔:
Access Key는 만료 시점이 없어 장기 자격 증명으로 분류한다. 이런 키를 서로 전달하지 않고 언제든 해제할 수 있는 권한 부여 방식은?
```

**이 4개 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 4개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·`answerIndex`·
  `explanation`은 한 글자도 바뀌면 안 된다. 이유: 문항이 `conceptId`로 개념을 참조하고,
  `data.test.ts`가 정답 분포와 주제별 문항 수를 하드코딩으로 검증한다.
- **위에 적힌 4문항 외의 문항을 고치지 마라.** 특히 위 "제외한 문항" 표의 5개는 손대면
  정답이 드러난다.
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/topics.json`을 건드리지 마라.** 개념 본문은 이 phase의 범위가 아니다.
- **`docs/source/`의 문장을 그대로 옮기지 마라**(ADR-009). 위 문자열은 이미 그 규칙에 맞게
  다시 쓴 것이므로, 그대로 넣으면 된다.
- `scripts/topics-baseline.json`의 **`questionsSha256`만** 갱신한다. `conceptLineCount`와
  `topics`는 건드리지 마라.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 둘을 덧붙인다.
기존 `it`을 수정하거나 지우지 마라.

```ts
it('전제 용어를 설명하지 않던 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q131).toBe('보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다. 규칙을 하나도 추가하지 않은 초기 상태의 인바운드는?')
  expect(prompts.q132).toBe('보안 그룹은 리소스에서 밖으로 나가는 트래픽에도 규칙을 적용한다. 규칙을 하나도 추가하지 않은 초기 상태의 아웃바운드는?')
  expect(prompts.q134).toBe('NACL은 개별 리소스가 아니라 서브넷 경계에서 트래픽을 통제한다. 규칙을 손대지 않은 초기 상태의 인바운드와 아웃바운드는?')
  expect(prompts.q156).toBe('Access Key는 만료 시점이 없어 장기 자격 증명으로 분류한다. 이런 키를 서로 전달하지 않고 언제든 해제할 수 있는 권한 부여 방식은?')
})

it('정의 자체를 묻는 문항은 상황 문장 없이 그대로 남는다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  // 리드인을 붙이면 개념 summary가 곧 정답이 되는 문항들이다. 바뀌면 정답이 노출된 것이다.
  expect(prompts.q053).toBe('Storage Gateway의 주된 목적은?')
  expect(prompts.q057).toBe('Storage Gateway 자체의 스토리지 기능에 대한 설명으로 맞는 것은?')
  expect(prompts.q114).toBe('Site-to-Site VPN과 Direct Connect의 공통 목적은?')
  expect(prompts.q144).toBe('Secrets Manager와 Parameter Store의 공통 기능은?')
  expect(prompts.q160).toBe('만료 기간이 있는 Access Key나 Token 형태의 임시 권한을 발급하는 서비스는?')
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

변경 범위를 확인한다. 모든 줄이 기대값과 일치해야 한다.

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const TARGET=['q131','q132','q134','q156'];
const KEEP=['q053','q057','q114','q144','q160'];
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
const nm=Object.fromEntries(now.map(x=>[x.id,x]));
for(const id of TARGET){ const q=nm[id]; const a=q.choices[q.answerIndex];
  const hit=q.choices.filter(c=>q.prompt.includes(c));
  console.log(' ', id, '길이', q.prompt.length, '(<=120)', q.prompt.length<=120, '/ 정답 미노출', !q.prompt.includes(a), '/ 보기 문자열 등장', hit.length?hit.join(','):'없음'); }
console.log('제외 5문항 그대로', KEEP.every(id=>om[id].prompt===nm[id].prompt), '(기대 true)');
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
- 검증 스크립트에서 **`prompt`가 바뀐 문항이 정확히 `q131` `q132` `q134` `q156` 4개**이고,
  **`prompt` 외 필드 그대로 / id 순서 그대로 / 제외 5문항 그대로 / 금지 표현 없음이 전부 `true`**다.
- 4문항 모두 길이 120자 이하이고, 정답은 물론 **다른 보기 문자열도 등장하지 않는다**.
- `grep -c`가 246을 출력한다.
- 변경된 파일이 위 세 개뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 이유: `data.test.ts`가 여러 구간의 정답 분포가 20~30%
  범위에 있는지 검사한다. 하나만 바꿔도 깨진다.
- **`q053`·`q057`·`q114`·`q144`·`q160`을 고치지 마라.** 이유: 앞 넷은 상황 문장이 곧
  정답이고, `q160`은 이미 성질을 설명하고 있어 고칠 것이 없다. 위 "제외한 문항" 표를 읽어라.
- **상황 문장에 보기 문자열을 넣지 마라.** 정답뿐 아니라 오답 보기도 마찬가지다. 이유:
  `q131`의 보기가 `모든 트래픽 허용`·`모든 트래픽 차단`처럼 서로 반대라서, 한쪽만 언급해도
  소거가 끝난다.
- **모델이 아는 AWS 지식으로 상황을 지어내지 마라.** 위 근거 표에 없는 사실이 필요하다고
  판단되면 문장을 바꾸지 말고 `blocked`로 멈춰라.
- 기존 테스트를 깨뜨리지 마라.
