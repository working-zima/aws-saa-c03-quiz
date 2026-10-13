# Step 1: list-data

## 배경

step 0이 `- `로 시작하는 문단을 글머리 기호 목록으로 그리게 했다(`src/lib/paragraph-blocks.ts`, `src/components/ConceptList.tsx`). 이 step은
**`docs/ADR.md`의 ADR-046**대로 개념 21개의 본문을 목록으로 바꾸고, 항목 이름이 한국어면 영문 이름을 괄호로 붙인다. 바뀌는 필드는
`paragraphs`뿐이다. 개념 이름·요약·문항은 그대로다.

무엇을 바꾸는지는 **`phases/57-concept-lists/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 판정하거나 문장을 다듬지 마라.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `concepts` | 개념 줄에서 바꿀 필드(`paragraphs`)의 새 값 전체 | 21 |
| `testEdits` | 테스트 파일에서 바꿀 부분. `file`의 `old`를 `new`로 한 번 바꾼다 | 9 |

`testEdits`는 문단 번호나 개수를 박아 둔 데이터 테스트 5개와, 도식 바로 앞 본문의 글자를 비교하는 도식 테스트 2개(각각 import 한 줄과 단언
한 줄)다. 단언의 뜻은 그대로이고 번호만 옮기거나 표지를 떼고 비교하게 한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-046**(이 step의 결정 — 「기준」, 「문장을 다루는 규칙」, 표)
- `phases/57-concept-lists/changes.json`
- `phases/57-concept-lists/verify-concept-lists.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `src/lib/paragraph-blocks.ts` — step 0이 만든 `isListItem`·`stripListMarker`·`groupParagraphs`
- `src/data/topics.json`에서 `changes.json`의 id로 시작하는 줄 — 바꿀 줄의 모양
- `src/data/data.test.ts`의 마지막 `describe` 몇 개(`ADR-039 확장 …`, `개념 계층 (ADR-041)`) — 새 `describe`를 쓸 모양
- `scripts/check-structure.mjs`·`scripts/sync-baseline.mjs` 머리 주석 — 이 step은 스냅샷을 바꾸지 않는다

## 작업

### 1. `src/data/topics.json`

`changes.json`의 `concepts` 21개마다 `      {"id":"<id>",`로 시작하는 줄 하나만 바꾼다. 줄 앞 공백 6칸과 끝 쉼표를 떼고 `JSON.parse` →
`paragraphs`에 `changes.json`의 값을 대입 → `JSON.stringify` → 앞 공백과 끝 쉼표를 그대로 붙인다. 키 순서(`id`, `parentId`, `name`,
`summary`, `paragraphs`)는 그대로 남는다.

**파일 전체를 `JSON.parse` → `JSON.stringify`로 다시 쓰지 마라.** 줄 단위로만 바꾼다. 치환에 쓸 일회성 스크립트는 저장소 밖(`/tmp` 등)에
두고 끝나면 지운다.

### 2. `testEdits` 9건

각 항목의 `file`에서 `old`(여러 줄일 수 있다, 줄바꿈까지 글자 그대로)를 찾아 `new`로 바꾼다. `old`는 그 파일에 정확히 한 번 나온다. 바꾸는
파일은 셋이다: `src/data/data.test.ts`, `src/components/diagrams/ControlTimingDiagram.test.tsx`, `src/components/diagrams/route53Tables.test.tsx`.

### 3. `src/data/data.test.ts`에 새 `describe('ADR-046 — 개념 본문 목록')`

파일 맨 끝에 더한다. `isListItem`은 `../lib/paragraph-blocks`에서 가져온다. 테스트 넷이다.

- **목록 항목은 혼자 서지 않는다.** 모든 개념에서, 항목 문단의 앞 문단이나 뒤 문단 가운데 하나 이상이 항목이다. 실패하면 개념 id와 문단
  번호가 메시지에 나오게 한다.
- **목록이 있는 개념은 이 21개뿐이다.** 항목 문단이 하나라도 있는 개념의 id 집합이 아래 목록과 같다. 주석에 「목록을 늘리려면 ADR-046의
  기준과 표를 먼저 고친다」를 적는다.

  ```ts
  const conceptsWithLists = [
    'backup-disaster-recovery.dr-strategies',
    'dynamodb.dynamodb',
    'ebs-instance-store.ebs-volume-type-names',
    'ebs-instance-store.placement-groups',
    'ec2-autoscaling.ec2',
    'ec2-autoscaling.ec2-purchase-options',
    'ecs-eks-fargate.ecs-task-role-vs-task-execution-role',
    'efs-fsx.fsx',
    'elastic-load-balancing.elb',
    'governance-iac.control-tower-controls',
    'guardduty-macie-inspector.security-service-lineup',
    'iam-permissions.iam-policy',
    'lambda.lambda-invocation-types',
    'rds-storage-features.features',
    'rds-storage-features.rds-backups',
    'route53.routing-policies',
    's3-encryption-batch.sse-types',
    's3-versioning-lifecycle.object-lock',
    'sqs-sns-eventbridge.sqs',
    'storage-gateway-migration.storage-gateway',
    'waf-shield.cloudfront',
  ]
  ```
- **표지는 문단 맨 앞의 `- ` 하나뿐이다.** 모든 개념 문단에서: `-`로 시작하면 `- ` 다음 글자가 공백이 아니다. 문단 안에 줄바꿈(`\n`)이 없다
  (Route 53 라우팅 정책 문단 안의 줄바꿈이 목록으로 바뀌어 없어졌다).
- **이름이 한국어인 항목에는 영문 이름이 붙는다.** 개념마다 아래 접두어로 시작하는 항목 문단이 정확히 하나씩 있다. 근거 주석:
  「영문 이름은 `docs/source/aws-docs.md` 「목록 항목의 영문 이름」(ADR-039 확장)」.

  ```ts
  const englishNamePrefixes: Record<string, string[]> = {
    'backup-disaster-recovery.dr-strategies': [
      '- **백업 및 복원**(Backup and Restore)',
      '- **파일럿 라이트**(Pilot Light)',
      '- **웜 스탠바이**(Warm Standby)',
      '- **다중 사이트 액티브-액티브**(Multi-site Active/Active)',
    ],
    'ebs-instance-store.ebs-volume-type-names': [
      '- 범용 SSD(General Purpose SSD)',
      '- 프로비저닝된 IOPS SSD(Provisioned IOPS SSD)',
      '- 처리량 최적화 HDD(Throughput Optimized HDD)',
      '- 콜드 HDD(Cold HDD)',
    ],
    'ebs-instance-store.placement-groups': [
      '- **클러스터**(Cluster)',
      '- **파티션**(Partition)',
      '- **분산**(Spread)',
    ],
    'ec2-autoscaling.ec2': [
      '- **온디맨드 인스턴스**(On-Demand Instance)',
      '- **스팟 인스턴스**(Spot Instance)',
      '- **예약 인스턴스**(Reserved Instance)',
    ],
    'ec2-autoscaling.ec2-purchase-options': [
      '- **온디맨드 인스턴스**(On-Demand Instance)',
      '- **스팟 인스턴스**(Spot Instance)',
      '- **예약 인스턴스**(Reserved Instance)',
    ],
    'ecs-eks-fargate.ecs-task-role-vs-task-execution-role': [
      '- **태스크 실행 역할**(Task Execution Role)',
      '- **태스크 역할**(Task Role)',
    ],
    'governance-iac.control-tower-controls': [
      '- **사전 예방적 제어**(Proactive Control)',
      '- **탐지 제어**(Detective Control)',
    ],
    'iam-permissions.iam-policy': [
      '- **자격 증명 기반 정책**(Identity-based Policy)',
      '- **리소스 기반 정책**(Resource-based Policy)',
    ],
    'lambda.lambda-invocation-types': [
      '- **이벤트 호출**(`Event`)',
      '- **요청-응답**(`RequestResponse`)',
    ],
    'rds-storage-features.rds-backups': [
      '- **자동 백업**(Automated Backup)',
      '- **DB 스냅샷**(DB Snapshot)',
    ],
    'route53.routing-policies': [
      '- **단순 라우팅**(Simple Routing)',
      '- **지리적 위치 라우팅**(Geolocation Routing)',
      '- **지리적 근접 라우팅**(Geoproximity Routing)',
      '- **다중값 응답 라우팅**(Multi-value Answer Routing)',
      '- **가중치 기반 라우팅**(Weighted Routing)',
      '- **지연시간 기반 라우팅**(Latency-based Routing)',
      '- **IP 기반 라우팅**(IP-based Routing)',
    ],
    's3-versioning-lifecycle.object-lock': [
      '- **거버넌스 모드**(Governance Mode)',
      '- **규정 준수 모드**(Compliance Mode)',
    ],
    'sqs-sns-eventbridge.sqs': [
      '- **표준 대기열**(Standard Queue)',
      '- **선입선출 대기열**(FIFO Queue)',
    ],
    'storage-gateway-migration.storage-gateway': [
      '- **파일 게이트웨이**(S3 File Gateway)',
      '- **볼륨 게이트웨이**(Volume Gateway)',
      '- **테이프 게이트웨이**(Tape Gateway)',
    ],
    'waf-shield.cloudfront': [
      '- **캐시 무효화**(Invalidation)',
    ],
  }
  ```

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/57-concept-lists/verify-concept-lists.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` — step 0이 끝났을 때의 테스트와 새 `describe('ADR-046 — 개념 본문 목록')`의 4개가 모두 통과한다.
   - `check-structure.mjs` — 「구조 이상 없음」. 개념 이름·개수·순서, 문항 파일이 그대로다.
   - `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-concept-lists.mjs` — 「개념 21개의 본문을 목록으로 바꿨고(항목 65개) 데이터가 명세와 한 글자도 다르지 않다. 테스트 수정 9건이
     모두 들어 있다」.
2. `verify-concept-lists.mjs`가 실패하면 출력의 「처음 다른 곳」을 보고 고친다. 샌드박스에서 `git`을 실행할 수 없으면 그 사실을
   `"summary"`에 적는다. 사람이 다시 돌린다.
3. 바뀐 파일이 `src/data/topics.json`과 테스트 파일 셋(`src/data/data.test.ts`, `src/components/diagrams/ControlTimingDiagram.test.tsx`,
   `src/components/diagrams/route53Tables.test.tsx`), phase 메타데이터뿐인지 확인한다.
4. `phases/57-concept-lists/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 바꾼 개념 수와 항목 수, 적용한 testEdits 수, 새로 더한 테스트 이름, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`changes.json`의 문장을 바꾸거나 더하지 마라.** 이유: ADR-046이 정한 사실 보존 규칙(문장을 나누고 옮기고 영문 이름을 붙이기만 한다)을
  설계 단계에서 원문과 대조해 확인한 결과다. 이상해 보이면 고치지 말고 `"summary"`에 적어라.
- **개념 `name`·`summary`, 문항(`src/data/questions.json`)을 바꾸지 마라.** 이유: ADR-046은 본문의 모양만 바꾼다. 이름이 바뀌면 스냅샷
  대조도 달라진다.
- **`changes.json`에 없는 개념 줄을 고치지 마라.** 굵은 키워드가 둘 이상 있어도 목록으로 바꾸지 않기로 한 개념이 28개 있다(ADR-046 「기준」).
  이유: `verify-concept-lists.mjs`가 나머지 줄의 바이트 일치를 본다.
- **`testEdits` 밖에서 기존 테스트를 고치거나 지우지 마라.** 새 `describe` 하나만 더한다. 이유: 시험 적용에서 깨진 테스트는 testEdits의
  7곳뿐이었다. 다른 테스트가 깨지면 설계가 예상하지 못한 의존이므로 멈추고 `"status": "error"`에 테스트 이름을 적는다.
- **`src/` 아래 코드(테스트가 아닌 파일), `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 화면 코드는 step 0이 끝냈고, 문서는 설계 커밋에 있다.
- 기존 테스트를 깨뜨리지 마라.
