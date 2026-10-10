export interface TextSegment {
  text: string
  term?: string
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 한 개념의 텍스트 조각들(요약, 문단들 순서대로)에서 약어마다 처음 나오는 한 곳만 term으로 표시한다.
// 앞뒤가 영문·숫자가 아닐 때만 맞춘다 — "NACL" 안의 "ACL"은 약어가 아니다. 대소문자를 구분한다.
// `**강조**`와 백틱 한 쌍(코드 표기, ADR-044) 안은 맞추지 않는다. 그 안에 버튼을 두지 않고, 뒤에 나오는 바깥 자리를 첫 자리로 삼는다.
export function markFirstOccurrences(texts: string[], terms: string[]): TextSegment[][] {
  const seen = new Set<string>()
  const alternatives = [...terms].sort((a, b) => b.length - a.length).map(escapeRegExp)
  const pattern = alternatives.length > 0
    ? new RegExp(`\\*\\*.+?\\*\\*|\`[^\`]+\`|(?<![A-Za-z0-9])(?:${alternatives.join('|')})(?![A-Za-z0-9])`, 'g')
    : null

  return texts.map((text) => {
    const segments: TextSegment[] = []
    let plainStart = 0

    for (const match of pattern ? text.matchAll(pattern) : []) {
      const term = match[0]
      const start = match.index ?? 0
      if (term.startsWith('**') || term.startsWith('`') || seen.has(term)) continue
      seen.add(term)
      if (start > plainStart) segments.push({ text: text.slice(plainStart, start) })
      segments.push({ text: term, term })
      plainStart = start + term.length
    }

    if (plainStart < text.length || segments.length === 0) segments.push({ text: text.slice(plainStart) })
    return segments
  })
}

// 툴팁의 왼쪽 좌표. 앵커 가운데에 맞추되 화면 가장자리에서 margin 안쪽으로 붙잡는다.
export function clampTooltipLeft(anchorCenterX: number, tooltipWidth: number, viewportWidth: number, margin: number): number {
  const centered = anchorCenterX - tooltipWidth / 2
  return Math.max(margin, Math.min(centered, viewportWidth - margin - tooltipWidth))
}
