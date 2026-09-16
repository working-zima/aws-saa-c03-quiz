# Step 0: audit-criteria-docs

**개념(concept)이 어느 주제에 속하는지 무엇으로 정하는지를 ADR-035로 못박는다.** 이 phase는 조사만
하고 개념을 옮기지 않는다. 판정 기준을 먼저 문서에 두는 이유는, 하네스가 `docs/*.md`를 매 step
프롬프트에 주입하므로 뒤 step들이 같은 기준을 읽어야 하기 때문이다.

**이 step에서 바꾸는 파일은 `docs/ADR.md` 하나다.** 데이터·테스트·코드는 한 글자도 바꾸지 않는다.

## 이 phase의 범위 — 조사와 보고뿐이다

사용자가 정한 것을 그대로 옮긴다.

> 이번 phase에서는 개념을 실제로 옮기지 않는다. 618개 concept 전부가 현재 topic에 속하는 것이 학습
> 구조상 적절한지만 독립적으로 조사한다. 이번 phase는 audit only다.

**바꾸지 않는 것**: `src/data/questions.json` · `src/data/topics.json` · `src/data/data.test.ts` ·
`scripts/topics-baseline.json` · `phases/35-question-topic-audit/` 아래 전부 · `scripts/`의 공용
스크립트 · `src/` 전체. 개념 이동·conceptId 변경·개념 내용 수정·개념 추가/삭제·문항 재배정·
phase 34가 잡은 개념 순서 변경 전부 금지다.

**이 phase 전체에서 바뀌어도 되는 것**은 아래뿐이다.

- ADR-035 신설 (`docs/ADR.md`) — 이 step
- `phases/36-concept-topic-audit/` 아래의 도구·산출물 — step 1 이후

## 읽어야 할 파일

- `docs/ADR.md` — ADR-023(주제를 서비스 경계로 자른 결정), ADR-026(개념당 최소 1문항과 커버리지),
  ADR-016(확인 문제의 개념 펼치기), ADR-033(개념 배열을 서비스 블록 단위로 잡는다),
  ADR-034(문항의 primary topic은 정답을 가르는 지식으로 정한다). 새 ADR은 파일 **끝**에 붙인다.
  제목 형식은 기존 ADR을 따른다.
- `docs/ARCHITECTURE.md` — 「데이터 모델」의 `Topic`·`Concept` 타입
- `src/data/topics.json`의 개념 한두 개 — 필드 구성(`id`·`name`·`summary`·`paragraphs`)을 눈으로
  확인하는 용도

## 작업

`docs/ADR.md` 끝에 아래 텍스트를 **그대로** 붙인다. 줄바꿈 위치까지 옮긴다. 문장을 다듬거나
요약하지 마라 — 사용자가 정한 원칙이다.

```markdown
### ADR-035: 개념의 topic은 그 개념의 학습 목표로 정한다 (ADR-023 「주제 경계」 보완 / ADR-034와 같은 축)
**결정**: 개념이 어느 주제에 속하는지는 **그 개념을 학습한 뒤 학생이 이해해야 하는 중심 학습
목표**로 정한다. 개념 이름에 어떤 서비스가 들어가는지, 본문이 어떤 서비스를 언급하는지는 기준이
아니다. 개념마다 학습 목표를 한 문장으로 쓰고(`learningGoal`), 그 목표가 현재 주제의 경계 안에
있는지를 본다.

**`learningGoal`을 쓰는 규칙**: 가능하면 서비스 이름 없이 중심 학습 목표를 표현한다. 다만 서비스
고유 기능이라 이름을 빼면 의미가 흐려지는 개념에서는 서비스 이름을 쓴다 — 억지로 이름을 지워
추상적인 문장으로 만들지 않는다. **서비스 이름 없이 쓰기 어렵다는 사실 자체가 판정 신호다**
(`serviceSpecificGoal`). 목적은 이름을 없애는 것이 아니라 개념의 중심 학습 목표를 본문에서 떼어
내어 따로 보는 것이다.

**다른 서비스를 언급한다는 이유만으로 이동 후보로 잡지 않는다**: 현재 주제의 서비스를 이해하는 데
필요한 통합·제약·비교·운영 판단 기준이면 그 개념은 현재 주제에 남는다. 옮기는 것은 **중심 학습
목표 자체가 다른 주제의 것**일 때다.

**비교 개념** — 둘 이상의 서비스를 가르는 개념은 **비교의 축 자체가 학습 목표**라면 특정 서비스
이름이 여러 번 나오거나 비교의 결론이 한쪽 서비스여도 현재 주제를 유지한다. ADR-034가 문항 쪽에서
세운 기준과 같은 원칙이다.

**공통 기능** — EventBridge·SNS·IAM·CloudWatch·비용·Organizations·계정 간 접근처럼 여러 주제를
가로지르는 기능은 등장만으로 자기 주제로 끌어가지 않는다. **"현재 서비스에서 이 기능을 어떻게
이용하는가"가 중심이면 현재 주제를 유지**하고, **"공통 패턴 자체가 중심 학습 목표"이면 공통 주제로
옮길 후보**다.

**판정은 `keep` · `ambiguous` · `move-recommended` 셋이다**: 한 곳을 가리키지 않으면 `ambiguous`로
남긴다. **특정 분포를 목표로 하지 않는다** — 대부분 `keep`이어도 그대로 받아들인다. 애매한 개념을
억지로 한쪽으로 밀지 않는다. `confidence`(high·medium·low)는 `move-recommended`일 때만 적는다.

**중복·병합 가능성은 판정과 분리해 기록한다**: 거의 같은 내용이 다른 주제에 흩어져 있으면
`duplicateOf`에 상대 개념을 적되, 그것이 이동 판정의 근거가 되지는 않는다. 병합은 내용을 고치는
일이라 이 audit의 범위 밖이다.

**이동의 구현 비용은 판정 뒤에 적는다**: 개념 id는 `<topicId>.<slug>` 형식이라(618개 전부) 개념을
옮기는 일은 배열 이동이 아니다. 실제 이동은 conceptId·`topics.json`의 원 주제와 대상 주제 배치·
연결된 문항의 `conceptId`·필요하면 문항의 `topicId`·`src/data/data.test.ts`·
`scripts/topics-baseline.json`·ADR-033이 정한 대상 주제의 서비스 블록 안 삽입 위치를 함께 바꾸는
일이다. 이 비용 때문에 의미 판정을 뒤집지 않는다 — 제약은 판정 뒤에 `blockImpact`로 기록하고,
실제 재배정 phase가 푼다.

**문항 판정과 독립으로 먼저 판단한다**: 개념 판정은 ADR-034가 만든 문항 판정 결과를 입력으로 쓰지
않는다. 개념을 먼저 독립적으로 판정한 뒤 교차해 네 경우로 나눈다 — ① 개념·문항 둘 다 맞음
② 개념은 맞고 문항 연결이 잘못됨 ③ 문항은 맞고 개념의 주제가 잘못됨 ④ 둘 다 재배정 필요. 이
분류가 실제 수정 phase의 입력이다. 양쪽이 애매하거나 권장이 서로 어긋나는 자리는 네 경우에 억지로
넣지 않고 보류로 남긴다.

**범위 — 이 ADR은 기준만 정한다**: 개별 개념의 판정 결과와 집계 수치는 ADR에 넣지 않고
`phases/36-concept-topic-audit/audit/`에 둔다. 실제 재배정은 별도 phase에서 한다. 이 audit이 **현재
버전의 마지막 구조 전수 조사**다 — 이후에는 새 전수 검사를 추가하지 않고, 확신이 높은 구조 오류와
출시를 막는 문제만 고친 뒤 마감한다.
```

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
test "$(grep -c '^### ADR-035: ' docs/ADR.md)" = 1
grep -qF '**결정**: 개념이 어느 주제에 속하는지는' docs/ADR.md
grep -qF '서비스 이름 없이 쓰기 어렵다는 사실 자체가 판정 신호다' docs/ADR.md
grep -qF '특정 분포를 목표로 하지 않는다' docs/ADR.md
grep -qF '개념 판정은 ADR-034가 만든 문항 판정 결과를 입력으로 쓰지' docs/ADR.md
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
```

마지막 줄이 이 phase의 핵심 불변 조건이다 — 제품 데이터 4종과 **phase 35의 판정 산출물**이 한
바이트도 바뀌지 않았음을 본다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ADR-035가 파일 끝에 한 번만 있고, 위 텍스트와 글자가 같은가?
   - 다른 ADR의 번호나 내용이 그대로인가?
   - `src/`·`scripts/`·`phases/35-question-topic-audit/`이 그대로인가?
3. 결과에 따라 `phases/36-concept-topic-audit/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 ADR-035 신설과 AC 결과를 한 줄로
   - 3회 수정 시도 후에도 실패 → `"status": "error"`, `"error_message"`에 구체적 에러
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- `src/`·`scripts/`를 건드리지 마라. 이유: 이 phase는 조사만 한다. 제품 데이터와 테스트는 한 바이트도
  바뀌면 안 된다.
- `phases/35-question-topic-audit/`의 파일을 **읽지도 고치지도 마라.** 이유: 개념 판정은 문항 판정과
  독립이어야 한다. 두 결과의 교차는 step 13에서만 한다. 먼저 보면 그 판정에 끌려간다.
- ADR 본문을 다듬거나 요약하지 마라. 이유: 사용자가 정한 판정 원칙이고, 뒤 step들이 이 문장을 기준으로
  618개 개념을 판정한다. 틀린 곳을 발견하면 고치지 말고 `summary`에 적어라.
- 개별 개념의 판정이나 수치를 ADR에 넣지 마라. 이유: ADR은 원칙만 담고 결과는 audit 산출물에 둔다.
- 다른 ADR을 고치거나 ADR 번호를 바꾸지 마라. ADR-035가 다음 빈 번호다.
- 저장소 안에 임시 파일을 만들지 마라. 이유: 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
