import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['backup-disaster-recovery'].diagrams['backup-flow']

// 그룹은 백업의 단계다. VPC 계층이 없으므로 관리 기능만 파랑으로 구별한다.
// 긴 조직 정책·감사 라벨은 축약하지 않고 한 줄 전체 폭을 쓴다.
const nodes = [
  { id: 'org-policy', x: 20, y: 12, width: 240, color: 'stroke-diagram-managed' },
  { id: 'ec2', x: 20, y: 100, width: 112, color: 'stroke-disabled' },
  { id: 'ebs', x: 148, y: 100, width: 112, color: 'stroke-disabled' },
  { id: 'rds', x: 20, y: 156, width: 112, color: 'stroke-disabled' },
  { id: 'dynamodb', x: 148, y: 156, width: 112, color: 'stroke-disabled' },
  { id: 's3', x: 20, y: 212, width: 112, color: 'stroke-disabled' },
  { id: 'plan', x: 20, y: 316, width: 112, color: 'stroke-diagram-managed' },
  { id: 'restore-test', x: 148, y: 316, width: 112, color: 'stroke-diagram-managed' },
  { id: 'audit', x: 20, y: 388, width: 240, color: 'stroke-diagram-managed' },
  { id: 'other-region', x: 20, y: 492, width: 112, color: 'stroke-disabled' },
  { id: 'other-account', x: 148, y: 492, width: 112, color: 'stroke-disabled' },
]

// 좌우 바깥 통로와 열 사이 틈을 써서 노드·그룹 라벨을 지나지 않는다.
// 사본은 백업 계획에서 직접 나가고, 대상 지정은 EC2에서만 시작한다.
const paths: Record<string, string> = {
  'rds-plan': 'M76 188 V200 H140 V332 H132',
  'dynamodb-plan': 'M204 188 V200 H140 V332 H132',
  'ec2-plan': 'M20 116 H4 V332 H20',
  'org-policy-plan': 'M260 28 H276 V272 H140 V332 H132',
  's3-plan': 'M20 228 H4 V332 H20',
  'plan-other-region': 'M76 348 V360 H4 V508 H20',
  'plan-other-account': 'M76 348 V360 H276 V508 H260',
  'plan-restore-test': 'M132 332 H148',
  'plan-audit': 'M76 348 V388',
}

export const backupFlowScenarios: DiagramScenario[] = [
  { id: 'b1', nodes: ['rds', 'dynamodb', 'plan'], paths: ['rds-plan', 'dynamodb-plan'] },
  { id: 'b2', nodes: ['ec2', 'plan'], paths: ['ec2-plan'] },
  { id: 'b3', nodes: ['org-policy', 'plan'], paths: ['org-policy-plan'] },
  { id: 'b4', nodes: ['s3', 'plan'], paths: ['s3-plan'] },
  { id: 'b5', nodes: ['plan', 'other-region', 'other-account'], paths: ['plan-other-region', 'plan-other-account'] },
  { id: 'b6', nodes: ['plan', 'restore-test'], paths: ['plan-restore-test'] },
  { id: 'b7', nodes: ['plan', 'audit'], paths: ['plan-audit'] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function BackupFlowDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-backup-arrow`

  return (
    <DiagramFrame
      label={text.label}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={backupFlowScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 556">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          <g className="fill-none stroke-disabled" strokeWidth="1">
            <rect data-group="source" x="12" y="68" width="256" height="192" rx="4" />
            <rect data-group="backup" x="12" y="284" width="256" height="152" rx="4" />
            <rect data-group="copies" x="12" y="460" width="256" height="84" rx="4" />
          </g>
          <g className="fill-muted" fontSize="9">
            <text x="24" y="86">{text.groups!.source}</text>
            <text x="24" y="302">{text.groups!.backup}</text>
            <text x="24" y="478">{text.groups!.copies}</text>
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
