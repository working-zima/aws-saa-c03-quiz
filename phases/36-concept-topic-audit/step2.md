# Step 2: sample-criteria

**표본 40개 개념을 ADR-035 기준으로 판정한다.** 618개 전체로 넓히기 전에, 기준이 실제 데이터에서
일관되게 적용되는지 사람이 확인하는 단계다. **이 step이 끝나면 실행이 멈추고 사용자가 판정을
검토한다.** step 3 이후는 사용자의 추가 승인 없이 시작하지 않는다.

**이 step에서 만드는 파일은 `phases/36-concept-topic-audit/audit/verdicts.jsonl` 하나다.**
데이터·테스트·제품 코드는 한 글자도 바꾸지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-035** — 판정 기준. 이 step의 모든 판단은 여기서 나온다
- `docs/ADR.md`의 ADR-033(개념 배열을 서비스 블록 단위로 잡는다) · ADR-023(주제를 서비스 경계로
  자른다) · ADR-026(개념당 최소 1문항)
- `phases/36-concept-topic-audit/audit/concepts.jsonl` — step 1이 만든 워크시트. 개념 전문과
  `questionCount`·`questionIds`·`blockNeighbors`·`signals`가 여기 있다
- `phases/36-concept-topic-audit/tools/validate-verdicts.mjs` — 검사 규칙(스키마와 계산식)
- `src/data/topics.json` — 권장 주제를 고를 때 대상 주제의 개념 목록을 본다

## 판정 절차 — 개념마다 이 순서로

ADR-035의 순서를 그대로 따른다. 앞 칸을 채우지 못하면 뒤 칸을 쓰지 마라.

1. **`learningGoal`** — 이 개념을 학습한 뒤 학생이 이해해야 하는 **중심 지식**을 한 문장으로 쓴다.
   - 가능하면 서비스 이름 없이 쓴다. 그러나 **서비스 고유 기능이라 이름을 빼면 의미가 흐려지면
     이름을 쓴다.** 억지로 추상적인 문장으로 만들지 마라 — 그러면 판정의 근거가 사라진다.
   - 본문에 있는 내용을 요약하는 것이 아니다. **무엇을 이해해야 하는가**를 쓴다.
2. **`serviceSpecificGoal`** — 1번 문장이 특정 서비스의 고유 기능에 묶여 있으면 `true`, 여러 서비스에
   적용되는 일반 지식이면 `false`. **서비스 이름을 썼는지가 아니라 목표가 고유한지를 본다.**
3. **중심 질문** — **"이 학습 목표는 현재 주제에 속하는가?"**
   - 개념 이름에 어떤 서비스가 들어가는지는 기준이 아니다.
   - 다른 서비스를 언급한다는 이유만으로 이동 후보로 잡지 마라. 현재 주제의 서비스를 이해하는 데
     필요한 **통합·제약·비교·운영 판단 기준**이면 현재 주제에 남는다.
   - 비교 개념은 **비교의 축 자체가 학습 목표**라면 유지다. 비교 결론이 다른 주제의 서비스여도 그렇다.
   - 공통 기능(EventBridge·SNS·IAM·CloudWatch·비용·Organizations·계정 간 접근)은 등장만으로 끌려가지
     않는다. **"현재 서비스에서 이 기능을 어떻게 쓰는가"가 중심이면 유지**, **"공통 패턴 자체가
     학습 목표"면 이동 후보**다.
4. **`recommendedTopic`** — 3번의 답이 "다른 주제"이면 그 주제를 지목한다. 유지면 현재 주제를 적는다.
5. **`fit`** — `keep` · `ambiguous` · `move-recommended`. 1~4가 한 곳을 가리키지 않으면 **주저 없이
   `ambiguous`로 남긴다.** 억지로 한쪽을 고르는 것이 이 audit의 가장 큰 실패다.
   `move-recommended`일 때만 `confidence`를 쓴다 — `high`(다른 주제가 명확히 더 적절) ·
   `medium`(더 자연스럽지만 해석 여지가 있음) · `low`(경계 사례).
6. **`duplicateOf`** — 거의 같은 내용을 다루는 다른 개념이 있으면 그 id를 적는다(없으면 `null`).
   `signals.nearDuplicateCandidates`는 후보일 뿐이다 — **본문을 읽고 실제로 같은 것을 가르치는지**
   판단한다. 이름이 같아도 가르치는 깊이가 다르면 중복이 아니다. **중복이라는 판단이 이동 판정의
   근거가 되지는 않는다.**
7. **`blockImpact`** — `move-recommended`일 때만 쓴다. 대상 주제의 **어느 서비스 블록 어디에**
   들어가야 하는지를 ADR-033 규칙(블록마다 기본 → 갈림길 → 세부, 비교는 대상 블록 뒤, 전제가
   최우선)으로 한 문장 적는다. 적을 수 없으면 그것이 "추가 설계가 필요하다"는 신호이므로 그 사실을
   적는다. `keep`은 `null`이다.
8. **`rationale`** — 왜 그렇게 판정했는지 한두 문장. `ambiguous`는 **두 해석을 모두** 적는다(80자 이상).

`questionCount`와 `questionIds`는 워크시트에 있는 값을 그대로 옮긴다 — **사람이 세는 값이 아니고,
검사기가 `questions.json`에서 다시 계산해 대조한다.**

## 표본 40개

아래 40개만 판정한다. **표를 쓴 순서대로** `audit/verdicts.jsonl`에 한 줄씩 쓴다.
39개 주제에서 하나씩 고르고, 개념이 가장 많은 주제(`sqs-sns-eventbridge`, 33개)에서 하나를 더 골랐다.
쉬운 개념이 아니라 **경계가 애매해 보이는 개념**을 일부러 골랐다.

| # | conceptId | 위치 | 문항 | 고른 이유(기계 신호) |
|---:|---|---:|---:|---|
| 1 | `aws-core-services.elb` | 6/18 | 1 | 다른 주제에 같은 이름의 개념이 있다(near-dup 0.31 ↔ `elastic-load-balancing.elb`) |
| 2 | `s3-storage-classes.glacier-or-standard-ia` | 10/17 | 1 | 비교형 |
| 3 | `s3-versioning-lifecycle.s3-replication-cross-account-kms` | 10/10 | 1 | 계정 간 접근 + KMS 공통 패턴 |
| 4 | `s3-encryption-batch.sse-kms-audit-trail` | 5/13 | 1 | CloudTrail·KMS 공통 패턴 |
| 5 | `s3-access-control.s3-access-grants` | 6/13 | 1 | IAM·Identity Center 경계 |
| 6 | `ebs-instance-store.ebs-encryption-performance` | 7/15 | 1 | 비교형 + KMS 공통 패턴 |
| 7 | `efs-fsx.fsx-for-lustre` | 17/25 | 1 | 다른 주제 서비스 언급(EBS·컨테이너) |
| 8 | `data-transfer-services.datasync-task-status-event` | 7/19 | 1 | EventBridge·SNS·CloudWatch 공통 패턴이 가장 강한 자리 |
| 9 | `storage-gateway-migration.storage-gateway` | 1/7 | 6 | 문항 6개가 붙은 소개 개념 + 다른 주제 언급 |
| 10 | `rds-storage-features.rds-iam-database-authentication` | 16/21 | 1 | IAM·Secrets Manager 경계 + 비교형 |
| 11 | `aurora.aurora-storage-configurations` | 17/18 | 1 | 비교형(RDS 스토리지 주제와의 경계) |
| 12 | `dynamodb.dynamodb-auto-scaling-target-utilization` | 11/18 | 1 | CloudWatch 공통 패턴 + Auto Scaling 주제 경계 |
| 13 | `elasticache-purpose-built-db.qldb` | 13/14 | 1 | 다른 주제 서비스 언급 |
| 14 | `ec2-autoscaling.elb-health-check-drives-asg-replacement` | 17/18 | 1 | 로드 밸런서 주제 경계 |
| 15 | `elastic-load-balancing.nlb-ip-targets` | 11/16 | 1 | 다른 주제 서비스 언급 |
| 16 | `cloudfront-global-accelerator.cloudfront` | 1/24 | 1 | near-dup 0.39 ↔ `aws-core-services.cloudfront` |
| 17 | `lambda.lambda-function-url-iam-auth` | 3/18 | 1 | IAM·API Gateway 경계 |
| 18 | `ecs-eks-fargate.elastic-beanstalk` | 22/23 | 1 | 컨테이너 주제에 들어온 다른 성격의 서비스 + 비교형 |
| 19 | `api-gateway-step-functions.api-gateway-api-key-not-auth` | 6/20 | 1 | 부정형 + 인증 경계 |
| 20 | `sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions` | 17/33 | 1 | IAM·KMS 공통 패턴 |
| 21 | `sqs-sns-eventbridge.eventbridge-pipes` | 27/33 | 1 | 비교형 + 통합 주제 경계 |
| 22 | `backup-disaster-recovery.backup-and-restore-dr` | 9/11 | 1 | 비교형(DR 전략 축) |
| 23 | `vpc-networking.vpc-flow-logs` | 20/20 | 1 | CloudWatch 공통 패턴 |
| 24 | `security-groups-nacl.web-acl-vs-nacl` | 9/9 | 1 | 비교형(WAF 주제 경계) |
| 25 | `hybrid-connectivity.centralized-onprem-egress` | 17/19 | 1 | VPC 주제 경계 |
| 26 | `route53.route53-query-logging` | 13/13 | 1 | CloudWatch 공통 패턴 |
| 27 | `emr-glue-athena.log-storage-s3-athena` | 16/20 | 1 | CloudWatch 경계 + near-dup ↔ `cloudwatch-xray.log-analysis-options` |
| 28 | `kinesis-streaming.streaming-services-comparison` | 13/16 | 1 | 비교형 |
| 29 | `redshift-opensearch-quicksight.quicksight` | 9/11 | 1 | 분석 주제 사이의 경계 |
| 30 | `cloudwatch-xray.log-analysis-options` | 4/11 | 1 | 선택지 요약형 + 분석 주제 경계 |
| 31 | `secrets-encryption.acm-expiration-event` | 20/20 | 1 | EventBridge·SNS 공통 패턴 |
| 32 | `waf-shield.firewall-manager` | 15/15 | 1 | Organizations 공통 패턴 |
| 33 | `guardduty-macie-inspector.security-service-lineup` | 11/11 | 1 | 여러 주제 서비스를 한 번에 가르는 비교형 |
| 34 | `iam-permissions.access-analyzer-delegated-administrator` | 16/18 | 1 | Organizations 위임 관리자 패턴 |
| 35 | `identity-federation.identity-center-permission-set` | 3/11 | 1 | IAM 주제와의 경계 |
| 36 | `organizations-cloudtrail-config.config-rule-remediation` | 11/16 | 1 | IAM·Systems Manager 경계 |
| 37 | `cost-management.rds-reserved-instance` | 4/17 | 1 | 서비스 주제 대 비용 주제의 경계 |
| 38 | `governance-iac.resource-access-manager` | 6/7 | 1 | 공유·네트워크 주제 경계 |
| 39 | `systems-manager.ssm-managed-instance-core-policy` | 4/7 | 1 | IAM 공통 패턴 |
| 40 | `ai-ml-services.sagemaker` | 1/6 | 1 | 소개 개념 + 다른 주제 언급 |

**신호 칸은 참고일 뿐이다.** 신호가 있어도 `keep`이 맞을 수 있고, 없어도 이동 후보일 수 있다.
판정은 개념 전문을 읽고 내린다.

### 미리 결론을 정해 두지 마라 — 특히 이 셋

- `aws-core-services.elb`·`cloudfront-global-accelerator.cloudfront` — 이름이 같은 개념이 두 주제에
  있다. 한쪽은 전체 지형을 처음 훑는 자리이고 다른 쪽은 그 서비스 블록의 기본 개념일 수 있다.
  **같은 이름이라는 사실만으로 중복이나 이동으로 몰지 마라.** `duplicateOf`는 기록이고, 주제 적합도는
  별개 축이다. 두 개념이 실제로 같은 것을 가르치는지 본문으로 확인해라.
- `data-transfer-services.datasync-task-status-event` — "그 서비스가 상태를 이벤트로 내보낸다"는
  고유 기능으로도 읽히고, "이벤트 → 알림"이라는 공통 패턴으로도 읽힌다. 결론이 한쪽으로 서지 않으면
  `ambiguous`가 맞는 답이다.
- `ecs-eks-fargate.elastic-beanstalk` — 주제 제목에 들어 있는 서비스다. **주제 제목에 있다는 것이
  학습 목표가 그 주제에 속한다는 증거는 아니다.** 반대로 제목에 있다는 이유로 이동을 막지도 마라.

### 재검토 신호 — 두 조합은 rationale에서 설명한다

아래 조합은 틀렸다는 뜻이 아니다. 다만 그 자리에서 한 번 더 보고, **왜 그 조합이 가능한지**를
`rationale`에 80자 이상으로 명시한다(검사기가 길이를 본다).

- `move-recommended` + `serviceSpecificGoal=true` — 학습 목표가 특정 서비스 고유 기능인데도 다른
  주제를 권하는 경우다. 그 서비스의 주제가 따로 있는 자리일 수 있다.
- `keep` + `duplicateOf`가 있음 — 유지인데 다른 개념과 거의 같은 내용인 경우다. 두 자리에 모두
  필요한 지식인지, 한쪽이 병합 대상인지 적는다.

### 판정 수를 맞추려 하지 마라

이 audit의 목적은 이동 개념을 많이 찾는 것이 아니라 **학습 목표가 잘못 배정된 개념만** 찾는 것이다.
기준에 맞으면 **대부분 `keep`이어도 그대로 받아들인다.** 실제 이동 비용(conceptId·문항 연결·
테스트·블록 위치)은 판정의 근거가 아니다 — 판정을 먼저 하고 비용은 `blockImpact`에 적는다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm test
node scripts/check-structure.mjs
test "$(wc -l < phases/36-concept-topic-audit/audit/verdicts.jsonl | tr -d ' ')" = 40
node phases/36-concept-topic-audit/tools/validate-verdicts.mjs --expect 40
node -e "const f=require('fs');const want=['aws-core-services.elb','s3-storage-classes.glacier-or-standard-ia','s3-versioning-lifecycle.s3-replication-cross-account-kms','s3-encryption-batch.sse-kms-audit-trail','s3-access-control.s3-access-grants','ebs-instance-store.ebs-encryption-performance','efs-fsx.fsx-for-lustre','data-transfer-services.datasync-task-status-event','storage-gateway-migration.storage-gateway','rds-storage-features.rds-iam-database-authentication','aurora.aurora-storage-configurations','dynamodb.dynamodb-auto-scaling-target-utilization','elasticache-purpose-built-db.qldb','ec2-autoscaling.elb-health-check-drives-asg-replacement','elastic-load-balancing.nlb-ip-targets','cloudfront-global-accelerator.cloudfront','lambda.lambda-function-url-iam-auth','ecs-eks-fargate.elastic-beanstalk','api-gateway-step-functions.api-gateway-api-key-not-auth','sqs-sns-eventbridge.sns-encrypted-topic-publish-permissions','sqs-sns-eventbridge.eventbridge-pipes','backup-disaster-recovery.backup-and-restore-dr','vpc-networking.vpc-flow-logs','security-groups-nacl.web-acl-vs-nacl','hybrid-connectivity.centralized-onprem-egress','route53.route53-query-logging','emr-glue-athena.log-storage-s3-athena','kinesis-streaming.streaming-services-comparison','redshift-opensearch-quicksight.quicksight','cloudwatch-xray.log-analysis-options','secrets-encryption.acm-expiration-event','waf-shield.firewall-manager','guardduty-macie-inspector.security-service-lineup','iam-permissions.access-analyzer-delegated-administrator','identity-federation.identity-center-permission-set','organizations-cloudtrail-config.config-rule-remediation','cost-management.rds-reserved-instance','governance-iac.resource-access-manager','systems-manager.ssm-managed-instance-core-policy','ai-ml-services.sagemaker'];const got=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map((l)=>JSON.parse(l).conceptId);if(JSON.stringify(got)!==JSON.stringify(want))throw new Error('표본 목록이나 순서가 다르다');console.log('표본 40개 판정 완료')"
node -e "const f=require('fs');const rows=f.readFileSync('phases/36-concept-topic-audit/audit/verdicts.jsonl','utf8').trim().split('\n').map(JSON.parse);const t=new Set(JSON.parse(f.readFileSync('src/data/topics.json','utf8')).map((x)=>x.id));const byTopic=new Map();for(const r of rows)byTopic.set(r.topicId,(byTopic.get(r.topicId)||0)+1);if(byTopic.size!==39)throw new Error('39개 주제를 덮지 않았다: '+byTopic.size);if(byTopic.get('sqs-sns-eventbridge')!==2)throw new Error('가장 큰 주제에서 2개를 보지 않았다');const bad=rows.filter((r)=>r.fit==='move-recommended'&&(!r.blockImpact||[...r.blockImpact.trim()].length<10)).map((r)=>r.conceptId);if(bad.length)throw new Error('이동 권고에 blockImpact가 없다: '+bad.join(', '));const amb=rows.filter((r)=>r.fit==='ambiguous'&&[...r.rationale.trim()].length<80).map((r)=>r.conceptId);if(amb.length)throw new Error('ambiguous인데 두 해석이 없다: '+amb.join(', '));console.log('주제 커버리지·blockImpact·ambiguous 설명 확인')"
node -e "const c=require('crypto'),f=require('fs');const want={'src/data/questions.json':'aadc1894b3eb2d92','src/data/topics.json':'5a227aea172ca391','src/data/data.test.ts':'4f83435d7479cad8','scripts/topics-baseline.json':'aade58a88000ca6c','phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('잠긴 파일이 바뀌었다: '+p)}console.log('잠긴 파일 5종 그대로')"
test ! -f phases/36-concept-topic-audit/audit/cross-phase35.jsonl
```

마지막에서 두 번째 줄과 마지막 줄이 이 phase의 두 불변 조건이다 — phase 35 산출물이 그대로이고,
교차 분석 파일이 **아직 없어야** 한다(교차는 step 13에서만 한다).

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다.
2. 판정 자체를 다시 훑는다:
   - `learningGoal`이 본문 요약이 아니라 **이해해야 할 것**을 말하는가?
   - `keep`으로 적은 개념에 "다른 주제가 더 적절하다"는 근거가 섞여 있지 않은가?
   - `ambiguous`에 두 해석이 모두 적혀 있는가?
   - 같은 유형(공통 패턴 언급·비교형·소개 개념)인데 서로 다르게 판정하지 않았는가?
3. `phases/36-concept-topic-audit/index.json`의 step 2를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary"`에 **fit 분포(keep·ambiguous·move), confidence 분포,
     `serviceSpecificGoal` 참/거짓 수, `duplicateOf` 건수, 판단이 어려웠던 개념 id, 같은 유형인데
     판정이 갈린 자리**를 한 줄로 적는다. 사용자가 이 요약으로 전체 진행 여부를 결정한다.
   - 3회 수정 시도 후에도 실패 → `"status": "error"` + `error_message`
   - 사용자 개입 필요 → `"status": "blocked"` + `blocked_reason` 후 즉시 중단

## 금지사항

- 표본 밖 개념을 판정하지 마라. 40개만 쓴다. 이유: 사용자가 이 40개를 보고 기준을 승인한 뒤 전체로
  넓힌다. 승인 전에 step 3 이후의 개념을 판정하면 그 판단은 검토받지 않은 기준으로 내려진 것이다.
- `phases/35-question-topic-audit/`의 파일을 **읽지 마라.** 이유: 개념 판정은 문항 판정과 독립이어야
  한다. 문항 쪽 결론을 먼저 보면 개념 판정이 그것을 따라간다. 교차는 step 13에서만 한다.
- 판정을 신호(`signals`)로 정하지 마라. 이유: 신호는 읽는 순서를 정하는 보조다.
- 이동 비용(conceptId 변경·문항 동반 이동·테스트 수정)을 이유로 판정을 뒤집지 마라. 이유: ADR-035가
  의미 판정과 구현 제약을 분리한다.
- `src/`·`scripts/`를 고치지 마라. 잠긴 파일 5종은 한 바이트도 바뀌면 안 된다.
- `tools/`의 검사 규칙을 느슨하게 고쳐 통과시키지 마라. 검사에 걸리면 판정을 고친다.
- 저장소 안에 임시 파일을 만들지 마라. 하네스가 `git add -A`로 커밋한다.
- 기존 테스트를 깨뜨리지 마라.
