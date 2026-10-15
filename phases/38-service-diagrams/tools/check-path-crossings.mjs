#!/usr/bin/env node
/**
 * 경로선이 노드 상자를 가로지르는지 검사한다.
 *
 * 도식 테스트는 `rect`가 viewBox 안에 있는지(`boxesOutsideViewBox`)와 라벨이 상자에
 * 들어가는지(`estimateTextWidth`)만 본다. 경로선이 무관한 노드를 뚫고 지나가는 것은
 * 그 둘이 보지 못하고, 브라우저로 눈으로 봐야 알 수 있었다.
 *
 * 다섯 도식의 경로가 전부 직교(M/H/V)라서 산술로 정확히 판정할 수 있다.
 * 상자 경계에 닿는 것은 연결 지점이므로 교차가 아니다 — 내부를 지나는 것만 잡는다.
 * 세로형 nodes·paths와 가로형 wideNodes·widePaths(ADR-047)는 각 선언 블록에서 읽고,
 * 같은 배치의 노드와 경로끼리만 검사한다.
 *
 * 사용법: node phases/38-service-diagrams/tools/check-path-crossings.mjs
 * 위반이 있으면 exit 1.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..')
// 인자로 디렉터리를 주면 그쪽을 본다. 검사기 자신을 음성 시험할 때 쓴다.
const DIR = process.argv[2] ? resolve(process.argv[2]) : join(ROOT, 'src/components/diagrams')
const NODE_HEIGHT = 32

const parseNodes = (src, name) => {
  const block = src.match(new RegExp(`\\bconst ${name} = \\[([\\s\\S]*?)\\n\\]`))
  if (!block) return []
  return [...block[1].matchAll(/\{ id: '([^']+)'[^}]*?x: (-?\d+), y: (-?\d+), width: (\d+)/g)]
    .map(([, id, x, y, width]) => ({ id, x: +x, y: +y, width: +width, height: NODE_HEIGHT }))
}

const parsePaths = (src, name) => {
  const block = src.match(new RegExp(`\\bconst ${name}\\b[^=\\n]*= \\{([\\s\\S]*?)\\n\\}`))
  if (!block) return []
  return [...block[1].matchAll(/'([\w-]+)': '(M[^']*)'/g)].map(([, id, d]) => ({ id, d }))
}

// 직교 경로를 선분 목록으로 편다. M/H/V만 나온다.
const toSegments = (d) => {
  const segments = []
  let x = 0, y = 0
  for (const [, cmd, raw] of d.matchAll(/([MHV])\s*(-?\d+)(?:\s+(-?\d+))?/g)) {
    const n = +raw
    if (cmd === 'M') { const m = d.match(/M\s*(-?\d+)\s+(-?\d+)/); x = +m[1]; y = +m[2]; continue }
    const from = { x, y }
    if (cmd === 'H') x = n; else y = n
    segments.push({ from, to: { x, y } })
  }
  return segments
}

// 두 열린 구간이 길이를 갖고 겹치는가.
const overlaps = (a1, a2, b1, b2) => Math.min(a2, b2) - Math.max(a1, b1) > 0

const crosses = (seg, node) => {
  const [x1, x2] = [seg.from.x, seg.to.x].sort((a, b) => a - b)
  const [y1, y2] = [seg.from.y, seg.to.y].sort((a, b) => a - b)
  const { x: nx, y: ny, width: nw, height: nh } = node
  if (y1 === y2) return ny < y1 && y1 < ny + nh && overlaps(x1, x2, nx, nx + nw)
  if (x1 === x2) return nx < x1 && x1 < nx + nw && overlaps(y1, y2, ny, ny + nh)
  return false
}

const problems = []
const layouts = [
  { label: '세로', nodesName: 'nodes', pathsName: 'paths', nodeCount: 0, pathCount: 0 },
  { label: '가로', nodesName: 'wideNodes', pathsName: 'widePaths', nodeCount: 0, pathCount: 0 },
]

for (const file of readdirSync(DIR).filter((f) => f.endsWith('Diagram.tsx'))) {
  const src = readFileSync(join(DIR, file), 'utf8')
  for (const layout of layouts) {
    const nodes = parseNodes(src, layout.nodesName)
    const paths = parsePaths(src, layout.pathsName)
    layout.nodeCount += nodes.length
    layout.pathCount += paths.length

    // 노드끼리 겹치는가.
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        if (overlaps(a.x, a.x + a.width, b.x, b.x + b.width)
          && overlaps(a.y, a.y + a.height, b.y, b.y + b.height)) {
          problems.push(`${file} [${layout.label}]: 노드 '${a.id}'와 '${b.id}'의 상자가 겹친다`)
        }
      }
    }

    for (const path of paths) {
      for (const seg of toSegments(path.d)) {
        for (const node of nodes) {
          if (crosses(seg, node)) {
            problems.push(
              `${file} [${layout.label}]: 경로 '${path.id}'의 선분 (${seg.from.x},${seg.from.y})→(${seg.to.x},${seg.to.y})가 `
              + `노드 '${node.id}' [x ${node.x}..${node.x + node.width}, y ${node.y}..${node.y + node.height}] 내부를 지난다`,
            )
          }
        }
      }
    }
  }
}

if (problems.length) {
  console.error(`✗ 경로·노드 교차 ${problems.length}건`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

console.log(`✓ 교차 없음 — 세로 노드 ${layouts[0].nodeCount}개·경로 ${layouts[0].pathCount}개, `
  + `가로 노드 ${layouts[1].nodeCount}개·경로 ${layouts[1].pathCount}개를 검사했고 상자 내부를 지나는 선분이 없다`)
