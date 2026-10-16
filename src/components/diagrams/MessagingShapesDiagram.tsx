import { useId, useState } from 'react'
import { useWideDiagram } from '../../hooks/useWideDiagram'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 그룹 라벨은 두 배치가 함께 쓴다.
const groupLabels: Record<string, string> = {
  senders: '보내는 쪽', managed: 'AWS 전달 장치', receivers: '받는 쪽',
}

const groups = [
  { id: 'senders', x: 12, y: 4, width: 256, height: 136, labelX: 24, labelY: 22 },
  { id: 'managed', x: 12, y: 164, width: 256, height: 192, labelX: 24, labelY: 182 },
  { id: 'receivers', x: 12, y: 380, width: 256, height: 200, labelX: 24, labelY: 398 },
]

// 세 그룹은 네트워크 경계가 아니라 전달 단계다. 긴 이벤트 버스 라벨은 전체 폭을 쓴다.
const nodes = [
  { id: 'app', label: '애플리케이션', x: 20, y: 36, width: 112, color: 'stroke-disabled' },
  { id: 'aws-service', label: 'AWS 서비스', x: 148, y: 36, width: 112, color: 'stroke-disabled' },
  { id: 'saas', label: '외부 SaaS', x: 20, y: 92, width: 112, color: 'stroke-disabled' },
  { id: 'legacy-app', label: '기존 온프레미스 앱', x: 148, y: 92, width: 112, color: 'stroke-disabled' },
  { id: 'queue', label: 'SQS 큐', x: 20, y: 196, width: 112, color: 'stroke-diagram-managed' },
  { id: 'topic', label: 'SNS 주제', x: 148, y: 196, width: 112, color: 'stroke-diagram-managed' },
  { id: 'bus', label: 'EventBridge 이벤트 버스', x: 20, y: 252, width: 240, color: 'stroke-diagram-managed' },
  { id: 'broker', label: 'Amazon MQ 브로커', x: 20, y: 308, width: 112, color: 'stroke-diagram-managed' },
  { id: 'ses', label: 'SES', x: 148, y: 308, width: 112, color: 'stroke-diagram-managed' },
  { id: 'worker', label: '워커 하나', x: 20, y: 420, width: 112, color: 'stroke-disabled' },
  { id: 'subscribers', label: '구독자 여럿', x: 148, y: 420, width: 112, color: 'stroke-disabled' },
  { id: 'targets', label: '규칙에 맞는 대상', x: 20, y: 476, width: 240, color: 'stroke-disabled' },
  { id: 'legacy-consumer', label: '기존 앱', x: 20, y: 532, width: 112, color: 'stroke-disabled' },
  { id: 'inbox', label: '이메일 수신함', x: 148, y: 532, width: 112, color: 'stroke-disabled' },
]

// 좌우 통로와 행 사이 여백으로 연결해 다른 노드와 그룹 라벨을 피한다.
const paths: Record<string, string> = {
  'app-queue': 'M76 68 V80 H8 V188 H76 V196',
  'queue-worker': 'M76 228 V240 H8 V404 H76 V420',
  'app-topic': 'M132 52 H140 V152 H204 V196',
  'topic-subscribers': 'M204 228 V240 H272 V404 H204 V420',
  'aws-service-bus': 'M204 68 V80 H272 V240 H140 V252',
  'saas-bus': 'M76 124 V136 H8 V240 H76 V252',
  'bus-targets': 'M260 268 H272 V492 H260',
  'legacy-app-broker': 'M204 124 V152 H272 V296 H76 V308',
  'broker-legacy-consumer': 'M76 340 V368 H8 V548 H20',
  'app-ses': 'M132 52 H140 V152 H272 V324 H260',
  'ses-inbox': 'M204 340 V368 H272 V548 H260',
}

// 가로형은 세 단계를 왼쪽에서 오른쪽 세 열로 편다. 서비스마다 한 줄이고, 애플리케이션은 SQS·SNS·SES 세 줄의 가운데에 선다.
const wideGroups = [
  { id: 'senders', x: 4, y: 4, width: 124, height: 292, labelX: 16, labelY: 22 },
  { id: 'managed', x: 148, y: 4, width: 152, height: 292, labelX: 160, labelY: 22 },
  { id: 'receivers', x: 320, y: 4, width: 116, height: 292, labelX: 332, labelY: 22 },
]

// 라벨과 색은 세로형 nodes에서 id로 가져온다.
const wideNodes = [
  { id: 'app', x: 12, y: 80, width: 108 },
  { id: 'aws-service', x: 12, y: 168, width: 108 },
  { id: 'saas', x: 12, y: 212, width: 108 },
  { id: 'legacy-app', x: 12, y: 256, width: 108 },
  { id: 'queue', x: 156, y: 36, width: 136 },
  { id: 'topic', x: 156, y: 80, width: 136 },
  { id: 'ses', x: 156, y: 124, width: 136 },
  { id: 'bus', x: 156, y: 168, width: 136 },
  { id: 'broker', x: 156, y: 256, width: 136 },
  { id: 'worker', x: 328, y: 36, width: 100 },
  { id: 'subscribers', x: 328, y: 80, width: 100 },
  { id: 'inbox', x: 328, y: 124, width: 100 },
  { id: 'targets', x: 328, y: 168, width: 100 },
  { id: 'legacy-consumer', x: 328, y: 256, width: 100 },
]

// 전달 장치에서 받는 쪽으로 가는 경로는 모두 수평선 하나다. 애플리케이션은 위·아래 줄로 노드 가운데에서 꺾어 나가고,
// 외부 SaaS는 버스 아래로 들어간다.
const widePaths: Record<string, string> = {
  'app-queue': 'M66 80 V52 H156',
  'queue-worker': 'M292 52 H328',
  'app-topic': 'M120 96 H156',
  'topic-subscribers': 'M292 96 H328',
  'aws-service-bus': 'M120 184 H156',
  'saas-bus': 'M120 228 H224 V200',
  'bus-targets': 'M292 184 H328',
  'legacy-app-broker': 'M120 272 H156',
  'broker-legacy-consumer': 'M292 272 H328',
  'app-ses': 'M66 112 V140 H156',
  'ses-inbox': 'M292 140 H328',
}

// step 0의 근거 개념에서 전달 조건과 제약만 가져와 다시 쓴 캡션이다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: 'SQS', caption: '메시지마다 한 소비자가 가져간다. 처리가 느려도 쌓아 두는 내구성 버퍼다.',
    nodes: ['app', 'queue', 'worker'], paths: ['app-queue', 'queue-worker'],
  },
  {
    id: 's2', label: 'SNS', caption: '모든 구독자에게 사본을 즉시 보내며, 쌓아 두는 버퍼 역할은 하지 않는다.',
    nodes: ['app', 'topic', 'subscribers'], paths: ['app-topic', 'topic-subscribers'],
  },
  {
    id: 's3', label: 'EventBridge', caption: '규칙에 맞는 이벤트만 보낸다. 순서 보장과 24시간 초과 보관은 하지 않는다.',
    nodes: ['aws-service', 'saas', 'bus', 'targets'], paths: ['aws-service-bus', 'saas-bus', 'bus-targets'],
  },
  {
    id: 's4', label: 'Amazon MQ', caption: '표준 프로토콜을 유지해, 앱의 메시징 방식을 바꾸지 않고 옮길 수 있다.',
    nodes: ['legacy-app', 'broker', 'legacy-consumer'], paths: ['legacy-app-broker', 'broker-legacy-consumer'],
  },
  {
    id: 's5', label: 'SES', caption: 'SNS도 알림을 보내지만, 이메일 발송이 목적이라면 SES를 고른다.',
    nodes: ['app', 'ses', 'inbox'], paths: ['app-ses', 'ses-inbox'],
  },
]

export function MessagingShapesDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-messaging-arrow`
  const wide = useWideDiagram()
  const layoutGroups = wide ? wideGroups : groups
  const layoutNodes = wide ? wideNodes.map((node) => ({ ...nodes.find(({ id }) => id === node.id)!, ...node })) : nodes
  const layoutPaths = wide ? widePaths : paths

  return (
    <DiagramFrame
      label="메시징 전달 모양 도식"
      idleCaption="서비스를 고르면 전달 모양의 차이와 선택 조건을 볼 수 있다."
      legend="파랑: AWS 관리 서비스 · 회색: 보내는 쪽과 받는 쪽"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className={wide ? 'w-full' : '-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0'}>
        <svg aria-label="메시징 전달 모양" className="block h-auto w-full" role="img" viewBox={wide ? '0 0 440 300' : '0 0 280 592'}>
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            {layoutGroups.map((group) => (
              <rect key={group.id} data-group={group.id} x={group.x} y={group.y} width={group.width} height={group.height} rx="4" />
            ))}
          </g>
          <g className="fill-muted" fontSize="9">
            {layoutGroups.map((group) => (
              <text key={group.id} x={group.labelX} y={group.labelY}>{groupLabels[group.id]}</text>
            ))}
          </g>

          {active?.paths.map((id) => (
            <path
              key={id}
              data-path={id}
              d={layoutPaths[id]}
              className="fill-none stroke-title"
              strokeWidth="2"
              strokeLinejoin="round"
              markerEnd={`url(#${arrowId})`}
            />
          ))}

          {layoutNodes.map((node) => (
            <g key={node.id} data-node={node.id} opacity={active && !active.nodes.includes(node.id) ? 0.25 : 1}>
              <rect className={`fill-panel ${node.color}`} x={node.x} y={node.y} width={node.width} height="32" rx="4" strokeWidth="1.5" />
              <text className="fill-title" x={node.x + node.width / 2} y={node.y + 16} dominantBaseline="central" textAnchor="middle" fontSize="10">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
