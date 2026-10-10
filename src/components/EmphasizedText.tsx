import { Fragment } from 'react'
import type { TextSegment } from '../lib/glossary'
import type { GlossaryTerm as GlossaryEntry } from '../types/visuals'
import { GlossaryTerm } from './GlossaryTerm'

interface EmphasizedTextProps {
  text: string
  // `markFirstOccurrences`가 `text`를 나눈 조각과 약어 사전. 주지 않으면 강조·코드 표기만 처리한다.
  // 약어 조각은 `**강조**`와 백틱 한 쌍 밖에서만 나오므로 두 마커는 늘 한 조각 안에 짝으로 들어 있다.
  glossary?: { segments: TextSegment[]; terms: GlossaryEntry[] }
}

function renderEmphasis(text: string) {
  return text.split(/(\*\*.+?\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="font-medium text-neutral-100" key={index}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code className="font-mono text-[0.9em]" key={index}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

// 개념 본문·요약의 `**강조**` 마커를 굵은 글자로 바꾼다. `ConceptList`가 유일한 사용처이고,
// 개념 읽기 화면과 확인 문제의 개념 펼치기가 그 컴포넌트를 함께 쓴다.
// 백틱 한 쌍은 기호를 지우고 고정폭 글꼴의 `<code>`로 그린다. 색·배경은 주지 않는다(ADR-044).
// 검색이 같은 마커를 비교 전에 지우는 규칙은 `lib/search.ts`의 `stripEmphasis`에 있다.
export function EmphasizedText({ text, glossary }: EmphasizedTextProps) {
  if (!glossary) return <>{renderEmphasis(text)}</>

  return (
    <>
      {glossary.segments.map((segment, index) => {
        const entry = segment.term && glossary.terms.find(({ term }) => term === segment.term)
        return entry ? <GlossaryTerm entry={entry} key={index} /> : <Fragment key={index}>{renderEmphasis(segment.text)}</Fragment>
      })}
    </>
  )
}
