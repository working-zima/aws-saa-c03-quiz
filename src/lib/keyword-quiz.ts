import type {
  Keyword,
  KeywordChoiceMode,
  KeywordFeature,
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

// `이름 (풀이)`에서 이름만 남긴다. 풀이가 요약과 같은 말일 때가 많아 답을 알려 주므로
// 답을 보기 전에 보이는 용어는 이것으로 낸다. 답을 본 뒤의 풀이에는 term을 그대로 쓴다.
export function termName(term: string): string {
  return term.replace(/\s*\(.*\)\s*$/, '')
}

function normalize(text: string): string {
  return text.replace(/\s/g, '')
}

// 부모와 그 하위 항목(Aurora와 Global Database 등)은 서로의 오답이 되면 정답이 둘로 읽힌다.
function related(a: Keyword, b: Keyword): boolean {
  return a.parentId === b.id || b.parentId === a.id
}

// 오답은 같은 단원에서 먼저 고른다. 헷갈리는 것끼리 구분하는 연습이 목적이다.
// 정답과 용어나 요약이 같은 키워드와 정답의 부모·하위 항목은 빼고, 보기 문자열이 서로 겹치지 않게 한다.
// section은 오답을 먼저 뽑을 단원이다. 특징 문항은 특징이 나온 단원을 준다.
function pickDistractors(
  answer: Keyword,
  keywords: Keyword[],
  choiceOf: (keyword: Keyword) => string,
  rng: () => number,
  section: string = answer.section,
): Keyword[] {
  const term = normalize(answer.term)
  const summary = normalize(answer.summary)
  const candidates = keywords.filter(
    (k) =>
      k.id !== answer.id &&
      !related(k, answer) &&
      normalize(k.term) !== term &&
      normalize(k.summary) !== summary,
  )
  const ordered = [
    ...shuffle(candidates.filter((k) => k.section === section), rng),
    ...shuffle(candidates.filter((k) => k.section !== section), rng),
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

function toQuestion(
  answer: Keyword,
  prompt: string,
  options: Keyword[],
  choiceOf: (keyword: Keyword) => string,
): KeywordQuestion {
  return {
    keywordId: answer.id,
    prompt,
    choices: options.map(choiceOf) as [string, string, string, string],
    choiceKeywordIds: options.map((option) => option.id) as [string, string, string, string],
    answerIndex: options.indexOf(answer) as 0 | 1 | 2 | 3,
  }
}

export function buildKeywordQuestions(
  keywords: Keyword[],
  mode: KeywordChoiceMode,
  count: number,
  rng: () => number,
  section: string | null = null,
): KeywordQuestion[] {
  const promptOf = (k: Keyword) => (mode === 'summary-to-term' ? k.summary : termName(k.term))
  const choiceOf = (k: Keyword) => (mode === 'summary-to-term' ? termName(k.term) : k.summary)

  // 정답은 고른 단원에서만 내고, 오답은 전체에서 고른다. 키워드가 적은 단원도 보기 넷을 채우기 위해서다.
  return shuffle(selectKeywords(keywords, section), rng)
    .slice(0, count)
    .map((answer) => {
      const options = shuffle(
        [answer, ...pickDistractors(answer, keywords, choiceOf, rng)],
        rng,
      )
      return toQuestion(answer, promptOf(answer), options, choiceOf)
    })
}

// [특징] 문장과 그 키워드. section이 null이면 전체이고, 아니면 특징이 나온 단원으로 거른다.
export function listKeywordFeatures(
  keywords: Keyword[],
  section: string | null,
): { keyword: Keyword; feature: KeywordFeature }[] {
  return keywords.flatMap((keyword) => (keyword.features ?? [])
    .filter((feature) => section === null || feature.section === section)
    .map((feature) => ({ keyword, feature })))
}

// 특징 문장을 보고 키워드를 고른다. 특징 하나가 한 문항이다.
export function buildFeatureQuestions(
  keywords: Keyword[],
  count: number,
  rng: () => number,
  section: string | null = null,
): KeywordQuestion[] {
  const termOf = (k: Keyword) => termName(k.term)

  return shuffle(listKeywordFeatures(keywords, section), rng)
    .slice(0, count)
    .map(({ keyword, feature }) => {
      const options = shuffle(
        [keyword, ...pickDistractors(keyword, keywords, termOf, rng, feature.section)],
        rng,
      )
      return toQuestion(keyword, feature.text, options, termOf)
    })
}

// 요약 보고 키워드 고르기의 한 판. 고른 범위의 요약 문항과 특징 문항을 모두 섞어 낸다.
export function buildTermQuestions(
  keywords: Keyword[],
  rng: () => number,
  section: string | null = null,
): KeywordQuestion[] {
  const summaryQuestions = buildKeywordQuestions(
    keywords,
    'summary-to-term',
    selectKeywords(keywords, section).length,
    rng,
    section,
  )
  const featureQuestions = buildFeatureQuestions(
    keywords,
    listKeywordFeatures(keywords, section).length,
    rng,
    section,
  )
  return shuffle([...summaryQuestions, ...featureQuestions], rng)
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
