# Step 5: questions-data-transfer — 문항 22개 이상

## 읽어야 할 파일

- `/CLAUDE.md` — 특히 "아키텍처 규칙"과 "원본 데이터", "개발 프로세스"(TDD)
- `/docs/PRD.md` — 「사용자」·「목표」·**「문제 은행」(step 0이 개정했다. 크기 기준이 커버리지다)**
- `/docs/ARCHITECTURE.md` — 「데이터 모델」·「테스트 경계」
- `/docs/ADR.md` — **ADR-026**(step 0이 추가한 커버리지 결정), ADR-021(덤프 해설의 지위),
  ADR-009(전사 금지), ADR-011(문항 표현 규칙), ADR-017(오답노트), ADR-023(주제 재편)
- `/src/types/content.ts` — `Question` 타입
- `/src/data/questions.json` — 고칠 대상. **여기에만 더한다**
- `/src/data/topics.json` — 근거 개념. **읽기만 한다**
- `/src/data/data.test.ts` — 문항 불변식

담당 개념의 덤프 근거는 아래에 있다. **개념마다 `[Q번호 p쪽]` 인용이 붙어 있고, 필요하면
`/docs/source/dump-slices/`에서 그 번호의 원문 문항을 찾아볼 수 있다.**

- `/docs/source/dump-gaps/Q001-Q050.md`
- `/docs/source/dump-gaps/Q101-Q150.md`
- `/docs/source/dump-gaps/Q151-Q200.md`
- `/docs/source/dump-gaps/Q251-Q300.md`
- `/docs/source/dump-gaps/Q351-Q400.md`
- `/docs/source/dump-gaps/Q401-Q450.md`
- `/docs/source/dump-gaps/Q451-Q500.md`
- `/docs/source/dump-gaps/Q501-Q550.md`
- `/docs/source/dump-gaps/Q551-Q600.md`
- `/docs/source/dump-gaps/Q601-Q650.md`
- `/docs/source/dump-gaps/Q651-Q700.md`
- `/docs/source/dump-gaps/Q701-Q750.md`
- `/docs/source/dump-gaps/Q751-Q800.md`
- `/docs/source/dump-gaps/Q801-Q850.md`

## 담당 범위

| 주제 | 제목 | 중요도 | 전체 개념 | 문항 없는 개념 |
|---|---|---|---|---|
| `data-transfer-services` | DataSync·Snowball Edge·Transfer Family·S3 전송 | 3 | 19 | **16** |
| `storage-gateway-migration` | Storage Gateway·DMS·Application Migration Service | 3 | 7 | **6** |

**22개 개념에 문항이 없다. 이 step이 전부 덮는다.**

담당 개념 목록(괄호는 덤프 근거가 있는 파일):

- `data-transfer-services.snowball-edge-compute` — Snowball Edge는 전송 장비만이 아니다  (Q001-Q050.md)
- `data-transfer-services.transfer-family-workflow` — Transfer Family의 업로드 후 워크플로  (Q351-Q400.md)
- `data-transfer-services.s3-transfer-acceleration` — S3 전송 가속  (Q151-Q200.md)
- `data-transfer-services.transfer-deadline-vs-bandwidth` — 기한과 대역폭을 먼저 곱해 본다  (Q751-Q800.md)
- `data-transfer-services.file-gateway-vs-datasync-continuous` — 지속 수집과 예약 전송의 갈림길  (Q251-Q300.md)
- `data-transfer-services.transfer-family-custom-hostname` — 기존 호스트 이름과 인증 체계를 그대로 옮긴다  (Q601-Q650.md)
- `data-transfer-services.transfer-family-directory-service-identity-provider` — ID 공급자로 기존 Active Directory를 쓴다  (Q701-Q750.md)
- `data-transfer-services.transfer-family-service-managed-users` — 사용자와 SSH 키를 서비스가 들고 있는 방식  (Q801-Q850.md)
- `data-transfer-services.datasync-scope-limits` — DataSync가 맡지 않는 일  (Q151-Q200.md)
- `data-transfer-services.datasync-in-transit-encryption` — DataSync는 전송 중에 암호화한다  (Q401-Q450.md)
- `data-transfer-services.datasync-manifest` — 매니페스트로 전송 대상을 좁힌다  (Q651-Q700.md)
- `data-transfer-services.datasync-transfer-mode` — 전송 모드로 바뀐 것만 보낸다  (Q701-Q750.md)
- `data-transfer-services.datasync-task-status-event` — 작업 실행 상태는 EventBridge 이벤트로 나온다  (Q651-Q700.md)
- `data-transfer-services.transfer-family-workflow-actions` — 워크플로에 이미 들어 있는 액션들  (Q551-Q600.md)
- `data-transfer-services.transfer-family-structured-logging` — Transfer Family의 구조화된 로깅  (Q451-Q500.md)
- `data-transfer-services.s3-multipart-upload` — 멀티파트 업로드  (Q601-Q650.md)
- `storage-gateway-migration.dms-sct` — DMS와 SCT  (Q001-Q050.md)
- `storage-gateway-migration.application-migration-service` — Application Migration Service  (Q751-Q800.md)
- `storage-gateway-migration.storage-gateway-gateway-types` — Storage Gateway의 게이트웨이 유형  (Q151-Q200.md)
- `storage-gateway-migration.storage-gateway-volume-modes` — 저장 볼륨 게이트웨이와 캐시된 볼륨 게이트웨이  (Q101-Q150.md)
- `storage-gateway-migration.tape-gateway-archive-tiers` — 가상 테이프가 내려가는 아카이브 계층  (Q501-Q550.md)
- `storage-gateway-migration.dms-full-load-and-cdc-task` — 전체 로드와 CDC를 한 태스크로 건다  (Q551-Q600.md)

목록을 다시 뽑으려면:

```bash
node scripts/coverage.mjs data-transfer-services storage-gateway-migration
```

## 작업

**id는 `questions.json`의 마지막 문항 다음 번호부터 이어 쓴다.** 미리 정해 두지 않는 이유는
앞 step이 헷갈리는 짝 때문에 문항을 더 썼을 수 있기 때문이다. 시작 번호를 먼저 확인해라.

TDD로 한다(CLAUDE.md CRITICAL).

### 1. 테스트를 먼저 쓴다

`src/data/data.test.ts`에 이 step의 블록을 더한다. 기존 테스트를 고치지 말고 **새 `it`을 더한다.**

- 네가 쓸 id 범위가 연속인지, 각 문항의 `topicId`가 자기 `conceptId`의 주제와 같은지
- **담당 주제의 모든 개념이 문항 하나 이상을 갖는지** — 이것이 이 step의 핵심 단정이다
- 네가 쓴 문항에서 `answerIndex` 0·1·2·3이 각각 20~30%인지
- 보기 4개가 서로 다르고 해설이 100자 이상인지

### 2. 문항을 쓴다

개념 하나에 문항 하나가 기본이다. 개념 본문이 **변별 축**을 담고 있으면(예: "A는 X이고
B는 Y다") 그 축을 묻는 문항이 자연스럽다. 헷갈리는 짝은 두 방향으로 물어 둘을 만들어도 된다.

오답은 **같은 주제의 이웃 개념**에서 고른다. 담당 주제의 개념 목록이 곧 오답 후보다.

## 이 step에서 반드시 지킬 것

1. **담당 개념을 하나도 남기지 마라.** 문항이 없는 개념은 문제만 푸는 학습자에게 존재하지
   않는다. 이 phase의 목적이 "문제만 계속 풀어도 개념 공부가 다 된다"이므로, 빠뜨린 개념은
   그 경로에서 배울 수 없는 사각지대가 된다. 근거는 ADR-026.
2. **`conceptId`는 담당 개념의 실제 id여야 하고, 정답 근거가 그 개념 본문에 있어야 한다.**
   개념에 없는 사실로 출제하지 마라 — 학습자가 읽은 것으로 풀 수 없는 문항이 된다.
   `topicId`는 그 개념이 속한 주제와 같아야 한다.
3. **덤프에서 문제문·보기·해설을 옮겨 적지 마라.** 덤프는 "이 개념이 시험에서 어떻게
   물어지는가"를 확인하는 데만 쓴다. 사실만 가져오고 문장은 직접 쓴다. 근거는 ADR-009·ADR-021.
4. **해설은 그 개념을 가르치는 글이다.** 정답이 왜 맞는지와 **오답이 왜 아닌지(변별 축)** 를
   함께 담는다. 지금 은행의 방식과 같다(중앙값 118자). **100자 미만으로 줄이지 마라.**
   문제만 푸는 사용자에게는 해설이 유일한 설명 텍스트다.
5. **오답은 같은 주제의 이웃 개념에서 고른다.** 오답만으로 소거되는 보기를 만들지 마라.
   근거는 PRD 「문제 은행」과 phase 23.
6. **정답 위치를 이 step 안에서 고르게 흩는다.** 네가 쓴 문항에서 `answerIndex` 0·1·2·3이
   각각 20~30%가 되게 한다. 한 인덱스에 몰면 반복 학습에서 위치를 외우게 된다.
7. **프롬프트는 상황을 세운다.** "위의", "1번 보기", "다음 중 옳은 것" 같은 표현을 쓰지 마라
   (ADR-011 — 문항은 섞여서 나오므로 순서를 가리키는 말이 성립하지 않는다).
8. **개념 본문을 고치지 마라.** `topics.json`의 `name`·`summary`·`paragraphs`를 건드리지
   않는다. 개념을 고쳐야 문항이 성립한다면 그것은 이 step의 범위 밖이니 `summary`에 적어 남겨라.

## 금지사항

- **`scripts/topics-baseline.json`을 고치지 마라.** 문항을 더하면 `questionsSha256`이
  어긋나 `node scripts/check-structure.mjs`가 실패한다. **그것이 정상이다** — 마지막 step이
  한 번에 재생성한다. 여기서 갱신하면 step마다 baseline이 충돌한다.
- 담당 범위 밖의 주제에 문항을 더하지 마라. 이유: 다음 step이 그 주제를 맡는다.
- 기존 문항 `q001`~`q246`의 어떤 필드도 고치지 마라. 이유: `data.test.ts`의 slice 기반
  검증이 앞쪽 문항의 순서와 내용을 고정하고 있다.
- 런타임에 외부 API를 부르는 코드를 넣지 마라(CLAUDE.md CRITICAL).
- 기존 테스트를 깨뜨리지 마라.

## Acceptance Criteria

```bash
npm run build                              # 컴파일 에러 없음
npm test                                   # 새 테스트를 포함해 전부 통과
node scripts/coverage.mjs data-transfer-services storage-gateway-migration  # exit 0 — 담당 주제 커버리지 100%
```

`node scripts/check-structure.mjs`는 `questionsSha256`이 어긋나 실패한다. **정상이다** —
마지막 step이 재생성한다. 여기서 baseline을 고치지 마라.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/27-question-coverage/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **네가 쓴 문항 id 범위와 개수, 주제별 문항 수, 담당 개념을 하나도 남기지
않았다는 확인**을 반드시 적어라. 다음 step이 그 뒤 id부터 이어 쓴다.
