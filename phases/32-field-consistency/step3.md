# Step 3: data-transfer-and-storage-gateway

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
| `data-transfer-services` | 19 | 20 | 개념·문항 전부 |
| `storage-gateway-migration` | 7 | 13 | 개념·문항 전부 |

### `data-transfer-services`

**개념 19개. 문장형 제목 8개.** 아래 목록에서 `▸`가 문장형이다.

```
   0. datasync                                       DataSync
   1. snowball-edge                                  Snowball Edge
▸  2. snowball-edge-compute                          Snowball Edge는 전송 장비만이 아니다
   3. transfer-family                                Transfer Family
   4. transfer-family-workflow                       Transfer Family의 업로드 후 워크플로
   5. s3-transfer-acceleration                       S3 전송 가속
▸  6. transfer-deadline-vs-bandwidth                 기한과 대역폭을 먼저 곱해 본다
   7. file-gateway-vs-datasync-continuous            지속 수집과 예약 전송의 갈림길
▸  8. transfer-family-custom-hostname                기존 호스트 이름과 인증 체계를 그대로 옮긴다
▸  9. transfer-family-directory-service-identity-provider ID 공급자로 기존 Active Directory를 쓴다
  10. transfer-family-service-managed-users          사용자와 SSH 키를 서비스가 들고 있는 방식
  11. datasync-scope-limits                          DataSync가 맡지 않는 일
▸ 12. datasync-in-transit-encryption                 DataSync는 전송 중에 암호화한다
▸ 13. datasync-manifest                              매니페스트로 전송 대상을 좁힌다
▸ 14. datasync-transfer-mode                         전송 모드로 바뀐 것만 보낸다
▸ 15. datasync-task-status-event                     작업 실행 상태는 EventBridge 이벤트로 나온다
  16. transfer-family-workflow-actions               워크플로에 이미 들어 있는 액션들
  17. transfer-family-structured-logging             Transfer Family의 구조화된 로깅
  18. s3-multipart-upload                            멀티파트 업로드
```

**`summary`에 옛 어휘가 든 개념**

- `snowball-edge-compute` — 돌리
- `file-gateway-vs-datasync-continuous` — 자리
- `datasync-scope-limits` — 자리

**`data.test.ts`가 글자로 고정한 제목·요약** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `snowball-edge-compute` — 단언이 잡고 있는 말: `Snowball Edge는`
- `file-gateway-vs-datasync-continuous` — 단언이 잡고 있는 말: `파일 게이트웨이`, `DataSync는`
- `transfer-family-service-managed-users` — 단언이 잡고 있는 말: `Transfer Family는`
- `datasync-in-transit-encryption` — 단언이 잡고 있는 말: `DataSync는`

**문항 20개**

`q049` `q050` `q051` `q351` `q352` `q353` `q354` `q355` `q356` `q357` `q358` `q359` `q360` `q361` `q362` `q363` `q364` `q365` `q366` `q367`

**`prompt`에 옛 어휘가 든 문항**

- `q351` — 자리

**`choices`에 옛 어휘가 든 문항** — 보기 넷을 한 벌로 보고 판단해라

- `q356` — c1(정답) — 돌린

**`data.test.ts`가 글자로 고정한 프롬프트·보기** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `q355` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q356` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q357` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q360` — 단언이 잡고 있는 말: `DataSync는`

### `storage-gateway-migration`

**개념 7개. 문장형 제목 1개.** 아래 목록에서 `▸`가 문장형이다.

```
   0. storage-gateway                                Storage Gateway
   1. dms-sct                                        DMS와 SCT
   2. application-migration-service                  Application Migration Service
   3. storage-gateway-gateway-types                  Storage Gateway의 게이트웨이 유형
   4. storage-gateway-volume-modes                   저장 볼륨 게이트웨이와 캐시된 볼륨 게이트웨이
   5. tape-gateway-archive-tiers                     가상 테이프가 내려가는 아카이브 계층
▸  6. dms-full-load-and-cdc-task                     전체 로드와 CDC를 한 태스크로 건다
```

**`data.test.ts`가 글자로 고정한 제목·요약** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `storage-gateway-gateway-types` — 단언이 잡고 있는 말: `파일 게이트웨이`

**문항 13개**

`q052` `q053` `q054` `q055` `q056` `q057` `q368` `q369` `q370` `q371` `q372` `q373` `q374`

**`data.test.ts`가 글자로 고정한 프롬프트·보기** — 고치려면 단언의 문구도 함께 맞춰야 한다.
**단언의 뜻은 바꾸지 마라.**

- `q053` — 단언이 잡고 있는 말: `Storage Gateway의 주된 목적은 무엇인가?`
- `q054` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q055` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q056` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q057` — 단언이 잡고 있는 말: `Storage Gateway 자체의 스토리지 기능을 옳게 설명한 것은 무엇인가?`
- `q370` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q371` — 단언이 잡고 있는 말: `파일 게이트웨이`
- `q372` — 단언이 잡고 있는 말: `파일 게이트웨이`

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

### 명사구 래칫에 주제를 더한다

`src/data/data.test.ts`의 `nounPhraseRatchet` 배열에 아래를 더해라.
끝낸 주제가 되돌아가지 않게 붙잡는 장치다. **통과시키려고 예외 목록을 만들지 마라** —
여기 적히는 것은 "고쳤다"는 기록이지 넘기는 목록이 아니다.

```
'data-transfer-services',
'storage-gateway-migration',
```

더한 뒤 `npm test`가 통과해야 한다. 실패한다면 그 주제에 문장형 제목이 남아 있는 것이다.

## Acceptance Criteria

```bash
npm test                                  # 전부 통과
npm run build                             # tsc 타입체크 포함
node scripts/sync-baseline.mjs            # 스냅샷 갱신 (거부당하면 범위를 넘은 것이다)
node scripts/check-structure.mjs          # exit 0
node scripts/field-diff.mjs 04f6946         # exit 0 — 얼어 있는 필드가 그대로여야 한다
node scripts/coverage.mjs                 # 618/618
node scripts/check-verbatim.mjs           # 전사 이상 없음
node scripts/content-audit.mjs data-transfer-services storage-gateway-migration
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
