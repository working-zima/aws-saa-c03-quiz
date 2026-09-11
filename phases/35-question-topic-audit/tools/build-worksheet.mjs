#!/usr/bin/env node
/**
 * 판정용 워크시트: 문항 전문과 현재 개념 연결, 다른 주제의 서비스 이름 신호를 모은다.
 *
 * 이 신호는 판정이 아니라 읽는 순서를 정하는 보조다.
 * 신호가 없다고 keep이 아니고, 있다고 이동 후보가 아니다.
 *
 * 워크시트 머리주석은 여기에 둔다. audit/worksheet.jsonl은 매 줄 JSON 하나인
 * 732줄 자료이므로 주석 줄이나 메타데이터 행을 섞지 않는다. 판정은 만들지 않는다.
 * 사용법: node phases/35-question-topic-audit/tools/build-worksheet.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const EXCLUDED_TOPICS = new Set(['aws-core-services', 's3-storage-classes'])

// 한 낱말만으로는 서비스 이름을 구별하지 못하는 일반어다. 고유명사 구 안에서는
// 버리지 않는다: Simple Notification Service, Global Accelerator 등이 보존된다.
const COMMON_WORDS = new Set([
  'AWS', 'Amazon', 'Service', 'Services', 'Data', 'Storage', 'Performance', 'Container',
  'Access', 'Account', 'Advanced', 'Application', 'Auto', 'Availability', 'Backup',
  'Batch', 'Billing', 'Block', 'Bucket', 'Cache', 'Capacity', 'Client', 'Cloud',
  'Cluster', 'Command', 'Compute', 'Connection', 'Control', 'Copy', 'Cost', 'Custom',
  'Database', 'Default', 'Directory', 'Discovery', 'Edge', 'Elastic', 'Endpoint',
  'Event', 'Express', 'File', 'Flexible', 'Function', 'Functions', 'Gateway',
  'Global', 'Group', 'Identity', 'Image', 'Instance', 'Intelligent', 'Internet',
  'Inventory', 'Key', 'Layer', 'List', 'Local', 'Log', 'Logs', 'Managed',
  'Management', 'Manager', 'Map', 'Memory', 'Multi', 'Network', 'Notification',
  'Object', 'On', 'Optimized', 'Policy', 'Private', 'Public', 'Queue', 'Read',
  'Reader', 'Recovery', 'Region', 'Request', 'Resource', 'Role', 'Route', 'Rule',
  'Scaling', 'Security', 'Server', 'Serverless', 'Session', 'Simple', 'Single',
  'Snapshot', 'Standard', 'State', 'Stream', 'Streams', 'System', 'Systems',
  'Table', 'Target', 'Task', 'Tiering', 'Time', 'Token', 'Transfer', 'Type',
  'User', 'Version', 'Virtual', 'Volume', 'Web', 'Workload', 'Zone',
])

function serviceDictionary(topics) {
  const owners = new Map()
  // 대문자로 시작하는 낱말의 연속을 하나의 이름으로 읽는다. X-Ray·Lambda@Edge
  // 같은 이름의 내부 구분자는 보존하고, 괄호·쉼표·한국어 조사는 구를 나눈다.
  const word = '[A-Z][A-Za-z0-9]*(?:[-@][A-Za-z0-9]+)*'
  const phrase = new RegExp(`\\b${word}(?:\\s+${word})*\\b`, 'g')
  for (const topic of topics) {
    for (const concept of topic.concepts) {
      for (const match of concept.name.matchAll(phrase)) {
        const name = match[0].replace(/\s+/g, ' ')
        if (COMMON_WORDS.has(name)) continue
        if (!owners.has(name)) owners.set(name, new Set())
        owners.get(name).add(topic.id)
      }
    }
  }

  const dictionary = []
  for (const [name, topicIds] of owners) {
    // 여러 개념에서 반복되어도 주제가 하나면 남긴다. 주제 둘 이상이면 버린다.
    if (topicIds.size !== 1) continue
    const [topicId] = topicIds
    if (EXCLUDED_TOPICS.has(topicId)) continue
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    dictionary.push({ name, topicId, pattern: new RegExp(`\\b${escaped}\\b`) })
  }
  return dictionary
}

export function buildWorksheet(questions, topics) {
  const topicById = new Map(topics.map((topic) => [topic.id, topic]))
  const conceptById = new Map(topics.flatMap((topic) =>
    topic.concepts.map((concept) => [concept.id, { topicId: topic.id, concept }]),
  ))
  const questionCounts = new Map()
  for (const question of questions) {
    questionCounts.set(question.conceptId, (questionCounts.get(question.conceptId) ?? 0) + 1)
  }
  const dictionary = serviceDictionary(topics)

  return questions.map((question) => {
    const topic = topicById.get(question.topicId)
    const linked = conceptById.get(question.conceptId)
    if (!topic || !linked || linked.topicId !== question.topicId) {
      throw new Error(`${question.id}: 현재 topicId·conceptId 연결을 확인할 수 없다`)
    }
    const text = [question.prompt, ...question.choices, question.explanation].join('\n')
    const foreignTopics = {}
    for (const entry of dictionary) {
      if (entry.topicId === question.topicId || !entry.pattern.test(text)) continue
      if (!foreignTopics[entry.topicId]) foreignTopics[entry.topicId] = []
      foreignTopics[entry.topicId].push(entry.name)
    }
    const questionsInConcept = questionCounts.get(question.conceptId)
    return {
      id: question.id,
      topicId: question.topicId,
      conceptId: question.conceptId,
      topicTitle: topic.title,
      conceptName: linked.concept.name,
      prompt: question.prompt,
      choices: question.choices,
      answerIndex: question.answerIndex,
      explanation: question.explanation,
      questionsInConcept,
      soleQuestionForConcept: questionsInConcept === 1,
      signals: { foreignTopics },
    }
  })
}

function main() {
  const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
  const rows = buildWorksheet(
    read('../../../src/data/questions.json'),
    read('../../../src/data/topics.json'),
  )
  const output = new URL('../audit/worksheet.jsonl', import.meta.url)
  mkdirSync(dirname(fileURLToPath(output)), { recursive: true })
  writeFileSync(output, rows.map((row) => JSON.stringify(row)).join('\n') + '\n')
  console.log(`워크시트 ${rows.length}줄 · 유일 문항 ${rows.filter((row) => row.soleQuestionForConcept).length}건`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`워크시트 생성 실패: ${error.message}`)
    process.exitCode = 1
  }
}
