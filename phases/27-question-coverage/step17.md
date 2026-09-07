# Step 17: questions-security-services — 문항 26개 이상

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
- `/docs/source/dump-gaps/Q051-Q100.md`
- `/docs/source/dump-gaps/Q101-Q150.md`
- `/docs/source/dump-gaps/Q251-Q300.md`
- `/docs/source/dump-gaps/Q301-Q350.md`
- `/docs/source/dump-gaps/Q351-Q400.md`
- `/docs/source/dump-gaps/Q401-Q450.md`
- `/docs/source/dump-gaps/Q451-Q500.md`
- `/docs/source/dump-gaps/Q501-Q550.md`
- `/docs/source/dump-gaps/Q551-Q600.md`
- `/docs/source/dump-gaps/Q601-Q650.md`
- `/docs/source/dump-gaps/Q651-Q700.md`
- `/docs/source/dump-gaps/Q701-Q750.md`
- `/docs/source/dump-gaps/Q801-Q850.md`
- `/docs/source/dump-gaps/Q851-Q880.md`

## 담당 범위

| 주제 | 제목 | 중요도 | 전체 개념 | 문항 없는 개념 |
|---|---|---|---|---|
| `secrets-encryption` | Secrets Manager·Parameter Store·KMS·ACM·CloudHSM | 3 | 20 | **11** |
| `waf-shield` | WAF·Shield·Firewall Manager | 3 | 15 | **8** |
| `guardduty-macie-inspector` | GuardDuty·Macie·Inspector·Security Hub | 3 | 11 | **7** |

**26개 개념에 문항이 없다. 이 step이 전부 덮는다.**

담당 개념 목록(괄호는 덤프 근거가 있는 파일):

- `secrets-encryption.kms-key-types-by-management` — KMS 키의 관리 주체: 고객 관리 키·AWS 관리 키·AWS 소유 키  (Q551-Q600.md)
- `secrets-encryption.kms-multi-region-key` — KMS 다중 리전 키  (Q001-Q050.md)
- `secrets-encryption.kms-imported-key-material` — KMS의 가져온 키 자료  (Q251-Q300.md)
- `secrets-encryption.kms-cloudhsm-key-store` — CloudHSM이 뒷받침하는 KMS 키  (Q451-Q500.md)
- `secrets-encryption.kms-key-per-tenant` — KMS 키를 테넌트마다 따로 만든다  (Q701-Q750.md)
- `secrets-encryption.acm-dns-validation` — ACM의 도메인 검증 방식  (Q401-Q450.md)
- `secrets-encryption.secrets-manager-batch-get-secret-value` — Secrets Manager의 BatchGetSecretValue API  (Q651-Q700.md)
- `secrets-encryption.kms-automatic-key-rotation` — KMS 자동 키 교체는 해마다 돈다  (Q501-Q550.md)
- `secrets-encryption.kms-symmetric-vs-asymmetric-rotation` — KMS 대칭 키와 비대칭 키의 자동 교체  (Q701-Q750.md)
- `secrets-encryption.imported-key-material-rotation` — KMS의 가져온 키 자료를 교체하는 방법  (Q301-Q350.md)
- `secrets-encryption.acm-expiration-event` — ACM 인증서 만료 임박 이벤트  (Q051-Q100.md)
- `waf-shield.firewall-manager` — AWS Firewall Manager  (Q801-Q850.md)
- `waf-shield.waf-managed-rule-groups` — WAF 관리형 규칙 그룹  (Q051-Q100.md)
- `waf-shield.waf-rate-based-rule` — WAF 속도 기반 규칙  (Q651-Q700.md)
- `waf-shield.shield-standard-network-layer` — Shield Standard가 다루지 않는 계층  (Q051-Q100.md)
- `waf-shield.shield-advanced-protection-group` — Shield Advanced 보호 그룹  (Q651-Q700.md)
- `waf-shield.waf-body-inspection-size-limit` — WAF가 검사하는 요청 본문에는 크기 한도가 있다  (Q451-Q500.md)
- `waf-shield.waf-web-acl-region-must-match-rest-api` — REST API에 붙일 Web ACL은 같은 리전에 만든다  (Q801-Q850.md)
- `waf-shield.waf-logging-to-firehose` — WAF 로그는 Firehose를 거쳐 S3로 간다  (Q801-Q850.md)
- `guardduty-macie-inspector.amazon-inspector` — Amazon Inspector  (Q101-Q150.md)
- `guardduty-macie-inspector.security-hub` — AWS Security Hub  (Q601-Q650.md)
- `guardduty-macie-inspector.macie-automated-discovery` — Macie의 민감 데이터 자동 탐지  (Q351-Q400.md)
- `guardduty-macie-inspector.inspector-scans-ecr-images` — Inspector의 ECR 컨테이너 이미지 스캔  (Q851-Q880.md)
- `guardduty-macie-inspector.macie-delegated-administrator` — Macie는 위임 관리자 계정에서 조직 전체를 본다  (Q501-Q550.md)
- `guardduty-macie-inspector.guardduty-finding-to-eventbridge` — GuardDuty 탐지 결과를 자동 대응으로 잇는다  (Q301-Q350.md)
- `guardduty-macie-inspector.macie-finding-to-eventbridge` — Macie의 탐지 결과에 알림을 붙인다  (Q551-Q600.md)

목록을 다시 뽑으려면:

```bash
node scripts/coverage.mjs secrets-encryption waf-shield guardduty-macie-inspector
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
node scripts/coverage.mjs secrets-encryption waf-shield guardduty-macie-inspector  # exit 0 — 담당 주제 커버리지 100%
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
