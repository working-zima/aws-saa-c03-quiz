# Step 13: audit-report

**732건 판정을 사람이 읽는 보고서로 집계한다.** 판정을 바꾸지 않는다 — 세고 묶어서 보여 주기만 한다.

**이 step에서 만드는 파일은 `audit/report.md`, `audit/by-topic/<topicId>.md`(39개),
`tools/aggregate.mjs`다.** `verdicts.jsonl`·데이터·테스트·제품 코드는 한 글자도 바꾸지 않는다.

## 읽어야 할 파일

- `phases/35-question-topic-audit/audit/verdicts.jsonl` — 732줄
- `phases/35-question-topic-audit/audit/worksheet.jsonl` — 문항 전문(보고서에 필요한 만큼만 인용)
- `phases/35-question-topic-audit/index.json` — step별 `summary`의 분포와 경고
- `docs/ADR.md`의 ADR-034 — 보고서 머리말에 기준을 한 문단으로 옮길 때 쓴다

## 작업

### 1. `tools/aggregate.mjs`

`verdicts.jsonl`과 `worksheet.jsonl`을 읽어 아래를 계산하고 `audit/report.md`와
`audit/by-topic/<topicId>.md`를 쓴다. 숫자는 **전부 스크립트가 센다** — 손으로 적지 마라.

### 2. `audit/report.md`에 담을 것

1. 전체 판정 수, 누락·중복 여부(문항 id 집합 대조)
2. `keep` · `ambiguous` · `move-recommended` 수와 비율
3. `move-recommended`의 `confidence` high · medium · low
4. `conceptFit` yes · partial · no
5. **현재 topic → 권장 topic별 이동 후보 수**(쌍마다 문항 id)
6. **주제별 문항 수와 이동 후보 비율**(39행 표)
7. 바로 재연결 가능한 이동 후보(`retarget=ready`) 목록
8. 추가 설계가 필요한 후보(`retarget=needs-design`) 목록과 사유(대상 개념 없음 / coverageConflict)
9. `coverageConflict` 전체 수와 목록
10. `move-recommended` + `conceptFit=yes` 사례와 이유
11. `keep` + `conceptFit=no` 사례와 이유
12. **`ambiguous` 전체 목록과 핵심 쟁점**(각 문항의 두 해석을 한 줄씩)
13. step별 분포표(각 step의 `summary`에서 옮긴다)와 급변 경고가 있었다면 그 내용
14. `q364`의 최종 판정과 근거

### 3. `audit/by-topic/<topicId>.md`

주제 하나가 파일 하나다. 그 주제의 문항을 표로 싣는다 — id, 현재 개념, `verdict`,
`confidence`, `conceptFit`, 권장 topic·concept, `coverageConflict`, `decidingKnowledge`.
주제 머리에 그 주제의 판정 분포와 이동 후보 비율을 적는다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node phases/35-question-topic-audit/tools/aggregate.mjs
node phases/35-question-topic-audit/tools/validate-verdicts.mjs --expect 732 --complete
test -f phases/35-question-topic-audit/audit/report.md
test "$(ls phases/35-question-topic-audit/audit/by-topic/ | wc -l | tr -d ' ')" = 39
node -e "const f=require('fs');const before=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8');const n=before.trim().split('\n').length;if(n!==732)throw new Error('판정 줄 수가 바뀌었다: '+n);console.log('판정 732줄 그대로')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('제품 데이터가 바뀌었다: '+p)}console.log('제품 데이터 4종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 보고서를 읽어 본다:
   - 숫자가 서로 맞는가(합계 = 732, 주제별 합 = 전체)?
   - `ambiguous` 항목마다 쟁점이 한 줄로 적혀 있는가?
   - 판정 파일이 바뀌지 않았는가?
3. `index.json`의 step 13을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 최종 집계 핵심 수치를 한 줄로
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- `verdicts.jsonl`을 고치지 마라. 이 단계는 집계다. 판정을 고쳐야 할 것이 보이면 `report.md`에 적고
  `summary`에도 남긴다.
- 숫자를 손으로 적지 마라. 스크립트가 센 값만 싣는다.
- 문항을 재배정하거나 데이터를 고치지 마라. 실제 이동은 다음 phase이고 아직 승인되지 않았다.
- 저장소 안에 임시 파일을 만들지 마라. 기존 테스트를 깨뜨리지 마라.
