# Step 34: cost-management

이 phase는 **phase 29가 시범 주제 하나에서 세운 콘텐츠 품질 기준을 나머지 38개 주제로
넓히는 일**이다. 사용자의 요청은 "특정 부분을 예시로 들었지만 **전체적으로 어색하고 애매하며
초보자가 개념을 익힌다는 느낌이 들지 않는다**"였고, 시범 주제(`s3-encryption-batch`)는
phase 29가 끝냈다. 주제는 `topics.json` 배열 순서로 훑는다 — 학습 순서와 같아서 검수도
사용자가 읽던 흐름 그대로 할 수 있다.

**step 하나가 주제 하나를 통째로 본다.** 결함 종류별로 가르지 않는다. 제목·본문·문항·해설이
같은 자리에서 얽혀 있어 종류별로 나누면 같은 주제를 여러 번 열게 된다 — phase 29가 주제
하나에 7 step을 쓰고 얻은 결론이다.

## 이 step이 맡은 것

| 주제 | 개념 | 문항 | ① 제목 | ② 관용 | ③ 노출 | ④ 무소속 | ⑤ 장문 | ⑥ 중복 |
|---|---|---|---|---|---|---|---|---|
| `cost-management` | 17 | 19 | 6 | 2 (개념 1/문항 1) | — | — | — | — |

③④⑤⑥의 실제 건수는 `node scripts/content-audit.mjs <주제id>`로 직접 재라 —
이 표를 쓴 시점과 달라져 있을 수 있다. **①②도 마찬가지다. 숫자가 아니라 도구가 기준이다.**

### 개념 목록 (배열 순서)

`cost-management` — 개념 17개. **①이 걸린 것은 굵게 표시했다.**

 0. `savings-plan` — 절약 플랜 (Savings Plan)
 1. `aws-budgets` — AWS Budgets
 2. `cost-explorer` — Cost Explorer
 3. `cost-anomaly-detection` — Cost Anomaly Detection
 4. `cost-and-usage-report` — AWS 비용 및 사용량 보고서(CUR)
 5. `billing-and-cost-management` — Billing and Cost Management
 6. `trusted-advisor` — Trusted Advisor
 7. `compute-optimizer` — AWS Compute Optimizer
 8. `savings-plan-details` — 절약 플랜의 적용 범위와 결제 옵션
 9. `savings-plan-baseline-vs-spike` — **약정은 기준 용량까지만 건다**
10. `rds-reserved-instance` — **예약 인스턴스는 RDS에도 있다**
11. `on-demand-capacity-reservation` — 온디맨드 용량 예약
12. `cost-allocation-tag-activation` — **비용 할당 태그는 활성화해야 보인다**
13. `cost-allocation-tag-activation-in-management-account` — **통합 청구에서는 관리 계정에서 활성화한다**
14. `budget-actions` — AWS Budgets의 예산 조치
15. `budget-forecasted-alert` — **예산 알림은 예측값에도 걸 수 있다**
16. `compute-optimizer-ebs-recommendations` — **권장 대상에는 EBS 볼륨도 있다**

### 문항 id

`cost-management` — 19개: `q164` `q165` `q166` `q167` `q168` `q169` `q243` `q244` `q245` `q246` `q724` `q725` `q726` `q727` `q728` `q729` `q730` `q731` `q732`


## 무엇을 고치는가

### 기계가 세는 여섯 — `node scripts/content-audit.mjs <주제id>`

지표의 뜻과 **각각의 한계**가 `scripts/content-audit.mjs` 머리주석에 길게 적혀 있다.
**작업 전에 그 주석을 읽어라.** 특히 ③·⑤·⑥은 **후보 목록이지 위반 목록이 아니다.**

| 지표 | 무엇을 보는가 | 이 step의 목표 |
|---|---|---|
| ① 문장형 제목 | 개념 `name`이 `-다`로 끝나는가 | **0건** |
| ② 관용 표현 | `돌린다`·`띄운다`·`태운다` 계열 | **0건**, 또는 판정 근거를 남긴다 |
| ③ 정답 노출 후보 | 정답 보기의 토큰이 프롬프트에 있고 오답에는 없는가 | 전건 판정. 고친 것과 그대로 둔 것을 근거와 함께 남긴다 |
| ④ 소속 없는 용어 | `버킷`·`객체`·`접두사`를 쓰는데 `S3`가 없는가 | **0건** |
| ⑤ 장문 | 프롬프트에 60자를 넘는 문장이 있는가 | 전건 판정. **끊어 읽히면 60자를 넘어도 그대로 둔다** |
| ⑥ 중복 후보 | 같은 `conceptId`에 정답 텍스트까지 같은 짝 | 전건 판정 |

### 기계가 못 보는 다섯 — **이쪽이 본체다**

`content-audit.mjs`는 아래를 하나도 세지 못한다. **주제 페이지를 처음 읽는 학습자의 눈으로
통독하는 것 외에 찾는 방법이 없다.** phase 29의 가장 큰 교훈이 이것이다 — step 0이 기계
지표로 "고쳤다"고 보고했는데 사용자가 화면을 열어 30초 만에 같은 자리에서 다시 막혔다.

- **ⓐ 기초 용어가 정의되지 않은 채 쓰인다.** 이 앱의 읽는 단위는 개념이 아니라 **주제
  페이지**다(ADR-029). 다른 주제에 정의가 있다는 것은 지금 이 화면을 읽는 사람에게 도움이
  되지 않는다. **각 주제에서 처음 나오는 자리에 한 번** 풀이를 세운다.
- **ⓑ 개념이 왜 거기 있는지 없이 튀어나온다.** 도입 문장이 앞 개념과 이어지지 않는 자리다.
  「무엇인지 → 앞 개념과 이어지는 자리 → 왜 필요한지」 순으로 다시 쓴다. **개념 순서는 바꾸지
  않는다**(아래 금지사항).
- **ⓒ 한 문항이 두 요구를 겹친다.** 판정 기준은 프롬프트에 요구가 몇 개 적혀 있는가가 아니라
  **학습자가 독립된 지식 둘을 곱해야 하는가**다(ADR-030 기준 2의 경계).
- **ⓓ 문항의 목적이 불분명하다.** "이 문항을 풀고 나면 학습자가 무엇을 알게 되는가"를 한
  문장으로 말할 수 없으면 조건을 덜어낸다.
- **ⓔ 같은 것이 두 이름으로 불린다.** 개념 본문·프롬프트·보기·해설 사이의 용어 불일치다.
  `content-audit.mjs`가 세지 못한다 — 무엇이 같은 동작인지는 사람이 판정해야 한다.

### 해설(`explanation`)은 어긋나는 자리만

**전면 재작성이 아니다.** phase 28이 732개를 이미 다시 썼고 187자 하한이
`data.test.ts`의 불변식이다. 이 step이 해설을 손대는 사유는 셋뿐이다.

1. 개념 본문·프롬프트와 **용어가 어긋나는 자리**(ⓔ)
2. 이 step이 고친 프롬프트·보기를 해설이 **인용하고 있어 어긋나게 된 자리**
3. 개념 본문을 고쳐 해설이 **틀린 사실을 말하게 된 자리**

그 밖의 이유로 해설을 다시 쓰지 마라. **길이를 줄이지도 마라** — 문제만 반복해서 푸는
학습자에게 해설은 유일한 설명 텍스트다(ADR-026·ADR-027).

## 읽어야 할 파일

- `CLAUDE.md` — 특히 「원본 데이터」와 「아키텍처 규칙」의 CRITICAL 항목
- `docs/ADR.md` — **ADR-010**(출처 제한과 예외 목록), **ADR-015**(약어에 풀네임),
  **ADR-023**(개념 배열의 층 순서), **ADR-026**(문제 은행), **ADR-027**(해설의 근거),
  **ADR-028**(기초 용어 뜻풀이), **ADR-029**(용어 풀이는 주제마다 되풀이),
  **ADR-030**(개념 제목·문항이 지킬 다섯 기준), **ADR-031**(두 원본이 어긋날 때)
- `docs/PRD.md` — 학습자상. **문제만 반복해 풀어도 개념 공부가 끝나야 한다는 것이 이 앱의 목적이다**
- `scripts/content-audit.mjs` — 머리주석에 여섯 지표의 뜻과 한계가 있다. **먼저 읽어라**
- `src/data/topics.json` · `src/data/questions.json` — 이 step이 고칠 데이터
- `src/data/data.test.ts` — 개념 id·순서·이름 단언, 해설 길이 하한(187자), 명사구 단언
- `scripts/topics-baseline.json` — `conceptLineCount`·`questionsSha256`·개념 `id`/`name`
- `docs/source/exam-gaps.md` — 문항과 보충 개념의 근거. 「원본 수정 이력」도 함께

## 작업 순서

1. **주제 페이지를 통독한다.** `npm run dev`를 띄울 필요는 없다 — `topics.json`의 이 주제
   개념을 배열 순서대로, 그다음 이 주제 문항을 순서대로 **처음 읽는 사람의 속도로** 읽는다.
   막히는 자리를 먼저 적고, 그다음에 `content-audit.mjs`를 돌려라. **순서가 중요하다** —
   지표를 먼저 보면 지표가 있는 자리만 보게 된다.
2. **개념 `name`을 명사구로.** 문장의 주어가 되는 대상을 제목으로 올리고 주장은
   `summary`·`paragraphs`로 내린다. `name`을 바꾸면 `scripts/topics-baseline.json`의 해당
   `name`을 **같은 커밋에서** 갱신한다(`check-structure.mjs`가 대조한다).
3. **개념 본문** — ⓐ 미정의 용어, ⓑ 도입 문장, ② 관용 표현, ⓔ 용어 불일치.
4. **문항 프롬프트·보기** — ⓒ 요구 겹치기, ⓓ 목적, ③ 정답 노출, ⑤ 장문, ⑥ 중복.
5. **해설** — 위 「어긋나는 자리만」의 세 사유에 해당하는 것만.
6. **`data.test.ts`에 이 주제의 명사구 단언을 더한다.** 이미 있는
   `'S3 암호화 주제의 개념 제목이 모두 문장이 아니라 명사구다'` 블록과 같은 모양으로,
   이 step의 주제(들)에 대해 `expect(concept.name).not.toMatch(/다$/)`를 건다.
   **끝난 주제는 되돌아가지 않게 하는 래칫이다.** 전 주제로 넓히는 것은 마지막 step의 몫이다.
7. **`scripts/topics-baseline.json`의 `questionsSha256`을 갱신한다.**
   `shasum -a 256 src/data/questions.json`의 값으로 **그 문자열만 치환해라.**
   이 파일은 1칸 들여쓰기이고 `"questionsSha256":"..."`에 콜론 뒤 공백이 없다 —
   `JSON.stringify(…, null, 2)`로 다시 쓰면 2905줄이 통째로 바뀐다.

## 금지사항

- **개념 `id`를 바꾸지 마라.** 이유: 문항 732개가 `conceptId`로 개념을 참조한다.
  `name`만 바꾼다(phase 29에서 사용자가 정한 것이다).
- **개념의 순서를 바꾸지 마라.** 이유: 현재 배열은 ADR-023의 층 우선 정렬이고
  `data.test.ts`가 주제마다 그 순서를 단언한다. 갈래 우선으로 다시 묶으면 「앞에서부터 읽어
  주제의 지도를 얻는다」는 ADR-023의 전제가 깨진다. ⓑ의 원인은 순서가 아니라 도입 문장이다 —
  phase 29 step 2가 같은 자리에서 그렇게 판정했다.
- **개념을 더하거나 빼지 마라.** 이유: 개념 커버리지 618/618이 `data.test.ts`의 불변식이다.
- **문항을 더하거나 빼지 마라. `answerIndex`가 가리키는 정답을 바꾸지 마라.** 이유: 구간별
  정답 분포와 커버리지가 단언으로 고정돼 있다. 보기의 **순서**를 바꾸면 `answerIndex`도 함께
  맞춰야 한다 — 그럴 이유가 없으면 순서를 건드리지 마라.
- **두 원본 파일에 없는 사실을 새로 만들지 마라.** 근거는 `docs/source/concepts-raw.md`(로컬
  전용, 없을 수 있다)와 `docs/source/exam-gaps.md`·`docs/source/dump-gaps/`뿐이다.
  예외는 ADR-010·ADR-028·ADR-029가 목록으로 고정한 용어 풀이뿐이고, **목록을 늘리려면 ADR을
  고쳐야 한다.** 문장을 지어내는 대신 그대로 두고 `summary`에 남겨라.
  `concepts-raw.md`를 `grep`으로 뒤질 때는 **`-a`를 붙여라** — 붙이지 않으면 일치가 있어도
  아무것도 출력하지 않고 exit 1로 끝난다(ADR-031 말미).
- **원본 문장을 그대로 옮기지 마라.** 사실만 가져오고 문장은 직접 쓴다(ADR-009).
  `node scripts/check-verbatim.mjs`가 32자 연속 겹침을 잡는다.
- **해설을 짧게 줄이지 마라.** 이유: 187자 하한이 `data.test.ts`의 불변식이고, 문제만 푸는
  학습자에게 해설이 유일한 설명 텍스트다.
- **다른 주제를 고치지 마라.** 이유: step마다 주제를 나눈 것이 이 phase의 구조다.
  다른 주제에서 발견한 것은 고치지 말고 `summary`에 적어 다음 step으로 넘겨라.
- 기존 테스트를 깨뜨리지 마라.

## Acceptance Criteria

```bash
npm test                              # 전부 통과. 이 step이 더한 명사구 단언 포함
npm run build                         # tsc 타입체크 포함
node scripts/check-structure.mjs      # exit 0
node scripts/coverage.mjs             # 618/618, exit 0
node scripts/check-verbatim.mjs       # 전사 이상 없음
node scripts/content-audit.mjs cost-management# ①②④ 0건
```

`content-audit.mjs`는 **언제나 exit 0으로 끝난다**(보고 전용, ADR-030). 숫자를 읽어라.
③⑤⑥이 남아 있는 것은 정상이다 — 후보 목록이고 판정은 사람이 한다. **판정한 것을
`summary`에 적으면 그것이 통과 기준이다.**

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. **고친 문항을 다시 읽는다.** 프롬프트만 보고 정답을 고를 수 있게 되지 않았는지,
   보기 넷이 여전히 같은 범주에 있는지, 해설이 프롬프트·보기와 어긋나지 않는지.
3. `phases/31-content-quality-rollout/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단이 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 반드시 남길 것

다음 step과 사용자 검수가 이것만 읽는다. **고친 것보다 판정하고 그대로 둔 것이 중요하다.**

- 통독하며 막힌 자리와 그것을 어떻게 풀었는가 (기계 지표가 아니라 이쪽을 먼저)
- `name`을 바꾼 개념: `이전` → `이후`
- ③⑤⑥ 후보를 각각 어떻게 판정했는가와 **그대로 둔 것의 근거**
- 근거가 없어 고치지 못하고 남긴 것
- 다른 주제에서 발견해 넘기는 것
- `questionsSha256` 이전 → 이후, `npm test` 개수 이전 → 이후
