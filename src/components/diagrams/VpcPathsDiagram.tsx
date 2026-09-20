import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 이 도식 전용 고정 좌표다. 긴 라벨만 VPC 안의 한 줄 전체를 쓴다.
const nodes = [
  { id: 'internet', label: '인터넷', x: 24, y: 12, width: 108, color: 'stroke-disabled' },
  { id: 'onprem', label: '온프레미스', x: 148, y: 12, width: 108, color: 'stroke-disabled' },
  { id: 'lambda', label: 'Lambda 실행 환경', x: 24, y: 116, width: 108, color: 'stroke-diagram-managed' },
  { id: 'logs', label: 'CloudWatch Logs', x: 148, y: 116, width: 108, color: 'stroke-diagram-managed' },
  { id: 's3', label: 'S3', x: 148, y: 180, width: 108, color: 'stroke-diagram-managed' },
  { id: 'igw', label: '인터넷 게이트웨이', x: 24, y: 278, width: 108, color: 'stroke-disabled' },
  { id: 'vgw', label: '가상 프라이빗 게이트웨이', x: 24, y: 334, width: 232, color: 'stroke-disabled' },
  { id: 'alb', label: 'ALB', x: 24, y: 424, width: 108, color: 'stroke-diagram-resource' },
  { id: 'nat', label: 'NAT 게이트웨이', x: 148, y: 424, width: 108, color: 'stroke-diagram-resource' },
  { id: 'eni', label: 'Lambda ENI', x: 24, y: 532, width: 108, color: 'stroke-diagram-resource' },
  { id: 'ec2', label: 'EC2', x: 148, y: 532, width: 108, color: 'stroke-diagram-resource' },
  { id: 'efs', label: 'EFS 탑재 대상', x: 24, y: 590, width: 108, color: 'stroke-diagram-resource' },
  { id: 'rds', label: 'RDS', x: 148, y: 590, width: 108, color: 'stroke-diagram-resource' },
  { id: 'endpoint', label: 'S3 게이트웨이 엔드포인트', x: 24, y: 670, width: 232, color: 'stroke-disabled' },
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
}

// 사실 근거는 step 1에 지정된 개념 본문이다. 캡션은 그 사실을 짧게 다시 쓴다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: '사용자 → EC2', caption: '외부 접근을 허용하면 퍼블릭, 막으면 프라이빗 서브넷이다.',
    nodes: ['internet', 'igw', 'alb', 'ec2'], paths: ['internet-igw', 'igw-alb', 'alb-ec2'],
  },
  {
    id: 's2', label: 'Lambda → EC2', caption: '퍼블릭 배치로는 사설 EC2에 못 닿는다. 수신 보안 그룹의 소스는 상대 그룹 ID다.',
    nodes: ['lambda', 'eni', 'ec2'], paths: ['lambda-eni', 'eni-ec2'],
  },
  {
    id: 's3', label: '프라이빗 → 인터넷', caption: 'NAT 게이트웨이는 프라이빗에서 쓰지만 퍼블릭 서브넷에 둔다.',
    nodes: ['ec2', 'nat', 'igw', 'internet'], paths: ['ec2-nat', 'nat-igw', 'igw-internet'],
  },
  {
    id: 's4', label: 'VPC → S3', caption: '게이트웨이 엔드포인트는 무료다. S3에는 VPC·서브넷 배치도 보안 그룹도 없다.',
    nodes: ['ec2', 'endpoint', 's3'], paths: ['ec2-endpoint', 'endpoint-s3'],
  },
  {
    id: 's5', label: 'Lambda → 로그', caption: '로그가 없으면 로깅 설정보다 실행 역할의 쓰기 권한을 먼저 확인한다.',
    nodes: ['lambda', 'logs'], paths: ['lambda-logs'],
  },
  {
    id: 's6', label: 'Lambda → EFS', caption: '레이어 한도를 넘는 종속성을 재배포 없이 갱신한다. 전송은 TLS로 자동 암호화된다.',
    nodes: ['lambda', 'eni', 'efs'], paths: ['lambda-eni', 'eni-efs'],
  },
  {
    id: 's7', label: '온프레미스 → VPC', caption: '가상 프라이빗 게이트웨이는 VPC별로 붙으므로 VPC가 늘면 확장이 어렵다.',
    nodes: ['onprem', 'vgw', 'rds'], paths: ['onprem-vgw', 'vgw-rds'],
  },
]

export function VpcPathsDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-vpc-arrow`

  return (
    <DiagramFrame
      label="VPC 통신 경로 도식"
      idleCaption="경로를 고르면 통신 순서와 경계를 볼 수 있다."
      legend="파랑: AWS 관리 · 청록: 서브넷 자원 · 회색: 외부·연결 지점"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="VPC 통신 경로" className="block h-auto w-full" role="img" viewBox="0 0 280 740">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="region" x="4" y="68" width="272" height="664" rx="6" strokeDasharray="6 4" />
            <rect data-group="managed" x="12" y="90" width="256" height="142" rx="4" />
            <rect data-group="vpc" x="12" y="250" width="256" height="466" rx="6" strokeDasharray="6 4" />
            <rect data-group="public" x="18" y="398" width="244" height="86" rx="4" strokeDasharray="2 3" />
            <rect data-group="private" x="18" y="506" width="244" height="132" rx="4" strokeDasharray="2 3" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="14" y="82">리전</text>
            <text x="24" y="104">AWS 관리 영역</text>
            <text x="24" y="266">VPC</text>
            <text x="24" y="412">퍼블릭 서브넷</text>
            <text x="24" y="520">프라이빗 서브넷</text>
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
