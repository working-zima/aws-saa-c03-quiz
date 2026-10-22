export const LIST_ITEM_MARKER = '- '

// 단계 목록의 번호 표지. 맨 바깥(들여쓰기 없음)에서만 표지다(ADR-050).
const STEP_MARKER = /^(\d+)\. /

export type ParagraphBlock =
  | { kind: 'paragraph'; index: number; text: string }
  | { kind: 'list'; items: { index: number; text: string }[] }
  | { kind: 'steps'; start: number; items: StepItem[] }

export interface StepItem { index: number; number: number; text: string; children: SubBlock[] }

export type SubBlock =
  | { kind: 'paragraph'; index: number; text: string }
  | { kind: 'bullets'; items: SubItem[] }

export interface SubItem { index: number; text: string; children: SubBlock[] }

// 깊이는 앞 공백 수 / 2다. 번호는 0단에만, 글머리는 어느 단에나 온다.
type Line =
  | { depth: 0; kind: 'step'; number: number; text: string }
  | { depth: 0 | 1 | 2; kind: 'bullet' | 'text'; text: string }

export function isListItem(paragraph: string): boolean {
  return paragraph.startsWith(LIST_ITEM_MARKER)
}

// 0·2·4칸 밖의 들여쓰기는 규칙 밖이다. 글을 그대로 둔 맨 바깥 문단으로 읽는다.
function readLine(paragraph: string): Line {
  const indent = /^ */.exec(paragraph)?.[0].length ?? 0
  if (indent !== 0 && indent !== 2 && indent !== 4) return { depth: 0, kind: 'text', text: paragraph }

  const depth = (indent / 2) as 0 | 1 | 2
  const body = paragraph.slice(indent)
  const step = depth === 0 ? STEP_MARKER.exec(body) : null
  if (step) return { depth: 0, kind: 'step', number: Number(step[1]), text: body.slice(step[0].length) }
  if (body.startsWith(LIST_ITEM_MARKER)) return { depth, kind: 'bullet', text: body.slice(LIST_ITEM_MARKER.length) }
  return { depth, kind: 'text', text: body }
}

export function stripListMarker(paragraph: string): string {
  return readLine(paragraph).text
}

// 항목 아래에 글머리 항목이나 이어지는 문단을 더한다. 잇닿은 글머리 항목은 한 묶음이 된다.
function addChild(children: SubBlock[], line: Line, index: number): SubItem | null {
  if (line.kind !== 'bullet') {
    children.push({ kind: 'paragraph', index, text: line.text })
    return null
  }

  const item: SubItem = { index, text: line.text, children: [] }
  const previous = children[children.length - 1]
  if (previous?.kind === 'bullets') {
    previous.items.push(item)
  } else {
    children.push({ kind: 'bullets', items: [item] })
  }
  return item
}

// 잇닿은 목록 항목을 묶고 표지를 뗀다. 번호는 원래 paragraphs의 위치를 유지한다.
// 들여쓴 문단은 바로 위의 한 단 얕은 항목에 딸린다. 부모가 없으면 던지지 않고 맨 바깥 일반 문단으로 둔다 —
// 렌더 중에 던지면 개념 화면 전체가 무너진다. 그런 데이터는 data.test.ts가 막는다.
export function groupParagraphs(paragraphs: string[]): ParagraphBlock[] {
  const blocks: ParagraphBlock[] = []
  // 열린 단계 목록의 마지막 번호 항목과, 그 아래 마지막 1단 글머리 항목. 1단 문단은 step에, 2단 문단은 bullet에만 딸린다.
  let step: StepItem | null = null
  let bullet: SubItem | null = null

  paragraphs.forEach((paragraph, index) => {
    const line = readLine(paragraph)
    const parent = line.depth === 1 ? step : line.depth === 2 ? bullet : null

    if (parent) {
      const child = addChild(parent.children, line, index)
      if (line.depth === 1) bullet = child
      return
    }

    if (line.kind === 'step') {
      const item: StepItem = { index, number: line.number, text: line.text, children: [] }
      const previous = blocks[blocks.length - 1]
      if (previous?.kind === 'steps') {
        previous.items.push(item)
      } else {
        blocks.push({ kind: 'steps', start: line.number, items: [item] })
      }
      step = item
      bullet = null
      return
    }

    // 여기부터는 맨 바깥 문단이다. 단계 목록이 열려 있었다면 끝난다.
    step = null
    bullet = null

    if (line.depth > 0 || line.kind !== 'bullet') {
      blocks.push({ kind: 'paragraph', index, text: line.text })
      return
    }

    const item = { index, text: line.text }
    const previous = blocks[blocks.length - 1]
    if (previous?.kind === 'list') {
      previous.items.push(item)
    } else {
      blocks.push({ kind: 'list', items: [item] })
    }
  })

  return blocks
}
