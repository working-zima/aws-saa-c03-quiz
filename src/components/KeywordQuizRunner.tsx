import { useState } from 'react'
import type { Keyword, KeywordChoiceMode, KeywordQuestion } from '../types/keywords'

// 키워드 퀴즈(ADR-040)의 4지선다 러너. 진행률·복습과 엮지 않고 결과도 저장하지 않는다.
// "한 판 더"는 부모가 새 문항과 함께 key를 바꿔 다시 마운트하는 방식으로 처음부터 시작한다.
interface KeywordQuizRunnerProps {
  mode: KeywordChoiceMode
  questions: KeywordQuestion[]
  keywords: Keyword[]
  onRestart: () => void
  onExit: () => void
}

// 보기 버튼의 클래스와 정답·오답 표시는 QuizRunner와 같다.
const choiceBaseClass = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#141414] px-4 py-3 text-left text-neutral-300'
const choiceCorrectClass = 'border-green-500/60 bg-green-500/5'
const choiceIncorrectClass = 'border-red-500/60 bg-red-500/5'
const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white'
const ghostButtonClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'

export function KeywordQuizRunner({ mode, questions, keywords, onRestart, onExit }: KeywordQuizRunnerProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selections, setSelections] = useState<(number | null)[]>(() => questions.map(() => null))
  const [complete, setComplete] = useState(false)
  // 맞힌 수는 세지 않고 selections에서 유도한다.
  const correctCount = selections.filter(
    (selection, index) => selection !== null && selection === questions[index].answerIndex,
  ).length

  if (complete) {
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-title">키워드 퀴즈 완료</h1>
          <p className="text-[15px] leading-7 text-neutral-300">맞힌 수 {correctCount} / {questions.length}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className={primaryButtonClass} onClick={onRestart} type="button">한 판 더</button>
          <button className={ghostButtonClass} onClick={onExit} type="button">처음으로</button>
        </div>
      </section>
    )
  }

  const question = questions[questionIndex]
  const selectedChoice = selections[questionIndex]
  const revealed = selectedChoice !== null
  const answerKeyword = keywords.find((keyword) => keyword.id === question.keywordId)
  const isLast = questionIndex === questions.length - 1

  function selectChoice(choiceIndex: number) {
    if (revealed) return
    setSelections((current) => current.map(
      (selection, index) => index === questionIndex ? choiceIndex : selection,
    ))
  }

  function advance() {
    if (isLast) {
      setComplete(true)
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <header className="space-y-3">
        <div className="flex min-h-[44px] items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-title">
            {mode === 'summary-to-term' ? '정의 보고 용어 고르기' : '용어 보고 정의 고르기'}
          </h1>
          <span className="text-xs text-neutral-500">{questionIndex + 1} / {questions.length}</span>
        </div>
        <h2 className="text-lg font-medium text-neutral-100">{question.prompt}</h2>
      </header>

      <div className="space-y-3">
        {question.choices.map((choice, choiceIndex) => {
          const correctChoice = revealed && choiceIndex === question.answerIndex
          const selectedIncorrectChoice = revealed && selectedChoice === choiceIndex && !correctChoice
          const resultClass = correctChoice ? choiceCorrectClass : selectedIncorrectChoice ? choiceIncorrectClass : ''
          return (
            <button
              className={`${choiceBaseClass} ${resultClass}`}
              disabled={revealed}
              key={`${question.keywordId}-${choiceIndex}`}
              onClick={() => selectChoice(choiceIndex)}
              type="button"
            >
              {choice}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="animate-[fade-in_0.2s_ease-out] space-y-3 border-t border-neutral-800 pt-5">
          <p className="text-xs text-neutral-500">{selectedChoice === question.answerIndex ? '정답' : '오답'}</p>
          {answerKeyword && (
            <div className="space-y-1" data-testid="keyword-answer">
              <p className="text-base font-medium text-neutral-100">{answerKeyword.term}</p>
              <p className="text-[15px] leading-7 text-neutral-300">{answerKeyword.summary}</p>
            </div>
          )}
          <button className={primaryButtonClass} onClick={advance} type="button">
            {isLast ? '결과 보기' : '다음'}
          </button>
        </div>
      )}
    </section>
  )
}
