#!/usr/bin/env node
/**
 * ADR-035의 사람이 쓴 판정만 검사한다. 신호에서 판정·학습 목표를 만들지 않는다.
 * 사용법: node phases/36-concept-topic-audit/tools/validate-verdicts.mjs [--expect N] [--complete]
 * 기본은 부분 판정도 허용한다. --complete는 현재 개념 전부(618개)의 누락을 검사한다.
 * 근거의 의미·두 해석의 충실성·블록 위치의 적합성은 사람이 읽어 확인해야 한다.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PHASE = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = join(PHASE, '../..')
const FIELDS = [
  'conceptId', 'topicId', 'name', 'learningGoal', 'serviceSpecificGoal', 'fit',
  'recommendedTopic', 'confidence', 'questionCount', 'questionIds', 'duplicateOf',
  'blockImpact', 'rationale', 'reviewedBy', 'step',
]
const STRING_FIELDS = ['conceptId', 'topicId', 'name', 'learningGoal', 'fit', 'recommendedTopic', 'rationale', 'reviewedBy']
const FITS = ['keep', 'ambiguous', 'move-recommended']
const CONFIDENCES = ['high', 'medium', 'low']
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0
const length = (value) => typeof value === 'string' ? [...value.trim()].length : 0

function options(args) {
  let expect = null
  let complete = false
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--complete') {
      complete = true
    } else if (args[index] === '--expect') {
      const value = args[++index]
      if (expect !== null || !/^\d+$/.test(value ?? '') || !Number.isSafeInteger(Number(value))) {
        throw new Error('--expect에는 0 이상의 안전한 정수를 한 번 지정해야 한다.')
      }
      expect = Number(value)
    } else {
      throw new Error(`알 수 없는 인자: ${args[index]} (--help로 사용법 확인)`)
    }
  }
  return { expect, complete }
}

function validate(text, topics, questions, { expect, complete }) {
  const byId = new Map(topics.flatMap((topic) => topic.concepts.map((c) => [c.id, { topicId: topic.id, name: c.name }])))
  const topicIds = new Set(topics.map((topic) => topic.id))
  const questionIdsByConcept = new Map()
  for (const question of questions) {
    if (!questionIdsByConcept.has(question.conceptId)) questionIdsByConcept.set(question.conceptId, [])
    questionIdsByConcept.get(question.conceptId).push(question.id)
  }
  // 맨 끝 개행 하나만 허용한다. 중간의 빈 줄을 버리면 오류 줄 번호와 --expect가 어긋난다.
  const lines = text === '' ? [] : text.split(/\r?\n/)
  if (lines.at(-1) === '') lines.pop()
  const errors = []
  const seen = new Map()
  const counts = Object.fromEntries(FITS.map((fit) => [fit, 0]))
  const error = (line, message) => errors.push(`${line}줄: ${message}`)

  for (const [index, line] of lines.entries()) {
    const number = index + 1
    let row
    try {
      row = JSON.parse(line)
    } catch {
      error(number, 'JSON 객체 하나가 필요하다. 빈 줄 또는 JSON 문법을 확인하라.')
      continue
    }
    if (row === null || typeof row !== 'object' || Array.isArray(row)) {
      error(number, '판정은 JSON 객체 하나여야 한다.')
      continue
    }

    for (const field of FIELDS) {
      if (!Object.hasOwn(row, field)) error(number, `필수 필드 없음: ${field}`)
    }
    for (const field of Object.keys(row)) {
      if (!FIELDS.includes(field)) error(number, `스키마 밖 필드: ${field} (정확히 15개 필드만 허용)`)
    }
    for (const field of STRING_FIELDS) {
      if (!nonempty(row[field])) error(number, `${field}는 비어 있지 않은 문자열이어야 한다.`)
    }
    for (const field of ['confidence', 'duplicateOf', 'blockImpact']) {
      if (row[field] !== null && !nonempty(row[field])) error(number, `${field}는 null 또는 비어 있지 않은 문자열이어야 한다.`)
    }

    const concept = byId.get(row.conceptId)
    if (!concept) {
      error(number, `실재하지 않는 conceptId: ${JSON.stringify(row.conceptId)}`)
    } else {
      if (seen.has(row.conceptId)) error(number, `중복 conceptId: ${row.conceptId} (첫 등장은 ${seen.get(row.conceptId)}줄)`)
      else seen.set(row.conceptId, number)
      if (row.topicId !== concept.topicId) error(number, `topicId는 실제 소속 ${concept.topicId}여야 한다.`)
      if (row.name !== concept.name) error(number, `name이 현재 데이터와 다르다: ${JSON.stringify(concept.name)}`)
    }
    if (typeof row.conceptId !== 'string' || typeof row.topicId !== 'string' || !row.conceptId.startsWith(`${row.topicId}.`)) {
      error(number, 'conceptId는 <topicId>.로 시작해야 한다.')
    }
    if (!FITS.includes(row.fit)) error(number, 'fit은 keep·ambiguous·move-recommended 중 하나여야 한다.')
    else counts[row.fit] += 1
    if (row.confidence !== null && !CONFIDENCES.includes(row.confidence)) error(number, 'confidence는 high·medium·low·null 중 하나여야 한다.')
    if (!['codex', 'claude'].includes(row.reviewedBy)) error(number, 'reviewedBy는 codex·claude 중 하나여야 한다.')
    if (typeof row.serviceSpecificGoal !== 'boolean') error(number, 'serviceSpecificGoal은 boolean이어야 한다.')
    if (!Number.isInteger(row.step)) error(number, 'step은 정수여야 한다.')
    if (!topicIds.has(row.recommendedTopic)) error(number, `실재하지 않는 recommendedTopic: ${JSON.stringify(row.recommendedTopic)}`)

    if (row.fit === 'keep') {
      if (row.recommendedTopic !== row.topicId) error(number, 'keep의 recommendedTopic은 현재 topicId와 같아야 한다.')
      if (row.confidence !== null) error(number, 'keep의 confidence는 null이어야 한다.')
      if (row.blockImpact !== null) error(number, 'keep의 blockImpact는 null이어야 한다.')
    } else if (row.fit === 'move-recommended') {
      if (row.recommendedTopic === row.topicId) error(number, 'move-recommended는 다른 주제를 권해야 한다.')
      if (!CONFIDENCES.includes(row.confidence)) error(number, 'move-recommended에는 confidence가 필요하다.')
      if (length(row.blockImpact) < 10) error(number, 'blockImpact에 대상 주제의 서비스 블록과 삽입 위치를 10자 이상 적어야 한다.')
    } else if (row.fit === 'ambiguous') {
      if (row.confidence !== null) error(number, 'ambiguous의 confidence는 null이어야 한다.')
      if (length(row.rationale) < 80) error(number, 'ambiguous의 rationale에 두 해석을 모두 80자 이상 적어야 한다.')
    }

    const expectedIds = questionIdsByConcept.get(row.conceptId) ?? []
    if (!Number.isInteger(row.questionCount) || row.questionCount !== expectedIds.length) {
      error(number, `questionCount는 questions.json에서 센 ${expectedIds.length}여야 한다.`)
    }
    if (!Array.isArray(row.questionIds) || !row.questionIds.every(nonempty)) {
      error(number, 'questionIds는 비어 있지 않은 문항 id 문자열의 배열이어야 한다.')
    } else {
      const ids = new Set(row.questionIds)
      if (row.questionIds.length !== expectedIds.length || ids.size !== row.questionIds.length || expectedIds.some((id) => !ids.has(id))) {
        error(number, `questionIds의 개수·집합이 questions.json과 다르다. 기대값: ${JSON.stringify(expectedIds)}`)
      }
    }
    if (row.duplicateOf !== null && (!byId.has(row.duplicateOf) || row.duplicateOf === row.conceptId)) {
      error(number, 'duplicateOf는 null 또는 실재하는 다른 개념의 id여야 한다.')
    }
    if (length(row.learningGoal) < 15) error(number, 'learningGoal은 15자 이상이어야 한다.')
    if (length(row.rationale) < 30) error(number, 'rationale은 30자 이상이어야 한다.')
    if ((row.fit === 'move-recommended' && row.serviceSpecificGoal === true) || (row.fit === 'keep' && row.duplicateOf !== null)) {
      if (length(row.rationale) < 80) error(number, '재검토 신호 조합의 rationale은 80자 이상이어야 한다.')
    }
  }

  if (expect !== null && lines.length !== expect) error(lines.length + 1, `파일 끝: --expect ${expect}와 실제 ${lines.length}줄이 다르다.`)
  if (complete) {
    const missing = [...byId.keys()].filter((id) => !seen.has(id))
    if (missing.length > 0) error(lines.length + 1, `파일 끝: --complete 개념 ${missing.length}개 누락: ${missing.join(', ')}`)
  }
  return { errors, counts, total: lines.length }
}

try {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--help') {
    console.log('사용법: node phases/36-concept-topic-audit/tools/validate-verdicts.mjs [--expect N] [--complete]\n입력: audit/verdicts.jsonl (phase 디렉토리 기준)\n--expect N: 정확히 N줄 검사\n--complete: 현재 618개 개념의 누락 검사\n통과 시 판정 분포와 exit 0, 위반 시 줄 번호·이유와 exit 1. 의미 판정은 사람이 확인한다.')
  } else {
    const settings = options(args)
    const topics = JSON.parse(readFileSync(join(ROOT, 'src/data/topics.json'), 'utf8'))
    const questions = JSON.parse(readFileSync(join(ROOT, 'src/data/questions.json'), 'utf8'))
    const text = readFileSync(join(PHASE, 'audit/verdicts.jsonl'), 'utf8')
    const result = validate(text, topics, questions, settings)
    if (result.errors.length > 0) {
      for (const message of result.errors) console.error(message)
      process.exitCode = 1
    } else {
      console.log(`판정 ${result.total}줄 통과 · ${FITS.map((fit) => `${fit} ${result.counts[fit]}`).join(' · ')}`)
    }
  }
} catch (error) {
  console.error(`판정 검사 실패: ${error.message}`)
  process.exitCode = 1
}
