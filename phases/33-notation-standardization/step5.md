# Step 5: identity-center-c-service-name

**Identity Center C — 서비스 이름 통일** — 이 step이 맡은 표기는 이 하나다.

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

AWS 한국어 문서가 "'Identity Center'만으로 단독 표기하지 않으며 'AWS IAM Identity Center'가 정식 명칭"이라고 못 박는다.

## 이 step의 주의점

**규칙이 둘이다.** 한 개념·한 문항 안에서 **첫 등장은 `AWS IAM Identity Center`, 이후는 `IAM Identity Center`**로 쓴다. 이미 `IAM Identity Center`인 자리는 그대로 두고, **`Identity Center`가 홀로 선 자리만** 앞에 `IAM `을 붙인다. `AWS IAM Identity Center`는 현재 저장소에 0건이므로 **첫 등장 자리를 골라 하나씩 만들어야 한다** — 개념 `paragraphs[0]`이나 문항 `explanation`의 첫 언급이 그 자리다.

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

## 대상 목록 — `Identity Center`이 든 자리 29곳

**이 목록이 전부다.** 문맥 조각을 읽고 바꿀 자리와 둘 자리를 갈라라.

**`s3-access-control`**

- `s3-access-control.s3-access-grants` `paragraphs[1]` — 기업 디렉터리나 IAM Identity Center에서 가져온 ID를 그대로 쓸 수 있어서, 사용자 관리는 Id…
- `q249` `explanation` — …M(Identity And Access Management) Identity Center에서 가져온 ID를 그대로 쓸 수 있다. 액세스 포인트는 접근…

**`identity-federation`**

- `identity-federation.identity-center` `name` — Identity Center
- `identity-federation.identity-center` `paragraphs[0]` ⚠단언 — Identity Center는 AWS 분류로는 보안·자격 증명·규정 준수(Security…
- `identity-federation.aws-directory-service` `paragraphs[1]` — … 관리하려면 AD Connector로 디렉터리를 잇고 IAM Identity Center의 권한 세트로 계정별 권한을 준다. 개발자마다 IAM 사용자…
- `identity-federation.identity-center-external-idp` `name` — IAM Identity Center와 외부 IdP의 연결
- `identity-federation.identity-center-external-idp` `paragraphs[0]` ⚠단언 — Identity Center는 여러 계정의 인증과 권한을 한곳에 모으고, 그 한곳이 회사…
- `identity-federation.identity-center-external-idp` `paragraphs[1]` — … 계정마다 SAML 공급자를 따로 설정하는 것도 마찬가지다. Identity Center가 중앙에서 그 일을 하고 있으면 계정별 설정은 중복이다.
- `identity-federation.identity-center-permission-set` `summary` — Identity Center가 계정에 권한을 부여하는 단위이며, 그룹에 할당해 최소 권한…
- `identity-federation.identity-center-permission-set` `paragraphs[1]` — …한 세트를 여러 개 만들어 나눠 줄 수 있기 때문이다. 이미 Identity Center를 쓰고 있는 환경이라면 IAM 사용자·역할을 새로 만드는 쪽…
- `q158` `choices[1]★` — Identity Center
- `q158` `explanation` ⚠단언 — Identity Center는 여러 AWS 계정에 흩어진 사용자 인증을 한곳에서 일괄 처…
- `q159` `prompt` — Identity Center에서 사용자나 그룹에 부여하는 권한 템플릿은 무엇인가?
- `q160` `choices[1]` — Identity Center
- `q160` `explanation` ⚠단언 — …되고, 유출되면 회수할 방법이 없다는 점에서 반대쪽에 선다. Identity Center는 여러 계정의 인증과 권한 부여를 한곳에서 통합 관리하는 서…
- `q161` `choices[1]` — Identity Center
- `q161` `explanation` ⚠단언 — …물음이 말한 웹과 모바일 앱의 로그인이 정확히 그 대상이다. Identity Center는 여러 AWS 계정의 인증과 권한 부여를 중앙에서 통합 관리…
- `q703` `choices[2]★` — AD Connector로 디렉터리를 잇고 IAM Identity Center의 권한 세트로 계정별 권한을 준다
- `q703` `explanation` ⚠단언 — …M(Identity And Access Management) Identity Center의 권한 세트가 맡아 한곳에서 관리된다. 개발자마다 계정별 I…
- `q704` `choices[1]★` — IAM Identity Center에 외부 ID 공급자를 SAML 2.0으로 연결하고 사용자와 …
- `q704` `explanation` ⚠단언 — …M(Identity And Access Management) Identity Center는 여러 계정의 인증과 권한을 한곳에 모으고, 그 한곳이 회사…
- `q705` `choices[0]` — IAM Identity Center에 권한 세트를 만들어 최종 사용자에게 할당한다
- `q705` `explanation` — …인증과 애플리케이션 계층 공격 방어가 각각 제자리를 잡는다. Identity Center의 권한 세트는 직원에게 AWS 계정 접근을 주는 장치라 최종…
- `q707` `prompt` — IAM Identity Center를 이미 사용하는 조직에서 팀마다 필요한 만큼만 권한을 주려는…
- `q707` `explanation` — … 대상 계정에서 무엇을 할 수 있는지를 묶어 정의한 것으로, Identity Center가 계정에 권한을 부여하는 단위다. 개개인이 아니라 그룹에 할…

**`iam-permissions`**

- `q155` `choices[0]` — Identity Center
- `q155` `explanation` ⚠단언 — … 없는 주체에게 권한을 넘기는 IAM 역할도 여기서 만든다. Identity Center는 여러 AWS 계정의 인증과 권한 부여를 한곳에서 통합 관리…
- `q156` `explanation` — …권한을 부여하는 방식이 아니며, Permission Set은 Identity Center가 여러 계정에 걸쳐 무엇을 할 수 있는지 묶어 정의한 권한 …
- `q157` `explanation` — …라는 조건과 정면으로 어긋나고, Permission Set은 Identity Center가 계정에서 할 수 있는 일을 묶어 정의한 권한 단위이지 자격…


### 정답 보기가 걸린 문항 — 보기 넷을 한 벌로 보고 판단해라

**`q158`** — 여러 AWS 계정의 로그인과 권한을 중앙에서 관리하는 서비스는 무엇인가?…

-   오답 `c0` — IAM
- ★정답 `c1` — Identity Center
-   오답 `c2` — Cognito
-   오답 `c3` — CloudTrail

**`q703`** — 인증은 지금처럼 온프레미스 Active Directory가 계속 맡아야 한다. 여러 AWS 계정의 접근 권한은 중앙에서 관리하려는 상황이다. 이…

-   오답 `c0` — 개발자마다 계정별로 IAM 사용자를 만들고 비밀번호를 온프레미스와 맞춰 둔다
-   오답 `c1` — 계정마다 역할을 만들어 담당자가 손으로 사람에게 배정한다
- ★정답 `c2` — AD Connector로 디렉터리를 잇고 IAM Identity Center의 권한 세트로 계정별 권한을 준다
-   오답 `c3` — 온프레미스 AD를 더 이상 사용하지 않고 AWS 관리형 Microsoft AD로 사용자를 모두 옮긴다

**`q704`** — 직원 수천 명에게 여러 AWS 계정의 접근 권한을 주려는 상황이다. 회사가 이미 사용하는 ID 공급자의 자격 증명 그대로 로그인할 수 있어야 한…

-   오답 `c0` — 계정마다 직원별 IAM 사용자를 만들고 입퇴사가 있을 때마다 모든 계정에서 그 사용자를 함께 고친다
- ★정답 `c1` — IAM Identity Center에 외부 ID 공급자를 SAML 2.0으로 연결하고 사용자와 그룹을 그 공급자에서 프로비저닝한다
-   오답 `c2` — 계정마다 SAML 공급자를 따로 설정하고 계정별로 역할을 만든다
-   오답 `c3` — Cognito 사용자 풀에 직원을 등록해 콘솔 로그인에 쓰게 한다


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
