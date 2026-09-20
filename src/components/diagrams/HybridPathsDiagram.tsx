import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 이 도식 전용 고정 좌표다. 온프레미스 · 인터넷과 전용선 층 · 리전 순으로 내려온다.
const nodes = [
  { id: 'onprem', label: '온프레미스 데이터 센터', x: 12, y: 24, width: 148, color: 'stroke-disabled' },
  { id: 'remote', label: '원격 사용자', x: 180, y: 24, width: 76, color: 'stroke-disabled' },
  { id: 'cgw', label: 'Customer Gateway', x: 12, y: 68, width: 148, color: 'stroke-disabled' },
  { id: 'internet', label: '인터넷', x: 24, y: 132, width: 96, color: 'stroke-disabled' },
  { id: 'dxloc', label: 'Direct Connect 위치', x: 132, y: 132, width: 124, color: 'stroke-disabled' },
  { id: 'dxgw', label: 'Direct Connect Gateway', x: 24, y: 212, width: 232, color: 'stroke-diagram-managed' },
  { id: 'tgw', label: 'Transit Gateway', x: 24, y: 256, width: 232, color: 'stroke-diagram-managed' },
  { id: 'vgwa', label: '가상 프라이빗 게이트웨이 (VPC A)', x: 24, y: 324, width: 232, color: 'stroke-diagram-resource' },
  { id: 'vpca', label: 'VPC A 자원', x: 24, y: 364, width: 232, color: 'stroke-diagram-resource' },
  { id: 'vgwb', label: '가상 프라이빗 게이트웨이 (VPC B)', x: 24, y: 436, width: 232, color: 'stroke-diagram-resource' },
  { id: 'vpcb', label: 'VPC B 자원', x: 24, y: 476, width: 232, color: 'stroke-diagram-resource' },
]

// 세로 경로는 노드 상자를 피해 좌우 여백(x=8, x=272)을 지난다. 두 VPC를 잇는 경로는 없다.
const paths: Record<string, string> = {
  'onprem-cgw': 'M86 56 V68',
  'cgw-internet': 'M86 100 V116 H72 V132',
  'internet-vgwa': 'M72 164 V176 H8 V340 H24',
  'onprem-dxloc': 'M140 56 V60 H174 V124 H194 V132',
  'dxloc-vgwa': 'M194 164 V176 H272 V340 H256',
  'onprem-tgw': 'M12 40 H8 V272 H24',
  'dxloc-dxgw': 'M194 164 V212',
  'dxgw-tgw': 'M140 244 V256',
  'tgw-vpca': 'M60 288 V296 H8 V380 H24',
  'tgw-vpcb': 'M220 288 V296 H272 V492 H256',
  'remote-internet': 'M218 56 V116 H72 V132',
  'internet-vpca': 'M72 164 V176 H8 V380 H24',
  'onprem-vgwa': 'M12 40 H8 V340 H24',
  'onprem-vgwb': 'M160 40 H174 V124 H272 V452 H256',
}

// 사실 근거는 step 2에 지정된 개념 본문이다. 캡션은 그림이 말하지 못하는 조건과 제약을 쓴다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: 'Site-to-Site VPN',
    caption: '인터넷을 지나지만 구간이 암호화된다. AWS 쪽 끝점이 VPC마다 하나씩이라 VPC가 늘면 관리가 어렵다.',
    nodes: ['onprem', 'cgw', 'internet', 'vgwa'], paths: ['onprem-cgw', 'cgw-internet', 'internet-vgwa'],
  },
  {
    id: 's2', label: 'Direct Connect',
    caption: '전용선이라 인터넷을 지나지 않는 대신 암호화는 해 주지 않는다. 암호화가 요구면 VPN 쪽이다.',
    nodes: ['onprem', 'dxloc', 'vgwa'], paths: ['onprem-dxloc', 'dxloc-vgwa'],
  },
  {
    id: 's3', label: 'Transit Gateway',
    caption: '여러 VPC와 온프레미스를 허브 하나에 붙여 묶는다. VPC가 늘어도 새로 붙일 자리는 이 하나다.',
    nodes: ['onprem', 'tgw', 'vpca', 'vpcb'], paths: ['onprem-tgw', 'tgw-vpca', 'tgw-vpcb'],
  },
  {
    id: 's4', label: 'Direct Connect Gateway',
    caption: '일관되게 낮은 지연과 수백 개 VPC 연결이 함께 필요할 때 쓴다. 회선은 트랜짓 VIF로 붙인다.',
    nodes: ['onprem', 'dxloc', 'dxgw', 'tgw', 'vpca', 'vpcb'],
    paths: ['onprem-dxloc', 'dxloc-dxgw', 'dxgw-tgw', 'tgw-vpca', 'tgw-vpcb'],
  },
  {
    id: 's5', label: 'Client VPN',
    caption: '기기 한 대를 VPC 안으로 들여보내는 길이다. 데이터 센터 전체를 잇는 요구에는 맞지 않는다.',
    nodes: ['remote', 'internet', 'vpca'], paths: ['remote-internet', 'internet-vpca'],
  },
  {
    id: 's6', label: 'VPC마다 따로 맺는 VPN',
    caption: '양쪽 라우팅 테이블에 사무실로 가는 경로만 둔다. VPC끼리 가는 길이 아예 없어서 격리된다.',
    nodes: ['onprem', 'vgwa', 'vgwb'], paths: ['onprem-vgwa', 'onprem-vgwb'],
  },
]

export function HybridPathsDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-hybrid-arrow`

  return (
    <DiagramFrame
      label="온프레미스 연결 경로 도식"
      idleCaption="경로를 고르면 각 연결 방식이 어디로 들어와 무엇에 닿는지 볼 수 있다."
      legend="파랑: AWS 관리 · 청록: VPC 자원 · 회색: 외부·연결 지점"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="온프레미스 연결 경로" className="block h-auto w-full" role="img" viewBox="0 0 280 540">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="onprem-zone" x="4" y="4" width="164" height="108" rx="6" strokeDasharray="6 4" />
            <rect data-group="region" x="4" y="188" width="272" height="344" rx="6" strokeDasharray="6 4" />
            <rect data-group="vpc-a" x="12" y="304" width="256" height="104" rx="4" strokeDasharray="2 3" />
            <rect data-group="vpc-b" x="12" y="416" width="256" height="104" rx="4" strokeDasharray="2 3" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="14" y="18">온프레미스</text>
            <text x="14" y="202">리전</text>
            <text x="22" y="318">VPC A</text>
            <text x="22" y="430">VPC B</text>
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
