# Step 12: questions-data-network

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` — "문제 은행" 절. 출제 원칙이 여기 있다.
- `/docs/ADR.md` — ADR-005(4지선다 단일정답), **ADR-006(원본이 유일한 출처)**
- `/docs/source/concepts-raw.md` — 원본. 19~35페이지가 이 step의 범위다.
- `/phases/0-mvp/step7.md` — 앞선 문제 step. 같은 규칙을 따른다.
- 이전 step 산출물: `src/data/topics.json`(주제 22개), `src/data/questions.json`(57문항),
  `src/types/content.ts`, `src/data/data.test.ts`

**`src/data/topics.json`과 `src/data/questions.json`을 먼저 읽어라.**
`conceptId`는 topics.json에 실재하는 id여야 하고, 기존 문제들의 문체·해설 길이에 맞춰야 한다.

## 작업

`src/data/questions.json` 배열 **끝에** 아래 주제들의 확인 문제를 이어 붙인다.
기존 문항을 건드리지 마라.

### 주제별 문항 수

| topicId | 문항 수 | id 범위 |
|---|---|---|
| `rds-storage-features` | 8 | q058–q065 |
| `aurora-dynamodb-cache` | 8 | q066–q073 |
| `compute-delivery` | 9 | q074–q082 |
| `serverless-containers` | 8 | q083–q090 |
| `messaging-backup` | 9 | q091–q099 |
| `vpc-networking` | 9 | q100–q108 |
| `hybrid-connectivity` | 8 | q109–q116 |

**합계 59문항 (q058–q116).** 문항 수와 id 범위를 정확히 지켜라.
id는 `q` + 3자리 zero-padding이다.

### 문제 쓰는 법

이 앱은 시험 시뮬레이터가 아니라 **개념 학습 도구**다 (PRD 참조).
"이 서비스가 뭘 하는지 아는가"를 묻는 문제가 기본이고, 상황형은 보조다.
주제당 상황형은 3분의 1을 넘기지 마라.

각 문항:

- `prompt` — 한 문장 또는 짧은 상황. 원본에 나온 사실만으로 답이 정해져야 한다.
- `choices` — 정확히 4개. 서로 명확히 다르고 길이가 비슷해야 한다.
  **정답만 유독 길거나 상세하면 안 된다.** 길이로 정답을 맞힐 수 있게 된다.
- `answerIndex` — 0~3.
- `explanation` — 왜 그 답이 맞는지 + 헷갈리는 오답이 왜 틀렸는지. 2~3문장.
- `conceptId` — 근거가 된 concept의 id. `topics.json`에 실재해야 한다.
- `topicId` — 위 표의 값.

### 오답 선택지

**원본에 등장하는 다른 서비스·개념에서 고른다.** 지어내지 마라.
목적은 "헷갈리는 짝"을 구분하는 연습이다. 명백히 틀린 보기로 채우면
4지선다가 사실상 2지선다가 된다. 하지 마라.

### 학습자가 읽는 글이라는 점

문제·보기·해설은 **앱 화면에 그대로 나온다.** 제작 과정을 가리키는 말을 쓰지 마라.

- 금지: `원본에서 ~라고 제시한`, `원본은 ~로 구분한다`, `문서에서`, `본문에서`, `위 글에 따르면`
- 이유: 학습자 화면에는 '원본'이라는 것이 없다. 무엇을 가리키는지 알 수 없는 말이 된다.
- 대신 사실을 그냥 진술하라: `온프레미스의 반대말은?` / `Glacier가 아니면서 접근이 드물면 Standard-IA를 쓴다.`

### 중복보다 미달이 낫다

같은 사실을 묻는 문제를 문구만 바꿔 두 번 내지 마라.
정답이 같고 묻는 사실이 같으면 문구가 달라도 중복이다.

원본 분량이 얇아서 표의 문항 수를 채우면 중복이 불가피하다면, **채우지 마라.**
실제로 만들 수 있는 만큼만 만들고, `summary`에 어느 주제를 몇 문항 줄였고 왜인지 적어라.
빈 껍데기 문항을 채워 넣는 것보다 낫다.

### 정답 위치 분포

`answerIndex`를 0~3에 고르게 분산하라. 이 step의 59문항 안에서 각 위치가
전체의 20~30% 사이여야 한다.

### 지킬 것

- CRITICAL: 원본에 없는 AWS 지식을 끌어오지 마라 (ADR-006). 정확한 요금, 원본에 없는 서비스,
  최신 기능, 시험 출제 경향 같은 걸 넣지 마라. 근거는 전부 19~35페이지 안에 있어야 한다.
- 같은 개념을 묻는 문제를 문구만 바꿔 중복 출제하지 마라. 기존 57문항과도 겹치면 안 된다.
- 문제·보기·해설에 이모지를 쓰지 마라.
- 문제·보기·해설에 '원본', '문서에서' 같은 제작 과정 용어를 쓰지 마라. 이유: 학습자 화면에 그대로 노출된다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

추가 확인:
```bash
node -e "
const q=require('./src/data/questions.json');
const c={}; q.forEach(x=>c[x.answerIndex]=(c[x.answerIndex]||0)+1);
console.log('총', q.length, '마지막', q[q.length-1].id, '정답분포', c);
"
# 총 116, 마지막 q116
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 데이터 체크리스트를 확인한다:
   - 새 문항이 배열 **끝에** 붙었는가? 기존 57문항이 그대로인가?
   - 주제별 문항 수와 id 범위가 표와 일치하는가?
   - 모든 `conceptId`가 `topics.json`에 실재하는가?
   - `answerIndex` 분포가 한쪽으로 쏠리지 않았는가?
   - 원본에 없는 내용을 근거로 삼은 문제가 없는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에 누적 총 문항 수와 마지막 id를 적어라.

## 금지사항

- 주제 16번 이후(Route 53, 보안, 비용 등) 문제를 만들지 마라. 이유: step 13의 범위다.
- 기존 문항을 수정하거나 재정렬하지 마라. 이유: 이미 검수가 끝났다.
- 복수정답·순서맞추기·주관식 문제를 만들지 마라. 이유: ADR-005다.
- `topics.json`을 수정하지 마라. 이유: 개념 데이터는 확정됐다.
- 새 `conceptId`를 지어내지 마라. 이유: 참조 무결성 테스트가 깨진다.
- UI 컴포넌트를 건드리지 마라.
- 기존 테스트를 깨뜨리지 마라.
