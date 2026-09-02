# Step 0: vague-referents

## 배경 — 246문항을 전수로 읽어 앞 구간에서 7문항을 찾았다

phase 17·18·19가 문항 33 + 1개를 고쳤다. 그 문항들은 전부 `q131`~`q243` 구간에 있었다.
이번에는 **246문항의 프롬프트를 처음 보는 학습자의 눈으로 전부 읽었다.** 그 결과 앞 구간
(`q039`~`q217`)에서 같은 결함 7개가 새로 나왔다. 앞 구간이 덜 훑였던 것이 확인된 셈이다.

기계적 필터로 후보를 뽑는 방식은 앞선 세션에서 세 번 연속 실패했다. 결함의 모양이 매번
달라서(처음 나온 용어를 전제 / 수식어에 뜻이 없음 / 일반 명사에 지시 대상이 없음) 정규식이나
"다른 문항의 정답인 용어를 쓰는가" 같은 지표는 한 유형만 잡고 나머지를 놓쳤다. **이 step의
대상 7문항은 전수 읽기로 고른 것이고, 후속 세션에서도 필터를 대상 선정의 근거로 삼지 마라.**

## 두 가지 방식을 문항에 따라 나눠 쓴다

| 방식 | 언제 쓰는가 | 선례 |
|---|---|---|
| **명사 교체** | 일반 명사에 지시 대상이 없을 때. 그 명사 자리에 구체적 사례를 넣는다. 프롬프트가 길어지지 않는다 | phase 19 (`q088`) |
| **리드인 추가** | 문항이 용어를 설명 없이 전제할 때. 앞에 그 용어가 무엇인지 세우는 문장을 붙인다 | phase 17·18 (`q131`·`q156` 등) |

## 이 step이 새 사실을 넣지 않는다는 근거

**`docs/source/concepts-raw.md`는 이 저장소에 없다**(ADR-009에 따라 gitignore된 유료 교재
추출본이다). 그러므로 근거는 이미 저장소 안에 있는 세 곳에서만 가져온다. 아래 표의 모든
사실은 그 안에 있으며, 모델이 아는 AWS 지식으로 보강한 것은 하나도 없다.

| 문항 | 쓰는 사실 | 근거 |
|---|---|---|
| q039 | 복사·삭제가 그 "동일 작업"의 예다 | `topics.json` `s3-encryption-batch.batch-operations` 문단 0 — "수백만 개에서 수십억 개의 파일을 대상으로 복사, 삭제, 설정 적용 등의 동일한 작업을 한 번에 실행할 수 있다" |
| q043 | EFS IA는 접근이 뜸한 파일을 옮겨 두는 클래스다 | 같은 파일 `block-file-storage.efs` 문단 2 — "EFS Intelligent-Tiering은 접근이 뜸한 파일을 EFS IA(Infrequent Access) 클래스로 이동한다" |
| q075 | 그 "목표값"의 예가 평균 CPU 사용률 70%다 | 같은 파일 `compute-delivery.ec2` 문단 1 — "지표가 지정한 목표를 유지하도록 용량을 조정 … 예를 들어 평균 CPU 사용률이 70%를 넘을 때" |
| q103 | NAT 게이트웨이는 밖에서 시작하는 접근은 막고 안에서 나가는 통신만 준다 | 같은 파일 `vpc-networking.nat-gateway` 문단 0 — "내부에서는 외부 인터넷에 접속할 수 있지만 인터넷에서 서브넷으로 시작하는 접근은 허용하지 않는다" |
| q133 | 보안 그룹은 요청을 문 앞에서 검사하는 방화벽이다 | 같은 파일 `security-groups-nacl.security-group` 문단 0. **`q131`의 프롬프트가 이미 이 문장을 쓴다** |
| q135 | NACL은 서브넷 경계에서 트래픽을 허용하거나 거부한다 | 같은 파일 `security-groups-nacl.nacl` summary. `q130`의 프롬프트도 같은 내용이다 |
| q217 | Site-to-Site VPN은 인터넷에 암호화된 터널을 만들어 온프레미스와 AWS를 연결한다 | `q109`의 프롬프트 = `hybrid-connectivity.site-to-site-vpn` 개념 |

**ADR-010(일반 IT 용어 예외)의 목록을 늘리지 않는다.**

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010·ADR-011.
- `src/data/topics.json` — 위 표의 근거를 확인만 한다. **고치지 마라.**
- `src/data/questions.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/topics-baseline.json` — `questionsSha256`을 갱신한다.
- `phases/17-leadin-questions/step0.md`, `phases/18-assumed-terms/step0.md`,
  `phases/19-concrete-nouns/step0.md` — 선례. phase 18의 "대상에서 제외한 문항" 표와
  아래 "대상에서 제외한 문항" 표를 **둘 다** 읽어라. 거기 있는 문항은 손대면 정답이 드러난다.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`questions.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/questions.json`은 **문항 하나가 정확히 한 줄**인 포맷이다(전체 248줄:
`[` + 246문항 + `]`). 문항 23개는 줄이 `,{"id":"q...`처럼 콤마로 시작한다.

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** 한 줄 포맷이 깨진다.
- 해당 문항의 줄에서 **`"prompt":"..."` 의 값만** 제자리에서 치환해라.
- 아래 7개 문자열에는 따옴표·역슬래시가 없다. JSON 이스케이프 없이 그대로 넣는다.

### 문항별 지금 / 바꿔

**q039** (`s3-encryption-batch.batch-operations`) — 명사 교체

```
지금:
수백만~수십억 개의 파일에 동일 작업을 한 번에 실행하는 서비스는?
```
```
바꿔:
수백만~수십억 개의 파일을 한꺼번에 복사하거나 삭제하는 것처럼 동일한 작업을 일괄 실행하는 서비스는?
```

**q043** (`block-file-storage.efs`) — 리드인

```
지금:
EFS IA로 이동한 파일의 접근 특성으로 맞는 것은?
```
```
바꿔:
EFS IA(Infrequent Access)는 접근이 뜸한 파일을 옮겨 두는 EFS 클래스다. 이 클래스로 옮긴 파일의 접근 특성으로 맞는 것은?
```

**q075** (`compute-delivery.ec2`) — 명사 교체

```
지금:
원하는 목표값을 유지하도록 서버를 자동으로 확장하거나 축소하는 정책은?
```
```
바꿔:
평균 CPU 사용률 70% 같은 목표값을 유지하도록 서버를 자동으로 확장하거나 축소하는 정책은?
```

**q103** (`vpc-networking.nat-gateway`) — 리드인

```
지금:
NAT 게이트웨이를 연결하는 위치는?
```
```
바꿔:
NAT 게이트웨이는 외부에서 시작하는 접근은 막고 내부에서 인터넷으로 나가는 통신만 가능하게 하는 장치다. 이 게이트웨이를 연결하는 위치는?
```

**q133** (`security-groups-nacl.security-group`) — 리드인

```
지금:
보안 그룹 규칙에 추가할 수 있는 동작은?
```
```
바꿔:
보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다. 이 규칙에 추가할 수 있는 동작은?
```

**q135** (`security-groups-nacl.nacl`) — 리드인

```
지금:
NACL 규칙 설정에 사용할 수 있는 대상은?
```
```
바꿔:
NACL은 서브넷 경계에서 트래픽을 허용하거나 거부하는 기능이다. 이 규칙 설정에 사용할 수 있는 대상은?
```

**q217** (`hybrid-connectivity.access-terms`) — 리드인

```
지금:
Site-to-Site VPN에서 고객 측 종단을 가리키는 구성 요소는?
```
```
바꿔:
Site-to-Site VPN은 인터넷에 암호화된 터널을 만들어 온프레미스와 AWS를 연결한다. 이 연결에서 고객 측 종단을 가리키는 구성 요소는?
```

**이 7줄의 `prompt` 값이 이 step의 데이터 변경 전부다.** 문항 246개 중 7개만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`prompt` 외의 필드를 건드리지 마라.** `id`·`topicId`·`conceptId`·`choices`·
  `answerIndex`·`explanation`은 한 글자도 바뀌면 안 된다.
- **위 7문항 외의 문항을 고치지 마라.**
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/topics.json`을 건드리지 마라.**
- `scripts/topics-baseline.json`의 **`questionsSha256`만** 갱신한다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 대상에서 제외한 문항 — 빠뜨린 것이 아니다

아래 7문항은 전수 읽기에서 같은 결함으로 후보에 올랐지만 **의도적으로 제외했다.**
나중에 이 문항들을 "아직 안 고친 것"으로 보고 손대지 마라. 테스트가 이 프롬프트들을
현재 문장으로 고정하므로, 고치면 테스트가 깨진다.

| 문항 | 정답 | 왜 못 고치는가 |
|---|---|---|
| q066 | 고성능 관계형 데이터베이스 | "Aurora를 가장 잘 설명한 것은?" — 정의 자체를 묻는 문항이라 리드인이 곧 정답이다. phase 18이 `q053`·`q114`를 뺀 것과 같은 사유다 |
| q115 | 인터넷을 거치지 않는 전용선 | 정답 문장이 `q110`의 프롬프트("인터넷을 거치지 않고 전용선으로 온프레미스와 AWS를 연결하는")와 같다. "통신 기반"을 다른 명사로 바꿔도 이 중복은 풀리지 않는다 |
| q142 | 암호화 키 | 정답이 `q141`의 프롬프트("암호화에 사용하는 키를 생성하고 보관하는")와 같다. KMS를 설명하는 리드인은 정답을 그대로 알려준다 |
| q147 | L7 애플리케이션 계층 | WAF를 설명하는 어떤 리드인도 웹·HTTP를 언급해야 하고, 그러면 애플리케이션 계층이 시사된다. "계층"이라는 명사는 보기 네 개가 모두 `L2`~`L7`이어서 이미 해소된다 |
| q180 | 분석용 읽기 쿼리 처리 | 다중 AZ 대기 인스턴스를 설명하는 리드인은 오답 세 개(자동 전환·고가용성 확보·장애 조치 대기)를 참으로 확인해 주고, 정답이 소거로 드러난다 |
| q201 | AWS Batch | `q088`과 완전히 같은 결함("여러 **작업**을 한꺼번에 모아서 처리")인데 **출처에 구체적 사례가 없다.** `topics.json` `serverless-containers.aws-batch`와 `exam-gaps.md`의 `aws-batch` 항목은 "여러 작업을 한꺼번에 모아서 처리하는 배치 처리 서비스"와 "Step Functions와 헷갈리기 쉽다" 두 문장뿐이고, 후자를 리드인으로 쓰면 오답 `Step Functions`가 소거된다. 문제 은행 안에도 배치 작업의 용례가 없다. **사실을 지어내 채우지 마라.** 고치려면 ADR-010을 넓히는 개정이 먼저다 |
| q226 | Web ACL은 WAF, NACL은 서브넷 경계에서 통제한다 | Web ACL이 무엇인지 세우는 문장이 곧 정답 보기다 |

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 덧붙인다.
`prompts` 맵과 보기 미등장 검사는 기존 테스트가 쓰는 방식과 같게 맞춘다.

```ts
it('가리키는 대상이 없던 명사와 전제 용어가 문항 안에서 해결된다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  expect(prompts.q039).toBe('수백만~수십억 개의 파일을 한꺼번에 복사하거나 삭제하는 것처럼 동일한 작업을 일괄 실행하는 서비스는?')
  expect(prompts.q043).toBe('EFS IA(Infrequent Access)는 접근이 뜸한 파일을 옮겨 두는 EFS 클래스다. 이 클래스로 옮긴 파일의 접근 특성으로 맞는 것은?')
  expect(prompts.q075).toBe('평균 CPU 사용률 70% 같은 목표값을 유지하도록 서버를 자동으로 확장하거나 축소하는 정책은?')
  expect(prompts.q103).toBe('NAT 게이트웨이는 외부에서 시작하는 접근은 막고 내부에서 인터넷으로 나가는 통신만 가능하게 하는 장치다. 이 게이트웨이를 연결하는 위치는?')
  expect(prompts.q133).toBe('보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다. 이 규칙에 추가할 수 있는 동작은?')
  expect(prompts.q135).toBe('NACL은 서브넷 경계에서 트래픽을 허용하거나 거부하는 기능이다. 이 규칙 설정에 사용할 수 있는 대상은?')
  expect(prompts.q217).toBe('Site-to-Site VPN은 인터넷에 암호화된 터널을 만들어 온프레미스와 AWS를 연결한다. 이 연결에서 고객 측 종단을 가리키는 구성 요소는?')
})

it('보강한 7문항이 보기를 노출하지 않고 길이 상한을 지킨다', () => {
  const targetIds = ['q039', 'q043', 'q075', 'q103', 'q133', 'q135', 'q217']
  const targets = questions.filter(({ id }) => targetIds.includes(id))

  expect(targets).toHaveLength(7)
  targets.forEach((question) => {
    expect(question.prompt.length).toBeLessThanOrEqual(120)
    // 보기 문자열을 꺼내면 오답이 소거된다.
    question.choices.forEach((choice) => {
      expect(question.prompt).not.toContain(choice)
    })
  })
})

it('리드인이 곧 정답이 되는 문항은 그대로 남는다', () => {
  const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

  // 전수 읽기에서 후보로 올랐지만 손대면 정답이 드러나는 문항들이다. 바뀌면 노출된 것이다.
  expect(prompts.q066).toBe('Aurora를 가장 잘 설명한 것은?')
  expect(prompts.q115).toBe('높은 대역폭과 빠른 성능을 제공하며 보안성이 높은 Direct Connect의 통신 기반은?')
  expect(prompts.q142).toBe('KMS가 저장하는 대상으로 알맞은 것은?')
  expect(prompts.q147).toBe('WAF가 방어하는 공격이 속한 계층은?')
  expect(prompts.q180).toBe('RDS 다중 AZ 배포의 대기 인스턴스로 할 수 없는 작업은?')
  // q201은 출처에 구체적 사례가 없어 명사를 바꿀 수 없다. 사실을 지어내면 ADR-006·008·009 위반이다.
  expect(prompts.q201).toBe('여러 작업을 한꺼번에 모아서 처리하는 데 적합한 서비스는?')
  expect(prompts.q226).toBe('Web ACL과 네트워크 ACL의 역할을 올바르게 설명한 것은?')
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
console.log('prompt가 바뀐 문항', changed.join(' '), '(기대 q039 q043 q075 q103 q133 q135 q217)');
for(const id of ['q039','q043','q075','q103','q133','q135','q217']){
  const q=now.find(x=>x.id===id);
  const hit=q.choices.filter(c=>q.prompt.includes(c));
  console.log(' ', id, '길이', q.prompt.length, '(<=120)', q.prompt.length<=120, '| 보기 등장', hit.length?hit.join(','):'없음', '(기대 없음)');
}
"
```

`grep`으로 문항 수를 셀 때는 **콤마로 시작하는 줄까지 세는 패턴**을 써라. phase 19의
step 문서는 `'^{"id":"q'`를 써서 223을 얻고 246을 기대했는데, 그 23개 차이는 데이터가
아니라 패턴 탓이었다.

```bash
grep -c '{"id":"q' src/data/questions.json   # 246
wc -l < src/data/questions.json              # 248
```

## 완료 조건

- `test`·`lint`·`build`·`check-structure`가 모두 통과한다.
- **`prompt`가 바뀐 문항이 `q039`·`q043`·`q075`·`q103`·`q133`·`q135`·`q217` 일곱 개**이고
  `prompt` 외 필드가 전부 불변이다.
- 그 7문항의 프롬프트에 **보기 문자열이 하나도 등장하지 않고** 길이가 120자 이하다.
- 제외한 7문항(`q066`·`q115`·`q142`·`q147`·`q180`·`q201`·`q226`)의 프롬프트가 그대로다.
- `grep -c '{"id":"q'`가 246, `wc -l`이 248을 출력한다.
- 변경된 파일이 `questions.json`·`data.test.ts`·`topics-baseline.json` 셋뿐이다.

## 금지사항

- **`answerIndex`를 바꾸지 마라.** 정답 분포 테스트가 깨진다.
- **`q135`의 리드인에 "개별 리소스가 아니라"를 쓰지 마라.** 이유: `q135`의 보기가
  `AWS 리소스만`·`AWS 리소스와 IP`·`IP만`·`포트만`이어서, 리소스가 대상이 아니라고
  말하면 오답 두 개가 한꺼번에 소거된다. `q134`가 그 문장을 쓰는 것은 그 문항의 보기가
  초기 상태를 묻기 때문이지, `q135`에 옮겨 써도 된다는 뜻이 아니다.
- **`q103`의 리드인에 "프라이빗 서브넷"이나 "퍼블릭 서브넷"을 쓰지 마라.** 이유: 둘 다
  보기 문자열이다. 출처의 "내부에서는 … 인터넷에서 서브넷으로 시작하는 접근은 허용하지
  않는다"를 서브넷 이름 없이 옮긴 것이 위 "바꿔" 문장이다.
- **`q043`의 리드인에 "기다리지 않고 바로 접근할 수 있다"를 쓰지 마라.** 이유: 개념 문단
  2의 그 문장이 곧 `q043`의 정답이다. 같은 문단에서 앞 문장만 가져온다.
- **`q201`을 고치지 마라.** 이유: 출처에 구체적 사례가 없어 사실을 지어내야 한다.
  ADR-006·008·009 위반이다.
- **`q039`의 "복사하거나 삭제하는"에서 `삭제`를 빼지 마라.** 이유: 오답 `S3 수명 주기 정책`도
  삭제를 하므로, 이 단어가 남아 있어야 오답이 여전히 그럴듯하다. 출처 문단에도 둘 다 있다.
- **서로 다른 문항의 사례를 하나의 시나리오로 엮지 마라.** 이유: 그 연결은 출처에 없다.
- 기존 테스트를 깨뜨리지 마라.

---

## 이 phase 이후에 남는 일

여기까지는 사용자와 확정한 범위다. 아래는 **아직 확정하지 않은 것**이므로,
착수하기 전에 사용자에게 범위를 확인받아라.

1. **`q201`을 위한 ADR-010 개정** — "여러 작업"의 지시 대상을 세우려면 출처 밖의 사례
   ("서버 관리 없는 대규모 연산 작업" 같은 것)를 들여야 한다. ADR-010은 지금 일반 IT
   용어의 한 줄 풀이만 예외로 두고 있다. 이것을 서비스 용례까지 넓힐지는 ADR 개정 사안이다.

2. **phase 18에서 제외한 5문항 재검토** — `q053`·`q057`·`q114`·`q144`는 리드인을 붙이면
   개념 summary가 곧 정답이 되어 제외됐다. phase 19의 "명사를 구체적 사례로 바꾼다"는
   방식으로는 풀릴 수 있다. **단, 재검토 결과 여전히 정답이 드러난다면 제외 판단을
   유지하고 사유만 갱신해라.** `q160`은 프롬프트가 이미 성질을 설명하므로 고칠 것이 없다.

3. **개념 본문의 같은 공백** — 문항이 아니라 개념 쪽 문제다. `serverless-containers.lambda`는
   서버리스·콜드 스타트·15분 제한을 설명하면서 **Lambda가 무슨 일을 하는지 예를 한 번도
   들지 않는다.** `cost-management.cost-allocation-tag-activation`도 태그가 무엇인지 말하지
   않고 활성화 순서만 가르친다. 섹션 모드로 개념을 읽고 들어오는 경로에서는 이 공백이
   그대로다. Lambda는 용례가 `q097`·`q205`·`q207`에 있어 ADR 개정 없이 가능하지만,
   항목마다 출처 유무를 따로 확인해야 한다.

4. **`q077`과 `q164`의 프롬프트 충돌** — 이 step의 결함 유형과는 다르지만 전수 읽기에서
   눈에 걸린 것이라 적어 둔다. `q077` "1년 또는 3년 장기 사용이 확정됐을 때 약정으로
   할인받는 EC2 유형은?"(정답 예약 인스턴스)과 `q164` "일정 기간과 사용량을 약정해
   할인된 요금을 적용받는 모델은?"(정답 Savings Plan)이 거의 같은 문장인데 정답이 다르다.
   보기를 봐야 구분되므로 프롬프트만으로는 어느 쪽인지 정할 수 없다. 손대려면 두 개념의
   구분 근거를 출처에서 먼저 찾아야 한다.
