import { DiagramFrame } from './DiagramFrame'

// 두 칸에 같은 라벨이 붙는다. 장기 보관은 조회 기준과 직교하는 두 번째 기준이라
// 즉시 조회 쪽에도 대기 조회 쪽에도 그 칸이 하나씩 있다.
const longTermLabel = '장기 보관 목적 (법·감사·규정 준수)'

// 기준으로 나눈 칸이다. 안쪽 칸은 바깥 칸의 좌표 안에 들어가 중첩을 위치로 보인다.
// 대기 조회 칸은 장기 보관 칸 위에 한 줄 자리를 비워 둔다 — 기다려야 하는 클래스가
// 전부 Glacier 계열이라는 것을 빈 자리가 말한다.
const groups = [
  { id: 'immediate', label: '즉시 조회', x: 4, y: 4, width: 272, height: 300, dashed: false },
  { id: 'longterm-immediate', label: longTermLabel, x: 12, y: 234, width: 256, height: 62, dashed: false },
  { id: 'waiting', label: '대기 조회', x: 4, y: 314, width: 272, height: 198, dashed: false },
  { id: 'longterm-waiting', label: longTermLabel, x: 12, y: 382, width: 256, height: 122, dashed: false },
  { id: 'outside', label: '두 기준 밖', x: 4, y: 522, width: 272, height: 70, dashed: true },
]

// 클래스는 전부 AWS가 관리하는 저장 계층이라 색이 하나다. 어느 칸에 있는지가 기준을 말한다.
// 라벨이 길어 2열이 서지 않으므로 여덟 모두 한 줄을 통째로 쓴다. 곁말은 상자 아래 줄이다 —
// 가장 긴 곁말이 215이라 어느 노드 옆에도 들어가지 않는다.
const storageClasses = [
  { id: 'standard', label: 'S3 Standard', note: '기본값 · 접근이 잦은 데이터', x: 12, y: 26, width: 256 },
  { id: 'tiering', label: 'S3 Intelligent-Tiering', note: '접근 시점을 예측하기 어려울 때 · 검색 요금 없음', x: 12, y: 78, width: 256 },
  { id: 'standard-ia', label: 'S3 Standard-IA', note: '검색 요금 있음', x: 12, y: 130, width: 256 },
  { id: 'one-zone-ia', label: 'S3 One Zone-IA', note: '단일 AZ · 검색 요금 있음', x: 12, y: 182, width: 256 },
  { id: 'glacier-instant', label: 'S3 Glacier Instant Retrieval', note: null, x: 20, y: 256, width: 240 },
  { id: 'glacier-flexible', label: 'S3 Glacier Flexible Retrieval', note: '표준 검색 3~5시간', x: 20, y: 404, width: 240 },
  { id: 'glacier-deep', label: 'S3 Glacier Deep Archive', note: '최대 12시간', x: 20, y: 456, width: 240 },
  { id: 'express', label: 'S3 Express One Zone', note: '1밀리초 미만 · 단일 AZ', x: 12, y: 544, width: 256 },
]

// 정적 도식이라 고를 것이 없다. 껍데기는 scenarios가 없으면 버튼 줄을 그리지 않는다.
const noSelection = () => undefined

export function S3ClassMapDiagram() {
  return (
    <DiagramFrame
      label="S3 스토리지 클래스 분류 도식"
      idleCaption="여덟 클래스를 가르는 물음은 둘이다. 꺼낼 때 기다려야 하는가, 그리고 법·감사·규정 준수처럼 오래 두어야 할 이유가 있는가. 대기 조회 칸에서 장기 보관 바깥이 비어 있는 것은 기다려야 하는 클래스가 전부 Glacier 계열이라는 뜻이고, S3 Express One Zone은 두 물음 어디에도 들어가지 않아 따로 세웠다."
      legend="파랑 상자: 스토리지 클래스 · 바깥 칸: 조회 기준 · 안쪽 칸: 장기 보관 목적 · 점선 칸: 두 기준 밖"
      active={null}
      onSelect={noSelection}
    >
      <div className="-mx-4 w-full max-w-[380px] max-sm:w-[calc(100%+2rem)] sm:mx-0">
        <svg aria-label="S3 스토리지 클래스 분류" className="block h-auto w-full" role="img" viewBox="0 0 280 596">
          <g className="fill-none stroke-disabled" strokeWidth="1">
            {groups.map((group) => (
              <rect
                key={group.id}
                data-group={group.id}
                x={group.x}
                y={group.y}
                width={group.width}
                height={group.height}
                rx="6"
                strokeDasharray={group.dashed ? '6 4' : undefined}
              />
            ))}
          </g>
          <g className="fill-muted" fontSize="9">
            {groups.map((group) => (
              <text key={group.id} data-group-label={group.id} x={group.x + 10} y={group.y + 14}>
                {group.label}
              </text>
            ))}
          </g>

          {storageClasses.map((storageClass) => (
            <g key={storageClass.id} data-node={storageClass.id}>
              <rect
                className="fill-panel stroke-diagram-managed"
                x={storageClass.x}
                y={storageClass.y}
                width={storageClass.width}
                height="32"
                rx="4"
                strokeWidth="1.5"
              />
              <text
                className="fill-title"
                x={storageClass.x + storageClass.width / 2}
                y={storageClass.y + 16}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="10"
              >
                {storageClass.label}
              </text>
              {storageClass.note && (
                <text className="fill-muted" data-note={storageClass.id} x={storageClass.x + 2} y={storageClass.y + 41} fontSize="9">
                  {storageClass.note}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <p className="text-xs leading-5 text-muted" data-cost-order>
        비용 순서 — 오래 두는 데이터라면 Glacier 계열 쪽이 S3 Standard-IA보다 보관비가 덜 든다. Glacier 안에서는 꺼내는 데 더 오래 걸리는 S3 Glacier Deep Archive가 S3 Glacier Flexible Retrieval보다 싸고, 여덟 중 가장 싼 자리도 거기다. 나머지끼리의 순위는 이 주제가 다루지 않는다.
      </p>
    </DiagramFrame>
  )
}
