import { useId, useState } from 'react'
import { useWideDiagram } from '../../hooks/useWideDiagram'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 그룹 라벨은 두 배치가 함께 쓴다.
const groupLabels: Record<string, string> = {
  queue: 'SQS 큐',
}

const groups = [
  { id: 'queue', x: 12, y: 84, width: 256, height: 136, labelX: 24, labelY: 102 },
]

// 대기·숨김 메시지만 점선 큐 안에 둔다. 소비자와 큐를 떠난 결과는 아래 두 열에 둔다.
const nodes = [
  { id: 'producer', label: '생산자', x: 20, y: 20, width: 112, color: 'stroke-disabled' },
  { id: 'waiting', label: '대기 중인 메시지', x: 20, y: 132, width: 112, color: 'stroke-diagram-managed' },
  { id: 'hidden', label: '숨겨진 메시지', x: 148, y: 132, width: 112, color: 'stroke-diagram-managed' },
  { id: 'consumer', label: '소비자', x: 20, y: 248, width: 112, color: 'stroke-disabled' },
  { id: 'deleted', label: '처리 후 삭제', x: 148, y: 248, width: 112, color: 'stroke-disabled' },
  { id: 'dlq', label: '데드레터 큐', x: 20, y: 344, width: 112, color: 'stroke-diagram-managed' },
  { id: 'expired', label: '보존 기간 만료', x: 148, y: 344, width: 112, color: 'stroke-disabled' },
]

// hide는 두 노드 사이, reappear는 큐 안 아래쪽 통로, take는 그 왼쪽의 수직선이다.
// 같은 수신의 두 결과(take·hide)를 분리하며, 재노출 화살표와 수신선의 접점도 나눈다.
const paths: Record<string, string> = {
  'enqueue': 'M76 52 V132',
  'take': 'M60 164 V248',
  'hide': 'M132 148 H148',
  'delete': 'M132 264 H148',
  'reappear': 'M204 164 V196 H108 V164',
  'to-dlq': 'M20 148 H8 V360 H20',
  'expire': 'M112 132 V116 H272 V360 H260',
}

// 가로형은 생산자 → 큐(대기 → 숨김)를 윗줄에, 큐를 떠난 결과 넷을 아랫줄에 둔다.
const wideGroups = [
  { id: 'queue', x: 100, y: 8, width: 224, height: 96, labelX: 112, labelY: 26 },
]

// 라벨과 색은 세로형 nodes에서 id로 가져온다.
const wideNodes = [
  { id: 'producer', x: 12, y: 40, width: 72 },
  { id: 'waiting', x: 112, y: 40, width: 104 },
  { id: 'hidden', x: 232, y: 40, width: 80 },
  { id: 'dlq', x: 12, y: 136, width: 84 },
  { id: 'consumer', x: 112, y: 136, width: 72 },
  { id: 'deleted', x: 200, y: 136, width: 84 },
  { id: 'expired', x: 300, y: 136, width: 96 },
]

// 재노출은 세로형처럼 큐 안 아래쪽 통로(y 88)로 돈다. 큐를 떠나는 to-dlq·expire는 큐와 아랫줄 사이(y 120)로
// 각자 왼쪽·오른쪽으로 갈라져 take의 세로선과 만나지 않는다.
const widePaths: Record<string, string> = {
  'enqueue': 'M84 56 H112',
  'take': 'M136 72 V136',
  'hide': 'M216 56 H232',
  'delete': 'M184 152 H200',
  'reappear': 'M272 72 V88 H200 V72',
  'to-dlq': 'M120 72 V120 H54 V136',
  'expire': 'M208 72 V120 H348 V136',
}

// 근거 개념의 조건·수치를 다시 쓴다. ≥는 가시성 타임아웃을 올릴 최소 기준이다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: '정상 처리', caption: '가져간 동안은 숨기며, 처리 완료만으로 지워지지 않아 삭제가 필요하다.',
    nodes: ['producer', 'waiting', 'hidden', 'consumer', 'deleted'], paths: ['enqueue', 'take', 'hide', 'delete'],
  },
  {
    id: 's2', label: '처리가 늦을 때', caption: '삭제 전 만료로 재처리. 가시성 타임아웃 ≥ 최대 처리 시간(Lambda: 함수 타임아웃).',
    nodes: ['waiting', 'hidden', 'consumer'], paths: ['take', 'hide', 'reappear'],
  },
  {
    id: 's3', label: '계속 실패할 때', caption: '실패해도 남아 재시도된다. 계속 실패하면 따로 모아 뒤의 메시지를 막지 않게 한다.',
    nodes: ['waiting', 'hidden', 'consumer', 'dlq'], paths: ['take', 'hide', 'reappear', 'to-dlq'],
  },
  {
    id: 's4', label: '아무도 안 꺼낼 때', caption: '보존은 최대 14일. 안 꺼내면 지워지며, 48시간 자동 삭제도 보존 설정만으로 된다.',
    nodes: ['producer', 'waiting', 'expired'], paths: ['enqueue', 'expire'],
  },
]

export function SqsMessageLifeDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-sqs-message-life-arrow`
  const wide = useWideDiagram()
  const layoutGroups = wide ? wideGroups : groups
  const layoutNodes = wide ? wideNodes.map((node) => ({ ...nodes.find(({ id }) => id === node.id)!, ...node })) : nodes
  const layoutPaths = wide ? widePaths : paths

  return (
    <DiagramFrame
      label="SQS 메시지 흐름 도식"
      idleCaption="상황을 고르면 메시지가 큐 안에 남는 때와 큐를 떠나는 조건을 볼 수 있다."
      legend="파랑: 큐의 대기·숨김 상태와 데드레터 큐 · 회색: 생산자·소비자·삭제 결과"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className={wide ? 'w-full' : '-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0'}>
        <svg aria-label="SQS 메시지의 자리와 이동" className="block h-auto w-full" role="img" viewBox={wide ? '0 0 440 176' : '0 0 280 396'}>
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            {layoutGroups.map((group) => (
              <rect key={group.id} data-group={group.id} x={group.x} y={group.y} width={group.width} height={group.height} rx="4" strokeDasharray="6 4" />
            ))}
          </g>
          {layoutGroups.map((group) => (
            <text key={group.id} className="fill-muted" x={group.labelX} y={group.labelY} fontSize="9">{groupLabels[group.id]}</text>
          ))}

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
