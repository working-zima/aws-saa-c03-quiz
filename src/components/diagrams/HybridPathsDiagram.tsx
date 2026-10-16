import { useId, useState } from 'react'
import { useWideDiagram } from '../../hooks/useWideDiagram'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 그룹의 라벨과 선 모양은 두 배치가 함께 쓴다. 온프레미스·리전은 긴 점선, VPC는 잔 점선이다.
// 라벨은 두 배치 모두 박스 왼쪽 위(x + 10, y + 14)에 선다.
const groupLines: Record<string, { label: string, rx: number, dash: string }> = {
  'onprem-zone': { label: '온프레미스', rx: 6, dash: '6 4' },
  region: { label: '리전', rx: 6, dash: '6 4' },
  'vpc-a': { label: 'VPC A', rx: 4, dash: '2 3' },
  'vpc-b': { label: 'VPC B', rx: 4, dash: '2 3' },
}

const groups = [
  { id: 'onprem-zone', x: 4, y: 4, width: 164, height: 108 },
  { id: 'region', x: 4, y: 188, width: 272, height: 344 },
  { id: 'vpc-a', x: 12, y: 304, width: 256, height: 104 },
  { id: 'vpc-b', x: 12, y: 416, width: 256, height: 104 },
]

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

// 가로형도 온프레미스 · 인터넷과 전용선 층 · 리전 순으로 내려오고, 리전 안에서 두 VPC를 나란히 둔다.
// Transit Gateway와 Direct Connect Gateway는 리전 윗줄에 두 VPC 사이를 비우고 선다.
const wideGroups = [
  { id: 'onprem-zone', x: 4, y: 4, width: 264, height: 60 },
  { id: 'region', x: 4, y: 136, width: 432, height: 180 },
  { id: 'vpc-a', x: 12, y: 204, width: 200, height: 104 },
  { id: 'vpc-b', x: 228, y: 204, width: 200, height: 104 },
]

// 라벨과 색은 세로형 nodes에서 id로 가져온다.
const wideNodes = [
  { id: 'onprem', x: 12, y: 24, width: 128 },
  { id: 'cgw', x: 152, y: 24, width: 108 },
  { id: 'remote', x: 340, y: 24, width: 88 },
  { id: 'dxloc', x: 16, y: 84, width: 120 },
  { id: 'internet', x: 170, y: 84, width: 72 },
  { id: 'tgw', x: 168, y: 156, width: 104 },
  { id: 'dxgw', x: 288, y: 156, width: 140 },
  { id: 'vgwa', x: 20, y: 224, width: 184 },
  { id: 'vpca', x: 20, y: 264, width: 184 },
  { id: 'vgwb', x: 236, y: 224, width: 184 },
  { id: 'vpcb', x: 236, y: 264, width: 184 },
]

// 꺾이는 경로는 왼쪽 바깥 통로(x 8), 두 VPC 사이 통로(x 216·224), 오른쪽 바깥 통로(x 432),
// 인터넷 층 아래 띠(y 128)를 쓴다. 두 VPC를 잇는 경로는 여전히 없다.
const widePaths: Record<string, string> = {
  'onprem-cgw': 'M140 40 H152',
  'cgw-internet': 'M206 56 V84',
  'internet-vgwa': 'M206 116 V128 H140 V224',
  'onprem-dxloc': 'M76 56 V84',
  'dxloc-vgwa': 'M76 116 V224',
  'onprem-tgw': 'M12 40 H8 V172 H168',
  'dxloc-dxgw': 'M76 116 V128 H358 V156',
  'dxgw-tgw': 'M288 172 H272',
  'tgw-vpca': 'M216 188 V280 H204',
  'tgw-vpcb': 'M224 188 V280 H236',
  'remote-internet': 'M384 56 V100 H242',
  'internet-vpca': 'M206 116 V128 H8 V280 H20',
  'onprem-vgwa': 'M12 40 H8 V240 H20',
  'onprem-vgwb': 'M140 32 H146 V128 H432 V240 H420',
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
  const wide = useWideDiagram()
  const layoutGroups = wide ? wideGroups : groups
  const layoutNodes = wide ? wideNodes.map((node) => ({ ...nodes.find(({ id }) => id === node.id)!, ...node })) : nodes
  const layoutPaths = wide ? widePaths : paths

  return (
    <DiagramFrame
      label="온프레미스 연결 경로 도식"
      idleCaption="경로를 고르면 각 연결 방식이 어디로 들어와 무엇에 닿는지 볼 수 있다."
      legend="파랑: AWS 관리 · 청록: VPC 자원 · 회색: 외부·연결 지점"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className={wide ? 'w-full' : '-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0'}>
        <svg aria-label="온프레미스 연결 경로" className="block h-auto w-full" role="img" viewBox={wide ? '0 0 440 320' : '0 0 280 540'}>
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            {layoutGroups.map((group) => (
              <rect
                key={group.id}
                data-group={group.id}
                x={group.x}
                y={group.y}
                width={group.width}
                height={group.height}
                rx={groupLines[group.id].rx}
                strokeDasharray={groupLines[group.id].dash}
              />
            ))}
          </g>
          <g className="fill-muted" fontSize="9">
            {layoutGroups.map((group) => (
              <text key={group.id} x={group.x + 10} y={group.y + 14}>{groupLines[group.id].label}</text>
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
