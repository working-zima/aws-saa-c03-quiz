# Step 6: concepts-delivery-serverless

**트래픽 분배·엣지와 서버리스·컨테이너 — 주제 4개, 개념 77개를 ADR-035 기준으로 판정한다.** 개념을 옮기지 않는다 —
조사만 한다.

**이 step에서 바꾸는 파일은 `phases/36-concept-topic-audit/audit/verdicts.jsonl` 하나다**(필요하면 `tools/`의
검사기도). 데이터·테스트·제품 코드·phase 35 산출물은 한 글자도 바꾸지 않는다.

## 담당 범위

| 주제 | 제목 | 전체 개념 | 이 step에서 판정할 개념 |
|---|---|---:|---:|
| `elastic-load-balancing` | ALB·NLB·Gateway Load Balancer | 16 | 15 |
| `cloudfront-global-accelerator` | CloudFront·Global Accelerator·엣지 함수 | 24 | 23 |
| `lambda` | Lambda | 18 | 17 |
| `ecs-eks-fargate` | ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk | 23 | 22 |

- 이 주제들의 개념 중 **이미 `verdicts.jsonl`에 있는 4개는 건너뛴다**(step 2의 표본).
  건너뛴 개념을 다시 쓰거나 고치지 마라 — 사용자가 승인한 판정이다.
- 이 step이 끝나면 `verdicts.jsonl`은 **329줄**이어야 한다.
- 담당 주제 밖의 개념은 판정하지 마라. 다른 step이 맡는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-035** — 판정 원칙. **ADR-033**(서비스 블록 순서)은 `blockImpact`를 쓸 때 본다
- `phases/36-concept-topic-audit/step2.md` — 표본 40개가 세운 기준과 재검토 신호, 그리고 미리 결론을 정하지 말라고
  적어 둔 사례들
- `phases/36-concept-topic-audit/audit/verdicts.jsonl` — 표본 40줄. **형식과 판정 수준의 본보기다.** 특히
  `learningGoal`을 어느 정도로 쓰는지, `rationale`에 무엇을 남기는지 먼저 읽어라
- `phases/36-concept-topic-audit/audit/concepts.jsonl` — 개념 전문·`questionCount`·`questionIds`·`blockNeighbors`·신호
- `phases/36-concept-topic-audit/tools/validate-verdicts.mjs` — 검사 규칙(스키마와 계산식)
- `src/data/topics.json` — 권장 주제를 고를 때 대상 주제의 개념 목록

## 판정 절차 — 개념마다 이 순서로

ADR-035와 step 2와 같다. 앞 칸을 채우지 못하면 뒤 칸을 쓰지 마라.

1. **`learningGoal`** — 이 개념을 학습한 뒤 학생이 이해해야 하는 중심 지식을 한 문장으로. 본문 요약이
   아니라 **무엇을 이해해야 하는가**다. 가능하면 서비스 이름 없이 쓰지만, 서비스 고유 기능이라 이름을
   빼면 의미가 흐려지면 이름을 쓴다. 억지로 추상화하지 마라.
2. **`serviceSpecificGoal`** — 1번 문장이 특정 서비스의 고유 기능에 묶여 있으면 `true`. 서비스 이름을
   썼는지가 아니라 **목표가 고유한지**를 본다.
3. **중심 질문** — "이 학습 목표는 현재 주제에 속하는가?" 개념 이름에 어떤 서비스가 들어가는지는
   기준이 아니다. 다른 서비스를 언급한다는 이유만으로 이동 후보로 잡지 마라 — 현재 주제의 서비스를
   이해하는 데 필요한 통합·제약·비교·운영 판단 기준이면 유지다.
4. **`recommendedTopic`** — 다른 주제가 맞으면 그 주제를, 유지면 현재 주제를 적는다.
5. **`fit`** — `keep` · `ambiguous` · `move-recommended`. 한 곳을 가리키지 않으면 **주저 없이
   `ambiguous`**다. `move-recommended`일 때만 `confidence`(`high`·`medium`·`low`)를 쓴다.
6. **`duplicateOf`** — 거의 같은 것을 가르치는 다른 개념이 있으면 그 id(없으면 `null`).
   `signals.nearDuplicateCandidates`는 후보일 뿐이고, 본문을 읽고 판단한다. **중복이라는 판단이 이동
   판정의 근거가 되지는 않는다.**
7. **`blockImpact`** — `move-recommended`일 때만. 대상 주제의 어느 서비스 블록 어디에 들어가는지를
   ADR-033 규칙으로 한 문장. 자리를 지목할 수 없으면 그 사실을 적는다. `keep`은 `null`.
8. **`rationale`** — 한두 문장. `ambiguous`는 두 해석을 모두 적는다(80자 이상).

`questionCount`·`questionIds`는 워크시트 값을 그대로 옮긴다 — 검사기가 `questions.json`에서 다시
계산해 대조한다.

### 빨아들이지 않기

공통 기능(EventBridge·SNS·IAM·CloudWatch·비용·Organizations·계정 간 접근)이 **등장했다는 이유만으로**
그 주제로 옮기지 마라. "현재 서비스에서 그 기능을 어떻게 쓰는가"가 중심이면 유지, "공통 패턴 자체가
학습 목표"면 이동 후보다. 비교 개념은 **비교 축 자체가 학습 목표면 유지**다.

### 재검토 신호 — 두 조합은 rationale에서 설명한다

틀렸다는 뜻이 아니다. 왜 그 조합이 가능한지를 `rationale`에 80자 이상으로 적는다(검사기가 길이를 본다).

- `move-recommended` + `serviceSpecificGoal=true` — 목표가 서비스 고유인데 다른 주제를 권하는 자리.
- `keep` + `duplicateOf`가 있음 — 유지인데 다른 개념과 거의 같은 자리.

### 판정 수를 맞추려 하지 마라

목적은 이동 개념을 많이 찾는 것이 아니라 **학습 목표가 잘못 배정된 개념만** 찾는 것이다. 기준에 맞으면
대부분 `keep`이어도 그대로 받아들인다. 이동 비용(conceptId 변경·문항 동반 이동·테스트 수정)은 판정의
근거가 아니다 — 판정을 먼저 하고 비용은 `blockImpact`에 적는다.

## 신호는 보조다

워크시트의 `signals`는 **읽는 순서를 정하는 보조**일 뿐이다. 신호가 없어도 이동 후보일 수 있고,
있어도 `keep`일 수 있다. 판정은 개념 전문을 읽고 내린다.

## 재실행이면 — 걸린 줄만 고친다

이 step이 맡은 개념이 `audit/verdicts.jsonl`에 이미 들어 있다면(검증에 걸려 다시 도는 경우)
**판정을 새로 만들지 마라.** 검사에 걸린 줄만 고치고 나머지는 그대로 둔다 — 본문을 읽고 내린 판단을
재생성으로 날리지 않기 위해서다. 아직 판정이 없는 개념만 새로 판정한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
test "$(wc -l < phases/36-concept-topic-audit/audit/verdicts.jsonl | tr -d ' ')" = 329
node phases/36-concept-topic-audit/tools/validate-verdicts.mjs --expect 329
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const mine=['elastic-load-balancing','cloudfront-global-accelerator','lambda','ecs-eks-fargate'];const t=JSON.parse(f.readFileSync('src/data/topics.json','utf8'));const want=t.filter((x)=>mine.includes(x.id)).flatMap((x)=>x.concepts.map((c)=>c.id));const got=new Set(rows.map((r)=>r.conceptId));const missing=want.filter((c)=>!got.has(c));if(missing.length)throw new Error('담당 주제의 개념이 빠졌다: '+missing.slice(0,5).join(', '));const out=rows.filter((r)=>r.step===6&&!mine.includes(r.topicId)).map((r)=>r.conceptId);if(out.length)throw new Error('담당 주제 밖을 판정했다: '+out.slice(0,5).join(', '));console.log('담당 주제 4개 · 개념 '+want.length+'개 전부 판정')"
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const bad=rows.filter((r)=>r.fit==='move-recommended'&&(!r.blockImpact||[...r.blockImpact.trim()].length<10)).map((r)=>r.conceptId);if(bad.length)throw new Error('이동 권고에 blockImpact가 없다: '+bad.slice(0,5).join(', '));const amb=rows.filter((r)=>r.fit==='ambiguous'&&[...r.rationale.trim()].length<80).map((r)=>r.conceptId);if(amb.length)throw new Error('ambiguous인데 두 해석이 없다: '+amb.slice(0,5).join(', '));const flagged=rows.filter((r)=>(r.fit==='move-recommended'&&r.serviceSpecificGoal===true)||(r.fit==='keep'&&r.duplicateOf));const thin=flagged.filter((r)=>[...r.rationale.trim()].length<80).map((r)=>r.conceptId);if(thin.length)throw new Error('재검토 신호 조합인데 rationale이 짧다: '+thin.slice(0,5).join(', '));console.log('blockImpact·ambiguous·신호 조합 확인 (신호 '+flagged.length+'건)')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
test ! -f phases/36-concept-topic-audit/audit/cross-phase35.jsonl
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 판정을 다시 훑는다:
   - `learningGoal`이 본문 요약이 아니라 **이해해야 할 것**을 말하는가?
   - 같은 주제 안에서, 그리고 표본 40건과 비교해 기준이 일관적인가?
   - 공통 기능이 등장한 개념을 등장만으로 끌어가지 않았는가?
   - 신호 조합(`move`+고유 목표, `keep`+중복 후보)의 `rationale`이 그 조합을 설명하는가?
3. `phases/36-concept-topic-audit/index.json`의 step 6을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **이 step에서 판정한 개념 수와 분포**를 적는다 —
     `fit`(keep·ambiguous·move-recommended), `confidence` high·medium·low,
     `serviceSpecificGoal` 참·거짓, `duplicateOf` 건수, 신호 조합 건수, 판단이 어려웠던 개념 id.
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 담당 주제 밖의 개념이나 이미 판정된 개념을 건드리지 마라. 이유: 묶음이 겹치면 중복·누락이 생긴다.
- `phases/35-question-topic-audit/`의 파일을 **읽지 마라.** 이유: 개념 판정은 문항 판정과 독립이어야
  하고, 교차는 step 13에서만 한다.
- 판정 수를 맞추려 하지 마라. 이유: audit의 목적은 잘못 배정된 개념만 찾는 것이다.
- 신호로 판정을 정하지 마라. 이유: 신호는 읽는 순서를 정하는 보조다.
- 이동 비용을 이유로 판정을 뒤집지 마라. 이유: ADR-035가 의미 판정과 구현 제약을 분리한다.
- `src/`·`scripts/`를 고치지 마라. 잠긴 파일 5종은 한 바이트도 바뀌면 안 된다.
- 검사 규칙을 느슨하게 고쳐 통과시키지 마라. 검사에 걸리면 판정을 고친다.
- 저장소 안에 임시 파일을 만들지 마라. 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
