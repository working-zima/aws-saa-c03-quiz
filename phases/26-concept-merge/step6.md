# Step 6: merge-rds — RDS

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/CLAUDE.md` — 특히 "아키텍처 규칙"과 "원본 데이터" 절
- `/docs/PRD.md` — "사용자"·"목표" 절. 개념을 다듬을 때의 기준이다.
- `/docs/ARCHITECTURE.md` — "데이터 모델", "주제 간 이동", "테스트 경계"
- `/docs/ADR.md` — ADR-019·ADR-022(카테고리 한 줄. 카테고리는 15종이다), ADR-021(덤프 해설의 지위), ADR-009(전사 금지)
- `/docs/source/dump-gaps/topic-plan.md` — **step 0이 정한 주제 골격. 이 step의 설계도다.**
- `/docs/source/service-categories.md` — 카테고리 한 줄의 유일한 근거. "phase 26에서 들어오는 서비스" 절을 봐라.
- `/src/types/content.ts` — `Topic`·`Concept` 타입
- `/src/data/topics.json` · `/src/data/questions.json` — 고칠 대상
- `/src/data/data.test.ts` — 이 데이터를 강제하는 테스트

## 담당 범위

이 step은 `rds-storage-features` 주제 를 맡는다.

| 대상 | 기존 개념 | 신규 개념 |
|---|---|---|
| `rds-storage-features` | 7 | 14 |

정확한 수와 주제 경계는 `topic-plan.md`가 정한 것을 따른다. 위 표는 규모를 알려주는 값이다.

담당 개념의 본문은 step 0이 만든 스크립트로 모은다.

```bash
python3 scripts/collect-gaps.py rds-storage-features
```

## 헷갈리는 짝 — 이 step에서 특히 지킬 것

**RDS ↔ Aurora는 한 주제이거나 배열에서 인접해야 한다.** Aurora는 step 7이 맡으므로 두 step의 주제가 붙어 있어야 한다. Multi-AZ ↔ 읽기 전용 복제본의 목적 차이는 `data.test.ts`가 이미 강제하고 있다.

이 규칙의 근거는 PRD의 사용자상이다. "AWS 서비스 이름은 들어봤지만 **언제 무엇을 쓰는지**가
정리되지 않은" 사람이 이 앱을 쓴다. 서로 구분해야 하는 서비스를 다른 주제로 떼어 놓으면
앱의 존재 이유가 깨진다.

## 작업

`topic-plan.md`가 이 step에 배정한 주제들을 `src/data/topics.json`에 실제로 만든다.
순서대로 한다.

### 1. 주제를 만든다

`topic-plan.md`가 정한 `topicId`·`title`·`importance`·`sourcePages`로 주제를 만들고,
**배열에서 정해진 자리에 놓는다.** 배열 순서가 학습 순서이고 `adjacentTopics`가 쓰는 값이다.

### 2. 기존 개념을 옮긴다

담당 범위의 기존 주제에 있던 개념을 새 주제로 옮긴다.

- **개념 본문(`name`·`summary`·`paragraphs`)을 고치지 마라.** 옮기기만 한다.
  이유: 기존 182개는 이미 검수를 거쳤고, 이 phase는 그것을 재배치할 뿐이다.
- **`id`는 바뀐다.** 개념 id는 예외 없이 `{topicId}.{slug}` 형식이다.
  주제가 바뀌면 접두사가 바뀌고 `slug`는 그대로다.

### 3. 새 개념을 변환해 넣는다

`dump-gaps/`의 항목을 `Concept`으로 옮긴다.

| dump-gaps | topics.json |
|---|---|
| ``### `{slug}` — 이름`` | `id: "{topicId}.{slug}"`, `name: "이름"` |
| `**한 줄**: ...` | `summary` |
| 본문 문단 | `paragraphs[]` — 문단 단위 평문 |
| `> [Q123 p456] "인용"` | **버린다** |
| "기존 20개 주제에 자리가 없다" 같은 배치 메모 | **버린다** |

- **인용 줄을 앱에 넣지 마라.** 근거 추적은 `dump-gaps/*.md`가 계속 맡는다.
  덤프 원문을 `src/`로 옮기면 ADR-009의 전사 금지를 어긴다.
- **문항 풀이 어조를 개념 서술로 다듬어라.** dump-gaps 항목에는 "~가 요구면 이 서비스다",
  "이 자리에서는 오답이다" 같은 문장이 있다. 그 문항을 모르는 사람이 읽는 글이므로
  **그 서비스가 무엇이고 무엇과 갈리는지**를 말하는 문장으로 고친다.
  사실을 빼거나 더하지 마라 — 어조만 바꾼다.
- **없는 사실을 보태지 마라.** 네가 아는 AWS 지식으로 본문을 보강하지 마라.
  출처는 `dump-gaps/`뿐이다(ADR-021·ADR-006).
- **서비스 개념에는 카테고리 한 줄을 붙인다.** `paragraphs[0]` 맨 앞에
  `{주어}는 AWS 분류로는 {카테고리} 쪽 서비스다.` 를 넣는다(ADR-019).
  주어와 카테고리는 `service-categories.md`에서 **그대로 가져온다.** 지어내지 마라.
  그 파일의 `카테고리 없음` 절에 있는 서비스는 붙이지 않는다.
  한계값·갈림길 개념처럼 서비스 소개가 아닌 것에는 붙이지 않는다.

### 4. 주제 안의 개념 순서를 3단으로 잡는다

```
1단 [기본]   이 서비스는 무엇이고 무엇에 쓰는가
2단 [갈림길] 비슷한 것들 중 언제 이것을 고르는가
3단 [한계]   한계값·설정 항목·주의점
```

기존 182개는 대체로 1단이고, 새 436개는 대체로 2·3단이다.
Lambda가 무엇인지 모르는 사람에게 `lambda-layer-size-limit`은 아무것도 주지 않는다.
**처음 읽는 사람이 앞에서부터 읽어 내려가며 지도를 얻도록** 배열한다.

`Concept` 타입에 층을 나타내는 필드를 **추가하지 마라.** 배열 순서로만 표현한다.
어떤 층이 비는 것은 괜찮다. 층을 채우려고 개념을 만들지 마라.

### 5. 문항의 참조를 갱신한다

`src/data/questions.json`의 문항은 `topicId`와 `conceptId`를 갖는다.
이 step이 개념 id를 바꿨으므로 그 문항들을 따라 고쳐야 한다.

- `conceptId` → 개념의 새 id
- `topicId` → **그 개념이 들어간 주제의 id**

`topicId`를 직접 판단하지 마라. `conceptId`가 어느 주제에 있는지 보고 그 값을 쓴다.
아래 AC가 둘이 어긋나면 잡아낸다.

**문항의 `prompt`·`choices`·`answerIndex`·`explanation`을 고치지 마라.**
이유: 이 phase는 문항을 만들거나 고치지 않는다. 개념 배치만 바꾼다.

### 6. 테스트를 갱신한다

`src/data/data.test.ts`에서 **이 step이 바꾼 것에 해당하는 단언만** 고친다.

- 주제 목록·메타데이터를 못박은 단언(예: 「20개 주제의 메타데이터가 그대로다」)에서
  담당 범위의 주제 항목을 새 골격으로 바꾼다.
- `serviceCategories` 배열은 **개념 id로 키를 잡고 있다.** 담당 범위의 개념 id가
  바뀌었으면 그 줄을 고치고, 카테고리 한 줄을 새로 붙인 개념이 있으면 줄을 더한다.
- **담당 범위 밖의 단언을 고치지 마라.** 다른 step이 자기 몫을 고친다.
- 통과시키려고 단언을 **지우지 마라.** 값을 새 구조에 맞게 고치는 것이지,
  검사를 없애는 것이 아니다.

## Acceptance Criteria

```bash
npm run build   # 컴파일 에러 없음
npm test        # 테스트 통과

# 개념 id가 예외 없이 {topicId}.{slug} 형식이다
python3 - <<'EOF'
import json
ts = json.load(open('src/data/topics.json', encoding='utf-8'))
bad = [(t['id'], c['id']) for t in ts for c in t['concepts']
       if not c['id'].startswith(t['id'] + '.')]
print('접두사 위반:', bad or '없음')
EOF

# 문항의 topicId가 자기 conceptId를 담은 주제와 같다
python3 - <<'EOF'
import json
ts = json.load(open('src/data/topics.json', encoding='utf-8'))
qs = json.load(open('src/data/questions.json', encoding='utf-8'))
owner = {c['id']: t['id'] for t in ts for c in t['concepts']}
missing = [q['id'] for q in qs if q['conceptId'] not in owner]
mismatch = [q['id'] for q in qs
            if q['conceptId'] in owner and owner[q['conceptId']] != q['topicId']]
print('없는 conceptId:', missing or '없음')
print('topicId 불일치:', mismatch or '없음')
EOF

# 빈 주제가 없고, 개념 id가 전역에서 유일하다
python3 - <<'EOF'
import json, collections
ts = json.load(open('src/data/topics.json', encoding='utf-8'))
ids = [c['id'] for t in ts for c in t['concepts']]
print('빈 주제:', [t['id'] for t in ts if not t['concepts']] or '없음')
print('중복 개념 id:', [k for k, v in collections.Counter(ids).items() if v > 1] or '없음')
print('주제', len(ts), '/ 개념', len(ids))
EOF

# 문항 본문을 고치지 않았다
git diff src/data/questions.json | grep -E '^[+-] *"(prompt|explanation|answerIndex)"' && echo "위반" || echo "OK"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `topic-plan.md`가 이 step에 배정한 주제를 전부 만들었는가? 자리와 순서가 맞는가?
   - **위 "헷갈리는 짝"이 실제로 같은 주제 안에 있는가?**
   - 주제 안의 개념 순서가 1단 → 2단 → 3단인가?
   - 새 개념 본문에 `[Q번호 p쪽]` 인용이나 배치 메모가 남아 있지 않은가?
   - 카테고리 한 줄이 `service-categories.md`에 있는 표기 그대로인가?
   - CLAUDE.md CRITICAL 규칙(런타임 fetch 금지·localStorage 전용)을 건드리지 않았는가?
3. 결과에 따라 `phases/26-concept-merge/index.json`의 step 6을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **만든 주제 id와 각 개념 수, 없앤 기존 주제, 갱신한 문항 수**를 담아라.
다음 step들이 이 요약을 컨텍스트로 받는다.

## 금지사항

- **담당 범위 밖의 주제·개념·문항을 고치지 마라.** 이유: 다른 step이 자기 몫을 맡는다.
  같은 파일을 여러 step이 고치므로 범위를 넘으면 뒤 step의 전제가 깨진다.
- **기존 182개 개념의 본문을 고치지 마라.** 이유: 이미 검수를 거쳤다. 이 phase는 재배치다.
- **문항을 만들거나 `prompt`·`choices`·`answerIndex`·`explanation`을 고치지 마라.**
  이유: 문항은 다음 phase의 범위다. 이 phase는 개념 배치만 바꾼다.
- **`Concept`·`Topic` 타입에 필드를 추가하지 마라.** 이유: 3단 정렬은 배열 순서로 표현한다.
  필드를 넣으면 UI·테스트가 따라와 이 phase의 범위를 넘는다.
- **`src/lib/`·`src/pages/`·`src/components/`를 고치지 마라.** 이유: 이 step은 데이터만 바꾼다.
  진행률은 마이그레이션이 필요 없다 — `stats.ts`가 `topics` 배열을 돌며
  `progress.read[topic.id]`를 조회하므로 사라진 topicId는 조회되지 않고,
  `answers`·`wrong`은 questionId 기반이라 영향이 없다. `Progress`의 `version`을 올리지 마라.
- **덤프 인용을 `src/`로 옮기지 마라.** 이유: ADR-009의 전사 금지.
- **없는 사실을 보태지 마라.** 이유: 출처는 `dump-gaps/`와 `concepts-raw.md`뿐이다.
- **테스트 단언을 지워서 통과시키지 마라.** 이유: 그 단언들이 데이터 무결성의 유일한 방어선이다.
- 기존 테스트를 깨뜨리지 마라.
