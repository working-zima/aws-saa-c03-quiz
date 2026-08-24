# Step 0: merge-basic-topics

## 배경

주제 목록 22개 중 문항이 8개 미만인 주제가 둘 있다.

| 주제 | 문항 | 개념 | 중요도 | 원본 페이지 |
|------|------|------|--------|-------------|
| `aws-core-services` AWS 핵심 서비스 개요 | 9 | 9 | 0(기초) | p1–4 |
| `region-availability` 리전·가용성·가용 영역·다중 AZ | 5 | 5 | 0(기초) | p5–6 |
| `onpremise-migration` 온프레미스와 마이그레이션 | **2** | 2 | 0(기초) | p7 |
| (나머지 19개) | 8~16 | 5~14 | 2 또는 3 | p8~50 |

`onpremise-migration`은 개념 2개·문항 2개다. 주제 목록에서 한 칸을 차지하고 화면 두 개
(개념 읽기 → 확인 문제)를 거치게 하는데, 실제 분량은 용어 정의 두 줄이다.

세 주제는 모두 중요도 0이고 원본 페이지도 p1–7로 연속이다. **하나로 합친다.**
합친 주제는 문항 16개로, 기존 최대 주제(`messaging-backup`, `compute-delivery`)와 같은 규모다.

이 step은 **데이터 파일만** 바꾼다. 화면 코드는 전부 `topics.json`/`questions.json`을
그대로 읽으므로 `src/pages/`·`src/components/`·`src/lib/`는 손대지 않는다.

## 읽어야 할 파일

- `docs/ARCHITECTURE.md` — 데이터 계층 구조
- `src/types/content.ts` — `Topic`·`Concept`·`Question` 타입
- `src/data/topics.json` — 1~36줄에 대상 주제 3개가 있다
- `src/data/questions.json` — 대상 문항은 q001~q015, q170
- `src/data/data.test.ts` — 주제 메타데이터·개념 순서를 하드코딩 검증한다
- `scripts/check-structure.mjs`, `scripts/topics-baseline.json` — 구조 가드레일과 그 기준 스냅샷

## 작업 1 — `src/data/topics.json`

`region-availability`와 `onpremise-migration` 주제 객체를 **삭제**하고, 두 주제의 개념을
`aws-core-services`의 `concepts` 배열로 옮긴다. 결과는 주제 20개.

합쳐진 주제의 메타데이터:

| 필드 | 값 |
|------|-----|
| `id` | `aws-core-services` (**바꾸지 마라**) |
| `title` | `AWS 핵심 서비스·리전·가용 영역·온프레미스` |
| `importance` | `0` |
| `sourcePages` | `[1, 7]` |

`id`를 유지하는 이유: 진행률의 "읽음" 표시가 `topicId`를 localStorage 키로 쓴다
(`src/lib/progress.ts`의 `markTopicRead`). id를 바꾸면 이미 읽은 사용자의 기록까지 날아간다.
사라지는 두 주제의 읽음 기록은 어차피 무시되지만, 가장 큰 주제의 기록은 살린다.

### 개념 배열의 최종 순서 (16개)

```
 1  aws-core-services.ec2                 (그대로)
 2  aws-core-services.rds                 (그대로)
 3  aws-core-services.s3                  (그대로)
 4  aws-core-services.route-53            (그대로)
 5  aws-core-services.dns                 (그대로)
 6  aws-core-services.elb                 (그대로)
 7  aws-core-services.cloudfront          (그대로)
 8  aws-core-services.lambda              (그대로)
 9  aws-core-services.region              ← region-availability.region
10  aws-core-services.availability        ← region-availability.availability
11  aws-core-services.availability-zone   ← region-availability.availability-zone
12  aws-core-services.multi-az            ← region-availability.multi-az
13  aws-core-services.single-az           ← region-availability.single-az
14  aws-core-services.on-premise          ← onpremise-migration.on-premise
15  aws-core-services.migration           ← onpremise-migration.migration
16  aws-core-services.exam-heuristics     (기존 9번째 → 맨 뒤로 이동)
```

바뀌는 것은 **id 접두사와 순서뿐이다.** `name`·`summary`·`paragraphs`는 한 글자도 고치지 마라.

`exam-heuristics`(시험에서 자주 통하는 판단 기준)를 맨 뒤로 옮기는 이유는 둘이다.
하나, 내용상 기초 개념 전체를 훑고 나서 읽는 마무리 항목이다.
둘, `data.test.ts`의 "보충 개념 9개가 지정된 주제의 개념 배열 **끝에** 추가된다" 테스트가
`aws-core-services` 개념 배열의 마지막이 `exam-heuristics`임을 검증한다.

### CRITICAL — 파일 포맷

`topics.json`은 **개념 하나가 정확히 한 줄**이다:

```
      {"id":"...","name":"...","summary":"...","paragraphs":[...]},
```

`JSON.parse` → `JSON.stringify`로 파일 전체를 재직렬화하면 이 포맷이 깨지고
`scripts/check-structure.mjs`가 실패한다. 개념 줄은 **텍스트로 옮기고 id 문자열만 치환**하라.
개념 줄 총 개수는 작업 전후 모두 182줄이다.

## 작업 2 — `src/data/questions.json`

**7줄만** 고친다. q009~q015의 `topicId`와 `conceptId`다.

| 문항 | `topicId` | `conceptId` |
|------|-----------|-------------|
| q009 | `region-availability` → `aws-core-services` | `region-availability.region` → `aws-core-services.region` |
| q010 | 〃 | `region-availability.availability` → `aws-core-services.availability` |
| q011 | 〃 | `region-availability.availability-zone` → `aws-core-services.availability-zone` |
| q012 | 〃 | `region-availability.multi-az` → `aws-core-services.multi-az` |
| q013 | 〃 | `region-availability.single-az` → `aws-core-services.single-az` |
| q014 | `onpremise-migration` → `aws-core-services` | `onpremise-migration.on-premise` → `aws-core-services.on-premise` |
| q015 | 〃 | `onpremise-migration.migration` → `aws-core-services.migration` |

문항 **순서·id·본문(`prompt`·`choices`·`answerIndex`·`explanation`)은 전부 그대로 둔다.**
문항 id를 다시 매기지 마라. 이유: 진행률의 정답 기록이 `questionId`를 키로 쓴다
(`src/lib/progress.ts`의 `recordAnswer`). id를 바꾸면 사용자가 푼 기록이 전부 사라진다.
문항 한 줄 포맷(`{"id":"q009",...},`)도 유지한다.

## 작업 3 — `src/data/data.test.ts`

주제 배열이 22 → 20으로 줄면서 **인덱스 기반 슬라이스가 2씩 밀린다.** 아래 5곳을 고친다.

| 위치(현재 줄) | 지금 | 고친 뒤 |
|---------------|------|---------|
| 175 `it(...)` 제목 | `22개 주제의 메타데이터` | `20개 주제의 메타데이터` |
| 182~184 기대 배열 | 주제 3개 객체 | 합쳐진 주제 1개 객체(위 메타데이터 표의 값) |
| 534 | `topics.slice(15, 22)` | `topics.slice(13, 20)` |
| 551 | `topics.slice(15, 22)` | `topics.slice(13, 20)` |
| 557 | `topics.slice(8, 15)` | `topics.slice(6, 13)` |
| 574 | `topics.slice(8, 15)` | `topics.slice(6, 13)` |

슬라이스가 가리키는 **주제 목록과 개념 개수 배열의 값은 바꾸지 마라.** 인덱스만 밀렸을 뿐
`rds-storage-features`~`hybrid-connectivity`, `route53`~`cost-management` 구간의 내용은 그대로다.

문항 관련 테스트(`questions.slice(...)`)는 문항 순서를 바꾸지 않으므로 **손대지 않는다.**
`'aws-core-services': ['exam-heuristics']` 기대값(154줄)도 그대로 통과해야 한다 —
통과하지 않는다면 개념 순서가 위 사양과 다른 것이니 테스트가 아니라 데이터를 고쳐라.

새 테스트를 추가할 필요는 없다. 파일 끝의 전역 무결성 테스트("모든 문제가 실재하는 주제를
참조한다", "개념 id가 전역에서 유일하다" 등)가 이 변경의 회귀를 이미 잡는다.

## 작업 4 — `scripts/topics-baseline.json`

구조 가드레일의 기준 스냅샷이다. 이번 변경은 **의도적인 구조 변경**이므로 갱신한다
(`check-structure.mjs` 헤더 주석에 그렇게 적혀 있다).

- `topics` 배열: 주제 3개 항목을 합쳐진 항목 1개로 바꾼다. 개념은 `id`·`name` 쌍 16개를
  작업 1의 최종 순서대로 넣는다. 나머지 19개 주제 항목은 건드리지 마라.
- `conceptLineCount`: **182 그대로.** 개념 총 개수는 변하지 않는다.
- `questionsSha256`: `questions.json` 수정 후 다시 계산해서 넣는다.
  `node -e "console.log(require('crypto').createHash('sha256').update(require('fs').readFileSync('src/data/questions.json')).digest('hex'))"`

## 작업 5 — 문서의 주제 개수 정정

앱 화면을 서술한 문장의 숫자만 고친다.

- `docs/ARCHITECTURE.md` 68줄 — 주제 목록 `(22개, ...)` → `(20개, ...)`
- `docs/PRD.md` 21줄 — `22개 주제를 중요도와 함께 보여준다` → `20개 주제를 ...`
- `docs/PRD.md` 33줄 — `22개 주제는 목록으로 훑는 게 더 빠르다` → `20개 주제는 ...`

`docs/PRD.md` 15줄(`원본 PDF에서 추출한 22개 주제`)과 37줄(`총 169문항 목표. 22개 주제에
중요도 비례로 배분`)은 **고치지 마라.** 원본 PDF의 구성과 초기 배분 계획을 적은 문장이라
앱의 현재 주제 개수와 무관하다.

## Acceptance Criteria

```bash
node scripts/check-structure.mjs
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 모두 실행한다.

2. 아래 명령을 그대로 실행한다. 출력의 모든 값이 주석의 기대값과 같아야 한다.

   ```bash
   node -e "
   const {createHash}=require('crypto');
   const t=require('./src/data/topics.json'), q=require('./src/data/questions.json');
   const h=s=>createHash('sha256').update(s).digest('hex').slice(0,16);
   const c=t.find(x=>x.id==='aws-core-services');
   const ids=new Set(t.flatMap(x=>x.concepts.map(y=>y.id)));
   const cs=t.flatMap(x=>x.concepts).map(y=>JSON.stringify([y.id.split('.').pop(),y.name,y.summary,y.paragraphs])).sort();
   console.log('topicCount      ', t.length);
   console.log('oldTopicsLeft   ', t.filter(x=>['region-availability','onpremise-migration'].includes(x.id)).length);
   console.log('mergedConcepts  ', c.concepts.length);
   console.log('mergedPages     ', c.sourcePages.join('-'));
   console.log('mergedTitle     ', c.title);
   console.log('prefixOk        ', c.concepts.every(x=>x.id.startsWith('aws-core-services.')));
   console.log('lastConcept     ', c.concepts[c.concepts.length-1].id);
   console.log('conceptTotal    ', cs.length);
   console.log('questionTotal   ', q.length);
   console.log('mergedQuestions ', q.filter(x=>x.topicId==='aws-core-services').length);
   console.log('danglingConcept ', q.filter(x=>!ids.has(x.conceptId)).length);
   console.log('danglingTopic   ', q.filter(x=>!t.some(y=>y.id===x.topicId)).length);
   console.log('conceptBodySha  ', h(cs.join('\n')));
   console.log('questionBodySha ', h(JSON.stringify(q.map(({id,prompt,choices,answerIndex,explanation})=>[id,prompt,choices,answerIndex,explanation]))));
   "
   ```

   기대값:

   ```
   topicCount       20
   oldTopicsLeft    0
   mergedConcepts   16
   mergedPages      1-7
   mergedTitle      AWS 핵심 서비스·리전·가용 영역·온프레미스
   prefixOk         true
   lastConcept      aws-core-services.exam-heuristics
   conceptTotal     182
   questionTotal    246
   mergedQuestions  16
   danglingConcept  0
   danglingTopic    0
   conceptBodySha   0307303c4daa649c
   questionBodySha  6cef5dfbe592f0f6
   ```

   `conceptBodySha`는 개념 본문(`name`·`summary`·`paragraphs`)과 id 슬러그를, `questionBodySha`는
   문항 순서·id·본문을 이번 변경 **직전** 상태로 고정한 해시다. 값이 다르면 옮기기만 해야 할
   내용을 고쳤거나 지운 것이다. 해시를 맞추려고 이 검증 명령을 수정하지 마라 — 데이터를 되돌려라.

3. 앱 코드가 그대로인지 확인한다. 아래 명령의 출력이 **비어 있어야 한다.**

   ```bash
   git diff --name-only | grep -E '^src/(pages|components|lib|hooks|types)/'
   ```

4. 아키텍처 체크리스트를 확인한다:
   - 학습 데이터는 여전히 빌드 타임 정적 JSON인가? (런타임 `fetch` 없음)
   - 사용자 상태는 여전히 localStorage 전용인가?
   - `HashRouter`, `vite.config.ts`의 `base: './'`가 그대로인가?

5. 결과에 따라 `phases/5-topic-merge/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 개념의 `name`·`summary`·`paragraphs`, 문항의 `prompt`·`choices`·`answerIndex`·`explanation`을
  고치지 마라. 이유: 이 step은 **재배치만** 한다. 본문은 `docs/source/`의 원본을 근거로
  이미 검수된 것이고, 여기서 손대면 근거 없는 문장이 섞인다.
- 개념이나 문항을 새로 만들거나 지우지 마라. 개념 182개, 문항 246개는 그대로다.
  합쳐진 주제의 문항이 16개라서 많아 보여도 덜어내지 마라.
- 문항 id·문항 순서를 다시 매기지 마라. 이유: 진행률의 정답 기록 키다.
- `aws-core-services`라는 주제 id를 바꾸지 마라. 이유: 진행률의 읽음 기록 키다.
- 사라진 주제의 진행률을 옮기는 마이그레이션 코드를 만들지 마라. 이유: 요청 범위 밖이고,
  `src/lib/progress.ts`는 `version: 1` 스키마 그대로 둔다. 읽음 기록 두 건이 무시될 뿐이다.
- `src/pages/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/types/`를 수정하지 마라.
  이유: 화면은 데이터를 그대로 읽으므로 이 변경에 코드 수정이 필요 없다. 수정이 필요하다고
  느껴지면 데이터를 잘못 고친 것이다.
- `topics.json`을 JSON 라이브러리로 통째로 재직렬화하지 마라. 이유: 개념 한 줄 포맷이 깨지고
  `check-structure.mjs`가 실패한다.
- `scripts/check-structure.mjs`를 수정하지 마라. 기준 스냅샷(`topics-baseline.json`)만 갱신한다.
- 검증 명령이나 `data.test.ts`의 기대값을 결과에 맞춰 고치지 마라. 데이터를 고쳐라.
  단, 작업 3에 명시된 6곳(슬라이스 인덱스·주제 개수·기대 배열)은 예외다.
- 기존 테스트를 깨뜨리지 마라.
