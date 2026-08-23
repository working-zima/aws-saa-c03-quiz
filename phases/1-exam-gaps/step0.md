# Step 0: concepts-gap-foundation

## 읽어야 할 파일

- `/docs/ADR.md` — **ADR-008이 이 phase의 핵심이다.** 출처가 둘로 늘었다. ADR-006도 함께 읽어라.
- `/docs/source/exam-gaps.md` — **이 step의 유일한 출처다.** 문제 덤프 해설에서 추린 보충 개념.
- `/phases/0-mvp/step11.md` — 앞선 개념 step. 개념을 쓰는 결은 여기에 맞춘다.
- 이전 산출물: `src/data/topics.json`(주제 22개, 개념 97개), `src/types/content.ts`, `src/data/data.test.ts`

**`src/data/topics.json`을 먼저 읽어라.** 기존 concept의 id·summary·paragraphs가 어떤 결로 쓰였는지
보고 **그대로 맞춰라.** 새 스타일을 만들지 마라.

## 이 phase가 0-mvp와 다른 점

0-mvp는 주제를 배열 **끝에 새로 붙였다.** 이 phase는 **기존 주제 안에 개념을 끼워 넣는다.**

- 주제를 새로 만들지 않는다. 주제 수는 22개 그대로다.
- 기존 주제 객체의 `concepts` 배열 **끝에** 새 concept을 이어 붙인다.
- 주제의 `id`·`title`·`importance`·`sourcePages`는 **절대 건드리지 마라.**
  `sourcePages`는 `concepts-raw.md`의 페이지 범위를 뜻한다. 새 개념의 출처가 다른 문서라고 해서
  이 값을 바꾸면 안 된다.
- 기존 concept 객체를 수정하거나 순서를 바꾸지 마라.

## 작업

`docs/source/exam-gaps.md`에서 아래 주제들의 항목을 읽고, `src/data/topics.json`의
해당 주제 `concepts` 배열 끝에 이어 붙인다.

### 채울 주제와 개념 (표 순서대로)

| topicId | concept slug | 개수 |
|---|---|---|
| `aws-core-services` | `exam-heuristics` | 1 |
| `s3-versioning-lifecycle` | `object-lock-prerequisites`, `event-notification` | 2 |
| `s3-encryption-batch` | `envelope-encryption`, `sse-kms-cost` | 2 |
| `block-file-storage` | `cluster-placement-group`, `ebs-elastic-volumes`, `efs-lifecycle-management`, `fsx-ontap-multi-az` | 4 |

**합계 9개 concept.** slug는 `exam-gaps.md`의 `### \`...\`` 제목에 있는 값 그대로 쓴다.

### Concept 만드는 법

`exam-gaps.md`의 `### \`slug\` — 이름` 항목 하나가 `Concept` 하나다.

- `id` — `{topicId}.{slug}`. 예: `s3-encryption-batch.sse-kms-cost`
- `name` — `###` 줄의 ` — ` 뒤에 있는 이름을 그대로 쓴다.
- `summary` — **60자 이내로 압축한다.** `**한 줄**:` 문장이 60자를 넘으면 줄여라.
  줄일 때 **숫자·리전 이름·제약 조건은 반드시 남겨라.** 그게 이 개념의 존재 이유다.
  예: "CloudFront에서 사용자 지정 도메인에 HTTPS를 적용하려면 ACM 인증서를 반드시 us-east-1(버지니아 북부)에서
  만들어야 한다" → "CloudFront용 인증서는 us-east-1에서 발급해야 한다."
- `paragraphs` — `**한 줄**:` 아래의 본문 문단들을 순서대로 담는다. 빈 줄로 나뉜 문단이 배열 원소 하나다.

### 인용 블록은 앱에 넣지 마라

`exam-gaps.md`의 각 항목 끝에는 `> [섹션 #N pP] "..."` 형태의 덤프 원문 인용이 있다.
이건 **근거를 되짚기 위한 표시**이지 학습자가 읽을 글이 아니다. `paragraphs`에 넣지 마라.

### 학습자가 읽는 글이라는 점

`name`·`summary`·`paragraphs`는 **앱 화면에 그대로 나온다.** 제작 과정을 가리키는 말을 쓰지 마라.

- 금지: `원본에서`, `문서에서`, `본문에서`, `위 글에 따르면`, `덤프`, `해설`, `[섹션 ...]`, `p314`
- 이유: 학습자 화면에는 '원본'도 '덤프'도 없다. 무엇을 가리키는지 알 수 없는 말이 된다.
- `exam-gaps.md` 본문에 있는 "선택지", "오답", "문제에 ~가 나오면" 같은 표현은 **그대로 써도 된다.**
  이건 시험 문제 이야기라 학습자가 읽어서 뜻이 통한다.

### 내용을 보태지 마라

`exam-gaps.md`에 없는 AWS 지식을 끌어오지 마라. ADR-008이다.
문장을 매끄럽게 다시 쓰지도 마라. 문단을 옮기되 내용을 바꾸지 마라.

## 기존 테스트 손보기

`src/data/data.test.ts`에 주제별 개념 수를 하드코딩한 단언이 있다.
이 step에서 손대는 주제(인덱스 0, 4, 5, 6)는 그 단언 범위(`slice(8,15)`, `slice(15,22)`)
밖이므로 **깨지지 않는다.** 그대로 두어라.

대신 이 step의 결과를 검증하는 테스트를 추가하라:

- 위 4개 주제에 지정한 slug의 concept이 **배열 끝에** 붙었는지
- concept id가 `{topicId}.{slug}` 형식인지
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
→ `22 106`이 나와야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 데이터 체크리스트를 확인한다:
   - 주제가 22개 그대로인가? 새 주제를 만들지 않았는가?
   - 새 concept 9개가 각 주제의 `concepts` **끝에** 붙었는가?
   - 기존 concept 97개가 내용·순서 그대로인가?
   - 모든 `summary`가 60자 이내인가? 숫자·리전 이름이 살아 있는가?
   - `paragraphs`에 `>` 인용이나 `[섹션 ...]` 표기가 섞이지 않았는가?
3. 결과에 따라 `phases/1-exam-gaps/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 주제를 새로 만들지 마라. 이유: 이 phase는 기존 주제를 채우는 작업이다.
- 주제의 `title`·`importance`·`sourcePages`를 고치지 마라. 이유: 기존 테스트가 이 값을 단언한다.
- 기존 concept을 수정·삭제·재정렬하지 마라. 이유: 이미 검수가 끝났다.
- 다른 step이 맡은 주제의 concept을 미리 넣지 마라. 이유: step마다 검수 단위가 다르다.
- 문제(`questions.json`)를 만들지 마라. 이유: 문제는 step 5~9다.
- UI 컴포넌트를 건드리지 마라. 이유: 화면은 0-mvp에서 끝났다.
- `docs/source/*.md`를 수정하지 마라. 이유: 출처는 읽기 전용이다.
- 기존 테스트를 깨뜨리지 마라.
