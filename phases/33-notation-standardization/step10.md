# Step 10: abbreviation-introduction-rules

**이 step은 치환이 거의 없다.** 약칭이 **정식 이름을 도입한 뒤에 쓰이는지**만 확인한다.

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

## 사용자가 정한 규칙

> - 가상 인터페이스(VIF)는 첫 도입 후 VIF 약칭 허용
> - 조직 단위(OU)는 첫 도입 후 OU 허용

AWS 한국어 문서가 그렇게 쓴다 — "가상 인터페이스(VIF) 중 하나를 생성해야 합니다" 뒤에
"퍼블릭 VIF의 경우"가 오고, "조직 단위(OU)를 사용하면…" 뒤에 "OU"가 온다.

## 판정 기준

**개념 하나 안에서, 그리고 문항 하나 안에서** 약칭이 처음 나오기 전에 정식 이름이
`정식 이름(약칭)` 꼴로 나왔는가를 본다. 문항은 순서가 섞이므로(ADR-011) **문항 하나가
단독으로 읽혀야 한다** — 프롬프트·보기·해설을 한 덩어리로 보고 판단해라.

- 도입이 이미 있으면 **아무것도 하지 않는다.**
- 도입이 없는데 약칭만 쓰는 자리가 있으면, **그 자리의 첫 등장만** `정식 이름(약칭)`으로 바꾼다.
- **정식 이름을 새로 설명하는 문장을 만들지 마라.** 그것은 새 정보 추가다.

## `VIF` / `가상 인터페이스`

`VIF` 5곳

**`hybrid-connectivity`**

- `hybrid-connectivity.virtual-private-gateway` `paragraphs[0]` ⚠단언 — …이빗 게이트웨이다. VPC마다 하나씩 붙는 장치라, 프라이빗 VIF를 여기에 연결하면 그 회선은 VPC 한 곳에 묶인다.
- `hybrid-connectivity.direct-connect-vif-types` `name` — Direct Connect의 가상 인터페이스(VIF)
- `hybrid-connectivity.direct-connect-vif-types` `summary` — 전용선 위에 무엇을 얹을지는 VIF 종류가 정하며, Transit Gateway로 가려면 트랜짓…
- `hybrid-connectivity.direct-connect-vif-types` `paragraphs[0]` — …에 논리적인 연결을 여러 개 만드는데 그것이 가상 인터페이스(VIF)다. 프라이빗 VIF는 VPC의 가상 프라이빗 게이트웨이나 …
- `hybrid-connectivity.direct-connect-vif-types` `paragraphs[1]` — … 환경에서 온프레미스를 연결하는 조합은 정해져 있다. 트랜짓 VIF로 Direct Connect Gateway에 연결하고, 리전…


`가상 인터페이스` 13곳

**`hybrid-connectivity`**

- `hybrid-connectivity.direct-connect-vif-types` `name` — Direct Connect의 가상 인터페이스(VIF)
- `hybrid-connectivity.direct-connect-vif-types` `paragraphs[0]` — …ect 회선 하나에 논리적인 연결을 여러 개 만드는데 그것이 가상 인터페이스(VIF)다. 프라이빗 VIF는 VPC의 가상 프라이빗 게이트…
- `q599` `explanation` — …Private Cloud)마다 하나씩 붙는 장치라, 프라이빗 가상 인터페이스를 여기에 연결하면 그 회선은 VPC 한 곳에 묶인다. 여기서…
- `q606` `choices[0]` — 프라이빗 가상 인터페이스를 각 VPC의 가상 프라이빗 게이트웨이에 하나씩 연결한다
- `q606` `choices[1]★` — 트랜짓 가상 인터페이스로 Direct Connect Gateway에 연결하고, 리전…
- `q606` `choices[2]` — 퍼블릭 가상 인터페이스를 만들어 AWS 공용 엔드포인트로 향하게 한다
- `q606` `explanation` — …회선 하나에는 논리적인 연결을 여러 개 만들 수 있고 그것이 가상 인터페이스다. Transit Gateway로 묶어 둔 환경에서 온프레미…
- `q607` `prompt` — …다. 목적지는 VPC 하나의 사설 IP 대역이다. 이때 어떤 가상 인터페이스를 만들어야 하며, 그 인터페이스는 무엇에 붙는가?
- `q607` `choices[0]★` — 프라이빗 가상 인터페이스. 가상 프라이빗 게이트웨이나 Direct Connect Ga…
- `q607` `choices[1]` — 퍼블릭 가상 인터페이스. AWS 공용 엔드포인트로 향하며 사설 대역에도 함께 닿는다
- `q607` `choices[2]` — 트랜짓 가상 인터페이스. Direct Connect Gateway를 거치지 않고 V…
- `q607` `choices[3]` — 종류를 고를 일이 없다. 회선 하나에는 가상 인터페이스를 하나만 만들 수 있다
- `q607` `explanation` — 전용선 위에 무엇을 얹을지는 가상 인터페이스의 종류가 정한다. 프라이빗 가상 인터페이스는 VPC(Virt…


## `OU` / `조직 단위`

**⚠ `OU` 검색에는 `OUTFILE`이 함께 걸린다.** `aurora.aurora-select-into-outfile-s3`의
`SELECT INTO OUTFILE S3`는 MySQL 구문이라 **건드리지 마라.**

`OU` 9곳

**`aurora`**

- `aurora.aurora-select-into-outfile-s3` `summary` — SELECT INTO OUTFILE S3 쿼리 하나로 Aurora MySQL 데이터를 …
- `aurora.aurora-select-into-outfile-s3` `paragraphs[0]` — Aurora MySQL은 **SELECT INTO OUTFILE S3** 쿼리만으로 결과를 S3에 직접 쓸 수 있다…
- `q395` `choices[0]★` — SELECT INTO OUTFILE S3 쿼리로 결과를 S3 버킷에 직접 쓰고 수명 주…
- `q395` `explanation` — …e Service)에 결과를 직접 쓰는 SELECT INTO OUTFILE S3 쿼리를 지원하므로, 오래된 데이터를 값싼 곳으…

**`organizations-cloudtrail-config`**

- `organizations-cloudtrail-config.organizational-unit` `name` — 조직 단위(OU)
- `organizations-cloudtrail-config.organizational-unit` `paragraphs[0]` — …함께 볼 것은 그 정책을 **어디에 붙이는가**다. 부서별로 OU를 만들어 그 부서의 계정을 넣고, 부서가 쓸 수 있는 서비스…
- `organizations-cloudtrail-config.organizational-unit` `paragraphs[1]` — OU에 붙은 SCP는 그 안 계정들의 IAM 사용자·그룹·역할 전…
- `organizations-cloudtrail-config.scp-attachment-targets` `paragraphs[0]` ⚠단언 — SCP를 붙일 수 있는 자리가 OU만은 아니다. 조직의 루트, OU, 그리고 개별 멤버 계정에 …
- `organizations-cloudtrail-config.scp-attachment-targets` `paragraphs[1]` — …다. 그 세 계정에 정책을 각각 연결하거나, 세 계정을 담을 OU를 만들어 옮기고 그 OU에 연결하는 것이다. 반대로 **루트…


`조직 단위` 19곳

**`ebs-instance-store`**

- `ebs-instance-store.ebs-snapshot-block-public-access` `summary` — 스냅샷이 공개로 공유되는 것을 조직 단위에서 한 번에 막는 설정이고, 감시가 아니라 차단이다.

**`backup-disaster-recovery`**

- `backup-disaster-recovery.organizations-backup-policy` `summary` — 조직 단위로 백업 계획을 정해 회원 계정 전체에 내려보내는 정책이라, …

**`iam-permissions`**

- `iam-permissions.iam-access-analyzer` `paragraphs[0]` — …를 식별하고, 최소 권한 원칙에서 벗어난 부분을 짚어 준다. 조직 단위로 모든 계정에 걸쳐 실행할 수 있다.
- `q687` `explanation` — …를 식별하고, 최소 권한 원칙에서 벗어난 부분을 짚어 준다. 조직 단위로 모든 계정에 걸쳐 실행할 수 있어 계정이 늘어도 사람이 문…

**`organizations-cloudtrail-config`**

- `organizations-cloudtrail-config.organizational-unit` `name` — 조직 단위(OU)
- `organizations-cloudtrail-config.organizational-unit` `paragraphs[0]` — Organizations는 계정을 조직 단위로 묶는다. SCP가 금지 목록을 거는 도구라면, 함께 볼 것…
- `organizations-cloudtrail-config.organizations-tag-policy` `paragraphs[1]` — … SCP 하나로도 완전히 채워지지 않는다. 둘을 각각 알맞은 조직 단위에 붙이는 것이 답이다.
- `organizations-cloudtrail-config.scp-attachment-targets` `summary` — SCP는 루트, 조직 단위, 개별 멤버 계정 중 어디에나 붙일 수 있고, 붙인 자리 아…
- `q242` `explanation` — …는 안 되는 행동을 걸어 두는 금지 목록이다. 조직의 루트나 조직 단위, 개별 멤버 계정에 붙일 수 있고 붙인 자리 아래에만 적용되…
- `q711` `choices[2]★` — 부서별 조직 단위를 만들어 계정을 넣고, 그 부서가 쓸 서비스를 정한 SCP를…
- `q711` `explanation` — Organizations는 계정을 조직 단위로 묶고, 조직 단위에 붙인 SCP(Service Contro…
- `q713` `explanation` ⚠단언 — …CP 하나로도 요구가 완전히 채워지지 않고 둘을 각각 알맞은 조직 단위에 붙여야 한다. AWS Config는 규정을 어긴 리소스를 …
- `q717` `choices[0]★` — 세 계정에 SCP를 각각 연결하거나, 세 계정을 담을 조직 단위를 만들어 옮기고 그 조직 단위에 연결한다
- `q717` `choices[2]` — 제한하지 않을 계정만 담은 조직 단위를 만들어 그 조직 단위에 거부 정책을 연결한다
- `q717` `explanation` — …trol Policy)를 붙일 수 있는 자리는 조직의 루트, 조직 단위, 개별 멤버 계정 셋이고 붙인 자리 아래에만 적용된다. 그래…
- `q718` `choices[0]` — SCP는 조직 단위에만 연결할 수 있어 루트 연결이 무시되고 기본 제한이 걸렸다
- `q718` `explanation` — …(Service Control Policy)는 조직의 루트, 조직 단위, 개별 멤버 계정 어디에나 붙일 수 있고 붙인 자리 아래에만…

**`cost-management`**

- `cost-management.budget-actions` `paragraphs[0]` — … 못한다. 예산 조치가 그 차이를 메운다. 임계값에 도달하면 조직 단위에 SCP를 붙여 추가 사용을 거부하게 하거나, 알림을 받아 …
- `q730` `explanation` ⚠단언 — …gets의 예산 조치가 그 차이를 메운다. 임계값에 도달하면 조직 단위에 SCP(Service Control Policy)를 붙여 …


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

## 작업 순서

1. 아래 대상 목록을 **문맥 조각과 함께** 읽고, 바꿀 자리와 둘 자리를 먼저 가른다.
2. 바꾼다. **낱말만 바꾼다.**
3. 정답 보기가 걸린 문항은 보기 넷을 다시 읽는다.
4. `node scripts/sync-baseline.mjs` → `npm test` → 깨지면 단언 문구만 맞춘다.
5. `node scripts/notation-diff.mjs 7f46259`가 exit 0인지 본다.

**바꿀 것이 하나도 없으면 그것이 정답이다.** `summary`에 "도입 규칙이 이미 지켜져 있다"고 적고 끝내라.

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
