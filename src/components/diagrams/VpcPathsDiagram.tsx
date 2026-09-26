import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['vpc-networking'].diagrams['vpc-paths']

// 이 도식 전용 고정 좌표다. 긴 라벨만 VPC 안의 한 줄 전체를 쓴다.
const nodes = [
  { id: 'internet', x: 24, y: 12, width: 108, color: 'stroke-disabled' },
  { id: 'onprem', x: 148, y: 12, width: 108, color: 'stroke-disabled' },
  { id: 'lambda', x: 24, y: 116, width: 108, color: 'stroke-diagram-managed' },
  { id: 'logs', x: 148, y: 116, width: 108, color: 'stroke-diagram-managed' },
  { id: 's3', x: 148, y: 180, width: 108, color: 'stroke-diagram-managed' },
  { id: 'igw', x: 24, y: 278, width: 108, color: 'stroke-disabled' },
  { id: 'vgw', x: 24, y: 334, width: 232, color: 'stroke-disabled' },
  { id: 'alb', x: 24, y: 424, width: 108, color: 'stroke-diagram-resource' },
  { id: 'nat', x: 148, y: 424, width: 108, color: 'stroke-diagram-resource' },
  { id: 'eni', x: 24, y: 532, width: 108, color: 'stroke-diagram-resource' },
  { id: 'ec2', x: 148, y: 532, width: 108, color: 'stroke-diagram-resource' },
  { id: 'efs', x: 24, y: 590, width: 108, color: 'stroke-diagram-resource' },
  { id: 'rds', x: 148, y: 590, width: 108, color: 'stroke-diagram-resource' },
  { id: 'endpoint', x: 24, y: 670, width: 232, color: 'stroke-disabled' },
  { id: 'interface-endpoint', x: 24, y: 760, width: 232, color: 'stroke-diagram-resource' },
  { id: 'pl-endpoint', x: 24, y: 824, width: 232, color: 'stroke-diagram-resource' },
  { id: 'peering', x: 24, y: 928, width: 108, color: 'stroke-disabled' },
  { id: 'tgw', x: 148, y: 928, width: 108, color: 'stroke-disabled' },
  { id: 'other-app', x: 86, y: 1034, width: 108, color: 'stroke-diagram-resource' },
]

// 시나리오별 방향을 좌표에도 반영한다. 선은 다른 노드의 상자를 가로지르지 않는다.
const paths: Record<string, string> = {
  'internet-igw': 'M78 44 V52 H8 V270 H78 V278',
  'igw-alb': 'M78 310 V322 H20 V420 H78 V424',
  'alb-ec2': 'M78 456 V492 H202 V532',
  'lambda-eni': 'M78 148 V160 H16 V526 H78 V532',
  'eni-ec2': 'M132 548 H148',
  'ec2-nat': 'M202 532 V456',
  'nat-igw': 'M202 424 V386 H264 V294 H132',
  'igw-internet': 'M78 278 V270 H8 V52 H78 V44',
  'ec2-endpoint': 'M202 564 V578 H140 V670',
  'endpoint-s3': 'M256 686 H272 V196 H256',
  'lambda-logs': 'M132 132 H148',
  'eni-efs': 'M78 564 V590',
  'onprem-vgw': 'M202 44 V56 H272 V322 H140 V334',
  'vgw-rds': 'M256 350 H264 V652 H202 V622',
  'ec2-interface-endpoint': 'M202 564 V578 H22 V748 H140 V760',
  'interface-endpoint-logs': 'M256 776 H274 V132 H256',
  'ec2-pl-endpoint': 'M214 564 V580 H260 V808 H140 V824',
  'pl-endpoint-other-app': 'M140 856 V1034',
  // 피어링은 왼쪽, Transit Gateway는 오른쪽 통로와 별도 도착 지점을 쓴다.
  'ec2-peering': 'M190 564 V572 H22 V916 H78 V928',
  'peering-other-app': 'M78 960 V976 H122 V1034',
  'ec2-tgw': 'M256 548 H266 V916 H202 V928',
  'tgw-other-app': 'M202 960 V984 H158 V1034',
}

// 경로와 문구는 id로 짝을 맞춘다. 두 id 집합의 일치는 테스트가 검증한다.
export const vpcPathScenarios: DiagramScenario[] = [
  {
    id: 's1',
    nodes: ['internet', 'igw', 'alb', 'ec2'], paths: ['internet-igw', 'igw-alb', 'alb-ec2'],
  },
  {
    id: 's2',
    nodes: ['lambda', 'eni', 'ec2'], paths: ['lambda-eni', 'eni-ec2'],
  },
  {
    id: 's3',
    nodes: ['ec2', 'nat', 'igw', 'internet'], paths: ['ec2-nat', 'nat-igw', 'igw-internet'],
  },
  {
    id: 's4',
    nodes: ['ec2', 'endpoint', 's3'], paths: ['ec2-endpoint', 'endpoint-s3'],
  },
  {
    id: 's5',
    nodes: ['lambda', 'logs'], paths: ['lambda-logs'],
  },
  {
    id: 's6',
    nodes: ['lambda', 'eni', 'efs'], paths: ['lambda-eni', 'eni-efs'],
  },
  {
    id: 's7',
    nodes: ['onprem', 'vgw', 'rds'], paths: ['onprem-vgw', 'vgw-rds'],
  },
  {
    id: 's8',
    nodes: ['ec2', 'interface-endpoint', 'logs'], paths: ['ec2-interface-endpoint', 'interface-endpoint-logs'],
  },
  {
    id: 's9',
    nodes: ['ec2', 'pl-endpoint', 'other-app'], paths: ['ec2-pl-endpoint', 'pl-endpoint-other-app'],
  },
  {
    id: 's10',
    nodes: ['ec2', 'peering', 'other-app'], paths: ['ec2-peering', 'peering-other-app'],
  },
  {
    id: 's11',
    nodes: ['ec2', 'tgw', 'other-app'], paths: ['ec2-tgw', 'tgw-other-app'],
  },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function VpcPathsDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-vpc-arrow`

  return (
    <DiagramFrame
      label={text.label}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={vpcPathScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 1120">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="region" x="4" y="68" width="272" height="1044" rx="6" strokeDasharray="6 4" />
            <rect data-group="managed" x="12" y="90" width="256" height="142" rx="4" />
            <rect data-group="vpc" x="12" y="250" width="256" height="640" rx="6" strokeDasharray="6 4" />
            <rect data-group="public" x="18" y="398" width="244" height="86" rx="4" strokeDasharray="2 3" />
            <rect data-group="private" x="18" y="506" width="244" height="132" rx="4" strokeDasharray="2 3" />
            {/* 기존 경로를 보존하며 엔드포인트용 프라이빗 서브넷을 아래에 둔다. */}
            <rect data-group="private" x="18" y="718" width="244" height="156" rx="4" strokeDasharray="2 3" />
            <rect data-group="other-vpc" x="12" y="1000" width="256" height="88" rx="6" strokeDasharray="6 4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="14" y="82">{text.groups?.region}</text>
            <text x="24" y="104">{text.groups?.managed}</text>
            <text x="24" y="266">{text.groups?.vpc}</text>
            <text x="24" y="412">{text.groups?.public}</text>
            <text x="24" y="520">{text.groups?.private}</text>
            <text x="24" y="732">{text.groups?.private}</text>
            <text x="24" y="1014">{text.groups?.['other-vpc']}</text>
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
                {text.nodes[node.id]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
