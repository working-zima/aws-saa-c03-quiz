#!/usr/bin/env node
/**
 * 신호는 읽는 순서를 정하는 보조일 뿐이고, 신호가 없다고 `keep`이 아니며 있다고 이동 후보가 아니다.
 *
 * ADR-035 판정에 필요한 개념 전문·문항 연결·신호만 모은다. 판정은 만들지 않는다.
 * JSONL은 개념마다 JSON 한 줄이어야 하므로 안내 주석은 여기와 실행 출력에 둔다.
 * 사용법: node phases/36-concept-topic-audit/tools/build-concept-worksheet.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PHASE = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = join(PHASE, '../..')
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'))

const excludedSources = new Set(['aws-core-services', 's3-storage-classes'])
// 단독으로 나온 일반 낱말만 버린다. Storage Gateway·Kinesis Data Streams처럼
// 고유명사 구의 일부인 낱말은 지우지 않아 이름이 잘리거나 이어 붙지 않게 한다.
const commonWords = new Set([
  'AWS', 'Amazon', 'Service', 'Services', 'Data', 'Storage', 'Type', 'Types',
  'Group', 'Groups', 'Policy', 'Policies', 'Access', 'Control', 'List', 'Name',
  'Key', 'Management', 'Security', 'Network', 'Request', 'Response', 'Connection',
  'Server', 'Client', 'Instance', 'Account', 'Region', 'Zone', 'Version', 'Mode',
  'Standard', 'Custom', 'Advanced', 'Global', 'Local', 'Default', 'Target',
  'Source', 'Destination', 'Read', 'Write', 'Edge', 'Size', 'Time', 'Status',
])

const commonPatterns = [
  ['EventBridge', 'sqs-sns-eventbridge'],
  ['SNS', 'sqs-sns-eventbridge'],
  ['SQS', 'sqs-sns-eventbridge'],
  ['IAM', 'iam-permissions'],
  ['CloudWatch', 'cloudwatch-xray'],
  ['X-Ray', 'cloudwatch-xray'],
  ['Organizations', 'organizations-cloudtrail-config'],
  ['CloudTrail', 'organizations-cloudtrail-config'],
  ['AWS Config', 'organizations-cloudtrail-config'],
  ['Cost Explorer', 'cost-management'],
  ['Budgets', 'cost-management'],
  ['KMS', 'secrets-encryption'],
  ['계정 간', null],
  ['교차 계정', null],
].map(([name, ownerTopic]) => ({ name, ownerTopic }))

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// 영문 이름에 붙는 한글 조사는 허용하되 DataSyncExtra·_DataSync 같은 부분 일치는 막는다.
const namePattern = (name) => new RegExp(`(?<![A-Za-z0-9_])${escapeRegex(name)}(?![A-Za-z0-9_])`)

function properNames(name) {
  // 대문자로 시작하는 연속 낱말을 한 구로 잡는다. 숫자는 Route 53처럼 앞 이름에 붙인다.
  const phrases = name.match(/(?<![A-Za-z0-9_])[A-Z][A-Za-z0-9]*(?:[-@][A-Za-z0-9]+)*(?:\s+(?:[A-Z][A-Za-z0-9]*(?:[-@][A-Za-z0-9]+)*|[0-9]+))*/g) ?? []
  return phrases
    .map((phrase) => phrase.replace(/^(?:(?:AWS|Amazon)\s+)+/, '').replace(/\s+/g, ' '))
    .filter((phrase) => !commonWords.has(phrase))
}

function serviceDictionary(topics) {
  const sources = topics.filter((topic) => !excludedSources.has(topic.id))
  const candidates = new Set(sources.flatMap((topic) => topic.concepts.flatMap((c) => properNames(c.name))))
  const dictionary = []
  for (const name of candidates) {
    const pattern = namePattern(name)
    // 다른 긴 이름의 일부로 등장해도 두 주제에 쓰인 이름이면 변별력이 없다.
    const owners = sources.filter((topic) => topic.concepts.some((c) => pattern.test(c.name)))
    if (owners.length === 1) dictionary.push({ name, topicId: owners[0].id, pattern })
  }
  return dictionary
}

function words(text) {
  return new Set((text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => [...word].length >= 2))
}

function jaccard(left, right) {
  let intersection = 0
  for (const word of left) if (right.has(word)) intersection += 1
  const union = left.size + right.size - intersection
  return union === 0 ? 0 : intersection / union
}

function buildWorksheet(topics, questions) {
  const questionIdsByConcept = new Map()
  for (const question of questions) {
    if (!questionIdsByConcept.has(question.conceptId)) questionIdsByConcept.set(question.conceptId, [])
    questionIdsByConcept.get(question.conceptId).push(question.id)
  }
  const dictionary = serviceDictionary(topics)
  const patterns = commonPatterns.map((pattern) => ({ ...pattern, matcher: namePattern(pattern.name) }))
  const concepts = topics.flatMap((topic) => topic.concepts)
  const tokens = concepts.map((c) => words(`${c.name} ${c.summary}`))
  const conceptIndexes = new Map(concepts.map((c, index) => [c.id, index]))

  return topics.flatMap((topic) => topic.concepts.map((concept, position) => {
    const content = [concept.name, concept.summary, ...concept.paragraphs].join('\n')
    const foreignServiceMentions = {}
    for (const entry of dictionary) {
      if (entry.topicId === topic.id || !entry.pattern.test(content)) continue
      foreignServiceMentions[entry.topicId] ??= []
      foreignServiceMentions[entry.topicId].push(entry.name)
    }
    const nearDuplicateCandidates = concepts
      .map((candidate, index) => ({
        conceptId: candidate.id,
        score: jaccard(tokens[conceptIndexes.get(concept.id)], tokens[index]),
      }))
      .filter((candidate) => candidate.conceptId !== concept.id && candidate.score >= 0.25)
      // 동점이면 원래 주제·개념 배열 순서다. 안정 정렬로 재생성 결과를 고정한다.
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
    const questionIds = questionIdsByConcept.get(concept.id) ?? []
    return {
      conceptId: concept.id,
      topicId: topic.id,
      topicTitle: topic.title,
      name: concept.name,
      summary: concept.summary,
      paragraphs: concept.paragraphs,
      position: position + 1,
      topicConceptCount: topic.concepts.length,
      questionCount: questionIds.length,
      questionIds,
      blockNeighbors: {
        prev: topic.concepts[position - 1]?.id ?? null,
        next: topic.concepts[position + 1]?.id ?? null,
      },
      signals: {
        foreignServiceMentions,
        commonPatternMentions: patterns
          .filter((pattern) => pattern.ownerTopic !== topic.id && pattern.matcher.test(content))
          .map(({ name, ownerTopic }) => ({ name, ownerTopic })),
        comparisonShape: /vs|비교|차이|고르|선택 기준|대신|구분/i.test(`${concept.name}\n${concept.summary}`),
        nearDuplicateCandidates,
      },
    }
  }))
}

try {
  const rows = buildWorksheet(read('src/data/topics.json'), read('src/data/questions.json'))
  mkdirSync(join(PHASE, 'audit'), { recursive: true })
  writeFileSync(join(PHASE, 'audit/concepts.jsonl'), rows.map((row) => JSON.stringify(row)).join('\n') + '\n')
  console.log('신호는 읽는 순서를 정하는 보조일 뿐이고, 신호가 없다고 `keep`이 아니며 있다고 이동 후보가 아니다.')
  const counts = {
    foreignServiceMentions: rows.filter((row) => Object.keys(row.signals.foreignServiceMentions).length > 0).length,
    commonPatternMentions: rows.filter((row) => row.signals.commonPatternMentions.length > 0).length,
    comparisonShape: rows.filter((row) => row.signals.comparisonShape).length,
    nearDuplicateCandidates: rows.filter((row) => row.signals.nearDuplicateCandidates.length > 0).length,
  }
  console.log(`워크시트 ${rows.length}줄 · 문항 합 ${rows.reduce((sum, row) => sum + row.questionCount, 0)} · 신호가 있는 개념 수 ${JSON.stringify(counts)}`)
} catch (error) {
  console.error(`워크시트 생성 실패: ${error.message}`)
  process.exitCode = 1
}
