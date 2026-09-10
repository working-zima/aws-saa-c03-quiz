# Step 0: aws-core-and-s3-storage-and-versioning

phase 32의 범위는 **개념 `name`·`summary`와 문항 `prompt`·`choices` 넷뿐이다.**
phase 31이 개념 본문과 문항 해설을 39개 주제 전부에 걸쳐 다시 썼는데, 이 네 필드는 그
범위 밖이라 **예전 표현으로 남았다.** 한 주제 안에서 같은 것을 두 말로 부르는 자리가 그래서
생겼다. 그 어긋남을 없애는 것이 이 phase이고, **사실관계 검수는 이 phase의 일이 아니다.**

## 절대 하지 말 것 — 사용자가 제한으로 못 박은 것이다

사용자의 말을 그대로 옮긴다.

> - AWS 사실관계나 정답 논리를 새로 해석하거나 변경하지 말 것
> - 문항의 정답 선택지가 바뀔 수 있는 수정은 하지 말 것
> - 수치, 조건, 서비스 특성, 제한 사항은 그대로 유지할 것
> - 단순히 자연스럽게 보이게 하려고 의미를 추가하거나 삭제하지 말 것
> - 애매하면 수정하지 말고 보류 목록에 남길 것
> - 이미 자연스러운 표현은 억지로 바꾸지 말 것
>
> 특히 choices는 정답/오답의 의미 차이가 매우 중요하므로 가장 보수적으로 수정해 줘.
> 표현만 자연스럽게 바꾸고 선택지의 기술적 의미나 오답 포인트는 건드리지 마.

**마지막 두 줄이 이 step의 성과 기준을 뒤집는다.** 고친 건수가 성과가 아니다.
걸리는 자리만 고치고 나머지는 손대지 않는 것이 맞게 한 것이다.

## 얼어 있는 필드 — 기계가 잡는다

이 phase가 고칠 수 있는 것은 **개념 `name`·`summary`와 문항 `prompt`·`choices` 넷뿐이다.**
나머지는 전부 얼어 있다. phase 31이 개념 본문(`paragraphs`)과 문항 해설(`explanation`)을
이미 다시 썼고, 문항 `answerIndex`는 정답 그 자체다.

```bash
node scripts/field-diff.mjs 04f6946          # 필드별로 무엇이 바뀌었는지 센다
node scripts/field-diff.mjs 04f6946 --list   # 바뀐 항목의 id를 전부 찍는다
```

**exit 1이면 범위를 넘은 것이다.** 되돌려라. 이 도구가 잡는 것은 아래다.

| 얼어 있는 것 | 왜 |
|---|---|
| 개념 `paragraphs` | phase 31이 쓴 본문이다. 이번 범위는 그 본문에 **맞추는** 것이지 고치는 것이 아니다 |
| 문항 `explanation` | 같은 이유다 |
| 문항 `answerIndex` | 정답이다. 바뀌면 문제가 달라진다 |
| 개념·문항 id, 순서, 개수 | `conceptId` 참조와 `data.test.ts`가 붙잡고 있다 |
| 주제 메타데이터 | 이번 작업과 무관하다 |

`git diff --stat`으로는 이것을 볼 수 없다. `topics.json`은 개념 하나가 한 줄이라
`name`만 고쳐도 `paragraphs`가 든 줄 전체가 바뀐 것으로 찍힌다. **반드시 `field-diff.mjs`로 봐라.**

## 이 step이 맡은 것

| 주제 | 개념 | 문항 | 범위 |
|---|---|---|---|
| `aws-core-services` | 18 | 18 | 개념·문항 전부 |
| `s3-storage-classes` | 17 | 17 | 개념·문항 전부 |
| `s3-versioning-lifecycle` | 10 | 16 | 개념·문항 전부 |

### `aws-core-services`

**개념 18개. 문장형 제목 0개.** 아래 목록에서 `▸`가 문장형이다.

```
   0. ec2                                            EC2 (Elastic Compute Cloud)
   1. rds                                            RDS (Relational Database Service)
   2. s3                                             S3 (Simple Storage Service)
   3. route-53                                       Route 53
   4. dns                                            DNS (Domain Name System)
   5. elb                                            ELB (Elastic Load Balancer)
   6. cloudfront                                     CloudFront
   7. lambda                                         Lambda
   8. region                                         리전 (Region)
   9. availability                                   가용성 (Availability)
  10. availability-zone                              가용 영역 (Availability Zone)
  11. multi-az                                       다중 AZ (Multi-AZ)
  12. single-az                                      단일 AZ (Single-AZ)
  13. on-premise                                     온프레미스 (On-premise)
  14. migration                                      마이그레이션 (Migration)
  15. exam-heuristics                                시험에서 자주 통하는 판단 기준
  16. exponential-backoff-retry                      지수 백오프와 재시도
  17. blob-offload-to-s3                             큰 파일 본체의 저장 위치
```

**문항 18개**

`q001` `q002` `q003` `q004` `q005` `q006` `q007` `q008` `q009` `q010` `q011` `q012` `q013` `q014` `q015` `q170` `q317` `q318`

### `s3-storage-classes`

**개념 17개. 문장형 제목 0개.** 아래 목록에서 `▸`가 문장형이다.

```
   0. standard                                       S3 Standard
   1. intelligent-tiering                            S3 Intelligent-Tiering
   2. standard-ia                                    S3 Standard-IA (Infrequent Access)
   3. one-zone-ia                                    S3 One Zone-IA
   4. glacier-instant-retrieval                      S3 Glacier Instant Retrieval
   5. glacier-flexible-retrieval                     S3 Glacier Flexible Retrieval
   6. glacier-deep-archive                           S3 Glacier Deep Archive
   7. s3-express-one-zone                            S3 Express One Zone
   8. retrieval-time                                 즉시 조회와 대기 조회
   9. glacier-or-standard-ia                         Glacier와 Standard-IA 중 고르기
  10. glacier-flexible-retrieval-standard-time       Glacier Flexible Retrieval의 표준 검색 시간
  11. glacier-flexible-retrieval-expedited           Glacier Flexible Retrieval의 신속 검색
  12. s3-storage-class-cost-order                    아카이브 계열의 비용 순서
  13. lifecycle-vs-intelligent-tiering               수명 주기 규칙과 자동 계층화의 갈림길
  14. s3-storage-class-analysis                      S3 스토리지 클래스 분석
  15. s3-retrieval-fee-by-class                      스토리지 클래스마다 갈리는 검색 요금
  16. intelligent-tiering-monitoring-fee             Intelligent-Tiering의 객체별 감시 요금
```

**제목에 옛 어휘가 든 것** (문장형이 아니어도 본다)

- `s3-retrieval-fee-by-class` — 갈리 — "스토리지 클래스마다 갈리는 검색 요금"

**`data.test.ts`가 글자로 고정한 제목·요약** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `retrieval-time` — 단언이 잡고 있는 말: `즉시 조회와 대기 조회`
- `glacier-or-standard-ia` — 단언이 잡고 있는 말: `Glacier와 Standard-IA 중 고르기`
- `glacier-flexible-retrieval-standard-time` — 단언이 잡고 있는 말: `Glacier Flexible Retrieval의 표준 검색 시간`
- `glacier-flexible-retrieval-expedited` — 단언이 잡고 있는 말: `Glacier Flexible Retrieval의 신속 검색`
- `s3-storage-class-cost-order` — 단언이 잡고 있는 말: `아카이브 계열의 비용 순서`
- `lifecycle-vs-intelligent-tiering` — 단언이 잡고 있는 말: `수명 주기 규칙과 자동 계층화의 갈림길`
- `s3-storage-class-analysis` — 단언이 잡고 있는 말: `S3 스토리지 클래스 분석`
- `s3-retrieval-fee-by-class` — 단언이 잡고 있는 말: `스토리지 클래스마다 갈리는 검색 요금`
- `intelligent-tiering-monitoring-fee` — 단언이 잡고 있는 말: `Intelligent-Tiering의 객체별 감시 요금`

**문항 17개**

`q016` `q017` `q018` `q019` `q020` `q021` `q022` `q023` `q024` `q319` `q320` `q321` `q322` `q323` `q324` `q325` `q326`

**`data.test.ts`가 글자로 고정한 프롬프트·보기** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `q323` — 단언이 잡고 있는 말: `S3 스토리지 클래스 분석`
- `q324` — 단언이 잡고 있는 말: `S3 스토리지 클래스 분석`

### `s3-versioning-lifecycle`

**개념 10개. 문장형 제목 0개.** 아래 목록에서 `▸`가 문장형이다.

```
   0. versioning                                     S3 버전 관리
   1. object-lock                                    S3 객체 잠금
   2. lifecycle-policy                               S3 수명 주기 정책
   3. event-notification                             S3 이벤트 알림
   4. s3-replication                                 S3 리전 간 복제 (CRR)
   5. s3-same-region-replication                     S3 동일 리전 복제 (SRR)
   6. s3-replication-time-control                    S3 복제 시간 제어 (S3 RTC)
   7. s3-replication-cross-account-kms               계정을 넘는 복제와 SSE-KMS 키 권한
   8. object-lock-prerequisites                      객체 잠금의 전제 조건과 MFA 삭제의 한계
   9. s3-lifecycle-rules-and-size-filter             수명 주기 구성의 개수 제한과 규칙의 크기 필터
```

**`data.test.ts`가 글자로 고정한 제목·요약** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `versioning` — 단언이 잡고 있는 말: `S3 버전 관리`

**문항 16개**

`q025` `q026` `q027` `q028` `q029` `q030` `q031` `q032` `q033` `q171` `q172` `q271` `q272` `q273` `q274` `q275`

**`data.test.ts`가 글자로 고정한 프롬프트·보기** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `q025` — 단언이 잡고 있는 말: `S3 버전 관리`
- `q027` — 단언이 잡고 있는 말: `S3 버전 관리`
- `q031` — 단언이 잡고 있는 말: `S3 버전 관리`
- `q032` — 단언이 잡고 있는 말: `얼마나 자주 접근할지`
- `q033` — 단언이 잡고 있는 말: `S3 버전 관리`
- `q171` — 단언이 잡고 있는 말: `S3 객체 잠금은 정해진 기간 동안 객체의 수정과 삭제를 막는 기능이다. 이 잠금을 걸려면 S3 버킷에…`, `S3 버전 관리`
- `q172` — 단언이 잡고 있는 말: `S3 이벤트 알림은 파일이 올라오는 즉시 Lambda 같은 서비스를 자동으로 호출한다. 이 알림이 객체…`

## 확정된 문체 기준 — 이것이 합격선이다

phase 30·31에서 사용자가 확정한 것을 그대로 옮긴다. 이번에는 그 기준을 **네 필드에** 적용한다.

> - 초보자가 첫 1~2문장만 읽어도 개념의 핵심이 잡히게 작성
> - `자리`, `축`, `갈린다`, `밀린다` 같은 추상적인 표현의 반복을 피할 것
> - `앞에서 본`, `여기서부터는`, `이제 ~를 본다`처럼 글의 진행 자체를 설명하는 문장은
>   꼭 필요한 경우에만 사용할 것
> - 공식 AWS 용어는 유지하고, 어려운 용어는 바로 뒤에서 쉬운 말로 설명할 것
> - 문장을 자연스럽게 만들기 위해 사실관계나 기술적 의미를 바꾸지 말 것
> - **이미 자연스러운 문장은 억지로 다시 쓰지 말 것**

### 이번 phase가 고치는 것은 「짝이 깨진 자리」다

phase 31은 `paragraphs`와 `explanation`만 고쳤다. 그래서 **한 주제 안에서 본문은 새 말을
쓰는데 제목·요약·프롬프트·보기만 옛말로 남은** 자리가 생겼다. 예를 들어 본문에서
`…하는 자리다`를 없앴는데 제목이 `ECS 태스크 역할과 태스크 실행 역할은 다른 자리다`로
남아 있는 식이다.

**판정 기준은 "본문과 같은 말을 쓰는가"다.** 먼저 그 개념의 `paragraphs`와 그 문항의
`explanation`을 읽어라. **그것이 이 주제의 기준 문체다.** 네 필드가 거기서 벗어난 자리를 찾아라.

### 1. 개념 `name` — 문장을 명사구로 내린다

**개념 제목은 목록에서 훑으며 찾아가는 이름표이지 그 개념이 주장하는 문장이 아니다.**
사용자가 직접 정한 기준이고 phase 29가 시범 주제에서 세웠다. 주어가 되는 대상을 제목으로
올리고 주장은 `summary`·`paragraphs`로 내린다 — **주장을 지우는 것이 아니라 이미 본문에
있는 그 주장을 제목에서 덜어내는 것이다.**

한국어 평서형 종결어미는 모두 `-다`로 끝나므로 그것이 판정 기준이다.

| 이전 (문장) | 이후 (명사구) |
|---|---|
| gp3는 IOPS를 용량과 따로 정한다 | gp3의 IOPS와 용량 분리 |
| EBS 암호화는 성능을 깎지 않는다 | EBS 암호화와 성능 |
| 마운트 대상은 가용 영역마다 하나씩 만든다 | 가용 영역마다 두는 마운트 대상 |
| EFS 복제는 한 방향이다 | EFS 복제의 방향 |
| 계정 간 버킷 접근은 버킷 정책으로 연다 | 계정 간 버킷 접근과 버킷 정책 |

이미 통과한 주제의 제목이 합격 예시다 — `객체 잠금의 전제 조건과 MFA 삭제의 한계`,
`Glacier와 Standard-IA 중 고르기`, `아카이브 계열의 비용 순서`, `지수 백오프와 재시도`.

**주의할 것 넷.**

1. **같은 주제 안에서 제목이 겹치면 안 된다.** `EFS의 성능 모드는 …다`를 `EFS 성능 모드`로
   줄였는데 옆에 이미 `EFS 처리량 모드`가 있으면 목록에서 구분되지 않는다. 줄이기 전에
   **그 주제의 제목 전체를 한 번 훑어라.** 지금 주제 안 중복은 0건이고 그대로 유지해야 한다.
2. **무엇의 이름인지 남겨야 한다.** `파일 권한 모델이 그대로 따라온다`를 `권한 모델`로만
   줄이면 어느 서비스의 것인지 사라진다. 주어를 살려 `EFS의 POSIX 권한 모델`로 간다.
3. **`-자`·`-라`로 끝나는 이름은 대상이 아니다.** `HTTP API의 JWT 권한 부여자`,
   `샤드와 체크포인트를 직접 다루는 소비자`는 명사구의 마지막 글자일 뿐이다.
4. **용어 풀이 문구를 제목에 넣지 마라.** `data.test.ts`가 개념 `name`에 뜻풀이 표현이
   들어가는 것을 전 개념에 대해 금지한다(`Multi-Factor Authentication`, `Network File System`,
   `키-값`, `차례대로 돌아가며`, `Time-to-Live`, `JSON Web Token`,
   `Distributed Denial of Service`, `Cross-Site Scripting`, `SSL의 후속` 등 15개).

### 2. 개념 `summary` — 본문이 쓰는 말로 맞춘다

본문에서 없앤 은유적 추상어가 요약에만 남은 자리를 고친다. 치환은 phase 30·31에서
사용자가 통과시킨 것을 그대로 쓴다.

| 이전 | 이후 |
|---|---|
| 그 **자리를 맡는 것**이 이 클래스다 | 이럴 때 **이 클래스를 선택한다** |
| 이 조건에서 **갈리는 상대**는 X다 | 이때 **비교 대상이 되는 것**은 X다 |
| 보관 단가에서 **밀리고** | 보관 단가가 **더 높고** |
| 판단 **축**이다 | 판단 **기준**이다 |
| 자주 읽는 데이터의 **자리가 아니다** | 자주 읽는 데이터에는 **맞지 않는다** |
| 정책으로 **돌린다** | 정책으로 **자동화한다** |

`자리한`(=위치하다), `돌려준다`(=반환), `돌아가며`(=순번)처럼 **자연스러운 쓰임은 그대로 둔다.**

**`summary`를 늘리거나 새 사실을 넣지 마라.** 요약은 본문 위에 붙는 한 줄이고,
UI가 요약 바로 아래에 본문을 두므로 본문 문장을 복사해 오면 같은 말이 두 번 보인다.

### 3. 문항 `prompt` — 해설이 쓰는 말로 맞춘다

같은 규칙이다. 추가로 **문항은 열 때마다 순서가 섞이므로(ADR-011) 단독으로 읽혀야 한다.**
앞뒤 문맥이 뜻을 보정해 주지 않는다.

**프롬프트를 다시 설계하지 마라.** 묻는 것이 무엇인지, 조건이 몇 개인지, 어떤 수치가
주어졌는지는 그대로다. 고치는 것은 **그것을 말하는 방식**뿐이다.

### 4. 문항 `choices` — 가장 보수적으로

사용자가 `choices`만 따로 떼어 제한을 걸었다. **표현만 자연스럽게 바꾸고 선택지의
기술적 의미나 오답 포인트는 건드리지 마라.**

- **오답 보기는 틀리라고 그렇게 쓰여 있다.** 어색해 보인다고 다듬으면 함정 자체가 사라진다.
  오답이 왜 오답인지 해설에서 먼저 확인하고, 그 근거가 되는 낱말은 절대 건드리지 마라.
- **보기 넷을 한 벌로 봐라.** 한 보기만 문체를 고치면 그 보기가 나머지 셋과 결이 달라지고,
  **그 차이 자체가 정답을 가리키는 신호가 된다.** 같은 이유로 보기 넷이 같은 모양의
  줄표(` — `)를 쓰고 있으면 한쪽만 끊지 마라. 넷을 함께 고치거나 넷 다 두거나다.
- **서비스 이름·수치·조건은 글자 그대로 둔다.** `S3 수명 주기 규칙`을 `수명 주기 규칙`으로
  줄이는 것도 안 된다 — 표기가 달라지면 그 글자가 변별 신호가 된다.
- **정답 보기는 되도록 손대지 마라.** `field-diff.mjs`가 정답 보기의 글자가 바뀐 문항을
  따로 경고로 찍는다. 경고에 뜬 문항은 **왜 고쳐야 했는지를 `summary`에 적어라.**
- 판단이 서지 않으면 **그 문항의 보기 넷을 통째로 보류해라.**

## 판단하기 어려우면 고치지 말고 남겨라 — 사용자의 지시다

> 애매하면 수정하지 말고 보류 목록에 남길 것

**`summary`의 「보류」 항목에 `개념id/문항id — 무엇이 걸렸는지 — 왜 판단이 어려운지`
형식으로 적어라.** 마지막 step이 이것들을 모아 사용자에게 보고한다. 보고서에
**「의미 변경 위험 때문에 손대지 않은 항목」이 따로 있으므로**, 보류 사유가 「고치면 뜻이
달라질 것 같다」인 것은 그렇게 적어 구분되게 해라. 아래가 보류할 자리다.

- 고치면 사실·조건·수치의 뜻이 달라질 것 같은 자리
- 대체어가 사실을 넓히거나 좁힐 수 있는 자리
- 오답 보기의 함정이 그 표현에 걸려 있어 보이는 자리
- 제목을 명사구로 줄이면 무엇의 이름인지 사라지는데 마땅한 대안이 없는 자리
- 고치려면 `paragraphs`나 `explanation`까지 함께 고쳐야 하는 자리 (그 둘은 얼어 있다)

## 읽어야 할 파일

- `CLAUDE.md`
- `src/data/topics.json` · `src/data/questions.json` — 이 step이 고칠 데이터
- `src/data/data.test.ts` — 문구를 고정한 단언이 있다
- `scripts/field-diff.mjs` · `scripts/sync-baseline.mjs` — 이 phase의 가드레일. 머리주석을 읽어라

**`docs/ADR.md`·`docs/source/`는 읽지 않아도 된다.** 사실관계를 다루지 않기 때문이다.
읽고 있다면 범위를 벗어난 것이다.

## 작업 순서

1. **맡은 주제의 개념 본문(`paragraphs`)과 문항 해설(`explanation`)을 먼저 읽는다.**
   고칠 대상이 아니라 **기준**이다. 이 주제가 지금 어떤 말로 쓰여 있는지를 여기서 잡는다.
2. **네 필드를 그 기준과 대조하며 읽는다.** 아래 「정규식에 걸린 자리」는 참고일 뿐
   목록이 전부가 아니다 — 정규식은 옛 어휘만 보고 용어 불일치는 보지 못한다.
3. **고친다.** 고친 것마다 스스로에게 물어라 — *"이 문장이 말하는 사실이 이전과 똑같은가?"*
   다르면 되돌려라.
4. **`node scripts/sync-baseline.mjs`를 돌린다.** 개념 `name`을 고쳤거나 `questions.json`을
   고쳤으면 스냅샷을 갱신해야 `check-structure.mjs`가 통과한다. 이 도구는 구조가 어긋나
   있으면 거부하고 아무것도 쓰지 않는다 — 거부당했다면 범위를 넘은 것이니 되돌려라.
   **`topics-baseline.json`을 손으로 고치지 마라.**
5. **`npm test`가 옛 문구를 고정하고 있어 깨지면, 단언의 문구만 새 문장으로 맞춘다.**
   단언의 뜻을 바꾸거나 단언을 지우지 마라. 새 단언을 더할 필요도 없다.
6. **`node scripts/field-diff.mjs 04f6946`로 범위를 벗어나지 않았는지 확인한다.**

### 명사구 래칫

이 step이 맡은 주제는 이미 `nounPhraseRatchet`에 들어 있거나 전용 단언으로 고정돼 있다.
**배열을 건드리지 마라.** 대신 `npm test`가 그대로 통과하는지만 확인한다.

## Acceptance Criteria

```bash
npm test                                  # 전부 통과
npm run build                             # tsc 타입체크 포함
node scripts/sync-baseline.mjs            # 스냅샷 갱신 (거부당하면 범위를 넘은 것이다)
node scripts/check-structure.mjs          # exit 0
node scripts/field-diff.mjs 04f6946         # exit 0 — 얼어 있는 필드가 그대로여야 한다
node scripts/coverage.mjs                 # 618/618
node scripts/check-verbatim.mjs           # 전사 이상 없음
node scripts/content-audit.mjs aws-core-services s3-storage-classes s3-versioning-lifecycle
```

**`content-audit.mjs`의 판정.** 맡은 주제에서 아래를 만족해야 한다.

- **① 문장형 제목이 0이어야 한다.** 이 phase가 `name`을 맡았으므로 이번에는 목표값이다.
- **② 관용 표현은 줄거나 같아야 한다.**
- **③ 정답 노출 후보가 늘면 안 된다.** 늘었다면 보기 표기를 건드려 변별 신호를 만든 것이다.
- ④⑤⑥은 이번 범위 밖이다. **늘지만 않으면 된다.**

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `node scripts/field-diff.mjs 04f6946 --list`를 읽고, **정답 보기의 글자가 바뀐 문항이
   있으면 그 문항의 보기 넷과 해설을 다시 읽는다.** 오답 포인트가 그대로인지가 마지막 관문이다.
3. `phases/32-field-consistency/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단이 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 남길 것

마지막 step이 이것만 보고 사용자 보고서를 쓴다. **네 가지를 빠뜨리지 마라.**

1. **필드별 수정 건수** — `name` N건 / `summary` N건 / `prompt` N건 / `choices` N건.
   `node scripts/field-diff.mjs 04f6946`가 찍는 누적값이 아니라 **이 step이 고친 수**를 적어라.
2. **보류 목록** — 위 형식. 사유별로 묶어라.
3. **의미 변경 위험 때문에 손대지 않은 항목** — 보류 중에서도 이 사유인 것을 따로 표시.
4. **정답 보기를 고친 문항이 있으면 그 id와 이유.** 없으면 "없다"고 적어라.

## 금지사항

- **개념 `paragraphs`와 문항 `explanation`을 고치지 마라.** 이유: phase 31이 이미 다시 썼고,
  이번 범위는 나머지 네 필드를 **거기에 맞추는** 것이다. `field-diff.mjs`가 exit 1로 잡는다.
- **`answerIndex`·보기 순서·개념 순서·개념 개수·문항 개수를 바꾸지 마라.**
  이유: 정답이 달라지고 `data.test.ts`·`check-structure.mjs`가 불변식으로 고정하고 있다.
- **다른 주제를 고치지 마라.** 이유: step마다 주제를 나눈 것이 이 phase의 구조다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** 이유: 개념이 618개라 손으로 고치면
  오타가 들어가고, 그 오타는 진짜 구조 사고와 구분되지 않는다. `sync-baseline.mjs`를 써라.
- **용어 풀이를 새로 넣거나 도입 문장을 새로 만들지 마라.** 이유: 「새로운 정보 추가」다.
- **출처 파일(`docs/source/`)을 읽으러 가지 마라.** 이유: 사실관계를 확인할 일이 없다.
- 기존 테스트를 깨뜨리지 마라.
