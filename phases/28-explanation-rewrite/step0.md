# Step 0: adr-and-audit — 근거 규칙을 ADR로 박고 측정 도구를 만든다

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 설계 의도를 파악하라:

- `/CLAUDE.md` — 「아키텍처 규칙」·「원본 데이터」
- `/docs/ADR.md` — 특히 **ADR-006**(원본을 유일한 출처로), **ADR-008**(두 번째 출처 exam-gaps),
  **ADR-009**(개념 본문을 직접 쓴 문장으로 재작성 + 「검증」 문단), **ADR-010**(일반 IT 용어 예외),
  **ADR-021**(네 번째 출처 덤프 해설집), **ADR-026**(문제 은행 크기를 커버리지로 + 「해설을 짧게 쓰지 않는 이유」)
- `/docs/PRD.md` — 「원본」·「문제 은행」
- `/scripts/coverage.mjs` — 같은 성격의 측정 도구. **인터페이스와 출력 형식을 여기에 맞춘다**
- `/scripts/check-structure.mjs` — `questionsSha256` 가드가 어떻게 도는지 확인용
- `/src/data/questions.json` — 측정 대상 (읽기만 한다)
- `/src/data/topics.json` — 개념 본문 (읽기만 한다)

## 배경 — 이 phase가 무엇을 고치는가

`q001`~`q246`은 ADR-026이 「해설을 짧게 쓰지 않는 이유」를 정하기 **전에** 쓰인 문항이다.
실측하면 이렇다.

| 구간 | 문항 | 해설 평균 | 해설 최소 | 해설 최대 |
|---|---|---|---|---|
| `q001`~`q246` | 246 | 126자 | 58자 | 309자 |
| `q247`~`q732` (phase 27) | 486 | 356자 | **187자** | 599자 |

앞 구간 246개 **전부**가 뒤 구간의 최소값 아래에 있다. 확인 문제만 푸는 학습자에게 해설은 그
개념에 대해 읽는 유일한 설명 텍스트인데(ADR-026), 지금은 문항 세 개 중 하나가 "정답은 A다"
수준으로 끝난다. 이 phase가 246개를 전부 다시 쓴다.

**근거 문제가 하나 있다.** 이 구간이 가리키는 개념 175개 중 다수는 0-mvp 때 만든 기본 개념이고,
그 사실의 근거는 `docs/source/concepts-raw.md`에만 있다. 그 파일은 gitignore로 로컬에만 두는
외부 자료 추출본이라(ADR-009) **이 환경에 없다.** `docs/source/dump-gaps/`는 설계상 기존 개념을
일부러 제외했으므로 여기에도 근거가 없다. 그래서 근거를 어디서 가져오는지 먼저 정해야 한다.

## 작업

### 1. `docs/ADR.md`에 ADR-027을 추가한다

ADR-026 절 **뒤에** 새 절로 붙인다. 기존 ADR의 문장을 고치지 마라.

제목은 아래 뜻이 담기게 쓴다 — 해설 재작성의 근거를 개념 본문으로 지정하고, 이것이 기존 출처
규칙을 넓히는 것이 아니라 되짚는 자리를 정하는 것임이 드러나야 한다.

담을 내용:

- **결정**: `q001`~`q246`의 해설을 다시 쓸 때 사실의 근거는 세 곳이다 —
  (a) 그 문항 `conceptId`의 개념 본문(`summary`·`paragraphs`),
  (b) 오답 보기가 가리키는 **같은 주제의 이웃 개념** 본문,
  (c) 그 개념이 `docs/source/exam-gaps.md`에 항목으로 있으면 그 항목.
  **이 셋 밖의 사실을 쓰지 않는다.** 모델이 아는 AWS 지식으로 보강하지 않는다.
- **왜 개념 본문이 근거가 될 수 있는가**: ADR-009가 개념 본문을 다시 쓸 때 "의미는 바꾸지
  않는다 — 원본에 있던 사실이 빠져도 안 되고 모델이 아는 지식을 보태도 안 된다"고 못박았다.
  그러므로 개념 본문에 있는 사실은 이미 두 원본의 사실이다. 이 결정은 **사실의 집합을 넓히지
  않고, 그 사실을 되짚을 자리를 지정한다.** 출처를 하나 더 인정하는 ADR-008·ADR-021과 성격이 다르다.
- **왜 지금 이 결정이 필요한가**: `concepts-raw.md`가 없는 환경에서 이 phase를 진행한다.
  결정을 적지 않으면 해설을 쓰는 세션이 근거를 어디서 가져와야 할지 몰라 자기가 아는 AWS
  지식으로 메우게 되고, 그것이 이 phase의 가장 큰 실패 방식이다.
- **오답 근거를 이웃 개념 본문에서 가져오는 이유**: 해설이 담아야 하는 것의 절반이 "오답이 왜
  아닌지"다(ADR-026). 오답 보기는 phase 23이 정한 대로 같은 주제의 이웃 개념에서 골라져 있으므로,
  그 개념 본문이 곧 오답을 설명할 재료다. 자기 개념 본문이 짧아도 쓸 것이 없는 경우는 없다.
- **검증의 한계를 정직하게 적는다**: `scripts/check-verbatim.mjs`는 개념의 `summary`·
  `paragraphs`만 보고 문항의 `explanation`은 보지 않는다. 그러므로 해설에 대한 전사 검사는
  원래부터 없었고, `concepts-raw.md`의 부재가 이 phase에서 새로 잃게 하는 검증은 없다.
  대신 이 phase는 `scripts/explanation-audit.mjs`로 길이 하한을 강제하고,
  마지막 step이 그 하한을 `src/data/data.test.ts`의 불변식으로 고정한다.
- **하한을 187자로 잡은 근거**: phase 27이 같은 규칙으로 쓴 해설 486개의 실측 최소값이다.
  임의로 고른 값이 아니라는 것을 적어라. 길이는 목표가 아니라 "정답 근거 + 오답 3개"를 담으면
  자연히 넘게 되는 하한선이라는 것도 함께 적는다.
- **범위**: `explanation` 필드만 고친다. `prompt`·`choices`·`answerIndex`는 건드리지 않는다.
  프롬프트는 phase 17~21이 이미 전제를 세우도록 손봤고, 정답 위치 분포와 보기 구성은
  `src/data/data.test.ts`가 slice로 고정하고 있다.
- **트레이드오프**: `src/data/questions.json`의 246줄이 바뀌므로 `check-structure.mjs`의
  `questionsSha256`이 어긋난다. 채우는 도중에는 그것이 정상이고 마지막 step이 한 번에 갱신한다.
  해설이 길어지므로 문제 화면의 정답 확인 영역도 길어진다 — ADR-026이 복습 화면 길이를 열린
  문제로 남긴 것과 같은 성격이고, 여기서 새 실측값을 만들지 않는다.

**ADR-026의 「해설을 짧게 쓰지 않는 이유」를 되풀어 적지 마라.** 그 절을 가리키고, 이 절은
근거의 출처와 검증만 다룬다.

### 2. `scripts/explanation-audit.mjs`를 만든다

`scripts/coverage.mjs`와 같은 성격의 측정 도구다. **`npm test`·`npm run build`에 엮지 마라** —
고치는 도중에는 미달 상태가 정상이고, 빌드를 막으면 작업 자체가 진행되지 않는다(ADR-026이
`coverage.mjs`를 엮지 않은 것과 같은 이유).

인터페이스:

```bash
node scripts/explanation-audit.mjs                          # 전체 보고, 항상 exit 0
node scripts/explanation-audit.mjs <주제id> [<주제id> ...]  # 그 주제만, 미달이 있으면 exit 1
```

동작:

- **대상은 `q001`~`q246`으로 한정한다.** `q247` 이후는 이미 하한을 넘으므로 세지 않는다.
  이 한정을 스크립트 헤더 주석에 적어 다음 사람이 헷갈리지 않게 한다.
- 인자가 없으면 주제별 표를 낸다: 주제 id, 담당 문항 수, 해설 평균 길이, 최소 길이, 187자 미달
  개수. 마지막에 전체 요약(문항 수, 평균, 미달 개수)을 한 줄로 낸다. **exit 0** — 보고 전용이다.
- 인자로 주제 id를 주면 그 주제들의 문항만 본다. 187자 미달 문항이 있으면 문항 id와 길이를
  전부 찍고 **exit 1**. 미달이 0건이면 요약만 내고 exit 0.
- 존재하지 않는 주제 id를 주면 그 사실을 적고 exit 1로 끝낸다. 조용히 무시하면 step의 AC가
  아무것도 검사하지 않고 통과한다.
- **참고 지표 한 열을 더한다 — "오답 언급"**. 각 문항에서 정답이 아닌 보기 3개를 보고, 그 보기
  문자열에서 2자 이상의 영문·숫자 토큰(예: `EC2`, `Glacier`, `NLB`)을 뽑아 그중 하나라도 해설에
  등장하면 그 보기를 "언급됨"으로 센다. 문항마다 `0`~`3`으로 찍고, 토큰이 없는 보기(한국어
  서술형)는 세지 않고 그 문항의 분모에서 뺀다. **이 값은 exit code에 쓰지 마라.** 근사 지표이고
  한국어 보기에서는 판정 자체가 안 된다. 스크립트 헤더 주석에 "참고 지표이며 통과 기준이
  아니다"라고 적어라.

제약:

- **Node 18 표준 모듈만 쓴다. 의존성을 더하지 마라**(CLAUDE.md — Node 18.17.1 환경).
- `src/data/questions.json`·`src/data/topics.json`을 읽기만 한다. 쓰지 마라.
- ESM(`.mjs`)으로 쓰고 `scripts/coverage.mjs`의 출력 스타일(`✓`/`✗` 표시, 정렬된 표)에 맞춘다.

### 3. 동작을 확인한다

지금 데이터에서는 246문항 **전부**가 미달이어야 한다. 그것이 이 phase의 출발점이다.

```bash
node scripts/explanation-audit.mjs                    # 전체 표, exit 0, 미달 246
node scripts/explanation-audit.mjs cost-management     # 미달 목록 + exit 1
node scripts/explanation-audit.mjs no-such-topic       # 없는 주제라고 알리고 exit 1
```

## 이 step에서 반드시 지킬 것

1. **`src/data/questions.json`을 고치지 마라.** 이 step은 규칙과 도구만 만든다.
   문항을 고치는 것은 step 1~12다. 이유: 도구가 먼저 있어야 각 step의 AC가 성립한다.
2. **기존 ADR의 문장을 고치지 마라.** ADR-027을 새 절로 추가하기만 한다.
   ADR-026이 든 246·732 같은 숫자는 그 결정 당시의 값이라 그대로 두는 것이 맞다.
3. **`explanation-audit.mjs`를 `npm test`·`npm run build`에 엮지 마라.** 위에 적은 이유다.
4. **하한 187을 스크립트에 하드코딩할 때 그 근거를 주석으로 남겨라.** 근거 없는 상수가 되면
   다음 사람이 임의로 낮춘다.

## 금지사항

- `src/data/topics.json`을 고치지 마라. 이유: 개념 본문은 이 phase의 범위 밖이고
  `check-verbatim.mjs`를 이 환경에서 돌릴 수 없다(`concepts-raw.md` 부재).
- `scripts/topics-baseline.json`을 고치지 마라. 이유: 이 step은 문항을 고치지 않으므로
  `questionsSha256`이 어긋날 일이 없다. 어긋난다면 1번을 어긴 것이다.
- `package.json`에 의존성이나 스크립트를 더하지 마라. 이유: Node 18 환경 제약과,
  측정 도구를 빌드에 엮지 않는다는 위 결정.
- 기존 테스트를 고치거나 깨뜨리지 마라.

## Acceptance Criteria

```bash
npm run build                                     # 컴파일 에러 없음
npm test                                          # 전부 통과 (453개)
node scripts/explanation-audit.mjs                # 전체 표가 나오고 exit 0
node scripts/explanation-audit.mjs cost-management ; echo "exit=$?"   # 미달 목록 + exit=1
node scripts/check-structure.mjs                  # exit 0 — 이 step은 문항을 고치지 않는다
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `node scripts/explanation-audit.mjs`의 전체 미달 개수가 **246**인지 확인한다.
   246이 아니면 대상 구간(`q001`~`q246`)을 잘못 잡은 것이다.
3. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
4. 결과에 따라 `phases/28-explanation-rewrite/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **ADR 번호(ADR-027), 만든 스크립트 경로, 스크립트의 인터페이스 한 줄, 현재 미달
개수**를 적어라. 다음 step들이 그 스크립트를 AC로 쓴다.
