# Step 21: docs-update

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 기획·아키텍처·설계 의도를 파악하라:

- `/CLAUDE.md`
- `/docs/PRD.md` — **고칠 대상.** 전체를 읽어라.
- `/docs/ARCHITECTURE.md` — **고칠 대상.** 전체를 읽어라.
- `/docs/ADR.md` — 전체 목록과 형식. 특히 ADR-013·ADR-019·ADR-021의 서술 방식.
  **ADR-009의 「검증」 문단도 읽어라** — 8번 작업의 근거다.
- `/docs/source/dump-gaps/topic-plan.md` — step 0이 정한 주제 골격
- `/docs/source/dump-gaps/README.md` — "주제 배치는 phase 26이 정한다"고 적힌 자리
- `/src/data/topics.json` — 재편이 끝난 실제 데이터
- `/src/data/data.test.ts` — 최종 단언들
- `/docs/source/service-categories.md` — **고칠 대상.** 「매핑 — 개념 75개」 표가 옛 개념 id로 낡아 있다.
- `/scripts/topics-baseline.json` — **고칠 대상.** `scripts/check-structure.mjs`의 기준 스냅샷이다.
- `/scripts/check-structure.mjs` — 위 스냅샷을 어떻게 읽는지 확인하라.
  **8번 작업에서 만들 스크립트가 따라야 할 스타일이기도 하다.**

## 배경

step 2~20이 주제를 20개에서 40개 안팎으로 재편하고 개념을 182개에서 618개로 늘렸다.
문서 여러 곳이 **"20개 주제"·"개념 182개"를 사실로 적어 두고 있어** 지금은 틀린 말이다.
이 step이 그것을 맞춘다. **`src/data/*.json`은 고치지 않는다.**

## 작업

### 1. 실제 값을 먼저 센다

문서에 적을 숫자는 추측하지 말고 데이터에서 뽑는다.

```bash
python3 - <<'EOF'
import json
ts = json.load(open('src/data/topics.json', encoding='utf-8'))
qs = json.load(open('src/data/questions.json', encoding='utf-8'))
print('주제', len(ts))
print('개념', sum(len(t['concepts']) for t in ts))
print('문항', len(qs))
print('개념 수 분포 최소~최대:',
      min(len(t['concepts']) for t in ts), '~', max(len(t['concepts']) for t in ts))
print('문항 0개인 주제:', sum(1 for t in ts
      if not any(q['topicId'] == t['id'] for q in qs)))
EOF
```

### 2. `docs/PRD.md`를 고친다

- "핵심 기능 1. 주제 목록 — 20개 주제를" → 실제 수
- "핵심 기능 7. 검색 — ... 개념 182개는" → 실제 수
- "MVP 제외 사항"의 검색 항목에 있는 "20개 주제는 목록으로 훑는 게 더 빠르다" 서술 —
  주제가 두 배가 되었으므로 **그 근거가 지금도 유효한지 밝혀 적어라.**
  주제 목록에 필터를 붙일지 말지는 **이 step이 결정하지 않는다.** 사실만 갱신하고,
  판단이 필요해졌다는 것을 한 줄로 남겨라.
- "원본" 절에 `dump-gaps/`가 네 번째 출처로 들어왔다는 것을 반영한다(ADR-021).
- **"문제 은행" 절은 고치지 마라.** 문항은 이 phase에서 하나도 늘지 않았다.
  다만 개념 618개 중 문항이 있는 것은 일부라는 사실을 한 줄로 남겨라.

### 3. `docs/ARCHITECTURE.md`를 고친다

- 라우트 표의 `/` 설명 "주제 목록 (20개, 중요도·진행 상태 표시)" → 실제 수
- "개념·주제 검색" 절의 "개념 182개는 주제 제목만으로는 찾을 수 없다" → 실제 수.
  **그 절의 논지는 그대로 살아 있다** — 개념이 늘었으므로 오히려 더 맞는 말이 되었다.
- "주제 간 이동" 절의 "20번째에서 1번째로 돌아가면" 같은 숫자 서술 → 실제 수
- "화면 전환 시 스크롤"의 실측표는 **고치지 마라.** 그때 실제로 잰 값이다.
  다만 개념이 늘어 개념 화면이 더 길어졌다는 사실을 표 아래에 한 줄로 덧붙여라.
  **새로 재지 않은 숫자를 표에 넣지 마라.**
- "데이터 모델"의 `Concept` 주석에 **주제 안의 개념 배열이 1단(기본) → 2단(갈림길) →
  3단(한계) 순서라는 규칙**을 적는다. 이것이 이 phase가 만든 새 규칙이고,
  타입에 필드가 없으므로 문서가 유일한 근거다.

### 4. `docs/ADR.md`에 ADR-023를 더한다

**번호는 023이다. 022가 아니다.** phase 26 도중에 ADR-022(카테고리를 13종에서 15종으로
넓힌다)가 이미 들어갔다. `docs/ADR.md`를 열어 마지막 번호를 직접 확인한 뒤 그다음을 써라.

제목: **주제를 서비스 경계로 재편하고 개념 순서를 기본→갈림길→한계로 잡는다
(PRD "20개 주제"·ADR-021 개정)**

아래를 담아라. 기존 ADR들의 서술 방식(**결정** / **이유** / 경계 / **트레이드오프**)을 따른다.

- **결정** — 주제를 20개에서 실제 수로 재편했고, 경계는 **서비스 단위**로 그었다.
  개념 배열은 주제 안에서 1단→2단→3단 순서다. `Concept` 타입에 층 필드를 두지 않고
  **배열 순서로만** 표현한다.
- **크기가 아니라 서비스로 자른 이유** — 크기로 자르면 경계가 학습자의 구획과 무관해지고,
  무엇보다 헷갈리는 짝이 갈린다. CloudFront ↔ Global Accelerator가 다른 주제에 놓이면
  이 앱이 가르치려는 것("언제 무엇을 쓰는가")을 스스로 깨뜨린다.
  `topic-plan.md`의 "헷갈리는 짝 배치 표"가 그 목록이다.
- **3단 정렬의 이유** — 기존 182개는 "이 서비스는 무엇인가"(지도)이고 새 436개는
  한계값·설정·갈림길(지형 디테일)이다. Lambda가 무엇인지 모르는 사람에게
  `lambda-layer-size-limit`은 아무것도 주지 않는다. PRD의 사용자는 "짧게 여러 번
  들여다보는" 사람이므로, 앞에서부터 읽어 지도를 얻고 나중에 다시 와서 뒤를 읽는다.
- **타입에 층 필드를 두지 않은 이유** — 배열 순서만으로 학습 순서가 표현되고
  타입·UI·테스트가 하나도 바뀌지 않는다. 층을 화면에 눈에 보이게 표시하는 것은
  별개의 판단이고 이 결정에 포함되지 않는다.
- **진행률을 마이그레이션하지 않은 이유** — `Progress.read`는 topicId로 키를 잡지만
  `stats.ts`가 `topics` 배열을 돌며 `progress.read[topic.id]`를 조회하므로 사라진
  topicId는 조회되지 않는다. `answers`·`wrong`은 questionId 기반이고 문항 id는
  바뀌지 않았다. 그래서 `version`은 2 그대로다.
- **트레이드오프** — 주제 목록이 두 배로 길어졌다. PRD는 "주제 목록에 필터를 붙이지
  마라"를 유지하고 있으므로, 목록 화면을 어떻게 다룰지는 **열린 문제로 남는다.**
  그리고 개념은 618개인데 문항은 246개 그대로여서 **문항이 없는 주제가 생겼다.**
  둘 다 다음 phase의 몫이다.

**ADR-021을 지우거나 고치지 마라.** ADR-023가 그 위에 얹히는 것이고,
기존 ADR들이 서로를 "개정"으로 참조하는 방식을 따른다.

### 5. `docs/source/dump-gaps/README.md`의 예고를 정리한다

맨 끝에 "주제 배치는 phase 26이 정한다"는 문장이 있다. 그 일이 끝났으므로
**결과를 가리키도록 한 줄로 고친다** — 배치는 `topic-plan.md`에 있고 실제 데이터는
`src/data/topics.json`에 있다는 뜻으로. 문서 전체를 다시 쓰지 마라.

### 6. `scripts/topics-baseline.json`을 다시 만든다

**step 2~20이 이 파일을 미뤄 두었다.** 구조가 매 step 바뀌므로 마지막에 한 번 맞추는
것이 맞다는 판단이었다. 지금 `node scripts/check-structure.mjs`를 돌리면 주제 개수·개념
개수·개념 id가 전부 어긋났다고 200줄 넘게 쏟아진다. **이 step이 맞추지 않으면 그 검사는
phase가 끝난 뒤에도 계속 죽어 있다.**

`check-structure.mjs`를 읽고 baseline이 어떤 필드를 쓰는지 확인한 뒤,
현재 `src/data/topics.json`·`src/data/questions.json`에서 값을 다시 뽑아 채운다
(`conceptLineCount`, `topics`의 주제별 메타데이터와 개념 id·name, `questionsSha256`).

- **들여쓰기를 바꾸지 마라.** 이 파일은 1칸 들여쓰기로 커밋돼 있다.
  `JSON.stringify(b, null, 2)`로 통째로 다시 쓰면 값이 같아도 950줄이 diff에 잡혀
  무엇이 실제로 바뀌었는지 읽을 수 없게 된다.
- **검사를 통과시키려고 `check-structure.mjs`를 고치지 마라.** 고칠 것은 기준값이지
  검사기가 아니다.

### 7. `docs/source/service-categories.md`의 매핑 표를 맞춘다

**step 2~20이 이 파일도 미뤄 두었다.** 「매핑 — 개념 75개」 표는 개념 id로 키를 잡는데,
이 phase가 주제를 재편하면서 `block-file-storage.ebs`처럼 **없어진 id가 남아 있다.**

- 표의 개념 id를 `src/data/topics.json`의 현재 id로 맞춘다.
- 이 phase에서 카테고리 한 줄을 새로 붙인 개념(step 5의 `dms-sct`·
  `application-migration-service` 등)을 표에 더한다. **어느 개념에 붙었는지는
  `src/data/data.test.ts`의 `serviceCategories` 배열이 사실상의 정답지다** —
  그 배열과 이 표가 일치하는지 대조하라.
- 개수가 75개가 아니게 되므로 **절 제목의 숫자도 실제 수로 고친다.**
- `카테고리 15종` 표와 `phase 26에서 들어오는 서비스` 표는 **손대지 마라.**
  전자는 ADR-022가 정한 것이고 후자는 step 1의 산출물이다.
- **카테고리를 새로 정하지 마라.** 이 step은 낡은 id를 맞추는 것이지 배치를 바꾸는
  것이 아니다. 배치를 바꿔야 할 자리를 찾으면 `summary`에 적어 알려라.

### 8. `scripts/check-verbatim.mjs`를 실제로 만든다

`docs/ADR.md`의 ADR-009는 「검증」 문단에서 "`scripts/check-verbatim.mjs`가 공백·문장부호를
지운 뒤 원본과 32자 이상 연속 일치하는 구간을 잡아낸다"고 적고 있다.
**그런데 그 파일이 저장소에 없다.** `scripts/`에는 `check-structure.mjs`뿐이다.

전사 금지는 이 저장소를 공개할 수 있는지를 가르는 CRITICAL 규칙인데(CLAUDE.md "원본 데이터"),
그 유일한 검증 장치가 문서상으로만 존재한다. **ADR 문장을 지워 현실에 맞추지 마라.
스크립트를 만들어 문서를 사실로 만든다.** 이유: ADR-009는 개념 본문 182개를 다시 쓴 결정의
근거 문서이고, 검증 문단을 지우면 그 결정이 무엇으로 확인됐는지가 기록에서 사라진다.

인터페이스:

- 파일은 `scripts/check-verbatim.mjs` 하나. `node scripts/check-verbatim.mjs`로 돈다.
- **의존성을 추가하지 마라.** 이유: Node 18 표준 모듈로 되는 일이고, 스택은 ADR이 고정한다.
  `package.json`이 diff에 잡히면 위반이다.
- 비교 대상은 `src/data/topics.json`의 개념 본문(`name`·`summary`·`paragraphs`)이고,
  원본은 `docs/source/concepts-raw.md`다.
- 정규화와 임계값은 **ADR-009가 적은 그대로** 쓴다 — 공백·문장부호를 지운 뒤 32자 연속 일치.
  **임계값을 바꾸지 마라.** 이유: 32는 exam-gaps 개념 77개가 전부 통과하는 실측 하한선이라고
  ADR 본문에 근거가 적혀 있다. 코드에서 바꾸면 그 근거가 문서와 어긋난다.
- 원본 경로를 **첫 인자로 받을 수 있게** 한다(기본값은 위 경로). 이유: 원본이 없는 환경의
  동작을 AC에서 확인할 수 있어야 한다. 그 외의 옵션·설정은 만들지 마라.
- 겹침을 찾으면 개념 id와 겹친 문자열을 출력하고 **exit code 1**로 끝난다.
  못 찾으면 이상 없음을 출력하고 **0**으로 끝난다.

**원본이 없는 것이 정상 경로다:**

- `docs/source/concepts-raw.md`는 ADR-009에 따라 gitignore로 로컬에만 둔다.
  clone한 환경에는 **없는 것이 정상**이다.
- 그러므로 원본 파일이 없으면 **실패가 아니라 "건너뜀"으로 끝나야 한다.** 무엇이 없어서
  건너뛰는지 경로와 함께 알리고 **exit code 0**이다. 이유: 죽게 만들면 그 파일을 가진
  사람 말고는 아무도 못 돌리고, CI에도 걸 수 없다.
- **`npm test`·`npm run build`에 엮지 마라.** 이유: vitest는 저장소에 있는 파일만으로 돌아야
  한다. 이 검사는 원본을 가진 사람이 손으로 돌리는 것이며, **그 사실을 ADR-009의 「검증」
  문단에 한 줄로 덧붙여 밝혀라.** 검사가 자동으로 돌지 않는다는 것도 기록의 일부다.

**검사가 잡은 겹침을 이 step에서 고치지 마라.** 이유 둘이다. 첫째, 이 step은 `src/`를
건드리지 않는다(아래 금지사항). 둘째, **검사를 통과시킬 목적으로 개념 문장을 깎으면
학습자가 읽을 문장이 나빠진다.** 겹침을 없애는 올바른 방법은 사실을 유지하며 다시 쓰는
것이고, 그것은 문장마다 판단이 필요해 문서 갱신 step의 몫이 아니다. 찾은 겹침은 개념 id
목록으로 `summary`에 적어 남겨라.

## Acceptance Criteria

```bash
npm run build   # 컴파일 에러 없음
npm test        # 테스트 통과

# 문서에 옛 숫자가 남아 있지 않다 (주제 수·개념 수)
grep -rn '20개 주제\|개념 182\|182개' docs/PRD.md docs/ARCHITECTURE.md || echo "옛 숫자 없음"

# 문서의 숫자가 실제 데이터와 맞는다
python3 - <<'EOF'
import json, re
ts = json.load(open('src/data/topics.json', encoding='utf-8'))
n_t = len(ts); n_c = sum(len(t['concepts']) for t in ts)
for p in ('docs/PRD.md', 'docs/ARCHITECTURE.md'):
    src = open(p, encoding='utf-8').read()
    print(p, '| 주제 수 언급:', ('%d개 주제' % n_t) in src,
          '| 개념 수 언급:', ('개념 %d' % n_c) in src or ('%d개' % n_c) in src)
EOF

# ADR-023가 형식을 지켜 들어갔다
grep -n '^### ADR-023' docs/ADR.md
grep -A3 '^### ADR-023' docs/ADR.md | grep -q '\*\*결정\*\*' && echo OK

# 구조 검사가 되살아났다 (기준 스냅샷을 다시 만들었으므로 이상 없음이어야 한다)
node scripts/check-structure.mjs

# baseline을 통째로 재직렬화하지 않았다 (들여쓰기가 1칸 그대로다)
head -3 scripts/topics-baseline.json

# 매핑 표에 없어진 개념 id가 남아 있지 않다
python - <<'EOF'
import json, re
ts = json.load(open('src/data/topics.json', encoding='utf-8'))
live = {c['id'] for t in ts for c in t['concepts']}
src = open('docs/source/service-categories.md', encoding='utf-8').read()
head, _, tail = src.partition('## 매핑')
ids = re.findall(r'^\| `([a-z0-9-]+\.[a-z0-9-]+)` \|', tail, re.M)
print('표의 개념 id:', len(ids), '| 없어진 id:', sorted(set(ids) - live) or '없음')
EOF

# src/를 건드리지 않았다
git diff --name-only | grep '^src/' && echo "위반" || echo "OK"

# check-verbatim.mjs 가 생겼고, 원본이 없는 환경에서 죽지 않는다 (exit 0 + 건너뜀 안내)
node scripts/check-verbatim.mjs docs/source/does-not-exist.md; echo "exit=$? (0이어야 한다)"

# 원본이 있으면 실제로 검사한다 (없으면 위와 같이 건너뜀으로 끝난다)
node scripts/check-verbatim.mjs; echo "exit=$?"

# ADR-009 임계값 32가 코드에 있고, 의존성을 늘리지 않았다
grep -n '32' scripts/check-verbatim.mjs
git diff --name-only | grep -q '^package\(-lock\)\?.json$' && echo "위반: 의존성 변경" || echo OK

# ADR-009 검증 문단이 "손으로 돌린다"는 사실을 밝혔다
grep -n 'check-verbatim' docs/ADR.md
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 체크리스트를 확인한다:
   - 문서에 적은 숫자가 전부 **데이터에서 센 값**인가? 추측한 숫자가 없는가?
   - ARCHITECTURE의 스크롤 실측표에 **새로 재지 않은 값**을 넣지 않았는가?
   - ADR-023가 기존 ADR의 서술 방식(**결정**/**이유**/**트레이드오프**)을 따르는가?
   - 열린 문제(주제 목록 길이, 문항 없는 주제)를 **결론 내지 않고 남겨** 두었는가?
   - `Concept`의 3단 순서 규칙이 ARCHITECTURE에 적혔는가?
   - `node scripts/check-structure.mjs`가 이상 없음으로 끝나는가?
   - `topics-baseline.json`의 diff가 실제로 바뀐 값만 담고 있는가? (재직렬화로 부풀지 않았는가)
   - 매핑 표의 개념 id가 `data.test.ts`의 `serviceCategories`와 일치하는가?
   - `scripts/check-verbatim.mjs`가 원본이 **없을 때 exit 0**으로 끝나는가?
     (`concepts-raw.md`가 없는 clone 환경이 정상이다)
   - 그 스크립트를 `npm test`·`npm run build`에 엮지 않았는가?
   - ADR-009의 「검증」 문단이 이 검사가 수동이라는 사실을 밝히고 있는가?
3. 결과에 따라 `phases/26-concept-merge/index.json`의 step 21을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`src/`를 고치지 마라.** 이유: 이 step은 문서만 맞춘다. 데이터가 틀렸으면
  그 주제를 맡은 step의 문제이므로 고치지 말고 `summary`에 적어 알려라.
- **ARCHITECTURE의 실측표에 재지 않은 숫자를 넣지 마라.** 이유: 그 표는 실제로 잰 값이라는
  것이 유일한 가치다. 추정치를 섞으면 표 전체를 믿을 수 없게 된다.
- **주제 목록 화면을 어떻게 할지 이 step에서 결정하지 마라.** 이유: UI 판단이고
  실물을 보고 정할 일이다. 사실만 갱신하고 열린 문제로 남겨라.
- **문항을 만들지 마라.** 이유: 다음 phase의 범위다.
- **ADR을 지우거나 과거 결정을 다시 쓰지 마라.** 이유: ADR은 개정을 덧붙이는 기록이다.
- **ADR-009의 「검증」 문단을 지우거나 약화시키지 마라.** 이유: 없는 스크립트를 문서에서
  지우는 것은 규칙을 사실에 맞추는 것이 아니라 규칙을 버리는 것이다. 8번 작업은 반대 방향이다.
- **전사 검사를 통과시키려고 개념 본문을 고치지 마라.** 이유: 검사 통과를 목적으로 문장을
  깎으면 학습자가 읽을 문장이 나빠진다. 이 step은 찾은 것을 보고만 하고 고치지 않는다.
- 기존 테스트를 깨뜨리지 마라.
