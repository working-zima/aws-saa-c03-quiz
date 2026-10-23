/**
 * phase 66 콘텐츠 변경 규칙 — `changes.json`의 네 부분을 데이터 세 파일의 원문 문자열에 적용한다.
 * `apply.mjs`(작업 트리에 쓴다)와 `../verify-content.mjs`(기대값을 메모리에서 만든다)가 함께 쓴다.
 *
 * | 부분 | step | 바꾸는 것 |
 * |---|---|---|
 * | A `importance` | 0 | topics.json 주제 머리 줄의 importance, 스냅샷의 importance |
 * | B `emphasis` | 1 | 개념 문단 하나를 `before`에서 `after`로(`**` 표지만 더한 글) |
 * | C `renames` | 3 | 개념 name, 스냅샷의 name |
 * | D `newConcepts`·`newQuestions` | 4 | 앵커 개념 줄 바로 아래 새 개념 한 줄, 문항 파일 끝 문항, 스냅샷 항목·conceptLineCount·questionsSha256 |
 *
 * 줄 단위로만 고친다. 파일 전체를 재직렬화하면 개념 한 줄 포맷이 깨진다(check-structure.mjs 1번 검사).
 * 고칠 자리의 지금 값이 기대와 다르면 던진다 — 부분을 두 번 적용하거나 순서를 건너뛴 것이다.
 */
import { createHash } from 'node:crypto'

export const PARTS = ['A', 'B', 'C', 'D']

const conceptLinePrefix = (id) => `      {"id":${JSON.stringify(id)},`

function editConceptLine(lines, id, edit) {
  const index = lines.findIndex((line) => line.startsWith(conceptLinePrefix(id)))
  if (index < 0) throw new Error(`개념 줄이 없다: ${id}`)
  const trail = lines[index].endsWith(',') ? ',' : ''
  const body = lines[index].slice(6, lines[index].length - trail.length)
  const concept = JSON.parse(body)
  if (JSON.stringify(concept) !== body) throw new Error(`개념 줄을 다시 쓰면 글자가 달라진다: ${id}`)
  edit(concept)
  lines[index] = '      ' + JSON.stringify(concept) + trail
  return index
}

function applyImportance(files, importance) {
  const lines = files.topics.split('\n')
  for (const [topicId, value] of Object.entries(importance)) {
    const index = lines.findIndex((line) => line.startsWith(`    "id":${JSON.stringify(topicId)},"title":`))
    if (index < 0) throw new Error(`주제 머리 줄이 없다: ${topicId}`)
    const next = lines[index].replace(/"importance":\d,/, `"importance":${value},`)
    if (next === lines[index]) throw new Error(`importance가 이미 ${value}다: ${topicId}`)
    lines[index] = next
    const pattern = new RegExp(`("id": ${escape(JSON.stringify(topicId))},\\n   "title": "[^"]*",\\n   "importance": )\\d`)
    if (!pattern.test(files.baseline)) throw new Error(`스냅샷 주제가 없다: ${topicId}`)
    files.baseline = files.baseline.replace(pattern, `$1${value}`)
  }
  files.topics = lines.join('\n')
}

function applyEmphasis(files, emphasis) {
  const lines = files.topics.split('\n')
  for (const { conceptId, paragraphIndex, before, after } of emphasis) {
    if (after.replaceAll('**', '') !== before.replaceAll('**', '')) throw new Error(`표지 밖의 글이 다르다: ${conceptId}[${paragraphIndex}]`)
    editConceptLine(lines, conceptId, (concept) => {
      if (concept.paragraphs[paragraphIndex] !== before) throw new Error(`문단이 before와 다르다: ${conceptId}[${paragraphIndex}]`)
      concept.paragraphs[paragraphIndex] = after
    })
  }
  files.topics = lines.join('\n')
}

function applyRenames(files, renames) {
  const lines = files.topics.split('\n')
  for (const { conceptId, before, after } of renames) {
    editConceptLine(lines, conceptId, (concept) => {
      if (concept.name !== before) throw new Error(`이름이 before와 다르다: ${conceptId}`)
      concept.name = after
    })
    const pattern = new RegExp(
      `("id": ${escape(JSON.stringify(conceptId))},\\n(?:     "parentId": "[^"]*",\\n)?     "name": )${escape(JSON.stringify(before))}\\n`,
    )
    if (!pattern.test(files.baseline)) throw new Error(`스냅샷 이름이 before와 다르다: ${conceptId}`)
    files.baseline = files.baseline.replace(pattern, (_, head) => `${head}${JSON.stringify(after)}\n`)
  }
  files.topics = lines.join('\n')
}

function applyNew(files, newConcepts, newQuestions) {
  const lines = files.topics.split('\n')
  for (const { after, concept } of newConcepts) {
    if (lines.some((line) => line.startsWith(conceptLinePrefix(concept.id)))) throw new Error(`개념이 이미 있다: ${concept.id}`)
    const index = lines.findIndex((line) => line.startsWith(conceptLinePrefix(after)))
    if (index < 0 || !lines[index].endsWith(',')) throw new Error(`앵커가 없거나 주제의 마지막 개념이다: ${after}`)
    lines.splice(index + 1, 0, '      ' + JSON.stringify(concept) + ',')
    const anchor = new RegExp(
      `    \\{\\n     "id": ${escape(JSON.stringify(after))},\\n(?:     "parentId": "[^"]*",\\n)?     "name": "[^"]*"\\n    \\},\\n`,
    )
    const match = anchor.exec(files.baseline)
    if (!match) throw new Error(`스냅샷 앵커가 없다: ${after}`)
    const entry = `    {\n     "id": ${JSON.stringify(concept.id)},\n     "parentId": ${JSON.stringify(concept.parentId)},\n     "name": ${JSON.stringify(concept.name)}\n    },\n`
    const end = match.index + match[0].length
    files.baseline = files.baseline.slice(0, end) + entry + files.baseline.slice(end)
  }
  files.topics = lines.join('\n')

  const qlines = files.questions.split('\n')
  const close = qlines.lastIndexOf(']')
  if (close < 1 || qlines[close - 1].endsWith(',')) throw new Error('문항 파일 끝 모양이 다르다')
  qlines[close - 1] += ','
  const added = newQuestions.map((question, i) => JSON.stringify(question) + (i < newQuestions.length - 1 ? ',' : ''))
  qlines.splice(close, 0, ...added)
  files.questions = qlines.join('\n')

  files.baseline = files.baseline.replace(/"conceptLineCount": (\d+)/, (_, n) => `"conceptLineCount": ${Number(n) + newConcepts.length}`)
  const sha = createHash('sha256').update(files.questions, 'utf8').digest('hex')
  files.baseline = files.baseline.replace(/"questionsSha256": "[0-9a-f]+"/, `"questionsSha256": "${sha}"`)
}

/** files: { topics, questions, baseline } 원문. 부분 하나를 적용해 같은 모양의 새 객체를 돌려준다. */
export function applyPart(input, changes, part) {
  const files = { ...input }
  if (part === 'A') applyImportance(files, changes.importance)
  else if (part === 'B') applyEmphasis(files, changes.emphasis)
  else if (part === 'C') applyRenames(files, changes.renames)
  else if (part === 'D') applyNew(files, changes.newConcepts, changes.newQuestions)
  else throw new Error(`알 수 없는 부분: ${part}`)
  return files
}

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
