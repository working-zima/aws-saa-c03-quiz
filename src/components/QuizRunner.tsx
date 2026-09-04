import { useState, type ReactNode } from 'react'
import { topics as defaultTopics } from '../data'
import { isCorrect } from '../lib/grading'
import type { Question, Topic } from '../types/content'
import { ConceptList } from './ConceptList'

interface QuizRunnerProps {
  title: string
  questions: Question[]
  answer: (questionId: string, correct: boolean) => void
  renderComplete: (correctCount: number, total: number) => ReactNode
  topics?: Topic[]
}

const choiceBaseClass = 'w-full rounded-md border border-neutral-800 bg-[#141414] px-4 py-3 text-left text-neutral-300'
const choiceCorrectClass = 'border-green-500/60 bg-green-500/5'
const choiceIncorrectClass = 'border-red-500/60 bg-red-500/5'
const ghostLinkClass = 'inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-100'
const conceptToggleClass = 'inline-flex min-h-[44px] items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-100'

const chevronDownIcon = (
  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const chevronUpIcon = (
  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
    <path d="M18 15l-6-6-6 6" />
  </svg>
)

export function QuizRunner({ title, questions, answer, renderComplete, topics = defaultTopics }: QuizRunnerProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selections, setSelections] = useState<(number | null)[]>(() => questions.map(() => null))
  const [complete, setComplete] = useState(false)
  // 펼친 문항의 인덱스를 들고 있는다. boolean을 따로 두면 문항을 옮길 때마다 닫아 줘야 하고,
  // 한 곳만 빠뜨리면 다음 문항에 앞 문항의 개념이 펼쳐진 채로 남는다.
  const [openConceptIndex, setOpenConceptIndex] = useState<number | null>(null)
  const correctCount = selections.filter(
    (selection, index) => selection !== null && isCorrect(questions[index], selection),
  ).length

  if (complete) {
    return renderComplete(correctCount, questions.length)
  }

  const question = questions[questionIndex]
  const selectedChoice = selections[questionIndex]
  const revealed = selectedChoice !== null
  const advanceInstructionId = `quiz-advance-instruction-${question.id}`
  const conceptPanelId = `quiz-concept-${question.id}`
  // 문항의 근거 개념 하나가 아니라 그 문항이 속한 주제 전체를 펼친다 (ADR-016).
  const topic = topics.find((candidate) => candidate.id === question.topicId)
  const conceptOpen = openConceptIndex === questionIndex

  function selectChoice(choiceIndex: number) {
    if (revealed) return
    const correct = isCorrect(question, choiceIndex)
    setSelections((currentSelections) => currentSelections.map(
      (selection, index) => index === questionIndex ? choiceIndex : selection,
    ))
    answer(question.id, correct)
  }

  function advance() {
    if (questionIndex === questions.length - 1) {
      setComplete(true)
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <header className="space-y-3">
        <div className="flex min-h-[44px] items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-title">{title}</h1>
          <div className="flex items-center gap-3">
            {questionIndex > 0 && (
              <button
                aria-label="이전 문제"
                className={ghostLinkClass}
                onClick={() => setQuestionIndex((index) => index - 1)}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className="text-xs text-neutral-500">{questionIndex + 1} / {questions.length}</span>
          </div>
        </div>
        <h2 className="text-lg font-medium text-neutral-100">{question.prompt}</h2>
      </header>

      <div className="space-y-3">
        {question.choices.map((choice, choiceIndex) => {
          const correctChoice = revealed && isCorrect(question, choiceIndex)
          const selectedIncorrectChoice = revealed && selectedChoice === choiceIndex && !correctChoice
          const resultClass = correctChoice ? choiceCorrectClass : selectedIncorrectChoice ? choiceIncorrectClass : ''
          const advanceClass = correctChoice ? 'cursor-pointer hover:border-green-500' : ''
          return (
            <button
              aria-describedby={correctChoice ? advanceInstructionId : undefined}
              className={`${choiceBaseClass} ${resultClass} ${advanceClass}`}
              disabled={revealed && !correctChoice}
              key={`${question.id}-${choiceIndex}`}
              onClick={() => revealed ? advance() : selectChoice(choiceIndex)}
              type="button"
            >
              {choice}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="animate-[fade-in_0.2s_ease-out] space-y-3 border-t border-neutral-800 pt-5">
          <p className="text-[15px] leading-7 text-neutral-300">{question.explanation}</p>
          <p className="text-xs text-neutral-500" id={advanceInstructionId}>
            {questionIndex === questions.length - 1
              ? '정답을 한 번 더 누르면 결과를 봅니다'
              : '정답을 한 번 더 누르면 다음 문제로 넘어갑니다'}
          </p>
        </div>
      )}

      {topic && (
        <div className="space-y-5 border-t border-neutral-800 pt-5">
          <button
            aria-controls={conceptPanelId}
            aria-expanded={conceptOpen}
            className={conceptToggleClass}
            onClick={() => setOpenConceptIndex(conceptOpen ? null : questionIndex)}
            type="button"
          >
            {conceptOpen ? chevronUpIcon : chevronDownIcon}
            개념 보기
          </button>
          {conceptOpen && (
            <div className="space-y-5" id={conceptPanelId}>
              <h3 className="text-lg font-medium text-title">{topic.title}</h3>
              <ConceptList concepts={topic.concepts} headingLevel={4} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
