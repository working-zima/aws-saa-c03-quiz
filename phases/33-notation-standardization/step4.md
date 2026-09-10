# Step 4: identity-center-b-access-key

**Identity Center B — Access Key → 액세스 키** — 이 step이 맡은 표기는 이 하나다.

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

## 표준을 이렇게 정한 근거

저장소 다수(26:12)이고 AWS 한국어 문서 표기와 같다.

## 이 step의 주의점

`Access Key`가 든 자리만 본다. **`AWS_IAM`·`AccessKeyId` 같은 코드 토큰이나 API 필드 이름은 건드리지 마라** — 그것은 표기가 아니라 값이다.

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
5. **받침이 달라지면 조사를 반드시 함께 고쳐라.** `토픽이` → `주제가`, `토픽을` → `주제를`,
   `토픽이어야` → `주제여야`가 그런 자리다. 한국어 문법이 강제하는 것이라 고치지 않으면
   비문이 된다. `notation-diff.mjs`는 자리표 뒤의 조사와 계사 활용을 함께 눌러 대조하므로
   **이런 변경은 위반으로 잡지 않는다.** 반대로 조사를 안 고치고 두면 문장이 깨진다.

## 대상 목록 — `Access Key`이 든 자리 12곳

**이 목록이 전부다.** 문맥 조각을 읽고 바꿀 자리와 둘 자리를 갈라라.

**`iam-permissions`**

- `iam-permissions.iam` `paragraphs[0]` ⚠단언 — … 사람이나 애플리케이션을 나타낸다. 이 사용자는 발급받은 **Access Key**로 AWS 서비스에 접근하며, 키의 보관 책임도 직접 진다…
- `iam-permissions.iam` `paragraphs[1]` — Access Key에는 만료 시점이 없어서 장기 자격 증명으로 분류한다. 유출된…
- `iam-permissions.iam` `paragraphs[2]` ⚠단언 — …한이 없는 사용자나 서비스에 AWS 리소스 권한을 부여한다. Access Key 같은 자격 증명을 서로 전달할 필요가 없으며, 필요할 때 언…
- `q156` `prompt` ⚠단언 — Access Key는 만료 시점이 없어 장기 자격 증명으로 분류한다. 이런 키를…
- `q156` `explanation` — …이 없는 사용자나 서비스에 리소스 권한을 부여하는 방식이고, Access Key 같은 자격 증명을 서로 전달할 필요가 없으며 필요할 때 언제…
- `q157` `choices[0]★` — Access Key
- `q157` `explanation` — … And Access Management) 사용자는 발급받은 Access Key로 AWS 서비스에 접근하고, 이 키에는 만료 시점이 없어 장…

**`identity-federation`**

- `identity-federation.sts` `summary` — Access Key나 Token 형태로 쓸 수 있는 임시 권한을 발급한다.
- `q159` `choices[0]` — Access Key
- `q159` `explanation` — …릿인데 나머지 셋은 모두 신원을 증명하는 자격 증명 쪽이다. Access Key는 IAM(Identity And Access Manageme…
- `q160` `prompt` ⚠단언 — 만료 시점이 있는 Access Key나 Token 형태의 임시 권한을 발급하는 서비스는 무엇인가?
- `q160` `explanation` ⚠단언 — STS(Security Token Service)는 Access Key나 Token 형태로 쓸 수 있는 자격 증명을 내주되 일정 시…


### 정답 보기가 걸린 문항 — 보기 넷을 한 벌로 보고 판단해라

**`q157`** — IAM 사용자가 발급받으며 만료 시점이 없는 장기 자격 증명은 무엇인가?…

- ★정답 `c0` — Access Key
-   오답 `c1` — STS Token
-   오답 `c2` — Permission Set
-   오답 `c3` — JWT


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
