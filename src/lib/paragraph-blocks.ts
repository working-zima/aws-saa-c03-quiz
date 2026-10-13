export const LIST_ITEM_MARKER = '- '

export type ParagraphBlock =
  | { kind: 'paragraph'; index: number; text: string }
  | { kind: 'list'; items: { index: number; text: string }[] }

export function isListItem(paragraph: string): boolean {
  return paragraph.startsWith(LIST_ITEM_MARKER)
}

export function stripListMarker(paragraph: string): string {
  return isListItem(paragraph) ? paragraph.slice(LIST_ITEM_MARKER.length) : paragraph
}

// 잇닿은 목록 항목을 묶고 표지를 뗀다. 번호는 원래 paragraphs의 위치를 유지한다.
export function groupParagraphs(paragraphs: string[]): ParagraphBlock[] {
  const blocks: ParagraphBlock[] = []

  paragraphs.forEach((paragraph, index) => {
    if (!isListItem(paragraph)) {
      blocks.push({ kind: 'paragraph', index, text: paragraph })
      return
    }

    const item = { index, text: stripListMarker(paragraph) }
    const previous = blocks[blocks.length - 1]
    if (previous?.kind === 'list') {
      previous.items.push(item)
    } else {
      blocks.push({ kind: 'list', items: [item] })
    }
  })

  return blocks
}
