// @vitest-environment node

import { describe, expect, it } from 'vitest'
import type { Keyword, KeywordPairMode } from '../types/keywords'
import {
  KEYWORD_QUIZ_MODES,
  LOGO_TAP_COUNT,
  LOGO_TAP_WINDOW_MS,
  buildFlashcards,
  buildFeatureQuestions,
  buildKeywordQuestions,
  listKeywordFeatures,
  listKeywordSections,
  registerLogoTap,
  selectKeywords,
} from './keyword-quiz'

function lcg(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

function kw(id: string, section: string, summary = `${id} 요약`): Keyword {
  return { id, term: `${id} 용어`, summary, section, page: 1 }
}

// 단원 A 5개(a5는 a1과 요약이 공백만 다르다), B 2개, C 1개
const keywords: Keyword[] = [
  kw('a1', 'A', '가 나 다'),
  kw('a2', 'A'),
  kw('a3', 'A'),
  kw('a4', 'A'),
  kw('a5', 'A', '가나  다'),
  kw('b1', 'B'),
  kw('b2', 'B'),
  kw('c1', 'C'),
]

const byId = new Map(keywords.map((k) => [k.id, k]))
const modes: KeywordPairMode[] = ['summary-to-term', 'term-to-summary']

function field(mode: KeywordPairMode) {
  return mode === 'summary-to-term' ? ('term' as const) : ('summary' as const)
}

function choiceKeywords(mode: KeywordPairMode, choices: string[]) {
  const f = field(mode)
  return choices.map((c) => keywords.find((k) => k[f] === c)!)
}

describe('KEYWORD_QUIZ_MODES', () => {
  it('네 형식을 정한 순서로 둔다', () => {
    expect(KEYWORD_QUIZ_MODES).toEqual(['summary-to-term', 'term-to-summary', 'feature-to-term', 'flashcard'])
  })
})

describe('buildKeywordQuestions', () => {
  for (const mode of modes) {
    describe(mode, () => {
      it('count개를 중복 없이 내고 정답·문제문이 맞는 필드다', () => {
        const questions = buildKeywordQuestions(keywords, mode, 6, lcg(1))
        expect(questions).toHaveLength(6)
        expect(new Set(questions.map((q) => q.keywordId)).size).toBe(6)
        const f = field(mode)
        const other = f === 'term' ? 'summary' : 'term'
        for (const q of questions) {
          const answer = byId.get(q.keywordId)!
          expect(q.choices).toHaveLength(4)
          expect(q.choices[q.answerIndex]).toBe(answer[f])
          expect(q.prompt).toBe(answer[other])
          const normalized = q.choices.map((c) => c.replace(/\s/g, ''))
          expect(new Set(normalized).size).toBe(4)
        }
      })

      it('단원 A 정답이면 오답 셋이 모두 단원 A에서 나온다', () => {
        for (let seed = 0; seed < 30; seed += 1) {
          for (const q of buildKeywordQuestions(keywords, mode, keywords.length, lcg(seed))) {
            if (byId.get(q.keywordId)!.section !== 'A') continue
            const wrong = choiceKeywords(mode, q.choices).filter((_, i) => i !== q.answerIndex)
            expect(wrong.every((k) => k.section === 'A')).toBe(true)
          }
        }
      })

      it('단원 C(1개) 정답이면 다른 단원에서 오답을 채운다', () => {
        for (let seed = 0; seed < 30; seed += 1) {
          const q = buildKeywordQuestions(keywords, mode, keywords.length, lcg(seed)).find(
            (item) => item.keywordId === 'c1',
          )!
          const wrong = choiceKeywords(mode, q.choices).filter((_, i) => i !== q.answerIndex)
          expect(wrong).toHaveLength(3)
          expect(wrong.every((k) => k.section !== 'C')).toBe(true)
        }
      })

      it('요약이 정답과 같은 키워드는 오답에 나오지 않는다', () => {
        for (let seed = 0; seed < 50; seed += 1) {
          for (const q of buildKeywordQuestions(keywords, mode, keywords.length, lcg(seed))) {
            const ids = choiceKeywords(mode, q.choices).map((k) => k.id)
            if (q.keywordId === 'a1') expect(ids).not.toContain('a5')
            if (q.keywordId === 'a5') expect(ids).not.toContain('a1')
          }
        }
      })

      it('보기마다 그 보기가 가리키는 키워드 id를 같은 순서로 싣는다', () => {
        const f = field(mode)
        for (const q of buildKeywordQuestions(keywords, mode, keywords.length, lcg(7))) {
          expect(q.choiceKeywordIds).toHaveLength(4)
          expect(q.choiceKeywordIds[q.answerIndex]).toBe(q.keywordId)
          q.choiceKeywordIds.forEach((id, i) => {
            expect(byId.get(id)![f]).toBe(q.choices[i])
          })
        }
      })

      it('같은 시드면 결과가 같다', () => {
        expect(buildKeywordQuestions(keywords, mode, 5, lcg(42))).toEqual(
          buildKeywordQuestions(keywords, mode, 5, lcg(42)),
        )
      })
    })
  }
})

describe('단원별로 풀기', () => {
  it('listKeywordSections는 단원을 처음 나온 순서로, 키워드 수와 함께 낸다', () => {
    expect(listKeywordSections(keywords)).toEqual([
      { section: 'A', count: 5 },
      { section: 'B', count: 2 },
      { section: 'C', count: 1 },
    ])
  })

  it('selectKeywords는 단원이 null이면 전체를, 아니면 그 단원만 낸다', () => {
    expect(selectKeywords(keywords, null)).toEqual(keywords)
    expect(selectKeywords(keywords, 'B').map((k) => k.id)).toEqual(['b1', 'b2'])
  })

  for (const mode of modes) {
    it(`${mode}: 단원을 주면 정답은 그 단원에서만 나오고, 오답은 전체에서 채운다`, () => {
      for (let seed = 0; seed < 20; seed += 1) {
        const questions = buildKeywordQuestions(keywords, mode, 10, lcg(seed), 'C')
        expect(questions.map((q) => q.keywordId)).toEqual(['c1'])
        const wrong = questions[0].choiceKeywordIds.filter((_, i) => i !== questions[0].answerIndex)
        expect(wrong).toHaveLength(3)
        expect(wrong.every((id) => byId.get(id)!.section !== 'C')).toBe(true)
      }
      const inB = buildKeywordQuestions(keywords, mode, 10, lcg(3), 'B')
      expect(inB.map((q) => q.keywordId).sort()).toEqual(['b1', 'b2'])
    })
  }
})

// 부모 p와 그 하위 항목 p1·p2(단원 P), 형제가 아닌 q1·q2·q3(단원 P).
// 특징은 p에 둘(하나는 다른 단원 Q에 나온다), q1에 하나.
const family: Keyword[] = [
  { ...kw('p', 'P'), features: [
    { text: 'p 특징 1', section: 'P', page: 1 },
    { text: 'p 특징 2', section: 'Q', page: 2 },
  ] },
  { ...kw('p1', 'P'), parentId: 'p' },
  { ...kw('p2', 'P'), parentId: 'p' },
  { ...kw('q1', 'P'), features: [{ text: 'q1 특징', section: 'P', page: 3 }] },
  kw('q2', 'P'),
  kw('q3', 'P'),
  kw('r1', 'Q'),
  kw('r2', 'Q'),
  kw('r3', 'Q'),
]
const familyById = new Map(family.map((k) => [k.id, k]))

describe('부모와 하위 항목', () => {
  for (const mode of modes) {
    it(`${mode}: 부모와 그 하위 항목은 서로의 오답 보기로 나오지 않는다`, () => {
      for (let seed = 0; seed < 40; seed += 1) {
        for (const q of buildKeywordQuestions(family, mode, family.length, lcg(seed))) {
          const wrong = q.choiceKeywordIds.filter((_, i) => i !== q.answerIndex)
          if (q.keywordId === 'p') expect(wrong).not.toContain('p1')
          if (q.keywordId === 'p') expect(wrong).not.toContain('p2')
          if (q.keywordId === 'p1' || q.keywordId === 'p2') expect(wrong).not.toContain('p')
        }
      }
    })
  }
})

describe('특징 보고 키워드 고르기', () => {
  it('listKeywordFeatures는 특징이 나온 단원으로 거른다', () => {
    expect(listKeywordFeatures(family, null).map((f) => f.feature.text)).toEqual(['p 특징 1', 'p 특징 2', 'q1 특징'])
    expect(listKeywordFeatures(family, 'Q').map((f) => [f.keyword.id, f.feature.text])).toEqual([['p', 'p 특징 2']])
    expect(listKeywordFeatures(keywords, null)).toEqual([])
  })

  it('특징마다 한 문항이고, 문제문은 특징 문장, 정답은 그 키워드의 용어다', () => {
    const questions = buildFeatureQuestions(family, 10, lcg(1))
    expect(questions).toHaveLength(3)
    expect(questions.map((q) => q.prompt).sort()).toEqual(['p 특징 1', 'p 특징 2', 'q1 특징'])
    for (const q of questions) {
      const answer = familyById.get(q.keywordId)!
      expect(q.choices[q.answerIndex]).toBe(answer.term)
      expect(q.choiceKeywordIds[q.answerIndex]).toBe(answer.id)
      q.choiceKeywordIds.forEach((id, i) => expect(familyById.get(id)!.term).toBe(q.choices[i]))
      expect(new Set(q.choiceKeywordIds).size).toBe(4)
    }
  })

  it('오답은 특징이 나온 단원에서 먼저 뽑고, 정답의 하위 항목은 뺀다', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      for (const q of buildFeatureQuestions(family, 10, lcg(seed))) {
        const wrong = q.choiceKeywordIds.filter((_, i) => i !== q.answerIndex)
        if (q.prompt === 'p 특징 1') {
          expect(wrong.every((id) => familyById.get(id)!.section === 'P')).toBe(true)
          expect(wrong).not.toContain('p1')
          expect(wrong).not.toContain('p2')
        }
        if (q.prompt === 'p 특징 2') {
          expect(wrong.every((id) => familyById.get(id)!.section === 'Q')).toBe(true)
        }
      }
    }
  })

  it('단원을 주면 그 단원에 나온 특징만 낸다', () => {
    expect(buildFeatureQuestions(family, 10, lcg(2), 'Q').map((q) => q.prompt)).toEqual(['p 특징 2'])
    expect(buildFeatureQuestions(family, 10, lcg(2), 'R')).toEqual([])
  })

  it('같은 시드면 결과가 같다', () => {
    expect(buildFeatureQuestions(family, 10, lcg(9))).toEqual(buildFeatureQuestions(family, 10, lcg(9)))
  })
})

describe('buildFlashcards', () => {
  it('count개를 중복 없이 낸다', () => {
    const cards = buildFlashcards(keywords, 5, lcg(3))
    expect(cards).toHaveLength(5)
    expect(new Set(cards.map((c) => c.id)).size).toBe(5)
  })
})

describe('registerLogoTap', () => {
  it('창 안에서 다섯 번째 탭에 열리고 기록을 비운다', () => {
    let taps: number[] = []
    const results: boolean[] = []
    for (let i = 0; i < LOGO_TAP_COUNT; i += 1) {
      const r = registerLogoTap(taps, 1000 + i * 300)
      taps = r.taps
      results.push(r.unlocked)
    }
    expect(results).toEqual([false, false, false, false, true])
    expect(taps).toEqual([])
  })

  it('네 번이면 열리지 않는다', () => {
    const r = registerLogoTap([0, 100, 200], 300)
    expect(r).toEqual({ taps: [0, 100, 200, 300], unlocked: false })
  })

  it('창 밖의 탭은 버린다', () => {
    const r = registerLogoTap([0, 100, 200, 300], 300 + LOGO_TAP_WINDOW_MS)
    expect(r.unlocked).toBe(false)
    expect(r.taps).toEqual([300 + LOGO_TAP_WINDOW_MS])
    expect(registerLogoTap([0, 100, 200, 300], 100 + LOGO_TAP_WINDOW_MS).taps).toEqual([
      200,
      300,
      100 + LOGO_TAP_WINDOW_MS,
    ])
  })

  it('입력 배열을 바꾸지 않는다', () => {
    const taps = Object.freeze([0, 100, 200, 300]) as readonly number[]
    registerLogoTap(taps, 400)
    expect(taps).toEqual([0, 100, 200, 300])
  })
})
