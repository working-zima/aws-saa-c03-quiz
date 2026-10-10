#!/usr/bin/env node
/**
 * phase 53 일회성 가드레일 — 데이터에서 바뀐 것이 `parentId` 삽입뿐인지 본다.
 *
 * 사용법: node phases/53-concept-indent/verify-hierarchy.mjs <step>
 *
 * 착수 시점(develop c7de9a7)의 해시를 박아 둔 검사다. 저장소 공용 테스트로 올리지 마라 —
 * 이 phase가 끝난 뒤 콘텐츠를 정당하게 고치면 영구히 실패한다. 이 phase 안에서만 쓴다.
 *
 * | 검사 | 무엇을 보장하나 |
 * |---|---|
 * | questions.json 해시 | 문항 파일이 한 글자도 안 바뀌었다 |
 * | topics.json에서 `,"parentId":"…"`를 지우고 WAF 이동을 되돌린 해시 | 바뀐 것이 parentId 삽입과 step 4의 WAF 이동 하나뿐이다 — 재직렬화·본문 수정·다른 순서 변경이 없다 |
 * | parentId 자리 | 개념 줄에서 `"id"` 바로 뒤에 있다 |
 * | parentId 짝 | 이 step까지 적용할 주제의 짝이 hierarchy.json과 정확히 같고, 나머지 주제에는 parentId가 없다 |
 * | topics-baseline.json에서 parentId 줄을 지우고 WAF 이동을 되돌린 해시 | 스냅샷도 parentId 줄 삽입과 같은 WAF 이동만 바뀌었다 |
 * | 스냅샷의 parentId = topics.json의 parentId | 두 파일이 같은 관계를 적는다 |
 *
 * 규칙 세 가지(같은 주제·두 단·연속)는 src/data/data.test.ts가 hierarchyProblems로 검사한다.
 */
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p) => readFileSync(join(ROOT, p), 'utf8')
const sha = (s) => createHash('sha256').update(s).digest('hex')

const BASE = {
  topics: '328d017eb150193bd780238c6d03e09f4e85c8bf2530ba9f04e72d7ce7d70676',
  questions: '912eed4f6a8ecf20304c9da4554454967c58581fcdafd6920c88ef0b5ec4efa0',
  baseline: 'ed42f1d5d5bf12f6f4f68c786cb71a0cda38f87a01adcf3829f2a6449f560432',
}

/** step마다 새로 parentId를 넣는 주제. step 0·1은 데이터를 건드리지 않는다. */
const STEPS = [
  [],
  [],
  ['data-transfer-services', 'sqs-sns-eventbridge', 'vpc-networking', 'lambda', 'backup-disaster-recovery'],
  [
    'aws-core-services', 's3-storage-classes', 's3-versioning-lifecycle', 's3-encryption-batch', 's3-access-control',
    'ebs-instance-store', 'efs-fsx', 'storage-gateway-migration', 'rds-storage-features', 'aurora', 'dynamodb',
    'elasticache-purpose-built-db', 'ec2-autoscaling', 'elastic-load-balancing', 'cloudfront-global-accelerator',
    'ecs-eks-fargate', 'api-gateway-step-functions',
  ],
  [
    'security-groups-nacl', 'hybrid-connectivity', 'route53', 'emr-glue-athena', 'kinesis-streaming',
    'redshift-opensearch-quicksight', 'cloudwatch-xray', 'secrets-encryption', 'waf-shield', 'guardduty-macie-inspector',
    'iam-permissions', 'identity-federation', 'organizations-cloudtrail-config', 'cost-management', 'governance-iac',
    'systems-manager', 'ai-ml-services',
  ],
]

/**
 * 순서 변경은 하나만 허용한다 — step 4가 `waf-shield.cloudfront`를 주제 맨 앞(`waf-shield.waf` 앞)으로 옮긴다(ADR-041
 * 「남은 자리」 1). 해시를 비교하기 전에 이 이동을 되돌린다. 이동 전 step에서 옮겨져 있거나, 이동 step 뒤에 안 옮겨져 있으면 실패다.
 */
const WAF_MOVE_STEP = 4
const TOPIC_LINE = { waf: '      {"id":"waf-shield.waf",', cloudfront: '      {"id":"waf-shield.cloudfront",' }
const BASELINE_BLOCK = {
  waf: '    {\n     "id": "waf-shield.waf",\n     "name": "WAF (Web Application Firewall)"\n    },\n',
  cloudfront: '    {\n     "id": "waf-shield.cloudfront",\n     "name": "CloudFront"\n    },\n',
}

function undoWafMoveInTopics(text) {
  const lines = text.split('\n')
  const w = lines.findIndex((l) => l.startsWith(TOPIC_LINE.waf))
  const c = lines.findIndex((l) => l.startsWith(TOPIC_LINE.cloudfront))
  const moved = c === w - 1
  if (moved) [lines[c], lines[w]] = [lines[w], lines[c]]
  return { moved, text: lines.join('\n') }
}

function undoWafMoveInBaseline(text) {
  const movedPair = BASELINE_BLOCK.cloudfront + BASELINE_BLOCK.waf
  const moved = text.includes(movedPair)
  return { moved, text: moved ? text.replace(movedPair, BASELINE_BLOCK.waf + BASELINE_BLOCK.cloudfront) : text }
}

const step = Number(process.argv[2])
if (!Number.isInteger(step) || step < 0 || step >= STEPS.length) {
  console.log(`사용법: node phases/53-concept-indent/verify-hierarchy.mjs <0..${STEPS.length - 1}>`)
  process.exit(2)
}

const problems = []
const applied = new Set(STEPS.slice(0, step + 1).flat())
const hierarchy = JSON.parse(read('phases/53-concept-indent/hierarchy.json'))

// 1. 문항 파일
if (sha(read('src/data/questions.json')) !== BASE.questions) problems.push('src/data/questions.json이 바뀌었다')

// 2. topics.json — parentId를 지우고 허용된 WAF 이동을 되돌리면 착수 시점과 같아야 한다
const raw = read('src/data/topics.json')
const topicsUndo = undoWafMoveInTopics(raw.replace(/,"parentId":"[^"]*"/g, ''))
if (topicsUndo.moved !== step >= WAF_MOVE_STEP) {
  problems.push(step >= WAF_MOVE_STEP
    ? 'topics.json: waf-shield.cloudfront가 waf-shield.waf 바로 앞으로 옮겨져 있지 않다'
    : `topics.json: step ${WAF_MOVE_STEP} 전인데 waf-shield.cloudfront가 옮겨져 있다`)
}
if (sha(topicsUndo.text) !== BASE.topics) {
  problems.push('topics.json에서 parentId와 WAF 이동 말고 바뀐 것이 있다 (본문·순서·재직렬화)')
}

// 3. parentId 자리
for (const line of raw.split('\n')) {
  if (line.includes('"parentId"') && !/^ {6}\{"id":"[^"]+","parentId":"[^"]+","name":/.test(line)) {
    problems.push(`parentId가 "id" 바로 뒤에 있지 않다: ${line.slice(0, 120)}`)
  }
}

// 4. 짝
const topics = JSON.parse(raw)
const got = new Map()
for (const topic of topics) {
  for (const concept of topic.concepts) {
    if (concept.parentId !== undefined) got.set(concept.id, [topic.id, concept.parentId])
  }
}
const want = new Map()
for (const topicId of applied) {
  if (!hierarchy[topicId]) problems.push(`hierarchy.json에 ${topicId}가 없다`)
  for (const [child, parent] of hierarchy[topicId] ?? []) want.set(child, [topicId, parent])
}
for (const [child, [topicId, parent]] of want) {
  const g = got.get(child)
  if (!g) problems.push(`${child}에 parentId가 없다 (기대 ${parent})`)
  else if (g[1] !== parent) problems.push(`${child}의 parentId: 기대 ${parent}, 실제 ${g[1]}`)
  else if (g[0] !== topicId) problems.push(`${child}가 주제 ${topicId}에 없다`)
}
for (const [child, [topicId, parent]] of got) {
  if (!want.has(child)) {
    problems.push(applied.has(topicId)
      ? `${child}에 hierarchy.json에 없는 parentId가 있다 (${parent})`
      : `아직 적용하지 않을 주제 ${topicId}의 ${child}에 parentId가 있다`)
  }
}

// 5. 스냅샷
const baselineRaw = read('scripts/topics-baseline.json')
const baselineUndo = undoWafMoveInBaseline(baselineRaw.replace(/^ {5}"parentId": "[^"]*",\n/gm, ''))
if (baselineUndo.moved !== step >= WAF_MOVE_STEP) {
  problems.push(step >= WAF_MOVE_STEP
    ? 'topics-baseline.json: waf-shield.cloudfront 항목이 waf-shield.waf 바로 앞으로 옮겨져 있지 않다'
    : `topics-baseline.json: step ${WAF_MOVE_STEP} 전인데 waf-shield.cloudfront 항목이 옮겨져 있다`)
}
if (sha(baselineUndo.text) !== BASE.baseline) {
  problems.push('topics-baseline.json에서 parentId 줄과 WAF 이동 말고 바뀐 것이 있다')
}
const baseline = JSON.parse(baselineRaw)
for (const topic of baseline.topics) {
  for (const concept of topic.concepts) {
    const g = got.get(concept.id)
    if ((g?.[1]) !== concept.parentId) {
      problems.push(`스냅샷 ${concept.id}의 parentId(${concept.parentId})가 topics.json(${g?.[1]})과 다르다`)
    }
  }
}

if (problems.length) {
  for (const p of problems) console.log(`✗ ${p}`)
  console.log(`\nstep ${step} 위반 ${problems.length}건`)
  process.exit(1)
}
console.log(`✓ step ${step} — parentId ${got.size}개, 적용 주제 ${applied.size}개. 문항·본문·순서·스냅샷의 나머지는 착수 시점과 같다`)
