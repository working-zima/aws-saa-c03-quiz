# Step 0: leadin-recheck

## 배경 — phase 18이 제외한 4문항을 다시 검토해 하나를 되살린다

phase 18은 상황 리드인을 붙이면 근거 개념의 문장이 곧 정답이 되는 문항 5개를 제외했다
(`q053`·`q057`·`q114`·`q144`·`q160`). phase 19·20 문서는 그 판단을 phase 19의 방식
(막연한 명사를 구체적 사례로 바꾸기)으로 다시 볼 가치가 있다고 남겨 두었다.

넷을 다시 읽은 결과는 이렇다.

| 문항 | 재검토 결과 |
|---|---|
| **q114** | **고칠 수 있다.** 아래에서 리드인을 붙인다 |
| q053 | 제외 유지 |
| q057 | 제외 유지 |
| q144 | 제외 유지 |

`q160`은 프롬프트가 이미 성질을 다 설명하므로 검토 대상이 아니다.

### q114를 되살릴 수 있는 이유

phase 18이 `q114`를 뺀 근거는 "개념 `summary`가 정답과 같은 문장"이라는 것이었다. 맞다.
`hybrid-connectivity.vpn-vs-direct-connect`의 `summary`는 "두 방식 모두 온프레미스와
AWS를 하나의 네트워크처럼 묶는다"이고, 이것이 그대로 정답 보기다.

그런데 리드인을 **`summary`가 아니라 문단 0·1에서** 가져오면 정답을 건드리지 않는다.
문단 0은 "Site-to-Site VPN은 인터넷에 암호화 터널을 구성한다", 문단 1은 "Direct Connect는
인터넷 대신 전용선을 설치한다"다. 두 서비스가 **무엇인지**만 말하고 **무엇을 잇는지는**
말하지 않으므로, 처음 보는 학습자가 두 이름을 알게 되면서도 공통 목적은 스스로 찾아야 한다.

`온프레미스`라는 단어를 리드인에 넣으면 안 된다. 보기 네 개가
`온프레미스와 AWS를 하나의 네트워크처럼 묶는다`(정답)·`AWS 서비스끼리 동작을 연결한다`·
`서로 다른 VPC만 직접 연결한다`·`외부 요청을 백엔드로 전달한다`여서, 그 단어 하나로
오답 세 개가 한꺼번에 소거된다.

### 나머지 셋의 제외 사유 — 갱신된 판단

| 문항 | 정답 | 왜 이번에도 못 고치는가 |
|---|---|---|
| q053 | 스토리지를 연결해서 사용한다 | "주된 목적"은 지시 대상이 빠진 일반 명사가 아니라 **질문의 주어 자체**다. 그래서 phase 19의 명사 교체 방식이 적용되지 않는다. 목적을 구체적으로 쓰면 그것이 정답이고, 개념 문단 0의 "옮기는 작업 자체가 목적인 DataSync·Snowball Edge와 달리"는 오답 판별 논리를 그대로 넘겨준다 |
| q057 | 자체 스토리지 없이 통로 역할을 한다 | 같은 이유다. 개념 문단 0의 "자체 저장 공간을 제공하지 않으며 온프레미스와 S3 사이의 통로로 동작한다"가 정답 문장이다. Storage Gateway를 설명하는 어떤 문장도 이 성질을 비켜 갈 수 없다 |
| q144 | 설정값과 비밀값의 안전한 저장 | 개념 문단 0이 "모두 설정값과 비밀값을 안전하게 보관할 수 있다"이고, 문제 은행 쪽 우회로도 막혀 있다. `q138`·`q139`의 프롬프트가 각각 "비밀값을 안전하게 관리", "설정값을 안전하게 관리"여서 두 서비스를 소개하는 순간 정답이 나온다 |

`q053`·`q057`·`q144`는 **보기를 다시 설계해야 손볼 수 있고, 그러면 `explanation`·
`answerIndex`와의 정합성까지 건드려야 한다.** 이 phase의 범위가 아니다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-011.
- `src/data/topics.json` — 근거를 확인만 한다. **이 step에서는 고치지 마라**(step 1이 고친다).
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙이고, 아래에 적힌 **한 줄만** 옮긴다.
- `scripts/topics-baseline.json` — `questionsSha256`을 갱신한다.
- `phases/18-assumed-terms/step0.md`, `phases/20-vague-referents/step0.md` — 선례와 제외 표.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 반영해 실패를 확인한 뒤**
`questions.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/questions.json`은 **문항 하나가 정확히 한 줄**인 포맷이다(전체 248줄:
`[` + 246문항 + `]`). 문항 23개는 줄이 `,{"id":"q...`처럼 콤마로 시작한다.

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** 한 줄 포맷이 깨진다.
- `q114` 줄에서 **`"prompt":"..."` 의 값만** 제자리에서 치환해라.
- 아래 문자열에는 따옴표·역슬래시가 없다. JSON 이스케이프 없이 그대로 넣는다.

### 문항 지금 / 바꿔

**q114** (`hybrid-connectivity.vpn-vs-direct-connect`) — 리드인

```
지금:
Site-to-Site VPN과 Direct Connect의 공통 목적은?
```
```
바꿔:
Site-to-Site VPN은 인터넷에 암호화 터널을 구성하고, Direct Connect는 전용선을 설치한다. 이 둘의 공통 목적은?
```

**이 한 줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 1개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·
  `answerIndex`·`explanation`은 한 글자도 바뀌면 안 된다.
- **`q114` 외의 문항을 고치지 마라.** 특히 `q053`·`q057`·`q144`는 그대로 둔다.
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/topics.json`을 건드리지 마라.**
- `scripts/topics-baseline.json`의 **`questionsSha256`만** 갱신한다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

### (1) 기존 테스트에서 `q114` 한 줄을 옮긴다

`src/data/data.test.ts`에 phase 18이 넣은 테스트가 있다. **이 테스트가 지금 `q114`를
옛 문장으로 고정하고 있으므로, 그 한 줄을 지우지 않으면 이 step은 통과할 수 없다.**

```ts
  it('정의 자체를 묻는 문항은 상황 문장 없이 그대로 남는다', () => {
```

이 블록에서 **아래 한 줄만 삭제한다.**

```ts
    expect(prompts.q114).toBe('Site-to-Site VPN과 Direct Connect의 공통 목적은?')
```

같은 블록의 `q053`·`q057`·`q144`·`q160` 줄은 **그대로 둔다.** 블록 이름과 주석도
바꾸지 마라. 이 테스트에서 손대는 것은 위 한 줄의 삭제뿐이다.

### (2) 새 테스트를 블록 끝에 덧붙인다

`describe('학습 데이터 무결성', ...)` 블록 **끝에** 덧붙인다.

```ts
it('phase 18이 제외했던 q114가 정답을 노출하지 않는 리드인을 받는다', () => {
  const question = questions.find(({ id }) => id === 'q114')

  expect(question?.prompt).toBe('Site-to-Site VPN은 인터넷에 암호화 터널을 구성하고, Direct Connect는 전용선을 설치한다. 이 둘의 공통 목적은?')
  expect(question?.prompt.length).toBeLessThanOrEqual(120)
  // 리드인에 온프레미스가 들어가면 오답 세 개가 한꺼번에 소거된다.
  expect(question?.prompt).not.toContain('온프레미스')
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
console.log('prompt가 바뀐 문항', changed.join(' '), '(기대 q114)');
const q=now.find(x=>x.id==='q114');
const hit=q.choices.filter(c=>q.prompt.includes(c));
console.log('길이', q.prompt.length, '(<=120)', q.prompt.length<=120);
console.log('보기 등장', hit.length?hit.join(','):'없음', '(기대 없음)');
console.log('온프레미스 등장', q.prompt.includes('온프레미스'), '(기대 false)');
for(const id of ['q053','q057','q144','q160']) console.log(' 제외 유지', id, om[id].prompt===now.find(x=>x.id===id).prompt);
"
```

```bash
grep -c '{"id":"q' src/data/questions.json   # 246
wc -l < src/data/questions.json              # 248
```

## 완료 조건

- `test`·`lint`·`build`·`check-structure`가 모두 통과한다.
- **`prompt`가 바뀐 문항이 `q114` 하나**이고 `prompt` 외 필드가 전부 불변이다.
- `q114`의 프롬프트에 **보기 문자열과 `온프레미스`가 등장하지 않고** 길이가 120자 이하다.
- `q053`·`q057`·`q144`·`q160`의 프롬프트가 그대로다.
- `grep -c '{"id":"q'`가 246, `wc -l`이 248을 출력한다.
- 변경된 파일이 `questions.json`·`data.test.ts`·`topics-baseline.json` 셋뿐이다.

## 금지사항

- **리드인을 개념 `summary`에서 가져오지 마라.** 이유: `hybrid-connectivity.vpn-vs-direct-connect`의
  `summary`("두 방식 모두 온프레미스와 AWS를 하나의 네트워크처럼 묶는다")가 곧 정답 보기다.
  문단 0·1에서만 가져온다.
- **리드인에 `온프레미스`를 쓰지 마라.** 이유: 보기 네 개 중 정답만 온프레미스를 말하므로
  오답 세 개가 소거된다.
- **`q053`·`q057`·`q144`를 고치지 마라.** 이유: 위 표에 적었다. 개념 본문과 인접 문항의
  프롬프트가 모두 정답 문장이어서 리드인이든 명사 교체든 정답이 드러난다.
- **`answerIndex`를 바꾸지 마라.** 정답 분포 테스트가 깨진다.
- **`정의 자체를 묻는 문항은 상황 문장 없이 그대로 남는다` 테스트를 지우거나 이름을
  바꾸지 마라.** 그 블록에서 지우는 것은 `q114` 한 줄뿐이다.
- 기존 테스트를 깨뜨리지 마라.
