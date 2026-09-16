#!/usr/bin/env node
/**
 * ADR-035 「문항 판정과 독립으로 먼저 판단한다」의 교차 분류. 개념 판정(phase 36)과 문항 판정(phase 35)을
 * 읽어 audit/cross-phase35.jsonl을 쓴다. 두 판정 파일은 읽기만 한다.
 * 사용법: node phases/36-concept-topic-audit/tools/cross-phase35.mjs
 * 유형은 classify가 규칙대로 계산한다. 사람이 쓴 것은 RATIONALES의 근거뿐이고, 계산한 유형과 근거의 유형이
 * 어긋나거나 근거가 빠지면 파일을 쓰지 않고 exit 1로 끝난다.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PHASE = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = join(PHASE, '../..')
const readJsonl = (path) => readFileSync(join(ROOT, path), 'utf8').trim().split('\n').map((line) => JSON.parse(line))
const NO_TARGET = '대상 개념이 없어 추가 설계가 필요하다'

// 문항 판정 하나가 개념에 무엇을 권하는가. verdict가 keep이어도 recommendedConceptId가 다르면
// 같은 주제의 다른 개념을 권한 것이다(2A). ADR-034의 verdict는 주제만 판정하기 때문이다.
function direction(concept, question) {
  if (question.verdict === 'ambiguous') return 'ambiguous'
  if (question.recommendedTopic !== concept.topicId) return 'other-topic'
  return question.recommendedConceptId === concept.conceptId ? 'same' : 'same-topic'
}

/**
 * 유형 '1'(①)·'2A'·'2B'·'3'·'4'·'hold'. hold 사유는 아래 순서로 처음 걸린 하나다.
 * - concept-ambiguous · question-ambiguous: 어느 한쪽이라도 ambiguous
 * - direction-mismatch: 개념이 옮기는데 문항이 현재 주제에 남거나 다른 주제로 간다
 * - not-high-confidence: 이동 권고(개념이든 문항이든)의 confidence가 high가 아니다 —
 *   hold는 다음 phase의 확신 높은 수정 대상에서 빠지는 자리이므로 medium·low는 여기로 온다
 * keep 개념에서 2A와 2B가 섞이면 topicId까지 바꾸는 2B로 센다.
 */
export function classify(concept, questions) {
  const kinds = questions.map((question) => direction(concept, question))
  const hold = (reason) => ({ type: 'hold', reason })
  if (concept.fit === 'ambiguous') return hold('concept-ambiguous')
  if (kinds.includes('ambiguous')) return hold('question-ambiguous')
  const moving = questions.filter((_, index) => kinds[index] === 'other-topic')
  const conceptMoves = concept.fit === 'move-recommended'
  if (conceptMoves && (kinds.includes('same-topic') || moving.some((q) => q.recommendedTopic !== concept.recommendedTopic))) {
    return hold('direction-mismatch')
  }
  const confidences = [...(conceptMoves ? [concept.confidence] : []), ...moving.map((q) => q.confidence)]
  if (confidences.some((confidence) => confidence !== 'high')) return hold('not-high-confidence')
  if (conceptMoves) return { type: moving.length > 0 ? '4' : '3', reason: null }
  return { type: moving.length > 0 ? '2B' : kinds.includes('same-topic') ? '2A' : '1', reason: null }
}

// 개념 id → 사람이 쓴 근거와 그 근거가 설명하는 유형. 개념 배열 순서다.
const RATIONALES = {
  's3-encryption-batch.sse-types': {
    type: '2A',
    rationale: '개념은 keep이고 q037이 같은 주제의 sse-kms-cost를 권해 2A다. 문항이 가르는 것은 키 관리 주체가 아니라 객체마다 KMS를 호출해 커지는 비용이라 q037의 conceptId만 바꾸면 되고, 원 개념에는 q035·q036·q038이 남는다.',
  },
  's3-encryption-batch.s3-object-lambda': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q278은 반환 직전에 변환하는 구조로 현재 개념을 유지했지만, 개념 쪽 쟁점은 그 구조를 데이터 처리(s3-encryption-batch)로 가르칠지 요청자별 접근 방식(s3-access-control)으로 가르칠지여서 문항의 keep만으로 소속이 정해지지 않는다.',
  },
  's3-access-control.s3-storage-lens': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q252는 사용 현황을 모아 보고하는 기능으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 접근 제어와 무관한 사용 현황 분석을 s3-storage-classes나 s3-versioning-lifecycle에서 가르칠지여서 문항의 keep만으로 확정되지 않는다.',
  },
  's3-access-control.s3-storage-lens-advanced-activity-metrics': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q255는 준비가 가장 적은 수단으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 Storage Lens 기본 개념과 같은 블록에 둘지 비용 절감 대상을 고르는 s3-storage-classes에 둘지여서 기본 개념 s3-storage-lens의 처리와 함께 정해야 한다.',
  },
  'ebs-instance-store.cluster-placement-group': {
    type: 'hold',
    rationale: '개념의 ec2-autoscaling 이동 권고가 medium이라 hold다. q175는 인스턴스 배치가 답을 가르는 문항으로 현재 개념을 유지해 개념이 옮기면 따라갈 구조(3)지만, 본문의 FSx for Lustre와 짝을 이루는 HPC 스토리지 맥락 때문에 개념 판정 스스로 확신을 낮췄다. 같은 블록으로 옮길 spread-placement-group·elastic-fabric-adapter(3)가 이 개념을 전제로 쓰므로 함께 다뤄야 한다.',
  },
  'ebs-instance-store.spread-placement-group': {
    type: '3',
    rationale: '개념은 ec2-autoscaling으로 high 이동 권고이고 q287은 현재 개념을 그대로 권해 3이다. q287의 결정적 지식이 분산 배치 그룹 자체라 개념을 옮기면 문항이 따라가며, 다음 phase는 conceptId를 ec2-autoscaling.spread-placement-group으로 바꾸면서 q287의 topicId·conceptId도 함께 바꾼다. blockImpact의 자리가 cluster-placement-group 바로 뒤인데 그 개념이 medium이라 hold이므로 두 개념의 이동을 함께 정해야 한다.',
  },
  'ebs-instance-store.elastic-fabric-adapter': {
    type: '3',
    rationale: '개념은 ec2-autoscaling으로 high 이동 권고이고 q284는 현재 개념을 그대로 권해 3이다. q284의 결정적 지식이 EFA의 운영체제 네트워크 스택 우회라 개념을 옮기면 문항이 따라가며, 다음 phase는 conceptId를 ec2-autoscaling.elastic-fabric-adapter로 바꾸면서 q284의 topicId·conceptId도 함께 바꾼다. 본문이 두 배치 그룹을 전제로 쓰는데 cluster-placement-group이 hold이므로 blockImpact의 자리는 그 처리와 함께 정해야 한다.',
  },
  'efs-fsx.efs': {
    type: '2A',
    rationale: '개념은 keep이고 q043이 같은 주제의 efs-lifecycle-management를 권해 2A다. IA로 옮긴 파일을 곧바로 읽는다는 특성이 답을 가르므로 q043의 conceptId만 바꾸면 되고 원 개념에는 q042가 남는다. q344도 같은 대상을 권하므로 함께 옮기면 efs-lifecycle-management의 문항이 1개에서 3개가 된다.',
  },
  'efs-fsx.efs-ia-file-size-threshold': {
    type: '2A',
    rationale: '개념은 keep이고 q344가 같은 주제의 efs-lifecycle-management를 권해 2A다. 오답을 가르는 것이 크기 임계값이 아니라 접근 빈도에 따른 수명 주기 전환이라 q344의 conceptId만 바꾸면 되고, 원 개념에는 q343이 남는다. 같은 대상을 권하는 efs-fsx.efs의 q043과 함께 다룬다.',
  },
  'efs-fsx.efs-replication-one-way': {
    type: 'hold',
    rationale: '개념은 keep이지만 유일한 문항 q348이 ambiguous라 hold다. EFS 복제의 단방향 제약으로 읽으면 현재 개념이지만 반대 방향 DataSync 작업 두 개의 구성 문제로도 읽히고, data-transfer-services에는 양방향 작업을 설명하는 개념이 없어 이동 쪽 대상도 비어 있다.',
  },
  'efs-fsx.fsx': {
    type: '2A',
    rationale: '개념은 keep이고 q045는 fsx-lustre-s3-data-repository-association을, q046은 fsx-ontap-multi-protocol-tiering을 같은 주제 안에서 권해 2A다. 소개에 한 항목으로 나열된 유형별 특징보다 전용 개념이 결정적 지식을 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q047·q048이 남는다.',
  },
  'data-transfer-services.datasync-task-status-event': {
    type: 'hold',
    rationale: '개념과 q364가 모두 ambiguous라 hold다. 두 판정이 DataSync 상태 이벤트라는 서비스 기능인가, 폴링 대신 EventBridge 규칙에서 SNS로 잇는 sqs-sns-eventbridge.eventbridge-event-pattern-vs-polling의 공통 패턴인가라는 같은 쟁점에서 멈춰 서로 어긋나지 않지만 확정할 근거도 없다.',
  },
  'rds-storage-features.features': {
    type: '2A',
    rationale: '개념은 keep이고 q061은 rds-multi-az-db-cluster를, q065는 rds-blue-green-deployment를 같은 주제 안에서 권해 2A다. 기능 목록의 한 항목보다 전용 개념이 배포 형태와 전환 절차를 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q060·q062·q063·q064가 남는다.',
  },
  'aurora.aurora': {
    type: '2A',
    rationale: '개념은 keep이고 q068이 같은 주제의 aurora-replica-auto-scaling을 권해 2A다. 읽기 전용 복제본 수를 자동으로 조정하는 기능이 답을 가르므로 q068의 conceptId만 바꾸면 되고, 원 개념에는 q066·q067이 남는다.',
  },
  'aurora.aurora-clone': {
    type: 'hold',
    rationale: '개념은 keep이지만 유일한 문항 q400이 ambiguous라 hold다. q400은 이동할 경우의 대상으로 backup-disaster-recovery.backup-long-term-retention을 적었지만 클론의 적용 범위를 확인하는 해석도 남겼고, 개념 판정은 후반의 AWS Backup 설명을 반례로 봤다. 문항을 옮기면 aurora-clone에 문항이 남지 않는다.',
  },
  'elastic-load-balancing.elb': {
    type: '2A',
    rationale: '개념은 keep이고 q080은 nlb-udp-listener를, q081은 gateway-load-balancer를 같은 주제 안에서 권해 2A다. 유형 나열보다 각 유형의 전용 개념이 지원 프로토콜과 분산 대상을 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q078·q079가 남는다.',
  },
  'elastic-load-balancing.internal-load-balancer': {
    type: 'hold',
    rationale: '개념은 keep이지만 유일한 문항 q459가 ambiguous라 hold다. 내부 로드 밸런서의 노출 체계만으로는 퍼블릭·프라이빗 호스팅 영역을 가른 두 보기 중 답을 고를 수 없어 route53 문제라는 해석이 남았고, 개념 판정은 프라이빗 호스팅 영역을 짝으로만 봤다.',
  },
  'elastic-load-balancing.end-to-end-encryption-behind-alb': {
    type: '2B',
    rationale: '개념은 keep이고 q465가 다른 주제의 secrets-encryption.acm을 high로 권해 2B다. 이 문항은 TLS 구간 구성 없이 인증서 발급·갱신 책임만으로 풀리므로 q465의 topicId·conceptId를 함께 옮기면 되고(retarget ready), 원 개념에는 q464가 남는다. 다만 개념 판정은 인증서 관리 방식 비교를 이 구성의 운영 판단으로 보고 옮기지 않았으므로, 옮긴 뒤 원 개념 본문과 q465가 가르치는 범위가 갈리는지 함께 확인해야 한다.',
  },
  'cloudfront-global-accelerator.global-accelerator-static-ip': {
    type: '2A',
    rationale: '개념은 keep이고 q472가 같은 주제의 global-accelerator-protocols를 권해 2A다. 주소 고정은 문항의 조건이 아니고 사본 캐싱과 연결 가속의 갈림길이 답을 가르므로 q472의 conceptId만 바꾸면 되고, 원 개념에는 q471이 남는다.',
  },
  'lambda.lambda': {
    type: '2A',
    rationale: '개념은 keep이고 q086이 같은 주제의 lambda-reserved-concurrency를 권해 2A다. 실행 환경을 미리 초기화해 콜드 스타트를 줄이는 설정이 답을 가르므로 q086의 conceptId만 바꾸면 되고, 원 개념에는 q085·q087이 남는다.',
  },
  'lambda.lambda-concurrency-limit-throttling': {
    type: 'hold',
    rationale: '개념은 keep이지만 유일한 문항 q497이 ambiguous라 hold다. 동시성 한도 초과를 진단하는 Lambda 문제로 읽으면 현재 개념이지만 급증분을 큐가 보관한다는 sqs-sns-eventbridge.sns-is-not-a-queue의 통합 패턴으로도 읽히며, 개념 판정은 큐를 버퍼로만 봤다.',
  },
  'lambda.serverless-runtime-no-os-access': {
    type: '2B',
    rationale: '개념은 keep이고 q508이 다른 주제의 rds-storage-features.rds-custom을 high로 권해 2B다. 관리형 데이터베이스에서 OS 설정이 필요하면 RDS Custom을 고른다는 지식이 답을 가르므로 q508의 topicId·conceptId를 함께 옮기면 되고(retarget ready), 원 개념에는 서버리스 런타임을 묻는 q507이 남는다.',
  },
  'ecs-eks-fargate.elastic-beanstalk': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q510은 코드를 통째로 배포한다는 조건으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 이 문항이 다루지 않는 EC2 기반 환경의 운영 책임을 ecs-eks-fargate와 ec2-autoscaling 중 어디서 가르칠지여서 문항의 keep만으로 확정되지 않는다.',
  },
  'api-gateway-step-functions.api-gateway-behind-cloudfront': {
    type: 'hold',
    rationale: '개념은 cloudfront-global-accelerator로 high 이동 권고지만 유일한 문항 q538이 ambiguous라 hold다. q538의 두 해석 중 한 CloudFront 배포의 여러 오리진이라는 전송 지식은 개념의 권장 방향과 같지만, HTTP API를 오리진으로 등록한다는 API Gateway 연동 해석이 남아 문항이 개념을 따라갈지 확정되지 않는다.',
  },
  'api-gateway-step-functions.amplify': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q529는 Amplify의 범위가 어디서 끝나는지로 현재 개념을 유지하고 SNS를 대비 오답으로만 봤지만, 개념 쪽은 알림 서비스 선택 기준(sqs-sns-eventbridge)으로 읽는 해석을 남겼으므로 문항의 keep만으로 확정되지 않는다.',
  },
  'sqs-sns-eventbridge.sqs-queue-depth-scaling': {
    type: 'hold',
    rationale: '개념의 ec2-autoscaling 이동 권고가 medium이라 hold다. q204는 남은 작업량을 직접 재는 지표라는 이유로 현재 개념을 유지하면서 ec2-autoscaling을 부차 주제로 적어, 조정 지표 선택으로 읽는 개념 쪽과 큐 소비 운영으로 읽는 해석이 함께 남아 있다.',
  },
  'security-groups-nacl.nacl-rule-limit': {
    type: '2B',
    rationale: '개념은 keep인데 유일한 문항 q225가 다른 주제의 waf-shield.waf-rule-types를 high로 권해 2B다. NACL 규칙 수 한계는 문제문에 주어진 배경이고 IP 세트와 지리적 일치를 가르는 WAF 지식이 답을 정하므로 q225의 topicId·conceptId를 함께 옮기되, 원 개념에 문항이 남지 않는다(phase 35 coverageConflict·retarget needs-design). 다음 phase는 NACL의 한계를 묻는 대체 문항을 이 이동과 함께 설계해야 한다.',
  },
  'hybrid-connectivity.access-terms': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q217은 Customer Gateway가 VPN의 고객 측 종단이라는 지식으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 한 개념에 함께 묶인 Bastion Host를 systems-manager나 vpc-networking에서 가르칠지여서 이 문항이 답하지 않는다.',
  },
  'cloudwatch-xray.log-analysis-options': {
    type: '2B',
    rationale: '개념은 keep인데 유일한 문항 q223이 다른 주제의 emr-glue-athena.log-storage-s3-athena를 high로 권해 2B다. 대상 개념은 권장 주제 안에 있어 q223의 topicId·conceptId를 함께 옮기면 되지만 원 개념에 문항이 남지 않는다(phase 35 coverageConflict·retarget needs-design). 두 개념은 phase 36이 서로 duplicateOf로 기록한 쌍이므로, 다음 phase는 대체 문항을 만들지 두 개념을 합칠지를 이 이동과 함께 정해야 한다.',
  },
  'cloudwatch-xray.cloudwatch-alarm-state-change-event': {
    type: 'hold',
    rationale: '개념과 q656이 모두 ambiguous라 hold다. 둘 다 알람 상태 변경이 이벤트로 나간다는 CloudWatch 기능과, 규칙이 조치 서비스를 직접 호출해 함수를 끼우지 않는 EventBridge 규칙 설계 사이에서 같은 두 해석을 남겼다.',
  },
  'secrets-encryption.acm-expiration-event': {
    type: 'hold',
    rationale: '개념과 q667이 모두 ambiguous라 hold다. 둘 다 ACM 만료 임박 이벤트라는 서비스 기능과, 폴링 대신 이벤트 패턴을 쓰고 알림에는 큐가 아니라 SNS를 쓴다는 sqs-sns-eventbridge의 통합 지식 사이에서 같은 두 해석을 남겼다.',
  },
  'waf-shield.cloudfront': {
    type: 'hold',
    rationale: '개념과 세 문항이 모두 cloudfront-global-accelerator를 가리켜 방향은 같지만 q152의 이동 권고가 medium이라 hold다. q152는 권장 개념이 null이라 대상 개념이 없어 추가 설계가 필요하다(그 주제에서 OAC를 담은 cloudfront-s3-upload-with-oac는 업로드 경로가 중심). q153은 cloudfront-ttl, q154는 cloudfront-multiple-origins로 기존 개념에 재연결되므로 개념을 옮겨도 따라갈 수 있는 문항은 q152뿐이고, 옮긴 id cloudfront-global-accelerator.cloudfront는 이미 있는 개념과 겹쳐 새 slug가 필요하다.',
  },
  'guardduty-macie-inspector.guardduty-finding-to-eventbridge': {
    type: 'hold',
    rationale: '개념이 ambiguous라 hold다. q683은 오답이 보안 서비스의 역할을 오해한 것이라 GuardDuty 탐지 쪽으로 유지하고 EventBridge를 부차로 뒀지만, 개념 쪽 쟁점은 탐지와 조치를 잇는 EventBridge 규칙 패턴의 소속이라 문항의 keep은 두 해석 중 한쪽만 뒷받침한다.',
  },
  'guardduty-macie-inspector.macie-finding-to-eventbridge': {
    type: 'hold',
    rationale: '개념과 q684가 모두 ambiguous라 hold다. 둘 다 Macie 탐지 결과의 유형이라는 보안 서비스 지식과, 알림이 필요한 곳에 큐를 두지 않는 sqs-sns-eventbridge.sns-is-not-a-queue의 이벤트→알림 패턴 사이에서 같은 두 해석을 남겼다.',
  },
  'iam-permissions.iam-roles-anywhere': {
    type: 'hold',
    rationale: '개념의 identity-federation 이동 권고가 medium이라 hold다. q686은 identity-federation의 SAML·ID 브로커 경로가 조건에서 제외됐다는 이유로 현재 개념을 유지했는데, 이는 자격 증명 획득 방식 비교를 근거로 옮기자는 개념 판정과 반대쪽을 가리키는 근거라 설계 단계에서 두 판정을 다시 맞춰 봐야 한다.',
  },
  'identity-federation.identity-center': {
    type: '2A',
    rationale: '개념은 keep이고 q159가 같은 주제의 identity-center-permission-set을 권해 2A다. 자격 증명과 허용 작업을 묶은 권한 템플릿의 차이가 답을 가르므로 q159의 conceptId만 바꾸면 되고, 원 개념에는 q158이 남는다.',
  },
  'cost-management.savings-plan': {
    type: '2A',
    rationale: '개념은 keep이고 q165가 같은 주제의 savings-plan-details를 권해 2A다. 컴퓨팅 절약 플랜이 Fargate·Lambda까지 덮는 적용 범위가 답을 가르므로 q165의 conceptId만 바꾸면 되고, 원 개념에는 q164가 남는다.',
  },
  'cost-management.on-demand-capacity-reservation': {
    type: 'hold',
    rationale: '개념은 keep이지만 q728이 ambiguous라 hold다. q728은 중단을 견디는 작업에 스팟을 고르는 해석으로 ec2-autoscaling.spot-workload-fit을 잠정 권했는데, 이는 step 12가 개념을 ambiguous에서 keep으로 고칠 때 물리친 EC2 쪽 해석과 같은 방향이다. q727은 현재 개념을 유지하므로 q728이 옮겨도 원 개념의 커버리지는 남는다.',
  },
}

const LABEL = { 1: '①', '2A': '2A', '2B': '2B', 3: '3', 4: '4', hold: 'hold' }

function main() {
  const concepts = readJsonl('phases/36-concept-topic-audit/audit/concepts.jsonl')
  const verdicts = new Map(readJsonl('phases/36-concept-topic-audit/audit/verdicts.jsonl').map((row) => [row.conceptId, row]))
  const questions = new Map(readJsonl('phases/35-question-topic-audit/audit/verdicts.jsonl').map((row) => [row.id, row]))
  const topicOf = new Map(concepts.map((concept) => [concept.conceptId, concept.topicId]))
  const errors = []
  const rows = []
  // 출력 순서를 고정하려고 Map으로 센다 — 객체는 정수 모양 키('3'·'4')를 앞으로 당긴다.
  const counts = new Map(['①', '2A', '2B', '3', '4', 'hold'].map((label) => [label, 0]))
  const holdReasons = {}

  for (const { conceptId, topicId, questionIds } of concepts) {
    const verdict = verdicts.get(conceptId)
    const linked = questionIds.map((id) => questions.get(id))
    for (const question of linked) {
      if (question.conceptId !== conceptId) errors.push(`${question.id}: phase 35의 conceptId가 워크시트의 ${conceptId}와 다르다.`)
    }
    const { type, reason } = classify(verdict, linked)
    counts.set(LABEL[type], counts.get(LABEL[type]) + 1)
    if (reason) holdReasons[reason] = (holdReasons[reason] ?? 0) + 1
    const written = RATIONALES[conceptId]
    if (type === '1') {
      if (written) errors.push(`${conceptId}: 계산한 유형이 ①인데 근거(${written.type})가 남아 있다.`)
      continue
    }
    if (!written) {
      errors.push(`${conceptId}: 계산한 유형 ${type}${reason ? `(${reason})` : ''}의 근거가 없다.`)
      continue
    }
    if (written.type !== type) errors.push(`${conceptId}: 계산한 유형 ${type}와 근거의 유형 ${written.type}가 다르다.`)
    // 재배정은 topicId와 conceptId를 함께 옮긴다(ADR-034). 이동 문항의 대상 개념이 권장 주제에 없으면 근거에 적는다.
    const noTarget = linked.some((q) => q.verdict === 'move-recommended' && topicOf.get(q.recommendedConceptId) !== q.recommendedTopic)
    if (noTarget && !written.rationale.includes(NO_TARGET)) errors.push(`${conceptId}: 이동 문항의 대상 개념이 권장 주제에 없으므로 근거에 «${NO_TARGET}»를 적어야 한다.`)
    rows.push({
      conceptId,
      topicId,
      conceptFit: verdict.fit,
      questionFindings: linked.map(({ id, verdict: v, recommendedTopic, recommendedConceptId }) => ({ id, verdict: v, recommendedTopic, recommendedConceptId })),
      type,
      rationale: written.rationale,
      reason,
    })
  }

  if (errors.length > 0) {
    for (const message of errors) console.error(message)
    process.exitCode = 1
    return
  }
  writeFileSync(join(PHASE, 'audit/cross-phase35.jsonl'), rows.map(({ reason, ...row }) => JSON.stringify(row)).join('\n') + '\n')
  console.log(`교차 ${rows.length}줄 · ${[...counts].map(([label, n]) => `${label} ${n}`).join(' · ')}`)
  console.log(`hold 사유 · ${Object.entries(holdReasons).map(([reason, n]) => `${reason} ${n}`).join(' · ')}`)
  for (const row of rows) {
    // 2A·2B는 권장이 달라진 문항만, 3·4는 개념을 따라 움직이는 연결 문항 전부가 영향 문항이다.
    const affected = ['2A', '2B'].includes(row.type)
      ? row.questionFindings.filter((q) => q.verdict === 'move-recommended' || q.recommendedConceptId !== row.conceptId)
      : row.questionFindings
    const detail = row.type === 'hold' ? row.reason : `영향 문항 ${affected.length} (${affected.map((q) => q.id).join(', ')})`
    console.log(`${row.type} ${row.conceptId} — ${detail}`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
