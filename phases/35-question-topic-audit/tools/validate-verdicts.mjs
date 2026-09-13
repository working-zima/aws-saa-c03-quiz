#!/usr/bin/env node
/**
 * 사람이 작성한 audit/verdicts.jsonl의 형식과 현재 데이터 참조를 검사한다.
 * ADR-034의 의미 판정은 만들거나 고치지 않는다. coverageConflict·retarget만
 * 명세의 식으로 다시 계산해 입력값과 대조한다. 파일은 읽기만 한다.
 *
 * 사용법: node phases/35-question-topic-audit/tools/validate-verdicts.mjs [--expect N] [--complete]
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const FIELDS = [
  'id', 'topicId', 'conceptId', 'scenarioServices', 'decidingKnowledge',
  'recommendedTopic', 'recommendedConceptId', 'secondaryTopics', 'conceptFit',
  'verdict', 'confidence', 'coverageConflict', 'retarget', 'rationale', 'reviewedBy', 'step',
]
const STRING_FIELDS = [
  'id', 'topicId', 'conceptId', 'decidingKnowledge', 'recommendedTopic',
  'conceptFit', 'verdict', 'rationale', 'reviewedBy',
]
const ENUMS = {
  verdict: ['keep', 'ambiguous', 'move-recommended'],
  conceptFit: ['yes', 'partial', 'no'],
  confidence: ['high', 'medium', 'low', null],
  retarget: ['ready', 'needs-design', null],
  reviewedBy: ['codex', 'claude'],
}
const nonemptyString = (value) => typeof value === 'string' && value.trim().length > 0

export function validateVerdicts(text, { questions, topics, expect, complete = false }) {
  const questionById = new Map(questions.map((question) => [question.id, question]))
  const topicIds = new Set(topics.map((topic) => topic.id))
  const conceptTopics = new Map(topics.flatMap((topic) =>
    topic.concepts.map((concept) => [concept.id, topic.id]),
  ))
  // 판정 파일의 일부 문항이 아니라 현재 문제 은행 전체에서 개념별 문항 수를 센다.
  const questionCounts = new Map()
  for (const question of questions) {
    questionCounts.set(question.conceptId, (questionCounts.get(question.conceptId) ?? 0) + 1)
  }

  const lines = text === '' ? [] : text.split(/\r?\n/)
  // 보통의 마지막 줄바꿈만 제외하고, 중간이나 끝에 추가된 빈 줄은 검사한다.
  if (text.endsWith('\n')) lines.pop()
  const errors = []
  const counts = { keep: 0, ambiguous: 0, 'move-recommended': 0 }
  const seen = new Map()
  const fail = (line, reason) => errors.push(`${line}줄: ${reason}`)

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1
    const invalid = (reason) => fail(lineNumber, reason)
    let row
    try {
      row = JSON.parse(line)
    } catch (error) {
      invalid(`JSON 하나를 읽을 수 없다: ${error.message}`)
      continue
    }
    if (row === null || typeof row !== 'object' || Array.isArray(row)) {
      invalid('판정은 16개 필드를 가진 JSON 객체여야 한다')
      continue
    }

    for (const field of FIELDS) {
      if (!Object.hasOwn(row, field)) invalid(`${field} 필드가 없다`)
    }
    for (const field of Object.keys(row)) {
      if (!FIELDS.includes(field)) invalid(`${field}: 고정 스키마에 없는 추가 필드다`)
    }
    for (const field of STRING_FIELDS) {
      if (!nonemptyString(row[field])) invalid(`${field}: 비어 있지 않은 문자열이어야 한다`)
    }
    for (const field of ['scenarioServices', 'secondaryTopics']) {
      if (!Array.isArray(row[field]) || !row[field].every(nonemptyString)) {
        invalid(`${field}: 비어 있지 않은 문자열들의 배열이어야 한다`)
      }
    }
    if (Array.isArray(row.scenarioServices) && row.scenarioServices.length === 0) {
      invalid('scenarioServices: 상황 서비스 또는 문항이 가르는 대상을 최소 1개 적어야 한다')
    }
    if (Array.isArray(row.secondaryTopics) && row.secondaryTopics.length > 2) {
      invalid('secondaryTopics: 최대 2개까지 허용한다')
    }
    if (typeof row.coverageConflict !== 'boolean') invalid('coverageConflict: boolean이어야 한다')
    if (!Number.isSafeInteger(row.step) || row.step < 0) invalid('step: 0 이상의 정수여야 한다')
    for (const [field, allowed] of Object.entries(ENUMS)) {
      if (!allowed.includes(row[field])) {
        invalid(`${field}: ${allowed.map((value) => JSON.stringify(value)).join(' | ')} 중 하나여야 한다`)
      }
    }

    const question = questionById.get(row.id)
    if (!question) {
      invalid(`id: 실재하지 않는 문항 ${JSON.stringify(row.id)}`)
    } else {
      if (seen.has(row.id)) invalid(`id: ${row.id} 중복 (첫 등장 ${seen.get(row.id)}줄)`)
      else seen.set(row.id, lineNumber)
      for (const field of ['topicId', 'conceptId']) {
        if (row[field] !== question[field]) {
          invalid(`${row.id} ${field}: 현재 값 ${JSON.stringify(question[field])}과 달라서는 안 된다`)
        }
      }
    }
    if (!topicIds.has(row.recommendedTopic)) {
      invalid(`recommendedTopic: 실재하지 않는 주제 ${JSON.stringify(row.recommendedTopic)}`)
    }
    if (row.recommendedConceptId !== null) {
      if (!nonemptyString(row.recommendedConceptId) || !conceptTopics.has(row.recommendedConceptId)) {
        invalid(`recommendedConceptId: null 또는 실재하는 개념 id여야 한다 (${JSON.stringify(row.recommendedConceptId)})`)
      } else if (conceptTopics.get(row.recommendedConceptId) !== row.recommendedTopic) {
        invalid(`recommendedConceptId: ${row.recommendedConceptId}는 recommendedTopic ${row.recommendedTopic} 소속이 아니다`)
      }
    }

    const moving = row.verdict === 'move-recommended'
    if (row.verdict === 'keep' && row.recommendedTopic !== row.topicId) {
      invalid('verdict: keep은 현재 주제만 권할 수 있다')
    }
    if (moving && row.recommendedTopic === row.topicId) {
      invalid('verdict: move-recommended는 다른 주제를 권해야 한다')
    }
    if (moving && !['high', 'medium', 'low'].includes(row.confidence)) {
      invalid('confidence: move-recommended에는 high·medium·low 중 하나가 필요하다')
    }
    if (['keep', 'ambiguous'].includes(row.verdict) && row.confidence !== null) {
      invalid('confidence: keep·ambiguous에서는 null이어야 한다')
    }
    // 재검토 신호 조합은 설명을 더 요구한다. 두 판단이 양립하는 이유 자체는 사람이 읽는다.
    const needsReviewExplanation = (moving && row.conceptFit === 'yes') ||
      (row.verdict === 'keep' && row.conceptFit === 'no')
    for (const [field, minimum] of [['decidingKnowledge', 15], ['rationale', needsReviewExplanation ? 80 : 30]]) {
      if (typeof row[field] === 'string' && [...row[field].trim()].length < minimum) {
        invalid(`${field}: 양끝 공백을 뺀 글이 ${minimum}자 이상이어야 한다`)
      }
    }

    if (question) {
      const coverageConflict = moving && row.recommendedConceptId != null &&
        row.recommendedConceptId !== question.conceptId && questionCounts.get(question.conceptId) === 1
      const retarget = !moving ? null :
        row.recommendedConceptId != null && !coverageConflict ? 'ready' : 'needs-design'
      if (row.coverageConflict !== coverageConflict) {
        invalid(`coverageConflict: 현재 문제 은행으로 재계산한 값은 ${coverageConflict}다`)
      }
      if (row.retarget !== retarget) {
        invalid(`retarget: 재계산한 값은 ${JSON.stringify(retarget)}다`)
      }
    }
    if (Object.hasOwn(counts, row.verdict)) counts[row.verdict] += 1
  }

  const endLine = lines.length + 1
  if (expect !== undefined && lines.length !== expect) {
    fail(endLine, `파일 끝: --expect ${expect}줄을 요구했지만 ${lines.length}줄이다`)
  }
  if (complete) {
    if (lines.length !== questions.length) {
      fail(endLine, `파일 끝: --complete는 전체 ${questions.length}문항을 요구하지만 ${lines.length}줄이다`)
    }
    const missing = questions.filter((question) => !seen.has(question.id)).map((question) => question.id)
    if (missing.length) fail(endLine, `파일 끝: 누락 문항 ${missing.length}개 — ${missing.join(', ')}`)
  }
  return { errors, counts }
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help')) {
    console.log(`사용법: node phases/35-question-topic-audit/tools/validate-verdicts.mjs [--expect N] [--complete]
입력: phases/35-question-topic-audit/audit/verdicts.jsonl (읽기 전용)
  --expect N   판정 줄 수가 정확히 N인지 검사한다.
  --complete   현재 문제 은행 732문항의 누락·중복 없이 전부 판정했는지 검사한다.
  --help       이 도움말을 출력한다.
위반은 줄 번호와 이유를 출력하고 exit 1, 통과는 판정 분포 한 줄과 exit 0이다.
의미 판정은 자동으로 만들지 않는다. coverageConflict·retarget만 재계산해 대조한다.`)
    return
  }
  const options = {}
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--complete' && !options.complete) {
      options.complete = true
    } else if (args[i] === '--expect' && options.expect === undefined) {
      const value = args[++i]
      if (!/^\d+$/.test(value ?? '') || !Number.isSafeInteger(Number(value))) {
        throw new Error('--expect 뒤에는 0 이상의 정수 N이 필요하다')
      }
      options.expect = Number(value)
    } else {
      throw new Error(`알 수 없거나 중복된 인자: ${args[i]} (--help 참고)`)
    }
  }
  const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
  const { errors, counts } = validateVerdicts(read('../audit/verdicts.jsonl'), {
    questions: JSON.parse(read('../../../src/data/questions.json')),
    topics: JSON.parse(read('../../../src/data/topics.json')),
    ...options,
  })
  if (errors.length) {
    for (const error of errors) console.error(error)
    process.exitCode = 1
  } else {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0)
    console.log(`판정 ${total}건 통과 · keep ${counts.keep} · ambiguous ${counts.ambiguous} · move-recommended ${counts['move-recommended']}`)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`1줄: 판정 검사 실패: ${error.message}`)
    process.exitCode = 1
  }
}
