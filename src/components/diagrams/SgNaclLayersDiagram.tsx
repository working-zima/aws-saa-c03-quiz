import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['security-groups-nacl'].diagrams['sg-nacl-layers']

// 왼쪽은 서브넷과 리소스의 층, 오른쪽은 서브넷 밖 WAF와 곁말이다.
const nodes = [
  { id: 'internet', x: 52, y: 8, width: 112, color: 'stroke-disabled' },
  { id: 'nacl-public', x: 52, y: 96, width: 112, color: 'stroke-disabled' },
  { id: 'alb', x: 52, y: 180, width: 112, color: 'stroke-diagram-resource' },
  { id: 'waf', x: 204, y: 180, width: 68, color: 'stroke-diagram-managed' },
  { id: 'nacl-private', x: 52, y: 312, width: 112, color: 'stroke-disabled' },
  { id: 'ec2', x: 52, y: 396, width: 112, color: 'stroke-diagram-resource' },
]

// 요청은 왼쪽 열을 따라 내려간다. WAF 연결은 검사 순서를 뜻하지 않아 이 맵에 넣지 않는다.
export const paths: Record<string, string> = {
  'internet-nacl-public': 'M108 40 V96',
  'nacl-public-alb': 'M108 128 V180',
  'alb-nacl-private': 'M108 212 V312',
  'nacl-private-ec2': 'M108 344 V396',
}

export const sgNaclLayersScenarios: DiagramScenario[] = [
  { id: 'flow', nodes: ['internet', 'nacl-public', 'alb', 'waf', 'nacl-private', 'ec2'], paths: ['internet-nacl-public', 'nacl-public-alb', 'alb-nacl-private', 'nacl-private-ec2'] },
  { id: 'waf', nodes: ['internet', 'alb', 'waf'], paths: ['internet-nacl-public', 'nacl-public-alb'] },
  { id: 'nacl', nodes: ['nacl-public', 'nacl-private'], paths: [] },
  { id: 'sg-ref', nodes: ['alb', 'ec2'], paths: ['alb-nacl-private', 'nacl-private-ec2'] },
  { id: 'block-ip', nodes: ['waf', 'nacl-public', 'nacl-private'], paths: [] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function SgNaclLayersDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-sgnacl-layers-arrow`
  const wafOpacity = active && !active.nodes.includes('waf') ? 0.25 : 1

  return (
    <DiagramFrame
      label={text.label}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={sgNaclLayersScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 464">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none" strokeWidth="1">
            <rect className="stroke-disabled" data-group="public" x="8" y="64" width="180" height="176" rx="6" />
            <rect className="stroke-diagram-resource" data-group="alb-sg" x="20" y="148" width="156" height="76" rx="4" />
            <rect className="stroke-disabled" data-group="private" x="8" y="280" width="180" height="176" rx="6" />
            <rect className="stroke-diagram-resource" data-group="ec2-sg" x="20" y="364" width="156" height="76" rx="4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="16" y="80">{text.groups!.public}</text>
            <text x="28" y="162">{text.groups!['alb-sg']}</text>
            <text x="16" y="296">{text.groups!.private}</text>
            <text x="28" y="378">{text.groups!['ec2-sg']}</text>
          </g>

          {/* 화살표 없이 부착 관계만 표시한다. WAF는 요청 경로에 포함하지 않는다. */}
          <line data-attachment="alb-waf" x1="164" y1="196" x2="204" y2="196" className="stroke-disabled" strokeWidth="1" opacity={wafOpacity} />
          <text data-note="waf-attach" x="204" y="228" className="fill-muted" fontSize="9">{text.notes!['waf-attach']}</text>
          <text data-note="sg-source" x="200" y="404" className="fill-muted" fontSize="9">
            {text.notes!['sg-source'].split('\n').map((line, index) => (
              <tspan key={index} x="200" dy={index === 0 ? 0 : 14}>{line}</tspan>
            ))}
          </text>

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
        </svg>
      </div>
    </DiagramFrame>
  )
}
