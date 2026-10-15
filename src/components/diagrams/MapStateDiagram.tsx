import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['api-gateway-step-functions'].diagrams['map-state']

// 왼쪽은 반복문이 함수 안에, 오른쪽은 반복이 상태 머신에 있다. 그룹 경계는 시나리오와 무관하게 남긴다.
const groups = [
  { id: 'one-function', x: 4, y: 56, width: 132, height: 64 },
  { id: 'machine', x: 144, y: 56, width: 132, height: 64 },
]

// 함수 셋은 여러 번 부른다는 그림의 약속이다. 항목 수나 병렬도를 뜻하지 않는다.
const nodes = [
  { id: 'list', x: 82, y: 8, width: 116, color: 'stroke-disabled' },
  { id: 'loop', x: 12, y: 80, width: 116, color: 'stroke-disabled' },
  { id: 'map', x: 152, y: 80, width: 116, color: 'stroke-diagram-managed' },
  { id: 'loop-fn-1', x: 12, y: 152, width: 36, color: 'stroke-diagram-managed' },
  { id: 'loop-fn-2', x: 52, y: 152, width: 36, color: 'stroke-diagram-managed' },
  { id: 'loop-fn-3', x: 92, y: 152, width: 36, color: 'stroke-diagram-managed' },
  { id: 'map-fn-1', x: 152, y: 152, width: 36, color: 'stroke-diagram-managed' },
  { id: 'map-fn-2', x: 192, y: 152, width: 36, color: 'stroke-diagram-managed' },
  { id: 'map-fn-3', x: 232, y: 152, width: 36, color: 'stroke-diagram-managed' },
]

// Map 상태로 가는 경로는 목록의 오른쪽 변에서 나와 그룹 라벨 오른쪽(x 230)으로 내려간다.
const paths: Record<string, string> = {
  'list-loop': 'M100 40 V80',
  'list-map': 'M198 24 H230 V80',
  'loop-fn-1': 'M30 112 V152',
  'loop-fn-2': 'M70 112 V152',
  'loop-fn-3': 'M110 112 V152',
  'map-fn-1': 'M170 112 V152',
  'map-fn-2': 'M210 112 V152',
  'map-fn-3': 'M250 112 V152',
}

const notes = [
  { id: 'time-limit', x: 70, y: 200, textAnchor: 'middle' as const, scenarios: ['loop'] },
  { id: 'per-item', x: 210, y: 200, textAnchor: 'middle' as const, scenarios: ['map'] },
]

export const mapStateScenarios: DiagramScenario[] = [
  {
    id: 'loop',
    nodes: ['list', 'loop', 'loop-fn-1', 'loop-fn-2', 'loop-fn-3'],
    paths: ['list-loop', 'loop-fn-1', 'loop-fn-2', 'loop-fn-3'],
  },
  {
    id: 'map',
    nodes: ['list', 'map', 'map-fn-1', 'map-fn-2', 'map-fn-3'],
    paths: ['list-map', 'map-fn-1', 'map-fn-2', 'map-fn-3'],
  },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function MapStateDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-map-state-arrow`

  return (
    <DiagramFrame
      label={text.label}
      question={text.question}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={mapStateScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 212">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            {groups.map((group) => (
              <rect key={group.id} data-group={group.id} x={group.x} y={group.y} width={group.width} height={group.height} rx="4" />
            ))}
          </g>
          {groups.map((group) => (
            <text key={group.id} data-group-label={group.id} x={group.x + 10} y={group.y + 14} className="fill-muted" fontSize="9">
              {text.groups?.[group.id]}
            </text>
          ))}

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
                {text.nodes[node.id]}
              </text>
            </g>
          ))}

          {active && notes.filter((note) => note.scenarios.includes(active.id)).map((note) => (
            <text key={note.id} data-note={note.id} x={note.x} y={note.y} textAnchor={note.textAnchor} className="fill-muted" fontSize="9">
              {text.notes![note.id]}
            </text>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
