# Step 1: concept-titles-noun-phrase

이 phase는 **콘텐츠 품질 시범 개선**이다. 사용자가 실제 화면(`S3 암호화(SSE)·Batch
Operations·인벤토리` 주제 = `s3-encryption-batch`)을 읽다가 막혀서 낸 지적 일곱 가지를
주제 하나에서 전부 고쳐 기준을 세우는 것이 목표다. 나머지 38개 주제로 넓히는 것은
**이 phase의 범위가 아니다.**

이 step은 그중 **⑤ 개념 제목이 문장이다**를 고친다. 대상은 `s3-encryption-batch` 하나다.

## 읽어야 할 파일

- `CLAUDE.md`
- `docs/ADR.md` — **ADR-009**(개념 본문 규칙과 `name`이 고정 필드인 근거), **ADR-023**(주제 안
  개념 순서가 기본→갈림길→한계), **ADR-013·ADR-020·ADR-024**(검색이 `name`을 어떻게 쓰는지)
- `docs/UI_GUIDE.md` — 개념 제목이 화면에서 어떻게 렌더되는지
- `scripts/check-structure.mjs`와 `scripts/topics-baseline.json` — `name`이 왜 가드레일인지
- `src/data/topics.json` — 주제 `s3-encryption-batch`
- `src/components/` 안의 개념 목록·개념 카드 컴포넌트 — `name`이 쓰이는 자리를 확인하라

## 사용자가 지적한 것 — 원문

> 개념에서 `배치 작업이 객체마다 Lambda를 부른다`처럼 문장이 제목이 되면 안 될 거 같아.
> 문장의 특정 제목의 개념의 설명으로 들어가야 맞는 거 같아.

그리고 **고치는 방법까지 알려줬다.**

> `전송 중 암호화는 버킷 정책 조건으로 강제한다` 부분의 경우 `버킷 정책`이 제목으로 가고
> `aws:SecureTransport`이 설명 중 하나로 되어야 하는 게 맞는 거 같아.

즉 규칙은 이렇다. **문장에서 주어가 되는 대상을 뽑아 제목으로 올리고, 그 문장이 주장하던
내용은 `summary`나 `paragraphs`로 내린다.** 제목은 **찾아가는 이름표**이지 요약이 아니다.
목록에서 제목만 훑을 때 그것이 무엇의 이름인지 알 수 있어야 하고, 읽고 나서 다시 찾아올
이름이 되어야 한다.

## 고칠 대상 — 이 주제의 문장형 제목 넷

`src/data/topics.json`의 주제 `s3-encryption-batch`에서, 배열 순서대로 인덱스와 현재 `name`이다.

| idx | 개념 id | 현재 `name` |
|---|---|---|
| 4 | `s3-encryption-batch.s3-inventory-report` | 버킷의 객체 목록을 파일로 받아 둔다 |
| 9 | `s3-encryption-batch.s3-batch-operations-lambda-invoke` | 배치 작업이 객체마다 Lambda를 부른다 |
| 11 | `s3-encryption-batch.sse-c-no-rotation-or-audit` | SSE-C에는 자동 교체도 감사 추적도 없다 |
| 12 | `s3-encryption-batch.s3-secure-transport-condition` | 전송 중 암호화는 버킷 정책 조건으로 강제한다 |

같은 주제의 나머지 아홉은 이미 명사구다 — `SSE (Server Side Encryption)`, `SSE 종류`,
`클라이언트 측 암호화`, `S3 Batch Operations`, `S3 Object Lambda`,
`봉투 암호화 (Envelope Encryption)`, `SSE-KMS의 감사 추적과 업로드 강제`,
`일회성 대량 복사와 지속 복제`, `SSE-KMS의 비용 구조와 S3 Bucket Key`.
**이 아홉을 손대지 마라.** 어긋난 것은 규칙이 없어서가 아니라 지키지 않아서다.

## 작업

### 1. 넷의 `name`을 명사구로 바꾼다

새 이름은 **네가 정한다.** 아래는 방향을 잡기 위한 참고안이고 그대로 쓸 의무는 없다.

- idx 4 → `S3 인벤토리` 계열
- idx 9 → `S3 Batch Operations의 Lambda 호출` 계열
- idx 11 → SSE-C가 무엇을 제공하지 않는지를 가리키는 명사구. 단 idx 1 `SSE 종류`가 이미
  SSE-C가 무엇인지는 다루므로, 이 개념의 이름은 **키 자동 교체와 감사 추적**이라는 두 축이
  드러나는 쪽이 낫다.
- idx 12 → 사용자가 `버킷 정책`이라고 했다. 다만 같은 주제 idx 7이 버킷 정책의 업로드 강제를
  다루고 `s3-access-control` 주제에도 버킷 정책 개념이 있으므로, 목록에서 구별되는 이름인지
  확인하고 필요하면 무엇에 대한 버킷 정책인지 한정어를 붙여라.

지켜야 할 것:

- **명사구여야 한다.** 종결어미(`~한다`, `~이다`, `~없다`, `~다`)로 끝나지 않는다.
- **같은 주제 안에서 다른 개념 이름과 헷갈리지 않아야 한다.** 렌더되는 자리가 목록이다.
- **화면 폭을 생각해 짧게.** 이미 있는 아홉 개의 길이 범위(`SSE 종류` ~
  `SSE-KMS의 비용 구조와 S3 Bucket Key`)를 넘지 마라.
- 약어를 새로 도입하면 ADR-015의 규칙(풀네임을 괄호로)이 걸린다. 이 주제는 이미
  `SSE (Server Side Encryption)`·`봉투 암호화 (Envelope Encryption)` 형태를 쓰고 있으니
  그 방식에 맞춰라.

### 2. 제목에서 내려온 주장을 본문으로 옮긴다

제목이 하던 말이 본문에서 사라지면 안 된다. 넷 각각에 대해 **그 문장이 `summary`나
`paragraphs`에 이미 있는지 확인하고, 없으면 넣어라.**

지금 상태를 조사해 둔 것이다 — 넷 다 `summary`가 제목의 주장을 이미 담고 있다. 예를 들어
idx 12의 `summary`는 "버킷 정책에 aws:SecureTransport 조건을 걸면 HTTPS로 오지 않은 요청이
막혀 전송 구간 암호화가 강제된다"다. 그러므로 **대부분 본문을 손대지 않아도 된다.**
확인만 하고, 정말 빠진 것이 있을 때만 더해라.

### 3. `scripts/topics-baseline.json`을 갱신한다

`check-structure.mjs`가 baseline의 `name`과 대조하므로, 바꾼 넷의 `name`을 baseline에서도
같은 값으로 고친다. **같은 커밋에 들어가야 한다.**

`conceptLineCount`(618)와 `questionsSha256`은 **바꾸지 마라.** 이 step은 개념 수도 문항도
바꾸지 않는다.

### 4. `src/data/data.test.ts`가 이 넷의 이름을 하드코딩하는지 확인한다

조사해 둔 것이다 — 이름을 하드코딩한 단언은 `s3-storage-classes` 주제 하나뿐이고
(`concepts.slice(0, 8).map(concept => concept.name)` 형태), 그 주제에는 문장형 제목이 없다.
그러므로 **이 step 때문에 고쳐야 할 기존 단언은 없을 것이다.** 다만 직접 확인하고,
`npm test`가 이름 때문에 깨지면 그 단언을 새 이름으로 맞춰라.

그리고 **`s3-encryption-batch`의 개념 이름 열셋이 모두 종결어미로 끝나지 않는지**를 단언하는
테스트를 하나 더한다. 주석에 근거를 적어라 — 이것이 이 phase가 세우는 기준이고, 다음 phase가
나머지 주제로 넓힐 때 이 단언의 범위를 넓히면 된다. **전체 주제에 걸지 마라** — 다른 주제에
문장형 제목이 185개 남아 있어 곧바로 실패한다.

## Acceptance Criteria

```bash
npm test                          # 기존 테스트 + 새 단언 전부 통과
npm run build                     # tsc 타입체크 포함, 에러 없음
node scripts/check-structure.mjs  # exit 0 — baseline을 갱신했으므로 통과해야 한다
node scripts/check-verbatim.mjs   # exit 0
node scripts/coverage.mjs         # 618/618, exit 0
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 다음을 눈으로 확인한다:
   - `git diff --stat`이 `src/data/topics.json`, `scripts/topics-baseline.json`,
     `src/data/data.test.ts` **세 파일만** 보여주는가.
   - `git diff src/data/topics.json`이 **정확히 네 줄**만 바꿨는가.
   - 새 이름 넷을 나란히 놓고 읽었을 때, 각각이 **무엇의 이름인지** 알 수 있는가.
     읽고 나서 다시 찾아올 이름이 되는가.
   - `node -e` 한 줄로 이 주제의 이름 열셋을 찍어 보고, 명사구가 아닌 것이 남아 있지 않은지 본다.
3. `phases/29-content-quality-pilot/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **바뀐 이름 넷을 `이전 → 이후` 형태로**
     적어라. 다음 step이 본문·해설에서 이 이름을 참조할 수 있어야 한다.
   - 3회 시도 후 실패 → `"status": "error"`, `"error_message"`

## 금지사항

- **개념 `id`를 바꾸지 마라.** 이유: 문항 732개의 `conceptId`가 `id`를 참조하고,
  `coverage.mjs`·검색 URL·baseline이 모두 `id`로 걸려 있다. `id`는 화면에 보이지 않으므로
  학습자가 얻는 것은 없고 파급만 크다. 이것은 사용자가 직접 내린 결정이다.
- **개념 순서를 바꾸지 마라.** 이유: ADR-023이 배열 순서만으로 학습 순서(기본→갈림길→한계)를
  표현한다. 배치 문제는 step 2가 다룬다. 이 step은 이름만 고친다.
- **`s3-encryption-batch` 밖의 주제를 손대지 마라.** 이유: 이 phase는 시범 주제 하나로
  기준을 세우고 사용자 검수를 받는 것이 목적이다. 185개를 지금 고치면 기준이 틀렸을 때
  전부 다시 고쳐야 한다.
- **`src/data/questions.json`을 건드리지 마라.** 이유: 문항은 step 3·4의 범위다.
  `name`은 문항이 참조하지 않으므로(문항은 `conceptId`로 참조한다) 이 step 때문에 문항을
  고칠 일은 없다.
- **`topics.json`을 JSON 라이브러리로 재직렬화하지 마라.** 이유: 개념 하나가 정확히 한 줄인
  포맷을 `check-structure.mjs`가 줄 수(618)로 검사한다. 해당 줄만 문자열로 고쳐라.
- **새 단언을 전체 주제에 걸지 마라.** 이유: 다른 주제에 문장형 제목이 185개 남아 있어
  곧바로 실패하고, 그것을 통과시키려고 예외 목록을 만들면 사각지대가 생긴다.
- 기존 테스트를 깨뜨리지 마라.
