import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['governance-iac'].diagrams['drift-scope']

// 계정 안을 스택과 스택 밖으로 나눈다. 그룹 경계는 시나리오와 무관하게 남긴다.
const groups = [
  { id: 'account', x: 4, y: 56, width: 272, height: 140 },
  { id: 'stack', x: 12, y: 80, width: 124, height: 108 },
  { id: 'outside', x: 144, y: 80, width: 124, height: 108 },
]

const nodes = [
  { id: 'template', x: 20, y: 8, width: 108, color: 'stroke-disabled' },
  { id: 'stack-a', x: 20, y: 102, width: 108, color: 'stroke-diagram-resource' },
  { id: 'stack-b', x: 20, y: 146, width: 108, color: 'stroke-diagram-resource' },
  { id: 'team-a', x: 152, y: 102, width: 108, color: 'stroke-diagram-resource' },
  { id: 'team-b', x: 152, y: 146, width: 108, color: 'stroke-diagram-resource' },
  { id: 'drift', x: 20, y: 236, width: 108, color: 'stroke-diagram-managed' },
  { id: 'config', x: 152, y: 236, width: 108, color: 'stroke-diagram-managed' },
]

// 아래 화살표는 리소스 개별 노드가 아니라 살피는 그룹의 아래 변에서 끝난다.
const paths: Record<string, string> = {
  'template-stack': 'M74 40 V102',
  'drift-stack': 'M74 236 V188',
  'config-stack': 'M180 236 V216 H104 V188',
  'config-outside': 'M206 236 V188',
}

const notes = [
  { id: 'not-seen', x: 260, y: 94, scenarios: ['drift'] },
  { id: 'all-resources', x: 268, y: 70, scenarios: ['config'] },
]

export const driftScopeScenarios: DiagramScenario[] = [
  { id: 'drift', nodes: ['template', 'stack-a', 'stack-b', 'drift'], paths: ['template-stack', 'drift-stack'] },
  { id: 'config', nodes: ['stack-a', 'stack-b', 'team-a', 'team-b', 'config'], paths: ['config-stack', 'config-outside'] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function DriftScopeDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-drift-scope-arrow`

  return (
    <DiagramFrame
      label={text.label}
      question={text.question}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={driftScopeScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 276">
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
            <text key={note.id} data-note={note.id} x={note.x} y={note.y} textAnchor="end" className="fill-muted" fontSize="9">
              {text.notes![note.id]}
            </text>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
