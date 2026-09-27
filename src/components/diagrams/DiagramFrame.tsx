import type { ReactNode } from 'react'

export interface DiagramScenario {
  id: string
  label: string
  caption: string
  nodes: string[]
  paths: string[]
}

interface DiagramFrameProps {
  label: string
  question?: string
  idleCaption: string
  legend?: string
  scenarios?: DiagramScenario[]
  active: DiagramScenario | null
  onSelect: (scenario: DiagramScenario | null) => void
  children: ReactNode
}

const buttonClass = 'inline-flex min-h-[44px] max-w-full items-center rounded-md border border-disabled px-2.5 py-2 text-left text-sm text-muted transition-colors duration-150 hover:text-title aria-pressed:bg-selected aria-pressed:font-medium aria-pressed:text-title'

// 상태와 SVG의 노드·경로 처리는 각 도식이 맡는다. 공통 틀은 선택을 전달하고 캡션만 바꾼다.
export function DiagramFrame({ label, question, idleCaption, legend, scenarios, active, onSelect, children }: DiagramFrameProps) {
  return (
    <figure aria-label={label} className="-mx-5 min-w-0 space-y-3 rounded-none border border-x-0 border-disabled bg-panel p-4 break-keep break-anywhere sm:mx-0 sm:rounded-lg sm:border-x">
      {question && <p className="text-sm text-title">{question}</p>}
      {scenarios && (
        <div aria-label="통신 시나리오" className="flex flex-wrap gap-2" role="group">
          <button aria-pressed={active === null} className={buttonClass} onClick={() => onSelect(null)} type="button">
            전체
          </button>
          {scenarios.map((scenario) => (
            <button
              aria-pressed={active?.id === scenario.id}
              className={buttonClass}
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              type="button"
            >
              {scenario.label}
            </button>
          ))}
        </div>
      )}
      {children}
      <figcaption aria-live="polite" className="min-h-24 text-sm leading-6 text-muted">
        {active ? active.caption : idleCaption}
      </figcaption>
      {legend && <p className="text-xs text-disabled">{legend}</p>}
    </figure>
  )
}
