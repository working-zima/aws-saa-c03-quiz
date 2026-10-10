#!/usr/bin/env node
/**
 * phase 55 일회성 가드레일 — 데이터 세 파일이 `changes.json`을 적용한 결과와 한 글자도 다르지 않은지 본다.
 *
 * 사용법: node phases/55-sourced-block-heads/verify-heads.mjs
 *
 * 기준은 설계 커밋(`git merge-base HEAD develop`)의 파일이다. 이 스크립트는 그 파일에 `changes.json`을 적용한
 * 기대값을 메모리에서 만들고 작업 트리의 파일과 줄 단위로 비교한다. **파일을 쓰지 않는다.** 저장소 공용 테스트로
 * 올리지 마라 — 이 phase가 끝난 뒤 콘텐츠를 정당하게 고치면 영구히 실패한다.
 *
 * | 검사 | 무엇을 보장하나 |
 * |---|---|
 * | topics.json = 기대값 | 새 개념 일곱 줄이 명세 글자 그대로 제자리에 있고, parentId 24개 말고 바뀐 것이 없다 |
 * | questions.json = 기대값 | 기존 문항은 그대로이고 끝에 새 문항 일곱이 명세 글자 그대로 붙었다 |
 * | topics-baseline.json = 기대값 | 스냅샷도 같은 변경과 conceptLineCount·questionsSha256만 바뀌었다 |
 * | 바뀐 파일 목록 | 위 셋과 src/data/data.test.ts, phase 메타데이터 말고 바뀐 파일·새 파일이 없다 |
 *
 * 기대값을 만드는 규칙(줄 단위, 재직렬화 없음):
 * - 새 개념: `before` 개념 줄 바로 위에 `      ` + JSON.stringify(concept) + `,` 한 줄을 넣는다.
 * - parentId: 딸린 개념 줄의 `"id":"…",` 바로 뒤에 `"parentId":"…",`를 넣는다.
 * - 새 문항: 마지막 문항 줄(q732) 끝에 `,`를 붙이고, 그 뒤에 JSON.stringify(question) 한 줄씩을 넣는다. 마지막 새 문항(q739)
 *   줄에는 쉼표가 없고, 그 다음 줄이 `]`다. 키 순서는 id, topicId, conceptId, prompt, choices, answerIndex, explanation이다.
 * - 스냅샷: 같은 변경을 1칸 들여쓰기 형식의 항목 블록으로 하고, conceptLineCount와 questionsSha256을 새 값으로 쓴다.
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const P = { topics: 'src/data/topics.json', questions: 'src/data/questions.json', baseline: 'scripts/topics-baseline.json' }
const ALLOWED = new Set([...Object.values(P), 'src/data/data.test.ts', 'phases/55-sourced-block-heads/index.json', 'phases/index.json'])

const spec = JSON.parse(readFileSync(join(ROOT, 'phases/55-sourced-block-heads/changes.json'), 'utf8'))
const base = git('merge-base', 'HEAD', 'develop').trim()
const atBase = (p) => git('show', `${base}:${p}`)
const problems = []

// ---- topics.json 기대값
const t = atBase(P.topics).split('\n')
const lineOf = (id) => {
  const i = t.findIndex((l) => l.startsWith(`      {"id":"${id}",`))
  if (i < 0) throw new Error(`기준 topics.json에 ${id} 줄이 없다 — changes.json과 기준 커밋이 맞지 않는다`)
  return i
}
for (const n of spec.newConcepts) t.splice(lineOf(n.before), 0, '      ' + JSON.stringify(n.concept) + ',')
for (const p of spec.parents) {
  for (const c of p.children) {
    const i = lineOf(c)
    const head = `      {"id":"${c}",`
    t[i] = head + `"parentId":"${p.parent}",` + t[i].slice(head.length)
  }
}
const wantTopics = t.join('\n')

// ---- questions.json 기대값
const q = atBase(P.questions).split('\n')
const close = q.lastIndexOf(']')
q[close - 1] += ','
q.splice(close, 0, ...spec.newQuestions.map((x, i, a) => JSON.stringify(x) + (i < a.length - 1 ? ',' : '')))
const wantQuestions = q.join('\n')

// ---- topics-baseline.json 기대값
let b = atBase(P.baseline)
const entry = (id, name) => `    {\n     "id": "${id}",\n     "name": ${JSON.stringify(name)}\n    }`
const findEntry = (id) => {
  const re = new RegExp(`    \\{\\n     "id": "${id.replace(/\./g, '\\.')}",\\n(?:     "parentId": "[^"]*",\\n)?     "name": .*\\n    \\}`)
  const m = b.match(re)
  if (!m) throw new Error(`기준 스냅샷에 ${id} 항목이 없다`)
  return m
}
for (const n of spec.newConcepts) {
  const m = findEntry(n.before)
  b = b.slice(0, m.index) + entry(n.concept.id, n.concept.name) + ',\n' + b.slice(m.index)
}
for (const p of spec.parents) {
  for (const c of p.children) {
    const key = `     "id": "${c}",\n`
    const i = b.indexOf(key)
    b = b.slice(0, i + key.length) + `     "parentId": "${p.parent}",\n` + b.slice(i + key.length)
  }
}
const lineCount = wantTopics.split('\n').filter((l) => l.startsWith('      {"id":"')).length
b = b.replace(/"conceptLineCount": \d+/, `"conceptLineCount": ${lineCount}`)
b = b.replace(/"questionsSha256": "[0-9a-f]+"/, `"questionsSha256": "${createHash('sha256').update(wantQuestions).digest('hex')}"`)
const wantBaseline = b

// ---- 비교
const compare = (path, want) => {
  const got = readFileSync(join(ROOT, path), 'utf8')
  if (got === want) return
  const g = got.split('\n')
  const w = want.split('\n')
  const diffs = []
  for (let i = 0; i < Math.max(g.length, w.length) && diffs.length < 5; i++) {
    if (g[i] !== w[i]) diffs.push(`    ${i + 1}행\n      실제: ${(g[i] ?? '(없음)').slice(0, 160)}\n      기대: ${(w[i] ?? '(없음)').slice(0, 160)}`)
  }
  problems.push(`${path}가 기대값과 다르다 (실제 ${g.length}줄, 기대 ${w.length}줄). 처음 다른 곳:\n${diffs.join('\n')}`)
}
compare(P.topics, wantTopics)
compare(P.questions, wantQuestions)
compare(P.baseline, wantBaseline)

const changed = git('diff', '--name-only', base).split('\n').filter(Boolean)
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)
for (const f of changed) if (!ALLOWED.has(f)) problems.push(`허용하지 않은 파일이 바뀌었다: ${f}`)
for (const f of untracked) problems.push(`새 파일이 남아 있다: ${f} (일회성 스크립트는 저장소 밖에 둔다)`)

if (problems.length) {
  for (const p of problems) console.log(`✗ ${p}`)
  console.log(`\n위반 ${problems.length}건 (기준 ${base.slice(0, 7)})`)
  process.exit(1)
}
const parentCount = spec.parents.reduce((a, p) => a + p.children.length, 0)
console.log(
  `✓ 기준 ${base.slice(0, 7)} — 새 개념 ${spec.newConcepts.length}개, parentId ${parentCount}개 추가, 새 문항 ${spec.newQuestions.length}개. ` +
  `개념 ${lineCount}줄. 데이터 세 파일이 명세와 한 글자도 다르지 않다`,
)
