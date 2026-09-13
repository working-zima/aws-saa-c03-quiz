# Step 0: audit-criteria-docs

**문항의 primary topic을 무엇으로 정하는지 ADR-034로 못박는다.** 이 phase는 조사만 하고 문항을
옮기지 않는다. 판정 기준을 먼저 문서에 두는 이유는, 하네스가 `docs/*.md`를 매 step 프롬프트에
주입하므로 뒤 step들이 같은 기준을 읽어야 하기 때문이다.

**이 step에서 바꾸는 파일은 `docs/ADR.md` 하나다.** 데이터·테스트·코드는 한 글자도 바꾸지 않는다.

## 이 phase의 범위 — 조사와 보고뿐이다

사용자가 정한 것을 그대로 옮긴다.

> 이번 phase에서는 문항을 실제로 이동하지 않는다. 먼저 732개 전체 문항의 현재 topic 배정이 학습
> 목표와 맞는지만 조사한다. 이번 phase는 audit/report only다.

**바꾸지 않는 것**: `src/data/questions.json` · `src/data/topics.json` · `src/data/data.test.ts` ·
`scripts/topics-baseline.json`. 문항 이동·topic 변경·conceptId 변경·prompt/choices/explanation/
answerIndex 수정·개념 콘텐츠 수정·문항 추가/삭제 전부 금지다. `scripts/`의 공용 스크립트도
고치지 않는다.

**이 phase 전체에서 바뀌어도 되는 것**은 아래뿐이다.

- ADR-034 신설 (`docs/ADR.md`) — 이 step
- `phases/35-question-topic-audit/` 아래의 도구·산출물 — step 1 이후

## 읽어야 할 파일

- `docs/ADR.md` — ADR-023(주제 경계), ADR-026(문제 은행 크기와 커버리지), ADR-016(확인 문제의 개념
  펼치기), ADR-033(개념 배열). 새 ADR은 파일 **끝**에 붙인다. 제목 형식은 기존 ADR을 따른다.
- `docs/ARCHITECTURE.md` — 「데이터 모델」의 `Question` 타입(`topicId`·`conceptId`)
- `src/data/questions.json` 한두 문항 — 필드 구성을 눈으로 확인하는 용도

## 작업

`docs/ADR.md` 끝에 아래 텍스트를 **그대로** 붙인다. 줄바꿈 위치까지 옮긴다. 문장을 다듬거나
요약하지 마라 — 사용자가 정한 원칙이다.

```markdown
### ADR-034: 문항의 primary topic은 정답을 가르는 지식으로 정한다 (ADR-023 「주제 경계」 보완)
**결정**: 문항이 어느 주제에 속하는지는 **정답을 오답과 구분하게 만드는 결정적 지식**으로 정한다.
시나리오에 등장하는 서비스 이름은 기준이 아니다. 문항마다 셋을 구분한다.

- **scenario service** — 상황에 등장하는 서비스. 여럿일 수 있고, 이것이 주제를 정하지 않는다.
- **primary concept** — 결정적 지식을 설명하는 개념. 이 개념이 속한 주제가 그 문항의 primary topic이다.
- **secondary concept** — 정답 구성에 함께 쓰이지만 정답을 가르지 않는 지식. 기록만 하고 주제를
  정하지 않는다.

판정은 이 순서로 한다.

1. 결정적 지식을 한 문장으로 쓴다 — "이것을 모르면 정답을 고를 수 없다".
2. 시나리오 서비스를 같은 계열의 다른 서비스로 바꿔 본다. 정답 논리가 그대로면 그 서비스는
   주인공이 아니다.
3. 오답 셋이 무엇을 오해한 것인지 본다. 오답이 A의 기능을 오해한 것이면 결정적 지식은 A 쪽이다.
4. 여러 서비스가 조합되면 정답 선택을 결정하는 지식을 primary로 잡고 나머지는 secondary로 남긴다.
5. 1~4가 한 곳을 가리키지 않으면 **ambiguous로 남긴다.** 억지로 재배정하지 않는다.

**정합성과 커버리지는 의미 판정과 분리한다**: `topicId`가 `conceptId`의 주제와 같은지, 개념마다
문항이 최소 하나 남는지(ADR-026)는 **구현 제약**이지 의미 판정의 근거가 아니다. 이동이 맞다는
판정을 "그 개념의 유일한 문항이라 커버리지가 깨진다"는 이유로 뒤집지 않는다. 제약은 판정 뒤에
따로 기록하고, 실제 재배정 phase에서 대체 문항이나 개념 재연결로 푼다.

**재배정은 `topicId`와 `conceptId`를 함께 옮기는 일이다**: 확인 문제 화면의 개념 펼치기는
`question.topicId`가 가리키는 **주제의 개념 전체**를 펼친다(ADR-016). `topicId`만 바꾸면 근거
개념이 그 주제에 없어 학습자가 볼 수 없고, 두 값의 방향도 어긋난다. 그래서 이동 후보에는 대상
주제 안의 `recommendedConceptId`가 함께 있어야 하고, 없으면 그것이 곧 "추가 설계가 필요하다"는 뜻이다.

**이유 — 이 앱에서 개념을 만나는 경로가 문항이다**: ADR-026이 적은 대로 주 학습 경로는 "확인 문제를
풀고 틀린 것만 개념으로 되짚는다"이다. 문항이 시나리오의 주인공 서비스를 따라 배치되면, 학습자는 그
주제를 공부하면서 정작 정답을 가른 지식은 다른 주제에서 배우게 된다. 주제는 서비스 경계로 잘려
있으므로(ADR-023) 그 경계와 문항이 시험하는 지식이 어긋나면 주제 하나를 다 풀어도 그 주제의 지식이
덮이지 않는다.

**범위 — 이 ADR은 기준만 정한다**: 개별 문항의 판정 결과와 집계 수치는 ADR에 넣지 않고
`phases/35-question-topic-audit/audit/`에 둔다. 실제 재배정은 별도 phase에서 하며, 그때
`src/data/data.test.ts`의 구간별 단언(q117~q169의 `expectedTopics`, q247~q732의 topicId-conceptId
대조, 주제별 개념 일대일 단언)도 함께 고쳐야 한다.
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
test "$(grep -c '^### ADR-034: ' docs/ADR.md)" = 1
grep -qF '**scenario service** — 상황에 등장하는 서비스' docs/ADR.md
grep -qF '억지로 재배정하지 않는다' docs/ADR.md
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('제품 데이터가 바뀌었다: '+p)}console.log('제품 데이터 4종 그대로')"
```

마지막 줄이 이 phase의 핵심 불변 조건이다 — 데이터·테스트 파일이 한 바이트도 바뀌지 않았음을 본다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ADR-034가 파일 끝에 한 번만 있고, 위 텍스트와 글자가 같은가?
   - 다른 ADR의 번호나 내용이 그대로인가?
   - `src/`·`scripts/`·`phases/` 다른 파일이 그대로인가?
3. 결과에 따라 `phases/35-question-topic-audit/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 ADR-034 신설과 AC 결과를 한 줄로
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- `src/`·`scripts/`를 건드리지 마라. 이유: 이 phase는 조사만 한다. 제품 데이터와 테스트는 한 바이트도
  바뀌면 안 된다.
- ADR 본문을 다듬거나 요약하지 마라. 이유: 사용자가 정한 판정 원칙이고, 뒤 step들이 이 문장을 기준으로
  732문항을 판정한다. 틀린 곳을 발견하면 고치지 말고 `summary`에 적어라.
- 개별 문항 판정이나 수치를 ADR에 넣지 마라. 이유: ADR은 원칙만 담고 결과는 audit 산출물에 둔다.
- 다른 ADR을 고치거나 ADR 번호를 바꾸지 마라. ADR-034가 다음 빈 번호다.
- 저장소 안에 임시 파일을 만들지 마라. 이유: 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
