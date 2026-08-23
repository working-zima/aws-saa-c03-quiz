# Step 2: concepts-gap-compute

## 읽어야 할 파일

- `/docs/ADR.md` — **ADR-008이 이 phase의 핵심이다.** 출처가 둘로 늘었다. ADR-006도 함께 읽어라.
- `/docs/source/exam-gaps.md` — **이 step의 유일한 출처다.**
- `/phases/1-exam-gaps/step0.md` — 앞선 개념 step. **같은 규칙을 그대로 따른다.**
- 이전 산출물: `src/data/topics.json`, `src/types/content.ts`, `src/data/data.test.ts`

**`src/data/topics.json`을 먼저 읽어라.** 기존 concept의 결에 맞춰라. 새 스타일을 만들지 마라.

## 이 phase의 원칙 (step 0과 동일)

주제를 새로 만들지 않는다. 주제 수는 22개 그대로다.
기존 주제 객체의 `concepts` 배열 **끝에** 새 concept을 이어 붙인다.
주제의 `id`·`title`·`importance`·`sourcePages`는 **절대 건드리지 마라.**
기존 concept 객체를 수정하거나 순서를 바꾸지 마라.

## 작업

`docs/source/exam-gaps.md`에서 아래 주제들의 항목을 읽고, `src/data/topics.json`의
해당 주제 `concepts` 배열 끝에 이어 붙인다.

### 채울 주제와 개념 (표 순서대로)

| topicId | concept slug | 개수 |
|---|---|---|
| `compute-delivery` | `warm-pool`, `scheduled-scaling`, `alb-l7-vs-nlb-l4`, `sticky-session-tradeoff`, `global-accelerator-protocols`, `cloudfront-ttl`, `edge-keyword` | 7 |
| `serverless-containers` | `eks`, `fargate-no-time-limit`, `lambda-function-url`, `lambda-at-edge`, `lambda-vpc-access`, `api-gateway-jwt-authorizer`, `aws-batch` | 7 |
| `messaging-backup` | `msk`, `sqs-details`, `sqs-queue-depth-scaling`, `eventbridge-scheduler`, `step-functions-features`, `ses`, `backup-long-term-retention` | 7 |

**합계 21개 concept.** slug는 `exam-gaps.md`의 `### `...`` 제목에 있는 값 그대로 쓴다.

### Concept 만드는 법

step 0과 같다. 요약하면:

- `id` — `{topicId}.{slug}`
- `name` — `###` 줄의 ` — ` 뒤 이름 그대로
- `summary` — **60자 이내로 압축.** 숫자·리전 이름·제약 조건은 반드시 남긴다.
- `paragraphs` — `**한 줄**:` 아래 본문 문단들을 순서대로. 빈 줄로 나뉜 문단이 원소 하나다.
- `> [섹션 #N pP] "..."` 인용 블록은 **넣지 마라.** 근거 표시일 뿐 학습자가 읽을 글이 아니다.
- 학습자 화면 금지어: `원본에서`, `문서에서`, `본문에서`, `위 글에 따르면`, `덤프`, `해설`, `[섹션 ...]`, `p314`
- `exam-gaps.md`에 없는 AWS 지식을 끌어오지 마라. 문장을 매끄럽게 다시 쓰지도 마라.

## 기존 테스트 손보기

`src/data/data.test.ts`에 주제별 개념 수를 하드코딩한 단언이 있다.
이 step에서 개념을 더하면 **아래 단언이 깨진다. 새 값으로 고쳐라.**

- `topics.slice(8, 15).map((topic) => topic.concepts.length)`
  - 현재: `[7, 8, 4, 4, 4, 7, 4]`
  - 갱신 후: `[7, 8, 11, 11, 11, 7, 4]`

이 단언의 **의도는 "주제마다 정해진 수의 개념이 있다"를 지키는 것**이다.
단언을 지우거나 느슨하게 바꾸지 마라. 숫자만 갱신하라.

추가로 이 step의 결과를 검증하는 테스트를 넣어라:

- 위 주제들에 지정한 slug의 concept이 **배열 끝에** 붙었는지
- 주제 수가 여전히 22개이고, 각 주제의 `title`·`importance`·`sourcePages`가 그대로인지

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

추가 확인:
```bash
node -e "const t=require('./src/data/topics.json'); console.log(t.length, t.reduce((n,x)=>n+x.concepts.length,0))"
```
→ `22 136`이 나와야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 데이터 체크리스트를 확인한다:
   - 주제가 22개 그대로인가?
   - 새 concept 21개가 각 주제의 `concepts` **끝에** 붙었는가?
   - 기존 concept이 내용·순서 그대로인가?
   - 모든 `summary`가 60자 이내인가? 숫자·리전 이름이 살아 있는가?
   - `paragraphs`에 `>` 인용이나 `[섹션 ...]` 표기가 섞이지 않았는가?
   - 깨진 개념 수 단언을 **지우지 않고 숫자만** 갱신했는가?
3. 결과에 따라 `phases/1-exam-gaps/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 주제를 새로 만들지 마라. 이유: 이 phase는 기존 주제를 채우는 작업이다.
- 주제의 `title`·`importance`·`sourcePages`를 고치지 마라. 이유: 기존 테스트가 이 값을 단언한다.
- 기존 concept을 수정·삭제·재정렬하지 마라. 이유: 이미 검수가 끝났다.
- 다른 step이 맡은 주제의 concept을 미리 넣지 마라. 이유: step마다 검수 단위가 다르다.
- 개념 수 단언을 삭제하거나 `toBeGreaterThan` 같은 느슨한 형태로 바꾸지 마라.
  이유: 그 단언이 데이터 누락을 잡는 유일한 장치다.
- 문제(`questions.json`)를 만들지 마라. 이유: 문제는 step 5~9다.
- UI 컴포넌트를 건드리지 마라. 이유: 화면은 0-mvp에서 끝났다.
- `docs/source/*.md`를 수정하지 마라. 이유: 출처는 읽기 전용이다.
