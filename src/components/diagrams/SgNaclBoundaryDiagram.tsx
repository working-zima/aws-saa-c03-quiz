import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 위쪽 경계 그림(y 4~130)과 아래쪽 왕복 그림(y 160~356)의 고정 좌표다.
// 왕복은 280 폭에 네 칸을 가로로 놓을 수 없어 세로로 세웠다. 왼쪽 열이 요청, 오른쪽 열이 응답이다.
const nodes = [
  { id: 'ec2', label: 'EC2', x: 24, y: 78, width: 112, color: 'stroke-diagram-resource' },
  { id: 'rds', label: 'RDS', x: 144, y: 78, width: 112, color: 'stroke-diagram-resource' },
  { id: 'outside', label: '바깥', x: 8, y: 168, width: 264, color: 'stroke-disabled' },
  { id: 'nacl-in', label: 'NACL 인바운드', x: 8, y: 220, width: 128, color: 'stroke-disabled' },
  { id: 'nacl-out', label: 'NACL 아웃바운드', x: 144, y: 220, width: 128, color: 'stroke-disabled' },
  { id: 'sg-in', label: '보안 그룹 인바운드', x: 8, y: 272, width: 128, color: 'stroke-diagram-resource' },
  { id: 'sg-out', label: '보안 그룹 아웃바운드', x: 144, y: 272, width: 128, color: 'stroke-diagram-resource' },
  { id: 'resource', label: '리소스', x: 8, y: 324, width: 264, color: 'stroke-diagram-resource' },
]

// 두 열의 가운데(x=72, x=208)를 따라 내려가고 올라온다. 어느 경로도 다른 노드 상자를 지나지 않는다.
const paths: Record<string, string> = {
  'outside-nacl-in': 'M72 200 V220',
  'nacl-in-sg-in': 'M72 252 V272',
  'sg-in-resource': 'M72 304 V324',
  'resource-sg-out': 'M208 324 V304',
  'sg-out-nacl-out': 'M208 272 V252',
  'nacl-out-outside': 'M208 220 V200',
}

// 경계 그림의 노드 둘은 어느 방향에서나 이 왕복의 끝점이라 시나리오에서 흐려지지 않는다.
const always = ['ec2', 'rds', 'outside', 'resource']

// 사실 근거는 security-group p0·p3, nacl p0, security-group-stateful-vs-nacl-stateless p0이다.
const scenarios: DiagramScenario[] = [
  {
    id: 'req', label: '들어오는 요청',
    caption: '네트워크 ACL은 기본 규칙이 양방향 허용이라 그냥 지나지만, 보안 그룹은 인바운드가 막힌 채 시작하므로 허용 규칙을 더해야 요청이 닿는다.',
    nodes: [...always, 'nacl-in', 'sg-in'],
    paths: ['outside-nacl-in', 'nacl-in-sg-in', 'sg-in-resource'],
  },
  {
    id: 'res', label: '그 응답',
    caption: '보안 그룹은 들어온 연결을 기억해 아웃바운드 규칙이 없어도 응답을 내보낸다. 네트워크 ACL은 기억하지 않아 나가는 방향에도 규칙이 있어야 한다.',
    nodes: [...always, 'sg-out', 'nacl-out'],
    paths: ['resource-sg-out', 'sg-out-nacl-out', 'nacl-out-outside'],
  },
]

export function SgNaclBoundaryDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-sgnacl-arrow`

  return (
    <DiagramFrame
      label="보안 그룹과 네트워크 ACL 경계 도식"
      idleCaption="네트워크 ACL은 서브넷을 통째로 감싸고, 보안 그룹은 서브넷에 매이지 않은 채 리소스 여럿을 묶어 감싼다."
      legend="청록: 보안 그룹과 그 안의 리소스 · 회색: 서브넷 경계와 바깥 · 점선: 규칙 없이 통과하는 칸"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="보안 그룹과 네트워크 ACL 경계" className="block h-auto w-full" role="img" viewBox="0 0 280 360">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none" strokeWidth="1">
            <rect className="stroke-disabled" data-group="nacl-boundary" x="4" y="4" width="272" height="126" rx="6" />
            <rect className="stroke-diagram-resource" data-group="sg-boundary" x="16" y="42" width="248" height="78" rx="4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="12" y="18">서브넷 경계 = 네트워크 ACL</text>
            <text x="12" y="31">IP만 · 허용과 차단 · 상태 비저장</text>
            <text x="24" y="56">리소스 경계 = 보안 그룹</text>
            <text x="24" y="69">리소스·IP · 허용만 · 상태 저장</text>
            <text x="8" y="160">요청 방향</text>
            <text x="144" y="160">응답 방향</text>
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
              <rect
                className={`fill-panel ${node.color}`}
                x={node.x}
                y={node.y}
                width={node.width}
                height="32"
                rx="4"
                strokeWidth="1.5"
                strokeDasharray={active?.id === 'res' && node.id === 'sg-out' ? '4 3' : undefined}
              />
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
