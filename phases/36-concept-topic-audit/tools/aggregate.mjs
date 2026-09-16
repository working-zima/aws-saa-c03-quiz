#!/usr/bin/env node
/**
 * 개념 판정(audit/verdicts.jsonl)과 phase 35 교차 분류(audit/cross-phase35.jsonl)를 사람이 읽는 문서로 집계한다.
 * 판정을 만들거나 고치지 않는다 — 세고 묶어서 audit/report.md · audit/by-topic/<topicId>.md · audit/handoff-fixes.md를 쓴다.
 *
 * 숫자는 전부 여기서 센다. 사람이 쓴 글은 아래 세 목록뿐이고, 목록이 판정 파일과 어긋나면 아무것도 쓰지 않고 실패한다.
 * - AMBIGUOUS_ISSUES: ambiguous 개념마다 rationale이 적은 두 해석을 한 줄씩 줄인 것
 * - PLACEMENTS: move-recommended의 blockImpact가 적은 대상 주제의 앞뒤 개념
 * - SOURCE_SIDE: blockImpact가 적지 않은 원 주제 쪽 영향(HANDOFF-P36 「원 주제 쪽 공백」)
 * 판정 파일에 누락·중복이 있거나, 교차 파일의 유형이 cross-phase35.mjs의 classify로 다시 계산한 값과 달라도 쓰지 않는다.
 *
 * 사용법: node phases/36-concept-topic-audit/tools/aggregate.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { classify } from './cross-phase35.mjs'

const FITS = ['keep', 'ambiguous', 'move-recommended']
const CONFIDENCES = ['high', 'medium', 'low']
// 객체는 정수 모양 키('1'·'3'·'4')를 앞으로 당기므로 유형 순서는 배열과 Map으로 고정한다.
const TYPES = ['1', '2A', '2B', '3', '4', 'hold']
const TYPE_LABEL = new Map([['1', '①'], ['2A', '2A'], ['2B', '2B'], ['3', '3'], ['4', '4'], ['hold', 'hold']])
const TYPE_MEANING = new Map([
  ['1', '개념·문항 둘 다 맞음'],
  ['2A', '개념은 맞고 문항이 같은 주제의 다른 개념을 가리킴 — 문항 conceptId만 바꾼다'],
  ['2B', '개념은 맞고 문항이 다른 주제의 개념을 가리킴 — 문항 topicId·conceptId를 함께 바꾼다'],
  ['3', '문항은 맞고 개념의 주제가 잘못됨 — 개념을 옮기고 연결 문항이 따라간다'],
  ['4', '개념과 문항 둘 다 재배정'],
  ['hold', '보류 — 어느 한쪽이 ambiguous이거나 이동 권고의 확신이 높지 않다'],
])
const HOLD_REASONS = new Map([
  ['concept-ambiguous', '개념 ambiguous'],
  ['question-ambiguous', '문항 ambiguous'],
  ['direction-mismatch', '개념과 문항의 이동 방향이 어긋남'],
  ['not-high-confidence', '이동 권고의 confidence가 high가 아님'],
])
const DISTRIBUTION_LABELS = {
  keep: 'keep', ambiguous: 'ambiguous', move: 'move-recommended',
  high: 'confidence high', medium: 'confidence medium', low: 'confidence low',
  goalTrue: 'serviceSpecificGoal true', goalFalse: 'serviceSpecificGoal false', duplicate: 'duplicateOf',
}
// blockImpact가 대상 개념이나 자리를 정하지 못하고 뒤로 미룬 문장을 찾는다.
const DEFERRED = /없다|없어|없으므로|후속 설계|추가 설계/

// ambiguous 판정마다 rationale이 적은 두 해석을 한 줄씩 옮긴 요약이다. current는 현재 주제로, alternative는
// others 주제로 읽을 때다. others의 주제 id는 rationale에 적혀 있어야 한다. 판정을 고치면 이 목록도 함께 고친다.
export const AMBIGUOUS_ISSUES = {
  's3-encryption-batch.s3-object-lambda': {
    issue: 'Lambda로 객체를 처리하는 데이터 보호 ↔ 요청자마다 다른 형태로 내주는 접근 방식',
    others: ['s3-access-control'],
    current: 'PII 제거처럼 Lambda로 객체를 처리하는 기능으로 읽으면 암호화와 Batch Operations의 Lambda 호출을 묶은 현재 주제에 둔다.',
    alternative: '중심이 같은 데이터를 요청하는 쪽마다 다른 형태로 내주는 접근 방식이라, 버킷에 닿는 방식을 나누는 접근 제어 주제가 자연스럽다.',
  },
  's3-access-control.s3-storage-lens': {
    issue: 'S3 운영 기능으로서의 사용 현황 대시보드 ↔ 접근 제어와 무관한 사용 현황 분석',
    others: ['s3-storage-classes', 's3-versioning-lifecycle'],
    current: 'S3 사용 현황 분석을 맡는 다른 주제가 없고 계정 전체 버킷을 한자리에서 보는 관리 기능이라, 접근 경로 뒤에 운영 기능을 붙인 현재 주제에 둔다.',
    alternative: '학습 목표가 접근 제어와 무관한 사용 현황 분석이라 `s3-storage-class-analysis` 곁이나 이벤트 알림이 있는 버전 관리·수명 주기 주제에서 가르치는 편이 자연스럽다.',
  },
  's3-access-control.s3-storage-lens-advanced-activity-metrics': {
    issue: 'Storage Lens 기본 개념의 세부 설정 ↔ 접근이 식은 데이터를 찾아 비용을 줄이는 일',
    others: ['s3-storage-classes'],
    current: 'Storage Lens 기본 개념의 세부 설정이라 기본 개념과 같은 블록에 붙어 있어야 한다.',
    alternative: '학습 목표가 접근이 식은 데이터를 찾아 스토리지 비용을 줄이는 일이라 접근 패턴 분석과 클래스 비용을 다루는 주제가 자연스럽다.',
  },
  'data-transfer-services.datasync-task-status-event': {
    issue: 'DataSync 작업 상태 알림 기능 ↔ 폴링 대신 이벤트 규칙을 쓰는 공통 패턴',
    others: ['sqs-sns-eventbridge'],
    current: 'DataSync 작업의 완료·실패를 통지하는 고유 연동 기능으로 읽으면 전송 운영을 다루는 현재 주제의 내용이다.',
    alternative: '두 번째 문단이 CloudWatch에도 같은 원리를 적용하며 이벤트가 있으면 폴링을 만들지 말라는 공통 패턴을 가르치므로 이벤트 규칙 주제의 내용이다.',
  },
  'ecs-eks-fargate.elastic-beanstalk': {
    issue: '기존 애플리케이션의 배포 방식 선택 ↔ EC2 기반 환경에 남는 운영 책임',
    others: ['ec2-autoscaling'],
    current: '뒤의 App2Container가 코드 배포와 컨테이너 변환을 대비하므로, 배포 방식을 고르는 지식으로 읽으면 현재 주제에 둔다.',
    alternative: '개념 자체의 중심이 EC2 기반 환경에 남는 운영 책임과 Lambda와의 차이라서 관리형 배포를 EC2 주제에서 설명하는 편이 자연스럽다.',
  },
  'api-gateway-step-functions.amplify': {
    issue: '앱 개발·배포와 백엔드 처리의 책임 구분 ↔ 푸시 알림 서비스 선택 기준',
    others: ['sqs-sns-eventbridge'],
    current: '웹·모바일 앱 개발·배포와 백엔드 처리 흐름의 책임을 구분하는 소개로 읽으면 API와 워크플로를 다루는 현재 주제에 둔다.',
    alternative: '본문이 처리 완료 푸시 알림을 Amplify가 아니라 SNS가 맡는다는 대비에 집중하므로 알림 서비스 선택 기준으로 읽힌다.',
  },
  'hybrid-connectivity.access-terms': {
    issue: 'VPN 구성 요소 Customer Gateway ↔ 프라이빗 인스턴스 접속 수단 Bastion Host',
    others: ['systems-manager', 'vpc-networking'],
    current: 'Customer Gateway를 VPN 구성 요소로 읽으면 뒤의 `virtual-private-gateway`가 온프레미스 쪽 종단으로 전제하므로 현재 주제에 둔다.',
    alternative: 'Bastion Host의 실제 역할은 프라이빗 서브넷 인스턴스 접속이라 배스천 없는 접속을 다루는 Systems Manager 주제나 VPC 주제가 자연스럽다. 성격이 다른 두 용어가 한 개념에 묶여 있다.',
  },
  'cloudwatch-xray.cloudwatch-alarm-state-change-event': {
    issue: 'CloudWatch 알람 상태 변경을 자동 대응의 출발점으로 쓰기 ↔ 규칙이 대상을 직접 호출하는 EventBridge 설계',
    others: ['sqs-sns-eventbridge'],
    current: '알람을 알림 장치로만 쓰지 않고 상태 변경을 자동 대응의 출발점으로 삼는 CloudWatch 알람의 활용으로 읽으면 CloudWatch 블록에 둔다.',
    alternative: '본문 후반이 함수를 끼우지 않고 규칙이 대상을 직접 호출하는 EventBridge 규칙 설계를 가르치며 `eventbridge-resource-change-rule`과 같은 패턴이다.',
  },
  'secrets-encryption.acm-expiration-event': {
    issue: 'ACM 인증서 만료 이벤트 기능 ↔ 이벤트 우선·SNS 알림 전달 패턴',
    others: ['sqs-sns-eventbridge'],
    current: '가져온 ACM 인증서의 만료를 관리하는 고유 이벤트 기능으로 읽으면 ACM 블록의 운영 내용이다.',
    alternative: '본문 후반이 SNS와 SQS의 알림 전달 차이와 폴링보다 이벤트를 우선하는 공통 패턴을 가르쳐 메시징 주제에 둘 근거가 강하다.',
  },
  'guardduty-macie-inspector.guardduty-finding-to-eventbridge': {
    issue: 'GuardDuty가 직접 대응하지 않는 한계의 보완 ↔ 탐지와 조치를 잇는 EventBridge 규칙 패턴',
    others: ['sqs-sns-eventbridge'],
    current: 'GuardDuty가 직접 대응하지 않는 한계를 보완하는 운영 통합으로 읽으면 탐지 블록에서 배울 내용이고, 본문도 탐지 출발점의 차이를 강조한다.',
    alternative: '본문이 탐지와 조치를 잇는 EventBridge 규칙을 구성의 요점으로 명시하므로 이벤트 기반 대응 패턴으로 읽힌다.',
  },
  'guardduty-macie-inspector.macie-finding-to-eventbridge': {
    issue: 'Macie 결과의 유형과 침해 탐지와의 차이 ↔ 큐에 쌓기와 사람에게 알리기의 차이',
    others: ['sqs-sns-eventbridge'],
    current: 'Macie가 만든 결과의 유형과 침해 징후 탐지와의 차이를 배우는 활용 개념으로 보면 민감 데이터 탐지 블록에 속한다.',
    alternative: '후반의 핵심이 큐에 쌓는 것과 사람에게 알리는 것의 차이라 이벤트에서 알림으로 잇는 패턴으로 읽힌다.',
  },
}

// move-recommended마다 blockImpact가 적은 대상 주제의 앞(after)·뒤(before) 개념이다. 옮기기 전 id로 적는다.
// 각 개념의 slug는 blockImpact에 적혀 있어야 하고, 대상 주제에 있거나 같은 주제로 오는 이동 후보여야 한다.
export const PLACEMENTS = {
  'ebs-instance-store.cluster-placement-group': { after: 'ec2-autoscaling.gpu-instance-family', before: 'ec2-autoscaling.enhanced-networking' },
  'ebs-instance-store.spread-placement-group': { after: 'ebs-instance-store.cluster-placement-group', before: null },
  'ebs-instance-store.elastic-fabric-adapter': { after: 'ec2-autoscaling.enhanced-networking', before: 'ec2-autoscaling.reserved-instance-types' },
  'api-gateway-step-functions.api-gateway-behind-cloudfront': {
    after: 'cloudfront-global-accelerator.cloudfront-multiple-origins', before: 'cloudfront-global-accelerator.cloudfront-onprem-origin',
  },
  'sqs-sns-eventbridge.sqs-queue-depth-scaling': { after: 'ec2-autoscaling.predictive-scaling', before: 'ec2-autoscaling.spot-allocation-strategy' },
  'waf-shield.cloudfront': { after: 'cloudfront-global-accelerator.cloudfront', before: 'cloudfront-global-accelerator.cloudfront-alb-origin' },
  'iam-permissions.iam-roles-anywhere': { after: 'identity-federation.sts-assume-role', before: 'identity-federation.aws-directory-service' },
}

// blockImpact는 대상 주제 쪽만 적었다. 원 주제에 남는 개념이 받는 영향을 여기 적는다. mentions는 원 주제의 다른
// 개념 본문에서 이 개념을 언급하는 자리를 찾는 패턴이고 스크립트가 그 목록을 센다. note의 개념 id는 실재해야 한다.
export const SOURCE_SIDE = {
  'ebs-instance-store.cluster-placement-group': {
    mentions: /클러스터 배치 그룹/,
    note: '원 주제에서는 `ebs-instance-store.spread-placement-group`(목적이 정반대라는 대비)과 `ebs-instance-store.elastic-fabric-adapter`(저지연 HPC에서 짝을 이루는 구성)가 이 개념을 전제로 쓰고, 둘 다 이동 후보다. 이 개념만 옮기면 그 두 개념이 원 주제에서 전제를 잃는다. 배치 그룹 두 개념과 EFA를 함께 옮기면 원 주제에 남는 EBS 볼륨·스냅샷·인스턴스 스토어 개념 가운데 전제를 잃는 것은 없지만, 배치 그룹 블록이 통째로 빠져 주제 제목의 「배치 그룹」이 맞지 않게 되므로 제목(`topics.json`·`data.test.ts`의 주제 메타데이터 단언·`topics-baseline.json`)도 함께 정해야 한다. 본문이 짝으로 드는 FSx for Lustre는 `efs-fsx.fsx-for-lustre`에 있어 어느 주제에 두든 주제 밖 언급으로 남는다.',
  },
  'ebs-instance-store.spread-placement-group': {
    mentions: /분산 배치 그룹/,
    note: '원 주제에서 이 개념을 언급하는 것은 `ebs-instance-store.elastic-fabric-adapter`(흩어 놓는 구성은 저지연 요구를 절반만 채운다는 대비)이고 그것도 이동 후보다. 원 주제에 남는 EBS·인스턴스 스토어 개념은 이 개념을 쓰지 않아 빼도 전제를 잃는 개념이 생기지 않는다. 대신 이 개념 본문이 `ebs-instance-store.cluster-placement-group`을 대비로 전제하므로, confidence가 medium이라 보류된 그 개념과 따로 옮기면 두 주제 중 한쪽에만 전제가 남는다.',
  },
  'ebs-instance-store.elastic-fabric-adapter': {
    mentions: /EFA|Elastic Fabric Adapter/,
    note: '원 주제에 남는 개념 중 EFA를 언급하는 것은 없어 빼도 원 주제에서 전제를 잃는 개념이 생기지 않는다. 이 개념 본문이 비교 기준으로 쓰는 향상된 네트워킹(`ec2-autoscaling.enhanced-networking`)은 지금도 대상 주제에만 있고, 본문이 전제로 쓰는 두 배치 그룹은 이동 후보라 함께 옮겨야 대상 주제에서 전제가 모두 선다.',
  },
  'api-gateway-step-functions.api-gateway-behind-cloudfront': {
    mentions: /CloudFront/,
    note: '원 주제에 CloudFront를 언급하는 개념은 있지만 HTTP API를 CloudFront 오리진으로 등록하는 구성을 전제로 쓰는 것은 없다. `api-gateway-step-functions.api-gateway-websocket-api`는 CloudFront가 상태를 들고 있는 연결을 대신하지 못한다는 대비로, `api-gateway-step-functions.api-gateway-endpoint-types`는 엣지 최적화 엔드포인트가 CloudFront를 거친다는 경로로, `api-gateway-step-functions.api-gateway-custom-domain-name`은 인증서 리전 예외로 각자 그 자리에서 쓴다. 빼면 API Gateway 블록에서 API 앞에 CloudFront를 두는 구성이 사라지므로, 원 주제에 그 구성을 가리키는 문장을 남길지는 설계에서 정한다.',
  },
  'sqs-sns-eventbridge.sqs-queue-depth-scaling': {
    mentions: /대기열 깊이|쌓인 메시지 수|오토 스케일링|Auto Scaling/,
    note: '원 주제에 남는 개념 중 대기열에 쌓인 메시지 수로 처리 계층을 확장하는 구성을 전제로 쓰는 것은 없어 빼도 전제를 잃는 개념이 생기지 않는다. 빼면 SQS 블록의 갈림길에서 큐를 병목 진단의 지표로 쓰는 개념이 사라지고, 큐가 급증분을 버퍼로 흡수한다는 설명은 `sqs-sns-eventbridge.sqs-message-size-limit` 등에 남는다.',
  },
  'waf-shield.cloudfront': {
    mentions: /CloudFront/,
    note: '원 주제에서 `waf-shield.waf-attach-targets`가 CloudFront와 멀티 오리진 구성을 전제로 쓴다 — `data.test.ts`의 순서 단언 주석이 바로 이 전제 때문에 규칙 5로 이 개념을 그 앞에 두었다고 적었다. `waf-shield.waf-rate-based-rule`(CloudFront가 앞에 있으면 엣지에서 끊는다)과 `waf-shield.firewall-manager`(계정마다 흩어진 CloudFront 배포)도 CloudFront를 언급하지만 이 개념이 소개한 기능을 전제로 쓰지는 않는다. 빼면 원 주제에서 CloudFront가 무엇인지 소개하는 개념이 사라지므로, 남는 개념에 CloudFront의 성격 한 줄을 붙일지(ADR-027·ADR-029의 주제 밖 서비스 성격 한 줄) 이동과 함께 설계해야 한다. 이 개념 본문의 캐시 무효화·멀티 오리진은 대상 주제의 `cloudfront-global-accelerator.cloudfront-ttl`·`cloudfront-global-accelerator.cloudfront-multiple-origins`와 부분적으로 겹친다.',
  },
  'iam-permissions.iam-roles-anywhere': {
    mentions: /Roles Anywhere|X\.509/,
    note: '원 주제에 남는 개념 중 이 개념을 언급하거나 전제로 쓰는 것은 없어 빼도 전제를 잃는 개념이 생기지 않는다. 역할 블록에는 `iam-permissions.instance-profile`과 `iam-permissions.cross-account-iam-role`이 남는다. 연결 문항 q686의 판정은 자격 증명 페더레이션 주제의 경로가 문제의 조건에서 제외됐다며 현재 주제 유지를 권해 이 개념 판정과 반대쪽을 가리킨다.',
  },
}

const isMove = (row) => row.fit === 'move-recommended'
const countBy = (list, keys, pick) => Object.fromEntries(keys.map((key) => [key, list.filter((item) => pick(item) === key).length]))
const slugOf = (conceptId) => conceptId.slice(conceptId.indexOf('.') + 1)
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// 개념 id 조각이 다른 id의 일부가 아니라 낱말로 적혀 있는지 본다('cloudfront'가 'cloudfront-ttl' 안에서 맞지 않게).
const hasToken = (text, word) => new RegExp(`(^|[^a-z0-9-])${escapeRegExp(word)}([^a-z0-9-]|$)`).test(text)

/** step summary 문장에서 개념 판정 분포를 읽는다. 분포를 적지 않은 summary(교차·보고서 step)면 null이다. */
export function parseStepSummary(summary) {
  const fit = summary.match(/keep (\d+)·ambiguous (\d+)·move-recommended (\d+)/)
  const confidence = summary.match(/confidence high (\d+)·medium (\d+)·low (\d+)/)
  const goal = summary.match(/serviceSpecificGoal true (\d+)·false (\d+)/)
  const duplicate = summary.match(/duplicateOf (\d+)(?:행|건)/)
  if (!fit || !confidence || !goal || !duplicate) return null
  return {
    keep: Number(fit[1]), ambiguous: Number(fit[2]), move: Number(fit[3]),
    high: Number(confidence[1]), medium: Number(confidence[2]), low: Number(confidence[3]),
    goalTrue: Number(goal[1]), goalFalse: Number(goal[2]), duplicate: Number(duplicate[1]),
  }
}

/** 교차 step summary에서 유형별 개념 수를 읽는다. 적지 않았으면 null이다. */
export function parseCrossSummary(summary) {
  const found = summary.match(/① (\d+)(?:\([^)]*\))?·2A (\d+)·2B (\d+)·3 (\d+)·4 (\d+)·hold (\d+)/)
  if (!found) return null
  return { 1: Number(found[1]), '2A': Number(found[2]), '2B': Number(found[3]), 3: Number(found[4]), 4: Number(found[5]), hold: Number(found[6]) }
}

/**
 * 무인 실행기(p36 프로파일)가 판정 묶음마다 걸던 규칙 그대로다: 이동 권고 비율이 앞 묶음 누적 비율보다
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

/**
 * blockImpact가 적은 앞뒤 개념을 기준으로 이동 후보를 대상 주제 배열에 넣어 본다. 앞 개념 바로 뒤가 우선이고, 앞 개념이
 * 아직 배열에 없으면 뒤 개념 바로 앞에 넣는다. 둘 다 없으면 넣지 못한 후보로 남긴다. 앞 개념이 다른 후보면 그 후보가
 * 들어간 뒤에 다시 시도한다. 넣은 뒤 지정한 앞뒤와 맞붙지 않은 자리는 어긋남으로 돌려준다.
 */
export function placeCandidates(baseOrder, candidates, placements) {
  const order = [...baseOrder]
  let pending = [...candidates]
  let progress = true
  while (progress && pending.length > 0) {
    progress = false
    for (const id of [...pending]) {
      const { after, before } = placements[id]
      const at = after && order.includes(after) ? order.indexOf(after) + 1
        : before && order.includes(before) ? order.indexOf(before) : -1
      if (at < 0) continue
      order.splice(at, 0, id)
      pending = pending.filter((other) => other !== id)
      progress = true
    }
  }
  const mismatches = candidates.filter((id) => !pending.includes(id)).flatMap((id) => {
    const index = order.indexOf(id)
    const { after, before } = placements[id]
    return [
      ...(after && order[index - 1] !== after ? [{ id, side: 'after', want: after, got: order[index - 1] ?? null }] : []),
      ...(before && order[index + 1] !== before ? [{ id, side: 'before', want: before, got: order[index + 1] ?? null }] : []),
    ]
  })
  return { order, unresolved: pending, mismatches }
}

/**
 * data.test.ts를 it 블록과 공용 목록(const X = [)으로 나눠, 수정 후보가 건드리는 단언의 줄 번호를 찾는다.
 * questionTests는 questions.slice로 그 문항 위치를 구간 대조하는 it 블록이고, conceptLines는 개념 id(또는
 * 주제 id와 함께 쓰인 짧은 이름)가 나오는 줄이다. 줄 번호는 1부터다.
 */
export function testLandmarks(text) {
  const lines = text.split('\n')
  const blocks = []
  lines.forEach((line, index) => {
    const it = line.match(/^(\s*)it\('([^']+)'/)
    const opened = it ?? line.match(/^(\s*)const (\w+) = \[\s*$/)
    if (!opened) return
    const close = `${opened[1]}${it ? '})' : ']'}`
    let end = index + 1
    while (end < lines.length && !lines[end].startsWith(close)) end += 1
    const body = lines.slice(index, end + 1).join('\n')
    blocks.push({
      kind: it ? 'it' : 'const', name: opened[2], start: index + 1, end: end + 1, body,
      slices: [...body.matchAll(/questions\.slice\((\d+), (\d+)\)/g)].map((match) => [Number(match[1]), Number(match[2])]),
      asserts: ['topicId', 'conceptId'].filter((field) => body.includes(field)),
    })
  })
  const label = (block) => (block.kind === 'it' ? `it 「${block.name}」` : `const ${block.name}`)
  const enclosing = (lineNumber) => {
    const around = blocks.filter((block) => block.start <= lineNumber && lineNumber <= block.end)
    return around.find((block) => block.kind === 'it') ?? around.at(-1) ?? null
  }
  const its = blocks.filter((block) => block.kind === 'it')
  return {
    label,
    questionTests: (index) => its.filter((block) => block.slices.some(([from, to]) => from <= index && index < to)),
    conceptLines(conceptId) {
      const topicId = conceptId.slice(0, conceptId.indexOf('.'))
      return lines.flatMap((line, index) => {
        const block = enclosing(index + 1)
        const kind = line.includes(`'${conceptId}'`) ? 'id'
          : line.includes(`'${slugOf(conceptId)}'`) && block?.body.includes(`'${topicId}'`) ? 'slug' : null
        return kind ? [{ line: index + 1, where: block ? label(block) : '블록 밖', kind }] : []
      })
    },
    orderTest: (topicId) => its.find((block) => block.body.includes(`candidate.id === '${topicId}'`)) ?? null,
    coverageTests: (topicId) => its.filter((block) => block.name.includes('모든 개념이 문항을 갖는다') && block.body.includes(`'${topicId}'`)),
  }
}

/** 판정 파일을 워크시트와 개념 id 집합으로 대조한다. 소속 주제나 연결 문항이 워크시트와 다른 줄도 잡는다. */
export function integrityProblems(verdicts, concepts) {
  const conceptById = new Map(concepts.map((concept) => [concept.conceptId, concept]))
  const seen = new Set()
  const problems = { duplicates: [], missing: [], unknown: [], relocated: [] }
  const idsKey = (ids) => [...ids].sort().join()
  for (const row of verdicts) {
    if (seen.has(row.conceptId)) problems.duplicates.push(row.conceptId)
    seen.add(row.conceptId)
    const concept = conceptById.get(row.conceptId)
    if (!concept) problems.unknown.push(row.conceptId)
    else if (concept.topicId !== row.topicId || idsKey(concept.questionIds) !== idsKey(row.questionIds)) problems.relocated.push(row.conceptId)
  }
  problems.missing = concepts.filter((concept) => !seen.has(concept.conceptId)).map((concept) => concept.conceptId)
  return problems
}

function distribution(rows) {
  const fits = countBy(rows, FITS, (row) => row.fit)
  return {
    keep: fits.keep, ambiguous: fits.ambiguous, move: fits['move-recommended'],
    ...countBy(rows.filter(isMove), CONFIDENCES, (row) => row.confidence),
    goalTrue: rows.filter((row) => row.serviceSpecificGoal).length,
    goalFalse: rows.filter((row) => !row.serviceSpecificGoal).length,
    duplicate: rows.filter((row) => row.duplicateOf !== null).length,
  }
}

export function aggregate(input) {
  const { verdicts, concepts, cross, questionVerdicts, questions, topics, steps, testText, baselineText } = input
  const issues = input.issues ?? AMBIGUOUS_ISSUES
  const placements = input.placements ?? PLACEMENTS
  const sourceSide = input.sourceSide ?? SOURCE_SIDE

  const integrity = integrityProblems(verdicts, concepts)
  const broken = [
    ['중복', integrity.duplicates], ['누락', integrity.missing],
    ['워크시트에 없는 id', integrity.unknown], ['워크시트와 다른 topicId·questionIds', integrity.relocated],
  ].filter(([, ids]) => ids.length).map(([label, ids]) => `${label} ${ids.length}건 — ${ids.join(', ')}`)
  if (broken.length) throw new Error(`판정 파일을 집계할 수 없다: ${broken.join(' / ')}`)

  const errors = []
  const conceptById = new Map(concepts.map((concept) => [concept.conceptId, concept]))
  const verdictById = new Map(verdicts.map((row) => [row.conceptId, row]))
  const questionById = new Map(questionVerdicts.map((row) => [row.id, row]))
  const questionIndex = new Map(questions.map((question, index) => [question.id, index]))
  const topicById = new Map(topics.map((topic) => [topic.id, topic]))
  const topicOrder = new Map(topics.map((topic, index) => [topic.id, index]))
  const orderOf = (topicId) => topicById.get(topicId).concepts.map((concept) => concept.id)
  const rows = concepts.map((concept) => verdictById.get(concept.conceptId))
  const moves = rows.filter(isMove)
  const moveIds = moves.map((row) => row.conceptId)
  const ambiguous = rows.filter((row) => row.fit === 'ambiguous')

  // 교차 분류를 classify로 다시 계산해 교차 파일과 대조한다. ①은 파일에 줄이 없다.
  const crossById = new Map(cross.map((row) => [row.conceptId, row]))
  for (const row of cross) if (!conceptById.has(row.conceptId)) errors.push(`교차 파일에 워크시트에 없는 개념이 있다: ${row.conceptId}`)
  const crossOf = new Map()
  for (const concept of concepts) {
    const linked = concept.questionIds.map((id) => questionById.get(id))
    if (linked.some((question) => !question)) {
      errors.push(`${concept.conceptId}: phase 35 판정에 없는 문항이 연결돼 있다`)
      continue
    }
    const { type, reason } = classify(verdictById.get(concept.conceptId), linked)
    const row = crossById.get(concept.conceptId) ?? null
    if (type === '1' && row) errors.push(`${concept.conceptId}: 다시 계산한 유형은 ①인데 교차 파일에 ${row.type} 줄이 있다`)
    if (type !== '1' && row?.type !== type) errors.push(`${concept.conceptId}: 다시 계산한 유형 ${type}와 교차 파일의 유형 ${row?.type ?? '없음'}이 다르다`)
    // 2A·2B는 권장이 달라진 문항만, 3·4·hold는 연결 문항 전부가 영향 문항이다(cross-phase35.mjs와 같은 규칙).
    const affected = type === '1' ? []
      : ['2A', '2B'].includes(type) ? linked.filter((q) => q.verdict === 'move-recommended' || q.recommendedConceptId !== concept.conceptId)
        : linked
    crossOf.set(concept.conceptId, { type, reason, rationale: row?.rationale ?? null, linked, affected })
  }

  const ambiguousIds = ambiguous.map((row) => row.conceptId).sort()
  if (Object.keys(issues).sort().join() !== ambiguousIds.join()) {
    errors.push(`AMBIGUOUS_ISSUES 쟁점 목록이 판정 파일과 다르다 — 판정 ${ambiguousIds.join(', ') || '없음'} / 쟁점 ${Object.keys(issues).sort().join(', ') || '없음'}`)
  }
  for (const row of ambiguous) {
    for (const other of issues[row.conceptId]?.others ?? []) {
      if (other === row.topicId || !topicById.has(other) || !row.rationale.includes(other)) {
        errors.push(`${row.conceptId}: 다른 해석의 주제 ${other}가 rationale에 없다`)
      }
    }
  }
  for (const [name, list] of [['PLACEMENTS', placements], ['SOURCE_SIDE', sourceSide]]) {
    if (Object.keys(list).sort().join() !== [...moveIds].sort().join()) {
      errors.push(`${name} 목록이 판정 파일의 move-recommended와 다르다 — 판정 ${[...moveIds].sort().join(', ') || '없음'} / 목록 ${Object.keys(list).sort().join(', ') || '없음'}`)
    }
  }
  for (const row of moves) {
    const place = placements[row.conceptId]
    for (const anchor of place ? [place.after, place.before].filter(Boolean) : []) {
      const inTarget = orderOf(row.recommendedTopic).includes(anchor)
      const incoming = moveIds.includes(anchor) && verdictById.get(anchor).recommendedTopic === row.recommendedTopic
      if (!inTarget && !incoming) errors.push(`${row.conceptId}: 앞뒤 개념 ${anchor}가 대상 주제 ${row.recommendedTopic}에도, 그 주제로 오는 이동 후보에도 없다`)
      if (!hasToken(row.blockImpact, slugOf(anchor))) errors.push(`${row.conceptId}: 앞뒤 개념 ${slugOf(anchor)}가 blockImpact에 적혀 있지 않다`)
    }
  }
  for (const [id, side] of Object.entries(sourceSide)) {
    // 파일 이름(`topics.json`·`data.test.ts`)은 개념 id가 아니다.
    for (const [, ref] of side.note.matchAll(/`([a-z0-9-]+\.[a-z0-9-]+)`/g)) {
      if (!/\.(json|ts|mjs|md)$/.test(ref) && !conceptById.has(ref)) errors.push(`${id}: SOURCE_SIDE가 워크시트에 없는 개념 ${ref}를 적었다`)
    }
  }
  if (errors.length) throw new Error(errors.join('\n'))

  const landmarks = testLandmarks(testText)
  const baselineLines = baselineText.split('\n')
  const baselineLine = (conceptId) => baselineLines.findIndex((line) => line.includes(`"id": "${conceptId}"`)) + 1
  const baseCount = new Map(concepts.map((concept) => [concept.conceptId, concept.questionIds.length]))
  const bodyOf = (concept) => [concept.name, concept.summary, ...concept.paragraphs].join(' ')

  // 이동 권고 — 개념이 옮기고, 연결 문항은 판정에 따라 따라가거나 다른 개념으로 가거나 확정되지 않는다.
  const moveCandidates = moves.map((row) => {
    const crossInfo = crossOf.get(row.conceptId)
    const newId = `${row.recommendedTopic}.${slugOf(row.conceptId)}`
    const plan = crossInfo.linked.map((q) => {
      if (q.verdict === 'ambiguous') return { q, fate: 'undetermined', target: newId, targetTopic: row.recommendedTopic }
      if (q.recommendedConceptId !== null && q.recommendedConceptId !== row.conceptId) {
        return { q, fate: 'elsewhere', target: q.recommendedConceptId, targetTopic: q.recommendedTopic }
      }
      return { q, fate: 'follows', target: newId, targetTopic: row.recommendedTopic }
    })
    const sourceOrder = orderOf(row.topicId)
    const index = sourceOrder.indexOf(row.conceptId)
    const alone = placeCandidates(orderOf(row.recommendedTopic), [row.conceptId], placements)
    const place = placements[row.conceptId]
    const needsDesign = [
      ...row.blockImpact.split(/(?<=\.)\s+/).filter((sentence) => DEFERRED.test(sentence))
        .map((sentence) => ({ kind: 'blockImpact가 대상 개념·자리의 정리를 뒤로 미룬다', detail: sentence })),
      ...(alone.unresolved.length ? [{
        kind: '지정한 앞뒤 개념이 대상 주제에 아직 없다',
        detail: [place.after, place.before].filter((anchor) => anchor && !orderOf(row.recommendedTopic).includes(anchor)).join(' · '),
      }] : []),
      ...(conceptById.has(newId) ? [{ kind: '옮긴 id가 이미 있는 개념 id와 겹친다', detail: newId }] : []),
      ...plan.filter(({ q, fate }) => fate === 'follows' && q.verdict === 'move-recommended' && q.recommendedConceptId === null)
        .map(({ q }) => ({ kind: '따라갈 문항의 권장 개념이 없다(phase 35)', detail: `${q.id} · confidence ${q.confidence}` })),
    ]
    return {
      row, crossInfo, newId, plan, alone, needsDesign,
      source: { order: sourceOrder, index, prev: sourceOrder[index - 1] ?? null, next: sourceOrder[index + 1] ?? null },
      mentionedBy: concepts.filter((concept) => concept.topicId === row.topicId && concept.conceptId !== row.conceptId
        && sourceSide[row.conceptId].mentions.test(bodyOf(concept))).map((concept) => concept.conceptId),
      side: sourceSide[row.conceptId],
    }
  })

  // 2A·2B — 개념은 그대로이고 문항만 다른 개념으로 간다. 같은 대상으로 가는 문항은 한 후보로 묶는다.
  const retargets = concepts.flatMap((concept) => {
    const crossInfo = crossOf.get(concept.conceptId)
    if (!['2A', '2B'].includes(crossInfo.type)) return []
    const groups = new Map()
    for (const q of crossInfo.affected) groups.set(q.recommendedConceptId, [...(groups.get(q.recommendedConceptId) ?? []), q])
    return [...groups].map(([target, list]) => {
      if (target !== null && conceptById.get(target)?.topicId !== list[0].recommendedTopic) {
        throw new Error(`${list.map((q) => q.id).join(', ')}: 권장 개념 ${target}가 권장 주제 ${list[0].recommendedTopic}에 없다`)
      }
      return { type: crossInfo.type, concept, verdict: verdictById.get(concept.conceptId), crossInfo, target, targetTopic: list[0].recommendedTopic, questions: list }
    })
  })
  const afterRetargets = new Map(baseCount)
  for (const candidate of retargets) {
    afterRetargets.set(candidate.concept.conceptId, afterRetargets.get(candidate.concept.conceptId) - candidate.questions.length)
    if (candidate.target) afterRetargets.set(candidate.target, afterRetargets.get(candidate.target) + candidate.questions.length)
  }

  const byTopicOrder = (a, b) => topicOrder.get(a) - topicOrder.get(b)
  const arrange = (topicIds, pick) => [...new Set(moves.map(pick))].sort(byTopicOrder).filter((id) => topicIds === null || topicIds.includes(id))
  const targetArrangements = arrange(null, (row) => row.recommendedTopic).map((topicId) => {
    const incoming = moves.filter((row) => row.recommendedTopic === topicId).map((row) => row.conceptId)
    const high = incoming.filter((id) => verdictById.get(id).confidence === 'high')
    return {
      topicId, base: orderOf(topicId), incoming, high,
      all: placeCandidates(orderOf(topicId), incoming, placements),
      highOnly: placeCandidates(orderOf(topicId), high, placements),
    }
  })
  const sourceArrangements = arrange(null, (row) => row.topicId).map((topicId) => {
    const outgoing = moves.filter((row) => row.topicId === topicId).map((row) => row.conceptId)
    const high = outgoing.filter((id) => verdictById.get(id).confidence === 'high')
    return { topicId, base: orderOf(topicId), outgoing, high }
  })

  const holdEntries = concepts.flatMap((concept) => {
    const row = verdictById.get(concept.conceptId)
    const crossInfo = crossOf.get(concept.conceptId)
    const criteria = [
      ...(row.fit === 'ambiguous' ? ['ambiguous'] : []),
      ...(isMove(row) && row.confidence !== 'high' ? [`confidence ${row.confidence}`] : []),
      ...(crossInfo.type === 'hold' ? [`hold(${HOLD_REASONS.get(crossInfo.reason)})`] : []),
    ]
    return criteria.length ? [{ concept, row, crossInfo, criteria }] : []
  })

  const duplicateRows = rows.filter((row) => row.duplicateOf !== null)
  const pairMap = new Map()
  for (const row of duplicateRows) {
    const key = [row.conceptId, row.duplicateOf].sort().join(' ')
    if (!pairMap.has(key)) pairMap.set(key, { ids: key.split(' '), recordedBy: [] })
    pairMap.get(key).recordedBy.push(row.conceptId)
  }
  const duplicatePairs = [...pairMap.values()].map((pair) => ({
    ...pair,
    sameTopic: conceptById.get(pair.ids[0]).topicId === conceptById.get(pair.ids[1]).topicId,
    mutual: pair.recordedBy.length === 2,
  }))

  const movePairMap = new Map()
  for (const row of moves) {
    const key = `${row.topicId} ${row.recommendedTopic}`
    if (!movePairMap.has(key)) movePairMap.set(key, { from: row.topicId, to: row.recommendedTopic, rows: [] })
    movePairMap.get(key).rows.push(row)
  }
  const movePairs = [...movePairMap.values()].sort((a, b) => b.rows.length - a.rows.length || byTopicOrder(a.from, b.from) || byTopicOrder(a.to, b.to))

  const recorded = steps.flatMap((entry) => {
    const parsed = parseStepSummary(entry.summary ?? '')
    return parsed ? [{ step: entry.step, name: entry.name, ...parsed }] : []
  })
  const judgingSteps = [...new Set(rows.map((row) => row.step))].sort((a, b) => a - b)
  const judged = judgingSteps.map((step) => {
    const record = recorded.find((entry) => entry.step === step)
    if (!record) throw new Error(`step ${step}: index.json summary에서 판정 분포를 읽을 수 없다`)
    return { record, current: distribution(rows.filter((row) => row.step === step)) }
  })
  const consistencyStep = steps.find((entry) => entry.name === 'consistency-pass') ?? null
  const marker = consistencyStep ? `step ${consistencyStep.step}` : null
  const consistencyChanges = marker === null ? [] : rows.filter((row) => row.rationale.includes(marker))
    // 문장 끝은 「다.」로 찾는다 — 개념 id의 점에서 끊으면 「aurora.」처럼 잘린다.
    .map((row) => ({ row, sentence: row.rationale.match(new RegExp(`${marker}.*?다\\.`))?.[0] ?? '' }))
  const crossStep = steps.map((entry) => ({ step: entry.step, name: entry.name, counts: parseCrossSummary(entry.summary ?? '') }))
    .find((entry) => entry.counts) ?? null

  const crossTypes = TYPES.map((type) => {
    const entries = concepts.filter((concept) => crossOf.get(concept.conceptId).type === type)
      .map((concept) => ({ concept, ...crossOf.get(concept.conceptId) }))
    return { type, entries, affected: entries.reduce((acc, entry) => acc + entry.affected.length, 0) }
  })

  return {
    total: rows.length, worksheetTotal: concepts.length, integrity, rows, concepts, conceptById, verdictById,
    topics, topicById, orderOf, placements, landmarks, baselineLine, baseCount, questionIndex,
    questionsSha256: JSON.parse(baselineText).questionsSha256,
    fitCounts: countBy(rows, FITS, (row) => row.fit),
    confidenceCounts: countBy(moves, CONFIDENCES, (row) => row.confidence),
    distribution: distribution(rows),
    moves, movePairs, moveCandidates, retargets, afterRetargets, targetArrangements, sourceArrangements, holdEntries,
    crossOf, crossTypes, crossRows: cross.length,
    holdReasons: [...HOLD_REASONS.keys()].map((reason) => ({
      reason, entries: crossTypes.find(({ type }) => type === 'hold').entries.filter((entry) => entry.reason === reason),
    })),
    ambiguous: ambiguous.map((row) => ({ row, issue: issues[row.conceptId], crossInfo: crossOf.get(row.conceptId) })),
    duplicateRows, duplicatePairs,
    moveGoal: moves.filter((row) => row.serviceSpecificGoal),
    keepDuplicate: rows.filter((row) => row.fit === 'keep' && row.duplicateOf !== null),
    topicStats: topics.map((topic) => {
      const topicRows = rows.filter((row) => row.topicId === topic.id)
      return {
        id: topic.id, title: topic.title, rows: topicRows, distribution: distribution(topicRows),
        moves: topicRows.filter(isMove), incoming: moves.filter((row) => row.recommendedTopic === topic.id),
        types: countBy(topicRows, TYPES, (row) => crossOf.get(row.conceptId).type),
      }
    }),
    judged, later: recorded.filter((entry) => !judgingSteps.includes(entry.step)),
    warnings: stepWarnings(judged.map(({ record }) => record)),
    consistencyStep, consistencyChanges, crossStep,
  }
}

const pct = (count, total) => `${total ? ((count / total) * 100).toFixed(1) : '0.0'}%`
const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ')
const table = (head, body) =>
  [head, head.map(() => '---'), ...body].map((cells) => `| ${cells.map(cell).join(' | ')} |`).join('\n')
const code = (value) => `\`${value}\``
const codes = (ids) => (ids.length ? ids.map(code).join(' · ') : '없음')
const plain = (ids) => (ids.length ? ids.join(' · ') : '없음')
// 같은 주제 안의 개념은 주제 접두사를 떼어 짧게 보인다.
const short = (conceptId, topicId) => (conceptId.startsWith(`${topicId}.`) ? conceptId.slice(topicId.length + 1) : conceptId)
const typeLabel = (type) => TYPE_LABEL.get(type)
const diffText = (from, to) => Object.keys(DISTRIBUTION_LABELS)
  .filter((key) => from[key] !== to[key])
  .map((key) => `${DISTRIBUTION_LABELS[key]} ${to[key] > from[key] ? '+' : '−'}${Math.abs(to[key] - from[key])}`)
  .join(' · ') || '없음'
const distributionCells = (d) =>
  [d.keep + d.ambiguous + d.move, d.keep, d.ambiguous, d.move, `${d.high}·${d.medium}·${d.low}`, `${d.goalTrue}·${d.goalFalse}`, d.duplicate]
const DISTRIBUTION_HEAD = ['판정', 'keep', 'ambiguous', 'move', 'confidence high·medium·low', 'serviceSpecificGoal true·false', 'duplicateOf']

export function renderReport(stats) {
  const { total, integrity } = stats
  const sum = (key) => stats.judged.reduce((acc, { record }) => acc + record[key], 0)
  const judgedTotal = Object.fromEntries(Object.keys(DISTRIBUTION_LABELS).map((key) => [key, sum(key)]))
  const topicOf = (conceptId) => stats.conceptById.get(conceptId).topicId
  const otherTopics = [...new Set(stats.ambiguous.flatMap(({ issue }) => issue.others))]
    .map((topicId) => ({ topicId, rows: stats.ambiguous.filter(({ issue }) => issue.others.includes(topicId)).map(({ row }) => row) }))
    .sort((a, b) => b.rows.length - a.rows.length)
  const moveGoalTrue = stats.moves.filter((row) => row.serviceSpecificGoal).length
  const needsDesign = stats.moveCandidates.filter((candidate) => candidate.needsDesign.length)
  const sourceMentioned = stats.moveCandidates.filter(({ row }) => row.blockImpact.includes(row.topicId))
  const crossSum = stats.crossTypes.reduce((acc, { entries }) => acc + entries.length, 0)
  const combinedMismatches = stats.targetArrangements.flatMap((arrangement) => arrangement.all.mismatches.map((mismatch) => ({ arrangement, mismatch })))
  const collisions = stats.moveCandidates.filter(({ newId }) => stats.conceptById.has(newId))
  const questionLine = (q) => `${q.id} ${q.verdict}${q.confidence ? `·${q.confidence}` : ''}${q.recommendedConceptId && q.recommendedConceptId !== q.conceptId ? ` → ${code(q.recommendedConceptId)}` : ''}`

  const sections = [
    `# phase 36 개념 topic 배정 감사 — 집계 보고서

이 파일과 \`by-topic/\`의 주제 파일, [handoff-fixes.md](handoff-fixes.md)는 \`tools/aggregate.mjs\`가 \`audit/verdicts.jsonl\`·
\`audit/concepts.jsonl\`·\`audit/cross-phase35.jsonl\`에서 만든다. **숫자는 전부 스크립트가 센 값이다.** 손으로 고치지 말고,
판정을 고친 뒤 스크립트를 다시 돌린다. 이 보고서는 조사 결과이고 **개념·문항 이동은 아직 승인되지 않았다** — 재배정은 별도
phase에서 하며 그 입력은 \`handoff-fixes.md\`다.`,

    `## 판정 기준 — ADR-035

개념의 주제는 이름에 들어간 서비스나 본문이 언급하는 서비스가 아니라 **그 개념을 학습한 뒤 이해해야 하는 중심 학습 목표**
(\`learningGoal\`)가 정한다. 다른 서비스를 언급해도 현재 서비스를 이해하는 데 필요한 통합·제약·비교·운영 판단이면 현재 주제에
남고, 비교의 축 자체가 학습 목표인 비교 개념도 현재 주제를 유지한다. 공통 기능은 "현재 서비스에서 어떻게 이용하는가"가
중심이면 남고 "공통 패턴 자체"가 중심이면 옮길 후보다. 한 곳을 가리키지 않으면 \`ambiguous\`로 남기고, \`confidence\`는
\`move-recommended\`에만 적는다. \`duplicateOf\`는 판정과 분리한 기록이고, 이동의 구현 비용(\`blockImpact\`)은 판정을 뒤집는
근거가 되지 않는다. 문항 판정(ADR-034)과는 독립으로 먼저 판정한 뒤 교차해 네 경우로 나눈다.`,

    `## 1. 판정 수와 누락·중복

판정 ${total}건을 워크시트 개념 ${stats.worksheetTotal}건과 개념 id 집합으로 대조했다.

${table(['항목', '건수'], [
  ['판정', total], ['워크시트 개념', stats.worksheetTotal], ['누락', integrity.missing.length],
  ['중복', integrity.duplicates.length], ['워크시트에 없는 id', integrity.unknown.length],
  ['워크시트와 topicId·questionIds가 다른 줄', integrity.relocated.length],
  ['판정이 있는 주제', new Set(stats.rows.map((row) => row.topicId)).size],
])}

누락·중복이 하나라도 있으면 이 스크립트는 아무것도 쓰지 않고 실패한다.`,

    `## 2. fit

${table(['fit', '수', '비율'], [
  ...FITS.map((fit) => [fit, stats.fitCounts[fit], pct(stats.fitCounts[fit], total)]),
  ['합계', FITS.reduce((acc, fit) => acc + stats.fitCounts[fit], 0), pct(total, total)],
])}`,

    `## 3. move-recommended의 confidence

move-recommended ${stats.moves.length}건의 확신도다.

${table(['confidence', '수', '개념'], CONFIDENCES.map((confidence) => {
  const rows = stats.moves.filter((row) => row.confidence === confidence)
  return [confidence, rows.length, codes(rows.map((row) => row.conceptId))]
}))}`,

    `## 4. serviceSpecificGoal

${table(['범위', 'true', 'false', 'true 비율'], [
  ['전체', stats.distribution.goalTrue, stats.distribution.goalFalse, pct(stats.distribution.goalTrue, total)],
  ['move-recommended', moveGoalTrue, stats.moves.length - moveGoalTrue, pct(moveGoalTrue, stats.moves.length)],
])}

move-recommended 안에서 false인 개념: ${codes(stats.moves.filter((row) => !row.serviceSpecificGoal).map((row) => row.conceptId))}`,

    `## 5. 현재 주제 → 권장 주제별 이동 후보

move-recommended ${stats.moves.length}건이 주제 쌍 ${stats.movePairs.length}개로 묶인다.

${table(['현재 주제', '권장 주제', '수', '개념'],
  stats.movePairs.map((pair) => [code(pair.from), code(pair.to), pair.rows.length, codes(pair.rows.map((row) => row.conceptId))]))}`,

    `## 6. 주제별 개념 수와 이동 후보 비율

주제 순서는 \`topics.json\` 배열 순서다. 이동 후보 비율은 그 주제의 move-recommended 수 ÷ 그 주제의 개념 수이고, 들어올 후보는
다른 주제에서 이 주제를 권장한 move-recommended다. 교차 ①이 아닌 개념은 교차 분류가 2A·2B·3·4·hold인 개념 수다.

${table(['#', '주제', '제목', '개념', 'keep', 'ambiguous', 'move', '이동 후보 비율', '들어올 후보', '교차 ①이 아닌 개념'],
  stats.topicStats.map((topic, index) => [
    index + 1, `[${topic.id}](by-topic/${topic.id}.md)`, topic.title, topic.rows.length,
    topic.distribution.keep, topic.distribution.ambiguous, topic.distribution.move,
    pct(topic.moves.length, topic.rows.length),
    topic.incoming.length ? `${topic.incoming.length} (${codes(topic.incoming.map((row) => row.conceptId))})` : 0,
    topic.rows.length - topic.types['1'],
  ]))}

주제 ${stats.topicStats.length}개의 개념 합 ${stats.topicStats.reduce((acc, topic) => acc + topic.rows.length, 0)}건 · 전체 판정 ${total}건.
이동 후보가 나가는 주제 ${stats.topicStats.filter((topic) => topic.moves.length).length}개, 들어오는 주제 ${stats.topicStats.filter((topic) => topic.incoming.length).length}개.`,

    `## 7. duplicateOf

\`duplicateOf\`를 적은 개념 ${stats.duplicateRows.length}개가 쌍 ${stats.duplicatePairs.length}개로 묶인다.
같은 주제 쌍 ${stats.duplicatePairs.filter((pair) => pair.sameTopic).length}개 · 다른 주제 쌍 ${stats.duplicatePairs.filter((pair) => !pair.sameTopic).length}개 · 한쪽에만 적은 쌍 ${stats.duplicatePairs.filter((pair) => !pair.mutual).length}개다.
중복 기록은 소속 판정과 분리한 것이라 병합은 이 audit의 범위 밖이다(ADR-035).

${[['같은 주제 쌍', true], ['다른 주제 쌍', false]].map(([label, same]) => {
  const pairRows = stats.duplicatePairs.filter((pair) => pair.sameTopic === same)
  const conceptRows = stats.duplicateRows.filter((row) => pairRows.some((pair) => pair.ids.includes(row.conceptId)))
  return `### ${label} — 쌍 ${pairRows.length}개 · 개념 ${conceptRows.length}개

${table(['개념', '주제', 'fit', '상대 개념', '상대의 주제', '상대도 적었는가'], conceptRows.map((row) => [
  code(row.conceptId), code(row.topicId), row.fit, code(row.duplicateOf), code(topicOf(row.duplicateOf)),
  stats.verdictById.get(row.duplicateOf).duplicateOf === row.conceptId ? '예' : '아니요',
]))}`
}).join('\n\n')}`,

    `## 8. 추가 설계가 필요한 자리 — 대상 개념·자리가 없는 이동 후보 ${needsDesign.length}건

\`blockImpact\`가 대상 개념·자리의 정리를 뒤로 미룬 문장, 지정한 앞뒤 개념이 대상 주제에 아직 없어 자리가 정해지지 않는 경우,
옮긴 id(\`<권장 주제>.<slug>\`)가 이미 있는 개념 id와 겹치는 경우, 개념을 따라갈 문항의 권장 개념이 비어 있는 경우를 센다.

${table(['개념', '권장 주제', 'confidence', '교차 유형', '사유', '근거'], needsDesign.flatMap((candidate) =>
  candidate.needsDesign.map((item) => [
    code(candidate.row.conceptId), code(candidate.row.recommendedTopic), candidate.row.confidence,
    typeLabel(candidate.crossInfo.type), item.kind, item.detail,
  ])))}

\`blockImpact\` ${stats.moves.length}건 중 원 주제 id를 적은 것은 ${sourceMentioned.length}건이다. 원 주제에 남는 개념이 받는 영향은
\`handoff-fixes.md\`의 후보마다 「원 주제 쪽 영향」으로 채웠다.`,

    `## 9. ambiguous 전체 목록과 핵심 쟁점 — ${stats.ambiguous.length}건

주제 경계를 한 곳으로 정하지 못한 개념이다. 두 해석은 각 판정의 \`rationale\`을 한 줄씩 줄여 옮긴 것이다.

${table(['다른 해석의 주제', '수', '개념'], otherTopics.map(({ topicId, rows }) => [code(topicId), rows.length, codes(rows.map((row) => row.conceptId))]))}

${stats.ambiguous.map(({ row, issue, crossInfo }) => `### ${code(row.conceptId)} · ${issue.issue}

- 학습 목표: ${row.learningGoal}
- serviceSpecificGoal ${row.serviceSpecificGoal} · 연결 문항 ${crossInfo.linked.map(questionLine).join(' · ') || '없음'} · 교차 유형 ${typeLabel(crossInfo.type)}
- ${code(row.topicId)} 주제로 읽으면: ${issue.current}
- ${issue.others.map(code).join(' · ')} 주제로 읽으면: ${issue.alternative}`).join('\n\n')}`,

    `## 10. 재검토 신호 조합

### move-recommended + serviceSpecificGoal=true — ${stats.moveGoal.length}건

서비스 고유 목표인데도 다른 주제를 권한 자리다. 이유는 각 판정의 \`rationale\`을 그대로 옮긴다.

${table(['개념', '권장 주제', 'confidence', 'rationale'], stats.moveGoal.map((row) => [
  code(row.conceptId), code(row.recommendedTopic), row.confidence, row.rationale,
]))}

### keep + duplicateOf — ${stats.keepDuplicate.length}건

중복을 기록하고도 소속은 유지한 자리다.

${table(['개념', '상대 개념', 'rationale'], stats.keepDuplicate.map((row) => [code(row.conceptId), code(row.duplicateOf), row.rationale]))}`,

    `## 11. 교차 분류 요약 — phase 35 문항 판정과의 교차

개념 판정과 연결 문항 판정을 교차한 유형이다. \`cross-phase35.jsonl\`에는 ①이 아닌 개념만 ${stats.crossRows}줄이 있고, 이 스크립트가
\`cross-phase35.mjs\`의 \`classify\`로 전부 다시 계산해 파일과 같음을 확인했다. 영향 문항은 2A·2B에서는 권장이 달라진 문항,
3·4·hold에서는 연결 문항 전부다.

${table(['유형', '뜻', '개념', '영향 문항', '개념(영향 문항 수)'], [
  ...stats.crossTypes.map(({ type, entries, affected }) => [
    typeLabel(type), TYPE_MEANING.get(type), entries.length, affected,
    type === '1' ? '—' : entries.map((entry) => `${code(entry.concept.conceptId)}(${entry.affected.length})`).join(' · ') || '없음',
  ]),
  ['합계', '', crossSum, stats.crossTypes.reduce((acc, { affected }) => acc + affected, 0), ''],
])}

교차 파일 ${stats.crossRows}줄 + ① ${stats.crossTypes[0].entries.length}개 = ${stats.crossRows + stats.crossTypes[0].entries.length}개 · 전체 판정 ${total}건.

${table(['hold 사유', '수', '개념'], stats.holdReasons.map(({ reason, entries }) => [
  HOLD_REASONS.get(reason), entries.length, codes(entries.map((entry) => entry.concept.conceptId)),
]))}

${stats.crossStep ? `step ${stats.crossStep.step} ${stats.crossStep.name}의 summary 기록과 다시 센 값의 차이: ${TYPES
  .filter((type) => stats.crossStep.counts[type] !== stats.crossTypes.find((entry) => entry.type === type).entries.length)
  .map((type) => `${typeLabel(type)} 기록 ${stats.crossStep.counts[type]} → ${stats.crossTypes.find((entry) => entry.type === type).entries.length}`)
  .join(' · ') || '없음'}` : '교차 step의 summary에서 유형별 수를 읽지 못했다.'}`,

    `## 12. step별 분포와 급변 경고

### index.json summary에 기록된 분포

각 step이 끝날 때 \`summary\`에 적은 분포를 읽어 옮겼다. 판정 묶음은 그 step이 새로 판정한 개념만 센 값이다.

${table(['step', '이름', ...DISTRIBUTION_HEAD], [
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

무인 실행기(p36 프로파일)가 판정 묶음마다 걸던 규칙을 위 기록에 다시 적용했다 — 그 묶음의 이동 권고 비율이 앞 묶음 누적
비율보다 max(25%, 누적×3+5%p)를 넘거나, 누적이 10%를 넘는데 그 3분의 1 아래로 떨어지면 경고다.
${stats.warnings.length ? [`경고 ${stats.warnings.length}건:`, ...stats.warnings.map((warning) =>
  `- step ${warning.step}: 앞 묶음 누적 ${pct(warning.prevRate, 1)} → 이 묶음 ${pct(warning.moveRate, 1)}`)].join('\n') : '경고 0건이다.'}

### 판정 파일의 step 필드로 다시 센 분포

\`step\` 필드는 그 개념을 처음 판정한 묶음이다. 뒤 step이 고친 판정은 summary 기록과 다르게 드러난다.

${table(['step', ...DISTRIBUTION_HEAD, 'summary 기록과의 차이', `${stats.consistencyStep ? `step ${stats.consistencyStep.step}` : '일관성 검토'} 표식이 붙은 줄`],
  stats.judged.map(({ record, current }) => [
    record.step, ...distributionCells(current), diffText(record, current),
    stats.consistencyChanges.filter(({ row }) => row.step === record.step).length,
  ]))}`,

    `## 13. 표본 기준과 전체 판정의 어긋남 — ${stats.consistencyStep ? `step ${stats.consistencyStep.step} ${stats.consistencyStep.name}` : '일관성 검토'}의 기록

${stats.consistencyStep ? `표본(step 2)이 세운 기준을 전체 판정에 맞춰 본 일관성 검토의 summary를 그대로 옮긴다.

> ${stats.consistencyStep.summary}

판정 파일에서 이 step의 표식(\`${`step ${stats.consistencyStep.step}`}\`)이 \`rationale\`에 붙은 줄은 ${stats.consistencyChanges.length}건이고,
그중 표본에서 온 줄(step 필드 2)은 ${stats.consistencyChanges.filter(({ row }) => row.step === 2).length}건이다.

${table(['개념', '처음 판정 step', 'fit', 'serviceSpecificGoal', '기록 문장'], stats.consistencyChanges.map(({ row, sentence }) => [
  code(row.conceptId), row.step, row.fit, row.serviceSpecificGoal, sentence,
]))}` : '일관성 검토 step을 index.json에서 찾지 못했다.'}`,

    `## 14. 집계하며 확인한 것 — 판정은 고치지 않았다

- 이동 권고를 대상 주제에 모두 넣어 보면 \`blockImpact\`가 지정한 앞뒤와 맞붙지 않는 자리 ${combinedMismatches.length}건:
${combinedMismatches.map(({ arrangement, mismatch }) => `  - ${code(arrangement.topicId)} — ${code(mismatch.id)}의 ${mismatch.side === 'after' ? '앞' : '뒤'}로 지정한 ${code(mismatch.want)} 대신 ${mismatch.got ? code(mismatch.got) : '없음'}이 붙는다`).join('\n') || '  - 없음'}
- 옮긴 id가 이미 있는 개념 id와 겹치는 후보 ${collisions.length}건: ${codes(collisions.map(({ row }) => row.conceptId))}
- 원 주제 id를 적은 \`blockImpact\` ${sourceMentioned.length}건 / ${stats.moves.length}건

위 어긋남과 겹침은 대상 주제의 자리·id를 정하는 설계 문제이고 \`fit\`·\`confidence\`를 바꿀 근거가 아니어서 판정 파일을 고치지
않았다. 후보별 상세는 \`handoff-fixes.md\`에 있다.`,
  ]
  return `${sections.join('\n\n')}\n`
}

export function renderTopic(stats, topic) {
  const count = topic.rows.length
  const d = topic.distribution
  return `# ${topic.title}

${code(topic.id)} · \`tools/aggregate.mjs\`가 \`audit/verdicts.jsonl\`·\`audit/cross-phase35.jsonl\`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 ${count}개 · keep ${d.keep} · ambiguous ${d.ambiguous} · move-recommended ${d.move}
- 이동 후보 비율 ${pct(topic.moves.length, count)} — ${codes(topic.moves.map((row) => row.conceptId))}
- 이동 후보의 confidence high ${d.high} · medium ${d.medium} · low ${d.low}
- serviceSpecificGoal true ${d.goalTrue} · false ${d.goalFalse} · duplicateOf ${d.duplicate}
- 이 주제로 들어올 이동 후보 ${topic.incoming.length}개${topic.incoming.length ? ` — ${codes(topic.incoming.map((row) => row.conceptId))}` : ''}
- 교차 유형 ${TYPES.map((type) => `${typeLabel(type)} ${topic.types[type]}`).join(' · ')}

배열 순서는 \`topics.json\` 그대로다(ADR-033). 권장 주제가 현재와 같으면 \`(현재)\`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

${table(['위치', 'conceptId', 'learningGoal', 'fit', 'confidence', 'serviceSpecificGoal', '권장 주제', 'duplicateOf', '문항 수', '교차 유형'],
  topic.rows.map((row) => [
    stats.conceptById.get(row.conceptId).position, short(row.conceptId, topic.id), row.learningGoal, row.fit, row.confidence ?? '—',
    row.serviceSpecificGoal, row.recommendedTopic === topic.id ? '(현재)' : row.recommendedTopic,
    row.duplicateOf === null ? '—' : short(row.duplicateOf, topic.id), row.questionCount, typeLabel(stats.crossOf.get(row.conceptId).type),
  ]))}
`
}

function refsText(refs) {
  return refs.length ? refs.map((ref) => `${ref.line}줄(${ref.where}${ref.kind === 'slug' ? ' · 짧은 이름' : ''})`).join(' · ') : '없음'
}

function neighbors(order, index, topicId, tag = () => '') {
  const name = (id) => (id ? `${code(short(id, topicId))}${tag(id)}` : null)
  const prev = name(order[index - 1])
  const next = name(order[index + 1])
  return prev && next ? `앞 ${prev} · 뒤 ${next}` : prev ? `앞 ${prev} · 뒤 없음(맨 끝)` : next ? `앞 없음(맨 앞) · 뒤 ${next}` : '앞뒤 없음'
}

function questionTestsText(stats, questionIds) {
  const parts = questionIds.flatMap((id) => {
    const tests = stats.landmarks.questionTests(stats.questionIndex.get(id))
    return tests.length ? [`${id} → ${tests.map((block) => `${block.start}줄 it 「${block.name}」(${block.asserts.join('·') || '대조 필드 없음'})`).join(' · ')}`] : []
  })
  return parts.length ? parts.join(' / ') : '없음'
}

function renderMove(stats, candidate) {
  const { row, crossInfo, newId, plan, alone, source, side, mentionedBy } = candidate
  const target = row.recommendedTopic
  const moveIds = stats.moves.map((move) => move.conceptId)
  const tag = (id) => (moveIds.includes(id) && id !== row.conceptId ? '[이동 후보]' : '')
  const placedAt = alone.order.indexOf(row.conceptId)
  const place = stats.placements[row.conceptId]
  const sourceTest = stats.landmarks.orderTest(row.topicId)
  const targetTest = stats.landmarks.orderTest(target)
  const follows = plan.filter(({ fate }) => fate === 'follows')
  const undetermined = plan.filter(({ fate }) => fate === 'undetermined')
  const elsewhere = plan.filter(({ fate }) => fate === 'elsewhere')
  const allIds = plan.map(({ q }) => q.id)
  const fateText = ({ q, fate }) => {
    const verdict = `문항 판정 ${q.verdict}${q.confidence ? `·${q.confidence}` : ''}`
    if (fate === 'undetermined') return `${q.id} — ${verdict}이라 개념을 따라갈지 확정되지 않았다. 따라가면 새 id로 간다`
    if (fate === 'elsewhere') return `${q.id} — ${verdict}이 ${code(q.recommendedConceptId)}을 권해 개념을 따라가지 않고 그 개념으로 간다`
    return `${q.id} — ${verdict}${q.recommendedConceptId === null ? ' · 권장 개념 없음' : ''}이라 개념을 따라간다`
  }
  const topicChange = ({ q, fate, targetTopic }) => `${q.id} ${code(q.topicId)} → ${code(targetTopic)}${fate === 'undetermined' ? '(확정되지 않음)' : ''}`
  const conceptChange = ({ q, fate, target: to }) => `${q.id} ${code(q.conceptId)} → ${code(to)}${fate === 'undetermined' ? '(확정되지 않음)' : ''}`
  const lines = [
    `### ${code(row.conceptId)} → ${code(target)}`,
    '',
    `- 판정: move-recommended · confidence **${row.confidence}** · serviceSpecificGoal ${row.serviceSpecificGoal} · 교차 유형 **${typeLabel(crossInfo.type)}**${crossInfo.reason ? `(${HOLD_REASONS.get(crossInfo.reason)})` : ''} · 판정 step ${row.step}`,
    `- 현재 개념·주제: ${code(row.conceptId)} · ${code(row.topicId)}(위치 ${source.index + 1}/${source.order.length})`,
    `- 권장 개념·주제: ${code(newId)} · ${code(target)}${stats.conceptById.has(newId) ? ` — **이 id는 이미 있는 개념 id와 같아 새 slug를 정해야 한다**` : ''}`,
    `- 학습 목표: ${row.learningGoal}`,
    `- 영향 받는 문항 전체: ${plain(allIds)}`,
    `- conceptId 변경: 예 — 개념을 옮기면 \`<topicId>.<slug>\`의 주제 부분이 바뀐다(${code(row.conceptId)} → ${code(newId)})`,
    `- 문항 topicId 변경: ${plan.length ? `예 — ${plan.map(topicChange).join(' · ')}` : '연결 문항 없음'}`,
    `- 문항 conceptId 변경: ${plan.length ? `예 — ${plan.map(conceptChange).join(' · ')}` : '연결 문항 없음'}`,
    `- 문항별 근거(phase 35 판정):`,
    ...plan.map((entry) => `  - ${fateText(entry)}. 결정 지식: ${entry.q.decidingKnowledge}`),
    `- 원 주제(source) ${code(row.topicId)} · 대상 주제(target) ${code(target)}`,
    `- 대상 주제의 서비스 블록과 자리(ADR-033):`,
    `  - blockImpact 원문: ${row.blockImpact}`,
    placedAt >= 0
      ? `  - 지금 배열에 이 후보만 넣으면 위치 ${placedAt + 1}/${alone.order.length} — ${neighbors(alone.order, placedAt, target, tag)}`
      : `  - 지정한 앞뒤 개념 ${codes([place.after, place.before].filter((anchor) => anchor && !stats.orderOf(target).includes(anchor)))}이 지금 ${code(target)}에 없어 이 후보만으로는 자리가 정해지지 않는다 — 그 개념의 이동과 함께 정해야 한다`,
    ...alone.mismatches.map((mismatch) => `  - 지정한 ${mismatch.side === 'after' ? '앞' : '뒤'} 개념 ${code(mismatch.want)}와 맞붙지 않는다(실제 ${mismatch.got ? code(mismatch.got) : '없음'})`),
    `  - 대상 주제의 순서 단언: ${targetTest ? `\`data.test.ts\` ${targetTest.start}줄 it 「${targetTest.name}」` : '찾지 못함'}`,
    `- phase 34 순서 영향:`,
    `  - 원 주제: ${neighbors(source.order, source.index, row.topicId, tag)} → 빼면 둘이 맞붙는다. 개념 ${source.order.length} → ${source.order.length - 1}`,
    `  - 원 주제의 순서 단언: ${sourceTest ? `\`data.test.ts\` ${sourceTest.start}줄 it 「${sourceTest.name}」` : '찾지 못함'}`,
    `  - 대상 주제: 개념 ${stats.orderOf(target).length} → ${stats.orderOf(target).length + 1}. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다`,
    `  - 원 주제에서 이 개념을 언급하는 개념(\`${side.mentions.source}\`): ${mentionedBy.length ? mentionedBy.map((id) => `${code(id)}${tag(id)}`).join(' · ') : '없음'}`,
    `  - 원 주제 쪽 영향: ${side.note}`,
    `- 커버리지 영향(ADR-026):`,
    `  - 원 id ${code(row.conceptId)}는 사라지고, 연결 문항 ${plan.length}개 중 ${follows.length}개가 새 id를 따라간다${undetermined.length ? ` · 확정되지 않은 문항 ${undetermined.length}개(${plain(undetermined.map(({ q }) => q.id))})` : ''}${elsewhere.length ? ` · 다른 개념으로 가는 문항 ${elsewhere.length}개(${plain(elsewhere.map(({ q }) => q.id))})` : ''}`,
    `  - 새 개념 ${code(newId)}의 문항 ${follows.length}개${undetermined.length ? `(확정되지 않은 문항까지 따라가면 ${follows.length + undetermined.length}개)` : ''}${follows.length + undetermined.length === 0 ? ' — **문항이 없어 개념당 최소 1문항 불변식이 깨진다**' : follows.length === 0 ? ' — **확정되지 않은 문항이 따라가지 않으면 문항이 없어 불변식이 깨진다**' : ''}`,
    ...elsewhere.map(({ q, target: to }) => `  - ${q.id}의 대상 개념 ${code(to)}: 문항 ${stats.baseCount.get(to)} → ${stats.baseCount.get(to) + 1}`),
    `- 함께 고칠 곳:`,
    `  - \`src/data/topics.json\` — ${code(row.topicId)}에서 빼고 ${code(target)}에 넣는다. 개념 id가 바뀐다`,
    `  - \`src/data/questions.json\` — ${plain(allIds)}의 topicId·conceptId`,
    `  - \`scripts/topics-baseline.json\` — 개념 항목 ${stats.baselineLine(row.conceptId)}줄의 id·순서, \`questionsSha256\``,
    `  - \`src/data/data.test.ts\` — 이 개념 id가 나오는 줄: ${refsText(stats.landmarks.conceptLines(row.conceptId))}`,
    `  - \`src/data/data.test.ts\` — 문항을 구간으로 대조하는 단언: ${questionTestsText(stats, allIds)}`,
    `- 되돌리는 방법: \`topics.json\`에서 ${code(newId)}를 빼고 id를 ${code(row.conceptId)}로 되돌려 ${code(row.topicId)}의 위치 ${source.index + 1}(${neighbors(source.order, source.index, row.topicId)})에 다시 넣는다. \`questions.json\`의 ${plan.length ? plan.map(({ q }) => `${q.id} topicId를 ${code(q.topicId)}·conceptId를 ${code(q.conceptId)}`).join(', ') : '연결 문항'}로 되돌린다. \`topics-baseline.json\`의 개념 항목과 \`questionsSha256\`(\`${stats.questionsSha256.slice(0, 16)}…\`)을 이 값으로, \`data.test.ts\`의 위 줄들을 원래대로 되돌린다.`,
    `- 판정 근거(verdicts.jsonl): ${row.rationale}`,
    `- 교차 근거(cross-phase35.jsonl): ${crossInfo.rationale ?? '교차 줄 없음(①)'}`,
  ]
  return lines.join('\n')
}

function renderRetarget(stats, candidate) {
  const { type, concept, verdict, crossInfo, target, targetTopic, questions } = candidate
  const source = concept.conceptId
  const ids = questions.map((q) => q.id)
  const remaining = concept.questionIds.filter((id) => !ids.includes(id))
  const sourceAfter = stats.baseCount.get(source) - questions.length
  const targetConcept = target ? stats.conceptById.get(target) : null
  const topicMoves = type === '2B'
  const coverageTests = stats.landmarks.coverageTests(concept.topicId)
  const lines = [
    `### ${plain(ids)} · ${code(source)} → ${target ? code(target) : '권장 개념 없음'}`,
    '',
    `- 교차 유형 **${typeLabel(type)}** · 개념 판정 ${verdict.fit} · 개념 serviceSpecificGoal ${verdict.serviceSpecificGoal}`,
    `- 현재 개념·주제: ${code(source)} · ${code(concept.topicId)}`,
    `- 권장 개념·주제: ${target ? code(target) : '없음 — 추가 설계가 필요하다'} · ${code(targetTopic)}`,
    `- 영향 받는 문항 전체: ${plain(ids)}`,
    `- conceptId 변경: 아니요 — 개념은 옮기지 않는다`,
    `- 문항 topicId 변경: ${topicMoves ? `예 — ${questions.map((q) => `${q.id} ${code(q.topicId)} → ${code(targetTopic)}`).join(' · ')}` : '아니요 — 같은 주제 안이다'}`,
    `- 문항 conceptId 변경: 예 — ${questions.map((q) => `${q.id} ${code(q.conceptId)} → ${target ? code(target) : '미정'}`).join(' · ')}`,
    `- 문항 판정(phase 35):`,
    ...questions.map((q) => `  - ${q.id} — verdict ${q.verdict}${q.confidence ? `·${q.confidence}` : ''} · conceptFit ${q.conceptFit} · coverageConflict ${q.coverageConflict} · retarget ${q.retarget ?? '—'}. 결정 지식: ${q.decidingKnowledge}`),
    `- 원 주제(source) ${code(concept.topicId)} · 대상 주제(target) ${code(targetTopic)}`,
    `- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. ${targetConcept ? `대상 개념 ${code(short(target, targetTopic))}가 이미 ${code(targetTopic)}의 위치 ${targetConcept.position}/${targetConcept.topicConceptCount}에 있다(${neighbors(stats.orderOf(targetTopic), targetConcept.position - 1, targetTopic)}).` : '대상 개념이 정해지지 않았다.'}`,
    `- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다`,
    `- 커버리지 영향(ADR-026):`,
    `  - 원 개념 ${code(source)}: 문항 ${stats.baseCount.get(source)} → ${sourceAfter}(남는 문항 ${plain(remaining)})${stats.afterRetargets.get(source) !== sourceAfter ? ` · 2A·2B 후보를 모두 적용하면 ${stats.afterRetargets.get(source)}` : ''}${sourceAfter === 0 ? ` — **원 개념에 문항이 남지 않아 개념당 최소 1문항 불변식이 깨진다. 대체 문항이나 개념 병합을 이 이동과 함께 설계해야 한다**(주제별 커버리지 단언: ${coverageTests.length ? coverageTests.map((block) => `${block.start}줄 it 「${block.name}」`).join(' · ') : '찾지 못함'})` : ''}`,
    ...(target ? [`  - 대상 개념 ${code(target)}: 문항 ${stats.baseCount.get(target)} → ${stats.baseCount.get(target) + questions.length}${stats.afterRetargets.get(target) !== stats.baseCount.get(target) + questions.length ? ` · 2A·2B 후보를 모두 적용하면 ${stats.afterRetargets.get(target)}` : ''}`] : []),
    `- 함께 고칠 곳:`,
    `  - \`src/data/questions.json\` — ${plain(ids)}의 conceptId${topicMoves ? '·topicId' : ''}`,
    `  - \`scripts/topics-baseline.json\` — \`questionsSha256\``,
    `  - \`src/data/data.test.ts\` — 문항을 구간으로 대조하는 단언: ${questionTestsText(stats, ids)}`,
    `  - \`src/data/data.test.ts\` — 원 개념 id가 나오는 줄: ${refsText(stats.landmarks.conceptLines(source))}${target ? ` / 대상 개념 id가 나오는 줄: ${refsText(stats.landmarks.conceptLines(target))}` : ''}`,
    `- 되돌리는 방법: \`questions.json\`의 ${questions.map((q) => `${q.id} conceptId를 ${code(q.conceptId)}${topicMoves ? `·topicId를 ${code(q.topicId)}` : ''}`).join(', ')}로 되돌리고, \`topics-baseline.json\`의 \`questionsSha256\`을 \`${stats.questionsSha256.slice(0, 16)}…\`로 되돌린다. \`data.test.ts\`를 고쳤다면 위 줄들을 원래대로 되돌린다.`,
    `- 교차 근거(cross-phase35.jsonl): ${crossInfo.rationale}`,
  ]
  return lines.join('\n')
}

function renderArrangements(stats) {
  const moveOf = (id) => stats.verdictById.get(id)
  const listText = (order, topicId, inserted) => order.map((id, index) =>
    inserted.includes(id) ? `**${index + 1} ${code(id)}(${moveOf(id).confidence})**` : `${index + 1} ${short(id, topicId)}`).join(' · ')
  const scenario = (label, arrangement, result, inserted) => [
    `- ${label} — 넣은 후보 ${inserted.length}건${result.unresolved.length ? ` · 자리가 정해지지 않은 후보 ${codes(result.unresolved)}` : ''}${result.mismatches.length ? ` · 지정한 앞뒤와 맞붙지 않는 자리 ${result.mismatches.length}건` : ''}`,
    `  - ${listText(result.order, arrangement.topicId, inserted.filter((id) => !result.unresolved.includes(id)))}`,
    ...result.mismatches.map((mismatch) => `  - ${code(mismatch.id)}: 지정한 ${mismatch.side === 'after' ? '앞' : '뒤'} 개념 ${code(mismatch.want)} 대신 ${mismatch.got ? code(mismatch.got) : '없음'}이 붙는다`),
  ].join('\n')
  return `### 대상 주제별로 넣어 본 배열

\`blockImpact\`가 지정한 앞 개념 바로 뒤에 넣고, 앞 개념이 아직 없으면 뒤 개념 바로 앞에 넣는다. 앞 개념이 다른 이동 후보면 그 후보가
들어간 뒤에 넣는다. 굵은 칸이 들어온 후보(옮기기 전 id · confidence)다.

${stats.targetArrangements.map((arrangement) => `#### ${code(arrangement.topicId)} — 지금 개념 ${arrangement.base.length}개

${scenario('confidence high만 넣을 때', arrangement, arrangement.highOnly, arrangement.high)}
${scenario('이동 권고를 모두 넣을 때', arrangement, arrangement.all, arrangement.incoming)}`).join('\n\n')}

### 원 주제별로 빼 본 배열

${stats.sourceArrangements.map((arrangement) => {
  const rest = (removed) => arrangement.base.filter((id) => !removed.includes(id))
  const joined = (removed) => arrangement.base.flatMap((id, index) => {
    if (!removed.includes(id)) return []
    const prev = arrangement.base.slice(0, index).reverse().find((other) => !removed.includes(other)) ?? null
    const next = arrangement.base.slice(index + 1).find((other) => !removed.includes(other)) ?? null
    return [`${prev ? code(short(prev, arrangement.topicId)) : '맨 앞'} ↔ ${next ? code(short(next, arrangement.topicId)) : '맨 끝'}`]
  })
  const unique = (list) => [...new Set(list)]
  return `#### ${code(arrangement.topicId)} — 지금 개념 ${arrangement.base.length}개

- confidence high만 뺄 때(${arrangement.high.length}건): 개념 ${rest(arrangement.high).length}개 · 맞붙는 자리 ${plain(unique(joined(arrangement.high)))}
- 이동 권고를 모두 뺄 때(${arrangement.outgoing.length}건): 개념 ${rest(arrangement.outgoing).length}개 · 맞붙는 자리 ${plain(unique(joined(arrangement.outgoing)))}`
}).join('\n\n')}`
}

export function renderHandoff(stats) {
  const high = stats.moveCandidates.filter(({ row }) => row.confidence === 'high')
  const notHigh = stats.moveCandidates.filter(({ row }) => row.confidence !== 'high')
  const retargets2A = stats.retargets.filter(({ type }) => type === '2A')
  const retargets2B = stats.retargets.filter(({ type }) => type === '2B')
  const type3 = stats.crossTypes.find(({ type }) => type === '3').entries
  const type4 = stats.crossTypes.find(({ type }) => type === '4').entries
  const questionCount = (candidates) => new Set(candidates.flatMap((candidate) => (candidate.plan ?? candidate.questions.map((q) => ({ q }))).map(({ q }) => q.id))).size
  const holdQuestions = new Set(stats.holdEntries.flatMap(({ crossInfo }) => crossInfo.linked.map((q) => q.id))).size
  const sectionOf = (conceptId) => {
    const move = stats.moveCandidates.find(({ row }) => row.conceptId === conceptId)
    if (move) return move.row.confidence === 'high' ? '1절' : '6-1절'
    return '—'
  }

  return `# phase 36 수정 후보 인계 목록 — 다음 phase의 입력

**확신이 높은 항목도 이 phase에서 자동으로 고치지 않는다. 다음 phase 설계 단계에서 사람이 목록을 다시 확인한다.**

이 파일은 \`tools/aggregate.mjs\`가 \`audit/verdicts.jsonl\`(개념 판정)·\`audit/cross-phase35.jsonl\`(교차 분류)·phase 35
\`audit/verdicts.jsonl\`(문항 판정)·\`src/data/\`에서 만든다. 숫자와 줄 번호는 스크립트가 센 값이고, 판정·데이터·테스트는 한 줄도
바꾸지 않았다. 기준은 ADR-035(개념 소속)·ADR-034(문항 소속)·ADR-033(서비스 블록 순서)·ADR-026(개념당 최소 1문항)이다.
전체 집계는 [report.md](report.md)에 있다.

## 목차와 건수

${table(['절', '무엇', '후보', '영향 문항'], [
  ['1', '확신이 높은 구조 오류 — move-recommended + confidence=high', high.length, questionCount(high)],
  ['2', '2A — 같은 주제 안에서 문항의 conceptId만 바꿀 후보', retargets2A.length, questionCount(retargets2A)],
  ['3', '2B — 문항의 topicId·conceptId를 함께 바꿀 후보', retargets2B.length, questionCount(retargets2B)],
  ['4', '3 — 개념을 옮기고 연결 문항이 따라가는 후보', type3.length, type3.reduce((acc, entry) => acc + entry.affected.length, 0)],
  ['5', '4 — 개념과 문항이 둘 다 재배정 후보', type4.length, type4.reduce((acc, entry) => acc + entry.affected.length, 0)],
  ['6', '보류 목록 — ambiguous · confidence medium·low · hold', stats.holdEntries.length, holdQuestions],
])}

한 개념이 여러 절에 걸칠 수 있다 — 유형 3은 언제나 1절의 개념이고, 1절에도 교차 분류가 hold인 개념이 있다. 상세는 처음 나오는
절에 한 번 적고 뒤 절은 그 절을 가리킨다.

## 모든 후보에 공통으로 함께 고칠 것

- \`src/data/questions.json\`을 한 글자라도 고치면 \`scripts/topics-baseline.json\`의 \`questionsSha256\`을 같은 커밋에서 갱신한다
  — \`scripts/check-structure.mjs\`가 대조한다. 지금 값은 \`${stats.questionsSha256}\`이고, 되돌릴 때는 이 값으로 되돌린다.
- 개념을 옮기거나 순서를 바꾸면 \`scripts/topics-baseline.json\`의 개념 항목 순서·id를 \`topics.json\`과 같게 옮긴다(ADR-033).
  \`scripts/sync-baseline.mjs\`는 순서 변경을 거부하므로 손으로 고친다.
- 개념 배열이 바뀐 주제는 \`src/data/data.test.ts\`의 주제별 순서 단언과 그 블록 주석(규칙 5 기록)을 함께 고친다.
- 문항의 \`topicId\`는 \`conceptId\`가 속한 주제와 같아야 한다(ADR-034). 둘 중 하나만 바꾸지 않는다.
- 개념마다 문항이 하나 이상 남아야 한다(ADR-026). 예외 목록을 만들어 통과시키지 않는다.

## 1. 확신이 높은 구조 오류 — move-recommended + confidence=high ${high.length}건

${high.map((candidate) => renderMove(stats, candidate)).join('\n\n') || '없음.'}

${renderArrangements(stats)}

## 2. 2A — 같은 주제 안에서 문항의 conceptId만 바꿀 후보 ${retargets2A.length}건

${retargets2A.map((candidate) => renderRetarget(stats, candidate)).join('\n\n') || '없음.'}

## 3. 2B — 문항의 topicId·conceptId를 함께 바꿀 후보 ${retargets2B.length}건

${retargets2B.map((candidate) => renderRetarget(stats, candidate)).join('\n\n') || '없음.'}

## 4. 3 — 개념을 옮기고 연결 문항이 따라가는 후보 ${type3.length}건

개념이 high 이동 권고이고 연결 문항이 모두 현재 개념을 그대로 권해, 개념을 옮기면 문항이 따라가는 자리다. 모든 필드는 1절의 같은
개념 항목에 있다.

${table(['개념', '권장 주제', '따라가는 문항', '상세'], type3.map((entry) => [
  code(entry.concept.conceptId), code(stats.verdictById.get(entry.concept.conceptId).recommendedTopic),
  plain(entry.affected.map((q) => q.id)), sectionOf(entry.concept.conceptId),
]))}

## 5. 4 — 개념과 문항이 둘 다 재배정 후보 ${type4.length}건

${type4.length ? table(['개념', '권장 주제', '영향 문항', '상세'], type4.map((entry) => [
  code(entry.concept.conceptId), code(stats.verdictById.get(entry.concept.conceptId).recommendedTopic),
  plain(entry.affected.map((q) => q.id)), sectionOf(entry.concept.conceptId),
])) : '없음.'}

## 6. 보류 목록 — ambiguous · confidence medium·low · hold ${stats.holdEntries.length}건

보류는 변경을 제안하지 않는 자리라 되돌릴 것이 없다. 설계에서 이동을 정하면 1~3절의 형식으로 옮겨 적는다.

${table(['개념', '주제', '보류 기준', '연결 문항(phase 35 판정 → 권장 개념)', '상세'], stats.holdEntries.map(({ concept, row, crossInfo, criteria }) => [
  code(concept.conceptId), code(concept.topicId), criteria.join(' · '),
  crossInfo.linked.map((q) => `${q.id} ${q.verdict}${q.confidence ? `·${q.confidence}` : ''}${q.recommendedConceptId !== concept.conceptId ? ` → ${q.recommendedConceptId ? code(q.recommendedConceptId) : '없음'}` : ''}`).join(' · ') || '없음',
  isMove(row) ? sectionOf(concept.conceptId) : '6-2절',
]))}

### 6-1. confidence가 high가 아닌 이동 권고 ${notHigh.length}건

${notHigh.map((candidate) => renderMove(stats, candidate)).join('\n\n') || '없음.'}

### 6-2. 이동 권고가 아닌 보류 ${stats.holdEntries.filter(({ row }) => !isMove(row)).length}건

${stats.holdEntries.filter(({ row }) => !isMove(row)).map(({ concept, row, crossInfo, criteria }) => {
  const issue = row.fit === 'ambiguous' ? stats.ambiguous.find((entry) => entry.row.conceptId === row.conceptId).issue : null
  return `#### ${code(concept.conceptId)}

- 보류 기준: ${criteria.join(' · ')} · 개념 판정 ${row.fit} · serviceSpecificGoal ${row.serviceSpecificGoal}
- 학습 목표: ${row.learningGoal}
${issue ? `- 쟁점: ${issue.issue}
- ${code(concept.topicId)} 주제로 읽으면: ${issue.current}
- ${issue.others.map(code).join(' · ')} 주제로 읽으면: ${issue.alternative}
` : ''}- 영향 받는 문항 전체: ${plain(crossInfo.linked.map((q) => q.id))}
${crossInfo.linked.map((q) => `  - ${q.id} — verdict ${q.verdict}${q.confidence ? `·${q.confidence}` : ''} · 권장 ${q.recommendedConceptId ? code(q.recommendedConceptId) : '없음'}${q.recommendedTopic !== concept.topicId ? '(다른 주제)' : ''} · conceptFit ${q.conceptFit}. 결정 지식: ${q.decidingKnowledge}`).join('\n')}
- 교차 근거(cross-phase35.jsonl): ${crossInfo.rationale}`
}).join('\n\n') || '없음.'}
`
}

function main() {
  const text = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
  const jsonl = (path) => text(path).split('\n').filter((line) => line.trim()).map((line) => JSON.parse(line))
  const stats = aggregate({
    verdicts: jsonl('../audit/verdicts.jsonl'),
    concepts: jsonl('../audit/concepts.jsonl'),
    cross: jsonl('../audit/cross-phase35.jsonl'),
    questionVerdicts: jsonl('../../35-question-topic-audit/audit/verdicts.jsonl'),
    questions: JSON.parse(text('../../../src/data/questions.json')),
    topics: JSON.parse(text('../../../src/data/topics.json')),
    // 이 보고서 step의 summary는 보고서를 쓴 뒤에 적히므로 읽지 않는다. 읽으면 다시 돌릴 때마다 표가 달라진다.
    steps: JSON.parse(text('../index.json')).steps.filter((entry) => entry.name !== 'audit-report'),
    testText: text('../../../src/data/data.test.ts'),
    baselineText: text('../../../scripts/topics-baseline.json'),
  })
  const byTopic = new URL('../audit/by-topic/', import.meta.url)
  mkdirSync(byTopic, { recursive: true })
  writeFileSync(new URL('../audit/report.md', import.meta.url), renderReport(stats))
  writeFileSync(new URL('../audit/handoff-fixes.md', import.meta.url), renderHandoff(stats))
  for (const topic of stats.topicStats) writeFileSync(new URL(`${topic.id}.md`, byTopic), renderTopic(stats, topic))
  const { keep, ambiguous, move } = stats.distribution
  console.log(`보고서 작성 · 판정 ${stats.total}건 · keep ${keep} · ambiguous ${ambiguous} · move-recommended ${move} · 주제 파일 ${stats.topicStats.length}개`)
  console.log(`인계 후보 · high 이동 ${stats.moveCandidates.filter(({ row }) => row.confidence === 'high').length} · 2A ${stats.retargets.filter(({ type }) => type === '2A').length} · 2B ${stats.retargets.filter(({ type }) => type === '2B').length} · 보류 ${stats.holdEntries.length}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`집계 실패: ${error.message}`)
    process.exitCode = 1
  }
}
