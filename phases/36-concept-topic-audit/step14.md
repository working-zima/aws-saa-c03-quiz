# Step 14: audit-report

**618건 개념 판정과 교차 분류를 사람이 읽는 보고서로 집계하고, 다음 phase가 쓸 수정 후보 목록을
만든다.** 판정을 바꾸지 않는다 — 세고 묶어서 보여 주기만 한다.

**이 step에서 만드는 파일은 `audit/report.md`, `audit/by-topic/<topicId>.md`(39개),
`audit/handoff-fixes.md`, `tools/aggregate.mjs`다.** `verdicts.jsonl`·`cross-phase35.jsonl`·데이터·
테스트·제품 코드·phase 35 산출물은 한 글자도 바꾸지 않는다.

## 읽어야 할 파일

- `phases/36-concept-topic-audit/audit/verdicts.jsonl` — 개념 판정 618줄
- `phases/36-concept-topic-audit/audit/cross-phase35.jsonl` — step 13의 교차 분류
- `phases/36-concept-topic-audit/audit/concepts.jsonl` — 개념 전문과 `questionIds`·`blockNeighbors`
- `phases/36-concept-topic-audit/index.json` — step별 `summary`의 분포와 경고
- `docs/ADR.md`의 ADR-035(기준) · ADR-033(서비스 블록 순서) · ADR-026(개념당 최소 1문항)

## 작업

### 1. `tools/aggregate.mjs`

위 파일들을 읽어 아래 산출물을 쓴다. **숫자는 전부 스크립트가 센다** — 손으로 적지 마라.

### 2. `audit/report.md`에 담을 것

1. 전체 판정 수, 누락·중복 여부(개념 id 집합 대조)
2. `keep` · `ambiguous` · `move-recommended` 수와 비율
3. `move-recommended`의 `confidence` high · medium · low
4. `serviceSpecificGoal` 참·거짓 수와, `move-recommended` 안에서의 비율
5. **현재 주제 → 권장 주제별 이동 후보 수**(쌍마다 개념 id)
6. **주제별 개념 수와 이동 후보 비율**(39행 표)
7. `duplicateOf`가 있는 개념 전체 목록과 상대 개념(주제가 같은 쌍·다른 쌍을 나눠 센다)
8. `blockImpact`가 "대상 개념·자리가 없다"고 적힌 후보 목록 — 추가 설계가 필요한 자리다
9. **`ambiguous` 전체 목록과 핵심 쟁점**(각 개념의 두 해석을 한 줄씩)
10. 재검토 신호 조합 사례 — `move-recommended` + `serviceSpecificGoal=true`, `keep` + `duplicateOf`
11. **교차 분류 요약** — ① · `2A` · `2B` · `3` · `4` · `hold`의 수와, 각 유형의 개념 id와 영향 문항 수
12. step별 분포표(각 step의 `summary`에서 옮긴다)와 급변 경고가 있었다면 그 내용
13. 표본 40건이 세운 기준과 전체 판정이 어긋난 자리가 있었다면 그 기록(step 12의 `summary`)

### 3. `audit/by-topic/<topicId>.md`

주제 하나가 파일 하나다(39개). 그 주제의 개념을 **배열 순서대로** 표로 싣는다 — 위치, conceptId,
`learningGoal`, `fit`, `confidence`, `serviceSpecificGoal`, 권장 주제, `duplicateOf`, 문항 수,
교차 유형. 주제 머리에 그 주제의 판정 분포와 이동 후보 비율을 적는다.

### 4. `audit/handoff-fixes.md` — 다음 phase의 입력

**이 파일이 이 phase의 결론이다.** 아래 순서로 구분해 적는다.

1. **확신이 높은 구조 오류** — `move-recommended` + `confidence=high`
2. **`2A`** — 같은 주제 안에서 문항의 `conceptId`만 바꿀 후보
3. **`2B`** — 문항의 `topicId`·`conceptId`를 함께 바꿀 후보
4. **`3`** — 개념을 옮기고 연결 문항이 따라가는 후보
5. **`4`** — 개념과 문항이 둘 다 재배정 후보
6. **보류 목록** — `ambiguous` · `confidence=medium`·`low` · `hold`

**수정 후보마다 아래를 빠짐없이 적는다.**

- 현재 개념 id와 주제 / 권장 개념 id와 주제
- 영향 받는 문항 id **전체**
- `conceptId` 변경이 필요한가(개념 이동이면 `<topicId>.<slug>`가 바뀐다)
- 문항의 `topicId` 변경이 필요한가 / 문항의 `conceptId` 변경이 필요한가
- 원 주제(source)와 대상 주제(target)
- 대상 주제에서 들어갈 **서비스 블록과 그 안의 자리**(ADR-033)
- phase 34가 잡은 순서에 주는 영향(앞뒤 개념이 무엇이 되는가)
- 커버리지 영향 — 원 개념이 문항을 잃는지, 대상 개념에 문항이 몰리는지(ADR-026)
- **되돌리는 방법** — 무엇을 원래 값으로 돌리면 복구되는지

**확신이 높은 항목도 이 phase에서 자동으로 고치지 않는다.** 다음 phase 설계 단계에서 사람이 목록을
다시 확인한다. 이 문장을 파일 머리에 적어라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/36-concept-topic-audit/tools/aggregate.mjs
node phases/36-concept-topic-audit/tools/validate-verdicts.mjs --expect 618 --complete
test -f phases/36-concept-topic-audit/audit/report.md
test -f phases/36-concept-topic-audit/audit/handoff-fixes.md
test "$(ls phases/36-concept-topic-audit/audit/by-topic/ | wc -l | tr -d ' ')" = 39
node -e "const f=require('fs');const n=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').length;if(n!==618)throw new Error('판정 줄 수가 바뀌었다: '+n);const t=JSON.parse(f.readFileSync('src/data/topics.json','utf8'));for(const x of t){const p='phases/36-concept-topic-audit/audit/by-topic/'+x.id+'.md';if(!f.existsSync(p))throw new Error('주제 파일이 없다: '+p)}console.log('판정 618줄 그대로 · 주제 파일 39개')"
node -e "const f=require('fs');const r=f.readFileSync('phases/36-concept-topic-audit/audit/report.md','utf8');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const keep=rows.filter((x)=>x.fit==='keep').length;const amb=rows.filter((x)=>x.fit==='ambiguous').length;const mv=rows.filter((x)=>x.fit==='move-recommended').length;if(keep+amb+mv!==618)throw new Error('분포 합이 618이 아니다');for(const n of [618,keep,amb,mv])if(!r.includes(String(n)))throw new Error('보고서에 '+n+'이 없다 — 스크립트가 센 값을 싣지 않았다');const h=f.readFileSync('phases/36-concept-topic-audit/audit/handoff-fixes.md','utf8');for(const k of ['되돌리는','블록','커버리지'])if(!h.includes(k))throw new Error('handoff-fixes.md에 «'+k+'»가 없다');console.log('보고서 수치 대조 · 인계 목록 항목 확인')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 보고서를 읽어 본다:
   - 숫자가 서로 맞는가(합계 = 618, 주제별 합 = 전체, 교차 유형 합 + ① = 618)?
   - `ambiguous` 항목마다 쟁점이 한 줄로 적혀 있는가?
   - `handoff-fixes.md`의 후보마다 **영향 문항 id 전체**와 **되돌리는 방법**이 있는가?
   - 판정 파일과 교차 파일이 바뀌지 않았는가?
3. `index.json`의 step 14를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 최종 집계 핵심 수치와 수정 후보 수를 한 줄로
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- `verdicts.jsonl`·`cross-phase35.jsonl`을 고치지 마라. 이 단계는 집계다. 판정을 고쳐야 할 것이
  보이면 `report.md`에 적고 `summary`에도 남긴다.
- 숫자를 손으로 적지 마라. 스크립트가 센 값만 싣는다.
- 개념이나 문항을 재배정하지 마라. 실제 이동은 다음 phase이고 아직 승인되지 않았다.
- 확신이 높은 항목을 이 step에서 고치지 마라. 목록으로만 남긴다.
- `phases/35-question-topic-audit/`의 파일을 고치지 마라.
- 저장소 안에 임시 파일을 만들지 마라. 기존 테스트를 깨뜨리지 마라.
