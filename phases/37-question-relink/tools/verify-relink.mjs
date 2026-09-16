#!/usr/bin/env node
/**
 * phase 37의 16건 재연결만 검증한다. 파일을 쓰거나 기준 해시를 갱신하지 않는다.
 * 사용법: node phases/37-question-relink/tools/verify-relink.mjs --pre | --post
 * 진단 번호는 step0.md의 검사 1~19에 대응한다. 위반은 모두 모아 exit 1로 보고한다.
 */
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = new URL('../../../', import.meta.url)
const PHASE = '37-question-relink'
const SPEC = `phases/${PHASE}/relink.json`
const QUESTIONS = 'src/data/questions.json'
const TOPICS = 'src/data/topics.json'
const STRUCTURE = 'scripts/topics-baseline.json'
const QUESTION_AUDIT = 'phases/35-question-topic-audit/audit/verdicts.jsonl'
const CONCEPT_AUDIT = 'phases/36-concept-topic-audit/audit/verdicts.jsonl'
const CROSS_AUDIT = 'phases/36-concept-topic-audit/audit/cross-phase35.jsonl'
const AUDITS = [QUESTION_AUDIT, CONCEPT_AUDIT, CROSS_AUDIT]
// 사람이 정한 범위만 상수로 둔다. from·to·type의 근거는 감사 파일이다.
const IDS = [
  'q037', 'q043', 'q045', 'q046', 'q061', 'q065', 'q068', 'q080',
  'q081', 'q086', 'q159', 'q165', 'q344', 'q465', 'q472', 'q508',
]
const SCOPE = new Set(IDS)
const QUESTION_FIELDS = ['id', 'topicId', 'conceptId', 'prompt', 'choices', 'answerIndex', 'explanation']
const problems = []
const report = (number, message) => problems.push(`[${number}] ${message}`)
const sha256 = (raw) => createHash('sha256').update(raw).digest('hex')
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const nonempty = (value) => typeof value === 'string' && value.length > 0

const [mode, ...extra] = process.argv.slice(2)
if (!['--pre', '--post'].includes(mode) || extra.length) {
  console.error('사용법: node phases/37-question-relink/tools/verify-relink.mjs --pre | --post')
  process.exit(1)
}

function read(path) {
  try {
    return readFileSync(fileURLToPath(new URL(path, ROOT)))
  } catch (error) {
    report('입력', `${path}: 파일을 읽을 수 없다 (${error.code})`)
    return null
  }
}

function parse(raw, path) {
  if (raw === null) return null
  try {
    return JSON.parse(raw.toString('utf8'))
  } catch {
    report('입력', `${path}: 올바른 JSON이 아니다`)
    return null
  }
}

function records(value, path, number) {
  if (!Array.isArray(value)) {
    report(number, `${path}: 배열이어야 한다`)
    return []
  }
  return value.filter((row, index) => {
    if (object(row)) return true
    report(number, `${path}: ${index + 1}번째 항목이 객체가 아니다`)
    return false
  })
}

function jsonl(raw, path) {
  if (raw === null) return []
  return raw.toString('utf8').split('\n').flatMap((line, index) => {
    if (!line.trim()) return []
    const row = parse(Buffer.from(line), `${path}:${index + 1}`)
    if (object(row)) return [row]
    report('입력', `${path}:${index + 1}: 감사 행이 객체가 아니다`)
    return []
  })
}

function indexBy(rows, key, path, number) {
  const index = new Map()
  for (const row of rows) {
    if (!nonempty(row[key])) report(number, `${path}: ${key}가 없다`)
    else if (index.has(row[key])) report(number, `${path}: ${row[key]} 중복`)
    else index.set(row[key], row)
  }
  return index
}

function sameLink(actual, expected) {
  return nonempty(actual?.topicId) && nonempty(actual?.conceptId) &&
    actual.topicId === expected?.topicId && actual.conceptId === expected?.conceptId
}

function checkHash(number, path, raw, expected) {
  if (raw === null || !/^[a-f0-9]{64}$/.test(expected ?? '') || sha256(raw) !== expected) {
    report(number, `${path}: sha256이 기준과 다르거나 기준 해시가 없다`)
  }
}

const spec = parse(read(SPEC), SPEC) ?? {}
const baseline = spec.baseline ?? {}
const items = Array.isArray(spec.items) ? spec.items : []
const rawQuestions = read(QUESTIONS)
const rawTopics = read(TOPICS)
const rawAudits = new Map(AUDITS.map((path) => [path, read(path)]))
const questions = records(parse(rawQuestions, QUESTIONS), QUESTIONS, 6)
const topics = records(parse(rawTopics, TOPICS), TOPICS, 6)
const questionIndex = indexBy(questions, 'id', QUESTIONS, 6)
const auditIndex = indexBy(jsonl(rawAudits.get(QUESTION_AUDIT), QUESTION_AUDIT), 'id', QUESTION_AUDIT, 2)
const crossIndex = indexBy(jsonl(rawAudits.get(CROSS_AUDIT), CROSS_AUDIT), 'conceptId', CROSS_AUDIT, 3)

// 1~4. 범위와 방향은 감사의 해당 행을 직접 대조한다.
const ids = items.map((item) => item?.id)
if (spec.phase !== PHASE) report(1, `phase는 ${PHASE}여야 한다`)
if (items.length !== IDS.length || new Set(ids).size !== IDS.length ||
    ids.some((id) => !SCOPE.has(id)) || IDS.some((id) => !ids.includes(id))) {
  report(1, `items는 지정한 16개 id를 중복 없이 가져야 한다: ${IDS.join(', ')}`)
}
if (ids.some((id, index) => id !== IDS[index])) report(1, 'items의 id는 오름차순이어야 한다')
if (spec.sources?.questionAudit !== QUESTION_AUDIT) report(2, `sources.questionAudit은 ${QUESTION_AUDIT}여야 한다`)
if (spec.sources?.crossAudit !== CROSS_AUDIT) report(3, `sources.crossAudit은 ${CROSS_AUDIT}여야 한다`)

for (const item of items) {
  const id = item?.id ?? '(id 없음)'
  const audit = auditIndex.get(id)
  if (!sameLink(item?.from, audit)) report(2, `${id}: from이 phase 35 감사의 topicId·conceptId와 다르다`)
  const recommended = { topicId: audit?.recommendedTopic, conceptId: audit?.recommendedConceptId }
  if (!sameLink(item?.to, recommended)) report(2, `${id}: to가 phase 35 감사의 권장 연결과 다르다`)
  const cross = crossIndex.get(item?.from?.conceptId)
  if (!cross || !['2A', '2B'].includes(item?.type) || item.type !== cross.type) {
    report(3, `${id}: type이 교차 감사의 2A·2B 분류와 다르다`)
  }
  if (item?.type === '2A' && item.from?.topicId !== item.to?.topicId) report(4, `${id}: 2A는 같은 주제 안에서 옮겨야 한다`)
  if (item?.type === '2B' && item.from?.topicId === item.to?.topicId) report(4, `${id}: 2B는 다른 주제로 옮겨야 한다`)
}
if (items.filter((item) => item?.type === '2A').length !== 14 ||
    items.filter((item) => item?.type === '2B').length !== 2) {
  report(3, '분류는 2A 14건·2B 2건이어야 한다')
}

// 5~8. 이름 접두사가 아니라 실제 개념 배치로 정합성과 전체 커버리지를 잰다.
const conceptTopics = new Map()
let conceptCount = 0
for (const topic of topics) {
  for (const concept of records(topic.concepts, `${TOPICS}:${topic.id}`, 6)) {
    conceptCount += 1
    if (!nonempty(concept.id) || !nonempty(topic.id)) report(6, '개념 또는 소속 주제의 id가 없다')
    else if (conceptTopics.has(concept.id)) report(6, `개념 id 중복: ${concept.id}`)
    else conceptTopics.set(concept.id, topic.id)
  }
}
for (const item of items) {
  const to = item?.to
  if (!conceptTopics.has(to?.conceptId) || conceptTopics.get(to?.conceptId) !== to?.topicId) {
    report(5, `${item?.id ?? '(id 없음)'}: 목적 개념 ${to?.conceptId}이 주제 ${to?.topicId}에 없다`)
  }
}
if (questions.length !== 732 || baseline.questionCount !== 732) report(6, `문항 수: ${questions.length}, baseline: ${baseline.questionCount} (필수 732)`)
if (conceptCount !== 618 || baseline.conceptCount !== 618) report(6, `개념 수: ${conceptCount}, baseline: ${baseline.conceptCount} (필수 618)`)

const coverage = new Map()
for (const question of questions) {
  const topicId = conceptTopics.get(question.conceptId)
  if (!topicId || topicId !== question.topicId) report(7, `${question.id}: ${question.topicId}에 근거 개념 ${question.conceptId}이 없다`)
  coverage.set(question.conceptId, (coverage.get(question.conceptId) ?? 0) + 1)
}
for (const conceptId of conceptTopics.keys()) {
  if (!coverage.get(conceptId)) report(8, `ADR-026: ${conceptId}에 문항이 0개다`)
}

// 9~12. 파일 바이트와 명세에 정의된 JSON.stringify 기본 출력만 해시한다.
checkHash(9, TOPICS, rawTopics, baseline.topicsSha256)
const auditHashes = object(baseline.auditSha256) ? baseline.auditSha256 : {}
if (Object.keys(auditHashes).length !== AUDITS.length || Object.keys(auditHashes).some((path) => !AUDITS.includes(path))) {
  report(10, 'baseline.auditSha256은 지정한 감사 파일 세 개의 해시를 모두 가져야 한다')
}
for (const path of AUDITS) checkHash(10, path, rawAudits.get(path), auditHashes[path])
const content = JSON.stringify(questions.map((q) => [q.id, q.answerIndex, q.prompt, q.choices, q.explanation]))
checkHash(11, '문항 본문 다이제스트', content, baseline.contentSha256)
// spec의 items가 변조되어도 범위 밖 문항을 검사에서 빼지 않도록 고정 목록을 쓴다.
const outside = questions.filter((q) => !SCOPE.has(q.id))
if (outside.length !== 716) report(12, `범위 밖 문항은 716개여야 한다 (현재 ${outside.length})`)
const links = JSON.stringify(outside.map((q) => [q.id, q.topicId, q.conceptId]))
checkHash(12, '범위 밖 연결 다이제스트', links, baseline.linksOutsideScopeSha256)

// 13. stringify 동등성만으로는 잡히지 않는 필드 순서·추가 필드도 함께 막는다.
const lines = (rawQuestions?.toString('utf8') ?? '').split('\n')
if (lines.length !== 736 || lines[0] !== '[' || lines.at(-2) !== ']' || lines.at(-1) !== '') {
  report(13, '문항 한 줄 포맷: split 원소 736개, 첫 줄 [, 끝의 ]와 파일 끝 개행이 필요하다')
}
// 앞·뒤 쉼표를 각각 하나만 떼어 검사한다. 원본의 혼합 배치와 쉼표 단독 줄은 바꾸지 않는다.
const bodies = lines.slice(1, -2).map((line) => line.replace(/^,/, '').replace(/,$/, ''))
const emptyCount = bodies.filter((text) => text === '').length
if (emptyCount !== 1) report(13, `문항 한 줄 포맷: 빈 본문 줄이 ${emptyCount}개다 (필수 1)`)
const questionLineCount = bodies.length - emptyCount
if (questionLineCount !== 732) report(13, `문항 한 줄 포맷: 문항 본문 줄이 ${questionLineCount}개다 (필수 732)`)
for (const [index, text] of bodies.entries()) {
  if (text === '') continue
  try {
    const question = JSON.parse(text)
    if (!text.startsWith('{"id":"q') || JSON.stringify(question) !== text ||
        JSON.stringify(Object.keys(question)) !== JSON.stringify(QUESTION_FIELDS)) {
      report(13, `${QUESTIONS}:${index + 2}: 문항 한 줄 포맷의 필드 순서·공백·필드 구성이 다르다`)
    }
  } catch {
    report(13, `${QUESTIONS}:${index + 2}: 한 줄에서 문항 JSON을 읽을 수 없다`)
  }
}

// 14~19. pre와 post는 같은 명세를 각각 변경 전·후 기준으로 확인한다.
const linkNumber = mode === '--pre' ? 14 : 17
const direction = mode === '--pre' ? 'from' : 'to'
for (const item of items) {
  const id = item?.id ?? '(id 없음)'
  if (!sameLink(questionIndex.get(id), item?.[direction])) report(linkNumber, `${id}: 현재 연결이 ${direction}과 다르다`)
}
if (mode === '--pre') {
  checkHash(15, QUESTIONS, rawQuestions, baseline.questionsSha256)
  // 한 원 개념에서 둘 이상 나갈 수 있다. 16건 전부를 적용한 결과를 세어야 한다.
  const targets = new Map(items.filter((item) => nonempty(item?.id)).map((item) => [item.id, item.to]))
  const remaining = new Map()
  for (const question of questions) {
    const conceptId = targets.has(question.id) ? targets.get(question.id)?.conceptId : question.conceptId
    remaining.set(conceptId, (remaining.get(conceptId) ?? 0) + 1)
  }
  const fromConcepts = new Set(items.map((item) => item?.from?.conceptId).filter(nonempty))
  for (const conceptId of fromConcepts) {
    if (!remaining.get(conceptId)) {
      const moving = items.filter((item) => item?.from?.conceptId === conceptId).map((item) => item.id)
      report(16, `ADR-026: ${moving.join(', ')} 이동 후 ${conceptId}에 문항이 0개 남는다`)
    }
  }
} else {
  const currentHash = rawQuestions === null ? null : sha256(rawQuestions)
  if (!/^[a-f0-9]{64}$/.test(baseline.questionsSha256 ?? '') || currentHash === null || currentHash === baseline.questionsSha256) {
    report(18, '문항 원문 sha256은 수정 전 기준과 달라야 한다')
  }
  const structure = parse(read(STRUCTURE), STRUCTURE)
  if (currentHash === null || structure?.questionsSha256 !== currentHash) report(19, `${STRUCTURE}: questionsSha256이 현재 문항 파일과 다르다`)
}

if (problems.length) {
  for (const problem of problems) console.error(`위반 ${problem}`)
  console.error(`재연결 검증 ${mode} 실패 — ${problems.length}건`)
  process.exit(1)
}
console.log(`재연결 검증 ${mode} 통과 — 16건(2A 14건·2B 2건), 문항 732개·개념 618개, 정합성·커버리지 100%·불변 조건 확인`)
