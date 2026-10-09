# Step 0: concurrency-terms

## 배경

사용자가 "예약된 동시성은 그 함수가 쓸 동시 실행 수를 떼어 둘 뿐이라 환경을 미리 만들어 두지 않으며"를 읽고 `떼어 둔다`가 무슨 뜻인지
모르겠다고 했다(2026-10-09). 본문이 **무엇에서** 떼어 내는지 말하지 않기 때문이다. 계정의 동시 실행 한도를 리전의 모든 함수가 나눠 쓴다는
전제가 데이터에 없다. 사용자는 이어서 "함수가 동시에 실행할 수 있는 수"도 "함수가 무엇을 실행한다는 말인지, 함수의 개수인지" 헷갈린다고
했다. 그래서 새 문구는 **"요청을 동시에 몇 건 처리하는가"**로 주어를 통일했다.

사용자 결정으로 AWS 공식 문서를 근거로 더하고(ADR-039 「2026-10-09 확장」, 근거와 URL은 `docs/source/aws-docs.md`), 아래 문구를
사용자가 승인했다. 이 step은 그 문구를 데이터에 넣는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-010, ADR-039**(끝의 「2026-10-09 확장」 포함)
- `docs/source/aws-docs.md`의 「동시 실행 수와 예약된 동시성」
- `src/data/topics.json`의 `lambda.lambda-reserved-concurrency`, `api-gateway-step-functions.api-gateway-endpoint-types`
- `src/data/questions.json`의 `q086`, `q494`, `q495`, `q496`
- `src/data/data.test.ts`: 끝의 `describe('ADR-039 — 레코드·호스팅 영역·대상 그룹의 정의', …)`가 테스트 모양의 선례다.
  「동시성 세 갈래가 한 주제 안에서 서로 무엇으로 갈리는지 읽힌다」는 `'콜드 스타트는 그대로 남는다'`를 단언한다 — 새 문구에도 있다.
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs`

## 작업

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 데이터를 고친다.

### 1. `src/data/topics.json`

**파일 형식을 지켜라.** 개념 하나가 한 줄(`      {"id":"…",…},`)인 형식을 `check-structure.mjs`가 검사한다. JSON 라이브러리로 파일 전체를
다시 직렬화하지 마라. 해당 줄 안의 문자열만 바꾼다. 아래 문구는 사용자가 승인한 것이니 **글자 그대로** 쓴다(ADR-009 — 이미 직접 쓴 문장이다).
`**`는 굵게 표시이고 본문 문자열에 그대로 들어간다.

**(가) `lambda.lambda-reserved-concurrency`**: `id`·`name`은 그대로 두고 `summary`와 `paragraphs`를 바꾼다. 문단은 2개에서 3개가 된다.

`summary`:

```
예약된 동시성은 계정의 동시 실행 한도 가운데 일부를 한 함수 전용으로 확보하는 값이고, 실행 환경을 미리 초기화해 두는 것은 프로비저닝된 동시성이다.
```

`paragraphs[0]`(새 문단):

```
Lambda의 **동시 실행 수**(concurrency)는 한 함수가 같은 순간에 처리하고 있는 요청의 수다. 요청 하나마다 실행 환경이 하나씩 붙으므로, 같은 함수가 동시에 몇 번 실행되고 있는지와 같다. 계정에는 리전마다 동시 실행 한도가 있고, 그 리전의 모든 함수가 이 한도를 나눠 쓴다. **예약된 동시성**(reserved concurrency)은 이 한도 가운데 일부를 한 함수 전용으로 확보하는 설정이다. 예를 들어 한도가 1,000인 계정에서 함수 A에 100을 예약하면, 다른 함수에 요청이 몰려도 A는 요청을 동시에 100건까지 처리할 수 있다. 대신 A도 동시에 100건을 넘게 처리하지는 못하고, A가 100을 다 쓰지 않을 때도 다른 함수들은 남은 900만 나눠 쓴다.
```

`paragraphs[1]`(기존 첫 문단을 고친 것):

```
프로비저닝된 동시성과 예약된 동시성은 이름이 비슷해 나란히 놓이는 두 설정이고, 차이는 무엇을 미리 하느냐다. **프로비저닝된 동시성**은 실행 환경을 미리 초기화해 두므로 첫 호출의 콜드 스타트가 사라지고 응답 시간이 일정해진다. 예약된 동시성이 확보하는 것은 동시에 처리할 수 있는 요청의 수일 뿐이고, 실행 환경은 요청이 온 뒤에 만든다. 그래서 콜드 스타트는 그대로 남는다.
```

`paragraphs[2]`: 기존 둘째 문단을 **한 글자도 바꾸지 않고** 그대로 둔다.

```
피크 시간대에도 일관되게 낮은 지연이 필요하면 프로비저닝된 동시성을 쓴다. 예약된 동시성으로는 그 조건을 채울 수 없다.
```

**(나) `api-gateway-step-functions.api-gateway-endpoint-types`**: `paragraphs[1]`의 마지막 문장 하나만 바꾼다. 다른 문장·`summary`는 그대로다.

- 바꾸기 전: `반면 Lambda의 예약된 동시성은 백엔드가 감당하는 양을 늘리는 설정이라 전 세계 지연 자체를 줄이지 못한다.`
- 바꾼 뒤: `반면 Lambda의 예약된 동시성은 그 함수가 요청을 동시에 몇 건까지 처리할지를 정해 두는 설정이라, 요청이 들어오는 경로를 바꾸지 못하고 전 세계 지연 자체를 줄이지 못한다.`

### 2. `src/data/questions.json`

네 문항의 `explanation`에서 아래 구절만 바꾼다. `prompt`·`choices`·`answerIndex`·`conceptId`·`topicId`와 해설의 나머지 문장은 그대로다.
파일 형식(문항 하나가 한 줄)을 지켜라 — 전체를 다시 직렬화하지 마라.

| 문항 | 바꾸기 전 | 바꾼 뒤 |
|---|---|---|
| `q086` | `예약된 동시성은 함수 몫의 동시 실행 수를 떼어 둘 뿐 환경을 미리 만들지 않아 콜드 스타트가 그대로 남는다.` | `예약된 동시성은 계정의 동시 실행 한도 가운데 일부를 그 함수 전용으로 확보할 뿐 환경을 미리 만들지 않아 콜드 스타트가 그대로 남는다.` |
| `q494` | `예약된 동시성은 그 함수가 쓸 동시 실행 수를 떼어 둘 뿐이라 환경을 미리 만들어 두지 않으며, 콜드 스타트는 그대로 남는다.` | `예약된 동시성은 계정의 동시 실행 한도 가운데 일부를 그 함수 전용으로 확보할 뿐이라 환경을 미리 만들어 두지 않으며, 콜드 스타트는 그대로 남는다.` |
| `q495` | `예약된 동시성은 그 함수 몫의 동시 실행 수를 떼어 두는 값이다. 다른 함수에 밀리지 않게 용량을 확보하는 데는 맞지만` | `예약된 동시성은 계정의 동시 실행 한도 가운데 일부를 그 함수 전용으로 확보하는 값이다. 다른 함수에 밀리지 않게 하는 데는 맞지만` |
| `q496` | `예약된 동시성은 그 함수 몫의 동시 실행 수를 떼어 둘 뿐 실행 환경을 미리 만들어 두지 않아 콜드 스타트를 없애지 못한다.` | `예약된 동시성은 계정의 동시 실행 한도 가운데 일부를 그 함수 전용으로 확보할 뿐 실행 환경을 미리 만들어 두지 않아 콜드 스타트를 없애지 못한다.` |

각 "바꾸기 전" 구절은 그 문항의 해설에 정확히 한 번 있다. 없거나 두 번 이상 있으면 고치지 말고 `blocked`로 멈춘다.

### 3. 문항 기준선

`questions.json`을 의도적으로 고쳤으므로 `node scripts/sync-baseline.mjs`로 `scripts/topics-baseline.json`의 `questionsSha256`을 갱신한다.
이 도구가 다른 항목(개념 `name` 등)까지 바꾸려 하면 쓰지 말고 `blocked`로 멈춘다 — 이번 step은 `name`을 바꾸지 않는다.
먼저 `--dry-run`으로 무엇이 바뀌는지 확인하라.

### 4. 테스트

`src/data/data.test.ts` 끝에 `describe('ADR-039 확장 — Lambda 동시 실행 수와 예약된 동시성', …)`을 더한다.

1. `lambda.lambda-reserved-concurrency`의 `summary`가 위 문구와 같다.
2. 그 개념의 문단이 3개다. 첫 문단은 `Lambda의 **동시 실행 수**(concurrency)는`으로 시작하고 `**예약된 동시성**(reserved concurrency)은`,
   `리전마다 동시 실행 한도`, `요청을 동시에 100건까지 처리할 수 있다`, `남은 900만 나눠 쓴다`가 있다. 둘째 문단에 `실행 환경은 요청이 온 뒤에 만든다`와
   `콜드 스타트는 그대로 남는다`가 있다. 셋째 문단은 위 문구와 같다.
3. 그 개념의 `summary`와 `paragraphs` 어디에도 `떼어`가 없다.
4. `q086`·`q494`·`q495`·`q496`의 해설에 `계정의 동시 실행 한도 가운데 일부를 그 함수 전용으로 확보`가 있고 `떼어`가 없다.
   네 문항의 `answerIndex`가 `q086` 0, `q494` 1, `q495` 2, `q496` 0이다.
5. `api-gateway-step-functions.api-gateway-endpoint-types`의 본문에 `감당하는 양을 늘리는`이 없고
   `그 함수가 요청을 동시에 몇 건까지 처리할지를 정해 두는 설정`이 있다.

**기존 테스트는 고치지 마라.** 위 변경으로 기존 테스트가 깨지면 고치지 말고 `blocked`로 멈춘 뒤 어느 단언인지 적는다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/check-verbatim.mjs
node scripts/field-diff.mjs HEAD --list
```

마지막 명령은 커밋 전 워킹 트리를 기준 커밋과 대조한다. 바뀐 항목이 개념 둘(`lambda.lambda-reserved-concurrency`의 `summary`·`paragraphs`,
`api-gateway-step-functions.api-gateway-endpoint-types`의 `paragraphs`)과 문항 넷(`q086`·`q494`·`q495`·`q496`의 `explanation`)뿐이어야 한다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff src/data/topics.json`이 두 줄(개념 둘)만 바꿨는가.
   - `git diff src/data/questions.json`이 네 줄(문항 넷)만 바꿨고, 각 줄에서 `explanation`만 달라졌는가.
   - `scripts/topics-baseline.json`에서 `questionsSha256`만 바뀌었는가.
3. `phases/49-lambda-concurrency-terms/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 개념 둘과 문단 수 변화, 바꾼 해설 넷, 기준선 갱신, 더한 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **위 문구를 다듬거나 사실을 더하지 마라.** 이유: 사용자가 승인한 문장이고, 새 사실은 `docs/source/aws-docs.md`에 적힌 것만 허용된다(ADR-039).
  예약할 수 있는 최대치, 초당 요청 수 한도, 확장 속도, 비용 문구를 덧붙이지 마라.
- **`lambda.lambda-concurrency-limit-throttling`·`lambda.lambda`·`lambda.lambda-provisioned-concurrency-autoscaling` 같은 다른 개념과
  q536·q537 같은 다른 해설을 고치지 마라.** 이유: 이번 범위는 위 여섯 자리다. 다른 개념의 "떼어"(Aurora 엔드포인트 등)는 예약된 동시성과
  관계없는 쓰임이다.
- **보기·정답·`prompt`를 바꾸지 마라.** 이유: 정답 논리는 그대로다.
- **`topics.json`·`questions.json`을 다시 직렬화하지 마라.** 이유: 한 줄 형식이 깨지고 diff를 사람이 읽을 수 없게 된다.
- **도식·`src/data/visuals/`·컴포넌트를 고치지 마라.**
- 기존 테스트를 깨뜨리거나 고치지 마라.
