# 다음에 할 일 — 이어받을 때 읽는 문서

작성 시점: 2026-09-09. phase 30(문제 은행 문체 다듬기)의 step 0~28을 **전부 끝낸** 직후다.
이 파일은 **다음 phase를 고르기 전까지의 인수인계**만 담는다. 결정이 끝나면 그 내용은
step 명세와 ADR로 옮겨가고 이 파일은 다시 짧아진다.

> **다음 세션이 먼저 할 일은 코드가 아니라 사용자 검수다.** phase 30이 문항 732개 중
> 718개의 프롬프트를 다시 썼지만, 합격 기준은 **"한국어로 자연스럽게 읽히는가"**이고
> 기계로는 판정할 수 없다. `npm run dev`로 실제 화면을 열어 읽어 달라고 청하는 것에서
> 시작한다. phase 29가 남긴 교훈이 그대로 적용된다 — **검수를 테스트 통과나 grep으로
> 갈음하지 마라.**

## phase 31 결과 보고 (2026-09-10) — 문체 확대 적용이 끝났다

`feat-31-content-quality-rollout`에서 step 0~25를 전부 끝냈다. 범위는 **문체와 가독성 수정**
하나였고 사실관계는 건드리지 않았다. 아래 넷은 사용자가 완료 후 정리해 달라고 한 항목이다.
**아직 push하지 않았다** — 4를 봐라.

> **아래쪽의 「지금 상태」와 「phase 31 — 명세를 짜 두었다. 아직 돌리지 않았다」 두 절은
> 이 절보다 앞서 쓰인 것이라 낡았다.** 테스트 471개·`fix-vpc-endpoint-fact` 미병합·
> phase 31 미실행은 전부 이 절의 4가 대신한다. 두 절은 당시 기록으로 그대로 둔다.

### 1. 무엇을 얼마나 고쳤나

**주제 39개를 전부 훑었다.** step 0~2가 세 주제, step 3~25가 나머지 36개다.
기준선은 phase 착수 커밋 `4453434`이고, 아래 수치는 그 커밋과 HEAD의 JSON을 **필드 단위로
비교한 실측**이다(요약에 적힌 자기 보고 수치가 아니다).

| 대상 | 총계 | 바뀐 것 |
|---|---|---|
| 주제 | 39 | **39** — 한 글자도 안 바뀐 주제가 없다 |
| 개념 | 618 | **405** (65%) |
| 개념 문단 `paragraphs` | — | **545곳** |
| 문항 | 732 | **521** (71%) |
| 문항 해설 `explanation` | — | **520** |

파일 단위(`git diff 4453434..HEAD --stat -- src/`):

```
 src/data/data.test.ts   |  321 +++++++++++++++
 src/data/questions.json | 1042 +++++++++++++++++++++++------------------------
 src/data/topics.json    |  810 ++++++++++++++++++------------------
 3 files changed, 1247 insertions(+), 926 deletions(-)
```

**step 3에서 범위가 좁아진 것이 데이터에 그대로 남아 있다.** step 0~2와 그 정리 커밋
(`e81b594`)까지는 `name`·`summary`·문단 개수·`prompt`·`choices`도 손댔고,
**step 3~25는 개념 `paragraphs`와 문항 `explanation` 둘만** 고쳤다. 그 23개 step이 매번
"고정 필드 위반 0"이라고 적은 것이 실측으로 확인된다.

| 필드 | 착수 ~ `e81b594` | `e81b594` ~ HEAD (step 3~25) |
|---|---|---|
| 개념 `name` | 3 | **0** |
| 개념 `summary` | 1 | **0** |
| 개념 문단 개수 | 3 | **0** |
| 개념 문단 본문 | 53 | 492 |
| 문항 `prompt` | 6 | **0** |
| 문항 `choices` | 3 | **0** |
| 문항 `answerIndex` | 0 | **0** |
| 문항 `explanation` | 33 | 487 |

`scripts/content-audit.mjs`를 착수 커밋의 데이터에도 돌려 대조했다.

| 지표 | 착수(`4453434`) | 지금 | 차 |
|---|---|---|---|
| ① 문장형 제목 | 183 (34개 주제) | **181** (32개 주제) | −2 |
| ② 관용 표현 | 144 (개념 66·문항 78) | **91** (개념 39·문항 52) | **−53** |
| ③ 정답 노출 후보 | 62 | 62 | 0 |
| ④ 소속 없는 용어 | 1 | 1 | 0 |
| ⑤ 장문 | 3 | 3 | 0 |
| ⑥ 중복 후보 | 8쌍 | 8쌍 | 0 |
| 여섯 지표가 모두 0인 주제 | 3 | **4** | +1 |

**늘어난 지표가 하나도 없다.** 줄어든 것은 ①·② 둘뿐이고, 나머지 넷이 그대로인 이유는
전부 범위 밖 필드(`name`·`prompt`·`choices`)에 있기 때문이다 — 아래 2A를 봐라.

**이 표가 이 phase의 성과를 재지 못한다는 것을 분명히 적어 둔다.** 기계가 보는 것은 여섯
지표뿐이고, 실제로 고친 것은 은유적 추상어(`자리`·`축`·`갈린다`·`밀린다`), 줄표로 이어
붙인 문장, 지시어(`이쪽`·`그쪽`·`앞의 둘`), 개념 본문이 확인 문제를 가리키던 말,
문단 첫 문장의 순서, 주술 불일치다. 유형과 빈도는 3에 있다.

`scripts/topics-baseline.json`의 `questionsSha256`은
`145f5f7d…` → `d0e7634e…`로 26번 이어 갱신됐고, `conceptLineCount`와 주제 메타데이터는
그대로다.

### 2. 변경하지 않고 보류한 항목

각 step 요약의 「보류」를 합치면 **262건**이다. 사유별로 묶는다.

#### A. 범위 밖 필드에 있다 — 119건이 이 사유를 명시한다

step 3~25가 손댈 수 있던 것은 개념 `paragraphs`와 문항 `explanation` 둘뿐이었다.
같은 결함이 다른 필드에도 있으면 **한쪽만 고칠 때 한 주제 안에서 같은 것을 두 말로
부르게 되므로** 통째로 남긴 경우가 많다.

**A1 — 개념 `name`(문장형 제목) 181건, 32개 주제.** `content-audit.mjs`의 ① 값 그대로다.

| 건수 | 주제 |
|---|---|
| 14 | `efs-fsx`, `sqs-sns-eventbridge` |
| 10 | `lambda` |
| 9 | `elastic-load-balancing`, `iam-permissions` |
| 8 | `data-transfer-services`, `rds-storage-features`, `cloudfront-global-accelerator`, `api-gateway-step-functions` |
| 7 | `aurora`, `dynamodb` |
| 6 | `s3-access-control`, `ecs-eks-fargate`, `vpc-networking`, `cost-management` |
| 5 | `hybrid-connectivity`, `kinesis-streaming` |
| 4 | `ebs-instance-store`, `ec2-autoscaling`, `backup-disaster-recovery`, `emr-glue-athena` |
| 3 | `elasticache-purpose-built-db`, `security-groups-nacl`, `route53`, `redshift-opensearch-quicksight`, `cloudwatch-xray`, `secrets-encryption`, `waf-shield`, `guardduty-macie-inspector` |
| 2 | `identity-federation`, `organizations-cloudtrail-config` |
| 1 | `storage-gateway-migration` |
| 0 | `aws-core-services`, `s3-storage-classes`, `s3-versioning-lifecycle`, `s3-encryption-batch`, `governance-iac`, `systems-manager`, `ai-ml-services` |

**제목이 본문에서 없앤 말을 그대로 들고 있는 자리**를 step들이 여럿 짚었다 —
`ecs-task-role-vs-task-execution-role`(`…은 다른 자리다`),
`elasticache-not-a-durable-store`(`…두는 자리가 아니다`),
`scp-attachment-targets`(`SCP를 붙일 수 있는 자리`),
`data-lifecycle-manager`(`…정책으로 돌린다`),
`kms-automatic-key-rotation`(`…해마다 돈다`),
`alb-l7-vs-nlb-l4`(`계층으로 갈리는 …`),
`gpu-instance-family`(`… 서비스 자체가 갈린다`),
`emr-node-instance-family-choice`(`… 제품군이 갈린다`).

**A2 — 개념 `summary` 62건이 언급된다.** 본문·해설은 고쳤는데 요약만 옛말로 남은 자리다.
`efs-fsx`(3건)·`ecs-eks-fargate`(6건)·`lambda`(3건)가 많다.

**A3 — 문항 `prompt` 41건.** `q452`·`q453`·`q476`·`q522`·`q535`·`q546`·`q552`·`q650`처럼
개념·해설의 같은 표현은 고쳤는데 프롬프트만 남은 자리가 대부분이다.

**A4 — 문항 `choices` 51건.** `q348`·`q356`·`q384`·`q415`·`q416`·`q584`·`q587`·`q691`·
`q718 c1`처럼 보기 하나가 옛말을 그대로 쓴다. `q399`·`q404`·`q427`·`q488`·`q624`는
보기 넷이 같은 모양의 줄표(` — `)를 써서 한쪽만 끊으면 대칭이 깨진다.

**A5 — 「짝이 깨진 자리」 7건.** 위 A2~A4의 결과다. **반대로 step 21·22는 범위 밖 필드에
걸친 짝이 하나도 없어 그 두 step은 깨진 짝을 남기지 않았다.**

#### B. `src/data/data.test.ts`가 고정한 구절 — 7건

`toBe`/`toContain` 단언이 그 문장을 잡고 있어, 고치려면 단언까지 함께 고쳐야 한다.
「단언의 뜻을 바꾸지 마라」가 step 규칙이어서 전부 남겼다.

1. `backup-disaster-recovery.backup-and-restore-dr` p0 + `q578` 해설 — `컴퓨팅은 필요해질 때까지 띄우지 않는다`
2. `q130` 해설 **전문**(`toBe`) — `통제하는 자리가 서브넷이 아니라`
3. `guardduty-macie-inspector.amazon-inspector` p1 — `…다른 선택지와의 갈림길이 된다`
4. `iam-permissions.network-access-analyzer` p0 — `분석 대상이 네트워크인지 권한인지로 갈린다`(짝인 `q688` 해설도 함께 남김)
5. `organizations-cloudtrail-config.scp-attachment-targets` — `연결한 자리 아래에만 적용된다`
6. `ai-ml-services.comprehend` p0 — `글의 의미를 다루는 자리`(짝인 `q313` 해설도 함께 남김)
7. `route53` — `q221` 프롬프트 전문(`toBe`)이 `헬스 체크`/`상태 검사` 통일을 막는다

#### C. 고치면 「새 정보 추가」가 된다

**C1 — 기초 용어 풀이가 그 주제 안에 없다.** step 3~25가 다룬 36개 주제 **거의 전부**에서
나왔다(24개 항목이 「주제 전체」로 묶여 있다). ADR-010·014·028·029의 목록(22종) 밖이라
풀이를 세우려면 ADR을 먼저 고쳐야 한다. **618개념 어디에도 정의가 없다고 짚힌 낱말**이
특히 무겁다.

| 낱말 | 어디서 걸렸나 |
|---|---|
| `스냅샷` | `s3-storage-classes`·`ebs-instance-store` 등 다수 — 개념 넷의 주어인데 정의가 없다 |
| `파드` | `ecs-eks-fargate` 개념 여덟의 주어 |
| `샤드` | `kinesis-streaming` 개념 다섯의 주어 |
| `키 자료` | `secrets-encryption` 개념 넷의 주어 |
| `Web ACL` | `waf-shield` 개념 셋의 주어 |
| `신뢰 정책` | `iam-permissions` 개념 둘의 주어 |
| `배스천 호스트` | `systems-manager` 개념 둘·문항 셋의 전제 |
| `임시 포트 범위` | `security-groups-nacl` — 상태 비저장의 결과를 대는 유일한 근거 |
| `관리 계정`·`멤버 계정` | `organizations-cloudtrail-config`·`cost-management` 여섯 개념의 주어 |
| `오리진`·`배포` | `cloudfront-global-accelerator` 개념 절반, `api-gateway-step-functions` |
| `AZ`·`가용 영역` | `vpc-networking` 개념 넷을 비롯해 여러 주제 (step 1이 `s3-storage-classes`에서 세운 문구를 그대로 쓸 수 있다) |

**C2 — 도입 문장이 없어 그 서비스가 무엇인지가 `summary`에만 있다.** 문단이 한 문장뿐이거나
카테고리 한 줄 뒤가 곧바로 세부·오해 방지·요구여서, 한 문단 안에서 순서를 바꾸는 것으로는
풀리지 않는다. `lambda.lambda-function-url`·`lambda.lambda-vpc-access`·
`route53.resolver`·`cloudwatch-xray.performance-insight`·`ecs-eks-fargate.aws-batch`·
`ecs-eks-fargate.fargate-no-time-limit`·`waf-shield.waf-bot-control`·
`cost-management.cost-anomaly-detection`·`kinesis-streaming`의 정의 개념 셋 등이다.
**문단을 넘는 이동도 범위 밖이었다** — `cloudfront-geo-restriction`·
`cloudfront-s3-upload-with-oac`·`gpu-instance-family`·`security-group-referencing`처럼
정체가 `p1`에 있는 자리가 여기 든다.

#### D. 표기를 바꾸는 판단이라 문체 범위를 넘는다 — 같은 것의 두 이름 12자리

| 주제 | 두 이름 |
|---|---|
| `route53` | `상태 검사` / `헬스 체크` |
| `emr-glue-athena` | `프라이머리 노드` / `주 노드` |
| `elastic-load-balancing` | `타깃 그룹` / `대상 그룹`, `Auto Scaling 그룹` / `오토 스케일링 그룹` |
| `api-gateway-step-functions` | `Edge-optimized` / `엣지 최적화` |
| `waf-shield` | `IP Set` / `IP 세트` |
| `vpc-networking` | `VPC Endpoint` / `VPC 엔드포인트`, `NAT Gateway` / `NAT 게이트웨이` |
| `secrets-encryption` | `원본`(개념) / `오리진`(해설) |
| `sqs-sns-eventbridge` | `주제`(개념) / `토픽`(문항) |
| `elasticache-purpose-built-db` | `DB` / `데이터베이스` |
| `s3-access-control` | `콘텐츠 전송 네트워크` / `CloudFront` |
| `efs-fsx` | `Google Cloud`로 적힌 예시(`Google Drive`를 가리키는 듯하다) |

**`sqs-sns-eventbridge`의 `주제`는 특히 성가시다** — 이 앱의 데이터 모델에도 `Topic`이
있어서 같은 낱말이 두 층에서 쓰인다.

#### E. 대체어가 사실을 넓히거나 좁힐 수 있다 — 11건

비교 기준을 밝히지 않은 `앞선다`·`유리하다`·`떨어진다`·`뒤에 놓인다`·`값을 하다` 계열이다.
**기준이 같은 문장 안에 있으면 고쳤고**(step 8·13·16·23이 그렇게 했다) **없으면 남겼다** —
`낫다`·`유리하다`로 바꾸는 순간 원문에 없는 주장이 되기 때문이다. 걸린 자리는
`data-transfer-services.transfer-family-workflow` p1, `rds-storage-features.rds-custom-byol`·
`rds-custom` p1, `dynamodb.dynamodb-auto-scaling-target-utilization` p1,
`dynamodb.dynamodb-s3-export-vs-streams` p0, `q445`,
`cloudfront-global-accelerator.cloudfront-alb-origin` p0·`cloudfront-price-class` p1,
`ecs-eks-fargate.eks-aws-load-balancer-controller` p1,
`api-gateway-step-functions`의 셋, `cloudwatch-xray.log-analysis-options` p1이다.

#### F. 문항 재설계가 필요하다 — 기계 지표가 그대로인 이유

- **⑥ 중복 후보 8쌍 중 3쌍이 실제 중복이다**(`content-audit.mjs` 머리주석) —
  `q113`·`q116`, `q031`·`q033`, `q040`·`q041`. step 2가 `q031`의 프롬프트 축을 갈라
  세 문항이 서로 다른 것을 묻게 만들었지만 **개념과 정답 텍스트가 같아 도구에는 계속 뜬다.**
  중복이 아니라고 판정해 남긴 것은 `q096`·`q097`(step 16), `q141`·`q145`(step 21),
  `q146`·`q148`(step 22)이다.
- **③ 정답 노출 후보 62건은 위반 목록이 아니다.** 각 step이 전건을 손으로 읽어
  「그 낱말이 없으면 문항이 성립하지 않는다」(ADR-030 기준 3의 예외)로 판정했다.
  `AWS`·`DB`·`IP`처럼 ADR-015가 상식으로 뺀 토큰이 다수 섞인다.
- **⑤ 장문 3건**(`q029`·`q054`·`q079`)은 쉼표에서 「누가/무엇을/왜」로 끊겨 읽혀 남겼다.
  `q054`·`q055`·`q056`은 셋이 같은 모양이라 하나만 끊으면 대칭이 깨진다.
- **④ 소속 없는 용어 1건**은 `q650` 프롬프트의 `객체 스토리지`다.
- **요구가 둘인 문항**은 ADR-030 기준 2의 경계(`독립된 지식 둘을 곱해야 하는가`)로
  전부 판정해 남겼다 — `q003`·`q024`·`q170`·`q271`·`q272`·`q275`·`q279`·`q325`·`q326`.

#### G. 판단이 갈려 그대로 뒀다 — 나머지

「고치면 뜻이 미세하게 달라진다」로 남긴 자리들이다. 강조 마커(`**…**`)가 문단 안에 든 곳
(`data-transfer-services`·`vpc-networking`·`secrets-encryption`)은 **표기 정책이라 범위
밖**으로 뒀고, `security-service-lineup`의 `**용어** — 정의` 라벨형 줄표는 문단 넷이 같은
서식이라 손대면 대칭이 깨져 남겼다.

### 3. 반복적으로 발견한 문제 유형 (빈도순)

각 step이 「되풀이해서 나온 문제 유형」에 적은 것을 묶었다. 괄호 안은 **그 유형을 항목으로
적은 step 수**다. **다음 phase(사실관계 검수)가 무엇을 만나게 될지가 여기서 나온다.**

1. **`자리`가 문맥마다 다른 것을 가리킨다 (22개 step).** 압도적 1위다. 곳·일·역할·서비스·
   장치·도구·상황·조건·원인·요구·선택지·대상·위치를 두루 가리켰다. **처방은 하나로 고정할 수
   없다** — 그 문장이 실제로 가리키는 것을 넣어야 하고, 앞 문장이 이미 `서비스다`·`도구다`로
   끝났으면 명사를 또 넣지 말고 동사를 그대로 부정하는 쪽(`맡지 않는다`)이 짧다.
   최다 밀집은 `sqs-sns-eventbridge` 한 주제 35곳이었다.
   **`그 자리에서`(즉시·제자리)·`한자리에`·`비밀번호 자리`(입력 칸)는 대상이 아니다.**
2. **개념 본문과 해설이 같은 문장을 공유한다 (22개 step — step 4~25 전부).**
   주제마다 11~20쌍이다. ADR-016으로 확인 문제 화면에서 개념을 펼치면 둘이 같은 화면에
   보이므로, **한쪽만 고치면 그 자리가 두 이름을 갖는다.** 이 phase가 개념 545곳과 해설
   520개를 늘 짝으로 맞춘 이유다.
3. **줄표 ` — `로 두 문장을 이어 붙인다 (11개 step).** 네 모양이 있다 —
   「요지 → 근거」(마침표로 끊고 `~때문이다`로 받는다), 「선언 → 내용」(그냥 끊으면 된다),
   「총론 → 열거」(`A하고, B하고, C하는 것이다`로 닫아야 한다),
   **「주어/목적어 → 삽입구 → 서술어」(끊는 것만으로는 안 되고 문장 구조를 다시 짜야 한다).**
   해설 쪽이 개념 쪽보다 훨씬 많았다 — phase 28이 해설을 다시 쓸 때 들어온 형태로 보인다.
4. **`축`이 문맥마다 다른 것을 가리킨다 (11개 step).** 「가르는 기준」이면 `기준`으로 풀리지만,
   **`축이 하나 더 있다`처럼 갈래를 세는 자리는 낱말 치환으로 안 되고 문장을 다시 써야 한다**
   (`확인할 것이 하나 더 있다`·`두 가지에서 나뉜다`). 「비교 대상이 다루는 것이 다르다」는
   뜻이면 `다른 문제다`·`목적이 다르다`가 맞았다.
5. **개념 본문이 확인 문제를 직접 가리킨다 (8개 step).** `선택지는 오답이다`·
   `문제에 X가 보이면`·`같은 보기 줄에 오르는`이 그 모양이다. **개념 화면에는 가리킬 보기가
   없어 그 자리에서 읽히지 않는다.** 가장 밀집한 곳이 `iam-permissions`·`identity-federation`
   여섯, 그다음이 `organizations-cloudtrail-config`·`cost-management` 넷이었다.
   **해설의 `선택지`는 대상이 아니다** — 보기와 함께 읽히는 자리다.
6. **`띄우다`·`돌리다` 계열을 범위 밖 필드 때문에 통째로 보류 (7개 step).**
   **보류 여부는 그 낱말이 아니라 그 낱말이 `summary`·보기·프롬프트에 있느냐로 갈렸다** —
   `route53`·`secrets-encryption`·`cloudwatch-xray`·`systems-manager`는 본문·해설에만 있어
   전부 고쳤고, `ecs-eks-fargate`(22건)·`emr-glue-athena`(16건)·`lambda`(15건)는
   범위 밖 필드에 걸쳐 있어 하나도 못 고쳤다. **남은 ② 91건의 대부분이 이 셋이다.**
7. **정규식·도구를 한 번만 돌리면 놓친다 (5개 step).** 활용형이 패턴을 비껴가고
   (`밀리지 않는다`는 `밀린` 패턴에 안 걸린다), `길`·`오른다`·`모양`처럼 목록에 없는 은유가
   섞이며, 편집이 새 결함을 만들기도 한다. **편집을 마친 뒤 재스캔이 매번 마지막 몇 건을 줍었다.**
8. **해설이 개념보다 먼저 옳은 형태를 갖고 있다 (5개 step).** phase 28이 해설을 다시 쓰면서
   더 나은 표현을 이미 넣어 둔 자리다. **개념을 그쪽에 맞추면 사실을 건드리지 않고 풀린다.**
9. **문단 첫 문장에 정체가 없다 (유형으로 2개 step, 보류로 11건).** 오해 방지·소거·대비·
   문제 상황으로 열고 「이것이 무엇인가」가 뒤에 온다. 한 문단 안에서 순서를 바꾸거나 생략된
   주어를 되살리면 풀리지만, 정체가 다음 문단이나 `summary`에만 있으면 못 푼다(위 C2).
   **순서를 바꿀 때 첫 문장이 `summary`와 같아지면 안 된다** — UI가 요약 바로 아래에 본문을
   두므로 같은 문장이 두 번 보인다(step 0의 교훈).
10. **단발로 나온 것들.** 카테고리 한 줄 바로 뒤 주어 되풀이(step 6·22) /
    지시어를 이름으로 바꾸면 같은 이름이 이웃 문장에 두 번 남음(step 14) /
    약어 풀네임(ADR-015)이 지시어 치환을 제약함(step 11) /
    괄호 약어 풀이가 풀네임 가운데를 가름(step 7) /
    프롬프트가 이미 옳은 낱말을 쓰고 있어 그것을 근거로 삼음(step 17·18·23·25) /
    조사 하나가 구문을 바꿈(step 25) /
    굵은 표시 뒤 줄표는 마침표를 굵은 표시 안에 넣어 끊음(step 25).

**다음 phase에 넘기는 한 줄:** 이 phase는 **문장이 어떻게 읽히는가**만 봤고
**그 문장이 사실인가**는 한 번도 검증하지 않았다. 위 C1(기초 용어)과 D(같은 것의 두 이름)는
문체 문제로 잡혔지만 실은 **사실·표기의 문제**여서 다음 phase의 입력이 된다.

### 4. 마지막 커밋 상태

| 항목 | 값 |
|---|---|
| 브랜치 | `feat-31-content-quality-rollout` |
| 분기 지점 | `4453434` — merge: VPC 엔드포인트 사실 통일과 phase 31 명세를 develop에 들인다 |
| 마지막 커밋 | `8e43110` — chore(31-content-quality-rollout): step 25 output |
| 그 앞 | `a3c7a1e` — feat(31-content-quality-rollout): step 25 — governance-iac-and-systems-manager-and-ai-ml-services |
| `develop` 대비 | **56 커밋 앞선다**(이 보고서 커밋을 더하면 57) |
| `develop`에만 있는 것 | **커밋 하나** — `cf54a5d` docs: worktree에 concepts-raw.md가 없으면 전사 검사가 조용히 건너뛴다는 것을 남긴다. **병합할 때 함께 봐라.** |
| push | **하지 않았다.** 병합과 push는 사람이 판단한다(CLAUDE.md). |

검증(전부 이 보고서를 쓰기 직전에 직접 돌렸다):

| 명령 | 결과 |
|---|---|
| `npm test` | **492개 통과 (22개 파일)** — 착수 시점과 같다. step 0~2가 21개를 더했고(471→492) step 3~25는 단언을 하나도 더하거나 고치지 않았다 |
| `npm run build` | 통과 (tsc 타입체크 포함, 877ms) |
| `node scripts/check-structure.mjs` | 이상 없음 — 개념 id·name, 주제 메타데이터, 개념 개수·순서, 문항 파일 전부 기준과 같다 |
| `node scripts/coverage.mjs` | 개념 618개 중 618개 덮임 (100%), 문항 732개, 문항 없는 주제 0개 |
| `node scripts/check-verbatim.mjs` | 전사 이상 없음 (ADR-025가 넘기기로 한 서비스 이름 나열 1건만 보고됨) |
| `node scripts/content-audit.mjs` | **착수 대비 늘어난 지표 0** — 1의 표를 봐라 |

## 먼저 읽어라 — 다른 기기에서 이어받는 법 (2026-09-09에 갱신)

**phase 28~30은 `develop`을 거쳐 `main`까지 나갔다**(`7339754`, 배포된 사이트에 반영돼 있다).
아래 본문 곳곳에 "phase 29·30은 push되지 않았다"고 적힌 것은 **병합 전에 쓰인 문장이니 믿지
마라** — 최신은 아래 「지금 상태」 표다.

지금 병합·push를 기다리는 것은 브랜치 `fix-vpc-endpoint-fact` 하나다. 커밋 둘이 들어 있다 —
**(1) 후보 E 판정(ADR-031)**, **(2) phase 31 명세**. **병합과 push는 사람이 판단한다**(CLAUDE.md).

**phase 31을 돌리기 전에 이 브랜치를 `develop`에 병합해라.** harness가 현재 브랜치에서
`feat-31-content-quality-rollout`을 파므로, 병합하지 않고 돌리면 step 21(`vpc-networking`)이
ADR-031이 이미 고친 자리를 다시 열게 된다.

```bash
git checkout develop
npm install            # Node 18.17.1
npm test               # 471개 통과해야 정상
node scripts/check-structure.mjs   # 이상 없음이어야 정상
```

`python3`는 없을 수 있다 — Windows에서는 `py` 또는 `python`이 Python 3.13이다.

### phase 30 — 끝났다. 남은 것은 사용자 검수다

사용자 요청은 **"AWS 퀴즈 문장을 전체적으로 다시 검토해달라 — 의미만 전달되는 번역체가
아니라 한국어로 자연스럽게 읽히는 문제 문장으로"**였다. step 29개를 모두 실행해
주제 39개 전부를 훑었다.

세션 도중 사용자가 step 0·1의 대조표를 보고 **"이대로 계속"**으로 문체 기준을 확정했다.
그때 함께 짚은 것 하나 — 이 phase는 `쓰다→사용하다`·`부르다→호출하다`·`훑다→살피다`처럼
**고유어를 한자어로 바꾸는 치환**을 체계적으로 했고, 이것이 "번역체를 줄인다"는 요청과
반대 방향일 수 있다고 알렸다. 사용자는 그대로 진행하기로 판정했다. **다시 묻지 마라.**

| 지표 (세는 규칙은 아래 각주) | 착수 | 완료 |
|---|---|---|
| 프롬프트가 체언으로 끊긴 것(`…서비스는?`·`…것은?`) | 488 (67%) | **35 (5%)** |
| 명시적 물음(`…는가?`·`…인가?`)으로 닫은 것 | 228 (31%) | **697 (95%)** |
| 사용자가 제안한 `~하는 상황이다` 형태 | 0 | **486** |
| 끝맺음 형태 종류 | 163종 | **28종** |

> 각주: 이 표의 세는 규칙은 착수 조사(616/84%)와 다르다. 여기서는 체언 종결을
> `/(은|는|것은|이|가)\?$/`에서 `(는가|인가)\?$`를 뺀 것으로, 명시적 물음을
> `/(는가|인가)\?$/`로 쟀다. **숫자를 되짚을 때 두 규칙을 섞지 마라.**

데이터 무결성은 착수 커밋(`a673518`)과 전수 대조해 확인했다.

| | |
|---|---|
| `prompt` 변경 | 718 / 732 |
| `choices` 변경 | 132 (표현만. 정답·오답의 변별점은 그대로) |
| `answerIndex` 변경 | **0** |
| `conceptId` 변경 | **0** |
| `explanation` 변경 | 21 — 전부 프롬프트 인용을 맞춘 것이다(명세가 허용한 유일한 사유) |
| 정답 텍스트가 프롬프트에 통째로 들어간 문항 | 착수 1건 → 완료 1건 (**새로 생긴 것 없음**) |

phase 30의 가장 큰 실패 방식은 **문장을 자연스럽게 만들려다 정답을 가르는 조건을 흘리는
것**이었는데, 위 마지막 줄이 그것이 일어나지 않았음을 보인다.

**남은 audit 지표** — ④ 소속 없는 용어 1건, ⑤ 장문 3건, ③ 정답 노출 후보 62건(위반 건수가
아니다), ② 관용 표현 144건, ① 문장형 제목 183건. **①은 `topics.json`의 개념 제목이라 이
phase의 범위가 아니었다**(step마다 그렇게 판정하고 넘겼다). ②도 대부분 개념 본문과 해설에
있고, 이 phase는 프롬프트만 손댔다.

#### step 18에서 겪은 것 — 사용량 한도로 죽으면 이렇게 된다

step 18(`polish-security-groups-nacl`)이 데이터 17문항을 커밋한 **직후** 한도에 걸려
headless `claude`가 3회 연속 exit 1로 죽었다. executor는 그 상태를 그대로 커밋하고
`error`로 찍는다. 결과는 **저장소가 깨진 채로 남는 것**이다 — 테스트 4개 실패,
`check-structure` 실패.

아래 「이어받을 때 주의할 것」은 "step을 `pending`으로 되돌리고 다시 실행하라"고 적고 있는데,
**데이터가 이미 커밋된 뒤에 죽었다면 그것만으로는 부족하다.** 이번에는 되돌리지 않고
뒤처리를 마저 했다(`6c275da`). 판단 근거는 데이터 작업 자체가 온전했다는 것이다 —
앞 커밋과 전수 대조해 `answerIndex`·`explanation`·`conceptId` 변경이 0건임을 확인했다.
빠져 있던 것은 셋이었다.

1. `data.test.ts`가 문자열로 고정한 프롬프트 갱신 — **이것이 테스트를 깨뜨린 원인이다.**
   vitest는 한 `it` 안에서 첫 단언에 멈추므로, 실패 목록에 뜬 개수보다 실제로 고칠 것이 많다.
   바뀐 문항 id로 `grep 'prompts\.qNNN' src/data/data.test.ts`를 전부 돌려야 한다.
2. `scripts/topics-baseline.json`의 `questionsSha256` 갱신. **이 파일은 1칸 들여쓰기이고
   `"questionsSha256":"..."`에 콜론 뒤 공백이 없다.** `JSON.stringify(…, null, 2)`로
   다시 쓰면 2905줄이 통째로 바뀐다 — sha 문자열만 치환해라.
3. phase index의 step 상태·`summary`.

### phase 29에서 배운 것 — 되풀이하지 마라

**검수를 테스트 통과나 데이터 grep으로 갈음하면 안 된다.** step 0이 용어를 첫 주제에만 넣고
"고쳤다"고 보고했는데 사용자가 실제 화면을 열어 30초 만에 같은 자리에서 다시 막혔다. 이 앱의
읽는 단위는 개념이 아니라 **주제 페이지**다(ADR-029가 그래서 나왔다). 그리고 기계 지표가
여섯 개 다 0건이어도 사람이 읽으면 남은 것이 보인다 — `q036`·`q039`가 그 자리였다.

---

## phase 29 — 끝났다. 무엇을 했고 무엇이 남았나

브랜치는 `feat-29-content-quality-pilot`이고 **`develop`은 아직 이 작업을 담고 있지 않다.**
병합과 push는 사람이 판단한다(CLAUDE.md).

```bash
git checkout feat-29-content-quality-pilot
npm install && npm test          # 468개 통과해야 정상
node scripts/content-audit.mjs   # 아래 「다음 phase의 입력」의 숫자가 나와야 정상
```

### 사용자가 답한 결정 — 다시 묻지 마라

phase 29를 기획할 때 사용자가 고른 셋이다.

1. **범위** — 개념 618개·문항 732개를 전수 검토하지 않는다. **시범 주제 하나
   (`s3-encryption-batch`)로 기준을 세우고 검수받은 뒤 넓힌다.**
2. **출처 제한** — ADR-010의 예외를 **AWS 고유 기초 용어까지 넓힌다.** step 0이 ADR-028을
   썼고 대상은 `버킷`·`객체`·`접두사` 3종으로 고정했다.
3. **`name` 개정 범위** — **`name`만 바꾸고 `id`는 유지한다.** 문항 732개가 `conceptId`로
   개념을 참조하므로 `id`를 바꾸면 파급이 크다. `name`을 고치면
   `scripts/topics-baseline.json`을 같은 커밋에서 갱신해야 한다.

phase를 실행하는 중에 사용자가 하나 더 정했다.

4. **용어가 안 닿는 문제** — 용어집 페이지나 툴팁이 아니라 **주제마다 본문 한 줄을
   되풀이한다.** step 3이 ADR-029로 ADR-010의 「한 번만」을
   「각 주제에서 처음 나오는 자리에서 한 번」으로 개정했다.

### 이 phase가 실제로 한 것

| step | 이름 | 무엇을 했나 |
|---|---|---|
| 0 | `adr-028-basic-vocabulary` | ADR-028. `버킷`·`객체`·`접두사` 뜻풀이를 허용하고 `aws-core-services.s3` 본문에 세 낱말을 도입했다 |
| 1 | `concept-titles-noun-phrase` | 시범 주제의 문장형 제목 넷을 명사구로 바꿨다. `topics-baseline.json` 갱신 |
| 2 | `concept-body-lead-in` | `s3-inventory-report`의 도입 문장을 다시 썼다. **개념 순서는 바꾸지 않았다** |
| 3 | `term-reachability` | ADR-029. 용어 여덟에 풀이·성격 한 줄을 붙이고 `평면 파일`을 없앴다 |
| 4 | `question-prompt-leak` | 프롬프트에 정답이 드러나던 문항 다섯(`q034`~`q038`)을 다시 썼다 |
| 5 | `question-scope-and-wording` | 문항 일곱을 고쳤다(`q039`·`q173`·`q277`·`q279`~`q282`). 관용 표현·용어 불일치 정리 |
| 6 | `content-audit-and-adr-029` | `scripts/content-audit.mjs`와 **ADR-030**(다섯 가지 기준). 콘텐츠는 고치지 않았다 |

**ADR 번호가 명세와 다르다.** step 6의 이름은 `adr-029`인데 실제로 쓴 것은 **ADR-030**이다 —
step 3이 신설되면서 ADR-029를 먼저 써 버렸다. step 이름은 번호를 다시 매기기 전에 붙은 것이다.

각 step이 무엇을 왜 그렇게 판정했는지는 `phases/29-content-quality-pilot/index.json`의
`summary`에 길게 적혀 있다. **다음 phase를 시작하기 전에 step 2·3·5의 `summary`는 읽어라** —
"고치지 않기로 판정한 것"과 그 근거가 거기에만 있다.

### 다음 phase의 입력 — `node scripts/content-audit.mjs`

새로 만든 보고 전용 스크립트다. 주제 id를 인자로 주면 그 주제만 본다.
**언제나 exit 0으로 끝나고 `npm test`·`npm run build`에 엮여 있지 않다** — 고치는 도중에는
미달이 정상이고, 빌드를 막으면 고치는 작업 자체가 진행되지 않는다(ADR-030 「트레이드오프」).

| 지표 | 남은 양 | 비고 |
|---|---|---|
| 남은 주제 | **38개** / 39개 | 시범 주제 하나만 끝났다 |
| ① 문장형 제목 | **183건** (34개 주제) | 세는 규칙은 `name`이 `-다`로 끝나는가 |
| ② 관용 표현 | **164건** — 개념 66개·문항 98개 | `돌리/돌린/돌릴/돌려/돌아가/띄우/태우` 계열 |
| ③ 정답 노출 후보 | **66건** | **위반 건수가 아니다.** 사람이 읽어야 갈린다 |

세 지표가 모두 0인 주제는 셋이다 — `s3-storage-classes`, `s3-encryption-batch`(시범),
`governance-iac`. ① 이 가장 많은 주제는 `efs-fsx` 14, `sqs-sns-eventbridge` 14, `lambda` 10,
`elastic-load-balancing` 9, `iam-permissions` 9다. ② 가 가장 많은 주제는 `ecs-eks-fargate` 22,
`lambda` 17, `emr-glue-athena` 16, `ec2-autoscaling` 14다.

**①의 183과 기획 때의 189은 걸린 항목이 아니라 세는 규칙이 다른 것이다.** 착수 조사가
종결어미 목록을 넓게 잡아 `HTTP API의 JWT 권한 부여자`·`샤드와 체크포인트를 직접 다루는 소비자`
둘을 함께 셌는데, 그 둘은 명사구의 마지막 글자가 `-자`인 것이라 위반이 아니다. `-다`로 재면
착수 시점 187건이고 step 1이 넷을 고쳐 183건이다(git으로 `187 → 183`을 확인했다).
**숫자를 되짚을 때는 `content-audit.mjs`의 규칙이 유일한 기준이다.**

**③이 후보 목록인 이유**를 스크립트 머리주석에 적어 두었다. `q327`은 프롬프트의
"Windows 애플리케이션 서버"가 정답 `FSx for Windows File Server`와 글자로 이어지지만
그 낱말을 빼면 어느 파일 시스템을 고를지 정할 근거가 사라진다 — **문항이 성립하지 않는다.**
`AWS`·`DB`·`IP`처럼 상식으로 통하는 토큰도 걸린다. 판정 기준은
**"그 낱말이 프롬프트에 없으면 문제가 성립하지 않는가"**이고 사람이 읽어야 갈린다.

### 다음 phase의 입력 하나 더 — 용어 불일치

**같은 동작이 저장소 안에서 두 이름으로 불리는 자리가 있다.** 이 phase가 발견한 것은
**키 교체**다. `자동 교체`와 `자동 순환`이 섞여 쓰이고 우세는 `자동 교체` 쪽이다
(출처 34:8, `topics.json` 20:6, `questions.json` 36:6 — 착수 시점 실측).

시범 주제는 커밋 `5ef218b`와 step 5가 `자동 교체`로 통일했고, **아직 남아 있는 자리는 다섯이다.**

- 개념 2개 — `secrets-encryption.secrets-manager-vs-parameter-store`,
  `secrets-encryption.rotation-heuristic`
- 문항 3개 — `q141`, `q142`, `q230`

**이것은 사용자가 지적한 일곱 항목에 없던 결함이다.** 「전체적으로 어색하고 애매하다」의 한
종류이므로 다음 phase가 전수로 훑을 때 같은 눈으로 찾아야 한다.
**키 교체 말고 다른 용어에도 같은 일이 있는지는 아직 조사하지 않았다.** `content-audit.mjs`는
이 결함을 세지 못한다 — 무엇이 같은 동작인지는 사람이 판정해야 한다.

### 다음 phase에 남은 판단

**기계로 검출되지 않는 결함 넷을 어떤 순서로 훑을 것인가.** ①기초 용어 미정의 ②도입 문장
③요구 겹치기 ⑦문항 목적이고, `content-audit.mjs`는 하나도 세지 못한다. 사용자가 정해야 할
것은 순서다.

- **주제 39개를 `topics.json` 배열 순서대로** 갈 것인가 — 학습 순서와 같아서 "앞에서부터
  읽어 지도를 얻는다"는 ADR-023의 전제를 그대로 따라간다. 대신 초반 주제가 이미 깨끗해서
  (`s3-storage-classes`·`s3-encryption-batch`) 첫 step들의 수확이 적다.
- **문항이 많은 주제부터** 갈 것인가 — `sqs-sns-eventbridge` 40, `efs-fsx` 32,
  `rds-storage-features` 28이다. ③⑦은 문항 결함이라 여기에 몰려 있다.
- **`content-audit.mjs`의 ①② 가 많은 주제부터** 갈 것인가 — `ecs-eks-fargate`·`lambda`·
  `efs-fsx`가 위로 온다. 기계 지표와 사람 지표가 같은 주제에 몰려 있다는 보장은 없다.

**나는 배열 순서를 추천한다.** 이 phase가 겪은 실패가 "주제 페이지 단위로 읽지 않아서"
생겼고(아래), 배열 순서로 가면 검수도 학습 순서대로 할 수 있어 사용자가 읽던 흐름과 같다.

그리고 **step을 얼마나 크게 잡을 것인가**도 정해야 한다. phase 29는 시범 주제 하나에 7 step을
썼고 실행 시간이 약 2.5시간이다(개념 13개·문항 16개). 38개 주제를 같은 밀도로 하면 규모가
맞지 않으므로, 결함 종류별로 가르지 말고 **주제 하나를 한 step에서 통째로** 보는 편이 낫다 —
①②③⑤⑥⑦이 같은 문단·같은 문항에서 얽혀 있어 종류별로 나누면 같은 자리를 여러 번 연다.

### 가장 중요한 교훈 — 검수를 grep이나 테스트로 갈음하지 마라

step 0이 `버킷`·`객체`·`접두사`를 첫 주제 `aws-core-services.s3`에만 넣고 "고쳤다"고
보고했는데, **사용자가 실제 화면을 열어 `s3-encryption-batch` 주제를 읽자 똑같은 자리에서
다시 막혔다.** 이 앱의 읽는 단위는 개념이 아니라 **주제 페이지**다. 다른 주제에 정의가 있다는
것은 지금 이 화면을 읽는 사람에게 도움이 되지 않는다. 그 판정이 ADR-029가 됐다.

`CloudTrail`이 같은 모양의 증거다 — `organizations-cloudtrail-config`에서만 정의되는데,
시범 주제를 고친 뒤에도 **다른 7개 주제의 개념 7곳**에서 소개 없이 쓰인다.

**그러므로 주제 페이지를 처음 읽는 사람의 눈으로 통독하고 소개 없이 등장하는 낱말을 직접
세어야 한다.** 사용자는 `npm run dev`로 30초 만에 네 자리를 더 찾아냈다.

### 이 phase가 고치지 않고 남긴 것 — 다음 phase가 판단할 후보

step들이 범위 밖이라 남긴 것들이다. 각각의 판정 근거는 `index.json`의 `summary`에 있다.

1. **시범 주제 안에 `버킷`·`객체` 풀이가 없다.** ADR-028의 3종 중 둘이고 ADR-029의 규칙대로면
   여기에도 서야 하지만, step 3의 대상 표가 `접두사` 하나만 들고 있어 범위 밖이었다.
   `버킷` 17회(첫 자리 `sse-types`), `객체` 29회(첫 자리 `client-side-encryption`)다.
2. **`q277`·`q281` 해설의 `서버리스`가 풀이 없이 쓰인다.** 개념 본문에는 step 3이 풀이를
   넣었지만 **해설은 단독으로 읽히므로**(ADR-015의 논리) 같은 결함이 남는다.
3. **`q036`과 `q173`이 정답(`SSE-KMS`)과 요구(자동 교체)를 공유한다.** `q173`의 주 축은
   봉투 암호화이고 프롬프트가 `data.test.ts`에 문자열로 고정돼 있어 손대지 않았다.
4. **`vpc-networking.vpc-endpoint`와 `endpoint-pricing`의 어긋남** — 아래 후보 E.
   **ADR-031이 판정해 끝났다(2026-09-09).**

**판정하고 그대로 두기로 한 것 둘**은 후보가 아니다. 되짚을 때 다시 열지 마라.

- `q278`·`s3-object-lambda`의 `돌려준다` — **반환**이지 실행의 비유가 아니다.
  step 2가 개념 쪽에서, step 5가 문항 쪽에서 같은 판정을 내렸다.
  `content-audit.mjs`가 이 뜻을 세지 않는 근거가 여기다.
- 시범 주제의 개념 순서 — step 2가 ②의 원인을 「도입 문장」으로 판정하고 순서를 바꾸지
  않았다. 갈래 우선으로 다시 묶으면 ADR-023의 층 순서와 `data.test.ts`의 단언이 함께 깨진다.

### 사용자 검수 요청 — 이것이 시범 주제 방식을 고른 이유다

**검수 대상**: `npm run dev` → `#/topic/s3-encryption-batch` (개념 읽기)와
`#/topic/s3-encryption-batch/quiz` (확인 문제 16문항).
**판정 기준**: "초보자가 개념을 익힌다는 느낌이 드는가."
이 기준은 테스트로 잴 수 없고 **사용자만 판정할 수 있다.**

사용자가 낸 지적 일곱이 각각 어떻게 고쳐졌는지의 대조표다. 원문은 아래
「사용자 피드백 원문」에 그대로 남겨 두었다.

| # | 지적 | 어디를 보면 되는가 | 무엇을 했나 |
|---|---|---|---|
| ① | `버킷`·`객체`·`접두사`가 무슨 말인지 모르겠다 | 첫 주제 `#/topic/aws-core-services`의 `Amazon S3` 개념 / 이 주제의 `배치 복사와 복제의 갈림길` 개념 | ADR-028로 뜻풀이를 허용하고 `aws-core-services.s3`에 세 낱말을 도입했다(step 0). ADR-029로 **주제마다 되풀이**하게 바꾸고 `접두사` 풀이를 이 주제에도 넣었다(step 3). **`버킷`·`객체`는 이 주제에 아직 없다** — 위 「남긴 것」 1번 |
| ② | `버킷의 객체 목록을 파일로 받아 둔다`가 갑자기 나와 당황스럽다 | `S3 인벤토리` 개념의 첫 문단 | 도입 문장을 「무엇인지 → S3 Batch Operations와 이어지는 자리 → 왜 필요한지」 순으로 다시 썼다. `SSE-KMS` 개념에 빠져 있던 주어도 세웠다. **개념 순서는 바꾸지 않았다**(근거는 위 「그대로 두기로 한 것」) |
| ③ | 한 문제가 두 요구를 만족하게 묻는다 | 확인 문제의 `q282`·`q279` | `q282`를 개념 하나만 묻게 다시 썼다. `q279`는 재보고 **결함이 아니라고 판정**했다 — 두 요구가 각각 단독으로도 같은 보기를 남겨서 지식 둘을 곱해야 풀리는 구조가 아니다. 스스로를 "두 요구"라 부르던 라벨만 뺐다 |
| ④ | `AWS KMS가 …하는 방식은?` → 답이 문제만 봐도 보인다 | 확인 문제의 `q034`~`q038` | 프롬프트에서 이름 조각을 전부 빼고 **요구로 갈랐다.** `q036`은 「키를 주기적으로 바꾸는데 그 교체를 사람이 챙기지 않는다」가 됐다 |
| ⑤ | 개념 제목이 문장이면 안 된다 | 개념 목록 전체(13개) | 문장형 넷을 명사구로 바꿨다 — 「S3 인벤토리」·「S3 Batch Operations의 Lambda 호출」·「SSE-C의 자동 교체와 감사 추적 한계」·「버킷 정책의 전송 구간 암호화 강제」. **사용자가 지정한 방법**(주어를 제목으로, 주장은 설명으로) 그대로다 |
| ⑥ | `돌릴 인스턴스`가 감이 오지 않는다 | 개념 본문 전체와 확인 문제 전체 | 개념(step 2)과 문항(step 5)에서 `돌리다` 계열을 없앴다 — 「그 스크립트를 실행할 서버를 따로 두어야 하므로」처럼 **하는 일을 그대로** 쓴다. 아울러 같은 동작을 두 이름으로 부르던 것을 통일했다(`자동 순환`→`자동 교체`, `평면 파일`→`인벤토리 보고서`) |
| ⑦ | `q282`는 문제의 목적이 뭔지 모르겠다 | 확인 문제의 `q282` | 묻는 것을 **SSE-C를 골랐을 때 키 관리를 어디까지 맡길 수 있는가** 하나로 좁혔다. 보기 넷이 모두 그 축 위에 있어 소거로 풀리지 않는다 |

**검수 결과에 따라 다음 phase가 갈린다.** 통과하면 위 「다음 phase에 남은 판단」의 순서를
정해 38개 주제로 넓힌다. 막히는 자리가 또 나오면 그 자리가 기준에 무엇이 빠졌는지를
알려주므로, ADR-030에 기준을 더하는 것이 먼저다.

---

## 사용자 피드백 원문 (2026-09-08) — 고치지 말고 그대로 둔다

사용자가 `S3 암호화(SSE)·Batch Operations·인벤토리` 주제를 읽다가 멈추고 낸 지적이다.
**특정 주제의 문제가 아니다.** 사용자의 마무리 문장을 그대로 옮긴다.

> 특정 부분을 예시로 들었지만 **전체적으로 어색하고 애매하며 초보자가 개념을 익힌다는
> 느낌이 들지 않아서** 확인해봐야 할 거 같아. 어떤 방향성이 잘못되었는지 모르겠다면
> 나에게 질문해줘. **기획부터 해보자.**

**① 기초 용어가 정의되지 않은 채 쓰인다.**

> `특정 접두사에 이미 쌓여 있는 객체` 무슨 말인지 모르겠음. S3에서 접두사가 무슨 역할이며
> 의미인지, 접두사에 쌓여 있다는 게 무슨 말이며 그런 게 무슨 의미를 가지는지 모르겠음.
> `버킷` 무슨 말인지 모르겠음. `객체` 무엇을 말하는지 모르겠음.

**② 개념이 왜 거기 있는지 없이 튀어나온다.**

> `버킷의 객체 목록을 파일로 받아 둔다` 갑자기 이게 개념 주제에 나와서 당황스러움.

**③ 한 문항이 두 요구를 겹친다.**

> 문제에서 두 요구를 만족하는 질문은 적절하지 않음. **한 문제당 하나의 개념을 학습할 수
> 있게 해야 함.**

**④ 프롬프트에 답이 드러난다.** 대상은 `q036` "AWS KMS가 암호화 키를 생성하고 관리하는
방식은?" → 정답 `SSE-KMS`.

> 답이 문제만 봐도 뭔지 알 수 있잖아.

**⑤ 개념 제목이 문장이다.**

> 개념에서 `배치 작업이 객체마다 Lambda를 부른다`처럼 문장이 제목이 되면 안 될 거 같아.
> 문장의 특정 제목의 개념의 설명으로 들어가야 맞는 거 같아.
>
> `전송 중 암호화는 버킷 정책 조건으로 강제한다` 부분의 경우 **`버킷 정책`이 제목으로 가고
> `aws:SecureTransport`이 설명 중 하나로** 되어야 하는 게 맞는 거 같아.

**⑥ 뜻이 통하지 않는 표현.** 대상은 `q281`의 "**돌릴 인스턴스**를 두지 않고".

> 돌린다는 게 `회전축을 기준으로 어떤 걸 돌리는 형태인건가?`라는 생각이 들 만큼 감이 오지
> 않는 표현이야.

**⑦ 문항의 목적이 불분명하다.** 대상은 `q282`(당시 프롬프트) "봉투 암호화와 암호화 키의
주기적 자동 교체, 그리고 키 사용 감사 추적이 한꺼번에 요구된다. 고객이 키를 직접 들고 오는
SSE-C가 후보에서 빠지는 까닭은?"

> **문제 자체가 이상해. 이 문제의 목적이 뭔지를 모르겠어.**

## 지금 상태

| | |
|---|---|
| `fix-vpc-endpoint-fact` | 후보 E 판정(ADR-031) + phase 31 명세. `develop`에서 팠고 **병합·push는 아직이다** |
| `develop` | phase 28·29·30 전부. `feat-30-prompt-korean-polish`와 같고 origin과도 같다 |
| `main` | `7339754` — release(phase 28~30). origin과 같다 |
| 배포 주소 | https://working-zima.github.io/aws-saa-c03-quiz/ |
| 문항 | 732개 (q001~q732) — phase 30은 문항을 더하거나 빼지 않고 프롬프트 718개를 다시 썼다 |
| 개념 | 618개 / 주제 39개 — phase 30은 `topics.json`을 건드리지 않았다 |
| 개념 커버리지 | 618/618 (100%) — `data.test.ts`의 불변식으로 고정돼 있다 |
| 해설 길이 | 전 구간 187자 이상 — `data.test.ts`의 불변식이다 |
| 테스트 | **471개 통과.** `check-structure`·`coverage`·`check-verbatim`·`lint`·`build` 모두 통과 |

`phases/index.json`의 phase는 0~30이 전부 `completed`이고, phase 28~30은 `develop`을
거쳐 `main`까지 나갔다(`7339754`). **위 인수인계 본문 곳곳에 "phase 29·30은 push되지
않았다"고 적혀 있는데 그것은 병합 전에 쓰인 문장이다** — 이 표가 최신이다.
지금 병합·push를 기다리는 것은 `fix-vpc-endpoint-fact` 하나다(사람이 판단한다).

## phase 31 — 명세를 짜 두었다. 아직 돌리지 않았다

`phases/31-content-quality-rollout/` 에 **step 0~36**이 있다. phase 29가 시범 주제 하나에서
세운 기준을 나머지 38개 주제로 넓힌다. `phases/index.json`에 `pending`으로 등록돼 있다.

### 사용자가 답한 결정 — 다시 묻지 마라

2026-09-09에 넷을 정했다.

1. **훑는 순서** — `topics.json` **배열 순서**다. 학습 순서와 같아서 검수도 사용자가 읽던
   흐름 그대로 할 수 있다. (문항이 많은 주제부터·audit 지표가 많은 주제부터는 탈락)
2. **step 크기** — **주제 하나가 step 하나**다. 결함 종류별로 가르지 않는다.
   `sqs-sns-eventbridge`(개념 33·문항 40)만 둘로 쪼갰고, 작은 주제 둘·셋은 묶었다.
3. **검수 리듬** — **처음 3 step 뒤에 끊는다.** `--max-steps 3`으로 돌리고 멈춰서, 사용자가
   `npm run dev`로 그 세 주제를 읽고 합격선을 확정한 뒤 나머지를 이어 돌린다.
   기준이 틀렸다면 3 step치만 되돌리면 된다.
4. **해설 범위** — **개념 본문과 어긋나는 자리만** 고친다. 전면 재작성이 아니다.
   phase 28이 732개를 이미 다시 썼고 187자 하한이 `data.test.ts`의 불변식이다.

### 돌리는 법

```bash
# 이 브랜치를 develop에 병합한 뒤 develop에서 실행한다
pgrep -f execute.py            # 이미 돌고 있는 것이 없는지 먼저 확인
python3 scripts/execute.py 31-content-quality-rollout --max-steps 3
# 멈추면 사용자 검수 → 통과하면 나머지를 이어 돌린다
```

**규모**: 37 step. phase 30이 29 step에 약 5시간이었고 이건 개념 본문까지 보므로 더 무겁다 —
**7~10시간**으로 본다. 사용량 한도에 걸릴 것을 전제해라(아래 「이어받을 때 주의할 것」).

### step 배치

주제 39개 중 `s3-encryption-batch`(phase 29의 시범)만 빠진다. `s3-storage-classes`와
`governance-iac`은 기계 지표가 0이지만 **넣었다** — 기계가 못 보는 다섯(기초 용어·도입
문장·요구 겹치기·문항 목적·용어 불일치)이 남아 있을 수 있고, 그게 phase 29가 배운 것이다.

| step | 맡은 주제 |
|---|---|
| 0~5 | `aws-core-services` `s3-storage-classes` `s3-versioning-lifecycle` `s3-access-control` `ebs-instance-store` `efs-fsx` |
| 6~11 | `data-transfer-services` `storage-gateway-migration` `rds-storage-features` `aurora` `dynamodb` `elasticache-purpose-built-db` |
| 12~17 | `ec2-autoscaling` `elastic-load-balancing` `cloudfront-global-accelerator` `lambda` `ecs-eks-fargate` `api-gateway-step-functions` |
| 18~19 | `sqs-sns-eventbridge` — A는 개념 33 + 문항 앞 20, B는 문항 뒤 20 |
| 20~26 | `backup-disaster-recovery` `vpc-networking` `security-groups-nacl` `hybrid-connectivity` `route53` `emr-glue-athena` `kinesis-streaming` |
| 27 | `redshift-opensearch-quicksight` + `cloudwatch-xray` |
| 28~34 | `secrets-encryption` `waf-shield` `guardduty-macie-inspector` `iam-permissions` `identity-federation` `organizations-cloudtrail-config` `cost-management` |
| 35 | `governance-iac` + `systems-manager` + `ai-ml-services` |
| 36 | 마무리 — 명사구 단언을 전 주제로, audit 전체 재측정, ADR·이 파일 갱신 |

### 각 step이 하는 일

콘텐츠를 고치는 것보다 **판정하고 그대로 두는 것**이 중요하고, 그 근거를 `summary`에 남기는
것이 step의 산출물이다. 기계 지표 여섯은 `content-audit.mjs`가 세고 ③⑤⑥은 후보 목록이라
사람이 갈라야 한다. 기계가 못 보는 다섯은 **주제 페이지를 처음 읽는 학습자의 눈으로 통독**하는
것 외에 찾는 방법이 없다 — step 파일이 "지표를 먼저 보면 지표가 있는 자리만 보게 되니
통독을 먼저 하라"고 못 박고 있다.

## 다른 기기에서 시작하는 법

```bash
git clone https://github.com/working-zima/aws-saa-c03-quiz.git
cd aws-saa-c03-quiz && git checkout develop
npm install          # Node 18.17.1. 상위 메이저를 요구하는 패키지는 쓰지 않는다(CLAUDE.md)
npm test             # develop은 454개, feat-29 브랜치는 468개 통과해야 정상
node scripts/coverage.mjs        # 618/618, exit 0
node scripts/content-audit.mjs   # feat-29 브랜치에만 있다. 보고 전용이라 항상 exit 0
```

## 옮겨가지 않는 파일 — gitignore로 로컬에만 두는 것들

아래는 저장소에 없다. 새 기기에는 **없는 것이 정상**이고, 없어도 앱과 테스트는 전부 돌아간다.
다만 개념 본문의 근거를 원본까지 거슬러 확인하는 일은 못 한다.

| 파일 | 없으면 못 하는 일 |
|---|---|
| `docs/source/concepts-raw.md` | `scripts/check-verbatim.mjs`가 검사를 건너뛴다(없으면 실패가 아니라 exit 0). 개념 본문의 전사 여부를 새로 검증할 수 없다 — 근거는 ADR-009. **해설을 고치는 작업에는 이 파일이 필요 없다** — ADR-027이 해설의 근거를 개념 본문·오답이 가리키는 이웃 개념 본문·`exam-gaps.md` 항목 셋으로 지정했고, phase 28이 246개를 그 근거만으로 다시 썼다. 전사 검사는 원래부터 `explanation`을 보지 않는다(ADR-025) |
| `docs/source/pdf/*.pdf` (3개, 약 21MB) | 덤프 원문을 다시 추출할 수 없다. `scripts/extract-dump.py`·`extract-pdf.py`가 쓰는 입력이다 |
| `docs/source/dump-slices/`, `docs/source/concept-index.md` | 위 PDF에서 스크립트로 재생성되는 파생물이라, PDF가 있으면 다시 만들면 된다 |

**문항을 쓰거나 고치는 작업의 근거는 `docs/source/dump-gaps/`(23개 파일)와
`docs/source/exam-gaps.md`이고, 이 둘은 커밋돼 있다.** 즉 아래 후보 D·E는 새 기기에서
그대로 진행할 수 있다. **위 「38개 주제로 넓히는 작업」도 그렇다** — 문항과 개념의 문구를
고치는 일이라 `concepts-raw.md`가 필요하지 않다(ADR-027과 같은 논리다).

## 그 밖의 phase 후보 — 위 검수와 확대가 끝난 뒤에 본다

소요 시간은 `phases/*/index.json`의 `started_at`·`completed_at`으로 실측한 값이다.
과거 실적: UI 변경 phase는 1~5 step에 2~20분(22-concept-search만 3 step에 62분),
콘텐츠 대량 phase는 19~22 step에 222~333분. phase 27의 문항 작성 step은 24문항당 평균 12분.
phase 28(해설 재작성)은 14 step에 약 2.6시간이고, 그중 해설을 실제로 쓴 step 1~12가 135분에
246문항이었다 — **한 step이 평균 11분에 20문항**이다.
**phase 29(콘텐츠 품질 시범)는 7 step에 약 2.5시간이고 대상이 주제 하나(개념 13·문항 16)였다** —
결함 종류별로 step을 가른 결과이므로, 주제 단위로 묶으면 주제당 이보다 빠를 것으로 본다.

**후보 A(기존 해설 246개 보강)는 phase 28이 끝냈다.** `q001`~`q246`의 해설 평균이
126자에서 434자가 됐고, 187자 하한이 732문항 전체에 걸린 `data.test.ts`의 불변식이다.
근거와 실측은 ADR-027의 「결과 — 실측으로 확인한 것」에 있다.

### B. 복습 화면 길이 대응 — 2~3 step, 20~40분

`ReviewPage`는 틀린 문항을 주제로 묶어 **한 화면에 전부** 나열한다. 문제 은행이 246→732로
커졌으므로 오답이 쌓이면 벽이 된다. ADR-026이 트레이드오프로 열어둔 문제이기도 하다.

**선행 조건: 픽셀 실측.** ARCHITECTURE 「화면 전환 시 스크롤」은 "다시 재기 전에는 새 숫자를
넣지 마라"고 못 박고 있다. 마지막 실측은 오답 246개 기준 36891px(390×844)이다.
재려면 정확히 390×844 iframe에서 `scrollHeight - innerHeight`를 읽어야 하고, 그러려면
브라우저가 필요하다 — 2026-09-08 기준 Claude in Chrome 확장이 연결돼 있지 않아 못 쟀다.

### C. 주제 확인 문제의 세션 크기 — 3~4 step, 30~60분

주제당 문항이 최소 7개, 중앙값 18개, 최대 40개(`sqs-sns-eventbridge`)다. 끊어 풀고
이어 가는 장치가 없어서, PRD의 학습자상("짧게 여러 번 들여다보며 개념을 눌러 담는 사람")과
어긋난다. 진행 상태 저장(localStorage)을 건드리므로 순수 UI 변경보다 크다.

### D. phase 27 문항 486개 품질 표본 검수 — 15~20 step, 3~4시간

하룻밤에 자동 생성된 문항이라 사실 오류나 변별력 없는 오답이 섞였을 수 있다. 다만 step별
검증(정답 위치 분포, 커버리지, 약어 규칙, 중복 prompt 0건)은 이미 통과한 상태다.
**위 「38개 주제로 넓히는 작업」과 대상이 겹친다** — `q247`~`q732`가 그 486개다. 둘을 따로
돌리지 말고 주제를 훑을 때 함께 보는 편이 싸다.

### E. VPC Endpoint 두 본문의 어긋남 판정 — **끝났다 (2026-09-09)**

**후보 E의 나머지(오타 셋·`name` 둘·`retrieval-time`)는 커밋 `5945daa`가 끝냈다.**
`retrieval-time`은 수를 7에서 8로 바꾸지 않았다 — `s3-express-one-zone` 본문이 "이 클래스는
그 축 바깥에 있다"고 하므로 일곱이 맞고, 어느 일곱인지를 밝히는 쪽으로 고쳤다. 그 판단의
근거는 그 커밋 메시지에 있다.

남아 있던 하나도 브랜치 `fix-vpc-endpoint-fact`가 끝냈다. 판정은 **ADR-031**이다.

원문을 대조할 수 있었다 — `concepts-raw.md` p33이 "인터페이스 VPC 엔드포인트는 인터넷을
거치지 않고 S3, DynamoDB 를 제외한 모든 AWS 리소스에 접근할 수 있게 해준다"고 적고 있고,
**이 문장의 "S3 제외"가 틀렸다.** S3에는 인터페이스 엔드포인트가 있으므로 덤프 인용
[네트워크1 #98 p203]을 담은 `endpoint-pricing` 쪽이 맞다.

**DynamoDB의 "제외"는 그대로 두었다.** 덤프 인용이 반박하는 것은 S3 하나뿐이고, DynamoDB에
인터페이스 엔드포인트가 있다고 말하는 출처는 없다. 반박의 사거리를 넘겨 고치면 틀린 문장을
지우는 대신 근거 없는 문장을 넣게 된다 — 그 규칙이 ADR-031의 본체다. 덕분에 `q104`
("S3와 DynamoDB 둘 다" → 게이트웨이)의 변별점이 살아서 **세 문항 모두 `prompt`·`choices`를
손대지 않고 해설만 고쳤다.**

**어긋남은 개념 본문 둘이 아니라 해설 셋까지였다.** `q104` 해설은 "인터페이스는 S3와
DynamoDB를 제외한 AWS 리소스에 연결하는 유형"이라 하고 `q209` 해설은 "인터페이스도 S3에
연결할 수는 있으나"라고 해서, 같은 문제 은행이 서로 반대되는 사실을 가르치고 있었다.
phase 28이 판정을 미루며 해설을 각 개념 본문에 맞춰 둔 결과다. 고친 자리는
`topics.json` 2개념·`questions.json` 3해설·`exam-gaps.md`(「원본 수정 이력」 4번)다.

## 이어받을 때 주의할 것

- **worktree를 새로 파면 `docs/source/concepts-raw.md`를 손으로 복사해 넣어라.** 이 파일은
  gitignore라 `git worktree add`가 옮기지 않는다. 없으면 `check-verbatim.mjs`가 **검사를
  건너뛰고 exit 0으로 끝난다** — 통과한 것처럼 보이지만 전사 검사가 돌지 않은 것이다(ADR-009).
  2026-09-09 phase 31의 첫 3 step이 이 상태로 돌았다. 원본을 넣고 다시 검사해 이상 없음을
  확인했지만, **다음 worktree에서는 harness를 돌리기 전에 복사해라.**
- **`concepts-raw.md`를 `grep`으로 뒤질 때는 `-a`를 붙여라.** macOS의 BSD grep이 이 파일을
  binary로 판정해서, `-a` 없이 부르면 **일치가 있어도 아무것도 출력하지 않고 exit 1로 끝난다**
  (`file`도 `data`라고 답한다). 후보 E가 "원문이 이 기기에 없어 대조할 수 없다"로 넘어갔던
  것이 실은 이 조용한 실패였다 — 파일은 있었다. 근거는 ADR-031 말미.
- **`python3`는 이 환경에 없다 — `py` 또는 `python`이 Python 3.13이다.** harness는
  `python scripts/execute.py <phase> --max-steps N`으로 돌린다.
- **harness를 돌리기 전에 이미 돌고 있는 것이 없는지 확인한다: `pgrep -f execute.py`.**
  `pgrep`은 Git Bash에 있고 PowerShell에는 없다 — PowerShell에서는
  `Get-CimInstance Win32_Process | Where-Object CommandLine -match 'execute\.py'`를 쓴다.
  **어느 쪽이든 `python3`가 아니라 `python`으로 뜬 프로세스를 찾아야 한다.**
  2026-09-07 밤에 같은 worktree에서 실행 두 개가 겹쳐 두 에이전트가 같은 문항 id 범위를
  써서 중복 24문항이 커밋됐다. 복구는 됐지만 시간을 버렸다. worktree를 나누는 규칙은
  CLAUDE.md 「에이전트를 여러 개 동시에 돌릴 때」에 있다.
- **긴 phase는 사용량 한도에 걸린다.** phase 27은 실행 시간 249분에 실제 경과 7시간이었고,
  차이는 전부 한도로 멈춰 있던 시간이다. 멈추면 `phases/{phase}/index.json`에서 해당 step을
  `pending`으로 되돌리고 `error_message`를 지운 뒤 다시 실행하면 그 step부터 이어진다.
  **단, 그 step이 데이터를 이미 커밋한 뒤에 죽었다면 되돌리는 것만으로는 부족하다** —
  executor가 깨진 상태를 커밋해 두었을 수 있다. `npm test`와
  `node scripts/check-structure.mjs`를 먼저 돌려 확인해라. phase 30 step 18이 그랬고,
  대응은 위 「step 18에서 겪은 것」에 적어 두었다.
- **ADR 번호는 다음 빈 자리를 쓴다.** phase 29에서 step을 다시 번호 매기면서 step 명세가
  적어 둔 ADR 번호(`adr-029`)와 실제 번호(ADR-030)가 갈렸다. step 명세의 번호를 믿지 말고
  `grep '^### ADR-0' docs/ADR.md`로 확인해라.
- 이 기기에는 phase 27 worktree(`../aws-saa-c03-quiz-p27`)와 `feat-25`·`feat-26`·`feat-27`
  브랜치가 남아 있다. 전부 `develop`에 병합된 것이라 지워도 잃는 것은 없다.
