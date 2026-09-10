# Step 9: small-notation-pairs

**작은 표기 짝 여섯을 한 step에서 처리한다.** 합쳐서 14곳이고, 서로 겹치지 않는다.

## 이 phase의 범위 — 용어 표기 치환뿐이다

사용자의 말을 그대로 옮긴다.

> 이번 phase의 목적은 용어 표기 통일뿐이다.
> **사실관계, 정답 논리, 문항 구조, 수치나 조건은 변경하지 마.**
> `paragraphs`와 `explanation`도 이번 phase에서는 필요한 범위에 한해 수정 가능하게 하되,
> **표기 치환 외의 문장 수정은 하지 마.**

**phase 32와 다른 점이 하나 있다.** 그때는 `paragraphs`·`explanation`이 얼어 있었지만
이번에는 열린다 — 같은 대상을 두 이름으로 부르는 자리가 그 두 필드에 걸쳐 있어 열지 않으면
통일할 수 없기 때문이다. **열렸다는 것은 고쳐도 된다는 뜻이지 다듬어도 된다는 뜻이 아니다.**
낱말을 바꾸는 것 외에 문장을 손대면 아래 도구가 잡는다.

## 가드레일 — 기계가 잡는다

```bash
node scripts/notation-diff.mjs 7f46259          # 바뀐 것이 표기 치환으로 설명되는지 본다
node scripts/notation-diff.mjs 7f46259 --list   # 바뀐 항목의 id를 전부 찍는다
```

이 도구는 승인된 표기 짝을 같은 자리표로 바꾼 뒤 기준 커밋과 대조한다.

| 결과 | 뜻 |
|---|---|
| 정규화한 것이 같다 | 바뀐 것은 표기뿐이다. **통과** |
| 정규화해도 다르다 | 표기 말고 문장·수치·조건이 바뀌었다. **exit 1** |
| 구조가 바뀌었다 | `answerIndex`·id·순서·개수·문단 수·보기 수. **exit 1** |

**exit 1이면 되돌려라.** 부분 치환은 통과한다 — SNS의 `토픽`만 바꾸고 Kafka의 `토픽`을
두는 것이 이번 요구이므로 그렇게 설계돼 있다.

## 지켜야 할 것

1. **문맥을 먼저 갈라라.** 같은 낱말이라도 다른 대상을 가리키면 **건드리지 않는다.**
   아래 대상 목록에 문맥 조각을 붙여 두었으니 읽고 판단해라.
2. **정답 보기가 걸린 문항은 보기 넷을 통째로 본다.** 한 보기만 표기를 바꾸면 그 보기가
   나머지 셋과 결이 달라지고 **그 차이가 정답을 가리키는 신호가 된다.** 넷 중 둘 이상이 같은
   낱말을 쓰고 있으면 **함께 바꾼다.** 한쪽만 바꿔야 할 이유가 있으면 `summary`에 적어라.
3. **`data.test.ts`가 글자로 고정한 자리는 단언도 함께 고친다.** 대상 목록에 `⚠단언`으로
   표시했다. **단언의 뜻을 바꾸거나 지우지 마라.** 문구만 새 표기로 맞춘다.
4. **개념 `name`을 고쳤거나 `questions.json`을 고쳤으면 `node scripts/sync-baseline.mjs`를
   돌린다.** `scripts/topics-baseline.json`을 손으로 고치지 마라.
5. **조사를 자연스럽게 맞추는 것은 허용된다.** `토픽에` → `주제에`처럼 낱말 뒤 조사가
   바뀌는 것은 치환의 일부다. 다만 `notation-diff`가 조사까지 정규화하지는 않으므로,
   받침이 달라져 조사를 바꿔야 하면 그 자리를 `summary`에 적어라 — 도구가 위반으로 잡는다.
   **그런 자리가 나오면 조사를 바꾸지 말고 그대로 두는 쪽을 먼저 검토해라.**

## `Virtual Private Gateway` → `가상 프라이빗 게이트웨이` — 2곳

AWS 한국어 Direct Connect 문서 표기. 저장소 빈도도 같은 방향(13:2).

**`hybrid-connectivity`**

- `q215` `choices[1]` — Virtual Private Gateway
- `q215` `explanation` — …가리키는 구성 요소여서 전용선과 허브를 묶는 통로가 아니다. Virtual Private Gateway는 VPC 하나에 하나씩 붙는 AWS 쪽 종단이라, 여기에 회…

## `말소리` → `음성` — 3곳

AWS 한국어가 "자동 **음성** 인식 서비스"로 쓴다. 한 개념 안에서 `name`은 「음성」, `summary`는 「말소리」로 갈려 있다.

**`ai-ml-services`**

- `ai-ml-services.media-ai-service-lineup` `summary` — Transcribe는 말소리를 글로, Rekognition은 이미지와 영상을, Trans…
- `ai-ml-services.comprehend` `paragraphs[0]` ⚠단언 — …e·Rekognition·Translate·Textract가 말소리·이미지·번역·문서를 나눠 맡는다면, Comprehend는 글…
- `q312` `explanation` ⚠단언 — …비스들은 입력으로 갈라 두면 구분된다. Transcribe는 말소리를 글로 옮기고, Translate는 언어를 다른 언어로 옮기…

## `퍼블릭 주소` → `퍼블릭 IP` — 2곳

저장소 다수이고 `systems-manager` 주제의 같은 상황(프라이빗 서브넷 SSH)에서 갈린다. **`q210`의 「퍼블릭 IPv4」는 `vpc-networking`의 IPv6 대비 문맥이라 무관하다 — 건드리지 마라.**

**`systems-manager`**

- `q305` `choices[1]` — 인스턴스에 퍼블릭 주소를 붙이고 보안 그룹에서 22번 포트를 연다
- `q305` `explanation` — …스천을 세우면 관리할 서버가 하나 늘고 공격 면도 늘어나며, 퍼블릭 주소를 붙여 22번을 여는 방식은 인바운드 인터넷 접근을 여는 일…

## `IP Set` → `IP 세트` — 3곳

**AWS 한국어 문서 자체가 「IP 집합」과 「IP 세트」를 혼용**해 공식 용어로 판정할 수 없다. 그래서 저장소 빈도(17:3)를 기준으로 삼는다.

**`waf-shield`**

- `waf-shield.waf` `paragraphs[2]` — IP Set을 이용하면 특정 IP나 대역을 차단하거나 회사 내부 IP만 …
- `q152` `choices[2]` — IP Set
- `q154` `choices[3]` — IP Set

## `결제 대시보드` → `결제 콘솔` — 2곳

저장소 다수이고 개념 `name`·`summary`가 그 쪽이다.

**`cost-management`**

- `cost-management.cost-allocation-tag-activation` `paragraphs[0]` ⚠단언 — …다. 순서가 중요하다. 먼저 리소스에 태그를 붙이고, 그다음 결제 대시보드에서 그 사용자 정의 태그를 활성화(Activate)해야 비용…
- `q243` `explanation` ⚠단언 — … 태그를 붙이는 것만으로는 비용 분석 도구에 나타나지 않고, 결제 대시보드에서 그 사용자 정의 태그를 활성화해야 Cost Explore…

## `기준이 되는 부하` → `기본 부하` — 2곳

저장소 다수이고 개념 `name`·`summary`가 그 쪽이다.

**`cost-management`**

- `cost-management.savings-plan-baseline-vs-spike` `paragraphs[0]` — 절약 플랜을 고르고 나면 남는 판단은 약정의 **크기**다. 기준이 되는 부하가 예측 가능하고 1년 이상 이어진다면 그만큼은 약정으로 덮는…
- `q725` `explanation` — 절약 플랜을 고르고 나면 남는 판단은 약정의 크기다. 기준이 되는 부하가 예측 가능하고 1년 이상 이어진다면 그만큼은 약정으로 덮는…




## 작업 순서

1. 아래 대상 목록을 **문맥 조각과 함께** 읽고, 바꿀 자리와 둘 자리를 먼저 가른다.
2. 바꾼다. **낱말만 바꾼다.**
3. 정답 보기가 걸린 문항은 보기 넷을 다시 읽는다.
4. `node scripts/sync-baseline.mjs` → `npm test` → 깨지면 단언 문구만 맞춘다.
5. `node scripts/notation-diff.mjs 7f46259`가 exit 0인지 본다.

## Acceptance Criteria

```bash
npm test                                    # 전부 통과
npm run build                               # tsc 타입체크 포함
npm run lint
node scripts/sync-baseline.mjs              # 거부당하면 범위를 넘은 것이다
node scripts/check-structure.mjs            # exit 0
node scripts/notation-diff.mjs 7f46259        # exit 0 — 표기 치환으로만 설명돼야 한다
node scripts/coverage.mjs                   # 618/618
node scripts/check-verbatim.mjs
```

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `node scripts/notation-diff.mjs 7f46259 --list`를 읽고 **이 step이 맡은 표기 말고
   다른 것이 바뀌지 않았는지** 확인한다.
3. `phases/33-notation-standardization/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 남길 것

마지막 step이 이것만 보고 사용자 보고서를 쓴다.

1. **바꾼 건수** — 표기별로, 그리고 필드별로(`name`·`summary`·`paragraphs`·`prompt`·`choices`·`explanation`)
2. **문맥이 달라 두고 온 자리와 그 이유** — 이것이 이 step의 핵심 산출물이다
3. **정답 보기를 고친 문항 id와, 보기 넷을 함께 봤는지**
4. **`data.test.ts` 단언을 고쳤으면 어느 것을 어떻게**

## 금지사항

- **표기 치환 외의 문장 수정을 하지 마라.** 이유: 사용자가 이 phase의 목적을 표기 통일
  하나로 못 박았고, `notation-diff.mjs`가 exit 1로 잡는다.
- **`answerIndex`·id·문항 순서·문단 수·보기 수를 바꾸지 마라.** 이유: 정답이 달라지고
  `data.test.ts`·`check-structure.mjs`가 불변식으로 고정한다.
- **수치·조건·서비스 특성·제한 사항을 건드리지 마라.**
- **다른 step이 맡은 표기를 건드리지 마라.** 이유: step마다 표기를 나눈 것이 이 phase의 구조다.
- **`Deny`와 `거부`를 통일하지 마라.** 이유: 표기 갈림이 아니다. `Deny`는 IAM 정책의
  `Effect` 값이고 `거부`는 그 동작을 설명하는 서술어다. 사용자가 작업 대상에서 뺐다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** `sync-baseline.mjs`를 써라.
- 기존 테스트를 깨뜨리지 마라.
