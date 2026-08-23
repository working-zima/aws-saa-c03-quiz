# Step 7: rewrite-security

## 읽어야 할 파일

먼저 아래 파일들을 읽고 설계 의도를 파악하라:

- `/CLAUDE.md` — 프로젝트 규칙
- `/docs/ADR.md` — **ADR-009가 이 step의 근거다.** ADR-006·ADR-008(출처 한정)도 함께 읽어라.
- `/docs/ARCHITECTURE.md` — `Topic` / `Concept` / `Question` 데이터 모델
- `/src/data/topics.json` — 재작성 대상
- `/src/data/questions.json` — 의미 보존 확인에 쓴다. **읽기만 한다.**
- `/src/data/data.test.ts` — 이 테스트가 무엇을 검증하는지 알아야 무엇을 건드리면 안 되는지 안다.
- `/scripts/check-verbatim.mjs`, `/scripts/check-structure.mjs` — 채점 도구. 읽되 고치지 마라.
- `/docs/source/concepts-raw.md` — 원본. **뜻이 모호할 때 대조용으로만** 본다. 아래 "기준" 항목을 읽어라.

## 배경 — 이 step이 하는 일

`src/data/topics.json`의 개념 본문 중 97개는 유료 교재 추출본(`docs/source/concepts-raw.md`)을
거의 그대로 옮긴 전사본이다. "원본의 표현과 어투를 유지한다"는 당시 규칙 때문이다.
저장소를 공개하려면 이걸 해소해야 한다. phase 2는 그 97개를 직접 쓴 문장으로 교체한다.

**의미는 바꾸지 않는다.** 바꾸는 것은 표현·문장 구조·문단 구성뿐이다.
현재 본문에 있는 사실이 빠져도 안 되고, 네가 아는 AWS 지식을 끌어와 보태도 안 된다.

**기준은 현재 `src/data/topics.json`의 본문이다.** `concepts-raw.md`는 현재 본문의 뜻이
모호할 때만 펴 본다. 원본에는 있지만 개념 본문에 안 들어간 내용을 새로 넣지 마라.
이유: 무엇을 개념에 담을지는 phase 0에서 이미 결정됐다. 이 step은 그 결정을 다시 하지 않는다.

이 step은 `secrets-encryption`, `threat-protection` 주제의 개념 **10개**를 맡는다.

이전 step들이 다른 주제의 개념을 이미 재작성했다 (`rewrite-foundation`, `rewrite-s3`, `rewrite-storage`, `rewrite-database`, `rewrite-compute`, `rewrite-network`, `rewrite-analytics`).
`src/data/topics.json`에서 그 결과를 읽어 문체를 맞춰라. 새로 시작하는 게 아니라 이어 쓰는 작업이다.

## 재작성 대상

### `secrets-encryption` — Secrets Manager·Parameter Store·KMS·ACM (★★★, 원본 p44–44)

개념 5개 · 문항 8개(q138~q145)

| 개념 id | name (고정) | 문단 수 | 현재 글자수 | 이 개념을 근거로 하는 문항 |
|---|---|---|---|---|
| `secrets-encryption.secrets-manager` | Secrets Manager | 1 | 71 | q138 |
| `secrets-encryption.parameter-store` | System Manager Parameter Store | 1 | 86 | q139 |
| `secrets-encryption.secrets-manager-vs-parameter-store` | Secrets Manager vs System Manager Parameter Store | 2 | 375 | q140, q144 |
| `secrets-encryption.kms` | KMS (Key Management Service) | 2 | 153 | q141~q142, q145 |
| `secrets-encryption.acm` | ACM (AWS Certificate Manager) | 1 | 79 | q143 |

### `threat-protection` — WAF·Shield·GuardDuty·Macie·CloudFront (★★★, 원본 p45–47)

개념 5개 · 문항 9개(q146~q154)

| 개념 id | name (고정) | 문단 수 | 현재 글자수 | 이 개념을 근거로 하는 문항 |
|---|---|---|---|---|
| `threat-protection.waf` | WAF (Web Application Firewall) | 3 | 375 | q146~q148 |
| `threat-protection.shield` | Shield | 1 | 70 | q149 |
| `threat-protection.guardduty` | GuardDuty | 2 | 120 | q150 |
| `threat-protection.macie` | Macie | 2 | 152 | q151 |
| `threat-protection.cloudfront` | CloudFront | 2 | 440 | q152~q154 |

표에 없는 개념은 건드리지 마라. 각 주제의 `concepts` 배열에는 1-exam-gaps에서 이미
직접 쓴 개념이 뒤쪽에 섞여 있다. 그것들은 재작성 대상이 아니다.

## 작업 절차

### 1단계 — 사실 목록 추출 → `phases/2-rewrite/step7-facts.md`

개념마다 현재 본문에서 **사실만** 불릿으로 뽑아 이 파일에 적는다.
원본 문장을 그대로 옮기지 말고, 사실 단위로 끊어서 짧게 적어라.

```markdown
## <개념 id>
- <사실 1>
- <사실 2>
```

**사실인 것**: 서비스 이름과 역할, 수치와 단위, 조건과 제약, 다른 서비스와의 비교·차이,
"언제 무엇을 쓰는가"의 판단 기준.

**사실이 아닌 것**: 원본의 말투, 강조 표현, `[암기 Tip]` 같은 학습 요령의 포장.

단, **비유가 개념 이해의 핵심이면 사실로 취급한다** (예: "EC2는 컴퓨터 한 대를 빌려 쓰는 것").
이때도 2단계에서 같은 뜻을 네 문장으로 다시 쓴다.

이 파일은 `.gitignore` 대상이라 커밋되지 않는다. 사람이 결과를 대조하는 용도다.

### 2단계 — 재작성

**1단계에서 뽑은 불릿만 보고 새 문장을 쓴다.** 기존 본문을 옆에 두고 고쳐 쓰지 마라 —
표현에 끌려가서 결국 전사가 된다.

- `summary`: 한 문장. 그 개념이 무엇인지.
- `paragraphs`: 문단 단위 평문 배열. **기존 문단 수·순서와 같을 필요가 없다.**
  사실이 다 들어가는 것이 우선이고, 읽기 좋게 묶는 것이 그다음이다.
- 문단 안의 `\n`은 줄바꿈으로 렌더링된다 (`ConceptReadPage.tsx`가 `whitespace-pre-line`을 쓴다).
  항목을 나열할 때 그대로 써도 된다.
- 원본 표기를 옮기지 마라: 이모지, `💡한 줄 요약 :`, `✅`, `[암기 Tip]`, `[접근 빈도에 따른 분류]`.
  내용이 사실이면 평문으로 녹이고, 포장이면 버려라.
- 추출 아티팩트도 이 참에 정리된다: 숫자 사이 공백(`52. 123.25. 11`),
  여는 괄호 유실(`DNSDomain Name System)`), 자간 벌어짐(`S3 는`).

**파일 편집 방식 — 이걸 어기면 AC가 통과하지 않는다.**

`src/data/topics.json`은 **개념 하나가 정확히 한 줄**인 포맷이다:

```
      {"id":"...","name":"...","summary":"...","paragraphs":["...","..."]},
```

주제 껍데기는 들여쓰기 2칸의 보통 JSON이지만, 개념 줄만은 공백 없이 압축돼 있다.
개념 하나를 고치면 diff에 한 줄만 뜨게 하려는 포맷이다.

**해당 개념 줄만 통째로 교체하라.** JSON 라이브러리로 파일을 읽어 전체를 다시 쓰지 마라
(`json.dump`, `JSON.stringify(obj, null, 2)` 등). 파일 전체가 재직렬화되면서 이 포맷이 깨지고,
diff가 파일 전부로 번져 사람이 검토할 수 없게 된다. `scripts/check-structure.mjs`가 이걸 잡아낸다.

### 3단계 — 문항 근거 확인

위 표의 "이 개념을 근거로 하는 문항"을 **전부 열어서**, 각 문항의 정답 근거가
재작성된 본문에서 여전히 확인되는지 본다. 해설(`explanation`)이 가리키는 내용도 같이 본다.

근거가 사라졌다면 사실이 빠진 것이다. **본문을 보강해서 해결하라. 문항을 고치지 마라.**
이유: `src/data/questions.json`은 phase 0·1에서 확정됐고, `src/data/data.test.ts`가
문항 id 범위·정답 위치·문구를 하드코딩으로 검증한다. 문항을 손대면 그 테스트가 깨진다.

### 4단계 — 검사

아래 AC를 실행한다. `check-verbatim.mjs`가 위반을 뱉으면 그 구간을 다시 써라.
스크립트가 통과했다고 재작성이 끝난 게 아니다 — 본문이 짧으면 전사여도 통과한다.
표의 개념 10개를 **전부** 새로 썼는지 스스로 확인하라.

## Acceptance Criteria

```bash
node scripts/check-verbatim.mjs secrets-encryption threat-protection   # 전사 구간 0건
node scripts/check-structure.mjs                # 본문 외 변경 0건
npm test                                        # 기존 테스트 전부 통과
npm run build                                   # 타입 에러 없음
```

네 커맨드가 전부 exit 0이어야 한다.

- `check-verbatim.mjs` — 원본과 32자 이상 연속 일치하는 구간을 잡는다. 걸린 구간을 다시 써라.
- `check-structure.mjs` — 개념 `id`·`name`, 주제 메타데이터, 개념 개수·순서,
  개념 한 줄 포맷, `questions.json` 해시를 `scripts/topics-baseline.json`과 대조한다.
  여기서 걸리면 본문 아닌 것을 건드린 것이다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 체크리스트를 확인한다:
   - 표의 개념 10개를 전부 재작성했는가? (누락된 것 없이)
   - 표의 문항 17개가 재작성된 본문으로 여전히 풀리는가?
   - 현재 본문에 있던 사실 중 빠진 것이 없는가? (`step7-facts.md`와 대조)
   - 원본에 없는 AWS 지식을 넣지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/2-rewrite/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `src/data/questions.json`을 수정하지 마라. 이유: phase 0·1에서 확정됐고 `data.test.ts`가 하드코딩으로 검증한다.
- `src/data/data.test.ts`를 수정하지 마라. 이유: 본문만 바꾸면 이 테스트는 그대로 통과해야 한다. 통과하지 못한다면 본문 아닌 것을 건드린 것이다.
- `scripts/check-verbatim.mjs`, `scripts/check-structure.mjs`, `scripts/topics-baseline.json`을 수정하지 마라. 이유: 채점 도구와 그 기준이다. 통과가 안 되면 도구가 아니라 본문을 고쳐라.
- 개념을 추가·삭제·분할·병합하지 마라. 이유: 문항 169개가 `conceptId`로 개념을 참조한다. 개수가 바뀌면 참조와 테스트가 함께 깨진다.
- 개념의 `id`·`name`, 주제의 `title`·`importance`·`sourcePages`를 바꾸지 마라. 이유: 위와 같다.
- 원본에 없는 AWS 지식을 넣지 마라. 이유: ADR-006. 출처는 두 파일뿐이고, 이 phase는 표현만 바꾼다.
- 현재 본문에 있는 사실을 빼지 마라. 이유: 문항의 정답 근거가 사라진다.
- 표에 없는 주제·개념을 건드리지 마라. 이유: 다른 step의 범위다.
- 앱 코드(`src/pages`, `src/components`, `src/lib`, `src/types`)를 수정하지 마라. 이유: 이 phase는 데이터만 바꾼다.
- `src/data/topics.json`을 JSON 라이브러리로 재직렬화하지 마라. 이유: 개념 한 줄 포맷이 깨져 diff가 파일 전체로 번진다. 고칠 개념 줄만 교체하라.
- 기존 테스트를 깨뜨리지 마라
