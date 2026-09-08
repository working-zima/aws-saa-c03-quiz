# Step 5: rewrite-cache-compute-edge — 해설 21개 재작성

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 설계 의도를 파악하라:

- `/CLAUDE.md` — 「아키텍처 규칙」·「원본 데이터」·「개발 프로세스」
- `/docs/ADR.md` — **ADR-027**(step 0이 추가했다. 해설의 근거를 어디서 가져오는지 정한다),
  **ADR-026**「해설을 짧게 쓰지 않는 이유」, ADR-015(약어에 풀네임을 괄호로), ADR-011(문항 표현 규칙),
  ADR-009(전사 금지), ADR-010(일반 IT 용어 예외의 경계)
- `/docs/PRD.md` — 「사용자」·「목표」·「문제 은행」
- `/src/data/questions.json` — **고칠 대상. 담당 문항의 `explanation`만 고친다**
- `/src/data/topics.json` — 근거 개념 본문. **읽기만 한다**
- `/docs/source/exam-gaps.md` — 두 번째 출처. 담당 개념 중 여기 항목이 있는 것은 함께 읽는다
- `/scripts/explanation-audit.mjs` — step 0이 만든 측정 도구. AC에서 쓴다

## 담당 범위

| 주제 | 제목 | 주제의 전체 개념 | 담당 문항 |
|---|---|---|---|
| `elasticache-purpose-built-db` | ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream | 14 | 4 |
| `ec2-autoscaling` | EC2 인스턴스 유형·구매 옵션·Auto Scaling | 18 | 6 |
| `elastic-load-balancing` | ALB·NLB·Gateway Load Balancer | 16 | 6 |
| `cloudfront-global-accelerator` | CloudFront·Global Accelerator·엣지 함수 | 24 | 5 |

**담당 문항 21개. 현재 해설 평균 136자, 최소 73자다.**

| 문항 | 현재 해설 길이 | 근거 개념 | 근거 |
|---|---|---|---|
| `q072` | 109 | `elasticache-purpose-built-db.elasticache` | 개념 본문 |
| `q073` | 94 | `elasticache-purpose-built-db.elasticache` | 개념 본문 |
| `q074` | 146 | `ec2-autoscaling.ec2` | 개념 본문 |
| `q075` | 102 | `ec2-autoscaling.ec2` | 개념 본문 |
| `q076` | 105 | `ec2-autoscaling.ec2` | 개념 본문 |
| `q077` | 73 | `ec2-autoscaling.ec2` | 개념 본문 |
| `q078` | 101 | `elastic-load-balancing.elb` | 개념 본문 |
| `q079` | 275 | `elastic-load-balancing.elb` | 개념 본문 |
| `q080` | 237 | `elastic-load-balancing.elb` | 개념 본문 |
| `q081` | 211 | `elastic-load-balancing.elb` | 개념 본문 |
| `q082` | 102 | `cloudfront-global-accelerator.cloudfront` | 개념 본문 |
| `q185` | 116 | `elasticache-purpose-built-db.documentdb` | `exam-gaps.md`의 `documentdb` |
| `q187` | 146 | `elasticache-purpose-built-db.dax-dynamodb-only` | `exam-gaps.md`의 `dax-dynamodb-only` |
| `q188` | 154 | `ec2-autoscaling.warm-pool` | `exam-gaps.md`의 `warm-pool` |
| `q189` | 91 | `ec2-autoscaling.scheduled-scaling` | `exam-gaps.md`의 `scheduled-scaling` |
| `q190` | 125 | `elastic-load-balancing.alb-l7-vs-nlb-l4` | `exam-gaps.md`의 `alb-l7-vs-nlb-l4` |
| `q191` | 95 | `elastic-load-balancing.sticky-session-tradeoff` | `exam-gaps.md`의 `sticky-session-tradeoff` |
| `q192` | 208 | `cloudfront-global-accelerator.global-accelerator-protocols` | `exam-gaps.md`의 `global-accelerator-protocols` |
| `q193` | 140 | `cloudfront-global-accelerator.cloudfront-ttl` | `exam-gaps.md`의 `cloudfront-ttl` |
| `q194` | 110 | `cloudfront-global-accelerator.edge-keyword` | `exam-gaps.md`의 `edge-keyword` |
| `q198` | 111 | `cloudfront-global-accelerator.lambda-at-edge` | `exam-gaps.md`의 `lambda-at-edge` |

이 중 **10문항**은 근거 개념이 `docs/source/exam-gaps.md`에도 항목으로 있다(위 표의 "근거" 열). 그 개념은 개념 본문과 exam-gaps 항목 **양쪽**을 읽어라 — exam-gaps 항목에는 `[섹션 #문항 pP]` 인용이 붙어 있어 개념 본문이 줄인 사실(수치 한계·전제 조건 등)이 남아 있을 수 있다.

담당 문항의 현재 미달 상태를 다시 재려면:

```bash
node scripts/explanation-audit.mjs elasticache-purpose-built-db ec2-autoscaling elastic-load-balancing cloudfront-global-accelerator
```

## 작업

담당 문항 21개의 `explanation`을 **그 개념을 가르치는 글**로 다시 쓴다.

지금 해설은 "정답이 무엇인지"만 한 줄로 말하고 끝난다. 확인 문제만 푸는 학습자에게는 그 해설이
그 개념에 대해 읽는 **유일한 설명 텍스트**이므로(ADR-026), 지금 상태로는 틀려도 배울 것이 없다.

한 문항의 해설에 아래 세 가지를 담는다.

1. **그 개념이 무엇인지** — 근거 개념 본문의 사실로 대상을 세운다. 프롬프트를 읽고 처음 그 용어를
   만난 사람이 해설만 읽어도 무엇에 대한 이야기인지 알 수 있어야 한다.
2. **정답이 왜 맞는지** — 프롬프트가 세운 조건과 그 개념의 성질이 어떻게 맞물리는지 쓴다.
   "A가 정답이다"로 끝내지 마라.
3. **오답 3개가 각각 왜 아닌지** — 이것이 변별 축이다. 오답 보기가 가리키는 것이 무엇이고
   프롬프트의 어느 조건에서 어긋나는지 쓴다. 보기 하나도 빠뜨리지 마라.

3번의 재료는 **오답 보기가 가리키는 이웃 개념의 본문**에서 가져온다. 담당 주제의 개념 목록이
곧 그 재료다(위 표의 "주제의 전체 개념"). 자기 개념 본문이 짧아도 이웃 개념 본문이 있으므로
쓸 것이 없는 경우는 없다.

**해설은 187자 이상이어야 한다.** 임의로 고른 값이 아니다 — phase 27이 같은 규칙으로 쓴 해설
486개의 실측 최소값이고, 위 세 가지를 담으면 자연히 그 아래로 내려가지 않는다.
길이를 채우려고 같은 말을 되풀이하지는 마라. 600자를 넘기면 화면에서 읽히지 않으니 그 근처에서 멈춘다.

## 이 step에서 반드시 지킬 것

1. **`explanation` 외의 필드를 고치지 마라.** `id`·`topicId`·`conceptId`·`prompt`·`choices`·
   `answerIndex`를 건드리지 않는다. 이유: `src/data/data.test.ts`가 `questions.slice()`로
   앞 구간의 id 순서·`topicId`·`conceptId`·정답 위치 분포를 고정하고 있어, 그중 하나만 바꿔도
   이 phase와 무관한 테스트가 깨진다. 프롬프트는 phase 17~21이 이미 손봐 전제가 서 있는 상태다.
2. **사실은 근거 개념 본문과 `exam-gaps.md` 항목에서만 가져온다.** 네가 아는 AWS 지식으로
   보태지 마라. 근거는 ADR-027이고, 그 위에 ADR-006·ADR-008·ADR-009가 그대로 살아 있다.
   본문에 없는 수치·리전·한계를 쓰면 검수할 수 없는 문장이 된다.
3. **문장은 직접 쓴다.** 개념 본문이나 exam-gaps 항목의 문장을 그대로 옮기지 마라(ADR-009).
   해설은 개념 본문을 다시 읽히는 자리가 아니라 이 문항의 조건에 맞춰 설명하는 자리다.
4. **약어는 처음 나올 때 풀네임을 괄호로 붙인다**(ADR-015). 해설마다 다시 푼다 — 문항은 열 때마다
   섞여 나오므로(ADR-011) 앞 문항이 풀어 줬다고 가정할 수 없다.
5. **출처를 가리키는 표현을 쓰지 마라.** "원본에서", "원본은", "문서에서", "본문에서",
   "위 글에 따르면", "덤프", "해설지", "[섹션" 이 그것이다. 기존 테스트가 정규식으로 잡고 있어
   넣으면 즉시 실패한다. 학습자에게는 그 출처가 보이지 않으므로 가리켜도 뜻이 통하지 않는다.
6. **보기의 순서를 가리키지 마라.** "첫 번째 보기", "위의", "다음 중" 같은 표현을 쓰지 않는다.
   보기 순서도 열 때마다 섞인다(ADR-011). 오답을 지목할 때는 그 보기의 내용을 다시 말한다.
7. **`questions.json`의 한 줄 한 문항 포맷을 유지한다.** 파일 전체를 JSON 라이브러리로
   재직렬화하지 마라. 이유: 지금 문항 하나가 정확히 한 줄이라 diff에서 무엇이 바뀌었는지 읽을 수
   있고, 재직렬화하면 246줄이 아닌 파일 전체가 바뀌어 검수가 불가능해진다.

## 금지사항

- **`src/data/topics.json`을 고치지 마라.** 개념 본문이 틀렸거나 부족해 보이더라도 이 step의
  범위가 아니다. 이유: 개념 본문은 `check-verbatim.mjs`·`check-structure.mjs`의 대상이고
  `concepts-raw.md`가 이 환경에 없어 전사 검사를 돌릴 수 없다. 고쳐야 할 것을 발견하면
  `summary`(step summary)에 적어 남겨라.
- **`scripts/topics-baseline.json`을 고치지 마라.** 해설을 고치면 `questionsSha256`이 어긋나
  `node scripts/check-structure.mjs`가 실패한다. **그것이 정상이다** — 마지막 step이 한 번에
  갱신한다. 여기서 갱신하면 step마다 baseline이 충돌한다.
- 담당 범위 밖의 문항을 고치지 마라. 이유: 다음 step이 그 주제를 맡는다.
- `q247`~`q732`를 고치지 마라. 이유: 그 구간은 이미 ADR-026 기준으로 쓰였다(최소 187자).
- 기존 테스트를 고치거나 깨뜨리지 마라. 해설 텍스트를 고정하는 단정은 없으므로,
  `explanation`만 고치면 통과해야 한다. 실패하면 위 1·5·6 중 하나를 어긴 것이다.
- 런타임에 외부 API를 부르는 코드를 넣지 마라(CLAUDE.md CRITICAL).

## Acceptance Criteria

```bash
npm run build                                          # 컴파일 에러 없음
npm test                                               # 전부 통과
node scripts/explanation-audit.mjs elasticache-purpose-built-db ec2-autoscaling elastic-load-balancing cloudfront-global-accelerator  # exit 0 — 담당 문항 전부 187자 이상
```

`node scripts/check-structure.mjs`는 `questionsSha256`이 어긋나 실패한다. **정상이다** —
마지막 step이 갱신한다. 여기서 baseline을 고치지 마라.

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `node scripts/explanation-audit.mjs elasticache-purpose-built-db ec2-autoscaling elastic-load-balancing cloudfront-global-accelerator`가 내는 "오답 언급" 열을 눈으로 확인한다.
   이 열은 오답 보기의 영문 토큰이 해설에 등장하는지를 재는 **참고 지표**이고 exit code에 쓰지 않는다.
   한국어 서술형 보기는 `-`로 나오므로 낮게 나오는 것 자체가 결함은 아니다. 다만 담당 문항 중
   `0`이 찍힌 것은 위 「작업」 3번을 실제로 지켰는지 그 문항의 해설을 다시 읽어 확인하라.
3. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
4. 결과에 따라 `phases/28-explanation-rewrite/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **고친 문항 id 범위와 개수, 재작성 후 해설 평균 길이, 개념 본문에서 발견한
문제(있으면)** 를 적어라.
