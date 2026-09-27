import { useRef, useState, type FormEvent } from 'react'
import { KeywordFlashcards } from '../components/KeywordFlashcards'
import { KeywordQuizRunner } from '../components/KeywordQuizRunner'
import defaultEncrypted from '../data/keywords.enc.json'
import { decryptKeywords, WrongPassphraseError } from '../lib/keyword-crypto'
import {
  buildFlashcards,
  buildKeywordQuestions,
  KEYWORD_QUIZ_ALL,
  KEYWORD_QUIZ_COUNTS,
  KEYWORD_QUIZ_MODES,
  resolveKeywordCount,
  type KeywordQuizCount,
} from '../lib/keyword-quiz'
import type { EncryptedKeywords, Keyword, KeywordQuestion, KeywordQuizMode } from '../types/keywords'

// 키워드 퀴즈(ADR-040)의 숨은 화면. 복호화한 키워드와 결과는 이 컴포넌트의 state에만 두고
// 어디에도 저장하지 않는다. 화면을 벗어나면 사라지므로 다시 들어오면 암호를 또 묻는다.
interface KeywordQuizPageProps {
  encrypted?: EncryptedKeywords
  rng?: () => number
}

type Round =
  | { mode: 'flashcard'; cards: Keyword[] }
  | { mode: Exclude<KeywordQuizMode, 'flashcard'>; questions: KeywordQuestion[] }

const MODE_LABELS: Record<KeywordQuizMode, string> = {
  'summary-to-term': '요약 보고 키워드 고르기',
  'term-to-summary': '키워드 보고 요약 고르기',
  flashcard: '플래시카드',
}

const COUNT_CHOICES: readonly KeywordQuizCount[] = [...KEYWORD_QUIZ_COUNTS, KEYWORD_QUIZ_ALL]

const optionClass = 'inline-flex min-h-[44px] items-center rounded-md border border-neutral-800 bg-[#141414] px-4 py-2 text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-100'
const optionSelectedClass = 'border-neutral-600 bg-[#1f1f1f] text-neutral-100'
const primaryButtonClass = 'inline-flex min-h-[44px] items-center rounded-md bg-neutral-100 px-4 py-2 text-neutral-900 transition-colors hover:bg-white disabled:opacity-50'

export function KeywordQuizPage({ encrypted = defaultEncrypted as EncryptedKeywords, rng = Math.random }: KeywordQuizPageProps) {
  const [passphrase, setPassphrase] = useState('')
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keywords, setKeywords] = useState<Keyword[] | null>(null)
  const [mode, setMode] = useState<KeywordQuizMode>(KEYWORD_QUIZ_MODES[0])
  const [count, setCount] = useState<KeywordQuizCount>(COUNT_CHOICES[0])
  const [round, setRound] = useState<Round | null>(null)
  // "한 판 더"는 러너를 새 key로 다시 마운트해 처음부터 시작한다.
  const [roundKey, setRoundKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function open(event: FormEvent) {
    event.preventDefault()
    if (opening) return
    // crypto.subtle은 secure context에서만 있다. LAN IP로 연 dev 서버가 그 예다(ADR-040).
    if (!globalThis.crypto?.subtle) {
      setError('이 주소에서는 열 수 없습니다. HTTPS나 localhost에서 열어 주세요.')
      return
    }
    setOpening(true)
    setError(null)
    try {
      const result = await decryptKeywords(encrypted, passphrase)
      setPassphrase('')
      setKeywords(result)
    } catch (caught) {
      if (caught instanceof WrongPassphraseError) {
        setError('암호가 맞지 않습니다.')
        setPassphrase('')
        inputRef.current?.focus()
      } else {
        setError('열 수 없습니다.')
      }
    } finally {
      setOpening(false)
    }
  }

  function start() {
    if (!keywords) return
    const total = resolveKeywordCount(count, keywords.length)
    setRound(mode === 'flashcard'
      ? { mode, cards: buildFlashcards(keywords, total, rng) }
      : { mode, questions: buildKeywordQuestions(keywords, mode, total, rng) })
    setRoundKey((key) => key + 1)
  }

  if (!keywords) {
    return (
      <section className="max-w-2xl space-y-8 break-keep break-anywhere">
        <h1 className="text-2xl font-semibold text-title">키워드 퀴즈</h1>
        <form className="space-y-3" onSubmit={open}>
          <label className="block text-xs text-neutral-500" htmlFor="keyword-passphrase">암호</label>
          <input
            // 입력한 글자를 그대로 보여 준다(사용자 결정). 일반 입력칸은 브라우저가 입력 기록으로
            // 남길 수 있으므로 자동완성·자동 대문자·맞춤법 검사를 끈다.
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            className="w-full rounded-md border border-neutral-800 bg-[#141414] px-4 py-3 text-[15px] text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
            id="keyword-passphrase"
            onChange={(event) => setPassphrase(event.target.value)}
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={passphrase}
          />
          {error && <p className="text-[15px] leading-7 text-neutral-300" role="alert">{error}</p>}
          <button className={primaryButtonClass} disabled={opening} type="submit">
            {opening ? '여는 중' : '열기'}
          </button>
        </form>
      </section>
    )
  }

  if (round) {
    return round.mode === 'flashcard'
      ? <KeywordFlashcards cards={round.cards} key={roundKey} onExit={() => setRound(null)} onRestart={start} />
      : (
        <KeywordQuizRunner
          key={roundKey}
          keywords={keywords}
          mode={round.mode}
          onExit={() => setRound(null)}
          onRestart={start}
          questions={round.questions}
        />
      )
  }

  return (
    <section className="max-w-2xl space-y-8 break-keep break-anywhere">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-title">키워드 퀴즈</h1>
        <p className="text-[15px] leading-7 text-neutral-300">키워드 {keywords.length}개</p>
      </div>
      <div aria-label="모드" className="flex flex-wrap gap-3" role="group">
        {KEYWORD_QUIZ_MODES.map((option) => (
          <button
            aria-pressed={mode === option}
            className={`${optionClass} ${mode === option ? optionSelectedClass : ''}`}
            key={option}
            onClick={() => setMode(option)}
            type="button"
          >
            {MODE_LABELS[option]}
          </button>
        ))}
      </div>
      <div aria-label="문항 수" className="flex flex-wrap gap-3" role="group">
        {COUNT_CHOICES.map((option) => (
          <button
            aria-pressed={count === option}
            className={`${optionClass} ${count === option ? optionSelectedClass : ''}`}
            key={option}
            onClick={() => setCount(option)}
            type="button"
          >
            {option === KEYWORD_QUIZ_ALL ? '전체' : option}
          </button>
        ))}
      </div>
      <button className={primaryButtonClass} onClick={start} type="button">시작</button>
    </section>
  )
}
