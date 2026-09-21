export interface SvgBox {
  id: string
  x: number
  y: number
  width: number
  height: number
}

// viewBox = [minX, minY, width, height]. 경계에 닿는 상자는 넘친 것으로 세지 않는다.
export function boxesOutsideViewBox(boxes: SvgBox[], viewBox: [number, number, number, number]): SvgBox[] {
  const [minX, minY, width, height] = viewBox

  return boxes.filter((box) => (
    box.x < minX || box.y < minY
    || box.x + box.width > minX + width
    || box.y + box.height > minY + height
  ))
}

// 한글·한자·가나와 전각 기호는 넓게 잡는다. 반각 영문·숫자·기호·공백은 0.55배다.
const fullWidthCharacter = /[\p{Script=Hangul}\p{Script=Han}\u2e80-\ua4cf\ufe10-\ufe19\ufe30-\ufe6f\uff01-\uff60\uffe0-\uffe6]/u

export function estimateTextWidth(text: string, fontSize: number): number {
  let width = 0

  for (const character of text) {
    width += fontSize * (fullWidthCharacter.test(character) ? 1 : 0.55)
  }

  return width
}
