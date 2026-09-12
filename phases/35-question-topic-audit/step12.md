# Step 12: consistency-pass

**732건 판정이 서로 같은 기준으로 내려졌는지 교차 검사하고, 어긋난 판정만 정리한다.**
문항은 여전히 건드리지 않는다 — `verdict`·`confidence`·`conceptFit`·`recommendedTopic`·
`recommendedConceptId`·`secondaryTopics`·`rationale`만 고칠 수 있다.

**이 step에서 바꾸는 파일은 `audit/verdicts.jsonl` 하나다**(필요하면 `tools/`의 검사기도).
데이터·테스트·제품 코드는 한 글자도 바꾸지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-034** — 판정 원칙
- `phases/35-question-topic-audit/step2.md` — 표본 40건이 세운 기준 사례와 재검토 신호
- `phases/35-question-topic-audit/audit/verdicts.jsonl` — 732줄 전부
- `phases/35-question-topic-audit/audit/worksheet.jsonl` — 문항 전문
- `phases/35-question-topic-audit/index.json` — 각 step의 `summary`에 적힌 분포

## 작업 — 아래 축으로 교차 비교한다

묶음(step)이 달라서 생긴 기준 차이를 찾는 것이 목적이다. 축마다 판정을 모아 놓고 **같은 논리가 같은
결론을 내렸는지** 본다.

1. **같은 `conceptId`에 연결된 문항끼리** — 한 개념에 여러 문항이 붙은 자리(192문항)에서 한쪽은
   `keep`, 다른 쪽은 `move-recommended`가 나왔다면 이유가 문항 차이인지 기준 흔들림인지 가른다.
2. **같은 AWS 패턴인데 scenario service만 다른 문항** — 예: 상태 변화 → 알림, 로그 → 분석, 계정 간
   접근. 한쪽만 이동 권고가 붙었다면 결정 지식이 실제로 다른지 확인한다.
3. **비교 개념에 연결된 문항** — 비교 축 자체가 결정 지식이면 `keep`이다(`q355` 사례).
4. **권한·IAM이 끼는 문항** · 5. **비용이 조건인 문항** · 6. **알림(EventBridge·SNS·CloudWatch)** ·
   7. **계정 간 접근** — 그 서비스가 **등장**했다는 이유로 해당 주제로 끌려간 판정이 없는지 본다.
8. **부정형("A가 하지 않는 일")** — 결정 지식이 두 서비스의 경계일 때 어느 쪽 주제로 갔는지 일관적인가.
9. **`move-recommended` + `conceptFit=yes`** · 10. **`keep` + `conceptFit=no`** — `rationale`이 그
   조합을 실제로 설명하는지 읽는다. 설명이 부실하면 판정을 다시 보거나 `rationale`을 고친다.
11. **`coverageConflict`** — 계산이 맞는지(검사기가 다시 계산한다), 그리고 그것 때문에 판정이 흔들린
    자리가 없는지 본다. 커버리지는 판정의 근거가 아니다.

## 고칠 때의 규칙

- **분포를 맞추려고 고치지 마라.** 기준이 어긋난 자리만 고친다.
- 고친 문항은 `rationale`에 **무엇이 바뀌었고 왜인지**를 남긴다.
- 문항 전문·개념·주제 데이터는 건드리지 않는다. 판정 필드만 고친다.
- 줄 수는 732줄 그대로다. 문항을 지우거나 더하지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node -e "const f=require('fs');const n=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').length;if(n!==732)throw new Error('줄 수가 '+n+'이다 — 732여야 한다');console.log('판정 732줄')"
node phases/35-question-topic-audit/tools/validate-verdicts.mjs --expect 732 --complete
node -e "const f=require('fs');const rows=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const bad=rows.filter((r)=>r.secondaryTopics.length>2).map((r)=>r.id);if(bad.length)throw new Error('secondaryTopics가 2개를 넘는다: '+bad.join(', '));const flagged=rows.filter((r)=>(r.verdict==='move-recommended'&&r.conceptFit==='yes')||(r.verdict==='keep'&&r.conceptFit==='no'));const thin=flagged.filter((r)=>[...r.rationale.trim()].length<80).map((r)=>r.id);if(thin.length)throw new Error('재검토 신호 조합인데 rationale이 짧다: '+thin.join(', '));console.log('상한·신호 조합 확인 (신호 '+flagged.length+'건)')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('제품 데이터가 바뀌었다: '+p)}console.log('제품 데이터 4종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트:
   - 판정 필드 말고 다른 것이 바뀌지 않았는가?
   - 줄 수와 문항 id 집합이 그대로인가?
3. `index.json`의 step 12를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **바뀐 문항 수와 id, 바뀐 이유의 유형**(축 번호),
     그리고 최종 분포(keep·ambiguous·move, conceptFit, confidence, 신호 조합 수)를 적는다.
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 문항·개념·주제 데이터를 고치지 마라. 이 단계는 판정의 일관성만 본다.
- 분포를 맞추려고 판정을 바꾸지 마라. 이유: audit의 목적은 잘못 배정된 문항만 찾는 것이다.
- 줄을 지우거나 더하지 마라. 732줄 고정이다.
- 검사 규칙을 느슨하게 고쳐 통과시키지 마라.
- 저장소 안에 임시 파일을 만들지 마라. 기존 테스트를 깨뜨리지 마라.
