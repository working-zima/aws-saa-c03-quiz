#!/usr/bin/env node
/**
 * phase 57 일회성 가드레일 — 개념 본문 목록(ADR-046)의 데이터가 `changes.json`을 적용한 결과와 한 글자도 다르지 않은지 본다.
 *
 * 사용법: node phases/57-concept-lists/verify-concept-lists.mjs
 *
 * 기준은 설계 커밋(`git merge-base HEAD develop`)의 파일이다. 이 스크립트는 그 파일에 `changes.json`을 적용한 기대값을 메모리에서
 * 만들고 작업 트리의 파일과 비교한다. **파일을 쓰지 않는다.** 저장소 공용 테스트로 올리지 마라 — 이 phase가 끝난 뒤 콘텐츠를
 * 정당하게 고치면 영구히 실패한다.
 *
 * | 검사 | 무엇을 보장하나 |
 * |---|---|
 * | topics.json = 기대값 | 개념 21줄의 paragraphs만 명세 글자 그대로 바뀌고 나머지 줄은 그대로다 |
 * | questions.json·topics-baseline.json = 기준 | 문항과 구조 스냅샷은 바뀌지 않는다 |
 * | testEdits | 테스트 파일 셋에 명세한 수정 9건이 한 번씩 들어갔고, 고치기 전 단언은 남지 않았다 |
 * | ADR-046 데이터 테스트 | data.test.ts에 `describe('ADR-046` 블록이 있다 |
 * | 바뀐 파일 목록 | step 0의 코드·테스트 넷, step 1의 데이터·테스트 넷, phase 메타데이터 말고 바뀐 파일·새 파일이 없다 |
 *
 * 기대값을 만드는 규칙(줄 단위, 파일 재직렬화 없음):
 * - 바꿀 줄은 `      {"id":"<id>",`로 시작하는 줄이다.
 * - 그 줄의 앞 공백 6칸과 끝 쉼표를 떼고 JSON.parse → `paragraphs`에 명세의 값을 대입 → JSON.stringify → 앞 공백과 끝 쉼표를 그대로
 *   붙인다. 키 순서는 원래 줄 그대로다(대입은 키 순서를 바꾸지 않는다).
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const P = { topics: 'src/data/topics.json', questions: 'src/data/questions.json', baseline: 'scripts/topics-baseline.json' }
const STEP0 = [
  'src/lib/paragraph-blocks.ts',
  'src/lib/paragraph-blocks.test.ts',
  'src/components/ConceptList.tsx',
  'src/components/ConceptList.test.tsx',
]
const spec = JSON.parse(readFileSync(join(ROOT, 'phases/57-concept-lists/changes.json'), 'utf8'))
const TEST_FILES = [...new Set(spec.testEdits.map(({ file }) => file))]
const ALLOWED = new Set([
  P.topics,
  ...STEP0,
  ...TEST_FILES,
  'phases/57-concept-lists/index.json',
  'phases/index.json',
])

const base = git('merge-base', 'HEAD', 'develop').trim()
const atBase = (p) => git('show', `${base}:${p}`)
const read = (p) => readFileSync(join(ROOT, p), 'utf8')
const problems = []

const lines = atBase(P.topics).split('\n')
for (const { id, paragraphs } of spec.concepts) {
  const prefix = `      {"id":"${id}",`
  const i = lines.findIndex((l) => l.startsWith(prefix))
  if (i < 0) throw new Error(`기준 파일에 ${prefix} 줄이 없다 — changes.json과 기준 커밋이 맞지 않는다`)
  const comma = lines[i].endsWith(',')
  const obj = JSON.parse(lines[i].slice(6, comma ? -1 : undefined))
  obj.paragraphs = paragraphs
  lines[i] = '      ' + JSON.stringify(obj) + (comma ? ',' : '')
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
compare(P.topics, lines.join('\n'))
compare(P.questions, atBase(P.questions))
compare(P.baseline, atBase(P.baseline))

const count = (text, part) => text.split(part).length - 1
for (const { file, old, new: next } of spec.testEdits) {
  const text = read(file)
  if (count(text, next) !== 1) problems.push(`${file}에 명세한 수정이 정확히 한 번 들어 있지 않다(${count(text, next)}번):\n      ${next.split('\n').find(Boolean).trim().slice(0, 120)}`)
  if (!next.includes(old) && text.includes(old)) problems.push(`${file}에 고치기 전 단언이 남아 있다:\n      ${old.split('\n').find(Boolean).trim().slice(0, 120)}`)
}
if (!read('src/data/data.test.ts').includes("describe('ADR-046")) problems.push("src/data/data.test.ts에 describe('ADR-046 …') 블록이 없다")

const changed = git('diff', '--name-only', base).split('\n').filter(Boolean)
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)
for (const f of changed) if (!ALLOWED.has(f)) problems.push(`허용하지 않은 파일이 바뀌었다: ${f}`)
for (const f of untracked) if (!ALLOWED.has(f)) problems.push(`새 파일이 남아 있다: ${f} (일회성 스크립트는 저장소 밖에 둔다)`)

if (problems.length) {
  for (const p of problems) console.log(`✗ ${p}`)
  console.log(`\n위반 ${problems.length}건 (기준 ${base.slice(0, 7)})`)
  process.exit(1)
}
const items = spec.concepts.flatMap(({ paragraphs }) => paragraphs).filter((p) => p.startsWith('- ')).length
console.log(
  `✓ 기준 ${base.slice(0, 7)} — 개념 ${spec.concepts.length}개의 본문을 목록으로 바꿨고(항목 ${items}개) 데이터가 명세와 한 글자도 ` +
  `다르지 않다. 테스트 수정 ${spec.testEdits.length}건이 모두 들어 있다`,
)
