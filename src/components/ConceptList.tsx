import type { Concept } from '../types/content'
import { EmphasizedText } from './EmphasizedText'

interface ConceptListProps {
  concepts: Concept[]
  // 개념 읽기 화면은 주제 제목이 h1이라 개념이 h2다. 확인 문제의 펼치기는 제목·문제문·
  // 주제 제목이 h1·h2·h3를 쓰고 있어 개념이 h4가 된다.
  headingLevel: 2 | 4
}

// 개념 읽기 화면과 확인 문제의 개념 펼치기가 같은 본문을 렌더한다.
// 둘이 갈라지면 같은 개념이 화면에 따라 다르게 보인다.
export function ConceptList({ concepts, headingLevel }: ConceptListProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h4'

  return (
    <div className="space-y-8">
      {concepts.map((concept) => (
        <article className="space-y-3 scroll-mt-24" id={concept.id} key={concept.id}>
          <div className="space-y-1">
            <Heading className="text-base font-medium text-neutral-100">{concept.name}</Heading>
            <p className="text-sm text-neutral-400"><EmphasizedText text={concept.summary} /></p>
          </div>
          <div className="space-y-3">
            {concept.paragraphs.map((paragraph, index) => (
              <p className="whitespace-pre-line break-keep text-[15px] leading-7 text-neutral-300" key={`${concept.id}-${index}`}>
                <EmphasizedText text={paragraph} />
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
