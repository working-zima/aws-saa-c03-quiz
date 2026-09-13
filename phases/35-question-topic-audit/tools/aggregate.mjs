#!/usr/bin/env node
/**
 * audit/verdicts.jsonl의 판정을 사람이 읽는 보고서로 집계한다.
 * 판정을 만들거나 고치지 않는다 — 세고 묶어서 audit/report.md와 audit/by-topic/<topicId>.md를 쓴다.
 *
 * 보고서의 숫자는 전부 여기서 센다. 사람이 쓴 글은 AMBIGUOUS_ISSUES(ambiguous 문항의 두 해석)
 * 하나뿐이고, 그 목록이 판정 파일의 ambiguous 집합과 어긋나면 보고서를 쓰지 않고 실패한다.
 * 판정 파일에 누락·중복이 있어도 쓰지 않고 실패한다.
 *
 * 사용법: node phases/35-question-topic-audit/tools/aggregate.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const VERDICTS = ['keep', 'ambiguous', 'move-recommended']
const FITS = ['yes', 'partial', 'no']
const CONFIDENCES = ['high', 'medium', 'low']
const DISTRIBUTION_LABELS = {
  keep: 'keep', ambiguous: 'ambiguous', move: 'move-recommended',
  high: 'confidence high', medium: 'confidence medium', low: 'confidence low',
  yes: 'conceptFit yes', partial: 'conceptFit partial', no: 'conceptFit no',
}

// ambiguous 판정마다 rationale이 적은 두 해석을 한 줄씩 옮긴 요약이다. current는 현재 주제로,
// alternative는 other 주제로 읽을 때다. 판정을 고치면 이 목록도 함께 고친다.
export const AMBIGUOUS_ISSUES = {
  q348: {
    issue: 'EFS 복제의 단방향 제약 ↔ DataSync 작업 구성',
    other: 'data-transfer-services',
    current: 'EFS 자체 복제가 단방향이라는 제약과 그 대안을 고르는 문제다. 현재 개념이 두 구성을 직접 설명한다.',
    alternative: '문제문이 자체 복제 불가를 이미 알려 주고 해설이 관리형 증분 전송을 rsync·SFTP와 비교하므로 DataSync 작업 구성 문제다. 그 주제에는 양방향 작업을 직접 설명하는 개념이 없다.',
  },
  q364: {
    issue: 'DataSync 상태 이벤트 ↔ EventBridge·SNS 알림 패턴',
    other: 'sqs-sns-eventbridge',
    current: 'DataSync가 성공·오류 상태 변화를 이벤트로 낸다는 기능을 알아야 매니페스트·Transfer Family 로그 보기를 배제한다.',
    alternative: '이벤트 소스를 바꿔도 EventBridge 규칙과 SNS가 폴링 코드를 대신하는 논리가 같다(`eventbridge-event-pattern-vs-polling`).',
  },
  q400: {
    issue: 'Aurora 클론의 적용 범위 ↔ 서비스 백업 보존 한계를 넘는 AWS Backup',
    other: 'backup-disaster-recovery',
    current: '해설이 클론은 Aurora 전용이라 일반 RDS에 쓸 수 없다는 대비를 정답 근거 앞자리에 두므로 클론의 적용 범위를 확인하는 문항이다.',
    alternative: '대상을 DynamoDB·EFS로 바꿔도 자동 백업 35일을 넘는 보존과 시점 복원은 AWS Backup 계획이라는 논리가 같다(`backup-long-term-retention`).',
  },
  q459: {
    issue: '내부 로드 밸런서 ↔ 사설 이름 해석(호스팅 영역)',
    other: 'route53',
    current: '내부 로드 밸런서의 사설 주소와 DNS 공개 여부를 구분하는 구성 문제다. 현재 개념이 두 조건을 직접 설명한다.',
    alternative: '퍼블릭·프라이빗 호스팅 영역을 가른 두 보기는 내부 로드 밸런서 지식만으로 고를 수 없어 이름 해석 지식이 따로 필요하다.',
  },
  q497: {
    issue: 'Lambda 동시 실행 한도 진단 ↔ 큐로 급증분을 보관하는 통합 패턴',
    other: 'sqs-sns-eventbridge',
    current: 'TooManyRequestsException과 예약된 동시성·메모리 설정의 한계를 진단하는 문제다. 현재 개념이 대응까지 직접 설명한다.',
    alternative: '처리량이 제한된 다른 소비자로 바꿔도 큐가 급증분을 보관하고 알림은 버퍼가 아니라는 논리가 같다(`sns-is-not-a-queue`).',
  },
  q538: {
    issue: 'HTTP API를 CloudFront 오리진으로 연동 ↔ 한 배포의 여러 오리진과 엣지 캐싱',
    other: 'cloudfront-global-accelerator',
    current: 'HTTP API를 오리진으로 등록하는 연동 지식이 답을 가르고, WebSocket 유형 변경·사용자 지정 도메인만으로는 요구를 채우지 못한다.',
    alternative: '동적 원본을 바꿔도 한 배포의 여러 오리진과 엣지 캐싱으로 지연·원본 호출을 줄인다는 전송 지식이 남는다(q154·q468과 같은 구조).',
  },
  q656: {
    issue: 'CloudWatch 알람 상태 변경 이벤트 ↔ EventBridge 규칙의 직접 대상 호출',
    other: 'sqs-sns-eventbridge',
    current: '알람의 상태 변경 자체가 이벤트로 나간다는 기능이 상세 모니터링만으로는 대응할 수 없음을 가른다. 현재 개념이 이 연결을 직접 설명한다.',
    alternative: '상태 변경 소스를 바꿔도 함수 경유와 사람 알림을 배제하는 것은 EventBridge 규칙이 대상을 직접 부른다는 통합 지식이다.',
  },
  q667: {
    issue: 'ACM 만료 임박 이벤트 ↔ 이벤트 기반 알림 패턴',
    other: 'sqs-sns-eventbridge',
    current: 'ACM이 만료 임박 이벤트를 발행한다는 기능이 날짜를 계산하는 함수와 도메인 검증 방식 보기를 배제한다.',
    alternative: '이벤트 소스를 바꿔도 코드 없는 구성을 가르는 것은 폴링 대신 이벤트 패턴, 알림에는 큐가 아니라 SNS라는 통합 지식이다.',
  },
  q684: {
    issue: 'Macie 탐지 결과의 EventBridge 전달 ↔ 알림 자리에 큐를 두지 않는 통합 패턴',
    other: 'sqs-sns-eventbridge',
    current: 'Macie 탐지 결과가 EventBridge로 나가 유형별로 걸러진다는 기능이 저장 데이터를 보지 않는 GuardDuty 보기를 배제한다.',
    alternative: '탐지 서비스를 바꿔도 큐·버킷 두 오답을 가르는 것은 알림이 필요한 곳에 큐를 두지 않는다는 지식이다(`sns-is-not-a-queue`).',
  },
  q728: {
    issue: '용량 예약·절약 플랜과의 비용 비교 ↔ 중단 허용 작업의 스팟 적합성',
    other: 'ec2-autoscaling',
    current: '오답 둘이 절약 플랜이고, 약정 할인보다 낮은 비용과 용량 확보의 차이를 현재 개념이 직접 다룬다.',
    alternative: '중단을 견디는 배치 작업에 스팟을 고르는 문제로 보면 `spot-workload-fit`이 중심 대상을 더 직접 설명한다.',
  },
}

const isMove = (row) => row.verdict === 'move-recommended'
const countBy = (rows, keys, pick) =>
  Object.fromEntries(keys.map((key) => [key, rows.filter((row) => pick(row) === key).length]))

function distribution(rows) {
  const verdicts = countBy(rows, VERDICTS, (row) => row.verdict)
  return {
    keep: verdicts.keep, ambiguous: verdicts.ambiguous, move: verdicts['move-recommended'],
    ...countBy(rows.filter(isMove), CONFIDENCES, (row) => row.confidence),
    ...countBy(rows, FITS, (row) => row.conceptFit),
  }
}

/** step summary 문장에서 판정 분포를 읽는다. 분포를 적지 않은 summary면 null이다. */
export function parseStepSummary(summary) {
  const verdict = summary.match(/keep (\d+)·ambiguous (\d+)(?:\(([^)]*)\))?·move-recommended (\d+)(?:\(([^)]*)\))?/)
  const confidence = summary.match(/confidence high (\d+)·medium (\d+)·low (\d+)/)
  const fit = summary.match(/conceptFit yes (\d+)·partial (\d+)(?:\([^)]*\))?·no (\d+)/)
  if (!verdict || !confidence || !fit) return null
  const ids = (text) => (text ? text.split('·') : [])
  return {
    keep: Number(verdict[1]), ambiguous: Number(verdict[2]), move: Number(verdict[4]),
    high: Number(confidence[1]), medium: Number(confidence[2]), low: Number(confidence[3]),
    yes: Number(fit[1]), partial: Number(fit[2]), no: Number(fit[3]),
    ambiguousIds: ids(verdict[3]), moveIds: ids(verdict[5]),
  }
}

/**
 * 무인 실행기가 판정 묶음마다 걸던 규칙 그대로다: 이동 권고 비율이 앞 묶음 누적 비율보다
 * max(25%, 누적×3+5%p)를 넘거나, 누적이 10%를 넘는데 그 3분의 1 아래로 떨어지면 경고한다.
 */
export function stepWarnings(stepRows) {
  const warnings = []
  let judged = 0
  let moved = 0
  for (const row of stepRows) {
    const total = row.keep + row.ambiguous + row.move
    const moveRate = row.move / Math.max(1, total)
    if (judged > 0) {
      const prevRate = moved / judged
      if (moveRate > Math.max(0.25, prevRate * 3 + 0.05) || (prevRate > 0.1 && moveRate < prevRate / 3)) {
        warnings.push({ step: row.step, prevRate, moveRate })
      }
    }
    judged += total
    moved += row.move
  }
  return warnings
}

export function aggregate({ verdicts, worksheet, topics, steps, ambiguousIssues = AMBIGUOUS_ISSUES }) {
  const sheetById = new Map(worksheet.map((row) => [row.id, row]))
  const seen = new Set()
  const integrity = { duplicates: [], missing: [], unknown: [], relinked: [] }
  for (const row of verdicts) {
    if (seen.has(row.id)) integrity.duplicates.push(row.id)
    seen.add(row.id)
    const sheet = sheetById.get(row.id)
    if (!sheet) integrity.unknown.push(row.id)
    else if (sheet.topicId !== row.topicId || sheet.conceptId !== row.conceptId) integrity.relinked.push(row.id)
  }
  integrity.missing = worksheet.filter((row) => !seen.has(row.id)).map((row) => row.id)
  const problems = [
    ['중복', integrity.duplicates], ['누락', integrity.missing],
    ['워크시트에 없는 id', integrity.unknown], ['워크시트와 다른 topicId·conceptId', integrity.relinked],
  ].filter(([, ids]) => ids.length).map(([label, ids]) => `${label} ${ids.length}건 — ${ids.join(', ')}`)
  if (problems.length) throw new Error(`판정 파일을 집계할 수 없다: ${problems.join(' / ')}`)

  const rows = [...verdicts].sort((a, b) => a.id.localeCompare(b.id))
  const moves = rows.filter(isMove)
  const ambiguous = rows.filter((row) => row.verdict === 'ambiguous')

  const issueIds = Object.keys(ambiguousIssues).sort()
  const ambiguousIds = ambiguous.map((row) => row.id)
  if (issueIds.join() !== ambiguousIds.join()) {
    throw new Error(`AMBIGUOUS_ISSUES 쟁점 목록이 판정 파일과 다르다 — 판정 ${ambiguousIds.join(', ') || '없음'} / 쟁점 ${issueIds.join(', ') || '없음'}`)
  }
  for (const row of ambiguous) {
    const { other } = ambiguousIssues[row.id]
    if (other === row.topicId || ![row.recommendedTopic, ...row.secondaryTopics].includes(other)) {
      throw new Error(`${row.id}: 다른 해석의 주제 ${other}가 판정의 recommendedTopic·secondaryTopics에 없다`)
    }
  }

  const topicOrder = new Map(topics.map((topic, index) => [topic.id, index]))
  const pairMap = new Map()
  for (const row of moves) {
    const key = `${row.topicId} ${row.recommendedTopic}`
    if (!pairMap.has(key)) pairMap.set(key, { from: row.topicId, to: row.recommendedTopic, rows: [] })
    pairMap.get(key).rows.push(row)
  }
  const pairs = [...pairMap.values()].sort((a, b) => b.rows.length - a.rows.length ||
    topicOrder.get(a.from) - topicOrder.get(b.from) || topicOrder.get(a.to) - topicOrder.get(b.to))

  // 문항 단위 coverageConflict는 "현재 개념의 유일한 문항"만 잡는다. 여러 문항이 한꺼번에
  // 옮겨 가 개념이 비는 경우는 개념 단위로 따로 센다.
  const movesByConcept = new Map()
  for (const row of moves) movesByConcept.set(row.conceptId, [...(movesByConcept.get(row.conceptId) ?? []), row])
  const emptiedConcepts = [...movesByConcept]
    .filter(([, moving]) => sheetById.get(moving[0].id).questionsInConcept === moving.length)
    .map(([conceptId, moving]) => ({ conceptId, questions: moving.length, rows: moving }))

  const recorded = steps.flatMap((entry) => {
    const parsed = parseStepSummary(entry.summary ?? '')
    return parsed ? [{ step: entry.step, name: entry.name, ...parsed }] : []
  })
  const judgingSteps = [...new Set(rows.map((row) => row.step))].sort((a, b) => a - b)
  const judged = judgingSteps.map((step) => {
    const record = recorded.find((entry) => entry.step === step)
    if (!record) throw new Error(`step ${step}: index.json summary에서 판정 분포를 읽을 수 없다`)
    const current = rows.filter((row) => row.step === step)
    // summary가 ambiguous·move 문항 id를 전부 적어 두었을 때만 문항 단위로 대조할 수 있다.
    const listed = record.ambiguousIds.length === record.ambiguous && record.moveIds.length === record.move
    const recordedVerdict = (id) => record.moveIds.includes(id) ? 'move-recommended'
      : record.ambiguousIds.includes(id) ? 'ambiguous' : 'keep'
    const changed = !listed ? null : current
      .filter((row) => recordedVerdict(row.id) !== row.verdict)
      .map((row) => ({ row, from: recordedVerdict(row.id) }))
    return { record, current: distribution(current), changed }
  })

  return {
    total: rows.length,
    worksheetTotal: worksheet.length,
    integrity,
    rows,
    sheetById,
    topicById: new Map(topics.map((topic) => [topic.id, topic])),
    verdictCounts: countBy(rows, VERDICTS, (row) => row.verdict),
    confidenceCounts: countBy(moves, CONFIDENCES, (row) => row.confidence),
    fitCounts: countBy(rows, FITS, (row) => row.conceptFit),
    distribution: distribution(rows),
    moves,
    pairs,
    topicStats: topics.map((topic) => {
      const topicRows = rows.filter((row) => row.topicId === topic.id)
      return {
        id: topic.id,
        title: topic.title,
        rows: topicRows,
        verdictCounts: countBy(topicRows, VERDICTS, (row) => row.verdict),
        fitCounts: countBy(topicRows, FITS, (row) => row.conceptFit),
        moves: topicRows.filter(isMove),
        incoming: moves.filter((row) => row.recommendedTopic === topic.id),
      }
    }),
    ready: moves.filter((row) => row.retarget === 'ready'),
    needsDesign: moves.filter((row) => row.retarget === 'needs-design')
      .map((row) => ({ row, reason: row.recommendedConceptId === null ? '대상 개념 없음' : 'coverageConflict' })),
    coverageConflicts: rows.filter((row) => row.coverageConflict),
    emptiedConcepts,
    moveYes: moves.filter((row) => row.conceptFit === 'yes'),
    keepNo: rows.filter((row) => row.verdict === 'keep' && row.conceptFit === 'no'),
    keepPartial: rows.filter((row) => row.verdict === 'keep' && row.conceptFit === 'partial'),
    ambiguous: ambiguous.map((row) => ({ row, issue: ambiguousIssues[row.id] })),
    judged,
    later: recorded.filter((entry) => !judgingSteps.includes(entry.step)),
    warnings: stepWarnings(judged.map(({ record }) => record)),
  }
}

const pct = (count, total) => `${total ? ((count / total) * 100).toFixed(1) : '0.0'}%`
const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ')
const table = (head, body) =>
  [head, head.map(() => '---'), ...body].map((cells) => `| ${cells.map(cell).join(' | ')} |`).join('\n')
const idList = (rows) => (rows.length ? rows.map((row) => row.id).join(' · ') : '없음')
const code = (value) => `\`${value}\``
// 같은 주제 안의 개념은 주제 접두사를 떼어 짧게 보인다.
const conceptLabel = (conceptId, topicId) => conceptId === null ? '없음'
  : conceptId.startsWith(`${topicId}.`) ? conceptId.slice(topicId.length + 1) : conceptId
const diffText = (from, to) => Object.keys(DISTRIBUTION_LABELS)
  .filter((key) => from[key] !== to[key])
  .map((key) => `${DISTRIBUTION_LABELS[key]} ${to[key] > from[key] ? '+' : '−'}${Math.abs(to[key] - from[key])}`)
  .join(' · ') || '없음'
const distributionCells = (d) =>
  [d.keep + d.ambiguous + d.move, d.keep, d.ambiguous, d.move, `${d.high}·${d.medium}·${d.low}`, `${d.yes}·${d.partial}·${d.no}`]

export function renderReport(stats) {
  const { total, sheetById } = stats
  const prompt = (row) => sheetById.get(row.id).prompt
  const moveCells = (row) => [row.id, code(row.conceptId), row.recommendedConceptId === null ? '없음' : code(row.recommendedConceptId)]
  const sum = (key) => stats.judged.reduce((acc, { record }) => acc + record[key], 0)
  const judgedTotal = Object.fromEntries(Object.keys(DISTRIBUTION_LABELS).map((key) => [key, sum(key)]))
  const q364 = stats.rows.find((row) => row.id === 'q364')
  const q364Issue = stats.ambiguous.find(({ row }) => row.id === 'q364')?.issue
  const otherTopics = [...new Set(stats.ambiguous.map(({ issue }) => issue.other))]
    .map((topicId) => ({ topicId, rows: stats.ambiguous.filter(({ issue }) => issue.other === topicId).map(({ row }) => row) }))
    .sort((a, b) => b.rows.length - a.rows.length)
  const { integrity } = stats

  const sections = [
    `# phase 35 문항 topic 배정 감사 — 집계 보고서

이 파일과 \`by-topic/\`의 주제 파일은 \`tools/aggregate.mjs\`가 \`audit/verdicts.jsonl\`·\`audit/worksheet.jsonl\`에서
만든다. **숫자는 전부 스크립트가 센 값이다.** 손으로 고치지 말고, 판정을 고친 뒤 스크립트를 다시 돌린다.
이 보고서는 조사 결과이고 **문항 이동은 아직 승인되지 않았다** — 재배정은 별도 phase에서 한다.`,

    `## 판정 기준 — ADR-034

문항의 주제는 시나리오에 등장하는 서비스가 아니라 **정답을 오답과 가르는 결정적 지식**(\`decidingKnowledge\`)이
정한다. 그 지식을 설명하는 개념이 primary concept이고 그 개념의 주제가 primary topic이며, 정답 구성에 함께 쓰이지만
답을 가르지 않는 지식은 \`secondaryTopics\`에 기록만 한다. 판정은 결정 지식을 한 문장으로 쓰고, 시나리오 서비스를 같은
계열의 다른 서비스로 바꿔 보고, 오답 셋이 무엇을 오해했는지 본 뒤, 여러 서비스가 조합되면 답을 가르는 쪽을 primary로
잡는 순서로 하며, 이것들이 한 곳을 가리키지 않으면 억지로 옮기지 않고 \`ambiguous\`로 남긴다. \`conceptFit\`은 지금
연결된 개념이 그 중심 지식 자체를 직접 설명하는지를 따로 재는 축이다. \`coverageConflict\`·\`retarget\`은 판정 뒤에
계산하는 구현 제약이라 의미 판정을 뒤집는 근거가 되지 않고, 실제 재배정은 \`topicId\`와 \`conceptId\`를 함께 옮기는 일이다.`,

    `## 1. 판정 수와 누락·중복

판정 ${total}건을 워크시트 문항 ${stats.worksheetTotal}건과 문항 id 집합으로 대조했다.

${table(['항목', '건수'], [
  ['판정', total], ['워크시트 문항', stats.worksheetTotal], ['누락', integrity.missing.length],
  ['중복', integrity.duplicates.length], ['워크시트에 없는 id', integrity.unknown.length],
  ['현재 topicId·conceptId와 다른 줄', integrity.relinked.length],
])}

누락·중복이 하나라도 있으면 이 스크립트는 보고서를 쓰지 않고 실패한다.`,

    `## 2. verdict

${table(['verdict', '수', '비율'], [
  ...VERDICTS.map((verdict) => [verdict, stats.verdictCounts[verdict], pct(stats.verdictCounts[verdict], total)]),
  ['합계', VERDICTS.reduce((acc, verdict) => acc + stats.verdictCounts[verdict], 0), pct(total, total)],
])}`,

    `## 3. move-recommended의 confidence

move-recommended ${stats.moves.length}건의 확신도다.

${table(['confidence', '수', '문항'], CONFIDENCES.map((confidence) => {
  const rows = stats.moves.filter((row) => row.confidence === confidence)
  return [confidence, rows.length, idList(rows)]
}))}`,

    `## 4. conceptFit

${table(['conceptFit', '수', '비율', '문항'], FITS.map((fit) => {
  const rows = stats.rows.filter((row) => row.conceptFit === fit)
  return [fit, rows.length, pct(rows.length, total), fit === 'yes' ? '—' : idList(rows)]
}))}`,

    `## 5. 현재 topic → 권장 topic별 이동 후보

move-recommended ${stats.moves.length}건이 주제 쌍 ${stats.pairs.length}개로 묶인다.

${table(['현재 topic', '권장 topic', '수', '문항'],
  stats.pairs.map((pair) => [code(pair.from), code(pair.to), pair.rows.length, idList(pair.rows)]))}`,

    `## 6. 주제별 문항 수와 이동 후보 비율

주제 순서는 \`topics.json\` 배열 순서다. 이동 후보 비율은 그 주제의 move-recommended 수 ÷ 그 주제의 문항 수이고,
들어올 후보는 다른 주제에서 이 주제를 권장한 move-recommended다.

${table(['#', '주제', '제목', '문항', 'keep', 'ambiguous', 'move', '이동 후보 비율', '들어올 후보'],
  stats.topicStats.map((topic, index) => [
    index + 1, `[${topic.id}](by-topic/${topic.id}.md)`, topic.title, topic.rows.length,
    topic.verdictCounts.keep, topic.verdictCounts.ambiguous, topic.verdictCounts['move-recommended'],
    pct(topic.moves.length, topic.rows.length),
    topic.incoming.length ? `${topic.incoming.length} (${idList(topic.incoming)})` : 0,
  ]))}

주제 ${stats.topicStats.length}개의 문항 합 ${stats.topicStats.reduce((acc, topic) => acc + topic.rows.length, 0)}건 · 전체 판정 ${total}건.
이동 후보가 나가는 주제 ${stats.topicStats.filter((topic) => topic.moves.length).length}개, 들어오는 주제 ${stats.topicStats.filter((topic) => topic.incoming.length).length}개.`,

    `## 7. 바로 재연결 가능한 이동 후보 — retarget=ready ${stats.ready.length}건

권장 개념이 있고 문항 단위로는 현재 개념의 유일한 문항이 아닌 후보다. 한 개념에서 여러 후보가 함께 나가 그 개념이
비는 경우는 9절 「개념 단위로 본 제약」에 따로 있다.

${table(['id', '현재 개념', '권장 개념', 'confidence', 'conceptFit', 'decidingKnowledge'],
  stats.ready.map((row) => [...moveCells(row), row.confidence, row.conceptFit, row.decidingKnowledge]))}`,

    `## 8. 추가 설계가 필요한 후보 — retarget=needs-design ${stats.needsDesign.length}건

${table(['id', '현재 개념', '권장 topic', '권장 개념', '사유', 'confidence', 'conceptFit'],
  stats.needsDesign.map(({ row, reason }) => [
    row.id, code(row.conceptId), code(row.recommendedTopic),
    row.recommendedConceptId === null ? '없음' : code(row.recommendedConceptId), reason, row.confidence, row.conceptFit,
  ]))}

- **대상 개념 없음** ${stats.needsDesign.filter(({ reason }) => reason === '대상 개념 없음').length}건 — 권장 주제에 결정 지식을 중심으로 설명하는 개념이 없다. 옮기려면 추가 설계가 필요하다(ADR-034).
- **coverageConflict** ${stats.needsDesign.filter(({ reason }) => reason === 'coverageConflict').length}건 — 현재 개념의 유일한 문항이라 옮기면 그 개념에 문항이 남지 않는다(ADR-026). 재배정 phase에서 대체 문항이나 개념 재연결로 푼다(ADR-034).`,

    `## 9. coverageConflict — ${stats.coverageConflicts.length}건

${table(['id', '현재 개념', '개념의 문항 수', '권장 개념', 'verdict'],
  stats.coverageConflicts.map((row) => [
    row.id, code(row.conceptId), sheetById.get(row.id).questionsInConcept, code(row.recommendedConceptId), row.verdict,
  ]))}

### 개념 단위로 본 제약

문항 단위 \`coverageConflict\`는 현재 개념의 **유일한** 문항만 잡는다. 이동 후보를 모두 옮기면 문항이 0개가 되는
개념을 개념 단위로 다시 세면 ${stats.emptiedConcepts.length}개다.

${table(['개념', '개념의 문항 수', '이동 후보', '문항 단위 coverageConflict로 잡힘'],
  stats.emptiedConcepts.map(({ conceptId, questions, rows }) => [
    code(conceptId), questions, idList(rows), rows.some((row) => row.coverageConflict) ? '예' : '아니요',
  ]))}`,

    `## 10. move-recommended + conceptFit=yes — ${stats.moveYes.length}건

현재 개념이 중심 지식을 직접 설명하는데도 다른 주제를 권한 자리다. 개념은 맞고 주제 경계가 어긋난 경우이며,
이유는 각 판정의 \`rationale\`을 그대로 옮긴다.

${stats.moveYes.map((row) => `### ${row.id} · ${code(row.topicId)} → ${code(row.recommendedTopic)}

- 문제문: ${prompt(row)}
- 현재 개념 ${code(row.conceptId)} · 권장 개념 ${row.recommendedConceptId === null ? '없음' : code(row.recommendedConceptId)} · confidence ${row.confidence} · retarget ${row.retarget}
- 결정 지식: ${row.decidingKnowledge}
- 이유: ${row.rationale}`).join('\n\n') || '없음.'}`,

    `## 11. keep + conceptFit=no — ${stats.keepNo.length}건

${stats.keepNo.map((row) => `### ${row.id} · ${code(row.topicId)}

- 문제문: ${prompt(row)}
- 현재 개념 ${code(row.conceptId)} · 권장 개념 ${code(row.recommendedConceptId)}
- 이유: ${row.rationale}`).join('\n\n') || '없음.'}

참고로 keep + conceptFit=partial은 ${stats.keepPartial.length}건이다. 주제는 맞고 같은 주제 안의 다른 개념이 결정 지식을 더 직접
설명하는 자리라, 판정은 개념 연결만 바꾸기를 권한다.

${table(['id', '주제', '현재 개념', '권장 개념'], stats.keepPartial.map((row) => [
  row.id, code(row.topicId), conceptLabel(row.conceptId, row.topicId), conceptLabel(row.recommendedConceptId, row.topicId),
]))}`,

    `## 12. ambiguous 전체 목록과 핵심 쟁점 — ${stats.ambiguous.length}건

주제 경계를 한 곳으로 정하지 못한 문항이다. 두 해석은 각 판정의 \`rationale\`을 한 줄씩 줄여 옮긴 것이다.
판정의 \`recommendedTopic\`·\`recommendedConceptId\`는 잠정 지목일 뿐 이동 권고가 아니다.

${table(['다른 해석의 주제', '수', '문항'], otherTopics.map(({ topicId, rows }) => [code(topicId), rows.length, idList(rows)]))}

${stats.ambiguous.map(({ row, issue }) => `### ${row.id} · ${issue.issue}

- 문제문: ${prompt(row)}
- conceptFit ${row.conceptFit} · 잠정 지목 ${code(row.recommendedConceptId)}${row.recommendedTopic !== row.topicId ? ' (다른 주제)' : ''} · secondaryTopics ${row.secondaryTopics.length ? row.secondaryTopics.map(code).join(' · ') : '없음'}
- ${code(row.topicId)} 주제로 읽으면: ${issue.current}
- ${code(issue.other)} 주제로 읽으면: ${issue.alternative}`).join('\n\n')}`,

    `## 13. step별 분포와 급변 경고

### index.json summary에 기록된 분포

각 step이 끝날 때 \`summary\`에 적은 분포를 읽어 옮겼다. 판정 묶음은 그 step이 새로 판정한 문항만 센 값이다.

${table(['step', '이름', '판정', 'keep', 'ambiguous', 'move', 'confidence high·medium·low', 'conceptFit yes·partial·no'], [
  ...stats.judged.map(({ record }) => [record.step, record.name, ...distributionCells(record)]),
  ['—', '판정 묶음 합계', ...distributionCells(judgedTotal)],
  ...stats.later.map((record) => [record.step, `${record.name} (전체 재집계)`, ...distributionCells(record)]),
  ['—', '현재 판정 파일', ...distributionCells(stats.distribution)],
])}

${[
  `- 판정 묶음 합계와 현재 판정 파일의 차이: ${diffText(judgedTotal, stats.distribution)}`,
  ...stats.later.map((record) => `- step ${record.step} ${record.name} 기록과 현재 판정 파일의 차이: ${diffText(record, stats.distribution)}`),
].join('\n')}

### 급변 경고

무인 실행기가 판정 묶음마다 걸던 규칙을 위 기록에 다시 적용했다 — 그 묶음의 이동 권고 비율이 앞 묶음 누적 비율보다
max(25%, 누적×3+5%p)를 넘거나, 누적이 10%를 넘는데 그 3분의 1 아래로 떨어지면 경고다.
${stats.warnings.length ? [`경고 ${stats.warnings.length}건:`, ...stats.warnings.map((warning) =>
  `- step ${warning.step}: 앞 묶음 누적 ${pct(warning.prevRate, 1)} → 이 묶음 ${pct(warning.moveRate, 1)}`)].join('\n') : '경고 0건이다.'}

### 판정 파일의 step 필드로 다시 센 분포

\`step\` 필드는 그 문항을 처음 판정한 묶음이다. 뒤 step이 고친 판정은 아래 마지막 칸에서 기록과 다르게 드러난다.

${table(['step', '판정', 'keep', 'ambiguous', 'move', 'confidence high·medium·low', 'conceptFit yes·partial·no', 'summary 기록 이후 바뀐 판정'],
  stats.judged.map(({ record, current, changed }) => [
    record.step, ...distributionCells(current),
    changed === null ? 'summary에 문항 id가 다 적혀 있지 않아 대조하지 못함'
      : changed.map(({ row, from }) => `${row.id} ${from}→${row.verdict}`).join(' · ') || '—',
  ]))}`,

    `## 14. q364의 최종 판정과 근거

${q364 ? `- verdict **${q364.verdict}** · conceptFit **${q364.conceptFit}** · confidence ${q364.confidence ?? '—'}
- 현재 개념 ${code(q364.conceptId)} · 지목 개념 ${code(q364.recommendedConceptId)} · secondaryTopics ${q364.secondaryTopics.map(code).join(' · ') || '없음'}
- 문제문: ${prompt(q364)}
- 결정 지식: ${q364.decidingKnowledge}
- 근거: ${q364.rationale}${q364Issue ? `
- ${code(q364.topicId)} 주제로 읽으면: ${q364Issue.current}
- ${code(q364Issue.other)} 주제로 읽으면: ${q364Issue.alternative}` : ''}` : 'q364 판정이 없다.'}`,
  ]
  return `${sections.join('\n\n')}\n`
}

export function renderTopic(stats, topic) {
  const count = topic.rows.length
  const verdicts = topic.verdictCounts
  const fits = topic.fitCounts
  return `# ${topic.title}

${code(topic.id)} · \`tools/aggregate.mjs\`가 \`audit/verdicts.jsonl\`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 ${count}개 · keep ${verdicts.keep} · ambiguous ${verdicts.ambiguous} · move-recommended ${verdicts['move-recommended']}
- 이동 후보 비율 ${pct(topic.moves.length, count)} — ${idList(topic.moves)}
- conceptFit yes ${fits.yes} · partial ${fits.partial} · no ${fits.no}
- 이 주제로 들어올 이동 후보 ${topic.incoming.length}개${topic.incoming.length ? ` — ${topic.incoming.map((row) => `${row.id}(${code(row.topicId)})`).join(' · ')}` : ''}

권장 topic·개념이 현재와 같으면 \`(현재)\`로 적는다.

${table(['id', '현재 개념', 'verdict', 'confidence', 'conceptFit', '권장 topic', '권장 개념', 'coverageConflict', 'decidingKnowledge'],
  topic.rows.map((row) => [
    row.id, conceptLabel(row.conceptId, topic.id), row.verdict, row.confidence ?? '—', row.conceptFit,
    row.recommendedTopic === topic.id ? '(현재)' : row.recommendedTopic,
    row.recommendedConceptId === row.conceptId ? '(현재)' : conceptLabel(row.recommendedConceptId, topic.id),
    row.coverageConflict, row.decidingKnowledge,
  ]))}
`
}

function main() {
  const text = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
  const jsonl = (path) => text(path).split('\n').filter((line) => line.trim()).map((line) => JSON.parse(line))
  const stats = aggregate({
    verdicts: jsonl('../audit/verdicts.jsonl'),
    worksheet: jsonl('../audit/worksheet.jsonl'),
    topics: JSON.parse(text('../../../src/data/topics.json')),
    // 이 보고서 step의 summary는 보고서를 쓴 뒤에 적히므로 읽지 않는다. 읽으면 다시 돌릴 때마다 표가 달라진다.
    steps: JSON.parse(text('../index.json')).steps.filter((entry) => entry.name !== 'audit-report'),
  })
  const byTopic = new URL('../audit/by-topic/', import.meta.url)
  mkdirSync(byTopic, { recursive: true })
  writeFileSync(new URL('../audit/report.md', import.meta.url), renderReport(stats))
  for (const topic of stats.topicStats) writeFileSync(new URL(`${topic.id}.md`, byTopic), renderTopic(stats, topic))
  const { keep, ambiguous, move } = stats.distribution
  console.log(`보고서 작성 · 판정 ${stats.total}건 · keep ${keep} · ambiguous ${ambiguous} · move-recommended ${move} · 주제 파일 ${stats.topicStats.length}개`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`집계 실패: ${error.message}`)
    process.exitCode = 1
  }
}
