#!/usr/bin/env node
/**
 * phase 56 일회성 가드레일 — 데이터 세 파일이 `changes.json`을 적용한 결과와 한 글자도 다르지 않은지 본다.
 *
 * 사용법: node phases/56-inline-code-root-user/verify-root-user.mjs
 *
 * 기준은 설계 커밋(`git merge-base HEAD develop`)의 파일이다. 이 스크립트는 그 파일에 `changes.json`을 적용한
 * 기대값을 메모리에서 만들고 작업 트리의 파일과 비교한다. **파일을 쓰지 않는다.** 저장소 공용 테스트로 올리지
 * 마라 — 이 phase가 끝난 뒤 콘텐츠를 정당하게 고치면 영구히 실패한다.
 *
 * | 검사 | 무엇을 보장하나 |
 * |---|---|
 * | topics.json = 기대값 | 개념 한 줄의 summary·paragraphs만 명세 글자 그대로 바뀌고 나머지 줄은 그대로다 |
 * | questions.json = 기대값 | q701 한 줄의 prompt·explanation만 바뀌고 보기·정답과 다른 문항은 그대로다 |
 * | topics-baseline.json = 기대값 | questionsSha256 값만 바뀌었다 |
 * | 바뀐 파일 목록 | 위 셋, step 0이 바꾼 코드·테스트 여섯, phase 메타데이터 말고 바뀐 파일·새 파일이 없다 |
 *
 * 기대값을 만드는 규칙(줄 단위, 파일 재직렬화 없음):
 * - 바꿀 줄을 찾는다. 개념은 `      {"id":"<id>",`로, 문항은 `{"id":"<id>",`로 시작하는 줄이다.
 * - 그 줄의 앞 공백과 끝 쉼표를 떼고 JSON.parse → 명세의 필드를 같은 키에 대입 → JSON.stringify → 앞 공백과 끝 쉼표를
 *   그대로 붙인다. 키 순서는 원래 줄 그대로다(대입은 키 순서를 바꾸지 않는다).
 * - 스냅샷은 `"questionsSha256": "…"`의 값만 바뀐 questions.json의 sha256으로 바꾼다.
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const P = { topics: 'src/data/topics.json', questions: 'src/data/questions.json', baseline: 'scripts/topics-baseline.json' }
const STEP0 = [
  'src/components/EmphasizedText.tsx',
  'src/components/ConceptList.test.tsx',
  'src/lib/glossary.ts',
  'src/lib/glossary.test.ts',
  'src/lib/search.ts',
  'src/lib/search.test.ts',
]
const ALLOWED = new Set([...Object.values(P), ...STEP0, 'phases/56-inline-code-root-user/index.json', 'phases/index.json'])

const spec = JSON.parse(readFileSync(join(ROOT, 'phases/56-inline-code-root-user/changes.json'), 'utf8'))
const base = git('merge-base', 'HEAD', 'develop').trim()
const atBase = (p) => git('show', `${base}:${p}`)
const problems = []

const patchLine = (lines, prefix, indent, patch) => {
  const i = lines.findIndex((l) => l.startsWith(prefix))
  if (i < 0) throw new Error(`기준 파일에 ${prefix} 줄이 없다 — changes.json과 기준 커밋이 맞지 않는다`)
  const comma = lines[i].endsWith(',')
  const obj = JSON.parse(lines[i].slice(indent.length, comma ? -1 : undefined))
  for (const key of Object.keys(patch)) {
    if (!(key in obj)) throw new Error(`${prefix}에 ${key} 키가 없다`)
    obj[key] = patch[key]
  }
  lines[i] = indent + JSON.stringify(obj) + (comma ? ',' : '')
}

const t = atBase(P.topics).split('\n')
for (const { id, ...patch } of spec.concepts) patchLine(t, `      {"id":"${id}",`, '      ', patch)
const wantTopics = t.join('\n')

const q = atBase(P.questions).split('\n')
for (const { id, ...patch } of spec.questions) patchLine(q, `{"id":"${id}",`, '', patch)
const wantQuestions = q.join('\n')

const wantBaseline = atBase(P.baseline).replace(
  /"questionsSha256": "[0-9a-f]+"/,
  `"questionsSha256": "${createHash('sha256').update(wantQuestions).digest('hex')}"`,
)

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
console.log(
  `✓ 기준 ${base.slice(0, 7)} — 개념 ${spec.concepts.length}개·문항 ${spec.questions.length}개의 문장을 바꿨고 ` +
  `데이터 세 파일이 명세와 한 글자도 다르지 않다`,
)
