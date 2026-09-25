import { useId, useState } from 'react'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

// 버스 세 종류와 파이프는 전체 폭을 쓴다. 대상 안의 점선 VPC만 실제 네트워크 경계다.
const nodes = [
  { id: 'aws-service', label: 'AWS 서비스', x: 20, y: 36, width: 112, color: 'stroke-diagram-managed' },
  { id: 'my-app', label: '내 애플리케이션', x: 148, y: 36, width: 112, color: 'stroke-disabled' },
  { id: 'partner-saas', label: '외부 SaaS', x: 20, y: 92, width: 112, color: 'stroke-disabled' },
  { id: 'default-bus', label: '기본 이벤트 버스', x: 20, y: 196, width: 240, color: 'stroke-diagram-managed' },
  { id: 'custom-bus', label: '사용자 지정 이벤트 버스', x: 20, y: 252, width: 240, color: 'stroke-diagram-managed' },
  { id: 'partner-bus', label: '파트너 이벤트 버스', x: 20, y: 308, width: 240, color: 'stroke-diagram-managed' },
  { id: 'pattern-rule', label: '이벤트 패턴 규칙', x: 20, y: 412, width: 112, color: 'stroke-diagram-managed' },
  { id: 'schedule-rule', label: '일정 규칙', x: 148, y: 412, width: 112, color: 'stroke-diagram-managed' },
  { id: 'pipe-source', label: '큐·스트림', x: 148, y: 468, width: 112, color: 'stroke-diagram-managed' },
  { id: 'pipe', label: 'EventBridge 파이프', x: 20, y: 524, width: 240, color: 'stroke-diagram-managed' },
  { id: 'lambda', label: 'Lambda 함수', x: 20, y: 628, width: 112, color: 'stroke-diagram-managed' },
  { id: 'queue', label: 'SQS 큐', x: 148, y: 628, width: 112, color: 'stroke-diagram-managed' },
  { id: 'sfn', label: 'Step Functions', x: 20, y: 684, width: 112, color: 'stroke-diagram-managed' },
  { id: 'api-destination', label: 'API 대상', x: 148, y: 684, width: 112, color: 'stroke-diagram-managed' },
  { id: 'external-api', label: '외부 HTTP API', x: 148, y: 740, width: 112, color: 'stroke-disabled' },
  { id: 'vpc-lambda', label: 'VPC 연결 Lambda', x: 28, y: 828, width: 108, color: 'stroke-diagram-resource' },
  { id: 'private-api', label: '사설 API', x: 144, y: 828, width: 108, color: 'stroke-diagram-resource' },
]

// 전체 폭 버스·파이프를 통과하지 않도록 좌우 통로를 쓰고, 대상의 두 열 사이는 파이프 경로로 쓴다.
const paths: Record<string, string> = {
  'aws-service-default-bus': 'M76 68 V80 H140 V196',
  'my-app-custom-bus': 'M204 68 V80 H272 V240 H140 V252',
  'partner-saas-partner-bus': 'M76 124 V152 H8 V296 H140 V308',
  'default-bus-pattern-rule': 'M20 212 H8 V404 H76 V412',
  'custom-bus-pattern-rule': 'M20 268 H8 V404 H76 V412',
  'partner-bus-pattern-rule': 'M140 340 V404 H76 V412',
  'pattern-rule-lambda': 'M76 444 V456 H8 V620 H76 V628',
  'pattern-rule-queue': 'M76 444 V456 H272 V620 H204 V628',
  'schedule-rule-lambda': 'M204 444 V456 H8 V620 H76 V628',
  'pattern-rule-api-destination': 'M76 444 V456 H272 V672 H204 V684',
  'api-destination-external-api': 'M204 716 V740',
  'pattern-rule-vpc-lambda': 'M76 444 V456 H8 V820 H82 V828',
  'vpc-lambda-private-api': 'M136 844 H144',
  'pipe-source-pipe': 'M204 500 V512 H140 V524',
  'pipe-sfn': 'M140 556 V672 H76 V684',
}

// step 1이 지정한 근거 개념의 조건과 제약을 다시 쓴다. Step Functions는 파이프의 대상이다.
const scenarios: DiagramScenario[] = [
  {
    id: 's1', label: 'AWS 서비스 변경', caption: '계정별 기본 버스가 AWS 생성·수정 이벤트를 받아 폴링 없이 반응한다.',
    nodes: ['aws-service', 'default-bus', 'pattern-rule', 'lambda'], paths: ['aws-service-default-bus', 'default-bus-pattern-rule', 'pattern-rule-lambda'],
  },
  {
    id: 's2', label: '내 앱 이벤트', caption: '직접 만든 앱은 사용자 지정 버스를 만들어 이벤트를 게시한다.',
    nodes: ['my-app', 'custom-bus', 'pattern-rule', 'queue'], paths: ['my-app-custom-bus', 'custom-bus-pattern-rule', 'pattern-rule-queue'],
  },
  {
    id: 's3', label: '외부 SaaS', caption: '파트너 버스는 외부 SaaS용이다. 내 앱의 이벤트를 보내는 용도가 아니다.',
    nodes: ['partner-saas', 'partner-bus', 'pattern-rule', 'lambda'], paths: ['partner-saas-partner-bus', 'partner-bus-pattern-rule', 'pattern-rule-lambda'],
  },
  {
    id: 's4', label: '일정', caption: '시각·주기 기반이라 즉시 반응은 못 한다. 빈 확인도 유료고 최대 한 주기 늦는다.',
    nodes: ['schedule-rule', 'lambda'], paths: ['schedule-rule-lambda'],
  },
  {
    id: 's5', label: '외부 API로', caption: 'EventBridge가 인증 정보를 보관해 OAuth 호출에 별도 중계가 불필요하다.',
    nodes: ['pattern-rule', 'api-destination', 'external-api'], paths: ['pattern-rule-api-destination', 'api-destination-external-api'],
  },
  {
    id: 's6', label: 'VPC 안 API', caption: '인터넷 비공개는 VPC 연결 함수로 지킨다. 공용 로드 밸런서는 조건에 어긋난다.',
    nodes: ['pattern-rule', 'vpc-lambda', 'private-api'], paths: ['pattern-rule-vpc-lambda', 'vpc-lambda-private-api'],
  },
  {
    id: 's7', label: '파이프(점 대 점)', caption: '규칙은 여러 대상으로, 파이프는 일대일로 보낸다. 필터·변환도 함수 없이 된다.',
    nodes: ['pipe-source', 'pipe', 'sfn'], paths: ['pipe-source-pipe', 'pipe-sfn'],
  },
]

export function EventBridgeRoutingDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-eventbridge-arrow`

  return (
    <DiagramFrame
      label="EventBridge 이벤트 경로 도식"
      idleCaption="시나리오를 고르면 이벤트가 지나는 경로와 실행 조건을 볼 수 있다."
      legend="파랑: AWS 관리 서비스 · 청록: VPC 안 자원 · 회색: 내 앱·외부 시스템"
      scenarios={scenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="EventBridge 이벤트 경로" className="block h-auto w-full" role="img" viewBox="0 0 280 900">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="sources" x="12" y="4" width="256" height="136" rx="4" />
            <rect data-group="buses" x="12" y="164" width="256" height="192" rx="4" />
            <rect data-group="rules" x="12" y="380" width="256" height="192" rx="4" />
            <rect data-group="targets" x="12" y="596" width="256" height="292" rx="4" />
            <rect data-group="vpc" x="20" y="796" width="240" height="80" rx="6" strokeDasharray="6 4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="24" y="22">이벤트 소스</text>
            <text x="24" y="182">이벤트 버스</text>
            <text x="24" y="398">규칙</text>
            <text x="24" y="614">대상</text>
            <text x="28" y="814">VPC</text>
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
