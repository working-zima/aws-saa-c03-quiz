import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId.route53.diagrams['alias-record']

const nodes = [
  { id: 'record', x: 32, y: 8, width: 112, color: 'stroke-diagram-managed' },
  { id: 'alb', x: 32, y: 88, width: 112, color: 'stroke-diagram-resource' },
  { id: 'ec2', x: 148, y: 180, width: 100, color: 'stroke-diagram-resource' },
  { id: 'ec2-new', x: 24, y: 180, width: 100, color: 'stroke-diagram-resource' },
]

// 공용 IP 직접 연결은 오른쪽 통로(x 264)로 내려가 EC2 오른쪽에 닿는다.
export const paths: Record<string, string> = {
  'record-alb': 'M88 40 V88',
  'alb-ec2': 'M88 120 V136 H198 V180',
  'alb-ec2-new': 'M88 120 V136 H74 V180',
  'record-ec2': 'M144 24 H264 V196 H248',
}

const notes = [
  { id: 'replaced', x: 198, y: 232, scenarios: ['replace'] },
  { id: 'record-same', x: 194, y: 56, scenarios: ['replace'] },
  { id: 'record-edit', x: 194, y: 56, scenarios: ['direct-ip'] },
  // 본문 예시 IP. EC2 아래 대상 그룹 안에 두며, 같은 자리의 replaced와 시나리오가 달라 겹치지 않는다.
  { id: 'public-ip', x: 198, y: 232, scenarios: ['direct-ip'] },
]

export const route53AliasScenarios: DiagramScenario[] = [
  { id: 'alias', nodes: ['record', 'alb', 'ec2'], paths: ['record-alb', 'alb-ec2'] },
  { id: 'replace', nodes: ['record', 'alb', 'ec2-new'], paths: ['record-alb', 'alb-ec2-new'] },
  { id: 'direct-ip', nodes: ['record', 'ec2'], paths: ['record-ec2'] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function Route53AliasDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-route53-alias-arrow`

  return (
    <DiagramFrame
      label={text.label}
      question={text.question}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={route53AliasScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 256">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <rect data-group="tg" className="fill-none stroke-diagram-resource" x="8" y="148" width="264" height="100" rx="6" strokeWidth="1" />
          <text x="16" y="164" className="fill-muted" fontSize="9">{text.groups!.tg}</text>

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
