# Step 2: verification-report

**step 1이 바꾼 것과 불변 조건을 실측해 `phases/37-question-relink/verification.md`에 남긴다.**
이 step은 **어떤 데이터도 바꾸지 않는다.** 만드는 파일은 그 보고서 하나뿐이다.

## 읽어야 할 파일

- `phases/37-question-relink/step0.md` · `step1.md` — 이 phase의 범위와 수정 내용
- `phases/37-question-relink/relink.json` — 16건의 `from`→`to` 매핑과 수정 전 다이제스트
- `phases/37-question-relink/tools/verify-relink.mjs` — 전용 검증기
- `phases/37-question-relink/index.json` — step 0·1의 `summary`
- `docs/ADR.md` — ADR-026 · ADR-034 · ADR-035

## 작업

`phases/37-question-relink/verification.md`를 쓴다. **모든 수치는 직접 실행해 얻은 값이어야 한다.**
앞 step의 `summary`에 적힌 자기 보고를 옮겨 적지 마라 — 자기 보고를 다시 적는 보고서는 아무것도
확인해 주지 않는다. 명령을 실행하고 그 출력에서 수치를 가져와라.

보고서는 아래 일곱 절로 쓴다.

### 1. 한 줄 요약

무엇을 몇 건 고쳤고, 무엇이 바뀌지 않았는지.

### 2. 16건 before → after

표로 적는다. 열은 `문항` · `type` · `before topicId` · `before conceptId` · `after topicId` ·
`after conceptId`. 값은 `relink.json`과 현재 `src/data/questions.json`에서 읽어 **둘이 일치함을
확인한 뒤** 적는다.

### 3. 불변 조건 실측

표로 적는다. 열은 `조건` · `실측` · `확인 방법(명령)`. 아래를 전부 넣는다.

| 조건 | 어떻게 재는가 |
|---|---|
| 문항 총 732개 | `questions.json` 길이 |
| 개념 총 618개 | `topics.json`의 개념 수 |
| 모든 개념에 문항 최소 1개 | `node scripts/coverage.mjs`의 전체 줄 |
| `topicId` == `conceptId`의 주제 | 732건 전수 대조 |
| `answerIndex` 변경 0 | `relink.json.baseline.contentSha256` 재계산 일치 |
| `prompt`·`choices`·`explanation` 변경 0 | 같은 다이제스트 |
| 범위 밖 716개 문항의 연결 불변 | `linksOutsideScopeSha256` 재계산 일치 |
| 개념 내용 변경 0 / `topics.json` 바이트 불변 | `topics.json` 원문 sha256 |
| phase 35·36 감사 산출물 변경 0 | 세 파일의 sha256 |
| `topics-baseline.json`의 `questionsSha256` 갱신 | 현재 `questions.json` 해시와 일치 |

### 4. 원 개념에 남은 문항 수

16건이 빠져나간 `from.conceptId` 각각에 **문항이 몇 개 남았는지** 실측해 표로 적는다.
0이 된 개념은 없어야 한다(ADR-026). 어느 문항이 남았는지 id도 함께 적는다.

### 5. 검증 명령과 결과

아래를 순서대로 실행하고, 각 명령의 **마지막 결과 줄**을 인용한다.

```bash
node phases/37-question-relink/tools/verify-relink.mjs --post
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node scripts/coverage.mjs
```

### 6. 이번 마감에서 제외한 것

무엇을 왜 뺐는지 적는다. `q223`·`q225`(옮기면 원 개념이 0문항이 되어 ADR-026을 깬다) ·
`q152`·`q153`·`q154`(`waf-shield.cloudfront`에 얽힌 자리) · `q400`·`q728`(phase 35가
`ambiguous`로 남김) · 개념 이동 권고 7건 전부 · `ambiguous`/`medium`/`hold` 후보 전부.
**전부 backlog로 남았고 이번 phase에서 판단하지 않았다**는 것을 명시한다.

### 7. 아직 하지 않은 것

`push` · `develop` 병합 · `main` 릴리스를 하지 않았다는 것을 적는다. 사람이 판단할 일이다.

## Acceptance Criteria

```bash
test -f phases/37-question-relink/verification.md

node phases/37-question-relink/tools/verify-relink.mjs --post

npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node scripts/coverage.mjs

# 이 step은 데이터·테스트·스크립트를 바꾸지 않는다
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'6b59d6992fdba56d','src/data/topics.json':'5a227aea172ca391','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4','phases/36-concept-topic-audit/audit/verdicts.jsonl':'7b3c6f3054b69783','phases/36-concept-topic-audit/audit/cross-phase35.jsonl':'effc860809f8605f'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"

# 보고서에 16개 문항 id가 전부 나온다
node -e "const f=require('fs');const t=f.readFileSync('phases/37-question-relink/verification.md','utf8');const ids=require('./phases/37-question-relink/relink.json').items.map(i=>i.id);const miss=ids.filter(i=>!t.includes(i));if(miss.length)throw new Error('보고서에 없는 문항: '+miss.join(','));console.log('보고서에 16건 전부 있다')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 보고서의 수치가 **직접 실행한 출력에서 온 값**인지 스스로 확인한다. 앞 step의 `summary`를
   옮겨 적은 자리가 있으면 실행해서 다시 채운다.
3. `phases/37-question-relink/index.json`의 step 2를 갱신한다.
   - 통과 → `"status": "completed"`, `"summary"`에 보고서 경로와 핵심 수치를 한 줄로
   - 3회 수정 후에도 실패 → `"status": "error"` + `"error_message"`

## 금지사항

- **`src/` 아래 무엇도 바꾸지 마라.** 이유: 이 step은 이미 끝난 수정을 확인만 한다.
- **`scripts/`를 바꾸지 마라.** 이유: 같다.
- **`relink.json`과 `tools/verify-relink.mjs`를 바꾸지 마라.** 이유: 검증 대상이 검증기를 고치면
  검증이 성립하지 않는다. 검증기가 틀렸다고 판단되면 고치지 말고 `error`로 보고하라.
- **실행하지 않은 수치를 적지 마라.** 이유: 보고서의 값어치는 실측에서만 나온다.
- **`push`·병합·릴리스를 하지 마라.** 이유: 사람이 판단한다.
- 기존 테스트를 깨뜨리지 마라.
