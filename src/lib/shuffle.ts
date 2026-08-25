import type { Question } from '../types/content'

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items]

  for (let i = result.length - 1; i >= 1; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function shuffleChoices(question: Question, rng: () => number): Question {
  const order = shuffle([0, 1, 2, 3], rng)
  const choices = [
    question.choices[order[0]],
    question.choices[order[1]],
    question.choices[order[2]],
    question.choices[order[3]],
  ] as [string, string, string, string]
  const answerIndex = order.indexOf(question.answerIndex) as 0 | 1 | 2 | 3

  return { ...question, choices, answerIndex }
}

export function shuffleQuestions(
  questions: Question[],
  rng: () => number,
): Question[] {
  return shuffle(questions, rng).map((question) => shuffleChoices(question, rng))
}
