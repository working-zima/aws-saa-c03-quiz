# Step 1: concept-examples

## 배경 — 같은 공백이 개념 본문에도 있다

phase 17~20은 문항 41개의 프롬프트를 고쳤다. 그런데 이 앱은 **개념을 읽고 바로 확인 문제를
푸는** 구조이고, 섹션 모드로 개념부터 읽고 들어오는 경로가 있다. 문항만 고치면 그 경로에서는
공백이 그대로다.

두 곳이 그렇다.

**`serverless-containers.lambda`** — 서버리스·콜드 스타트·15분 제한을 세 문단에 걸쳐
설명하면서 **Lambda가 무슨 일을 하는지 예를 한 번도 들지 않는다.** 문단 0의 마지막이
"가끔 실행하는 작업에 유용하다"인데, 그 "작업"에 지시 대상이 없다. `q088`에서 사용자가
지적한 것과 똑같은 모양이 개념 본문에 남아 있는 것이다.

**`cost-management.cost-allocation-tag-activation`** — 문단 0이 곧바로 "순서가 중요하다"로
시작해 활성화 순서만 가르치고, **비용 할당 태그가 무엇이고 왜 붙이는지는 끝내 말하지 않는다.**
`q243`을 고칠 때 드러난 공백이 개념 쪽에 그대로 있다.

## 이 step이 새 사실을 넣지 않는다는 근거

**`docs/source/concepts-raw.md`는 이 저장소에 없다**(ADR-009에 따라 gitignore된 외부 참고 자료
추출본이다). 그러므로 근거는 이미 저장소 안에 있는 것만 쓴다. 아래 표의 사실은 전부 문제
은행과 같은 개념의 다른 문단에 있으며, 모델이 아는 AWS 지식으로 보강한 것은 하나도 없다.

| 넣는 사실 | 근거 |
|---|---|
| S3에 올라온 이미지를 리사이징하는 것이 Lambda가 하는 일의 예다 | `q097` 프롬프트 — "S3 이미지 업로드 뒤 Lambda 이미지 리사이징을 실행하도록 연결할 때 사용하는 서비스는?" |
| 정해진 시각에 개발용 RDS를 켜고 끄는 것도 그런 예다 | `q205` 프롬프트 — "개발용 RDS를 평일 업무 시작과 종료 시각에 맞춰 켜고 끌 때 Lambda와 함께 사용할 기능은?" |
| 비용 할당 태그는 리소스에 직접 붙이는 사용자 정의 태그다 | 같은 개념 문단 0 — "먼저 리소스에 태그를 붙이고, 그다음 … 그 사용자 정의 태그를 활성화" |
| 부서별로 비용을 나눠 보는 데 쓴다 | 같은 개념 문단 1 — "`aws:createdBy` 같은 시스템 태그는 부서별 비용 분석용이 아니다" / `q243` 프롬프트 — "부서별로 비용을 나눠 보려고 리소스에 사용자 정의 태그를 붙였다" |

**ADR-010(일반 IT 용어 예외)을 근거로 쓰지 않는다.** 그 ADR은 용어 13종으로 목록이
닫혀 있고 늘리려면 ADR을 고쳐야 한다. 이 step이 넣는 것은 일반 IT 용어의 풀이가 아니라
**저장소 안에 이미 있는 용례**이므로 그 목록과 무관하다. **13종 목록에 손대지 마라.**

ADR-010이 정한 편집 범위는 이 step에도 그대로 적용한다: `id`·`name`·개념 개수·주제 배치·
**`summary`를 바꾸지 않고 `paragraphs`의 문장만** 손댄다.

## 읽어야 할 파일

- `CLAUDE.md` — 출처 제한과 TDD 규칙.
- `docs/ADR.md`의 ADR-006·ADR-008·ADR-009·ADR-010. 특히 ADR-010의 "경계 — 무엇이
  예외가 아닌가"와 "개념 구조는 그대로다".
- `src/data/topics.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/questions.json` — 위 표의 근거를 확인만 한다. **고치지 마라.**
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/check-structure.mjs` — 개념 한 줄 포맷을 강제하는 검사다. 읽어 두면 왜
  재직렬화가 금지인지 알 수 있다.
- `phases/13-term-gloss/step0.md` — 개념 본문을 손댄 유일한 선례. 편집 방식을 참고해라.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`topics.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/topics.json`은 **개념 하나가 정확히 한 줄**인 포맷이다. 개념 줄은 공백 6칸으로
들여쓴 뒤 `{"id":"` 로 시작하고, `scripts/check-structure.mjs`가 그런 줄이 정확히 182개인지
검사한다.

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** 한 줄 포맷이 깨지고
  `check-structure`가 실패한다.
- 해당 개념 줄에서 **`paragraphs` 배열의 첫 문자열만** 제자리에서 치환해라.
- **`paragraphs` 배열에 원소를 새로 추가하지 마라.** 기존 문단 0의 문장을 늘리는 것이다.
  문단 개수가 바뀌면 아래 테스트가 실패한다.
- `serverless-containers.lambda`는 127번째 줄, `cost-management.cost-allocation-tag-activation`은
  281번째 줄에 있다(현재 기준. 줄 번호가 아니라 `id`로 찾아라).
- 아래 문자열에는 따옴표·역슬래시가 없다. JSON 이스케이프 없이 그대로 넣는다.

### 개념별 지금 / 바꿔

**`serverless-containers.lambda`** — `paragraphs[0]`

```
지금:
서버를 AWS가 관리하고 개발자는 코드에 집중하는 실행 방식을 서버리스라고 한다. Lambda는 요청이 생길 때만 동작하고 요청이 없으면 멈춘 채 기다리므로 비용을 아낄 수 있으며, 가끔 실행하는 작업에 유용하다.
```
```
바꿔:
서버를 AWS가 관리하고 개발자는 코드에 집중하는 실행 방식을 서버리스라고 한다. Lambda는 요청이 생길 때만 동작하고 요청이 없으면 멈춘 채 기다리므로 비용을 아낄 수 있으며, 가끔 실행하는 작업에 유용하다. S3에 올라온 이미지를 리사이징하거나 정해진 시각에 개발용 RDS를 켜고 끄는 것이 그런 작업의 예다.
```

앞부분은 한 글자도 바뀌지 않는다. **마지막에 한 문장을 붙이는 것뿐이다.**

**`cost-management.cost-allocation-tag-activation`** — `paragraphs[0]`

```
지금:
순서가 중요하다. 먼저 리소스에 태그를 붙이고, 그다음 결제 대시보드에서 그 사용자 정의 태그를 활성화(Activate)해야 비용 분석 도구에서 쓸 수 있다.
```
```
바꿔:
비용 할당 태그는 리소스에 직접 붙이는 사용자 정의 태그로, 부서별로 비용을 나눠 보는 데 쓴다. 순서가 중요하다. 먼저 리소스에 태그를 붙이고, 그다음 결제 대시보드에서 그 사용자 정의 태그를 활성화(Activate)해야 비용 분석 도구에서 쓸 수 있다.
```

뒷부분은 한 글자도 바뀌지 않는다. **맨 앞에 한 문장을 붙이는 것뿐이다.**

**이 두 문자열이 이 step의 데이터 변경 전부다.** 개념 182개 중 2개의 문단 0만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`summary`를 건드리지 마라.** ADR-010이 명시한 경계다. UI에서 개념 제목 아래 한 줄
  요약으로 렌더되므로 문장이 늘어나면 요약 구실을 못 한다.
- **`id`·`name`·개념 개수·주제 배치를 바꾸지 마라.**
- **위 두 개념 외의 개념을 고치지 마라.**
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`src/data/questions.json`을 건드리지 마라.**
- **`scripts/topics-baseline.json`을 건드리지 마라.** 이 step은 `conceptLineCount`(182)를
  바꾸지 않고 `questions.json`도 손대지 않으므로 갱신할 값이 없다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 덧붙인다.

```ts
it('개념 본문이 Lambda가 하는 일과 비용 할당 태그가 무엇인지 알려준다', () => {
  const concepts = topics.flatMap((topic) => topic.concepts)
  const lambda = concepts.find(({ id }) => id === 'serverless-containers.lambda')
  const tag = concepts.find(({ id }) => id === 'cost-management.cost-allocation-tag-activation')

  expect(lambda?.paragraphs[0]).toContain('S3에 올라온 이미지를 리사이징하거나')
  expect(lambda?.paragraphs[0]).toContain('정해진 시각에 개발용 RDS를 켜고 끄는')
  expect(tag?.paragraphs[0]).toContain('리소스에 직접 붙이는 사용자 정의 태그로')
  expect(tag?.paragraphs[0]).toContain('부서별로 비용을 나눠 보는 데 쓴다')
})

it('개념 본문 보강이 요약과 문단 개수를 바꾸지 않는다', () => {
  const concepts = topics.flatMap((topic) => topic.concepts)
  const lambda = concepts.find(({ id }) => id === 'serverless-containers.lambda')
  const tag = concepts.find(({ id }) => id === 'cost-management.cost-allocation-tag-activation')

  // ADR-010이 정한 편집 범위 — summary와 개념 구조는 건드리지 않는다.
  expect(lambda?.paragraphs).toHaveLength(3)
  expect(lambda?.summary).toBe('Lambda는 서버 운영을 AWS에 맡기고 개발자가 올린 코드만 실행하는 서비스다.')
  expect(tag?.paragraphs).toHaveLength(2)
  expect(tag?.summary).toBe('비용 할당 태그는 결제 콘솔에서 활성화해야 Cost Explorer에 보인다.')
})
```

## 검증 절차

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

```bash
node -e "
const {execSync}=require('child_process');const {readFileSync}=require('fs');
const raw=readFileSync('src/data/topics.json','utf8');
const lines=raw.split('\n').filter(l=>l.startsWith('      {\"id\":\"')).length;
console.log('개념 한 줄 포맷', lines, '(기대 182)');
const old=JSON.parse(execSync('git show HEAD:src/data/topics.json').toString());
const now=JSON.parse(raw);
const flat=t=>t.flatMap(x=>x.concepts);
const om=Object.fromEntries(flat(old).map(c=>[c.id,c]));
const nm=flat(now);
console.log('개념 수', flat(old).length, '->', nm.length, '(기대 182 -> 182)');
let ok=true, changed=[];
for(const c of nm){ const o=om[c.id];
  if(!o){ok=false;console.log('  새 개념!',c.id);continue;}
  if(o.name!==c.name){ok=false;console.log('  name 변경!',c.id);}
  if(o.summary!==c.summary){ok=false;console.log('  summary 변경!',c.id);}
  if(o.paragraphs.length!==c.paragraphs.length){ok=false;console.log('  문단 개수 변경!',c.id);}
  if(JSON.stringify(o.paragraphs)!==JSON.stringify(c.paragraphs)) changed.push(c.id);
}
console.log('name/summary/문단 개수 그대로', ok, '(기대 true)');
console.log('본문이 바뀐 개념', changed.join(' '), '(기대 serverless-containers.lambda cost-management.cost-allocation-tag-activation)');
"
```

```bash
git status --short   # topics.json 과 data.test.ts 두 개만 나와야 한다
```

## 완료 조건

- `test`·`lint`·`build`·`check-structure`가 모두 통과한다.
- 개념 한 줄 포맷이 **182줄** 그대로다.
- **본문이 바뀐 개념이 `serverless-containers.lambda`와
  `cost-management.cost-allocation-tag-activation` 둘뿐**이다.
- 두 개념의 `summary`·`name`·문단 개수가 불변이고, 다른 개념 180개는 한 글자도 안 바뀐다.
- 변경된 파일이 `topics.json`·`data.test.ts` 둘뿐이다(`topics-baseline.json`은 안 바뀐다).

## 금지사항

- **`paragraphs` 배열에 문단을 새로 추가하지 마라.** 이유: 문단 개수를 고정하는 테스트가
  깨진다. 기존 문단 0의 문장을 늘리는 것이 이 step의 방식이다.
- **`summary`를 고치지 마라.** 이유: ADR-010이 명시적으로 제외한 필드다.
- **Lambda 예시에 `보고서 발송`을 쓰지 마라.** 이유: `q088`이 그 표현을 Step Functions의
  프롬프트에 쓰고 있고 `Lambda`는 그 문항의 오답이다. 개념 본문에서 같은 표현을 Lambda에
  붙이면 두 자리가 서로 흐려진다. `q097`·`q205`에서 가져온 위 두 예만 쓴다.
- **`ADR-010`의 용어 13종 목록에 손대지 마라.** 이유: 이 step은 그 예외를 근거로 쓰지
  않는다. 목록을 늘리려면 ADR을 고쳐야 하고 그건 이 phase의 범위가 아니다.
- **비용 할당 태그 설명에 활성화 위치를 앞당겨 쓰지 마라.** 이유: "결제 콘솔에서
  활성화한다"가 `q243`의 정답이다. 새로 붙이는 문장은 태그가 무엇인지까지만 말한다.
- **`scripts/topics-baseline.json`을 갱신하지 마라.** 이유: 이 step은 그 파일이 검사하는
  값을 하나도 바꾸지 않는다. 갱신하면 무엇이 바뀐 것인지 추적이 흐려진다.
- 기존 테스트를 깨뜨리지 마라.
