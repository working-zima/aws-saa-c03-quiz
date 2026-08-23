# Step 11: concepts-security-ops

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ADR.md` — **ADR-006이 이 step의 핵심이다.** 원본에 없는 내용을 지어내지 마라.
- `/docs/source/concepts-raw.md` — **원본. 이 step의 유일한 출처다.**
- `/phases/0-mvp/step2.md` — 앞선 개념 step. 같은 규칙을 따른다.
- 이전 step 산출물: `src/data/topics.json`(주제 ), `src/types/content.ts`, `src/data/data.test.ts`

**`src/data/topics.json`을 먼저 읽어라.** 기존 주제들이 concept을 어떻게 나눴는지,
id·summary·paragraphs를 어떤 결로 썼는지 보고 **그대로 맞춰라.** 새 스타일을 만들지 마라.

## 작업

`docs/source/concepts-raw.md`의 **36~50페이지**를 읽고, 아래  주제를
`src/data/topics.json` 배열 **끝에 이어 붙인다.** 기존 항목을 건드리지 마라.

원본은 `<!-- ===== PAGE N ===== -->` 주석으로 페이지가 구분돼 있다.

### 채울 주제 (순서대로)

| id | title | importance | sourcePages |
|---|---|---|---|
| `route53` | Route 53 | 2 | [36, 37] |
| `analytics-monitoring` | EMR·Spark·Redshift·Athena·Kinesis·Glue·X-Ray·CloudWatch | 2 | [38, 40] |
| `security-groups-nacl` | 보안 그룹·NACL | 3 | [41, 43] |
| `secrets-encryption` | Secrets Manager·Parameter Store·KMS·ACM | 3 | [44, 44] |
| `threat-protection` | WAF·Shield·GuardDuty·Macie·CloudFront | 3 | [45, 47] |
| `identity-access` | IAM·Identity Center·STS·Cognito·CloudTrail | 3 | [48, 49] |
| `cost-management` | 절약 플랜·Budgets·Cost Explorer·Billing and Cost Management·Trusted Advisor | 2 | [50, 50] |

id·title·importance·sourcePages는 위 표 그대로 쓴다. 임의로 바꾸지 마라.

### Concept 나누는 기준

원본에서 `✅`로 시작하는 항목 하나가 `Concept` 하나다.

- `id`: `{topicId}.{서비스 slug}` 형식. slug는 kebab-case 영문. 전역에서 유일해야 한다.
- `name`: 서비스/개념의 표시 이름. 원본 표기를 따른다.
- `summary`: 한 줄 요약. 원본에 `💡한 줄 요약 :`이 있으면 그 문장을 쓴다.
  없으면 원본 첫 문장에서 한 줄로 뽑는다. 60자 이내.
- `paragraphs`: 설명 본문을 문단 단위로 나눈 평문 배열.

### 원본을 다룰 때 지킬 것

- **내용을 보태지 마라.** 원본에 없는 AWS 지식을 끌어오지 마라. ADR-006이다.
- **다음은 걷어내라** — 원본의 추출 아티팩트다:
  - 페이지 하단에 반복되는 머리말과 쪽번호
  - `📖` `✅` `💡` 같은 이모지 (UI_GUIDE에서 이모지를 금지한다)
  - `출처 : https://...` 줄
- **여는 괄호가 유실된 구간을 복원하라.** 원본에 `DNSDomain Name System)` 같은 형태가 있다.
  올바른 표기는 `DNS(Domain Name System)`다. 의미로 판단해 여는 괄호를 넣어라.
- 문단 안에서 줄이 끊긴 곳은 이어 붙여 한 문단으로 만들어라.
- 원본의 표현과 어투는 유지한다. 매끄럽게 다시 쓰지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

추가 확인:
```bash
node -e "const t=require('./src/data/topics.json'); console.log(t.length, t.map(x=>x.id).join(','))"
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 데이터 체크리스트를 확인한다:
   - 새 주제  배열 **끝에** 붙었는가? 기존 주제가 그대로인가?
   - id·importance·sourcePages가 표와 일치하는가?
   - 각 주제의 concept이 원본의 `✅` 항목 수와 맞는가?
   - concept id가 전역에서 유일한가?
   - 이모지·쪽번호·머리말·출처 URL이 남아 있지 않은가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 주제 1~15번을 다시 만들지 마라. 이유: step 2와 10에서 이미 채웠다.
- 기존 주제의 내용을 수정하지 마라. 이유: 이미 검수가 끝났다.
- 문제(`questions.json`)를 만들지 마라. 이유: 문제는 별도 step이다.
- UI 컴포넌트를 건드리지 마라. 이유: 화면은 step 9에서 끝났다.
- 원본을 요약하거나 재서술하지 마라. 문단을 옮기되 내용을 바꾸지 마라.
- `docs/source/concepts-raw.md`를 수정하지 마라. 이유: 원본은 읽기 전용이다.
- 기존 테스트를 깨뜨리지 마라.
