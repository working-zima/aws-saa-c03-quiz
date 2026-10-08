import { useState } from 'react'
import { termName } from '../lib/keyword-quiz'
import type { Keyword } from '../types/keywords'

// 키워드 퀴즈(ADR-040)의 플래시카드. 알았음·몰랐음은 이 화면의 개수와 완료 화면의 몰랐던 카드 목록에만 쓰고 저장하지 않는다.
// "한 판 더"는 부모가 새 카드와 함께 key를 바꿔 다시 마운트하는 방식으로 처음부터 시작한다.
interface KeywordFlashcardsProps {
  cards: Keyword[]
  onRestart: () => void
  onExit: () => void
}

const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostButtonClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'
const verdictButtonClass = 'inline-flex min-h-[44px] items-center rounded-md border border-neutral-800 bg-[#141414] px-4 py-2 text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100'
const verdictSelectedClass = 'border-neutral-600 bg-[#1f1f1f] text-neutral-100'
// 넘기던 중에 선택 화면으로 나가는 버튼. 모양은 BackButton과 같다.
const exitButtonClass = '-ml-4 inline-flex min-h-[44px] items-center gap-2 rounded-md px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-100'

const backIcon = (
  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
    <path d="M15 19l-7-7 7-7" />
  </svg>
)

export function KeywordFlashcards({ cards, onRestart, onExit }: KeywordFlashcardsProps) {
  const [cardIndex, setCardIndex] = useState(0)
  // 카드별 판정. 되돌아가 바꿀 수 있으므로 개수는 세지 않고 이 배열에서 유도한다.
  const [verdicts, setVerdicts] = useState<(boolean | null)[]>(() => cards.map(() => null))
  // 뒤집은 카드의 인덱스. 판정한 카드는 되돌아가면 뒤집힌 채로 보인다.
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const knownCount = verdicts.filter((verdict) => verdict === true).length
  // 끝나면 몰랐음으로 고른 카드를 한 번에 펼쳐 다시 읽게 한다(사용자 결정).
  const unknownCards = cards.filter((_, index) => verdicts[index] === false)

  if (cardIndex >= cards.length) {
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">플래시카드 완료</h1>
          <p className="text-[15px] leading-7 text-neutral-300">알았음 {knownCount} · 몰랐음 {cards.length - knownCount}</p>
        </div>
        {unknownCards.length > 0 && (
          <ul aria-label="몰랐던 카드" className="space-y-3">
            {unknownCards.map((unknownCard) => (
              <li className="space-y-1 rounded-lg border border-neutral-800 bg-[#141414] p-5" key={unknownCard.id}>
                <p className="text-base font-medium text-neutral-100">{unknownCard.term}</p>
                <p className="text-[15px] leading-7 text-neutral-300">{unknownCard.summary}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-3">
          <button className={primaryButtonClass} onClick={onRestart} type="button">한 판 더</button>
          <button className={ghostButtonClass} onClick={onExit} type="button">처음으로</button>
        </div>
      </section>
    )
  }

  const card = cards[cardIndex]
  const verdict = verdicts[cardIndex]
  const flipped = verdict !== null || flippedIndex === cardIndex

  function judge(known: boolean) {
    setVerdicts((current) => current.map((value, index) => index === cardIndex ? known : value))
    setFlippedIndex(null)
    setCardIndex((index) => index + 1)
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <button className={exitButtonClass} onClick={onExit} type="button">
        {backIcon}
        돌아가기
      </button>
      <header className="flex min-h-[44px] items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-title">플래시카드</h1>
        <div className="flex items-center gap-3">
          {cardIndex > 0 && (
            <button
              aria-label="이전 카드"
              className={ghostButtonClass}
              onClick={() => setCardIndex((index) => index - 1)}
              type="button"
            >
              {backIcon}
            </button>
          )}
          <span className="text-xs text-neutral-500">{cardIndex + 1} / {cards.length}</span>
        </div>
      </header>

      <div className="space-y-3 rounded-lg border border-neutral-800 bg-[#141414] p-5">
        {/* 괄호 풀이는 정의를 알려 주므로 뒤집은 뒤에만 붙인다. */}
        <h2 className="text-lg font-medium text-neutral-100">{flipped ? card.term : termName(card.term)}</h2>
        {flipped && (
          <p className="text-[15px] leading-7 text-neutral-300">{card.summary}</p>
        )}
      </div>

      {flipped ? (
        <div className="flex flex-wrap gap-3">
          <button aria-pressed={verdict === true} className={`${verdictButtonClass} ${verdict === true ? verdictSelectedClass : ''}`} onClick={() => judge(true)} type="button">알았음</button>
          <button aria-pressed={verdict === false} className={`${verdictButtonClass} ${verdict === false ? verdictSelectedClass : ''}`} onClick={() => judge(false)} type="button">몰랐음</button>
        </div>
      ) : (
        <button className={primaryButtonClass} onClick={() => setFlippedIndex(cardIndex)} type="button">뒤집기</button>
      )}
    </section>
  )
}
