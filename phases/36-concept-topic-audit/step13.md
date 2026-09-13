# Step 13: cross-phase35

**개념 판정(phase 36)과 문항 판정(phase 35)을 처음으로 맞춰 본다.** 두 결과를 네 경우로 나누어
다음 수정 phase의 입력을 만든다. **이 step에서 개념 판정을 고치지 않는다** — 교차는 분류일 뿐이다.

**이 step에서 만드는 파일은 `audit/cross-phase35.jsonl`과 `tools/cross-phase35.mjs`다.**
`audit/verdicts.jsonl`·데이터·테스트·제품 코드·phase 35 산출물은 한 글자도 바꾸지 않는다.

## 이 step에서 처음으로 phase 35를 읽는다

step 0~12는 phase 35의 판정을 **일부러** 보지 않았다. 개념 판정이 문항 판정에 끌려가지 않게 하려는
설계다(ADR-035). 이제 둘을 맞춰 본다. **읽기만 한다** — `phases/35-question-topic-audit/`의 파일은
한 바이트도 바뀌면 안 되고, 검증이 해시로 확인한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-035**(개념 판정 기준)와 **ADR-034**(문항 판정 기준)
- `phases/36-concept-topic-audit/audit/verdicts.jsonl` — 개념 판정 618줄
- `phases/35-question-topic-audit/audit/verdicts.jsonl` — 문항 판정 732줄. 줄마다 `id`·`topicId`·
  `conceptId`·`verdict`·`recommendedTopic`·`recommendedConceptId`·`confidence`가 있다
- `phases/36-concept-topic-audit/audit/concepts.jsonl` — 개념별 `questionIds`

## 작업

### 1. `tools/cross-phase35.mjs`

두 판정 파일을 읽어 `audit/cross-phase35.jsonl`을 쓴다. **분류는 스크립트가 규칙대로 계산한다** —
아래 규칙이 전부이고, 사람이 임의로 바꾸지 않는다. 다만 `rationale`은 사람이 쓴다.

개념마다 그 개념에 연결된 문항의 phase 35 판정을 모아 아래 유형으로 나눈다.

| 유형 | 조건 | 뜻 |
|---|---|---|
| ① | 개념 `keep` + 문항 전부 `keep` | 둘 다 현재 구조 유지. **파일에 쓰지 않는다**(기본값) |
| `2A` | 개념 `keep` + 문항이 **같은 주제 안**의 다른 개념을 권함 | 문항의 `conceptId`만 바꿀 후보 |
| `2B` | 개념 `keep` + 문항이 **다른 주제**의 개념을 권함 | 문항의 `topicId`·`conceptId`를 함께 바꿀 후보 |
| `3` | 개념 `move-recommended` + 문항 전부 `keep` | 개념을 옮기고 연결 문항이 따라가는 후보 |
| `4` | 개념 `move-recommended` + 문항에도 이동 권고 | 둘 다 재배정 후보. **가장 신중하게 다룬다** |
| `hold` | 아래 보류 조건 | 네 경우에 넣지 않는다 |

**보류(`hold`)로 남기는 것**: 개념이 `ambiguous`인 경우 · 문항이 `ambiguous`인 경우 · 개념과 문항의
권장 방향이 서로 어긋나는 경우 · 확신이 높은 결론이 나오지 않는 구조 경계 사례.
**억지로 ①~④에 넣지 마라.** 보류는 다음 phase의 확신 높은 수정 대상에서 빠진다.

줄의 형식은 아래 6개 필드로 고정한다.

```json
{"conceptId":"cloudwatch-xray.log-analysis-options","topicId":"cloudwatch-xray","conceptFit":"keep",
 "questionFindings":[{"id":"q223","verdict":"move-recommended","recommendedTopic":"emr-glue-athena",
                      "recommendedConceptId":"emr-glue-athena.log-storage-s3-athena"}],
 "type":"2B","rationale":"왜 이 유형인지, 그리고 다음 phase가 무엇을 함께 옮겨야 하는지 한두 문장"}
```

- `conceptFit`은 phase 36의 그 개념 `fit` 값을 **그대로** 옮긴다.
- `questionFindings`의 `verdict`·`recommendedTopic`·`recommendedConceptId`는 phase 35 파일의 값을
  **그대로** 옮긴다. 독립 검증기가 원본과 한 글자씩 대조한다 — 고치거나 해석해서 쓰면 실패한다.
- `type`이 ①인 개념은 파일에 넣지 않는다. 전체에서 빼면 ①의 수가 나온다.

### 2. `topicId == conceptId의 주제` 불변을 확인한다

재배정은 `topicId`와 `conceptId`를 함께 옮기는 일이다(ADR-034). `2B`와 `4`의 줄에는 **대상 주제와
대상 개념이 같은 주제에 있는지**를 확인해 어긋나면 `rationale`에 "대상 개념이 없어 추가 설계가
필요하다"고 적는다. 여기서 데이터를 고치지는 않는다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/36-concept-topic-audit/tools/cross-phase35.mjs
node phases/36-concept-topic-audit/tools/validate-verdicts.mjs --expect 618 --complete
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/cross-phase35.jsonl','utf8').trim().split('\n').map(JSON.parse);const ok=new Set(['2A','2B','3','4','hold']);const c36=new Map(f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map((l)=>{const r=JSON.parse(l);return [r.conceptId,r]}));const p35=new Map(f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map((l)=>{const r=JSON.parse(l);return [r.id,r]}));const seen=new Set();for(const r of rows){if(!ok.has(r.type))throw new Error('type이 잘못됐다: '+r.type+' ('+r.conceptId+')');if(!c36.has(r.conceptId))throw new Error('그런 개념이 없다: '+r.conceptId);if(seen.has(r.conceptId))throw new Error('중복 줄: '+r.conceptId);seen.add(r.conceptId);if(r.conceptFit!==c36.get(r.conceptId).fit)throw new Error('conceptFit이 phase 36 판정과 다르다: '+r.conceptId);for(const q of r.questionFindings){const o=p35.get(q.id);if(!o)throw new Error('phase 35에 없는 문항: '+q.id);if(q.verdict!==o.verdict||q.recommendedTopic!==o.recommendedTopic||q.recommendedConceptId!==o.recommendedConceptId)throw new Error('phase 35 판정을 그대로 옮기지 않았다: '+q.id)}if([...r.rationale.trim()].length<20)throw new Error('rationale이 너무 짧다: '+r.conceptId)}console.log('교차 '+rows.length+'줄 확인 — '+JSON.stringify(rows.reduce((a,r)=>(a[r.type]=(a[r.type]||0)+1,a),{})))"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 분류를 훑는다:
   - `2A`와 `2B`가 **같은 주제인가 다른 주제인가**로 정확히 갈렸는가?
   - `4`로 분류된 자리마다 개념과 문항의 권장 방향이 실제로 같은 곳을 가리키는가? 어긋나면 `hold`다.
   - `hold`에 사유가 적혀 있는가?
   - 개념 판정 파일(`verdicts.jsonl`)이 바뀌지 않았는가?
3. `index.json`의 step 13을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **유형별 건수(①은 나머지로 계산) · `2A`/`2B`/`3`/`4`의
     개념 id와 영향 문항 수 · `hold` 건수와 사유 유형**을 한 줄로
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- `audit/verdicts.jsonl`을 고치지 마라. 이유: 개념 판정은 문항 판정을 보기 **전에** 끝난 것이다.
  문항 판정을 보고 개념 판정을 고치면 독립성이 사라지고, 검증이 해시로 이것을 막는다. 어긋난 판정을
  발견하면 `rationale`과 `summary`에 적어라.
- `phases/35-question-topic-audit/`의 어떤 파일도 고치지 마라. 읽기만 한다.
- phase 35 판정값을 해석해서 바꿔 적지 마라. 그대로 옮긴다.
- 실제 재배정을 하지 마라. `questions.json`·`topics.json`·`data.test.ts`·`topics-baseline.json`은
  이 phase에서 바뀌지 않는다.
- 애매한 자리를 ①~④에 억지로 넣지 마라. `hold`가 맞는 답이다.
- 저장소 안에 임시 파일을 만들지 마라. 기존 테스트를 깨뜨리지 마라.
