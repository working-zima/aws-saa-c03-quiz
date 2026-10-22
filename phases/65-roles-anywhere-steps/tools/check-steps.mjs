// 단계 그림 설계 검사: 경계·라벨 폭·노드 겹침·소속·그룹 라벨(겹침·경로 통과)·경로 교차·끝점·곁말(경계·겹침·그룹 변)·경로끼리 겹침·앵커.
// phase 64 check-design.mjs를 정지 그림용으로 옮겼다. 그림마다 장면이 하나뿐이라 모든 경로·곁말을 한 장면으로 본다.
// 시작점과 끝점은 노드 변 또는 그룹 변이면 된다(그룹 박스에서 나가고 들어가는 화살표).
// 사용법: node phases/65-roles-anywhere-steps/tools/check-steps.mjs [저장소 경로]
// 새 개념을 앵커로 쓰므로 데이터 step을 적용한 topics.json에서 돌린다. 그 전에는 「앵커 없음」이 나는 것이 정상이다.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { anchor, figures, groupTexts, nodeTexts } from './step-figures.mjs'

const repo = process.argv[2] ?? fileURLToPath(new URL('../../..', import.meta.url))
const topics = JSON.parse(readFileSync(`${repo}/src/data/topics.json`, 'utf8'))
const concept = topics.flatMap((t) => t.concepts).find((c) => c.id === anchor)

const full = /[\p{Script=Hangul}\p{Script=Han}⺀-꓏︐-︙︰-﹯！-｠￠-￦]/u
const tw = (s, f) => [...s].reduce((w, ch) => w + f * (full.test(ch) ? 1 : 0.55), 0)
const H = 32
const problems = []
const p = (m) => problems.push(m)

if (!concept) p(`앵커 ${anchor} 없음`)
else {
  const numbers = concept.paragraphs.map((x) => x.match(/^(\d+)\. /)?.[1]).filter(Boolean).map(Number)
  const want = Object.keys(figures).map(Number)
  if (numbers.join() !== want.join()) p(`본문 번호 ${numbers.join()} ≠ 그림 ${want.join()}`)
}

const segs = (d) => {
  const out = []; let x = 0, y = 0
  for (const [, c, a, b] of d.matchAll(/([MHV])\s*(-?\d+)(?:\s+(-?\d+))?/g)) {
    if (c === 'M') { x = +a; y = +b; continue }
    const from = { x, y }; if (c === 'H') x = +a; else y = +a
    out.push({ from, to: { x, y } })
  }
  return out
}
const ov = (a1, a2, b1, b2) => Math.min(a2, b2) - Math.max(a1, b1) > 0
const rectOv = (a, b) => ov(a.x, a.x + a.w, b.x, b.x + b.w) && ov(a.y, a.y + a.h, b.y, b.y + b.h)
const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h
const segCrossRect = (s, r) => {
  const [x1, x2] = [s.from.x, s.to.x].sort((a, b) => a - b), [y1, y2] = [s.from.y, s.to.y].sort((a, b) => a - b)
  if (y1 === y2) return r.y < y1 && y1 < r.y + r.h && ov(x1, x2, r.x, r.x + r.w)
  return r.x < x1 && x1 < r.x + r.w && ov(y1, y2, r.y, r.y + r.h)
}
const segHitsBox = (s, b) => {
  const [x1, x2] = [s.from.x, s.to.x].sort((a, c) => a - c), [y1, y2] = [s.from.y, s.to.y].sort((a, c) => a - c)
  return y1 === y2 ? b.y <= y1 && y1 <= b.y + b.h && ov(x1, x2, b.x, b.x + b.w) : b.x <= x1 && x1 <= b.x + b.w && ov(y1, y2, b.y, b.y + b.h)
}
const onEdge = (pt, r) => {
  const inX = pt.x >= r.x && pt.x <= r.x + r.w, inY = pt.y >= r.y && pt.y <= r.y + r.h
  return (inX && (pt.y === r.y || pt.y === r.y + r.h)) || (inY && (pt.x === r.x || pt.x === r.x + r.w))
}
const noteBox = (text, x, y, anchorPos) => {
  const w = tw(text, 9)
  return { x: anchorPos === 'start' ? x : anchorPos === 'end' ? x - w : x - w / 2, y: y - 7, w, h: 9 }
}

let nodeCount = 0, pathCount = 0
for (const [step, f] of Object.entries(figures)) {
  const tag = `${step}단계`
  const [W, Hh] = f.viewBox
  const nodes = Object.fromEntries(Object.entries(f.nodes).map(([id, [x, y, w]]) => [id, { x, y, w, h: H }]))
  const groups = Object.fromEntries(Object.entries(f.groups).map(([id, [x, y, w, h]]) => [id, { x, y, w, h }]))
  const ne = Object.entries(nodes)
  nodeCount += ne.length; pathCount += Object.keys(f.paths).length
  if (W !== 208) p(`${tag}: viewBox 폭 ${W} ≠ 208`)
  for (const [id, r] of [...ne, ...Object.entries(groups)]) if (r.x < 0 || r.y < 0 || r.x + r.w > W || r.y + r.h > Hh) p(`${tag}: ${id} 상자가 viewBox 밖`)
  for (const [id, r] of ne) {
    if (!nodeTexts[id]) { p(`${tag}: 노드 ${id} 라벨 없음`); continue }
    const need = tw(nodeTexts[id][0], 10) + 12
    if (need > r.w) p(`${tag}: 노드 ${id} 라벨 ${need.toFixed(1)} > 폭 ${r.w}`)
  }
  for (let i = 0; i < ne.length; i++) for (let j = i + 1; j < ne.length; j++) if (rectOv(ne[i][1], ne[j][1])) p(`${tag}: 노드 ${ne[i][0]}·${ne[j][0]} 겹침`)
  const labels = {}
  for (const [id, g] of Object.entries(groups)) {
    if (!groupTexts[id]) { p(`${tag}: 그룹 ${id} 라벨 없음`); continue }
    const lb = { x: g.x + 10, y: g.y + 14 - 7, w: tw(groupTexts[id], 9), h: 9 }
    labels[id] = lb
    if (lb.x + lb.w > g.x + g.w) p(`${tag}: 그룹 라벨 ${id}가 박스를 넘음`)
    for (const [nid, r] of ne) if (rectOv(lb, r)) p(`${tag}: 그룹 라벨 ${id}가 노드 ${nid}와 겹침`)
  }
  for (const [gid, mem] of Object.entries(f.members)) {
    const g = groups[gid]; if (!g) { p(`${tag}: 그룹 ${gid} 좌표 없음`); continue }
    for (const [nid, r] of ne) {
      if (mem.includes(nid)) { if (!inside(r, g)) p(`${tag}: ${nid}가 그룹 ${gid} 밖`) }
      else if (rectOv(r, g)) p(`${tag}: ${nid}가 소속 아닌 그룹 ${gid}와 겹침`)
    }
  }
  for (const gid of Object.keys(groups)) if (!f.members[gid]) p(`${tag}: 그룹 ${gid} 소속 목록 없음`)
  const edges = [...ne.map(([, r]) => r), ...Object.values(groups)]
  const all = []
  for (const [pid, d] of Object.entries(f.paths)) {
    const ss = segs(d)
    for (const s of ss) {
      all.push({ pid, s })
      for (const [nid, r] of ne) if (segCrossRect(s, r)) p(`${tag}: 경로 ${pid}가 노드 ${nid} 내부 통과`)
      for (const [gid, lb] of Object.entries(labels)) if (segHitsBox(s, { x: lb.x - 2, y: lb.y, w: lb.w + 4, h: lb.h })) p(`${tag}: 경로 ${pid}가 그룹 라벨 ${gid}를 지남`)
      for (const pt of [s.from, s.to]) if (pt.x < 0 || pt.x > W || pt.y < 0 || pt.y > Hh) p(`${tag}: 경로 ${pid}가 viewBox 밖`)
    }
    if (!edges.some((r) => onEdge(ss[0].from, r))) p(`${tag}: 경로 ${pid} 시작점이 노드·그룹 변 위가 아님`)
    if (!edges.some((r) => onEdge(ss[ss.length - 1].to, r))) p(`${tag}: 경로 ${pid} 끝점이 노드·그룹 변 위가 아님`)
  }
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j]; if (a.pid === b.pid) continue
    const ah = a.s.from.y === a.s.to.y, bh = b.s.from.y === b.s.to.y
    const sx = (s) => [s.from.x, s.to.x].sort((m, n) => m - n), sy = (s) => [s.from.y, s.to.y].sort((m, n) => m - n)
    if (ah && bh && a.s.from.y === b.s.from.y && ov(...sx(a.s), ...sx(b.s))) p(`${tag}: 경로 ${a.pid}·${b.pid}가 y ${a.s.from.y}에서 겹침`)
    if (!ah && !bh && a.s.from.x === b.s.from.x && ov(...sy(a.s), ...sy(b.s))) p(`${tag}: 경로 ${a.pid}·${b.pid}가 x ${a.s.from.x}에서 겹침`)
  }
  const boxes = {}
  for (const [nid, [x, y, anchorPos, text]] of Object.entries(f.notes)) {
    const b = noteBox(text, x, y, anchorPos); boxes[nid] = b
    if (b.x < 0 || b.x + b.w > W || b.y < 0 || b.y + b.h > Hh) p(`${tag}: 곁말 ${nid}가 viewBox 밖 (${b.x.toFixed(1)}..${(b.x + b.w).toFixed(1)})`)
    for (const [id, r] of ne) if (rectOv(b, r)) p(`${tag}: 곁말 ${nid}가 노드 ${id}와 겹침`)
    for (const [gid, lb] of Object.entries(labels)) if (rectOv(b, lb)) p(`${tag}: 곁말 ${nid}가 그룹 라벨 ${gid}와 겹침`)
    for (const [gid, g] of Object.entries(groups)) {
      const crossesV = [g.x, g.x + g.w].some((ex) => b.x < ex && ex < b.x + b.w) && ov(b.y, b.y + b.h, g.y, g.y + g.h)
      const crossesH = [g.y, g.y + g.h].some((ey) => b.y < ey && ey < b.y + b.h) && ov(b.x, b.x + b.w, g.x, g.x + g.w)
      if (crossesV || crossesH) p(`${tag}: 곁말 ${nid}가 그룹 ${gid}의 변에 걸침`)
    }
    for (const { pid, s } of all) if (segHitsBox(s, b)) p(`${tag}: 경로 ${pid}가 곁말 ${nid}를 지남`)
  }
  const bk = Object.keys(boxes)
  for (let i = 0; i < bk.length; i++) for (let j = i + 1; j < bk.length; j++) if (rectOv(boxes[bk[i]], boxes[bk[j]])) p(`${tag}: 곁말 ${bk[i]}·${bk[j]} 겹침`)
}

if (problems.length) { console.log(`✗ ${problems.length}건`); for (const m of problems) console.log('  - ' + m); process.exit(1) }
console.log(`✓ 문제 없음 — 단계 그림 ${Object.keys(figures).length}장(노드 ${nodeCount}·경로 ${pathCount})`)
