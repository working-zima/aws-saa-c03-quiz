# Step 15: api-gateway-step-functions

이 phase의 남은 범위는 **문체와 가독성 수정뿐이다.** 사용자가 step 0~2의 결과를
검수하고 "가독성 기준은 현재 수정본으로 확정하겠다. 지금부터는 나머지 전체 주제에 대해
문체와 가독성 수정만 진행해 달라"고 지시했다. **사실관계 검수는 이후 별도 phase에서 한다.**

## 절대 하지 말 것 — 사용자가 제한으로 못 박은 것이다

사용자의 말을 그대로 옮긴다.

> - AWS 사실관계를 새로 해석하거나 검증하려고 하지 말 것
> - 기존 개념의 의미, 수치, 조건, 정답 판단 기준을 임의로 변경하지 말 것
> - 새로운 정보를 추가하지 말 것
> - 내용 삭제도 가급적 하지 말 것
> - 이번 작업의 목적은 오직 기존 설명을 더 자연스럽고 읽기 쉽게 만드는 것

구체적으로 **이번 step에서 하지 않는 것**은 아래다. 앞선 step 0~2는 이것들을 했지만
**범위가 좁아졌다.** 하고 싶어지더라도 하지 마라.

- **용어 풀이를 새로 넣지 마라.** 소개 없이 쓰이는 낱말을 발견해도 풀이 문장을 만들지 않는다.
  그것은 「새로운 정보 추가」다. 발견한 것은 `summary`의 보류 목록에 적어라.
- **도입 문장을 새로 만들지 마라.** 개념이 왜 거기 있는지가 없어도 문장을 신설하지 않는다.
  이미 있는 문장의 **순서와 표현**만 고친다.
- **개념 `name`을 바꾸지 마라.** 문장형 제목이 남아 있어도 이번 범위가 아니다.
  `scripts/topics-baseline.json`의 `name`·`conceptLineCount`는 건드릴 일이 없다.
- **문항을 다시 설계하지 마라.** 요구가 겹쳐 보이거나 목적이 불분명해 보여도 손대지 않는다.
  `answerIndex`·정답 판단 기준·보기의 변별점은 그대로다.
- **수치·조건·서비스 이름을 바꾸지 마라.** 3~5시간을 「몇 시간」으로 뭉개는 것도 안 된다.
- **문장을 지우지 마라.** 예외는 하나다 — **글의 진행만 설명하고 내용이 없는 문장**
  (`이제 그것들을 가르는 축을 본다`)은 기준 2에 따라 지운다. 내용이 조금이라도 담겼으면
  지우지 말고 다시 써라.
- **출처 파일을 읽으러 가지 마라.** 사실관계를 확인할 일이 없다. `docs/source/`를 뒤지고
  있다면 범위를 벗어난 것이다.

## 이 step이 맡은 것

| 주제 | 개념 | 문항 |
|---|---|---|
| `api-gateway-step-functions` | 20 | 25 |

### 개념 목록 (배열 순서 — 이름은 바꾸지 않는다)

`api-gateway-step-functions`

 0. `api-gateway` — API Gateway
 1. `step-functions` — Step Functions
 2. `step-functions-features` — Step Functions의 수동 승인과 재시도
 3. `amplify` — AWS Amplify
 4. `api-gateway-jwt-authorizer` — HTTP API의 JWT 권한 부여자
 5. `api-gateway-rest-vs-http-timeout` — REST API가 더 긴 통합 타임아웃을 견딘다
 6. `api-gateway-rest-only-features` — API 키·요청 검증·스로틀링은 REST API 쪽이다
 7. `api-gateway-websocket-api` — WebSocket API
 8. `api-gateway-api-key-not-auth` — API 키는 인증 수단이 아니다
 9. `api-gateway-resource-policy` — API Gateway 리소스 정책
10. `api-gateway-endpoint-types` — 엣지 최적화 엔드포인트와 리전 엔드포인트
11. `api-gateway-behind-cloudfront` — API도 CloudFront 뒤에 둘 수 있다
12. `api-gateway-lambda-proxy-integration` — REST API의 Lambda 프록시 통합
13. `api-gateway-aws-service-integration` — API Gateway에서 AWS 서비스를 직접 호출한다
14. `step-functions-long-running-workflow` — Step Functions는 하루를 넘기는 작업도 맡는다
15. `step-functions-express-workflow` — Express 워크플로
16. `step-functions-map-state` — Map 상태로 목록의 항목마다 한 번씩 실행한다
17. `api-gateway-custom-domain-name` — API Gateway 사용자 지정 도메인 이름
18. `api-gateway-mapping-template-limits` — 매핑 템플릿으로 되는 변환과 안 되는 변환
19. `api-gateway-ip-restriction-by-resource-policy` — 호출자를 IP로 거르는 자리도 리소스 정책이다

### 문항 id

`api-gateway-step-functions` — `q088` `q089` `q090` `q200` `q206` `q529` `q530` `q531` `q532` `q533` `q534` `q535` `q536` `q537` `q538` `q539` `q540` `q541` `q542` `q543` `q544` `q545` `q546` `q547` `q548`

## 확정된 문체 기준 — 이것이 합격선이다

사용자가 낸 것을 그대로 옮긴다.

> - 초보자가 첫 1~2문장만 읽어도 개념의 핵심이 잡히게 작성
> - 정의 → 언제 쓰는지 → 비교/주의점 흐름을 유지
> - `자리`, `축`, `갈린다`, `밀린다` 같은 추상적인 표현의 반복을 피할 것
> - `앞에서 본`, `여기서부터는`, `이제 ~를 본다`처럼 글의 진행 자체를 설명하는 문장은
>   꼭 필요한 경우에만 사용할 것
> - 공식 AWS 용어는 유지하고, 어려운 용어는 바로 뒤에서 쉬운 말로 설명할 것
> - 문장을 자연스럽게 만들기 위해 사실관계나 기술적 의미를 바꾸지 말 것
> - **이미 자연스러운 문장은 억지로 다시 쓰지 말 것**

마지막 줄이 중요하다. **이 step의 성과는 고친 문장 수가 아니다.** 걸리는 자리만 고치고
나머지는 그대로 둔다.

### 1. 은유적 추상어를 반복하지 마라 — 하는 말을 그대로 써라

step 0~2에서 사용자가 통과시킨 치환이다. **그대로 따라 써라.**

| 이전 | 이후 |
|---|---|
| 그 **자리를 맡는 것**이 이 클래스다 | 이럴 때 **S3 Intelligent-Tiering을 선택한다** |
| 이 조건에서 **갈리는 상대**는 Deep Archive다 | 이때 **비교 대상이 되는 것**은 Deep Archive다 |
| 보관 단가에서 **밀리고**, Deep Archive는 시간에서 **밀린다** | 보관 단가가 **더 높고**, Deep Archive는 꺼내는 데 시간이 **더 걸린다** |
| 클래스별 비용에는 **축이 둘이다** | 클래스별 비용은 **두 가지로 나뉜다** |
| 두 번째 **축**은 / 판단 **축**이다 | 두 번째 **기준**은 / 판단 **기준**이다 |
| 예외를 누구에게 주느냐로 **갈린다** | 예외를 누구에게 주느냐로 **나뉜다** |
| 결정을 돕는 **자리에 서지** 실행하는 **자리에 서지 않는다** | 결정을 돕는 **기능이지** 실행하는 **기능이 아니다** |
| 자주 읽는 데이터의 **자리가 아니다** | 자주 읽는 데이터에는 **맞지 않는다** |
| 같은 이유로 **밀린다** | 같은 이유로 **답이 되지 못한다** |
| 가용성과 비용을 함께 **흔든다** | 가용성과 비용에 함께 **영향을 준다** |

`자리한`(=위치하다)처럼 **자연스러운 쓰임은 그대로 둔다.** 세는 것이 목적이 아니다.

### 2. 글의 진행을 설명하는 문장을 줄여라

| 이전 | 이후 |
|---|---|
| **여기까지가** 클래스 여덟 개 각각이고, **이제 그것들을 가르는 축을 본다.** 첫 축은 조회 요청에 바로 응답하는지다 | 스토리지 클래스를 가르는 **첫 번째 기준은** 조회 요청에 바로 응답하는지다 |
| **여기서부터는 복제다. 앞의 넷이** 버킷 하나 안에서 하는 일이라면, 복제는 … | **복제는 같은 객체를 다른 버킷에도 두는 기능이다.** 리전 간 복제는 … |
| **앞의 둘이** 이미 올라온 객체를 지키는 장치라면 | **버전 관리와 객체 잠금이** 이미 올라온 객체를 지키는 장치라면 |
| **앞에서 본** 다중 AZ의 정반대편이 단일 AZ다 | **단일 AZ는 다중 AZ와 반대로** … |
| **그 첫 자리가** 버전 관리다. 버전 관리를 사용하지 않는 버킷에… | 버전 관리를 사용하지 않는 버킷에… |

**연결을 없애는 것이 아니라 이름을 부르게 바꾸는 것이다** — `앞의 둘` → `버전 관리와 객체 잠금`.
연결이 정말 필요한 자리에서는 남긴다.

### 3. 첫 1~2문장에 핵심을 세워라 — 단, 문단 개수는 바꾸지 마라

`s3-storage-classes.glacier-instant-retrieval`이 통과한 예다. 이전에는 넷째 문장에 가서야
이 클래스가 무엇인지 나왔고, **문단 안에서 문장 순서만 바꿔** 첫 문장에 정체를 세웠다.

```
(이전) 여기서부터 셋은 이름에 Glacier가 붙은 계열이고, … 셋은 꺼내는 데 걸리는 시간으로
       갈리며, 그중 가장 빠른 것이 이 클래스다. 거의 읽지 않는 데이터를 …
(이후) S3 Glacier Instant Retrieval은 이름에 Glacier가 붙은 세 클래스 중 하나다.
       Glacier 계열은 … 세 클래스의 차이는 데이터를 꺼내는 데 걸리는 시간이고,
       그중 가장 빠른 것이 이 클래스다. 거의 읽지 않는 데이터를 …
```

**문단을 쪼개거나 합치지 마라.** `data.test.ts`가 문단 번호(`paragraphs[N]`)로 본문을
단언하는 자리가 있다. 한 문단 안에서 문장 순서를 고치는 것으로 푼다.

**`summary`를 그대로 복사하지 마라.** UI가 요약 바로 아래에 본문을 두므로 같은 문장이
두 번 보인다. step 0이 초안에서 이 실수를 했다.

### 4. 공식 AWS 용어는 유지하고, 바로 뒤에서 쉬운 말로 설명한다

```
(이전) 최대 재시도 횟수나 대기 시간의 흔들림 같은 값은 손봐야 할 때가 있다.
(이후) 최대 재시도 횟수나 지터(jitter) 같은 값은 손봐야 할 때가 있다.
       지터는 재시도까지의 대기 시간을 조금씩 무작위로 바꾸는 설정이다.
```

**⚠️ 이 기준은 「새로운 정보를 추가하지 마라」와 부딪힐 수 있다.** 위 예가 허용되는 이유는
`지터`가 이미 저장소의 출처에 있는 말이고 풀이가 그 낱말의 뜻일 뿐이기 때문이다.
**본문에 없던 용어를 새로 들여오지 마라.** 이미 본문에 있는 어려운 용어를 쉬운 말로
바꿔 버린 자리를 되돌리는 것이 이 기준의 쓰임이다. 판단이 서지 않으면 **그대로 두고
보류 목록에 적어라.**

## 읽어야 할 파일

- `CLAUDE.md`
- `src/data/topics.json` · `src/data/questions.json` — 이 step이 고칠 데이터
- `src/data/data.test.ts` — 문구를 고정한 단언이 있다
- `scripts/topics-baseline.json` — `questionsSha256`만 건드린다

**`docs/ADR.md`·`docs/source/`는 읽지 않아도 된다.** 사실관계를 다루지 않기 때문이다.
읽고 있다면 범위를 벗어난 것이다.

## 작업 순서

1. **아래 대상 목록의 개념과 문항을 순서대로 읽는다.** 걸리는 문장에 표시만 해 둔다.
2. **아래 두 정규식으로 자기 주제를 훑어 후보를 뽑는다.** 도구가 아니라 눈이 기준이지만,
   놓친 자리를 줍는 데 쓴다.

```bash
node -e "
const t=require('./src/data/topics.json'); const topics=Array.isArray(t)?t:t.topics;
const qs=require('./src/data/questions.json'); const arr=Array.isArray(qs)?qs:qs.questions;
const T=['api-gateway-step-functions'];
const ABS=/자리|축이|축을|축은|갈린|갈리|밀린|맡는 것/g;
const META=/앞의 (둘|셋|넷)|여기서부터|여기까지|이제 그것|이제부터|앞에서 본|이 주제는|그 첫 자리/g;
for(const id of T) for(const c of topics.find(x=>x.id===id).concepts){
  const x=[c.summary,...c.paragraphs].join(' ');
  const a=x.match(ABS)||[], m=x.match(META)||[];
  if(a.length||m.length) console.log('개념', c.id, [...a,...m].join(','));
}
for(const q of arr.filter(x=>T.includes(x.topicId))){
  const x=[q.prompt,...q.choices,q.explanation].join(' ');
  const a=x.match(ABS)||[], m=x.match(META)||[];
  if(a.length||m.length) console.log('문항', q.id, [...a,...m].join(','));
}
"
```

3. **고친다.** 표현만 바꾸고 뜻은 그대로 둔다. 고친 문장마다 스스로에게 물어라 —
   *"이 문장이 말하는 사실이 이전과 똑같은가?"* 다르면 되돌려라.
4. **`questions.json`을 고쳤다면 `scripts/topics-baseline.json`의 `questionsSha256`을
   갱신한다.** `shasum -a 256 src/data/questions.json`의 값으로 **그 문자열만 치환해라.**
   이 파일은 1칸 들여쓰기이고 콜론 뒤에 공백이 없다 — `JSON.stringify`로 다시 쓰지 마라.
   `name`과 `conceptLineCount`는 이번 범위에서 바뀔 일이 없다.
5. **`npm test`가 옛 문구를 고정하고 있어 깨지면, 단언의 문구만 새 문장으로 맞춘다.**
   단언의 뜻을 바꾸거나 단언을 지우지 마라. 새 단언을 더할 필요도 없다.

## 판단하기 어려우면 고치지 말고 남겨라 — 사용자의 지시다

> 중간에 문제가 발생한 파일이나 판단하기 어려운 문장이 있으면 임의로 고치지 말고
> 그대로 두고 마지막 작업 결과에 목록으로 남겨 줘.

**`summary`의 「보류」 항목에 `개념id/문항id — 무엇이 걸렸는지 — 왜 판단이 어려운지`
형식으로 적어라.** 마지막 step이 이것들을 모아 사용자에게 보고한다. 아래가 보류할 자리다.

- 고치면 뜻이 달라질 것 같은 문장
- 추상어이긴 한데 대체어가 사실을 바꿀 것 같은 자리
- 용어 풀이가 없어 읽히지 않지만 풀이를 넣는 것이 범위 밖인 자리
- 문장형 제목(개념 `name`) — **전부 보류다.** 세지 말고 "이 주제에 N건"만 적어라

## Acceptance Criteria

```bash
npm test                              # 전부 통과
npm run build                         # tsc 타입체크 포함
node scripts/check-structure.mjs      # exit 0. name·개수·순서가 그대로여야 한다
node scripts/coverage.mjs             # 618/618
node scripts/check-verbatim.mjs       # 전사 이상 없음
```

**`content-audit.mjs`는 이번 step의 기준이 아니다.** 그 도구가 세는 여섯 지표는 이번
범위 밖이다(①은 `name`이라 손대지 않고, ③⑤⑥은 문항 재설계라 손대지 않는다).
돌려서 숫자가 그대로인 것을 확인하는 용도로만 써라 — **숫자가 늘었다면 범위를 넘은 것이다.**

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `git diff`를 읽고 **사실이 바뀐 줄이 없는지** 확인한다. 수치·서비스 이름·조건·정답
   판단 기준이 그대로인지가 이 step의 유일한 안전 검사다.
3. `phases/31-content-quality-rollout/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단이 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 남길 것

- 고친 개념 수·문항 수와, **고치지 않고 그대로 둔 것이 많다면 그 사실**
- 되풀이해서 나온 문제 유형 (마지막 step이 이것을 모아 보고한다)
- **보류 목록** (위 형식)
- `questionsSha256` 이전 → 이후, `npm test` 개수 이전 → 이후

## 금지사항

- **위 「절대 하지 말 것」을 어기지 마라.** 이유: 사용자가 제한으로 명시했고,
  사실관계 검수는 별도 phase의 몫이다.
- **다른 주제를 고치지 마라.** 이유: step마다 주제를 나눈 것이 이 phase의 구조다.
- **`answerIndex`·보기 순서·개념 순서·개념 개수·문항 개수를 바꾸지 마라.**
  이유: `data.test.ts`와 `check-structure.mjs`가 불변식으로 고정하고 있다.
- 기존 테스트를 깨뜨리지 마라.
