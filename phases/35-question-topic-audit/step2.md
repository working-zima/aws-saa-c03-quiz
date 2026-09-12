# Step 2: sample-verdicts

**표본 40문항을 ADR-034 기준으로 판정한다.** 전체 732문항으로 넓히기 전에, 기준이 실제 데이터에서
일관되게 적용되는지 사람이 확인하는 단계다. 이 step이 끝나면 실행이 멈추고 사용자가 판정을 검토한다.

**이 step에서 만드는 파일은 `phases/35-question-topic-audit/audit/verdicts.jsonl` 하나다.**
데이터·테스트·제품 코드는 한 글자도 바꾸지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-034** — 판정 기준과 순서. 이 step의 모든 판단은 여기서 나온다.
- `docs/ADR.md`의 ADR-026(개념당 최소 1문항)·ADR-016(개념 펼치기는 `question.topicId`를 따른다)
- `phases/35-question-topic-audit/audit/worksheet.jsonl` — step 1이 만든 워크시트. 문항 전문과
  `questionsInConcept`·`signals.foreignTopics`가 여기 있다
- `phases/35-question-topic-audit/tools/validate-verdicts.mjs` — 검사 규칙(스키마와 계산식)
- `src/data/topics.json` — 권장 개념을 고를 때 대상 주제의 개념 목록을 본다

## 판정 절차 — 문항마다 이 순서로

ADR-034의 순서를 그대로 따른다. 앞 칸을 채우지 못하면 뒤 칸을 쓰지 마라.

1. **`decidingKnowledge`** — 정답을 오답과 가르는 지식을 한 문장으로 쓴다. "이것을 모르면 정답을
   고를 수 없다"가 되어야 한다. 서비스 이름만 적지 마라.
2. **교체 가능성** — 시나리오 서비스를 같은 계열의 다른 서비스로 바꿔도 정답 논리가 그대로인가?
   그대로면 그 서비스는 주인공이 아니다.
3. **오답 분석** — 오답 셋이 무엇을 오해한 것인지 본다. 오답이 A의 기능을 오해한 것이면 결정 지식은
   A 쪽이다. **2번만으로 결론내지 마라.** 해설이 실제로 무엇을 정답 근거로 쓰는지 함께 본다.
4. **`recommendedConceptId`** — 결정 지식을 가장 잘 설명하는 개념을 `topics.json`에서 찾아 지목한다.
   그 개념이 속한 주제가 `recommendedTopic`이다. 적절한 개념이 대상 주제에 없으면 `null`로 두고
   `rationale`에 "대상 주제에 맞는 개념이 없다"고 적는다.
5. **`conceptFit`** — 지금 연결된 `conceptId`가 **정답을 가르는 중심 지식 자체를 직접 설명하는가.**
   - `yes` — 관련 내용을 포함하는 수준이 아니라, 이 문항에서 정답을 오답과 구분하게 만드는 **중심
     지식 자체**를 그 개념이 직접 설명한다.
   - `partial` — 그 개념도 문제 해결에 관련되지만, 정답을 결정하는 핵심 지식은 **다른 개념이 더
     직접적이고 중심적으로** 설명한다.
   - `no` — 그 개념은 주로 시나리오의 배경이나 주변 지식을 설명하고, 정답을 결정하는 핵심 지식은
     다른 개념에 있다.

   **"현재 개념에서도 관련 내용을 찾을 수 있다"는 이유만으로 `yes`를 주지 마라.** 마지막에 반드시
   이렇게 물어라 — **"이 문항을 이 개념의 확인 문제라고 부르는 것이 가장 자연스러운가?"**
6. **`verdict`** — `keep` · `ambiguous` · `move-recommended`. 1~5가 한 곳을 가리키지 않으면
   **주저 없이 `ambiguous`로 남긴다.** 억지로 한쪽을 고르는 것이 이 audit의 가장 큰 실패다.
   `move-recommended`일 때만 `confidence`를 쓴다 — `high`(다른 주제가 명확히 더 적절) ·
   `medium`(더 자연스럽지만 해석 여지가 있음) · `low`(경계 사례).
7. **`rationale`** — 왜 그렇게 판정했는지 한두 문장. `ambiguous`는 **두 해석을 모두** 적는다.

`coverageConflict`와 `retarget`은 **계산해서 채운다**(사람 판단 아님). 규칙은
`tools/validate-verdicts.mjs`에 적힌 그대로다. 이동이 맞다는 판정을 커버리지 때문에 뒤집지 마라 —
제약은 다음 phase가 푼다(ADR-034).

## 표본 40문항

아래 40개만 판정한다. `id` 순서대로 `audit/verdicts.jsonl`에 한 줄씩 쓴다.

| id | 현재 topic | 현재 concept | 유일 문항 | 다른 주제 서비스 신호 |
|---|---|---|---|---|
| q001 | aws-core-services | `ec2` | Y | - |
| q035 | s3-encryption-batch | `sse-types` | N | secrets-encryption |
| q044 | ebs-instance-store | `instance-store` | Y | efs-fsx |
| q054 | storage-gateway-migration | `storage-gateway` | N | ebs-instance-store, efs-fsx |
| q068 | aurora | `aurora` | N | dynamodb, elasticache-purpose-built-db |
| q079 | elastic-load-balancing | `elb` | N | cloudfront-global-accelerator, api-gateway-step-functions |
| q087 | lambda | `lambda` | N | api-gateway-step-functions |
| q108 | vpc-networking | `comparison` | Y | - |
| q114 | hybrid-connectivity | `vpn-vs-direct-connect` | N | - |
| q125 | emr-glue-athena | `athena` | Y | redshift-opensearch-quicksight |
| q128 | kinesis-streaming | `streaming-services-comparison` | Y | emr-glue-athena |
| q129 | security-groups-nacl | `security-group` | N | s3-access-control |
| q154 | waf-shield | `cloudfront` | N | - |
| q170 | aws-core-services | `exam-heuristics` | Y | efs-fsx, aurora |
| q174 | s3-encryption-batch | `sse-kms-cost` | Y | secrets-encryption |
| q177 | efs-fsx | `efs-lifecycle-management` | Y | ebs-instance-store |
| q188 | ec2-autoscaling | `warm-pool` | Y | ebs-instance-store |
| q202 | kinesis-streaming | `msk` | Y | sqs-sns-eventbridge |
| q206 | api-gateway-step-functions | `step-functions-features` | Y | ecs-eks-fargate, sqs-sns-eventbridge |
| q209 | vpc-networking | `endpoint-pricing` | Y | - |
| q211 | vpc-networking | `nat-instance` | Y | - |
| q223 | cloudwatch-xray | `log-analysis-options` | Y | emr-glue-athena |
| q226 | security-groups-nacl | `web-acl-vs-nacl` | Y | waf-shield |
| q231 | waf-shield | `waf-attach-targets` | Y | security-groups-nacl |
| q248 | s3-access-control | `s3-presigned-url` | Y | iam-permissions |
| q249 | s3-access-control | `s3-access-grants` | Y | iam-permissions |
| q256 | s3-access-control | `s3-account-level-public-access-block` | Y | organizations-cloudtrail-config |
| q272 | s3-versioning-lifecycle | `s3-same-region-replication` | Y | iam-permissions |
| q284 | ebs-instance-store | `elastic-fabric-adapter` | Y | - |
| q323 | s3-storage-classes | `lifecycle-vs-intelligent-tiering` | Y | - |
| q327 | efs-fsx | `fsx-windows-file-server` | Y | - |
| q355 | data-transfer-services | `file-gateway-vs-datasync-continuous` | N | - |
| q364 | data-transfer-services | `datasync-task-status-event` | Y | sqs-sns-eventbridge, cloudwatch-xray |
| q366 | data-transfer-services | `transfer-family-structured-logging` | Y | - |
| q377 | rds-storage-features | `rds-iam-database-authentication` | Y | iam-permissions, secrets-encryption |
| q467 | cloudfront-global-accelerator | `cloudfront-alb-origin` | Y | hybrid-connectivity |
| q630 | emr-glue-athena | `emr-runtime-role` | Y | iam-permissions |
| q705 | identity-federation | `cognito-social-idp-federation` | Y | api-gateway-step-functions, waf-shield |
| q722 | organizations-cloudtrail-config | `config-custom-rule` | Y | sqs-sns-eventbridge, ebs-instance-store |
| q724 | cost-management | `cost-and-usage-report` | Y | cloudwatch-xray |

이 40개는 사람이 고른 것이고, 아래 유형이 골고루 들어 있다 — 명확한 keep, 명확한 이동 후보,
권한·IAM이 끼는 문항, 비용이 조건인 문항, 알림(EventBridge·SNS·CloudWatch) 문항, 두 서비스 이상
통합 구성, 부정형("A는 이 일을 하지 않는다"), 유일 문항(커버리지 충돌 후보), 비교 개념에 연결된 문항.
**신호 칸은 참고일 뿐이다.** 신호가 없어도 이동 후보일 수 있고, 있어도 keep일 수 있다.

### q364는 미리 결론을 정해 두지 마라

이 문항은 기준을 맞추는 대표 사례다. 두 해석이 모두 가능하다.

- DataSync가 성공·오류 상태 변화를 **이벤트로 내보낸다**는 고유 기능을 알아야 푸는 문제 → DataSync 유지
- DataSync는 단순한 이벤트 소스이고 **EventBridge 규칙 → SNS 알림** 패턴이 정답을 가르는 문제 → 이동

교체 가능성 시험 하나로 결론내지 말고, 오답 넷이 무엇을 오해한 것인지와 해설이 실제로 어떤 지식을
정답 근거로 쓰는지를 함께 보고 판정해라. 결론이 한쪽으로 서지 않으면 `ambiguous`가 맞는 답이다.

## 재검토 신호 — 두 조합은 rationale에서 설명한다

아래 조합은 틀렸다는 뜻이 아니다. 다만 그 자리에서 한 번 더 보고, **왜 그 조합이 가능한지**를
`rationale`에 명시한다.

- `move-recommended` + `conceptFit=yes` — 현재 개념이 중심 지식을 직접 설명하는데도 다른 주제를
  권하는 경우다. 개념은 맞는데 주제 경계가 어긋난 자리일 수 있다.
- `keep` + `conceptFit=no` — 주제는 맞는데 연결된 개념이 배경 지식인 경우다. 같은 주제 안의 다른
  개념으로 `recommendedConceptId`를 바꾸는 것이 답일 수 있다.

`move-recommended` + `conceptFit=yes`가 여러 건 반복되면 `conceptFit`을 여전히 느슨하게 주고 있다는
뜻이다. 그때는 그 판정들을 다시 보라.

## 이 step은 재검토다 — 같은 40문항을 새 `conceptFit` 정의로 다시 본다

`audit/verdicts.jsonl`에 이미 40줄이 있다. **표본을 새로 뽑지 말고 문항을 새로 만들지 마라.**
같은 40개를 위의 좁힌 `conceptFit` 정의로 다시 판정한다.

- `conceptFit`은 40건 **모두 다시 판단한다.** 앞선 실행은 40건 전부를 `yes`로 적어 이 칸이 변별력을
  갖지 못했다.
- **기존 `verdict`를 무조건 유지하지 마라.** 새 정의가 `verdict` 판단에도 영향을 준다면 `verdict`도
  바꾼다. 반대로 바뀔 이유가 없으면 그대로 둔다.
- 아래 다섯은 특히 다시 확인한다 — `q154` · `q223` · `q355` · `q364` · `q284`.
- 지금 `move-recommended`인 `q154`·`q223`·`q355`가 **새 정의로도 `conceptFit=yes`인지** 반드시 다시 본다.
- `q364`는 DataSync 고유 지식과 EventBridge·SNS 패턴 양쪽으로 읽힌다. 이동을 억지로 확정하지 마라.
  새 정의를 적용한 뒤에도 `ambiguous`가 맞다면 그 이유를 `rationale`에 다시 쓴다.
- **판정 수를 맞추려 하지 마라.** 이 audit의 목적은 이동 문항을 많이 찾는 것이 아니라 **핵심 학습
  목표가 잘못 배정된 문항만** 찾는 것이다. 기준에 맞으면 대부분 `keep`이어도 그대로 받아들인다.
- `secondaryTopics`는 **최대 2개**다. `coverageConflict`와 `retarget`은 여전히 의미 판정의 근거가
  아니다 — 판정을 먼저 하고 제약은 그 뒤에 계산한다.
- `tools/validate-verdicts.mjs`가 위 상한이나 아래 AC의 규칙을 검사하지 않으면 **검사기에 그 규칙을
  더한다.** 남은 692문항이 같은 실수를 반복하지 않게 막는 것이 그 검사기의 목적이다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
test "$(wc -l < phases/35-question-topic-audit/audit/verdicts.jsonl)" = 40
node phases/35-question-topic-audit/tools/validate-verdicts.mjs --expect 40
node -e "const f=require('fs');const want=['q001','q035','q044','q054','q068','q079','q087','q108','q114','q125','q128','q129','q154','q170','q174','q177','q188','q202','q206','q209','q211','q223','q226','q231','q248','q249','q256','q272','q284','q323','q327','q355','q364','q366','q377','q467','q630','q705','q722','q724'];const got=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map((l)=>JSON.parse(l).id);if(JSON.stringify(got)!==JSON.stringify(want))throw new Error('표본 목록이나 순서가 다르다');console.log('표본 40문항 판정 완료')"
node -e "const f=require('fs');const rows=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const bad=rows.filter((r)=>r.secondaryTopics.length>2).map((r)=>r.id);if(bad.length)throw new Error('secondaryTopics가 2개를 넘는다: '+bad.join(', '));console.log('secondaryTopics 상한 확인')"
node -e "const f=require('fs');const rows=f.readFileSync('phases/35-question-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const flagged=rows.filter((r)=>(r.verdict==='move-recommended'&&r.conceptFit==='yes')||(r.verdict==='keep'&&r.conceptFit==='no'));const thin=flagged.filter((r)=>[...r.rationale.trim()].length<80).map((r)=>r.id);if(thin.length)throw new Error('재검토 신호 조합인데 rationale이 짧다: '+thin.join(', '));console.log('재검토 신호 조합 '+flagged.length+'건 설명 확인')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('제품 데이터가 바뀌었다: '+p)}console.log('제품 데이터 4종 그대로')"
```

마지막에서 두 번째 줄은 에이전트가 만든 검사기와 **무관하게** 상한을 본다. 검사기가 그 규칙을
빠뜨려도 여기서 걸린다.

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 판정 자체를 다시 훑는다:
   - `decidingKnowledge`가 서비스 이름이 아니라 **지식**을 말하는가?
   - `keep`으로 적은 문항에 "다른 주제가 더 적절하다"는 근거가 섞여 있지 않은가?
   - `ambiguous`에 두 해석이 모두 적혀 있는가?
   - 같은 패턴의 문항을 서로 다르게 판정하지 않았는가? (예: 알림 문항 여럿)
3. 결과에 따라 `phases/35-question-topic-audit/index.json`의 step 2를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 keep·ambiguous·move-recommended 수와 high·medium·low
     분포, 판단이 어려웠던 문항 id를 한 줄로
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 표본 밖 문항을 판정하지 마라. 40개만 쓴다. 이유: 사용자가 이 40개를 보고 기준을 승인한 뒤 전체로 넓힌다.
- 판정을 신호(`signals.foreignTopics`)로 정하지 마라. 이유: 신호는 우선순위 보조이고, 판정은 정답 논리를
  읽고 내리는 판단이다.
- 커버리지 때문에 판정을 뒤집지 마라. 이유: ADR-034가 의미 판정과 구현 제약을 분리한다.
- `src/`·`scripts/`를 고치지 마라. 제품 데이터 4종은 한 바이트도 바뀌면 안 된다.
- `tools/`의 검사 규칙을 느슨하게 고쳐 통과시키지 마라. 검사에 걸리면 판정을 고친다.
- 저장소 안에 임시 파일을 만들지 마라. 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
