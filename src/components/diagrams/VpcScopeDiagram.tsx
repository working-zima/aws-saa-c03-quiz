import { visualsByTopicId } from '../../data'
import { DiagramFrame } from './DiagramFrame'

const text = visualsByTopicId['vpc-networking'].diagrams['vpc-scope']

// 바깥에서 안으로 그린다. 가용 영역 둘은 VPC 안에서 위아래로 쌓고, 서브넷은 두 열로 둔다.
const groups = [
  { id: 'region', x: 4, y: 4, width: 272, height: 364, dash: '6 4' },
  { id: 'vpc', x: 12, y: 72, width: 256, height: 284, dash: '6 4' },
  { id: 'az-a', x: 18, y: 140, width: 244, height: 96 },
  { id: 'az-b', x: 18, y: 248, width: 244, height: 96 },
  { id: 'public-a', x: 24, y: 162, width: 112, height: 64, dash: '2 3' },
  { id: 'public-b', x: 24, y: 270, width: 112, height: 64, dash: '2 3' },
  { id: 'private-a', x: 144, y: 162, width: 112, height: 64, dash: '2 3' },
  { id: 'private-b', x: 144, y: 270, width: 112, height: 64, dash: '2 3' },
]

// 존재 단위는 위치로 말한다. S3는 VPC 밖, 인터넷 게이트웨이는 가용 영역 밖, NAT는 가용 영역마다 안.
const nodes = [
  { id: 's3', x: 24, y: 26, width: 108, color: 'stroke-diagram-managed' },
  { id: 'igw', x: 24, y: 96, width: 108, color: 'stroke-disabled' },
  { id: 'nat-a', x: 30, y: 184, width: 100, color: 'stroke-diagram-resource' },
  { id: 'nat-b', x: 30, y: 292, width: 100, color: 'stroke-diagram-resource' },
  { id: 'ec2-a', x: 150, y: 184, width: 100, color: 'stroke-diagram-resource' },
  { id: 'ec2-b', x: 150, y: 292, width: 100, color: 'stroke-diagram-resource' },
]

const noop = () => {}

export function VpcScopeDiagram() {
  return (
    <DiagramFrame label={text.label} idleCaption={text.idleCaption} legend={text.legend} active={null} onSelect={noop}>
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 372">
          <g className="fill-none stroke-disabled" strokeWidth="1">
            {groups.map((group) => (
              <rect key={group.id} data-group={group.id} x={group.x} y={group.y} width={group.width} height={group.height} rx="4" strokeDasharray={group.dash} />
            ))}
          </g>
          <g className="fill-muted" fontSize="9">
            {groups.map((group) => (
              <text key={group.id} data-group-label={group.id} x={group.x + 10} y={group.y + 14}>{text.groups?.[group.id]}</text>
            ))}
          </g>

          {nodes.map((node) => (
            <g key={node.id} data-node={node.id} opacity={1}>
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
