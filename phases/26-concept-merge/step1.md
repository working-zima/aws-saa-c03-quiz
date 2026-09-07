# Step 1: service-categories-extend

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 설계 의도를 파악하라:

- `/CLAUDE.md` — "원본 데이터" 절
- `/docs/ADR.md` — **ADR-019(이 step의 근거)**, ADR-006, ADR-021
- `/docs/source/service-categories.md` — **이 step이 넓히는 파일.** 전체를 읽어라.
- `/docs/source/dump-gaps/_index.md` — 새로 들어오는 개념 436개의 목록
- `/docs/source/dump-gaps/topic-plan.md` — step 0이 정한 주제 골격
- `/src/data/data.test.ts` 의 `serviceCategories` 배열 — 현재 75개가 어떻게 강제되는지

## 배경

ADR-019는 **서비스 개념**의 `paragraphs[0]` 맨 앞에
`{주어}는 AWS 분류로는 {카테고리} 쪽 서비스다.` 한 문장을 넣도록 정했다.
근거는 `docs/source/service-categories.md` **하나뿐이고**, 그 파일은 AWS 백서
*Overview of Amazon Web Services*의 "AWS services by category"에서 뽑은 것이다.

문제는 그 파일이 **지금 앱에 있는 서비스만 담고 있다**는 것이다. phase 26이 들여오는
SageMaker · CloudFormation · Systems Manager · Neptune · QuickSight · Elastic Beanstalk ·
Service Catalog · Control Tower · RAM · Comprehend · Rekognition 같은 서비스는 **하나도 없다.**

이 step은 그 빈자리를 채운다. 채우지 않으면 step 2~20이 새 서비스 개념에
카테고리 한 줄을 붙일 근거가 없다.

## 작업

### 1. 어떤 서비스가 새로 들어오는지 추린다

`_index.md`의 436줄을 훑어 **AWS 서비스 이름**을 뽑는다.
개념 slug가 아니라 서비스다 — `lambda-snapstart`·`lambda-layer-size-limit`은
둘 다 `Lambda`이고, `Lambda`는 이미 표에 있으므로 새로 넣을 것이 없다.

**이미 `service-categories.md`에 있는 서비스는 제외한다.** 남는 것만 대상이다.

### 2. 백서에서 카테고리를 확인한다

`service-categories.md`의 "출처" 절에 백서 URL이 전부 적혀 있다. 그 페이지들을 받아
각 서비스가 어느 카테고리에 있는지 확인한다.

- **카테고리 이름은 이미 확정된 13종을 벗어나지 마라.** 그 목록은 `service-categories.md`의
  "카테고리 13종" 표에 있고 `data.test.ts`가 표기까지 강제한다. 새 카테고리를 만들지 마라.
- **백서에서 못 찾은 서비스는 지어내지 마라.** 아래 3번대로 처리한다.
- 네가 아는 AWS 지식으로 카테고리를 채우지 마라. ADR-019가 이 파일을 **유일한 근거**로
  못박은 이유가 그것이다.

백서 페이지를 받을 수 없으면(네트워크 차단 등) **작업을 멈추고 step 상태를 `blocked`로
바꿔라.** 근거 없이 표를 채우는 것보다 멈추는 것이 맞다.

### 3. 백서에 없는 서비스를 명시한다

백서의 카테고리별 Topics 목록에 개별 항목이 없는 서비스가 나올 수 있다.
`service-categories.md`의 "출처" 절이 STS·Billing and Cost Management를 그렇게 처리했다.
같은 방식을 따른다.

- **보조 출처로 확인되면** 그 문서를 "출처" 절에 추가하고 표의 `보조`란에 표시한다.
- **어느 쪽으로도 확인이 안 되면** `카테고리 없음` 절에 서비스 이름과 사유를 적는다.
  그 서비스의 개념은 **카테고리 한 줄을 붙이지 않는다.** 뒤 step이 이 절을 보고 건너뛴다.

### 4. `service-categories.md`를 넓힌다

기존 "매핑 — 개념 75개" 표는 **개념 id로 키를 잡고 있다.** 그런데 phase 26은 주제를
재편하면서 개념 id를 바꾸므로, 이 step 시점에는 새 개념의 id를 알 수 없다.

그래서 **새 절을 하나 더 만들고 서비스 이름으로 키를 잡는다.**

```markdown
## phase 26에서 들어오는 서비스

`dump-gaps/`의 개념이 다루는 서비스 중 위 표에 없던 것들이다.
개념 id는 step 2~20이 주제를 확정하면서 정해지므로 여기서는 **서비스 이름으로만** 적는다.
각 step이 자기 개념에 한 줄을 붙일 때 이 표에서 주어와 카테고리를 가져간다.

| 서비스 | 문장 주어 | 카테고리 | 보조 |
| --- | --- | --- | --- |
| CloudFormation | CloudFormation은 | 관리 및 거버넌스 | |
| SageMaker AI | SageMaker AI는 | 기계 학습 ... |
```

- **`문장 주어`는 조사까지 적는다.** 기존 표가 `Route 53은`·`EC2는`처럼 적어 둔 이유다.
  받침 유무로 `은`/`는`이 갈리므로 여기서 확정해 두어야 뒤 step이 흔들리지 않는다.
- 기존 "매핑 — 개념 75개" 표는 **손대지 마라.** 그 표의 개념 id는 step 2~20이 자기
  범위를 옮길 때 각자 고친다.

### 5. 주제 배치와 어긋나는 자리를 갱신한다

`service-categories.md`에는 "주제 배치와 어긋나는 자리" 표가 있다 — CloudWatch가
앱에서는 분석·모니터링인데 백서로는 관리 및 거버넌스인 것 같은 경우다.
새 서비스에서 그런 자리가 생기면 그 표에 줄을 더한다. **주제 배치를 바꾸지는 마라** —
step 0의 `topic-plan.md`가 정한 것이고, 이 표는 어긋남을 기록하는 곳이지 고치는 곳이 아니다.

## Acceptance Criteria

```bash
# 1. 새 절이 생겼고 항목이 있다
grep -q '^## phase 26에서 들어오는 서비스' docs/source/service-categories.md && echo OK

# 2. 카테고리 표기가 확정된 13종을 벗어나지 않는다
python3 - <<'EOF'
import re
src = open('docs/source/service-categories.md', encoding='utf-8').read()
head, _, tail = src.partition('## phase 26에서 들어오는 서비스')
cats = set(re.findall(r'^\| `([^`]+)` \| ', head, re.M))
bad = []
for row in re.findall(r'^\| [^|]+ \| [^|]+ \| ([^|]+) \|', tail, re.M):
    name = row.strip()
    if name in ('카테고리', '---'): continue
    if not any(c.startswith(name) for c in cats): bad.append(name)
print('13종 밖 표기:', sorted(set(bad)) or '없음')
EOF

# 3. 기존 75개 매핑 표를 건드리지 않았다
git diff docs/source/service-categories.md | grep '^-' | grep -c '^-| `' # 0 이어야 한다

# 4. src/를 건드리지 않았다
git diff --name-only | grep '^src/' && echo "위반" || echo "OK"

# 5. 회귀가 없다
npm run build && npm test
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 체크리스트를 확인한다:
   - 표의 모든 항목이 백서나 명시된 보조 출처에서 왔는가? **기억으로 채운 줄이 없는가?**
   - `문장 주어`의 조사(`은`/`는`)가 받침에 맞는가?
   - 백서에서 못 찾은 서비스가 `카테고리 없음` 절에 사유와 함께 적혔는가?
   - 카테고리를 새로 만들지 않았는가? (13종 고정)
3. 결과에 따라 `phases/26-concept-merge/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - **백서를 받을 수 없음** → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **새로 표에 넣은 서비스 수, 카테고리별 분포, `카테고리 없음`으로 남긴 서비스**를
담아라. step 2~20이 이 요약을 컨텍스트로 받는다.

## 금지사항

- **백서에서 확인하지 않은 카테고리를 적지 마라.** 이유: ADR-019가 이 파일을 유일한 근거로
  정했다. 모델이 아는 AWS 지식으로 채우면 그 규칙이 무의미해진다.
- **카테고리 13종을 늘리지 마라.** 이유: `data.test.ts`가 표기까지 강제하고 있고,
  카테고리를 늘리는 것은 ADR-019 개정 사안이다.
- **기존 "매핑 — 개념 75개" 표의 줄을 고치거나 지우지 마라.** 이유: 그 표의 개념 id는
  step 2~20이 자기 주제를 옮길 때 각자 고친다. 여기서 손대면 충돌한다.
- **`src/`를 고치지 마라.** 이유: 이 step은 출처 문서만 넓힌다.
- **개념 본문을 쓰지 마라.** 이유: 카테고리 한 줄을 실제로 붙이는 것은 step 2~20이다.
- 기존 테스트를 깨뜨리지 마라.
