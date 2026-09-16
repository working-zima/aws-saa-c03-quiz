# Step 1: build-worksheet

**618개 개념을 사람이 판정할 수 있게 펼쳐 놓는 도구와, 그 판정을 검사하는 도구를 만든다.**
도구는 판정을 **만들지 않는다** — 자료를 모으고 형식을 검사할 뿐이다.

**이 step에서 만드는 파일은 `phases/36-concept-topic-audit/` 아래뿐이다.**
데이터·테스트·제품 코드·공용 `scripts/`는 한 글자도 바꾸지 않는다.

## 이 phase의 범위 — 조사와 보고뿐이다

> 이번 phase에서는 개념을 실제로 옮기지 않는다. 618개 concept 전부가 현재 topic에 속하는 것이 학습
> 구조상 적절한지만 독립적으로 조사한다. 이번 phase는 audit only다.

**바꾸지 않는 것**: `src/data/questions.json` · `src/data/topics.json` · `src/data/data.test.ts` ·
`scripts/topics-baseline.json` · `phases/35-question-topic-audit/` 아래 전부 · `scripts/`의 공용
스크립트 · `src/` 전체.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-035**(step 0이 쓴 판정 기준) — 이 도구가 모으는 자료가 그 판정에 쓰인다
- `docs/ADR.md`의 ADR-033(개념 배열을 서비스 블록 단위로 잡는다) · ADR-026(개념당 최소 1문항) ·
  ADR-023(주제를 서비스 경계로 자른다)
- `docs/ARCHITECTURE.md` — 「데이터 모델」의 `Topic`·`Concept`·`Question` 타입
- `scripts/coverage.mjs` — 개념별 문항 수를 세는 기존 도구. **고치지 말고 방식만 참고한다**

## 작업

### 1. `tools/build-concept-worksheet.mjs` — 판정용 워크시트

`src/data/topics.json`과 `src/data/questions.json`을 읽어 `audit/concepts.jsonl`을 쓴다.
개념 하나가 한 줄(JSON)이고, **618줄**이다. 주제 배열 순서 · 개념 배열 순서를 그대로 따른다.

| 필드 | 값 |
|---|---|
| `conceptId` `topicId` | 현재 값 그대로. `conceptId`는 `<topicId>.<slug>` 형식이다 |
| `topicTitle` | 사람이 읽을 주제 제목 |
| `name` `summary` `paragraphs` | 개념 전문. **요약하지 마라** — 판정은 이것을 읽고 한다 |
| `position` `topicConceptCount` | 주제 안의 배열 위치(1부터)와 그 주제의 개념 수 |
| `questionCount` `questionIds` | 이 `conceptId`를 가리키는 문항 수와 id 목록(원래 순서) |
| `blockNeighbors` | `{prev, next}` — 배열에서 앞·뒤 개념의 id(없으면 `null`). ADR-033 블록 위치를 볼 때 쓴다 |
| `signals` | 아래 네 신호. **판정이 아니다** |

**`signals`는 아래 규칙 그대로 구현한다.**

1. `foreignServiceMentions` — `{주제id: [그 주제의 서비스 이름…]}`.
   - 서비스 이름 사전을 **개념 `name`에서** 만든다. 연속한 대문자 낱말(고유명사 구)을 뽑는다 —
     `Global Accelerator` · `DataSync` · `Elastic Beanstalk`처럼.
   - 흔한 영어 낱말은 버린다(`Service` · `Data` · `Storage` · `Type` · `Group` · `Policy` 같은 것).
   - **두 개 이상 주제의 개념 이름에 나오는 이름은 버린다.** 변별력이 없다.
   - `aws-core-services`와 `s3-storage-classes`는 사전에서 **뺀다**(설계상 여러 주제를 가로지르는
     주제라 신호가 아니라 잡음이 된다). 단 이 두 주제의 개념도 **다른 주제의 이름을 언급하면 신호가
     붙는다** — 사전에서 빠지는 것은 이름의 출처일 뿐이다.
   - `name`·`summary`·`paragraphs`를 합친 글에서 낱말 경계로 찾고, **자기 주제가 아닌** 주제의
     이름이 나오면 그 주제를 넣는다.
2. `commonPatternMentions` — `[{name, ownerTopic}]`. 아래 고정 목록만 본다. 자기 주제가 소유한
   항목은 신호가 아니다.
   `EventBridge`·`SNS`·`SQS` → `sqs-sns-eventbridge` / `IAM` → `iam-permissions` /
   `CloudWatch`·`X-Ray` → `cloudwatch-xray` / `Organizations`·`CloudTrail`·`AWS Config` →
   `organizations-cloudtrail-config` / `Cost Explorer`·`Budgets` → `cost-management` /
   `KMS` → `secrets-encryption` / `계정 간`·`교차 계정` → `ownerTopic: null`(주인 없는 패턴).
3. `comparisonShape` — `name` 또는 `summary`에 `vs` · `비교` · `차이` · `고르` · `선택 기준` ·
   `대신` · `구분`이 있으면 `true`.
4. `nearDuplicateCandidates` — `[{conceptId, score}]` 상위 3개.
   `name + summary`를 소문자로 바꾸고 길이 2 이상 낱말 집합을 만들어 **자카드 유사도**를 잰다.
   자기 자신은 뺀다. **같은 주제 안의 개념도 후보에 넣는다**(병합 후보는 주제 안에도 있다).
   점수 0.25 미만은 넣지 않는다.

**워크시트 머리에 이 문장을 주석으로 적어라**: 신호는 읽는 순서를 정하는 보조일 뿐이고, 신호가
없다고 `keep`이 아니며 있다고 이동 후보가 아니다.

### 2. `tools/validate-verdicts.mjs` — 판정 산출물 검사

`audit/verdicts.jsonl`을 검사한다. 줄 하나가 개념 하나의 판정이고 필드는 아래 **15개다. 이 스키마는
고정이다** — 필드를 더하거나 이름을 바꾸지 마라. step 2 이후가 이 형식으로 쓴다.

```json
{"conceptId":"data-transfer-services.datasync-task-status-event","topicId":"data-transfer-services",
 "name":"DataSync 작업 실행 상태의 EventBridge 이벤트",
 "learningGoal":"이 개념을 학습한 뒤 학생이 이해해야 하는 중심 지식 한 문장",
 "serviceSpecificGoal":true,
 "fit":"keep|ambiguous|move-recommended","recommendedTopic":"data-transfer-services","confidence":null,
 "questionCount":1,"questionIds":["q364"],
 "duplicateOf":null,"blockImpact":null,
 "rationale":"판정 근거 한두 문장","reviewedBy":"codex","step":2}
```

검사 항목:

1. 줄마다 JSON 하나, 15개 필드가 다 있고 문자열 필드가 비어 있지 않다.
2. `conceptId`가 실재하는 개념이고 중복이 없다. `topicId`는 그 개념이 **실제로 속한 주제**와 같고,
   `conceptId`는 `<topicId>.`로 시작한다. `name`은 데이터의 현재 이름과 **글자까지 같다**.
3. enum: `fit`(keep·ambiguous·move-recommended), `confidence`(high·medium·low·null),
   `reviewedBy`(codex·claude). `serviceSpecificGoal`은 boolean, `step`은 정수.
4. `recommendedTopic`은 실재하는 주제다.
5. 모순 검사:
   - `keep` → `recommendedTopic`이 `topicId`와 같고, `confidence`와 `blockImpact`는 `null`.
   - `move-recommended` → `recommendedTopic`이 `topicId`와 다르고, `confidence`가 있고,
     `blockImpact`에 **대상 주제의 어느 서비스 블록 어디에 들어가는지**가 10자 이상 적혀 있다.
   - `ambiguous` → `confidence`는 `null`. `rationale`에 **두 해석을 모두** 적어야 하므로 80자 이상.
6. `questionCount`·`questionIds`는 **스크립트가 `questions.json`에서 다시 계산해 대조한다**(사람이
   채우는 값이 아니다). 개수와 id 집합이 모두 같아야 한다.
7. `duplicateOf`는 `null`이거나 실재하는 **다른** 개념의 id다.
8. `learningGoal`은 15자 이상, `rationale`은 30자 이상.
9. 재검토 신호 조합은 `rationale`이 80자 이상이어야 한다 — `move-recommended` +
   `serviceSpecificGoal=true`(서비스 고유 목표인데 다른 주제를 권함), `keep` + `duplicateOf`가 있음
   (유지인데 다른 개념과 거의 같음).
10. 인자로 `--expect <N>`을 주면 줄 수가 정확히 N이어야 하고, `--complete`를 주면 618개 개념을
    빠짐없이 덮어야 한다.

위반이 하나라도 있으면 무엇이 왜 틀렸는지 줄 번호와 함께 찍고 **exit 1**. 통과하면 판정 분포를
한 줄로 찍고 exit 0.

### 3. 워크시트 생성

`node phases/36-concept-topic-audit/tools/build-concept-worksheet.mjs`를 실행해
`audit/concepts.jsonl`을 만든다. `audit/verdicts.jsonl`은 이 step에서 만들지 않는다 —
step 2가 표본 40줄을 쓴다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/36-concept-topic-audit/tools/build-concept-worksheet.mjs
test "$(wc -l < phases/36-concept-topic-audit/audit/concepts.jsonl | tr -d ' ')" = 618
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/concepts.jsonl','utf8').trim().split('\n').map(JSON.parse);const need=['conceptId','topicId','topicTitle','name','summary','paragraphs','position','topicConceptCount','questionCount','questionIds','blockNeighbors','signals'];for(const r of rows){for(const k of need){if(r[k]===undefined)throw new Error(r.conceptId+' 필드 없음 '+k)}if(!r.conceptId.startsWith(r.topicId+'.'))throw new Error('id 형식 위반 '+r.conceptId)}const t=JSON.parse(f.readFileSync('src/data/topics.json','utf8'));const all=t.flatMap((x)=>x.concepts.map((c)=>c.id));if(rows.length!==all.length)throw new Error('개념 수 불일치');if(JSON.stringify(rows.map((r)=>r.conceptId))!==JSON.stringify(all))throw new Error('개념 순서가 데이터와 다르다');const q=JSON.parse(f.readFileSync('src/data/questions.json','utf8'));const sum=rows.reduce((a,r)=>a+r.questionCount,0);if(sum!==q.length)throw new Error('questionCount 합이 '+sum+'이다 — '+q.length+'이어야 한다');console.log('워크시트 618줄 · 문항 합 '+sum)"
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/concepts.jsonl','utf8').trim().split('\n').map(JSON.parse);const m=new Map(rows.map((r)=>[r.conceptId,r]));const pairs=[['aws-core-services.cloudfront','cloudfront-global-accelerator.cloudfront'],['aws-core-services.elb','elastic-load-balancing.elb']];for(const[a,b]of pairs){const ca=m.get(a).signals.nearDuplicateCandidates.map((x)=>x.conceptId);const cb=m.get(b).signals.nearDuplicateCandidates.map((x)=>x.conceptId);if(!ca.includes(b)||!cb.includes(a))throw new Error('near-duplicate 신호가 서로를 잡지 못한다: '+a+' ↔ '+b)}console.log('near-duplicate 신호 확인')"
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/concepts.jsonl','utf8').trim().split('\n').map(JSON.parse);const t=JSON.parse(f.readFileSync('src/data/topics.json','utf8'));const byId=new Map(t.flatMap((x)=>x.concepts.map((c)=>[c.id,c])));for(const r of rows){const c=byId.get(r.conceptId);if(r.name!==c.name||r.summary!==c.summary||JSON.stringify(r.paragraphs)!==JSON.stringify(c.paragraphs))throw new Error('개념 전문이 원문과 다르다: '+r.conceptId)}console.log('개념 전문 보존 확인')"
test ! -f phases/36-concept-topic-audit/audit/verdicts.jsonl
node phases/36-concept-topic-audit/tools/validate-verdicts.mjs --help || true
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 새 파일이 `phases/36-concept-topic-audit/` 밖에 생기지 않았는가?
   - `scripts/`의 기존 스크립트를 고치지 않았는가?
   - 도구가 판정(`fit`·`learningGoal`)을 **자동으로 만들지 않는가**? 신호만 모으는가?
3. 결과에 따라 `phases/36-concept-topic-audit/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 만든 도구와 워크시트 줄 수, 신호별 건수, AC 결과
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- `learningGoal`이나 `fit`을 자동으로 생성하지 마라. 이유: 이 audit의 값은 사람이 개념 본문을 읽고
  내리는 판단에 있다. 신호로 판정을 정하면 그 값은 신호의 재작성일 뿐이다.
- `phases/35-question-topic-audit/`의 파일을 **읽지도 고치지도 마라.** 이유: 개념 판정은 문항 판정과
  독립이어야 하고, 교차는 step 13에서만 한다.
- 워크시트에 개념 본문을 **요약해서** 넣지 마라. 판정자가 원문을 읽어야 한다.
- `src/`·`scripts/`를 고치지 마라. 잠긴 파일 5종은 한 바이트도 바뀌면 안 된다.
- `audit/verdicts.jsonl`을 이 step에서 만들지 마라. step 2가 만든다.
- 저장소 안 다른 곳에 임시 파일을 만들지 마라. 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
