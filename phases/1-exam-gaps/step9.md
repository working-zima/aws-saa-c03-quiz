# Step 9: questions-gap-security

## 읽어야 할 파일

- `/docs/PRD.md` — "문제 은행" 절. 출제 원칙이 여기 있다.
- `/docs/ADR.md` — ADR-005(4지선다 단일정답), **ADR-008(출처가 둘이다)**
- `/docs/source/exam-gaps.md` — **이 step의 유일한 출처다.**
- `/phases/0-mvp/step12.md` — 앞선 문제 step. **출제 규칙을 그대로 따른다.**
- `/phases/1-exam-gaps/step4.md` — 이 step이 문제로 만들 개념을 넣은 step이다.
- 이전 산출물: `src/data/topics.json`, `src/data/questions.json`, `src/data/data.test.ts`

**`src/data/topics.json`과 `src/data/questions.json`을 먼저 읽어라.**
`conceptId`는 topics.json에 실재하는 id여야 하고, 기존 문항의 문체·해설 길이에 맞춰야 한다.

## 작업

`src/data/questions.json` 배열 **끝에** 아래 문항을 이어 붙인다. 기존 문항을 건드리지 마라.

### 주제별 문항 수

| topicId | 문항 수 | id 범위 |
|---|---|---|
| `security-groups-nacl` | 3 | q224–q226 |
| `secrets-encryption` | 4 | q227–q230 |
| `threat-protection` | 6 | q231–q236 |
| `identity-access` | 6 | q237–q242 |
| `cost-management` | 4 | q243–q246 |

**합계 23문항 (q224–q246).** id는 `q` + 3자리 zero-padding이다.

### 개념 하나에 문항 하나

이 phase의 문항은 step 4에서 추가한 **새 concept과 1:1로 대응한다.**

- step 4에서 주제 `X`에 concept을 N개 넣었으면, 이 step은 주제 `X`에 문항을 N개 만든다.
- 각 문항의 `conceptId`는 **step 4에서 새로 추가한 concept 중 하나**이며,
  같은 concept을 두 문항이 쓰지 않는다. 새 concept 전부가 정확히 한 번씩 쓰여야 한다.
- 기존 concept(0-mvp에서 만든 것)을 `conceptId`로 쓰지 마라. 그건 이미 문항이 있다.

### 문제 쓰는 법

이 앱은 시험 시뮬레이터가 아니라 **개념 학습 도구**다 (PRD 참조).

이 phase의 개념은 대부분 **규칙·제약·서비스 구분**이다. 그래서 묻는 방식도 그쪽에 맞춘다:

- 숫자·리전 이름이 있는 개념은 **그 값을 직접 묻는다.**
  예: "CloudFront에 사용자 지정 도메인의 HTTPS를 적용할 때 ACM 인증서를 발급해야 하는 리전은?"
- 서비스 구분이 핵심인 개념은 **헷갈리는 짝과 나란히 놓고 고르게 한다.**
  예: DAX와 ElastiCache, Client VPN과 Site-to-Site VPN, Detective와 Inspector.
- 상황형은 보조다. 주제당 3분의 1을 넘기지 마라.

각 문항:

- `prompt` — 한 문장 또는 짧은 상황. `exam-gaps.md`에 나온 사실만으로 답이 정해져야 한다.
- `choices` — 정확히 4개. 서로 명확히 다르고 길이가 비슷해야 한다.
  **정답만 유독 길거나 상세하면 안 된다.** 길이로 정답을 맞힐 수 있게 된다.
- `answerIndex` — 0~3. 아래 분포를 지킨다.
- `explanation` — 왜 그 답이 맞는지 + 헷갈리는 오답이 왜 틀렸는지. 2~3문장.
- `conceptId` — 근거가 된 concept의 id. `topics.json`에 실재해야 한다.
- `topicId` — 위 표의 값.

### 정답 위치 분포 (정확히 지켜라)

| answerIndex | 문항 수 |
|---|---|
| 0 | 6 |
| 1 | 6 |
| 2 | 6 |
| 3 | 5 |

phase 전체(77문항)에서 20/19/19/19가 되도록 step마다 나눠 둔 값이다. 임의로 바꾸지 마라.

### 오답 선택지

**두 출처(`concepts-raw.md`, `exam-gaps.md`)에 등장하는 다른 서비스·개념에서 고른다.**
지어내지 마라. 목적은 "헷갈리는 짝"을 구분하는 연습이다.
명백히 틀린 보기로 채우면 4지선다가 사실상 2지선다가 된다. 하지 마라.

`exam-gaps.md`의 각 항목에는 덤프 해설이 오답으로 지목한 서비스가 적혀 있다.
그것들이 가장 좋은 오답 선택지다.

### 학습자가 읽는 글이라는 점

문제·보기·해설은 **앱 화면에 그대로 나온다.** 제작 과정을 가리키는 말을 쓰지 마라.

- 금지: `원본에서`, `원본은`, `문서에서`, `본문에서`, `위 글에 따르면`, `덤프`, `해설지`, `[섹션 ...]`
- 이유: 학습자 화면에는 '원본'도 '덤프'도 없다. 무엇을 가리키는지 알 수 없는 말이 된다.
- 대신 사실을 그냥 진술하라: `CloudFront용 인증서는 us-east-1에서 발급한다.`

### 중복보다 미달이 낫다

같은 사실을 묻는 문제를 문구만 바꿔 두 번 내지 마라.
정답이 같고 묻는 사실이 같으면 문구가 달라도 중복이다.

## 기존 테스트

step 5에서 `questions.slice(116, 169)`로 범위를 닫아 두었다. 이 step에서는 기존 단언이 깨지지 않는다.
그래도 `npm run test`로 확인하고, 깨진다면 **범위를 넓히지 말고** 원인을 먼저 찾아라.

### 이 phase 전체의 정답 분포 검사 (이 step에서만 추가)

이 step은 phase의 마지막 문항 step이다. q170~q246 **77문항 전체**에 대해
정답 위치가 고르게 퍼졌는지 검사하는 테스트를 추가하라:

```ts
const gapQuestions = questions.slice(169, 246)
```

각 `answerIndex`(0~3)의 비율이 0.2 이상 0.3 이하여야 한다.
step 5~9의 지정 분포를 그대로 지키면 20/19/19/19가 되어 이 범위에 들어온다.

### ADR-002의 문항 수 갱신

`docs/ADR.md`의 ADR-002에 "**문제가 169개로 고정된다**"는 문장이 있다.
이 phase가 끝나면 246개가 된다. 그 숫자를 갱신하라. 다른 문장은 건드리지 마라.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

추가 확인:
```bash
node -e "const q=require('./src/data/questions.json'); console.log(q.length, q[q.length-1].id)"
```
→ `246 q246`가 나와야 한다.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 데이터 체크리스트를 확인한다:
   - 문항 23개가 배열 **끝에** 붙었는가? id가 q224부터 q246까지 빠짐없이 이어지는가?
   - 주제별 문항 수가 표와 일치하는가?
   - 모든 `conceptId`가 step 4에서 추가한 새 concept이고, 중복 없이 한 번씩 쓰였는가?
   - `answerIndex` 분포가 지정한 값과 정확히 일치하는가?
   - 보기 4개가 서로 다르고 길이가 비슷한가? 정답만 유독 길지 않은가?
   - 학습자 화면 금지어가 섞이지 않았는가?
3. 결과에 따라 `phases/1-exam-gaps/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 기존 문항을 수정·삭제·재정렬하지 마라. 이유: 이미 검수가 끝났다.
- `topics.json`을 건드리지 마라. 이유: 개념은 step 0~4에서 끝났다.
- 다른 step이 맡은 주제의 문항을 미리 만들지 마라. 이유: step마다 검수 단위가 다르다.
- 기존 테스트의 슬라이스 범위를 넓혀 단언을 피해가지 마라. 이유: 그러면 회귀를 못 잡는다.
- UI 컴포넌트를 건드리지 마라. 이유: 화면은 0-mvp에서 끝났다.
- `docs/source/*.md`를 수정하지 마라. 이유: 출처는 읽기 전용이다.
