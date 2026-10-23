#!/usr/bin/env node
/**
 * phase 66 데이터 적용 — `changes.json`의 한 부분을 작업 트리의 데이터 세 파일에 쓴다.
 *
 * 사용법: node phases/66-exam-emphasis/tools/apply.mjs --part A|B|C|D
 *
 * 앞 부분이 이미 적용된 작업 트리에 다음 부분을 얹는다. 규칙은 `content.mjs`에 있다. 고칠 자리의 지금 값이
 * 기대와 다르면 아무것도 쓰지 않고 던진다. 쓴 뒤에는 `../verify-content.mjs --through <부분>`으로 대조한다.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { applyPart, PARTS } from './content.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const P = { topics: 'src/data/topics.json', questions: 'src/data/questions.json', baseline: 'scripts/topics-baseline.json' }

const part = process.argv[process.argv.indexOf('--part') + 1]
if (!PARTS.includes(part)) throw new Error('--part A|B|C|D 를 준다')

const changes = JSON.parse(readFileSync(join(ROOT, 'phases/66-exam-emphasis/changes.json'), 'utf8'))
const before = Object.fromEntries(Object.entries(P).map(([key, path]) => [key, readFileSync(join(ROOT, path), 'utf8')]))
const after = applyPart(before, changes, part)
for (const [key, path] of Object.entries(P)) {
  if (after[key] !== before[key]) writeFileSync(join(ROOT, path), after[key])
}
console.log(`✓ 부분 ${part}를 적용했다`)
