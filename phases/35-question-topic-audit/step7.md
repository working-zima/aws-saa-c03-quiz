# Step 7: verdicts-integration-backup

**주제 3개, 문항 75개를 ADR-034 기준으로 판정한다.** 문항을 옮기지 않는다 — 조사만 한다.

**이 step에서 바꾸는 파일은 `phases/35-question-topic-audit/audit/verdicts.jsonl` 하나다**(필요하면
`tools/`의 검사기도). 데이터·테스트·제품 코드는 한 글자도 바꾸지 않는다.

## 담당 범위

| 주제 | 제목 | 전체 문항 | 이 step에서 판정할 문항 |
|---|---|---:|---:|
| `api-gateway-step-functions` | API Gateway·Step Functions | 25 | 24 |
| `sqs-sns-eventbridge` | SQS·SNS·EventBridge·Amazon MQ·SES | 40 | 40 |
| `backup-disaster-recovery` | AWS Backup·재해 복구 전략·Elastic Disaster Recovery | 11 | 11 |

- 이 주제들의 문항 중 **이미 `verdicts.jsonl`에 있는 1개는 건너뛴다**(step 2의 표본).
  건너뛴 문항을 다시 쓰거나 고치지 마라 — 사용자가 승인한 판정이다.
- 이 step이 끝나면 `verdicts.jsonl`은 **459줄**이어야 한다.
- 담당 주제 밖의 문항은 판정하지 마라. 다른 step이 맡는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-034** — 판정 원칙
- `phases/35-question-topic-audit/step2.md` — 표본 40건에서 세운 기준 사례와 재검토 신호
- `phases/35-question-topic-audit/audit/worksheet.jsonl` — 문항 전문·`questionsInConcept`·신호
- `phases/35-question-topic-audit/audit/verdicts.jsonl` — 이미 판정된 줄(형식의 본보기)
- `phases/35-question-topic-audit/tools/validate-verdicts.mjs` — 검사 규칙
- `src/data/topics.json` — 권장 개념을 고를 때 대상 주제의 개념 목록

## 판정 기준 — ADR-034와 같다

문항마다 이 순서로 판단한다. 앞 칸을 채우지 못하면 뒤 칸을 쓰지 마라.

1. **`decidingKnowledge`** — 정답을 오답과 가르는 지식을 한 문장으로. "이것을 모르면 정답을 고를 수
   없다"가 되어야 한다. 서비스 이름만 적지 마라.
2. **교체 가능성** — 시나리오 서비스를 같은 계열 다른 서비스로 바꿔도 정답 논리가 그대로인가?
   그대로면 그 서비스는 주인공이 아니다. **이 시험 하나로 결론내지 마라.**
3. **오답 분석** — 오답 셋이 무엇을 오해한 것인지 본다. 해설이 실제로 무엇을 정답 근거로 쓰는지 본다.
4. **`recommendedConceptId`** — 결정 지식을 가장 잘 설명하는 개념을 `topics.json`에서 지목한다. 그
   개념의 주제가 `recommendedTopic`이다. 대상 주제에 맞는 개념이 없으면 `null`로 두고 `rationale`에 적는다.
5. **`conceptFit`** — 지금 연결된 개념이 **정답을 가르는 중심 지식 자체를 직접 설명하는가.**
   - `yes` — 관련 내용을 포함하는 수준이 아니라 **중심 지식 자체**를 그 개념이 직접 설명한다.
   - `partial` — 관련은 있지만 **다른 개념이 더 직접적이고 중심적으로** 설명한다.
   - `no` — 그 개념은 배경·주변 지식이고 결정 지식은 다른 개념에 있다.

   "현재 개념에서도 관련 내용을 찾을 수 있다"는 이유만으로 `yes`를 주지 마라. 마지막에 반드시 물어라 —
   **"이 문항을 이 개념의 확인 문제라고 부르는 것이 가장 자연스러운가?"**
6. **`verdict`** — `keep` · `ambiguous` · `move-recommended`. 1~5가 한 곳을 가리키지 않으면 **주저 없이
   `ambiguous`**다. `move-recommended`일 때만 `confidence`(`high`·`medium`·`low`)를 쓴다.
7. **`rationale`** — 한두 문장. `ambiguous`는 두 해석을 모두 적는다.

### 표본 40건이 세운 기준 사례

- `q154` move/high/partial — 현재 개념이 서비스 **소개**라 중심 기능이 여러 항목 중 하나로만 나열될 때는 이동.
- `q223` move/high/partial — 현재 개념이 선택지 **요약**이고 대상 개념이 결정 축을 중심으로 설명할 때는 이동.
- `q284` keep/yes — 시나리오가 다른 주제의 서비스(EC2)를 배경으로 써도, 결정 지식을 설명하는 개념이
  현재 주제에 있으면 유지.
- `q355` keep/yes — **비교 축 자체가 결정 지식이면** 정답이 다른 주제의 서비스라도 비교 개념을 유지.
- `q364` ambiguous/yes — 개념 적합도(`yes`)와 주제 경계(미확정)는 **다른 축**이다. 한쪽을 근거로 다른
  쪽을 밀어붙이지 않는다.

### `scenarioServices`에 무엇을 적는가

상황에 등장하는 서비스를 적는다. **서비스 이름이 등장하지 않는 문항도 있다** — 리전·가용 영역·
온프레미스처럼 용어를 묻거나, 증상만 서술하고 서비스명을 대지 않는 문항이다. 그때는 **그 문항이
가르는 대상**을 적는다(예: `["리전"]` · `["가용 영역"]` · `["RDS 연결"]`). **빈 배열로 두지 마라** —
검사기가 막는다.

### 빨아들이지 않기

권한·비용·EventBridge·SNS·CloudWatch·계정 간 접근이 **등장했다는 이유만으로** 그 주제로 옮기지 마라.
그 서비스의 지식이 정답을 가를 때만 이동이다.

### 재검토 신호 — 두 조합은 rationale에서 설명한다

틀렸다는 뜻이 아니다. 왜 그 조합이 가능한지를 `rationale`에 명시한다(검사기가 길이를 본다).

- `move-recommended` + `conceptFit=yes` — 개념은 맞는데 주제 경계가 어긋난 자리일 수 있다.
- `keep` + `conceptFit=no` — 주제는 맞는데 연결된 개념이 배경 지식인 자리일 수 있다.

### 판정 수를 맞추려 하지 마라

이 audit의 목적은 이동 문항을 많이 찾는 것이 아니라 **핵심 학습 목표가 잘못 배정된 문항만** 찾는 것이다.
기준에 맞으면 대부분 `keep`이어도 그대로 받아들인다. `coverageConflict`와 `retarget`은 의미 판정의
근거가 아니다 — 판정을 먼저 하고 제약은 뒤에 계산한다.


## 신호는 보조다

워크시트의 `signals.foreignTopics`는 **읽는 순서를 정하는 보조**일 뿐이다. 신호가 없어도 이동 후보일
수 있고, 있어도 keep일 수 있다. 판정은 문항 전문을 읽고 내린다.

## 재실행이면 — 걸린 줄만 고친다

이 step이 맡은 문항이 `audit/verdicts.jsonl`에 이미 들어 있다면(검증에 걸려 다시 도는 경우)
**판정을 새로 만들지 마라.** 검사에 걸린 줄만 고치고 나머지는 그대로 둔다 — 문항을 읽고 내린 판단을
재생성으로 날리지 않기 위해서다. 아직 판정이 없는 문항만 새로 판정한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node -e "const f=require('fs');const n=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').length;if(n!==459)throw new Error('줄 수가 '+n+'이다 — 459이어야 한다');console.log('판정 누적 459줄')"
node phases/35-question-topic-audit/tools/validate-verdicts.mjs --expect 459
node -e "const f=require('fs');const rows=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const bad=rows.filter((r)=>r.secondaryTopics.length>2).map((r)=>r.id);if(bad.length)throw new Error('secondaryTopics가 2개를 넘는다: '+bad.join(', '));const flagged=rows.filter((r)=>(r.verdict==='move-recommended'&&r.conceptFit==='yes')||(r.verdict==='keep'&&r.conceptFit==='no'));const thin=flagged.filter((r)=>[...r.rationale.trim()].length<80).map((r)=>r.id);if(thin.length)throw new Error('재검토 신호 조합인데 rationale이 짧다: '+thin.join(', '));console.log('상한·신호 조합 확인 (신호 '+flagged.length+'건)')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('제품 데이터가 바뀌었다: '+p)}console.log('제품 데이터 4종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 판정을 다시 훑는다:
   - `decidingKnowledge`가 서비스 이름이 아니라 **지식**을 말하는가?
   - 같은 개념에 연결된 문항끼리 판정 기준이 일관적인가?
   - 신호 조합(`move`+`yes`, `keep`+`no`)의 `rationale`이 그 조합을 실제로 설명하는가?
3. `phases/35-question-topic-audit/index.json`의 step 7을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **이 step에서 판정한 문항 수와 분포**를 적는다 —
     keep·ambiguous·move-recommended 수, confidence high·medium·low, conceptFit yes·partial·no,
     `move`+`yes` 건수, `keep`+`no` 건수, 판단이 어려웠던 문항 id.
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 담당 주제 밖의 문항이나 이미 판정된 문항을 건드리지 마라. 이유: 묶음이 겹치면 중복·누락이 생긴다.
- 판정 수를 맞추려 하지 마라. 이유: audit의 목적은 잘못 배정된 문항만 찾는 것이다.
- 신호(`foreignTopics`)로 판정을 정하지 마라. 이유: 신호는 보조이고 판정은 정답 논리로 한다.
- 커버리지 때문에 판정을 뒤집지 마라. 이유: ADR-034가 의미 판정과 구현 제약을 분리한다.
- `src/`·`scripts/`를 고치지 마라. 제품 데이터 4종은 한 바이트도 바뀌면 안 된다.
- 검사 규칙을 느슨하게 고쳐 통과시키지 마라. 검사에 걸리면 판정을 고친다.
- 저장소 안에 임시 파일을 만들지 마라. 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
