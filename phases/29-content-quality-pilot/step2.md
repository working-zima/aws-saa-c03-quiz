# Step 2: concept-body-lead-in

이 phase는 **콘텐츠 품질 시범 개선**이다. 사용자가 실제 화면(`S3 암호화(SSE)·Batch
Operations·인벤토리` 주제 = `s3-encryption-batch`)을 읽다가 막혀서 낸 지적 일곱 가지를
주제 하나에서 전부 고쳐 기준을 세우는 것이 목표다. 나머지 38개 주제로 넓히는 것은
**이 phase의 범위가 아니다.**

이 step은 그중 둘을 고친다.

- **② 개념이 왜 거기 있는지 없이 튀어나온다**
- **⑥ 뜻이 통하지 않는 표현** — 개념 본문 쪽. 문항 쪽은 step 4가 맡는다.

## 읽어야 할 파일

- `CLAUDE.md`
- `docs/ADR.md` — **ADR-009**(개념 본문을 직접 쓴 문장으로 쓰는 규칙과 두 가지 금지),
  **ADR-023**(주제 안 개념 순서가 기본→갈림길→한계이고 그것을 **배열 순서로만** 표현한다),
  **ADR-021**(`dump-gaps/`가 네 번째 출처), **ADR-028**(step 0이 새로 쓴 것 — 기초 용어 예외)
- `docs/PRD.md` — 학습자상("짧게 여러 번 들여다보며 개념을 눌러 담는 사람")
- `scripts/check-structure.mjs`, `scripts/topics-baseline.json`
- `src/data/topics.json` — 주제 `s3-encryption-batch` 열셋 전부를 읽어라
- `docs/source/dump-gaps/` — 이 주제 개념들의 출처. `s3` 관련 파일에서 인벤토리·배치 작업
  항목을 찾아라
- `docs/source/exam-gaps.md`

## 사용자가 지적한 것 — 원문

**②에 대해:**

> `버킷의 객체 목록을 파일로 받아 둔다` 갑자기 이게 개념 주제에 나와서 당황스러움.

가리키는 개념은 `s3-encryption-batch.s3-inventory-report`다. step 1이 이 개념의 `name`을
명사구로 바꿨을 것이므로 **현재 `name`은 다를 수 있다.** `id`로 찾아라.

**⑥에 대해** (사용자가 든 예는 문항이지만 같은 표현이 개념 본문에도 있다):

> 돌린다는 게 `회전축을 기준으로 어떤 걸 돌리는 형태인건가?`라는 생각이 들 만큼 감이 오지
> 않는 표현이야.

## 조사로 확인된 사실 — 다시 찾지 않아도 된다

### ②의 원인으로 의심되는 것 — 주제 안에서 두 갈래가 번갈아 나온다

이 주제는 제목이 말하는 대로 **암호화**와 **배치·인벤토리** 두 갈래를 담고 있는데,
배열 순서가 이렇게 번갈아 간다.

| idx | 개념 id (주제 접두사 생략) | 갈래 |
|---|---|---|
| 0 | `sse` | 암호화 |
| 1 | `sse-types` | 암호화 |
| 2 | `client-side-encryption` | 암호화 |
| 3 | `batch-operations` | 배치 |
| 4 | `s3-inventory-report` | 배치 |
| 5 | `s3-object-lambda` | 배치(변환) |
| 6 | `envelope-encryption` | 암호화 |
| 7 | `sse-kms-audit-trail` | 암호화 |
| 8 | `batch-copy-vs-replication` | 배치 |
| 9 | `s3-batch-operations-lambda-invoke` | 배치 |
| 10 | `sse-kms-cost` | 암호화 |
| 11 | `sse-c-no-rotation-or-audit` | 암호화 |
| 12 | `s3-secure-transport-condition` | 암호화 |

즉 읽는 순서가 **암호화 → 배치 → 암호화 → 배치 → 암호화**다. 인벤토리(4)에서 당황스러운
까닭이 이 개념 자체보다 **바로 앞이 암호화였다가 갑자기 갈래가 바뀌는 데** 있을 수 있다.

### ②의 다른 원인 — 도입 문장이 곧바로 시나리오로 들어간다

`s3-inventory-report`의 `paragraphs[0]`은 "접두사가 여러 개인 버킷에 객체가 수백만 개 있으면
무엇을 지울지 정하기 전에 목록을 얻는 일부터 문제가 된다"로 시작한다. **이것이 무엇인지
말하기 전에 그것이 필요한 상황부터 말한다.**

### ⑥의 대상 — 이 주제 본문의 관용 표현 둘

- `s3-inventory-report`의 `paragraphs[2]`: "돌릴 서버가 생기므로"
- `s3-batch-operations-lambda-invoke`의 `paragraphs[1]`: "돌릴 인스턴스가 없고"

## 작업

### 1. ②를 판정하고 고친다

**두 가지 원인 중 무엇이 실제 원인인지 네가 판정하고, 판정에 따라 고쳐라.** 둘 다일 수도 있다.

- **배치를 고치는 쪽을 골랐다면** — 갈래가 번갈아 가지 않게 묶어라. 단 **ADR-023의
  기본→갈림길→한계 순서를 각 묶음 안에서 지켜야 한다.** 순서를 바꾸면
  `scripts/topics-baseline.json`의 `topics[].concepts` 배열도 같은 순서로 갱신해야
  `check-structure.mjs`가 통과한다. 그리고 **왜 이 순서인지를 `summary`에 적어 보고하라** —
  다음 phase가 나머지 주제에 같은 판단을 해야 한다.
- **도입 문장을 고치는 쪽을 골랐다면** — `s3-inventory-report`의 첫 문장이 **이것이 무엇인지**
  먼저 말하고, 그 뒤에 왜 필요한지가 오게 하라. 앞 개념(`batch-operations`)과 이어지는 자리를
  드러내면 "갑자기"가 사라진다. 이미 `paragraphs[1]` 끝에 "그 자리는 S3 Batch Operations가
  맡는다"는 연결이 있으니, 그 연결을 **앞으로 끌어오는 것**으로 충분할 수 있다.
- **어느 쪽도 원인이 아니라고 판정했다면** 고치지 말고 그 근거를 `summary`에 적어라.

### 2. 이 주제 열셋의 본문에서 뜻이 좁아지는 관용 표현을 없앤다

위에 적은 둘은 반드시 고친다. `돌리다`는 "실행하다"·"운영하다"처럼 **하는 일을 그대로**
쓰는 표현으로 바꿔라. "돌릴 서버가 생기므로" → "실행할 서버를 따로 두어야 하므로" 같은 방향이다.

그리고 열셋 전부를 읽으며 같은 종류(`태운다`, `물린다`, `얹는다`, `띄운다`, `건다` 등)가
더 있는지 확인해라. **다만 이미 자리를 잡은 기술 표현은 건드리지 마라** — "정책을 건다",
"조건을 걸어 둔다"는 이 저장소 전체가 쓰는 표현이고 뜻이 통한다. 판정 기준은
**처음 읽는 학습자가 그 낱말의 자리에 무엇이 들어가는지 알 수 있는가**다.

### 3. step 0이 넣은 용어 정의와 이 주제의 본문이 어긋나지 않는지 확인한다

step 0이 `aws-core-services.s3`에 `버킷`·`객체`·`접두사`의 풀이를 넣었다. 이 주제의 본문은
`파일`과 `객체`를 섞어 쓴다(idx 0은 "S3에 저장하는 파일", idx 3은 "수백만 개의 파일",
idx 4부터는 "객체"). **섞여 있는 것 자체를 전부 통일하려 들지 마라** — step 0의 정의가
`객체`를 "버킷에 담긴 파일 하나"로 잡았다면 두 낱말이 함께 쓰여도 읽힌다.

확인할 것은 하나다. **이 주제에서 `접두사`가 처음 나오는 자리가 읽히는가.** 지금
`s3-inventory-report`의 `paragraphs[0]`과 `batch-copy-vs-replication`의 `paragraphs[0]`이
`접두사`를 쓰는데, step 0의 정의를 읽고 온 학습자에게 그 문장이 통하는지 보고, 통하지 않으면
그 문장을 고쳐라. **`접두사`의 정의를 이 주제에 다시 쓰지는 마라** — ADR-010·ADR-028이
"처음 등장하는 개념에서 한 번만" 풀이하라고 정해 두었다.

## Acceptance Criteria

```bash
npm test                          # 기존 테스트 전부 통과
npm run build                     # tsc 타입체크 포함, 에러 없음
node scripts/check-structure.mjs  # exit 0
node scripts/check-verbatim.mjs   # exit 0
node scripts/coverage.mjs         # 618/618, exit 0
```

개념 순서를 바꿨다면 `scripts/topics-baseline.json`을 갱신한 **뒤에** `check-structure.mjs`가
통과해야 한다. 순서를 바꾸지 않았다면 baseline은 그대로여야 한다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 다음을 눈으로 확인한다:
   - `git diff --stat`이 `src/data/topics.json`(과 순서를 바꿨다면 `scripts/topics-baseline.json`)
     **만** 보여주는가.
   - 주제 `s3-encryption-batch`의 개념 열셋을 **배열 순서대로 본문까지 소리 내어 읽어라.**
     앞 개념에서 뒤 개념으로 넘어갈 때 "갑자기"라고 느껴지는 자리가 남아 있는가.
   - `grep -n "돌릴\|돌린\|돌려\|돌리" src/data/topics.json`에서 이 주제의 줄이 걸리지 않는가.
     (다른 주제는 이 phase의 범위가 아니므로 걸려도 된다.)
3. `phases/29-content-quality-pilot/index.json`의 step 2를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **②를 어느 원인으로 판정하고 무엇을
     고쳤는지**, 개념 순서를 바꿨다면 **새 순서와 그 근거**를 적어라. 다음 step과 다음 phase가
     이 판단을 이어받는다.
   - 3회 시도 후 실패 → `"status": "error"`, `"error_message"`

## 금지사항

- **개념 `id`와 `name`을 바꾸지 마라.** 이유: `id`는 문항 732개의 `conceptId`가 참조한다.
  `name`은 step 1이 이미 정했고, 두 step이 같은 필드를 고치면 어느 쪽이 기준인지 알 수 없게 된다.
- **개념을 더하거나 지우거나 나누지 마라.** 이유: 개념 수 618이 `check-structure.mjs`와
  `coverage.mjs`의 기준이고, 개념을 더하면 문항 커버리지가 깨진다(ADR-026).
- **`src/data/questions.json`을 건드리지 마라.** 이유: 문항은 step 3·4의 범위다. 다만 개념
  순서를 바꿔도 문항은 `conceptId`로 참조하므로 고칠 일이 없다.
- **모델이 아는 AWS 지식으로 사실을 보태지 마라.** 이유: ADR-009의 금지다. 이 step이 더할 수
  있는 것은 **이미 본문에 있는 사실을 다시 배열하거나 잇는 문장**과 ADR-028이 허용한 용어
  풀이뿐이다. 새 사실이 필요하면 `docs/source/dump-gaps/`나 `docs/source/exam-gaps.md`에서
  찾고, 없으면 고치지 말고 보고하라.
- **`topics.json`을 JSON 라이브러리로 재직렬화하지 마라.** 이유: 개념 하나가 정확히 한 줄인
  포맷을 `check-structure.mjs`가 줄 수(618)로 검사한다.
- **`s3-encryption-batch` 밖의 주제를 손대지 마라.** 이유: 시범 주제 하나로 기준을 세우고
  사용자 검수를 받는 것이 이 phase의 목적이다. 예외는 step 0이 이미 손댄
  `aws-core-services.s3` 하나이고, 그것도 이 step에서는 읽기만 한다.
- 기존 테스트를 깨뜨리지 마라.
