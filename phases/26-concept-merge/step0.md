# Step 0: topic-plan

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 기획·아키텍처·설계 의도를 파악하라:

- `/CLAUDE.md` — 특히 "아키텍처 규칙"과 "원본 데이터" 절
- `/docs/PRD.md` — **특히 "사용자"와 "목표" 절.** 이 step의 판단 기준이다.
- `/docs/ARCHITECTURE.md` — "데이터 모델", "주제 간 이동", "개념·주제 검색"
- `/docs/ADR.md` — ADR-019·ADR-022(카테고리 한 줄. 카테고리는 15종이다), ADR-021(덤프 해설의 지위)
- `/docs/source/dump-gaps/README.md` — 이 개념들이 어떻게 만들어졌는지
- `/docs/source/dump-gaps/_index.md` — **새 개념 436개의 목록.** slug와 한 줄 제목이 전부 있다.
- `/src/data/topics.json` — **현재 20개 주제·개념 182개.** 재편 대상.
- `/src/types/content.ts` — `Topic`·`Concept` 타입

## 이 step이 정하는 것

`docs/source/dump-gaps/` 의 새 개념 **436개**를 `src/data/topics.json` 의 기존 **182개**와
합쳐 주제를 재편할 때, **주제 골격**을 정한다. 산출물은 문서 하나와 스크립트 하나이고
**`src/` 는 한 줄도 고치지 않는다.**

개념 하나하나를 어느 주제에 넣을지는 이 step이 정하지 않는다. 그건 step 2~20이
자기 담당 범위의 개념 본문을 읽으면서 정한다. 이 step은 **그 주제들이 무엇이고 어떤
순서로 놓이는지**를 정해 뒤 step들이 따를 기준을 만든다.

## 배경 — 왜 주제를 쪼개는가

기존 20개 주제에 새 개념을 그대로 이어 붙이면 주제가 이렇게 커진다.

| 기존 주제 | 기존 | 신규 | 합 |
|---|---|---|---|
| serverless-containers | 11 | 51 | 62 |
| analytics-monitoring | 14 | 42 | 56 |
| compute-delivery | 11 | 43 | 54 |
| aurora-dynamodb-cache | 8 | 42 | 50 |
| messaging-backup | 11 | 33 | 44 |
| identity-access | 12 | 32 | 44 |
| block-file-storage | 8 | 32 | 40 |

개념 읽기 화면은 현재 8~14개념에서 2400~3900px다(ARCHITECTURE "화면 전환 시 스크롤"의
실측표). 62개념이면 15,000px 안팎이 되어 PRD가 말하는 "주제 하나의 개념을 처음부터
끝까지 읽는 화면"이 성립하지 않는다.

## 분할 규칙 — 이 두 가지가 이 step의 핵심이다

### 규칙 1. 경계는 서비스 단위로 긋는다. 크기로 긋지 마라.

**개념 수를 균등하게 맞추려고 주제를 자르지 마라.** 주제당 개념 수는 **9~20**을 목표로
하되, 서비스 경계를 지키기 위해 그 범위를 벗어나는 것이 낫다면 벗어나라.
목표 주제 수는 40개 안팎이다.

이유: 크기로 자르면 경계가 학습자의 머릿속 구획과 무관해진다. `lambda-basics` ·
`lambda-advanced` 같은 이름은 학습자에게 아무 뜻이 없다. `Lambda` · `API Gateway` ·
`ECS·EKS·Fargate` 는 이미 머릿속에 있는 구획이다.

### 규칙 2. 헷갈리는 짝은 반드시 한 주제 안에 둔다.

PRD의 사용자는 "AWS 서비스 이름은 들어봤지만 **언제 무엇을 쓰는지**가 정리되지 않은"
사람이다. 서로 구분해야 하는 서비스를 다른 주제로 떼어 놓으면 이 앱의 존재 이유가 깨진다.

**최소한 아래 짝은 같은 주제에 두어야 한다.** 이것 말고도 발견하면 지켜라.

| 짝 | 왜 |
|---|---|
| CloudFront ↔ Global Accelerator | SAA-C03의 대표 혼동 짝. `src/data/data.test.ts`에 「CloudFront와 Global Accelerator의 갈림길이 추상적인 대비 대신 구체적인 기준으로 쓰인다」 테스트가 이미 있다 |
| ALB ↔ NLB ↔ Gateway Load Balancer | 세 로드 밸런서의 선택 기준이 문항의 핵심이다 |
| SQS ↔ SNS ↔ EventBridge | 메시징 세 갈래 |
| EFS ↔ FSx (Lustre·Windows·ONTAP) | 공유 파일 스토리지 선택 |
| RDS ↔ Aurora | 관리형 관계형 DB 두 갈래 |
| S3 스토리지 클래스 전체 (Standard·IA·One Zone-IA·Intelligent-Tiering·Glacier 3종) | 이미 한 주제이고 유지한다 |
| KMS ↔ Secrets Manager ↔ Parameter Store | 키·비밀 세 갈래 |

## 주제 안의 개념 순서 — 3단으로 정렬한다

새 개념 436개는 기존 182개와 **성격이 다르다.**

- 기존 182개는 대체로 **"이 서비스는 무엇인가"** 다. 지도에 해당한다.
- 새 436개는 대체로 **한계값·설정·갈림길**이다. `lambda-layer-size-limit`,
  `load-balancer-idle-timeout`, `api-gateway-mapping-template-limits` 같은 것들이다.

Lambda가 무엇인지 모르는 사람에게 `lambda-layer-size-limit`은 아무것도 주지 않는다.
그래서 **주제 안에서 개념 배열 순서를 3단으로 잡는다.**

```
1단 [기본]   이 서비스는 무엇이고 무엇에 쓰는가
2단 [갈림길] 비슷한 것들 중 언제 이것을 고르는가
3단 [한계]   한계값·설정 항목·주의점
```

`Concept` 타입에 층을 나타내는 필드를 **추가하지 마라.** `concepts`는 배열이고
`ConceptList`가 배열 순서대로 그리므로 **순서만 정하면 타입·UI·테스트가 하나도 바뀌지
않는다.** 이 step은 각 주제의 3단 경계를 문서에 적어 두는 것까지만 한다.

어떤 주제에 어떤 층이 비는 것은 괜찮다. 층을 채우려고 개념을 만들지 마라.

## 산출물 1 — `docs/source/dump-gaps/topic-plan.md`

주제 골격을 적는다. 주제마다 아래 항목을 갖춘다.

```markdown
## {새 topicId} — {제목}

- **importance**: 3 | 2 | 0
- **sourcePages**: [n, m]
- **유래**: `{기존 topicId}` 분할 / `{기존 topicId}` 유지 / 신규
- **담는 서비스**: {서비스 이름 나열}
- **예상 개념 수**: 기존 {n} + 신규 {m} = {합}
- **3단 구분**: 1단 {대략 무엇} / 2단 {대략 무엇} / 3단 {대략 무엇}
- **담당 step**: {번호}
```

배열 순서대로 적는다. 그 순서가 `topics.json`의 배열 순서이자 학습 순서다.

문서 앞에 **주제 목록 표**(topicId · 제목 · 예상 개념 수 · 담당 step)를 두고,
뒤에 **헷갈리는 짝 배치 표**(짝 · 들어간 주제 · 근거)를 둔다.

### 메타데이터 규칙

- **`importance`** — 기존 주제를 쪼갠 조각은 원래 주제의 값을 물려받는다. 신규 주제는
  판단해서 정하고 근거를 한 줄 적는다. 값은 `3` · `2` · `0` 뿐이다(`Importance` 타입).
- **`sourcePages`** — 기존 주제를 쪼갠 조각은 원래 주제의 값을 그대로 물려받는다.
  같은 원본 페이지에서 온 개념들이므로 맞다. **신규 주제는 `[0, 0]`** 이다 —
  `concepts-raw.md`에 근거가 없다는 뜻이다. 테스트는 길이 2와 대소 관계만 본다.
- **`topicId`** — kebab-case. 기존 id를 그대로 쓰는 주제는 그대로 둔다.
- **배열 위치** — 쪼갠 조각은 원래 주제가 있던 자리에 연속으로 놓는다. 신규 주제는
  성격이 가까운 기존 주제 뒤나 배열 맨 뒤에 놓고, 그 판단 근거를 적는다.

## 산출물 2 — `scripts/collect-gaps.py`

step 2~20이 자기 담당 개념의 **본문**을 모으는 데 쓸 스크립트다.
`docs/source/dump-gaps/Q*.md` 18개 파일에 흩어진 항목을 `## {topicId}` 절 기준으로 모아
표준 출력에 낸다.

```bash
python3 scripts/collect-gaps.py block-file-storage      # 그 주제로 분류된 항목 전부
python3 scripts/collect-gaps.py '(주제 미정)'            # 주제 미정 항목 전부
python3 scripts/collect-gaps.py --list                  # 분류별 항목 수만
```

- 저장소 기본 `python3`(3.7)로 돌아야 한다. 외부 패키지를 쓰지 마라.
- 항목의 `### ` 헤더부터 다음 헤더 전까지를 그대로 낸다. `> [Q번호 p쪽]` 인용 줄도 낸다 —
  뒤 step이 근거를 확인해야 한다.
- "원본 수정 이력" 절 아래의 `###` 은 개념이 아니다. 내지 마라.
- 40줄 안쪽으로 짧게 짜라.

## 작업 순서

1. 아래 명령으로 새 개념 436개가 어느 기존 주제로 분류돼 있는지 확인한다.

```bash
python3 - <<'EOF'
import re, glob, collections
cnt = collections.Counter(); cur = None
for f in sorted(glob.glob('docs/source/dump-gaps/Q*.md')):
    for line in open(f, encoding='utf-8'):
        m = re.match(r'^## (.+?)\s*$', line)
        if m:
            cur = m.group(1).strip()
            if cur.startswith('원본 수정 이력'): cur = None
            continue
        if re.match(r'^### `', line) and cur: cnt[cur] += 1
for k, v in cnt.most_common(): print('%-26s %d' % (k, v))
print('합계', sum(cnt.values()))
EOF
```

2. `_index.md`로 개념 436개의 slug와 제목을 훑어 **어떤 서비스들이 들어오는지** 파악한다.
   본문은 읽지 않아도 된다. 이 step은 골격만 정한다.
3. `(주제 미정)` 41개는 기존 주제에 들어갈 것과 새 주제가 필요한 것을 가른다.
   S3 접근 제어·운영 계열, 거버넌스·IaC(CloudFormation·Service Catalog·Control Tower·
   Config·RAM), Systems Manager 운영, AI·ML(SageMaker·Comprehend·Rekognition·Lex),
   재해 복구 계열로 묶인다.
4. `topic-plan.md`를 쓴다.
5. `scripts/collect-gaps.py`를 쓰고 동작을 확인한다.

## Step 담당 범위 — 이 배정을 바꾸지 마라

step 2~20은 아래 범위로 이미 나뉘어 있다. `topic-plan.md`의 각 주제에 **담당 step 번호를
반드시 적어라.** 뒤 step들이 자기 몫을 이 문서로 찾는다.

| step | 담당 |
|---|---|
| 2 | `aws-core-services`, `s3-storage-classes`, `s3-versioning-lifecycle` |
| 3 | `s3-encryption-batch` + 주제 미정 중 S3 접근 제어·운영 계열 |
| 4 | `block-file-storage` |
| 5 | `data-transfer-services` |
| 6 | `rds-storage-features` |
| 7 | `aurora-dynamodb-cache` |
| 8 | `compute-delivery` 중 EC2·Auto Scaling·ELB 계열 |
| 9 | `compute-delivery` 중 CloudFront·Global Accelerator·엣지 계열 |
| 10 | `serverless-containers` 중 Lambda 계열 |
| 11 | `serverless-containers` 중 ECS·EKS·Fargate·API Gateway·Step Functions 계열 |
| 12 | `messaging-backup` 중 SQS·SNS·EventBridge 계열 |
| 13 | `messaging-backup` 중 AWS Backup 계열 + 주제 미정 중 재해 복구 계열 |
| 14 | `vpc-networking`, `security-groups-nacl`, `hybrid-connectivity` |
| 15 | `analytics-monitoring` 중 분석·스트리밍 계열 |
| 16 | `analytics-monitoring` 중 모니터링 계열 + `route53` |
| 17 | `identity-access` |
| 18 | `secrets-encryption`, `threat-protection` |
| 19 | `cost-management` + 주제 미정 중 거버넌스·IaC·Systems Manager 계열 |
| 20 | 주제 미정 중 AI·ML 계열과 나머지 잔여 |

step 9는 step 8이 만든 주제 옆에, step 11은 step 10 옆에 놓이는 구조다.
**한 기존 주제를 두 step이 나눠 맡는 경우(8·9, 10·11, 12·13, 15·16), 두 step의 주제가
배열에서 서로 인접해야 한다.** `topic-plan.md`에 그 순서를 못박아라.

## Acceptance Criteria

```bash
# 1. 배정표가 618개념을 빠뜨리지 않는가 — 예상 개념 수의 합
grep -oE '기존 [0-9]+ \+ 신규 [0-9]+' docs/source/dump-gaps/topic-plan.md \
  | awk '{e+=$2; n+=$5} END {print "기존", e, "신규", n, "합", e+n}'
# → 기존 182 신규 436 합 618

# 2. 주제 수와 개념 수 범위
grep -c '^## ' docs/source/dump-gaps/topic-plan.md          # 30~50
grep -oE '= [0-9]+$' docs/source/dump-gaps/topic-plan.md | tr -d '= ' \
  | awk '{ if ($1 < 9 || $1 > 20) print "범위 밖:", $1 }'    # 있으면 근거가 문서에 있어야 한다

# 3. topicId 중복이 없다
grep -oE '^## [a-z0-9-]+' docs/source/dump-gaps/topic-plan.md | sort | uniq -d   # 비어야 한다

# 4. 모든 주제에 담당 step이 붙었다
[ "$(grep -c '^## ' docs/source/dump-gaps/topic-plan.md)" = "$(grep -c '담당 step' docs/source/dump-gaps/topic-plan.md)" ] && echo OK

# 5. collect-gaps.py가 동작한다
python3 scripts/collect-gaps.py --list
python3 scripts/collect-gaps.py block-file-storage | grep -c '^### `'   # 32
python3 scripts/collect-gaps.py '(주제 미정)' | grep -c '^### `'         # 41

# 6. src/를 건드리지 않았다
git diff --name-only | grep '^src/' && echo "위반" || echo "OK"

# 7. 회귀가 없다
npm run build && npm test
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 헷갈리는 짝 표의 짝들이 **실제로 같은 주제에 배치됐는가?**
   - 주제 이름이 서비스 이름을 담고 있는가? (`lambda-advanced` 같은 크기 기준 이름이 없는가)
   - 3단 구분이 모든 주제에 적혀 있는가?
   - `Importance` 값이 3·2·0 밖으로 나가지 않았는가?
   - step 8·9, 10·11, 12·13, 15·16의 주제가 배열에서 인접한가?
3. 결과에 따라 `phases/26-concept-merge/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **확정한 주제 수, 기존 주제를 어떻게 쪼갰는지, 새로 만든 주제 이름**을 담아라.
다음 step들이 이 요약을 컨텍스트로 받는다.

## 금지사항

- **`src/`를 고치지 마라.** 이유: 이 step은 계획만 세운다. 코드 변경은 step 2부터다.
- **개념 하나하나의 배정을 이 문서에 적지 마라.** 이유: 436개 본문을 다 읽어야 하고
  컨텍스트가 남지 않는다. 개념 단위 배정은 담당 step이 자기 범위만 읽고 정한다.
- **개념을 새로 만들거나 문장을 고치지 마라.** 이유: 출처는 `dump-gaps/`와
  `concepts-raw.md`뿐이다(ADR-021·ADR-006).
- **`Concept`·`Topic` 타입에 필드를 추가하지 마라.** 이유: 3단 정렬은 배열 순서로 표현한다.
  필드를 넣으면 UI·테스트·데이터 검증이 전부 따라와 이 phase의 범위를 넘는다.
- **주제 수를 20개로 유지하려 하지 마라.** 이유: 그게 이 phase가 푸는 문제다.
- **크기를 맞추려고 서비스를 쪼개지 마라.** 이유: 규칙 1·2가 이 step의 핵심이다.
- 기존 테스트를 깨뜨리지 마라.
