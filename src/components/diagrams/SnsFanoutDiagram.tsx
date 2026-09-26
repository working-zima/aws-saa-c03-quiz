import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 전달 장치는 2열과 전체 폭 한 줄로 펴고, 짧은 큐·소비자 라벨은 각각 3열에 둔다.
const nodes = [
  { id: 'publisher', label: '발행하는 쪽', x: 84, y: 36, width: 112, color: 'stroke-disabled' },
  { id: 'topic', label: 'SNS 주제', x: 20, y: 204, width: 240, color: 'stroke-diagram-managed' },
  { id: 'shared-queue', label: '공유 큐 하나', x: 20, y: 140, width: 112, color: 'stroke-diagram-managed' },
  { id: 'bus', label: '이벤트 버스', x: 148, y: 140, width: 112, color: 'stroke-diagram-managed' },
  { id: 'queue-a', label: '큐 A', x: 20, y: 332, width: 72, color: 'stroke-diagram-managed' },
  { id: 'queue-b', label: '큐 B', x: 104, y: 332, width: 72, color: 'stroke-diagram-managed' },
  { id: 'queue-c', label: '큐 C', x: 188, y: 332, width: 72, color: 'stroke-diagram-managed' },
  { id: 'consumer-a', label: '소비자 A', x: 20, y: 452, width: 72, color: 'stroke-disabled' },
  { id: 'consumer-b', label: '소비자 B', x: 104, y: 452, width: 72, color: 'stroke-disabled' },
  { id: 'consumer-c', label: '소비자 C', x: 188, y: 452, width: 72, color: 'stroke-disabled' },
]

// 팬아웃 세 갈래의 출발점을 나눈다. 직접 전달은 바깥 통로와 큐 열 사이로 우회한다.
// 흐려진 노드도 통과하지 않고, 소비자별 큐 그룹과 그 라벨은 항상 남겨 둔다.
const paths: Record<string, string> = {
  'publisher-topic': 'M140 68 V96 H8 V188 H140 V204',
  'topic-queue-a': 'M100 236 V316 H56 V332',
  'topic-queue-b': 'M140 236 V332',
  'topic-queue-c': 'M180 236 V316 H224 V332',
  'queue-a-consumer-a': 'M56 364 V452',
  'queue-b-consumer-b': 'M140 364 V452',
  'queue-c-consumer-c': 'M224 364 V452',
  'publisher-shared-queue': 'M140 68 V96 H76 V140',
  'shared-queue-consumer-a': 'M20 156 H8 V440 H56 V452',
  'shared-queue-consumer-b': 'M76 172 V184 H16 V272 H98 V428 H140 V452',
  'shared-queue-consumer-c': 'M132 156 H140 V184 H272 V440 H224 V452',
  'publisher-bus': 'M140 68 V96 H204 V140',
  'bus-consumer-a': 'M148 156 H140 V184 H8 V440 H56 V452',
  'bus-consumer-b': 'M204 172 V192 H264 V272 H182 V428 H140 V452',
  'bus-consumer-c': 'M260 156 H272 V440 H224 V452',
}

// 근거 개념에서 세 구성의 전달 범위와 버퍼 유무를 가져와 캡션을 다시 쓴다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: '소비자마다 큐', caption: '큐마다 복제해 모두 전부 받는다. 소비자 추가 시 발행자·기존 소비자는 그대로다.',
    nodes: ['publisher', 'topic', 'queue-a', 'queue-b', 'queue-c', 'consumer-a', 'consumer-b', 'consumer-c'],
    paths: ['publisher-topic', 'topic-queue-a', 'topic-queue-b', 'topic-queue-c', 'queue-a-consumer-a', 'queue-b-consumer-b', 'queue-c-consumer-c'],
  },
  {
    id: 's2', label: '큐 하나를 셋이 폴링', caption: '메시지를 나눠 받아 각자 일부만 얻는다. 모두가 전부 받는 요구에는 맞지 않는다.',
    nodes: ['publisher', 'shared-queue', 'consumer-a', 'consumer-b', 'consumer-c'],
    paths: ['publisher-shared-queue', 'shared-queue-consumer-a', 'shared-queue-consumer-b', 'shared-queue-consumer-c'],
  },
  {
    id: 's3', label: '버스가 직접 호출', caption: '소비자별 내구성 버퍼 없이 여러 대상에 보낸다. 트래픽 급증은 흡수하지 못한다.',
    nodes: ['publisher', 'bus', 'consumer-a', 'consumer-b', 'consumer-c'],
    paths: ['publisher-bus', 'bus-consumer-a', 'bus-consumer-b', 'bus-consumer-c'],
  },
]

export function SnsFanoutDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-sns-fanout-arrow`

  return (
    <DiagramFrame
      label="SNS 팬아웃 구성 비교 도식"
      idleCaption="구성을 고르면 소비자마다 큐가 있는지와 같은 이벤트를 받는 조건을 볼 수 있다."
      legend="파랑: AWS 전달 장치·큐 · 회색: 발행하는 쪽·소비자"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="SNS 팬아웃 구성 비교" className="block h-auto w-full" role="img" viewBox="0 0 280 504">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="publishing" x="12" y="4" width="256" height="80" rx="4" />
            <rect data-group="delivery" x="12" y="108" width="256" height="152" rx="4" />
            <rect data-group="queues" x="12" y="284" width="256" height="104" rx="4" />
            <rect data-group="consumers" x="12" y="412" width="256" height="80" rx="4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="24" y="22">발행</text>
            <text x="24" y="126">전달 장치</text>
            <text x="24" y="302">소비자별 큐</text>
            <text x="24" y="430">소비자</text>
          </g>

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
