import { useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['vpc-networking'].diagrams['vpc-destination']

// 목적지는 세로로 쌓고, 각 조건과 답은 한 줄 전체 폭의 두 줄 노드에 둔다.
const groups = [
  { id: 'internet', y: 8 },
  { id: 'services', y: 208 },
  { id: 'application', y: 408 },
  { id: 'vpcs', y: 608 },
]

const nodes = [
  { id: 'inet-ipv4', x: 20, y: 36, width: 240 },
  { id: 'inet-ipv6', x: 20, y: 88, width: 240 },
  { id: 'inet-both', x: 20, y: 140, width: 240 },
  { id: 'svc-gateway', x: 20, y: 236, width: 240 },
  { id: 'svc-interface', x: 20, y: 288, width: 240 },
  { id: 'svc-no-public', x: 20, y: 340, width: 240 },
  { id: 'app-private', x: 20, y: 436, width: 240 },
  { id: 'app-scope', x: 20, y: 488, width: 240 },
  { id: 'app-routing', x: 20, y: 540, width: 240 },
  { id: 'vpc-pair', x: 20, y: 636, width: 240 },
  { id: 'vpc-many', x: 20, y: 688, width: 240 },
  { id: 'vpc-isolated', x: 20, y: 740, width: 240 },
]

// 문구는 JSON에서 읽고 선택에 따른 노드 묶음만 여기서 정한다. 경로는 없다.
export const vpcDestinationScenarios: DiagramScenario[] = [
  { id: 'd1', nodes: ['inet-ipv4', 'inet-ipv6', 'inet-both'], paths: [] },
  { id: 'd2', nodes: ['svc-gateway', 'svc-interface', 'svc-no-public'], paths: [] },
  { id: 'd3', nodes: ['app-private', 'app-scope', 'app-routing'], paths: [] },
  { id: 'd4', nodes: ['vpc-pair', 'vpc-many', 'vpc-isolated'], paths: [] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function VpcDestinationDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)

  return (
    <DiagramFrame
      label={text.label}
      idleCaption={text.idleCaption}
      scenarios={vpcDestinationScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 800">
          {groups.map((group) => (
            <g key={group.id}>
              <rect data-group={group.id} className="fill-none stroke-disabled" x="8" y={group.y} width="264" height="184" rx="6" strokeWidth="1" />
              <text className="fill-muted" x="20" y={group.y + 14} fontSize="9">{text.groups?.[group.id]}</text>
            </g>
          ))}

          {nodes.map((node) => (
            <g key={node.id} data-node={node.id} opacity={active && !active.nodes.includes(node.id) ? 0.25 : 1}>
              <rect className="fill-panel stroke-disabled" x={node.x} y={node.y} width={node.width} height="44" rx="4" strokeWidth="1.5" />
              <text className="fill-muted" x={node.x + node.width / 2} y={node.y + 13} dominantBaseline="central" textAnchor="middle" fontSize="9">
                {text.nodeNotes?.[node.id]}
              </text>
              <text className="fill-title" x={node.x + node.width / 2} y={node.y + 31} dominantBaseline="central" textAnchor="middle" fontSize="10">
                {text.nodes[node.id]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
