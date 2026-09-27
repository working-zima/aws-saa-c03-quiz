import type {
  Keyword,
  KeywordChoiceMode,
  KeywordQuestion,
  KeywordQuizMode,
} from '../types/keywords'
import { shuffle } from './shuffle'

// 키워드 퀴즈(ADR-040)의 순수 로직. 기존 문제 은행·진행률과 엮지 않는다.

export const KEYWORD_QUIZ_MODES: readonly KeywordQuizMode[] = [
  'summary-to-term',
  'term-to-summary',
  'flashcard',
]

export const KEYWORD_QUIZ_COUNTS = [10, 20] as const

export const KEYWORD_QUIZ_ALL = 'all'

export type KeywordQuizCount =
  | (typeof KEYWORD_QUIZ_COUNTS)[number]
  | typeof KEYWORD_QUIZ_ALL

export function resolveKeywordCount(choice: KeywordQuizCount, total: number): number {
  return choice === KEYWORD_QUIZ_ALL ? total : Math.min(choice, total)
}

// 단원별로 풀기. 단원은 PDF에 처음 나오는 순서(키워드 id 순서)를 따른다.
export function listKeywordSections(keywords: Keyword[]): { section: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const keyword of keywords) {
    counts.set(keyword.section, (counts.get(keyword.section) ?? 0) + 1)
  }
  return [...counts].map(([section, count]) => ({ section, count }))
}

// section이 null이면 전체다.
export function selectKeywords(keywords: Keyword[], section: string | null): Keyword[] {
  return section === null ? keywords : keywords.filter((keyword) => keyword.section === section)
}

function normalize(text: string): string {
  return text.replace(/\s/g, '')
}

// 오답은 같은 단원에서 먼저 고른다. 헷갈리는 것끼리 구분하는 연습이 목적이다.
// 정답과 용어나 요약이 같은 키워드는 빼고, 보기 문자열이 서로 겹치지 않게 한다.
function pickDistractors(
  answer: Keyword,
  keywords: Keyword[],
  choiceOf: (keyword: Keyword) => string,
  rng: () => number,
): Keyword[] {
  const term = normalize(answer.term)
  const summary = normalize(answer.summary)
  const candidates = keywords.filter(
    (k) =>
      k.id !== answer.id &&
      normalize(k.term) !== term &&
      normalize(k.summary) !== summary,
  )
  const ordered = [
    ...shuffle(candidates.filter((k) => k.section === answer.section), rng),
    ...shuffle(candidates.filter((k) => k.section !== answer.section), rng),
  ]

  const seen = new Set([normalize(choiceOf(answer))])
  const picked: Keyword[] = []
  for (const keyword of ordered) {
    if (picked.length === 3) break
    const key = normalize(choiceOf(keyword))
    if (seen.has(key)) continue
    seen.add(key)
    picked.push(keyword)
  }

  if (picked.length < 3) {
    throw new Error(`오답 보기를 셋 채우지 못했다: ${answer.id}`)
  }
  return picked
}

export function buildKeywordQuestions(
  keywords: Keyword[],
  mode: KeywordChoiceMode,
  count: number,
  rng: () => number,
  section: string | null = null,
): KeywordQuestion[] {
  const promptOf = (k: Keyword) => (mode === 'summary-to-term' ? k.summary : k.term)
  const choiceOf = (k: Keyword) => (mode === 'summary-to-term' ? k.term : k.summary)

  // 정답은 고른 단원에서만 내고, 오답은 전체에서 고른다. 키워드가 적은 단원도 보기 넷을 채우기 위해서다.
  return shuffle(selectKeywords(keywords, section), rng)
    .slice(0, count)
    .map((answer) => {
      const options = shuffle(
        [answer, ...pickDistractors(answer, keywords, choiceOf, rng)],
        rng,
      )
      return {
        keywordId: answer.id,
        prompt: promptOf(answer),
        choices: options.map(choiceOf) as [string, string, string, string],
        choiceKeywordIds: options.map((option) => option.id) as [string, string, string, string],
        answerIndex: options.indexOf(answer) as 0 | 1 | 2 | 3,
      }
    })
}

export function buildFlashcards(
  keywords: Keyword[],
  count: number,
  rng: () => number,
): Keyword[] {
  return shuffle(keywords, rng).slice(0, count)
}

export const LOGO_TAP_COUNT = 5

export const LOGO_TAP_WINDOW_MS = 1500

export function registerLogoTap(
  taps: readonly number[],
  now: number,
): { taps: number[]; unlocked: boolean } {
  const recent = [...taps.filter((t) => now - t < LOGO_TAP_WINDOW_MS), now]
  if (recent.length >= LOGO_TAP_COUNT) {
    return { taps: [], unlocked: true }
  }
  return { taps: recent, unlocked: false }
}
