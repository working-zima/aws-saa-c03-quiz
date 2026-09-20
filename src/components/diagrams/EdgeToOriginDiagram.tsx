import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 이 도식 전용 고정 좌표다. 뷰어 · 엣지 로케이션 · 리전 A · 리전 B · 리전 밖 순으로 내려온다.
// 두 리전은 280 폭에 나란히 들어가지 않으므로 세로로 쌓는다.
const nodes = [
  { id: 'viewer', label: '뷰어', x: 24, y: 12, width: 232, color: 'stroke-disabled' },
  { id: 'cf', label: 'CloudFront 배포', x: 12, y: 96, width: 172, color: 'stroke-diagram-managed' },
  { id: 'ga', label: 'Global Accelerator 고정 IP', x: 12, y: 144, width: 172, color: 'stroke-diagram-managed' },
  { id: 'route53', label: 'Route 53', x: 204, y: 96, width: 68, color: 'stroke-disabled' },
  { id: 'alb', label: 'ALB', x: 24, y: 236, width: 108, color: 'stroke-diagram-resource' },
  { id: 's3', label: 'S3 버킷', x: 148, y: 236, width: 108, color: 'stroke-diagram-managed' },
  { id: 'ec2', label: 'EC2', x: 24, y: 280, width: 108, color: 'stroke-diagram-resource' },
  { id: 'nlba', label: 'NLB (리전 A)', x: 148, y: 280, width: 108, color: 'stroke-diagram-resource' },
  { id: 'nlbb', label: 'NLB (리전 B)', x: 148, y: 364, width: 108, color: 'stroke-diagram-resource' },
  { id: 'onpremapi', label: '온프레미스 API', x: 24, y: 436, width: 232, color: 'stroke-disabled' },
]

// 세로 통로는 노드 상자를 피한다. 엣지 층은 x=198(Route 53 왼쪽), 리전 층은 x=264, 왼쪽은 x=8이다.
const paths: Record<string, string> = {
  'viewer-cf': 'M100 44 V96',
  'viewer-ga': 'M60 44 V56 H8 V160 H12',
  'cf-alb': 'M184 112 H198 V200 H78 V236',
  'alb-ec2': 'M78 268 V280',
  'cf-s3': 'M184 112 H198 V200 H202 V236',
  'cf-onpremapi': 'M184 112 H198 V200 H264 V452 H256',
  'ga-nlba': 'M184 160 H198 V200 H264 V296 H256',
  'ga-nlbb': 'M184 160 H198 V200 H264 V380 H256',
}

// 사실 근거는 step 3에 지정된 개념 본문이다. 캡션은 경로가 말하지 못하는 조건과 제약을 쓴다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: '엣지 캐시 적중',
    caption: 'TTL이 남은 동안은 엣지 사본으로 답하므로, 원본을 고쳐도 옛 파일이 나간다. 무효화해야 오리진까지 간다.',
    nodes: ['viewer', 'cf'], paths: ['viewer-cf'],
  },
  {
    id: 's2', label: 'ALB 오리진',
    caption: '동적 콘텐츠라고 지레 지울 서비스가 아니다. 지리 기반 라우팅은 보낼 곳만 정할 뿐 엣지에서 받아 주지 않는다.',
    nodes: ['viewer', 'cf', 'alb', 'ec2'], paths: ['viewer-cf', 'cf-alb', 'alb-ec2'],
  },
  {
    id: 's3', label: 'S3 오리진',
    caption: '내려받는 길만이 아니다. 올리는 길도 같은 배포로 열고, 버킷은 공개하지 않은 채 OAC로 CloudFront에만 닿게 둔다.',
    nodes: ['viewer', 'cf', 's3'], paths: ['viewer-cf', 'cf-s3'],
  },
  {
    id: 's4', label: '온프레미스 오리진',
    caption: '오리진은 AWS 밖 서버여도 된다. S3 오리진과 한 배포에 묶어 URL 패턴으로 가르면 진입점이 하나로 남는다.',
    nodes: ['viewer', 'cf', 'onpremapi'], paths: ['viewer-cf', 'cf-onpremapi'],
  },
  {
    id: 's5', label: 'Global Accelerator',
    caption: '로드 밸런서를 걷어내는 것이 아니라 앞에 세운다. 캐싱할 콘텐츠가 아니라 연결 자체를 빠르게 하는 쪽이다.',
    nodes: ['viewer', 'ga', 'nlba'], paths: ['viewer-ga', 'ga-nlba'],
  },
  {
    id: 's6', label: '리전 장애 조치',
    caption: '클라이언트가 보는 주소는 그대로고 경로만 AWS 안에서 바뀌어, Route 53으로 바꿀 때 생기는 DNS 캐시 대기가 없다.',
    nodes: ['viewer', 'ga', 'nlbb'], paths: ['viewer-ga', 'ga-nlbb'],
  },
]

export function EdgeToOriginDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-edge-arrow`

  return (
    <DiagramFrame
      label="엣지에서 오리진까지의 경로 도식"
      idleCaption="경로를 고르면 요청을 엣지에서 끝내는지 오리진까지 넘기는지 볼 수 있다."
      legend="파랑: AWS 관리 · 청록: 리전 안 자원 · 회색: 외부·DNS"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="엣지에서 오리진까지의 경로" className="block h-auto w-full" role="img" viewBox="0 0 280 480">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="edge" x="4" y="72" width="188" height="116" rx="6" strokeDasharray="6 4" />
            <rect data-group="region-a" x="4" y="212" width="272" height="108" rx="6" strokeDasharray="6 4" />
            <rect data-group="region-b" x="4" y="340" width="272" height="64" rx="6" strokeDasharray="6 4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="14" y="86">엣지 로케이션</text>
            <text x="14" y="226">리전 A</text>
            <text x="14" y="354">리전 B</text>
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
