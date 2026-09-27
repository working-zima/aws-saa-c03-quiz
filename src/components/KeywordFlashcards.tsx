import { useState } from 'react'
import type { Keyword } from '../types/keywords'

// 키워드 퀴즈(ADR-040)의 플래시카드. 알았음·몰랐음은 이 화면의 개수로만 쓰고 모으거나 저장하지 않는다.
// "한 판 더"는 부모가 새 카드와 함께 key를 바꿔 다시 마운트하는 방식으로 처음부터 시작한다.
interface KeywordFlashcardsProps {
  cards: Keyword[]
  onRestart: () => void
  onExit: () => void
}

const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostButtonClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'
const verdictButtonClass = 'inline-flex min-h-[44px] items-center rounded-md border border-neutral-800 bg-[#141414] px-4 py-2 text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100'

export function KeywordFlashcards({ cards, onRestart, onExit }: KeywordFlashcardsProps) {
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownCount, setKnownCount] = useState(0)

  if (cardIndex >= cards.length) {
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">플래시카드 완료</h1>
          <p className="text-[15px] leading-7 text-neutral-300">알았음 {knownCount} · 몰랐음 {cards.length - knownCount}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className={primaryButtonClass} onClick={onRestart} type="button">한 판 더</button>
          <button className={ghostButtonClass} onClick={onExit} type="button">처음으로</button>
        </div>
      </section>
    )
  }

  const card = cards[cardIndex]

  function judge(known: boolean) {
    if (known) setKnownCount((count) => count + 1)
    setFlipped(false)
    setCardIndex((index) => index + 1)
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <header className="flex min-h-[44px] items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-title">플래시카드</h1>
        <span className="text-xs text-neutral-500">{cardIndex + 1} / {cards.length}</span>
      </header>

      <div className="space-y-3 rounded-lg border border-neutral-800 bg-[#141414] p-5">
        <h2 className="text-lg font-medium text-neutral-100">{card.term}</h2>
        {flipped && (
          <p className="text-[15px] leading-7 text-neutral-300">{card.summary}</p>
        )}
      </div>

      {flipped ? (
        <div className="flex flex-wrap gap-3">
          <button className={verdictButtonClass} onClick={() => judge(true)} type="button">알았음</button>
          <button className={verdictButtonClass} onClick={() => judge(false)} type="button">몰랐음</button>
        </div>
      ) : (
        <button className={primaryButtonClass} onClick={() => setFlipped(true)} type="button">뒤집기</button>
      )}
    </section>
  )
}
