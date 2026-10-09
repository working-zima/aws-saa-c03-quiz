import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['governance-iac'].diagrams['control-timing']

// 위에서 아래로 배포 시점을 지나 만들어진 뒤에 이른다. 시간대 경계는 흐리지 않는다.
const groups = [
  { id: 'deploy-time', x: 4, y: 56, width: 272, height: 64 },
  { id: 'after', x: 4, y: 144, width: 272, height: 88 },
]

const nodes = [
  { id: 'request', x: 82, y: 8, width: 116, color: 'stroke-disabled' },
  { id: 'preventive', x: 12, y: 80, width: 116, color: 'stroke-diagram-managed' },
  { id: 'reject', x: 152, y: 80, width: 116, color: 'stroke-disabled' },
  { id: 'resource', x: 12, y: 168, width: 116, color: 'stroke-diagram-resource' },
  { id: 'detective', x: 152, y: 168, width: 116, color: 'stroke-diagram-managed' },
]

// 탐지 시 배포는 두 노드 사이(x 140)와 시간대 사이(y 132) 통로로 내려간다.
const paths: Record<string, string> = {
  'request-preventive': 'M110 40 V80',
  'preventive-reject': 'M128 96 H152',
  'request-resource': 'M140 40 V132 H70 V168',
  'detective-resource': 'M152 184 H128',
}

const notes = [
  { id: 'not-created', x: 70, y: 218, scenarios: ['preventive'] },
  { id: 'report-only', x: 210, y: 218, scenarios: ['detective'] },
  { id: 'exists-until-fixed', x: 70, y: 218, scenarios: ['auto-fix'] },
  { id: 'auto-fix', x: 210, y: 218, scenarios: ['auto-fix'] },
]

export const controlTimingScenarios: DiagramScenario[] = [
  { id: 'preventive', nodes: ['request', 'preventive', 'reject'], paths: ['request-preventive', 'preventive-reject'] },
  { id: 'detective', nodes: ['request', 'resource', 'detective'], paths: ['request-resource', 'detective-resource'] },
  // 자동 수정을 엮어도 리소스가 만들어지는 시점과 탐지 경로는 바뀌지 않는다.
  { id: 'auto-fix', nodes: ['request', 'resource', 'detective'], paths: ['request-resource', 'detective-resource'] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function ControlTimingDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-control-timing-arrow`

  return (
    <DiagramFrame
      label={text.label}
      question={text.question}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={controlTimingScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 240">
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
            <text key={note.id} data-note={note.id} x={note.x} y={note.y} textAnchor="middle" className="fill-muted" fontSize="9">
              {text.notes![note.id]}
            </text>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
