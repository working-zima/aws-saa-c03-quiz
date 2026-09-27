// @vitest-environment node

import { describe, expect, it } from 'vitest'
import type { Keyword, KeywordChoiceMode } from '../types/keywords'
import {
  KEYWORD_QUIZ_MODES,
  LOGO_TAP_COUNT,
  LOGO_TAP_WINDOW_MS,
  buildFlashcards,
  buildKeywordQuestions,
  registerLogoTap,
  resolveKeywordCount,
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
const modes: KeywordChoiceMode[] = ['summary-to-term', 'term-to-summary']

function field(mode: KeywordChoiceMode) {
  return mode === 'summary-to-term' ? ('term' as const) : ('summary' as const)
}

function choiceKeywords(mode: KeywordChoiceMode, choices: string[]) {
  const f = field(mode)
  return choices.map((c) => keywords.find((k) => k[f] === c)!)
}

describe('KEYWORD_QUIZ_MODES', () => {
  it('세 형식을 정한 순서로 둔다', () => {
    expect(KEYWORD_QUIZ_MODES).toEqual(['summary-to-term', 'term-to-summary', 'flashcard'])
  })
})

describe('resolveKeywordCount', () => {
  it('숫자는 전체를 넘지 않고, all은 전체다', () => {
    expect(resolveKeywordCount(10, 107)).toBe(10)
    expect(resolveKeywordCount(20, 107)).toBe(20)
    expect(resolveKeywordCount('all', 107)).toBe(107)
    expect(resolveKeywordCount(20, 8)).toBe(8)
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
