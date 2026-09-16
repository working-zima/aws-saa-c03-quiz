# Phase 37 재연결 검증 보고서

## 1. 한 줄 요약

문항 16건의 연결만 재지정됐음(2A 14건·2B 2건)을 확인했고, 문항 본문·정답 위치·범위 밖 716건의 연결·개념 데이터·감사 산출물은 그대로이며 개념 커버리지 618/618(100%)를 유지한다.

## 2. 16건 before → after

before는 `relink.json.items[].from`, after는 현재 `src/data/questions.json`에서 읽었다. 아래 실측 명령의 `assert.deepEqual(after, i.to, i.id)`가 16건 모두 통과했다. 전용 검증기는 from·to·type을 phase 35 문항 감사와 phase 36 교차 감사에도 대조했다. `conceptId`는 16건, `topicId`는 2건 바뀌었다.

| 문항 | type | before topicId | before conceptId | after topicId | after conceptId |
|---|---|---|---|---|---|
| `q037` | `2A` | `s3-encryption-batch` | `s3-encryption-batch.sse-types` | `s3-encryption-batch` | `s3-encryption-batch.sse-kms-cost` |
| `q043` | `2A` | `efs-fsx` | `efs-fsx.efs` | `efs-fsx` | `efs-fsx.efs-lifecycle-management` |
| `q045` | `2A` | `efs-fsx` | `efs-fsx.fsx` | `efs-fsx` | `efs-fsx.fsx-lustre-s3-data-repository-association` |
| `q046` | `2A` | `efs-fsx` | `efs-fsx.fsx` | `efs-fsx` | `efs-fsx.fsx-ontap-multi-protocol-tiering` |
| `q061` | `2A` | `rds-storage-features` | `rds-storage-features.features` | `rds-storage-features` | `rds-storage-features.rds-multi-az-db-cluster` |
| `q065` | `2A` | `rds-storage-features` | `rds-storage-features.features` | `rds-storage-features` | `rds-storage-features.rds-blue-green-deployment` |
| `q068` | `2A` | `aurora` | `aurora.aurora` | `aurora` | `aurora.aurora-replica-auto-scaling` |
| `q080` | `2A` | `elastic-load-balancing` | `elastic-load-balancing.elb` | `elastic-load-balancing` | `elastic-load-balancing.nlb-udp-listener` |
| `q081` | `2A` | `elastic-load-balancing` | `elastic-load-balancing.elb` | `elastic-load-balancing` | `elastic-load-balancing.gateway-load-balancer` |
| `q086` | `2A` | `lambda` | `lambda.lambda` | `lambda` | `lambda.lambda-reserved-concurrency` |
| `q159` | `2A` | `identity-federation` | `identity-federation.identity-center` | `identity-federation` | `identity-federation.identity-center-permission-set` |
| `q165` | `2A` | `cost-management` | `cost-management.savings-plan` | `cost-management` | `cost-management.savings-plan-details` |
| `q344` | `2A` | `efs-fsx` | `efs-fsx.efs-ia-file-size-threshold` | `efs-fsx` | `efs-fsx.efs-lifecycle-management` |
| `q465` | `2B` | `elastic-load-balancing` | `elastic-load-balancing.end-to-end-encryption-behind-alb` | `secrets-encryption` | `secrets-encryption.acm` |
| `q472` | `2A` | `cloudfront-global-accelerator` | `cloudfront-global-accelerator.global-accelerator-static-ip` | `cloudfront-global-accelerator` | `cloudfront-global-accelerator.global-accelerator-protocols` |
| `q508` | `2B` | `lambda` | `lambda.serverless-runtime-no-os-access` | `rds-storage-features` | `rds-storage-features.rds-custom` |

## 3. 불변 조건 실측

실행 환경은 `node --version` → `v18.17.1`, `npm --version` → `10.2.1`이다. 아래 값은 현재 파일을 직접 읽은 명령 출력과 검증 명령 결과에서 가져왔다. 이전 step의 summary는 수치의 근거로 쓰지 않았다.

| 조건 | 실측 | 확인 방법(명령) |
|---|---|---|
| 문항 총 732개 | 732개 | `node <<'NODE' … NODE` — 아래 실측 명령: questions.json 배열 길이 |
| 개념 총 618개 | 618개 | `node <<'NODE' … NODE` — 아래 실측 명령: topics.json의 concepts 배열 길이 합 |
| 모든 개념에 문항 최소 1개 | `전체: 개념 618개 중 618개 덮임 (100%) — 남은 개념 0개, 문항 732개` | `node scripts/coverage.mjs` |
| topicId == conceptId의 주제 | 732/732건 일치, 불일치 0건 | `node <<'NODE' … NODE` — 아래 실측 명령: 실제 개념 배치 Map으로 문항 전수 대조 |
| answerIndex 변경 0 | 0건 — contentSha256이 수정 전 기준과 일치 | `node <<'NODE' … NODE` — 아래 실측 명령: 본문 다이제스트 재계산·assert.equal |
| prompt·choices·explanation 변경 0 | 0건 — 같은 contentSha256 일치 | `node <<'NODE' … NODE` — 아래 실측 명령: 본문 다이제스트 재계산·assert.equal |
| 범위 밖 716개 문항의 연결 불변 | 716건 — linksOutsideScopeSha256 일치 | `node <<'NODE' … NODE` — 아래 실측 명령: 범위 밖 연결 다이제스트 재계산·assert.equal |
| 개념 내용 변경 0 / topics.json 바이트 불변 | 변경 0건 — topicsSha256 일치 | `node <<'NODE' … NODE` — 아래 실측 명령: 파일 원문 sha256·assert.equal |
| phase 35·36 감사 산출물 변경 0 | 3개 파일 전부 sha256 일치 | `node <<'NODE' … NODE` — 아래 실측 명령: 감사 파일별 원문 sha256·assert.equal |
| topics-baseline.json의 questionsSha256 갱신 | 현재 questions.json 원문 sha256과 일치 | `node <<'NODE' … NODE` — 아래 실측 명령: 스냅샷 필드와 파일 해시 assert.equal |

해시는 모두 SHA-256 전체 값을 대조했다. 본문 다이제스트는 파일 순서대로 `[id, answerIndex, prompt, choices, explanation]`을, 범위 밖 연결 다이제스트는 `[id, topicId, conceptId]`를 `JSON.stringify` 기본 출력으로 만든 뒤 UTF-8로 해시한다. 따라서 본문 필드들의 변경 0건은 이 공동 다이제스트의 일치로 확인한 값이다.

| 대상 | 현재 재계산한 sha256 | 비교 기준·결과 |
|---|---|---|
| `contentSha256` | `990b6bf49c9aaea914d25ffef0e67373477fd67244326ff586c8742b237ecd3d` | relink.json.baseline.contentSha256 — 일치 |
| `linksOutsideScopeSha256` | `d27d62fed36aee3c9f8d8814034830eeef8e89d7282aec562127b423983d18de` | relink.json.baseline.linksOutsideScopeSha256 — 일치 |
| `src/data/topics.json` | `5a227aea172ca391ee1110d9228f933b9f8e728f8b8bf04e8da952e4def74e7a` | relink.json.baseline.topicsSha256 — 일치 |
| `phases/35-question-topic-audit/audit/verdicts.jsonl` | `fc56b769b25279b4047133801b86bc71d95142210c2b6f7667c6c4d0d79cf643` | relink.json.baseline.auditSha256의 해당 경로 — 일치 |
| `phases/36-concept-topic-audit/audit/verdicts.jsonl` | `7b3c6f3054b697836967af6c0226b9db40678389c3bb0c61c6af43ce49fa5b26` | relink.json.baseline.auditSha256의 해당 경로 — 일치 |
| `phases/36-concept-topic-audit/audit/cross-phase35.jsonl` | `effc860809f8605fd14f954127d4c4606613243b5d9f9cb44e733ff4f75cba99` | relink.json.baseline.auditSha256의 해당 경로 — 일치 |
| `src/data/questions.json` | `6b59d6992fdba56d0f934ced16216476b057557c70df722c48d526586f6d0106` | scripts/topics-baseline.json의 questionsSha256 — 일치 |

현재 문항 파일의 해시는 수정 전 `relink.json.baseline.questionsSha256`인 `aadc1894b3eb2d9211159ef346057bf24510ba534b78ccade4d40bf018343f54`과 다르고, step 1 명세의 기대 결과 및 현재 구조 스냅샷과 같다.

다음은 실제 실행한 읽기 전용 명령이다. 파일을 생성하거나 수정하지 않으며, 위 표와 다음 절의 잔여 문항 목록을 JSON으로 출력한다.

```bash
node <<'NODE'
const fs = require('node:fs')
const { createHash } = require('node:crypto')
const assert = require('node:assert/strict')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = value => createHash('sha256').update(value).digest('hex')
const fileHash = p => hash(fs.readFileSync(p))
const spec = read('phases/37-question-relink/relink.json')
const questions = read('src/data/questions.json')
const topics = read('src/data/topics.json')
const scope = new Set(spec.items.map(i => i.id))
const conceptTopics = new Map(topics.flatMap(t => t.concepts.map(c => [c.id, t.id])))
const byId = new Map(questions.map(q => [q.id, q]))
const rows = spec.items.map(i => {
  const q = byId.get(i.id)
  const after = { topicId: q.topicId, conceptId: q.conceptId }
  assert.deepEqual(after, i.to, i.id)
  return { id: i.id, type: i.type, before: i.from, after }
})
const fromConcepts = [...new Set(spec.items.map(i => i.from.conceptId))].map(conceptId => {
  const remaining = questions.filter(q => q.conceptId === conceptId).map(q => q.id)
  assert(remaining.length > 0, conceptId)
  return { conceptId, moved: spec.items.filter(i => i.from.conceptId === conceptId).map(i => i.id), count: remaining.length, remaining }
})
const contentSha256 = hash(JSON.stringify(questions.map(q => [q.id, q.answerIndex, q.prompt, q.choices, q.explanation])))
const outside = questions.filter(q => !scope.has(q.id))
const linksOutsideScopeSha256 = hash(JSON.stringify(outside.map(q => [q.id, q.topicId, q.conceptId])))
const topicsSha256 = fileHash('src/data/topics.json')
const questionsSha256 = fileHash('src/data/questions.json')
assert.equal(contentSha256, spec.baseline.contentSha256)
assert.equal(linksOutsideScopeSha256, spec.baseline.linksOutsideScopeSha256)
assert.equal(topicsSha256, spec.baseline.topicsSha256)
const auditSha256 = Object.fromEntries(Object.entries(spec.baseline.auditSha256).map(([p, expected]) => {
  const actual = fileHash(p)
  assert.equal(actual, expected, p)
  return [p, actual]
}))
const structureQuestionsSha256 = read('scripts/topics-baseline.json').questionsSha256
assert.equal(structureQuestionsSha256, questionsSha256)
const mismatches = questions.filter(q => conceptTopics.get(q.conceptId) !== q.topicId).map(q => q.id)
assert.equal(mismatches.length, 0)
console.log(JSON.stringify({
  node: process.version,
  questionCount: questions.length,
  conceptCount: topics.reduce((sum, t) => sum + t.concepts.length, 0),
  matchedLinks: questions.length - mismatches.length,
  mismatches,
  relinkCount: rows.length,
  type2A: rows.filter(r => r.type === '2A').length,
  type2B: rows.filter(r => r.type === '2B').length,
  changedTopicCount: rows.filter(r => r.before.topicId !== r.after.topicId).length,
  changedConceptCount: rows.filter(r => r.before.conceptId !== r.after.conceptId).length,
  contentSha256, outsideCount: outside.length, linksOutsideScopeSha256,
  topicsSha256, auditSha256, questionsSha256, structureQuestionsSha256,
  originalQuestionsSha256: spec.baseline.questionsSha256,
  rows, fromConcepts
}, null, 2))
NODE
```

## 4. 원 개념에 남은 문항 수

`from.conceptId`를 중복 제거한 원 개념은 13개다. 위 명령에서 현재 문항의 `conceptId`로 필터링했고, 모든 원 개념에 최소 1개가 남는다는 단언을 통과했다. 한 원 개념에서 여러 문항이 나간 경우에도 전체 재연결이 끝난 현재 값을 센 것이다. 문항이 0개가 된 원 개념은 없다(ADR-026).

| from.conceptId | 이동한 문항 | 남은 문항 수 | 남은 문항 id |
|---|---|---:|---|
| `s3-encryption-batch.sse-types` | `q037` | 3 | `q035`, `q036`, `q038` |
| `efs-fsx.efs` | `q043` | 1 | `q042` |
| `efs-fsx.fsx` | `q045`, `q046` | 2 | `q047`, `q048` |
| `rds-storage-features.features` | `q061`, `q065` | 4 | `q060`, `q062`, `q063`, `q064` |
| `aurora.aurora` | `q068` | 2 | `q066`, `q067` |
| `elastic-load-balancing.elb` | `q080`, `q081` | 2 | `q078`, `q079` |
| `lambda.lambda` | `q086` | 2 | `q085`, `q087` |
| `identity-federation.identity-center` | `q159` | 1 | `q158` |
| `cost-management.savings-plan` | `q165` | 1 | `q164` |
| `efs-fsx.efs-ia-file-size-threshold` | `q344` | 1 | `q343` |
| `elastic-load-balancing.end-to-end-encryption-behind-alb` | `q465` | 1 | `q464` |
| `cloudfront-global-accelerator.global-accelerator-static-ip` | `q472` | 1 | `q471` |
| `lambda.serverless-runtime-no-os-access` | `q508` | 1 | `q507` |

## 5. 검증 명령과 결과

아래 순서대로 직접 실행했으며 모두 exit 0이다. 인용은 각 명령의 마지막 비어 있지 않은 출력 줄이다.

1. `node phases/37-question-relink/tools/verify-relink.mjs --post` — exit 0

   > 재연결 검증 --post 통과 — 16건(2A 14건·2B 2건), 문항 732개·개념 618개, 정합성·커버리지 100%·불변 조건 확인

2. `npm run lint` — exit 0

   > > eslint . --ext ts,tsx --max-warnings 0

3. `npm run build` — exit 0

   > ✓ built in 891ms

4. `npm test` — exit 0

   > Duration  2.93s (transform 1.07s, setup 1.05s, collect 5.32s, tests 5.80s, environment 4.96s, prepare 1.49s)

5. `node scripts/check-structure.mjs` — exit 0

   > ✓ 구조 이상 없음 — 개념 id·name, 주제 메타데이터, 개념 개수·순서, 문항 파일 모두 기준과 같다

6. `node scripts/coverage.mjs` — exit 0

   > 문항이 하나도 없는 주제는 없다

`npm run lint`는 성공 시 별도 결과 문구를 출력하지 않아 마지막 명령 출력과 exit 0으로 확인했다. `npm test`의 통과 집계도 함께 남긴다.

```text
Test Files  24 passed (24)
Tests  512 passed (512)
```

`node scripts/coverage.mjs`의 전체 집계 줄:

> 전체: 개념 618개 중 618개 덮임 (100%) — 남은 개념 0개, 문항 732개

빌드는 minification 후 청크가 500 kB를 넘는다는 경고를 출력했다. 테스트에서는 React Router future flag 안내와 `act(...)` 경고가 나왔지만 실패한 테스트는 없었다. 이번 검증에서는 해당 코드나 설정을 수정하지 않았다.

## 6. 이번 마감에서 제외한 것

아래 항목은 **전부 backlog로 남았고 이번 phase에서 판단하지 않았다.** 제외 사유는 step 0이 정한 범위와 기존 감사 판정이다. ADR-034의 의미 판정과 ADR-026의 커버리지 제약을 섞어 기존 권장을 뒤집지 않았고, ADR-035의 개념 이동도 실행하지 않았다.

| 제외 대상 | 제외 사유 |
|---|---|
| `q223`·`q225` | 이동하면 각각 원 개념 `cloudwatch-xray.log-analysis-options`·`security-groups-nacl.nacl-rule-limit`에 남는 문항이 0개다. ADR-026을 지키려면 별도 설계가 필요하다. |
| `q152`·`q153`·`q154` | `waf-shield.cloudfront`에 얽혀 개념 id 충돌·blockImpact·권장 개념 공백이 겹치는 자리라 단순 재연결 범위에서 제외했다. |
| `q400`·`q728` | phase 35의 판정이 `ambiguous`다. |
| 개념 이동 권고 7건 전부 | 개념 이동·id 재설계·배열 배치는 이번 phase 범위 밖이다. |
| `ambiguous` / `medium` / `hold` 후보 전부 | 조건 없이 실행 가능한 재연결로 확정된 범위 밖이므로 기존 판정을 유지하고 보류했다. |

개념 이동 권고는 phase 36의 `fit === 'move-recommended'`를 직접 조회해 다음 7건임을 확인했다.

- `ebs-instance-store.cluster-placement-group`
- `ebs-instance-store.spread-placement-group`
- `ebs-instance-store.elastic-fabric-adapter`
- `api-gateway-step-functions.api-gateway-behind-cloudfront`
- `sqs-sns-eventbridge.sqs-queue-depth-scaling`
- `waf-shield.cloudfront`
- `iam-permissions.iam-roles-anywhere`

제외 대상의 잔여 문항 수·기존 판정·개념 이동 권고 목록을 확인한 읽기 전용 명령:

```bash
node <<'NODE'
const fs = require('node:fs')
const readJsonl = p => fs.readFileSync(p, 'utf8').trim().split('\n').map(line => JSON.parse(line))
const concepts = readJsonl('phases/36-concept-topic-audit/audit/verdicts.jsonl')
const questions = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'))
const audits = readJsonl('phases/35-question-topic-audit/audit/verdicts.jsonl')
const moves = concepts.filter(c => c.fit === 'move-recommended')
console.log(JSON.stringify({
  conceptMoveCount: moves.length,
  conceptMoves: moves.map(c => c.conceptId ?? c.id),
  coverageBacklog: ['q223', 'q225'].map(id => {
    const q = questions.find(q => q.id === id)
    const remaining = questions.filter(other => other.id !== id && other.conceptId === q.conceptId).map(q => q.id)
    return { id, conceptId: q.conceptId, remainingAfterMove: remaining }
  }),
  ambiguousBacklog: ['q400', 'q728'].map(id => ({ id, verdict: audits.find(q => q.id === id).verdict }))
}, null, 2))
NODE
```

## 7. 아직 하지 않은 것

`push`, `develop` 병합, `main` 릴리스를 하지 않았다. 모두 사람이 판단할 일이다. 이번 step에서는 git 명령과 커밋을 실행하지 않았으며, 산출물은 이 보고서와 `index.json`의 step 2 상태 갱신이다.

