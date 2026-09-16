# Step 1: audit-tooling

**732문항을 사람이 판정할 수 있게 펼쳐 놓는 도구와, 그 판정을 검사하는 도구를 만든다.**
도구는 판정을 **만들지 않는다** — 자료를 모으고 형식을 검사할 뿐이다.

**이 step에서 만드는 파일은 `phases/35-question-topic-audit/` 아래뿐이다.**
데이터·테스트·제품 코드·공용 `scripts/`는 한 글자도 바꾸지 않는다.

## 이 phase의 범위 — 조사와 보고뿐이다

> 이번 phase에서는 문항을 실제로 이동하지 않는다. 먼저 732개 전체 문항의 현재 topic 배정이 학습
> 목표와 맞는지만 조사한다. 이번 phase는 audit/report only다.

**바꾸지 않는 것**: `src/data/questions.json` · `src/data/topics.json` · `src/data/data.test.ts` ·
`scripts/topics-baseline.json` · `scripts/`의 공용 스크립트 · `src/` 전체.

## 읽어야 할 파일

- `docs/ADR.md` — **ADR-034**(step 0이 쓴 판정 기준). 이 도구가 모으는 자료가 그 판정에 쓰인다.
- `docs/ADR.md` — ADR-026(개념당 최소 1문항), ADR-016(개념 펼치기는 `question.topicId`를 따른다)
- `docs/ARCHITECTURE.md` — 「데이터 모델」의 `Question`·`Concept` 타입
- `scripts/coverage.mjs` — 개념 커버리지를 세는 기존 도구. **고치지 말고 방식만 참고한다**

## 작업

### 1. `tools/build-worksheet.mjs` — 판정용 워크시트

`src/data/questions.json`과 `src/data/topics.json`을 읽어 `audit/worksheet.jsonl`을 쓴다.
문항 하나가 한 줄(JSON)이고, 732줄이다. 줄마다 아래 필드를 담는다.

| 필드 | 값 |
|---|---|
| `id` `topicId` `conceptId` | 현재 값 그대로 |
| `topicTitle` `conceptName` | 사람이 읽을 이름 |
| `prompt` `choices` `answerIndex` `explanation` | 문항 전문. 판정은 이것을 읽고 한다 |
| `questionsInConcept` | 그 `conceptId`를 가리키는 문항 수 |
| `soleQuestionForConcept` | 위 값이 1인가 |
| `signals.foreignTopics` | `{주제id: [그 주제의 서비스 이름…]}` — 아래 규칙으로 뽑는다 |

**`foreignTopics` 신호 규칙** (이 규칙 그대로 구현한다):

1. 서비스 이름 사전을 **개념 `name`에서** 만든다. 연속한 대문자 낱말(고유명사 구)을 뽑는다 —
   `Simple Notification Service`, `Global Accelerator`, `DataSync`처럼.
2. 흔한 영어 낱말은 버린다(`Service` · `Data` · `Storage` · `Performance` · `Container` 같은 것).
   한 낱말짜리 이름은 이 걸러내기를 통과한 것만 남긴다.
3. **두 개 이상 주제의 개념 이름에 나오는 이름은 버린다.** 변별력이 없다.
4. `aws-core-services`와 `s3-storage-classes`는 사전에서 **뺀다.** 설계상 모든 주제를 가로지르는
   주제라 신호가 아니라 잡음이 된다.
5. 문항의 `prompt`·`choices`·`explanation`을 합친 글에서 이 이름들을 낱말 경계로 찾고, **자기 주제가
   아닌** 주제의 이름이 나오면 그 주제를 `foreignTopics`에 넣는다.

**이 신호는 판정이 아니라 읽는 순서를 정하는 보조다.** 신호가 없다고 keep이 아니고, 있다고 이동
후보가 아니다. 워크시트 머리주석에 이 문장을 적어라.

### 2. `tools/validate-verdicts.mjs` — 판정 산출물 검사

`audit/verdicts.jsonl`을 검사한다. 줄 하나가 문항 하나의 판정이고 필드는 아래 16개다. **이 스키마는
고정이다** — 필드를 더하거나 이름을 바꾸지 마라. step 2 이후가 이 형식으로 쓴다.

```json
{"id":"q364","topicId":"data-transfer-services","conceptId":"data-transfer-services.datasync-task-status-event",
 "scenarioServices":["DataSync","EventBridge","SNS"],
 "decidingKnowledge":"정답을 오답과 가르는 지식 한 문장",
 "recommendedTopic":"data-transfer-services","recommendedConceptId":"data-transfer-services.datasync-task-status-event",
 "secondaryTopics":["sqs-sns-eventbridge"],
 "conceptFit":"yes|partial|no","verdict":"keep|ambiguous|move-recommended","confidence":null,
 "coverageConflict":false,"retarget":null,
 "rationale":"판정 근거 한두 문장","reviewedBy":"codex","step":2}
```

검사 항목:

1. 줄마다 JSON 하나, 16개 필드가 다 있고 문자열 필드가 비어 있지 않다.
2. `id`가 실재하는 문항이고 중복이 없다. `topicId`·`conceptId`는 그 문항의 **현재 값과 같아야** 한다.
3. enum: `verdict`(keep·ambiguous·move-recommended), `conceptFit`(yes·partial·no),
   `confidence`(high·medium·low·null), `retarget`(ready·needs-design·null), `reviewedBy`(codex·claude).
4. `recommendedTopic`은 실재하는 주제다. `recommendedConceptId`는 null이거나 실재하는 개념이고,
   그 개념은 `recommendedTopic` 소속이어야 한다.
5. 모순 검사: `keep`인데 다른 주제를 권하면 실패. `move-recommended`인데 같은 주제를 권하면 실패.
   `move-recommended`에는 `confidence`가 있어야 하고, `keep`·`ambiguous`에는 없어야 한다(null).
6. `decidingKnowledge`는 15자 이상, `rationale`은 30자 이상.
7. **`coverageConflict`와 `retarget`은 다시 계산해 대조한다.** 아래 규칙이고, 사람이 정하는 값이 아니다.
   - `coverageConflict` = `verdict`가 move-recommended이고, `recommendedConceptId`가 null이 아니며
     현재 `conceptId`와 다르고, 현재 개념을 가리키는 문항이 그 하나뿐일 때 `true`. 그 밖에는 `false`.
   - `retarget` = move-recommended가 아니면 `null`. move-recommended이면 `recommendedConceptId`가
     있고 `coverageConflict`가 false일 때 `"ready"`, 아니면 `"needs-design"`.
8. 인자로 `--expect <N>`을 주면 줄 수가 정확히 N이어야 하고, `--complete`를 주면 732문항을 빠짐없이
   덮어야 한다.

위반이 하나라도 있으면 무엇이 왜 틀렸는지 줄 번호와 함께 찍고 **exit 1**. 통과하면 판정 분포를
한 줄로 찍고 exit 0.

### 3. 워크시트 생성

`node phases/35-question-topic-audit/tools/build-worksheet.mjs`를 실행해
`audit/worksheet.jsonl`을 만든다. `audit/verdicts.jsonl`은 이 step에서 만들지 않는다 —
step 2가 첫 40줄을 쓴다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/35-question-topic-audit/tools/build-worksheet.mjs
test "$(wc -l < phases/35-question-topic-audit/audit/worksheet.jsonl)" = 732
node -e "const f=require('fs');const rows=f.readFileSync('phases/35-question-topic-audit/audit/worksheet.jsonl','utf8').trim().split('\n').map(JSON.parse);const need=['id','topicId','conceptId','topicTitle','conceptName','prompt','choices','answerIndex','explanation','questionsInConcept','soleQuestionForConcept','signals'];for(const r of rows){for(const k of need){if(r[k]===undefined)throw new Error(r.id+' 필드 없음 '+k)}}const q=JSON.parse(f.readFileSync('src/data/questions.json','utf8'));if(rows.length!==q.length)throw new Error('문항 수 불일치');if(rows.filter((r)=>r.soleQuestionForConcept).length!==540)throw new Error('유일 문항 수가 540이 아니다');console.log('워크시트 732줄 · 유일 문항 540건')"
node phases/35-question-topic-audit/tools/validate-verdicts.mjs --help || true
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('제품 데이터가 바뀌었다: '+p)}console.log('제품 데이터 4종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 새 파일이 `phases/35-question-topic-audit/` 밖에 생기지 않았는가?
   - `scripts/`의 기존 스크립트를 고치지 않았는가?
   - 도구가 판정(`verdict`)을 **자동으로 만들지 않는가**? 신호만 모으는가?
3. 결과에 따라 `phases/35-question-topic-audit/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 만든 도구와 워크시트 줄 수, AC 결과
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 판정을 자동으로 생성하지 마라. 이유: 이 audit의 값은 사람이 정답 논리를 읽고 내리는 판단에 있다.
  신호로 `verdict`를 정하면 그 값은 신호의 재작성일 뿐이다.
- `src/`·`scripts/`를 고치지 마라. 제품 데이터 4종은 한 바이트도 바뀌면 안 된다.
- 워크시트에 문항 전문을 **요약해서** 넣지 마라. 판정자가 원문을 읽어야 한다.
- `audit/verdicts.jsonl`을 이 step에서 만들지 마라. step 2가 만든다.
- 저장소 안 다른 곳에 임시 파일을 만들지 마라. 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
