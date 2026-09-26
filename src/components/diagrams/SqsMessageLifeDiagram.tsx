import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

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

  return (
    <DiagramFrame
      label="SQS 메시지 흐름 도식"
      idleCaption="상황을 고르면 메시지가 큐 안에 남는 때와 큐를 떠나는 조건을 볼 수 있다."
      legend="파랑: 큐의 대기·숨김 상태와 데드레터 큐 · 회색: 생산자·소비자·삭제 결과"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="SQS 메시지의 자리와 이동" className="block h-auto w-full" role="img" viewBox="0 0 280 396">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="queue" x="12" y="84" width="256" height="136" rx="4" strokeDasharray="6 4" />
          </g>
          <text className="fill-muted" x="24" y="102" fontSize="9">SQS 큐</text>

          {active?.paths.map((id) => (
            <path
              key={id}
              data-path={id}
              d={paths[id]}
              className="fill-none stroke-title"
              strokeWidth="2"
              strokeLinejoin="round"
              markerEnd={`url(#${arrowId})`}
            />
          ))}

          {nodes.map((node) => (
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
