# Step 6: performance-insights

**Performance Insight → Performance Insights** — 이 step이 맡은 표기는 이 하나다.

## 이 phase의 범위 — 용어 표기 치환뿐이다

사용자의 말을 그대로 옮긴다.

> 이번 phase의 목적은 용어 표기 통일뿐이다.
> **사실관계, 정답 논리, 문항 구조, 수치나 조건은 변경하지 마.**
> `paragraphs`와 `explanation`도 이번 phase에서는 필요한 범위에 한해 수정 가능하게 하되,
> **표기 치환 외의 문장 수정은 하지 마.**

**phase 32와 다른 점이 하나 있다.** 그때는 `paragraphs`·`explanation`이 얼어 있었지만
이번에는 열린다 — 같은 대상을 두 이름으로 부르는 자리가 그 두 필드에 걸쳐 있어 열지 않으면
통일할 수 없기 때문이다. **열렸다는 것은 고쳐도 된다는 뜻이지 다듬어도 된다는 뜻이 아니다.**
낱말을 바꾸는 것 외에 문장을 손대면 아래 도구가 잡는다.

## 가드레일 — 기계가 잡는다

```bash
node scripts/notation-diff.mjs 7f46259          # 바뀐 것이 표기 치환으로 설명되는지 본다
node scripts/notation-diff.mjs 7f46259 --list   # 바뀐 항목의 id를 전부 찍는다
```

이 도구는 승인된 표기 짝을 같은 자리표로 바꾼 뒤 기준 커밋과 대조한다.

| 결과 | 뜻 |
|---|---|
| 정규화한 것이 같다 | 바뀐 것은 표기뿐이다. **통과** |
| 정규화해도 다르다 | 표기 말고 문장·수치·조건이 바뀌었다. **exit 1** |
| 구조가 바뀌었다 | `answerIndex`·id·순서·개수·문단 수·보기 수. **exit 1** |

**exit 1이면 되돌려라.** 부분 치환은 통과한다 — SNS의 `토픽`만 바꾸고 Kafka의 `토픽`을
두는 것이 이번 요구이므로 그렇게 설계돼 있다.

## 표준을 이렇게 정한 근거

AWS 영문 제품명이 복수형이다(한국어 문서는 「성능 개선 도우미」로 번역하지만 저장소는 영문 표기를 쓴다). **제품 이름이라 빈도로 정할 문제가 아니다** — 소수 쪽(6건)이 맞고 다수 쪽(14건)이 오기다.

## 이 step의 주의점

`Performance Insights`(이미 복수)인 자리를 다시 건드리지 마라. **개념 id `cloudwatch-xray.performance-insight`는 바꾸지 않는다** — id 변경은 다른 종류의 작업이고 `check-structure.mjs`가 막는다. 바꾸는 것은 `name`을 포함한 **표시 문자열**뿐이다.

## 지켜야 할 것

1. **문맥을 먼저 갈라라.** 같은 낱말이라도 다른 대상을 가리키면 **건드리지 않는다.**
   아래 대상 목록에 문맥 조각을 붙여 두었으니 읽고 판단해라.
2. **정답 보기가 걸린 문항은 보기 넷을 통째로 본다.** 한 보기만 표기를 바꾸면 그 보기가
   나머지 셋과 결이 달라지고 **그 차이가 정답을 가리키는 신호가 된다.** 넷 중 둘 이상이 같은
   낱말을 쓰고 있으면 **함께 바꾼다.** 한쪽만 바꿔야 할 이유가 있으면 `summary`에 적어라.
3. **`data.test.ts`가 글자로 고정한 자리는 단언도 함께 고친다.** 대상 목록에 `⚠단언`으로
   표시했다. **단언의 뜻을 바꾸거나 지우지 마라.** 문구만 새 표기로 맞춘다.
4. **개념 `name`을 고쳤거나 `questions.json`을 고쳤으면 `node scripts/sync-baseline.mjs`를
   돌린다.** `scripts/topics-baseline.json`을 손으로 고치지 마라.
5. **조사를 자연스럽게 맞추는 것은 허용된다.** `토픽에` → `주제에`처럼 낱말 뒤 조사가
   바뀌는 것은 치환의 일부다. 다만 `notation-diff`가 조사까지 정규화하지는 않으므로,
   받침이 달라져 조사를 바꿔야 하면 그 자리를 `summary`에 적어라 — 도구가 위반으로 잡는다.
   **그런 자리가 나오면 조사를 바꾸지 말고 그대로 두는 쪽을 먼저 검토해라.**

## 대상 목록 — `Performance Insight`이 든 자리 20곳

**이 목록이 전부다.** 문맥 조각을 읽고 바꿀 자리와 둘 자리를 갈라라.

**`cloudwatch-xray`**

- `cloudwatch-xray.performance-insight` `name` — Performance Insight
- `cloudwatch-xray.performance-insight` `summary` — Performance Insight는 데이터베이스의 성능을 관찰하는 서비스다.
- `cloudwatch-xray.performance-insights-rightsizing` `name` — Performance Insights와 적정 규모 조정
- `cloudwatch-xray.performance-insights-rightsizing` `paragraphs[0]` — Performance Insights는 DB 부하, 부하를 많이 만드는 SQL, 대기, CPU …
- `q126` `choices[0]` — Performance Insight
- `q126` `explanation` ⚠단언 — …는 애플리케이션까지 넓게 잡히는 것이 이 서비스의 특징이다. Performance Insight는 데이터베이스가 어떤 성능을 내는지 관찰하는 도구여서 보는 …
- `q648` `choices[1]` — Performance Insight
- `q648` `explanation` ⚠단언 — … 살펴보는 쪽이라 요청 하나의 경로를 이어 보여 주지 않고, Performance Insight는 데이터베이스가 어떤 성능을 내는지 보는 도구다. Manag…
- `q649` `choices[0]★` — Performance Insight
- `q649` `explanation` ⚠단언 — Performance Insight는 데이터베이스가 어떤 성능을 내는지 모니터링할 때 쓰는 서비…
- `q650` `choices[2]` ⚠단언 — …d Grafana는 데이터베이스 부하를 보여 주지 않으므로, Performance Insight를 사용한다
- `q650` `explanation` ⚠단언 — …도 질의를 실행하는 도구이지 보고서를 만드는 도구가 아니다. Performance Insight와 X-Ray는 각각 데이터베이스 성능과 요청 경로를 보는 도…
- `q652` `choices[2]` — 두 요구 모두 해결되지 않으므로 Performance Insight로 바꿔야 한다
- `q652` `explanation` — …은 이것으로 되지만 등록과 목록이라는 요구는 그대로 남는다. Performance Insight는 데이터베이스 성능을 보는 도구라 컨테이너 관측을 대신하지도…
- `q653` `choices[0]★` — Performance Insights를 켠다
- `q653` `explanation` — Performance Insights는 DB 부하, 부하를 많이 만드는 SQL(Structure…
- `q655` `choices[3]` — Performance Insights를 켜서 부하가 큰 구간을 찾는다
- `q655` `explanation` ⚠단언 — …를 만드는 도구라 수집 간격을 줄이는 일과는 다른 문제이고, Performance Insights는 데이터베이스 쪽 지표를 본다.

**`emr-glue-athena`**

- `q125` `choices[3]` — Performance Insight
- `q125` `explanation` — …oad) 서비스이고 자체에는 데이터를 분석하는 기능이 없다. Performance Insight는 데이터베이스가 어떤 성능을 내는지 관찰하는 도구라 저장된 …


### 정답 보기가 걸린 문항 — 보기 넷을 한 벌로 보고 판단해라

**`q649`** — 데이터베이스가 어떤 성능을 내고 있는지 모니터링해야 하는 상황이다. 이때 알맞은 서비스는 무엇인가?…

- ★정답 `c0` — Performance Insight
-   오답 `c1` — X-Ray
-   오답 `c2` — CloudWatch Container Insights
-   오답 `c3` — Amazon Managed Grafana

**`q653`** — 데이터베이스 인스턴스를 키울지 줄일지 정해야 하는 상황이다. 그러려면 DB 부하와 부하를 많이 만드는 SQL, 대기, CPU 사용률을 봐야 한다…

- ★정답 `c0` — Performance Insights를 켠다
-   오답 `c1` — X-Ray로 요청이 지나온 경로를 추적한다
-   오답 `c2` — 로그를 모아 분석하는 구성을 만들어 지표를 계산한다
-   오답 `c3` — EC2 상세 모니터링을 켜서 1분 간격 지표를 받는다


## 작업 순서

1. 아래 대상 목록을 **문맥 조각과 함께** 읽고, 바꿀 자리와 둘 자리를 먼저 가른다.
2. 바꾼다. **낱말만 바꾼다.**
3. 정답 보기가 걸린 문항은 보기 넷을 다시 읽는다.
4. `node scripts/sync-baseline.mjs` → `npm test` → 깨지면 단언 문구만 맞춘다.
5. `node scripts/notation-diff.mjs 7f46259`가 exit 0인지 본다.

## Acceptance Criteria

```bash
npm test                                    # 전부 통과
npm run build                               # tsc 타입체크 포함
npm run lint
node scripts/sync-baseline.mjs              # 거부당하면 범위를 넘은 것이다
node scripts/check-structure.mjs            # exit 0
node scripts/notation-diff.mjs 7f46259        # exit 0 — 표기 치환으로만 설명돼야 한다
node scripts/coverage.mjs                   # 618/618
node scripts/check-verbatim.mjs
```

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `node scripts/notation-diff.mjs 7f46259 --list`를 읽고 **이 step이 맡은 표기 말고
   다른 것이 바뀌지 않았는지** 확인한다.
3. `phases/33-notation-standardization/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 남길 것

마지막 step이 이것만 보고 사용자 보고서를 쓴다.

1. **바꾼 건수** — 표기별로, 그리고 필드별로(`name`·`summary`·`paragraphs`·`prompt`·`choices`·`explanation`)
2. **문맥이 달라 두고 온 자리와 그 이유** — 이것이 이 step의 핵심 산출물이다
3. **정답 보기를 고친 문항 id와, 보기 넷을 함께 봤는지**
4. **`data.test.ts` 단언을 고쳤으면 어느 것을 어떻게**

## 금지사항

- **표기 치환 외의 문장 수정을 하지 마라.** 이유: 사용자가 이 phase의 목적을 표기 통일
  하나로 못 박았고, `notation-diff.mjs`가 exit 1로 잡는다.
- **`answerIndex`·id·문항 순서·문단 수·보기 수를 바꾸지 마라.** 이유: 정답이 달라지고
  `data.test.ts`·`check-structure.mjs`가 불변식으로 고정한다.
- **수치·조건·서비스 특성·제한 사항을 건드리지 마라.**
- **다른 step이 맡은 표기를 건드리지 마라.** 이유: step마다 표기를 나눈 것이 이 phase의 구조다.
- **`Deny`와 `거부`를 통일하지 마라.** 이유: 표기 갈림이 아니다. `Deny`는 IAM 정책의
  `Effect` 값이고 `거부`는 그 동작을 설명하는 서술어다. 사용자가 작업 대상에서 뺐다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** `sync-baseline.mjs`를 써라.
- 기존 테스트를 깨뜨리지 마라.
