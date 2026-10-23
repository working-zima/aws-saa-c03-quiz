#!/usr/bin/env node
/**
 * phase 66 일회성 가드레일 — 데이터 세 파일이 설계 커밋의 파일에 `changes.json`의 부분들을 차례로 적용한 결과와
 * 한 글자도 다르지 않은지 본다. phase 65의 `verify-content.mjs`와 같은 생각이고, 부분을 나눠 step마다 대조하는 것만 다르다.
 *
 * 사용법: node phases/66-exam-emphasis/verify-content.mjs --through A|B|C|D
 *
 * 기준은 `changes.json`을 처음 커밋한 설계 커밋의 파일이다. 그 파일에 A부터 `--through`까지의 부분을 메모리에서 적용해
 * 기대값을 만들고 작업 트리의 파일과 비교한다. **파일을 쓰지 않는다.** 저장소 공용 테스트로 올리지 마라 — 이 phase가
 * 끝난 뒤 콘텐츠를 정당하게 고치면 영구히 실패한다. 이 phase의 step에서만 돌린다.
 *
 * | 검사 | 무엇을 보장하나 |
 * |---|---|
 * | topics.json·questions.json·topics-baseline.json = 기대값 | 명세의 글자 그대로이고, 그 밖에 바뀐 것이 없다 |
 * | 바뀐 파일 목록 | 데이터 세 파일과 허용한 테스트·화면 파일, phase 메타데이터 말고 바뀐 파일·새 파일이 없다 |
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { applyPart, PARTS } from './tools/content.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const P = { topics: 'src/data/topics.json', questions: 'src/data/questions.json', baseline: 'scripts/topics-baseline.json' }
const ALLOWED = new Set([
  ...Object.values(P),
  'src/data/data.test.ts',
  'src/components/diagrams/sgNaclTables.test.tsx',
  // step 2(강조 굵기)가 고치는 화면 파일
  'src/components/EmphasizedText.tsx',
  'src/components/EmphasizedText.test.tsx',
  // step 2가 함께 고치는 테스트 — 강조 클래스를 `font-medium`으로 못박아 두었다. 설계 때 이 목록에서 빠졌다.
  'src/components/QuizRunner.test.tsx',
  'src/pages/ConceptReadPage.test.tsx',
  // 이 파일 — step 2가 위 두 줄을 더했다
  'phases/66-exam-emphasis/verify-content.mjs',
  'phases/66-exam-emphasis/index.json',
  'phases/index.json',
])

const through = process.argv[process.argv.indexOf('--through') + 1]
if (!PARTS.includes(through)) throw new Error('--through A|B|C|D 를 준다')

const base = git('log', '--diff-filter=A', '--format=%H', '-1', '--', 'phases/66-exam-emphasis/changes.json').trim()
if (!base) throw new Error('changes.json을 더한 커밋을 찾지 못했다')
const changes = JSON.parse(git('show', `${base}:phases/66-exam-emphasis/changes.json`))
let expected = Object.fromEntries(Object.entries(P).map(([key, path]) => [key, git('show', `${base}:${path}`)]))
for (const part of PARTS.slice(0, PARTS.indexOf(through) + 1)) expected = applyPart(expected, changes, part)

const problems = []
for (const [key, path] of Object.entries(P)) {
  const actual = readFileSync(join(ROOT, path), 'utf8')
  if (actual === expected[key]) continue
  const a = actual.split('\n')
  const e = expected[key].split('\n')
  const line = a.findIndex((text, i) => text !== e[i])
  problems.push(`${path}: ${line + 1}번째 줄부터 기대값과 다르다 (줄 수 ${a.length} / 기대 ${e.length})`)
}

const changed = git('diff', '--name-only', base).split('\n').filter(Boolean)
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)
for (const path of [...changed, ...untracked]) {
  if (!ALLOWED.has(path)) problems.push(`허용하지 않은 파일이 바뀌었다: ${path}`)
}

if (problems.length) {
  console.error(`✗ 부분 ${through}까지의 대조 실패`)
  problems.forEach((problem) => console.error(`  - ${problem}`))
  process.exit(1)
}
console.log(`✓ 데이터 세 파일이 changes.json의 부분 A~${through}를 적용한 결과와 같다`)
