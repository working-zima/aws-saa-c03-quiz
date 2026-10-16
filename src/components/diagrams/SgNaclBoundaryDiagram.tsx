import { useId, useState } from 'react'
import { useWideDiagram } from '../../hooks/useWideDiagram'
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

// 경계의 선 색과 모서리는 두 배치가 함께 쓴다.
const groupLines: Record<string, { color: string, rx: number }> = {
  'nacl-boundary': { color: 'stroke-disabled', rx: 6 },
  'sg-boundary': { color: 'stroke-diagram-resource', rx: 4 },
}

const groups = [
  { id: 'nacl-boundary', x: 4, y: 4, width: 272, height: 126 },
  { id: 'sg-boundary', x: 16, y: 42, width: 248, height: 78 },
]

// 곁말의 글은 두 배치가 함께 쓴다. 세 축의 값은 각자의 경계 안에, 방향 표시는 왕복 그림 위에 선다.
const noteLabels: Record<string, string> = {
  'nacl-1': '서브넷 경계 = 네트워크 ACL',
  'nacl-2': 'IP만 · 허용과 차단 · 상태 비저장',
  'sg-1': '리소스 경계 = 보안 그룹',
  'sg-2': '리소스·IP · 허용만 · 상태 저장',
  'req-dir': '요청 방향',
  'res-dir': '응답 방향',
}

const notes = [
  { id: 'nacl-1', x: 12, y: 18 },
  { id: 'nacl-2', x: 12, y: 31 },
  { id: 'sg-1', x: 24, y: 56 },
  { id: 'sg-2', x: 24, y: 69 },
  { id: 'req-dir', x: 8, y: 160 },
  { id: 'res-dir', x: 144, y: 160 },
]

// 가로형은 경계 그림을 한 줄로 낮게 접고, 왕복을 두 줄로 편다.
// 세 축의 값은 경계 왼쪽 위에 두 줄씩 서고, 리소스 둘은 보안 그룹 경계의 오른쪽에 나란히 선다.
const wideGroups = [
  { id: 'nacl-boundary', x: 4, y: 4, width: 432, height: 94 },
  { id: 'sg-boundary', x: 16, y: 40, width: 408, height: 50 },
]

const wideNotes = [
  { id: 'nacl-1', x: 12, y: 18 },
  { id: 'nacl-2', x: 12, y: 31 },
  { id: 'sg-1', x: 24, y: 59 },
  { id: 'sg-2', x: 24, y: 72 },
  { id: 'req-dir', x: 88, y: 124 },
  { id: 'res-dir', x: 88, y: 224 },
]

// 윗줄이 요청(왼쪽 → 오른쪽), 아랫줄이 응답(오른쪽 → 왼쪽)이다.
// 바깥과 리소스는 두 줄을 잇는 높은 상자로, 세로형의 전체 폭 상자에 해당한다. 라벨과 색은 세로형 nodes에서 id로 가져온다.
const wideNodes = [
  { id: 'ec2', x: 200, y: 49, width: 96 },
  { id: 'rds', x: 312, y: 49, width: 96 },
  { id: 'outside', x: 8, y: 132, width: 56, height: 76 },
  { id: 'nacl-in', x: 88, y: 132, width: 104 },
  { id: 'sg-in', x: 216, y: 132, width: 128 },
  { id: 'resource', x: 368, y: 132, width: 64, height: 76 },
  { id: 'nacl-out', x: 88, y: 176, width: 104 },
  { id: 'sg-out', x: 216, y: 176, width: 128 },
]

// 이웃한 칸 사이의 빈틈을 곧게 건넌다. 어느 경로도 다른 노드 상자를 지나지 않는다.
const widePaths: Record<string, string> = {
  'outside-nacl-in': 'M64 148 H88',
  'nacl-in-sg-in': 'M192 148 H216',
  'sg-in-resource': 'M344 148 H368',
  'resource-sg-out': 'M368 192 H344',
  'sg-out-nacl-out': 'M216 192 H192',
  'nacl-out-outside': 'M88 192 H64',
}

// 노드 높이는 따로 적지 않으면 32다.
type BoundaryNode = (typeof nodes)[number] & { height?: number }
const nodeHeight = (node: BoundaryNode) => node.height ?? 32

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
  const wide = useWideDiagram()
  const layoutGroups = wide ? wideGroups : groups
  const layoutNotes = wide ? wideNotes : notes
  const layoutNodes: BoundaryNode[] = wide ? wideNodes.map((node) => ({ ...nodes.find(({ id }) => id === node.id)!, ...node })) : nodes
  const layoutPaths = wide ? widePaths : paths

  return (
    <DiagramFrame
      label="보안 그룹과 네트워크 ACL 경계 도식"
      idleCaption="네트워크 ACL은 서브넷을 통째로 감싸고, 보안 그룹은 서브넷에 매이지 않은 채 리소스 여럿을 묶어 감싼다."
      legend="청록: 보안 그룹과 그 안의 리소스 · 회색: 서브넷 경계와 바깥 · 점선: 규칙 없이 통과하는 칸"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className={wide ? 'w-full' : '-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0'}>
        <svg aria-label="보안 그룹과 네트워크 ACL 경계" className="block h-auto w-full" role="img" viewBox={wide ? '0 0 440 232' : '0 0 280 360'}>
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none" strokeWidth="1">
            {layoutGroups.map((group) => (
              <rect
                key={group.id}
                className={groupLines[group.id].color}
                data-group={group.id}
                x={group.x}
                y={group.y}
                width={group.width}
                height={group.height}
                rx={groupLines[group.id].rx}
              />
            ))}
          </g>
          <g className="fill-muted" fontSize="9">
            {layoutNotes.map((note) => (
              <text key={note.id} x={note.x} y={note.y}>{noteLabels[note.id]}</text>
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
              <rect
                className={`fill-panel ${node.color}`}
                x={node.x}
                y={node.y}
                width={node.width}
                height={nodeHeight(node)}
                rx="4"
                strokeWidth="1.5"
                strokeDasharray={active?.id === 'res' && node.id === 'sg-out' ? '4 3' : undefined}
              />
              <text className="fill-title" x={node.x + node.width / 2} y={node.y + nodeHeight(node) / 2} dominantBaseline="central" textAnchor="middle" fontSize="10">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
