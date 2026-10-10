import { Fragment, type ComponentType } from 'react'
import { groupConcepts } from '../lib/concept-groups'
import { markFirstOccurrences } from '../lib/glossary'
import type { Concept } from '../types/content'
import type { GlossaryTerm } from '../types/visuals'
import { diagramsByConceptId } from './diagrams/registry'
import { EmphasizedText } from './EmphasizedText'

interface ConceptListProps {
  concepts: Concept[]
  // 개념 읽기 화면은 주제 제목이 h1이라 개념이 h2다. 확인 문제의 펼치기는 제목·문제문·
  // 주제 제목이 h1·h2·h3를 쓰고 있어 개념이 h4가 된다.
  headingLevel: 2 | 4
  diagrams?: Record<string, ComponentType | ComponentType[]>
  // 주제의 약어 사전(ADR-037). 개념마다 약어가 처음 나오는 한 곳에만 툴팁을 단다.
  glossary?: GlossaryTerm[]
}

// 개념 읽기 화면과 확인 문제의 개념 펼치기가 같은 본문을 렌더한다.
// 둘이 갈라지면 같은 개념이 화면에 따라 다르게 보인다.
export function ConceptList({ concepts, headingLevel, diagrams = diagramsByConceptId, glossary }: ConceptListProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h4'
  const ChildHeading = headingLevel === 2 ? 'h3' : 'h5'

  function renderConcept(concept: Concept, Heading: 'h2' | 'h3' | 'h4' | 'h5') {
    const Diagram = diagrams[concept.id]
    // 요약과 문단을 한 번에 넘겨야 개념 안에서 처음 나오는 자리 하나만 표시된다.
    const segments = glossary
      ? markFirstOccurrences([concept.summary, ...concept.paragraphs], glossary.map(({ term }) => term))
      : undefined
    const glossaryAt = (index: number) => (segments && glossary ? { segments: segments[index], terms: glossary } : undefined)

    return (
      <article className="space-y-3 scroll-mt-24" id={concept.id} key={concept.id}>
        <div className="space-y-1">
          <Heading className="text-base font-medium text-neutral-100">{concept.name}</Heading>
          <p className="text-sm text-neutral-400"><EmphasizedText glossary={glossaryAt(0)} text={concept.summary} /></p>
        </div>
        <div className="space-y-3">
          {concept.paragraphs.map((paragraph, index) => (
            <p className="whitespace-pre-line break-keep text-[15px] leading-7 text-neutral-300" key={`${concept.id}-${index}`}>
              <EmphasizedText glossary={glossaryAt(index + 1)} text={paragraph} />
            </p>
          ))}
        </div>
        {Array.isArray(Diagram)
          ? Diagram.map((Component, index) => <Component key={index} />)
          : Diagram && <Diagram />}
      </article>
    )
  }

  return (
    <div className="space-y-8">
      {groupConcepts(concepts).map(({ concept, children }) => (
        <Fragment key={concept.id}>
          {renderConcept(concept, Heading)}
          {children.length > 0 && (
            <div className="space-y-8 border-l border-border pl-4 max-sm:[&_figure]:-ml-[37px]">
              {children.map((child) => renderConcept(child, ChildHeading))}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}
