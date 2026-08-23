#!/usr/bin/env node
/**
 * 개념 본문이 원본 PDF 추출본을 그대로 옮긴 것인지 검사한다.
 *
 * 공백·문장부호·이모지를 지운 뒤 문자 단위로 비교해, 원본과 THRESHOLD자 이상
 * 연속으로 일치하는 구간을 위반으로 보고한다. 공백을 지우는 이유: 원본에는
 * 추출 아티팩트로 자간이 벌어진 구간("S3 는")이 있어 어절 단위 비교가 헛돈다.
 *
 * 사용법:
 *   node scripts/check-verbatim.mjs                        # 22개 주제 전체
 *   node scripts/check-verbatim.mjs vpc-networking route53 # 지정한 주제만
 *   node scripts/check-verbatim.mjs --threshold 30         # 임계값 조정
 *
 * 위반이 하나라도 있으면 exit 1.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(ROOT, 'docs/source/concepts-raw.md')
const TOPICS = join(ROOT, 'src/data/topics.json')

/**
 * 32자. 1-exam-gaps에서 직접 쓴 개념 77개가 전부 통과하는 최소값이다.
 * (24자면 2건, 28자면 1건이 걸린다 — 같은 사실을 한국어로 쓰면 자연히 겹치는 구간이다.)
 *
 * 주의: 이 검사는 하한선이지 재작성 완료의 증명이 아니다. 본문이 짧으면 전사라도
 * 32자에 못 미쳐 통과한다. 통과 = "명백한 전사 구간이 없다"까지만 뜻한다.
 */
const DEFAULT_THRESHOLD = 32

/** 비교용 정규화: 공백·문장부호·이모지·마크다운 기호를 버리고 소문자로 만든다. */
function normalize(text) {
  const chars = []
  const origin = []
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    if (/[\p{L}\p{N}]/u.test(ch)) {
      chars.push(ch.toLowerCase())
      origin.push(i)
    }
  }
  return { normalized: chars.join(''), origin }
}

function parseArgs(argv) {
  const topicIds = []
  let threshold = DEFAULT_THRESHOLD
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--threshold') {
      threshold = Number(argv[i + 1])
      i += 1
      if (!Number.isInteger(threshold) || threshold < 4) {
        throw new Error('--threshold 는 4 이상의 정수여야 한다')
      }
    } else {
      topicIds.push(argv[i])
    }
  }
  return { topicIds, threshold }
}

const { topicIds, threshold } = parseArgs(process.argv.slice(2))

const source = normalize(readFileSync(SOURCE, 'utf8')).normalized
const grams = new Set()
for (let i = 0; i + threshold <= source.length; i += 1) {
  grams.add(source.slice(i, i + threshold))
}

const raw = JSON.parse(readFileSync(TOPICS, 'utf8'))
const topics = Array.isArray(raw) ? raw : raw.topics

const targets = topicIds.length
  ? topicIds.map((id) => {
      const topic = topics.find((t) => t.id === id)
      if (!topic) throw new Error(`주제를 찾을 수 없다: ${id}`)
      return topic
    })
  : topics

/** 원본과 threshold자 이상 연속 일치하는 구간을 최장 단위로 모은다. */
function findMatches(text) {
  const { normalized, origin } = normalize(text)
  const matches = []
  let i = 0
  while (i + threshold <= normalized.length) {
    if (!grams.has(normalized.slice(i, i + threshold))) {
      i += 1
      continue
    }
    let end = i + threshold
    while (end < normalized.length && grams.has(normalized.slice(end - threshold + 1, end + 1))) {
      end += 1
    }
    matches.push({ length: end - i, from: origin[i], to: origin[end - 1] + 1 })
    i = end - threshold + 1
  }
  return matches
}

let violations = 0
let checked = 0

for (const topic of targets) {
  for (const concept of topic.concepts) {
    const fields = [
      ['summary', concept.summary],
      ...concept.paragraphs.map((p, idx) => [`paragraphs[${idx}]`, p]),
    ]
    checked += 1
    for (const [label, text] of fields) {
      for (const m of findMatches(text)) {
        violations += 1
        const snippet = text.slice(m.from, m.to).replace(/\n/g, ' ⏎ ')
        console.log(`✗ ${concept.id} · ${label} · ${m.length}자 연속 일치`)
        console.log(`    ${snippet}`)
      }
    }
  }
}

const scope = topicIds.length ? topicIds.join(', ') : '전체 22개 주제'
console.log(
  `\n임계값 ${threshold}자 · ${scope} · 개념 ${checked}개 검사 · 위반 ${violations}건`,
)
process.exit(violations > 0 ? 1 : 0)
