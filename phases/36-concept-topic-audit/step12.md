# Step 12: consistency-pass

**618건 판정이 서로 같은 기준으로 내려졌는지 교차 검사하고, 어긋난 판정만 정리한다.**
개념은 여전히 건드리지 않는다 — `learningGoal`·`serviceSpecificGoal`·`fit`·`recommendedTopic`·
`confidence`·`duplicateOf`·`blockImpact`·`rationale`만 고칠 수 있다.

**이 step에서 바꾸는 파일은 `audit/verdicts.jsonl` 하나다**(필요하면 `tools/`의 검사기도).
데이터·테스트·제품 코드·phase 35 산출물은 한 글자도 바꾸지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-035** — 판정 원칙. ADR-033(서비스 블록 순서)도 `blockImpact`를 볼 때 쓴다
- `phases/36-concept-topic-audit/step2.md` — 표본 40건이 세운 기준 사례와 재검토 신호
- `phases/36-concept-topic-audit/audit/verdicts.jsonl` — 618줄 전부
- `phases/36-concept-topic-audit/audit/concepts.jsonl` — 개념 전문과 신호
- `phases/36-concept-topic-audit/index.json` — 각 step의 `summary`에 적힌 분포

## 작업 — 아래 축으로 교차 비교한다

묶음(step)이 달라서 생긴 기준 차이를 찾는 것이 목적이다. 축마다 판정을 모아 놓고 **같은 논리가 같은
결론을 내렸는지** 본다.

1. **주제의 첫 개념(소개 개념)끼리** — 주제마다 서비스를 소개하는 자리가 있다. 한쪽은 `keep`,
   비슷한 자리의 다른 쪽은 이동 후보가 됐다면 이유가 개념 차이인지 기준 흔들림인지 가른다.
2. **같은 공통 패턴이 여러 주제에 있는 자리** — EventBridge·SNS·IAM·CloudWatch·비용·Organizations·
   계정 간 접근. "현재 서비스에서 그 기능을 어떻게 쓰는가"와 "공통 패턴 자체"를 **일관된 선으로**
   갈랐는지 본다. 한 주제에서만 끌려간 판정이 있으면 그 자리를 다시 본다.
3. **비교 개념끼리** — 비교 축 자체가 학습 목표면 `keep`이다. 비교 결론이 다른 주제의 서비스라는
   이유로 이동이 붙은 자리가 없는지 본다.
4. **이름이 같거나 `nearDuplicateCandidates` 점수가 높은 쌍** — `duplicateOf`를 한쪽만 적었는지,
   같은 쌍을 서로 다르게 판정했는지 본다. 중복 기록과 주제 적합도는 **다른 축**이다.
5. **`serviceSpecificGoal`의 기준** — 성격이 같은 개념인데 한쪽만 `true`인 자리를 찾아 맞춘다.
   서비스 이름을 썼는지가 아니라 **목표가 그 서비스에 고유한지**가 기준이다.
6. **주제 제목에 들어 있는 서비스의 개념** — 제목에 있다는 이유로 이동을 막았거나, 반대로 제목에
   없다는 이유로 이동을 권한 자리가 없는지 본다.
7. **이동 권고의 방향별 묶음** — 같은 (현재 주제 → 권장 주제) 쌍이 여러 건이면 같은 논리인지 본다.
   한 건만 방향이 다르면 그 한 건을 다시 본다.
8. **`blockImpact`** — ADR-033 규칙(블록마다 기본 → 갈림길 → 세부, 비교는 대상 블록 뒤, 전제가
   최우선)과 맞는지, 대상 주제에 들어갈 자리를 실제로 지목했는지 본다.
9. **재검토 신호 조합** — `move-recommended` + `serviceSpecificGoal=true`,
   `keep` + `duplicateOf` 있음. `rationale`이 그 조합을 실제로 설명하는지 읽는다.
10. **주제별 이동 비율** — 한 주제에서만 이동 권고가 몰려 있으면 그 주제의 판정을 다시 훑는다.
    비율을 맞추려 고치는 것이 아니라, 기준이 흔들린 자리를 찾는 것이다.

## 고칠 때의 규칙

- **분포를 맞추려고 고치지 마라.** 기준이 어긋난 자리만 고친다.
- 고친 개념은 `rationale`에 **무엇이 바뀌었고 왜인지**를 남긴다.
- 개념 본문·주제 데이터·문항은 건드리지 않는다. 판정 필드만 고친다.
- 줄 수는 618줄 그대로다. 개념을 지우거나 더하지 마라.
- `questionCount`·`questionIds`는 계산값이다. 손으로 고치지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node -e "const f=require('fs');const n=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').length;if(n!==618)throw new Error('줄 수가 '+n+'이다 — 618이어야 한다');console.log('판정 618줄')"
node phases/36-concept-topic-audit/tools/validate-verdicts.mjs --expect 618 --complete
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const t=JSON.parse(f.readFileSync('src/data/topics.json','utf8'));const all=t.flatMap((x)=>x.concepts.map((c)=>c.id));if(JSON.stringify(rows.map((r)=>r.conceptId).sort())!==JSON.stringify([...all].sort()))throw new Error('개념 id 집합이 데이터와 다르다');const bad=rows.filter((r)=>r.fit==='move-recommended'&&(!r.blockImpact||[...r.blockImpact.trim()].length<10)).map((r)=>r.conceptId);if(bad.length)throw new Error('이동 권고에 blockImpact가 없다: '+bad.slice(0,5).join(', '));const flagged=rows.filter((r)=>(r.fit==='move-recommended'&&r.serviceSpecificGoal===true)||(r.fit==='keep'&&r.duplicateOf));const thin=flagged.filter((r)=>[...r.rationale.trim()].length<80).map((r)=>r.conceptId);if(thin.length)throw new Error('재검토 신호 조합인데 rationale이 짧다: '+thin.slice(0,5).join(', '));console.log('id 집합·blockImpact·신호 조합 확인 (신호 '+flagged.length+'건)')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
test ! -f phases/36-concept-topic-audit/audit/cross-phase35.jsonl
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트:
   - 판정 필드 말고 다른 것이 바뀌지 않았는가?
   - 줄 수와 개념 id 집합이 그대로인가?
   - phase 35 산출물을 읽거나 고치지 않았는가?
3. `index.json`의 step 12를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **바뀐 개념 수와 id, 바뀐 이유의 유형**(축 번호),
     최종 분포(fit, confidence, `serviceSpecificGoal`, `duplicateOf`, 신호 조합 수)를 적는다.
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 개념·주제·문항 데이터를 고치지 마라. 이 단계는 판정의 일관성만 본다.
- `phases/35-question-topic-audit/`의 파일을 **읽지 마라.** 이유: 교차는 step 13에서만 한다. 이
  단계에서 문항 판정을 보면 개념 판정이 그것을 따라간다.
- 분포를 맞추려고 판정을 바꾸지 마라. 이유: audit의 목적은 잘못 배정된 개념만 찾는 것이다.
- 줄을 지우거나 더하지 마라. 618줄 고정이다.
- 검사 규칙을 느슨하게 고쳐 통과시키지 마라.
- 저장소 안에 임시 파일을 만들지 마라. 기존 테스트를 깨뜨리지 마라.
