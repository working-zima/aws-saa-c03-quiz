import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 큐 안의 두 자리만 점선으로 묶는다. 소비자와 삭제·이동·만료 결과는 큐 밖에 둔다.
const nodes = [
  { id: 'producer', label: '생산자', x: 20, y: 20, width: 112, color: 'stroke-disabled' },
  { id: 'waiting', label: '대기 중인 메시지', x: 20, y: 140, width: 112, color: 'stroke-diagram-managed' },
  { id: 'hidden', label: '숨겨진 메시지', x: 148, y: 140, width: 112, color: 'stroke-diagram-managed' },
  { id: 'consumer', label: '소비자', x: 20, y: 276, width: 112, color: 'stroke-disabled' },
  { id: 'deleted', label: '처리 후 삭제', x: 20, y: 340, width: 112, color: 'stroke-disabled' },
  { id: 'dlq', label: '데드레터 큐', x: 148, y: 276, width: 112, color: 'stroke-diagram-managed' },
  { id: 'expired', label: '보존 기간 만료', x: 148, y: 340, width: 112, color: 'stroke-disabled' },
]

// take는 아래로, hide는 두 노드 사이로, reappear는 큐 안 위쪽 여백으로 분리한다.
// DLQ는 take 오른쪽으로, 만료는 왼쪽 외곽과 마지막 행 아래로 우회해 다른 노드를 피한다.
const paths: Record<string, string> = {
  'enqueue': 'M76 52 V140',
  'take': 'M76 172 V276',
  'hide': 'M132 156 H148',
  'delete': 'M76 308 V340',
  'reappear': 'M204 140 V120 H112 V140',
  'to-dlq': 'M112 172 V220 H204 V276',
  'expire': 'M20 156 H4 V392 H204 V372',
}

// 가시성·실패 재시도·보존 기간의 근거에서 조건과 수치만 가져와 다시 쓴 캡션이다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: '정상 처리', caption: '가져가면 잠시 숨는다. 처리 후 삭제해야 큐에서 사라진다.',
    nodes: ['producer', 'waiting', 'hidden', 'consumer', 'deleted'], paths: ['enqueue', 'take', 'hide', 'delete'],
  },
  {
    id: 's2', label: '처리가 늦을 때', caption: '삭제 전 만료면 재처리. 가시성 타임아웃 ≥ 최대 처리 시간(Lambda는 함수 타임아웃).',
    nodes: ['waiting', 'hidden', 'consumer'], paths: ['take', 'hide', 'reappear'],
  },
  {
    id: 's3', label: '계속 실패할 때', caption: '실패해도 남아 재시도된다. 계속 실패하면 따로 모아 뒤가 막히지 않게 한다.',
    nodes: ['waiting', 'hidden', 'consumer', 'dlq'], paths: ['take', 'hide', 'reappear', 'to-dlq'],
  },
  {
    id: 's4', label: '아무도 안 꺼낼 때', caption: '보존은 최대 14일. 안 꺼낸 메시지는 48시간 뒤 삭제하도록 설정할 수 있다.',
    nodes: ['producer', 'waiting', 'expired'], paths: ['enqueue', 'expire'],
  },
]

export function SqsMessageLifeDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-sqs-message-life-arrow`

  return (
    <DiagramFrame
      label="SQS 메시지 이동 도식"
      idleCaption="상황을 고르면 큐 안에서 메시지가 숨거나 다시 보이는 과정과 큐를 떠나는 조건을 볼 수 있다."
      legend="파랑: 큐의 메시지·데드레터 큐 · 회색: 생산자·소비자·삭제·만료"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="SQS 메시지의 이동" className="block h-auto w-full" role="img" viewBox="0 0 280 408">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <rect data-group="queue" className="fill-none stroke-disabled" x="12" y="84" width="256" height="160" rx="6" strokeWidth="1" strokeDasharray="6 4" />
          <text className="fill-muted" x="24" y="104" fontSize="9">SQS 큐</text>

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
