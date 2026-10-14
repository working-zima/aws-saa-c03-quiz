#!/usr/bin/env node
/**
 * phase 58 일회성 가드레일 — WAF의 Web ACL 정의(ADR-039 「2026-10-14 확장」)가 `changes.json`을 적용한 결과와 한 글자도 다르지 않은지 본다.
 *
 * 사용법: node phases/58-waf-web-acl/verify-waf-web-acl.mjs
 *
 * 기준은 설계 커밋(`git merge-base HEAD develop`)의 파일이다. 이 스크립트는 그 파일에 `changes.json`을 적용한 기대값을 메모리에서
 * 만들고 작업 트리의 파일과 비교한다. **파일을 쓰지 않는다.** 저장소 공용 테스트로 올리지 마라 — 이 phase가 끝난 뒤 콘텐츠를
 * 정당하게 고치면 영구히 실패한다.
 *
 * | 검사 | 무엇을 보장하나 |
 * |---|---|
 * | topics.json = 기대값 | 개념 3줄의 paragraphs만 명세 글자 그대로 바뀌고 나머지 줄은 그대로다 |
 * | questions.json = 기대값 | 문항 3줄에서 명세한 구절 5곳만 바뀌고 나머지 줄·필드는 그대로다 |
 * | topics-baseline.json = 기대값 | questionsSha256만 새 questions.json의 해시로 바뀌었다 |
 * | `웹 ACL` 없음 | 개념·문항 데이터에 옛 표기가 남지 않았다 |
 * | data.test.ts | 기준 파일 뒤에 덧붙이기만 했고, `describe('ADR-039 확장 — WAF의 Web ACL'` 블록이 있다 |
 * | 바뀐 파일 목록 | 데이터 둘·스냅샷·data.test.ts·phase 메타데이터 말고 바뀐 파일·새 파일이 없다 |
 *
 * 기대값을 만드는 규칙(줄 단위, 파일 재직렬화 없음):
 * - topics.json: 바꿀 줄은 `      {"id":"<id>",`로 시작하는 줄이다. 앞 공백 6칸과 끝 쉼표를 떼고 JSON.parse → `paragraphs`에 명세의
 *   값을 대입 → JSON.stringify → 앞 공백과 끝 쉼표를 그대로 붙인다.
 * - questions.json: 바꿀 줄은 앞 쉼표를 떼면 `{"id":"<id>",`로 시작하는 줄이다. 앞 쉼표와 끝 쉼표를 떼고 JSON.parse → `field`
 *   (`explanation` 또는 `choices.<번호>`)의 문자열에서 `old`를 `new`로 바꾼다(`old`는 그 문자열에 정확히 한 번 있다) → JSON.stringify →
 *   떼어 낸 쉼표를 그대로 붙인다.
 */
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const P = {
  topics: 'src/data/topics.json',
  questions: 'src/data/questions.json',
  baseline: 'scripts/topics-baseline.json',
  test: 'src/data/data.test.ts',
}
const spec = JSON.parse(readFileSync(join(ROOT, 'phases/58-waf-web-acl/changes.json'), 'utf8'))
const ALLOWED = new Set([...Object.values(P), 'phases/58-waf-web-acl/index.json', 'phases/index.json'])

const base = git('merge-base', 'HEAD', 'develop').trim()
const atBase = (p) => git('show', `${base}:${p}`)
const read = (p) => readFileSync(join(ROOT, p), 'utf8')
const problems = []

const editLine = (lines, matches, label, edit) => {
  const hits = lines.flatMap((line, i) => (matches(line) ? [i] : []))
  if (hits.length !== 1) throw new Error(`기준 파일에서 ${label} 줄이 ${hits.length}개다 — changes.json과 기준 커밋이 맞지 않는다`)
  const i = hits[0]
  const lead = lines[i].slice(0, lines[i].length - lines[i].trimStart().length)
  let core = lines[i].trimStart()
  const pre = core.startsWith(',') ? ',' : ''
  const post = core.endsWith(',') ? ',' : ''
  core = core.slice(pre.length, core.length - post.length)
  const obj = JSON.parse(core)
  edit(obj)
  lines[i] = lead + pre + JSON.stringify(obj) + post
}

const topicLines = atBase(P.topics).split('\n')
for (const { id, paragraphs } of spec.concepts) {
  editLine(topicLines, (l) => l.startsWith(`      {"id":"${id}",`), id, (obj) => {
    obj.paragraphs = paragraphs
  })
}

const questionLines = atBase(P.questions).split('\n')
for (const { id, field, old, new: next } of spec.questions) {
  editLine(questionLines, (l) => l.replace(/^,/, '').startsWith(`{"id":"${id}",`), id, (obj) => {
    const [key, index] = field.split('.')
    const holder = index === undefined ? obj : obj[key]
    const slot = index === undefined ? key : Number(index)
    if (holder[slot].split(old).length !== 2) throw new Error(`${id} ${field}에 「${old}」가 정확히 한 번 있지 않다`)
    holder[slot] = holder[slot].replace(old, next)
  })
}

const compare = (path, want) => {
  const got = read(path)
  if (got === want) return
  const g = got.split('\n')
  const w = want.split('\n')
  const diffs = []
  for (let i = 0; i < Math.max(g.length, w.length) && diffs.length < 5; i++) {
    if (g[i] !== w[i]) diffs.push(`    ${i + 1}행\n      실제: ${(g[i] ?? '(없음)').slice(0, 160)}\n      기대: ${(w[i] ?? '(없음)').slice(0, 160)}`)
  }
  problems.push(`${path}가 기대값과 다르다 (실제 ${g.length}줄, 기대 ${w.length}줄). 처음 다른 곳:\n${diffs.join('\n')}`)
}
const wantQuestions = questionLines.join('\n')
compare(P.topics, topicLines.join('\n'))
compare(P.questions, wantQuestions)
const sha = createHash('sha256').update(wantQuestions).digest('hex')
const baseBaseline = atBase(P.baseline)
const oldSha = JSON.parse(baseBaseline).questionsSha256
compare(P.baseline, baseBaseline.replace(`"questionsSha256": "${oldSha}"`, `"questionsSha256": "${sha}"`))

for (const p of [P.topics, P.questions]) if (read(p).includes('웹 ACL')) problems.push(`${p}에 옛 표기 「웹 ACL」이 남아 있다`)

const baseTest = atBase(P.test)
const test = read(P.test)
if (!test.startsWith(baseTest.trimEnd())) problems.push(`${P.test}의 기존 부분이 바뀌었다 — 새 describe는 파일 끝에 덧붙이기만 한다`)
if (!test.includes("describe('ADR-039 확장 — WAF의 Web ACL'")) problems.push(`${P.test}에 describe('ADR-039 확장 — WAF의 Web ACL', …) 블록이 없다`)

const changed = git('diff', '--name-only', base).split('\n').filter(Boolean)
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)
for (const f of changed) if (!ALLOWED.has(f)) problems.push(`허용하지 않은 파일이 바뀌었다: ${f}`)
for (const f of untracked) if (!ALLOWED.has(f)) problems.push(`새 파일이 남아 있다: ${f} (일회성 스크립트는 저장소 밖에 둔다)`)

if (problems.length) {
  for (const p of problems) console.log(`✗ ${p}`)
  console.log(`\n위반 ${problems.length}건 (기준 ${base.slice(0, 7)})`)
  process.exit(1)
}
console.log(
  `✓ 기준 ${base.slice(0, 7)} — 개념 ${spec.concepts.length}개와 문항 구절 ${spec.questions.length}곳이 명세와 한 글자도 다르지 않고, ` +
  `questionsSha256만 갱신됐다. 「웹 ACL」 표기가 남지 않았고 data.test.ts에는 새 describe만 덧붙었다`,
)
