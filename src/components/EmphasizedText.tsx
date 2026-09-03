interface EmphasizedTextProps {
  text: string
}

// 개념 본문·요약의 `**강조**` 마커를 굵은 글자로 바꾼다. 개념 읽기 화면과 확인 문제의
// 근거 개념 패널이 같은 규칙으로 렌더해야 하므로 한 곳에 둔다.
// 검색이 같은 마커를 비교 전에 지우는 규칙은 `lib/search.ts`의 `stripEmphasis`에 있다.
export function EmphasizedText({ text }: EmphasizedTextProps) {
  return (
    <>
      {text.split(/(\*\*.+?\*\*)/g).map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong className="font-medium text-neutral-100" key={index}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}
