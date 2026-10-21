// 설계 검사: 경계·라벨 폭·노드 겹침·경로 교차·끝점·곁말·그룹 라벨(겹침·경로 통과)·같은 장면 경로 겹침·소속·근거 id·캡션 길이. 사용법: node phases/64-container-visuals/tools/check-design.mjs [저장소 경로]
// 새 개념 둘(container·container-orchestration)을 앵커·근거로 쓰므로 step 0을 적용한 topics.json에서 돌린다. 그 전에는 「앵커 없음」·「근거 없음」이 나는 것이 정상이다.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { diagrams, tables } from './design-spec.mjs'

const repo = process.argv[2] ?? fileURLToPath(new URL('../../..', import.meta.url))
const topics = JSON.parse(readFileSync(`${repo}/src/data/topics.json`, 'utf8'))
const conceptIds = new Set(topics.flatMap((t) => t.concepts.map((c) => c.id)))

const full = /[\p{Script=Hangul}\p{Script=Han}⺀-꓏︐-︙︰-﹯！-｠￠-￦]/u
const tw = (s, f) => [...s].reduce((w, ch) => w + f * (full.test(ch) ? 1 : 0.55), 0)
const H = 32
const problems = []
const warn = []
const p = (m) => problems.push(m)

const segs = (d) => {
  const out = []; let x = 0, y = 0
  const tokens = [...d.matchAll(/([MHV])\s*(-?\d+)(?:\s+(-?\d+))?/g)]
  for (const [, c, a, b] of tokens) {
    if (c === 'M') { x = +a; y = +b; continue }
    const from = { x, y }; if (c === 'H') x = +a; else y = +a
    out.push({ from, to: { x, y } })
  }
  return out
}
const pts = (d) => { const s = segs(d); return { start: s[0].from, end: s[s.length - 1].to } }
const ov = (a1, a2, b1, b2) => Math.min(a2, b2) - Math.max(a1, b1) > 0
const rectOv = (a, b) => ov(a.x, a.x + a.w, b.x, b.x + b.w) && ov(a.y, a.y + a.h, b.y, b.y + b.h)
const segCrossRect = (s, r) => {
  const [x1, x2] = [s.from.x, s.to.x].sort((a, b) => a - b)
  const [y1, y2] = [s.from.y, s.to.y].sort((a, b) => a - b)
  if (y1 === y2) return r.y < y1 && y1 < r.y + r.h && ov(x1, x2, r.x, r.x + r.w)
  return r.x < x1 && x1 < r.x + r.w && ov(y1, y2, r.y, r.y + r.h)
}
const onEdge = (pt, r) => {
  const inX = pt.x >= r.x && pt.x <= r.x + r.w, inY = pt.y >= r.y && pt.y <= r.y + r.h
  return (inX && (pt.y === r.y || pt.y === r.y + r.h)) || (inY && (pt.x === r.x || pt.x === r.x + r.w))
}
const noteBox = (text, [x, y, anchor]) => {
  const w = tw(text, 9)
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  return { x: left, y: y - 7, w, h: 9 }
}
const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h

for (const [key, d] of Object.entries(diagrams)) {
  if (!conceptIds.has(d.anchor)) p(`${key}: 앵커 ${d.anchor} 없음`)
  for (const s of [...d.sources, ...d.scenarios.flatMap((sc) => sc.sources)]) if (!conceptIds.has(s)) p(`${key}: 근거 ${s} 없음`)
  for (const sc of d.scenarios) if ([...sc.caption].length > 57) warn.push(`${key}/${sc.id}: 캡션 ${[...sc.caption].length}자 > 57`)

  for (const lay of ['tall', 'wide']) {
    const L = d[lay]; const [W, Hh] = L.viewBox; const tag = `${key} [${lay}]`
    const nodes = Object.fromEntries(Object.entries(L.nodes).map(([id, [x, y, w]]) => [id, { x, y, w, h: H }]))
    const groups = Object.fromEntries(Object.entries(L.groups).map(([id, [x, y, w, h]]) => [id, { x, y, w, h }]))
    const ids = Object.keys(d.labels)
    for (const id of ids) if (!nodes[id]) p(`${tag}: 노드 ${id} 좌표 없음`)
    for (const id of Object.keys(nodes)) if (!d.labels[id]) p(`${tag}: 노드 ${id} 라벨 없음`)
    // 경계·라벨
    for (const [id, r] of [...Object.entries(nodes), ...Object.entries(groups)]) {
      if (r.x < 0 || r.y < 0 || r.x + r.w > W || r.y + r.h > Hh) p(`${tag}: ${id} 상자가 viewBox 밖 (${r.x},${r.y},${r.w},${r.h})`)
    }
    for (const [id, r] of Object.entries(nodes)) {
      const need = tw(d.labels[id], 10) + 12
      if (need > r.w) p(`${tag}: 노드 ${id} 라벨 '${d.labels[id]}' ${need.toFixed(1)} > 폭 ${r.w}`)
    }
    // 노드 겹침
    const ne = Object.entries(nodes)
    for (let i = 0; i < ne.length; i++) for (let j = i + 1; j < ne.length; j++) if (rectOv(ne[i][1], ne[j][1])) p(`${tag}: 노드 ${ne[i][0]}·${ne[j][0]} 겹침`)
    // 그룹 라벨
    const gLabelBoxes = {}
    for (const [id, g] of Object.entries(groups)) {
      const lb = { x: g.x + 10, y: g.y + 14 - 7, w: tw(d.groupLabels[id], 9), h: 9 }
      gLabelBoxes[id] = lb
      if (lb.x + lb.w > g.x + g.w) p(`${tag}: 그룹 라벨 ${id}가 박스 오른쪽을 넘음`)
      for (const [nid, r] of ne) if (rectOv(lb, r)) p(`${tag}: 그룹 라벨 ${id}가 노드 ${nid}와 겹침`)
      // 중첩 그룹(VPC 안의 서브넷처럼)은 바깥 그룹 안에 라벨이 놓이는 것이 정상이라 건너뛴다.
      for (const [gid, g2] of Object.entries(groups)) if (gid !== id && !inside(g, g2) && inside({ x: lb.x, y: lb.y, w: 1, h: 1 }, g2) && rectOv(lb, g2)) {
        const inter = lb.x >= g2.x && lb.x <= g2.x + g2.w && lb.y >= g2.y && lb.y <= g2.y + g2.h
        if (inter) p(`${tag}: 그룹 라벨 ${id}가 다른 그룹 ${gid} 안에 놓임`)
      }
    }
    // 소속
    for (const [gid, mem] of Object.entries(d.members)) {
      const g = groups[gid]; if (!g) { p(`${tag}: 그룹 ${gid} 좌표 없음`); continue }
      for (const [nid, r] of ne) {
        if (mem.includes(nid)) { if (!inside(r, g)) p(`${tag}: ${nid}가 그룹 ${gid} 안에 있지 않음`) }
        else if (rectOv(r, g)) p(`${tag}: ${nid}가 소속 아닌 그룹 ${gid}와 겹침`)
      }
    }
    // 경로
    const pathIds = Object.keys(L.paths)
    for (const [pid, dd] of Object.entries(L.paths)) {
      for (const s of segs(dd)) for (const [nid, r] of ne) if (segCrossRect(s, r)) p(`${tag}: 경로 ${pid} 선분 (${s.from.x},${s.from.y})→(${s.to.x},${s.to.y})가 노드 ${nid} 내부 통과`)
      const { start, end } = pts(dd)
      if (!ne.some(([, r]) => onEdge(start, r))) p(`${tag}: 경로 ${pid} 시작점 (${start.x},${start.y})이 노드 변 위가 아님`)
      if (![...ne.map(([, r]) => r), ...Object.values(groups)].some((r) => onEdge(end, r))) p(`${tag}: 경로 ${pid} 끝점 (${end.x},${end.y})이 노드·그룹 변 위가 아님`)
      for (const s of segs(dd)) for (const pt of [s.from, s.to]) if (pt.x < 0 || pt.x > W || pt.y < 0 || pt.y > Hh) p(`${tag}: 경로 ${pid}가 viewBox 밖`)
    }
    // 그룹 라벨을 경로가 지나가는가(장면과 무관하게 본다)
    for (const [gid, lb] of Object.entries(gLabelBoxes)) for (const [pid, dd] of Object.entries(L.paths)) for (const s of segs(dd)) {
      const [x1, x2] = [s.from.x, s.to.x].sort((a, c) => a - c); const [y1, y2] = [s.from.y, s.to.y].sort((a, c) => a - c)
      const hit = y1 === y2 ? (lb.y <= y1 && y1 <= lb.y + lb.h && ov(x1, x2, lb.x - 2, lb.x + lb.w + 2)) : (lb.x - 2 <= x1 && x1 <= lb.x + lb.w + 2 && ov(y1, y2, lb.y, lb.y + lb.h))
      if (hit) p(`${tag}: 경로 ${pid}가 그룹 라벨 ${gid}를 지남`)
    }
    // 곁말
    const noteBoxes = {}
    for (const [nid, spec] of Object.entries(L.notes)) {
      const text = d.noteTexts[nid]; if (!text) { p(`${tag}: 곁말 ${nid} 글 없음`); continue }
      const b = noteBox(text, spec); noteBoxes[nid] = b
      if (b.x < 0 || b.x + b.w > W || b.y < 0 || b.y + b.h > Hh) p(`${tag}: 곁말 ${nid} '${text}'가 viewBox 밖 (${b.x.toFixed(1)}..${(b.x + b.w).toFixed(1)})`)
      for (const [id, r] of ne) if (rectOv(b, r)) p(`${tag}: 곁말 ${nid}가 노드 ${id}와 겹침`)
      for (const [gid, lb] of Object.entries(gLabelBoxes)) if (rectOv(b, lb)) p(`${tag}: 곁말 ${nid}가 그룹 라벨 ${gid}와 겹침`)
      for (const [gid, g] of Object.entries(groups)) {
        // 그룹 변을 곁말이 가로지르면 안 된다
        const crossesV = [g.x, g.x + g.w].some((ex) => b.x < ex && ex < b.x + b.w) && ov(b.y, b.y + b.h, g.y, g.y + g.h)
        const crossesH = [g.y, g.y + g.h].some((ey) => b.y < ey && ey < b.y + b.h) && ov(b.x, b.x + b.w, g.x, g.x + g.w)
        if (crossesV || crossesH) p(`${tag}: 곁말 ${nid}가 그룹 ${gid}의 변에 걸침`)
      }
    }
    for (const id of Object.keys(d.noteTexts)) if (!L.notes[id]) p(`${tag}: 곁말 ${id} 자리 없음`)
    // 장면
    for (const sc of d.scenarios) {
      for (const id of sc.nodes) if (!nodes[id]) p(`${tag}/${sc.id}: 노드 ${id} 없음`)
      for (const id of sc.paths) if (!L.paths[id]) p(`${tag}/${sc.id}: 경로 ${id} 없음`)
      for (const id of sc.notes) if (!L.notes[id]) p(`${tag}/${sc.id}: 곁말 ${id} 없음`)
      // 같은 장면 곁말끼리
      for (let i = 0; i < sc.notes.length; i++) for (let j = i + 1; j < sc.notes.length; j++) {
        if (rectOv(noteBoxes[sc.notes[i]], noteBoxes[sc.notes[j]])) p(`${tag}/${sc.id}: 곁말 ${sc.notes[i]}·${sc.notes[j]} 겹침`)
      }
      // 같은 장면 경로가 곁말을 지나가는가
      for (const pid of sc.paths) for (const s of segs(L.paths[pid])) for (const nid of sc.notes) {
        const b = noteBoxes[nid]; const [x1, x2] = [s.from.x, s.to.x].sort((a, c) => a - c); const [y1, y2] = [s.from.y, s.to.y].sort((a, c) => a - c)
        const hit = y1 === y2 ? (b.y <= y1 && y1 <= b.y + b.h && ov(x1, x2, b.x, b.x + b.w)) : (b.x <= x1 && x1 <= b.x + b.w && ov(y1, y2, b.y, b.y + b.h))
        if (hit) p(`${tag}/${sc.id}: 경로 ${pid}가 곁말 ${nid}를 지남`)
      }
      // 같은 장면 경로끼리 같은 선 위에서 겹치는가
      const all = sc.paths.flatMap((pid) => segs(L.paths[pid]).map((s) => ({ pid, s })))
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
        const a = all[i], b = all[j]; if (a.pid === b.pid) continue
        const ah = a.s.from.y === a.s.to.y, bh = b.s.from.y === b.s.to.y
        if (ah && bh && a.s.from.y === b.s.from.y && ov(...[a.s.from.x, a.s.to.x].sort((m, n) => m - n), ...[b.s.from.x, b.s.to.x].sort((m, n) => m - n))) p(`${tag}/${sc.id}: 경로 ${a.pid}·${b.pid}가 y ${a.s.from.y}에서 겹침`)
        if (!ah && !bh && a.s.from.x === b.s.from.x && ov(...[a.s.from.y, a.s.to.y].sort((m, n) => m - n), ...[b.s.from.y, b.s.to.y].sort((m, n) => m - n))) p(`${tag}/${sc.id}: 경로 ${a.pid}·${b.pid}가 x ${a.s.from.x}에서 겹침`)
      }
    }
    if (lay === 'wide') {
      const tallIds = Object.keys(d.tall.paths).sort().join(), wideIds = pathIds.sort().join()
      if (tallIds !== wideIds) p(`${key}: 두 배치의 경로 id가 다름`)
      if (Object.keys(d.tall.groups).sort().join() !== Object.keys(L.groups).sort().join()) p(`${key}: 두 배치의 그룹 id가 다름`)
    }
  }
}

for (const [key, t] of Object.entries(tables)) {
  if (!conceptIds.has(t.anchor)) p(`${key}: 앵커 없음`)
  for (const s of t.sources) if (!conceptIds.has(s)) p(`${key}: 근거 ${s} 없음`)
  if (t.columns.length > 3) p(`${key}: 열이 셋 넘음`)
  if (t.columnWidths.reduce((a, w) => a + parseFloat(w), 0) !== 100) p(`${key}: 열 폭 합이 100이 아님`)
  for (const r of t.rows) if (r.cells.length !== t.columns.length - 1) p(`${key}: 행 ${r.header} 칸 수`)
}

const counts = Object.values(diagrams).reduce((a, d) => ({ n: a.n + Object.keys(d.tall.nodes).length, p: a.p + Object.keys(d.tall.paths).length }), { n: 0, p: 0 })
for (const w of warn) console.log('  ! ' + w)
if (problems.length) { console.log(`✗ ${problems.length}건`); for (const m of problems) console.log('  - ' + m); process.exit(1) }
console.log(`✓ 문제 없음 — 도식 ${Object.keys(diagrams).length}장(노드 ${counts.n}·경로 ${counts.p}), 표 ${Object.keys(tables).length}개`)
