import { useId, useState } from 'react'
import { visualsByTopicId } from '../../data'
import { DiagramFrame, type DiagramScenario } from './DiagramFrame'

const text = visualsByTopicId['backup-disaster-recovery'].diagrams['dr-choice']

// 원본 위치 → 복구 시간 목표 → 방식 순서다. 방식은 준비 상태와 이름을 두 줄로 둔다.
const groups = [
  { id: 'source', y: 8, height: 84 },
  { id: 'rto', y: 120, height: 84 },
  { id: 'strategy', y: 232, height: 200 },
]
const nodes = [
  { id: 'onprem', x: 20, y: 40, width: 112, height: 32 },
  { id: 'aws', x: 148, y: 40, width: 112, height: 32 },
  { id: 'rto-hours', x: 20, y: 152, width: 112, height: 32 },
  { id: 'rto-seconds', x: 148, y: 152, width: 112, height: 32 },
  { id: 'backup-restore', x: 20, y: 264, width: 240, height: 44 },
  { id: 'warm-standby', x: 20, y: 320, width: 240, height: 44 },
  { id: 'drs', x: 20, y: 376, width: 240, height: 44 },
]

// 온프레미스는 왼쪽 바깥 x=4로 RTO 단을 건너뛴다.
// 다른 경로는 열 사이 x=140과 오른쪽 바깥 x=276으로 노드·그룹 라벨을 피한다.
const paths: Record<string, string> = {
  'aws-hours': 'M204 72 V104 H140 V168 H132',
  'hours-backup-restore': 'M76 184 V216 H140 V264',
  'aws-seconds': 'M204 72 V152',
  'seconds-warm-standby': 'M204 184 V216 H276 V342 H260',
  'onprem-drs': 'M20 56 H4 V398 H20',
}

export const drChoiceScenarios: DiagramScenario[] = [
  { id: 'r1', nodes: ['aws', 'rto-hours', 'backup-restore'], paths: ['aws-hours', 'hours-backup-restore'] },
  { id: 'r2', nodes: ['aws', 'rto-seconds', 'warm-standby'], paths: ['aws-seconds', 'seconds-warm-standby'] },
  { id: 'r3', nodes: ['onprem', 'drs'], paths: ['onprem-drs'] },
].map((scenario) => {
  const wording = text.scenarios.find(({ id }) => id === scenario.id)!
  return { ...scenario, label: wording.label, caption: wording.caption }
})

export function DrChoiceDiagram() {
  const [active, setActive] = useState<DiagramScenario | null>(null)
  const arrowId = `${useId()}-dr-choice-arrow`

  return (
    <DiagramFrame
      label={text.label}
      idleCaption={text.idleCaption}
      legend={text.legend}
      scenarios={drChoiceScenarios}
      active={active}
      onSelect={setActive}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label={text.svgLabel} className="block h-auto w-full" role="img" viewBox="0 0 280 444">
          <defs>
            <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" viewBox="0 0 6 6">
              <path className="fill-title" d="M0 0 L6 3 L0 6 Z" />
            </marker>
          </defs>

          {groups.map((group) => (
            <g key={group.id}>
              <rect data-group={group.id} className="fill-none stroke-disabled" x="12" y={group.y} width="256" height={group.height} rx="4" strokeWidth="1" />
              <text className="fill-muted" x="24" y={group.y + 18} fontSize="9">{text.groups![group.id]}</text>
            </g>
          ))}

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
              <rect className={`fill-panel ${node.height === 44 ? 'stroke-diagram-managed' : 'stroke-disabled'}`} x={node.x} y={node.y} width={node.width} height={node.height} rx="4" strokeWidth="1.5" />
              {text.nodeNotes?.[node.id] && (
                <text className="fill-muted" x={node.x + node.width / 2} y={node.y + 13} dominantBaseline="central" textAnchor="middle" fontSize="9">
                  {text.nodeNotes[node.id]}
                </text>
              )}
              <text className="fill-title" x={node.x + node.width / 2} y={node.y + (node.height === 44 ? 31 : 16)} dominantBaseline="central" textAnchor="middle" fontSize="10">
                {text.nodes[node.id]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </DiagramFrame>
  )
}
