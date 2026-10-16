import { useId, useState } from 'react'
import { useWideDiagram } from '../../hooks/useWideDiagram'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 그룹 라벨은 두 배치가 함께 쓰고, 자리는 두 배치 모두 박스 왼쪽 위에서 x + 12, y + 18이다.
const groupLabels: Record<string, string> = {
  publishing: '발행', delivery: '전달 장치', queues: '소비자별 큐', consumers: '소비자',
}

const groups = [
  { id: 'publishing', x: 12, y: 4, width: 256, height: 80 },
  { id: 'delivery', x: 12, y: 108, width: 256, height: 152 },
  { id: 'queues', x: 12, y: 284, width: 256, height: 104 },
  { id: 'consumers', x: 12, y: 412, width: 256, height: 80 },
]

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

// 가로형도 네 단을 위에서 아래로 쌓고, 단 안에서 노드를 넓게 편다. 큐와 그 소비자는 같은 열이라 큐 → 소비자가 곧은 세로선이다.
const wideGroups = [
  { id: 'publishing', x: 20, y: 4, width: 400, height: 60 },
  { id: 'delivery', x: 20, y: 80, width: 400, height: 64 },
  { id: 'queues', x: 20, y: 160, width: 400, height: 64 },
  { id: 'consumers', x: 20, y: 240, width: 400, height: 64 },
]

// 라벨과 색은 세로형 nodes에서 id로 가져온다. 공유 큐는 왼쪽, 이벤트 버스는 오른쪽이다.
const wideNodes = [
  { id: 'publisher', x: 172, y: 24, width: 96 },
  { id: 'shared-queue', x: 28, y: 104, width: 96 },
  { id: 'topic', x: 172, y: 104, width: 96 },
  { id: 'bus', x: 316, y: 104, width: 96 },
  { id: 'queue-a', x: 48, y: 184, width: 56 },
  { id: 'queue-b', x: 192, y: 184, width: 56 },
  { id: 'queue-c', x: 336, y: 184, width: 56 },
  { id: 'consumer-a', x: 28, y: 264, width: 96 },
  { id: 'consumer-b', x: 172, y: 264, width: 96 },
  { id: 'consumer-c', x: 316, y: 264, width: 96 },
]

// 직접 전달은 그룹 밖 좌우 통로(x 8·14, 426·432), 소비자 줄 아래(y 312), 큐 사이(x 148·292)로 돈다.
// 소비자 셋에게 가는 경로는 각자 다른 변으로 들어가 같은 시나리오 안에서 겹치지 않는다.
// topic-queue-a는 큐 단 라벨을 비켜 큐 A 위 변의 x 96으로 들어간다.
const widePaths: Record<string, string> = {
  'publisher-topic': 'M220 56 V104',
  'topic-queue-a': 'M196 136 V152 H96 V184',
  'topic-queue-b': 'M220 136 V184',
  'topic-queue-c': 'M244 136 V152 H364 V184',
  'queue-a-consumer-a': 'M76 216 V264',
  'queue-b-consumer-b': 'M220 216 V264',
  'queue-c-consumer-c': 'M364 216 V264',
  'publisher-shared-queue': 'M172 40 H96 V104',
  'shared-queue-consumer-a': 'M28 126 H14 V280 H28',
  'shared-queue-consumer-b': 'M124 120 H148 V280 H172',
  'shared-queue-consumer-c': 'M28 112 H8 V312 H364 V296',
  'publisher-bus': 'M268 40 H364 V104',
  'bus-consumer-a': 'M412 112 H432 V312 H76 V296',
  'bus-consumer-b': 'M316 120 H292 V280 H268',
  'bus-consumer-c': 'M412 126 H426 V280 H412',
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
  const wide = useWideDiagram()
  const layoutGroups = wide ? wideGroups : groups
  const layoutNodes = wide ? wideNodes.map((node) => ({ ...nodes.find(({ id }) => id === node.id)!, ...node })) : nodes
  const layoutPaths = wide ? widePaths : paths

  return (
    <DiagramFrame
      label="SNS 팬아웃 구성 비교 도식"
      idleCaption="구성을 고르면 소비자마다 큐가 있는지와 같은 이벤트를 받는 조건을 볼 수 있다."
      legend="파랑: AWS 전달 장치·큐 · 회색: 발행하는 쪽·소비자"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className={wide ? 'w-full' : '-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0'}>
        <svg aria-label="SNS 팬아웃 구성 비교" className="block h-auto w-full" role="img" viewBox={wide ? '0 0 440 320' : '0 0 280 504'}>
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
              <text key={group.id} x={group.x + 12} y={group.y + 18}>{groupLabels[group.id]}</text>
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
