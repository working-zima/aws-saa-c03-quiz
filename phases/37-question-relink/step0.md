# Step 0: relink-spec

**문항 16건의 재연결 명세(`relink.json`)와 전용 검증기(`tools/verify-relink.mjs`)를 만들고,
「지금 데이터가 phase 35 감사 결과와 일치하는지」를 먼저 기계로 확인한다.**
이 step은 **제품 데이터를 한 글자도 바꾸지 않는다.** 실제 수정은 step 1이 한다.

## 이 phase의 범위 — 사용자가 정한 것을 그대로 옮긴다

phase 35(문항 topic 감사)와 phase 36(개념 topic 감사)의 결과 중, **조건 없이 실행 가능한
문항 재연결 16건만** 고친다.

- **Type 2A — 같은 주제 안에서 `conceptId`만 바꾼다 (14건)**
  `q037` · `q043` · `q045` · `q046` · `q061` · `q065` · `q068` · `q080` · `q081` · `q086` ·
  `q159` · `q165` · `q344` · `q472`
- **Type 2B — `topicId`와 `conceptId`를 함께 바꾼다 (2건)**
  `q465` · `q508`

**이번 마감에서 제외한다 — 건드리지 마라.**

- `q223` · `q225` — 옮기면 원 개념의 문항이 0개가 되어 ADR-026을 깬다. 별도 설계가 필요하다.
- `q152` · `q153` · `q154` — `waf-shield.cloudfront`에 얽힌 자리다. 개념 id 충돌·`blockImpact`·
  권장 개념 공백이 겹쳐 단순 이동이 되지 않는다.
- `q400` · `q728` — phase 35가 `ambiguous`로 남긴 자리다.
- 개념(concept) 이동 권고 7건 전부 — `cluster-placement-group` · `spread-placement-group` ·
  `elastic-fabric-adapter` · `api-gateway-behind-cloudfront` · `sqs-queue-depth-scaling` ·
  `waf-shield.cloudfront` · `iam-roles-anywhere`.
- `ambiguous` · `medium` · `hold` 후보 전부.

**주제 제목 변경 · 개념 이동 · conceptId 재설계 · 개념 통합 · 새 문항 작성으로 범위를 넓히지 마라.**

## 이 phase 전체에서 바꿔도 되는 파일

| 파일 | 바꾸는 step |
|---|---|
| `phases/37-question-relink/` 아래 전부 | 0 · 1 · 2 |
| `src/data/questions.json`의 `topicId`·`conceptId` (16개 문항의 값만) | 1 |
| `src/data/data.test.ts`의 단언 (step 1이 지정한 네 자리만) | 1 |
| `scripts/topics-baseline.json`의 `questionsSha256` | 1 |

**그 밖의 파일은 전부 잠겨 있다.** 특히 `src/data/topics.json`은 **바이트 단위로 같아야 한다.**
`src/` 아래 제품 코드, `docs/`, `scripts/`의 공용 스크립트, `phases/35-*`·`phases/36-*` 아래
감사 산출물도 전부 그대로 둔다.

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라.

- `docs/ADR.md` — **ADR-026**(개념 하나에 최소 1문항, 커버리지 100%), **ADR-034**(문항의 primary
  topic은 정답을 가르는 지식으로 정한다 / 재배정은 `topicId`와 `conceptId`를 함께 옮기는 일이다),
  **ADR-035**(개념의 topic은 학습 목표로 정한다), ADR-016(확인 문제 화면의 개념 펼치기)
- `docs/ARCHITECTURE.md` — 「데이터 모델」의 `Question`·`Topic`·`Concept` 타입
- `phases/35-question-topic-audit/audit/verdicts.jsonl` — 732줄. 문항 하나가 한 줄이고
  `id`·`topicId`·`conceptId`·`recommendedTopic`·`recommendedConceptId`·`verdict` 필드가 있다.
  **이 파일이 재연결의 근거다.**
- `phases/36-concept-topic-audit/audit/cross-phase35.jsonl` — 38줄. 개념 단위로 phase 35 판정과
  교차한 결과이고 `conceptId`·`type`(`2A`·`2B`·`3`·`hold`)·`questionFindings` 필드가 있다.
  **이 파일이 2A/2B 분류의 근거다.**
- `src/data/questions.json` — 732줄 + 대괄호 2줄. **문항 하나가 정확히 한 줄**이고 줄은
  `{"id":"q001","topicId":"...","conceptId":"...","prompt":...` 로 시작한다.
- `scripts/check-structure.mjs`·`scripts/sync-baseline.mjs` — 구조 가드레일과 스냅샷 갱신 도구

## 작업

### 1. `phases/37-question-relink/relink.json`

**감사 파일과 현재 데이터에서 기계로 만들어라.** 값을 손으로 옮겨 적지 마라 — 위 16개 id만
사람이 정한 범위이고, `from`·`to`는 전부 파일에서 읽어 채운다.

- `from` = `verdicts.jsonl`에서 그 문항의 `topicId`·`conceptId`
- `to` = 같은 줄의 `recommendedTopic`·`recommendedConceptId`
- `type` = `cross-phase35.jsonl`에서 그 문항의 `from.conceptId`를 가진 줄의 `type`

형식은 아래와 같다. `items`는 위에 적힌 16개 id **오름차순**으로 정렬한다.

```json
{
  "phase": "37-question-relink",
  "sources": {
    "questionAudit": "phases/35-question-topic-audit/audit/verdicts.jsonl",
    "crossAudit": "phases/36-concept-topic-audit/audit/cross-phase35.jsonl"
  },
  "baseline": {
    "questionCount": 732,
    "conceptCount": 618,
    "questionsSha256": "<수정 전 src/data/questions.json 원문의 sha256>",
    "topicsSha256": "<src/data/topics.json 원문의 sha256>",
    "contentSha256": "<아래 규칙>",
    "linksOutsideScopeSha256": "<아래 규칙>",
    "auditSha256": {
      "phases/35-question-topic-audit/audit/verdicts.jsonl": "<sha256>",
      "phases/36-concept-topic-audit/audit/verdicts.jsonl": "<sha256>",
      "phases/36-concept-topic-audit/audit/cross-phase35.jsonl": "<sha256>"
    }
  },
  "items": [
    { "id": "q037", "type": "2A",
      "from": { "topicId": "...", "conceptId": "..." },
      "to":   { "topicId": "...", "conceptId": "..." } }
  ]
}
```

**두 다이제스트의 정의 — 이 문장 그대로 구현하라.** 파일 순서를 유지하고, `JSON.stringify`의
기본 출력(공백 없음)을 utf-8로 해시한다.

- `contentSha256` = sha256(`JSON.stringify(questions.map(q => [q.id, q.answerIndex, q.prompt, q.choices, q.explanation]))`)
- `linksOutsideScopeSha256` = sha256(`JSON.stringify(questions.filter(q => 16건에 없음).map(q => [q.id, q.topicId, q.conceptId]))`)

앞의 것은 **문항 본문이 하나도 안 바뀌었음**을, 뒤의 것은 **범위 밖 716개 문항의 연결이 그대로임**을
step 1 이후에 다시 계산해 증명하기 위한 값이다.

### 2. `phases/37-question-relink/tools/verify-relink.mjs`

Node 내장 모듈만 쓰는 ESM 스크립트다. 의존성을 새로 추가하지 마라.

```
node phases/37-question-relink/tools/verify-relink.mjs --pre
node phases/37-question-relink/tools/verify-relink.mjs --post
```

위반을 **전부 모아 출력하고** 하나라도 있으면 exit 1, 없으면 요약 한 줄과 exit 0으로 끝낸다
(`scripts/check-structure.mjs`와 같은 방식이다). 두 모드가 공통으로 보는 것:

1. `items`가 정확히 16개이고 id가 위 목록과 집합으로 같다. 중복 없음.
2. 각 item의 `from`·`to`가 `verdicts.jsonl`의 해당 줄과 값이 같다.
3. 각 item의 `type`이 `cross-phase35.jsonl`의 `from.conceptId` 줄의 `type`과 같고 `2A` 또는 `2B`다.
4. `type`이 `2A`면 `from.topicId === to.topicId`, `2B`면 `from.topicId !== to.topicId`다.
5. `to.conceptId`가 `topics.json`에 실재하고, 그 개념이 속한 주제가 `to.topicId`다.
6. 문항 732개 · 개념 618개.
7. **정합성** — 732개 문항 전부에서 `topicId`가 `conceptId`가 속한 주제와 같다.
8. **ADR-026** — 618개 개념 전부가 문항을 최소 1개 갖는다.
9. `topics.json` 원문 sha256이 `baseline.topicsSha256`과 같다(**바이트 불변**).
10. `baseline.auditSha256`의 세 파일이 전부 그대로다.
11. 본문 다이제스트가 `baseline.contentSha256`과 같다 —
    `prompt`·`choices`·`explanation`·`answerIndex` 변경 0건.
12. 범위 밖 다이제스트가 `baseline.linksOutsideScopeSha256`과 같다 — 716개 문항 연결 불변.
13. `questions.json`이 **문항 한 줄 포맷**을 지킨다 — `{"id":"q` 로 시작하는 줄이 732줄이고,
    각 줄에서 뒤의 쉼표를 뗀 문자열이 `JSON.stringify(JSON.parse(줄))`와 **글자 그대로 같다**.
    (필드 순서·공백·추가 필드가 흘러드는 것을 막는다. 재직렬화로 파일을 다시 쓰면 여기서 걸린다.)

`--pre`가 더 보는 것:

14. 16개 문항의 현재 값이 전부 `from`과 같다.
15. `questions.json` 원문 sha256이 `baseline.questionsSha256`과 같다(아직 안 고쳤다).
16. **되돌릴 수 없는 자리 예고** — 16건을 옮겼다고 가정했을 때 `from.conceptId` 각각에 문항이
    최소 1개 남는다. 하나라도 0이 되면 **위반으로 보고하고 exit 1**한다. 이유: 그런 자리는
    ADR-026을 깨므로 이번 phase의 범위가 아니다.

`--post`가 더 보는 것:

17. 16개 문항의 현재 값이 전부 `to`와 같다.
18. `questions.json` 원문 sha256이 `baseline.questionsSha256`과 **다르다**(실제로 고쳤다).
19. `scripts/topics-baseline.json`의 `questionsSha256`이 현재 `questions.json`의 sha256과 같다.

### 3. `--pre`를 실행해 통과시킨다

이 step의 결론은 **「지금 데이터가 감사 결과와 어긋나지 않는다」**이다. 어긋나면 데이터를 고치지
말고 **`status`를 `blocked`로 두고 멈춰라** — 감사 결과와 데이터가 벌어졌다는 뜻이고, 그것은
이 phase가 혼자 판단할 문제가 아니다.

## Acceptance Criteria

```bash
node phases/37-question-relink/tools/verify-relink.mjs --pre

npm run lint
npm run build
npm test
node scripts/check-structure.mjs

# relink.json 형태
node -e "const s=require('./phases/37-question-relink/relink.json');if(s.items.length!==16)throw new Error('items '+s.items.length);const t=s.items.filter(i=>i.type==='2A').length;if(t!==14)throw new Error('2A '+t);if(s.items.filter(i=>i.type==='2B').length!==2)throw new Error('2B');const ids=s.items.map(i=>i.id);if(new Set(ids).size!==16)throw new Error('dup');if(ids.join(',')!==[...ids].sort().join(','))throw new Error('정렬');console.log('relink.json OK')"

# 제품 데이터 4종이 한 글자도 안 바뀌었다
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4','phases/36-concept-topic-audit/audit/cross-phase35.jsonl':'effc860809f8605f'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 6종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트:
   - 새 의존성을 추가하지 않았는가? (Node 18.17.1 · Node 20+ 요구 패키지 금지)
   - `src/` 아래 제품 코드와 `docs/`를 건드리지 않았는가?
   - 학습 데이터는 여전히 빌드 타임 정적 JSON인가? 런타임 외부 호출을 넣지 않았는가?
3. `phases/37-question-relink/index.json`의 step 0을 갱신한다.
   - 통과 → `"status": "completed"`, `"summary"`에 산출물과 `--pre` 결과를 한 줄로
   - 3회 수정 후에도 실패 → `"status": "error"` + `"error_message"`
   - 감사 결과와 데이터가 어긋남 → `"status": "blocked"` + `"blocked_reason"`에 어긋난 문항 id

## 금지사항

- **`src/data/questions.json`을 고치지 마라.** 이유: 이 step은 명세와 검증기만 만든다. 수정은 step 1이다.
- **`src/data/topics.json`을 고치지 마라.** 이유: 개념 이동은 이번 phase의 범위가 아니고, 이 파일은
  바이트 단위로 같아야 한다.
- **`relink.json`의 값을 손으로 적지 마라.** 이유: 감사 파일과 데이터에서 읽어야 「감사와 일치하는가」를
  검증기가 실제로 검사한다. 손으로 옮기면 검증이 자기 자신을 확인하는 꼴이 된다.
- **16건 목록에 문항을 더하거나 빼지 마라.** 이유: 범위는 사용자가 정했다.
- **검증기를 느슨하게 만들어 통과시키지 마라.** 이유: 통과가 목적이 아니라 어긋남을 찾는 것이 목적이다.
  어긋나면 `blocked`로 멈춘다.
- 기존 테스트를 깨뜨리지 마라.
